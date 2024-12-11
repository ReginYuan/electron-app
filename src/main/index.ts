import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 默认打开调试模式
  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 主进程接受渲染进程的消息
  ipcMain.handle('webMsg', (event, msg) => {
    if (msg.name === '打开新窗口') {
      const listWindow = new BrowserWindow({
        width: 500,
        height: 300,
        minWidth: 300,
        minHeight: 200,
        titleBarStyle: 'hidden', //隐藏标题
        x: 100, //控制x轴在屏幕中的位置
        y: 100, //控制y 轴在屏幕中的位置
        show: false,
        resizable: false, // 禁止调整窗口大小
        autoHideMenuBar: true, // 隐藏标题之后窗口无法移动
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        }
      })
      listWindow.on('ready-to-show', ()=>{
        listWindow.show()
      })
      listWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/list')
    } else if (msg.name === '下载') {
      console.log('111')
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('ping', () => console.log('pong'))
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
