const { contextBridge, ipcRenderer } = require("electron");

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
