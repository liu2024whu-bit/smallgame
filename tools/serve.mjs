import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=process.cwd(),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.mp3':'audio/mpeg','.json':'application/json'};
createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep))throw Error();const f=(await stat(p)).isDirectory()?resolve(p,'index.html'):p;res.writeHead(200,{'Content-Type':types[extname(f)]??'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(f));}catch{res.writeHead(404).end();}}).listen(Number(process.argv[2]??4173),'127.0.0.1');
