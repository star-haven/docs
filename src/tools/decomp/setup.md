# Setting up decomp

## Requirements

* A valid Paper Mario US v1.0 ROM (There are a variety of tools you can use to dump a backup from your own cartridge. Please ensure your cartridge matches the required version.)
  * MD5-Checksum (.z64): `a722f8161ff489943191330bf8416496`
  * If you do have a clean NTSC-U ROM, but it is in the .n64 or .v64 format, use the following website to fix your ROM: <https://hack64.net/tools/swapper.php>
* A UNIX operating system like Linux or macOS. **Windows users should read the [Windows](./setup_windows.md) page.**

## Installation

This guide will walk through setting up [papermario-dx](https://github.com/nanaian/papermario-dx), a fork of [papermario](https://github.com/pmret/papermario) which makes modding easier and provides a better developer experience. If you would prefer to not use dx, simply clone the papermario repository instead.

Clone the repository:
```sh
git clone https://github.com/nanaian/papermario-dx
cd papermario-dx
```

Install pigment64 (our image-processing tool)
```sh
curl https://sh.rustup.rs -sSf | sh
cargo install pigment64
```
and make sure pigment64 is in your system path.

Install build dependencies:
```sh
./install_deps.sh
./install_compilers.sh
```

> **NOTE:** On Mac, if you get an error that looks like
>
>```sh
>Error: Cannot install md5sha1sum because conflicting formulae are installed.
>  coreutils: because both install `md5sum` and `sha1sum` binaries
>
>Please `brew unlink coreutils` before continuing.
>```
>
>it's fine to just open `install_deps.sh` in a text editor, delete the `md5sha1sum` from the `brew install` line, and rerun it (put it back after so you don't accidentally commit it!)

Copy baserom into the following place:

* `ver/us/baserom.z64` (sha1: `3837f44cda784b466c9a2d99df70d77c322b97a0`)

(If you're using WSL, you can enter the Linux filesystem by opening `\\wsl$` in File Explorer; e.g. `\\wsl$\Ubuntu\home\<your username>\papermario-dx`.)

Configure the build and extract assets from the base ROM:
```sh
./configure
```

Compile the game:
```
ninja
```

The output ROM is `ver/us/build/papermario.z64` - you can run this in any N64 emulator.

Alternatively, to compile _and_ run, you can use the `run` script:
```sh
./run
```
(This will search known paths for an emulator. If your emulator isn't listed, add it to the list and contribute!)

If you have Visual Studio Code, you can type `code .` to open the repo within it.

You can now begin modding.
