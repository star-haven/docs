---
title: Battle Flags
sidebar:
  label: Battle Flags
---
The `DamageType` names below are exposed by Classic's flag database and may be combined with `~Flags:DamageType:...`. The remaining tables describe raw fields used by battle structures and API functions. Their meanings are descriptions of engine behavior unless a Star Rod name is shown explicitly.

## Damage Types

Damage calls accept a bitfield combining one or more elements with behavioral modifiers. Star Rod exposes these names through the `DamageType` flag database.

### Elements and Specialized Low Bits

| Value | Name | Meaning |
| --- | --- | --- |
| `00000002` | `Fire` | Fire element. |
| `00000004` | `Water` | Water element. |
| `00000008` | `Ice` | Ice element. |
| `00000010` | `Magic` | Magic element. |
| `00000020` | `Electric` | Shock element. |
| `00000040` | `Smash` | Hammer or smash element. |
| `00000080` | `Jump` | Jump element. |
| `00000100` | `Cosmic` | Cosmic element. |
| `00000200` | `Blast` | Blast element. |
| `00000400` | `POW` | POW Block behavior. |
| `00000800` | `Quake` | Quake element. |
| `00001000` | `Fear` | Fear or spook behavior. |
| `00002000` | `Death` | Specialized instant-death item behavior; named by the engine but omitted from the Classic flag file. |
| `00008000` | `AirLift` | Air Lift behavior. |
| `00010000` | `SpinySurge` | Spiny Surge behavior. |
| `00020000` | `ShellCrack` | Convert applicable hit events to Shell Crack. |
| `00040000` | `Throw` | Hammer Throw element and charge behavior. |

### High-Bit Modifiers

| Value | Star Rod name | Meaning |
| --- | --- | --- |
| `00100000` | `PowerBounce` | Mark a Power Bounce hit. |
| `00200000` | `QuakeHammer` | Mark a Quake Hammer hit. |
| `00400000` | `RemoveBuffs` | Remove applicable buffs. |
| `00800000` | `PeachBeam` | Mark Peach Beam behavior. |
| `01000000` | `MultiBounce` | Mark a Multibounce hit. |
| `02000000` | `Unblockable` | Prevent normal blocking. |
| `04000000` | `SpinSmash` | Convert applicable hit and death events to Spin Smash variants. |
| `08000000` | `IgnoreDefense` | Ignore positive defense; preserve 99 as immunity. |
| `10000000` | `NoContact` | Do not trigger contact hazards. |
| `20000000` | `NoOtherDamagePopups` | Used by multi-target or multi-popup attacks; engine source calls this `MultiplePopups`. |
| `40000000` | `StatusAlwaysHits` | Bypass the normal hit restriction for the associated status attempt. |
| `80000000` | `TriggerLucky` | Allow a failed hit test to produce Lucky. |

Use the same combination as a working attack with similar contact, targeting, and popup behavior.

## Battle-State Flags

The battle state contains two 32-bit flag fields conventionally called `flags1` and `flags2`. Several unnamed bits are transient state owned by the battle engine. Avoid changing an unnamed battle-state bit merely because its observed behavior resembles the effect you need.

### `flags1`

| Value | Meaning |
| --- | --- |
| `00000001` | Actors are visible. |
| `00000002` | A battle menu is open. |
| `00000004` | The Tattle window is open. |
| `00000008` | Show player decorations such as Frozen, Water Block, and Cloud Nine. |
| `00000010` | Include Power Plus, Merlee, and other attack power-ups. |
| `00000020` | Allow special target events such as flip, fall, and burn. |
| `00000040` | Nice action-command result. |
| `00000080` | Suppress the action-command rating message. |
| `00000100` | A move is executing. |
| `00000200` | Super action-command result for partner and item hits. |
| `00000800` | Force an immune hit result. |
| `00001000` | Automatically succeed the action command. |
| `00008000` | Free action command. |
| `00020000` | Disable the normal celebration. |
| `00040000` | Player or enemy fled. |
| `00080000` | Partner is acting. |
| `00100000` | Player is in back. |
| `00200000` | End the current move or turn when set by `YieldTurn`. |
| `00400000` | Player is defending. |
| `00800000` | Do not game over on a loss. |
| `01000000` | Star points have been dropped. |
| `02000000` | Tutorial battle; partner switching is restricted. |
| `04000000` | Hustled state. |
| `08000000` | Sort enemy turns by X position. |
| `10000000` | Hammer charge is present. |
| `20000000` | Jump charge is present. |
| `40000000` | Goombario charge is present. |
| `80000000` | Current attack was blocked. |

### `flags2`

| Value | Meaning |
| --- | --- |
| `00000001` | Star points are being awarded. |
| `00000002` | Player turn has been used. |
| `00000004` | Partner turn has been used. |
| `00000008` | Override inactive player presentation. |
| `00000010` | Override inactive partner presentation. |
| `00000020` | Running away is allowed. |
| `00000040` | Peach battle. |
| `00000100` | Do not decrement a stored Turbo Charge turn at the start of the player turn. |
| `00000200` | Jump tutorial is active. |
| `00000400` | Final Bowser part 1; no other understood use. |
| `00001000` | No target is available. |
| `00004000` | Ignore darkness. |
| `00010000` | Hide partner buff counters. |
| `00100000` | Do not apply the player's palette adjustment. |
| `01000000` | Battle began with a first strike. |
| `02000000` | Do not stop the current music when battle ends. |
| `04000000` | HP Drain has already applied. |
| `08000000` | A Rush badge condition is active. |
| `10000000` | Drop a Whacka's Bump after battle. |

## Actor Flags

| Value | Meaning |
| --- | --- |
| `00000001` | Invisible. |
| `00000004` | Hide the actor's shadow. |
| `00000010` | Low-priority target when combined with Target Only. |
| `00000040` | Minor target; ignored by Primary Only targeting. |
| `00000080` | Cannot be tattled. |
| `00000200` | Flying; rejected by Not Flying and unaffected by Quake Hammer. |
| `00000400` | Flipped. |
| `00000800` | Upside down or attached to the ceiling. |
| `00001000` | Actor type changed; refresh Tattle and HP-bar state. |
| `00002000` | Immune to items, Chill Out, and Up & Away. |
| `00004000` | Target only: no turn and does not keep the battle alive. |
| `00008000` | Half height. |
| `00010000` | Skip the current turn. |
| `00040000` | Never show a health bar. |
| `00080000` | Health bar is temporarily hidden. |
| `00200000` | Do not attack. |
| `00400000` | Do not apply damage to HP. |
| `02000000` | Hide damage popups. |
| `04000000` | Actor is using its idle animation. |
| `08000000` | Show status icons. |
| `10000000` | Blur effect is enabled. |
| `20000000` | Do not use an inactive animation; player only. |

## Part Flags

| Value | Meaning |
| --- | --- |
| `00000001` | Invisible. |
| `00000002` | Do not accept decorations. |
| `00000004` | Hide the part's shadow. |
| `00000008` | Default part for the actor. |
| `00000020` | Ignore the “target below” check. |
| `00000040` | Minor target; ignored by Primary Only targeting. |
| `00000080` | Cannot be tattled. |
| `00000100` | Transparent or illusory part. |
| `00002000` | Damage immune. |
| `00020000` | Cannot be targeted. |
| `00100000` | Position is absolute rather than relative to the actor. |
| `00800000` | Primary target for attacks which filter secondary parts. |
| `01000000` | Has a palette effect. |
| `20000000` | Do not change idle animation for status. |
| `40000000` | Do not apply the shock visual effect. |
| `80000000` | Do not allocate movement state. |

Part target flags are `01 = NoJump`, `02 = NoSmash`, and `04 = NoDamage`. They affect target selection and damage or status processing, not rendering.

## Target Flags

Items and moves use the same target-list filter bits:

| Value | Meaning |
| --- | --- |
| `00000001` | Player selects one target. |
| `00000002` | Widely used for ordinary enemy targeting; independent meaning is not named. |
| `00000004` | Ground row only. |
| `00000008` | Target the player rather than enemies. |
| `00000010` | Reject high targets; unused by vanilla moves. |
| `00000020` | Reject actors marked Flying. |
| `00000040` | Reject ground-row targets. |
| `00000080` | Unread compatibility bit used by jump-like moves. |
| `00000100` | Target the partner rather than enemies. |
| `00000400` | Air Lift filter; reject ceiling targets. |
| `00000800` | Jump-like move; reject parts marked NoJump. |
| `00001000` | Smash-like move; reject parts marked NoSmash. |
| `00002000` | Reject targets behind another eligible target. |
| `00004000` | Reject targets below another eligible target. |
| `00008000` | Primary parts only. |
| `00010000` | Allow actors marked Target Only. |
| `00020000` | Tattle filter; reject actors or parts marked NoTattle. |
| `00040000` | Reject ceiling actors. |
| `00100000` | Direction Right filter; bugged and unused. |
| `00200000` | Direction Left filter; bugged and unused. |
| `00400000` | Direction Below filter; bugged and unused. |
| `00800000` | Direction Above filter; bugged and unused. |
| `80000000` | Proceed without selecting a target. |

Target construction also inspects actor rows, columns, whole-actor flags, part flags, and part target flags. Copying a target bitfield without the matching actor-part setup commonly produces an empty target list.
