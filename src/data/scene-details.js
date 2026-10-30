import {SCENE_BY_ID,hotspotBounds} from './scenes.js';

// Physical origins are separate from the pages associated with an object.
// Rectangles are top-left percentages in the same source painting as the room.
export const SCENE_DETAILS=Object.freeze({
 'wall-naruto':{scene:'collection',collection:'naruto',crop:{left:13,top:16,width:17,height:38},open:'看看稿本',back:'回到墙边'},
 'shelf-genshin':{scene:'collection',collection:'genshin',crop:{left:57,top:4,width:31,height:20},open:'翻翻画册',back:'回到架边'},
});

export function puzzleSource(state,id){
 const spot=SCENE_BY_ID[state.scene]?.hotspots.find(h=>h.kind==='puzzle'&&(h.target===id||h.revisit===id)||h.kind==='album'&&['album','stitch'].includes(id));
 if(!spot)return null;
 const bounds=hotspotBounds(spot,state),width=Math.min(70,Math.max(28,bounds.width*1.65)),height=Math.min(75,Math.max(32,bounds.height*1.6));
 const crop={left:Math.max(0,Math.min(100-width,bounds.x-width/2)),top:Math.max(0,Math.min(100-height,bounds.y-height/2)),width,height};
 return {crop,label:spot.label,scene:SCENE_BY_ID[state.scene].title,aspect:width/height*(state.scene==='party'?1.5:1672/941)};
}
