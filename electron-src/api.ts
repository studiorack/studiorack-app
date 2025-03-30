import { Package, PackageInterface, PackageVersion, ProjectInterface, ProjectPlugins } from '@open-audio-stack/core';
import { ipcRenderer } from 'electron';

function message(val: string | object) {
  return ipcRenderer.send('message', val);
}

async function pluginsGetLocal(): Promise<Package[]> {
  return ipcRenderer.invoke('pluginsGetLocal');
}

async function pluginGetLocal(id: string): Promise<Package[]> {
  return ipcRenderer.invoke('pluginGetLocal', id);
}

async function pluginInstall(plugin: PackageInterface): Promise<PackageVersion> {
  console.log('pluginInstall api', plugin);
  return ipcRenderer.invoke('pluginInstall', plugin);
}

async function pluginsInstall(plugins: ProjectPlugins): Promise<ProjectPlugins[]> {
  return ipcRenderer.invoke('pluginsInstall', plugins);
}

async function pluginUninstall(plugin: PackageInterface): Promise<PackageVersion> {
  return ipcRenderer.invoke('pluginUninstall', plugin);
}

async function projectsGetLocal(): Promise<Package[]> {
  return ipcRenderer.invoke('projectsGetLocal');
}

async function projectGetLocal(id: string): Promise<ProjectInterface> {
  return ipcRenderer.invoke('projectGetLocal', id);
}

async function projectOpen(path: string): Promise<ProjectInterface> {
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
