// One sheet is printed in both the original and the mirror. Observation is
// presentation state; no viewed-stamp flags participate in opening the lock.
export const POSTCARD_SIZE=[600,360];
export const POSTCARD_MARKS=[[140,240],[460,240]];
export const POSTAL_MIRROR={span:240,centerY:222,left:140,right:460};
export function mirrorMatrix(width,height,aim=.5){
 const s=width/POSTAL_MIRROR.span,x=POSTAL_MIRROR.left+(POSTAL_MIRROR.right-POSTAL_MIRROR.left)*Math.max(0,Math.min(1,aim));
 return [-s,0,0,s,width/2+s*x,height/2-s*POSTAL_MIRROR.centerY];
}
export const POSTAL_CAMERAS={cabinet:[-120,-220,1440,1220],detail:[390,390,540,360]};
export const POSTAL_BODY=[235,65,730,746];
export const POSTAL_DOOR=[325,280,572,420];
// Positions are measured on postal-parts.webp, not on a decorative screenshot.
export const POSTAL_DIGITS=[828.5,912,995,1079].map(x=>(x-685)/550);
