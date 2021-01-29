---
title: 'Create a project config'
---

If music project folder does not contain a project.json, you can create a new one using:

    studiorack init

This will create a project.json with your configuration:

    {
      "author": "yourname",
      "homepage": "https://yoursite.com",
      "name": "My Song",
      "description": "Chillout tune",
      "tags": [
        "ableton"
      ],
      "version": "1.0.0",
      "date": "2021-01-29T01:09:28.701Z",
      "type": "ableton",
      "files": {
        "project": {
          "name": "My Song.als",
          "size": 253018
        },
        "audio": {
          "name": "My Song.wav",
          "size": 1902788
        },
        "image": {
          "name": "My Song.png",
          "size": 16360
        }
      },
      "plugins": {},
      "id": "yourname/my-song",
      "path": "/Users/yourname/Ableton/My Song.als",
      "slug": "yourname_my-song"
    }

[Add &amp; remove plugins &gt;](/docs/03-add-remove-plugins)
