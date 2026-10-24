import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.argv[2] ?? process.env.SMALLGAME_PORT ?? 4173);
const MIME = { '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.wav':'audio/wav', '.mp4':'video/mp4', '.webm':'video/webm', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };
createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.') || segment.includes('\\'))) throw new Error('Not public');
    let path = resolve(root, ...segments);
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Not public');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path),size=body.length;
    const headers={'Content-Type':MIME[extname(path)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
    let start=0,end=size-1,status=200;
    if(request.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if(!match||(!match[1]&&!match[2])){response.writeHead(416,{'Content-Range':'bytes */'+size}).end();return;}
      start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
      end=match[1]&&match[2]?Math.min(size-1,Number(match[2])):size-1;
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||start<0||end<start){response.writeHead(416,{'Content-Range':'bytes */'+size}).end();return;}
      status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+size;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    response.writeHead(status,headers);
    response.end(request.method==='HEAD'?undefined:body.subarray(start,end+1));
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); }
}).listen(port, '127.0.0.1', () => process.stdout.write(`Smallgame: http://127.0.0.1:${port}\n`));
