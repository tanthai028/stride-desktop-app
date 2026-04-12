const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronEnv", {
  isElectron: true,
});

contextBridge.exposeInMainWorld("windowControls", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
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
});
