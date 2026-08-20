---
title: 5. Editors and Asset Pipelines
sidebar:
  label: Editors and Asset Pipelines
  order: 5
---

A Star Rod project is not one uniform collection of source files. Patch files are usually handwritten, visual data is maintained by editors, and many assets begin in ordinary formats before being converted for the game. These sources pass through separate pipelines before meeting in the completed ROM.

## 5.1. Maps and Their Overlays

A map provides a clear example of how those pipelines meet. Map Editor maintains the map geometry, along with its markers and other editor data. Level Editor organizes maps into areas and controls the project configuration and resources associated with each map.

For an original map, Star Rod uses the geometry and marker data under `map/src/` until an edited version has been saved under `map/save/`. The map's event scripts and supporting structures instead belong to its overlay and are modified by `.mpat` files.

During a build, Star Rod encodes the geometry, patches the overlay, and updates the map tables which connect them. The geometry shown in Map Editor and the script data addressed by a patch belong to the same map without being part of the same file. This mirrors their separate loading by the engine.

## 5.2. Project-Wide Data

Other editors maintain definitions used throughout the project. Globals Editor manages items, moves, and their associated image scripts. String Editor maintains messages, while Sprite Editor maintains character rasters, palettes, and animations. These tools save project sources which are later assigned IDs, encoded, and written into the appropriate tables or asset regions.

Related pieces are often kept separate. An item definition may refer to a HUD element for menus and an item entity for its world appearance, while its actual use is implemented by a map or battle script. Changing the icon does not change the behavior, and changing the behavior does not replace the image asset.

## 5.3. Asset Conversion

Editable assets are not necessarily stored in the format used by the engine. Images may begin as PNG files, audio instruments as WAV samples, sprites as sheets and XML descriptions, and map geometry as editor data. Messages and drawing scripts use readable markup of their own. Star Rod validates and encodes each of these sources while building the project.

This conversion is also where engine restrictions become important. Texture formats have palette and size requirements, tables have finite capacities, and an encoded asset still has to fit the memory or ROM arrangement expected by its loader. Editors can prevent many invalid combinations, but they do not remove the underlying limits described in chapter 2.

## 5.4. Connecting the Pipelines

A single feature may involve several kinds of source. Adding an enemy, for example, crosses sprite and battle data and may also involve an overworld NPC or messages. Each piece remains in the pipeline which owns it.

Names connect these pieces at build time. A HUD script can select a registered image asset, an item can refer to the resulting HUD element, and a script can refer to the item or a message. Star Rod resolves these names to the appropriate IDs or addresses and reports an error when a required definition cannot be found.

The [Project Layout](../reference/project-layout.md) gives the exact locations used by each pipeline. The guides describe the individual editors and file formats without turning this introduction into a catalog of every supported asset.

The final chapter follows a change through the recurring cycle of investigation, editing, building, and testing.

---

[← Previous: Sources, Patches, and Symbols](04-sources-patches-and-symbols.md) · [Next: The Modding Cycle →](06-the-modding-cycle.md)
