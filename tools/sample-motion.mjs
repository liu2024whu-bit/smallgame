import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const file=process.argv[2];
if(!file)throw new Error('Pass the Anime.js spring ESM file as the first argument.');
const {spring}=await import(pathToFileURL(resolve(file)).href);
const parameters={bounce:.08,duration:430},curve=spring(parameters);
const values=Array.from({length:41},(_,i)=>Number(curve.ease(i/40).toFixed(5)));
console.log(JSON.stringify({source:'Anime.js v4.5.0 / MIT',parameters,duration:curve.duration,easing:'linear('+values.join(',')+')'},null,2));
