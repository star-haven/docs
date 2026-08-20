---
title: Event Script Overview
sidebar:
  label: Event Scripts Overview
---
Event scripts contain most of Paper Mario's high-level behavior. They are normally declared in a map, battle, move, item, or global patch, then compiled into the bytecode read by the `Evt` interpreter. Begin with a small script from the corresponding source under the project's `src/` directories when possible. It will already use commands and API functions available in the correct context.

## A Minimal Script

```star-rod
#new:Script $PlayGreetingSound {
    Call PlaySound ( 00000208 )
    Wait 10`
    Return
    End
}
```

`#new:Script` creates a script structure and assigns it the name `$PlayGreetingSound`. The body contains one command per line. `Call` invokes a native API function, while commands such as `Wait`, `Return`, and `End` are part of the event-script language itself.

`Wait` blocks this script for the given number of frames. `Return` finishes its execution, and `End` marks the end of the script structure. A normal script which can reach its end should contain both.

Numbers in patch files are hexadecimal unless followed by a backtick, so `10` is sixteen while `` 10` `` is ten. The [Notation](../reference/notation.md) reference describes the prefixes and numeric forms used throughout patch sources.

## Calls and Arguments

Arguments appear between parentheses after a function name. They may be literal values, constants, pointers, or encoded script variables:

```star-rod
Call GetPlayerPos ( *Var0 *Var1 *Var2 )
Set *Var1 = *Var1 + 10`
```

`GetPlayerPos` treats the three arguments as output destinations and writes the player's X, Y, and Z coordinates to them. The following line raises the value in `*Var1` by ten. Function-library definitions tell Star Rod which arguments are inputs, outputs, enums, pointers, or other specialized values.

The built-in script commands and the functions available to `Call` are different things. Map and battle scripts share the same bytecode commands, but their native function libraries are not identical. If a function name cannot be resolved, confirm that it is present in the `.lib` file for the context being compiled.

## Variables and State

Each running script has sixteen local variables, `*Var0` through `*VarF`, along with local flags. They are suitable for intermediate values which only matter to that execution of the script.

Use map, area, game, or mod storage only when the value needs the corresponding lifetime. A map variable belongs to the current world map or battle stage, an area value follows the current world area, and game or mod values are saved. The [Script Variables](../reference/script-variables.md) reference lists their forms, capacities, and lifetimes.

Star Rod also accepts inline expressions when assigning variables:

```star-rod
Set *Var0 = ( *Var2 + *Var3 ) * 2
SetF *Var1 = *Var1 + 1.5
```

`Set` performs integer operations and `SetF` performs floating-point operations. Star Rod compiles these expressions into ordinary bytecode commands and may use reserved temporary variables while evaluating them.

## Flow Control

Scripts provide familiar conditional and loop forms. An `If` block compares two values and may include `Else`:

```star-rod
If *MapFlag[0] == .False
    Call PlaySound ( 00000208 )
    Set *MapFlag[0] = .True
Else
    Call PlaySound ( 00000209 )
EndIf
```

`Switch`, `Case`, and `EndSwitch` are useful when several values need different behavior. `Loop` and `EndLoop` repeat a block, while `BreakLoop` leaves the innermost loop. A script may use at most sixteen labels and may nest loops or switch blocks eight levels deep.

## Starting Other Scripts

A script may start another named script in several ways:

| Form | Behavior |
| --- | --- |
| `Exec $Script` | Start the script and continue without waiting for it. |
| `ExecWait $Script` | Start the script and block until it finishes. |
| `Thread` ... `EndThread` | Run an inline block alongside the surrounding script. |
| `ChildThread` ... `EndChildThread` | Run an inline block as a child of the surrounding script. |

Each form creates another execution context initialized with a copy of the caller's local variables and flags. Later changes to those locals do not propagate back to the caller. An allocated array or flag array is shared, as are map, area, game, and mod storage according to their ordinary lifetimes.

Calls may also block over several frames. Movement, dialogue, and other timed functions commonly keep the script at the same `Call` until the operation finishes. This is why a script can describe a long sequence without manually checking the frame count for every operation.

The [Script Commands](../reference/script-commands.md) reference lists every command understood by Classic. Functions invoked with `Call` are context-dependent; consult the applicable `.lib` files under Star Rod's `database/lib/` directory and working scripts in the project's `src/` directories for their signatures. When the existing API is not enough, [Writing a Callable Function](writing-a-callable-function.md) explains how to expose new native code to a script.
