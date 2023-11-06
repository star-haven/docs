# Reference: Event Scripting > Threads / Script Calls

## Main Threads

`EVT_EXEC(EvtSource)` (decomp) / `Exec $EvtSource()` (Star Rod)

Launches a new script, starting at the specified location. This location does not need to be at the beginning of the script.

The new script does not block its parent (it'll run in the background, i.e. in a new thread), and will continue executing even if the parent terminates.

The new script starts execution the following frame that this is called, not immediately.

`EVT_EXEC_GET_TID(EvtSource, TID)` (decomp)

Identical to `EVT_EXEC`, but the newly-launched thread ID is stored in a provided variable.
The new thread may be interacted with using `EVT_KILL_THREAD`, `EVT_SUSPEND_THREAD`, `EVT_RESUME_THREAD`, and `EVT_IS_THREAD_RUNNING`

`EVT_EXEC_WAIT(EvtSource)` (decomp) / `ExecWait $EvtSource()` (Star Rod)

Launches a new child thread.
Blocks for at least one frame unless the child thread is made to have a higher priority than the parent.
Stops blocking the parent thread only once the child thread returns.

Child threads are killed, suspended, and resumed as their parents are, for example, a different thread using `EVT_KILL_THREAD` to kill a parent thread would also kill its child thread(s) launched by this command.

`EVT_RETURN` (decomp) / `Return` (Star Rod)

Finish script execution and destroy it. If the script has a parent (script[68] != null), copy script flags and variables to its parent.

`EVT_END` (decomp) / `End` (Star Rod)

Indicates the end of the script for parsing purposes. Required for all scripts for the interpreter to correctly parse them. Does not do anything in-game.

`EVT_KILL_THREAD(TID)` (decomp) / `Kill TID` (Star Rod)

Terminates the script with the given thread ID, and any ChildThreads.

`EVT_CALL(Func, Args...)` (decomp) / `Call $Func(Args...)` (Star Rod)

Calls a given C EVT API function with any number of arguments.
This is used for executing code that is written in C, and not the EVT scripting language.
The API function called will execute every frame unless it returns `2` on register `V0`.
Forgetting to return `2` without proper measures to handle this on the EVT script side may cause a freeze.

`EVT_IS_THREAD_RUNNING(TID, Result)` (decomp) / `DoesScriptExist TID Result` (Star Rod)

Sets Result variable to True/False depending on whether a thread with given thread ID exists (i.e. has not been killed).

`EVT_SET_PRIORITY(A)` (decomp) / `SetPriority A` (Star Rod)

Sets the current thread's priority. Higher-priority threads execute before lower-priority threads on each frame.

`EVT_SET_TIMESCALE(A)` (decomp) / `SetTimescale A` (Star Rod)

Sets the current thread's timescale. This is a multiplier applied to EVT_WAIT and EVT_WAIT_SECONDS.

`EVT_SUSPEND_THREAD(TID)` (decomp) / `Suspend TID` (Star Rod)

Suspends a thread by its thread ID.

`EVT_RESUME_THREAD(TID)` (decomp) / `Resume TID` (Star Rod)

Resumes a thread by its thread ID.

`EVT_SET_GROUP(A)` (decomp) / `SetGroup A` (Star Rod)

Sets the current thread's group. Group value meanings are currently not known.

`EVT_SUSPEND_GROUP(A)` (decomp) / `SuspendAll A` (Star Rod)

Suspends all threads in a group.

`EVT_RESUME_GROUP(A)` (decomp) / `ResumeAll A` (Star Rod)

Resumes all threads in a group.

`EVT_SUSPEND_OTHERS(A)` (decomp)

Suspends all threads in a group, except the current thread.
Unused.

`EVT_RESUME_OTHERS(A)` (decomp)

Resumes all threads in a group, except the current thread.
Unused.

## Child Threads

`EVT_THREAD` (decomp) / `Thread` (Star Rod)

Begins a temporary helper block that executes some tasks in parallel with the main thread. Vars and flags are copied to the thread but are not copied back after the thread finishes. The thread can also outlive its parent.

`EVT_END_THREAD` (decomp) / `EndThread` (Star Rod)

Designates the end of a Thread block.

`EVT_CHILD_THREAD` (decomp) / `ChildThread` (Star Rod)

Similar to Thread, but the child thread shares variables and flags with the parent and will be terminated if the parent script ends.

`EVT_END_CHILD_THREAD` (decomp) / `EndChildThread` (Star Rod)

Designates the end of a ChildThread block.

## Binding Threads

`EVT_BIND_TRIGGER(EVT_SOURCE, TRIGGER, COLLIDER_ID, UNK_A3, TRIGGER_PTR_OUTVAR)` (decomp)

`Bind $Script TRIGGER, COLLIDER_ID, UNK_A3, TRIGGER_PTR_OUTVAR` (Star Rod)

Sets up a script to launch when a particular event is triggered.
Valid triggers:

* TRIGGER_WALL_PUSH
* TRIGGER_FLOOR_TOUCH
* TRIGGER_WALL_PRESS_A (displays "!" icon above player)
* TRIGGER_FLOOR_JUMP
* TRIGGER_WALL_TOUCH
* TRIGGER_FLOOR_PRESS_A
* TRIGGER_WALL_HAMMER
* TRIGGER_GAME_FLAG_SET
* TRIGGER_AREA_FLAG_SET
* TRIGGER_CEILING_TOUCH
* TRIGGER_FLOOR_ABOVE
* TRIGGER_POINT_BOMB (takes Vec3f* instead of collider ID)

For the `COLLIDER_ID` param, the following values are accepted:

* Collider ID
* Entity ID (use EVT_ENTITY_INDEX)
* Pointer to a Vec3f (for TRIGGER_POINT_BOMB only)

Only one thread will run for a trigger at once.
Triggers will not re-activate until the associated script returns.

`EVT_BIND_PADLOCK(EVT_SOURCE, TRIGGER, COLLIDER_ID, ITEM_LIST, UNK_A3, TRIGGER_PTR_OUTVAR)` (decomp)

`BindLock $Script TRIGGER, COLLIDER_ID, $ItemList, UNK_A3, TRIGGER_PTR_OUTVAR` (Star Rod)

Similar to EVT_BIND_TRIGGER, but also takes arguments for the item list to show.
Used whenever an event trigger is supposed to open an item list for the player to choose from.
Despite being called "PADLOCK", and this type of binding indeed being used for padlocks, this EVT can also be used in other scripting.

`EVT_UNBIND` (decomp) / `Unbind` (Star Rod)

Unbinds the current thread from the trigger it was bound to, if any.
Makes it so the trigger will no longer call the current thread, effectively deactivating the trigger.
Usually used at the end of a bound thread.
