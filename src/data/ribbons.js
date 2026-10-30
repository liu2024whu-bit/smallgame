export const RIBBON_NAMES=['玫瑰点纹','麦色斜纹','鼠尾草叶纹','蓝灰格纹','淡紫织纹','亚麻针脚'];
export const RIBBON_LAYERS=[0,1,4,2,3,5];
export const RIBBON_TAIL_SIDES=[0,1,0,1,1,0];
// Both faces start at the same through-slit, mirrored across the box.
export const RIBBON_PATHS=[
 [[[18,30],[62,30]],[[30,18],[30,82]],[[40,48],[83,48]],[[50,18],[50,58]],[[18,66],[83,66]],[[70,38],[70,82]]],
 [[[82,30],[25,30]],[[70,18],[70,82]],[[60,48],[88,48]],[[50,18],[50,82]],[[82,66],[20,66]],[[30,38],[30,22]]],
];
export function crossing(a,b){
 const [[ax,ay],[bx,by]]=a,[[cx,cy],[dx,dy]]=b,det=(bx-ax)*(dy-cy)-(by-ay)*(dx-cx);
 if(!det)return null;
 const t=((cx-ax)*(dy-cy)-(cy-ay)*(dx-cx))/det,u=((cx-ax)*(by-ay)-(cy-ay)*(bx-ax))/det;
 return t>0&&t<1&&u>0&&u<1?[ax+t*(bx-ax),ay+t*(by-ay)]:null;
}
export function ribbonBlockers(index){return RIBBON_LAYERS.slice(RIBBON_LAYERS.indexOf(index)+1).filter(other=>RIBBON_PATHS.some(face=>crossing(face[index],face[other])));}
export const RIBBON_BODIES={width:1536,height:1024,frames:[[44,150,704,728],[799,150,708,728]]};
export const RIBBON_PARTS={width:1536,height:1024,frames:[...Array.from({length:6},(_,i)=>[60,50+i*120,1420,112]),[44,843,238,85],[332,785,226,181],[590,772,478,220],[1109,791,390,181],...Array.from({length:6},(_,i)=>[65,53+i*120,80,106]),...Array.from({length:6},(_,i)=>[1325,50+i*120,150,112])]};
export const RIBBON_PAPER={width:1536,height:1024,frames:[RIBBON_PARTS.frames[8]]};
export const RIBBON_TEXTURES=Array.from({length:6},(_,i)=>[200,66+i*120,240,80]);
export const RIBBON_WORLD=[760,850],RIBBON_BODY=[90,35,570,650],RIBBON_FIELD=[145,95,450,390];
export const RIBBON_ROOM=[760,170];
export const RIBBON_CAMERAS={whole:[70,0,690,850],weave:[110,105,520,420]};
export const RIBBON_SLEEVE=[470,695,165,77],RIBBON_REWARD=[482,678,130,52];
export const RIBBON_ROLLS=[[110,735],[190,774],[270,733],[350,770],[414,723],[438,785]];
export function ribbonGeometry(back,index,pull=0){
 const [a,b]=RIBBON_PATHS[Number(back)][index].map(([x,y])=>[RIBBON_FIELD[0]+x*RIBBON_FIELD[2]/100,RIBBON_FIELD[1]+y*RIBBON_FIELD[3]/100]);
 const length=Math.hypot(b[0]-a[0],b[1]-a[1]),direction=[(b[0]-a[0])/length,(b[1]-a[1])/length];
 return {a,b:[b[0]+direction[0]*pull,b[1]+direction[1]*pull],length:length+pull,direction,angle:Math.atan2(direction[1],direction[0])*180/Math.PI};
}
