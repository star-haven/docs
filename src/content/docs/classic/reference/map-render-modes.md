---
title: Map Render Modes
sidebar:
  label: Map Render Modes
---
The render-mode database names the following model render modes. `Surface_OPA` is the normal choice for solid geometry, the `Surface_XLU` modes are used for translucent geometry, `AlphaTest` is used for cutout textures, and the decal modes are used for coplanar surfaces. The Map Editor hides some of the special-purpose entries.

| ID | Star Rod name | Description and engine name |
| --- | --- | --- |
| 00 | `Surf_Solid_AA_ZB_Layer0` | Solid surface on layer 0. `SURF_SOLID_AA_ZB_L0` |
| 01 | `Surface_OPA` | Standard solid surface. `SURF_SOLID_AA_ZB` |
| 03 | `Surface_OPA_No_AA` | Solid surface without anti-aliasing. `SURF_SOLID_ZB` |
| 04 | `Surface_OPA_No_ZB` | Solid surface which ignores the Z-buffer. `SURF_SOLID_AA` |
| 11 | `Surface_XLU_Layer1` | Standard transparent surface, background layer. `SURF_XLU_AA_ZB_L1` |
| 16 | `Surface_XLU_Layer2` | Transparent surface, middle layer. `SURF_XLU_AA_ZB_L2` |
| 22 | `Surface_XLU_Layer3` | Transparent surface, foreground layer. `SURF_XLU_AA_ZB_L3` |
| 13 | `Surface_XLU_No_AA` | Transparent surface without anti-aliasing. `SURF_XLU_ZB` |
| 14 | `Surface_XLU_No_ZB` | Transparent surface which ignores the Z-buffer. `SURF_XLU_AA` |
| 15 | `Surf_XLU_ZB_ZUPD` | Transparent surface which updates the Z-buffer without anti-aliasing. `SURF_XLU_ZB_Z_UPD` |
| 0D | `AlphaTest` | Two-sided cutout surface. `ALPHA_TEST_AA_ZB_2SIDE` |
| 0F | `AlphaTest_OneSided` | One-sided alpha test with back-face culling. `ALPHA_TEST_AA_ZB_1SIDE` |
| 10 | `AlphaTest_No_ZB` | Alpha test without the Z-buffer. `ALPHA_TEST_AA` |
| 05 | `Decal_OPA` | Solid surface drawn over another surface at the same depth. `DECAL_SOLID_AA_ZB` |
| 07 | `Decal_OPA_No_AA` | Opaque decal without anti-aliasing. `DECAL_SOLID_ZB` |
| 1A | `Decal_XLU` | Transparent decal for coplanar models. `DECAL_XLU_AA_ZB` |
| 1C | `Decal_XLU_No_AA` | Transparent decal without anti-aliasing. `DECAL_XLU_ZB` |
| 09 | `Intersecting_OPA` | Solid intersecting surface. `INTER_SOLID_AA_ZB` |
| 26 | `Intersecting_XLU` | Transparent intersecting surface. `INTER_XLU_AA_ZB` |
| 29 | `Surf_XLU_AA_ZB_ZUPD` | Anti-aliased transparent surface which updates the Z-buffer. `SURF_XLU_AA_ZB_Z_UPD` |
| 20 | `Shadow` | Special shadow render mode. `SHADOW` |
| 2E | `Cloud` | Special cloud surface with depth testing. `SURF_CLOUD_ZB` |
| 2F | `Cloud_No_ZB` | Special cloud surface without the Z-buffer. `SURF_CLOUD` |
