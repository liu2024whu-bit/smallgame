// Reuse the actual room composition, including its present puzzle state.
// This is a crop in one coordinate system, not an unrelated close-up backdrop.
export function sceneSource(picture,{left,top,width,height}){
 return `<div class="scene-source" inert aria-hidden="true"><div class="scene-source-picture" style="left:${-left/width*100}%;top:${-top/height*100}%;width:${10000/width}%;height:${10000/height}%">${picture}</div></div>`;
}
