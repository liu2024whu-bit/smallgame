// The same source coordinates position the artwork, hit areas and miniature.
export const CLOUD_BODY={width:1536,height:1024,frames:[[0,0,1536,1024]]};
export const CLOUD_DOORS={width:1536,height:1024,frames:[[35,198,220,583],[1304,198,198,583]]};
export const CLOUD_GEOMETRY={
 front:[{index:0,x:516,y:476,r:142},{index:1,x:1021,y:476,r:142}],
 back:[{index:2,x:768,y:475,r:166}],
 spindles:[435,768,1101],spindleY:737,
 drive:{large:{x:435,y:737,r:63,teeth:16},small:{x:529.5,y:737,r:31.5,teeth:8},shaft:{x:768,y:475,outer:43,inner:31.5}},
 doors:[{x:35,y:198,w:220,h:583,pivot:14,angle:-82},{x:1304,y:198,w:198,h:583,pivot:86,angle:82}],
 world:{left:19.7,top:43.2,width:22.4}
};
export const CLOUD_GLYPHS=[
 {name:'鳐',path:'M0-7Q-5-14-11-8L-32-16Q-26-1-14 3Q-9 5-4 2Q-3 15 0 23Z'},
 {name:'纸鸟',path:'M0-4-23-17-14 5-4 3 0 13Z'},
 {name:'星',path:'M0-22-6-7-22-7-10 3-15 20 0 10Z'}
];
export const CLOUD_MARKS=[
 {name:'风',path:'M-7-2Q5-8 8-1M-8 3Q1-2 6 3'},
 {name:'烛',path:'M-3-1H3V7H-3ZM0-8Q-5-3 0-2Q5-3 0-8'},
 {name:'月',path:'M4-8A8 8 0 1 0 4 8A6 6 0 0 1 4-8Z'}
];
