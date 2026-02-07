import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";

const distDir = join(process.cwd(), "dist");
const srcDir = join(process.cwd(), "src");

// Generate dist/index.mjs
const distFiles = readdirSync(distDir)
  .filter((f) => f.endsWith(".mjs") && f !== "index.mjs")
  .sort();

const indexLines = distFiles.map((f) => `export * from "./${f}";`);
writeFileSync(join(distDir, "index.mjs"), indexLines.join("\n") + "\n");
console.log(`Generated dist/index.mjs (re-exports ${distFiles.length} packages)`);

// Generate .d.mts files and individual icon files from src/ exports
const srcFiles = readdirSync(srcDir)
  .filter((f) => f.endsWith(".js") && f !== "index.js")
  .sort();

for (const file of srcFiles) {
  const pkgName = basename(file, ".js");
  const src = readFileSync(join(srcDir, file), "utf8");
  const names = [];
  for (const match of src.matchAll(/export \{ default as (\w+) \}/g)) {
    names.push(match[1]);
  }

  // Generate package-level .d.mts
  const dtsLines = [
    `import type { IconifyIcon } from "@iconify/types";`,
    ...names.map((n) => `export declare const ${n}: IconifyIcon;`),
  ];
  const dtsName = pkgName + ".d.mts";
  writeFileSync(join(distDir, dtsName), dtsLines.join("\n") + "\n");
  console.log(`Generated dist/${dtsName} (${names.length} icons)`);

  // Generate individual icon files in dist/<pkgName>/
  const iconDir = join(distDir, pkgName);
  mkdirSync(iconDir, { recursive: true });

  for (const name of names) {
    writeFileSync(
      join(iconDir, `${name}.mjs`),
      `export { ${name} as default } from "../${pkgName}.mjs";\n`
    );
  }
  console.log(`Generated dist/${pkgName}/ (${names.length} individual icons)`);
}

// Generate shared dist/icon.d.mts for individual icon imports
writeFileSync(
  join(distDir, "icon.d.mts"),
  `import type { IconifyIcon } from "@iconify/types";\ndeclare const icon: IconifyIcon;\nexport default icon;\n`
);
console.log("Generated dist/icon.d.mts (shared type for individual imports)");

// Generate dist/index.d.mts
const dtsIndexLines = distFiles.map((f) => {
  const name = basename(f, ".mjs");
  return `export * from "./${name}.d.mts";`;
});
writeFileSync(join(distDir, "index.d.mts"), dtsIndexLines.join("\n") + "\n");
console.log("Generated dist/index.d.mts");
