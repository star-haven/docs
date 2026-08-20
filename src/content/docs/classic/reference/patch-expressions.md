---
title: Patch Expressions
sidebar:
  label: Patch Expressions
---
Patch expressions begin with `~` and are resolved by Star Rod during compilation. Availability may depend on the structure and overlay being compiled.

## General Expressions

### Names and Types

| Expression | Result |
| --- | --- |
| `~String:StringName` | ID assigned to a named custom message. |
| `~SizeOf:Type` | Size of a fixed-size structure type. |
| `~Index:VariableName` | Numeric index of a named script variable. |
| `~Func:FunctionName` | Address of a known engine function from a `.lib` file. |
| `~FX:EffectName` | Numeric arguments identifying an effect used by `PlayEffect`. |
| `~Short:ConstName` | Constant written as a 16-bit short. |
| `~Byte:ConstName` | Constant written as an 8-bit byte. |

`~Flags` combines names from a `.flags` file, with an optional raw value ORed into the result:

```text
~Flags:FlagType:FlagValues
~Flags:FlagType:FlagValues:Constant
~Flags:FlagType::Constant
```

Flag names are separated with `|`. For example:

```text
~Flags:DamageType:NoContact|Fire
```

### Sprite Animations

```text
~Anim:SpriteName:AnimationName
~Anim:SpriteName:AnimationName:PaletteName
~PlayerAnim:SpriteName:AnimationName
~PlayerAnim:SpriteName:AnimationName:PaletteName
```

These produce NPC or player animation IDs. When the palette is omitted, its field is zero. Animation and palette names come from the indexed sprite sources and may be changed in Sprite Editor.

### Files and Texture Formats

```text
~RasterFile:Format:Filename
~PaletteFile:Format:Filename
```

These copy image or palette data from `$mod/res/`. Supported formats are `I-4`, `I-8`, `IA-4`, `IA-8`, `IA-16`, `CI-4`, `CI-8`, `RGBA-16`, and `RGBA-32`.

```text
~TileFormat:Format
~TileDepth:Format
```

These produce the format or bit-depth field for one of the supported image formats.

`~BinaryFile:Filename` copies a file from `$mod/res/` as byte tokens without padding.

## Map Expressions

Map expressions refer to objects indexed from an editable map. In an `.mpat` file, `MapName` may be omitted when the expression refers to the current map.

### Object IDs

```text
~Model:MapName:ModelName
~ModelShort:MapName:ModelName
~Collider:MapName:ColliderName
~ColliderShort:MapName:ColliderName
~Zone:MapName:ZoneName
~ZoneShort:MapName:ZoneName
~Entry:MapName:EntryName
~EntryShort:MapName:EntryName
```

The normal forms return 32-bit IDs; the `Short` forms return 16-bit IDs. Model lookup uses the first matching name in a breadth-first traversal, so model names should be unique.

### Marker Positions

The general form is `~Type:MapName:MarkerName`:

| Type | Result |
| --- | --- |
| `Vec2d`, `Vec2f` | Two-dimensional planar position. |
| `VecXZd`, `VecXZf` | Alias for the two-dimensional planar position. |
| `Vec3d`, `Vec3f` | Three-dimensional position. |
| `PosXd`, `PosXf` | X coordinate. |
| `PosYd`, `PosYf` | Y coordinate. |
| `PosZd`, `PosZf` | Z coordinate. |
| `Angle`, `AngleF` | Yaw. |
| `Vec4d`, `Vec4f` | Three-dimensional position followed by yaw. |

Names ending in `f` produce floating-point values. Names ending in `d` produce 32-bit integers.

### Paths and Grids

```text
~PathXZd:MapName:MarkerName:PointIndex
~PathXZf:MapName:MarkerName:PointIndex
~Path3d:MapName:MarkerName
~Path3f:MapName:MarkerName
```

`Path3d` and `Path3f` produce an array of three-dimensional path points. `PathXZd` and `PathXZf` produce the X and Z coordinates of one point.

`~PushGrid:MapName:MarkerName` produces the grid data consumed by `CreatePushBlockGrid`.

## Constant Offsets

Pointers may be offset by a number or constant:

```star-rod
$MyPointer[offset]
$MyPointer[.Constant]
```

Function labels may be used as internal offsets:

```star-rod
$MyFunction[.o150]
```

Offsets may be nested and applied to constants:

```star-rod
#define .ConstA 10
#define .ConstB 3
.ConstA[.ConstB]                 % 0x13
$MyPointer[.ConstA[.ConstB[2]]] % pointer plus 0x15
```
