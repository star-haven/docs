---
title: Notation
sidebar:
  label: Notation
---
`$mod` is the root of the active mod project. `$dump` is the asset dump produced from the clean ROM, and `$database` is Star Rod's application database.

Numbers in patch files are hexadecimal unless they end with a backtick. For example, `10` is hexadecimal `0x10`, while `` 10` `` is decimal ten. Addresses are normally written without a leading `0x` because that is the form accepted by the patch language.

| Prefix | Usual meaning |
| --- | --- |
| `$` | Pointer or named structure. |
| `.` | Constant or enum value. |
| `*` | Script variable or temporary assembly-register alias. |
| `~` | Expression evaluated by Star Rod while compiling. |
| `%` | Comment. |

The exact meaning of a name still depends on its context and the structure type in which it appears.
