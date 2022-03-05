// Native
import { join } from 'path';
import { parse } from 'url';

// Packages
import { BrowserWindow, app, dialog, session, ipcMain, IpcMainEvent, protocol } from 'electron';
import isDev from 'electron-is-dev';
import { createServer } from 'http';
import next from 'next';

// custom code
import {
  fileOpen,
  PluginInterface,
  pluginGetLocal,
  pluginInstall,
  pluginsGetLocal,
  pluginUninstall,
  projectGetLocal,
  projectsGetLocal,
} from '@studiorack/core';
import { store } from './store';

const DEFAULT_PAGE = 'projects';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // Use server-side rendering for both dev and production builds
  const nextApp = next({
    dev: isDev,
    dir: app.getAppPath() + '/renderer',
  });
  const requestHandler = nextApp.getRequestHandler();

  // Build the renderer code and watch the files
  await nextApp.prepare();

  // Create a new native HTTP server (which supports hot code reloading)
  createServer((req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    requestHandler(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });

  // Register custom media protocol for local images
  protocol.registerFileProtocol('media', (request, callback) => {
    const pathname = request.url.replace('media:///', '');
    callback(pathname);
  });

  // Dock is only available on MacOS
  if (app.dock) {
    app.dock.setIcon(join(__dirname, '../renderer/out/icons/icon.png'));
  }

  // enable more secure http header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `
          default-src 'self' *.youtube.com;
          connect-src 'self' *.github.io data:;
          font-src 'self' fonts.gstatic.com;
          img-src 'self' github.com *.githubusercontent.com *.s3.amazonaws.com *.youtube.com data: media:;
          media-src 'self' github.com *.githubusercontent.com *.s3.amazonaws.com *.youtube.com media:;
          object-src 'none';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' *.doubleclick.net *.google.com *.gstatic.com;
          style-src 'self' 'unsafe-inline' fonts.googleapis.com
          `,
        ],
      },
    });
  });

  const mainWindow = new BrowserWindow({
    width: isDev ? 1024 + 445 : 1024,
    height: 768,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(`http://localhost:3000/${DEFAULT_PAGE}`);

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
  return await pluginGetLocal(id);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginInstall', async (_event, plugin: PluginInterface) => {
  console.log('pluginInstall index', plugin);
  return await pluginInstall(`${plugin.repo}/${plugin.id}`, plugin.version);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginsInstall', async (_event, plugins: any) => {
  console.log('pluginsInstall', plugins);
  const promises = Object.keys(plugins).map((pluginId: string) => {
    const plugin = plugins[pluginId];
    return pluginInstall(`${plugin.repo}/${plugin.id}`, plugin.version);
  });
  return Promise.all(promises);
});

// Uninstall plugin from root plugin folder locally
ipcMain.handle('pluginUninstall', async (_event, plugin) => {
  console.log('pluginUninstall', plugin);
  return await pluginUninstall(`${plugin.repo}/${plugin.id}`, plugin.version);
});

// Get projects installed locally
ipcMain.handle('projectsGetLocal', async () => {
  console.log('projectsGetLocal');
  return await projectsGetLocal();
});

// Get projects installer locally by path
ipcMain.handle('projectGetLocal', async (_event, id: string) => {
  console.log('projectGetLocal', id);
  return await projectGetLocal(id);
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
    properties: ['openDirectory'],
  });
});

// Get user-specific setting
ipcMain.handle('storeGet', async (_event, key: string) => {
  console.log('storeGet', key);
  if (!key) return;
  return {
    key,
    value: store.get(key),
  };
});

// Set user-specific setting
ipcMain.handle('storeSet', async (_event, key: string, val: any) => {
  console.log('storeSet', key, val);
  if (!key || !val) return;
  return store.set(key, val);
});
