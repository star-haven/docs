#ifndef _ABI_H_
#define _ABI_H_

#include <PR/ultratypes.h>

#define ADPCMFSIZE 16
typedef short ADPCM_STATE[ADPCMFSIZE];
typedef short POLEF_STATE[4];
typedef short RESAMPLE_STATE[16];
typedef short ENVMIX_STATE[40];
typedef struct { int dummy; } Acmd;
typedef struct { int dummy; } ALRawLoop;

#endif
