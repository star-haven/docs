# Reference: Event Scripting > Control Flow

## Conditionals

Regular:

* decomp
  * `EVT_IF_EQ(A, B)` (equals)
  * `EVT_IF_NE(A, B)` (not equals)
  * `EVT_IF_LT(A, B)` (lower than)
  * `EVT_IF_GT(A, B)` (greater than)
  * `EVT_IF_LE(A, B)` (lower than or equal)
  * `EVT_IF_GE(A, B)` (greater than or equal)
* Star Rod
  * `If A == B` (equals)
  * `If A != B` (not equals)
  * `If A < B` (lower than)
  * `If A > B` (greater than)
  * `If A <= B` (lower than or equal)
  * `If A >= B` (greater than or equal)

Conditional statements behave exactly as you might expect.

Flag bits related:

* decomp
  * `EVT_IF_FLAG(A, B)` (bitwise check if bit B is set on value A)
  * `EVT_IF_NOT_FLAG(A, B)` (bitwise check if bit B is not set on value A)
* Star Rod
  * `If ((A & B) != 0)` (bitwise check if bit B is set on value A)
  * `If ((A & B) == 0)` (bitwise check if bit B is not set on value A)

Note that the bitwise AND conditions treat the second argument as a constant. This means that they will not try to dereference script variables so you should NOT supply them with *Var[X], etc. They are intended to check whether certain flags are set for the first argument.

`EVT_ELSE` (decomp) / `Else` (Star Rod)

(optional) Begins the block to be executed if the above If condition is false.

`EVT_END_IF` (decomp) / `EndIf` (Star Rod)

Designates the end of an If..EndIf or If..Else..EndIf body.

## Switch Case

`EVT_SWITCH(A)` (decomp) / `Switch VarA` (Star Rod)

Begins a switch statement using the given variable.
Up to 8 switch statements may be nested within a single script.

`EVT_SWITCH_CONST(A)` (decomp) / `SwitchConst A` (Star Rod)

Begins a switch statement using the given constant.

* decomp
  * `EVT_CASE_EQ(B)` (equals)
  * `EVT_CASE_NE(B)` (not equals)
  * `EVT_CASE_LT(B)` (lower than)
  * `EVT_CASE_GT(B)` (greater than)
  * `EVT_CASE_LE(B)` (lower than or equals)
  * `EVT_CASE_GE(B)` (greater than or equals)
  * `EVT_CASE_FLAG(B)` (bitwise AND not equals zero)
  * `EVT_CASE_RANGE(B, C)` (B <= SwitchVar <= C)
* Star Rod
  * `Case == B` (equals)
  * `Case != B` (not equals)
  * `Case < B` (lower than)
  * `Case > B` (greater than)
  * `Case <= B` (lower than or equals)
  * `Case >= B` (greater than or equals)
  * `Case & B` (bitwise AND not equals zero)
  * `Case B to C` (B <= SwitchVar <= C)

Begins the block to be executed if the condition is true. Unlike the switch you might be used to, these cases do not support fallthrough.

`EVT_CASE_OR_EQ(B)` (decomp) / `CaseOR [COND] B` (Star Rod)

Several of these cases may appear in series. The clause is executed if any values are equal. These cases support fall-though, so every subsequent clause will be executed until a normal case or EndCaseGroup is encountered.

`EVT_CASE_AND_EQ(B)` (decomp) / `CaseAND [COND] B` (Star Rod)

Several of these cases may appear in series. All conditions must be satisfied for the clause to executed. Unused in the original code, intended use-case unknown. Potentially useful for SwitchConst blocks to check multiple variables against the constant.

`EVT_END_CASE_GROUP` (decomp) / `EndCaseGroup` (Star Rod)

Terminates a `CaseOR` or `CaseAND` fall-though/matching group.

`EVT_CASE_DEFAULT` (decomp) / `Default` (Star Rod)

Begins the block to be executed if no preceding conditions matched.

`EVT_BREAK_SWITCH` (decomp) / `BreakCase` (Star Rod)

Jumps out of a case clause to the end of the switch block.

`EVT_END_SWITCH` (decomp) / `EndSwitch` (Star Rod)

Ends a switch statement.

## Jump and Goto Commands

`EVT_JUMP(EvtSource)` (decomp) / `Jump $EvtSource` (Star Rod)

Jumps to a given instruction pointer and begins execution from there.
You can jump to a different EVT source and labels etc. will be loaded as expected.
The timescale for the current thread is also reset to the global default.

`EVT_LABEL(Label_ID)` (decomp) / `Label Label_ID` (Star Rod)

Marks this point in the script as a EVT_GOTO target.
Range: 0 <= Label_ID <= 0x16

`EVT_GOTO(Label_ID)` (decomp) / `Goto Label_ID` (Star Rod)

Moves execution to the given label.

## Wait Commands

`EVT_WAIT(A)` (decomp) / `Wait A` (Star Rod)

Blocks the current thread for the given number of frames.

`EVT_WAIT_SECS(A)` (decomp)

Blocks the current thread for the given number of seconds.
Unused.

## Loops

`EVT_LOOP(A)` (decomp) / `Loop A` (Star Rod)

Repeat the following commands a certain number of times. To create an infinite loop, use A = 0. Star Rod assumes the iteration count is zero if no argument is provided.

Note: passing a variable will decrement the variable after each iteration until it equals zero. If the variable is zero before the loop begins, the loop will be infinite; make sure it breaks or blocks to avoid a freeze.

Up to 8 loops may be nested within a single script.

`EVT_BREAK_LOOP` (decomp) / `BreakLoop` (Star Rod)

Immediately jump out of a loop and continue execution after the next EndLoop command.

`EVT_END_LOOP` (decomp) / `EndLoop` (Star Rod)

Designates the end of a loop body.
