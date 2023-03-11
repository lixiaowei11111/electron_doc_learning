const { contextBridge, ipcRenderer } = require("electron");

// 暴露全局变量给页面
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  // 能暴露的不仅仅是函数，我们还可以暴露变量
});
// 上下文隔离, 访问不到
window.myAPI = {
  desktop: true,
};
