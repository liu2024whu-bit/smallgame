// Measured from the painted keybed: two octaves with their final C, C4–C6.
export const PIANO_WHITE_NOTES=Object.freeze([0,2,4,5,7,9,11,12,14,16,17,19,21,23,24]);
export const PIANO_BLACK_NOTES=Object.freeze([1,3,6,8,10,13,15,18,20,22]);
export const PIANO_FRAGMENTS=Object.freeze([
 {notes:[0,4],face:1,left:'leaf',right:'moon'},
 {notes:[7,5],face:0,left:'star',right:null},
 {notes:[2,9],face:1,left:null,right:'leaf'},
 {notes:[4,0],face:0,left:'moon',right:'star'},
]);
export const PIANO_ORDER=Object.freeze([2,0,3,1]);
export const PIANO_RESPONSE=Object.freeze(PIANO_ORDER.flatMap(id=>PIANO_FRAGMENTS[id].notes).reverse().map(note=>note+12));
export const PIANO_SIZE=Object.freeze([1536,1024]);
export const PIANO_CAMERA=Object.freeze([90,145,1360,765]);
export const PIANO_TOUCH_CAMERAS=Object.freeze({whole:PIANO_CAMERA,low:[175,490,650,290],high:[755,490,630,290]});
export const PIANO_WHITE_BACK=Object.freeze([253,321,393,466,538,615,691,763,835,913,981,1044,1116,1193,1240,1290]);
export const PIANO_WHITE_FRONT=Object.freeze([184,264,350,433,512,595,682,767,844,923,999,1072,1146,1220,1290,1350]);
export const PIANO_BLACK_POLYGONS=Object.freeze([
 [[314,534],[340,534],[310,626],[269,626]],[[388,534],[414,534],[390,626],[349,626]],
 [[519,534],[553,534],[538,626],[497,626]],[[602,534],[633,534],[625,626],[583,626]],[[681,534],[714,534],[712,626],[671,626]],
 [[822,534],[854,534],[861,626],[818,626]],[[894,534],[926,534],[944,626],[899,626]],
 [[1021,534],[1055,534],[1079,626],[1036,626]],[[1089,534],[1122,534],[1156,626],[1114,626]],[[1163,534],[1195,534],[1235,626],[1193,626]],
]);
export const PIANO_KEY_CODES=Object.freeze(['KeyZ','KeyS','KeyX','KeyD','KeyC','KeyV','KeyG','KeyB','KeyH','KeyN','KeyJ','KeyM','KeyQ','Digit2','KeyW','Digit3','KeyE','KeyR','Digit5','KeyT','Digit6','KeyY','Digit7','KeyU','KeyI']);
export const pianoKeyboardLabel=note=>PIANO_KEY_CODES[note]?.replace(/Key|Digit/g,'')??'';
export const PIANO_ROOM_REGION=Object.freeze([50.5,26.8,12.5,13]);
export const PIANO_NOTE_NAMES=Object.freeze(['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B']);
export const pianoNoteName=note=>PIANO_NOTE_NAMES[note%12]+(4+Math.floor(note/12));
export const pianoScaleNumber=note=>['1','♯1','2','♯2','3','4','♯4','5','♯5','6','♯6','7'][note%12];
export const PIANO_FLAP=Object.freeze({
 front:[[522,725],[1007,725],[1007,798],[522,798]],
 inside:[[522,796],[1007,796],[1028,822],[500,822]],
 lip:[[500,822],[1030,822],[1030,837],[500,837]],
});
// Project a lower horizontal hinge into the original down-looking camera.
// The two hinge endpoints stay fixed while the free edge moves toward us.
export function pianoFlapPose(position){
 const a=Math.max(0,Math.min(1,position))*Math.PI/2,s=Math.sin(a),c=Math.cos(a);
 const left=522-22*s,right=1007+21*s,y=798-73*c+24*s;
 return {front:[[left,y],[right,y],[1007,798],[522,798]],inside:[[522,798],[1007,798],[right,y],[left,y]],lip:[[left,y],[right,y],[right,y+15*s],[left,y+15*s]],insideVisible:y>798,edgeOn:Math.abs(y-798)<.4};
}
