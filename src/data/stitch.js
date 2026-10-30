// Pixel measurements of the painted linen, not an abstract hole grid.
export const STITCH_SIZE=[1536,1024];
export const STITCH_PARTS={width:1536,height:1024,frames:[[44,137,705,82],[809,137,692,82],[93,309,380,397],[591,319,352,389],[1031,291,48,499],[1165,331,343,489],[53,729,539,219],[633,782,379,172]]};
export const STITCH_STRIPS=[[173,363,1190,1190*82/705],[173,565,1190,1190*82/692]];
const sourceHoles=[[[124.43,178.94],[304.04,179.10],[484.50,179.37],[675.94,179.10]],[[884.12,179.28],[1068.24,179.33],[1253.65,179.49],[1424.49,179.27]]];
export const STITCH_HOLES=sourceHoles.flatMap((row,index)=>row.map(([x,y])=>{const [sx,sy,sw,sh]=STITCH_PARTS.frames[index],[dx,dy,dw,dh]=STITCH_STRIPS[index];return [dx+(x-sx)/sw*dw,dy+(y-sy)/sh*dh];}));
export const STITCH_PAPERS=[[190,50],[846,50],[190,574],[846,574]];
export const STITCH_LEAF=[500,500*314/376];
export const stitchPoint=(index,back)=>{const [x,y]=STITCH_HOLES[index];return [back?1536-x:x,y];};
export const needleBack=p=>p.path.length%2===1;
export const stitchCamera=(p,view={})=>view.stitchSample?'whole':['whole','seam'].includes(view.stitchCamera)?view.stitchCamera:p.finished?'whole':p.fitted.every(Boolean)||p.path.length?'seam':'whole';
export const STITCH_CAMERAS={whole:[565,495,405,275],seam:[630,575,280,125]};
export const stitchViewKey=p=>`${p.path.join('.')}:${p.tied}:${p.finished}`;
export const stitchBack=(p,view={})=>view.stitchKey===stitchViewKey(p)?!!view.stitchBack:p.finished?false:needleBack(p);
export const stitchNeedlePoint=(p,back)=>p.path.length?stitchPoint(p.path.at(-1),back).map((v,i)=>v+(i?70:back?65:-65)):[back?1425:111,510];
