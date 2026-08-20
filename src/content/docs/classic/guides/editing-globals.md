---
title: Editing Project Globals
sidebar:
  label: Editing Project Globals
---
Globals Editor maintains the linked project tables used by items, moves, images, item entities, and HUD elements. Use it when a change involves one of these named definitions or the relationships between them. Project enums, saved-variable names, and global patches are also project-wide, but they are edited separately.

## Open and Save the Tables

Open **Globals Editor** from the main window, then choose the tab which owns the definition you want to change:

| Tab | Project source |
| --- | --- |
| **Items** | `$mod/globals/Items.xml` |
| **Moves** | `$mod/globals/Moves.xml` |
| **Images** | `$mod/image/ImageAssets.xml` and PNGs under `$mod/image/assets/` |
| **Item Entities** | `$mod/image/ItemEntities.xml` and `.is` files under `$mod/image/itemscripts/` |
| **HUD Elements** | `$mod/image/HudElements.xml` and `.hs` files under `$mod/image/hudscripts/` |

Select an entry, edit its properties, and use **Save** to write the current tab or **Save All** to write every changed table. Compile the mod after making related changes so Star Rod can rebuild its name indexes and report missing references.

The definitions are connected. An item may refer to three messages, an image, an item-entity script, a HUD-element script, and a move. An image definition identifies the PNG data used by the two drawing scripts. Changing one definition does not automatically change the behavior supplied by another, so follow the reference chain for the feature being edited.

The [Editing Items](editing-items.md) and [Working with Images](working-with-images.md) guides cover the two workflows which most often cross several Globals Editor tabs.

## Definitions Outside Globals Editor

Project enums and flags live under `$mod/globals/enum/`. They add readable names for values used by patches and script-library arguments. Named saved variables are maintained in `GameBytes.txt`, `GameFlags.txt`, `ModBytes.txt`, and `ModFlags.txt` under `$mod/globals/`.

Patch files under `$mod/globals/patch/` are compiled into every build. They are used for reusable functions, hooks, new global data, and engine changes which are not owned by one map or battle overlay. The `$mod/globals/system/` directory contains Star Rod's project machinery and overrides for built-in system patches; it is not a general home for project code.

See [Globals](../reference/globals.md) for the enum, flag, and named-variable formats, and [Patch Files](../reference/patch-files.md#global-patches) for global patch syntax.
