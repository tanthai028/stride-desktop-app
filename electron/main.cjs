const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  screen,
  shell,
} = require("electron");
const { readAppSettings, writeAppSettings } = require("./settingsStore.cjs");
const {
  readLibraryItems,
  createLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  resetLibraryItems,
} = require("./libraryService.cjs");
const { parseJobPostingFromUrl } = require("./jobPostingParser.cjs");
const { serializeLibraryError } = require("./libraryErrors.cjs");
const isDev = !app.isPackaged;
let mainWindow = null;
let applyModeWindow = null;

function getWindowBackgroundColor() {
  const settings = readAppSettings();
  return settings.darkMode ? "#020617" : "#f6f1f8";
}

function createMainWindow() {
  const winWidth = 1024;
  const winHeight = 820;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const x = Math.round((width - winWidth) / 2);
  const y = Math.max(20, Math.round((height - winHeight) / 2 - 30));

  const win = new BrowserWindow({
    height: winHeight,
    width: winWidth,
    minHeight: 900,
    minWidth: 600,
    x,
    y,
    frame: false,
    transparent: false,
    resizable: true,
    thickFrame: true,
    roundedCorners: true,
    hasShadow: true,
    backgroundColor: getWindowBackgroundColor(),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow = win;

  win.on("closed", () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null);

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.webContents.once("did-finish-load", () => {
    win.show();

    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.webContents.send("app-window-shown");
      }
    }, 120);
  });
}

function createApplyModeWindow() {
  if (applyModeWindow && !applyModeWindow.isDestroyed()) {
    applyModeWindow.focus();
    return;
  }

  const winWidth = 460;
  const winHeight = 300;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const x = Math.round((width - winWidth) / 2);
  const y = Math.round((height - winHeight) / 2);

  applyModeWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 380,
    minHeight: 260,
    x,
    y,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",

    resizable: true,
    thickFrame: false,
    roundedCorners: false,
    hasShadow: false,

    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    applyModeWindow.loadURL("http://localhost:5173?mode=apply");
  } else {
    applyModeWindow.loadFile(path.join(__dirname, "../dist/index.html"), {
      query: { mode: "apply" },
    });
  }

  applyModeWindow.once("ready-to-show", () => {
    applyModeWindow.show();

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide();
    }
  });

  applyModeWindow.on("closed", () => {
    applyModeWindow = null;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createIpcHandler(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      throw new Error(JSON.stringify(serializeLibraryError(error)));
    }
  };
}

function registerWindowEvents() {
  ipcMain.on("timer:flash-taskbar", () => {
    const win = BrowserWindow.getAllWindows()[0];

    if (!win || win.isDestroyed()) return;

    win.flashFrame(true);

    win.once("focus", () => {
      if (!win.isDestroyed()) {
        win.flashFrame(false);
      }
    });
  });

  ipcMain.on("timer:stop-flash-taskbar", () => {
    const win = BrowserWindow.getAllWindows()[0];

    if (!win || win.isDestroyed()) return;

    win.flashFrame(false);
  });

  ipcMain.on("window:minimize", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.minimize();
  });

  ipcMain.on("window:toggle-maximize", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("window:close", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.close();
  });

  ipcMain.on("settings:get", (event) => {
    event.returnValue = readAppSettings();
  });

  ipcMain.on("settings:set", (_event, settings) => {
    writeAppSettings(settings);
  });

  ipcMain.on("theme:update-background", (_event, darkMode) => {
    const win =
      BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

    if (!win) return;

    win.setBackgroundColor(darkMode ? "#020617" : "#f6f1f8");
  });

  ipcMain.handle(
    "library:get-items",
    createIpcHandler(async () => readLibraryItems()),
  );

  ipcMain.handle(
    "library:add-item",
    createIpcHandler(async (_event, formValues) =>
      createLibraryItem(formValues),
    ),
  );

  ipcMain.handle(
    "library:update-item",
    createIpcHandler(async (_event, itemId, formValues) =>
      updateLibraryItem(itemId, formValues),
    ),
  );

  ipcMain.handle(
    "library:delete-item",
    createIpcHandler(async (_event, itemId) => deleteLibraryItem(itemId)),
  );

  ipcMain.handle(
    "library:reset-items",
    createIpcHandler(async () => resetLibraryItems()),
  );

  ipcMain.handle("library:parse-job-posting-url", async (_event, url) =>
    parseJobPostingFromUrl(url),
  );

  ipcMain.handle("library:open-external-url", async (_event, url) => {
    if (!url || typeof url !== "string") {
      return { success: false };
    }

    await shell.openExternal(url);
    return { success: true };
  });

  ipcMain.on("window:open-apply-mode", () => {
    createApplyModeWindow();
  });

  ipcMain.on("window:exit-apply-mode", () => {
    if (applyModeWindow && !applyModeWindow.isDestroyed()) {
      applyModeWindow.close();
      return;
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  registerWindowEvents();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
