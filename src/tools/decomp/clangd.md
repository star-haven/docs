# Using clangd for language server features

[clangd](https://clangd.llvm.org/) is a *language server* that can work with many editors.
It adds smart features to your editor: code completion, compile errors, go-to-definition and more.

## clangd setup

To use clangd, you need to generate a `compile_commands.json` file. In the root of your Paper Mario directory, run this command:
`ninja -t compdb > compile_commands.json`

If you move the source directory, `compile_commands.json` will need to be regenerated. This is because it requires hardcoded, not relative, paths to work.

## Editor setup

See your editor's documentation for more details. Search "(your editor) lsp" to get started.
