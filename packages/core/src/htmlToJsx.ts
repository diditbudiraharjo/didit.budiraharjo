import { parseFragment, parse, serialize, defaultTreeAdapter, html as html5 } from "parse5";
import type { DefaultTreeAdapterMap } from "parse5";

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
type ParentNode = DefaultTreeAdapterMap["parentNode"];

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const ATTR_NAME_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  crossorigin: "crossOrigin",
  colspan: "colSpan",
  rowspan: "rowSpan",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  autoplay: "autoPlay",
  autofocus: "autoFocus",
  autocomplete: "autoComplete",
  novalidate: "noValidate",
  formnovalidate: "formNoValidate",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  srcdoc: "srcDoc",
  playsinline: "playsInline",
  itemscope: "itemScope",
  itemprop: "itemProp",
  itemtype: "itemType",
  itemref: "itemRef",
  itemid: "itemId",
  enctype: "encType",
  accesskey: "accessKey",
  hreflang: "hrefLang",
  charset: "charSet",
  datetime: "dateTime",
  autocapitalize: "autoCapitalize",
};

const BOOLEAN_ATTRS = new Set([
  "disabled", "checked", "selected", "required", "readonly", "multiple",
  "autofocus", "autoplay", "controls", "loop", "muted", "default", "hidden",
  "open", "novalidate", "formnovalidate", "reversed", "allowfullscreen",
  "itemscope", "async", "defer", "ismap", "nomodule", "playsinline",
]);

function isElement(node: Node): node is Element {
  return defaultTreeAdapter.isElementNode(node);
}

function cssTextToObjectLiteral(cssText: string): string {
  const declarations = cssText
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
  const entries = declarations.map((decl) => {
    const colonIndex = decl.indexOf(":");
    if (colonIndex === -1) return null;
    const rawKey = decl.slice(0, colonIndex).trim();
    const value = decl.slice(colonIndex + 1).trim();
    const key = rawKey.startsWith("--")
      ? JSON.stringify(rawKey)
      : JSON.stringify(rawKey.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));
    return `${key}: ${JSON.stringify(value)}`;
  }).filter((e): e is string => e !== null);
  return `{ ${entries.join(", ")} }`;
}

function attrToJsx(name: string, value: string): string {
  const lower = name.toLowerCase();

  if (lower === "style") {
    return `style={${cssTextToObjectLiteral(value)}}`;
  }

  const jsxName = ATTR_NAME_MAP[lower] ?? name;

  if (BOOLEAN_ATTRS.has(lower)) {
    if (value === "" || value.toLowerCase() === lower || value.toLowerCase() === "true") {
      return jsxName;
    }
    if (value.toLowerCase() === "false") return "";
  }

  return `${jsxName}={${JSON.stringify(value)}}`;
}

function elementToJsx(el: Element, depth: number): string {
  const indent = "  ".repeat(depth);
  const tag = el.tagName;

  const attrs = el.attrs
    .map((a) => attrToJsx(a.name, a.value))
    .filter((s) => s.length > 0);
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";

  if (VOID_ELEMENTS.has(tag)) {
    return `${indent}<${tag}${attrStr} />`;
  }

  const childrenJsx = childrenToJsx(el.childNodes, depth + 1);
  if (!childrenJsx.trim()) {
    return `${indent}<${tag}${attrStr}></${tag}>`;
  }

  return `${indent}<${tag}${attrStr}>\n${childrenJsx}\n${indent}</${tag}>`;
}

function textToJsx(text: string, depth: number): string | null {
  const indent = "  ".repeat(depth);
  if (text.trim() === "") return null;
  return `${indent}{${JSON.stringify(text)}}`;
}

function commentToJsx(text: string, depth: number): string {
  const indent = "  ".repeat(depth);
  return `${indent}{/* ${text.replace(/\*\//g, "* /")} */}`;
}

function childrenToJsx(nodes: readonly Node[], depth: number): string {
  const lines: string[] = [];
  for (const node of nodes) {
    if (isElement(node)) {
      lines.push(elementToJsx(node, depth));
    } else if (defaultTreeAdapter.isTextNode(node)) {
      const line = textToJsx(defaultTreeAdapter.getTextNodeContent(node), depth);
      if (line) lines.push(line);
    } else if (defaultTreeAdapter.isCommentNode(node)) {
      lines.push(commentToJsx(defaultTreeAdapter.getCommentNodeContent(node), depth));
    }
  }
  return lines.join("\n");
}

/** Converts an HTML fragment (e.g. a document's <body> innerHTML) into a JSX body string. */
export function fragmentToJsx(html: string): string {
  const fragment = parseFragment(html);
  const body = childrenToJsx(fragment.childNodes, 3);
  return body;
}

export interface ParsedDocument {
  /** Cleaned, self-contained HTML document (style/link[stylesheet] stripped, ready for <link rel=stylesheet href="styles.css">). */
  html: string;
  bodyInnerHtml: string;
}

/**
 * Parses a full HTML document, strips <style> and <link rel=stylesheet> tags (their
 * content has already been merged into a combined stylesheet elsewhere), and injects
 * a single <link rel="stylesheet" href="styles.css"> into <head>.
 */
export function cleanDocument(html: string): ParsedDocument {
  const document = parse(html);

  const htmlEl = findChildElement(document, "html");
  const head = htmlEl && findChildElement(htmlEl, "head");
  const body = htmlEl && findChildElement(htmlEl, "body");

  if (head) {
    removeMatching(head, (el) => el.tagName === "style");
    removeMatching(head, (el) => el.tagName === "link" && hasAttr(el, "rel", "stylesheet"));
    removeMatching(head, (el) => el.tagName === "base");

    const linkEl = defaultTreeAdapter.createElement(
      "link",
      html5.NS.HTML,
      [
        { name: "rel", value: "stylesheet" },
        { name: "href", value: "styles.css" },
      ],
    );
    defaultTreeAdapter.appendChild(head, linkEl);
  }
  if (body) {
    removeMatching(body, (el) => el.tagName === "style");
  }

  const bodyInnerHtml = body ? serialize(body) : "";

  return { html: serialize(document), bodyInnerHtml };
}

function findChildElement(parent: ParentNode, tagName: string): Element | undefined {
  return parent.childNodes.find((n): n is Element => isElement(n) && n.tagName === tagName);
}

function hasAttr(el: Element, name: string, value: string): boolean {
  return el.attrs.some((a) => a.name === name && a.value.toLowerCase() === value);
}

function removeMatching(root: ParentNode, predicate: (el: Element) => boolean) {
  const toRemove: Element[] = [];
  const walk = (node: Node) => {
    if (isElement(node)) {
      if (predicate(node)) {
        toRemove.push(node);
        return;
      }
      node.childNodes.forEach(walk);
    }
  };
  root.childNodes.forEach(walk);
  for (const el of toRemove) {
    defaultTreeAdapter.detachNode(el);
  }
}
