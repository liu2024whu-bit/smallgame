export const SUGAR_GRID=8;
export const SUGAR_NAMES=['星星饼干','草莓马卡龙','可可松露','樱桃','雏菊酥'];
export const SUGARS=Object.freeze([
 [2,4,0],[0,3,1],[2,0,2],[2,1,3],[1,2,4],
 [2,6,0],[2,5,1],[1,7,2],[1,6,3],[2,7,4],
 [5,3,0],[3,6,1],[5,5,2],[5,4,3],[4,7,4],
 [4,2,0],[7,1,1],[5,1,2],[5,0,3],[4,0,4],
].map(([row,column,type])=>Object.freeze({row,column,type})));

export const SWEETS_PARTS={width:1536,height:1024,frames:[
 [25,34,967,748],[1010,28,505,505],[1030,572,440,23],
 [1024,645,251,145],[1317,660,100,100],[727,833,775,151],[91,780,480,228],
]};
export const SWEETS_FOODS={width:1536,height:1024,frames:[
 [50,62,462,425],[565,108,450,385],[1095,113,385,375],
 [96,526,430,425],[570,530,430,430],[1105,505,385,470],
]};
export const SWEETS_BOARD=[355,200,820,820*748/967];
export const SWEETS_GRID=[415,260,700,520];
export const SWEETS_RAILS={left:370,right:1160,top:220,bottom:825};
export const SWEETS_PLATES=[[160,300],[1375,300],[160,770],[1375,770]];
export const SWEETS_PLATE_SIZE=300;
export const SWEETS_CARD=[114.8,310,90.4,134];
export const SWEETS_ROOM={x:85,y:270,scale:735/1536};
export const SWEETS_CAMERAS={whole:[0,0,1536,1024],board:[310,170,885,845]};
const [gx,gy,gw,gh]=SWEETS_GRID;

export const sweetsPlate=(index,served)=>[SWEETS_PLATES[index][0],SWEETS_PLATES[index][1]-(served&&index===0?140:0)];
export const sweetsGroup=(sugar,cuts)=>(sugar.row>=cuts[0]?2:0)+Number(sugar.column>=cuts[sugar.row>=cuts[0]?2:1]);
export function sweetsPosition(index,p){
 const sugar=SUGARS[index];
 if(!p.served)return [gx+(sugar.column+.5)*gw/8,gy+(sugar.row+.5)*gh/8];
 const group=sweetsGroup(sugar,p.cuts),[x,y]=sweetsPlate(group,true);
 const offsets=[[-48,-42],[45,-42],[0,10],[-45,62],[45,62]];
 return [x+offsets[sugar.type][0],y+offsets[sugar.type][1]];
}
export function sweetsCord(index,cuts){
 const y=gy+cuts[0]*gh/8,x=gx+cuts[index]*gw/8;
 const {left,right,top,bottom}=SWEETS_RAILS;
 if(index===0)return {start:[left+15,y],length:right-left-15,angle:0,grip:[left,y],end:[right,y]};
 if(index===1)return {start:[x,top+15],length:y-top-15,angle:90,grip:[x,top],end:[x,y]};
 return {start:[x,y],length:bottom-y,angle:90,grip:[x,bottom],end:[x,y]};
}
export const sweetsCamera=(p,view)=>!p.served&&view.sweetsView==='board'?'board':'whole';
