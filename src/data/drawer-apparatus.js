export const DRAWER_FRONT={width:1254,height:1254,frames:[[135,192,990,1020],[238,336,780,192],[238,531,780,186],[238,719,780,184],[238,903,780,180]]};
export const DRAWER_BODY_PARTS={width:1536,height:1024,frames:[[1057,525,439,466],[108,100,322,78]]};
export const DRAWER_HARDWARE={width:1536,height:1024,frames:[[546,686,475,114],[1208,549,151,335]]};
export const DRAWER_SIZE=[512,1020/990*512],DRAWER_TRAVEL=30,REAR_TRAVEL=26;
export const DRAWER_RECTS=DRAWER_FRONT.frames.slice(1).map(([x,y,w,h])=>[(x-135)/990*512,(y-192)/990*512,w/990*512,h/990*512]);
export const DRAWER_ROOM_REGION=[77,65.2,8.2,13.6];
export const DRAWER_PLACEMENT={left:78.1,top:66.7,width:5.6};
export const DRAWER_SOURCE={left:1250/1672*100,top:605/941*100,width:220/1672*100,height:150/941*100};
export const DRAWER_WORLD=[220,150],DRAWER_LOCAL=[78.1/100*1672-1250,66.7/100*941-605,5.6/100*1672];
// The sample leans against the back of the shelf; its lower edge rests above the lip.
export const DRAWER_SAMPLE_ROOM={quad:[[1415,674],[1451,677],[1455,717],[1416,717]],center:[1433.5/1672*100,695.5/941*100],width:40/1672*100,height:43/941*100};
export const DRAWER_SAMPLE_NEAR=DRAWER_SAMPLE_ROOM.quad.map(([x,y])=>[x-1250,y-605]);
export const drawerRect=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
export const drawerFrontPose=amount=>`translateY(${amount*DRAWER_TRAVEL}px) scale(${1+amount*.012})`;
export const drawerRearPose=amount=>`translateX(${amount*REAR_TRAVEL}px)`;
export const drawerCamPose=clear=>`rotate(${-64*Number(clear)}deg)`;
