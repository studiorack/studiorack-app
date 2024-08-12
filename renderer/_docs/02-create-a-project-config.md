---
title: 'Create a project config'
---

It is possible to install plugins by running `studiorack plugin install` commands directly. These will be shared system-wide.

However to fully benefit from plugin management and versioning, it is recommended to use a `project.json` file, which tracks the plugin versions for each specific project.

Create a new studiorack `project.json` file using:

    studiorack project create <project-id>

This will create a studiorack .json file with your configuration:

    {
      "id": "example",
      "author": "studiorack-user",
      "homepage": "https://studiorack.github.io/studiorack-site/",
      "name": "StudioRack Project",
      "description": "Created using StudioRack",
      "tags": [
        "StudioRack"
      ],
      "version": "1.0.0",
      "date": "2021-05-30T21:58:39.138Z",
      "type": {
        "name": "Ableton",
        "ext": "als"
      },
      "files": {
        "audio": {
          "name": "example.wav",
          "size": 1902788
        },
        "image": {
          "name": "example.png",
          "size": 16360
        },
        "project": {
          "name": "example.als",
          "size": 253018
        }
      },
      "plugins": {},
      "path": "songs/april",
      "status": "installed"
    }

[Add &amp; remove plugins &gt;](/docs/03-add-remove-plugins)
