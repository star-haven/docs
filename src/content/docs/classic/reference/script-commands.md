---
title: Script Commands
sidebar:
  label: Script Commands
---
This page lists every functional `Evt` command accepted by Star Rod Classic. These commands are part of the script interpreter itself. Functions invoked by `Call` are a separate interface: map, battle, and global scripts each have their own function library under `database/`.

The syntax column uses descriptive argument names. A **value** may ordinarily be a literal, constant, or script variable. A **destination** must be writable script storage. The opcode is included for comparison with raw scripts and engine code; it is not normally written by hand.

Gaps in the opcode sequence are unused or unavailable in Classic.

## Execution and Timing

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `01` | `End` | Mark the end of the script data and terminate execution if reached. |
| `02` | `Return` | Terminate this execution of the script. A normal script places `Return` before `End`. |
| `03` | `Label label` | Define a destination for `Goto`. Labels may be numeric or named. |
| `04` | `Goto label` | Continue execution at the matching label in this script. |
| `05` | `Loop [count]` | Begin a loop. A count of zero, or an omitted count, repeats indefinitely. |
| `06` | `EndLoop` | Return to the matching `Loop` until its count is exhausted. |
| `07` | `BreakLoop` | Leave the innermost loop. |
| `08` | `Wait frames` | Block this script for the given number of frames. |
| `09` | `WaitSeconds seconds` | Block for the given number of seconds, converted at 30 frames per second. |

A script may define at most sixteen labels and nest loops at most eight levels deep.

## Conditions

| Opcode | Syntax | Condition |
| ---: | --- | --- |
| `0A` | `If left == right` | The values are equal. |
| `0B` | `If left != right` | The values are not equal. |
| `0C` | `If left < right` | The left value is less than the right value. |
| `0D` | `If left > right` | The left value is greater than the right value. |
| `0E` | `If left <= right` | The left value is less than or equal to the right value. |
| `0F` | `If left >= right` | The left value is greater than or equal to the right value. |
| `10` | `If value & mask` | At least one bit in the mask is set in the value. |
| `11` | `If value !& mask` | None of the bits in the mask are set in the value. |
| `12` | `Else` | Begin the alternate branch of an `If`. |
| `13` | `EndIf` | End an `If` block. |

Both operands of the comparison commands are resolved as script values. The mask used by `&` and `!&` is literal.

## Switches

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `14` | `Switch value` | Begin a switch using a resolved value. |
| `15` | `SwitchConst value` | Begin a switch using the argument literally, without resolving it as a script variable. |
| `16` | `Case == value` | Match when the switch value equals the argument. |
| `17` | `Case != value` | Match when the switch value does not equal the argument. |
| `18` | `Case < value` | Match when the switch value is less than the argument. |
| `19` | `Case > value` | Match when the switch value is greater than the argument. |
| `1A` | `Case <= value` | Match when the switch value is less than or equal to the argument. |
| `1B` | `Case >= value` | Match when the switch value is greater than or equal to the argument. |
| `1C` | `Default` | Match when no earlier case has matched. |
| `1D` | `CaseOR == value` | Add an equality test to an OR case group. The group matches when any test matches. |
| `1E` | `CaseAND == value` | Add an equality test to an AND case group. The group matches only when every test matches. |
| `1F` | `Case & mask` | Match when the switch value and literal mask share at least one set bit. |
| `20` | `EndCaseGroup` | End a sequence of `CaseOR` or `CaseAND` tests. |
| `21` | `Case minimum to maximum` | Match an inclusive range. |
| `22` | `BreakCase` | Leave the current case and continue after the switch. |
| `23` | `EndSwitch` | End the current switch. |

Only the first matching case body runs. Switch blocks may be nested at most eight levels deep.

## Assignment and Arithmetic

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `24` | `Set destination source` | Resolve the source as an integer and store it in the destination. |
| `25` | `SetConst destination value` | Store the second argument literally, without resolving it as a script variable. |
| `26` | `SetF destination source` | Resolve the source as a float and store it in the destination. |
| `27` | `Add destination value` | Add an integer value to the destination. |
| `28` | `Sub destination value` | Subtract an integer value from the destination. |
| `29` | `Mul destination value` | Multiply the destination by an integer value. |
| `2A` | `Div destination value` | Divide the destination by an integer value. |
| `2B` | `Mod destination value` | Replace the destination with its integer remainder after division by the value. |
| `2C` | `AddF destination value` | Add a floating-point value to the destination. |
| `2D` | `SubF destination value` | Subtract a floating-point value from the destination. |
| `2E` | `MulF destination value` | Multiply the destination by a floating-point value. |
| `2F` | `DivF destination value` | Divide the destination by a floating-point value. |

Star Rod's inline assignment syntax compiles expressions into these commands:

```star-rod
Set  *Var0 = *Var1 + 10`
SetF *Var2 = *Var2 / 2.0
```

## Buffers and Arrays

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `30` | `UseIntBuffer address` | Set the current integer-buffer pointer. |
| `31` | `Get1Int destination` | Read one word from the integer buffer and advance it. |
| `32` | `Get2Int a b` | Read two words into the destinations and advance the buffer. |
| `33` | `Get3Int a b c` | Read three words into the destinations and advance the buffer. |
| `34` | `Get4Int a b c d` | Read four words into the destinations and advance the buffer. |
| `35` | `GetIntN destination index` | Read one word at an index relative to the current integer buffer without advancing it. |
| `36` | `UseFloatBuffer address` | Set the current buffer pointer for floating-point reads. This is the same pointer used by `UseIntBuffer`. |
| `37` | `Get1Float destination` | Read one value through the float accessor and advance the buffer. |
| `38` | `Get2Float a b` | Read two floating-point values and advance the buffer. |
| `39` | `Get3Float a b c` | Read three floating-point values and advance the buffer. |
| `3A` | `Get4Float a b c d` | Read four floating-point values and advance the buffer. |
| `3B` | `GetFloatN destination index` | Read one floating-point value at an index without advancing the buffer. |
| `3C` | `UseArray address` | Set the storage addressed by `*Array`. |
| `3D` | `UseFlags address` | Set the packed-bit storage addressed by `*FlagArray`. |
| `3E` | `NewArray length destination` | Allocate an array of words, make it the current array, and write its address to the destination. |

The current buffer, array, and flag-array pointers belong to the running `Evt` context. Parallel or child scripts inherit the array pointers, so allocated storage may be used to share values between them.

## Bitwise Operations

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `3F` | `AND destination mask` | Resolve the mask, then apply a bitwise AND to the destination. |
| `40` | `ConstAND destination mask` | Apply a literal mask without resolving it as a script variable. |
| `41` | `OR destination mask` | Resolve the mask, then apply a bitwise OR to the destination. |
| `42` | `ConstOR destination mask` | Apply a literal mask without resolving it as a script variable. |

## Functions, Scripts, and Triggers

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `43` | `Call function ( arguments... )` | Invoke an EVT-compatible native function. The function may finish immediately or block the script across several frames. |
| `44` | `Exec script` | Start another script and continue without waiting. |
| `45` | `Exec script destination` | Start another script, write its script ID to the destination, and continue without waiting. |
| `46` | `ExecWait script` | Start a child script and block until it finishes. |
| `47` | `Bind script trigger target prompt destination` | Bind a script to a trigger and optionally write the new trigger pointer to a destination. |
| `48` | `Unbind` | Delete the trigger which owns the current bound script. |
| `49` | `Kill scriptID` | Terminate the script selected by ID. |
| `4A` | `Jump script` | Replace the current script's source and restart execution there. |
| `4B` | `SetPriority priority` | Change the current script's execution priority. |
| `4C` | `SetTimescale scale` | Change the current script's time scale. |
| `4D` | `SetGroup group` | Assign the current script to a group. |
| `4E` | `BindLock script trigger target itemList tattleMessage prompt` | Bind a lock or item-prompt script using an accepted-item list. |
| `4F` | `SuspendAll group` | Suspend scripts in the selected group. |
| `50` | `ResumeAll group` | Resume scripts in the selected group. |
| `51` | `SuspendOthers group` | Suspend other scripts in the selected group while leaving the current script running. |
| `52` | `ResumeOthers group` | Resume other scripts in the selected group. |
| `53` | `Suspend scriptID` | Suspend the script selected by ID. |
| `54` | `Resume scriptID` | Resume the script selected by ID. |
| `55` | `DoesScriptExist scriptID destination` | Write whether the selected script is still running to the destination. |

`Exec`, `ExecWait`, and the thread commands initialize new local storage from the caller. Later changes to ordinary local variables do not propagate back. See [Script Variables](script-variables.md) for the storage shared between executions.

The arguments accepted by `Bind` and `BindLock` depend on the trigger type. Trigger constants and argument types are supplied by the function library for the script's context.

## Inline Threads

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `56` | `Thread` | Begin an inline block which runs concurrently and independently of the surrounding script. |
| `57` | `EndThread` | End a `Thread` block. |
| `58` | `ChildThread` | Begin a concurrent inline block which is owned by the surrounding script and ends when its parent ends. |
| `59` | `EndChildThread` | End a `ChildThread` block. |

The surrounding script skips over the inline block after starting it and continues with the command following its terminator.

## Debugging

| Opcode | Syntax | Description |
| ---: | --- | --- |
| `5B` | `PrintVar value` | Format a value in the engine's script-debug buffer. This is not ordinary on-screen or console output. |
