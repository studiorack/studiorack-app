// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, dialog, session, ipcMain, IpcMainEvent, protocol } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

// custom code
import { fileOpen, Plugin, PluginEntry, pluginGetLocal, pluginInstall, pluginsGetLocal, pluginLatest, pluginUninstall, projectGet, projectsGet } from '@studiorack/core';
import { store } from './store';

const DEFAULT_PAGE = 'projects';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  // Register custom media protocol for local images
  protocol.registerFileProtocol('media', (request, callback) => {
    const pathname = request.url.replace('media:///', '');
    callback(pathname);
  });

  app.dock.setIcon(join(__dirname, '../renderer/out/icons/icon.png'));

  // enable more secure http header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `
          default-src 'self';
          connect-src 'self' *.github.io data:;
          font-src 'self' fonts.gstatic.com;
          img-src 'self' github.com github-releases.githubusercontent.com *.s3.amazonaws.com data: media:;
          media-src 'self' github.com github-releases.githubusercontent.com *.s3.amazonaws.com media:;
          object-src 'none';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline' fonts.googleapis.com
          `,
        ],
      },
    });
  });

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true,
      webSecurity: false
    },
  });

  const url = isDev
    ? `http://localhost:8000/${DEFAULT_PAGE}`
    : format({
        pathname: join(__dirname, `../renderer/out/${DEFAULT_PAGE}.html`),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);

  // If developing locally, open developer tools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// Listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  event.sender.send('message', message);
});

// Get plugins installed locally
ipcMain.handle('pluginsGetLocal', async () => {
  console.log('pluginsGetLocal');
  return await pluginsGetLocal();
});

// Get plugin installer locally by path
ipcMain.handle('pluginGetLocal', async (_event, id: string) => {
  console.log('pluginGetLocal', id);
  return pluginGetLocal(id);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginInstall', async (_event, plugin: Plugin) => {
  console.log('pluginInstall', plugin);
  return pluginInstall(plugin.id || 'none', plugin.version, true);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginsInstall', async (_event, plugins: any) => {
  console.log('pluginsInstall', plugins);
  const promises = Object.keys(plugins).map((pluginId: string) => {
    return pluginInstall(pluginId, plugins[pluginId], true).then((pluginEntry: PluginEntry) => {
      const plugin = pluginLatest(pluginEntry);
      plugin.status = 'installed';
      return plugin;
    })
  })
  return Promise.all(promises);
});

// Uninstall plugin from root plugin folder locally
ipcMain.handle('pluginUninstall', async (_event, plugin) => {
  console.log('pluginUninstall', plugin);
  return pluginUninstall(plugin.id, plugin.version, true);
});

// Get projects installed locally
ipcMain.handle('projectsGet', async () => {
  console.log('projectsGet');
  return await projectsGet();
});

// Get projects installer locally by path
ipcMain.handle('projectGet', async (_event, id: string) => {
  console.log('projectGet', id);
  return projectGet(id);
});

// Open project
ipcMain.handle('projectOpen', async (_event, path: string) => {
  console.log('projectOpen', path);
  return fileOpen(path);
});

// Select folder
ipcMain.handle('folderSelect', async (_event, path: string) => {
  console.log('folderSelect');
  if (!path) return;
  return dialog.showOpenDialog({
    defaultPath: path,
    properties: ['openDirectory']
  });
});

// Get user-specific setting
ipcMain.handle('storeGet', async (_event, key: string) => {
  console.log('storeGet', key);
  if (!key) return;
  return {
    key,
    value: store.get(key)
  }
});

// Set user-specific setting
ipcMain.handle('storeSet', async (_event, key: string, val: any) => {
  console.log('storeSet', key, val);
  if (!key || !val) return;
  return store.set(key, val);
});
