import fs from 'fs'
import os from 'os'
const { execSync } = require('child_process');
const glob = require('glob')

const HOME_DIR = os.homedir()
const PLUGIN_DIR = './plugins'

const map: { [key: string]: string; } = {
  category: 'description',
  name: 'name',
  subCategories: 'tags',
  url: 'homepage',
  vendor: 'author',
  version: 'version'
}

export class File {

  readDir(path: string) {
    return glob.sync(path)
  }

  readPlugin(path: string) {
    try {
      const sdout = execSync(`./electron-src/bin/validator "${path}"`).toString()
      return this.processLineByLine(path, sdout)
    } catch (error) {
      return this.processLineByLine(path, error.stdout.toString())
    }
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

  processLineByLine(path: string, logs: string) {
    const json:{ [key: string]: any; } = {};
    // loop through validator output
    for (let line of logs.split('\n')) {
      // remove whitespace at start and end of lines
      line = line.trim();
      // only process lines assigning values
      if (line.includes(' = ')) {
        let [key, val] = line.split(' = ');
        let newVal:any = val;
        // ignore keys with spaces
        if (!key.includes(' ')) {
          // turn bar delimited strings into arrays
          if (newVal.includes('|')) {
            newVal = newVal.split('|');
          }
          // ensure tags is always an array
          if (map[key] === 'tags' && newVal.constructor !== Array) {
            newVal = [newVal];
          }
          // rename and output only fields which exist in our map
          if (map[key]) {
            json[map[key]] = newVal;
          }
        }
      }
    }
    // if we can get filesize then add to json
    const stats = fs.statSync(path);
    if (stats.size) {
      json.size = stats.size;
    }
    // if image exists add to json
    if (fs.existsSync('./plugin.png')) {
      json.image = 'plugin.png';
    }
    // if audio exists add to json
    if (fs.existsSync('./plugin.wav')) {
      json.audio = 'plugin.wav';
    }
    return json;
  }
}
