import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

const jsJsxPlugin = () => ({
  name: "vite:js-jsx",
  enforce: "pre",
  async transform(code, id) {
    const [filepath] = id.split("?");
    if (!filepath.endsWith(".js")) return null;
    if (filepath.includes("node_modules")) return null;
    return transformWithOxc(code, filepath.replace(/\.js$/, ".jsx"), {
      jsx: { runtime: "automatic", importSource: "react" },
    });
  },
});

export default defineConfig({
  plugins: [jsJsxPlugin(), react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "@a12e/accessmonitor-ds",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
      cssFileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  },
});