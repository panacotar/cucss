import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };

const watch = process.argv.includes('--watch');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const author = typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || '';
const banner = `/*! ${pkg.name} v${pkg.version} | (c) ${author} | ${pkg.repository.url} */`;

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distDir, { recursive: true });

const options = {
  entryPoints: [
    'src/*.js', 'src/scripts/*.js'
  ],
  outbase: srcDir,
  outdir: distDir,
  banner: {
    js: banner,
		css: banner
  },
  bundle: true,
  write: true,
}

// Copy all static files from src to dist, preserving directory structure
// Skip JS files as esbuild handles bundling them
await fs.cp(srcDir, distDir, {
  recursive: true,
  filter: (src) => !src.endsWith('.js')
});

if (watch) {
	const ctx = await esbuild.context(options);
	await ctx.watch();
	console.log('Watching for changes...');
} else {
	esbuild.build(options);
	console.log('Build completed.');
}
