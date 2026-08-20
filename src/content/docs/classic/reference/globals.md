---
title: Globals
sidebar:
  label: Globals
---
Star Rod uses **globals** for project-wide names and data which are not owned by one map or battle overlay.

## Enums and Flags

Project enum files live under `$mod/globals/enum/` and use `.enum` or `.flags`. They extend or override Star Rod's built-in type database.

An enum begins with its patch namespace, library name, and reversed-lookup setting. The remaining lines map hexadecimal values to names:

```text
Npc       % patch namespace
npcID     % library name
false     % reversed

FFFFFFFF = Self
FFFFFFFE = Player
FFFFFFFC = Partner
```

The patch form is `.Namespace:Name`, such as `.Npc:Self`. Script-library argument metadata uses the library name to decide when a numeric argument should be decoded through this enum.

A `.flags` file has the same header, but each entry names an independent bit:

```text
DamageType
damageType
false

00000002 = Fire
00000008 = Ice
08000000 = IgnoreDefense
```

Comments begin with `%`. Keep all three header lines in a project override.

## Named Saved Variables

| File | Storage |
| --- | --- |
| `$mod/globals/GameBytes.txt` | 512 original saved bytes. |
| `$mod/globals/GameFlags.txt` | 2,048 original saved flags. |
| `$mod/globals/ModBytes.txt` | Additional saved bytes installed by Star Rod. |
| `$mod/globals/ModFlags.txt` | Additional saved flags installed by Star Rod. |

Each line begins with a hexadecimal index and a name. The original game-variable files may also retain a default name before the descriptive name:

```text
% GameBytes.txt
01C = Byte_DojoRank = DojoRank % current dojo promotion

% ModBytes.txt
000 = MB_ExampleCounter

% ModFlags.txt
000 = MF_OpenedExampleChest
```

Star Rod adds the leading `*` when these names are used as script variables. These examples become `*DojoRank`, `*MB_ExampleCounter`, and `*MF_OpenedExampleChest`.

Do not assign one name to two indices, and keep each index within the capacity listed in [Script Variables](script-variables.md).

## Project-Wide Sources

| Data | Source |
| --- | --- |
| Items | `$mod/globals/Items.xml` |
| Moves | `$mod/globals/Moves.xml` |
| Image definitions | `$mod/image/ImageAssets.xml` |
| Item-entity definitions | `$mod/image/ItemEntities.xml` |
| HUD-element definitions | `$mod/image/HudElements.xml` |
| Global patches | `$mod/globals/patch/` |

`$mod/globals/system/` contains project-system data and overrides for built-in system patches. See [Editing Project Globals](../guides/editing-globals.md) for the normal editor workflow.
