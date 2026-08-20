---
title: Item Data
sidebar:
  label: Item Data
---
The item table controls presentation, categories, targeting, values, badge associations, and a few effect parameters. Battle and map scripts implement the actual behavior.

## Fields

| Field | Meaning |
| --- | --- |
| Name | Unique identifier used by Star Rod's item enum. |
| Name Message | Display name. |
| Short Desc | Description used in shops. |
| Full Desc | Description used in most menus. |
| Type Flags | Usage contexts and categories such as badge, key item, food, or gear. |
| Target Flags | Eligible battle targets. Copy a similar vanilla item when unknown bits matter. |
| Graphics | One image used to generate ordinary scripts, or explicit item-entity and HUD-element scripts. |
| Move | Move associated with a badge. |
| Menu Order | Badge sort priority; larger values appear farther down. |
| Potency A | HP gain for food or power for a conventional battle item. |
| Potency B | FP gain for food. |
| Sell Value | Default shop and Refund value. A shop may override it; `-1` means no ordinary value. |

## Type Flags

| Value | Meaning |
| --- | --- |
| `0001` | Usable in the world. |
| `0002` | Usable in battle. |
| `0004` | Consumable. |
| `0008` | Key item. |
| `0020` | Gear: boots or hammers. |
| `0040` | Badge. |
| `0080` | Food or drink. |
| `0100` | Use the drink animation. |
| `0200` | Collectible entity such as a coin or heart; no direct use effect. |
| `1000` | Use a full-size 32×32 world entity rather than 24×24. |

These bits describe categories; they do not create an effect. Setting **Usable in battle**, for example, does not add a `Script_UseItem` implementation.

## Item IDs

Star Rod rebuilds the item enum from the ordered entries in `Items.xml`. Prefer `.Item:Name` to a raw item ID.

Appending a new item preserves existing IDs. Reordering or removing entries changes every later ID and may break scripts, inventories, shops, and save data.

See [Editing Items](../guides/editing-items.md) for the creation workflow and [Battle Flags](battle-flags.md#target-flags) for the target-filter bits.
