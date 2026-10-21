import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";
import Markdoc from "@markdoc/markdoc";
import shiki from "@astrojs/markdoc/shiki";
import { transformerNotationDiff } from "@shikijs/transformers";
import {
  symbolAutoLinks,
  symbolAutoLinkTransformer,
  inlayHintTransformer,
} from "./scripts/markdoc-symbol-links.mjs";

export default defineMarkdocConfig({
  extends: [
    shiki({
      theme: "catppuccin-mocha",
      wrap: true,
      transformers: [
        transformerNotationDiff(),
        symbolAutoLinkTransformer(),
        inlayHintTransformer(),
      ],
    }),
    symbolAutoLinks(),
  ],
  nodes: {
    // Markdoc's list doesn't wait for its items, so a code block in a list item,
    // which Shiki highlights asynchronously, would leave the list with no children.
    list: {
      ...Markdoc.nodes.list,
      async transform(node, config) {
        return new Markdoc.Tag(
          node.attributes.ordered ? "ol" : "ul",
          node.transformAttributes(config),
          await node.transformChildren(config),
        );
      },
    },
  },
  tags: {
    apiitem: {
      render: component("./src/components/ApiItem.astro"),
      attributes: {
        heading: { type: String, required: true },
        source: { type: String, required: false },
      },
    },
    aside: {
      render: component("@astrojs/starlight/components", "Aside"),
      attributes: {
        type: { type: String },
      },
    },
    cardgrid: {
      render: component("@astrojs/starlight/components", "CardGrid"),
    },
    linkcard: {
      render: component("@astrojs/starlight/components", "LinkCard"),
      attributes: {
        title: { type: String },
        href: { type: String },
        description: { type: String, required: false },
      },
    },
    steps: {
      render: component("@astrojs/starlight/components", "Steps"),
    },
    tabs: {
      render: component("@astrojs/starlight/components", "Tabs"),
    },
    tabitem: {
      render: component("@astrojs/starlight/components", "TabItem"),
      attributes: {
        label: { type: String, required: true },
      },
    },
    filetree: {
      render: component("@astrojs/starlight/components", "FileTree"),
    },
  },
});
