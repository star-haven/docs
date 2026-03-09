#ifndef _OS_H_
#define _OS_H_

#include <PR/ultratypes.h>

typedef struct { int dummy; } OSMesgQueue;
typedef void* OSMesg;
typedef struct { int dummy; } OSThread;
typedef struct { int dummy; } OSTask;
typedef struct { int dummy; } OSIoMesg;
typedef struct { int dummy; } OSContPad;
typedef struct { int dummy; } OSContStatus;
typedef u64 OSTime;
typedef s32 OSPri;
typedef s32 OSId;

#endif
