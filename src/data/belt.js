// Source pixels in the painted chassis; wheel centers are the actual axles.
export const BELT_WHEELS=Object.freeze([
 {x:330,y:477,r:93,side:-1,part:0,name:'摇柄轮'},
 {x:483,y:249,r:38,side:-1,part:null,name:'张力轮'},
 {x:477,y:716,r:48,side:1,part:1,name:'左导轮'},
 {x:972,y:270,r:83,side:-1,part:2,name:'挡光轮'},
 {x:757,y:553,r:84,side:1,part:1,name:'下导轮'},
 {x:1088,y:670,r:47,side:1,part:1,name:'上导轮'},
 {x:1286,y:479,r:145,side:-1,part:3,name:'胶片轮'},
]);
export const BELT_RETURNS=Object.freeze([{x:1377,y:780,r:14,side:-1},{x:320,y:779,r:14,side:-1}]);
export const BELT_PARTS=Object.freeze({width:1536,height:1024,frames:[
 [38,46,469,460],[645,125,313,312],[1090,75,403,403],
 [52,525,440,437],null,[1172,674,332,145],[1180,679,120,120],
]});
export const BELT_COTTON=Object.freeze({width:1536,height:1024,frames:[[300,225,512,120],[62,621,578,270],[684,619,790,248]]});
export const BELT_FIT_ITEMS=Object.freeze(['thread','pulley','crank','needle']);
// The four centers in the painted paper gauge are 38 source pixels apart.
// Four marks enclose three intervals; the moving needle measures the interval.
export const BELT_PITCH=38;
export const BELT_CAMERAS=Object.freeze({whole:[100,85,1436,835],left:[120,110,800,750],right:[800,150,690,690]});
export const BELT_RATIO_POINTS=Object.freeze([714,780,848]);
// Anchor the painted feet to the shelf surface beside the books, rather than
// placing the transparent canvas by eye. Both the room and close-up use this.
const width=11.55,height=width*(1672/941)/(1536/1024);
export const BELT_PLACEMENT=Object.freeze({left:80.62,top:622.4/941*100-878/1024*height,width,height});
export const BELT_ROOM=Object.freeze({
 left:81.7,top:622.4/941*100-930/1024*height,width,height,
 size:[1536,1024],roll:3.9,foot:[314,930],
 front:[175,110,1289,750],face:[[222,188],[1485,145],[1485,836],[222,915]],
});
export function beltRoomPoint([x,y]){
 const {left,top,width,height,roll,foot:[cx,cy]}=BELT_ROOM,r=roll*Math.PI/180;
 const px=cx+(x-cx)*Math.cos(r)-(y-cy)*Math.sin(r),py=cy+(x-cx)*Math.sin(r)+(y-cy)*Math.cos(r);
 return [left+px/1536*width,top+py/1024*height];
}
export function beltRoomBounds(){
 const points=[[100,100],[1500,100],[1500,950],[100,950]].map(beltRoomPoint),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const l=Math.min(...xs),r=Math.max(...xs),t=Math.min(...ys),b=Math.max(...ys);
 return {x:(l+r)/2,y:(t+b)/2,width:r-l,height:b-t};
}
