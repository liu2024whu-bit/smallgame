// Ink weights measured from campusRubbing at its SVG placement (80×60 at x=10).
// Blank paper cannot contribute to completion; the grid is never displayed.
export const RUBBING_INK=Object.freeze([
 [0,0,33,104,106,136,208,154,64,0,0,24,101,145,168,170,181,25,0,0],
 [0,0,40,181,207,179,336,365,335,148,99,222,234,246,262,254,279,72,0,0],
 [0,0,56,186,177,194,269,381,350,286,291,262,239,278,279,297,295,75,0,0],
 [0,0,38,189,270,340,207,332,325,224,224,229,216,222,248,283,211,36,0,0],
 [0,0,0,107,205,219,213,205,181,133,132,150,173,178,215,195,167,11,0,0],
].flatMap((row,y)=>row.flatMap((weight,x)=>weight?[{x:x*5+2.5,y:y*5+22.5,weight}]:[])));
export const RUBBING_SHEET=Object.freeze({left:35.6,top:33.5,width:54.8,height:47.5});
export const RUBBING_PENCIL=Object.freeze({x:35.8,y:56.35,width:37.2,angle:-4,writingAngle:80});
export const RUBBING_KEY_ROWS=Object.freeze([22.5,27.5,32.5,37.5,42.5]);
