---
title: Adding a Boss
sidebar:
  label: Adding a Boss
  order: 5
---
This tutorial adds a stationary NPC to `sbk_43` which speaks to Mario and then begins a boss battle. Winning the battle sets a saved flag and removes the NPC permanently.

We will reuse the map from [Scripting a Map](scripting-a-map.md) and the `$TutorialPiranha` Actor from [Scripting a Battle](scripting-a-battle.md#4-create-a-new-enemy). This keeps the tutorial focused on connecting an implemented battle to the world. A finished boss may have several moves, reactions, phases, and custom events, but it uses the same connection described here.

The relevant project files are:

| File | Purpose |
| --- | --- |
| `$mod/battle/formation/patch/00 Area KMR Part 1.bpat` | Contains the boss Actor, formation, and formation table entry. |
| `$mod/map/patch/sbk_43.mpat` | Contains the world NPC and the scripts which start and finish the battle. |
| `$mod/map/save/sbk_43.xml` | Contains the NPC marker created in Map Editor. |
| `$mod/globals/ModFlags.txt` | Assigns the saved flag which records the victory. |

## 1. Prepare the Boss Battle

Finish and test the battle before connecting it to a map. Battle Select provides a faster development cycle than speaking to the NPC after every build, and it separates problems in the battle from problems in the world encounter.

The earlier battle tutorial created `$TutorialPiranha` in battle section `00`. Add a formation containing only that Actor:

```star-rod
#new:Formation $Formation_TutorialBoss {
    $TutorialPiranha 00000001 0000000A 00000000 00000000 00000000 00000000
}
```

Add the formation to `$FormationTable` after the tutorial formation at index `0C`. Copy a nearby working row, change its formation pointer to `$Formation_TutorialBoss`, and set its enemy count to one. Retain the complete zeroed row which ends the table. This assigns the new formation index `0D`.

Compile the mod and launch section `00`, formation `0D` through Battle Select. Do not continue until the battle starts, can be won, and returns without an error.

The packed battle ID for this formation is:

```text
000D0000
```

The first byte selects section `00`, the second selects formation `0D`, and the final two bytes leave the stage override at zero. If you assigned another formation index, substitute it throughout the rest of the tutorial.

## 2. Add the Saved Flag

Open `$mod/globals/ModFlags.txt` and assign an unused index:

```text
001 = MF_TutorialBossDefeated
```

Use another index if `001` is already assigned. The map checks this flag when the NPC is created and sets it after Mario wins, so the boss remains defeated after leaving the map or loading a save file.

## 3. Place the Boss NPC

Open `sbk_43` in Map Editor and add an **NPC** marker named `TutorialBoss`. Place it on open ground and leave its movement type set to **Stationary**.

Select the **Piranha Plant** sprite and palette `0`. Set the **Death** and **Hit** slots to `Anim_09`, the Piranha Plant's hurt animation. Set the remaining slots to `Anim_01`, then save the map.

The NPC seen on the map and the Actor loaded in battle are separate structures. They use the same character here, but the connection between them is the battle ID in the NPC group list, not the sprite selected by the marker.

## 4. Add the Interaction

Add the NPC ID, dialogue, settings, and scripts to `sbk_43.mpat`:

```star-rod
#define .NpcID:TutorialBoss 02

#string $String_TutorialBossChallenge {
	[Style Right]
	You made it this far?[BR]
	Then let us see how well you fight![Wait][End]
}

#string $String_TutorialBossDefeated {
	[Style Right]
	I have been defeated.[Wait][End]
}

#new:NpcSettings $NpcSettings_TutorialBoss {
    00000000 0020001A 00000000 00000000 00000000 00000000 00000000 00000000
    00000000 00000000 00630000
}

% Signals the idle script to begin the battle after the conversation.
#new:Script $Script_InteractTutorialBoss {
    % pre-battle scene
    Call DisablePlayerInput ( .True )
    Call SpeakToPlayer ( .Npc:Self 00370001 00370001 00000000 $String_TutorialBossChallenge )
    Call SetSelfVar ( 00000000 00000001 ) % send signal
    Return
    End
}

% Wait in a busy loop for a signal to initiate the boss battle.
#new:Script $Script_NpcIdleTutorialBoss {
    Loop
        Call GetSelfVar ( 00000000 *Var0 )
        If *Var0 == 00000001
            BreakLoop
        EndIf
        Wait 1`
    EndLoop
    Call StartBossBattle ( .Song:SpecialBattle )
    Return
    End
}

% Runs after returning from battle and records a victory in the save data.
#new:Script $Script_DefeatTutorialBoss {
    Call GetBattleOutcome ( *Var0 )
    If *Var0 == .Outcome:PlayerWon
        % post-battle scene
        Set *MF_TutorialBossDefeated .True
        Call SpeakToPlayer ( .Npc:Self 00370001 00370001 00000000 $String_TutorialBossDefeated )
        Call DisablePlayerInput ( .False )
        Call RemoveNpc ( .Npc:Self )
    EndIf
    Return
    End
}

% Checks the save data and binds the scripts used during this encounter.
#new:Script $Script_InitTutorialBoss {
    If *MF_TutorialBossDefeated == .True
        Call RemoveNpc ( .Npc:Self )
    Else
        Call SetSelfVar ( 00000000 00000000 )
        Call BindNpcInteract ( .Npc:Self $Script_InteractTutorialBoss )
        Call BindNpcDefeat ( .Npc:Self $Script_DefeatTutorialBoss )
        Call BindNpcIdle ( .Npc:Self $Script_NpcIdleTutorialBoss )
    EndIf
    Return
    End
}

#new:Npc $Npc_TutorialBoss {
    .NpcID:TutorialBoss $NpcSettings_TutorialBoss ~Vec3f:TutorialBoss
    00002D01 $Script_InitTutorialBoss 00000000 00000000 0000010E
    ~NoDrops
    ~Movement:TutorialBoss
    ~AnimationTable:TutorialBoss
    00000000 00000000 00000000 00000000
}
```

NPC ID `02` follows the Dryite and Pokey added by the map tutorial. Use another unused local ID if your map already assigns it.

The interaction disables player input before the pre-battle scene, then sets NPC variable `0` after the conversation. `$Script_NpcIdleTutorialBoss` runs in the background while the NPC is present and waits for that value to become `1`. It then calls `StartBossBattle`. The input lock remains in place until the defeat script finishes the post-battle scene.

`StartBossBattle` does not take a battle ID. It uses the encounter this NPC belongs to. It also prevents Mario from fleeing. The next section assigns that encounter to the boss formation.

`BindNpcIdle` assigns the script which the NPC begins running after initialization. The script is suspended when the battle begins, so it does not continue monitoring the variable during battle. `BindNpcDefeat` registers the script which runs after the game returns to the map. `GetBattleOutcome` lets that script check for a victory before it changes saved state.

`RemoveNpc` removes the world NPC after the dialogue. If you want to use the **Death** animation selected on the marker, you can replace this call with `DoNpcDefeat`. That function hands the NPC over to the engine's standard defeat sequence. Both functions end the current defeat script, so player input is restored before the call, along with any other work which must be completed first.

## 5. Add the NPC to the Group List

The map tutorial created `$NpcGroupList_Tutorial` for the Dryite and Pokey. Add the boss before the zeroed row which ends the list:

```star-rod
#new:NpcGroupList $NpcGroupList_Tutorial {
    00000001 $Npc_TutorialDryite 00000000
    00000001 $Npc_TutorialPokey  0A000001
    00000001 $Npc_TutorialBoss   000D0000
    00000000 00000000 00000000
}
```

The last word of each nonzero row is its battle ID. The friendly Dryite has no battle. The Pokey retains its existing Area SBK encounter, while the boss uses section `00`, formation `0D`.

## 6. Compile and Test

Compile the mod and enter `sbk_43`. Check the complete sequence:

1. The Piranha Plant appears at the marker and speaks when approached.
2. The conversation begins section `00`, formation `0D` with the selected boss music.
3. Winning returns to `sbk_43`, shows the defeat message, and removes the NPC.
4. Player control returns after the NPC disappears.
5. Leaving the map and returning does not restore the boss.

## 7. Continue Developing the Boss

The world connection does not determine what makes the battle a boss. That behavior belongs to the Actor and its battle scripts. Continue by separating any structures still shared with the original Piranha Plant, adding moves to its turn script, and handling its battle events. Test those changes through Battle Select before returning to the map encounter.

A more elaborate sequence can be inserted before `RemoveNpc`. Keep the saved flag in the victory path and remove the NPC when the sequence is finished.

See [Scripting a Battle](scripting-a-battle.md) for Actors, formations, and battle scripts. See [Scripting a Map](scripting-a-map.md) for NPC markers, group lists, and map initialization.
