const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (filePaths) => ipcRenderer.invoke("dialog:openFile", filePaths),
});
