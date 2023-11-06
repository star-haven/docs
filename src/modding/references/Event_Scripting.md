# Reference: Event Scripting

On each frame, the EVT manager will continue executing commands in all threads until a blocking command is encountered. This means that if you have a thread that loops but does not block between iterations, the game will freeze! Avoid this by inserting a blocking command such as EVT_WAIT(1) in the loop body.

Also note that threads are never executed in parallel. If your EVT script lacks blocking commands, it will be executed all in one go, and race conditions cannot occur.

The following subset of EVT commands are blocking:

* `EVT_EXEC_WAIT` / `ExecWait`
* `EVT_WAIT` / `Wait`
* `EVT_WAIT_SECONDS` / `WaitSeconds`
* `EVT_CALL` / `Call` (if function returns ApiStatus_BLOCK)
