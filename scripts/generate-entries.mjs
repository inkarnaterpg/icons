import { readdirSync, writeFileSync, mkdirSync } from "fs";
import { join, basename } from "path";

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

mkdirSync(join(process.cwd(), "src"), { recursive: true });

const indexExports = [];

for (const { pkg, name } of packages) {
  const pkgDir = join(process.cwd(), "node_modules", pkg);
  const iconFiles = readdirSync(pkgDir)
    .filter((f) => f.endsWith(".js") && !f.startsWith("index"))
    .map((f) => basename(f, ".js"));

  const lines = iconFiles.map((icon) => {
    const id = toIdentifier(icon);
    return `export { default as ${id} } from "${pkg}/${icon}";`;
  });

  writeFileSync(join(process.cwd(), "src", `${name}.js`), lines.join("\n") + "\n");
  console.log(`Generated src/${name}.js (${iconFiles.length} icons)`);

  indexExports.push(`export * from "./${name}.js";`);
}

writeFileSync(join(process.cwd(), "src", "index.js"), indexExports.join("\n") + "\n");
console.log("Generated src/index.js");
