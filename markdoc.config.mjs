import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";

export default defineMarkdocConfig({
  extends: [
    shiki({
      theme: "catppuccin-mocha",
      wrap: true,
    }),
  ],
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
