# How to Create Your Mod

## Star Rod Tools

The next time you launch Star Rod, you'll be prompted to open the Map Editor, Sprite Editor, Mod Manager and several other tools.

<img class="right" src="./img/StarRodToolsMenu.png" alt="Screenshot of the Star Rod Tools menu">

Use the [Mod Manager](./editors/1_StarRod_ModManager.md) to compile and package your mod. This is required to turn the directories of files in you modding directory into a new ROM.

Use the **Globals Editor** to edit items, badges, images and more. To edit the scripting of items or badges you'll need to actually write scripts yourself though, this menu cannot be used for that.

Use the [String Editor](./editors/3_StarRod_StringEditor.md) to preview, add, delete or edit ingame text.

Use the **Level Editor** to modify the way maps and battle maps are organized.

Use the **Map Editor** to view, create and modify the ingame maps.

Use the **Sprite Editor** to adjust sprites of characters and items, as well as view, create and edit animation loops.

Use the **World Map** Editor to change the world map displayed in the pause menu.

Use the [Themes menu](./editors/9_StarRod_Themes.md) to change the look of Star Rod itself.

For changing the scripting of maps, battles, badges and more, please see:
TODO link to yet non-existing guide
TODO link the bold editor mentions above to respective tutorials

**Note**:
Some of Star Rod's graphical editors, like the Map Editor or Sprite Editor, do require OpenGL to run. While OpenGL should be installed by any general graphics card driver installation, or come pre-installed on most operating systems, these editors are known to cause issues or not load at all on some MacOS or Linux setups.
If you use MacOS or Linux, then some of Star Rod's editors may not load at all, instead freezing the program. Sadly, there is no known work-around at the moment.
Using Windows however causes no known problems with OpenGL.

## Debug Features

When compiling your mod in the [Mod Manager](./editors/1_StarRod_ModManager.md), set the `Enable Debug Information` option in the Compile Mod options > Debug menu to display map names and battle IDs at the bottom of the screen. The player's current position will also be printed.
This also enables the debug features, which can be accessed using the D-Pad buttons:

* Dpad-Up toggles turbo speed and makes enemies unable to start combat with Mario on contact.
* Dpad-Right opens the debug variable output and memory usage.
* Dpad-Down toggles God Mode, which makes Mario invulnerable to most damage, and makes every attack by Mario or partner deal 99 damage per hit.
* Dpad-Left toggles the debug menu, which can then be navigated using the Dpad, using R to enter menus / confirm choices, and L to cancel out of a menu. This menu allows for map warps, giving items and badges, unlocking partners and more.

## How to Publish Your Mod

When you're satisfied with your romhack and it compiles successfully, click `Package Mod`in the **Mod Manager** to create a binary diff file, also known as patch file (`YourModName.mod`). The player will need your .mod file (provided by you) and a clean copy of Paper Mario's NTSC-U ROM (provided by them).
**Do not distribute patched ROMs!**
The name of the resulting ROM will be identical to the name of your .mod file.

However, it is recommended to use external tools to create patch files for your mod, like Floating IPS (or FLIPS) (<https://github.com/Alcaro/Flips>). Creating a patch file using such a tool will likely create a smaller patch file (like a .bps file) than using Star Rod to package your mod would, while being faster at creating the patch file as well.

## The Mod Directory Explained

The mod directory created and populated by Star Rod contains several folders you'll need for creating your romhack.
For some of the files in here you can use the editors provided by Star Rod mentioned above. Scripts, which control how maps and battles behave, have no editor associated with them and have to be edited by hand.
Those scripts are modified using patch files, and not by editing the source files of maps and battles directly. The files in the `src` directories are for quick reference only, instead create patch files in the respective patch directories. `xml` files and images are edited in-place however, instead of writing patch files for them.

The directories within the mod directory are the following:

```plain
/map/src/        Source files of maps scripts and editor map files
                 (copied from dump). For reference only, do not edit.
/map/patch/      Patch files for editing scripts or creating new ones.
/map/import/     Patch files here can be included in map scripts with
                 #import.
/map/save/       Save map files from the editor here to reference them
                 in scripts.
/map/build/      Binary map and collision data built from the editor.
/map/temp/       Patched map scripts are placed here during the patching
                 process. Just ignore this directory.

/world/          Scripting for the overworld behavior of partners.

/battle/formation/  Scripting of enemies in battle.
/battle/item/       Scripting of using items in battle.
/battle/move/       Scripting of Mario's attacks.
/battle/partner/    Scripting of partner attacks.
/battle/starpower/  Scripting of StarPower moves.

/image/texture/  General textures
/image/bg/       Map-Background images
/image/misc/     Edit title and pause screen images here.
/image/icon/*/   Icon images in color-indexed PNG format.

/sprite/         Player and NPC sprites.

/strings/        Edited strings and customs strings are added here.

/globals/        Various global data tables are built from files
                 here.
/globals/patch/  Global patch files are placed here.

/out/            Compiled and packaged mods will be placed here.

/mod.cfg         Star Rod's configuration file for handling the mod.
                 It's not required to manually edit this file, use
                 Star Rod instead.
```
