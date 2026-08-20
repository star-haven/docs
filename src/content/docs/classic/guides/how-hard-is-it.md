---
title: How Hard Is It?
sidebar:
  label: How Hard Is It?
---
Estimating the difficulty of a modding task can be deceptive. A result which is easy to describe may still be difficult to produce. With Star Rod's patch-based workflow, technical difficulty usually depends on how closely the task matches something Paper Mario already does. Replacing or repurposing existing functionality is much easier than building new behavior, which may require a deep understanding of the engine or changes better suited to projects using the decompiled source.

The categories below account for both technical complexity and the amount of work involved.

| Rating | Usual scope |
| --- | --- |
| **Beginner** | Basic edits to existing assets, often using one of Star Rod's editors. |
| **Novice** | Small additions to existing content made by copying established patterns. |
| **Intermediate** | Routine work for proficient modders, such as creating complete pieces of content. |
| **Advanced** | Difficult, time-consuming, or high-effort work coordinating multiple systems and types of content. |
| **Expert** | Impressive achievements, rarely completed. Other modders may wonder how you did it. |

## Beginner

| I want to... | The work usually involves | Start with |
| --- | --- | --- |
| Change dialogue, a tattle, or menu text | Editing or replacing an existing message in String Editor. | [Your First Change](../tutorials/your-first-change.md) |
| Change an item's name, description, or recovery amount | Editing its messages and item table entry in Globals Editor. | [Editing Items](editing-items.md) |
| Change a move's name, description, or FP cost | Editing its messages and global move entry in Globals Editor. | [Adding a Move](../tutorials/adding-a-move.md#2-configure-the-move) |
| Replace an existing icon | Replacing its PNG or changing the image definition which refers to it. | [Working with Images](working-with-images.md) |
| Move, edit, or retexture existing map geometry | Editing the map in the Map Editor. | [Adding and Editing Maps](adding-and-editing-maps.md) |
| Change an enemy actor's HP or defense | Patching the relevant fields in its actor data. | [Scripting a Battle](../tutorials/scripting-a-battle.md#31-change-actor-data) |
| Adjust an existing actor move | Changing values in an existing attack script. | [Scripting a Battle](../tutorials/scripting-a-battle.md#32-follow-the-turn-script) |

## Novice

| I want to... | The work usually involves | Start with |
| --- | --- | --- |
| Create new geometry in an existing map | Adding models, colliders, and zones in the Map Editor. Script references may need updating if existing map objects are renamed or reordered. | [Adding and Editing Maps](adding-and-editing-maps.md) |
| Add a block or other entity to a map | Adding a marker in the Map Editor and creating the entity from the map patch. Some entities also need scripts or saved flags. | [Scripting a Map](../tutorials/scripting-a-map.md) |
| Script a basic exit between two maps | Adding the exit trigger and transition script, then setting up the corresponding entry in the destination map. | [Scripting a Map](../tutorials/scripting-a-map.md#8-follow-an-exit) |
| Add a friendly NPC which uses an existing sprite | Adding an NPC marker, settings, scripts, an NPC structure, and a group-list entry. | [Scripting a Map](../tutorials/scripting-a-map.md#6-add-an-npc) |
| Change the enemies in an existing battle formation | Editing the formation while retaining its established table entry. | [Scripting a Battle](../tutorials/scripting-a-battle.md#12-read-an-existing-formation) |
| Add a battle formation using existing enemies from the same section | Adding the formation and assigning it a slot in the section's formation table. | [Scripting a Battle](../tutorials/scripting-a-battle.md) |
| Add a new move for an actor | Adapting a mechanically similar attack script and calling it from the actor's turn script. | [Scripting a Battle](../tutorials/scripting-a-battle.md#32-follow-the-turn-script) |
| Add rasters or animations to an existing player or NPC sprite | Extending the existing sprite sheet without changing established indices. | [Adding Sprites](adding-sprites.md) |
| Add a sound effect which uses an existing instrument | Assigning an unused sound ID, defining its program and routing, then rebuilding the sound-effect archive. | [Adding a Sound Effect](adding-a-sound-effect.md) |

## Intermediate

| I want to... | The work usually involves | Start with |
| --- | --- | --- |
| Script a cutscene or complex NPC interaction | Coordinating dialogue, movement, camera changes, player control, NPC state, and any flags needed afterward. | [Event Script Overview](event-script-overview.md) |
| Create a new map | Creating its geometry, then implementing its scripts, entries, exits, and other map data. | [Adding and Editing Maps](adding-and-editing-maps.md) |
| Add an enemy encounter to a map | Adding an overworld enemy NPC import and setting up its encounter data. | [Scripting a Map](../tutorials/scripting-a-map.md#7-add-an-enemy) |
| Add a new stage | Creating its geometry, then adding its stage structures and table entry to a battle section. | [Adding and Editing Maps](adding-and-editing-maps.md#battle-stages) |
| Add a new enemy actor | Adapting the actor data, parts, and battle scripts of a mechanically similar enemy, then adding its sprite and formation. | [Scripting a Battle](../tutorials/scripting-a-battle.md#4-create-a-new-enemy) |
| Add an item which behaves like an existing item | Adding its messages, image, item table entry, and any existing battle-item or badge connection it reuses. | [Editing Items](editing-items.md) |
| Change the behavior of an existing move | Replacing its battle script while retaining the global entry and working action sequence. | [Adding a Move](../tutorials/adding-a-move.md#5-build-the-move-script) |
| Add a new sprite | Creating rasters, palettes, and animations. | [Adding Sprites](adding-sprites.md) |
| Add a new instrument | Preparing the WAV, assigning a bank slot, configuring tuning and envelopes, rebuilding the bank, and making it available where it will play. | [Adding a New Instrument](adding-a-new-instrument.md) |

## Advanced

| I want to... | The work usually involves | Start with |
| --- | --- | --- |
| Create an interconnected series of maps, such as a dungeon | Coordinating map geometry, entries, exits, encounters, puzzles, saved state, and every route through the maps. | [Adding and Editing Maps](adding-and-editing-maps.md) and [Event Script Overview](event-script-overview.md) |
| Add a new boss | Creating or heavily adapting an actor with specialized battle mechanics, multiple moves, and battle AI. Setting up an NPC to initate the battle and start a scene afterward. | [Adding a Boss](../tutorials/adding-a-boss.md) |
| Add a battle item, badge, or move with new behavior | Coordinating global entries, messages, images, HUD elements, battle sources, targeting, menu placement, and the badge or command which grants it. | [Editing Items](editing-items.md) and [Adding a Move](../tutorials/adding-a-move.md) |
| Reskin a partner | Editing its overworld, battle, and pause menu sprites and animations. | [Adding Sprites](adding-sprites.md) |
| Patch or create a display list | Writing graphics commands and managing render state, textures, and the addresses expected by the engine. | Nearby display-list sources and [Writing Assembly](writing-assembly.md) |

## Expert

| I want to... | Why it is different |
| --- | --- |
| Replace Mario's sprites | Redrawing over 500 distinct rasters used across Mario's nine sprite sheets. See [Adding Sprites](adding-sprites.md). |
| Translate the full game | Thousands of messages must be translated and proofread in context, while menus and other interfaces must be adjusted wherever the new strings require different widths or positions. |
| Create a new chapter | A full chapter requires a large body of connected maps, scripts, NPCs, actors, battles, stages, and supporting assets. |
| Add a new partner | Partners participate in many game systems. Adding new abilities and interactions may require extensive engine-level modifications. |
| Create a new type of enemy AI | There is no similar enemy NPC implementation to adapt. Its AI state machine must be written in assembly, which requires understanding the enemy structure and how the engine operates on it. |
| Add a new battle menu category | The existing menu, command dispatch, move tables, targeting, and player progression were built around fixed sets of actions. |
| Change a pause menu, title screen, or save system features | These are native engine systems rather than script-driven. Deep understanding of their assembly code is required. |
| Raise a fixed capacity or change a fundamental rule | The field or table may have many references throughout the engine which must all be found and updated. Missed cases may produce distant and difficult-to-diagnose errors. |

An **expert** task is not necessarily an engine change. Some receive the rating because of their scale; others have moved beyond a supported content workflow and require original investigation and native patches. The [Writing Assembly](writing-assembly.md), [Memory Map](../reference/memory-map.md), and [Engine Limits](../reference/engine-limits.md) references are useful starting points for the latter.

## Estimating an Unlisted Idea

Before beginning a feature, find the closest example in the project's `src/` or `import/` directories and answer these questions:

1. Does the desired behavior already exist, or only something which looks similar on screen?
2. Can the change reuse an existing ID or empty slot, or must a fixed table be extended?
3. Is its data always loaded in one map or battle section, or must it work across overlays?
4. Does it need new saved state, menu support, or behavior after loading from different entry points?
5. Can each part be tested separately?

If the feature can reuse a working example within one context, begin with that example and change one part at a time. If it needs new behavior in several permanent systems, treat the investigation itself as part of the work rather than expecting an editor setting to provide the missing connection.
