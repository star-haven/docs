---
title: Hint Files
sidebar:
  label: Hint Files
---
The recursive dumper cannot always discover every structure in an overlay or assign a useful name to everything it finds. Hint files supply missing information.

Hints live under `$database/hints/` and have names matching the source files to which they apply. Star Rod includes many examples.

| Hint | Description and example |
| --- | --- |
| `add` | Identify a structure and its type.<br>`add 80240210 Function` |
| `name` | Assign a unique name.<br>`name 80240210 Function_FadeScreenToBlack` |
| `size` | Force a structure size; rarely needed.<br>`size 80240210 800` |
| `newline` | Set the number of 32-bit words printed per line; default is eight.<br>`newline 80240210 6` |

Addresses and sizes are hexadecimal. A hint improves the dumped representation; it does not change the original game data by itself.
