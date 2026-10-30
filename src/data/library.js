// Authored layout and identity; rules do not know pixels or temporary inspection.
export const LIBRARY_DRAWER_TRAVEL=[80,130];
export const LIBRARY_MODEL={
 width:1331,height:1850,bookHeight:1100,bookFoot:1570,centers:[500,650,800,950,1100],bookArea:[420,400,770,1170],
 housing:[[0,1350],[1331,1350],[1331,1809],[0,1809]],housingCutout:[[352,485],[1410,478],[1410,625],[351,625]],
 front:[[237,1642],[1295,1635],[1295,1782],[236,1782]],
 holder:[245,1290,145,145*310/252],rail:[380,1545,860,860/1106*24],pull:[665.5,1637.25,212.96,148],
 rewardHits:{pageA:[547,1618,240,170],needle:[891,1614,260,170]},
};
export const LIBRARY_BOOKMARKS={0:{figure:0,name:'魈'},2:{figure:1,name:'流浪者'}};
// Physical book sizes are shared by the shelf, its paper diagrams and the room.
export const LIBRARY_BOOK_SCALES=[1,.93,.88,.96,.84];
export const LIBRARY_SPINE_FRACTION=.9;
// Room paint has its own camera; movable books retain their actual order.
export const LIBRARY_ROOM_DRAWER_REGION=[79.55,47.8,8.25,5.15];
export const LIBRARY_ROOM_REWARDS={
 pageA:[[1365,457],[1387,457],[1392,466],[1369,466]],
 needle:[[1406,460],[1428,460],[1431,464],[1408,464]],
};
export const LIBRARY_PLACEMENT={left:78.85,top:31.94,width:7.8};
export const LIBRARY_CAMERA={left:77.5,top:29.15,width:22.2,height:22.2*1672/941/1.5};
export function libraryBounds(opened=false){
 const p=LIBRARY_PLACEMENT,scale=p.width/1331,vertical=scale*1672/941;
 const left=p.left+100*scale,right=p.left+1350*scale;
 const top=p.top+250*vertical,bottom=p.top+(opened?1940:1810)*vertical;
 return {x:(left+right)/2,y:(top+bottom)/2,width:right-left,height:bottom-top};
}
export function libraryDrawerPose(amount){
 const t=Math.max(0,Math.min(1,amount)),[dx,dy]=LIBRARY_DRAWER_TRAVEL,front=LIBRARY_MODEL.front.map(([x,y])=>[x+dx*t,y+dy*t]);
 return {front,bed:[LIBRARY_MODEL.front[0],LIBRARY_MODEL.front[1],front[1],front[0]]};
}
