---
title: 'Command line'
---

The StudioRack CLI allows you to create, install, and publish plugins.

* [Create](#create)
* [Init](#init)
* [Install](#install)
* [Uninstall](#uninstall)
* [Search](#search)
* [Start](#start)
* [Validate](#validate)
* [Help](#help)


## Create

`studiorack create <folder> --type steinberg` creates a new plugin using the starter template with the following structure:

    /folder
        /index.js
        /LICENSE
        /README.md
        /src
        /vst2sdk
        /vst3sdk

Follow the instructions in generated README.md to install and build your plugin.


## Init

`studiorack init` initiates the current folder as a studiorack project. This will create a project.json with your configuration:

    {
      "name": "My Project",
      "version": "0.0.1",
      "description": "My project description",
      "main": "Song.als",
      "audio": "Song.wav",
      "image": "Song.png",
      "plugins": {
        "plugin-name": "1.0.0"
      }
    }


## Install

`studiorack install [options] [id]` adds a plugin and updates the project.json config. For example:

    studiorack install studiorack/studiorack-plugin-steinberg/adelay --global


## Uninstall

`studiorack uninstall [options] [id]` removes a plugin and updates the project.json config. For example:

    studiorack uninstall studiorack/studiorack-plugin-steinberg/adelay --global


## Search

`studiorack search [options] <query>` Search plugin registry by query. For example:

    studiorack search delay


## Start

`studiorack start [path]` open the current music project. For example:

    studiorack start


## Validate

`studiorack validate [options] [path]` Validate a plugin using the Steinberg VST3 SDK validator. For example:

    studiorack validate ./plugins/**/*.vst3


## Help

`studiorack --help` lists the available CLI commands which looks like this:

    Usage:
        studiorack [options] [command]

    Options:
        -V, --version             output the version number
        -h, --help                display help for command

    Commands:
        create <folder>            Create a new folder using the plugin starter template
        init                       Set up a new or existing StudioRack project.
        install [options] [id]     Install a plugin and update project config.
        uninstall [options] [id]   Uninstall a plugin and update project config.
        search [options] <query>   Search plugin registry by query.
        start [path]               Start music project using the project config.
        validate [options] [path]  Validate a plugin using the Steinberg VST3 SDK validator
        help [command]             display help for command
