---
title: Battle Data
sidebar:
  label: Battle Data
---
This page collects the organization and low-level values most often needed while editing battle sections. Battle flag fields are documented separately in [Battle Flags](battle-flags.md).

## Battle Sections, Formations, and Stages

Battle formations are divided among more than 40 battle sections. Each section is compiled as an overlay containing a group of formations, stages, enemy definitions, scripts, and native functions. Only the active section is loaded.

A formation supplies its enemy actors, their starting positions, and their turn priority. It also selects a default stage. A stage identifies the texture, shape, and hit assets used for the arena along with its before- and after-battle scripts and any optional background or foreground data.

Battle-section and stage data occupy separate regions of memory. See the [Memory Map](memory-map.md) for their broad address ranges.

| Project source | Purpose |
| --- | --- |
| `$mod/battle/formation/src/` | Battle-section sources. |
| `$mod/battle/formation/patch/` | `.bpat` files which modify individual sections. |
| `$mod/battle/formation/import/` | Reusable structures imported into a section. |
| `$mod/battle/formation/import/enemy/` | Enemy definitions and their dependencies prepared for import. |

An enemy imported from another section needs its scripts, tables, and referenced functions. Star Rod's battle `#import` machinery copies those structures and resolves their symbolic pointers after placing them in the destination overlay. The imported data still has to fit in the active section's overlay.

An overworld encounter uses the packed ID `AABBCCCC`:

| Field | Meaning |
| --- | --- |
| `AA` | Battle-section index. |
| `BB` | Formation index in that section. |
| `CCCC` | One-based stage table index; zero selects the formation's default stage. |

For example, `12080005` selects section `12`, formation `08`, and stage table entry `5`.

## Actors and Parts

| Actor | ID |
| --- | --- |
| Player | `0000` |
| Partner | `0100` |
| Enemies | `0200` through `0217` |

The enemy range provides 24 actor slots.

An actor consists of one or more parts. Each part may have its own animation, position, defense table, event flags, target flags, and render flags. Actor flags affect the whole actor; part flags affect one part. Part target flags are a third field which may reject jump, smash, or all damage.

## Defense Tables

A defense table maps an element key to the amount subtracted from incoming damage. Positive defense reduces damage, negative defense increases it, and 99 means immune. `IgnoreDefense` reduces positive defense to zero but preserves 99 as immunity.

When several recognized element bits are present, the engine reads every matching table entry and uses the lowest defense. With no recognized element, it uses `Normal`. Missing entries also fall back to `Normal`.

| Key | Star Rod name | Damage bit | Typical attacks |
| --- | --- | --- | --- |
| 01 | `Normal` | none | Attack without a recognized element. |
| 02 | `Fire` | `00000002` | Fire Flower, Egg Missile. |
| 03 | `Water` | `00000004` | Squirt. |
| 04 | `Ice` | `00000008` | Snowman Doll, Ice Power. |
| 05 | `Mystery` | none | Table key not selected by an ordinary damage bit. |
| 07 | `Magic` | `00000010` | Magikoopa and magical Jr. Troopa attacks. |
| 08 | `Hammer` | `00000040` | Hammer and smash attacks; the engine calls this element `Smash`. |
| 09 | `Jump` | `00000080` | Jump, Headbonk, Belly Flop. |
| 0A | `Cosmic` | `00000100` | Shooting Star, Star Storm. |
| 0B | `Blast` | `00000200` | Power Bomb and other blasts. |
| 0C | `Shock` | `00000020` | Thunder Rage, Thunder Bolt, Mega Shock. |
| 0D | `Quake` | `00000800` | Quake Hammer, Earthquake Jump. |
| 0F | `Throw` | `00040000` | Hammer Throw. |

### Lava Bubble Example

```star-rod
.Element:Normal    0
.Element:Water    -2
.Element:Ice      -2
.Element:Fire     99`
.Element:Blast    -1
.Element:End
```

### Cleft Example

```star-rod
.Element:Normal    2
.Element:Fire     99`
.Element:Magic     0
.Element:End
```

See [Battle Flags](battle-flags.md) for damage modifiers, battle state, actor and part flags, and target filters.
