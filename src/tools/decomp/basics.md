# Decomp modding basics

The development loop is as follows:
1. `./configure` if you added or removed files
2. `ninja` to compile
3. `./run` to run (will automatically run `ninja` if required)

## `splat.yaml`

An important part of decomp modding is **specifying where files should be linked**. For our purposes, this means describing where in ROM/RAM source code and assets should go.

The file that does this is called `ver/us/splat.yaml`. This is a [YAML](https://learnxinyminutes.com/docs/yaml/) file.

The `segments` list describes all the [segments](https://github.com/ethteck/splat/wiki/Segments) in the ROM. When adding a new file to be added to the ROM, you must add it as a segment or subsegment.

For example, to add a new map called `tst_14`, append this segment:

```yaml
segments:
  # ...
  - name: tst_14
    dir: world/area_tst/tst_14
    type: code
    start: auto
    vram_class: map
    subsegments:
    - [auto, c, tst_14]
    - [auto]
```

## Assets

`splat.yaml` has a list called `asset_stack` which looks like this:

```yaml
asset_stack:
  - star_rod_build
  - dx
  - us
```

These form what we call the "asset stack". When an asset needs to be built, configure will first look for it in `assets/star_rod_build`, then `assets/dx`, then `assets/us`.

For example, `INCLUDE_IMG("ui/input/analog_stick_left.png", ui_input_analog_stick_left_png` will look in each of these directories in turn until it finds `ui/input/analog_stick_left.png`. This allows you to override vanilla (`us`) assets easily.

You should prepend a directory for your mod onto the asset stack, for example:

```yaml
asset_stack:
  - my_mod
  - star_rod_build
  - dx
  - us
```

Then place assets for your mod in a new directory `assets/my_mod`.

### MapFS

Map backgrounds, texture archives, geometry, and collision files live in an asset folder called `mapfs`. These are combined into an archive at build time.

When adding a new MapFS asset, also add it to the list in `tools/splat_ext/map_data.yaml`.
