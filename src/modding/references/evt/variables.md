# Reference: Event Scripting > Variables

## Types of Variables

### Local Variables

Local variables do not need to be declared. They are automatically available upon starting a thread / script and are initialized to 0 / FALSE.

`LocalVar(INDEX)` (decomp) / `*Var[INDEX]` or `*VarINDEX` (Star Rod)

Local Word. A variable local to the current thread.
LWs are copied to any threads created by this one (`EVT_EXEC`, `EVT_EXEC_WAIT`, `EVT_THREAD`, `EVT_CHILD_THREAD`).
Additionally, `EVT_EXEC_WAIT` copies LWs back from the spawned thread when it completes.

Max. value: 4294967295 / FFFFFFFF

Range for INDEX: `0 <= v < 0x10`:

`LocalVar(0)` to `LocalVar(15)` (decomp) / `*Var0` to `*VarF` (Star Rod)

----

`LocalFlag(INDEX)` (decomp) / `*Flag[INDEX]` (Star Rod)

Local Flag. A boolean variable local to the current thread.
LFs are copied to any threads created by this one (`EVT_EXEC`, `EVT_EXEC_WAIT`, `EVT_THREAD`, `EVT_CHILD_THREAD`).
Additionally, `EVT_EXEC_WAIT` copies LFs back from the spawned thread when it completes.

Range for INDEX: `0 <= v < 0x60`:

`LocalFlag(0)` to `LocalFlag(95)` (decomp) / `*Flag[0]` to `*Flag[59]` (Star Rod)

### Map Variables

Map variables do not need to be declared. They are automatically available upon entering a map and are initialized to 0 / FALSE.

`MapVar(INDEX)` (decomp) / `*MapVar[INDEX]` or `*MapVarINDEX` (Star Rod)

Global Word. A variable global to all threads.
Cleared upon entering a new map.

Max. value: 4294967295 / FFFFFFFF

Range for INDEX: `0 <= v < 0x10`:

`MapVar(0)` to `MapVar(15)` (decomp) / `*MapVar0` to `*MapVarF` (Star Rod)

----

`MapFlag(INDEX)` (decomp) / `*MapFlag[INDEX]` (Star Rod)

Global Flag. A boolean variable global to all threads.
Cleared upon entering a new map.

Range for INDEX: `0 <= v < 0x60`:

`MapFlag(0)` to `MapFlag(15)` (decomp) / `*MapFlag[0]` to `*MapFlag[59]` (Star Rod)

### Area Variables

Area variables do not need to be declared. They are automatically available upon entering an area and are initialized to 0 / FALSE.

`AreaByte(INDEX)` (decomp) / `*AreaByte[INDEX]` (Star Rod)

Local Saved **Byte**. A variable local to the current world area, saved in the savefile.
Cleared upon a new world area.

Max. value: 255 / FF

Rarely used. Most common use is for NPCs with dialogue that changes depending on the number of times you have interacted with them in their 'recent memory' (i.e. until you leave the area).

Range for INDEX: `0 <= v < 0x10`:

`AreaByte(0)` to `AreaByte(15)` (decomp) / `*AreaByte[0]` to `*AreaByte[F]` (Star Rod)

----

`AreaFlag(INDEX)` (decomp) / `*AreaFlag[INDEX]` (Star Rod)

Local Save World Flag. A boolean variable local to the current world area, saved in the savefile.
Cleared upon entering a new world area.

Used to track whether badges, items, etc. have been collected or whether NPCs have been interacted with.

Range for INDEX: `0 <= v < 0x100`:

`AreaFlag(0)` to `AreaFlag(255)` (decomp) / `*AreaFlag[0]` to `*AreaFlag[FF]` (Star Rod)

### Game Variables

`GameByte(INDEX)` (decomp) / `*GB_NAME` (Star Rod)

Global Saved **Byte**. A variable saved in the save file.
Used for almost all savefile states.

Star Rod assigns all GameBytes a custom name, which a Byte can be called by. E.g. instead of accessing `*GameByte[000]` one usually uses `*GB_StoryProgress`.
For a list of all of these aliases, see the `globals/GameBytes.txt` file within your mod folder.
If you want to add your own Bytes that are saved to the save file within Star Rod, then add them to `globals/ModBytes.txt` with the format of `INDEX = NameOfByte`, e.g. `000 = MB_MyCoolModByte`.

Max. value: 255 / FF

----

`GameFlag(INDEX)` (decomp) / `*GF_NAME` (Star Rod)

Global Save World Flag. A boolean variable saved in the savefile.

Used to track whether badges, items, etc. have been collected or whether NPCs have been interacted with.

Star Rod assigns all GameFlags a custom name, which a Flag can be called by. E.g. instead of accessing `*GameFlag[001]` one usually uses `*GF_StartedChapter1`.
For a list of all of these aliases, see the `globals/GameFlags.txt` file within your mod folder.
If you want to add your own Flags that are saved to the save file within Star Rod, then add them to `globals/ModFlags.txt` with the format of `INDEX = NameOfByte`, e.g. `0000 = MF_MyCoolModFlag`.

### Arrays

Array variables need to be declared by using their corresponding `EVT_USE_ARRAY` calls to become usable within the current thread.

`ArrayVar(INDEX)` (decomp) / `*Array[INDEX]` (Star Rod)

User Word. A variable stored within the current thread's array.

You can load an array with `EVT_USE_ARRAY` or temporarily allocate one with `EVT_MALLOC_ARRAY`, then get/set values with `ArrayVar(INDEX)`

Range: 0 <= v

----

`ArrayFlag(INDEX)` (decomp)

User Flag. A boolean variable stored within the current thread's flag array.

The flag array is distinct from the word array.

## Variable Operations

`EVT_SET(Var, IntValue)` (decomp) / `Set *Var IntValue` (Star Rod)

Sets the given variable to a given value cast to an integer.

`EVT_SET_CONST(Var, B)` (decomp) / `SetConst *Var B` (Star Rod)

Sets a variable to B.

If B is also a variable, this copies the **reference** of B into A. Effectively, this treats B as a "compile-time" constant. You can then use `Call SetValueByRef` and `Call GetValueByRef` to set the value referenced.

When used with a non-variable B, `SetConst` acts identically to `Set`.

`EVT_SETF(Var, FloatValue)` (decomp) / `Set *Var FloatValue` (Star Rod)

Sets the given variable to a given value, but supports EVT_FLOATs.

### Basic Arithmatic Operations

* `EVT_ADD(Var, B)` (decomp) / `Add *Var B` (Star Rod)
* `EVT_SUB(Var, B)` (decomp) / `Sub *Var B` (Star Rod)
* `EVT_MUL(Var, B)` (decomp) / `Mul *Var B` (Star Rod)
* `EVT_DIV(Var, B)` (decomp) / `Div *Var B` (Star Rod)
* `EVT_MOD(Var, B)` (decomp) / `Mod *Var B` (Star Rod)

B can be a static number or a variable.
Writes the result of the operation back into Var.

### Basic Floating-point Arithmetic Operations

* `EVT_ADDF(Var, FloatB)` (decomp) / `AddF *Var FloatB` (Star Rod)
* `EVT_SUBF(Var, FloatB)` (decomp) / `SubF *Var FloatB` (Star Rod)
* `EVT_MULF(Var, FloatB)` (decomp) / `MulF *Var FloatB` (Star Rod)
* `EVT_DIVF(Var, FloatB)` (decomp) / `DivF *Var FloatB` (Star Rod)

FloatB can be a static number or a variable.
Writes the result of the operation back into Var.

### Array Operations

`EVT_USE_ARRAY(INT_PTR)` (decomp) / `UseArray $Array` (Star Rod)

Loads an s32 array pointer into the current thread.
This has to be called before the array can be used.

`EVT_USE_FLAG_ARRAY(PACKED_FLAGS_PTR)` (decomp)

Loads an s32 array pointer into the current thread for use with `ArrayFlag(INDEX)`. Flags are stored in a 'packed' structure where indices refer to bits.

`EVT_MALLOC_ARRAY(SIZE, OUT_PTR_VAR)` (decomp)

Allocates a new array of the given size for use with `ArrayVar(INDEX)`. EVT scripts do not have to worry about freeing this array.

Within Star Rod this function is not available, instead all arrays for a map or battle script file have to be pre-defined and accessed via `UseArray`.
