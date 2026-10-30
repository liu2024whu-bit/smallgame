// Pixel frames and hinge locations belong to this prop, not its puzzle rules.
export const PRESS_MARKS = ['△','○','□'];
export const PRESS_NAMES = ['三角','圆圈','方框'];
export const PRESS_MAIN = {
 width:1536,height:1024,
 frames:[[24,190,941,638],[946,100,578,237],[963,568,558,295]],
 clips:{0:'polygon(0 0,81% 0,81% 25%,100% 25%,100% 100%,0 100%)'}
};
export const PRESS_PARTS = {
 width:1536,height:1024,
 frames:[[286,45,261,332],[851,85,637,262],[73,395,692,317],[814,442,664,214],
 [54,750,177,202],[247,786,121,150],[391,775,156,156],[577,759,170,194],[771,789,208,138],[1062,746,394,176]]
};
export const PRESS_HANDLE={
 width:1536,height:1024,
 frames:Array.from({length:6},(_,i)=>[i%3*512,Math.floor(i/3)*512,512,512]),
 anchors:[[67,238],[67,238],[66,238],[67,238],[67,239],[64,238]],
};
export const PRESS_WORLD = {left:48.8,top:46.8,width:9.4};
export const PRESS_PROOF = {left:-34,top:100,width:36};
export function pressProofBounds(){
 const sceneRatio=1672/941,bodyHeight=PRESS_WORLD.width*sceneRatio*638/941;
 const width=PRESS_WORLD.width*PRESS_PROOF.width/100;
 const paperHeight=width*sceneRatio*214/664;
 return {x:PRESS_WORLD.left+PRESS_WORLD.width*PRESS_PROOF.left/100+width/2,
  y:PRESS_WORLD.top+bodyHeight*PRESS_PROOF.top/100+paperHeight/2,width:width+1,height:4.8};
}
export const PRESS_BOOKMARK={view:[240,180],wood:[[60,84],[65,64],[240,92],[237,112]],cord:[[57,74],[89,74],[89,158],[57,158]]};
