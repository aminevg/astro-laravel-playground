import { toHtml } from "hast-util-to-html";
import path from "path";
import rehypeParse from "rehype-parse";
import { unified } from "unified";
import { EXIT, visit } from "unist-util-visit";

const processor = unified().use(rehypeParse);

const TAILWIND_BASE_CSS_MODULE = "@astrojs/tailwind/base.css";
const TAILWIND_SCRIPT_PATH = path.resolve(
  "node_modules",
  TAILWIND_BASE_CSS_MODULE
);

/**
 * @type {(componentPath: string) => Promise<boolean>}
 */
let doesComponentHaveStyle;
/**
 * @type {() => Promise<boolean>}
 */
let isPageScriptInjected;

/**
 * @typedef {import('hast').ElementContent} ElementContent
 */

/**
 * @type {"NOT_LOADED_YET" | ElementContent[]}
 */
let tailwindTags = "NOT_LOADED_YET";

/**
 *
 * @param {import('vite').ViteDevServer} server
 * @returns {Promise<ElementContent[]>}
 */
export async function getTailwindTags(server) {
  if (tailwindTags === "NOT_LOADED_YET") {
    const tailwindStyles = (
      await server.ssrLoadModule("@astrojs/tailwind/base.css?inline")
    ).default;
    tailwindTags = [
      {
        type: "element",
        tagName: "style",
        properties: {
          type: "text/css",
          "data-vite-dev-id": TAILWIND_SCRIPT_PATH,
        },
        children: [{ type: "text", value: tailwindStyles }],
      },
      {
        type: "element",
        tagName: "script",
        properties: {
          type: "module",
          src: `http://localhost:9999${TAILWIND_SCRIPT_PATH}`,
        },
        children: [],
      },
    ];
  }
  return tailwindTags;
}

const ASTRO_STYLE_QUERY = "?astro&type=style&index=0&lang.css";
const ASTRO_STYLE_INLINE_QUERY = "?astro&type=style&inline&index=0&lang.css";

/**
 *
 * @param {import('vite').ViteDevServer} server
 * @param {string} componentName
 * @returns {Promise<ElementContent[]>}
 */
export async function getStyleTags(server, componentName) {
  if (!doesComponentHaveStyle) {
    doesComponentHaveStyle = (
      await server.ssrLoadModule("mighty/render-dev.ts")
    ).doesComponentHaveStyle;
  }

  if (!(await doesComponentHaveStyle(componentName))) {
    return [];
  }

  const componentPath = path.resolve(
    "resources/astro",
    componentName + ".astro"
  );
  const styles = (
    await server.ssrLoadModule(componentPath + ASTRO_STYLE_INLINE_QUERY)
  ).default;
  return [
    {
      type: "element",
      tagName: "style",
      properties: {
        type: "text/css",
        "data-vite-dev-id": componentPath + ASTRO_STYLE_QUERY,
      },
      children: [{ type: "text", value: styles }],
    },
    {
      type: "element",
      tagName: "script",
      properties: {
        type: "module",
        src: `http://localhost:9999${componentPath + ASTRO_STYLE_QUERY}`,
      },
      children: [],
    },
  ];
}

/**
 *
 * @param {import('vite').ViteDevServer} server
 * @returns {Promise<ElementContent[]>}
 */
export async function getScriptTags(server) {
  if (!isPageScriptInjected) {
    isPageScriptInjected = (await server.ssrLoadModule("mighty/render-dev.ts"))
      .isPageScriptInjected;
  }
  if (!(await isPageScriptInjected())) {
    return [];
  }
  return [
    {
      type: "element",
      tagName: "script",
      properties: {
        type: "module",
        src: "/@id/astro:scripts/page.js",
      },
      children: [],
    },
  ];
}

/**
 *
 * @param {string} result
 * @param {ElementContent[]} children
 */
export function injectTagsIntoHead(result, children) {
  const tree = processor.parse(result);
  let hasHead = false;
  visit(tree, "element", (node) => {
    if (node.tagName === "head") {
      hasHead = true;
      children.forEach((child) => node.children.push(child));
      return EXIT;
    }
  });
  if (!hasHead) {
    children.forEach((child) => tree.children.push(child));
  }
  return toHtml(tree);
}
