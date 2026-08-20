---
title: 3. From ROM to Project
sidebar:
  label: ROM to Project
  order: 3
---

Star Rod does not rebuild Paper Mario from its original source code. It begins with a clean copy of the game, decodes the parts it understands, and combines those results with the files belonging to your project. The output is a new ROM; the original remains unchanged.

Four distinct bodies of data take part in this process:

| Data | Purpose |
| --- | --- |
| **Base ROM** | A clean copy of Paper Mario used as the original game image. |
| **Dump** | A decoded view of the original game and a source of unchanged data. |
| **Project** | The editable files which define one mod. |
| **Output** | Generated ROMs and distributable patches. |

Keeping these roles separate is important. A file which can be regenerated from the ROM is not the same as a file containing work unique to your project.

## 3.1. The Base ROM

Star Rod Classic targets the US 1.0 release of Paper Mario. It validates the selected ROM before dumping or building from it, and treats that file as a read-only base. Compiling a mod creates a separate output rather than modifying the base ROM in place.

The ROM contains everything the console loads, but not in forms intended for editing. Scripts are stored as bytecode, functions as MIPS machine code, and assets in the formats expected by the engine. Most useful names and source divisions are absent. Star Rod must reconstruct an editable description of this material before a mod can edit it by name.

## 3.2. The Dump

Dumping examines the ROM using Star Rod's knowledge of its tables, overlays, structures, and asset formats. Recognized data is given names and written into readable source files. Star Rod also produces index files which inventory the structures it recognized, their original ranges, and gaps in the decoded content, along with binary data for anything which must be preserved or rebuilt later.

The dump is therefore both a reference and part of the build environment. It shows how the original game implements a map, battle, item, or other feature, and supplies unchanged data when a project does not replace it. It is not a complete source-code reconstruction: some material remains partially decoded or is retained in binary form.

Treat the dump as read-only. It can be recreated from the clean ROM, while changes made there can be lost or overlooked by the build. Copy or reproduce anything you intend to modify within the project instead.

## 3.3. The Project

A project contains the files for one mod. When a project is created, **Copy Assets to Mod** populates it with decoded sources and assets and creates the directories expected by the build. Overlay sources are placed under `src/`, while handwritten changes to their structures belong in the corresponding `patch/` directories. Editor saves, configuration files, new assets, and other original work remain elsewhere in the project.

The manual uses `$mod` to mean the root of this project directory and `$dump` to mean the decoded original. The [Project Layout](../reference/project-layout.md) lists their exact contents. Normal modding work should stay under `$mod`; the dump remains part of the build environment and can be used to restore a damaged or missing original file.

Project files take several forms. Files under `src/` describe original data, while files under `patch/` contain changes to named structures. Map Editor saves a map's geometry and its related marker data separately. A new image or message may have no original counterpart at all. The build understands these different forms and combines them in the appropriate order.

## 3.4. Local Data, Globals, and Assets

The organization described in chapter 2 is reflected in the project. Map and battle patches are compiled for a particular overlay and may use names from that local context. Reusable imports are copied into each overlay which needs them; importing something does not make one permanent copy available everywhere.

Project-wide definitions are kept as **globals**. These include shared tables, names, saved variables, enums, and patches which are not owned by one map or battle section. A global name may be visible while several kinds of overlay are compiled, although the engine data it refers to must still be loaded when the game uses it.

Assets form a third category. Geometry, images, sprites, messages, and audio are built through their own pipelines and loaded through the systems introduced in chapter 2. They may be referenced by overlay data or global tables without becoming part of those structures themselves.

## 3.5. Building the Project

Compiling starts from the clean game and reads the active project's sources. Star Rod encodes changed assets, compiles scripts and functions, rebuilds tables, applies local and global patches, and places new or enlarged data where the game can load it. Generated files under directories such as `build`, `cache`, `gen`, and `temp` are intermediate results rather than project source.

The completed ROM and distributable packages are written under `$mod/out/`. Neither the base ROM nor the dump is an output of the project, and neither should contain work which exists nowhere else.

The next chapter looks more closely at the source and patch files which allow Star Rod to describe changes to a game that was originally stored only as binary data.