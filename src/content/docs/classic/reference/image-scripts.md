---
title: Image Assets and Scripts
sidebar:
  label: Image Assets and Scripts
---
An image definition identifies raster and palette data. HUD-element and item-entity scripts determine when and how that data is drawn. These scripts are small image command lists, not event scripts, and do not run in an `Evt` context.

## Image Assets

Image definitions are stored in `$mod/image/ImageAssets.xml`. Their PNG sources live under `$mod/image/assets/`, and paths in the XML are relative to that directory.

An image definition specifies its texture format, palette count, vertical flip, and whether its original ROM position is fixed. CI images may provide alternate palettes by naming sibling files `_alt`, `_alt2`, and so on:

```text
item/Mushroom.png
item/Mushroom_alt.png
item/Mushroom_alt2.png
```

## HUD Elements

HUD-element sources use `.hs` under `$mod/image/hudscripts/`. Their load group determines when the script table is available:

| Group | Intended lifetime |
| --- | --- |
| Item Icons | Elements indexed through the item table. |
| Always Loaded | Elements available throughout ordinary gameplay. |
| During Battle Only | Elements loaded with the battle UI. |
| Pause and File Menus Only | Elements used by those menus. |

A static 32×32 element is:

```star-rod
EnableCI4
SetTileSize ( .IconSize:32x32 )
Loop
    SetIcon ( 60` ~ImageIcon:item/Mushroom )
Restart
End
```

An item HUD element named `Name_disabled` is paired with the normal element named `Name`. If no disabled element exists, Star Rod uses the normal element for both states.

The commands most often used by HUD elements are:

| Command | Purpose |
| --- | --- |
| `SetIcon ( duration image )` | Select an image for the given number of frames. |
| `SetTileSize ( size )` | Select one of the standard icon dimensions. |
| `EnableCI4` / `DisableCI4` | Enable or disable CI4 image mode.
| `SetScale ( scale )` | Change the drawing scale. |
| `SetAlpha ( alpha )` | Change opacity. |
| `SetTexelOffset ( x y )` | Offset the image within its tile. |
| `PlaySound ( sound )` | Play a sound when execution reaches the command. |
| `Loop` / `Restart` | Mark and repeat the animated portion of the script. |
| `End` | Stop executing commands. |
| `Delete` | Remove the HUD element when execution reaches the command. |

## Item Entities

Item-entity sources use `.is` under `$mod/image/itemscripts/`. They draw an item lying in the world:

```star-rod
SetIcon ( 60` ~ImageIcon:item/Mushroom )
Restart
End
```

Star Rod rebuilds and relocates both script tables during compilation. New entries may be added; they are not limited to replacing vanilla entries.

Item-entity scripts use the smaller command set `SetIcon`, `Loop`, `Restart`, `RandomRestart`, and `End`. `SetIcon` takes a duration followed by an image expression, just as it does in a HUD-element script.

See the [HUD Scripts](hud-scripts.md) reference for the complete command set and [Working with Images](../guides/working-with-images.md) for the editor workflow.
