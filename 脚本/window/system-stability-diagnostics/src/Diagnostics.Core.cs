using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Web.Script.Serialization;

namespace SystemStabilityDiagnostics.Core
{
    public sealed class ProcessResourceSnapshot
    {
        public ProcessResourceSnapshot(string name, int processId, double cpuPercent, long privateMemoryMb,
            long workingSetMb, int handleCount, int threadCount)
        {
            Name = name ?? string.Empty;
            ProcessId = processId;
            CpuPercent = Math.Max(0, Math.Min(100, cpuPercent));
            PrivateMemoryMb = privateMemoryMb;
            WorkingSetMb = workingSetMb;
            HandleCount = handleCount;
            ThreadCount = threadCount;
        }

        public string Name { get; private set; }
        public int ProcessId { get; private set; }
        public double CpuPercent { get; private set; }
        public long PrivateMemoryMb { get; private set; }
        public long WorkingSetMb { get; private set; }
        public int HandleCount { get; private set; }
        public int ThreadCount { get; private set; }
    }

    public sealed class ResourceSnapshot
    {
        public ResourceSnapshot(DateTime timestampUtc, double cpuPercent, long totalMemoryMb,
            long availableMemoryMb, IList<ProcessResourceSnapshot> processes)
        {
            TimestampUtc = timestampUtc.ToUniversalTime();
            CpuPercent = Math.Max(0, Math.Min(100, cpuPercent));
            TotalMemoryMb = Math.Max(0, totalMemoryMb);
            AvailableMemoryMb = Math.Max(0, Math.Min(TotalMemoryMb, availableMemoryMb));
            Processes = processes ?? new List<ProcessResourceSnapshot>();
        }

        public DateTime TimestampUtc { get; private set; }
        public double CpuPercent { get; private set; }
        public long TotalMemoryMb { get; private set; }
        public long AvailableMemoryMb { get; private set; }
        public IList<ProcessResourceSnapshot> Processes { get; private set; }
    }

    public sealed class DiagnosticHistoryEntry
    {
        public DiagnosticHistoryEntry(DateTime timestampUtc, string type, string summary)
        {
            TimestampLocal = timestampUtc.ToLocalTime();
            Type = type ?? string.Empty;
            Summary = summary ?? string.Empty;
        }

        public DateTime TimestampLocal { get; private set; }
        public string Type { get; private set; }
        public string Summary { get; private set; }
    }

    public sealed class DiagnosticLogStore
    {
        private readonly string logDirectory;
        private readonly JavaScriptSerializer serializer = new JavaScriptSerializer();
        private readonly object syncRoot = new object();

        public DiagnosticLogStore(string logDirectory)
        {
            if (string.IsNullOrWhiteSpace(logDirectory))
            {
                throw new ArgumentException("日志目录不能为空。", "logDirectory");
            }
            this.logDirectory = Path.GetFullPath(logDirectory);
        }

        public string LogDirectory { get { return logDirectory; } }

        public string GetLogFilePath(DateTime timestampUtc)
        {
            return Path.Combine(logDirectory, "system-stability-" +
                timestampUtc.ToUniversalTime().ToString("yyyyMMdd", CultureInfo.InvariantCulture) + ".jsonl");
        }

        public void AppendMarker(DateTime timestampUtc, string category, string note)
        {
            var record = new Dictionary<string, object>();
            record["type"] = "marker";
            record["timestampUtc"] = timestampUtc.ToUniversalTime().ToString("o", CultureInfo.InvariantCulture);
            record["category"] = category ?? string.Empty;
            record["note"] = note ?? string.Empty;
            Append(timestampUtc, record);
        }

        public void AppendSample(ResourceSnapshot snapshot)
        {
            if (snapshot == null)
            {
                throw new ArgumentNullException("snapshot");
            }

            var processes = new List<Dictionary<string, object>>();
            foreach (ProcessResourceSnapshot process in snapshot.Processes)
            {
                processes.Add(new Dictionary<string, object>
                {
                    { "name", process.Name },
                    { "processId", process.ProcessId },
                    { "cpuPercent", Math.Round(process.CpuPercent, 1) },
                    { "privateMemoryMb", process.PrivateMemoryMb },
                    { "workingSetMb", process.WorkingSetMb },
                    { "handleCount", process.HandleCount },
                    { "threadCount", process.ThreadCount }
                });
            }

            var record = new Dictionary<string, object>();
            record["type"] = "sample";
            record["timestampUtc"] = snapshot.TimestampUtc.ToString("o", CultureInfo.InvariantCulture);
            record["cpuPercent"] = Math.Round(snapshot.CpuPercent, 1);
            record["totalMemoryMb"] = snapshot.TotalMemoryMb;
            record["availableMemoryMb"] = snapshot.AvailableMemoryMb;
            record["processes"] = processes;
            Append(snapshot.TimestampUtc, record);
        }

        public IList<string> ReadRecentRecords(int maximumCount)
        {
            var lines = new List<string>();
            if (maximumCount <= 0 || !Directory.Exists(logDirectory))
            {
                return lines;
            }

            string[] files;
            try { files = Directory.GetFiles(logDirectory, "system-stability-*.jsonl"); }
            catch (IOException) { return lines; }
            catch (UnauthorizedAccessException) { return lines; }
            Array.Sort(files, StringComparer.OrdinalIgnoreCase);
            for (int fileIndex = files.Length - 1; fileIndex >= 0 && lines.Count < maximumCount; fileIndex--)
            {
                string[] fileLines;
                try { fileLines = File.ReadAllLines(files[fileIndex], Encoding.UTF8); }
                catch (IOException) { continue; }
                catch (UnauthorizedAccessException) { continue; }
                for (int lineIndex = fileLines.Length - 1; lineIndex >= 0 && lines.Count < maximumCount; lineIndex--)
                {
                    if (!string.IsNullOrWhiteSpace(fileLines[lineIndex]))
                    {
                        lines.Add(fileLines[lineIndex]);
                    }
                }
            }

            lines.Reverse();
            return lines;
        }

        public IList<DiagnosticHistoryEntry> ReadRecentEntries(int maximumCount)
        {
            var entries = new List<DiagnosticHistoryEntry>();
            foreach (string line in ReadRecentRecords(maximumCount))
            {
                try
                {
                    var record = serializer.DeserializeObject(line) as Dictionary<string, object>;
                    if (record == null) { continue; }
                    string type = GetString(record, "type");
                    DateTime timestamp;
                    if (!DateTime.TryParse(GetString(record, "timestampUtc"), CultureInfo.InvariantCulture,
                        DateTimeStyles.RoundtripKind, out timestamp))
                    {
                        timestamp = DateTime.MinValue;
                    }

                    string summary;
                    if (type == "marker")
                    {
                        summary = "卡顿标记 · " + GetString(record, "category");
                        string note = GetString(record, "note");
                        if (note.Length > 0) { summary += " · " + note; }
                    }
                    else
                    {
                        summary = "资源快照 · CPU " + GetString(record, "cpuPercent") + "% · 可用内存 " +
                            GetString(record, "availableMemoryMb") + " MB";
                    }
                    entries.Add(new DiagnosticHistoryEntry(timestamp, type, summary));
                }
                catch (ArgumentException) { }
                catch (InvalidOperationException) { }
            }
            return entries;
        }

        private void Append(DateTime timestampUtc, IDictionary<string, object> record)
        {
            string filePath = GetLogFilePath(timestampUtc);
            string line = serializer.Serialize(record) + Environment.NewLine;
            lock (syncRoot)
            {
                Directory.CreateDirectory(logDirectory);
                File.AppendAllText(filePath, line, new UTF8Encoding(false));
            }
        }

        private static string GetString(IDictionary<string, object> values, string key)
        {
            object value;
            if (!values.TryGetValue(key, out value) || value == null) { return string.Empty; }
            return Convert.ToString(value, CultureInfo.InvariantCulture);
        }
    }

    public sealed class WindowsResourceCollector
    {
        private Dictionary<int, TimeSpan> previousProcessTimes = new Dictionary<int, TimeSpan>();
        private DateTime previousProcessSampleUtc;
        private ulong previousIdle;
        private ulong previousKernel;
        private ulong previousUser;
        private bool hasCpuBaseline;

        public ResourceSnapshot Capture()
        {
            DateTime timestampUtc = DateTime.UtcNow;
            double cpuPercent = ReadCpuPercent();
            long totalMemoryMb;
            long availableMemoryMb;
            ReadMemory(out totalMemoryMb, out availableMemoryMb);
            double elapsedMilliseconds = previousProcessSampleUtc == DateTime.MinValue
                ? 0
                : (timestampUtc - previousProcessSampleUtc).TotalMilliseconds;
            var currentProcessTimes = new Dictionary<int, TimeSpan>();
            var processes = new List<ProcessResourceSnapshot>();
            foreach (Process process in Process.GetProcesses())
            {
                ProcessResourceSnapshot sample = ReadProcess(process, elapsedMilliseconds, currentProcessTimes);
                if (sample != null) { processes.Add(sample); }
            }
            previousProcessTimes = currentProcessTimes;
            previousProcessSampleUtc = timestampUtc;
            IList<ProcessResourceSnapshot> topProcesses = SelectTopProcesses(processes, totalMemoryMb, 12);
            return new ResourceSnapshot(timestampUtc, cpuPercent, totalMemoryMb, availableMemoryMb, topProcesses);
        }

        public static IList<ProcessResourceSnapshot> SelectTopProcesses(
            IEnumerable<ProcessResourceSnapshot> candidates, long totalMemoryMb, int maximumCount)
        {
            if (candidates == null || maximumCount <= 0)
            {
                return new List<ProcessResourceSnapshot>();
            }

            return candidates
                .Where(process => process != null)
                .OrderByDescending(process => Math.Max(process.CpuPercent,
                    totalMemoryMb > 0 ? Math.Max(0, process.PrivateMemoryMb) * 100.0 / totalMemoryMb : 0))
                .ThenByDescending(process => process.CpuPercent)
                .ThenByDescending(process => process.PrivateMemoryMb)
                .Take(maximumCount)
                .ToList();
        }

        private double ReadCpuPercent()
        {
            FileTime idle;
            FileTime kernel;
            FileTime user;
            if (!NativeMethods.GetSystemTimes(out idle, out kernel, out user)) { return 0; }
            ulong currentIdle = idle.ToUInt64();
            ulong currentKernel = kernel.ToUInt64();
            ulong currentUser = user.ToUInt64();
            double result = 0;
            if (hasCpuBaseline)
            {
                ulong idleDelta = currentIdle - previousIdle;
                ulong totalDelta = (currentKernel - previousKernel) + (currentUser - previousUser);
                if (totalDelta > 0 && idleDelta <= totalDelta)
                {
                    result = (double)(totalDelta - idleDelta) * 100.0 / totalDelta;
                }
            }
            previousIdle = currentIdle;
            previousKernel = currentKernel;
            previousUser = currentUser;
            hasCpuBaseline = true;
            return Math.Round(result, 1);
        }

        private static void ReadMemory(out long totalMemoryMb, out long availableMemoryMb)
        {
            var status = new MemoryStatusEx();
            status.Length = (uint)Marshal.SizeOf(typeof(MemoryStatusEx));
            if (!NativeMethods.GlobalMemoryStatusEx(ref status))
            {
                totalMemoryMb = 0;
                availableMemoryMb = 0;
                return;
            }
            totalMemoryMb = (long)(status.TotalPhysical / (1024UL * 1024UL));
            availableMemoryMb = (long)(status.AvailablePhysical / (1024UL * 1024UL));
        }

        private ProcessResourceSnapshot ReadProcess(Process process, double elapsedMilliseconds,
            IDictionary<int, TimeSpan> currentProcessTimes)
        {
            try
            {
                string name = process.ProcessName;
                int processId = process.Id;
                TimeSpan totalProcessorTime = process.TotalProcessorTime;
                currentProcessTimes[processId] = totalProcessorTime;
                double processCpuPercent = 0;
                TimeSpan previousProcessorTime;
                if (elapsedMilliseconds > 0 && previousProcessTimes.TryGetValue(processId, out previousProcessorTime))
                {
                    double processorCount = Math.Max(1, Environment.ProcessorCount);
                    processCpuPercent = Math.Max(0, (totalProcessorTime - previousProcessorTime).TotalMilliseconds * 100.0 /
                        (elapsedMilliseconds * processorCount));
                }
                long privateMemoryMb = process.PrivateMemorySize64 / (1024L * 1024L);
                long workingSetMb = process.WorkingSet64 / (1024L * 1024L);
                int handles;
                int threads;
                try { handles = process.HandleCount; } catch (Exception) { handles = -1; }
                try { threads = process.Threads.Count; } catch (Exception) { threads = -1; }
                return new ProcessResourceSnapshot(name, processId, processCpuPercent, privateMemoryMb, workingSetMb, handles, threads);
            }
            catch (Exception) { return null; }
            finally { process.Dispose(); }
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct FileTime
        {
            public uint LowDateTime;
            public uint HighDateTime;
            public ulong ToUInt64() { return ((ulong)HighDateTime << 32) | LowDateTime; }
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct MemoryStatusEx
        {
            public uint Length;
            public uint MemoryLoad;
            public ulong TotalPhysical;
            public ulong AvailablePhysical;
            public ulong TotalPageFile;
            public ulong AvailablePageFile;
            public ulong TotalVirtual;
            public ulong AvailableVirtual;
            public ulong AvailableExtendedVirtual;
        }

        private static class NativeMethods
        {
            [DllImport("kernel32.dll", SetLastError = true)]
            public static extern bool GetSystemTimes(out FileTime idleTime, out FileTime kernelTime, out FileTime userTime);

            [DllImport("kernel32.dll", SetLastError = true)]
            public static extern bool GlobalMemoryStatusEx(ref MemoryStatusEx buffer);
        }
    }

    public sealed class WindowsEventSummary
    {
        public WindowsEventSummary(DateTime timestampUtc, string logName, string source, long eventId, string level, string message)
        {
            TimestampUtc = timestampUtc;
            TimestampLocal = timestampUtc.ToLocalTime();
            LogName = logName ?? string.Empty;
            Source = source ?? string.Empty;
            EventId = eventId;
            Level = level ?? string.Empty;
            Message = message ?? string.Empty;
        }

        public DateTime TimestampUtc { get; private set; }
        public DateTime TimestampLocal { get; private set; }
        public string LogName { get; private set; }
        public string Source { get; private set; }
        public long EventId { get; private set; }
        public string Level { get; private set; }
        public string Message { get; private set; }
    }

    public static class WindowsEventLogReader
    {
        public static IList<WindowsEventSummary> ReadRecent(int days, int maximumPerLog)
        {
            var results = new List<WindowsEventSummary>();
            DateTime cutoff = DateTime.Now.AddDays(-Math.Max(1, days));
            ReadLog("Application", cutoff, maximumPerLog, results);
            ReadLog("System", cutoff, maximumPerLog, results);
            results.Sort(delegate(WindowsEventSummary left, WindowsEventSummary right)
            {
                return right.TimestampUtc.CompareTo(left.TimestampUtc);
            });
            return results;
        }

        private static void ReadLog(string logName, DateTime cutoff, int maximumCount, IList<WindowsEventSummary> results)
        {
            if (maximumCount <= 0) { return; }
            try
            {
                using (var log = new EventLog(logName))
                {
                    EventLogEntryCollection entries = log.Entries;
                    int inspected = 0;
                    for (int index = entries.Count - 1; index >= 0 && inspected < 5000; index--, inspected++)
                    {
                        EventLogEntry entry;
                        try { entry = entries[index]; } catch (Exception) { continue; }
                        if (entry.TimeGenerated < cutoff) { break; }
                        if (entry.EntryType != EventLogEntryType.Error && entry.EntryType != EventLogEntryType.Warning) { continue; }
                        if (results.Count(delegate(WindowsEventSummary item) { return item.LogName == logName; }) >= maximumCount) { break; }
                        string message;
                        try { message = entry.Message; } catch (Exception) { message = "无法读取事件详细信息。"; }
                        if (message.Length > 1800) { message = message.Substring(0, 1800) + "…"; }
                        int eventId = unchecked((int)(entry.InstanceId & 0xFFFF));
                        results.Add(new WindowsEventSummary(entry.TimeGenerated.ToUniversalTime(), logName,
                            entry.Source, eventId, entry.EntryType == EventLogEntryType.Error ? "错误" : "警告", message));
                    }
                }
            }
            catch (Exception)
            {
                // A missing log or access restriction should not prevent reading the other log.
            }
        }
    }

    public static class DiagnosticPaths
    {
        public static string GetLogDirectory(string executablePath)
        {
            string executableDirectory = Path.GetDirectoryName(Path.GetFullPath(executablePath));
            var directory = new DirectoryInfo(executableDirectory);
            string artifactDirectory = string.Equals(directory.Name, "app", StringComparison.OrdinalIgnoreCase) && directory.Parent != null
                ? directory.Parent.FullName
                : directory.FullName;
            return Path.Combine(artifactDirectory, "logs");
        }
    }
}
