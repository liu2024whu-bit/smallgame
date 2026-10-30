// Measured inner opening fitted to square wooden units; alpha margin is retained.
export const PACKING_TRAY={width:1402,height:1122,opening:[144,134,1110,827]};
export const gripFraction=(point,start,size)=>Math.max(0,Math.min(1,(point-start)/size));
export const turnGrip=({u,v})=>({u:1-v,v:u});
export const PACKING_ROOM={size:[1672,941],region:[54.5,68.2,10.2,8.6],floor:[[945,671],[1039,671],[1049,692],[934,692]]};
