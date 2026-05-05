const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronEnv", {
  isElectron: true,
});

contextBridge.exposeInMainWorld("windowControls", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  openApplyMode: () => ipcRenderer.send("window:open-apply-mode"),
  exitApplyMode: () => ipcRenderer.send("window:exit-apply-mode"),
  setApplyModeScale: (scale) =>
    ipcRenderer.send("window:set-apply-mode-scale", scale),
  setApplyModeOpacity: (opacity) =>
    ipcRenderer.send("window:set-apply-mode-opacity", opacity),
  setApplyModeClickThrough: (enabled) =>
    ipcRenderer.send("window:set-apply-mode-click-through", enabled),
});

contextBridge.exposeInMainWorld("timerApi", {
  flashTaskbar: () => ipcRenderer.send("timer:flash-taskbar"),
  stopFlashTaskbar: () => ipcRenderer.send("timer:stop-flash-taskbar"),
});

contextBridge.exposeInMainWorld("appStartup", {
  onWindowShown: (callback) => {
    const handler = () => callback();

    ipcRenderer.on("app-window-shown", handler);

    return () => {
      ipcRenderer.removeListener("app-window-shown", handler);
    };
  },
});

contextBridge.exposeInMainWorld("appSettings", {
  get: () => ipcRenderer.sendSync("settings:get"),
  set: (settings) => ipcRenderer.send("settings:set", settings),
  updateThemeBackground: (darkMode) =>
    ipcRenderer.send("theme:update-background", darkMode),
});

contextBridge.exposeInMainWorld("libraryApi", {
  getItems: () => ipcRenderer.invoke("library:get-items"),
  addItem: (formValues) => ipcRenderer.invoke("library:add-item", formValues),
  updateItem: (itemId, formValues) =>
    ipcRenderer.invoke("library:update-item", itemId, formValues),
  deleteItem: (itemId) => ipcRenderer.invoke("library:delete-item", itemId),
  resetItems: () => ipcRenderer.invoke("library:reset-items"),
  parseJobPostingUrl: (url) =>
    ipcRenderer.invoke("library:parse-job-posting-url", url),
  openExternalUrl: (url) =>
    ipcRenderer.invoke("library:open-external-url", url),
});
