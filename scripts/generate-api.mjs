import { execFileSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  rmSync,
} from "node:fs";
import { join, relative, dirname, basename, extname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, "..");
const stubsDir = join(scriptDir, "stubs");
const outDir = join(projectRoot, "src/content/docs/develop/reference");

const srcRoot = process.env.PAPERMARIO_DX_SRC;
if (!srcRoot) {
  console.error("PAPERMARIO_DX_SRC is not set");
  process.exit(1);
}

const includeDir = join(srcRoot, "include");
const GITHUB_REPO_BASE =
  "https://github.com/bates64/papermario-dx/blob/main";
const GITHUB_BASE = `${GITHUB_REPO_BASE}/include`;

const RENDER_UNDOCUMENTED = true;
const RENDER_UNDOCUMENTED_MACROS = false;

const EXCLUDED_DIRS = ["PR", "nu", "mapfs", "libc"];
const EXCLUDED_FILES = ["ultra64.h", "types.h"];
const EXCLUDED_PATHS = ["common.h", "common.hpp"];

function globHeaders(dir, base = "") {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry)) {
        results.push(...globHeaders(full, rel));
      }
    } else if (
      /\.(h|hpp)$/.test(entry) &&
      !EXCLUDED_FILES.includes(entry) &&
      !EXCLUDED_PATHS.includes(rel)
    ) {
      results.push({ abs: full, rel });
    }
  }
  return results;
}

const tmpFile = join(tmpdir(), `extract-api-${process.pid}.json`);

function runClangExtractApi(headerPath) {
  const args = [
    "-extract-api",
    "--product-name=papermario-dx",
    "-D_ULTRA64_H_",
    "-D_TYPES_H_",
    "-DUNK_TYPE=s32",
    "-DUNK_PTR=void*",
    "-DUNK_RET=void",
    "-DUNK_ARGS=",
    "-DUNK_FUN_ARG=void(*)(void)",
    "-DUNK_FUN_PTR(name)=void(*name)(void)",
    "-Db32=s32",
    "-Db16=s16",
    "-Db8=s8",
    "-DHitID=s32",
    "-DAnimID=u32",
    "-DHudElemID=s32",
    "-DMsgID=s32",
    "-DMSG_PTR=u8*",
    "-DIMG_PTR=u8*",
    "-DPAL_PTR=u16*",
    "-DMSG_BIN=u8",
    "-DIMG_BIN=u8",
    "-DPAL_BIN=u16",
    "-DAddr=u8*",
    "-DPrintCallback=void*",
    "-include",
    join(stubsDir, "PR/ultratypes.h"),
    "-include",
    join(stubsDir, "PR/gbi.h"),
    "-include",
    join(stubsDir, "PR/os.h"),
    "-include",
    join(stubsDir, "PR/libaudio.h"),
    `-I${stubsDir}`,
    `-I${includeDir}`,
    `-I${join(srcRoot, "ver/us/build/include")}`,
    `-I${join(srcRoot, "src")}`,
    "-x",
    "c-header",
    "-Wno-everything",
    headerPath,
    "-o",
    tmpFile,
  ];
  try {
    execFileSync("clang", args, {
      maxBuffer: 50 * 1024 * 1024,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (e) {
    // clang may produce output even with errors; check if the file was created
    try {
      const result = readFileSync(tmpFile, "utf8");
      unlinkSync(tmpFile);
      return result;
    } catch {
      throw e;
    }
  }
  const result = readFileSync(tmpFile, "utf8");
  unlinkSync(tmpFile);
  return result;
}

function parseDocComment(docComment) {
  if (!docComment?.lines?.length) return "";
  return docComment.lines
    .map((l) => l.text)
    .join("\n")
    .trim()
    .replace(/^(#+)/gm, (_, hashes) => "#".repeat(hashes.length + 4));
}

function isEvtApiCallable(sym) {
  const retType = sym.functionSignature?.returns?.[0]?.preciseIdentifier;
  if (retType === "c:evt.h@T@ApiStatus") return true;
  const docLines = sym.docComment?.lines || [];
  return docLines.some((l) => l.text.trim() === "@evtapi");
}

function parseEvtParams(docComment) {
  if (!docComment?.lines?.length) return [];
  const params = [];
  for (const line of docComment.lines) {
    const match = line.text.match(/^@param\s+(\S+)/);
    if (match) params.push(match[1]);
  }
  return params;
}

function parseEvtOutputs(docComment) {
  if (!docComment?.lines?.length) return [];
  const outputs = [];
  for (const line of docComment.lines) {
    const match = line.text.match(/^@evtout\s+(\S+)\s+(.*)/);
    if (match)
      outputs.push({ varName: match[1], description: match[2].trim() });
  }
  return outputs;
}

function stripEvtTags(doc) {
  return doc
    .replace(/^@evtapi\s*$/gm, "")
    .replace(/^@param\s+.*$/gm, "")
    .replace(/^@evtout\s+.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildDeclaration(fragments) {
  if (!fragments) return "";
  return fragments.map((f) => f.spelling).join("");
}

function parseFileDocComment(source) {
  const lines = source.split("\n");
  const docLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" && docLines.length === 0) continue;
    if (trimmed.startsWith("#ifndef") || trimmed.startsWith("#define")) {
      if (docLines.length === 0) continue;
      break;
    }
    if (trimmed.startsWith("///")) {
      let text = trimmed.slice(3);
      if (text.startsWith(" ")) text = text.slice(1);
      if (/^@file\b/.test(text)) continue;
      if (/^@sa\b/.test(text)) continue;
      docLines.push(text);
    } else {
      break;
    }
  }
  return docLines.join("\n").trim();
}

function parseMacroDocsFromSource(source) {
  const lines = source.split("\n");
  const macros = new Map();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith("#define ")) continue;

    const match = trimmed.match(/^#define\s+(\w+)(?:\(([^)]*)\))?/);
    if (!match) continue;
    const name = match[1];
    const params =
      match[2] != null
        ? match[2]
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        : null;

    // Collect /// comment lines above
    const docLines = [];
    for (let j = i - 1; j >= 0; j--) {
      const prev = lines[j].trim();
      if (prev.startsWith("///")) {
        let text = prev.slice(3);
        if (text.startsWith(" ")) text = text.slice(1);
        if (/^@file\b/.test(text) || /^@sa\b/.test(text)) continue;
        docLines.unshift(text);
      } else {
        break;
      }
    }

    if (docLines.length > 0) {
      macros.set(name, { doc: docLines.join("\n").trim(), params });
    }
  }

  return macros;
}

function parseGlobalVarsFromSource(source) {
  const lines = source.split("\n");
  const vars = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith("extern ")) continue;

    const match = trimmed.match(/^extern\s+(.+?)\s+(\w+)(\[.*\])?\s*;/);
    if (!match) continue;
    const type = match[1] + (match[3] ?? "");
    const name = match[2];

    const docLines = [];
    for (let j = i - 1; j >= 0; j--) {
      const prev = lines[j].trim();
      if (prev.startsWith("///")) {
        let text = prev.slice(3);
        if (text.startsWith(" ")) text = text.slice(1);
        if (/^@file\b/.test(text) || /^@sa\b/.test(text)) continue;
        docLines.unshift(text);
      } else {
        break;
      }
    }

    if (docLines.length > 0) {
      vars.push({ name, type, doc: docLines.join("\n").trim(), line: i });
    }
  }

  return vars;
}

function buildFuncDefinitionMap(srcRoot) {
  const map = new Map();
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".c")) {
        const content = readFileSync(full, "utf8");
        const lines = content.split("\n");
        const relPath = relative(srcRoot, full);
        for (let i = 0; i < lines.length; i++) {
          const apiMatch = lines[i].match(/^API_CALLABLE\((\w+)\)/);
          if (apiMatch) {
            map.set(apiMatch[1], { file: relPath, line: i + 1 });
            continue;
          }
          const funcMatch = lines[i].match(
            /^(?:[\w*\s]+\s+\**)(\w+)\s*\([^)]*\)\s*\{/,
          );
          if (funcMatch && !map.has(funcMatch[1])) {
            map.set(funcMatch[1], { file: relPath, line: i + 1 });
          }
        }
      }
    }
  }
  walk(join(srcRoot, "src"));
  return map;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeForMarkdown(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractApiData(header) {
  const source = readFileSync(header.abs, "utf8");

  let apiJson;
  try {
    const output = runClangExtractApi(header.abs);
    apiJson = JSON.parse(output.toString());
  } catch (e) {
    console.warn(`  SKIP ${header.rel}`);
    return null;
  }

  const fileDoc = parseFileDocComment(source);
  const macroDocs = parseMacroDocsFromSource(source);
  const globalVars = parseGlobalVarsFromSource(source);

  const parentOf = new Map();
  for (const rel of apiJson.relationships || []) {
    if (rel.kind === "memberOf") {
      parentOf.set(rel.source, rel.target);
    }
  }

  const headerUri = `file://${header.abs}`;
  const allSymbols = (apiJson.symbols || []).filter(
    (s) => s.location?.uri === headerUri,
  );

  allSymbols.sort(
    (a, b) =>
      (a.location?.position?.line ?? 0) - (b.location?.position?.line ?? 0),
  );

  const topLevel = [];
  const childrenOf = new Map();

  for (const sym of allSymbols) {
    const id = sym.identifier?.precise;
    const parentId = parentOf.get(id);

    if (parentId) {
      if (!childrenOf.has(parentId)) childrenOf.set(parentId, []);
      childrenOf.get(parentId).push(sym);
    } else {
      topLevel.push(sym);
    }
  }

  return {
    apiJson,
    fileDoc,
    macroDocs,
    globalVars,
    topLevel,
    childrenOf,
    allSymbols,
  };
}

function kindToClass(kind) {
  if (kind === "c.func") return "function";
  if (kind === "c.enum") return "enum";
  if (kind === "c.macro") return "macro";
  if (kind === "c.struct") return "type";
  if (kind === "c.typedef" || kind === "c.typealias") return "type";
  if (kind === "c.enum.case") return "enum";
  return "type";
}

function headerRelToUrl(headerRel) {
  return "/develop/reference/" + headerRel.replace(/\.(h|hpp)$/, "");
}

function resolveIntraDocLinks(text, nameMap) {
  return text.replace(/\[`([A-Za-z_]\w*)`\]/g, (match, name) => {
    const entry = nameMap.get(name);
    if (entry) {
      const cls = kindToClass(entry.kind);
      return `<a class="${cls} intra-doc-link" href="${entry.url}">${escapeHtml(name)}</a>`;
    }
    return match;
  });
}

function slugify(name) {
  return name;
}

function renderFragment(frag, typeMap) {
  const text = escapeHtml(frag.spelling);
  if (frag.kind === "typeIdentifier" && frag.preciseIdentifier) {
    const target = typeMap.get(frag.preciseIdentifier);
    if (target) {
      const url =
        headerRelToUrl(target.headerRel) + "#" + slugify(target.symbolName);
      return `<a class="type" href="${url}">${text}</a>`;
    }
    return `<span class="type">${text}</span>`;
  }
  if (frag.kind === "keyword") {
    return `<span class="keyword">${text}</span>`;
  }
  return text;
}

function leftAlignPointers(fragments) {
  const result = [];
  for (let i = 0; i < fragments.length; i++) {
    const frag = fragments[i];
    if (frag.kind === "text" && /^ \*+$/.test(frag.spelling)) {
      const stars = frag.spelling.trim();
      result.push({ kind: "text", spelling: stars });
      const next = fragments[i + 1];
      if (
        next &&
        (next.kind === "internalParam" || next.kind === "identifier") &&
        next.spelling
      ) {
        result.push({ kind: "text", spelling: " " });
      }
    } else {
      result.push(frag);
    }
  }
  return result;
}

function renderFragments(fragments, typeMap) {
  return leftAlignPointers(fragments)
    .map((f) => renderFragment(f, typeMap))
    .join("");
}

function buildEvtSignatureHtml(sym, typeMap, nameMap) {
  const funcName = sym.names?.title ?? "unknown";
  const nameHtml = `<a class="function" href="#${slugify(funcName)}">${escapeHtml(funcName)}</a>`;
  const evtParams = parseEvtParams(sym.docComment);
  const evtOutputs = parseEvtOutputs(sym.docComment);

  let callHtml;
  if (evtParams.length === 0) {
    callHtml = `Call(${nameHtml})`;
  } else {
    const paramHtmls = evtParams.map((p) => escapeHtml(p));
    const singleLine = `Call(${nameHtml}, ${paramHtmls.join(", ")})`;
    const plainLength = singleLine.replace(/<[^>]*>/g, "").length;
    const shouldSplit = plainLength > 60;

    if (shouldSplit) {
      const indented = paramHtmls
        .map((p, i) => {
          const comma = i < paramHtmls.length - 1 ? "," : "";
          return `  ${p}${comma}`;
        })
        .join("\n");
      callHtml = `Call(${nameHtml},\n${indented}\n)`;
    } else {
      callHtml = singleLine;
    }
  }

  if (evtOutputs.length > 0) {
    const outputParts = evtOutputs.map((o) => {
      const entry = nameMap.get(o.varName);
      const varHtml = entry
        ? `<a class="macro" href="${entry.url}">${escapeHtml(o.varName)}</a>`
        : `<span class="macro">${escapeHtml(o.varName)}</span>`;
      return `${varHtml}: ${escapeHtml(o.description)}`;
    });
    const singleLineOutput = `→ ${outputParts.join(", ")}`;
    const plainOutputLength = singleLineOutput.replace(/<[^>]*>/g, "").length;
    if (plainOutputLength > 60) {
      callHtml += `\n→ ${outputParts.join(",\n  ")}`;
    } else {
      callHtml += `\n${singleLineOutput}`;
    }
  }

  return { html: callHtml, funcName, isEvtApi: true };
}

function buildFuncSignatureHtml(sym, typeMap, nameMap) {
  const fragments = sym.declarationFragments;
  const funcSig = sym.functionSignature;
  if (!fragments) return null;

  const funcName = fragments.find((f) => f.kind === "identifier")?.spelling;
  if (!funcName) return null;

  if (isEvtApiCallable(sym)) {
    return buildEvtSignatureHtml(sym, typeMap, nameMap);
  }

  // Build return type from fragments before the identifier
  const retFrags = [];
  for (const frag of fragments) {
    if (frag.kind === "identifier") break;
    retFrags.push(frag);
  }
  const retHtml = renderFragments(retFrags, typeMap).trimEnd();

  const nameHtml = `<a class="function" href="#${slugify(funcName)}">${escapeHtml(funcName)}</a>`;

  // Build each parameter
  const params = funcSig?.parameters || [];
  const paramHtmls = params.map((p) =>
    renderFragments(p.declarationFragments, typeMap),
  );

  // If no params, check for void or empty parens
  if (params.length === 0) {
    // Look for what's between parens in the original fragments
    const full = fragments.map((f) => f.spelling).join("");
    const inner = full.match(/\(([^)]*)\)/)?.[1] ?? "";
    return {
      html: `${retHtml} ${nameHtml}(${escapeHtml(inner.replace(";", ""))})`,
      funcName,
      isEvtApi: false,
    };
  }

  // Decide whether to split: more than 3 params, or single-line would be long
  const singleLine = `${retHtml} ${nameHtml}(${paramHtmls.join(", ")})`;
  const plainLength = singleLine.replace(/<[^>]*>/g, "").length;
  const shouldSplit = plainLength > 60;

  let html;
  if (shouldSplit) {
    const indented = paramHtmls
      .map((p, i) => {
        const comma = i < paramHtmls.length - 1 ? "," : "";
        return `  ${p}${comma}`;
      })
      .join("\n");
    html = `${retHtml} ${nameHtml}(\n${indented}\n)`;
  } else {
    html = singleLine;
  }

  return { html, funcName, isEvtApi: false };
}

function generateMarkdown(header, data, typeMap, nameMap, funcDefMap) {
  const { fileDoc, macroDocs, globalVars, topLevel, childrenOf } = data;

  if (!RENDER_UNDOCUMENTED) {
    const hasVisibleSymbols = topLevel.some((sym) => {
      const kind = sym.kind?.identifier ?? "";
      let doc = parseDocComment(sym.docComment);
      if (kind === "c.macro" && !doc && macroDocs.has(sym.names?.title))
        doc = "y";
      if (!RENDER_UNDOCUMENTED_MACROS && kind === "c.macro" && !doc)
        return false;
      const children = childrenOf.get(sym.identifier?.precise) || [];
      const isEnum = kind === "c.enum";
      if (doc) return true;
      const hasAnyChildDoc = children.some(
        (c) => !!parseDocComment(c.docComment),
      );
      if (isEnum && (doc || hasAnyChildDoc)) return true;
      return hasAnyChildDoc;
    });

    if (!hasVisibleSymbols && !fileDoc && globalVars.length === 0) return null;
  }

  const parts = [];
  const title = header.rel;
  const sidebarLabel = basename(header.rel);
  parts.push(`---`);
  parts.push(`title: "${title}"`);
  parts.push(`sidebar:`);
  parts.push(`  label: "${sidebarLabel}"`);
  parts.push(`editUrl: false`);
  parts.push(`tableOfContents:`);
  parts.push(`  minHeadingLevel: 2`);
  parts.push(`  maxHeadingLevel: 4`);
  parts.push(`---`);
  parts.push("");

  if (fileDoc) {
    parts.push(resolveIntraDocLinks(fileDoc, nameMap));
    parts.push("");
  }

  for (const sym of topLevel) {
    const name = sym.names?.title ?? "unknown";
    const kind = sym.kind?.identifier ?? "";
    let doc = parseDocComment(sym.docComment);

    let macroParams = null;
    if (kind === "c.macro" && macroDocs.has(name)) {
      const macroInfo = macroDocs.get(name);
      if (!doc) doc = macroInfo.doc;
      macroParams = macroInfo.params;
    }

    const children = childrenOf.get(sym.identifier?.precise) || [];
    const isEnum = kind === "c.enum";

    const hasAnyChildDoc = children.some(
      (c) => !!parseDocComment(c.docComment),
    );

    const enumHasDocs = isEnum && (doc || hasAnyChildDoc);
    const visibleChildren = children.filter((child) => {
      if (RENDER_UNDOCUMENTED) return true;
      if (enumHasDocs) return true;
      return !!parseDocComment(child.docComment);
    });

    if (!RENDER_UNDOCUMENTED && !doc && visibleChildren.length === 0) continue;
    if (!RENDER_UNDOCUMENTED_MACROS && kind === "c.macro" && !doc) continue;

    const cssClass = kindToClass(kind);
    let heading;
    let tocName = name;
    if (kind === "c.func") {
      const sig = buildFuncSignatureHtml(sym, typeMap, nameMap);
      if (sig) {
        if (sig.isEvtApi) {
          doc = stripEvtTags(doc);
        }
        tocName = sig.funcName;
        heading = `<span class="api-sig">${sig.html}</span>`;
      } else {
        heading = `<span class="api-sig"><span class="${cssClass}">${escapeHtml(name)}</span></span>`;
      }
    } else if (kind === "c.macro" && macroParams != null) {
      const nameHtml = `<a class="macro" href="#${slugify(name)}">${escapeHtml(name)}</a>`;
      const paramHtmls = macroParams.map((p) => escapeHtml(p));
      const singleLine = `${nameHtml}(${paramHtmls.join(", ")})`;
      const plainLength = singleLine.replace(/<[^>]*>/g, "").length;
      const shouldSplit = plainLength > 60;
      let sigHtml;
      if (shouldSplit) {
        const indented = paramHtmls
          .map((p, i) => {
            const comma = i < paramHtmls.length - 1 ? "," : "";
            return `  ${p}${comma}`;
          })
          .join("\n");
        sigHtml = `${nameHtml}(\n${indented}\n)`;
      } else {
        sigHtml = singleLine;
      }
      heading = `<span class="api-sig"><span class="keyword">#define</span> ${sigHtml}</span>`;
    } else if (kind === "c.var" && sym.declarationFragments) {
      const varFrags = sym.declarationFragments
        .map((f) => ({ ...f, spelling: f.spelling.replace(/;$/, "") }))
        .map((f) =>
          f.kind === "identifier" ? { ...f, kind: "varIdentifier" } : f,
        );
      const varHtml = leftAlignPointers(varFrags)
        .map((f) => {
          if (f.kind === "varIdentifier")
            return `<a class="function" href="#${slugify(f.spelling)}">${escapeHtml(f.spelling)}</a>`;
          return renderFragment(f, typeMap);
        })
        .join("");
      heading = `<span class="api-sig">${varHtml}</span>`;
    } else {
      let prefix = "";
      if (kind === "c.struct") prefix = `<span class="keyword">struct</span> `;
      else if (kind === "c.typedef" || kind === "c.typealias")
        prefix = `<span class="keyword">typedef</span> `;
      else if (kind === "c.enum") prefix = `<span class="keyword">enum</span> `;
      else if (kind === "c.macro")
        prefix = `<span class="keyword">#define</span> `;
      heading = `<span class="api-sig">${prefix}<a class="${cssClass}" href="#${slugify(name)}">${escapeHtml(name)}</a></span>`;
    }

    const headingAttr = heading.replace(/"/g, "&quot;").replace(/\n/g, "&#10;");
    const def = kind === "c.func" ? funcDefMap.get(name) : null;
    let sourceUrl;
    if (def) {
      sourceUrl = `${GITHUB_REPO_BASE}/${def.file}#L${def.line}`;
    } else {
      const line = sym.location?.position?.line;
      sourceUrl =
        line != null ? `${GITHUB_BASE}/${header.rel}#L${line + 1}` : null;
    }
    const sourceAttr = sourceUrl ? ` source="${sourceUrl}"` : "";
    parts.push(`#### ${escapeForMarkdown(tocName)} {% #${tocName} %}`);
    parts.push("");
    parts.push(`{% apiitem heading="${headingAttr}"${sourceAttr} %}`);
    parts.push("");

    if (doc) {
      parts.push(resolveIntraDocLinks(doc, nameMap));
      parts.push("");
    }

    const isStruct = kind === "c.struct" || kind === "c.typedef" || kind === "c.typealias";
    const structFields = isStruct
      ? visibleChildren.filter((c) => {
          if (c.kind?.identifier !== "c.property") return false;
          const n = c.names?.title ?? "";
          return (
            !n.startsWith("pad_") &&
            !n.startsWith("unk_") &&
            !n.startsWith("unused_")
          );
        })
      : [];
    const otherChildren = isStruct
      ? visibleChildren.filter((c) => c.kind?.identifier !== "c.property")
      : visibleChildren;

    if (structFields.length > 0) {
      parts.push(`##### Fields`);
      parts.push("");
      for (const field of structFields) {
        const fieldName = field.names?.title ?? "unknown";
        const fieldFrags = field.declarationFragments || [];
        const typeFrags = fieldFrags.filter(
          (f) => f.kind !== "identifier" && f.spelling !== ";",
        );
        const typeHtml = renderFragments(typeFrags, typeMap).trim();
        const fieldDoc = parseDocComment(field.docComment);
        const fieldDocHtml = fieldDoc
          ? `<span class="field-doc">${resolveIntraDocLinks(escapeForMarkdown(fieldDoc), nameMap)}</span>`
          : "";
        const safeTypeHtml = typeHtml.replace(/\*/g, "&#42;");
        parts.push(
          `<p class="field-def">${escapeHtml(fieldName)}: <span class="field-type">${safeTypeHtml}</span>${fieldDocHtml}</p>`,
        );
        parts.push("");
      }
    }

    for (const child of otherChildren) {
      const childName = child.names?.title ?? "unknown";
      let childDoc = parseDocComment(child.docComment);

      if (isEnum) {
        parts.push(
          `<h5 class="enum-value" id="${slugify(childName)}"><a href="#${slugify(childName)}">${escapeHtml(childName)}</a></h5>`,
        );
      } else {
        parts.push(`#### \`${escapeForMarkdown(childName)}\``);
      }

      if (childDoc) {
        parts.push("");
        parts.push(resolveIntraDocLinks(childDoc, nameMap));
      }

      parts.push("");
    }

    parts.push(`{% /apiitem %}`);
    parts.push("");
  }

  const clangSymNames = new Set(topLevel.map((s) => s.names?.title));
  for (const gvar of globalVars) {
    if (clangSymNames.has(gvar.name)) continue;
    const heading = `<span class="api-sig"><span class="type">${escapeHtml(gvar.type)}</span> <span class="function">${escapeHtml(gvar.name)}</span></span>`;
    const headingAttr = heading.replace(/"/g, "&quot;").replace(/\n/g, "&#10;");
    const sourceLine = gvar.line + 1;
    const sourceUrl = `${GITHUB_BASE}/${header.rel}#L${sourceLine}`;
    parts.push(`### ${escapeForMarkdown(gvar.name)}`);
    parts.push("");
    parts.push(`{% apiitem heading="${headingAttr}" source="${sourceUrl}" %}`);
    parts.push("");
    parts.push(resolveIntraDocLinks(gvar.doc, nameMap));
    parts.push("");
    parts.push(`{% /apiitem %}`);
    parts.push("");
  }

  return parts.join("\n");
}

// Main
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "_meta.yml"), "label: Reference\ncollapsed: true\n");

const headers = globHeaders(includeDir);
console.log(`Found ${headers.length} headers to process`);

const funcDefMap = buildFuncDefinitionMap(srcRoot);

// First pass: extract API data from all headers and build type map
const typeMap = new Map(); // preciseIdentifier -> { headerRel, symbolName }
const nameMap = new Map(); // symbolName -> { url, kind }
const headerData = new Map(); // header.rel -> extracted data

for (const header of headers) {
  const data = extractApiData(header);
  if (!data) continue;
  headerData.set(header.rel, data);

  for (const sym of data.allSymbols) {
    const precise = sym.identifier?.precise;
    const symName = sym.names?.title ?? "unknown";
    if (precise) {
      typeMap.set(precise, { headerRel: header.rel, symbolName: symName });
    }
    if (symName !== "unknown") {
      nameMap.set(symName, {
        url: headerRelToUrl(header.rel) + "#" + slugify(symName),
        kind: sym.kind?.identifier ?? "",
      });
    }
  }
}

// Second pass: generate markdown with type links
let generated = 0;
let skipped = 0;

for (const header of headers) {
  const data = headerData.get(header.rel);
  if (!data) {
    skipped++;
    continue;
  }

  const md = generateMarkdown(header, data, typeMap, nameMap, funcDefMap);
  if (!md) {
    skipped++;
    continue;
  }

  const outName = header.rel.replace(/\.(h|hpp)$/, ".mdoc");
  const outPath = join(outDir, outName);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, md);
  console.log(`  ${outName}`);
  generated++;
}

console.log(`Generated ${generated} pages, skipped ${skipped} headers`);
