# Basic Patching

We're going to create a patch that changes the music that plays in the opening cutscene.

### Source files
In Star Rod, any file that ends in `.mscr`, `.bscr` or `.wscr` is a source file. This tutorial will focus on `.mscr` files, but the method of patching described works for all different types. 

`.mscr` files contain all the code used in overworld maps. Every file corresponds to an overworld map in the game. They are located in your mod directory, in `map/src`. The file we are going to patch is the one that corresponds to the first map that loads when you start the game, the Mario’s House map. The name of the file is `kmr_20.mscr`. When you open this file in a text editor, you see a bunch of blocks starting with a variation of `#new:Function $Something_12345678` and ending with a closing brace: `}`. These are called Data Structures. All data structures are created with this exact format, where:
- `#new:Function` = Tells Star Rod to create a new data structure of type “Function”.
- `$Something_12345678` = The name of the structure.

There are a lot of different types of data structures, but the two types you’ll find most commonly are Function and Script. In this tutorial, we are going to patch a script.

### Finding the script to patch
To make changes to the opening cutscene, you need to find the script associated with it. This can be done in a variety of ways. The simplest method is by searching the file for dialogue used in the cutscene, because Star Rod provides a preview of any text that gets displayed from a script. The first bit of dialogue in the opening cutscene is “Mail call!”, said by Parakarry. If you search the file for this string, you will immediately find the script that makes that text appear, which is the opening cutscene. Scroll up a bit until you find the start, with the `#new:` bit. (At this point, you may already have found where the music gets set.)

### Making a patch file
To change this script, you will need to make a patch file. Patch files are created in map/patch, and their name has to be the exact same as the file you’re patching, but with the extension `.mpat` instead of `.mscr`.

Copy the entire script (from the `#new:` part to the closing brace `}`) from the mscr file to the mpat file. To tell Star Rod that you’re patching a script that already exists instead of creating a new one, we replace the `#new:Script` with an `@` symbol.

Your mpat file should now look like this:
```
@ $Script_8024FD70 {
  
}
```
With the contents of the script between the braces.

Now you can make your changes. A few lines into the script you can see a line that reads

```
Call  SetMusicTrack ( 00000000 .Song:MailCall 00000000 00000008 )
```

To change which song is playing, simply edit the part after the `.Song:` to be a different track title. Say you want the final boss theme to play, you’d put `FinalBowserBattle` in there. For a list of all songs you can use here, look in your mod folder in `globals/enum/songs.enum`.

Compile your mod and start a new game, and you should hear the song you selected play during the opening cutscene!

### Advanced
You might think it’s a bit excessive to copy and paste an entire script just to edit one line. Luckily, there is a shorter way to do it. In the script, you will see that every single line has a [hexadecimal number](https://en.wikipedia.org/wiki/Hexadecimal) at the start. This number indicates how far into the script this line of code is, also known as the offset of the line. You can patch that line specifically by specifying this offset in the patch as follows:

```
@ $Script_8024FD70 {
    [24] Call  SetMusicTrack ( 00000000 .Song:FinalBowserBattle 00000000 00000008 )
}
```

This will have the same effect as the original patch. Keep in mind that if you’re patching like this, the change you make has to be the exact same size as the original line.
