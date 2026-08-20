---
title: 2. The Paper Mario Engine
sidebar:
  label: Paper Mario Engine
  order: 2
---

Paper Mario is not one monolithic program which keeps the entire game in memory. An always-loaded core implements and updates shared systems, while state machines and code loaded from the ROM determine what the game is doing at any particular moment. Let's take a high-level overview of the engine and its components before we begin modding it.

## 2.1. The Game Loop and Game Modes

The engine advances the game one frame at a time. Its main loop reads input and updates shared systems such as events, messages, audio, and HUD elements. It also advances the current **game mode**, a top-level state with contextually relevant update and rendering functions. Control within a game mode may be further governed by state machines, including the complex battle state machine which controls the sequence of turns and actions during the course of a battle.

The most important game modes are file select, world, battle, and pause. Transitions between modes unload, preserve, or rebuild the systems needed by the new mode. Some transitions are managed by short-lived intermediary modes. The two most important to ordinary modding are:

```text
WORLD → CHANGE_MAP → WORLD
WORLD → BATTLE → END_BATTLE → WORLD
```

Since the code currently loaded depends on the game mode, Star Rod divides the functions and data it knows about into different mode-specific **contexts**, including an always-loaded **Common** context:

| Context | Used for |
| --- | --- |
| **Common** | Always-loaded core engine code and shared systems which remain available in every mode. |
| **World** | World maps and the transitions between them. |
| **Battle** | The battle engine, battle menu, and battle overlays. |
| **Pause** | The pause menu and its interface. |
| **MainMenu** | The file-select menu. |

A context is not another game mode. It tells Star Rod which functions, data structures, and symbols can coexist in memory. Common names are available throughout the game, while a name from a mode-specific context is only valid while the corresponding code is loaded.

## 2.2. Native Code and Event Scripts

The engine itself is compiled MIPS machine code originally written in C. It handles low-level and frequently updated systems such as input, rendering, collision, and audio.

Paper Mario also contains a bytecode interpreter for **event scripts**, which Star Rod calls **scripts**. These scripts provide most of the game's high-level logic: cutscenes, player moves, enemy turns, and many other sequences.

An event script does not normally run from beginning to end in one frame. Each running script has an `Evt` context which records its current position in the script, its local variables, its owner, and its relationship to other scripts. The **script interpreter** advances every active script until it finishes, waits, or calls something which blocks it. This allows many scripts to run alongside one another without each needing a separate operating system thread.

The script language supplies flow control, arithmetic, variables, and commands for starting or waiting on other scripts. For most useful work it calls native **API functions**. A function may finish immediately or keep the script blocked while an operation continues across several frames.

World and battle scripts use the same interpreter, but have different function libraries. Functions or data structures available in one context are not necessarily available in the other. Since the script lists are maintained separately, any map scripts which were running before a battle may resume afterward with their state and variables preserved.

## 2.3. Overlays and Loaded Data

The N64 cannot keep all of Paper Mario's code and data in memory at once. The engine therefore copies selected regions from the ROM into RAM as they are needed. Star Rod calls these loaded regions **overlays**.

Each world map has an overlay containing its scripts, functions, and other local data. The battle mode loads common battle code followed by one battle-section overlay containing a group of formations, stages, enemies, and scripts. Additional overlays are used for player actions, battle moves, items, and action commands.

Overlay memory is reused. Loading a new overlay may replace whatever previously occupied the same address range, so a pointer or function from one overlay cannot be assumed to exist in another. This is the reason Star Rod distinguishes **local** data from data which is always available.

Not every file loaded from the ROM is an overlay. Map geometry, collision, textures, sprite rasters, palettes, messages, and audio are assets with their own loading systems. A map's data overlay and its geometry belong to the same map, but they are stored and loaded separately.

The [Memory Map](../reference/memory-map.md) gives a broad view of which RAM regions are always-loaded and which are reused by different modes.

## 2.4. The World

### Important Terminology

| Term | Meaning |
| --- | --- |
| **Model** | Rendered map geometry. |
| **Collider** | Invisible, solid collision geometry. |
| **Zone** | Invisible, non-solid geometry used for camera behavior. |
| **Entry** | A position and facing direction where the player can arrive on the map. |
| **Exit** | A connection which sends the player to an entry in another map. |
| **NPC** | A sprite-based character in the world, including townsfolk, enemies, and the current partner. |
| **Entity** | A reusable interactive world object such as a block, chest, sign, or padlock. |
| **Item entity** | An item placed in the world. |
| **Trigger** | A condition which starts an event script after an interaction or flag change. |

### Synopsis

The engine calls ordinary exploration the **world** context. The world is divided into **areas**, and each area contains one or more **maps**. An area is a technical grouping. Its maps normally share a texture archive and use the same area variables; it does not have to correspond exactly to one geographical location.

Loading a map selects its entry in the map table, loads its overlay and assets, and starts its **MainScript**. This is the unique entry point for the map which is responsible for setting up its NPCs, entities, exits, and anything else needed by the map.

By default, assets are resolved using the map's name. A map named `mac_00` uses `mac_00_shape` and `mac_00_hit` for its map geometry while loading its area's texture archive, `mac_tex`. Maps may optionally provide a native `map_init` function, shown as `$Function_Init` in Star Rod map sources. It runs before these assets are loaded and can substitute different asset names or skip the default geometry and texture loads. Level Editor may also configure maps to share or reuse resources other than the defaults.

NPCs are organized into groups, each with an associated **encounter**. For hostile NPCs, called **enemies**, the encounter selects the battle to initiate when they make contact with the player. NPC behavior is usually delegated to native AI functions. Enemies use these to detect and chase the player. Passive NPCs can use these functions for simple movement without initiating battles.

## 2.5. Battles

### Important Terminology

| Term | Meaning |
| --- | --- |
| **Encounter** | The world-side definition which selects the battle initiated by an NPC group. |
| **Formation** | The enemies participating in a battle, together with their starting positions and turn priority. |
| **Stage** | The arena in which a battle occurs, including its geometry and stage behavior. |
| **Actor** | A combatant: Mario, the active partner, or an enemy. |
| **Part** | A component of an actor with its own animation and target properties. |
| **Battle section** | A group of formations, stages, enemy definitions, and scripts compiled into one overlay. |

### Synopsis

When a battle begins, the engine suspends its world scripts, switches to the battle context, prepares battle memory, and loads the selected battle section. When the battle ends, it restores the world systems and assets which were displaced, returns to the same map, and resumes the surviving world scripts. World map variables survive because their storage is left untouched while the battle context is active. The battle context has its own map-variable storage, intended for the current stage.

A world encounter selects a formation and stage. Each formation has a default stage, which the encounter may override. The formation supplies the enemy actors; Mario and the active partner are added by the battle system.

The battle state machine controls the overall sequence of turns and actions. Event scripts implement actor behavior, attacks, reactions, and player and partner moves. Native functions handle engine-owned combat operations such as damage, targeting, statuses, and action commands.

World areas and battle sections are separate organizations. A world area groups maps and shared world state, while a battle section groups formations, stages, and enemy definitions and scripts in one overlay. The two do not need to correspond one-to-one.

## 2.6. Saved vs Temporary State

Paper Mario scripts store saved values at several different lifetimes, only some of which are preserved while saving and reloading a file:

| Storage | Lifetime |
| --- | --- |
| **Local variables and flags** | Belong to one running `Evt` context. |
| **Map variables and flags** | Belong to the current world map or battle stage. World values survive a battle but are cleared when another map is loaded; stage values are cleared when a battle begins. |
| **Area variables and flags** | Survive across maps in the same world area and are cleared when the area changes. |
| **Game variables and flags** | Belong to the save file and persist until changed or the save is reset. |

Player stats, inventory, partners, and other systems also have dedicated state outside the general script-variable system. Story progress and many one-off conditions are stored in named game or area variables. Event scripts reach dedicated engine state through API functions rather than by reading the structures directly.

## 2.7. IDs, Tables, and Limits

Many assets and runtime objects in Paper Mario are assigned contextual IDs. Maps, items, messages, animations, models, NPCs, actors, sounds, and many other things are identified by numbers or pointers into fixed tables. The same numeric value may mean different things in different contexts: an NPC ID is not an actor ID, and a map model ID has no meaning in a battle stage.

Many engine limits come from fixed-size arrays or reserved memory regions rather than from Star Rod itself. Star Rod gives readable names to these IDs, addresses, flags, and structures, but the compiled game ultimately uses the underlying numeric values and memory layout.

## 2.8. Messages

Paper Mario's **messages**, called **strings** in Star Rod Classic, contain the text used for dialogue and much of the other writing shown by the game. Event scripts and engine tables refer to messages by ID, and the message system loads the corresponding data when it is needed.

A message is more than a sequence of printed characters. Its data also contains commands which select the message-box style, format the text, control pauses and page breaks, insert changing values or images, and present choices. The same system can therefore produce an NPC speech bubble, a sign, a centered notice, or a choice box.

Displaying a message usually takes place over several frames. The message system opens and draws the box, reveals its text, and waits for input when instructed. Event-script functions such as `SpeakToPlayer` connect the message to a speaker and normally keep the calling script blocked until it is finished. Choices return the selected option so the script can respond.

The [Adding and Modifying Messages](../guides/adding-messages.md) guide covers the Star Rod workflow, while the [String Markup](../reference/string-markup.md) reference lists the source tags used to represent message commands.

## 2.9. Effects

Paper Mario uses a separate **effects** system for temporary visual elements such as dust, smoke, sparks, explosions, and weather. Effects are not map models, character sprites, or HUD elements. Each effect is a live `EffectInstance` which the engine updates and renders until it removes itself or is explicitly dismissed.

Event scripts normally create effects with `PlayEffect`. Each effect type accepts its own set of arguments and may provide several variations. For effect types which expose their new instance, `PlayEffect` stores a pointer to it in `*VarF`, allowing the script to adjust or dismiss it later.

Effect code and graphics are loaded as needed and shared by instances of the same type. Instances are associated with the world or battle context in which they were created.

The [Patching Visual Effects](../guides/patching-visual-effects.md) guide explains how Star Rod rebuilds these code and graphics blobs and why their `0xE...` and segment-09 addresses need special handling.

## 2.10. HUD Elements

The engine uses **HUD elements** for reusable 2D image-based graphics in the status display, menus, battle interface, and elsewhere. Most are drawn in screen space, although the system can also place them within the world.

A HUD element is created from a **HUD script**, a small drawing program which selects its images and controls their visibility and timing. HUD scripts are not event scripts and do not run in an `Evt` context. Each live element is assigned an ID which code uses to control properties such as its position, scale, opacity, depth, and tint.

The engine maintains separate HUD-element lists and image caches for the world and battle contexts. As with other contextual IDs, a HUD-element ID is only meaningful within the list which created it.

## 2.11. Conclusion

The most important questions when reading or modifying engine data are which context is active, what has been loaded, and how long each object or value remains valid. These determine which functions may be called, which IDs and pointers mean anything, and what survives a transition.

With this model in mind, we can return to Star Rod and see how a project represents the original ROM, its overlays, and its global data.