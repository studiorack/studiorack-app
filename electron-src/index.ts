// Native
import path, { join } from 'path';
import { parse } from 'url';

// Packages
import { BrowserWindow, app, dialog, session, ipcMain, IpcMainEvent, protocol } from 'electron';
import fixPath from 'fix-path';
import isDev from 'electron-is-dev';
import { createServer as createServerHttp, IncomingMessage, ServerResponse } from 'http';
import createServer from 'next/dist/server/next.js';
import {
  ConfigInterface,
  ConfigLocal,
  fileOpen,
  isTests,
  ManagerLocal,
  Package,
  ProjectPlugins,
  RegistryType,
} from '@open-audio-stack/core';

// Ensure Electron apps subprocess on macOS and Linux inherit system $PATH
fixPath();

const DEFAULT_PAGE = 'projects';

export const CONFIG: ConfigInterface = {
  registries: [
    {
      name: 'Open Audio Registry',
      url: 'https://open-audio-stack.github.io/open-audio-stack-registry',
    },
  ],
  version: '1.0.0',
};

export const CONFIG_LOCAL_TEST: ConfigInterface = {
  ...CONFIG,
  appDir: 'test',
  pluginsDir: path.join('test', 'installed', 'plugins'),
  presetsDir: path.join('test', 'installed', 'presets'),
  projectsDir: path.join('test', 'installed', 'projects'),
};

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  // Use server-side rendering for both dev and production builds
  // @ts-expect-error incorrect types returned
  const nextApp = createServer({
    dev: isDev,
    dir: join(app.getAppPath(), 'renderer'),
  });
  const requestHandler = nextApp.getRequestHandler();

  // Build the renderer code and watch the files
  await nextApp.prepare();

  // Create a new native HTTP server (which supports hot code reloading)
  createServerHttp((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url ? req.url : '', true);
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
    app.dock.setIcon(join(app.getAppPath(), 'renderer', 'public', 'icons', 'android-chrome-512x512.png'));
  }

  // enable more secure http header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `
          default-src 'self' *.youtube.com;
          connect-src 'self' github.com *.github.com *.github.io *.githubusercontent.com *.google-analytics.com *.doubleclick.net *.google.com *.googleapis.com data:;
          font-src 'self' fonts.gstatic.com;
          img-src 'self' github.com *.github.com *.github.io *.githubusercontent.com *.s3.amazonaws.com *.youtube.com *.ytimg.com data: media:;
          media-src 'self' github.com *.github.com *.github.io *.githubusercontent.com *.s3.amazonaws.com *.youtube.com media:;
          object-src 'none';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' github.com *.github.com *.github.io *.githubusercontent.com *.doubleclick.net *.google.com *.gstatic.com *.googletagmanager.com *.google-analytics.com;
          style-src 'self' 'unsafe-inline' github.com *.github.com *.github.io *.githubusercontent.com fonts.googleapis.com
          `,
        ],
      },
    });
  });

  const mainWindow = new BrowserWindow({
    width: isDev ? 1024 + 445 : 1024,
    height: 768,
    webPreferences: {
      sandbox: false,
      preload: join(app.getAppPath(), 'build', 'preload.mjs'),
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

const config: ConfigLocal = new ConfigLocal(isTests() ? CONFIG_LOCAL_TEST : undefined);

// Setup a plugin manager.
const manager: ManagerLocal = new ManagerLocal(RegistryType.Plugins, isTests() ? CONFIG_LOCAL_TEST : undefined);
await manager.sync();
manager.scan();

// Setup a project manager.
const managerProjects: ManagerLocal = new ManagerLocal(
  RegistryType.Projects,
  isTests() ? CONFIG_LOCAL_TEST : undefined,
);
await managerProjects.sync();
managerProjects.scan();

// Listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: string | object) => {
  event.sender.send('message', message);
});

// Get plugins installed locally
ipcMain.handle('pluginsGetLocal', async () => {
  console.log('pluginsGetLocal');
  return manager.listPackages(true);
});

// Get plugin installer locally by path
ipcMain.handle('pluginGetLocal', async (_event, id: string) => {
  console.log('pluginGetLocal', id);
  return manager.getPackage(id);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginInstall', async (_event, plugin: Package) => {
  console.log('pluginInstall', plugin);
  return await manager.install(plugin.slug, plugin.version);
});

// Install plugin into root plugin folder locally
ipcMain.handle('pluginsInstall', async (_event, plugins: ProjectPlugins) => {
  console.log('pluginsInstall', plugins);
  const promises = Object.keys(plugins).map((pluginId: string) => {
    return manager.install(pluginId, plugins[pluginId]);
  });
  return Promise.all(promises);
});

// Uninstall plugin from root plugin folder locally
ipcMain.handle('pluginUninstall', async (_event, plugin: Package) => {
  console.log('pluginUninstall', plugin);
  return await manager.uninstall(plugin.slug, plugin.version);
});

// Get projects installed locally
ipcMain.handle('projectsGetLocal', async () => {
  console.log('projectsGetLocal');
  return await managerProjects.listPackages(true);
});

// Get projects installer locally by path
ipcMain.handle('projectGetLocal', async (_event, id: string) => {
  console.log('projectGetLocal', id);
  return await managerProjects.getPackage(id);
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
ipcMain.handle('storeGet', async (_event, key: keyof ConfigInterface) => {
  console.log('storeGet', key, config.get(key));
  if (!key) return;
  return {
    key,
    value: config.get(key),
  };
});

// Set user-specific setting
ipcMain.handle('storeSet', async (_event, key: keyof ConfigInterface, val: string | object) => {
  console.log('storeSet', key, val);
  if (!key || !val) return;
  return config.set(key, val);
});
