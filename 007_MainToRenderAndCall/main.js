const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => mainWindow.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
  mainWindow.loadFile("index.html");
   // Open the DevTools.
   mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  //whenReady 返回 Promise<void> - 当Electron 初始化完成。 可用作检查 app.isReady() 的方便选择，假如应用程序尚未就绪，则订阅ready事件。
  createWindow();
  ipcMain.on('counter-value',(_event,value)=>{
    console.log(value);
  })
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    // app.quit 尝试关闭所有窗口 将首先发出 before-quit 事件。 如果所有窗口都已成功关闭, 则将发出 will-quit 事件, 并且默认情况下应用程序将终止。
    // 此方法会确保执行所有beforeunload 和 unload事件处理程序。 可以在退出窗口之前的beforeunload事件处理程序中返回false取消退出。
  }
});
