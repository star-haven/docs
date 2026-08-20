---
title: Debug Controls
sidebar:
  label: Debug Controls
---
Star Rod Classic can add an in-game debug overlay and menu to a compiled mod. In the main window, click **Options** beside **Compile Mod**, then open the **Debug** tab. Changes take effect the next time the mod is compiled.

## Debug Build Options

| Option | Description |
| --- | --- |
| **Enable Debug Information** | Installs the debug overlay, menu, controller shortcuts, and watch list. The bottom of the screen shows Mario's position and the current map while exploring, or the current formation and stage during battle. |
| **Embed Crash Function Names** | Adds an always-resident function-name table, currently about 73 KiB, so crash stack traces can identify common engine and global-patch functions. This does not require **Enable Debug Information**. |
| **Enable Variable Logging** | Displays recent writes to game and mod bytes and flags. This requires **Enable Debug Information**. Named globals are shown by name when possible. |
| **Quick Launch** | Skips the normal startup sequence and immediately loads the last saved file. This option does not require the debug patch. |
| **Debug Battle** | Sets the four-digit hexadecimal formation ID initially shown by **Battle Select** in the debug menu. |

These settings are stored in the project's `mod.cfg`. The corresponding keys are `EnableDebugCode`, `EnableCrashSymbols`, `EnableVarLogging`, `QuickLaunch`, and `DebugBattleID`.

## Watch List

The watch list displays up to eight live values. Configure its entries under **Watch List 0** through **Watch List 7** on the **Debug** tab, then recompile the mod. Press D-pad Right in-game to show the detailed overlay. In addition to the watch list, this overlay shows heap usage and the number of running scripts.

Click **Edit** beside a slot and choose one of the following categories:

| Category | Use |
| --- | --- |
| **Memory** | Read a byte, short, word, float, or double from a RAM address. Enter a short display name, choose the value's size, and enter the hexadecimal address. |
| **Variable** | Watch a map, area, game, or mod script variable by entering its expression without the leading `*`, such as `GameByte[0]`. Local variables and arrays cannot be watched because the overlay has no `Evt` context from which to resolve them. |
| **Clear** | Remove the entry from this slot. |

Memory values are shown in hexadecimal, except for floats and doubles. Display names are limited to 15 characters.

The same entries may be written directly in `mod.cfg`. A variable entry contains only the variable expression. A memory entry uses `address,size,name`, where the size is `1`, `2`, `4`, `F`, or `D`:

```text
DebugWatch0 = GameByte[0]
DebugWatch1 = 8010F07C,1,ActionState
```

The examples above watch a script variable and an unsigned byte at `8010F07C`, respectively. Editing the entries through Star Rod is generally less error-prone.

## In-Game Controls

| Control | Action |
| --- | --- |
| D-pad Left | Open the debug menu. Use the D-pad to navigate, R to select, and L to return or close the menu. |
| D-pad Right | Toggle the detailed overlay, including the watch list, heap usage, and running-script count. |
| D-pad Down | Toggle god mode. Mario and his partner deal 99 damage, while Mario ignores most incoming damage. |
| D-pad Up | Toggle turbo mode. This increases Mario's walk and run speeds and prevents enemy encounters. |

The debug menu also provides map and battle selection, save and load controls, editors for common game state, a sound player, collision visualization, and a full restore command.

## Crash Traces and Symbol Map

Compiled mods extend the stock crash screen with a stack trace. The completed register page is preserved in one framebuffer, while the trace is rendered once into another; the display then alternates those buffers without redrawing either page. Only the pixels outside the register panel are copied from the stock page. The alternate buffer's clean panel is darkened once using the stock operation before the trace is drawn, so register text is not copied beneath it and the background retains the stock brightness. While the script interpreter is executing a command, the trace also captures the active `Evt` and shows its source/start pointer plus the byte offset of its current command. Stack unwinding is best-effort, so a trace may stop early when code does not use a conventional stack frame.

Every successful compile writes `symbol_map.txt` to the mod's output directory. The file lists known engine functions and scripts, along with functions and scripts that the build relocated or assigned through `#new` or `@Hook`. Each row includes its RAM address range, type, library scope, origin, source file, and name. Overlay addresses can overlap, so use the scope and currently loaded map or battle to identify the applicable entry.

When **Embed Crash Function Names** is selected, the build also embeds a compact table containing the common engine function names and functions from global patches. These functions are always resident, so the crash screen can safely show a matching name and offset. Names are shortened to fit the register panel. Overlay functions and all script names remain outside the ROM; unresolved frames and script context continue to show raw addresses for lookup in `symbol_map.txt`.
