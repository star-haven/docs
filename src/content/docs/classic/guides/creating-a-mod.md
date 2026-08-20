---
title: Creating a Mod
sidebar:
  label: Creating a Mod
---
Star Rod only works with Paper Mario (US v1.0), which Star Rod will validate before using. You will need a clean ROM dumped from your own cartridge and a directory where the project will live.

Packaged releases include their own Java runtime. You do not need to install Java unless you are building Star Rod from source, which requires Java 17.

## Set Up the Project

1. Launch Star Rod and select your clean Paper Mario US v1.0 ROM when prompted.
2. Choose or create a directory for the mod. This becomes `$mod` throughout the manual.
3. Dump the ROM. Star Rod creates a dump directory beside the ROM and converts its assets into editable forms. The first dump takes several minutes.
4. Use **Copy Assets to Mod** to populate the new project from the dump. Do this once when creating the project; afterward, use the original sources under the project's `src/` directories for reference and put your changes in the corresponding `patch/` directories.
5. Make a small change and use **Compile Mod** to verify the setup. The compiled ROM is written under `$mod/out/`.

Normal modding work should not require browsing or editing the dump after this initial copy. If an original project file is damaged or missing, the dump remains available as a clean source from which to restore it.

## Choose an Editor

Much of Paper Mario's data is represented as text in the project. Syntax highlighting makes those files easier to read and helps catch simple mistakes. Notepad++ language files for scripts and strings are distributed with Star Rod. A [Star Rod extension for VS Code](https://marketplace.visualstudio.com/items?itemName=nanaian.vscode-star-rod) is also available.

Sprites and textures can be edited in the image editor of your choice and converted through Star Rod. CI-4 sprite-sheet textures are limited to 16 colors per palette, while other assets may use CI-4, CI-8, intensity, intensity-alpha, or RGBA formats. [Aseprite](https://www.aseprite.org/) is a common choice for indexed pixel art and can also be imported directly by Sprite Editor.

## Build and Distribute

Use **Compile Mod** whenever you need a test ROM. When the mod is ready to share, use **Package Mod** to create a distributable patch which users can apply to their own clean Paper Mario US v1.0 ROM. BPS is the default and widely supported format; the legacy Star Rod `.mod` format remains available from the package format chooser. Do not distribute the patched ROM itself.

See [Project Layout](../reference/project-layout.md) before deciding where to put new source files. The [Command Line reference](../reference/command-line.md) covers automated builds.
