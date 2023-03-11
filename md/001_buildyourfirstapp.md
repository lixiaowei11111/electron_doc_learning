# 1. 初始化npm项目

## 1. **electron项目中的package.json文件中有几个注意点**:

1. 必须制定 `main`字段的路径
2. author, license,description 可以为任意内容,但是需要必填
3. electron 安装为devDependencies, 即仅在开发环境需要的额外依赖。
   + 打包后的应用本身会包含 Electron 的二进制文件，因此不需要将 Electron 作为生产环境依赖。

## 2. electron由于网络原因安装失败

+ 更改一个包的镜像地址

  ```bash
  npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
  npm install --save-dev electron
  ```

## 3. electron 应用入口

+ package.json中的main字段指定的是所有 Electron 应用的入口点。 这个文件控制 **主程序 (main process)**，它运行在 Node.js 环境里，负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)

## 4. 运行electron应用

main.js

```js
console.log("hello world")
```



package.json

```json
"main": "main.js",
"scripts": {
    "start": "electron ."
  },
```

`npm run start`

终端会输出 `hello world `



## 5. 加载网页到 BrowserWindow (electron renderer)

+ 在 Electron 中，每个窗口展示一个页面，后者可以来自本地的 HTML，也可以来自远程 URL。

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'"
      />
      <meta
        http-equiv="X-Content-Security-Policy"
        content="default-src 'self'; script-src 'self'"
      />
      <title>Hello from Electron renderer!</title>
    </head>
    <body>
      <h1>Hello from Electron renderer!</h1>
      <p>👋</p>
    </body>
  </html>
  ```

+ 现在有了一个网页，可以将它装载到 Electron 的 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 上了。 将 `main.js` 中的内容替换成下列代码。

  main.js

  ```js
  const { app, BrowserWindow } = require('electron')
  
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    })
  
    win.loadFile('index.html')
  }
  
  app.whenReady().then(() => {
    createWindow()
  })
  ```

### 5.1 importing modules

`main.js(line1)`

```js
const { app, BrowserWindow } = require('electron')
```

在第一行中，我们使用 CommonJS 语法导入了两个 Electron 模块：

- [app](https://www.electronjs.org/zh/docs/latest/api/app)，它控制您的应用的事件生命周期。
- [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window)，它负责创建和管理应用的窗口。

### 5.2 将可复用的函数写入实例化窗口

`createWindow()` 函数将您的页面加载到新的 BrowserWindow 实例中：

`main.js(Lines 3-10)`

```js
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')
}
```



### 5.3  Calling  function when the app is ready

`main.js(12-14)`

```js
app.whenReady().then(() => {
  createWindow()
})
```

+ Electron 的很多核心模组是 Node.js [事件触发器](https://nodejs.org/api/events.html#events)，遵守 Node.js 的异步事件驱动架构。 app 模块就是其中一个。

+ 在 Electron 中，**只有在 app 模组的 [`ready`](https://www.electronjs.org/zh/docs/latest/api/app#event-ready) 事件能触发后才能创建 BrowserWindows 实例**。 
+ 可以借助 [`app.whenReady()`](https://www.electronjs.org/zh/docs/latest/api/app#appwhenready) API 来等待此事件，并在该 API 的 promise 被 resolve 时调用 `createWindow()` 方法。

+ 通常我们使用触发器的 `.on` 函数来监听 Node.js 事件。

```diff
+ app.on('ready').then(() => {
- app.whenReady().then(() => {
  createWindow()
})
```

+ 但是 Electron 暴露了 `app.whenReady()` 方法，作为其 `ready` 事件的专用监听器，这样可以避免直接监听 .on 事件带来的一些问题。 参见 [electron/electron#21972](https://github.com/electron/electron/pull/21972) 。

The goal of this small change is to encourage new users to use whenReady():

+ It handles the edge case of registering for 'ready' after it's fired
+ It avoids the minor wart of leaving an active listener alive for an event that will never fire again



## 6. 管理应用的窗口生命周期

+ 应用窗口在不同操作系统中的行为也不同。 Electron 允许您自行实现这些行为来遵循操作系统的规范，而不是采用默认的强制执行。 您可以通过监听 app 和 BrowserWindow 模组的事件，自行实现基础的应用窗口规范。

+ 针对特定进程的控制流
  + 可以检查 Node.js 的 [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) 变量，帮助您在不同操作系统上运行特定代码。 请注意，Electron 目前只支持三个平台：`win32` (Windows), `linux` (Linux) 和 `darwin` (macOS) 。

## 7. 关闭所有窗口时退出应用 (Windows & Linux)

在 Windows 和 Linux 上，我们通常希望在关闭一个应用的所有窗口后让它退出。 若要在 Electron 中实现这一点，您可以监听 [`window-all-closed`](https://www.electronjs.org/zh/docs/latest/api/app#event-window-all-closed) 事件，并调用 [`app.quit()`](https://www.electronjs.org/zh/docs/latest/api/app#appquit) 来让应用退出。这不适用于 macOS。



## 8. 如果没有窗口打开则打开一个窗口 (macOS)

+ 与前二者相比，即使没有打开任何窗口，macOS 应用通常也会继续运行。 在没有窗口可用时调用 app 会打开一个新窗口。

+ 为了实现这一特性，可以监听模组的 [`activate`](https://www.electronjs.org/zh/docs/latest/api/app#event-activate-macos) 事件，如果没有任何活动的 BrowserWindow，调用 `createWindow()` 方法新建一个。

+ 因为窗口无法在 `ready` 事件前创建，你应当在你的应用初始化后仅监听 `activate` 事件。 要实现这个，仅监听 `whenReady()` 回调即可。

## 9. 使用vscode调试

+ 如果希望使用 VS Code 调试程序，需要让 VS Code 监听主进程 (main process) 和渲染器进程 (renderer process) 。 下面提供了一个简单的配置文件。 请在根目录新建一个 `.vscode` 文件夹，然后在其中新建一个 launch.json 配置文件并填写如下内容。

  `.vscode/launch.json`

  ```json
  {
    "version": "0.2.0",
    "compounds": [
      {
        "name": "Main + renderer",
        "configurations": ["Main", "Renderer"],
        "stopAll": true
      }
    ],
    "configurations": [
      {
        "name": "Renderer",
        "port": 9222,
        "request": "attach",
        "type": "chrome",
        "webRoot": "${workspaceFolder}"
      },
      {
        "name": "Main",
        "type": "node",
        "request": "launch",
        "cwd": "${workspaceFolder}",
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
        "windows": {
          "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
        },
        "args": [".", "--remote-debugging-port=9222"],
        "outputCapture": "std",
        "console": "integratedTerminal"
      }
    ]
  }
  ```

  + 保存后，当选择侧边栏的 “运行和调试”，将会出现一个 "Main + renderer" 选项。然后便可设置断点，并跟踪主进程和渲染器进程中的所有变量。

  上文中我们在 `launch.json` 所做的其实是创建三个配置项：

  - `Main` 用来运行主程序，并且暴露出 9222 端口用于远程调试 (`--remote-debugging-port=9222`) 。 我们将把调试器绑定到那个端口来调试 `renderer` 。 因为主进程是 Node.js 进程，类型被设置为 `node`。
  - `Renderer` 用来调试渲染器进程。 因为后者是由主进程创建的，我们要把它 “绑定” 到主进程上 ()`"request": "attach"`，而不是创建一个新的。 渲染器是 web 进程，因此要选择 `chrome` 调试器。
  - `Main + renderer` 是一个 [复合任务](https://code.visualstudio.com/Docs/editor/tasks#_compound-tasks)，可同时执行前两个任务。