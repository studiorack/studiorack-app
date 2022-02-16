---
title: 'Develop new plugins'
---

## Use our plugin templates (optional)

We have plugin templates which automate plugin builds

- [studiorack-template-dpf](https://github.com/studiorack/studiorack-template-dpf)
- [studiorack-template-dplug](https://github.com/studiorack/studiorack-template-dplug)
- [studiorack-template-iplug](https://github.com/studiorack/studiorack-template-iplug)
- [studiorack-template-juce](https://github.com/studiorack/studiorack-template-juce)
- [studiorack-template-sfz](https://github.com/studiorack/studiorack-template-sfz)
- [studiorack-template-steinberg](https://github.com/studiorack/studiorack-template-steinberg)

You can fork the repos on GitHub or use our command line tool. Create a new plugin using a starter template (dplug, iplug, juce, steinberg):

    studiorack plugin create myplugin --type steinberg

This creates a new plugin using the starter template with the following structure:

    /myplugin
        /index.js
        /LICENSE
        /README.md
        /src
        /vst3sdk

Follow the instructions at `./myplugin/README.md` to install and build your plugin

## Publish a GitHub release

Commit your plugin code to GitHub. When ready to release a version, publish a GitHub Release along with the following files:

- `your-plugin-linux.zip `- Linux build
- `your-plugin-mac.zip` - Mac build
- `your-plugin-win.zip` - Windows build
- `your-plugin.png` - Screenshot of your plugin
- `your-plugin.wav` - Audio preview of the sound (using a midi or piano middle-C key)
- `plugins.json` - Plugin metadata for the registry

`plugins.json` should use the following format:

    {
      "plugins": [
        {
          "author": "Your Name",
          "homepage": "https://www.yoursite.com",
          "name": "Your Plugin Name",
          "description": "Test Class",
          "tags": [
            "Fx",
            "Delay"
          ],
          "version": "1.1.0",
          "id": "your-plugin",
          "date": "2020-12-09T17:25:12.081Z",
          "files": {
            "audio": {
              "name": "your-plugin.wav",
              "size": 352844
            },
            "image": {
              "name": "your-plugin.png",
              "size": 35091
            },
            "linux": {
              "name": "your-plugin-linux.zip",
              "size": 13089625
            },
            "mac": {
              "name": "your-plugin-mac.zip",
              "size": 13089625
            },
            "win": {
              "name": "your-plugin-win.zip",
              "size": 13089625
            }
          }
        }
      ]
    }

## Add the topic to your repo

Add the `studiorack-plugin` topic to your GitHub repository, so it can be discovered. Wait for the studiorack-registry to index your plugin (every 24 hours). Check the registry feed for your plugin to appear https://studiorack.github.io/studiorack-registry/. Soon afterwards the site will also build, and your plugin will be available at: https://studiorack.github.io/studiorack-site/

[Read the API Reference &gt;](/docs/06-command-line)
