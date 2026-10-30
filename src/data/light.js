// A tall lamp illuminates the inclined mirror. The source, film carriage and
// bookmark share the same descending ray; the paper stands on a small easel.
const incidentLength=Math.hypot(600,435);
const yaw=Math.atan2(-1,600/incidentLength)*180/Math.PI;
export const LIGHT_GEOMETRY=Object.freeze({
 source:[100,300,600],mirror:[700,300,165],mirrorRadius:95,screenY:700,
 filmX:[280,340,400,460],filmY:300,filmSlope:-.725,filmHalf:30,
 bookX:[206,234],bookY:[260,380],bookZ:[462,486,510,534],bookHalfThickness:2,bookMountY:274,
 normals:[yaw-9,yaw-6,yaw-3,yaw],mirrorPitch:Math.asin(-435/incidentLength/Math.SQRT2),
 screen:{left:600,right:800,bottom:45,top:325},
 camera:{xx:1,xy:-.85,x0:650,yx:.12,yy:.5,yz:-1,y0:700}
});
export const LIGHT_TARGET=Object.freeze({values:[2,1,3],flipped:true});
export const LIGHT_FILM_SIZE=200;
// Measured on light-print.webp. These points lie on visible pigment, never on
// blank portions of the sheet. The same bitmap is used at every stage.
export const LIGHT_LANDMARKS=[[28,82],[172,82],[101,12],[30,156],[171,156],[59,120],[94,103],[86,150]];

export const LIGHT_LAYOUTS=Object.freeze({
 wide:{camera:LIGHT_GEOMETRY.camera,view:[0,0,1536,1150],pencil:[1020,1000,275,48],look:[.6,.62]},
 tall:{camera:{xx:.8,xy:-.52,x0:300,yx:.12,yy:.35,yz:-1,y0:680},view:[0,0,768,1100],pencil:[220,880,150,26],look:[.52,.58]},
 room:{camera:{xx:1.35,xy:-.38,x0:400,yx:.12,yy:.15,yz:-1,y0:700},view:[0,0,1536,1100]}
});
export const lightLayout=view=>LIGHT_LAYOUTS[view==='room'?'room':view===true||view==='tall'?'tall':'wide'];

// Measured on the accepted raster atlas; the complete alpha frame is kept in
// asset-layouts.js, while these points register only the physical surface.
export const LIGHT_PART_REGISTRATION=Object.freeze({
 lamp:{mouth:[250,385],foot:[655,1475],switch:[780,1395],baseX:-50},
 bookArm:{hinge:[320,170],world:[15,300,698],trackX:1015,verticalScale:.26},
 filmPost:{x:758,clipY:88,footY:880},
 mirror:{x:344,y:228,r:194},
 film:{x:746,y:92,width:401,height:393},
 book:{x:153,y:149,width:279,height:1275,hole:[291,194]},
 paper:{x:742,y:626,width:413,height:582}
});

export const LIGHT_FILM_SURFACE=Object.freeze({x:117,y:145,width:1018,height:967});
