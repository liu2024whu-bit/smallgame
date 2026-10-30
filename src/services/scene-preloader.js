import {SCENE_ART,ASSETS,ROOM_DETAIL_ASSETS} from '../data/assets.js';
import {BASE_SCENE_PAINT,SCENE_CHANGES} from '../data/scene-changes.js';
import {openScenes,neighborScene} from '../core/exploration.js';

export function scenePreloadSources(state){
 const available=openScenes(state);if(!available.length)return [];
 const scenes=new Set([state.scene,neighborScene(state,-1),neighborScene(state,1)]);
 const sources=[];
 for(const id of scenes){
  sources.push(SCENE_ART[id]);
  for(const paint of [...BASE_SCENE_PAINT,...SCENE_CHANGES])if(paint.scene===id)sources.push(ASSETS[paint.asset]);
  for(const asset of ROOM_DETAIL_ASSETS[id]??[])sources.push(ASSETS[asset]);
 }
 return [...new Set(sources.filter(Boolean))];
}

export function createScenePreloader(){
 const prepared=new Set();
 return state=>{
  for(const src of scenePreloadSources(state)){
   if(prepared.has(src))continue;
   prepared.add(src);const image=new Image();image.decoding='async';image.onerror=()=>prepared.delete(src);image.src=src;
   image.decode?.().catch(()=>prepared.delete(src));
  }
 };
}
