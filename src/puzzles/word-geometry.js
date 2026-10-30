import {WORD_DESK,WORD_ROOM_CAMERA,WORD_BOARD,WORD_PAGE_AREA,WORD_BINDING_AREA} from '../data/wordlock.js';
export {WORD_DESK,WORD_ROOM_CAMERA,WORD_INPUT_CAMERA} from '../data/wordlock.js';
export function projectWord([x,y,z],camera=WORD_ROOM_CAMERA){
 if(camera.kind==='ortho')return [camera.center[0]+x*camera.scale,camera.center[1]-(y*Math.sin(camera.pitch)+z*Math.cos(camera.pitch))*camera.scale,y*Math.cos(camera.pitch)-z*Math.sin(camera.pitch)];
 const [cx,cy,cz]=camera.from,dy=camera.target[1]-cy,dz=camera.target[2]-cz,length=Math.hypot(dy,dz),fy=dy/length,fz=dz/length,uy=-fz,uz=fy;
 const rx=x-cx,ry=y-cy,rz=z-cz,depth=ry*fy+rz*fz;
 return [camera.center[0]+rx*camera.focal/depth,camera.center[1]-(ry*uy+rz*uz)*camera.focal/depth,depth];
}
export const worldQuad=(quad,camera)=>quad.map(p=>projectWord(p,camera).slice(0,2));
export function keyboardBed(){const k=WORD_DESK.keyboard;return [[-k.bedWidth/2,k.bedBack,k.bedHeight],[k.bedWidth/2,k.bedBack,k.bedHeight],[k.bedWidth/2,k.bedFront,k.bedHeight],[-k.bedWidth/2,k.bedFront,k.bedHeight]];}
export function keyWorldQuad(key){
 const k=WORD_DESK.keyboard,u=18,x=-k.bedWidth/2+key.x*u,y=k.bedBack-key.y*u;
 return [[x,y,k.bedHeight],[x+key.w*u,y,k.bedHeight],[x+key.w*u,y-key.h*u,k.bedHeight],[x,y-key.h*u,k.bedHeight]];
}
export function boxFront(){const b=WORD_DESK.box;return [[-b.width/2,b.front,b.height],[b.width/2,b.front,b.height],[b.width/2,b.front,0],[-b.width/2,b.front,0]];}
export function boxTop(){const b=WORD_DESK.box;return [[-b.width/2,b.front+b.depth,b.height],[b.width/2,b.front+b.depth,b.height],[b.width/2,b.front,b.height],[-b.width/2,b.front,b.height]];}
export function boxFloor(){const b=WORD_DESK.box,d=WORD_DESK.drawer;return [[-d.width/2,b.front+b.depth,d.base],[d.width/2,b.front+b.depth,d.base],[d.width/2,b.front,d.base],[-d.width/2,b.front,d.base]];}
export function drawerFront(amount=0){const b=WORD_DESK.box,d=WORD_DESK.drawer,y=b.front-amount*d.travel;return [[-d.width/2,y,d.base+d.height],[d.width/2,y,d.base+d.height],[d.width/2,y,d.base],[-d.width/2,y,d.base]];}
export function drawerFloor(amount=0,from=0,to=1){const b=WORD_DESK.box,d=WORD_DESK.drawer,y=b.front-amount*d.travel;return [[-d.width/2,y+d.depth*to,d.floor],[d.width/2,y+d.depth*to,d.floor],[d.width/2,y+d.depth*from,d.floor],[-d.width/2,y+d.depth*from,d.floor]];}
export function drawerSide(amount=0,side=-1,from=0,to=1){
 const b=WORD_DESK.box,d=WORD_DESK.drawer,y=b.front-amount*d.travel,x=side*d.width/2;
 return [[x,y+d.depth*to,d.base+d.height],[x,y+d.depth*from,d.base+d.height],[x,y+d.depth*from,d.floor],[x,y+d.depth*to,d.floor]];
}
export function wordGripPoint(amount,camera){const d=WORD_DESK.drawer;return projectWord([0,WORD_DESK.box.front-amount*d.travel,d.base+d.height/2],camera).slice(0,2);}
// The board and papers ride with the drawer, then disappear behind the fascia.
// Use the same millimetres and camera as its floor instead of a screen offset.
export function wordAssemblyPlanes(camera,amount=1){
 const d=WORD_DESK.drawer,b=WORD_DESK.box,travel=(1-amount)*d.travel;
 const move=quad=>worldQuad(quad.map(([x,y,z])=>[x,y+travel,z]),camera);
 const front=b.front-amount*d.travel;
 return {board:move(WORD_BOARD),album:move(WORD_PAGE_AREA),stitch:move(WORD_BINDING_AREA),clip:worldQuad([[-d.width/2,b.front,30],[d.width/2,b.front,30],[d.width/2,front,30],[-d.width/2,front,30]],camera)};
}
export function drawerAmountForY(y,camera){
 const start=wordGripPoint(0,camera)[1],end=wordGripPoint(1,camera)[1];
 if(y<=start)return 0;if(y>=end)return 1;
 let lo=0,hi=1;for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(wordGripPoint(mid,camera)[1]<y)lo=mid;else hi=mid;}return (lo+hi)/2;
}
