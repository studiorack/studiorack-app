---
title: 'Command line'
---

The StudioRack CLI allows you to create, install, and publish plugins.

Configuration commands:

* [Config get](#config-get)
* [Config set](#config-set)

Plugin commands:

* [Plugin create](#plugin-create)
* [Plugin get](#plugin-get)
* [Plugin getLocal](#plugin-getlocal)
* [Plugin install](#plugin-install)
* [Plugin list](#plugin-list)
* [Plugin listLocal](#plugin-listlocal)
* [Plugin search](#plugin-search)
* [Plugin uninstall](#plugin-uninstall)

Project commands:

* [Project create](#project-create)
* [Project getLocal](#project-getlocal)
* [Project install](#project-install)
* [Project listLocal](#project-listlocal)
* [Project open](#project-open)
* [Project uninstall](#project-uninstall)

Other commands:

* [Validate](#validate)
* [Help](#help)


## Config get

`studiorack config get <key>` Get a config setting by key. List of keys available:

    extAudio: string;
    extFile: string;
    extImage: string;
    extZip: string;
    ignoredFolders: string[];
    pluginFile: string;
    pluginFolder: string;
    pluginRegistry: string;
    pluginRelease: string;
    pluginTemplate: string;
    pluginTypes: PluginTypes;
    projectFile: string;
    projectFolder: string;
    projectRegistry: string;
    projectTypes: ProjectTypes;
    validatorUrl: string;


## Config set

`studiorack config set set <key> <val>` Get a config setting by key. List of keys and values available:

    extAudio: string;
    extFile: string;
    extImage: string;
    extZip: string;
    ignoredFolders: string[];
    pluginFile: string;
    pluginFolder: string;
    pluginRegistry: string;
    pluginRelease: string;
    pluginTemplate: string;
    pluginTypes: PluginTypes;
    projectFile: string;
    projectFolder: string;
    projectRegistry: string;
    projectTypes: ProjectTypes;
    validatorUrl: string;


## Plugin create

`studiorack plugin create <path> --type <type>` creates a new plugin using the starter template with one of the types:

    dplug
    iplug
    juce
    steinberg

Follow the instructions in generated README.md to install and build your plugin.


## Plugin get

`studiorack plugin get <input>` Get registry plugin metadata by id:

    $ studiorack plugin get studiorack/studiorack-template-steinberg/adelay
    ┌────────────────────────────────────┬────────────────────┬─────────────┬────────────┬─────────┬───────────┐
    │ Id                                 │ Name               │ Description │ Date       │ Version │ Tags      │
    ├────────────────────────────────────┼────────────────────┼─────────────┼────────────┼─────────┼───────────┤
    │ studiorack/template-steinberg/adelay │ ADelayTest Factory │ Test Class  │ 2020-12-25 │ 1.1.0   │ Fx, Delay │
    └────────────────────────────────────┴────────────────────┴─────────────┴────────────┴─────────┴───────────┘


## Plugin getLocal

`studiorack plugin getLocal <input>` Get local plugin details by id:

    $ studiorack plugin getLocal studiorack/studiorack-template-steinberg/adelay
    ┌────────────────────────────────────┬────────────────────┬─────────────┬────────────┬─────────┬───────────┐
    │ Id                                 │ Name               │ Description │ Date       │ Version │ Tags      │
    ├────────────────────────────────────┼────────────────────┼─────────────┼────────────┼─────────┼───────────┤
    │ studiorack/template-steinberg/adelay │ ADelayTest Factory │ Test Class  │ 2020-12-25 │ 1.1.0   │ Fx, Delay │
    └────────────────────────────────────┴────────────────────┴─────────────┴────────────┴─────────┴───────────┘


## Plugin install

`studiorack plugin install <input>` Install a plugin manually by id:

    studiorack plugin install studiorack/studiorack-template-steinberg/adelay


## Plugin list

`studiorack plugin list` List registry plugins:

    $ studiorack plugin list
    ┌────────────────────────────────┬────────────────────┬────────────────┬────────────┬─────────┬───────────┐
    │ Id                             │ Name               │ Description    │ Date       │ Version │ Tags      │
    ├────────────────────────────────┼────────────────────┼────────────────┼────────────┼─────────┼───────────┤
    │ ryukau/vstplugins/seven-delay  │ SevenDelay         │ A stereo delay │ 2020-12-11 │ 0.1.14  │ Fx, Delay │
    ├────────────────────────────────┼────────────────────┼────────────────┼────────────┼─────────┼───────────┤
    │ steinberg/adelay               │ ADelayTest Factory │ Test Class     │ 2020-12-25 │ 1.1.0   │ Fx, Delay │
    ├────────────────────────────────┼────────────────────┼────────────────┼────────────┼─────────┼───────────┤
    │ steinberg/channelcontext       │ ContextController  │ Component      │ 2020-12-25 │ 1.0.0   │ Spatial,  │
    └────────────────────────────────┴────────────────────┴────────────────┴────────────┴─────────┴───────────┘


## Plugin listLocal

`studiorack plugin listLocal` Get local plugin details by id:

    $ studiorack plugin listLocal
    ┌────────────────────────────────────┬────────────────────┬─────────────┬────────────┬─────────┬───────────┐
    │ Id                                 │ Name               │ Description │ Date       │ Version │ Tags      │
    ├────────────────────────────────────┼────────────────────┼─────────────┼────────────┼─────────┼───────────┤
    │ studiorack/plugin-steinberg/adelay │ ADelayTest Factory │ Test Class  │ 2020-12-25 │ 1.1.0   │ Fx, Delay │
    └────────────────────────────────────┴────────────────────┴─────────────┴────────────┴─────────┴───────────┘


## Plugin search

`studiorack search <query>` Search plugin registry by query. For example:

    studiorack plugin search "delay"


## Plugin uninstall

`studiorack plugin <input>` Uninstall a plugin manually by id:

    studiorack plugin uninstall studiorack/studiorack-template-steinberg/adelay


## Project create

`studiorack project create <path>` creates a new project using the starter template.


## Project getLocal

`studiorack project getLocal <input>` Get local project details by id:

    $ studiorack project getLocal demos/94th-project/94th
    ┌─────────────────────────┬──────┬──────────────────────────┬────────────┬─────────┬─────────┐
    │ Id                      │ Name │ Description              │ Date       │ Version │ Tags    │
    ├─────────────────────────┼──────┼──────────────────────────┼────────────┼─────────┼─────────┤
    │ demos/94th-project/94th │ 94th │ Created using StudioRack │ 2021-01-29 │ 1.0.0   │ Ableton │
    └─────────────────────────┴──────┴──────────────────────────┴────────────┴─────────┴─────────┘


## Project install

`studiorack project install <id> [input]` Install a project by id:

    studiorack project install demos/94th-project/94th


## Project listLocal

`studiorack project listLocal` Get local plugin details by id:

    $ studiorack project listLocal
    ┌─────────────────────────────────┬──────────────────┬──────────────────────────┬────────────┬─────────┬──────────┐
    │ Id                              │ Name             │ Description              │ Date       │ Version │ Tags     │
    ├─────────────────────────────────┼──────────────────┼──────────────────────────┼────────────┼─────────┼──────────┤
    │ /cubase-example                 │ Cubase Example   │ Created using StudioRack │ 2021-01-27 │ 1.0.0   │ Cubase   │
    ├─────────────────────────────────┼──────────────────┼──────────────────────────┼────────────┼─────────┼──────────┤
    │ demos/94th-project/94th         │ 94th             │ Created using StudioRack │ 2021-01-29 │ 1.0.0   │ Ableton  │
    ├─────────────────────────────────┼──────────────────┼──────────────────────────┼────────────┼─────────┼──────────┤
    │ demos/alfredo-project/alfredo   │ Alfredo          │ Created using StudioRack │ 2020-10-24 │ 1.0.0   │ Ableton  │
    └─────────────────────────────────┴──────────────────┴──────────────────────────┴────────────┴─────────┴──────────┘


## Project open

`studiorack project open <id>` open the current music project. For example:

    studiorack project open demos/94th-project/94th


## Project uninstall

`studiorack project uninstall <id> [input]` Uninstall a project's plugins by id:

    studiorack plugin uninstall studiorack/studiorack-template-steinberg/adelay


## Validate

`studiorack validate [path]` Validate plugin(s) using the Steinberg VST3 SDK validator. For example:

    studiorack validate "./myplugin/build/VST3/Release/myplugin.vst3"
    studiorack validate "./myplugin/build/VST3/Release/**/*.{vst,vst3}"


## Help

`studiorack --help` lists the available CLI commands:

    Usage:
      studiorack [options] [command]

    Options:
      -V, --version              output the version number
      -h, --help                 display help for command

    Commands:
      config                     View/update configuration
      plugin                     View/add/remove individual plugins
      project                    View/update projects
      validate [options] [path]  Validate a plugin using the Steinberg VST3 SDK validator
      help [command]             display help for command
