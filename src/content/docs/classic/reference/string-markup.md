---
title: String Markup
sidebar:
  label: String Markup
---
Tags are case-insensitive. This reference uses the named-argument syntax accepted by Star Rod. The older colon syntax is also accepted where a tag consists of positional byte arguments. Numbers in colon-style tags are hexadecimal; numbers in named-argument tags are decimal unless prefixed with `0x`.

Ordinary source newlines are ignored. Use `[BR]` for a visible line break.

## Special Characters

| Type | Characters |
| --- | --- |
| Colored button icons | `[A] [B] [L] [R] [Z] [C-UP] [C-DOWN] [C-LEFT] [C-RIGHT] [START]` |
| Uncolored button glyphs | `[~A] [~B] [~L] [~R] [~Z] [~C-UP] [~C-DOWN] [~C-LEFT] [~C-RIGHT] [~START]` |
| Solid arrows | `[UP] [DOWN] [LEFT] [RIGHT]` |
| Miscellaneous shapes | `[NOTE] [HEART] [STAR] [CIRCLE] [CROSS]` |

The characters `%`, `[`, `]`, `{`, and `}` have special meaning in source files. Escape them as `\%`, `\[`, `\]`, `\{`, and `\}` when they should appear as text.

## Control Tags

| Tag | Description |
| --- | --- |
| `[BR]` | Start a new line. |
| `[Wait]` | Wait for the player to press A. |
| `[Pause 20]` | Pause printing for a fixed time. |
| `[Next]` | Advance to the next page. |
| `[Style Right]` | Select the message-box style; normally the first tag. |
| `[Yield]` | End this part without closing the box so the script may continue the conversation. |
| `[End]` | Terminate the message; required for every complete message. |

## Message-Box Styles

| Style | Description |
| --- | --- |
| `Right` | Standard NPC bubble connected from the right. |
| `Left` | Standard NPC bubble connected from the left. |
| `Center` | Standard NPC bubble connected from the center. |
| `Tattle` | Adaptive bubble used for Goombario's map tattles. |
| `Choice` | Choice box with custom position and size: `[Style Choice pos=96,112 size=128,62]`. |
| `Inspect` | Gray box with a scrolling background. |
| `Sign` | Wooden sign. |
| `Lamppost` | Metallic sign: `[Style Lamppost height=72]`. |
| `Postcard` | Postcard on the lower half of the screen: `[Style Postcard index=0]`. |
| `Popup` | Small, automatically sized popup in the center. |
| `STYLE_B` | Unnamed engine style `0B`; sized similarly to `Popup`. |
| `Upgrade` | Upgrade-block box with the same position and size arguments as `Choice`. |
| `Narrate` | Centered announcement such as “You got an item!” |
| `Epilogue` | Silent centered text without a box, used for chapter epilogues. |
| `STYLE_F` | Unnamed engine style `0F`; sized similarly to `Inspect` or `Narrate`. |

## Text Formatting

| Tag | Description |
| --- | --- |
| `[Font Normal]` | Select `Normal`, `Menu`, `Title`, or `Subtitle`. Credits fonts have limited character sets. |
| `[Variant 0]` | Select font variant 0 through 3. |
| `[Color 16]` | Set the text-color palette index. |
| `[SaveColor]` / `[RestoreColor]` | Save and restore one color; this is not a stack. |
| `[Spacing 8]` | Force every character to the given width. Zero restores normal spacing. |
| `[Size 20,20]` | Set horizontal and vertical scale. One value sets both. Default is 16,16. |
| `[SizeReset]` | Restore the default size. |
| `[CenterX 160]` | Center following text around an X coordinate. |

## Interaction and Printing

| Tag | Description |
| --- | --- |
| `[NoSkip]` | Prevent the player from skipping the message. |
| `[InputOff]` / `[InputOn]` | Disable or enable input while printing. |
| `[DelayOff]` / `[DelayOn]` | Disable or enable the normal character delay. |
| `[Scroll 1]` | Scroll by a number of lines. |
| `[Speed delay=6 chars=3]` | Print `chars` characters after each `delay`. |
| `[Voice Bowser]` | Select `Normal`, `Bowser`, or `Star`; `Spirit` aliases `Star`. |
| `[CustomVoice soundIDs=0x141,0x142]` | Supply two custom printing-voice sound IDs. |
| `[Volume percent=50]` | Set voice volume; a raw value from 0 through 255 may be used instead. |
| `[EnableCDownNext]` | Allow C-Down to advance to the next page. |
| `[RewindOn]` / `[RewindOff]` | Enable or disable message rewind state. |

## Printing Position

| Tag | Description |
| --- | --- |
| `[SetPos 80,32]` | Set X and Y. X may be 0–320; Y may be -255–255. |
| `[SetPosX 80]` | Set the X position. |
| `[SetPosY 32]` | Set the Y position. |
| `[Right 8]` | Move following text right; resets on a new line. |
| `[Down 8]` / `[Up 8]` | Move following text vertically. |
| `[SavePos]` / `[RestorePos]` | Save and restore one position; this is not a stack. |

## Choices

| Tag | Description |
| --- | --- |
| `[StartChoice]` | Start a choice list and disable normal printing delay. |
| `[Option 0]` | Begin an option and place its cursor in a smart choice. |
| `[EndChoice cancel=1]` | Finish a smart choice; optional `cancel` is returned when B is pressed. |
| `[Cursor 0]` | Place the hand cursor for an old-style choice. |
| `[SetCancel 1]` | Set the B-button result for an old-style choice. |

Choice indices range from 0 through 5. Prefer `StartChoice` and `EndChoice`; Star Rod supplies bookkeeping which older messages had to write by hand.

## Images, Items, and Sprites

| Tag | Description |
| --- | --- |
| `[ItemIcon itemName=Mushroom]` | Draw an item icon by name. `itemID=0x80` may be used instead. |
| `[InlineImage index=0]` | Draw one of four message images at the current print position. |
| `[Image index=0 pos=85,97 hasBorder=1 alpha=255 fadeAmount=15]` | Draw a message image at a fixed position. |
| `[HideImage fadeAmount=15]` | Hide the current message image; zero hides immediately. |
| `[AnimSprite spriteID=0x17 raster=0]` | Draw one sprite raster. |
| `[Animation spriteID=0x17 rasterIDs=0,1,2 delays=4,4,8]` | Build a looping sprite animation; each raster requires a delay. |

Image tags use the list most recently supplied to `SetMessageImages`; they do not load image data themselves.

## Text Effects

Effects are paired. A named closing tag closes that effect, while `[/fx]` closes the most recently opened effect:

```star-rod
[Wave]This text moves in a wave.[/Wave]
[Rainbow][SizeWave]Two effects at once![/fx][/fx]
```

| Effect | Description |
| --- | --- |
| `Shake` | Move characters randomly. |
| `Wave` | Move individual characters in a wave. |
| `NoiseOutline` | Draw a noisy outline. |
| `Static` | Blend static into the text: `[Static percent=50]`. |
| `Blur` | Blur along `x`, `y`, or both: `[Blur dir=xy]`. |
| `Rainbow` | Cycle individual character colors. |
| `DitherFade` | Dither toward transparency: `[DitherFade percent=50]`. |
| `GlobalWave` | Apply a wave to the line as a whole. |
| `GlobalRainbow` | Apply a rainbow across the message as a whole. |
| `PrintRising` | Print characters small and let them rise into place. |
| `PrintGrowing` | Print characters small and grow them into place. |
| `SizeJitter` | Randomly vary character size. |
| `SizeWave` | Vary character size in a wave. |
| `DropShadow` | Add a shadow behind the text. |

See [Adding and Modifying Messages](../guides/adding-messages.md) for examples of complete messages.
