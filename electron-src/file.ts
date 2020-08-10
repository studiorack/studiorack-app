import os from 'os'
const glob = require('glob')

const HOME_DIR = os.homedir()
const PLUGIN_DIR = './plugins'

export class File {

  readDir(path: string) {
    return glob.sync(path)
  }

  getPluginFolder(global?: Boolean) {
    const supported:any = {
      'aix': HOME_DIR + '/.vst3',
      'darwin': '/Library/Audio/Plug-ins/VST3',
      'freebsd': HOME_DIR + '/.vst3',
      'linux': HOME_DIR + '/.vst3',
      'openbsd': HOME_DIR + '/.vst3',
      'sunos': HOME_DIR + '/.vst3',
      'win32': '/Program Files/Common Files/VST3',
      'win64': '/Program Files/Common Files/VST3'
    }
    if (global) {
      return supported[process.platform]
    } else {
      return PLUGIN_DIR
    }
  }
}
