import { ipcRenderer } from 'electron';
import { PluginVersion, PluginVersionLocal, ProjectVersionLocal, ProjectVersionPlugins } from '@studiorack/core';

function message(val: string | object) {
  return ipcRenderer.send('message', val);
}

async function pluginsGetLocal(): Promise<PluginVersionLocal[]> {
  return ipcRenderer.invoke('pluginsGetLocal');
}

async function pluginGetLocal(id: string): Promise<PluginVersionLocal> {
  return ipcRenderer.invoke('pluginGetLocal', id);
}

async function pluginInstall(plugin: PluginVersion): Promise<PluginVersionLocal> {
  console.log('pluginInstall api', plugin);
  return ipcRenderer.invoke('pluginInstall', plugin);
}

async function pluginsInstall(plugins: ProjectVersionPlugins): Promise<PluginVersionLocal[]> {
  return ipcRenderer.invoke('pluginsInstall', plugins);
}

async function pluginUninstall(plugin: PluginVersion): Promise<PluginVersionLocal> {
  return ipcRenderer.invoke('pluginUninstall', plugin);
}

async function projectsGetLocal(): Promise<ProjectVersionLocal[]> {
  return ipcRenderer.invoke('projectsGetLocal');
}

async function projectGetLocal(id: string): Promise<ProjectVersionLocal> {
  return ipcRenderer.invoke('projectGetLocal', id);
}

async function projectOpen(path: string): Promise<ProjectVersionLocal> {
  return ipcRenderer.invoke('projectOpen', path);
}

async function folderSelect(path: string): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke('folderSelect', path);
}

async function storeGet(key: string): Promise<string> {
  return ipcRenderer.invoke('storeGet', key);
}

async function storeSet(key: string, val: string | object): Promise<string> {
  return ipcRenderer.invoke('storeSet', key, val);
}

export default {
  message,
  pluginsGetLocal,
  pluginGetLocal,
  pluginInstall,
  pluginsInstall,
  pluginUninstall,
  projectsGetLocal,
  projectGetLocal,
  projectOpen,
  folderSelect,
  storeGet,
  storeSet,
};
