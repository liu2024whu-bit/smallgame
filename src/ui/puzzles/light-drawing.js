import {LIGHT_GEOMETRY as G,LIGHT_TARGET,lightLayout,LIGHT_PART_REGISTRATION as R,LIGHT_FILM_SURFACE as F} from '../../data/light.js';
import {LIGHT_LINES} from '../../puzzles/light-ink.js';
import {lightCamera,filmPoint,filmProjection,mirrorCircle,mirrorFootprint,bookShadow,lightNormal,convexHull} from '../../puzzles/light-geometry.js';
import {ASSETS} from '../../data/assets.js';
import {ASSET_LAYOUTS} from '../../data/asset-layouts.js';
export const lightPath=(points,closed=false)=>points.length?points.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(3)).join(' ')).join('')+(closed?'Z':''):'';
const project=(point,tall)=>lightCamera(point,lightLayout(tall).camera);
export const lightPaper=(tall=false)=>[[G.screen.left,G.screenY,G.screen.top],[G.screen.right,G.screenY,G.screen.top],[G.screen.right,G.screenY,G.screen.bottom],[G.screen.left,G.screenY,G.screen.bottom]].map(point=>project(point,tall));
const toScreen=(point,tall)=>project([point[0],G.screenY,point[1]],tall);
const line=(points,project)=>lightPath(points.map(project).filter(Boolean));
export const inkPath=(values,flipped,physical=false,tall=false)=>LIGHT_LINES.map(points=>line(points,physical?p=>project(filmPoint(p,values,flipped),tall):p=>{const ray=filmProjection(p,values,flipped);return ray?toScreen(ray.screen,tall):null;})).join('');
export const referenceInk=(tall=false)=>inkPath(LIGHT_TARGET.values,LIGHT_TARGET.flipped,false,tall);
export function planeMatrix(quad,w,h){
 const [a,b,,d]=quad;return [(b[0]-a[0])/w,(b[1]-a[1])/w,(d[0]-a[0])/h,(d[1]-a[1])/h,a[0],a[1]];
}
export function lightSprite(asset,index,quad,attrs='',{maskId='',cutout=null,annotation=''}={}){
 const layout=ASSET_LAYOUTS[asset],frame=layout?.frames?.[index];if(!frame||!ASSETS[asset])return '';
 const [x,y,w,h]=frame;
 const mask=cutout?`<defs><mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${layout.width}" height="${layout.height}"><rect width="${layout.width}" height="${layout.height}" fill="white"/><rect x="${cutout.x}" y="${cutout.y}" width="${cutout.width}" height="${cutout.height}" fill="black"/></mask></defs>`:'';
 return `<g ${attrs} transform="matrix(${planeMatrix(quad,w,h).join(' ')})"><svg width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" overflow="hidden">${mask}<image href="${ASSETS[asset]}" width="${layout.width}" height="${layout.height}" ${cutout?`mask="url(#${maskId})"`:""}/>${annotation}</svg></g>`;
}
export function flatSprite(asset,index,x,y,width,height,attrs=''){
 return lightSprite(asset,index,[[x,y],[x+width,y],[x+width,y+height],[x,y+height]],attrs);
}
function registered(index,project){
 const [x,y,w,h]=ASSET_LAYOUTS.lightParts.frames[index];
 return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(project);
}
export function mirrorQuad(values,tall=false){
 const n=lightNormal(values[2]),u=[-n[1],n[0],0],r=G.mirrorRadius;
 return registered(0,([x,y])=>project([G.mirror[0]+u[0]*(x-R.mirror.x)/R.mirror.r*r,G.mirror[1]+u[1]*(x-R.mirror.x)/R.mirror.r*r,G.mirror[2]-(y-R.mirror.y)/R.mirror.r*r],tall));
}
export function bookQuad(values,tall=false){
 const h=G.bookZ[0]+values[1]*24;
 return registered(2,([x,y])=>project([G.bookX[0]+(x-R.book.x)/R.book.width*(G.bookX[1]-G.bookX[0]),G.bookY[0]+(y-R.book.y)/R.book.height*(G.bookY[1]-G.bookY[0]),h],tall));
}
export function filmFrameQuad(values,flipped,tall=false){
 return registered(1,([x,y])=>project(filmPoint([(x-R.film.x)/R.film.width*400-100,(y-R.film.y)/R.film.height*400-100],values,flipped),tall));
}
export function filmSheetQuad(values,flipped,tall=false){
 const [x,y,w,h]=ASSET_LAYOUTS.lightFilm.frames[0];
 return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([a,b])=>project(filmPoint([(a-F.x)/F.width*400-100,(b-F.y)/F.height*400-100],values,flipped),tall));
}
export function paperQuad(tall=false){
 return registered(3,([x,y])=>project([G.screen.left+(x-R.paper.x)/R.paper.width*(G.screen.right-G.screen.left),G.screenY,G.screen.top-(y-R.paper.y)/R.paper.height*(G.screen.top-G.screen.bottom)],tall));
}
export const screenShadow=(values,tall=false)=>bookShadow(values).map(point=>toScreen(point,tall));
export function drawingPaths(pose,tall=false){
 const {values,flipped}=pose,footprint=mirrorFootprint(values).map(point=>toScreen(point,tall)),circle=mirrorCircle(values);
 return {
  pupil:lightPath(footprint,true),block:lightPath(screenShadow(values,tall),true),
  ink:inkPath(values,flipped,false,tall),physical:inkPath(values,flipped,true,tall),
  incoming:lightPath([project(G.source,tall),project(circle[16],tall),project(circle[48],tall)],true),
  reflected:lightPath(convexHull([project(G.mirror,tall),...footprint]),true)
 };
}
export function paperDrawing(pose,prefix,tall=false){
 const paths=drawingPaths(pose,tall),proof=pose.proof,goal=drawingPaths({...pose,values:proof?.values??LIGHT_TARGET.values,flipped:proof?.flipped??LIGHT_TARGET.flipped},tall),mask=`url(#${prefix}-block)`,pupil=`url(#${prefix}-pupil)`;
 return `<defs><clipPath id="${prefix}-paper"><path d="${lightPath(lightPaper(tall),true)}"/></clipPath><clipPath id="${prefix}-pupil"><path data-light-path="pupil" d="${paths.pupil}"/></clipPath><mask id="${prefix}-block" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><path fill="white" d="${lightPath(lightPaper(tall),true)}"/><path data-light-path="block" fill="black" opacity="${Number(pose.fitted[2])}" d="${paths.block}"/></mask><clipPath id="${prefix}-proof-pupil"><path d="${goal.pupil}"/></clipPath><mask id="${prefix}-proof-block" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><path fill="white" d="${lightPath(lightPaper(tall),true)}"/><path fill="black" d="${goal.block}"/></mask></defs>
 <g clip-path="url(#${prefix}-paper)">
 <g class="light-reference" fill="none" clip-path="url(#${prefix}-proof-pupil)"><path d="${referenceInk(tall)}" mask="url(#${prefix}-proof-block)"/><path d="${goal.block}"/></g>
 <g clip-path="${pupil}" class="light-cast" opacity="${Number(pose.lit)*Number(pose.fitted[1])}">
 <path class="light-paper-wash" mask="${mask}" d="${lightPath(lightPaper(tall),true)}"/>
 <path data-light-path="ink" class="light-shadow-ink" mask="${mask}" fill="none" opacity="${Number(pose.fitted[0])}" d="${paths.ink}"/>
 </g>
 <g class="light-proof" opacity="${proof?1:0}" clip-path="url(#${prefix}-proof-pupil)"><path class="light-drawn-ink" mask="url(#${prefix}-proof-block)" fill="none" pathLength="1" d="${proof?inkPath(proof.values,proof.flipped,false,tall):referenceInk(tall)}"/><path class="light-drawn-sill" fill="none" pathLength="1" d="${lightPath(screenShadow(proof?.values??LIGHT_TARGET.values,tall),true)}"/></g>
 </g>`;
}
