export const GARDEN_SIZE=[1536,1152];
export const GARDEN_CENTERS=[450,768,1085],GARDEN_LEVELS=[640,520,400,280];
export const GARDEN_CRANKS=[[439,756],[759,756],[1098,756]],GARDEN_SLOTS=[[442,692],[768,692],[1099,692]];
export const GARDEN_CAMERAS={whole:[0,0,1536,1152],left:[185,0,530,870],middle:[505,0,530,870],right:[835,0,530,870]};
export const GARDEN_PARTS=[[89,40,390,535],[577,40,382,535],[1087,40,380,535],[90,697,252,214],[420,610,1074,121],[409,751,1095,183]];
export const GARDEN_BOOK=[[366,35,228,967],[871,17,441,995]];
export const GARDEN_BOOK_HEIGHT=165,GARDEN_BOOK_DEPTH=110;
export const GARDEN_DRAWER={x:276,front:838,width:982,travel:150,back:850,grip:884};

export const GARDEN_PLANTS=Object.freeze(["daisy","tulip","lavender"]);
export const GARDEN_NAMES=Object.freeze(["雏菊","郁金香","薰衣草"]);
export const GARDEN_PAIRS=Object.freeze(["左和中","中和右","左和右"]);
// Painted room anchors may simplify the close-up, while keeping the same
// rails, four heights, bookmark slots and actual drawer contents.
export const GARDEN_ROOM_SIZE=[1672,941];
export const GARDEN_ROOM_PAPER_SCALE=31*1672/153600;
export const GARDEN_ROOM_PARTS={width:1536,height:1024,frames:[[40,60,475,610],[548,58,460,612],[1050,28,462,642]]};
export const GARDEN_ROOM_CENTERS=[1243,1358,1474];
export const GARDEN_ROOM_PLANT_ANCHORS=[[282,651],[777,651],[1280,651]];
export const GARDEN_ROOM_LEVELS=[508,468,428,388];
export const GARDEN_ROOM_SLOTS=[[1241,518],[1357,518],[1477,518]];
export const GARDEN_ROOM_DRAWER_REGION=[69.2,59.5,24.7,12.2];
export const GARDEN_ROOM_BOARD=[[1306,593],[1381,593],[1398,616],[1301,616]];
export function gardenRoomPlantBox(index,height){
 const [x,y,w,h]=GARDEN_ROOM_PARTS.frames[index],scale=78/w,[ax,ay]=GARDEN_ROOM_PLANT_ANCHORS[index];
 const baseline=GARDEN_ROOM_LEVELS[0]+height*(GARDEN_ROOM_LEVELS[1]-GARDEN_ROOM_LEVELS[0]);
 return [GARDEN_ROOM_CENTERS[index]-(ax-x)*scale,baseline-(ay-y)*scale,78,h*scale];
}
export function gardenBounds(opened=false){
 const [w,h]=GARDEN_ROOM_SIZE,box=[1160,270,405,opened?400:345];
 return {x:(box[0]+box[2]/2)/w*100,y:(box[1]+box[3]/2)/h*100,width:box[2]/w*100,height:box[3]/h*100};
}
