import { readdirSync } from "fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const srcFiles = readdirSync("src")
  .filter((f) => f.endsWith(".js") && f !== "index.js");

export default srcFiles.map((file) => ({
  input: `src/${file}`,
  output: {
    file: `dist/${file.replace(".js", ".mjs")}`,
    format: "esm",
  },
  plugins: [resolve(), commonjs()],
}));
