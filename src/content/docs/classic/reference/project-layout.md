---
title: Project Layout
sidebar:
  label: Project Layout
---
## Application Database

Star Rod's `database/` directory describes the original ROM. It contains function libraries, structure hints, enum and flag names, render modes, and other information used while dumping and compiling data. Consult it when you need the exact name Star Rod expects. Project-specific additions generally belong under `$mod/globals/`.

## Dump Directory

The dump is a read-only working reference produced from the clean ROM. It contains decoded maps, battles, strings, sprites, images, and libraries used to populate a project and support the build. It is normally consulted only to restore a missing or damaged original file.

## Mod Directory

For overlay data, `src` contains the original sources and `patch` contains handwritten changes. Leave the source files unmodified.

| Directory | Contents |
| --- | --- |
| `map/src/` | Original map geometry, markers, and overlay sources. |
| `map/save/` | Geometry and marker data saved by Map Editor; used in preference to the original map XML under `map/src/`. |
| `map/patch/` | Hand-written patches applied to individual maps. |
| `map/import/` | Reusable data imported by map patches. |
| `effect/src/` and `effect/patch/` | Original visual-effect code and graphics sources, and `.epat` files which modify them. |
| `battle/formation/src/` | Original battle-section sources. |
| `battle/formation/patch/` | Battle section patches. |
| `battle/formation/import/` | Reusable data imported into battle sections. |
| `battle/formation/import/enemy/` | Reusable enemy data imported into battle sections. |
| `battle/item/src/` and `battle/item/patch/` | Original battle-item sources and their patches. |
| `battle/command/src/` and `battle/command/patch/` | Original action-command sources and their patches. |
| `battle/move/src/` and `battle/move/patch/` | Original player-move sources and their patches. |
| `battle/partner/src/` and `battle/partner/patch/` | Original partner battle sources and their patches. |
| `battle/starpower/src/` and `battle/starpower/patch/` | Original Star Power sources and their patches. |
| `globals/` | Project enums, global tables, system data, and global patches. |
| `strings/src/` | Original string source files. |
| `strings/patch/` | New and modified string sources. |
| `image/assets/` | PNG sources used by image scripts. |
| `image/hudscripts/` | HUD-element scripts. |
| `image/itemscripts/` | Item-entity image scripts. |
| `sprite/npc/src/` | NPC and battle sprite sources. |
| `sprite/player/src/` | Player sprite sources. |
| `audio/sfx/` | Editable sound-effect programs referenced by `audio/SoundEffects.xml`. |
| `audio/bank/` | Editable sound banks, WAV samples, and their `SoundBank.xml` files. |
| `audio/bgm/` and `audio/mseq/` | Editable music and ambient-sequence sources. |
| `audio/raw/` | Original compiled audio used when no rebuilt or override file replaces it. |
| `audio/override/` | Complete compiled audio files which take precedence over editable and original audio sources. |
| `res/` | Arbitrary files included with expressions such as `~BinaryFile`. |
| `out/` | Compiled ROMs and distributable patches. |

Directories named `build`, `cache`, `gen`, and `temp` contain generated data. Do not use them as the only home for hand-written work.
