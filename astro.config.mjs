import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import markdoc from "@astrojs/markdoc";
import sidebar from "starlight-auto-sidebar";
import llmsTxt from "starlight-llms-txt";

export default defineConfig({
  site: "https://docs.starhaven.dev",
  integrations: [
    starlight({
      title: "Star Haven Documentation",
      description:
        "Documentation for Paper Mario (N64) modding with Paper Mario DX and Star Rod",
      favicon: "/favicon.ico",
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/pwhSQbH",
        },
        {
          icon: "seti:git",
          label: "Source Code",
          href: "https://github.com/star-haven/docs",
        },
      ],
      sidebar: [
        {
          label: "Playing Mods",
          link: "/play",
        },
        {
          label: "Developing Mods",
          autogenerate: { directory: "develop" },
        },
        {
          label: "Star Rod Classic",
          collapsed: true,
          badge: { variant: "caution", text: "Legacy" },
          autogenerate: { directory: "classic" },
        },
      ],
      plugins: [sidebar()],
    }),
    markdoc({ allowHTML: true }),
    llmsTxt({
      exclude: "develop/classic/**",
    }),
  ],
});
