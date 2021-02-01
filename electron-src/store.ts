import ElectronStore from 'electron-store';

export const store = new ElectronStore({
  defaults: {
    projectFolder: '/Users/yourname/Library/Mobile Documents/com~apple~CloudDocs/Ableton',
    pluginFolder: '/Library/Audio/Plug-ins/VST3'
  }
});
