// Measured on the accepted whole painting, not percentages of a dialog.
export const CHOCOLATE_CUPS=Array.from({length:25},(_,i)=>[928+(i%5)*104,414+Math.floor(i/5)*99]);
const ring=(count,radius,offset)=>Array.from({length:count},(_,i)=>{const angle=(offset+i*360/count)*Math.PI/180;return [400+Math.cos(angle)*radius,575+Math.sin(angle)*radius];});
export const CHOCOLATE_PLATE=[[400,575],...ring(6,82,10),...ring(12,164,25),...ring(6,244,0)];
export const CHOCOLATE_SPOTS=[...CHOCOLATE_CUPS,...CHOCOLATE_PLATE];
export const CHOCOLATE_KINDS=[0,3,2,1,0,2,1,0,3,2,1,0,2,1,3,3,2,1,0,1,0,1,3,2,0];
export const CHOCOLATE_NAMES=['星纹巧克力','花纹巧克力','细纹巧克力','牛奶巧克力'];
export const CHOCOLATE_CAMERAS={whole:[0,0,1536,1024],paper:[790,300,665,724]};
export const CHOCOLATE_DRAWER=[801,874,650,138];
export const CHOCOLATE_DRAWER_TRAVEL=108;
export const CHOCOLATE_MATCHBOX=[1096,900,90,75];
export const CHOCOLATE_REWARD_PARTS={width:1536,height:1024,frames:[[40,150,1455,305],[48,553,410,349],[518,552,516,367],[1107,620,371,61],[1107,693,381,167]]};
export const CHOCOLATE_LID=[801,331,650,575];
export const CHOCOLATE_PARTS={width:1536,height:1024,frames:[[26,184,211,207],[242,184,209,208],[454,181,209,209],[667,186,210,204],[48,522,282,269]]};
export const chocolateCamera=view=>view.chocolateView==='paper'?'paper':'whole';
export const chocolatePresentation=(p,view,done)=>({opened:done?view.chocolateClosed!==true:p.opened,drawer:p.drawer});
// The distant box's floor and the serving plate are separate physical planes.
export const CHOCOLATE_ROOM_BOX=[415,400,410,1024*410/1536];
export const CHOCOLATE_ROOM_FLOOR=[[577,575],[1285,648],[1138,837],[320,715]].map(([x,y])=>[415+x*410/1536,400+y*410/1536]);
export const CHOCOLATE_ROOM_LID=[[540,95],[1297,145],[1320,559],[578,475]].map(([x,y])=>[415+x*410/1536,400+y*410/1536]);
export const CHOCOLATE_GRID_QUAD=[[882,365],[1396,365],[1396,859],[882,859]];
export const CHOCOLATE_PLATE_QUAD=[[100,270],[710,270],[710,880],[100,880]];
export const CHOCOLATE_ROOM_PLATE=[[206,567],[487,567],[487,666],[206,666]];
export const CHOCOLATE_ROOM_PATCH=[10.8,58.5,36,14];
export const CHOCOLATE_DRAWER_QUAD=[[801,874],[1451,874],[1451,1012],[801,1012]];
export const CHOCOLATE_ROOM_DRAWER=[[493,608],[737,638],[715,669],[466,638]];
