export type GameId = "snake" | "game2048" | "minesweeper" | "memory" | "breakout";
export type AppId = "browser" | "terminal" | "calculator" | "files" | "editor" | "settings" | "monitor" | GameId;

export type AppMeta = {
  id: AppId;
  name: string;
  command: string;
  size: [number, number];
  minSize: [number, number];
  keywords: string[];
  game?: boolean;
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
  snake: {
    id: "snake",
    name: "Snake",
    command: "snake",
    size: [480, 700],
    minSize: [340, 520],
    keywords: ["snake", "game", "arcade", "play"],
    game: true,
  },
  game2048: {
    id: "game2048",
    name: "2048",
    command: "2048",
    size: [480, 660],
    minSize: [340, 500],
    keywords: ["2048", "tiles", "puzzle", "game", "play"],
    game: true,
  },
  minesweeper: {
    id: "minesweeper",
    name: "Minesweeper",
    command: "minesweeper",
    size: [480, 720],
    minSize: [340, 540],
    keywords: ["minesweeper", "mines", "game", "puzzle", "play"],
    game: true,
  },
  memory: {
    id: "memory",
    name: "Memory",
    command: "memory",
    size: [480, 680],
    minSize: [340, 520],
    keywords: ["memory", "cards", "match", "pairs", "game", "play"],
    game: true,
  },
  breakout: {
    id: "breakout",
    name: "Breakout",
    command: "breakout",
    size: [480, 660],
    minSize: [340, 500],
    keywords: ["breakout", "bricks", "arcade", "game", "play"],
    game: true,
  },
};

export const gameApps: GameId[] = ["snake", "game2048", "minesweeper", "memory", "breakout"];

export const dockApps: AppId[] = ["browser", "files", "terminal", "editor", "calculator", "monitor", "settings"];
