// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, session, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// custom code
import { File } from './file'
const path = require('path')
import { getRaw } from './api'

const file = new File()
const folder = `${file.getPluginFolder(true)}/**/*.{vst,vst3}`

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  app.dock.setIcon(join(__dirname, '../renderer/out/icons/icon.png'))

  // enable more secure http header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [`
          default-src 'self';
          connect-src 'self' *.github.io data:;
          font-src 'self' fonts.gstatic.com;
          img-src 'self' github.com *.s3.amazonaws.com data:;
          media-src 'self' github.com *.s3.amazonaws.com;
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline' fonts.googleapis.com
        `]
      }
    })
  })

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true
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
  // Prototype for now, will write this properly later
  const list: Array<object> = []
  const pluginPaths = file.readDir(folder)
  pluginPaths.forEach((pluginPath: string) => {
    const folderPath = path.dirname(folder).replace('**', '')
    const pluginId = pluginPath.substring(folderPath.length, pluginPath.lastIndexOf('.'))
    const versionId = pluginId.match(/([0-9]+)\.([0-9]+)\.([0-9]+)/)
    const jsonPath = pluginPath.substring(0, pluginPath.lastIndexOf('.')) + '.json'
    let plugin = file.loadFileJson(jsonPath)
    if (!plugin) {
      plugin = file.readPlugin(pluginPath)
    }
    plugin.id = pluginId
    plugin.path = pluginPath
    plugin.slug = toSlug(pluginId)
    plugin.status = 'installed'
    plugin.version = versionId ? versionId[0] : plugin.version
    list.push(plugin)
  })
  return list
})

ipcMain.handle('get-plugin', async (_event, path) => {
  // Prototype for now, will write this properly later
  console.log('get-plugin', path)
  const jsonPath = `${file.getPluginFolder(true)}/${fromSlug(path)}.json`
  const versionId = path.match(/([0-9]+)\.([0-9]+)\.([0-9]+)/)
  console.log('jsonPath', jsonPath)
  let plugin = file.loadFileJson(jsonPath)
  plugin.id = fromSlug(path)
  plugin.path = `${file.getPluginFolder(true)}/${fromSlug(path)}.vst3`
  plugin.slug = path
  plugin.status = 'installed'
  plugin.version = versionId ? versionId[0] : plugin.version
  return plugin
})

ipcMain.handle('installPlugin', async (_event, plugin) => {
  // prototyping this quickly, will rewrite this properly later
  console.log('installPlugin', plugin)
  const source = file.getSource(plugin.id, plugin.version);
  if (!source) {
    return console.error(`Plugin not available for your system ${plugin.id}`);
  }
  if (source.slice(-4) !== '.zip') {
    return console.error(`Unsupported file type ${source.slice(-4)}`);
  }
  const data = await getRaw(source);
  file.createDirectory(`${file.getPluginFolder(true)}/${plugin.id}/${plugin.version}`);
  file.extractZip(data, `${file.getPluginFolder(true)}/${plugin.id}/${plugin.version}`);
})

ipcMain.handle('uninstallPlugin', async (_event, plugin) => {
  // prototyping this quickly, will rewrite this properly later
  console.log('uninstallPlugin', plugin)
  file.deleteDirectory(plugin.path)
  const pluginDir = plugin.path.substring(0, plugin.path.lastIndexOf('/'))
  if (file.directoryEmpty(pluginDir)) {
    file.deleteDirectory(pluginDir)
  }
  const parentDir = pluginDir.substring(0, pluginDir.lastIndexOf('/'))
  if (file.directoryEmpty(parentDir)) {
    file.deleteDirectory(parentDir)
  }
})

function toSlug(input: string) {
  return input ? input.replace(/\//g, '_') : input
}

function fromSlug(input: string) {
  return input ? input.replace(/_/g, '/') : input
}
