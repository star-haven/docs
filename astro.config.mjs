import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import sidebar from "starlight-auto-sidebar";
import llmsTxt from "starlight-llms-txt";
import catppuccin from "@catppuccin/starlight";

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
      editLink: {
        baseUrl: "https://github.com/star-haven/docs/edit/main/",
      },
      components: {
        Footer: "./src/components/Footer.astro",
      },
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "script",
          content: `
            document.addEventListener('copy', (e) => {
              const sel = window.getSelection();
              if (!sel.rangeCount) return;
              const anchor = sel.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
              if (!anchor?.closest('pre')) return;
              const parts = [];
              for (let i = 0; i < sel.rangeCount; i++) {
                const frag = sel.getRangeAt(i).cloneContents();
                frag.querySelectorAll('.inlay-hint').forEach(h => h.remove());
                parts.push(frag.textContent);
              }
              const text = parts.join('');
              if (!text) return;
              e.clipboardData.setData('text/plain', text);
              e.preventDefault();
            });
          `,
        },
      ],
      plugins: [sidebar(), catppuccin({ dark: { flavor: "mocha", accent: "yellow" } })],
    }),
    sitemap(),
    markdoc({ allowHTML: true }),
    llmsTxt({
      exclude: "develop/classic/**",
    }),
  ],
});
