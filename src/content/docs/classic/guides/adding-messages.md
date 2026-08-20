---
title: Adding and Modifying Messages
sidebar:
  label: Adding and Modifying Messages
---
Paper Mario calls these resources messages, while Star Rod Classic calls them strings. String sources live under `$mod/strings/src/`. Files which add or replace project messages belong under `$mod/strings/patch/`.

The contents of a string may be indented with tabs. Do not indent them with spaces: leading spaces are encoded as part of the message and will appear in-game.

## Replace a Message

To replace message `001C0002`, the Paragoomba tattle, create `$mod/strings/patch/example.str` containing:

```star-rod
#string:1C:02 {
	[Style Right]
	New Paragoomba tattle![Wait][End]
}
```

The first value is the section and the second is the message ID. Build the mod and check every place where the original message appears.

## Add a Named Message

Section `2F` is reserved for custom project strings. A name in parentheses lets Star Rod assign the next available message ID:

```star-rod
#string:2F:(MyStringName) {
	[Style Right]
	This string has a useful name.[Wait][End]
}
```

Refer to it from a patch or script as `~String:MyStringName`.

## Add a Local Message

A message used by only one patch may be declared directly in that patch:

```star-rod
#string $MyExampleString {
	[Style Right]
	This is an embedded string.[Wait][End]
}

#new:Script $ShowExample {
    Call SpeakToPlayer ( .Npc:Self 00000000 00000000 00000000 $MyExampleString )
    Return
    End
}
```

## Insert a Variable

The engine has three message-variable buffers, referenced by `[Var 0]` through `[Var 2]`. Set the buffer before displaying the message:

| Value | Script call |
| --- | --- |
| Integer | `Call SetMessageValue ( value variableIndex )` |
| Message text | `Call SetMessageString ( string variableIndex )` |

```star-rod
#string $CoinMessage {
	[Style Narrate]
	You got [Var 0] coins![Wait][End]
}

#new:Script $ShowCoinMessage {
    Call SetMessageValue ( *Var0 0 )
    Call SpeakToPlayer ( .Npc:Self 00000000 00000000 00000000 $CoinMessage )
    Return
    End
}
```

Each buffer holds at most 31 encoded characters plus its terminator. `SetMessageString` accepts either a message ID or a pointer to encoded message data.

## Present a Choice

A choice normally uses one message for the question and another for its options. End the question with `[Yield]` so the script can continue without closing the box:

```star-rod
#string $TrialQuestion {
	[Style Right]
	Are you ready for a trial?[Yield][End]
}

#string $TrialChoices {
	[Style Choice pos=96,112 size=128,62][StartChoice]
	[Option 0]Yes[BR]
	[Option 1]No[BR]
	[Option 2]Tell me more
	[EndChoice cancel=1][End]
}
```

Display the question normally, then call `ShowChoice` with the options message. The selected option is returned in `*Var0`. Use `ContinueSpeech` with a response beginning with `[Next]` when you want to keep using the same message box.

```star-rod
#string $TrialReady {
	[Next]
	Then let us begin![Wait][End]
}

#string $TrialLater {
	[Next]
	Come back when you are ready.[Wait][End]
}

#string $TrialMore {
	[Next]
	The trial has three rounds.[Wait][End]
}

#new:Script $AskAboutTrial {
    Call SpeakToPlayer ( .Npc:Self 00000000 00000000 00000000 $TrialQuestion )
    Call ShowChoice ( $TrialChoices )
    Switch *Var0
        Case == 0
            Call ContinueSpeech ( .Npc:Self 00000000 00000000 00000000 $TrialReady )
        Case == 1
            Call ContinueSpeech ( .Npc:Self 00000000 00000000 00000000 $TrialLater )
        Case == 2
            Call ContinueSpeech ( .Npc:Self 00000000 00000000 00000000 $TrialMore )
    EndSwitch
    Return
    End
}
```

## Display an Image

Message image tags use an array of `MessageImageData` entries. Each entry is five words: raster pointer, palette pointer, packed width and height, image format, and bit depth. Install the list with `SetMessageImages` before displaying the message:

```star-rod
#new:IntTable $ImageList {
    $ImageRaster $ImagePalette 00200020 00000002 00000000
}

#new:IntTable $ImageRaster {
    ~RasterFile:CI-4:example.png
}

#new:IntTable $ImagePalette {
    ~PaletteFile:CI-4:example.png
}

#string $ShowImageString {
	[Style Right]
	[Image index=0 pos=85,97 hasBorder=1 alpha=255 fadeAmount=15]
	Look at this![Wait][End]
}

#new:Script $ShowImage {
    Call SetMessageImages ( $ImageList )
    Call SpeakToPlayer ( .Npc:Self 00000000 00000000 00000000 $ShowImageString )
    Return
    End
}
```

Raster and palette files referenced by these expressions are loaded from `$mod/res/`. See [String Markup](../reference/string-markup.md) for the commonly used message tags.
