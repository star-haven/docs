---
title: Patching Visual Effects
sidebar:
  label: Patching Visual Effects
---
Star Rod can rebuild the code and graphics used by existing `PlayEffect` effect types. Effect code is a small native overlay linked in the engine's unusual `0xE...` address space. Its graphics are a separate blob whose display lists, vertices, rasters, and palettes use RSP segment `09` addresses.

## Prepare the Sources

Enable **Visual Effects** when dumping the ROM, then use **Copy Assets to Mod**. Each populated effect-table entry produces a code source under `$mod/effect/src/`:

```text
00 BigSteamPuff.escr
00 BigSteamPuff.eidx
```

When Star Rod discovers display lists in the effect's graphics blob, it also produces files with a `_Gfx` suffix:

```text
00 BigSteamPuff_Gfx.escr
00 BigSteamPuff_Gfx.eidx
```

The two-digit prefix is the major effect type used by `PlayEffect`. Keep it in the filename; it makes each table entry unambiguous even when effect names are similar.

## Create a Patch

Create an `.epat` under `$mod/effect/patch/` with exactly the same basename as the source being patched. For example, code changes for the source above belong in:

```text
$mod/effect/patch/00 BigSteamPuff.epat
```

Graphics changes belong in:

```text
$mod/effect/patch/00 BigSteamPuff_Gfx.epat
```

Do not edit the files under `effect/src/`. Copy the smallest structure you need into the patch, or patch a known offset within it. Effect patches use the normal overlay-patch syntax:

```star-rod
@ $Function_Main {
    [20]  NOP
}
```

The example only demonstrates the file and structure syntax; an instruction's meaning depends on the particular effect. Begin with the decoded function and make one verified change at a time.

The effect-table entry point is named `$Function_Main`. Bundled hints for each supported ROM version name its known `EffectBlueprint` callbacks `$Function_Init`, `$Function_Update`, `$Function_RenderScene`, and `$Function_RenderUI`. Null callbacks are left unnamed.

When the mod is compiled, Star Rod links code at the effect table's original `0xE...` virtual address and links graphics at `0x09000000`. It appends each changed binary to the ROM and rewrites the selected effect-table entry with the new ROM range. If two effects originally share graphics, patching one `_Gfx` basename gives that effect a changed copy and leaves the other table entries on the original data.

## Addressing Rules

Effect code has a hard 4 KiB loaded-size limit. The engine's `0x2000` virtual spacing comes from paired TLB pages; it does not double the physical buffer. Star Rod reports an error if the rebuilt, padded code is larger than `0x1000` bytes.

A MIPS `J` or `JAL` instruction preserves the caller's top address nibble. Code executing at `0xE...` therefore cannot directly jump to an ordinary engine function at `0x80...`. Effect code uses a dedicated FX library which contains the functions in the `0xE020...` effect-global block and the engine functions represented by its shim table. It does not inherit the Common library.

Use ordinary function expressions for the supported calls. Star Rod resolves the name to the effect-local shim rather than the same-named Common implementation:

```star-rod
JAL     ~Func:guTranslateF    % E0200420, not 80067900
```

An ordinary Common-only function is undefined in an `.epat`. A raw direct `JAL 80000000` also cannot cross into the `0x8` segment; manually loading an unsupported address and calling it with `JALR` bypasses Star Rod's library checks and is not a supported effect call.

Graphics pointers must remain in segment `09`. Use names from the decoded `_Gfx.escr` rather than replacing `09xxxxxx` pointers with CPU virtual addresses. Star Rod relocates named local structures within the rebuilt graphics blob and updates their segment-09 references.

## Current Scope

Effect patches modify existing effect-table entries. They do not add a new major `PlayEffect` type or expand the engine's effect table, TLB page pool, or live-instance pool. Those changes require a coordinated global engine patch in addition to the effect asset itself.
