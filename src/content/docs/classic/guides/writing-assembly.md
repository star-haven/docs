---
title: Writing Assembly
sidebar:
  label: Writing Assembly
---
Assembly is useful when an event script cannot express the change you need or when the behavior being modified already belongs to a native function. Star Rod assembles code for the N64's NEC VR4300 processor and supplies pseudo-instructions for common pointer, stack, and control-flow operations.

This guide assumes a working knowledge of MIPS assembly. The [Assembly reference](../reference/assembly.md) documents the syntax added by Star Rod.

## Choose the Function's Context

Native code belongs to the context in which it will run. A function used only by one map should normally be declared in that map's `.mpat` file; battle functions belong in the relevant battle patch. Use a global patch only when the function genuinely needs a project-wide home and its dependencies are always loaded when it runs.

In a local patch, a new function is declared with `#new:Function`:

```mipsasm
#new:Function $ReturnOne {
    LI      V0, 1
    JR      RA
    NOP
}
```

The name `$ReturnOne` is a pointer which other structures in the same context may use. Star Rod places the function within the available space for its overlay, so the declaration does not need a handwritten address.

## Call a Known Function

Known engine functions are addressed with `~Func` expressions from the library for the current context. This wrapper calls `rand_int` and returns its result:

```mipsasm
#new:Function $FlipCoin {
    PUSH    RA
    LI      A0, 1
    JAL     ~Func:rand_int
    NOP
    JPOP    RA
}
```

`PUSH` saves `RA` before the nested call. `JPOP` restores it, returns to the caller, and releases the stack frame. The value returned by `rand_int` remains in `V0`.

Follow the ordinary MIPS calling convention. Treat `T0` through `T9`, `A0` through `A3`, and the result registers as caller-saved. Preserve any `S` registers the function changes, and save `RA` before making another function call.

## Use Names and Pseudo-Instructions

Pointers such as `$SomeTable`, constants such as `.SomeValue`, and function expressions such as `~Func:get_variable` may be used where the corresponding instruction accepts them. Keeping these names visible allows Star Rod to resolve their final values during compilation.

`#DEF` can give a register a temporary descriptive name:

```mipsasm
#DEF   A0, *BadgeID
COPY   T0, *BadgeID
#UNDEF A0
```

Use `#UNDEF ALL` when several active register names should be cleared together. The register list, loops, branches, absolute loads and stores, and stack operations are collected in the [Assembly reference](../reference/assembly.md).

## Modify Existing Code

Functions in the project sources provide the best examples of the calling convention and data layout used in a particular subsystem. A named local function may be patched like any other decoded structure:

```mipsasm
@ $Function_ExistingName {
    ...
}
```

Copy the entire function from the corresponding project source when the replacement is meant to own all of its behavior. For a small instruction change, patch the relevant offset and preserve the surrounding control flow. Pay particular attention to branch and jump delay slots: the instruction after a branch or jump still executes unless a branch-likely instruction skips it.

Build after each small change and test from before the affected overlay or subsystem is initialized. An assembled function can still fail at runtime if it calls a function from the wrong context, uses a stale pointer, corrupts the stack, or changes a register the caller expected to survive.

To expose native code through the event-script `Call` command, use the signature and return convention described in [Writing a Callable Function](writing-a-callable-function.md).
