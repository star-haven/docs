---
title: Adding a New Instrument
sidebar:
  label: Adding a New Instrument
---
Star Rod can rebuild sound banks from `SoundBank.xml` and 16-bit WAV sources. An instrument combines raw samples with tuning, loop information, and press/release envelopes. Sound effects, BGM, and ambient sounds refer to that instrument through its WAV name. This guide will show how to add samples to an existing permanent bank.

## Choose the Bank

Editable banks live under `$mod/audio/bank/`. Each bank directory contains `SoundBank.xml` and its WAV files. A BK (bank) file holds at most sixteen instruments. Choose a bank with a free slot and an appropriate loading condition. Append your instrument to the end of the bank to preserve the indices of every instrument already within it.

### Bank Loading

The engine divides sound banks into always-loaded and on-demand groups:

| Bank type | Assignment | Availability |
| --- | --- | --- |
| Always-loaded (permanent) | Groups `2` through `6` in `$mod/audio/Banks.xml` | Loaded when the audio engine starts and retained until it is restarted. Use these for sound effects and instruments which must be available throughout the game. |
| On-demand (auxiliary) | `bk1`, `bk2`, and `bk3` on a song in `$mod/audio/Songs.xml` | Loaded when that song is loaded. Each assignment replaces the previous bank in that auxiliary slot. Radio ambience also uses an auxiliary slot for its bank. |

`Banks.xml` contains only the always-loaded assignments. A BK file named only by `Songs.xml` is loaded into an auxiliary slot instead; it does not also need an entry in `Banks.xml`.

Sound effects use the same instrument-address format as the other audio players, but they do not control which auxiliary banks are loaded. A sound effect which uses an auxiliary bank will therefore work only while that particular bank occupies the expected slot. Star Rod also resolves SFX `wav` names from `Banks.xml`, not the song-specific assignments in `Songs.xml`. Use a bank in groups `2` through `6` for a sound effect which may play anywhere.

For this example, `SYS2` is a permanent bank and has unused instrument slots in the original game:

```text
$mod/audio/bank/SYS2/
```

### Adding a Bank

Star Rod can build additional BK files. Create another directory under `$mod/audio/bank/` containing a `SoundBank.xml` and its WAV files. The directory name becomes the bank filename and may contain no more than four characters.

The new bank must also be assigned to a runtime slot. Star Rod discovers the compiled BK file and adds it to the SBN automatically, but this does not enlarge the engine's bank groups.

Star Rod expands group `6` to hold sixteen banks. The available positions are:

| Group | Allocated indices | Used indices | Available indices |
| --- | --- | --- | --- |
| `2` | `0`–`F` | `0`–`D` | `E`, `F` |
| `3` | `0`–`F` | `0`–`F` | None |
| `4` | `0`–`F` | `0`–`F` | None |
| `5` | `0`–`F` | `0`–`F` | None |
| `6` | `0`–`F` | `0`, `1` | `2`–`F` |

Add an always-loaded bank to one of these positions in `Banks.xml`. Prefer group `6` for new banks, leaving the established groups undisturbed.

The engine's INIT loader accepts at most 79 always-loaded banks. The original game uses 64, so a project may add up to fifteen. Filling all fourteen available positions in group `6` leaves room for one more bank at either group `2`, index `E` or group `2`, index `F`.

For an on-demand bank, do not add an entry to `Banks.xml`. Assign its filename to `bk1`, `bk2`, or `bk3` on each song which uses it.

Only groups `2` through `6` are valid in `Banks.xml`. The instrument-address selectors used for auxiliary banks are not additional bank-list groups. Adding another group or more than the three song-loaded auxiliary slots would require engine changes.

## Prepare the WAV

Export the sample as a mono, signed 16-bit PCM WAV file named:

```text
TutorialBell.wav
```

Place it directly in the selected bank directory. Star Rod does not support stereo, floating-point, or other WAV sample formats.

Paper Mario mixes its audio at approximately 32 kHz. Samples at other rates are resampled during playback; they do not change the game's output rate. Choose a source rate according to the material:

| Sample rate | Use |
| --- | --- |
| 32,000 Hz | The normal high-quality choice. It preserves the full bandwidth of the game's audio output. |
| 22,050 or 16,000 Hz | Suitable for material which does not need as much high-frequency detail. Lower rates also reduce the size of the encoded sample. |
| 44,100 or 48,000 Hz | Supported, but usually provide no benefit after conversion to the game's output rate. They consume more space and leave less range for pitching the sample upward. |

A 48 kHz source can be raised by only about five semitones before reaching the engine's resampling limit. Use 32 kHz unless the source has a particular reason to retain a higher rate. Remove unnecessary silence regardless of the chosen rate; the N64 audio pipeline compresses the sample, but long samples still increase ROM size.

Use a unique filename stem across the project. Audio sources refer to `TutorialBell`, and duplicate WAV names in different banks are ambiguous to Star Rod.

## Add the Instrument

Open the bank's `SoundBank.xml` and append an `Instrument` inside its `Instruments` list:

```xml
<Instruments>
    <!-- existing instruments -->
    <Instrument wav="TutorialBell" envName="env1" keyBase="4800"/>
</Instruments>
```

The `wav` value omits the extension. `envName` must name an envelope later in the same `SoundBank.xml`. Reuse an existing envelope for the first build; `env1` in `SYS2` is a simple one-shot envelope.

`keyBase` identifies the pitch which plays the sample without musical transposition. It is written in cents: pitch `48` is `4800`, while pitch `60` is `6000`. Fine adjustments may also be included, so `6005` is pitch `60` plus five cents.

One-shot sound effects use pitch `48` by default, so `keyBase="4800"` preserves the recorded pitch of an ordinary one-shot sample. For a sample intended to play pitched notes, use its actual root pitch multiplied by 100 and adjust it by ear in Audio Booth if necessary. Star Rod reads the sample rate from the WAV separately; do not compensate for the sample rate with `keyBase`. Embedded root-note metadata in the WAV is not used.

Do not insert the new instrument before an existing entry. The position within `Instruments` is its instrument index, and changing an established index changes the meaning of existing bank and patch references.

## Add a Loop

A looping instrument uses separate attack and loop WAV files:

```xml
<Instrument wav="TutorialWind" loop="TutorialWind_Loop" envName="env2" keyBase="4800"/>
```

This expects `TutorialWind.wav` followed by `TutorialWind_Loop.wav`. Both files must use the same sample rate. The loop file repeats indefinitely unless `loopCount` is supplied.

Embedded WAV loop metadata is not used by this source format. Split and trim the two files so that the transition into the loop and the loop boundary are clean before building.

## Preview the Instrument

Open **Audio Booth → Samples**, choose the bank, and select `TutorialBell`. Audio Booth shows the sample rate, key base, envelope variants, and whether the instrument loops. Use the pitch control to check tuning and **Release** to hear the selected release envelope.

After changing the WAV or `SoundBank.xml`, choose **Selected → Reload**. Fix clicks, excess silence, level problems, and tuning at the source before introducing the instrument into a longer effect or song.

## Build the Sound Bank

Enable **Build Sound Banks** and compile the mod. Star Rod rebuilds the BK file, drum definitions, and global instrument presets, then injects the resulting audio files. It also raises the configured audio heap when the rebuilt permanent-bank data requires more room.

If you also changed editable BGM, MSEQ, or SFX sources, enable **Inject Audio Files** for that build as well. **Build Sound Banks** rebuilds the instruments, but it does not compile a changed `SoundEffects.xml` by itself.

The rebuilt BK appears under `audio/build/`; that file is generated output. Retain the WAV and `SoundBank.xml` under `audio/bank/` as the project source.

## Use the Instrument

A one-shot sound effect can select the new instrument directly:

```xml
<OneShot wav="TutorialBell" volume="70"/>
```

A sequenced sound effect uses:

```xml
<SetInstrument wav="TutorialBell"/>
```

BGM and MSEQ sources also resolve authored WAV names, but the bank must be loaded in their playback context. Always-loaded banks are available without a song-specific assignment; an auxiliary bank must be loaded by the corresponding song or ambient data.

See [Adding a Sound Effect](adding-a-sound-effect.md) for assigning an empty sound ID and calling it from a script.
