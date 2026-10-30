// Five real containers share eight measures. Cups are deliberately unmarked
// and large enough for all eight, so filling one is not a shortcut to a half.
export const COCOA_CAPACITIES=Object.freeze([8,5,3,8,8]);
export const COCOA_GOAL=Object.freeze([0,0,0,4,4]);
export const COCOA_NAMES=Object.freeze(['大壶','中壶','小壶','叶纹杯','花纹杯']);
export const COCOA_PARTS={width:1536,height:1024,frames:[[70,35,372,503],[584,110,421,427],[1140,190,352,344],[51,576,498,397],[595,576,498,397]]};
export const COCOA_MATERIALS={width:1536,height:1024,frames:[[55,48,850,920],[940,58,576,217],[1061,298,62,497],[1150,680,363,145],[1024,881,502,123]]};
// Coordinates are local pixels in each complete sprite, including the handle.
export const COCOA_VESSELS=Object.freeze([
 {x:210,y:180,scale:.875,mouth:[165,36],spout:[11,55],base:[160,482],mark:[198,125],cavity:[[45,83],[258,83],[258,432],[245,465],[208,478],[94,478],[57,461],[45,434]]},
 {x:600,y:310,scale:.75,mouth:[183,43],spout:[13,63],base:[180,407],mark:[235,130],cavity:[[51,99],[297,99],[297,354],[281,389],[237,399],[106,400],[65,382],[51,354]]},
 {x:960,y:360,scale:.77,mouth:[137,42],spout:[13,59],base:[137,324],mark:[179,105],cavity:[[43,87],[237,87],[235,282],[222,307],[184,318],[88,318],[53,304],[43,281]]},
 {x:390,y:530,scale:.725,mouth:[196,72],spout:[22,83],base:[201,377],opening:[195,72,169,56],cavity:[[27,79],[78,29],[265,29],[368,80],[344,292],[294,349],[115,351],[47,299]]},
 {x:900,y:530,scale:.725,mouth:[196,72],spout:[22,83],base:[201,377],opening:[195,72,169,56],cavity:[[27,79],[78,29],[265,29],[368,80],[344,292],[294,349],[115,351],[47,299]]},
]);
export const COCOA_CAMERA=[0,0,1536,1024];
export const COCOA_WIDE_CAMERA=[-96,-200,1792,1792/1.5];
export const COCOA_ROOM_PATCH=[51.7,50.4,17.2,20.5];
export const COCOA_TRAY_QUAD=[[112,204],[1435,204],[1435,889],[112,889]];
export const COCOA_ROOM_TRAY=[[876,568],[1124,568],[1140,668],[860,668]];
