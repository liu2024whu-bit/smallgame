import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ASSETS, SCENE_ART } from '../src/data/assets.js';
import { ASSET_LAYOUTS } from '../src/data/asset-layouts.js';
import { PUZZLES } from '../src/data/puzzles.js';
import { RULES } from '../src/puzzles/index.js';
import { PUZZLE_VIEWS } from '../src/ui/puzzles/index.js';
import { MUSIC } from '../src/data/music.js';
import { SCENES } from '../src/data/scenes.js';

const root = fileURLToPath(new URL('../', import.meta.url));
async function walk(directory) { return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat(); }
const sources = await walk(resolve(root, 'src'));
for (const file of sources.filter(file => file.endsWith('.js'))) {
  const code = await readFile(file, 'utf8');
  const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (syntax.status) throw new Error(syntax.stderr);
  for (const [, path] of code.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) await access(resolve(dirname(file), path));
  if (code.split('\n').length > 300) throw new Error(`Split the module into cohesive responsibilities: ${file}`);
}
for (const [id, path] of Object.entries({ ...ASSETS, ...SCENE_ART })) {
  const data = await readFile(resolve(root, path));
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP' || data.readUInt32LE(4) + 8 !== data.length) throw new Error(`Invalid or truncated WebP: ${path}`);
  if (!ASSET_LAYOUTS[id]?.width || !ASSET_LAYOUTS[id]?.height) throw new Error(`Missing decoded dimensions: ${id}`);
  const layout = ASSET_LAYOUTS[id];
  for (const frame of layout.frames ?? []) {
    if (!frame) continue;
    const [x, y, width, height] = frame;
    if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > layout.width || y + height > layout.height) throw new Error(`Frame leaves its source image: ${id}`);
  }
}
for(const track of MUSIC){if(track.file){const bytes=await readFile(resolve(root,track.file));if(bytes.length<10000)throw new Error('Missing prepared music: '+track.id);}}
for (const puzzle of PUZZLES) {
  if (!RULES[puzzle.id] || !PUZZLE_VIEWS[puzzle.id] || !puzzle.instruction || puzzle.hints.length !== 3) throw new Error(`Incomplete puzzle: ${puzzle.id}`);
  if (!RULES[puzzle.id].valid(RULES[puzzle.id].create())) throw new Error(`Invalid initial state: ${puzzle.id}`);
}
for (const scene of SCENES) for (const spot of scene.hotspots) {
  if (spot.kind === 'puzzle' && !RULES[spot.target]) throw new Error(`Unknown hotspot: ${spot.id}`);
  if ([spot.x, spot.y, spot.width, spot.height].some(value => !Number.isFinite(value) || value < 0 || value > 100)) throw new Error(`Invalid coordinates: ${spot.id}`);
}
for (const path of ['index.html','demo.html','admin.html','review-frame.html', 'styles/base.css', 'styles/room.css', 'styles/puzzles.css', 'styles/notebook.css', 'styles/motion.css']) {
  const content = await readFile(resolve(root, path), 'utf8');
  for (const [, link] of content.matchAll(/(?:href|src)="([^"]+)"/g)) if (!link.startsWith('#')) await access(resolve(root, link));
}
console.log(`Checked ${sources.length} source modules, ${PUZZLES.length} puzzle definitions and all local raster headers/imports.`);
