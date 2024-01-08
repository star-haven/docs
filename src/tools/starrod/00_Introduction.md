# Introduction to Star Rod

Star Rod is a collection of modding tools for Paper Mario 64 (US version 1.0). These tools allow modders to make sweeping changes to the game, from tweaking and rebalancing existing content to adding multiple chapters worth of new content. Paired with a basic text editor, you will be able to add or edit maps, battles, enemies, badges, items, strings, and more. The tools contain a map editor, sprite/animation editor, image editor, and compiler.

## Recommended Software

### Text editor

Star Rod effectively dumps many game assets to text files, which you may edit and compile back into a playable ROM. For this reason, a large part of modding Paper Mario will involve editing text files. Context-sensitive color coding and highlighting help reading these files and prevent basic syntax errors.

We recommend using either *Notepad++* or *Visual Studio Code*. Notepad++ user-defined language files are provided with Star Rod for script files and string files. For VSCode, install [the Star Rod extension](https://marketplace.visualstudio.com/items?itemName=nanaian.vscode-star-rod).

### Image editor

Sprites and textures can be edited in your favorite image editor and converted to the proper format using Star Rod's image editor. Bear in mind that all sprites and most textures use a color-indexed image format with strict limits for the number of colors per image (16 for sprites, 16 or 256 for textures). Many artists prefer using [aseprite](https://www.aseprite.org/) or [libresprite](https://github.com/LibreSprite/LibreSprite) for creating pixel art which can be exported as a color-indexed PNG or imported directly into Star Rod's sprite editor.

### BGM editor

[Mamar](https://mamar.nanaian.town/) lets you create and edit BGM files from MIDI files.
