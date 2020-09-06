import fs from 'fs'
import os from 'os'
const { execSync } = require('child_process')
const fsUtils = require('nodejs-fs-utils')
const glob = require('glob')

const HOME_DIR = os.homedir()
const PLUGIN_DIR = './plugins'
const VALIDATOR_PATH = './electron-src/bin'

const map: { [key: string]: string } = {
  category: 'description',
  name: 'name',
  subCategories: 'tags',
  url: 'homepage',
  vendor: 'author',
  version: 'version'
}

export class File {

  createFile(path: string, data: any) {
    return fs.writeFileSync(path, data)
  }

  createFileJson(path: string, data: object) {
    return this.createFile(path, JSON.stringify(data, null, 2))
  }

  exists(path: string) {
    return fs.existsSync(path)
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

  readPlugin(path: string) {
    if (!this.exists(path)) {
      console.error(`File does not exist: ${path}`)
      return false
    }
    console.log(`Reading: ${path}`)
    let output = this.run(path)
    const filepath = path.substring(0, path.lastIndexOf('.'))

    console.log(output)
    this.createFile(`${filepath}.txt`, output)
    console.log(`Generated: ${filepath}.txt`)

    output = this.processLog(path, output)
    console.log(output)
    this.createFileJson(`${filepath}.json`, output)
    console.log(`Generated: ${filepath}.json`)

    return output
  }

  run(path: string) {
    // Run Steinberg VST3 SDK validator binary
    try {
      const sdout = execSync(`${VALIDATOR_PATH}/validator "${path}"`)
      return sdout.toString()
    } catch (error) {
      return error.output ? error.output.toString() : error.toString()
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

  processLog(path: string, logs: string) {
    const json:{ [key: string]: any } = {}
    // loop through validator output
    for (let line of logs.split('\n')) {
      // remove whitespace at start and end of lines
      line = line.trim()
      // only process lines assigning values
      if (line.includes(' = ')) {
        let [key, val] = line.split(' = ')
        let newVal:any = val
        // ignore keys with spaces
        if (!key.includes(' ')) {
          // turn bar delimited strings into arrays
          if (newVal.includes('|')) {
            newVal = newVal.split('|')
          }
          // ensure tags is always an array
          if (map[key] === 'tags' && newVal.constructor !== Array) {
            newVal = [newVal]
          }
          // rename and output only fields which exist in our map
          if (map[key]) {
            json[map[key]] = newVal
          }
        }
      }
    }
    // if we can get filesize then add to json
    const size = fsUtils.fsizeSync(path)
    if (size) {
      json.size = size
    }
    // if image exists add to json
    if (fs.existsSync('./plugin.png')) {
      json.image = 'plugin.png'
    }
    // if audio exists add to json
    if (fs.existsSync('./plugin.wav')) {
      json.audio = 'plugin.wav'
    }
    json.status = 'installed'
    return json
  }
}
