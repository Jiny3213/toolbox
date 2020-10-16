// fuck this guide !!! https://www.electronjs.org/docs/tutorial/first-app
// const { app, BrowserWindow } = require('electron')
const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron

const {brush, stop} = require('./spider')

let win
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
}
app.whenReady().then(createWindow)

const console = {
  log(string) {
    // 主进程主动向渲染进程发送消息
    win.webContents.send('msg', string);
  },
  warn(string) {
    win.webContents.send('warn', string)
  },
  error(string) {
    win.webContents.send('error', string);
  }
}
ipcMain.on('brush', (event, status) => {
  // event.sender.send('msg', status)
  const {url, time, cookie, sleep} = status
  // https://www.jianshu.com/p/7f1002c281e2
  brush(console, url, time, cookie, sleep)
})
ipcMain.on('stop', (event, status) => {
  stop(console)
})


//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。
