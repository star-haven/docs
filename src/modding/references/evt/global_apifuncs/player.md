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

`GetPlayerTargetYaw`

----

`HidePlayerShadow, BOOL` (decomp) / `HidePlayerShadow (BOOL)` (Star Rod)

Disables and reenables the player character's shadow.

----

`InterpPlayerYaw`

----

`InterruptUsePartner`

----

`IsPlayerOnValidFloor`

----

`PlayerFaceNpc`

----

`PlayerJump`

----

`PlayerJump1`

----

`PlayerJump2`

----

`PlayerMoveTo`

----

`PlaySoundAtPlayer`

----

`SetPlayerActionState`

----

`SetPlayerAnimation, INT` (decomp) / `SetPlayerAnimation (INT)` (Star Rod)

Sets the player's current animation to a given animation ID. This will get overwritten immediately by the physics engine, if the physics are not disabled and the player is moving in some way or controller input is made.

If the chosen animation is `ANIM_MarioW2_Collapse`, then also shakes the camera for a short moment.

----

`SetPlayerAnimationSpeed`

----

`SetPlayerCollisionSize, INT_HEIGHT, INT_RADIUS` (decomp) / `SetPlayerPos (INT_HEIGHT, INT_RADIUS)` (Star Rod)

Sets the player's collision size, colloquially called the hit box.

----

`SetPlayerFlagBits`

----

`SetPlayerImgFXFlags`

----

`SetPlayerJumpscale, FLOAT` (decomp) / `SetPlayerJumpscale (FLOAT)` (Star Rod)

Sets the player's jump scale. This determines how quickly a jump started by a script (not by player input) is performed. The player moves along the jump arc slower or faster, depending on the jump scale.

----

`SetPlayerPos, INT_X, INT_Y, INT_Z` (decomp) / `SetPlayerPos (INT_X, INT_Y, INT_Z)` (Star Rod)

Sets the player's position immediately.

----

`SetPlayerPushVelocity`

----

`SetPlayerSpeed, FLOAT` (decomp) / `SetPlayerSpeed (FLOAT)` (Star Rod)

Sets the player's grounded movement speed. This automatically reset once the player input gets enabled.

----

`UpdatePlayerImgFX`

----

`UseEntryHeading`

----

`UseExitHeading`

----

`WaitForPlayerInputEnabled`

----

`WaitForPlayerMoveToComplete`

----

`WaitForPlayerTouchingFloor`
