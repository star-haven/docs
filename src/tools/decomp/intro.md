# Introduction to decomp modding

**Decomp**, or **papermario**, refers to the [Paper Mario decompilation](https://papermar.io). This is a project which contains reverse-engineered C code which can be compiled into the original game ROM.

Decomp modding is initially harder than Star Rod modding, but it is significantly more powerful. You can write C instead of assembly and modify any engine function or script source code directly without using patch files.

Decomp modding also supports versions other than the US release: JP, PAL, and iQue. At time of writing, only the US release has been 100% matched so we will only discuss modding US here.

## Recommended Software

### Text editor

We recommend using *Visual Studio Code*. When opening the repo, a popup will appear asking if you want to install recommended extensions - make sure you click _Yes_.

### Image editor

Sprites and textures can be edited in your favorite image editor. Bear in mind that all sprites and most textures use a color-indexed image format with strict limits for the number of colors per image (16 for sprites, 16 or 256 for textures). Many artists prefer using [aseprite](https://www.aseprite.org/) or [libresprite](https://github.com/LibreSprite/LibreSprite) for creating pixel art which can be exported as a color-indexed PNG.

### BGM editor

[Mamar](https://mamar.nanaian.town/) lets you create and edit BGM files from MIDI files.

### Star Rod

Star Rod has a decomp mode which is triggered by opening the decomp repo as the mod folder. This allows you to use Star Rod to edit maps and sprites.
