---
title: Assembly
sidebar:
  label: Assembly
---
Star Rod assembles instructions for the NEC VR4300 CPU used by the Nintendo 64. The [MIPS](mips.md) reference lists the native registers and instructions. This page covers the supplementary syntax and pseudo-instructions provided by Star Rod.

Labels, pointers such as `$Script_Example`, script variables such as `*StoryProgress`, and function expressions such as `~Func:get_variable` may be used where the corresponding instruction accepts them.

## Pseudo-Instructions

Pseudo-instructions make common sequences easier to read and keep relocatable addresses visible to Star Rod.

### Convenience

| Instruction | Description |
| --- | --- |
| `CLEAR X` | Set X to zero; equivalent to `DADDU X, R0, R0`. |
| `COPY X, Y` | Copy Y into X; equivalent to `DADDU X, Y, R0`. |
| `SUBI X, Y, value` | Subtract a signed immediate. |
| `SUBIU X, Y, value` | Subtract an unsigned immediate. |
| `LA X, value` | Load an address or word using the ADD variant. `LIA` is accepted as an alias. |
| `LI X, value` | Load a word using the OR variant. `LIO` is accepted as an alias. |
| `LIF FX, value` | Load a constant float into a COP1 register. |

### Absolute Loads and Stores

| Instruction | Description |
| --- | --- |
| `LAB X, ADDR` | Load a signed byte. |
| `LABU X, ADDR` | Load an unsigned byte. |
| `SAB X, ADDR` | Store a byte. |
| `LAH X, ADDR` | Load a signed half-word. |
| `LAHU X, ADDR` | Load an unsigned half-word. |
| `SAH X, ADDR` | Store a half-word. |
| `LAW X, ADDR` | Load a word. |
| `SAW X, ADDR` | Store a word. |
| `LAF FX, ADDR` | Load a float into a COP1 register. |
| `SAF FX, ADDR` | Store a float from a COP1 register. |
| `LAD FX, ADDR` | Load a double into a COP1 register. |

### Table Loads and Stores

| Instruction | Description |
| --- | --- |
| `LTB X, Y (ADDR)` | Load the Yth signed byte. |
| `LTBU X, Y (ADDR)` | Load the Yth unsigned byte. |
| `LTH X, Y (ADDR)` | Load the Yth signed half-word. |
| `LTHU X, Y (ADDR)` | Load the Yth unsigned half-word. |
| `LTW X, Y (ADDR)` | Load the Yth word. |
| `LTF FX, Y (ADDR)` | Load the Yth float into a COP1 register. |
| `STB X, Y (ADDR)` | Store X at the Yth byte. |
| `STH X, Y (ADDR)` | Store X at the Yth half-word. |
| `STW X, Y (ADDR)` | Store X at the Yth word. |
| `STF FX, Y (ADDR)` | Store FX at the Yth float. |

### Stack Operations

| Instruction | Description |
| --- | --- |
| `PUSH X, Y, ...` | Reserve the default 0x10-byte local area, save the registers beginning at `SP[10]`, and align the frame to eight bytes. |
| `PUSH[N] X, Y, ...` | Reserve `N` bytes instead of the default local area, then save the registers. `N` must be a multiple of four. |
| `POP X, Y, ...` | Restore the registers and release the frame. Use the same list and order as `PUSH`. |
| `JPOP X, Y, ...` | Restore the registers and return through RA, placing the stack adjustment in the return delay slot. |

Repeat the explicit size on `POP[N]` or `JPOP[N]`. Stack sizes are hexadecimal by default; append a backtick to write one in decimal.

### Branch Conditions

| Instruction | Description |
| --- | --- |
| `BLT X, Y, label` | Branch when X < Y. |
| `BGT X, Y, label` | Branch when X > Y. |
| `BLE X, Y, label` | Branch when X <= Y. |
| `BGE X, Y, label` | Branch when X >= Y. |
| `BLTL`, `BGTL`, `BLEL`, `BGEL` | Branch-likely forms with the same three arguments. |

### Delay-Slot Reservation

`RESERVED` may be placed in the delay slot following a pseudo-instruction and a jump. It forces the final instruction emitted by the pseudo-instruction to occupy that delay slot.

## Loops

`LOOP`, `ENDLOOP`, and `BREAKLOOP` generate labels and branches around a loop body.

### Counting Loops

```star-rod
LOOP index = start,step,end
    ...
ENDLOOP
```

Omitting `step` uses one. `index` must be a CPU register. The other values may be CPU registers or immediate integers whose absolute value is at most `7FFF`. The condition is checked before the first iteration.

The generated comparison is always `index < end`; counting loops therefore support ascending loops with a positive step. Write the branches explicitly for a decrementing loop.

| Instruction | Iterations |
| --- | --- |
| `LOOP A0 = 0,5` | A0 = 0, 1, 2, 3, 4. |
| `LOOP T1 = 1,2,10` | T1 = 1, 3, 5, 7, 9. |
| `LOOP SP = SP,4,T4` | Increment SP by four while SP < T4. |

### Conditional Loops

```star-rod
LOOP index < value
    ...
ENDLOOP
```

The condition is checked before each iteration. `index` must be a CPU register; `value` may be a CPU register or an immediate whose absolute value is at most `7FFF`. The supported comparisons are `==`, `!=`, `>`, `>=`, `<`, and `<=`.

`BREAKLOOP` exits the innermost active loop.

## Register Naming

`#DEF` assigns a descriptive name beginning with `*` to a CPU or COP1 register:

```mipsasm
#DEF   A0, *Counter
CLEAR  *Counter
ADDIU  *Counter, *Counter, 1
#UNDEF A0
COPY   A1, A0
```

While the definition is active, the bare register name may not be used. `#UNDEF` may name several registers, such as `#UNDEF A0, A1, A2`. `#UNDEF ALL` clears every active register name.

## Script-Callable Functions

The source-level signature is:

```c
ApiStatus Function(Evt* script, s32 isInitialCall)
```

| Register | Value |
| --- | --- |
| A0 | Pointer to the caller's `Evt`. |
| A1 | Nonzero on the first call and zero on subsequent calls. |

`script->ptrReadPos` is at offset `0x0C`; it points to the first argument supplied to `Call`. The four-word `functionTemp` scratch array begins at offset `0x70` and may retain state between repeated calls. `varTable[16]` begins at offset `0x84`.

| Value | Name | Behavior |
| ---: | --- | --- |
| 0 | `ApiStatus_BLOCK` | Call the function again on the next frame. |
| 1 | `ApiStatus_DONE1` | Finish the call unconditionally. |
| 2 | `ApiStatus_DONE2` | Finish subject to the interpreter's disabled-script handling; usual completion result. |
| 3 | `ApiStatus_REPEAT` | Call the function again immediately; mainly used internally by the interpreter. |
| FF | `ApiStatus_FINISH` | Finish execution of the script. |
