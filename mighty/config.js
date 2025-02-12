import path from "path";
import fg from "fast-glob";
import bodyparser from "body-parser";
import {
  getScriptTags,
  getStyleTags,
  getTailwindTags,
  injectTagsIntoHead,
} from "./utils.js";
import { getStylesForURL } from "./styles.ts";

/**
 * @typedef {import('hast').ElementContent} ElementContent
 */

/**
 *
 * @returns {import("astro").AstroInlineConfig}
 */
export function createAstroInlineConfig() {
  let isTailwindConfigured = false;
  return {
    srcDir: "resources/astro",
    output: "server",
    devToolbar: {
      enabled: false,
    },
    adapter: {
      name: "my-adapter",
      hooks: {
        "astro:config:setup": async ({ injectRoute }) => {
          fg.glob("resources/astro/**/*.astro").then((files) =>
            files.forEach((file) => {
              const baseName = path.basename(file, ".astro");
              injectRoute({
                pattern: `/__mighty_injected_route__/${baseName}`,
                entrypoint: file,
              });
            })
          );
        },
        "astro:config:done": ({ setAdapter, config, injectTypes }) => {
          if (
            config.integrations.some(
              (integration) => integration.name === "@astrojs/tailwind"
            )
          ) {
            isTailwindConfigured = true;
          }
          setAdapter({
            name: "my-adapter",
            serverEntrypoint: new URL(
              "./server-entrypoint.mjs",
              import.meta.url
            ).pathname,
            supportedAstroFeatures: {
              serverOutput: "stable",
              sharpImageService: "stable",
            },
            exports: ["manifest", "componentsStyles", "componentsScripts"],
          });
        },
        "astro:build:setup": ({ vite, target }) => {
          if (target === "server") {
            // @ts-expect-error input is a record here
            vite.build?.rollupOptions?.input?.push("mighty/allComponents.ts");
          }
        },
        "astro:server:setup": async ({ server }) => {
          const { render } = await server.ssrLoadModule("mighty/render-dev.ts");

          /**
           * @type {ElementContent}
           */
          const viteClientScriptTag = {
            type: "element",
            tagName: "script",
            properties: {
              type: "module",
              src: "http://localhost:9999/@vite/client",
            },
            children: [],
          };
          const scriptTags = await getScriptTags(server);

          server.middlewares.use(bodyparser.json());
          server.middlewares.use("/__mighty__", async (req, res, next) => {
            try {
              const url = req.originalUrl?.replace("/__mighty__/", "");
              if (url === undefined) {
                throw new Error("url is undefined");
              }

              const result = await render(
                url,
                req.body.props,
                req.body.csrfToken,
                req.body.errors,
                req.body.session
              );
              console.log(
                url,
                "file://" +
                  "/Users/amine/mighty-playground/chirper" +
                  "/resources/astro/" +
                  url
              );
              console.log(
                (
                  await getStylesForURL(
                    new URL(
                      "file://" +
                        "/Users/amine/mighty-playground/chirper" +
                        "/resources/astro/" +
                        url +
                        ".astro"
                    ),
                    server
                  )
                ).styles.map((style) => ({
                  type: "element",
                  tagName: "style",
                  properties: {
                    type: "text/css",
                    "data-vite-dev-id": style.id,
                  },
                  children: [{ type: "text", value: style.content }],
                }))
              );

              const tailwindTags = isTailwindConfigured
                ? await getTailwindTags(server)
                : [];

              // const styleTags = await getStyleTags(server, url);
              /**
               * @type {ElementContent[]}
               */
              const styleTags = (
                await getStylesForURL(
                  new URL(
                    "file://" +
                      "/Users/amine/mighty-playground/chirper" +
                      "/resources/astro/" +
                      url +
                      ".astro"
                  ),
                  server
                )
              ).styles.map((style) => ({
                type: "element",
                tagName: "style",
                properties: {
                  type: "text/css",
                  "data-vite-dev-id": style.id,
                },
                children: [{ type: "text", value: style.content }],
              }));

              const realResult = injectTagsIntoHead(result, [
                viteClientScriptTag,
                ...scriptTags,
                ...tailwindTags,
                ...styleTags,
              ]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.end(realResult);
            } catch (e) {
              // @ts-expect-error e is of type unknown
              server.ssrFixStacktrace(e);
              res.setHeader("Content-Type", "text/html");
              next(e);
            }
          });
        },
      },
    },
  };
}
