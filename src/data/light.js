// World units keep the light path, silhouettes and interaction in one space.
export const LIGHT_GEOMETRY=Object.freeze({
 source:[100,300,220],mirror:[700,300,258],mirrorRadius:135,screenY:700,
 filmX:[280,340,400,460],filmY:300,filmZ:200,filmHalf:30,
 bookX:[206,234],bookY:[260,420],bookZ:[176,200,224,248],bookHalfThickness:2,
 normals:[-60,-55,-50,-45],screen:{left:570,right:830,bottom:-30,top:340},
 camera:{xx:1.35,xy:-.38,x0:260,yx:.121037037,yy:.43,yz:-1,y0:500}
});
export const LIGHT_TARGET=Object.freeze({values:[2,1,3],flipped:true});
export const LIGHT_FILM_SIZE=200;
// A rain window and an asymmetric umbrella make a physical reflection readable.
export const LIGHT_INK=[
 'M32 180V69Q32 22 100 22T168 69V180M32 106H168M100 22V180',
 'M61 119Q81 79 121 119Q111 112 101 119Q91 112 81 119Q71 112 61 119Z',
 'M91 118V139Q91 151 81 147',
 'M49 64 46 72M67 52 64 60M132 58 129 66M149 78 146 86',
 'M-82 -55V-82H-55M255 -82H282V-55M282 255V282H255M-55 282H-82V255'
];
export const LIGHT_LANDMARKS=[[32,69],[168,69],[100,22],[32,156],[168,156],[61,119],[121,119],[81,147]];

export const LIGHT_LAYOUTS=Object.freeze({
 wide:{camera:LIGHT_GEOMETRY.camera,view:[0,260,1536,720],lamp:[22,360,300,294],power:[164,598],bookPost:[411,397,72,294],rail:[458,620,411,90],mirrorPost:[1068,502,48,236],slots:[[610,740],[1220,715],[410,735]],pencil:[1195,875,260,48]},
 tall:{camera:{xx:.7,xy:-.35,x0:190,yx:.3,yy:.6,yz:-1,y0:160},view:[0,0,768,1024],lamp:[8,115,170,166.6],power:[90,250],bookPost:[209,152,50,270],rail:[246,398,210,100],mirrorPost:[559,340,32,221],slots:[[280,390],[650,610],[175,465]],pencil:[530,900,200,40]}
});
export const lightLayout=tall=>LIGHT_LAYOUTS[tall?'tall':'wide'];

// Measured on the accepted raster atlas; the complete alpha frame is kept in
// asset-layouts.js, while these points register only the physical surface.
export const LIGHT_PART_REGISTRATION=Object.freeze({
 mirror:{x:344,y:228,r:194},
 film:{x:746,y:92,width:401,height:393},
 book:{x:319,y:637,width:134,height:577},
 paper:{x:742,y:626,width:413,height:582}
});

export const LIGHT_FILM_SURFACE=Object.freeze({x:117,y:145,width:1018,height:967});
