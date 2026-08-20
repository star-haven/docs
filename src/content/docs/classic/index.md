---
title: 1. Introduction
sidebar:
  label: Introduction
  order: 1
---

> **Note:** Star Rod Classic is legacy software, but still receives bug fixes for users who prefer its ROM-patching workflow. Throughout the rest of this manual, *Classic* is omitted from the name unless there is a reason to distinguish the two versions.

Star Rod Classic is a collection of modding tools for Paper Mario 64 (US version 1.0). It can be used for anything from tweaking and rebalancing the original game to adding several chapters of new content. Paired with a text or code editor, it lets you add or edit maps, battles, enemies, badges, items, messages, and more. Classic works with the original ROM and does not support the decompiled version of the game; the newer [Star Rod](https://github.com/z64a/star-rod) is designed for projects based on the [Paper Mario decompilation](https://github.com/pmret/papermario) and [Paper Mario DX](https://github.com/bates64/papermario-dx). This introduction will serve as a tour of the Paper Mario engine and the suite Star Rod tools.

Star Rod includes editors for visual assets and a custom MIPS assembler for modifying or writing game code. Most of your edits will come from handwritten **patch files** which modify or extend the game using Star Rod's own patching language. A text or code editor with syntax highlighting is strongly recommended for this. Star Rod includes language definitions for Notepad++ in its `database/` directory, and a [Star Rod extension](https://marketplace.visualstudio.com/items?itemName=nanaian.vscode-star-rod) is available for Visual Studio Code. [Aseprite](https://www.aseprite.org/) is a popular choice for sprites and other pixel art, though any image editor which can edit color-paletted PNGs will work.

To begin using Star Rod, download the [latest release](https://github.com/z64a/star-rod-classic/releases/latest) for your operating system and extract the archive. On Windows, launch `StarRod.bat`. On macOS or Linux, run `./StarRod` from the extracted directory. Releases include their own Java runtime, so Java does not need to be installed separately. You may also launch directly from the JAR if your system has a compatible version of Java installed.

The available tools are:

| Tool | Purpose |
| --- | --- |
| **Mod Manager** | Switches between projects, dumps game assets, and builds modded ROMs. |
| **Globals Editor** | Edits the game's global item and move tables. |
| **Level Editor** | Organizes maps into areas and edits their project configuration and resources. |
| **Map Editor** | Edits map geometry, collision, and other properties. |
| **Image Editor** | Previews and converts PNGs to formats compatible with the game. |
| **Sprite Editor** | Edits NPC and player sprites, palettes, and animations. |
| **String Editor** | Edits and previews the game's text. |
| **World Map Editor** | Edits the locations and paths shown on the world map. |
| **Audio Booth** | Browses and previews music and sound effects. |
| **Themes** | Changes the appearance of Star Rod's interface. |

In the next section, we will take a high-level overview of the Paper Mario engine, its organization, and its concepts, before returning to Star Rod.