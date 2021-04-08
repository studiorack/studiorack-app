import ElectronStore from 'electron-store';
import { configGet } from '@studiorack/core';

export const store = new ElectronStore({
  defaults: {
    projectFolder: configGet('projectFolder'),
    pluginFolder: configGet('pluginFolder')
  }
});
