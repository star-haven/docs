---
title: Adding a Sound Effect
sidebar:
  label: Adding a Sound Effect
---
Star Rod Classic can rebuild Paper Mario's editable sound-effect archive. A sound effect is not merely a compressed WAV file. It is a logical sound ID mapped to either an instrument with preset properties or a small script which can use multiple instruments and trigger other sound effects.

This guide fills an unused sound ID with a simple one-shot effect. See [Adding a New Instrument](adding-a-new-instrument.md) first if the sound should use a new waveform.

## Choose a Sound ID

Open `$mod/audio/SoundEffects.xml` and find an entry marked `empty="true"`. For example, slot `0007` is empty in the original game:

```xml
<Sound id="0007" name="Empty_0007" empty="true"/>
```

Replace an existing empty entry rather than adding a new one. The engine's sound ID space has fixed ranges and gaps; adding another entry to the table does not create another usable ID.

## Add a One-Shot Effect

The following example plays an existing menu sample:

```xml
<Sound id="0007" name="TutorialBell" desc="Tutorial sound">
    <Routing allocation="dynamic" maxPlayer="7" priority="0"/>
    <OneShot wav="SYS2_04_CreateFileMoveCursor" volume="70" lockVolume="true" lockPitch="true"/>
</Sound>
```

`Routing` determines which of the engine's eight SFX players may play the sound and how it competes with sounds already playing. The example uses:

| Attribute | Meaning |
| --- | --- |
| `allocation="dynamic"` | Let the engine choose an SFX player when the sound begins. |
| `maxPlayer="7"` | Allow the engine to choose any player from `0` through `7`. |
| `priority="0"` | Assign the lowest priority. Priorities range from `0` (lowest) through `3` (highest); a new sound may replace one with an equal or lower priority when they compete for a player. |

Fixed routing uses `allocation="fixed"` and a `player` value when a sound must use a particular player. An `exclusiveGroup` from `1` through `3` may also be used for sounds which should replace one another. These choices affect how sounds interrupt one another; they do not change the sample or its volume, pan, or pitch.

`name` becomes the project sound enum name. `wav` selects an instrument by the stem used in its sound bank's `SoundBank.xml`; the `.wav` extension is omitted. Volume is written in hexadecimal, so `70` means `0x70`. `lockVolume` and `lockPitch` prevent playback calls from overriding the values defined by the effect.

This routing is suitable for an ordinary one-shot sound. Begin with a similar existing sound when the new effect needs different routing.

One-shot effects may also set pan, reverb, pitch, random pitch, or an envelope variant. Omitted values use the format defaults. Begin with the smallest definition and add only the controls the sound needs.

## Preview the Source

Open **Audio Booth** and select the **SFX** tab. Choose `0007 TutorialBell` to hear the effect. After editing the source, choose **Selected → Reload** or reopen Audio Booth.

Audio Booth reads the project XML and sound banks directly. A successful preview verifies the instrument reference and basic program, but the effect must still be built and tested in the game.

## Build the Archive

Enable **Inject Audio Files** in the project build options and use **Compile Mod**. Star Rod builds `SoundEffects.xml` and any referenced files under `audio/sfx/` into `DAT1.sef`, rebuilds the audio catalogs, and injects the selected audio files into the ROM.

`DAT1.sef` is not limited to its original `0x5200`-byte allocation. Star Rod adjusts the allocation to the rebuilt file and increases the audio heap when necessary.

## Use the Sound

The name in `SoundEffects.xml` replaces the corresponding entry in the project's `.Sound` enum. A map script can now use:

```star-rod
Call PlaySound ( .Sound:TutorialBell )
```

## Write a Sequenced Effect

Store the program in a separate file under `$mod/audio/sfx/` when the effect needs several notes, tracks, loops, envelopes, or spawned sub-effects. `SoundEffects.xml` then names that file:

```xml
<Sound id="0007" name="TutorialBell" src="sfx/0007_TutorialBell.xml">
    <Routing allocation="dynamic" maxPlayer="7" priority="0"/>
</Sound>
```

Begin with an existing effect which behaves similarly and give it a new filename. A sequence can play several notes, change their timing and sound, and repeat sections.
