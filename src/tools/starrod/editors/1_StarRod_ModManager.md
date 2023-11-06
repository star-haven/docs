# Star Rod Mod Manager

![Screenshot of the Star Rod Mod Manager menu](./img/StarRod_ModManager.png "Star Rod Mod manager")

## Overview

Within the Mod Manager menu you are able to configure Star Rod itself, dump data from a clean Paper Mario ROM into a folder structure with human-readable files, compile your modded files back into a ROM, and package the modded ROM into a patch file for distributing your mod.

* `Mod Folder`: Path to the directory you want to use to store your files while modding.
* `Target ROM`: Path to a clean Paper Mario US v1.0 ROM. Dumped data from the ROM will also be stored here.

## Dumping

* `Dump ROM Assets`: Extract data from the game ROM into a folder structure. Assets dumped include scripting for maps and battles, images like sprites and textures, and text used in dialogue boxes and item descriptions. Also converts these files into more readable formats, like script files into human-readable code, and image files into file types openable by most modern image editor software. **This only needs to be done once.**
* `Options`: Modify Star Rod's settings for the dumping process. For the most part you won't ever need to touch this menu. One of the options in here allows you to choose between tabstop and space indentation within dumped script files, should you prefer one or the other.
* `Copy Assets to Mod`: Copy relevant and previously dumped assets from the dump folder to your mod. This is required to be able to compile the ROM.

## Building

* `Compile Mod`: Attempts to compile the original sources copied to your mod folder together with your modded changes into a new ROM. If this step succeeds, then you can find the resulting ROM within the `out` subfolder within your Mod Folder. If Star Rod is unable to compile your mod for whatever reason, an error message will be shown which tries to explain the problem.
* `Options`: Modify Star Rod's settings for the building process. Some interesting options in here include:
  * `Properties`
    * `Mod Name`: Your mod's title, displayed in the bottom left corner of the Save File Select screen.
    * `Initial Map`: The map to start a newly created save file on.
  * `Options`
    * `Skip Intro Logos`: Skips the intro logos when starting the ROM and instead loads into the intro story immediately.
    * `Disable Intro Story`: Skips the intro story and instead loads into the title screen immediately.
    * `Disable Demo Reel`: Removes the demo reel which usually play automatically when waiting on the title screen for a while.
  * `Debug`
    * `Enable Debug Information`: Shows some debug information during gameplay at the bottom of the screen: Mario's current coordinates, and the currently loaded overworld or battle map. Also enables the debug menu, which can be activated by pressing Dpad-Left.
    * `Enable Variable Logging`: Whenever a global variable changes, displays the name and new value of that variable on screen for a few seconds.
* `Package Mod`: Create a patch file in the `.mod` format from the differences between the original Paper Mario US v1.0 ROM and your compiled mod within the `out` folder. This patch file can then be distributed to others without sharing the ROM directly. **Using this feature not only takes longer than using other software for creating ROM patch files, but also results in patch files that are way bigger. It is recommended to use other software to create your patch files, like [Floating IPS](https://github.com/Alcaro/Flips) for bps patches, or [Xdelta](https://github.com/jmacd/xdelta) for xdelta patches.**
