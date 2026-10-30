import {readFile,readdir,access} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {ASSETS,SCENE_ART} from '../src/data/assets.js';
import {PUZZLES} from '../src/data/puzzles.js';
import {RULES} from '../src/puzzles/index.js';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(path){const out=[];for(const entry of await readdir(path,{withFileTypes:true})){const p=join(path,entry.name);if(entry.isDirectory())out.push(...await walk(p));else if(p.endsWith('.js'))out.push(p);}return out;}
for(const file of await walk(join(root,'src'))){
 const code=await readFile(file,'utf8'),checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
 if(checked.status)throw Error(checked.stderr);
 for(const [,path]of code.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g))await access(resolve(dirname(file),path));
}
for(const path of Object.values({...ASSETS,...SCENE_ART})){const bytes=await readFile(join(root,path));if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||bytes.readUInt32LE(4)+8!==bytes.length)throw Error('Invalid illustration');}
for(const p of PUZZLES)if(!RULES[p.id].valid(RULES[p.id].create()))throw Error('Invalid rule: '+p.id);
const html=await readFile(join(root,'index.html'),'utf8');for(const [,path]of html.matchAll(/(?:href|src)="([^"]+)"/g))await access(join(root,path));
console.log('Checked current source imports, illustrations and 27 puzzle definitions.');
