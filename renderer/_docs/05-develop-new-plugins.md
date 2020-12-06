---
title: 'Develop new plugins'
---

Create a new plugin using the starter template:

    studiorack create myplugin

This creates a new plugin using the starter template with the following structure:

    /myplugin
        /index.js
        /LICENSE
        /README.md
        /src
        /vst2sdk
        /vst3sdk


Follow the instructions at ./myplugin/README.md to install and build your plugin

When ready to release, commit your plugin to Github and then:

1. Publish a Github release containing the plugin source along with metadata `plugins.json`
2. Tag your Github repository with `studiorack-plugin-steinberg` so it can be discovered
3. Wait for the studiorack-registry to index your plugin (every 24 hours)
4. Check the registry feed for your plugin to appear https://studiorack.github.io/studiorack-registry/


[Read the API Reference &gt;](/docs/06-command-line)
