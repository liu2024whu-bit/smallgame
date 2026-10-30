import {PRESS_PROOF} from './press.js';
// Same printing box, drawer, camera and paper as P3; only its thin inner floor
// and stamp seats are new. All positions below are original source pixels.
export const BACK_SIZE=[1536,1024];
export const BACK_CASE={x:500,y:200,width:820};
export const BACK_CAMERAS={whole:[40,30,1440,960],tray:[580,600,650,330],mirror:[120,500,500,430]};
export const BACK_PARTS={width:1536,height:1024,frames:[[28,192,748,336],[790,251,726,239],[43,648,211,207],[261,648,196,207],[478,648,197,207],[692,648,194,207],[901,648,203,207],[1168,653,324,225]]};
export const BACK_RECORD={x:BACK_CASE.x+BACK_CASE.width*PRESS_PROOF.left/100,y:BACK_CASE.y+BACK_CASE.width*638/941*PRESS_PROOF.top/100,width:BACK_CASE.width*PRESS_PROOF.width/100};
export const BACK_MIRROR={x:352,y:524,width:210};
