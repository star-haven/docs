---
title: 4. Sources, Patches, and Symbols
sidebar:
  label: Sources/Patches/Symbols
  order: 4
---

The ROM is ultimately a single binary blob consisting of instructions, addresses, IDs, and encoded data. Star Rod adds a source layer which gives those values types and names. This makes it possible to describe a change in terms of a script, table, or function rather than a collection of raw offsets in the ROM.

## 4.1. Decoded Sources

When Star Rod recognizes a structure, it writes a readable representation to the dump and records its type and boundaries in an index file. Map scripts use map source files, while battle actors, formations, moves, and related overlays use battle source files. Native functions are disassembled as MIPS instructions within the same sources.

These files describe what Star Rod found; they are not the game's original source code. Names may be derived from addresses or supplied by Star Rod. The index inventories the decoded layout and its gaps; it does not list every pointer to each structure. The accompanying binary data remains the authoritative copy of anything which was not decoded.

Decoded sources are especially valuable as examples. If the original game already performs a similar task, its structures show which functions, flags, and relationships are actually used together. Consult the sources under `$mod`, then place your changes in the corresponding `patch/` directory.

## 4.2. Patch Files

A **patch file** describes changes to decoded data. It may replace all or part of a named structure, add a new one, import reusable structures, or patch native instructions. Map patches normally use `.mpat`, battle patches use `.bpat`, and project-wide patches use `.patch`.

Local patches are compiled with the source and index for one overlay. This gives the patch access to the structures which exist there and allows Star Rod to rebuild the overlay around its changes. Global patches operate outside a single overlay and may modify fixed ROM data or create names intended for use throughout the project.

Patch files are containers for several kinds of structure. A script body is written in the event-script language, a function body contains MIPS assembly, and a table or other structure uses the fields registered for its type. The surrounding patch language determines what is being created or replaced.

See [Writing a Patch](../guides/writing-a-patch.md) for a practical introduction to creating and organizing patch files.

## 4.3. Names and Context

Star Rod source distinguishes pointers, constants, script variables, and expressions with visible prefixes. A name such as `$SomeScript` represents a pointer to a structure, while `.SomeValue` represents a constant. These names are resolved while compiling; the game ultimately receives the address or numeric value they represent.

Names have scope. A structure named within one map or battle section belongs to that overlay unless it is imported or exported through an appropriate mechanism. Project globals are available more broadly, and engine functions are drawn from the library for the current context. A familiar name is not proof that its code or data exists in the memory currently loaded by the game.

The [Notation](../reference/notation.md) and [Patch Expressions](../reference/patch-expressions.md) references describe the prefixes and expressions in detail.

## 4.4. Scripts and Native Functions

Event scripts and native functions can refer to one another, but they remain different kinds of code. Star Rod compiles scripts into the bytecode consumed by the `Evt` interpreter. It assembles functions into MIPS instructions executed directly by the processor. Function libraries provide the known engine names and calling information available to scripts and assembly in each context.

This division allows most behavior to remain in scripts while native code supplies operations the script language cannot perform itself. A patch may replace either side of that boundary or add a new script-callable function when the existing API is not sufficient.

See the [Event Script Overview](../guides/event-script-overview.md) for an introduction to the script language and [Writing a Callable Function](../guides/writing-a-callable-function.md) for the native side of that boundary.

## 4.5. Placement, Relocation, and Imports

New local structures do not normally need handwritten addresses. Star Rod places them within the available space for the overlay. If an edited structure no longer fits at its original location, Star Rod may move it and update pointers to its new address. The overlay still has a fixed memory budget, so relocation cannot make it larger than the region reserved by the engine.

Imports provide reuse across local overlays. Importing an enemy or helper script copies the required structures into the overlay being built and qualifies their names when necessary. Each destination receives its own local copy because only the active overlay can be assumed to exist in memory.

Global patches use a different placement model because they are applied to the ROM as a whole. They may address existing data directly, reserve space, and export names for other project sources. The [Patch Files](../reference/patch-files.md) reference documents the exact directives, while [Writing a Patch](../guides/writing-a-patch.md) gives a focused walkthrough.

Source files describe the change, but they are not all maintained in the same way. The next chapter explains which project files are written by hand, which belong to an editor, and which are generated during the build.

---

[← Previous: From ROM to Project](03-from-rom-to-project.md) · [Next: Editors and Asset Pipelines →](05-editors-and-asset-pipelines.md)
