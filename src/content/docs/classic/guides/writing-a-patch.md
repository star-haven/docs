---
title: Writing a Patch
sidebar:
  label: Writing a Patch
---
Patch files replace or add structures. Map overlay patches normally use `.mpat`; battle overlay patches use `.bpat`; visual-effect patches use `.epat`. Global patches live outside the overlays and use `.patch`. Structure bodies use the same syntax as files under `src/`, so a working vanilla structure is usually the best place to begin.

| Patch target | Extension | Project directory |
| --- | --- | --- |
| Map overlay | `.mpat` | `$mod/map/patch/` |
| Battle section | `.bpat` | `$mod/battle/formation/patch/` |
| Battle item | `.bpat` | `$mod/battle/item/patch/` |
| Action command | `.bpat` | `$mod/battle/command/patch/` |
| Battle move | `.bpat` | `$mod/battle/move/patch/` |
| Partner actor | `.bpat` | `$mod/battle/partner/patch/` |
| Star Power | `.bpat` | `$mod/battle/starpower/patch/` |
| Visual-effect code or graphics | `.epat` | `$mod/effect/patch/` |
| Global data or code | `.patch` | `$mod/globals/patch/` |

Reusable files loaded with `#import` belong under `$mod/map/import/` for map patches or `$mod/battle/formation/import/` for battle patches. Importable enemy definitions are conventionally kept in the latter directory's `enemy/` subdirectory.

## Replace Existing Data

Suppose a source under the project's `src/` directories contains this table:

```star-rod
$DataTable_80241C00 {
    002A0000 002B0010 002C0015 002D0002
}
```

The following patch replaces all sixteen bytes:

```star-rod
@ $DataTable_80241C00 {
    00112233 44556677 8899AABB CCDDEEFF
}
```

This has three parts:

1. The `{` and `}` braces contain the body of the patch.
2. The `@` identifies the body as a replacement for an existing structure.
3. `$DataTable_80241C00` is the symbolic target. Names beginning with `$` are pointers, which Star Rod resolves after it has placed the patched structures in the overlay.

To replace only the third word, add an offset:

```star-rod
@ $DataTable_80241C00[8] { 8899AABB }
```

or, equivalently:

```star-rod
@ $DataTable_80241C00 { [8] 8899AABB }
```

A patch with an offset leaves the rest of the structure unaltered; a patch without an offset replaces the entire structure. If the replacement is larger than the original, Star Rod may move it to a free part of the overlay. Its relocation pass scans the existing overlay data and native functions for pointers to the old address rather than relying on a stored list of pointer locations.

## Add a Structure

Use `#new` with the appropriate structure type:

```star-rod
#new:Script $MyLocalScript {
    Return
    End
}
```

Notice again the same three parts:

1. The `{` and `}` braces contain the body of the structure.
2. `#new:Script` identifies the body as a new `Script` structure.
3. `$MyLocalScript` provides a pointer name for the new structure.

Since we used `#new` instead of `@`, a new struct will be created in a free region of the overlay's RAM. You may use `$MyLocalScript` elsewhere in the same patch file. A global patch may use `#export` to make a new structure visible to other global and overlay patch files:

```star-rod
#export:Script $MyGlobalScript {
    Return
    End
}
```

## Importing

Overlays can reuse common modules with `#import`:

```star-rod
#import SharedData.mpat
```

Imported files are themselves patch files and may contain multiple structures. An optional second argument places their names in a namespace:

```star-rod
#import SharedData.mpat Shared
```

If the imported file defines `$Setup`, the importing patch can refer to it as `$Shared:Setup`. A namespace is useful when several imports use the same pointer names. Each overlay which imports the file receives its own copy of those structures.

## Write Values

Patch integers are hexadecimal by default. A backtick selects decimal, `s` writes a 16-bit short, and `b` writes an 8-bit byte:

```text
128  = 00000128
100` = 00000064
12b  = 12
12`b = 0C
1FFs = 01FF
-10s = FFF0
3.2  = 404CCCCD
-2.5 = C0200000
```

Leading decimal places are not accepted, so write `0.5` rather than `.5`.

Constants, enums, pointers, script variables, and expressions may be used in place of raw numbers when the structure permits them. Prefer names over handwritten IDs whenever Star Rod exposes the relevant type.

## Find a Working Example

Inspect the corresponding sources under the project's `src/` directories before writing a new structure from scratch. Find a map, enemy, move, or item which already does something similar, copy the smallest relevant structure into the appropriate patch, and change it one piece at a time. Keeping the first build small makes missing imports and wrong overlay assumptions much easier to diagnose.

See [Patch Files](../reference/patch-files.md), [Patch Expressions](../reference/patch-expressions.md), and [Script Variables](../reference/script-variables.md) for the exact syntax.
Visual effects have additional address-space and size constraints described in [Patching Visual Effects](patching-visual-effects.md).
