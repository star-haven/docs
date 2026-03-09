{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    papermario-dx = {
      url = "github:bates64/papermario-dx";
      flake = false;
    };
  };

  outputs =
    { nixpkgs, papermario-dx, ... }:
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
            npmDepsHash = "sha256-oC22xf6IC/2nNIdzTTB0Lb1ACPl7GOM0AWrZjmd6Clc=";
            nativeBuildInputs = [ pkgs.llvmPackages.clang ];
            PAPERMARIO_DX_SRC = papermario-dx;
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
            '';
          };
        }
      );
    };
}
