# Global API Functions

Many API functions for calling C code are available globally, so they can be accessed from any map or battle script file.

These API functions are called using the `EVT_CALL()` / `Call` EVT operation, and they may modify both their function argument variables as well as variables local to the current thread (`LocalVar()` / `*Var`).

Usage examples:

* `EVT_CALL(DisablePlayerInput, TRUE)` (decomp)
* `Call DisablePlayerInput (.True)` (Star Rod)
