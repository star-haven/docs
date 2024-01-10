# Improving build times

## Ccache

[Ccache][ccache] speeds up recompilation by caching previous compilations.

ccache is particularly effective at improving build times after header files that are included a lot are modified. For instance, it significantly speeds up builds after message files (`*.msg`) are modified because they generate `message_ids.h`, which is included in many places.

### Installing ccache

- Ubuntu and derivatives: `sudo apt install -y ccache`
- macOS: `brew install ccache`

### Using ccache

If you have ccache available on your PATH, `./configure` will automatically use it.

You can confirm that ccache is working correctly by executing `ccache -s` after a build and inspecting the number of cache hits.

## Build without debug symbols

Building without debug symbols can significantly speed up linking depending on your CPU's single-core performance.

To disable compiling debug symbols:

```
./configure --no-debug
```

Although the link time is better, this has numerous side effects:

- Crash backtraces will no longer include location information; they will just show addresses.
- The size of the symbol information data appended to ROM is also made much smaller.
- [gdb](gdb.md) becomes much less useful.

[ccache]: https://ccache.dev/
