import fs from 'fs'
import os from 'os'
const AdmZip = require('adm-zip');
const { execSync } = require('child_process')
const fsUtils = require('nodejs-fs-utils')
const glob = require('glob')
const path = require('path')

const HOME_DIR = os.homedir()
const PLUGIN_DIR = './plugins'

const VALIDATOR_DIR = path.join(__dirname.substring(0, __dirname.lastIndexOf('main')), 'electron-src', 'bin');
const VALIDATOR_EXT = getPlatformPrefix() === 'win' ? '.exe' : '';
const VALIDATOR_PATH = path.join(VALIDATOR_DIR, 'validator' + VALIDATOR_EXT);

const map: { [key: string]: string } = {
  category: 'description',
  name: 'name',
  subCategories: 'tags',
  url: 'homepage',
  vendor: 'author',
  version: 'version'
}

function getPlatformPrefix() {
  switch (process.platform as string) { 
    case 'darwin' : return 'mac';
    case 'win32' : return 'win';
    case 'win64' : return 'win';
    default : return 'linux';
  }
}

export class File {

  createDirectory(path: string) {
    if (!fs.existsSync(path)) {
      return fs.mkdirSync(path, { recursive: true });
    }
  }

  createFile(path: string, data: any) {
    return fs.writeFileSync(path, data)
  }

  createFileJson(path: string, data: object) {
    return this.createFile(path, JSON.stringify(data, null, 2))
  }

  deleteDirectory(path: string) {
    if (fs.existsSync(path)) {
      return fs.rmdirSync(path, { recursive: true });
    }
  }

  directoryEmpty(path: string) {
    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === '.DS_Store');
  }

  exists(path: string) {
    return fs.existsSync(path)
  }

  extractZip(content: any, path: string) {
    const zip = new AdmZip(content);
    return zip.extractAllTo(path);
  }

  loadFileJson(path: string) {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path).toString())
    } else {
      return false
    }
  }

  readDir(path: string) {
    return glob.sync(path)
  }

  readPlugin(pathItem: string) {
    if (!this.directoryExists(pathItem)) {
      console.error(`File does not exist: ${pathItem}`);
      return false;
    }
    console.log(`Reading: ${pathItem}`);
    const outputText = this.run(pathItem);
    const outputJson = this.processLog(pathItem, outputText);
    const filepath = pathItem.substring(0, pathItem.lastIndexOf('.'));

    console.log(outputText);
    this.createFile(`${filepath}.txt`, outputText);
    console.log(`Generated: ${filepath}.txt`);

    console.log(outputJson);
    this.createFileJson(`${filepath}.json`, outputJson);
    console.log(`Generated: ${filepath}.json`);

    return outputJson;
  }

  run(path: string) {
    // Run Steinberg VST3 SDK validator binary
    try {
      const sdout = execSync(`${VALIDATOR_PATH} "${path}"`);
      return sdout.toString();
    } catch (error) {
      return error.output ? error.output.toString() : error.toString();
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

  getSource(repoId: string, pluginId: string, version: string) {
    var supported:any = {
      'aix': 'linux',
      'darwin': 'mac',
      'freebsd': 'linux',
      'linux': 'linux',
      'openbsd': 'linux',
      'sunos': 'linux',
      'win32': 'win',
      'win64': 'win'
    }
    if (supported[process.platform]) {
      return `https://github.com/${repoId}/releases/download/v${version}/${pluginId}-${supported[process.platform]}.zip`;
    }
    return false;
  }

  getDate(pathItem: string) {
    return fs.statSync(pathItem).mtime;
  }
  
  getSize(pathItem: string) {
    return fsUtils.fsizeSync(pathItem);
  }

  directoryExists(path: string) {
    return fs.existsSync(path);
  }

  processLog(pathItem: string, log: string) {
    const folder = pathItem.substring(0, pathItem.lastIndexOf('/'));
    // console.log('processLog', pathItem);
    const json:{ [key: string]: any } = {}
    // loop through validator output
    for (let line of log.split('\n')) {
      // remove whitespace at start and end of lines
      line = line.trim();
      // only process lines assigning values
      if (line.includes(' = ')) {
        let [key, val] = line.split(' = ');
        let newVal:any = val
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
    // get date then add to json
    const date = this.getDate(pathItem);
    if (date) {
      json.date = date.toISOString();
    }
    // get filesize then add to json
    const size = this.getSize(pathItem);
    if (size) {
      json.size = size;
    }
    // generate the id from the filename
    const id = path.basename(pathItem, path.extname(pathItem))
    if (id) {
      json.id = id;
    }
    // generate the id from the filename
    const filename = path.basename(pathItem)
    if (filename) {
      json.file = filename;
    }
    // if image exists add to json
    if (this.directoryExists(`${folder}/${id}.png`)) {
      json.image = `${id}.png`;
    }
    // if audio exists add to json
    if (this.directoryExists(`${folder}/${id}.wav`)) {
      json.audio = `${id}.wav`;
    }
    return json;
  }
}
