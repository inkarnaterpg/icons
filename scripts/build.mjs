import { readdirSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const distDir = join(process.cwd(), "dist");

const packages = [
  { pkg: "@iconify/icons-ant-design", name: "ant-design" },
  { pkg: "@iconify/icons-bytesize", name: "bytesize" },
  { pkg: "@iconify/icons-carbon", name: "carbon" },
  { pkg: "@iconify/icons-cil", name: "cil" },
  { pkg: "@iconify/icons-dashicons", name: "dashicons" },
  { pkg: "@iconify/icons-fa", name: "fa" },
  { pkg: "@iconify/icons-gridicons", name: "gridicons" },
  { pkg: "@iconify/icons-ic", name: "ic" },
  { pkg: "@iconify/icons-ion", name: "ion" },
  { pkg: "@iconify/icons-maki", name: "maki" },
  { pkg: "@iconify/icons-mdi", name: "mdi" },
  { pkg: "@iconify/icons-oi", name: "oi" },
  { pkg: "@iconify/icons-raphael", name: "raphael" },
  { pkg: "@iconify/icons-vaadin", name: "vaadin" },
  { pkg: "@iconify/icons-whh", name: "whh" },
];

function toIdentifier(filename) {
  let id = filename.replace(/-/g, "_");
  if (/^[0-9]/.test(id)) {
    id = "_" + id;
  }
  return id;
}

mkdirSync(distDir, { recursive: true });

const indexBarrelLines = [];
const indexDtsLines = [];

for (const { pkg, name } of packages) {
  const pkgDir = join(process.cwd(), "node_modules", pkg);
  const iconFiles = readdirSync(pkgDir)
    .filter((f) => f.endsWith(".js") && !f.startsWith("index"))
    .map((f) => basename(f, ".js"));

  const iconDir = join(distDir, name);
  mkdirSync(iconDir, { recursive: true });

  const barrelLines = [];
  const dtsLines = [`import type { IconifyIcon } from "@iconify/types";`];

  for (const icon of iconFiles) {
    const id = toIdentifier(icon);
    const data = require(`${pkg}/${icon}`);
    const iconData = data.default || data;

    writeFileSync(
      join(iconDir, `${id}.mjs`),
      `export default ${JSON.stringify(iconData)};\n`
    );

    barrelLines.push(`export { default as ${id} } from "./${name}/${id}.mjs";`);
    dtsLines.push(`export declare const ${id}: IconifyIcon;`);
  }

  writeFileSync(join(distDir, `${name}.mjs`), barrelLines.join("\n") + "\n");
  writeFileSync(join(distDir, `${name}.d.mts`), dtsLines.join("\n") + "\n");
  console.log(`Generated dist/${name}.mjs + dist/${name}/ (${iconFiles.length} icons)`);

  indexBarrelLines.push(`export * from "./${name}.mjs";`);
  indexDtsLines.push(`export * from "./${name}.d.mts";`);
}

writeFileSync(join(distDir, "index.mjs"), indexBarrelLines.join("\n") + "\n");
writeFileSync(join(distDir, "index.d.mts"), indexDtsLines.join("\n") + "\n");
console.log("Generated dist/index.mjs + dist/index.d.mts");

writeFileSync(
  join(distDir, "icon.d.mts"),
  `import type { IconifyIcon } from "@iconify/types";\ndeclare const icon: IconifyIcon;\nexport default icon;\n`
);
console.log("Generated dist/icon.d.mts");
