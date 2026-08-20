---
title: Script Variables
sidebar:
  label: Script Variables
---
Script variables are encoded values which may be passed wherever a command or function expects a literal. The script engine recognizes the encoding and reads or writes the corresponding storage.

## Variable Types

| Name | Description | Capacity | First encoded value |
| --- | --- | ---: | --- |
| `*GameByte[i]` | Saved byte from the original game data. | `0x200` | `F5DE0180` (-170m) |
| `*GameFlag[i]` | Saved flag from the original game data. | `0x800` | `F8405B80` (-130m) |
| `*ModByte[i]` | Additional saved byte installed by Star Rod. | `0x1000` | --- |
| `*ModFlag[i]` | Additional saved flag installed by Star Rod. | `0x8000` | --- |
| `*AreaByte[i]` | Byte cleared when the player changes area. | `0x10` | `F70F2E80` (-150m) |
| `*AreaFlag[i]` | Flag cleared when the player changes area. | `0x100` | `F9718880` (-110m) |
| `*MapVar[i]` | Word local to the current world map or battle stage. | `0x10` | `FD050F80` (-50m) |
| `*MapFlag[i]` | Flag local to the current world map or battle stage. | `0x60` | `FAA2B580` (-90m) |
| `*Fixed[0.3]` | Fixed-point value with 1/1024 precision. | ±19,531 | `F24A7A80` (-230m) |
| `*Array[i]` | Word from an allocated script array. | Varies | `F4ACD480` (-190m) |
| `*FlagArray[i]` | Flag from an allocated script array. | Varies | `F37BA780` (-210m) |
| `*VarX` | Local word in the current `Evt` context. | `0x10` | `FE363C80` (-30m) |
| `*Flag[i]` | Local flag in the current `Evt` context. | `0x60` | `FBD3E280` (-70m) |

Flags are packed from least-significant to most-significant bit within each word: `1F 1E ... 01 00`, followed by `3F 3E ... 21 20`, and so on.

An index may be numeric or a named constant:

```star-rod
*Var4
*GameByte[80]
*GameByte[.SomeConstant]
```

`Temp` variables are reserved for compiler-generated expressions. A script may declare descriptive variables which Star Rod maps to `Dynamic` storage, but should not treat the compiler's temporary stack as persistent storage.

## Lifetimes

Local variables and flags belong to one running `Evt` context. `Exec`, `ExecWait`, `Thread`, and `ChildThread` initialize the new context with copies of the caller's local values. Later changes remain local to the new context. Allocated `*Array` and `*FlagArray` storage is instead shared with these child and parallel scripts.

`*MapVar` and `*MapFlag` use world-map storage in the world context and separate stage storage in the battle context. Stage values are cleared when a battle begins. World values are left untouched during battle, restored when the world context resumes, and cleared when another map is entered.

This stage storage is separate from the battle variables accessed by `SetBattleVar` and `GetBattleVar`, which are used to share state among actors. The original game does not appear to use the stage map-variable storage, but the script engine provides it.

Area bytes and flags are cleared when the player enters another area. They are useful for temporary state shared by several maps in the same area.

Game and mod bytes and flags are saved. Give them project-wide names through the files described in [Globals](globals.md).

## Integer and Float Accessors

### `get_variable` - `802C7ABC`

| Register | Value |
| --- | --- |
| A0 | `Evt*`, or null when local variables do not need to resolve. |
| A1 | Literal or encoded script variable. |
| V0 | Resolved integer value. |

### `set_variable` - `802C8098`

| Register | Value |
| --- | --- |
| A0 | `Evt*`, or null when local variables do not need to resolve. |
| A1 | Literal or encoded script variable. |
| A2 | New value. |
| V0 | Previous value. |

### `get_float_variable` - `802C842C`

| Register | Value |
| --- | --- |
| A0 | `Evt*`. |
| A1 | Literal or encoded script variable. |
| F0 | Resolved floating-point value. |

### `set_float_variable` - `802C8640`

| Register | Value |
| --- | --- |
| A0 | `Evt*`. |
| A1 | Literal or encoded script variable. |
| A2 | New value. |
| F0 | Previous floating-point value. |

### Fixed-Point Conversion

`fixed_var_to_float` at `802C4920` takes an encoded fixed-point value in A0 and returns a float in F0. Ordinary integer values outside the encoded range are converted to the same numeric value as a float.

`float_to_fixed_var` at `802C496C` takes a float in F12 and returns the encoded fixed-point representation in V0. It does not range-check the result; keep the magnitude no greater than 19,531.

## Saved and Area Accessors

| Function | Behavior |
| --- | --- |
| `set_global_flag` (`80145450`) | Set a game flag from an index or encoded value; return the old value. |
| `get_global_flag` (`801454BC`) | Read a game flag from an index or encoded value. |
| `set_global_byte` (`80145520`) | Set a game byte from an index or encoded value; return the old value. |
| `get_global_byte` (`80145538`) | Read a game byte from an index or encoded value. |
| `set_area_byte` (`80145638`) | Set an area byte from a raw index; return the old value. |
| `get_area_byte` (`80145650`) | Read an area byte from a raw index. |
| `set_area_flag` (`801455A0`) | Set an area flag from a raw index; return the old value. |
| `get_area_flag` (`801455F0`) | Read an area flag from a raw index. |
