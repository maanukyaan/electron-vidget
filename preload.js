  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("electronAPI", {
    sendColor: (color) => ipcRenderer.send("sendColor", color),
  });
