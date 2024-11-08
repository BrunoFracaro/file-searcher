# Unused Image Highlighter VS Code Extension

This extension helps developers identify unused media files within their project. It scans all files in the workspace and highlights any media files (like `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`) that are not imported or referenced in your code.

## Features

* Scans all files in the workspace for media files.
* Identifies import statements referencing image paths.
* Highlights unused image files in the side bar with a customizable background color.

## Benefits

* Helps developers clean up unused assets and improve project organization.
* Reduces project size by eliminating unnecessary media files.

## Installation:

1. Open VS Code and go to the Extensions tab (Ctrl+Shift+X on Windows or Command+Shift+X on macOS).
2. Search for "Unused Image Highlighter".
3. Click on the extension and click "Install".

## Usage:

1. Open your workspace in VS Code.
2. The extension will automatically scan your project files in the background.
3. Unused image files will be highlighted in the side bar with a orange textColor and and "Un" badge (customizable in settings).


## Settings:

* You can change the Font Color used to highlight unused media files in the VS Code settings.
* Choose to show the "Un" badge.
* Choose to propagate the colors to the parent folders.
* Search for "Unused Image Highlighter" in the settings editor and adjust to your preferences.
* You can set manually on the settings file with the tags `unused-images-highlighter.fontColor`, `unused-images-highlighter.badge` and `unused-images-highlighter.propagate`.

**Enjoy!**
