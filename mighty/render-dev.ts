/// <reference types="astro/client" />

import { experimental_AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import reactRenderer from "@astrojs/react/server.js";
import { setGlobals } from "./public/globals";

export async function render(
  componentToRender: string,
  props: Record<string, unknown>,
  csrfToken: string | null | undefined,
  errors: Record<string, unknown>,
  session: Record<string, unknown>
) {
  const container = await experimental_AstroContainer.create({
    renderers: [
      {
        name: "@astrojs/react",
        clientEntrypoint: "/@id/@astrojs/react/client.js",
        ssr: reactRenderer,
      },
    ],
    async resolve(s) {
      if (s.startsWith("astro:scripts")) {
        return "http://localhost:9999/@id/" + s;
      }
      if (s.startsWith("/@id")) {
        return "http://localhost:9999" + s;
      }
      return `http://localhost:9999/${s}`;
    },
  });

  setGlobals({
    csrfToken: csrfToken,
    errors: errors,
    session: session,
  });

  const component: AstroComponentFactory = (
    await import(
      /* @vite-ignore */ `../resources/astro/${componentToRender}.astro`
    )
  ).default;

  return container.renderToString(component, {
    props,
    partial: false,
  });
}

export async function doesComponentHaveStyle(componentToRender: string) {
  return import(
    /* @vite-ignore */ `../resources/astro/${componentToRender}.astro?astro&type=style&index=0&lang.css`
  )
    .then(() => true)
    .catch(() => false);
}

export async function isPageScriptInjected() {
  // @ts-expect-error Astro virtual module typing is not available here
  return import("astro:scripts/page.js")
    .then((module) => {
      return Object.keys(module).length > 0;
    })
    .catch(() => true);
}
