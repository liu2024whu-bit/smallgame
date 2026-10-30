// One registered set of desk parts, shared by near views and room painting.
export const WORD_CASE_PARTS={width:1536,height:1024,frames:[
 [40,48,1455,502],[46,583,1135,206],[1240,626,241,150],
 [49,836,690,136],[752,836,669,138],[1442,867,68,66],
]};
export const WORD_KEY_PARTS={width:1536,height:1024,frames:[
 [24,143,1492,385],[42,626,115,108],[175,625,136,110],
 [326,624,172,110],[516,623,197,112],[731,622,200,114],
 [945,622,246,113],[1202,622,296,114],[39,829,843,116],[902,795,634,188],
 [42,626,115,46],[42,667,115,42],[42,705,115,29],
]};
export const KEYBED_QUAD=[[52,52],[1428,52],[1443,328],[42,328]];
export const WORD_WINDOWS=[[236,160,139,126],[444,160,141,126],[652,160,145,126],[866,160,145,126],[1078,160,145,126]];
export const WORD_PUNCHES=Object.freeze({centers:[190,285,380,475,570],levels:[42,60,78,96,114],size:[690,136]});
export const WORD_CABLE=[[190,125,5],[130,545,5],[205,563,5],[265,143,5]];
export const WORD_VIEWS=Object.freeze({room:[0,0,1672,941],whole:[0,0,1560,941],case:[320,35,900,510],keyboard:[0,510,1550,440],papers:[0,0,1536,941],alphabet:[525,165,470,510],columns:[65,280,400,150],rows:[990,325,450,220]});
// One desk model, in millimetres, shared by the source painting and close view.
export const WORD_DESK=Object.freeze({
 keyboard:Object.freeze({width:450,depth:150,front:-10,bedFront:6,bedBack:123,bedWidth:414,bedHeight:15}),
 box:Object.freeze({width:400,depth:170,height:120,front:330}),
 drawer:Object.freeze({width:365,depth:150,height:32,base:15,floor:24,travel:150}),
});
export const WORD_ROOM_CAMERA=Object.freeze({kind:'ortho',pitch:Math.asin(.252),scale:330/450,center:[855,537]});
export const WORD_INPUT_CAMERA=Object.freeze({kind:'perspective',from:[0,-80,220],target:[0,100,0],focal:675,center:[768,650]});
export const WORD_ASSEMBLY_CAMERA=Object.freeze({kind:'perspective',from:[0,60,400],target:[0,250,0],focal:700,center:[768,650]});
export const WORD_ASSEMBLY_VIEW=[565,495,405,275];
export const WORD_SOURCE={left:37,top:30,width:44,height:35};
export const WORD_NOTEBOOK=[[250,400,2],[570,400,2],[570,180,2],[250,180,2]];
export const WORD_BOARD=[[-90,185,25],[-90,324,25],[90,324,25],[90,185,25]];
export const WORD_PAGE_AREA=[[-78,310,29],[78,310,29],[78,198,29],[-78,198,29]];
export const WORD_BINDING_AREA=[[-82.5,309,29],[82.5,309,29],[82.5,199,29],[-82.5,199,29]];
// Authoring anchors in the integrated room painting. The room is a drawing,
// not a shrunken inspection camera; text and contents follow its painted planes.
export const WORD_ROOM_NOTEBOOK=[[1038,464],[1287,464],[1332,532],[1052,538]];
export const WORD_ROOM_DRAWER_FLOOR=[[727,448],[983,448],[981,465],[729,465]];
