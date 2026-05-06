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
let applyModeClickThroughEnabled = false;
let applyModeClickThroughTimer = null;
let applyModeHitboxes = {
  headerHeight: 42,
  settingsOpen: false,
};

const APPLY_MODE_BASE_WIDTH = 350;
const APPLY_MODE_BASE_HEIGHT = 265;

function broadcastLibraryItemsChanged() {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed()) {
      win.webContents.send("library:items-changed");
    }
  });
}

function clampApplyModeScale(scale) {
  const numericScale = Number(scale);

  if (!Number.isFinite(numericScale)) return 100;

  return Math.min(100, Math.max(50, numericScale));
}

function getApplyModeWindowSize(scale) {
  const safeScale = clampApplyModeScale(scale) / 50;

  return {
    width: Math.round(APPLY_MODE_BASE_WIDTH * safeScale),
    height: Math.round(APPLY_MODE_BASE_HEIGHT * safeScale),
  };
}

function clampApplyModeOpacity(opacity) {
  const numericOpacity = Number(opacity);

  if (!Number.isFinite(numericOpacity)) return 100;

  return Math.min(100, Math.max(35, numericOpacity));
}

function setApplyModeOpacity(opacity) {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) return;

  applyModeWindow.setOpacity(clampApplyModeOpacity(opacity) / 100);
}

function isCursorInsideApplyModeHitbox() {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) return false;

  const cursor = screen.getCursorScreenPoint();
  const bounds = applyModeWindow.getBounds();

  const insideWindow =
    cursor.x >= bounds.x &&
    cursor.x <= bounds.x + bounds.width &&
    cursor.y >= bounds.y &&
    cursor.y <= bounds.y + bounds.height;

  if (!insideWindow) return false;

  if (applyModeHitboxes.settingsOpen) return true;

  return cursor.y <= bounds.y + applyModeHitboxes.headerHeight;
}

function syncApplyModeClickThrough() {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) return;

  const shouldReceiveClicks = isCursorInsideApplyModeHitbox();

  applyModeWindow.setIgnoreMouseEvents(!shouldReceiveClicks, {
    forward: true,
  });
}

function setApplyModeClickThrough(enabled) {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) return;

  applyModeClickThroughEnabled = Boolean(enabled);

  if (applyModeClickThroughTimer) {
    clearInterval(applyModeClickThroughTimer);
    applyModeClickThroughTimer = null;
  }

  if (!applyModeClickThroughEnabled) {
    applyModeWindow.setIgnoreMouseEvents(false);
    return;
  }

  syncApplyModeClickThrough();

  applyModeClickThroughTimer = setInterval(syncApplyModeClickThrough, 60);
}

function resizeApplyModeWindow(scale) {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) return;

  const { width, height } = getApplyModeWindowSize(scale);

  applyModeWindow.setMinimumSize(width, height);
  applyModeWindow.setSize(width, height, true);
}

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

    createApplyModeWindow({ showWhenReady: false });

    setTimeout(() => {
      if (!win.isDestroyed()) {
        win.webContents.send("app-window-shown");
      }
    }, 120);
  });
}

function showApplyModeWindow() {
  if (!applyModeWindow || applyModeWindow.isDestroyed()) {
    createApplyModeWindow({ showWhenReady: true });
    return;
  }

  const settings = readAppSettings();
  const targetOpacity = clampApplyModeOpacity(settings.applyModeOpacity) / 100;

  setApplyModeClickThrough(false);

  applyModeWindow.setOpacity(0);
  applyModeWindow.setAlwaysOnTop(true);
  applyModeWindow.show();
  applyModeWindow.focus();

  setTimeout(() => {
    if (!applyModeWindow || applyModeWindow.isDestroyed()) return;

    applyModeWindow.setOpacity(targetOpacity);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide();
    }
  }, 80);
}

function createApplyModeWindow({ showWhenReady = false } = {}) {
  if (applyModeWindow && !applyModeWindow.isDestroyed()) {
    applyModeWindow.focus();
    return;
  }

  const settings = readAppSettings();
  const { width: winWidth, height: winHeight } = getApplyModeWindowSize(
    settings.applyModeScale,
  );

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
    alwaysOnTop: true,
    skipTaskbar: false,

    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setApplyModeOpacity(settings.applyModeOpacity);

  if (isDev) {
    applyModeWindow.loadURL("http://localhost:5173?mode=apply");
  } else {
    applyModeWindow.loadFile(path.join(__dirname, "../dist/index.html"), {
      query: { mode: "apply" },
    });
  }

  applyModeWindow.once("ready-to-show", () => {
    if (showWhenReady) {
      showApplyModeWindow();
    }
  });

  applyModeWindow.on("minimize", () => {
    setApplyModeClickThrough(false);
  });

  applyModeWindow.on("restore", () => {
    applyModeWindow.setAlwaysOnTop(true);
  });

  applyModeWindow.on("closed", () => {
    applyModeWindow = null;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }

    if (applyModeClickThroughTimer) {
      clearInterval(applyModeClickThroughTimer);
      applyModeClickThroughTimer = null;
    }

    applyModeClickThroughEnabled = false;
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
    createIpcHandler(async (_event, formValues) => {
      const item = await createLibraryItem(formValues);
      broadcastLibraryItemsChanged();
      return item;
    }),
  );

  ipcMain.handle(
    "library:update-item",
    createIpcHandler(async (_event, itemId, formValues) => {
      const item = await updateLibraryItem(itemId, formValues);
      broadcastLibraryItemsChanged();
      return item;
    }),
  );

  ipcMain.handle(
    "library:delete-item",
    createIpcHandler(async (_event, itemId) => {
      const result = await deleteLibraryItem(itemId);
      broadcastLibraryItemsChanged();
      return result;
    }),
  );

  ipcMain.handle(
    "library:reset-items",
    createIpcHandler(async () => {
      const items = await resetLibraryItems();
      broadcastLibraryItemsChanged();
      return items;
    }),
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
    showApplyModeWindow();
  });

  ipcMain.on("window:exit-apply-mode", () => {
    setApplyModeClickThrough(false);

    if (applyModeWindow && !applyModeWindow.isDestroyed()) {
      applyModeWindow.hide();
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  ipcMain.on("window:set-apply-mode-scale", (_event, scale) => {
    const safeScale = clampApplyModeScale(scale);

    const currentSettings = readAppSettings();
    writeAppSettings({
      ...currentSettings,
      applyModeScale: safeScale,
    });

    resizeApplyModeWindow(safeScale);
  });

  ipcMain.on("window:set-apply-mode-opacity", (_event, opacity) => {
    const safeOpacity = clampApplyModeOpacity(opacity);

    const currentSettings = readAppSettings();
    writeAppSettings({
      ...currentSettings,
      applyModeOpacity: safeOpacity,
    });

    setApplyModeOpacity(safeOpacity);
  });

  ipcMain.on("window:set-apply-mode-click-through", (_event, enabled) => {
    setApplyModeClickThrough(enabled);
  });

  ipcMain.on("window:set-apply-mode-hitboxes", (_event, hitboxes = {}) => {
    applyModeHitboxes = {
      ...applyModeHitboxes,
      ...hitboxes,
    };

    if (applyModeClickThroughEnabled) {
      syncApplyModeClickThrough();
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
