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
      const entry = symbolMap[text];
      if (!entry) return;
      hast.children = [
        {
          type: "element",
          tagName: "a",
          properties: { href: entry.url, class: "symbol-link" },
          children: [{ type: "text", value: text }],
        },
      ];
    },
  };
}
