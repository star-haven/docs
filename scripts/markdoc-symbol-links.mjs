import Markdoc from "@markdoc/markdoc";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const symbolMapPath = join(process.cwd(), "src/data/symbol-map.json");
let symbolMap = {};
try {
  symbolMap = JSON.parse(readFileSync(symbolMapPath, "utf8"));
} catch {}

let insideLink = false;

export function symbolAutoLinks() {
  return {
    nodes: {
      link: {
        ...Markdoc.nodes.link,
        transform(node, config) {
          insideLink = true;
          const children = node.transformChildren(config);
          insideLink = false;
          return new Markdoc.Tag(
            "a",
            { href: node.attributes.href, title: node.attributes.title },
            children,
          );
        },
      },
      code: {
        attributes: Markdoc.nodes.code.attributes,
        transform(node) {
          const content = node.attributes.content;
          const entry = symbolMap[content];
          if (entry && !insideLink) {
            return new Markdoc.Tag(
              "a",
              { href: entry.url, class: "symbol-link" },
              [new Markdoc.Tag("code", {}, [content])],
            );
          }
          return new Markdoc.Tag("code", {}, [content]);
        },
      },
    },
  };
}

export function symbolAutoLinkTransformer() {
  return {
    name: "symbol-auto-link",
    span(hast) {
      const textNode = hast.children?.[0];
      if (!textNode || textNode.type !== "text") return;
      const text = textNode.value;

      // Exact match (single-token span)
      const entry = symbolMap[text];
      if (entry) {
        hast.children = [
          {
            type: "element",
            tagName: "a",
            properties: { href: entry.url, class: "symbol-link" },
            children: [{ type: "text", value: text }],
          },
        ];
        return;
      }

      // Shiki may merge multiple identifiers into one span (same colour).
      // Scan for symbol names separated by word boundaries.
      const parts = [];
      let remaining = text;
      while (remaining.length > 0) {
        const match = remaining.match(/\b(\w+)\b/);
        if (!match) {
          parts.push({ type: "text", value: remaining });
          break;
        }
        const word = match[1];
        const idx = match.index;
        if (idx > 0) {
          parts.push({ type: "text", value: remaining.slice(0, idx) });
        }
        const wordEntry = symbolMap[word];
        if (wordEntry) {
          parts.push({
            type: "element",
            tagName: "a",
            properties: { href: wordEntry.url, class: "symbol-link" },
            children: [{ type: "text", value: word }],
          });
        } else {
          parts.push({ type: "text", value: word });
        }
        remaining = remaining.slice(idx + word.length);
      }

      // Only replace children if we actually found any symbols
      if (parts.some((p) => p.type === "element")) {
        hast.children = parts;
      }
    },
  };
}

function getSpanText(span) {
  let result = "";
  for (const child of span.children || []) {
    if (child.type === "text") result += child.value;
    else if (child.type === "element") result += getSpanText(child);
  }
  return result;
}

function makeHint(paramName) {
  return {
    type: "element",
    tagName: "span",
    properties: { class: "inlay-hint" },
    children: [{ type: "text", value: paramName }],
  };
}

const WARN_WIDTH = 80;

// commaCount tracks commas seen so far. After comma N (1-indexed), the next
// arg is params[N-1]. On continuation lines, the previous line ended with a
// comma so the first token needs a hint for params[commaCount-1].
function addHintsToLine(children, startIdx, params, commaCount, hintFirst) {
  const inserts = [];

  if (hintFirst) {
    const paramIndex = commaCount.value - 1;
    if (paramIndex >= 0 && paramIndex < params.length) {
      for (let j = startIdx; j < children.length; j++) {
        const text = getSpanText(children[j]);
        if (text && text.trim()) {
          // If this span has leading whitespace, split it so the hint
          // goes after the indent, not before it
          const leadingWs = text.match(/^(\s+)/);
          if (leadingWs) {
            const span = children[j];
            const textNode = span.children[0];
            if (textNode?.type === "text") {
              const wsSpan = {
                ...span,
                properties: { ...span.properties },
                children: [{ type: "text", value: leadingWs[0] }],
              };
              textNode.value = " " + text.slice(leadingWs[0].length);
              children.splice(j, 0, wsSpan);
              // hint goes after the whitespace span (at j+1)
              inserts.push({ index: j + 1, paramName: params[paramIndex] });
              break;
            }
          }
          inserts.push({ index: j, paramName: params[paramIndex] });
          break;
        }
      }
    }
  }

  for (let i = startIdx; i < children.length; i++) {
    const text = getSpanText(children[i]);
    if (!text) continue;

    if (text.includes(",")) {
      commaCount.value++;
      const paramIndex = commaCount.value - 1;
      if (paramIndex < params.length) {
        for (let j = i + 1; j < children.length; j++) {
          const nextText = getSpanText(children[j]);
          if (nextText && nextText.trim()) {
            inserts.push({ index: j, paramName: params[paramIndex] });
            break;
          }
        }
      }
    }
  }

  for (let k = inserts.length - 1; k >= 0; k--) {
    children.splice(inserts[k].index, 0, makeHint(inserts[k].paramName));
  }
}

export function inlayHintTransformer() {
  // State across lines for multi-line Calls
  let activeCall = null; // { params, commaCount, depth }

  return {
    name: "inlay-hints",
    pre() {
      activeCall = null;
    },
    line(hast) {
      const children = hast.children;
      if (!children?.length) return;

      let lineText = "";
      for (const child of children) lineText += getSpanText(child);

      // Check if this line starts a new Call
      const match = lineText.match(/\bCall\((\w+)/);
      if (match) {
        const funcName = match[1];
        const entry = symbolMap[funcName];
        if (entry?.params?.length) {
          const commaCount = { value: 0 };

          // Warn if single-line Call would be too wide with hints
          if (lineText.includes(")")) {
            const hintChars = entry.params.reduce((s, p) => s + p.length + 1, 0);
            if (lineText.length + hintChars > WARN_WIDTH) {
              console.warn(
                `[inlay-hints] Line too wide with hints (${lineText.length}+${hintChars}=${lineText.length + hintChars}): ${lineText.trim()}`,
              );
            }
          }

          // Find where the args start (after "Call(" and the function name)
          // Skip tokens up to and including the function name token
          let foundCall = false;
          let startIdx = 0;
          for (let i = 0; i < children.length; i++) {
            const text = getSpanText(children[i]);
            if (!foundCall && text.includes("Call")) {
              foundCall = true;
              continue;
            }
            if (foundCall && text.includes(funcName)) {
              startIdx = i + 1;
              break;
            }
          }

          addHintsToLine(children, startIdx, entry.params, commaCount, false);

          // Check if the Call continues onto the next line
          let depth = 0;
          for (const ch of lineText) {
            if (ch === "(") depth++;
            else if (ch === ")") depth--;
          }
          if (depth > 0) {
            activeCall = { params: entry.params, commaCount, depth };
          } else {
            activeCall = null;
          }
          return;
        }
      }

      // Continuation of a multi-line Call
      if (activeCall) {
        addHintsToLine(children, 0, activeCall.params, activeCall.commaCount, true);

        // Track paren depth to know when the Call ends
        for (const ch of lineText) {
          if (ch === "(") activeCall.depth++;
          else if (ch === ")") activeCall.depth--;
        }
        if (activeCall.depth <= 0) {
          activeCall = null;
        }
      }
    },
  };
}
