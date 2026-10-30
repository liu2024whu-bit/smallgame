import {SCREEN_FACES} from '../puzzles/screen.js';
// Source-pixel geometry in the painted cabinet; screen.js in puzzles owns rules.
export const SCREEN_PEOPLE=['富冈义勇','不死川实弥','伊黑小芭内'];
export const SCREEN_PATTERNS=['水纹','风痕','白蛇'];
export const SCREEN_ROOM_REGION=[41.7,39.5,22.3,25.9];
export const SCREEN_ROOM_POCKET_REGION=[54.2,58,8.8,5.3];
export const SCREEN_PRINT_FACES=SCREEN_FACES;
export const SCREEN_PAPER=Object.freeze([110,300,1320,400]);
export const SCREEN_CAMERAS=Object.freeze({whole:[0,0,1536,1024],lock:[208,745,640,240],pocket:[862,727,640,250]});
export const SCREEN_PLACEMENT=Object.freeze({left:42.7,top:40.6,width:20.5,height:20.5*(1672/941)/(1536/1024)});
export const screenPaperCamera=group=>[70+440*group,20,510,756];
export const SCREEN_NUMBERS=[245,375,505].map(x=>[x,787,90,108]);
export const SCREEN_NAMES=[[300,243,180,33],[674,239,180,33],[1060,243,180,33]];
export const SCREEN_REWARDS=Object.freeze({pageB:[930,788,235,112],pulley:[1190,788,215,112]});
export const SCREEN_POCKET=Object.freeze([886,768,575,152]);
export const SCREEN_PARTS=Object.freeze({width:1536,height:1024,frames:[[38,42,208,714],[371,42,208,714],[651,140,846,288],[738,514,235,95],[46,874,898,14],[1037,650,160,277]]});
export const SCREEN_INK_ASSETS=Object.freeze(['screenWater','screenWind','screenSerpent']);
export const SCREEN_FRONT_DIGITS=Object.freeze([9,0,8]);
export const SCREEN_CARRIER_GRIPS=[0,1,2].map(i=>[220+440*i,670,72,46]);
export function screenMaskPoint(index,face,u,v){
 const part=index%3,piece=face===SCREEN_PRINT_FACES[index]?part:(part+1)%3;
 return [(Math.floor(index/3)*3+piece+u)/9,.5+(v-.5)*SCREEN_PAPER[3]/(SCREEN_PAPER[2]/3)];
}
export const screenGripClip=(y,height)=>Math.max(0,Math.min(100,(SCREEN_PAPER[1]+SCREEN_PAPER[3]-y)/height*100));
