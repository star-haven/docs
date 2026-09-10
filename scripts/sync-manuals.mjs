import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const contentDir = join(scriptDir, "../src/content/docs");

const MANUALS = [
  {
    env: "PAPERMARIO_DX_SRC",
    dest: "papermario-dx",
    editBase: "https://github.com/bates64/papermario-dx/edit/main/manual/",
  },
  {
    env: "STAR_ROD_CLASSIC_SRC",
    dest: "star-rod-classic",
    editBase: "https://github.com/z64a/star-rod-classic/edit/main/manual/",
  },
];

const PAGE_EXTENSIONS = [".md", ".mdoc"];
const ASSET_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

for (const { env, dest, editBase } of MANUALS) {
  const srcRoot = process.env[env];
  if (!srcRoot) {
    console.error(`${env} is not set`);
    process.exit(1);
  }

  const manualDir = join(srcRoot, "manual");
  const destDir = join(contentDir, dest);
  rmSync(destDir, { recursive: true, force: true });
  syncManual(manualDir, destDir, editBase);
  console.log(`synced ${manualDir} -> ${relative(process.cwd(), destDir)}`);
}

function syncManual(manualDir, destDir, editBase) {
  const files = walk(manualDir).map((file) =>
    posix.join(...relative(manualDir, file).split(/[\\/]/)),
  );
  const contents = readContents(manualDir, files);

  for (const file of files) {
    const extension = extname(file).toLowerCase();
    const destFile = join(destDir, file === "README.md" ? "index.md" : file);
    mkdirSync(dirname(destFile), { recursive: true });

    if (PAGE_EXTENSIONS.includes(extension)) {
      const page = renderPage(join(manualDir, file), file, contents, {
        files,
        base: `/${relative(contentDir, destDir)}/`,
      });
      writeFileSync(destFile, withEditUrl(page, editBase + file));
    } else if (ASSET_EXTENSIONS.includes(extension)) {
      cpSync(join(manualDir, file), destFile);
    }
  }

  for (const [directory, section] of contents.sections) {
    writeFileSync(
      join(destDir, directory, "_meta.yml"),
      `label: ${section.label}\norder: ${section.order}\n`,
    );
  }
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/**
 * Reads the ordering a manual's README.md gives its pages. Each `## Heading` names a
 * section, and the links beneath it list that section's pages in reading order. Manuals
 * without a README.md order their pages by filename instead.
 */
function readContents(manualDir, files) {
  const sections = new Map();
  const pages = new Map();

  if (!files.includes("README.md")) {
    return { sections, pages };
  }

  const readme = readFileSync(join(manualDir, "README.md"), "utf8");
  let heading = null;
  let position = 0;

  for (const line of readme.split("\n")) {
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      heading = headingMatch[1].trim();
      position = 0;
      continue;
    }

    const linkMatch = line.match(/^\s*[-*] \[[^\]]*\]\(([^)#]+\.mdo?c?)\)/);
    if (!linkMatch || !heading) {
      continue;
    }

    const page = linkMatch[1];
    if (!files.includes(page)) {
      throw new Error(`README.md links to ${page}, which the manual does not contain`);
    }

    pages.set(page, ++position);

    const directory = posix.dirname(page);
    if (directory !== "." && !sections.has(directory)) {
      sections.set(directory, { label: heading, order: sections.size + 1 });
    }
  }

  return { sections, pages };
}

/**
 * Manuals written for the documentation site already carry Starlight frontmatter. Manuals
 * written as plain Markdown, such as Star Rod Classic's, take their title from the leading
 * heading, which Starlight renders from the frontmatter instead.
 */
function renderPage(sourceFile, file, contents, manual) {
  const source = readFileSync(sourceFile, "utf8");
  if (source.startsWith("---\n")) {
    return source;
  }

  const lines = resolveLinks(source, file, manual).split("\n");
  const headingIndex = lines.findIndex((line) => line.startsWith("# "));
  if (headingIndex < 0) {
    throw new Error(`${file} has no title heading`);
  }

  const title = lines[headingIndex].slice(2).trim();
  const body = lines.slice(headingIndex + 1).join("\n").replace(/^\n+/, "");

  const frontmatter = [`title: ${yamlString(title)}`];
  const sidebar = [];

  // Pages numbered for reading order, such as "3. From ROM to Project", read better in the
  // sidebar without the number.
  const numbered = title.match(/^\d+\. (.+)$/);
  if (numbered) {
    sidebar.push(`  label: ${yamlString(numbered[1])}`);
  }

  const order = file === "README.md" ? 0 : contents.pages.get(file);
  if (order !== undefined) {
    sidebar.push(`  order: ${order}`);
  }

  if (sidebar.length > 0) {
    frontmatter.push("sidebar:", ...sidebar);
  }

  return `---\n${frontmatter.join("\n")}\n---\n\n${body}`;
}

/**
 * Plain-Markdown manuals link between pages by file path, which is what GitHub and the
 * offline copies of the manual need. The site serves those pages at extensionless URLs.
 */
function resolveLinks(source, file, { files, base }) {
  return source.replace(/\]\(([^):]+\.md)(#[^)]*)?\)/g, (link, target, anchor = "") => {
    const page = posix.normalize(posix.join(posix.dirname(file), target));
    if (!files.includes(page)) {
      console.warn(`${file} links to ${target}, which the manual does not contain`);
      return link;
    }

    const slug = page === "README.md" ? "" : page.replace(/\.md$/, "") + "/";
    return `](${base}${slug}${anchor})`;
  });
}

/** Points a page's edit link at the manual it was synced from rather than at this repository. */
function withEditUrl(page, editUrl) {
  return page.replace("---\n", `---\neditUrl: ${editUrl}\n`);
}

function yamlString(value) {
  return /^[\w][\w .,'?!()/-]*$/.test(value)
    ? value
    : `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
