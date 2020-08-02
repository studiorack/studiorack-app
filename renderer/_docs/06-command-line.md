---
title: 'Command line'
---

The StudioRack CLI allows you to create, install, and publish plugins.

* [Create](#create)
* [Init](#init)
* [Install](#install)
* [Uninstall](#uninstall)
* [Publish](#publish)
* [Search](#search)
* [Start](#start)
* [Help](#help)


## Create

`studiorack create <folder>` creates a new plugin using the starter template with the following structure:

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
      "name": "Example audio project",
      "version": "1.0.0",
      "description": "Example audio project description",
      "main": "Test.als",
      "preview": {
        "audio": "Test.wav",
        "image": "Test.png"
      },
      "plugins": {
        "plugin-name": "1.0.0"
      }
    }


## Install

`studiorack install [options] [id]` adds a plugin and updates the project.json config. For example:

    studiorack install kmturley/studiorack-plugin --global


## Uninstall

`studiorack uninstall [options] [id]` removes a plugin and updates the project.json config. For example:

    studiorack uninstall kmturley/studiorack-plugin --global


## Publish

`studiorack publish` opens a pull request to the main GitHub registry. For example:

    studiorack publish


## Search

`studiorack search <query>` search the plugin registry for plugins by name. For example:

    studiorack search delay


## Start

`studiorack start [path]` open the current music project. For example:

    studiorack start


## Help

`studiorack --help` lists the available CLI commands which looks like this:

    Usage:
        studiorack [options] [command]

    Options:
        -V, --version             output the version number
        -h, --help                display help for command

    Commands:
        create <folder>           Create a new folder using the plugin starter template
        init                      Set up a new or existing StudioRack project.
        install [options] [id]    Install a plugin and update project config.
        uninstall [options] [id]  Uninstall a plugin and update project config.
        publish                   Publish plugin to the registry
        search <query>            Search plugin registry by query.
        start [path]              Start music project using the project config.
        help [command]            display help for command
