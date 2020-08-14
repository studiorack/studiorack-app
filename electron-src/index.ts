// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// custom code
import { File } from './file'

const file = new File()
const folder = `${file.getPluginFolder(true)}/**/*.{vst,vst3}`

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  app.dock.setIcon(join(__dirname, '../renderer/out/icons/icon.png'))

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(url)

  // If developing locally, open developer tools
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  event.sender.send('message', message)
})

ipcMain.handle('get-plugins', async () => {
  const list: Array<object> = []
  const paths = file.readDir(folder)
  paths.forEach((path: string) => {
    list.push(file.readPlugin(path));
  })
  return list
})
