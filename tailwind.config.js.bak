import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    // './storage/framework/views/*.php',
    // './resources/**/*.blade.php',
    "./resources/**/*.js",
    "./resources/**/*.vue",
    "./resources/**/*.astro",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "modal-open-keyframes": {
          from: { opacity: 0, transform: "translateY(1rem)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "modal-open-sm-keyframes": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "modal-close-keyframes": {
          from: { opacity: 1, transform: "translateY(0)" },
          to: { opacity: 0, transform: "translateY(1rem)" },
        },
        "modal-close-sm-keyframes": {
          from: { opacity: 1, transform: "scale(1)" },
          to: { opacity: 0, transform: "scale(0.95)" },
        },
        "modal-backdrop-close-keyframes": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "modal-backdrop-open-keyframes": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "modal-open": "modal-open-keyframes 0.3s ease-out",
        "modal-open-sm": "modal-open-sm-keyframes 0.3s ease-out",
        "modal-close": "modal-close-keyframes 0.2s ease-out",
        "modal-close-sm": "modal-close-sm-keyframes 0.2s ease-out",
        "backdrop-open": "modal-backdrop-open-keyframes 0.3s ease-out",
        "backdrop-close": "modal-backdrop-close-keyframes 0.2s ease-out",
      },
    },
  },
  plugins: [forms],
};
