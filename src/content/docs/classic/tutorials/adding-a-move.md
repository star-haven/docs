---
title: Adding a Move
sidebar:
  label: Adding a Move
---
This tutorial adds **Blast Jump**, a badge move which uses the Jump action command, plays Bombette's impact effect when Mario lands, and deals damage which ignores Defense.

Blast Jump will use the unused **Auto Jump** move ID and badge item. Its battle script will be added through a patch to the Power Jump source so it can reuse Power Jump's approach, action command, and return scripts.

| File | Purpose |
| --- | --- |
| `$mod/strings/patch/blast_jump.str` | Name and descriptions. |
| `$mod/globals/Moves.xml` | Menu, targeting, FP, and BP data. |
| `$mod/globals/Items.xml` | The badge which grants the move. |
| `$mod/battle/move/Moves.txt` | Assigns the battle source and main script for move ID `29`. |
| `$mod/battle/move/src/Move_PowerJump.bscr` | Original Power Jump source used as a reference. |
| `$mod/battle/move/patch/Move_PowerJump.bpat` | Implements the move. |

## 1. Add the Messages

Create `$mod/strings/patch/blast_jump.str`:

```star-rod
#string:2F:(BlastJumpName) {
	Blast Jump[End]
}

#string:2F:(BlastJumpShortDesc) {
	Stomps one enemy with an explosion[BR]
	which ignores Defense.[End]
}

#string:2F:(BlastJumpFullDesc) {
	Lets you do a Blast Jump.[BR]
	Uses 3 FP.[BR]
	Stomps one enemy with an explosion[BR]
	which ignores Defense.[End]
}
```

The same three messages can be used by both the move and its badge. See [Adding and Modifying Messages](../guides/adding-messages.md) for more about named project strings.

## 2. Configure the Move

Open **Globals Editor → Moves** and select move `029`, **AutoJump**. Give it the following properties:

| Field | Value |
| --- | --- |
| Name | `BlastJump` |
| Name message | `BlastJumpName` |
| Short description | `BlastJumpShortDesc` |
| Full description | `BlastJumpFullDesc` |
| Flags | `00054881` |
| Category | `02` |
| Input popup | `00` |
| FP cost | `03` |
| BP cost | `02` |

The flags, category, and input popup are copied from Power Jump. They place the move in the Jump menu, build the expected target list, and show the Jump action-command instructions. Save the Moves tab.

The move remains at ID `029`, so `.Move:BlastJump` refers to move ID `0x29` in Star Rod patches. The `Moves.xml` entry creates a bridge between badges and the in-battle implementation. This bridge supplies menu and targeting data, but it does not yet assign the source file and main script which implement the move. We will do that in Section 4.

## 3. Configure the Badge

Open **Globals Editor → Items** and select item `10E`, **AutoJump**. Rename it `BlastJump`, assign the three Blast Jump messages, and set its move to `BlastJump`.

Keep its badge type, target flags, menu order, and other ordinary badge fields. After renaming the item, explicitly select `AutoJump` for its HUD element and item entity. This reuses the unused Auto Jump icon and keeps the tutorial focused on the move; you can replace the image later.

Save the Items tab.

## 4. Assign the Move Script

`$mod/battle/move/Moves.txt` defines the move script table. Each line uses a move ID to specify the battle source and `Script_Use` loaded for that move. It contains 49 entries, for move IDs `00` through `30`. The global move table continues beyond this range, but those later moves are handled by other parts of the battle system and cannot be assigned an entry in `Moves.txt` in the current version of Classic.

Open the file and find move ID `29`:

```text
29  Move_AutoJump  Script_UseMove0  % AutoJump
```

Before your changes, the global move at ID `029` and badge item at index `10E` were also named **AutoJump**. The finished game does not use any of these Auto Jump entries, so this tutorial repurposes them together.

Replace the line with:

```text
29  Move_PowerJump  Script_UseBlastJump  % BlastJump
```

The source name determines which battle-move overlay is loaded. The script name identifies the `Script_Use` structure which begins the move. Power Jump, move ID `2B`, still points to `Script_UseMove0` in the same source, so it will continue to use its original main script.

The completed connection is:

| Definition | Connection |
| --- | --- |
| Badge item `BlastJump` | Refers to move ID `029`. |
| Move data at ID `029` | Supplies the menu, costs, and targeting data. |
| `Moves.txt` entry `29` | Loads `Move_PowerJump` and begins `Script_UseBlastJump`. |

## 5. Build the Move Script

Open `$mod/battle/move/src/Move_PowerJump.bscr`. Power Jump already supplies the Jump action command, miss handling, camera work, and return animations needed by Blast Jump. We will create a patch for that source and add a new main script and attack script without replacing Power Jump's structures.

Create or open `$mod/battle/move/patch/Move_PowerJump.bpat` and add the new main script:

```star-rod
#new:Script_Use $Script_UseBlastJump
{
    Call  EnablePlayerBlur  ( 00000001 )
    Call  802694A4          ( 00000001 )
    ExecWait  $Script_BlastJump
    Call  EnablePlayerBlur  ( 00000000 )
    Return
    End
}
```

The patch basename must remain `Move_PowerJump`, matching the source selected in `Moves.txt`. `Script_UseBlastJump` is declared as `Script_Use` because it is the entry point named by the move script table.

Power Jump chooses one of three attack scripts based on Mario's boots. Blast Jump calls one attack script directly, so its damage remains the same at every boot rank.

Next, copy `$Script_802A2754` from the Power Jump source under `$mod/battle/move/src/` into `Move_PowerJump.bpat`, rename it `$Script_BlastJump`, and make the changes shown below:

```star-rod
#new:Script $Script_BlastJump
{
    ExecWait  $Script_802A2184
    Call  PlayerTestEnemy  ( *Var0 ~Flags:DamageType:Jump 00000000 00000000 00000001 00000000 )
    If  *Var0  ==  .HitResult:Miss
        ExecWait  $Script_802A1FEC
        Return
    EndIf

    ExecWait  $Script_802A26B4
    Call  GetActorPos       ( .Actor:Player *Var1 *Var2 *Var3 )
    Call  PlaySoundAtActor  ( .Actor:Player .Sound:BombBlast )
    Wait  1`

    Call  DidActionSucceed  ( *Var0 )
    Switch  *Var0
        Case  >  .False
            Call  PlayEffect        ( ~FX:RedImpact:Huge *Var1 00000000 *Var3 00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 )
            Call  SetActorSounds     ( .Actor:Player .ActorSound:Hurt 0000015A 00000000 )
            Call  PlayerDamageEnemy  ( *Var0 ~Flags:DamageType:Blast|Jump|IgnoreDefense 00000000 00000000 00000004 00000070 )
        Default
            Call  PlayEffect        ( ~FX:RedImpact:Normal *Var1 00000000 *Var3 00000001 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000 )
            Call  SetActorSounds     ( .Actor:Player .ActorSound:Hurt 0000015A 00000000 )
            Call  PlayerDamageEnemy  ( *Var0 ~Flags:DamageType:Blast|Jump|IgnoreDefense 00000000 00000000 00000002 00000030 )
    EndSwitch

    Switch  *Var0
        Case  >  .HitResult:Hit
            ExecWait  $Script_802A15D8
        Default
            ExecWait  $Script_802A17C4
    EndSwitch
    Return
    End
}
```

`$Script_802A2184` performs the approach and Jump action command. `$Script_802A1FEC` handles a miss, while the final two scripts return Mario to his home position. These address-derived names belong to the Power Jump source; use the names from that file.

The two `RedImpact` variants are the effects used by Bombette's blast. `GetActorPos` reads Mario's position after he reaches the target, and `*Var1` through `*Var3` preserve `*Var0` for the action-command and hit results. A successful action command uses the larger effect. Power Jump's existing rumble and camera shake remain in `$Script_802A26B4`.

The successful action command deals `4` damage and the failed command deals `2`. Both calls combine three damage properties:

| Property | Result |
| --- | --- |
| `Blast` | Uses the Blast element and produces blast or burn reactions where the target supports them. |
| `Jump` | Retains jump-specific interactions such as flipping eligible enemies. |
| `IgnoreDefense` | Ignores positive Defense while preserving `99` as immunity. |

The explosion effects do not deal damage by themselves. `PlayerDamageEnemy` applies the damage and dispatches the target's resulting battle event.

## 6. Compile and Test

Compile the mod and obtain `.Item:BlastJump`. For a temporary test, place the badge on a map with `MakeItemEntity` as described in [Scripting a Map](scripting-a-map.md#5-add-a-super-shroom), or call `AddBadge` from a test map script. Equip the badge before entering battle.

Test at least the following cases:

1. Succeed and fail the action command and confirm the two damage values.
2. Attack an upright Koopa Troopa and confirm that Defense is ignored and the jump still flips it.
3. Attack a Bob-omb and confirm that the Blast element invokes its blast-specific reaction.
4. Miss an enemy and confirm that no explosion or damage occurs.
5. Finish a battle with Blast Jump and confirm that Mario returns home and the turn ends normally.

See [Battle Flags](../reference/battle-flags.md) for the damage and targeting fields, [Editing Items](../guides/editing-items.md) for replacing the borrowed badge icon, and [Writing a Patch](../guides/writing-a-patch.md) for the patch structures used above.
