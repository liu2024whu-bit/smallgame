// Winding socket in the paper theatre; pivot is measured inside item sprite 3.
export const ENCORE_HANDLE = Object.freeze({ x:76.6,y:66.3,width:13,pivotX:.106,pivotY:.717 });
// The shaft is normal to the book page. Deproject the painted page before
// turning, then project it back; a screen-space rotate would orbit the wrong axis.
export const ENCORE_PLANE=Object.freeze({depth:.62,skew:.12});
export function encoreCrankPose(degrees){
 const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a),{depth:d,skew:k}=ENCORE_PLANE;
 return `matrix(${c+k*s},${d*s},${-(1+k*k)*s/d},${c-k*s},0,0)`;
}
export function encorePageAngle(x,y){const {depth:d,skew:k}=ENCORE_PLANE;return Math.atan2(y/d,x-k*y/d)*180/Math.PI;}
export function encoreCrankAngle(transform,near=0){
 const values=transform.match(/^matrix\(([^)]+)\)$/)?.[1].split(',').map(Number);if(!values)return near;
 const s=values[1]/ENCORE_PLANE.depth,c=values[0]-ENCORE_PLANE.skew*s,a=Math.atan2(s,c)*180/Math.PI;
 return a+Math.round((near-a)/360)*360;
}
