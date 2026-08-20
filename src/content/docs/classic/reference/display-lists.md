---
title: F3DEX2 Display Lists
sidebar:
  label: F3DEX2 Display Lists
---
Paper Mario uses F3DEX2 display lists to submit geometry and rendering state to the Nintendo 64's Reality Signal Processor and Reality Display Processor. Star Rod represents these lists as `DisplayList` structures in patch files.

```star-rod
#new:DisplayList $ExampleDisplayList
{
    G_GEOMETRYMODE (Set, G_ZBUFFER, G_SHADE, G_SHADING_SMOOTH)
    G_VTX          ($ExampleVertices, 4`, 0`)
    G_TRI2         (0`, 1`, 2`, 0`, 2`, 3`)
    G_ENDDL
}
```

Each line is one display-list command. Command names are case-insensitive. Arguments are separated by commas, and integer arguments use the ordinary [patch notation](notation.md). Most commands occupy eight bytes. `G_BRANCH_Z` and `G_LOAD_UCODE` occupy sixteen bytes, while `G_TEXRECT` and `G_TEXRECTFLIP` occupy 24 bytes.

A display list changes persistent rendering state as it executes. A list which changes the cycle type, combiner, render mode, geometry mode, texture state, or colors should establish every state on which it depends. Do not assume the previous list left the renderer in a particular state.

## Raw Commands

Classic also recognizes a raw two-word form for commands without a structured binding and for some eight-byte commands:

```star-rod
G_SETTILE [000000, 07000000]
```

The command name supplies the high byte of the first word, so the first value contains only its lower 24 bits. Raw syntax is useful when preserving a dumped command which has no structured form. Commands with dedicated encoders may reject raw values outside the form they understand.

`G_DMA_IO`, `G_RDPHALF_1`, `G_RDPSetOtherMode`, and `G_RDPHALF_2` have no structured form in Classic. The half commands are normally emitted as part of a larger F3DEX2 command and should not be written independently.

## Geometry Commands

The RSP has a 32-entry vertex buffer. `G_VTX` loads vertices into it, after which triangle commands refer to the loaded entries by number.

| Command | Purpose |
| --- | --- |
| `G_VTX (address, count, first)` | Load `count` vertices at `address` into the buffer beginning at `first`. `count` is 1 through 32; the loaded range must remain within the buffer. |
| `G_MODIFYVTX (vertex, field, value)` | Replace one field of a buffered vertex. The field is `G_MWO_POINT_RGBA`, `G_MWO_POINT_ST`, `G_MWO_POINT_XYSCREEN`, or `G_MWO_POINT_ZSCREEN`. |
| `G_CULLDL (first, last)` | End the current display list when every vertex in the inclusive buffer range lies outside the same clipping plane, placing their bounding volume outside the viewing volume. |
| `G_BRANCH_Z (address, vertex, z)` | Branch to another display list when the selected vertex's screen depth is less than the raw depth threshold `z`. |
| `G_TRI1 (a, b, c)` | Draw one triangle using three buffered vertices. |
| `G_TRI2 (a, b, c, d, e, f)` | Draw two triangles. |
| `G_QUAD (a, b, c, d)` | Draw a quadrilateral as the triangles `a, b, c` and `a, c, d`. |

## Display-List and Matrix Commands

| Command | Purpose |
| --- | --- |
| `G_DL (CALL, address)` | Call another display list and return when it reaches `G_ENDDL`. |
| `G_DL (JUMP, address)` | Continue at another display list without retaining a return address. |
| `G_ENDDL` | Return from a called list, or finish the top-level list. |
| `G_MTX (address, push, operation, target)` | Apply a matrix. `push` is `PUSH` or `NO_PUSH`, `operation` is `LOAD` or `MULTIPLY`, and `target` is `MODELVIEW` or `PROJECTION`. |
| `G_POPMTX (count)` | Pop matrices from the model-view stack. |
| `G_MOVEWORD (index, offset, value)` | Write a word into RSP state. Named indexes include `G_MW_MATRIX`, `G_MW_NUMLIGHT`, `G_MW_CLIP`, `G_MW_SEGMENT`, `G_MW_FOG`, `G_MW_LIGHTCOL`, `G_MW_FORCEMTX`, and `G_MW_PERSPNORM`. |
| `G_MOVEMEM (location, offset, size, address)` | Copy memory into RSP state. Locations include `G_MV_MMTX`, `G_MV_PMTX`, `G_MV_VIEWPORT`, `G_MV_LIGHT`, `G_MV_POINT`, and `G_MV_MATRIX`. |
| `G_LOAD_UCODE (dataAddress, dataSize, textAddress)` | Load another RSP microcode program. `dataSize` is the size of its data section in bytes, from 1 through 65536. Ordinary Paper Mario display lists do not need this command. |
| `G_NOOP` | Send an RDP no-op. |
| `G_SPNOOP` | Perform an RSP no-op without sending a command to the RDP. |

## Geometry Mode

`G_GEOMETRYMODE` sets or clears one or more RSP geometry flags:

```star-rod
G_GEOMETRYMODE (Set, G_ZBUFFER, G_SHADE, G_SHADING_SMOOTH)
G_GEOMETRYMODE (Clear, G_CULL_BACK)
G_GEOMETRYMODE (Clear, ALL)
G_GEOMETRYMODE (Clear, G_FOG, Set, G_LIGHTING)
```

The final form clears and sets flags with a single F3DEX2 command.

| Flag | Effect |
| --- | --- |
| `G_ZBUFFER` | Include depth values in the triangle data sent to the RDP. `Z_CMP` and `Z_UPD` in the RDP render mode control depth comparison and depth-buffer updates. |
| `G_SHADE` | Use vertex colors or lighting results. |
| `G_CULL_FRONT` | Cull front-facing triangles. |
| `G_CULL_BACK` | Cull back-facing triangles. |
| `G_FOG` | Write the calculated fog factor to vertex alpha. The combiner and blender must also be configured to produce visible fog. |
| `G_LIGHTING` | Calculate vertex colors from normals and lights. |
| `G_TEXTURE_GEN` | Generate texture coordinates from normals. |
| `G_TEXTURE_GEN_LINEAR` | Use linear texture-coordinate generation. |
| `G_LOD` | Reserved by the SDK but not implemented by F3DEX2. This flag has no effect; texture LOD is controlled by the RDP other modes. |
| `G_SHADING_SMOOTH` | Interpolate shade values across triangles when `G_SHADE` is enabled. |
| `G_CLIPPING` | Accepted by Classic, but not a functional F3DEX2 toggle. Clipping behavior is fixed by the microcode. |

## Texture Commands

Tile descriptor `0` may be written as `G_TX_RENDERTILE`; descriptor `7` may be written as `G_TX_LOADTILE`. Image formats recognized by display-list commands are `I-4`, `I-8`, `IA-4`, `IA-8`, `IA-16`, `CI-4`, `CI-8`, `YUV-16`, `RGBA-16`, and `RGBA-32`. Star Rod's texture-editing tools do not support YUV textures.

| Command | Purpose |
| --- | --- |
| `G_TEXTURE (tile, scaleS, scaleT, levels, enabled)` | Enable or disable texturing and set its scale and tile. `levels` is the number of additional mipmap levels, from 0 through 7; `enabled` is `true` or `false`. |
| `G_SETIMG (format, width, address)` | Select the source texture image. The alternate numeric form is `G_SETIMG (type, depth, width, address)`. |
| `G_SETTILE (tile, format, line, tmem, palette, cmT, maskT, shiftT, cmS, maskS, shiftS)` | Configure a tile descriptor. The alternate numeric form supplies `type, depth` in place of `format`. |
| `G_SETTILESIZE (tile, startS, startT, width, height)` | Set a tile's texture-coordinate bounds. |
| `G_LOADBLOCK (tile, ulS, ulT, texels, dxt)` | Load a continuous block into texture memory. |
| `G_LOADTILE (tile, ulS, ulT, lrS, lrT)` | Load a rectangular portion of the source image into texture memory. |
| `G_LOADTLUT (tile, colors)` | Load a color-indexed texture palette into texture memory. |

The `cmS` and `cmT` arguments are numeric bitfields: `0` selects wrap, `1` selects mirror and wrap, `2` selects clamp, and `3` selects mirror and clamp. A nonzero mask `n` wraps the corresponding texture coordinate every `2^n` texels. A zero mask causes implicit clamping to the tile bounds, regardless of the clamp bit.

Texture shifts from `0` through `10` shift a coordinate right by that many places. Values from `11` through `15` shift it left by `16 - shift` places.

## Rectangle and Buffer Commands

| Command | Purpose |
| --- | --- |
| `G_TEXRECT (tile, ulX, ulY, lrX, lrY, ulS, ulT, dSdX, dTdY)` | Draw a texture rectangle. |
| `G_TEXRECTFLIP (tile, ulX, ulY, lrX, lrY, ulS, ulT, dSdX, dTdY)` | Draw a texture rectangle with the S and T axes exchanged. |
| `G_FILLRECT (ulX, ulY, lrX, lrY)` | Draw a filled rectangle. |
| `G_SETSCISSOR (mode, ulX, ulY, lrX, lrY)` | Set the scissor rectangle. `mode` is `G_SC_NON_INTERLACE`, `G_SC_EVEN_INTERLACE`, or `G_SC_ODD_INTERLACE`. |
| `G_SETZIMG (address)` | Set the depth-buffer address. |
| `G_SETCIMG (format, width, address)` | Set the color image used as the framebuffer. The alternate numeric form is `G_SETCIMG (type, depth, width, address)`. |

Coordinates accepted as decimal values by the rectangle commands are converted to the fixed-point fields used by F3DEX2. The scissor command takes its encoded 10.2 fixed-point coordinate fields as integers.

## RDP State Commands

| Command | Purpose |
| --- | --- |
| `G_SETFILLCOLOR (value)` | Set the packed fill color. |
| `G_SETFOGCOLOR (r, g, b, a)` | Set the fog color. |
| `G_SETBLENDCOLOR (r, g, b, a)` | Set the blend color, including the alpha threshold used by alpha comparison. |
| `G_SETPRIMCOLOR (minLOD, fracLOD, r, g, b, a)` | Set the primitive color and LOD values. |
| `G_SETENVCOLOR (r, g, b, a)` | Set the environment color. |
| `G_SETPRIMDEPTH (z, deltaZ)` | Set the primitive depth used when the depth source is primitive. |
| `G_SETKEYGB (widthG, widthB, centerG, scaleG, centerB, scaleB)` | Set green and blue chroma-key parameters. |
| `G_SETKEYR (widthR, centerR, scaleR)` | Set red chroma-key parameters. |
| `G_SETCONVERT (k0, k1, k2, k3, k4, k5)` | Set the texture-conversion coefficients. |

Color components are integers from 0 through 255. `minLOD`, `fracLOD`, and the chroma-key widths use the decimal forms accepted by Classic. The chroma-key fields are part of the command format, but chroma keying is not supported by the Nintendo 64 RDP and does not produce a usable effect.

## Combiner

`G_SETCOMBINE` stores the color-combiner inputs for both cycles. Each cycle evaluates:

```text
(a - b) * c + d
```

The command takes the four color inputs and four alpha inputs for cycle 1, followed by the corresponding eight inputs for cycle 2:

```star-rod
G_SETCOMBINE (colorA1, colorB1, colorC1, colorD1, ...
              alphaA1, alphaB1, alphaC1, alphaD1, ...
              colorA2, colorB2, colorC2, colorD2, ...
              alphaA2, alphaB2, alphaC2, alphaD2)
```

Color selectors use the `G_CCMUX_` prefix and alpha selectors use `G_ACMUX_`. Classic accepts the selectors emitted in dumped display lists, including combined color or alpha, texels 0 and 1, primitive, shade, environment, center, scale, LOD fraction, primitive LOD fraction, noise, `K4`, `K5`, `1`, and `0`. The valid choices depend on the input position; preserve the arrangement of a mechanically similar display list when adapting a combiner.

`G_MDSFT_CYCLETYPE` determines whether the RDP executes one or two combiner cycles. `G_SETCOMBINE` does not select two-cycle mode by itself. Use the same inputs for both cycles when configuring one-cycle rendering.

## Other Modes

`G_SetOtherMode_H` changes one field in the high other-mode word. It accepts either a named field and value or a raw shift, length, and value.

| Field | Common values |
| --- | --- |
| `G_MDSFT_ALPHADITHER` | `G_AD_PATTERN`, `G_AD_NOTPATTERN`, `G_AD_NOISE`, `G_AD_DISABLE` |
| `G_MDSFT_RGBDITHER` | `G_CD_MAGICSQ`, `G_CD_BAYER`, `G_CD_NOISE`, `G_CD_DISABLE` |
| `G_MDSFT_TEXTCONV` | `G_TC_CONV`, `G_TC_FILTCONV`, `G_TC_FILT` |
| `G_MDSFT_TEXTFILT` | `G_TF_POINT`, `G_TF_BILERP`, `G_TF_AVERAGE` |
| `G_MDSFT_TEXTLUT` | `G_TT_NONE`, `G_TT_RGBA16`, `G_TT_IA16` |
| `G_MDSFT_TEXTLOD` | `G_TL_TILE`, `G_TL_LOD` |
| `G_MDSFT_TEXTDETAIL` | `G_TD_CLAMP`, `G_TD_SHARPEN`, `G_TD_DETAIL` |
| `G_MDSFT_CYCLETYPE` | `G_CYC_1CYCLE`, `G_CYC_2CYCLE`, `G_CYC_COPY`, `G_CYC_FILL` |
| `G_MDSFT_PIPELINE` | `G_PM_NPRIMITIVE`, `G_PM_1PRIMITIVE` |

`G_MDSFT_COMBKEY`, `G_MDSFT_TEXTPERSP`, and the raw three-argument form are also accepted.

`G_SetOtherMode_L` accepts `G_MDSFT_ALPHACOMPARE`, `G_MDSFT_ZSRCSEL`, or a raw shift, length, and value. Its render-mode form names the individual flags and blender inputs:

```star-rod
G_SetOtherMode_L (G_MDSFT_RENDERMODE, ...
                  AA_EN, Z_CMP, IM_RD, CVG_DST_WRAP, FORCE_BL, ZMODE_INTER, ...
                  G_BL_CLR_IN, G_BL_A_IN, G_BL_CLR_MEM, G_BL_1MA, ...
                  G_BL_CLR_IN, G_BL_A_IN, G_BL_CLR_MEM, G_BL_1MA)
```

Render-mode flags are `AA_EN`, `Z_CMP`, `Z_UPD`, `IM_RD`, `CLR_ON_CVG`, `CVG_X_ALPHA`, `ALPHA_CVG_SEL`, and `FORCE_BL`. Coverage modes are `CVG_DST_CLAMP`, `CVG_DST_WRAP`, `CVG_DST_FULL`, and `CVG_DST_SAVE`. Depth modes are `ZMODE_OPA`, `ZMODE_INTER`, `ZMODE_XLU`, and `ZMODE_DEC`.

The blender's color input is `G_BL_CLR_IN`, `G_BL_CLR_MEM`, `G_BL_CLR_BL`, or `G_BL_CLR_FOG`. Its alpha input is `G_BL_A_IN`, `G_BL_A_FOG`, `G_BL_A_SHADE`, or `G_BL_0`. Its second multiplier is `G_BL_1MA`, `G_BL_A_MEM`, `G_BL_1`, or `G_BL_0`.

See [Map Render Modes](map-render-modes.md) for the predefined render modes used by map models.

## Synchronization Commands

| Command | Purpose |
| --- | --- |
| `G_RDPLOADSYNC` | Wait for a preceding texture load to finish before starting another load. |
| `G_RDPPIPESYNC` | Wait until earlier primitives no longer depend on RDP state which is about to change. |
| `G_RDPTILESYNC` | Wait until a tile descriptor is no longer in use before changing it. |
| `G_RDPFULLSYNC` | Wait for all preceding RDP work and signal completion to the CPU. |

Synchronization commands are not interchangeable. Preserve the synchronization around state and texture setup when adapting existing display lists.
