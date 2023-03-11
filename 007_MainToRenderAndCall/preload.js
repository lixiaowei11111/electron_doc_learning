const { contextBridge, ipcRenderer } = require("electron");


// 暴露handleCounter 这个方法给 renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  handleCounter: (callback) => ipcRenderer.on("update-counter", callback),
});
