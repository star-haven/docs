---
title: HUD Scripts
sidebar:
  label: HUD Scripts
---
HUD scripts are short command lists used by HUD elements. They select images, control animation timing, and change drawing properties. They are not event scripts and do not have an `Evt` context or script variables.

HUD-script sources use `.hs` under `$mod/image/hudscripts/`. The entries and their load groups are declared in `$mod/image/HudScripts.xml`. See [Image Assets and Scripts](image-scripts.md) for image definitions and load groups.

```star-rod
SetTileSize ( .IconSize:32x32 )
Loop
    SetIcon ( 8` ~ImageIcon:ui/Example0 )
    SetIcon ( 8` ~ImageIcon:ui/Example1 )
Restart
End
```

Execution continues through immediate commands during the same frame until it reaches a command which waits, ends, or deletes the element. `SetRGBA`, `SetCI`, and `SetIcon` wait for their duration. `RandomDelay` waits for the selected number of frames.

## Images and Timing

| Command | Effect |
| --- | --- |
| `SetRGBA ( duration ~ImageRGBA:name )` | Select an RGBA32 image and display it for `duration` frames. After `UseIA8`, it instead selects an IA8 image. A raw raster address may replace the image expression. |
| `SetCI ( duration ~ImageCI:name )` | Select a CI4 image and palette and display them for `duration` frames. Raw raster and palette addresses may replace the image expression. |
| `SetIcon ( duration ~ImageIcon:name )` | Select a registered CI4 icon and display it for `duration` frames. |
| `RandomDelay ( min max )` | Wait for a random duration in the given inclusive range. |
| `UseIA8` | Interpret subsequent non-CI image data as IA8 rather than RGBA32. |

The duration is stored in the element's animation timer and is measured in HUD update ticks, normally game frames.

`SetIcon` uses the image data registered during the build. Use `SetCI` when the script supplies a CI4 raster and palette directly, and `SetRGBA` for an RGBA32 or IA8 raster.

## Size, Scale, and Position

| Command | Effect |
| --- | --- |
| `SetTileSize ( tileSize )` | Set the source and drawing dimensions to one `.IconSize` preset. |
| `SetSizesAutoScale ( tileSize drawSize )` | Set separate source and drawing dimensions and configure the scale automatically. |
| `SetSizesFixedScale ( tileSize drawSize )` | Set separate source and drawing dimensions and enable interpolation between them over each image command's duration. |
| `SetCustomSize ( width height )` | Set custom source dimensions rather than a preset. |
| `SetScale ( scale )` | Set the drawing scale. The source stores this as a 16.16 fixed-point value. |
| `SetAlpha ( alpha )` | Set the element alpha from 0 through 255. |
| `SetTexelOffset ( x y )` | Set the texture offset within the element. |
| `AddTexelOffsetX ( amount )` | Add to the horizontal texture offset. |
| `AddTexelOffsetY ( amount )` | Add to the vertical texture offset. |
| `SetRotPivotOffset ( x y )` | Set the rotation pivot offset. This affects elements for which the engine has allocated transform data. |

The accepted icon-size presets are:

| ID | Name | ID | Name | ID | Name |
| ---: | --- | ---: | --- | ---: | --- |
| 00 | `8x8` | 09 | `16x32` | 12 | `192x32` |
| 01 | `16x16` | 0A | `64x32` | 13 | `40x40` |
| 02 | `24x24` | 0B | `32x16` | 14 | `24x16` |
| 03 | `32x32` | 0C | `12x12` | 15 | `32x40` |
| 04 | `48x48` | 0D | `48x24` | 16 | `40x16` |
| 05 | `64x64` | 0E | `32x8` | 17 | `40x24` |
| 06 | `8x16` | 0F | `24x8` | 18 | `32x24` |
| 07 | `16x8` | 10 | `64x16` |  |  |
| 08 | `16x24` | 11 | `16x64` |  |  |

They are written as expressions such as `.IconSize:24x16`.

## Loops and Branches

| Command | Effect |
| --- | --- |
| `Loop` | Save the position of the following command as the loop start. |
| `Restart` | Return to the most recent `Loop`. |
| `RandomRestart ( max cutoff )` | Generate a value from 0 through `max`; restart the loop when it is less than `cutoff`. |
| `RandomBranch ( script ... )` | Select one of the listed HUD scripts uniformly and continue execution there. |
| `End` | Mark the animation finished and stop advancing the command list. The element remains allocated. |
| `Delete` | Mark the HUD element for deletion. |

`RandomBranch` takes script addresses rather than local labels. It is used to choose among complete HUD-script programs.

## Flags and Other State

| Command | Effect |
| --- | --- |
| `EnableCI4` | Set the `FMT_CI4` flag to select CI4 rendering. |
| `DisableCI4` | Clear the `FMT_CI4` flag to select non-CI rendering. |
| `SetFlags ( mask )` | Set the specified HUD-element flag bits. |
| `ClearFlags ( mask )` | Clear the specified HUD-element flag bits. |
| `SetVariable ( value )` | Set the element's four-bit script variable. The value is intended to be 0 through 15. |
| `PlaySound ( .Sound:name )` | Play a sound when execution reaches the command. |

The flags useful to authored scripts are:

| Mask | Engine flag | Effect |
| ---: | --- | --- |
| `00000010` | `SCALED` | Draw using the element scale. |
| `00000020` | `TRANSPARENT` | Enable translucent drawing. |
| `00000040` | `FRONTUI` | Draw in the front UI pass. |
| `00000800` | `REPEATED` | Repeat the texture across the element. |
| `00001000` | `FLIPX` | Flip the image horizontally. |
| `00002000` | `FLIPY` | Flip the image vertically. |
| `00004000` | `FMT_CI4` | Interpret the image as CI4. |
| `00008000` | `FILTER_TEX` | Enable texture filtering. |
| `00020000` | `NO_FOLD` | Disable the folding effect used by some transformed elements. |
| `00080000` | `FMT_IA8` | Interpret non-CI image data as IA8. |
| `00100000` | `CUSTOM_SIZE` | Use the custom width and height. |
| `00200000` | `INVISIBLE` | Do not draw the element. |
| `00800000` | `ANTIALIASING` | Enable anti-aliasing for the element. |
| `10000000` | `HIDDEN` | Hide the element. |
| `20000000` | `DROP_SHADOW` | Draw the element with a drop shadow. |
| `40000000` | `BATTLE_CAM` | Apply the battle camera transform. |

Other bits describe allocation, deletion, ownership, or interpreter state and are maintained by the engine. Changing them with `SetFlags` or `ClearFlags` may break the element's lifetime or execution.

The legacy names `SetVisible` and `SetHidden` remain accepted as aliases for `EnableCI4` and `DisableCI4`, respectively. They do not control element visibility. Use the `INVISIBLE` or `HIDDEN` flags only when the code which owns the HUD element expects those flags to be controlled by its script.
