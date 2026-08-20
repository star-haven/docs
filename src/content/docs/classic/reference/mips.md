---
title: MIPS
sidebar:
  label: MIPS
---
Paper Mario runs on the Nintendo 64's NEC VR4300 CPU. This page lists the native CPU, COP0, and COP1 instructions accepted by Star Rod Classic. It does not include pseudo-instructions or other Star Rod extensions; those are covered by the [Assembly](assembly.md) reference.

Instruction and register names are case-insensitive. The operand forms below use `rd` for a destination register, `rs` and `rt` for source registers, `fd`, `fs`, and `ft` for COP1 registers, `sa` for a shift amount, and `offset(base)` for a signed 16-bit displacement from a CPU register.

## CPU Registers

The VR4300 has 32 general-purpose 64-bit registers. Paper Mario normally uses 32-bit values and follows the usual MIPS calling convention.

| Number | Name | Conventional use |
| ---: | --- | --- |
| 0 | `R0` | Constant read-only zero. |
| 1 | `AT` | Assembler temporary, do not use. Reserved for pseudo-instructions. |
| 2–3 | `V0`, `V1` | Function return values and temporary values. |
| 4–7 | `A0`–`A3` | Function arguments. |
| 8–15 | `T0`–`T7` | Caller-saved temporary values. |
| 16–23 | `S0`–`S7` | Callee-saved values. |
| 24–25 | `T8`, `T9` | Caller-saved temporary values. |
| 26–27 | `K0`, `K1` | Reserved for exception handling. |
| 28 | `GP` | Global pointer. Do not use. |
| 29 | `SP` | Stack pointer. |
| 30 | `S8` / `FP` | Callee-saved value or frame pointer. `FP` is an alias accepted by Classic. |
| 31 | `RA` | Return address written by link instructions. |

`HI` and `LO` are separate result registers used by integer multiplication and division. Access them with `MFHI`, `MFLO`, `MTHI`, and `MTLO`.

## COP1 Registers

COP1 provides 32 floating-point registers named `F0` through `F31`. Single-precision operations use one register. Double-precision values use an even-numbered register together with the following odd-numbered register.

The calling convention uses `F0` and `F2` for results, `F12` and `F14` for arguments, `F20` through `F31` as callee-saved registers, and the remaining registers as temporaries. Native functions must preserve the saved registers they modify.

## Control Flow

Every jump and branch has one delay slot. The instruction following an ordinary branch executes whether or not the branch is taken. A branch-likely instruction ending in `L` executes its delay slot only when the branch is taken.

| Instruction | Meaning |
| --- | --- |
| `BEQ rs, rt, label` | Branch if the registers are equal. |
| `BNE rs, rt, label` | Branch if the registers are not equal. |
| `BLEZ rs, label` | Branch if `rs` is less than or equal to zero. |
| `BGTZ rs, label` | Branch if `rs` is greater than zero. |
| `BLTZ rs, label` | Branch if `rs` is less than zero. |
| `BGEZ rs, label` | Branch if `rs` is greater than or equal to zero. |
| `BEQL`, `BNEL`, `BLEZL`, `BGTZL`, `BLTZL`, `BGEZL` | Branch-likely forms of the corresponding instructions. |
| `BLTZAL rs, label` | Branch if negative and place the return address in `RA`. |
| `BGEZAL rs, label` | Branch if nonnegative and place the return address in `RA`. |
| `BLTZALL`, `BGEZALL` | Branch-likely forms of the corresponding link instructions. |
| `J target` | Jump to an address in the current 256 MB region. |
| `JAL target` | Jump and place the return address in `RA`. |
| `JR rs` | Jump to the address in `rs`. |
| `JALR rs, rd` | Jump to the address in `rs` and place the return address in `rd`. This is Classic's operand order. |

## Integer Arithmetic and Logic

The instructions beginning with `D` operate on 64-bit values. `ADD`, `SUB`, and their immediate forms trap on signed overflow; the instructions ending in `U` do not.

| Instruction | Meaning |
| --- | --- |
| `ADD rd, rs, rt` | Signed 32-bit addition. |
| `ADDU rd, rs, rt` | 32-bit addition without an overflow trap. |
| `SUB rd, rs, rt` | Signed 32-bit subtraction. |
| `SUBU rd, rs, rt` | 32-bit subtraction without an overflow trap. |
| `DADD rd, rs, rt` | Signed 64-bit addition. |
| `DADDU rd, rs, rt` | 64-bit addition without an overflow trap. |
| `DSUB rd, rs, rt` | Signed 64-bit subtraction. |
| `DSUBU rd, rs, rt` | 64-bit subtraction without an overflow trap. |
| `ADDI rt, rs, immediate` | Add a sign-extended 16-bit immediate with overflow checking. |
| `ADDIU rt, rs, immediate` | Add a sign-extended 16-bit immediate without an overflow trap. |
| `DADDI rt, rs, immediate` | 64-bit immediate addition with overflow checking. |
| `DADDIU rt, rs, immediate` | 64-bit immediate addition without an overflow trap. |
| `AND rd, rs, rt` | Bitwise AND. |
| `OR rd, rs, rt` | Bitwise OR. |
| `XOR rd, rs, rt` | Bitwise exclusive OR. |
| `NOR rd, rs, rt` | Bitwise NOR. |
| `ANDI rt, rs, immediate` | AND with a zero-extended 16-bit immediate. |
| `ORI rt, rs, immediate` | OR with a zero-extended 16-bit immediate. |
| `XORI rt, rs, immediate` | Exclusive OR with a zero-extended 16-bit immediate. |
| `LUI rt, immediate` | Place a 16-bit immediate in bits 16–31 and clear the low half. |
| `SLT rd, rs, rt` | Set `rd` to one if signed `rs < rt`; otherwise set it to zero. |
| `SLTU rd, rs, rt` | Unsigned form of `SLT`. |
| `SLTI rt, rs, immediate` | Compare `rs` with a sign-extended immediate as signed values. |
| `SLTIU rt, rs, immediate` | Compare as unsigned values after sign-extending the immediate. |

## Shifts

| Instruction | Meaning |
| --- | --- |
| `SLL rd, rt, sa` | Shift a 32-bit value left by `sa`. |
| `SRL rd, rt, sa` | Logical 32-bit right shift. |
| `SRA rd, rt, sa` | Arithmetic 32-bit right shift. |
| `SLLV rd, rt, rs` | Shift left by the low five bits of `rs`. |
| `SRLV rd, rt, rs` | Logical right shift by the low five bits of `rs`. |
| `SRAV rd, rt, rs` | Arithmetic right shift by the low five bits of `rs`. |
| `DSLL rd, rt, sa` | Shift a 64-bit value left by `sa`. |
| `DSRL rd, rt, sa` | Logical 64-bit right shift. |
| `DSRA rd, rt, sa` | Arithmetic 64-bit right shift. |
| `DSLL32 rd, rt, sa` | Shift a 64-bit value left by `sa + 32`. |
| `DSRL32 rd, rt, sa` | Logical 64-bit right shift by `sa + 32`. |
| `DSRA32 rd, rt, sa` | Arithmetic 64-bit right shift by `sa + 32`. |
| `DSLLV rd, rt, rs` | Shift left by the low six bits of `rs`. |
| `DSRLV rd, rt, rs` | Logical right shift by the low six bits of `rs`. |
| `DSRAV rd, rt, rs` | Arithmetic right shift by the low six bits of `rs`. |

## Multiplication and Division

These instructions write `HI` and `LO`. Division places the quotient in `LO` and the remainder in `HI`.

| Instruction | Operands | Meaning |
| --- | --- | --- |
| `MULT` | `rs, rt` | Signed 32-bit multiplication. |
| `MULTU` | `rs, rt` | Unsigned 32-bit multiplication. |
| `DMULT` | `rs, rt` | Signed 64-bit multiplication. |
| `DMULTU` | `rs, rt` | Unsigned 64-bit multiplication. |
| `DIV` | `rs, rt` | Signed 32-bit division. |
| `DIVU` | `rs, rt` | Unsigned 32-bit division. |
| `DDIV` | `rs, rt` | Signed 64-bit division. |
| `DDIVU` | `rs, rt` | Unsigned 64-bit division. |
| `MFHI` | `rd` | Copy `HI` to a CPU register. |
| `MFLO` | `rd` | Copy `LO` to a CPU register. |
| `MTHI` | `rs` | Copy a CPU register to `HI`. |
| `MTLO` | `rs` | Copy a CPU register to `LO`. |

Multiplication and division can take several cycles. If `MFHI` or `MFLO` is reached before the operation is complete, the processor stalls until the result is ready; no manual delay is required before reading it. However, two intervening instructions are required after reading `HI` or `LO` before that register may be written again. After `MFHI`, place at least two other instructions before another multiply or divide or an `MTHI`. After `MFLO`, do the same before another multiply or divide or an `MTLO`.

## Loads and Stores

| Instruction | Meaning |
| --- | --- |
| `LB rt, offset(base)` | Load and sign-extend a byte. |
| `LBU rt, offset(base)` | Load and zero-extend a byte. |
| `LH rt, offset(base)` | Load and sign-extend a half-word. |
| `LHU rt, offset(base)` | Load and zero-extend a half-word. |
| `LW rt, offset(base)` | Load and sign-extend a word. |
| `LWU rt, offset(base)` | Load and zero-extend a word. |
| `LD rt, offset(base)` | Load a doubleword. |
| `SB rt, offset(base)` | Store a byte. |
| `SH rt, offset(base)` | Store a half-word. |
| `SW rt, offset(base)` | Store a word. |
| `SD rt, offset(base)` | Store a doubleword. |
| `LWL`, `LWR` | Merge the left or right part of an unaligned word into `rt`. |
| `SWL`, `SWR` | Store the left or right part of an unaligned word. |
| `LDL`, `LDR` | Merge the left or right part of an unaligned doubleword into `rt`. |
| `SDL`, `SDR` | Store the left or right part of an unaligned doubleword. |
| `LL rt, offset(base)` | Load-linked word. |
| `SC rt, offset(base)` | Store-conditional word and write its success result to `rt`. |
| `LLD rt, offset(base)` | Load-linked doubleword. |
| `SCD rt, offset(base)` | Store-conditional doubleword and write its success result to `rt`. |
| `LWC1 ft, offset(base)` | Load a word into a COP1 register. |
| `LDC1 ft, offset(base)` | Load a doubleword into a COP1 register pair. |
| `SWC1 ft, offset(base)` | Store a word from a COP1 register. |
| `SDC1 ft, offset(base)` | Store a doubleword from a COP1 register pair. |

## COP1 Arithmetic and Conversion

The suffix describes the operand format: `.S` is a single-precision float, `.D` is a double, `.W` is a signed 32-bit integer, and `.L` is a signed 64-bit integer held in COP1 registers.

| Form | Meaning |
| --- | --- |
| `ADD.S fd, fs, ft` / `ADD.D fd, fs, ft` | Floating-point addition. |
| `SUB.S fd, fs, ft` / `SUB.D fd, fs, ft` | Floating-point subtraction. |
| `MUL.S fd, fs, ft` / `MUL.D fd, fs, ft` | Floating-point multiplication. |
| `DIV.S fd, fs, ft` / `DIV.D fd, fs, ft` | Floating-point division. |
| `SQRT.S fd, fs` / `SQRT.D fd, fs` | Square root. |
| `ABS.S fd, fs` / `ABS.D fd, fs` | Absolute value. |
| `MOV.S fd, fs` / `MOV.D fd, fs` | Copy a floating-point value. |
| `NEG.S fd, fs` / `NEG.D fd, fs` | Negate a floating-point value. |
| `ROUND.W.S fd, fs` / `ROUND.W.D fd, fs` | Round to a 32-bit integer. |
| `TRUNC.W.S fd, fs` / `TRUNC.W.D fd, fs` | Truncate to a 32-bit integer. |
| `CEIL.W.S fd, fs` / `CEIL.W.D fd, fs` | Round upward to a 32-bit integer. |
| `FLOOR.W.S fd, fs` / `FLOOR.W.D fd, fs` | Round downward to a 32-bit integer. |
| `ROUND.L.S fd, fs` / `ROUND.L.D fd, fs` | Round to a 64-bit integer. |
| `TRUNC.L.S fd, fs` / `TRUNC.L.D fd, fs` | Truncate to a 64-bit integer. |
| `CEIL.L.S fd, fs` / `CEIL.L.D fd, fs` | Round upward to a 64-bit integer. |
| `FLOOR.L.S fd, fs` / `FLOOR.L.D fd, fs` | Round downward to a 64-bit integer. |
| `CVT.S.D/W/L fd, fs` | Convert a double, word, or long to single precision. |
| `CVT.D.S/W/L fd, fs` | Convert a single, word, or long to double precision. |
| `CVT.W.S/D fd, fs` | Convert a float or double to a 32-bit integer using the current rounding mode. |
| `CVT.L.S/D fd, fs` | Convert a float or double to a 64-bit integer using the current rounding mode. |

## COP1 Transfers, Comparisons, and Branches

| Instruction | Meaning |
| --- | --- |
| `MFC1 rt, fs` | Move a 32-bit word from COP1 to a CPU register. |
| `MTC1 rt, fs` | Move a 32-bit word from a CPU register to COP1. |
| `DMFC1 rt, fs` | Move a 64-bit value from a COP1 register pair. |
| `DMTC1 rt, fs` | Move a 64-bit value to a COP1 register pair. |
| `CFC1 rt, fs` | Move a COP1 control register to a CPU register. |
| `CTC1 rt, fs` | Move a CPU register to a COP1 control register. |
| `BC1F label` | Branch when floating-point condition 0 is false. |
| `BC1T label` | Branch when floating-point condition 0 is true. |
| `BC1FL label` | Branch-likely when the condition is false. |
| `BC1TL label` | Branch-likely when the condition is true. |

Comparisons use `C.condition.S fs, ft` or `C.condition.D fs, ft` and write floating-point condition 0.

| Condition | Test |
| --- | --- |
| `F` | False. |
| `UN` | Unordered. |
| `EQ` | Equal. |
| `UEQ` | Unordered or equal. |
| `OLT` | Ordered and less than. |
| `ULT` | Unordered or less than. |
| `OLE` | Ordered and less than or equal. |
| `ULE` | Unordered or less than or equal. |
| `SF`, `NGLE`, `SEQ`, `NGL`, `LT`, `NGE`, `LE`, `NGT` | Signaling forms of the corresponding false, unordered, equal, less-than, and less-than-or-equal tests. |
