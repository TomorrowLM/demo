using System;
using System.Collections;
using System.IO;
using System.Linq;
using System.Reflection;

internal static class ToolHubCoreTests
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

    public static int Main(string[] args)
    {
        string assemblyPath = args.Length > 0 ? args[0] : string.Empty;
        if (!File.Exists(assemblyPath))
        {
            Assert(false, "ToolHub core library is built");
            return failures;
        }

        Assembly assembly = Assembly.LoadFrom(assemblyPath);
        Type catalogType = assembly.GetType("ToolHub.Core.ToolHubCatalog");
        Type toolType = assembly.GetType("ToolHub.Core.ToolHubTool");
        Type resolverType = assembly.GetType("ToolHub.Core.ToolHubPathResolver");
        Type launcherType = assembly.GetType("ToolHub.Core.ToolHubLauncher");

        Assert(catalogType != null, "catalog type exists");
        Assert(toolType != null, "tool type exists");
        Assert(resolverType != null, "path resolver exists");
        Assert(launcherType != null, "launcher exists");

        if (resolverType != null)
        {
            string applicationDirectory = Path.GetDirectoryName(Path.GetFullPath(assemblyPath));
            string resolvedRoot = (string)resolverType.GetMethod("FindWindowRoot").Invoke(null, new object[] { applicationDirectory });
            Assert(Directory.Exists(Path.Combine(resolvedRoot, "workspace-switcher")),
                "path resolver finds the existing window tools directory");

            if (catalogType != null && toolType != null)
            {
                IList actualTools = (IList)catalogType.GetMethod("GetTools").Invoke(null, new object[] { resolvedRoot });
                object actualWorkspace = actualTools[0];
                bool workspaceAvailable = (bool)toolType.GetProperty("IsAvailable").GetValue(actualWorkspace, null);
                string actualWorkspacePath = (string)toolType.GetProperty("EntryPath").GetValue(actualWorkspace, null);
                Assert(workspaceAvailable, "workspace tool resolves to an available executable");
                Assert(actualWorkspacePath.IndexOf("WorkspaceSwitcher.exe", StringComparison.OrdinalIgnoreCase) >= 0,
                    "workspace tool resolves an executable from an available build directory");
            }

            string configuredWindowRoot = Path.Combine(Path.GetTempPath(), "tool-hub-config-window");
            string configuredAppDirectory = Path.Combine(Path.GetTempPath(), "tool-hub-config-app", "app");
            Directory.CreateDirectory(Path.Combine(configuredWindowRoot, "workspace-switcher"));
            Directory.CreateDirectory(Path.Combine(configuredWindowRoot, "Wallpaper-GUI"));
            Directory.CreateDirectory(Path.Combine(configuredWindowRoot, "desktop-black-screen-repair"));
            Directory.CreateDirectory(Path.Combine(configuredAppDirectory, "..", "config"));
            File.WriteAllText(
                Path.Combine(configuredAppDirectory, "..", "config", "window-root.txt"),
                configuredWindowRoot);
            string configuredResolvedRoot = (string)resolverType.GetMethod("FindWindowRoot").Invoke(
                null, new object[] { configuredAppDirectory });
            Assert(string.Equals(
                    Path.GetFullPath(configuredResolvedRoot).TrimEnd(Path.DirectorySeparatorChar),
                    Path.GetFullPath(configuredWindowRoot).TrimEnd(Path.DirectorySeparatorChar),
                    StringComparison.OrdinalIgnoreCase),
                "path resolver prefers the deployed window-root configuration");
        }

        if (catalogType != null && toolType != null)
        {
            string fakeWindowRoot = Path.Combine(Path.GetTempPath(), "tool-hub-window");
            object tools = catalogType.GetMethod("GetTools").Invoke(null, new object[] { fakeWindowRoot });
            IList toolList = (IList)tools;
            Assert(toolList.Count == 3, "catalog contains the three window tools");

            string[] expectedIds = { "workspace", "wallpaper", "desktop-repair" };
            for (int i = 0; i < expectedIds.Length && i < toolList.Count; i++)
            {
                object tool = toolList[i];
                string id = (string)toolType.GetProperty("Id").GetValue(tool, null);
                string entryPath = (string)toolType.GetProperty("EntryPath").GetValue(tool, null);
                Assert(id == expectedIds[i], "catalog order keeps " + expectedIds[i]);
                Assert(entryPath.IndexOf(fakeWindowRoot, StringComparison.OrdinalIgnoreCase) == 0,
                    id + " entry is rooted under the discovered window directory");
            }

            string deployedRoot = Path.Combine(Path.GetTempPath(), "tool-hub-deployed-root");
            string deployedWorkspaceApp = Path.Combine(deployedRoot, "workspace-switcher", "app");
            string deployedWallpaperApp = Path.Combine(deployedRoot, "Wallpaper-GUI", "app");
            string deployedRepairApp = Path.Combine(deployedRoot, "desktop-black-screen-repair", "app");
            Directory.CreateDirectory(deployedWorkspaceApp);
            Directory.CreateDirectory(deployedWallpaperApp);
            Directory.CreateDirectory(deployedRepairApp);
            File.WriteAllBytes(Path.Combine(deployedWorkspaceApp, "WorkspaceSwitcher.exe"), new byte[] { 1 });
            File.WriteAllText(Path.Combine(deployedWallpaperApp, "Wallpaper-GUI.cmd"), "@echo off");
            File.WriteAllText(Path.Combine(deployedRepairApp, "Repair-DesktopBlackScreen.cmd"), "@echo off");

            IList deployedTools = (IList)catalogType.GetMethod("GetTools").Invoke(null, new object[] { deployedRoot });
            Assert(((string)toolType.GetProperty("EntryPath").GetValue(deployedTools[0], null))
                    .Equals(Path.Combine(deployedWorkspaceApp, "WorkspaceSwitcher.exe"), StringComparison.OrdinalIgnoreCase),
                "workspace tool prefers the deployed app directory");
            Assert(((string)toolType.GetProperty("EntryPath").GetValue(deployedTools[1], null))
                    .Equals(Path.Combine(deployedWallpaperApp, "Wallpaper-GUI.cmd"), StringComparison.OrdinalIgnoreCase),
                "wallpaper tool prefers the deployed app directory");
            Assert(((string)toolType.GetProperty("EntryPath").GetValue(deployedTools[2], null))
                    .Equals(Path.Combine(deployedRepairApp, "Repair-DesktopBlackScreen.cmd"), StringComparison.OrdinalIgnoreCase),
                "desktop repair tool prefers the deployed app directory");

            var filterMethod = catalogType.GetMethod("Filter");
            IList filtered = (IList)filterMethod.Invoke(null, new object[] { tools, "壁纸" });
            Assert(filtered.Count == 1, "search filters by display text");

            object workspace = toolList[0];
            string workspaceArguments = (string)toolType.GetProperty("Arguments").GetValue(workspace, null);
            Assert(workspaceArguments == "--show", "workspace entry keeps its standalone show argument");

            if (launcherType != null)
            {
                object wallpaper = toolList[1];
                object request = launcherType.GetMethod("CreateRequest").Invoke(null, new object[] { wallpaper, "cmd.exe" });
                Type requestType = request.GetType();
                string launchFileName = (string)requestType.GetProperty("FileName").GetValue(request, null);
                string launchArguments = (string)requestType.GetProperty("Arguments").GetValue(request, null);
                Assert(launchFileName == "cmd.exe", "command-file tools use the Windows command shell");
                Assert(launchArguments.IndexOf("/c call", StringComparison.OrdinalIgnoreCase) >= 0,
                    "command-file tools are invoked through call");
            }
        }

        Console.WriteLine(failures == 0 ? "PASS ToolHub.Core.Tests" : "FAILED ToolHub.Core.Tests: " + failures);
        return failures;
    }
}
