import { ConfigInterface, Package, PackageVersion, RegistryType } from '@open-audio-stack/core';
import { ipcRenderer } from 'electron';

export function message(val: string | object) {
  return ipcRenderer.send('message', val);
}

export async function install(type: RegistryType, pkg: Package): Promise<PackageVersion> {
  console.log('install api', type, pkg);
  return ipcRenderer.invoke('install', type, pkg);
}

export async function uninstall(type: RegistryType, pkg: Package): Promise<PackageVersion> {
  console.log('uninstall api', type, pkg);
  return ipcRenderer.invoke('uninstall', type, pkg);
}

export async function installDependencies(filePath: string, type = RegistryType.Plugins): Promise<any> {
  return ipcRenderer.invoke('installDependencies', filePath, type);
}

export async function open(filePath: string): Promise<Buffer> {
  return ipcRenderer.invoke('open', filePath);
}

export async function select(filePath: string): Promise<Electron.OpenDialogReturnValue> {
  return ipcRenderer.invoke('select', filePath);
}

export async function get(key: keyof ConfigInterface): Promise<string> {
  console.log('get api', key);
  return ipcRenderer.invoke('get', key);
}

export async function set(key: keyof ConfigInterface, val: string | object): Promise<void> {
  console.log('set api', key, val);
  return ipcRenderer.invoke('set', key, val);
}
