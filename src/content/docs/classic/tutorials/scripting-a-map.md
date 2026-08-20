---
title: Scripting a Map
sidebar:
  label: Scripting a Map
---
This tutorial modifies the Dry Dry Desert map `sbk_43`. The original map has four exits, no NPCs, and one Yellow Block containing a Coin. We will take a brief tour of the existing scripts and functions in this map, then add some new interactable content to it. We will use a text editor to write a patch file and the Map Editor to place markers visible to the patch file.

## 1. Preparing the Map

Open **Level Editor**, select `sbk_43` under Dry Dry Desert, and open it in Map Editor. Save the map once so that the editable copy is written under `$mod/map/save/`.

The relevant project files are:

| File | Purpose |
| --- | --- |
| `$mod/map/src/sbk_43.mscr` | Map overlay source. |
| `$mod/map/src/sbk_43.midx` | Names and locations of structures in that source. |
| `$mod/map/src/sbk_43.xml` | Map geometry and marker data. |
| `$mod/map/save/sbk_43.xml` | Edited geometry and position data. |
| `$mod/map/patch/sbk_43.mpat` | The scripts and structures added or replaced by this tutorial. |

Create `sbk_43.mpat` if it does not already exist. Compile the unchanged map and enter it normally or through the debug menu's map selection. Confirm that the map loads, that its four exits work, and that the original Coin block appears near the center.

We are now ready to edit the map's geometry in the Map Editor and its script in our text editor.

## 2. Tour the Existing Map

### 2.1. The Header

Every map has exactly one **Header**. Open `sbk_43.mscr` and find `$Header` near the end of the file:

```star-rod
#new:Header $Header {
    [MainScript]  $Script_Main_EnterWalk
    [EntryList]   $EntryList
    [EntryCount]  00000004
    [Background]  80200000
    [MapTattle]   00190081
}
```

The Header tells the engine what to do after loading the map assets:

| Field | Purpose |
| --- | --- |
| `MainScript` | The script which initializes the map. |
| `EntryList` | The table of positions at which Mario can enter the map. |
| `EntryCount` | The number of entries in that table. |
| `Background` | The fixed address `80200000` used for a map background. Maps without a background use zero. |
| `MapTattle` | The string ID used when Goombario describes the current map. |

The header does not contain the map's initialization itself. It points to the Script_Main which does that work.

### 2.2. Entries and Markers

Follow the header's `EntryList` pointer to find the four entries:

```star-rod
#new:EntryList $EntryList {
    ~Vec4f:Entry0 % -475.0    0.0    0.0   90.0
    ~Vec4f:Entry1 %  475.0    0.0    0.0  270.0
    ~Vec4f:Entry2 %    0.0    0.0 -475.0  180.0
    ~Vec4f:Entry3 %    0.0    0.0  475.0    0.0
}
```

In Map Editor, open the **Objects** tab on the right and select **Markers**. The **Entrances** group contains one marker for each entry in `$EntryList`. Select the markers and compare their positions and angle values with the comments in `$EntryList`.

Markers are editor-only handles which can be referenced by map patch files. An entry marker stores a position and facing direction, but does not create an object in the game. The expression `~Vec4f:Entry0` finds the marker during the build and expands to its X, Y, Z, and yaw values. This lets the script refer to a position by name while the position remains editable in Map Editor.

An expression is evaluated when the structure containing it is compiled. Moving an entry marker alone does not rewrite the original `EntryList` in the map overlay unless we copy the whole struct into our patch file first. This would tell Star Rod that we want to re-evaluate and rebuild its contents. We will demonstrate this connection with the Coin block later in this tutorial.

### 2.3. The Script_Main

Return to `sbk_43.mscr` and find the script named by the header:

```star-rod
#new:Script_Main $Script_Main_EnterWalk {
    Set *GB_WorldLocation .Location:DryDryDesert
    Call SetSpriteShading ( .Shading:None )
    If *GB_StoryProgress == .Story:Ch2_GotPulseStone
        Call DisablePulseStone ( .False )
    EndIf
    Call SetCamPerspective ( .Cam:Default 00000003 25` 16` 4096` )
    Call SetCamBGColor ( .Cam:Default 0` 0` 0` )
    Call SetCamEnabled ( .Cam:Default .True )
    Call SetCamLeadPlayer ( .Cam:Default .False )
    ExecWait $Script_MakeEntities
    Call $Function_80240000 ( )
    Call SetMusicTrack ( 00000000 .Song:DryDryDesert 00000000 00000008 )
    Set *Var0 $Script_80240230
    Exec EnterWalk
    Return
    End
}
```

This is a typical `Script_Main` which illustrates the setup needed by most maps.

The first line records Dry Dry Desert as the current world location. The next call selects the map's sprite shading profile, followed by a story-dependent setting for the Pulse Stone. You won't need the code for the Pulse Stone on maps outside of Dry Dry Desert.

The four camera calls establish the default perspective, background color, and player tracking. The script then runs `$Script_MakeEntities`, calls a local native function which creates the desert sun effect, and starts the area's music.

Finally, the Script_Main places the map's exit-binding script in `*Var0` and starts `EnterWalk`. The shared entry script handles Mario's walk into the map, then runs the supplied script to enable the four exits. We let `EnterWalk` decide when to bind the exits so they will not be active while the entering Mario is trying to walk through them.

### 2.4. Move the Existing Block

Follow `$Script_MakeEntities` to find the map's original Coin block:

```star-rod
#new:Script $Script_MakeEntities {
    Call MakeEntity ( .Entity:YellowBlock ~Vec4d:Entity802403C0 .Item:Coin 80000000 )
    Call AssignBlockFlag ( *GF_SBK43_ItemBlock_Coin )
    Return
    End
}
```

`MakeEntity` is the native function used to create various **entity** objects. Some of them require only `MakeEntity`. Others, like this block, have additional setup to perform afterward.

`~Vec4d:Entity802403C0` is another Marker expression. This one reads the position and yaw from the entity marker named `Entity802403C0`. The rest of the line determines what is created there. Note that `MakeEntity` calls must always end with `80000000`.

Copy the complete structure into `sbk_43.mpat` and change its declaration from `#new:Script` to `@`:

```star-rod
@ $Script_MakeEntities {
    Call MakeEntity ( .Entity:YellowBlock ~Vec4d:Entity802403C0 .Item:Coin 80000000 )
    Call AssignBlockFlag ( *GF_SBK43_ItemBlock_Coin )
    Return
    End
}
```

The replacement is now compiled as part of the patch, so `~Vec4d:Entity802403C0` reads the current marker values. Select `Entity802403C0` in Map Editor and change its X position from `0` to `100`. Save the map, compile the mod, and reload `sbk_43`. The Coin block appears 100 units east of its original position even though the patch still refers to the marker by name.

## 3. Add a Sign

Add an **Entity** marker on open ground, name it `TutorialSign`, and select **Signpost** as its entity type. Set the position and rotation of the marker as you like, then save the map.

Add the sign's message and interaction script to `sbk_43.mpat`:

```star-rod
#string $String_TutorialSign {
	[Style Sign]
	Welcome to Dry Dry Desert.[Wait][End]
}

#new:Script $Script_ReadTutorialSign {
    SetGroup 00000000
    Call SetTimeFreezeMode ( 00000001 )
    Call DisablePlayerInput ( .True )
    Call ShowMessageAtScreenPos ( $String_TutorialSign 160` 40` )
    Call DisablePlayerInput ( .False )
    Call SetTimeFreezeMode ( 00000000 )
    Return
    End
}
```

If you are wondering how you are supposed to figure out this script, don't worry. While learning the engine, it is perfectly acceptable to look for working examples in existing maps and copy them. You do not have to understand everything at once. For now, we only need to understand how to wire the pieces together.

Simply adding the marker still does not create anything. Edit the replacement for `$Script_MakeEntities`, retaining the Coin block and adding our new sign after it:

```star-rod
@ $Script_MakeEntities {
    Call MakeEntity ( .Entity:YellowBlock ~Vec4d:Entity802403C0 .Item:Coin 80000000 )
    Call AssignBlockFlag ( *GF_SBK43_ItemBlock_Coin )

    Call MakeEntity ( .Entity:Signpost ~Vec4d:TutorialSign 80000000 )
    Call AssignScript ( $Script_ReadTutorialSign )
    Return
    End
}
```

`MakeEntity` creates the sign at the marker. `AssignScript` applies to the entity which was just created and gives the sign its interaction. Compile the mod, enter `sbk_43`, and read it.

## 4. Add More Entities

Add three more **Entity** markers:

| Marker | Entity type |
| --- | --- |
| `TutorialBrickA` | `BrickBlock` |
| `TutorialBrickB` | `BrickBlock` |
| `TutorialSpring` | `SimpleSpring` |

Place the brick blocks where Mario can break them and put the spring on the ground. Save the map, then add the following calls to `$Script_MakeEntities` before its `Return`:

```star-rod
Call MakeEntity ( .Entity:BrickBlock ~Vec4d:TutorialBrickA 80000000 )
Call MakeEntity ( .Entity:BrickBlock ~Vec4d:TutorialBrickB 80000000 )
Call MakeEntity ( .Entity:SimpleSpring ~Vec4d:TutorialSpring 80` 80000000 )
```

The extra argument for `SimpleSpring` is its upward launch velocity. These brick blocks have no saved flags, so they return when the map is loaded again. Compile and test all three entities before continuing.

Feel free to look at other entity types in other maps and try implementing them here. Note that a few, such as the `jan` flowers, are not available in `sbk`. Perhaps try adding a breakable crate or a hidden panel on your own. Good luck!

## 5. Add a Super Shroom

Items which sit directly in the world are created with `MakeItemEntity`. Add another **Entity** marker named `TutorialShroom`, select **Item** as its entity type, and place it on the ground. Select **SuperShroom** as the item so the marker is displayed correctly, then save the map.

The item needs a saved flag so that it remains collected after Mario leaves the map. Open `$mod/globals/ModFlags.txt` and assign an unused index. For example, if `000` is free:

```text
000 = MF_TutorialShroomCollected
```

Do not reuse an index already assigned by the project. Star Rod adds the leading `*` when the name is used in a script, giving us `*MF_TutorialShroomCollected`.

Add the item to `$Script_MakeEntities` before its `Return`:

```star-rod
Call MakeItemEntity ( .Item:SuperShroom ~Vec3d:TutorialShroom .ItemSpawnMode:Fixed_NeverVanish *MF_TutorialShroomCollected )
```

`~Vec3d:TutorialShroom` supplies the item's position. `.ItemSpawnMode:Fixed_NeverVanish` keeps it at that position and prevents it from disappearing with time. The final argument records whether it has been collected.

Compile the mod and collect the Super Shroom. Leave `sbk_43` and return. The item should not reappear.

## 6. Add an NPC

NPCs require more supporting data than entities. A useful way to add one is to find a similar NPC in the map sources, copy its structures into the destination map's patch, and make the smallest changes needed for the new map.

Add an **NPC** marker named `TutorialDryite` and place it on open ground. On its **Movement** tab, leave the movement type set to **Stationary**. On the **Animations** tab, select the **Dryite** sprite and palette `0`, then set the animation slots as follows:

- **Idle:** `Anim_01`
- **Walk:** `Anim_02`
- **Run** and **Chase:** `Anim_03`
- **Death** and **Hit:** `Anim_00`
- All remaining slots: `Anim_01`

Save the map when the marker is configured.

The file `$dump/map/npc/dro_02_8024D7B4_D90.mpat` contains a small, stationary Dryite. It has one interaction script and an init script which binds that interaction. Copy those definitions into `sbk_43.mpat`, then adapt them as follows:

```star-rod
#define .NpcID:TutorialDryite 00

#string $String_TutorialDryite {
	[Style Right]
	It's easy to get lost out here![BR]
	[Wait][End]
}

#new:NpcSettings $NpcSettings_TutorialDryite {
    00000000 001A0017 00000000 00000000 00000000 00000000 00000000 00000000
    00000000 00000000 00630000
}

#new:Script $Script_InteractTutorialDryite {
    Call SpeakToPlayer ( .Npc:Self 00930004 00930001 00000000 $String_TutorialDryite )
    Return
    End
}

#new:Script $Script_InitTutorialDryite {
    Call BindNpcInteract ( .Npc:Self $Script_InteractTutorialDryite )
    Return
    End
}

#new:Npc $Npc_TutorialDryite {
    .NpcID:TutorialDryite $NpcSettings_TutorialDryite ~Vec3f:TutorialDryite
    00002D01 $Script_InitTutorialDryite 00000000 00000000 0000010E
    ~NoDrops
    ~Movement:TutorialDryite
    ~AnimationTable:TutorialDryite
    00000000 00000000 00000000 00000000
}

#new:NpcGroupList $NpcGroupList_Tutorial {
    00000001 $Npc_TutorialDryite 00000000
    00000000 00000000 00000000
}
```

NPC IDs are local to the map. Since `sbk_43` originally has no NPCs, we assign the Dryite ID `00`. The three marker expressions keep the long parts of the NPC structure out of the patch. `~Vec3f` supplies its position, `~Movement` expands the movement settings, and `~AnimationTable` expands the sprite, palette, and sixteen animation slots. These expressions are evaluated when the patch is compiled, just like the marker expression used for the Coin block.

Creating the structures is not enough; the Script_Main must pass the group list to `MakeNpcs`. Copy the complete `$Script_Main_EnterWalk` from `sbk_43.mscr` into the patch, change its declaration to `@`, and add the new call after the camera setup:

```star-rod
@ $Script_Main_EnterWalk {
    Set *GB_WorldLocation .Location:DryDryDesert
    Call SetSpriteShading ( .Shading:None )
    If *GB_StoryProgress == .Story:Ch2_GotPulseStone
        Call DisablePulseStone ( .False )
    EndIf
    Call SetCamPerspective ( .Cam:Default 00000003 25` 16` 4096` )
    Call SetCamBGColor ( .Cam:Default 0` 0` 0` )
    Call SetCamEnabled ( .Cam:Default .True )
    Call SetCamLeadPlayer ( .Cam:Default .False )
    Call MakeNpcs ( .False $NpcGroupList_Tutorial )
    ExecWait $Script_MakeEntities
    Call $Function_80240000 ( )
    Call SetMusicTrack ( 00000000 .Song:DryDryDesert 00000000 00000008 )
    Set *Var0 $Script_80240230
    Exec EnterWalk
    Return
    End
}
```

Compile the mod and speak to the Dryite. Begin exploring more complicated NPCs. Isolated dumps for each NPC are provided in `$dump/map/npc/`. Find some which change their dialogue based on `*StoryProgress` or which give items. The same broad set of structures appears throughout, although individual NPCs may add or omit pieces. Starting from a small working example is usually the fastest way to learn which parts belong to the behavior you want.

## 7. Add an Enemy

Pokey is the simplest enemy used by the `sbk` maps. Its overworld behavior uses the shared `DoBasicAI` function, and Area SBK already contains a battle formation with a single Pokey.

Add another **NPC** marker named `TutorialPokey`. Configure its **Movement** tab as follows:

- Select **Wander** and enable **Is Flying?**.
- Use a circular wandering volume with a radius of `100`, centered on the marker.
- Use a circular detection volume with a radius of `1000`, also centered on the marker.

On the **Animations** tab, select the **Pokey** sprite and palette `0`. Set **Idle**, **04**, and **05** to `Anim_04`; set **Death** and **Hit** to `Anim_0C`; and set every remaining slot to `Anim_08`. Save the map when the marker is configured.

The isolated Pokey in `$dump/map/npc/sbk_00_80240388.mpat` provides a small working example. Add the following adapted structures to `sbk_43.mpat`:

```star-rod
#define .NpcID:TutorialPokey 01

#new:Function $Function_SetTutorialPokeyInstigator {
    LW  V1, 148 (A0)
    LI  V0, 3
    SB  V0, B5 (V1)
    JR  RA
    LI  V0, 2
}

#new:AISettings $AISettings_TutorialPokey {
    1.8
    50`
    10`
    250.0
    0.0
    2`
    3.5
    45`
    6`
    300.0
    0.0
    1`
}

#new:Script $Script_NpcAITutorialPokey {
    Call $Function_SetTutorialPokeyInstigator ( )
    Call DoBasicAI ( $AISettings_TutorialPokey )
    Return
    End
}

#new:NpcSettings $NpcSettings_TutorialPokey {
    00000000 0048000F 00000000 00000000 $Script_NpcAITutorialPokey 80077F70 00000000 8007809C
    00000000 00000000 00090000
}

#new:Npc $Npc_TutorialPokey {
    .NpcID:TutorialPokey $NpcSettings_TutorialPokey ~Vec3f:TutorialPokey
    00000800 00000000 00000000 00000000 0000005A
    ~Items:15`:DriedFruit:9:TastyTonic:1
    ~HP:Standard:2 ~FP:Standard:2 ~CoinBonus:0:1
    ~Movement:TutorialPokey
    ~AnimationTable:TutorialPokey
    00000001 00000000 00000000 00000000
}
```

The names have been changed for this tutorial, and the NPC's position, movement, and animations now refer to the marker. The native helper, AI settings, NPC settings, and drop expressions are copied from the isolated Pokey. The AI calls the helper and then delegates its ordinary behavior to `DoBasicAI`.

Finally, edit `$NpcGroupList_Tutorial` so that it contains both NPCs:

```star-rod
#new:NpcGroupList $NpcGroupList_Tutorial {
    00000001 $Npc_TutorialDryite 00000000
    00000001 $Npc_TutorialPokey  0A000001
    00000000 00000000 00000000
}
```

The value `0A000001` on the Pokey row selects Area SBK's single-Pokey formation and desert battle stage. Compile the mod and approach the Pokey. After winning, use a normal exit to visit another `sbk` map and return to confirm that the encounter remains defeated.

## 8. Follow an Exit

We have seen how the map's entries place Mario and how `EnterWalk` enables the exits after he arrives. We can now follow one of those exits through the original source.

In `$Script_80240230`, the first `Bind` command associates the western boundary collider with an exit script:

```star-rod
Bind $Script_ExitWalk_802400C0 .Trigger:FloorAbove ~Collider:deiliw 00000001 00000000
```

The `FloorAbove` trigger runs `$Script_ExitWalk_802400C0` when Mario moves over the collider named `deiliw`. The exit script is:

```star-rod
#new:Script $Script_ExitWalk_802400C0 {
    SetGroup 0000001B
    Call UseExitHeading ( 0000003C ~Entry:Entry0 )
    Exec ExitWalk
    Call GotoMap ( $ASCII_80240410 00000001 ) % sbk_42
    Wait 100`
    Return
    End
}
```

`UseExitHeading` uses this map's `Entry0` to prepare Mario's movement through the western edge, and `ExitWalk` starts that movement. `GotoMap` then loads `sbk_42` and selects entry `1` in that map. The local entry used to leave and the destination entry used to arrive belong to different maps and do not need the same index.

The other three bindings follow the same pattern for the eastern, northern, and southern boundaries. On arrival, `$Script_Main_EnterWalk` supplies `$Script_80240230` to `EnterWalk` through `*Var0`. `EnterWalk` finishes Mario's entrance before running that script and enabling the boundary triggers.

Adding another connection therefore requires more than an entry marker. The destination map must include the marker in its `EntryList` and update `EntryCount`; the source map needs an exit collider, exit script, and binding; and `GotoMap` must select the intended destination entry.

## 9. Conclusion

This tutorial used map sources and Map Editor markers together to modify a map. We extended the existing initialization, added entities and NPCs, and followed the scripts which connect the map to its neighbors. You now know everything needed to create your own maps!

See [Adding and Editing Maps](../guides/adding-and-editing-maps.md) for the project table and geometry workflow. See [Event Script Overview](../guides/event-script-overview.md) for a closer look at the scripting language used throughout this tutorial.
