---
title: Sprite Palettes
sidebar:
  label: Sprite Palettes
---
World-only sprites may use any palette arrangement their scripts expect. CI-4 sprites used in battle must provide status palettes in a fixed order.

A world-only sprite sheet with `N` color variations has `N` palettes. A battle sprite sheet has `4N + 1` palettes.

## Single-Variation Partners

| Index | Palette | Appearance |
| ---: | --- | --- |
| 0 | Normal | Unchanged. |
| 1 | Poisoned | Green tint. |
| 2 | Turn Finished | Darker tint. The generic enemy renderer uses this group for dizzy or sick. |
| 3 | Shocked | Yellow tint. |
| 4 | Burned | Blackened. |

## Single-Variation Enemies

| Index | Palette | Appearance |
| ---: | --- | --- |
| 0 | Normal | Unchanged. |
| 1 | Poisoned | Green tint. |
| 2 | Dizzy / Sick | Purple tint. |
| 3 | Shocked | Yellow tint. |
| 4 | Burned | Blackened. |

## Several Color Variations

When a sprite has `N` color variations, each standard status group contains `N` palettes. Sprite Editor calls the number of variations **Groups** on the **Spritesheet** tab.

```text
Normal 1, Normal 2, …, Normal N
Poisoned 1, Poisoned 2, …, Poisoned N
Dizzy 1, Dizzy 2, …, Dizzy N
Shocked 1, Shocked 2, …, Shocked N
Burned
```

The burned palette is shared. Accessory palettes may follow the standard groups; sprite 68 is a vanilla example.
