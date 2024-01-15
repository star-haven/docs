# Player functions

`Disable8bitMario, BOOL` (decomp) / `Disable8bitMario (BOOL)` (Star Rod)

Enables and disables the 8-bit Mario easter egg.

----

`DisablePartner, INT` (decomp) / `DisablePartner (INT)` (Star Rod)

Disables the partner with the provided partner ID.
See also: `EnablePartner`

----

`DisablePlayerInput, BOOL` (decomp) / `DisablePlayerInput (BOOL)` (Star Rod)

Disables and reenables the player input.

This function can disable all player inputs for controlling Mario and his partner (or Peach), and to disable opening the pause menu, partner menu or item menu. This is most commonly done to start cutscenes.

This also disables Mario's spin, should he be in a spinning animation.

Internally, this is not tracked as a boolean flag, but rather as integer. The player is only in control while this integer equals 0, and calling `DisablePlayerInput, TRUE` adds 1 to that integer, while calling `DisablePlayerInput, FALSE` subtracts 1.

This is done so multi-layered scripts, which each try to disable the player input on their own, don't give back control too early.

----

`DisablePlayerPhysics, BOOL` (decomp) / `DisablePlayerPhysics (BOOL)` (Star Rod)

Disables and reenables the player physics.

This function can disable all player physics. This causes the physics system to no longer force gravity on the player, and physics-related animations no longer play automatically (like setting Mario's / Peach's running animation when forced to move via EVT script).

Internally, this is not tracked as a boolean flag, but rather as integer. The player is only in control while this integer equals 0, and calling `DisablePlayerPhysics, TRUE` adds 1 to that integer, while calling `DisablePlayerPhysics, FALSE` subtracts 1.

This is done so multi-layered scripts, which each try to disable the player physics on their own, don't reenable these too early.

----

`DisablePulseStone, BOOL` (decomp) / `DisablePulseStone (BOOL)` (Star Rod)

Enables and disables the blinking Pulse Stone speech bubble.
However, the Pulse Stone speech bubble is programmed to only show in the SBK area and only within certain maps.

----

`EnablePartner, INT` (decomp) / `EnablePartner (INT)` (Star Rod)

Enables the partner with the provided partner ID.
See also: `DisablePartner`

----

`FacePlayerTowardPoint, FLOAT_X, FLOAT_Y, INT` (decomp) `802D2884 (FLOAT_X, FLOAT_Y, INT)` (Star Rod)

Turns the player character towards a given point (FLOAT_X, FLOAT_Y) over the duration of INT frames.

----

`ForceUsePartner` (decomp) / `802D2B50 ()` (Star Rod)

Forces the player to use the currently active partner's overworld ability. This circumvents partner abilities usually only being triggered by a C-Down input while player input is enabled.

----

`FullyRestoreHPandFP` (decomp) / `FullyRestoreHPandFP ()` (Star Rod)

Sets the player's HP and FP equal to their current maximum HP and FP.

----

`FullyRestoreSP` (decomp) / `FullyRestoreSP ()` (Star Rod)

Sets the player's SP equal to their current maximum SP.

----

`func_802D2C14`

----

`func_802D1270`

----

`func_802D1380`

----

`func_802D2148`

----

`func_802D2484`

----

`GetPartnerInUse, *INT` (decomp) / `GetCurrentPartner (*INT)` (Star Rod)

Returns the partnerID of the current partner if they're using their ability, otherwise returns PARTNER_NONE.

----

`GetPlayerActionState, *INT` (decomp) / `GetPlayerActionState (*INT)` (Star Rod)

Returns the ID of the player's current action state.

----

`GetPlayerAnimation, *INT` (decomp) / `GetPlayerAnimation (*INT)` (Star Rod)

Returns the ID of the player's current animation.

----

`GetPlayerPos, *INT_X, *INT_Y, *INT_Z` (decomp) / `GetPlayerPos (*INT_X, *INT_Y, *INT_Z)` (Star Rod)

Returns the player's current position.

----

`GetPlayerTargetYaw, *FLOAT` (decomp) / `GetPlayerTargetYaw (*FLOAT)` (Star Rod)

Returns the player's current target yaw. Since EVT calls like `PlayerFaceNpc` can make the player turn towards a certain target over several frames, this EVT call can be used to check the goal value of this ongoing turning action.

----

`HidePlayerShadow, BOOL` (decomp) / `HidePlayerShadow (BOOL)` (Star Rod)

Disables and reenables the player character's shadow.

----

`InterpPlayerYaw, *FLOAT, *INT` (decomp) / `InterpPlayerYaw (*FLOAT, *INT)` (Star Rod)

Turns the player towards target yaw value FLOAT over INT frames.

----

`InterruptUsePartner` (decomp) / `802D2B6C ( )` (Star Rod)

Immediately interrupts any partner overworld ability in progress.

----

`IsPlayerOnValidFloor, *BOOL` (decomp) / `IsPlayerOnValidFloor (*BOOL)` (Star Rod)

Returns whether the player is in contact with valid groud currently.

----

`PlayerFaceNpc, INT_X, INT_Y` (decomp) / `PlayerFaceNpc ( INT_X, INT_Y )` (Star Rod)

Turns the player towards the Npc with ID INT_X and locks the player facing to follow the target for INT_Y frames. This is mostly used with `INT_Y = 0` to just turn the player once.

----

`PlayerJump, FLOAT_X, FLOAT_Y, FLOAT_Z, INT` (decomp) / `PlayerJump ( FLOAT_X, FLOAT_Y, FLOAT_Z, INT )` (Star Rod)

Makes the player jump towards target location (FLOAT_X, FLOAT_Y, FLOAT_Z) over INT frames. If INT equals zero, then the player's current movespeed value is used to calculate the duration of the jump.
This function uses mode 0 of the internal `player_jump` function, which plays a jumping sound, changes the player's animation to a jumping animation fitting the current status (default, holding Watt, 8bit Mario), turns the player towards the jump goal, and checks for collider behavior when landing at the end of the jump.

----

`PlayerJump1, FLOAT_X, FLOAT_Y, FLOAT_Z, INT` (decomp) / `PlayerJump1 ( FLOAT_X, FLOAT_Y, FLOAT_Z, INT )` (Star Rod)

Makes the player jump towards target location (FLOAT_X, FLOAT_Y, FLOAT_Z) over INT frames. If INT is zero, then the player's current movespeed value is used to calculate the duration of the jump.
This function uses mode 1 of the internal `player_jump` function, which does not play a jumping sound, does not change the player's animation to a jumping animation fitting the current status (default, holding Watt, 8bit Mario), does not turn the player towards the jump goal, and does not check for collider behavior when landing at the end of the jump.

----

`PlayerJump2, FLOAT_X, FLOAT_Y, FLOAT_Z, INT` (decomp) / `PlayerJump2 ( FLOAT_X, FLOAT_Y, FLOAT_Z, INT )` (Star Rod)

Makes the player jump towards target location (FLOAT_X, FLOAT_Y, FLOAT_Z) over INT frames. If INT is zero, then the player's current movespeed value is used to calculate the duration of the jump.
This function uses mode 2 of the internal `player_jump` function, which does not play a jumping sound, does not change the player's animation to a jumping animation fitting the current status (default, holding Watt, 8bit Mario), does not turn the player towards the jump goal, and checks for collider behavior when landing at the end of the jump.

----

`PlayerMoveTo, FLOAT_X, FLOAT_Y, FLOAT_Z` (decomp) / `PlayerMoveTo ( FLOAT_X, FLOAT_Y, FLOAT_Z )` (Star Rod)

Makes the player move towards given X/Y coordinate (FLOAT_X, FLOAT_Y) over FLOAT_Z frames. If FLOAT_Z equals zero, then the player's current movespeed value is used to calculate the duration of the move.

----

`PlaySoundAtPlayer, INT_X, INT_Y` (decomp) / `PlaySoundAtPlayer ( INT_X, INT_Y )` (Star Rod)

Plays sound effect with ID INT_X at the player current location, using sound flags INT_Y.

----

`SetPlayerActionState, INT` (decomp) / `SetPlayerActionState ( INT )` (Star Rod)

Sets the player's action state to the action state with ID INT.

----

`SetPlayerAnimation, INT` (decomp) / `SetPlayerAnimation (INT)` (Star Rod)

Sets the player's current animation to a given animation ID. This will get overwritten immediately by the physics engine, if the physics are not disabled and the player is moving in some way or controller input is made.

If the chosen animation is `ANIM_MarioW2_Collapse`, then also shakes the camera for a short moment.

----

`SetPlayerAnimationSpeed, FLOAT` (decomp) / `SetPlayerAnimationSpeed ( FLOAT )` (Star Rod)

UNUSED! Sets the player's animation speed to FLOAT (default 1.0).

----

`SetPlayerCollisionSize, INT_HEIGHT, INT_RADIUS` (decomp) / `SetPlayerPos (INT_HEIGHT, INT_RADIUS)` (Star Rod)

Sets the player's collision size, colloquially called the hit box.

----

`SetPlayerFlagBits, INT, BOOL` (decomp) / `SetPlayerFlagBits ( INT BOOL )` (Star Rod)

Sets the player's given flags, represented by flag bits INT, to BOOL.

----

`SetPlayerImgFXFlags INT` (decomp) / `802D286C ( INT )` (Star Rod)

Sets flags represented by INT for the player's ImgFX. Used before calling `UpdatePlayerImgFX`.

----

`SetPlayerJumpscale, FLOAT` (decomp) / `SetPlayerJumpscale (FLOAT)` (Star Rod)

Sets the player's jump scale. This determines how quickly a jump started by a script (not by player input) is performed. The player moves along the jump arc slower or faster, depending on the jump scale.

----

`SetPlayerPos, INT_X, INT_Y, INT_Z` (decomp) / `SetPlayerPos (INT_X, INT_Y, INT_Z)` (Star Rod)

Sets the player's position immediately.

----

`SetPlayerPushVelocity, FLOAT_X, FLOAT_Y, FLOAT_Z` (decomp) / `SetPlayerPushVelocity ( FLOAT_X FLOAT_Y FLOAT_Z )` (Star Rod)

UNUSED! Sets the player's current push velocity to (FLOAT_X, FLOAT_Y, FLOAT_Z).

----

`SetPlayerSpeed, FLOAT` (decomp) / `SetPlayerSpeed (FLOAT)` (Star Rod)

Sets the player's grounded movement speed. This automatically reset once the player input gets enabled.

----

`UpdatePlayerImgFX, INT_1, INT_2, INT_3, INT_4, INT_5` (decomp) / `802D2520 ( INT_1 INT_2 INT_3 INT_4 INT_5 )` (Star Rod)

Clears the player's ImgFX, then applies parameters INT_2 to INT_5 to chosen special sprite effect INT_1 to cause a new ImgFX. These effects can be a holographic effect, color tinting, changing the alpha, making the player sprite wavy, and more. Used after calling `SetPlayerImgFXFlags`.

----

`UseEntryHeading, INT_X, INT_Y` (decomp) / `UseEntryHeading ( INT_X, INT_Y )` (Star Rod)

Used internally by the `EnterWalk` group of functions.

----

`UseExitHeading, INT_X, INT_Y` (decomp) / `UseExitHeading ( INT_X, INT_Y )` (Star Rod)

Called before `ExitWalk` to set the player's "walk-off" animation target using a given walk-off length INT_X and entry ID INT_Y. This modifies the calling script's Var1, Var2 and Var3 values for use by `ExitWalk`.

----

`WaitForPlayerInputEnabled` (decomp) / `WaitForPlayerInputEnabled ( )` (Star Rod)

Stops the current script and loops infinitely until player input is enabled.

----

`WaitForPlayerMoveToComplete` (decomp) / `WaitForPlayerMoveToComplete ( )` (Star Rod)

Stops the current script and loops infinitely until the current player move is complete.

----

`WaitForPlayerTouchingFloor` (decomp) / `WaitForPlayerTouchingFloor ( )` (Star Rod)

Stops the current script and loops infinitely until player touches any valid floor from above, landing on it.
