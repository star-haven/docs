---
title: Adding Sprites
sidebar:
  label: Adding Sprites
---
A sprite is comprised of rasters, palettes, components, and animations. NPCs and battle actors use the NPC sprite set, while Mario and Peach use a separate player sprite set.

## Add an NPC or Battle Sprite

1. Choose a sprite with a similar arrangement of components, animations, and palettes under `$mod/sprite/npc/src/`.
2. Duplicate its folder and give the copy a unique source name.
3. Add an entry to the NPC list in `$mod/sprite/SpriteTable.xml`. Give it only of the unused IDs, a unique name, and the copied folder as its source. Append the entry rather than shifting existing IDs.
4. Open the Sprite Editor and select the new sprite from the **NPC Sprites** tab.
5. Replace or edit its rasters, palettes, components, and animations. Save the sprite from the editor.
6. Compile the mod and test every animation and palette used by the NPC or actor.

The table name is used by named animation expressions, while the source identifies the folder containing `SpriteSheet.xml` and its image files. Keep both stable once scripts begin referring to the sprite.

Sprite components determine how rasters are positioned and layered. Animations then apply images, positions, and timing to those components. Copying a similar sprite provides a working component hierarchy which can be simplified or extended in Sprite Editor.

## Extend a Player Sprite

Classic does not provide a general-purpose workflow for adding another player character. Its existing player sprites are separate sheets used for Mario and Peach in different parts of the game. Extend the appropriate sheet rather than adding another entry to the player list in `SpriteTable.xml`.

To add a raster:

1. Open Sprite Editor and select the appropriate sheet from **Player Sprites**.
2. Prepare a CI-4 PNG or Aseprite file with a filename which is unique among all player rasters.
3. On the **Spritesheet** tab, click **Import Raster** and select the file.
4. Choose whether to import its raster, palette, or both.
5. Select the new raster from an animation component where it is needed.

Player rasters are shared from `$mod/sprite/player/src/shared/`, rather than stored with an individual sheet.

To add an animation, open the **Animations** tab and click **Edit Animation List**. Add a new animation or duplicate a similar one, give it a unique name, and edit its components and commands. Append new animations so the indices of existing animations remain unchanged.

Save the sprite, enable **Build Sprite Sheets** under the build options' **Assets** tab, then compile and test the mod.

## Palettes for Battle

World-only sprites may arrange their palettes freely. A CI-4 sprite used in battle must also provide the palette groups expected by the battle status renderer. These include the normal variations followed by poisoned, inactive or dizzy, shocked, and burned appearances.

Sprite Editor calls the number of color variations **Groups** on the **Spritesheet** tab. Adding or reordering a group changes the indices used by battle status effects, so settle the palette layout before scripts depend on particular palette IDs. See [Sprite Palettes](../reference/sprite-palettes.md) for the exact ordering used by partners and enemies.

## Refer to Animations

After the sprite table has been indexed, patches may refer to an NPC animation by sprite and animation name:

```text
~Anim:SpriteName:AnimationName
~Anim:SpriteName:AnimationName:PaletteName
```

The palette-qualified form selects a particular palette by name. Player animations use the corresponding `~PlayerAnim` expression. Named expressions are preferable to copied numeric animation IDs.
