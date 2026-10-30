// All positions are measured on the shared 1536 × 1024 painted music box.
export const MUSIC_CAMERA=[0,5,1485,950];
export const MUSIC_LEVELS=[661,611,565,519,472];
export const MUSIC_LANES=[[503,472,490,661],[610,472,600,661],[713,472,710,661],[819,472,820,661],[925,472,931,661],[1027,472,1042,661]];
export const MUSIC_LABELS=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ'];
export const MUSIC_PARTS={width:1536,height:1024,frames:[[105,345,815,350],[1150,445,270,230]]};
export const MUSIC_BODY={width:1536,height:1024,frames:[[0,0,1536,1024],[422,120,270,202],[840,120,272,202]]};
export const MUSIC_CRANK_FRAMES={width:1536,height:1024,frames:Array.from({length:6},(_,i)=>[i%3*512,Math.floor(i/3)*512,512,512]),anchors:[[88,222],[88,222],[88,222],[88,218],[88,218],[88,220]]};
export const MUSIC_CRANK={rect:[1104,448,280,280],pivot:[1154,574],scale:.52};
export function musicCrankStyle(index){const [x,y]=MUSIC_CRANK_FRAMES.anchors[index],[left,top]=MUSIC_CRANK.rect,{pivot,scale}=MUSIC_CRANK;return `left:${pivot[0]-left-x*scale}px;top:${pivot[1]-top-y*scale}px;width:${512*scale}px;height:${512*scale}px;opacity:${index===0?1:0};`;}
// The Chinese lettering is separate from the bitmap so the author's copy stays editable.
export const MUSIC_PAPER_LINES=[['Ⅰ 最低格','Ⅵ 与Ⅰ同高','Ⅱ 比Ⅰ高两格'],['Ⅲ 比Ⅱ低一格','Ⅳ 比Ⅱ高一格','Ⅴ 比Ⅳ低一格']];
export const MUSIC_LID_SOURCE=[[404,106],[1130,105],[1120,327],[414,329]];
export const MUSIC_LID_ROOM=[[1256,469],[1347,468],[1347,521],[1257,521]];
export const MUSIC_PLATE_SOURCE=[[425,438],[1120,438],[1140,721],[393,720]];
export const MUSIC_PLATE_ROOM=[[1258,533],[1348,533],[1358,560],[1252,560]];
export function musicPoint(index,note){const [a,top,b,bottom]=MUSIC_LANES[index],n=Math.max(0,Math.min(4,note)),i=Math.min(3,Math.floor(n)),t=n-i,y=MUSIC_LEVELS[i]+(MUSIC_LEVELS[i+1]-MUSIC_LEVELS[i])*t;return [b+(a-b)*(bottom-y)/(bottom-top),y];}
export function musicNoteAt(index,y){if(y>=MUSIC_LEVELS[0])return 0;if(y<=MUSIC_LEVELS[4])return 4;for(let i=0;i<4;i++)if(y>=MUSIC_LEVELS[i+1])return i+(MUSIC_LEVELS[i]-y)/(MUSIC_LEVELS[i]-MUSIC_LEVELS[i+1]);return 0;}
export function musicPinStyle(index,note){const [x,y]=musicPoint(index,note);return `left:${x}px;top:${y}px;`;}
