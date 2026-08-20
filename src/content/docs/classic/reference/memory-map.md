---
title: Memory Map
sidebar:
  label: Memory Map
---
Paper Mario uses the Nintendo 64's full 4 MB of RAM, mapped from `80000000` through `80400000`. The addresses below are for the US 1.0 ROM. End addresses are exclusive, and small gaps between known regions are omitted. Star Rod requires the expansion pack because it uses the additional 4 MB from `80400000` to `80800000`. The tables show the unaltered vanilla locations; Star Rod may relocate the heap regions denoted by `*`.

## Broad Layout

| Address Range | Contents |
| --- | --- |
| `80025C00`–`801512B0` | Engine code, data, and BSS. |
| `80164000`–`80196C60` | Two display contexts used to build graphics tasks. |
| `80197000`–`801AA000` | Effect buffers and battle-entity workspace. |
| `801AA000`–`80200000` \* | Audio heap. |
| `80200000`–`802C3000` | Mode-dependent code, assets, and temporary memory. |
| `802C3000`–`802F4A60` | Event script interpreter, sprite, entity, message, and font code and data. |
| `802FB800`–`8034F800` \* | General heap. It is preserved during an ordinary battle transition and rebuilt when a map is loaded. |
| `8034F800`–`8038F800` \* | Sprite heap. |
| `8038F800`–`80400000` | Three framebuffer-sized regions. |
| `803DA800`–`80400000` \* | Battle heap, overlapping the third framebuffer. |
| `80400000`–`80800000` | Expansion pack memory used for Star Rod patches and relocated heaps. |

## Mode-Dependent Memory

The region from `80200000` through `802C3000` is reused according to the current game mode. Rows from different contexts therefore overlap intentionally. An overlay may occupy less than the full range reserved for it.

| Context | Address Range | Contents |
| --- | --- | --- |
| World, battle, and menus | `80200000`–`80210000` | Background image or mode-specific scratch space. |
| World | `80210000`–`80240000` | Map shape and model data. |
| World | `80240000`–`80268000` | Map data overlay. |
| World | `80268000`–`80280000` \* | Collision heap. |
| World | `80280000`–`8028E000` | World script API library. |
| World | `8028E000`–`802AE000` | Map textures. |
| World | `802B6000`–`802C3000` | Smaller world overlays loaded as needed. |
| Battle | `80210000`–`80218000` | Stage shape data. |
| Battle | `80218000`–`80238000` | Battle-section overlay data. |
| Battle | `80238000`–`8023E000` | Partner battle scripts. |
| Battle | `8023E000`–`8029DA30` | Battle engine. |
| Battle | `802A1000`–`802ACC60` | Battle menu and other load-on-demand battle code. |
| Battle | `802AE000`–`802B6000` | Stage textures. |
| Pause and MainMenu | `8023E000`–`80242BA0` | Menu graphics shared by the pause and file-select menus. |
| Pause | `80242BA0`–`802700C0` | Pause menu. |
| MainMenu | `80242BA0`–`8024C080` | File-select menu. |

Pointers into mode-dependent memory are only meaningful while the corresponding code or data is loaded. This is why a function or structure from one Star Rod context cannot be used from another, even when both have valid names in the database.
