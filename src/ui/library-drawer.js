import {LIBRARY_MODEL,libraryDrawerPose} from '../data/library.js';
import {rasterPlane,paintPlane,matrixStyle} from './raster-plane.js';
import {rasterStage} from './raster-stage.js';
import {itemSprite} from './dom.js';
import {ITEMS} from '../data/items.js';

export const libraryPlace=([x,y,w,h])=>`left:${x/LIBRARY_MODEL.width*100}%;top:${y/LIBRARY_MODEL.height*100}%;width:${w/LIBRARY_MODEL.width*100}%;height:${h/LIBRARY_MODEL.height*100}%`;

const section=(quad,u0,u1,v0,v1)=>{
 const point=(u,v)=>[0,1].map(i=>(quad[0][i]*(1-u)+quad[1][i]*u)*(1-v)+(quad[3][i]*(1-u)+quad[2][i]*u)*v);
 return [point(u0,v0),point(u1,v0),point(u1,v1),point(u0,v1)];
};
export function libraryRewardPlanes(amount){
 const {bed}=libraryDrawerPose(amount);
 return {page:section(bed,.28,.46,.1,.88),needle:section(bed,.59,.82,.25,.7)};
}
function reward(id,name,quad){
 return `<span class="light-plane library-drawer-item" data-light-plane="library-${name}" data-plane-size="200,200" style="width:200px;height:200px;transform:${matrixStyle(quad,200,200)}">${itemSprite(ITEMS[id].sprite)}</span>`;
}
export function libraryDrawer(progress,owned,miniature){
 const amount=progress.opened?1:0,pose=libraryDrawerPose(amount),planes=libraryRewardPlanes(amount);
 const painting=rasterPlane('librarySupports',0,LIBRARY_MODEL.front)
  +rasterPlane('librarySupports',1,pose.bed,{name:'library-bed'})
  +(!owned.includes('pageA')?reward('pageA','page',planes.page):'')
  +(!owned.includes('needle')?reward('needle','needle',planes.needle):'')
  +rasterPlane('libraryHousing',1,pose.front,{name:'library-front'});
 const pickup=(id,cls)=>progress.opened&&!miniature&&!owned.includes(id)?`<button class="library-reward ${cls}" data-action="collect-item" data-id="${id}" aria-label="拿起${ITEMS[id].name}" style="${libraryPlace(LIBRARY_MODEL.rewardHits[id])}"></button>`:'';
 return `<div class="library-drawer" data-library-drawer data-drawer-amount="${amount}">${rasterStage(painting,LIBRARY_MODEL.width,LIBRARY_MODEL.height)}</div>${pickup('pageA','library-page-reward')}${pickup('needle','library-needle-reward')}`;
}
export function paintLibraryDrawer(drawer,amount){
 if(!drawer)return;
 const pose=libraryDrawerPose(amount),planes=libraryRewardPlanes(amount);
 paintPlane(drawer,'library-front',pose.front);paintPlane(drawer,'library-bed',pose.bed);
 paintPlane(drawer,'library-page',planes.page);paintPlane(drawer,'library-needle',planes.needle);
}
