// One measured registration for materials, physical slots, weighing and input.
export const BALANCE_SIZE=[1536,1024];
export const BALANCE_PARTS={width:1536,height:1024,frames:[[104,5,522,1002],[773,331,548,640]]};
export const BALANCE_BEAM={width:2172,height:724,frames:[[30,220,2112,280]]};
export const BALANCE_WEIGHTS={width:1536,height:1024,frames:[[54,180,522,285],[666,96,287,385],[1134,54,309,434],[43,612,465,310],[570,569,438,351],[1017,571,488,352]]};
export const BALANCE_MASSES=[2,5,7,3,9,6];
export const BALANCE_NAMES=['小鱼','橡果','铃铛','蜗牛','小鸟','茶壶'];
export const BALANCE_CROWDED='这里有点挤。';
export const BALANCE_RECORDS=[{left:[0,1],right:[2]},{left:[0,3],right:[1]},{left:[0,4],right:[1,5]}];
export const BALANCE_ANCHORS=[[302,454],[812,472],[1288,480],[298,916],[722,912],[1270,916]];
export const BALANCE_WIDTHS=[80,60,69,84,75,88];
const postScale=.535,beamScale=270/965.5,panScale=260/548;
export const BALANCE_PIVOT=[800,35+(184-5)*postScale];
export const BALANCE_POST=[800-(368-104)*postScale,35,522*postScale,1002*postScale];
export const BALANCE_BEAM_ORIGIN=[(1086-30)*beamScale,(362-220)*beamScale];
export const BALANCE_BEAM_RECT=[BALANCE_PIVOT[0]-BALANCE_BEAM_ORIGIN[0],BALANCE_PIVOT[1]-BALANCE_BEAM_ORIGIN[1],2112*beamScale,280*beamScale];
export const BALANCE_PAN_SIZE=[260,640*panScale],BALANCE_PAN_ORIGIN=[(1046-773)*panScale,(379-331)*panScale];
export const BALANCE_FLOOR=(867-379)*panScale;
export const BALANCE_CAMERAS={whole:[40,20,1460,860],paper:[75,450,340,270]};
export const BALANCE_NOTE=[[142,489],[349,477],[372,669],[156,691]];
export const BALANCE_TABLE=Array.from({length:6},(_,i)=>[350+i*190,786]);
// Room tabletop depth is registered separately from the upright mechanism.
export const BALANCE_ROOM={origin:[397,437.7],scale:.22,region:[25.7,44.4,16,21],table:Array.from({length:6},(_,i)=>[(532+i*25.3-397)/.22,(593-437.7)/.22]),note:[[450,545],[492,545],[490,594],[446,594]],hotspot:{x:33.8,y:56,width:14.8,height:18.5}};
export const balanceRect=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
export function balanceLoads(places,held=-1){
 return [6,9].map(start=>places.reduce((sum,slot,i)=>sum+(i!==held&&slot>=start&&slot<start+3?BALANCE_MASSES[i]:0),0));
}
export function balanceLean(places,held=-1){const[a,b]=balanceLoads(places,held),d=b-a;return Math.sign(d)*Math.min(10,2+Math.abs(d)*.5);}
export function balanceSuspension(pan,lean=0){
 const a=lean*Math.PI/180,dx=pan===0?-270:270;
 return [BALANCE_PIVOT[0]+dx*Math.cos(a),BALANCE_PIVOT[1]+dx*Math.sin(a)];
}
export function balanceSlotPoint(slot,lean=0,sway=0){
 if(slot<6)return BALANCE_TABLE[slot];
 const p=balanceSuspension(slot<9?0:1,lean),a=sway*Math.PI/180,x=((slot-6)%3-1)*80;
 return [p[0]+x*Math.cos(a)-BALANCE_FLOOR*Math.sin(a),p[1]+x*Math.sin(a)+BALANCE_FLOOR*Math.cos(a)];
}
export function weightRect(index,point,width=BALANCE_WIDTHS[index]){
 const[fX,fY,w,h]=BALANCE_WEIGHTS.frames[index],a=BALANCE_ANCHORS[index],s=width/w;
 return [point[0]-(a[0]-fX)*s,point[1]-(a[1]-fY)*s,width,h*s];
}
export function weightOrigin(index){const[x,y,w]=BALANCE_WEIGHTS.frames[index],s=BALANCE_WIDTHS[index]/w;return BALANCE_ANCHORS[index].map((v,i)=>(v-[x,y][i])*s);}
