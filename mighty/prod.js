import { build } from "astro";
import { createAstroInlineConfig } from "./config.js";

await build(createAstroInlineConfig());
