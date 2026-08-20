---
title: Adding and Editing Maps
sidebar:
  label: Adding and Editing Maps
---
A map combines several project sources which are built and loaded separately:

| Source | Owns |
| --- | --- |
| Level Editor entry | The map's area, engine name, and shape, hit, texture, and script resources. |
| Map Editor file | Map geometry and marker data, saved under `$mod/map/save/`. |
| Map patch | The map overlay's scripts, native functions, and other local data under `$mod/map/patch/`. |
| Map imports | Reusable overlay structures under `$mod/map/import/`. |

Changing the geometry does not change the overlay, and changing a script does not replace the geometry. A complete new map normally needs both an editor file and a patch containing its `MainScript`.

## Add a New Map

1. Open **Level Editor** and select the area which should own the map.
2. Click **Add New Map**. Give it an engine name of at most eight characters and enable the Script Data, Shape Data, and Hit Data it will use.
3. Save the level table. The entry is written to `$mod/map/MapTable.xml`.
4. Select the new map and click **Create** beside its missing map file. Start from the template or copy a mechanically similar map.
5. Open it in Map Editor, make the initial changes, and save it under `$mod/map/save/`.
6. Click **Create** beside the missing map patch. Add the map's `MainScript` and other overlay data to the new `.mpat` file under `$mod/map/patch/`.
7. Build the mod and enter the map from a known working exit while testing.

Use the **Friendly Name** for your own organization and the **Engine Name** for scripts and table lookup. Shape and Hit may be deliberately shared or omitted; do not create dummy assets for a resource you did not intend to enable.

## Edit a Map

For a vanilla map, open its source under `$mod/map/src/` through Level Editor or Map Editor and save the working version. Star Rod looks under `map/save/` first and falls back to `map/src/` when no saved version exists.

Map Editor's **Map** menu can build Geometry and Collision explicitly. **Automatically Build Map Assets** is enabled by default, so compilation also rebuilds missing or out-of-date shape and hit assets for maps found under `map/save/`.

Script changes belong in the map's `.mpat` file under `$mod/map/patch/`. Reusable structures shared by several maps belong under `$mod/map/import/`.

See [Map Render Modes](../reference/map-render-modes.md) when choosing how a model is drawn, and [Patch Expressions](../reference/patch-expressions.md) for references to map markers, models, colliders, zones, entries, and paths.

## Battle Stages

Battle stages use the same Map Editor representation for their geometry, but they are not entries in the world map table. Level Editor maintains them in a separate stage list. Use **Add New Stage** when the geometry belongs to a battle rather than a world map, then connect it through the applicable battle-section data.
