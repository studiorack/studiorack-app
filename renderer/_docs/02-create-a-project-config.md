---
title: 'Create a project config'
---

If music project folder does not contain a project.json, you can create a new one using:

    studiorack init

This will create a project.json with your configuration:

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

[Add &amp; remove plugins &gt;](/docs/03-add-remove-plugins)
