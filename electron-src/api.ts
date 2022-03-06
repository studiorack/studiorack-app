import { ipcRenderer } from 'electron';
import { PluginInterface } from '@studiorack/core';

function message(val: any) {
  return ipcRenderer.send('message', val);
}

async function pluginsGetLocal(): Promise<any> {
  return ipcRenderer.invoke('pluginsGetLocal');
}

async function pluginGetLocal(id: string): Promise<any> {
  return ipcRenderer.invoke('pluginGetLocal', id);
}

async function pluginInstall(plugin: PluginInterface): Promise<any> {
  console.log('pluginInstall api', plugin);
  return ipcRenderer.invoke('pluginInstall', plugin);
}

async function pluginsInstall(plugins: any): Promise<any> {
  return ipcRenderer.invoke('pluginsInstall', plugins);
}

async function pluginUninstall(plugin: PluginInterface): Promise<any> {
  return ipcRenderer.invoke('pluginUninstall', plugin);
}

async function projectsGetLocal(): Promise<any> {
  return ipcRenderer.invoke('projectsGetLocal');
}

async function projectGetLocal(id: string): Promise<any> {
  return ipcRenderer.invoke('projectGetLocal', id);
}

async function projectOpen(path: string): Promise<any> {
  return ipcRenderer.invoke('projectOpen', path);
}

async function folderSelect(path: string): Promise<any> {
  return ipcRenderer.invoke('folderSelect', path);
}

async function storeGet(key: string): Promise<any> {
  return ipcRenderer.invoke('storeGet', key);
}

async function storeSet(key: string, val: any): Promise<any> {
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
