---
title: 'Create a project config'
---

If music project folder does not contain a project.json, you can create a new one using:

    studiorack init

This will create a project.json with your configuration:

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

[Add &amp; remove plugins &gt;](/docs/03-add-remove-plugins)
