const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // 将preload 脚本附在渲染进程上,使用
    // webPreference 传入 路径
  }); // 创建一个 BrowserWindow窗口 实例

  win.loadFile("index.html");
  ipcMain.handle("ping", () => "pong");
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
