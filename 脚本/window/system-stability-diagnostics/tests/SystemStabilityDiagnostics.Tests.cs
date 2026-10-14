using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SystemStabilityDiagnostics.Core;

internal static class SystemStabilityDiagnosticsTests
{
    private static int failures;

    private static void Assert(bool condition, string message)
    {
        if (condition)
        {
            return;
        }

        failures++;
        Console.WriteLine("FAIL " + message);
    }

    public static int Main()
    {
        string root = Path.Combine(Path.GetTempPath(), "system-stability-diagnostics-tests-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(root);
        try
        {
            DateTime timestamp = DateTime.UtcNow;
            var store = new DiagnosticLogStore(root);
            store.AppendMarker(timestamp, "mouse-stutter", "鼠标停顿：窗口 \"VS Code\"\r\n恢复");
            store.AppendSample(new ResourceSnapshot(
                timestamp.AddSeconds(5),
                42.5,
                32768,
                8192,
                new List<ProcessResourceSnapshot>
                {
                    new ProcessResourceSnapshot("explorer", 100, 4.2, 512, 480, 1200, 80)
                }));

            var reopenedStore = new DiagnosticLogStore(root);
            IList<string> records = reopenedStore.ReadRecentRecords(10);
            Assert(records.Count == 2, "markers and samples persist across store instances");
            Assert(records.Any(line => line.Contains("mouse-stutter") && line.Contains("VS Code")),
                "stall marker retains its category and user note");
            Assert(records.Any(line => line.Contains("42.5") && line.Contains("explorer")),
                "resource sample retains CPU and process details");
            Assert(records.Any(line => line.Contains("\"cpuPercent\":4.2")),
                "per-process CPU usage is included in the persisted sample");

            ResourceSnapshot live = new WindowsResourceCollector().Capture();
            System.Threading.Thread.Sleep(100);
            live = new WindowsResourceCollector().Capture();
            Assert(live.TotalMemoryMb > 0, "collector reads installed physical memory");
            Assert(live.AvailableMemoryMb >= 0 && live.AvailableMemoryMb <= live.TotalMemoryMb,
                "collector reports available memory within physical memory bounds");
            Assert(live.CpuPercent >= 0 && live.CpuPercent <= 100,
                "collector reports a bounded overall CPU percentage");
            Assert(live.Processes.Count > 0, "collector captures process resource information");
            Assert(live.Processes.All(process => process.CpuPercent >= 0 && process.CpuPercent <= 100),
                "collector reports bounded per-process CPU percentages");

            var rankedCandidates = new List<ProcessResourceSnapshot>();
            for (int index = 0; index < 12; index++)
            {
                rankedCandidates.Add(new ProcessResourceSnapshot("memory-heavy-" + index, index + 1,
                    1, 6000 - (index * 100), 5000, 20, 10));
            }
            rankedCandidates.Add(new ProcessResourceSnapshot("cpu-heavy", 999, 95, 128, 120, 20, 10));
            IList<ProcessResourceSnapshot> ranked = WindowsResourceCollector.SelectTopProcesses(rankedCandidates, 16000, 12);
            Assert(ranked.Count == 12, "process ranking respects the display limit");
            Assert(ranked[0].Name == "cpu-heavy", "high CPU process ranks ahead of lower combined resource usage");
            Assert(ranked.Any(process => process.Name.StartsWith("memory-heavy-", StringComparison.Ordinal)),
                "high memory processes remain visible alongside CPU-heavy processes");

            IList<WindowsEventSummary> recentEvents = WindowsEventLogReader.ReadRecent(14, 10);
            Assert(recentEvents.Count <= 20, "event reader respects the per-log result limit");
            Assert(recentEvents.SequenceEqual(recentEvents.OrderByDescending(item => item.TimestampUtc)),
                "event reader returns the newest system or application events first");

            string runtimeLogDirectory = DiagnosticPaths.GetLogDirectory(
                @"C:\Users\user\.lm-exe\system-stability-diagnostics\app\SystemStabilityDiagnostics.exe");
            Assert(runtimeLogDirectory.Equals(
                    @"C:\Users\user\.lm-exe\system-stability-diagnostics\logs",
                    StringComparison.OrdinalIgnoreCase),
                "deployed diagnostics data is stored beside app under the runtime logs directory");

            Console.WriteLine(failures == 0
                ? "PASS SystemStabilityDiagnostics.Tests"
                : "FAILED SystemStabilityDiagnostics.Tests: " + failures);
            return failures;
        }
        finally
        {
            try
            {
                Directory.Delete(root, true);
            }
            catch (IOException)
            {
            }
            catch (UnauthorizedAccessException)
            {
            }
        }
    }
}
