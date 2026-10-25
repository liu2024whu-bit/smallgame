import {LIGHT_GEOMETRY as G,LIGHT_TARGET,lightLayout,LIGHT_PART_REGISTRATION as R,LIGHT_FILM_SURFACE as F} from '../../data/light.js';
import {lightCamera,filmPoint,mirrorBasis,mirrorFootprint,bookShadow,bookHeight,virtualProjection} from '../../puzzles/light-geometry.js';
import {ASSET_LAYOUTS} from '../../data/asset-layouts.js';
import {rasterPlane,polygon,excluding} from '../raster-plane.js';
const corners=([x,y,w,h])=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
export const project=(point,view)=>lightCamera(point,lightLayout(view).camera);
const screen=(point,view)=>project([point[0],G.screenY,point[1]],view);
export const lightPaper=view=>[[G.screen.left,G.screenY,G.screen.top],[G.screen.right,G.screenY,G.screen.top],[G.screen.right,G.screenY,G.screen.bottom],[G.screen.left,G.screenY,G.screen.bottom]].map(point=>project(point,view));
const registered=(index,fn)=>corners(ASSET_LAYOUTS.lightParts.frames[index]).map(fn);
export function mirrorQuad(values,view=false){
 const {u,v}=mirrorBasis(values),r=G.mirrorRadius;
 return registered(0,([x,y])=>project(G.mirror.map((c,i)=>c+u[i]*(x-R.mirror.x)/R.mirror.r*r-v[i]*(y-R.mirror.y)/R.mirror.r*r),view));
}
const bookWorld=([x,y],values)=>[G.bookX[0]+(x-R.book.x)/R.book.width*(G.bookX[1]-G.bookX[0]),G.bookY[0]+(y-R.book.y)/R.book.height*(G.bookY[1]-G.bookY[0]),bookHeight(values)];
export const bookQuad=(values,view=false)=>corners(ASSET_LAYOUTS.lightBook.frames[0]).map(p=>project(bookWorld(p,values),view));
export const bookProjectionQuad=(values,view=false)=>corners(ASSET_LAYOUTS.lightBook.frames[0]).map(p=>screen(virtualProjection(bookWorld(p,values),values),view));
export function cordQuad(values,view=false){
 const hole=bookWorld(R.book.hole,values);
 return corners(ASSET_LAYOUTS.lightBook.frames[1]).map(([x,y])=>project([hole[0]+(x-530)*.08,hole[1],hole[2]-(y-210)*.12],view));
}
export const filmFrameQuad=(values,flipped,view=false)=>registered(1,([x,y])=>project(filmPoint([(x-R.film.x)/R.film.width*400-100,(y-R.film.y)/R.film.height*400-100],values,flipped),view));
export const filmSheetQuad=(values,flipped,view=false)=>corners(ASSET_LAYOUTS.lightFilm.frames[0]).map(([x,y])=>project(filmPoint([(x-F.x)/F.width*400-100,(y-F.y)/F.height*400-100],values,flipped),view));
export const printQuad=(values,flipped,physical=false,view=false)=>corners(ASSET_LAYOUTS.lightPrint.frames[physical?0:1]).map(([x,y])=>{
 const p=[x/1254*400-100,y/1254*400-100],world=filmPoint(p,values,flipped);
 return physical?project(world,view):screen(virtualProjection(world,values),view);
});
export const paperQuad=(view=false)=>registered(3,([x,y])=>project([G.screen.left+(x-R.paper.x)/R.paper.width*(G.screen.right-G.screen.left),G.screenY,G.screen.top-(y-R.paper.y)/R.paper.height*(G.screen.top-G.screen.bottom)],view));
export const screenShadow=(values,view=false)=>bookShadow(values).map(p=>screen(p,view));
export function drawingMasks(values,view=false){
 const {view:[,,width,height]}=lightLayout(view);
 return {pupil:polygon(mirrorFootprint(values).map(p=>screen(p,view))),clear:excluding(screenShadow(values,view),width,height)};
}
export function lampQuad(view=false){
 return corners(ASSET_LAYOUTS.lightLamp.frames[0]).map(p=>project(lampWorld(p),view));
}
function lampWorld([x,y]){
 const {mouth,foot,baseX}=R.lamp;
 return [G.source[0]+(x-mouth[0])*(baseX-G.source[0])/(foot[0]-mouth[0]),G.source[1],(foot[1]-y)*G.source[2]/(foot[1]-mouth[1])];
}
export const lampSwitch=view=>project(lampWorld(R.lamp.switch),view);
export function bookArmQuad(view=false){
 const {hinge,world,trackX,verticalScale}=R.bookArm,mountX=(G.bookX[0]+G.bookX[1])/2;
 return corners(ASSET_LAYOUTS.lightBracket.frames[0]).map(([x,y])=>{
  const dx=(x-hinge[0])*(mountX-world[0])/(trackX-hinge[0]);
  return project([world[0]+dx,world[1]+dx*(G.bookMountY-world[1])/(mountX-world[0]),world[2]-(y-hinge[1])*verticalScale],view);
 });
}
export function uprightQuad(frame,{x,y,z,height,width,anchor=[.5,1]},view=false){
 return corners(frame).map(([px,py])=>project([x+((px-frame[0])/frame[2]-anchor[0])*width,y,z+(anchor[1]-(py-frame[1])/frame[3])*height],view));
}
export function washQuad(values,view=false){
 const {u,v}=mirrorBasis(values),r=G.mirrorRadius*1.25;
 return [[-1,1],[1,1],[1,-1],[-1,-1]].map(([a,b])=>screen(virtualProjection(G.mirror.map((c,i)=>c+r*(u[i]*a+v[i]*b)),values),view));
}
export function paperDrawing(pose,view=false){
 const goal=pose.proof??LIGHT_TARGET,masks=drawingMasks(pose.values,view),target=drawingMasks(goal.values,view);
 const sheet=polygon(lightPaper(view));
 const ink=(values,flipped,name,className)=>rasterPlane('lightPrint',1,printQuad(values,flipped,false,view),{name,className});
 const shade=(values,name,className)=>rasterPlane('lightBook',0,bookProjectionQuad(values,view),{name,className});
 return `<div class="light-paper-region" style="clip-path:${sheet}">
  <div class="light-reference" style="clip-path:${target.pupil}"><div style="clip-path:${target.clear}">${ink(goal.values,goal.flipped,'reference','light-reference-image')}</div>${shade(goal.values,'reference-book','light-reference-book')}</div>
  <div class="light-cast" style="opacity:${Number(pose.lit)*Number(pose.fitted[1])}"><div data-light-mask="pupil" style="clip-path:${masks.pupil}">
   ${rasterPlane('lightWashes',1,washQuad(pose.values,view),{name:'wash',className:'light-paper-wash'})}
   <div data-light-ink style="opacity:${Number(pose.fitted[0])}"><div data-light-open style="opacity:${1-Number(pose.fitted[2])}">${ink(pose.values,pose.flipped,'projection-open','light-shadow-ink')}</div><div data-light-mask="clear" style="clip-path:${masks.clear};opacity:${Number(pose.fitted[2])}">${ink(pose.values,pose.flipped,'projection','light-shadow-ink')}</div></div>
   <div data-light-block style="opacity:${Number(pose.fitted[2])}">${shade(pose.values,'shadow-book','light-book-shadow')}</div>
  </div></div>
  <div class="light-proof" style="opacity:${pose.proof?1:0};clip-path:${target.pupil}"><div style="clip-path:${target.clear}">${ink(goal.values,goal.flipped,'proof','light-drawn-ink')}</div></div>
 </div>`;
}
