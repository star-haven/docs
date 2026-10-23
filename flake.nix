{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    papermario-dx = {
      url = "git+https://knot.starhaven.dev/did:plc:dfsxnyhzxwqpmykryrjtjabz?ref=main&shallow=1";
      flake = false;
    };
    star-rod-classic = {
      url = "github:z64a/star-rod-classic";
      flake = false;
    };
  };

  outputs =
    {
      nixpkgs,
      papermario-dx,
      star-rod-classic,
      ...
    }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.buildNpmPackage {
            pname = "starhaven-docs";
            version = "0.0.0";
            src = ./.;
            npmDepsHash = "sha256-0vauL7Lt2XLAh/LLV5NKA44mZYjZjFexQZPxiOQgTWg=";
            nativeBuildInputs = [ pkgs.llvmPackages.clang ];
            PAPERMARIO_DX_SRC = papermario-dx;
            STAR_ROD_CLASSIC_SRC = star-rod-classic;
            installPhase = ''
              cp -r dist $out
            '';
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs_24
              pkgs.llvmPackages.clang
            ];
            shellHook = ''
              export PAPERMARIO_DX_SRC=''${PAPERMARIO_DX_SRC:-${papermario-dx}}
              export STAR_ROD_CLASSIC_SRC=''${STAR_ROD_CLASSIC_SRC:-${star-rod-classic}}
            '';
          };
        }
      );
    };
}
