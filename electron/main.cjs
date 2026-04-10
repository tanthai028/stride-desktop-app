const path = require("path");
const { app, BrowserWindow, ipcMain, Menu, screen } = require("electron");
const { readAppSettings, writeAppSettings } = require("./settingsStore.cjs");

const isDev = !app.isPackaged;

function getWindowBackgroundColor() {
  const settings = readAppSettings();
  return settings.darkMode ? "#020617" : "#f6f1f8";
}

function createWindow() {
  const winWidth = 1024;
  const winHeight = 640;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const x = Math.round((width - winWidth) / 2);
  const y = Math.round((height - winHeight) / 2 - 50);

  const win = new BrowserWindow({
    height: winHeight,
    width: winWidth,
    minHeight: 800,
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

function registerWindowEvents() {
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
}

app.whenReady().then(() => {
  registerWindowEvents();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
