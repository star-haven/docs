---
title: 6. The Modding Cycle
sidebar:
  label: The Modding Cycle
  order: 6
---

Most work in Star Rod follows the same cycle regardless of whether the result is a dialogue change, a new map, or an engine patch. The scale and tools differ, but the underlying process remains: understand the original, choose the correct source, make a controlled change, build, and test it in the game.

## 6.1. Begin with the Original Game

The decoded game is the best starting point for understanding how its parts fit together. Find an existing map, battle, item, or sequence which resembles the intended result, then follow its named structures and references. A working original example reveals assumptions which may not be obvious from a function name or field description alone.

Copy only the material needed for the change. Large copied patches are difficult to understand and may bring along local names, flags, or dependencies which belonged to the original overlay. Beginning with one small difference makes it easier to see what the build added and what caused an error.

The dump can always be recreated; the project cannot. Keep project sources under version control or another reliable backup, and do not rely on generated directories as the only copy of your work.

## 6.2. Choose the Scope

The questions from chapter 2 provide a useful starting point: which context is active, what is loaded, and how long must the new state remain valid? A map-local cutscene, a battle actor, and a saved game option require different storage and belong to different sources even when they use similar script commands.

Next decide whether the change belongs to an editor-maintained source, a local overlay patch, a global definition, or an asset pipeline. Prefer the narrowest owner which matches the intended lifetime. Global code can solve a local problem, but it also remains present and visible far beyond the place which needed it.

## 6.3. Edit and Build in Small Steps

Make the smallest useful change first and compile it before expanding the work. Star Rod must resolve names, validate structures, encode assets, allocate new data, and apply patches in a particular order. An early build keeps errors close to the edit which introduced them.

Build messages identify the source and operation which failed whenever possible. Start with the first error rather than the later failures it may have caused. Missing names often indicate the wrong context or an omitted import; placement failures usually indicate an overlay or reserved region which has run out of space; asset errors generally point back to the source format or one of the engine's limits.

**Compile Mod** writes a test ROM under `$mod/out/`. It does not alter the clean base ROM or make the dump part of the project.

## 6.4. Test the Relevant Boundaries

A successful build proves that the project could be encoded, not that the game will use the result correctly. Begin testing before the affected map or battle is loaded. An emulator save state made after that point may skip setup which the change depends on or retain data from an older build.

The loading boundaries described in chapter 2 deserve particular attention. If a world change interacts with battle, test the transition into battle and back. If state should survive travel or saving, test the corresponding map, area, and file-loading transitions. If an ID or pointer belongs to an overlay, test what happens after that overlay is replaced and later loaded again.

## 6.5. Keep and Share the Project

The editable project is the mod's source. Generated ROMs are useful for testing, but they cannot replace the patches, editor files, and assets which produced them. Keep those sources together and note any build options or external tools required by the project.

When the mod is ready to distribute, **Package Mod** creates a patch which another user can apply to their own clean ROM. Distribute that package and any documentation the project needs, not the patched ROM itself.

## 6.6. Conclusion

You now have the broad model needed to navigate Star Rod: the game is divided by contexts and loading boundaries; a project represents its data through sources, patches, and assets; editors own some of those sources; and the build combines them with a clean original ROM.

The remainder of this manual is organized by use. The tutorials follow larger changes through several parts of a project. The guides cover individual tasks, while the reference collects the syntax, formats, names, and limits which are easier to consult than to memorize.

---

[← Previous: Editors and Asset Pipelines](05-editors-and-asset-pipelines.md) · [Next: Your First Change →](../tutorials/your-first-change.md)
