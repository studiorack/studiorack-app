import api from '../electron-src/api';

declare global {
  interface Window {
    electronAPI: typeof api
  }
}
