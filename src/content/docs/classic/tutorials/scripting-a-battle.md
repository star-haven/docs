---
title: Scripting a Battle
sidebar:
  label: Scripting a Battle
---
This tutorial begins by adding a formation to an existing battle section while reusing its original actors and stage data. It then imports an enemy from another section, patches an existing enemy, and creates a new Actor with its own stats and turn script.

We will use the shorthand `$formation` in this guide to refer to `$mod/battle/formation`.

The relevant files are:

| File | Purpose |
| --- | --- |
| `$formation/BattleSections.txt` | Assigns each battle section its ID, load address, and source name. |
| `$formation/src/00 Area KMR Part 1.bscr` | Battle-section source. |
| `$formation/src/00 Area KMR Part 1.bidx` | Names and locations of structures in that source. |
| `$formation/patch/00 Area KMR Part 1.bpat` | Patch containing edits to formations and Actors added by this tutorial. |
| `$formation/import/enemy/0D_PiranhaPlant.bpat` | The structures and code for a Piranha Plant actor. |

## 1. Add a Formation

### 1.1. Choose a Battle Section

Open `$formation/BattleSections.txt`. Each nonempty line assigns a load address, section ID, and source name. The matching `.bscr` and `.bidx` files are under `$formation/src/`.

Choose a section which already contains the enemies and stage you want. This avoids imports during the first build and keeps every pointer within one overlay. Section `00`, **Area KMR Part 1**, is a convenient example because it contains Goombas, Paragoombas, Spiked Goombas, and several simple stages.

Create the corresponding patch if it does not already exist:

```text
$mod/battle/formation/patch/00 Area KMR Part 1.bpat
```

The patch basename must match the source name from `BattleSections.txt`.

### 1.2. Read an Existing Formation

Find `$Formation_00` and `$Formation_01` in the section's `.bscr` file. A formation describes the set of enemies to appear in a given battle. Each line contains an actor definition, a home-position index, turn priority, and four actor variables passed to the actor when it is created.

The section `00` source begins with formations resembling:

```star-rod
#new:Formation $Formation_00 {
    $Goomba 00000001 0000000A 00000000 00000000 00000000 00000000
}

#new:Formation $Formation_01 {
    $Goomba 00000001 0000000A 00000000 00000000 00000000 00000000
    $Goomba 00000002 00000009 00000000 00000000 00000000 00000000
}
```

The second formation gives each enemy a different home position and priority.

### 1.3. Add a New Formation

Add a new structure to the `.bpat` file:

```star-rod
#new:Formation $Formation_Tutorial {
    $Goomba     00000001 0000000A 00000000 00000000 00000000 00000000
    $Paragoomba 00000006 00000009 00000000 00000000 00000000 00000000
}
```

These actor names already belong to section `00`. If you chose another section, use actors present in that section or import them as described later.

Home positions use pre-defined battle coordinates selected by index. 0-3 are on the ground from front to back, and 4-7 are in the air. Make sure each actor has a unique home position.

### 1.4. Add It to the Formation Table

Creating the structure does not assign it a formation ID. Find `$FormationTable` in the section source under `$formation/src/` and copy the complete structure into the patch, changing its declaration to:

```star-rod
@ $FormationTable
```

In section `00`, insert a copy of a nearby working row immediately after formation `0B` and before the complete zeroed row which ends the table. Change the copied row's formation pointer to `$Formation_Tutorial`. This assigns the new formation index `0C` without shifting any existing index.

Leave the working row's name pointer, stage pointer, and remaining fields for the first test. Set the enemy count to match the two lines in the new formation, and retain the complete zeroed row after it. Once the formation works, you can select a different stage or investigate the other fields from a similar battle.

### 1.5. Build and Launch the Battle

Compile the project. A successful build proves that the actor and stage names resolve and that the expanded structures fit in the section overlay.

With the debug patch enabled, use **Battle Select** to choose section `00` and formation `0C`. This is the fastest way to enter the battle while developing it. When testing the world connection, the corresponding packed battle ID is:

```text
000C0000
```

The first byte is the section, the second is the formation, and the final two bytes select an optional stage table entry. Zero uses the stage stored in the formation table.

## 2. Import an Enemy

An enemy from another section brings its actor definition, parts, scripts, tables, and any native functions with it. Area MIM's Piranha Plant is a small example which is not already present in section `00`.

**Copy Assets to Mod** places isolated enemy exports under `$formation/import/enemy/`. Import `0D_PiranhaPlant.bpat` near the top of `00 Area KMR Part 1.bpat`:

```star-rod
#import enemy/0D_PiranhaPlant.bpat
```

Edit `$Formation_Tutorial` to replace the Paragoomba with the imported actor:

```star-rod
#new:Formation $Formation_Tutorial {
    $Goomba              00000001 0000000A 00000000 00000000 00000000 00000000
    $0D_PiranhaPlant     00000002 00000009 00000000 00000000 00000000 00000000
}
```

The Piranha Plant now belongs to the KMR formation even though its actor source came from section `0D`. Isolated enemy exports include the source section in their symbol names to avoid collisions when they are imported elsewhere.

Compile again and launch section `00`, formation `0C` through Battle Select. The formation table entry created earlier still points to `$Formation_Tutorial`, so it does not need another change.

Import only actors you need. Every imported dependency occupies space in the active battle section, and the overlay has a limited memory budget.

## 3. Patch an Enemy

The original enemies in section `00` can be changed through the same `.bpat` file. A patch to one of their shared structures affects every formation in the section which uses it.

### 3.1. Change Actor Data

The `$Goomba` Actor in `00 Area KMR Part 1.bscr` has two HP:

```star-rod
[MaxHP] 2`b
```

Actor fields may be targeted by name. Add this patch to give every Goomba in the section five HP without replacing the other fields:

```star-rod
@ $Goomba {
    [MaxHP] 5`b
}
```

Compile and launch formation `00` or `0C`, then damage the Goomba until it is defeated. Its original tattle still reports two HP; a finished mod would replace that message as well.

### 3.2. Follow the Turn Script

An Actor does not contain its attacks directly. `$Goomba` points to `$Script_Init_802197AC`, whose first command binds the script which runs during the enemy's turn:

```star-rod
Call BindTakeTurn ( .Actor:Self $Script_TakeTurn_8021A300 )
```

Find `$Script_TakeTurn_8021A300` in the section source under `$formation/src/`. Near the end of the jump attack, it deals one damage:

```star-rod
Call EnemyDamageTarget ( .Actor:Self *Var0 ~Flags:DamageType:0 00000000 00000000 00000001 00000020 )
```

Copy the complete `$Script_TakeTurn_8021A300` structure into the section patch and change its declaration from `#new:Script` to `@`. Change the damage argument from `00000001` to `00000002`, leaving the rest of the call and script intact.

Compile and let the Goomba take a turn. Also test a miss or Lucky result; the replacement contains the complete attack sequence, including the paths which do not reach `EnemyDamageTarget`.

As with the HP patch, replacing this shared turn script changes every Goomba in section `00`. It does not change Goombas imported into or defined by another battle section.

## 4. Create a New Enemy

Patching `$Goomba` changes an existing Actor. To create a separate variant, add another Actor structure with its own name and use it from a formation. A new Actor can initially reuse the supporting data of an imported enemy and separate those pieces as they are changed.

### 4.1. Add an Actor

Copy the `$0D_PiranhaPlant` Actor from the imported file into `00 Area KMR Part 1.bpat`. Rename it and change the fields which should belong to the new variant:

```star-rod
#new:Actor $TutorialPiranha {
    % stats
    [Index]        19b
    [Level]        11`b
    [MaxHP]         8`b
    [Coins]         3`b
    [Flags]       00000000
    [StatusTable] $StatusTable_8021D3A0_0D
    % ai
    [PartsCount]    1`s
    [PartsTable]  $PartsTable_8021D44C_0D
    [Script]      $Script_Init_8021D498_0D
    % move effectiveness
    [Escape]       70`b
    [Item]         40`b
    [AirLift]      20`b
    [Hurricane]    20`b
    [UpAndAway]    95`b
    [PowerBounce]  90`b
    [SpinSmash]     0`b
    % ui positions
    [Size]         38`b 38`b
    [HealthBar]     0`b  0`b
    [StatusTurn]   -7`b 33`b
    [StatusIcon]   10`b 33`b
}
```

Change the second line of `$Formation_Tutorial` to use `$TutorialPiranha` and compile again:

```star-rod
$TutorialPiranha 00000002 00000009 00000000 00000000 00000000 00000000
```

This is a distinct Actor with its own HP, coins, level, and effectiveness values. It still uses the Piranha Plant's status table, parts, animations, event handler, and turn script. It will therefore retain the original Piranha Plant's appearance, name, tattle, and behavior.

### 4.2. Give It a Turn Script

To change the new Actor's attack without changing `$0D_PiranhaPlant`, copy the complete `$Script_TakeTurn_8021DCD4_0D` from the imported file into the section patch. Change its declaration from:

```star-rod
#new:Script $Script_TakeTurn_8021DCD4_0D
```

to:

```star-rod
#new:Script $Script_TakeTurn_TutorialPiranha
```

This is a new structure rather than an `@` patch because the original Piranha Plant must keep its existing turn script. For a first test, change the damage argument in the copied `EnemyDamageTarget` call from `00000003` to `00000004`:

```star-rod
Call EnemyDamageTarget ( .Actor:Self *Var0 ~Flags:DamageType:0 00000000 00000000 00000004 00000020 )
```

The imported init script still binds the imported turn script. Add a new init script which selects the new one while continuing to reuse the original idle and event scripts:

```star-rod
#new:Script $Script_InitTutorialPiranha {
    Call BindTakeTurn ( .Actor:Self $Script_TakeTurn_TutorialPiranha )
    Call BindIdle ( .Actor:Self $Script_Idle_8021D4E4_0D )
    Call BindHandleEvent ( .Actor:Self $Script_HandleEvent_8021D60C_0D )
    Return
    End
}
```

Finally, change the Actor's `Script` field:

```star-rod
[Script] $Script_InitTutorialPiranha
```

For a direct comparison, edit `$Formation_Tutorial` so that it contains both Actors at different home positions:

```star-rod
#new:Formation $Formation_Tutorial {
    $0D_PiranhaPlant 00000001 0000000A 00000000 00000000 00000000 00000000
    $TutorialPiranha 00000002 00000009 00000000 00000000 00000000 00000000
}
```

Compile and launch formation `0C`. The imported Actor retains its three-damage bite, while `$TutorialPiranha` uses the copied four-damage attack.

The same process applies to the remaining dependencies. When the new enemy needs its own defense, status behavior, animations, event handling, name, or tattle, copy and rename the structure which owns that feature and update the pointer in the Actor or parts table. Do not modify a shared structure unless every Actor which points to it should receive the change.

See [Adding a Boss](adding-a-boss.md) to connect a completed Actor and formation to an NPC on a map. See [Battle Data](../reference/battle-data.md) for the section layout and [Battle Flags](../reference/battle-flags.md) for damage, targeting, actor, and part flags.
