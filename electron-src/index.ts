// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, session, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

// custom code
import { pluginGetLocal, pluginInstall, pluginsGetLocal, pluginUninstall } from '@studiorack/core';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

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
          img-src 'self' github.com *.s3.amazonaws.com data:;
          media-src 'self' github.com *.s3.amazonaws.com;
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
    },
  });

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
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
ipcMain.handle('get-plugins', async () => {
  console.log('get-plugins');
  return await pluginsGetLocal();
});

// Get plugin installer locally by path
ipcMain.handle('get-plugin', async (_event, path) => {
  console.log('get-plugin', path);
  return pluginGetLocal(path);
});

// Install plugin into root plugin folder locally
ipcMain.handle('installPlugin', async (_event, plugin) => {
  console.log('installPlugin', plugin);
  return pluginInstall(plugin.id, plugin.version, true);
});

// Uninstall plugin from root plugin folder locally
ipcMain.handle('uninstallPlugin', async (_event, plugin) => {
  console.log('uninstallPlugin', plugin);
  return pluginUninstall(plugin.id, plugin.version, true);
});
