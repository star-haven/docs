import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import sidebar from "starlight-auto-sidebar";
import llmsTxt from "starlight-llms-txt";
import catppuccin from "@catppuccin/starlight";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { watchManuals } from "./scripts/sync-manuals.mjs";

const contentDir = "src/content/docs";

/**
 * The manuals were served from /develop and /classic before they moved out of this
 * repository. Static hosting has no pattern matching, so every page gets its own redirect.
 */
function legacyRedirects(oldPrefix, directory) {
  const pages = walk(join(contentDir, directory))
    .filter((file) => /\.mdo?c?$/.test(file))
    .map((file) =>
      relative(join(contentDir, directory), file)
        .replace(/\.mdo?c?$/, "")
        .replace(/(^|\/)index$/, ""),
    );

  return Object.fromEntries(
    pages.map((page) => [
      `${oldPrefix}/${page}`.replace(/\/$/, ""),
      `/${directory}/${page}`.replace(/\/$/, ""),
    ]),
  );
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/** Keeps the synced manuals up to date while the dev server runs. */
const manualWatcher = {
  name: "manual-watcher",
  hooks: {
    "astro:server:setup": () => watchManuals(),
  },
};

export default defineConfig({
  site: "https://docs.starhaven.dev",
  redirects: {
    ...legacyRedirects("/develop", "papermario-dx"),
    ...legacyRedirects("/classic", "star-rod-classic"),
    // The Star Rod Classic introduction was served from the section root before it moved
    // into its own directory.
    "/classic/02-paper-mario-engine": "/star-rod-classic/introduction/02-paper-mario-engine",
    "/classic/03-from-rom-to-project": "/star-rod-classic/introduction/03-from-rom-to-project",
    "/classic/04-sources-patches-and-symbols":
      "/star-rod-classic/introduction/04-sources-patches-and-symbols",
    "/classic/05-editors-and-asset-pipelines":
      "/star-rod-classic/introduction/05-editors-and-asset-pipelines",
    "/classic/06-the-modding-cycle": "/star-rod-classic/introduction/06-the-modding-cycle",
  },
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
          autogenerate: { directory: "papermario-dx" },
        },
        {
          label: "Star Rod Classic",
          collapsed: true,
          badge: { variant: "caution", text: "Legacy" },
          autogenerate: { directory: "star-rod-classic" },
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
      exclude: "star-rod-classic/**",
    }),
    manualWatcher,
  ],
});
