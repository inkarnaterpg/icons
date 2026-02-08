# @inkarnaterpg/icons

Pre-built [Iconify](https://iconify.design/) icon sets as ESM with TypeScript declarations.

This library is a workaround for how Rolldown was not correctly converting the original iconify packages from CJS to ESM.

## Included Icon Sets

| Export Path  | Source Package               | Icons                 |
| ------------ | ---------------------------- | --------------------- |
| `ant-design` | `@iconify/icons-ant-design`  | Ant Design Icons      |
| `bytesize`   | `@iconify/icons-bytesize`    | Bytesize Icons        |
| `carbon`     | `@iconify/icons-carbon`      | Carbon Icons          |
| `cil`        | `@iconify/icons-cil`         | CoreUI Free Icons     |
| `dashicons`  | `@iconify/icons-dashicons`   | Dashicons             |
| `fa`         | `@iconify/icons-fa`          | Font Awesome 4        |
| `gridicons`  | `@iconify/icons-gridicons`   | Gridicons             |
| `ic`         | `@iconify/icons-ic`          | Google Material Icons |
| `ion`        | `@iconify/icons-ion`         | IonIcons              |
| `maki`       | `@iconify/icons-maki`        | Maki Icons            |
| `mdi`        | `@iconify/icons-mdi`         | Material Design Icons |
| `oi`         | `@iconify/icons-oi`          | Open Iconic           |
| `raphael`    | `@iconify/icons-raphael`     | Raphael Icons         |
| `vaadin`     | `@iconify/icons-vaadin`      | Vaadin Icons          |
| `whh`        | `@iconify/icons-whh`         | WebHostingHub Glyphs  |

## Usage

### Import a single icon

```js
import adjust from '@inkarnaterpg/icons/fa/adjust';
```

### Import multiple icons from a set

```js
import { align_center, adjust } from '@inkarnaterpg/icons/fa';
```

Each icon is an `IconifyIcon` object from `@iconify/types`.

## Building

```sh
pnpm install
pnpm run build
```

The build script reads the CJS icon files from each iconify package and writes self-contained ESM files with the icon data inlined. Package-level barrel files re-export from the individual icon files.

## Adding a New Icon Set

1. Install the Iconify package:

   ```sh
   pnpm add @iconify/icons-<name>
   ```

2. Add an entry to the `packages` array in `scripts/build.mjs`:

   ```js
   { pkg: "@iconify/icons-<name>", name: "<name>" },
   ```

3. Add export paths to `package.json` under `exports`:

   ```json
   "./<name>": {
     "types": "./dist/<name>.d.mts",
     "import": "./dist/<name>.mjs"
   },
   "./<name>/*": {
     "types": "./dist/icon.d.mts",
     "import": "./dist/<name>/*.mjs"
   }
   ```

4. Rebuild:

   ```sh
   pnpm run build
   ```

## Naming Convention

Icon names are derived from the original filenames with hyphens replaced by underscores:

- `address-book` -> `address_book`
- `menu-alt-2` -> `menu_alt_2`
- `500px` -> `_500px` (leading digits get a `_` prefix)
