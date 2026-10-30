export const BIRTHDAY_GRID=[[9,8,4,4],[3,7,1,7],[6,5,2,6],[3,0,8,1]];
export const BIRTHDAY_HOLES=[1,3,0,1];
export const BIRTHDAY_CODE=BIRTHDAY_HOLES.map((row,column)=>BIRTHDAY_GRID[row][column]);
export const BIRTHDAY_INPUTS=['birthdayCard','birthdayRibbon','mirror'];
export const birthdayCell=(row,column)=>[80+column*80,35+row*30];
export const GIFT_CARD={width:1536,height:1024,frames:[[38,102,290,430],[370,102,285,418],[704,152,797,364],[298,578,943,362]]};
export const BIRTHDAY_BOX_PARTS={width:1536,height:1024,frames:[[38,193,746,732],[783,34,729,308],[808,373,701,548]]};
export const BIRTHDAY_HARDWARE={width:1536,height:1024,frames:[[113,278,468,424],[710,387,341,230],[1219,232,207,524]]};
export const DECODER_ROOM=[760,0],DECODER_WORLD=[760,1024];
export const DECODER_BODY=[90,205,570,650],DECODER_LID=[90,35,570,186],DECODER_GARDEN=[150,395,450,352];
export const DECODER_CARD=[245,525,130,130*362/943],DECODER_FOLDED=[245,514,43.2,64];
export const DECODER_PRINT=[245,524,130,52];
export const DECODER_PAPER_SEED=[18,8],DECODER_MIRROR_SEED=[500,550];
export const DECODER_MIRROR={width:103.7,height:140,aperture:[.05,.025,.9,.665]};
export const DECODER_MIRROR_RANGE=[287,528,541,565],DECODER_PAPER_RANGE=[-10,35,-25,25];
export const DECODER_CAMERAS={work:[220,480,360,300],whole:[60,120,700,900],paper:[235,490,345,165],lock:[265,630,280,160],open:[60,0,700,1024],garden:[135,340,500,455]};
export const DECODER_WINDOWS=[[1052,678,27.5,51.8],[1092.5,678,27.5,51.8],[1133,678,27.5,51.8],[1173.5,678,27.5,51.8]];
export const DECODER_LATCH=[1207,680,50,50];
export const boundedPoint=(p,x0,x1,y0,y1)=>Array.isArray(p)&&p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1;
export const clampPoint=(p,x0,x1,y0,y1)=>[Math.max(x0,Math.min(x1,p[0])),Math.max(y0,Math.min(y1,p[1]))].map(v=>Math.round(v*10)/10);
export const decoderStage=p=>Number(p.opened)+':'+Number(p.lid);
export function decoderCamera(p,view={}){
 const requested=view.decoderStage===decoderStage(p)?view.decoderView:'work';
 if(p.lid)return requested==='garden'?'garden':'open';
 return ['whole','paper','lock'].includes(requested)?requested:'work';
}
export const boxCanTurn=state=>!state.solved.includes('ribbons')||!state.progress.birthdayLock.lid&&!state.progress.birthdayLock.fitted.some(Boolean);
export const decoderPaperOffset=point=>clampPoint(point,...DECODER_PAPER_RANGE).map(v=>Math.abs(v)<=1.8?0:v);
export const decoderMirrorPoint=point=>clampPoint(point,...DECODER_MIRROR_RANGE);
export function birthdayHolePoint(column,{turned=false,stripBack=false}={}){
 let [x,y]=birthdayCell(BIRTHDAY_HOLES[column],column);
 if(stripBack)x=400-x;
 if(turned){x=400-x;y=160-y;}
 return [x,y];
}
export function decoderReflection([cx,cy],width,height){return [-1,0,0,1,width/2+cx,height/2-cy];}
