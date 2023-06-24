# Setting up Star Rod and your modding folder

## Requirements

* Java Development Kit (JDK) version 12 or newer
  (JDK version 17 or 20 recommended)
  (OpenJDK works as well)
  (a "standard" installation of Java, like JRE, does not suffice!)
* Star Rod modding tool (current version: 0.5.3)
  -> Download here: <https://drive.google.com/file/d/1OUHnb9T7m_aVm-WJY3mmEgFS_DU0F2je/>
* A valid Paper Mario 64 US v1.0 ROM (There are a variety of tools you can use to dump a backup from your own cartridge. Please ensure your cartridge matches the required version.)

## Installation

1. Check if you already have an up-to-date version of JDK installed.
    * If you know your way around a terminal, open one up and enter `java --version`.
    * To check using Windows menues: TODO
2. If you do not have JDK version 12 or newer installed, get it here: <https://www.oracle.com/java/technologies/downloads/>
3. Download the current version of Star Rod (see: Requirements), then extract the .zip file somewhere you can easily find it again. It's recommended to set up a folder for your modding and have the folder for Star Rod inside of that.

## Preparing your mod folder

1. If you're on Windows, launch `StarRod.exe`. MacOS and Linux users launch `StarRod.jar` instead (you may need to set the file to allow execution first).
2. When asked to create a new Star Rod config, pick Yes.
3. When asked to pick a directory for your mod, choose the folder you set up during step 3) of the Installation.
4. When asked to create a new mod config, pick Yes.
5. You'll now be prompted to pick a clean NTSC-U (that is the North American release) ROM of Paper Mario. Commonly the correct ROM file is in the .z64 format.
    * If you do have a clean NTSC-U ROM, but it is in the .n64 or .v64 format, use the following website to fix your ROM: <https://hack64.net/tools/swapper.php>
6. Once Star Rod has verified that your ROM is the correct one, Star Rod's Mod Manager will open:
(TODO put screenshot of mod manager here)
7. Select `Dump ROM Assets`. This will extract the game's data into a new folder called `dump` next to your ROM file. This may take a few minutes, but only needs to be done once.
8. Select `Copy Assets to Mod` to copy the relevant data of the game's dump to your mod directory.
9. You can close Star Rod for now.

Now you're ready to start modding!
