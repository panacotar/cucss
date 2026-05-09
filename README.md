# CuCSS

A lightweight browser extension fro applying your own CSS to any site. Perfect for quick UI tweaks, accessibility fixes, and personal theming without touching the original page.

## Development

### 1. Install dependencies

```sh
npm install
```

### 2. Build the extension

One-time build:
```sh
npm run build
```

Watch for changes (auto-rebuild esbuild files on file save):
```sh
npm run dev
```

### 3. Test in Firefox

```sh
npm run firefox:start
```

### 4. Validate the code

```sh
npm run firefox:lint
```

### 5. Create a release

Will output to the `release` directory.
```sh
npm run firefox:release
```

### Test
```
npm run test
```

<!-- 

body { background: red; font-style: italic; } 
.central-textlogo__image { background: blue; }
#js-link-box-en strong { font-size: 30px; } 

-->
