const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  }); // 创建一个 BrowserWindow窗口 实例

  win.loadFile("index.html");
};
console.log(process.platform, "process.platform"); // win32
// 检查 Node.js 的 process.platform 变量，帮助您在不同操作系统上运行特定代码。
//请注意，Electron 目前只支持三个平台：win32 (Windows), linux (Linux) 和 darwin (macOS)

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
