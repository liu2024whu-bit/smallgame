export const FILM_SIZE=1254;
export const FILM_CLOSED_SIZE=[1536,1024];
export const FILM_MOTIFS=Object.freeze(['rose','cloud','daisy','star']);
export const FILM_NAMES=Object.freeze(['玫瑰','云','雏菊','星星']);
export const FILM_WINDOWS=Object.freeze({movie:[245,112,765,592],clips:[198,800,855,105],leaves:[220,900,810,120],latch:[565,1080,125,80],pocket:[130,1033,995,176]});
export const FILM_PAPER=Object.freeze({centers:[277,508,748,976],base:1000,height:98});
export const FILM_CAMERAS=Object.freeze({whole:[0,0,1254,1254],movie:[215,92,825,632],clips:[145,720,970,325],tail:[120,890,1010,364]});
export const FILM_REWARD_CAMERA=Object.freeze([390,1005,480,249]);
export const FILM_SOURCE=Object.freeze({left:79.5,top:67.7,width:9.4,height:7.2});
// The newly painted left-side camera puts both low feet on the same box top.
const width=7.6,height=width*(1672/941)/(1536/1024);
export const FILM_PLACEMENT=Object.freeze({left:1347/1672*100-343/1536*width,top:691/941*100-820/1024*height,width,height,foot:[343,820],roll:0});
export function filmRoomBounds(){
 const p=FILM_PLACEMENT;
 return {x:p.left+820/1536*p.width,y:p.top+620/1024*p.height,width:1300/1536*p.width,height:420/1024*p.height};
}
export const FILM_PARTS=Object.freeze({width:1536,height:1024,frames:[[77,123,992,307],[1138,195,365,188],[53,522,1168,383],[1306,701,145,150]]});
const front=[228,591,950,1313],back=[228,590,950,1314];
export const FILM_PAPERS=Object.freeze({width:1536,height:1024,frames:[...front.map(x=>[x-150,48,300,440]),...back.map(x=>[x-150,526,300,440])]});
