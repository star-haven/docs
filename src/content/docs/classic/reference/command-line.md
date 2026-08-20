---
title: Command Line
sidebar:
  label: Command Line
---
Star Rod runs command-line tasks when launched with arguments. Packaged launchers use the bundled Java runtime:

```text
StarRod.bat -Version   % Windows
./StarRod -Version    % Linux and macOS
```

The active project and base ROM are read from `local/main.cfg` beside the executable. If that file is missing, Star Rod imports the legacy `cfg/main.cfg` and saves it to the new location. `ModPath` selects the project; relative paths beginning with `.` are resolved from the application directory. Build options come from that project's `mod.cfg`.

Tasks are processed from left to right and may be chained:

```text
StarRod.bat -CompileTextures -CompileMaps -CompileMod
```

## Project and ROM Tasks

| Task | Description |
| --- | --- |
| `-Version` | Print `VERSION=<version>`. |
| `-DumpAssets` | Run the configured asset dump when the current dump is not already present. |
| `-CopyAssets` | Copy missing dumped sources into the active project. |
| `-CompileMod` | Build the active project with its `mod.cfg` options. |
| `-DumpMaps ROMfile` | Validate a big-endian Paper Mario ROM and dump its maps. |

`-DumpMaps` takes its ROM from the command line. The other dump and build tasks use the ROM and project selected in `local/main.cfg`.

## Map Tasks

| Task | Description |
| --- | --- |
| `-CompileShape map` | Build the map's shape asset. |
| `-CompileHit map` | Build the map's collision asset. |
| `-GenerateScript map` | Generate Classic script source for the map. |
| `-CompileMap map` | Build shape and collision, then generate the map's Classic script source. |
| `-CompileMaps` | Perform all three operations for every saved map. |

`map` may be an asset name such as `mac_00` or a project-relative `.xml` path. A bare Classic name is searched under `map/save/` before `map/src/`.

```text
StarRod.bat -CompileMap mac_00
StarRod.bat -CompileShape map/save/custom/my_map.xml
```

## Image Tasks

| Task | Description |
| --- | --- |
| `-CompileTextures` | Build the project's map texture archives. |
| `-CompileBackgrounds` | Build the project's map background images. |

These create intermediate assets and do not patch a ROM by themselves. Chain `-CompileMod` afterward for a complete build.
