export type AppId = "browser" | "terminal" | "calculator" | "files" | "editor" | "settings" | "monitor";

export type AppMeta = {
  id: AppId;
  name: string;
  command: string;
  size: [number, number];
  minSize: [number, number];
  keywords: string[];
};

export const apps: Record<AppId, AppMeta> = {
  browser: {
    id: "browser",
    name: "Web Browser",
    command: "browser",
    size: [1180, 760],
    minSize: [420, 300],
    keywords: ["web", "browser", "internet", "firefox", "html"],
  },
  files: {
    id: "files",
    name: "Files",
    command: "files",
    size: [880, 560],
    minSize: [420, 300],
    keywords: ["files", "folder", "nautilus", "explorer"],
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    command: "terminal",
    size: [780, 480],
    minSize: [360, 220],
    keywords: ["terminal", "shell", "console", "command", "bash"],
  },
  editor: {
    id: "editor",
    name: "Text Editor",
    command: "gedit",
    size: [760, 540],
    minSize: [360, 240],
    keywords: ["text", "editor", "notes", "gedit", "nano"],
  },
  calculator: {
    id: "calculator",
    name: "Calculator",
    command: "gnome-calculator",
    size: [360, 560],
    minSize: [300, 460],
    keywords: ["calculator", "math", "calc"],
  },
  monitor: {
    id: "monitor",
    name: "System Monitor",
    command: "gnome-system-monitor",
    size: [780, 520],
    minSize: [420, 300],
    keywords: ["system", "monitor", "process", "task", "top"],
  },
  settings: {
    id: "settings",
    name: "Settings",
    command: "gnome-control-center",
    size: [860, 580],
    minSize: [420, 320],
    keywords: ["settings", "wallpaper", "background", "display", "about"],
  },
};

export const dockApps: AppId[] = ["browser", "files", "terminal", "editor", "calculator", "monitor", "settings"];
