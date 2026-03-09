#ifndef _GBI_H_
#define _GBI_H_

#include <PR/ultratypes.h>

typedef struct { s64 force_structure_alignment; } Gfx;
typedef struct { float m[4][4]; } Mtx;
typedef struct { float m[4][4]; } MtxF;
typedef struct { s16 ob[3]; u16 tc[2]; s8 n[3]; u8 a; } Vtx_t;
typedef struct { s16 ob[3]; u16 flag; s16 tc[2]; u8 cn[4]; } Vtx_tn;
typedef union { Vtx_t v; Vtx_tn n; } Vtx;
typedef struct { int dummy; } Hilite;
typedef struct { int dummy; } LookAt;
typedef struct { int dummy; } Light;
typedef struct { int dummy; } LightRc;
typedef struct { int dummy; } Ambient;
typedef struct { int dummy; } Lights0;
typedef struct { int dummy; } Lights1;
typedef struct { int dummy; } Lights2;
typedef u32 Texture;
typedef struct { s16 vscale[4]; s16 vtrans[4]; } Vp_t;
typedef union { Vp_t vp; } Vp;

#endif
