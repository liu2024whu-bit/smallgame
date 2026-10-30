// One sheet is printed in both the original and the mirror. Observation is
// presentation state; no viewed-stamp flags participate in opening the lock.
export const POSTCARD_SIZE=[600,360];
export const POSTCARD_MARKS=[[140,240],[460,240]];
export const POSTAL_MIRROR={span:240,centerY:222,left:140,right:460};
export function mirrorMatrix(width,height,aim=.5){
 const s=width/POSTAL_MIRROR.span,x=POSTAL_MIRROR.left+(POSTAL_MIRROR.right-POSTAL_MIRROR.left)*Math.max(0,Math.min(1,aim));
 return [-s,0,0,s,width/2+s*x,height/2-s*POSTAL_MIRROR.centerY];
}
export const POSTAL_CAMERAS={cabinet:[-120,-220,1440,1220],detail:[390,390,540,360],open:[110,-10,1000,850]};
export const POSTAL_BODY=[235,65,730,746];
export const POSTAL_DOOR=[325,280,572,420];
// Anchors on the authored room painting, separate from the close cabinet.
export const POSTAL_ROOM_AREA=[54.5,33,25.5,47.5];
export const POSTAL_ROOM_DIGITS=[[1081.65,588.14,35.49,44.87],[1117.33,588.14,35.49,44.87],[1152.8,588.14,35.49,44.87],[1188.7,588.14,35.49,44.87]];
export const POSTAL_ROOM_SIGNS=POSTAL_ROOM_DIGITS.map(([x,,w])=>[x,576.23,w,10.56]);
// The paper's hole (42,43 on a 230×330 leaf) meets the painted brass pin.
export const POSTAL_ROOM_TICKET=[1124.41,592.16,58,83.22];
export const POSTAL_ROOM_PIN=[1131.5,599.5,7,7];
// Positions are measured on postal-parts.webp, not on a decorative screenshot.
export const POSTAL_DIGITS=[828.5,912,995,1079].map(x=>(x-685)/550);
