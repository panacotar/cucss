# CuCSS

CuCSS is a lightweight browser extension for applying your own CSS to any site. It is meant for small UI tweaks that make pages feel more personal.    
It stores your styles locally in browser storage (based on the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)).

It displays a popup with a quick on/off toggle for the current site. A dedicated dashboard page provides a full CSS editor (powered by CodeMirror). The styles are stored internally, but it allows export/import them.

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
