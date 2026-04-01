const path = require("path");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    frame: false,
    transparent: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  if (isDev) {
    win.loadURL("http://localhost:5173");
    return;
  }

  win.loadFile(path.join(__dirname, "../dist/index.html"));
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
      return;
    }

    win.maximize();
  });

  ipcMain.on("window:close", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.close();
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