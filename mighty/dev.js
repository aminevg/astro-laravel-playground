import { dev } from "astro";
import { createAstroInlineConfig } from "./config.js";

await dev(createAstroInlineConfig());
