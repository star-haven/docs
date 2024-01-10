# Improving build times

## Avoid ld 2.40 and 2.41

Recent versions of GNU binutils link papermario very slowly:

| ld   | debug? | link time |
| ---- |:------:| ---------:|
| 2.37 | no     | 4.06s     |
| 2.37 | yes    | 20.26s    |
| 2.41 | no     | 28.24s    |
| 2.41 | yes    | 35.26s    |

You can check your ld version with `mips-linux-gnu-ld --version`.

## Use a better CPU

The multi-core performance of your CPU (e.g. number of threads) has a large impact on build times. The single-core performance of your CPU also has a large impact on link times.

## Use a faster disk

The speed of your disk has a large impact on build times. SSDs are much faster than HDDs.

If you are using WSL (Windows), avoid working in the `/mnt/` and instead work in the actual WSL filesystem (e.g. `/home/`). There is a large performance penalty for accessing files in `/mnt/`.

### Use a ramdisk

If you have enough RAM, you can create a ramdisk for your build directory (`ver/us/build`). [More...](https://heyjdp.github.io/2022/01/ramdisk-tmpfs-for-macos/#how-do-we-make-a-ram-disk-on-unix)

## Ccache

[Ccache][ccache] speeds up recompilation by caching previous compilations.

ccache is particularly effective at improving build times after header files that are included a lot are modified. For instance, it significantly speeds up builds after message files (`*.msg`) are modified because they generate `message_ids.h`, which is included in many places.

### Installing ccache

- Ubuntu and derivatives: `sudo apt install -y ccache`
- macOS: `brew install ccache`

### Using ccache

If you have ccache available on your PATH, `./configure` will automatically use it.

You can confirm that ccache is working correctly by executing `ccache -s` after a build and inspecting the number of cache hits.

## Build without debug symbols

Building without debug symbols can significantly speed up linking depending on your CPU's single-core performance.

Make sure you are **not** using the `--debug` configure flag.

Although the link time is better, this has numerous side effects:

- Crash backtraces will no longer include location information; they will just show addresses.
- The size of the symbol information data appended to ROM is also made much smaller.
- [gdb](gdb.md) becomes much less useful.

[ccache]: https://ccache.dev/
