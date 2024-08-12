// This file is intentionally .mjs to ensure Electron treats it as an ES module.
// https://www.electronjs.org/docs/latest/tutorial/esm
import { contextBridge } from 'electron';
import api from './api.js';

contextBridge.exposeInMainWorld('electronAPI', api);
