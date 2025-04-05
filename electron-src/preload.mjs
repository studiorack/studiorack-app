// This file is intentionally .mjs to ensure Electron treats it as an ES module.
// https://www.electronjs.org/docs/latest/tutorial/esm
import { contextBridge } from 'electron';
import { get, install, installDependencies, message, open, select, set, uninstall } from './api.js';

contextBridge.exposeInMainWorld('electronAPI', {
  get,
  install,
  installDependencies,
  message,
  open,
  select,
  set,
  uninstall,
});
