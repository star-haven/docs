---
title: Writing a Callable Function
sidebar:
  label: Writing a Callable Function
---

# Writing a Callable Function

Event scripts can use the `Call` command to invoke a native MIPS function. A function called this way must have the signature `ApiStatus Function(Evt* script, s32 isInitialCall)`, which is detailed in the following section.

Declare the function with `#new:Function` in a patch belonging to the same context as the calling script:

```
#new:Function $MyFunction {
    JR      RA
    LI      V0, 2        % ApiStatus_DONE2
}
```

The corresponding script call is:

```star-rod
Call $MyFunction ( )
```

## Calling Convention

A script-callable function has the following source-level signature:

```c
ApiStatus Function(Evt* script, s32 isInitialCall)
```

At the assembly level, its arguments arrive in these registers:

| Register | Value |
| --- | --- |
| `A0` | Pointer to the caller's `Evt` context. |
| `A1` | Nonzero on the first call; zero on later calls to a blocking function. |

The function returns one of these values in `V0`:

| Value | Name | Behavior |
| ---: | --- | --- |
| `0` | `ApiStatus_BLOCK` | Keep the script blocked and call the function again on the next frame. |
| `2` | `ApiStatus_DONE2` | Finish the call and allow the script to continue. |

A blocking function may use the four `functionTemp` words beginning at offset `0x70` in the `Evt` context to retain its own state between calls.

Follow the ordinary MIPS calling convention and preserve any saved registers the function uses.

## Stack Frames

`PUSH` and `POP` provide a compact way to save registers and return from the function:

```mipsasm
PUSH    RA, S0, S1
...
POP     RA, S0, S1
```

`PUSH` reserves the default `0x10` bytes of local stack space and saves the listed registers after it. `POP` restores those registers and releases the stack frame. Use the same registers in the same order for both instructions.

```mipsasm
PUSH    RA, S0, S1
...
POP     RA, S0, S1
JR      RA
LI      V0, 2        % ApiStatus_DONE2
```

An explicit size in brackets changes the amount of local stack space reserved before the saved registers:

```mipsasm
PUSH[20]   RA, S0, S1
...
POP[20]    RA, S0, S1
```

The size is hexadecimal by default and must be a multiple of four bytes. A backtick may be used for decimal. Repeat the same size on `POP` so it restores registers from the correct locations.

## Reading Arguments

Suppose a script supplies one input value followed by a variable which will receive the result:

```star-rod
Call $MyFunction ( 5` *Var0 )
```

These arguments are stored as consecutive 32-bit words. At the beginning of the function, `script->ptrReadPos`, at offset `0x0C` in the `Evt` structure, points to the encoded first argument. The encoded `*Var0` destination follows it.

An input argument may be a literal value or an encoded script variable. Pass it to `get_variable` when the function needs its value:

```mipsasm
PUSH    RA, S0, S1, S2
COPY    S0, A0          % save the Evt pointer
LW      S1, C (S0)      % point to the first argument
COPY    A0, S0
JAL     ~Func:get_variable
LW      A1, 0 (S1)      % first argument
COPY    S2, V0          % resolved input value
ADDIU   S1, S1, 4       % advance to the output argument
```

`get_variable` returns the resolved input in `V0`. This example keeps it in `S2` and advances `S1` to the second argument. Since `S0`, `S1`, and `S2` are saved registers, they are included in the stack frame.

## Writing Return Values

`V0` must hold the `ApiStatus` result when the function returns, so an ordinary value is written back through a script variable instead. Pass the encoded output argument to `set_variable` in `A1` and the value to write in `A2`. Continuing the example above, `S1` now points to `*Var0` and `S2` holds the value:

```mipsasm
COPY    A0, S0
LW      A1, 0 (S1)
JAL     ~Func:set_variable
COPY    A2, S2
POP     RA, S0, S1, S2
JR      RA
LI      V0, 2        % ApiStatus_DONE2
```

Using `POP` here leaves the function free to place `ApiStatus_DONE2` in `V0` before returning. The [Assembly reference](../reference/assembly.md#script-callable-functions) lists the relevant `Evt` offsets and the remaining `ApiStatus` results.
