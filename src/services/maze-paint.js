import {MAZE_SIZE,MAZE_CENTER as center,MAZE_RADII as radii,MAZE_BOUNDARIES as bounds,MAZE_ARCS as arcs,MAZE_INNER_PORTS as inner,MAZE_OUTER_PORTS as outer,mazeAngle,mazePolar,MAZE_MARKS,mazePoint} from '../data/maze-apparatus.js';

const surface=()=>{const c=document.createElement('canvas');c.width=c.height=MAZE_SIZE;return c;};
function annulus(ctx,out,inside){ctx.beginPath();ctx.arc(...center,out,0,Math.PI*2);ctx.arc(...center,inside,0,Math.PI*2,true);ctx.clip('evenodd');}
function grooves(ctx,index){
 ctx.beginPath();
 for(const[a,b]of arcs[index]){ctx.moveTo(...mazePolar(radii[index],a));ctx.arc(...center,radii[index],mazeAngle(a),mazeAngle(b));}
 for(const n of outer[index]){ctx.moveTo(...mazePolar(radii[index],n));ctx.lineTo(...mazePolar(bounds[index]+2,n));}
 for(const n of inner[index]){ctx.moveTo(...mazePolar(radii[index],n));ctx.lineTo(...mazePolar(bounds[index+1]-2,n));}
}
export function createMazePainting({wood,parts,markers}){
 const masks=surface(),wall=surface(),layers=[surface(),surface(),surface()],keys=[null,null,null],floors=new Map();
 const plank=wood;
 function floor(bits){
  if(floors.has(bits))return floors.get(bits);
  const c=surface(),ctx=c.getContext('2d');ctx.drawImage(wood,0,0);
  ctx.save();ctx.beginPath();ctx.arc(...center,451,0,Math.PI*2);ctx.clip();ctx.globalCompositeOperation='multiply';ctx.fillStyle='#906a43';ctx.fillRect(0,0,MAZE_SIZE,MAZE_SIZE);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.2;ctx.drawImage(parts,790,750,640,130,177,150,900,900);ctx.globalAlpha=1;
  MAZE_MARKS.forEach((node,i)=>{const [x,y]=mazePoint(node),lit=bits>>i&1;ctx.drawImage(markers,lit?1378:922,368,lit?320:323,305,x-16.5,y-16,33,32);});
  ctx.restore();
  // A fixed feeder ends at the first moving ring, on the same lower floor.
  ctx.save();ctx.beginPath();ctx.moveTo(...mazePolar(470,0));ctx.lineTo(...mazePolar(449,0));ctx.lineWidth=38;ctx.lineCap='round';ctx.strokeStyle='#806044';ctx.shadowColor='#49362180';ctx.shadowBlur=3;ctx.shadowOffsetY=-2;ctx.stroke();ctx.restore();
  floors.set(bits,c);return c;
 }
 function ring(index,angle){
  if(keys[index]===angle)return layers[index];
  const layer=layers[index],c=layer.getContext('2d'),m=masks.getContext('2d'),w=wall.getContext('2d');
  c.reset();m.reset();w.reset();c.clearRect(0,0,MAZE_SIZE,MAZE_SIZE);m.clearRect(0,0,MAZE_SIZE,MAZE_SIZE);
  c.save();annulus(c,bounds[index]-1.2,bounds[index+1]+1.2);c.translate(...center);c.rotate(angle*Math.PI/3);c.translate(-center[0],-center[1]);c.drawImage(plank,0,0);
  m.setTransform(c.getTransform());grooves(m,index);m.lineWidth=38;m.lineCap='round';m.lineJoin='round';m.strokeStyle='#fff';m.stroke();m.resetTransform();
  c.resetTransform();c.globalCompositeOperation='destination-out';c.drawImage(masks,0,0);c.restore();
  c.save();annulus(c,bounds[index]-1.2,bounds[index+1]+1.2);
  for(const[shift,colour]of [[8,'#49301d'],[-3,'#f5dfba']]){
   w.reset();w.clearRect(0,0,MAZE_SIZE,MAZE_SIZE);w.drawImage(masks,0,0);w.globalCompositeOperation='destination-out';w.drawImage(masks,0,shift);w.globalCompositeOperation='source-in';w.drawImage(plank,0,0);w.globalCompositeOperation='source-atop';w.globalAlpha=.66;w.fillStyle=colour;w.fillRect(0,0,MAZE_SIZE,MAZE_SIZE);c.drawImage(wall,0,0);
  }
  c.restore();keys[index]=angle;return layer;
 }
 return {paint(ctx,turns,visited=[]){
  const bits=MAZE_MARKS.reduce((v,n,i)=>v|(visited.includes(n)?1<<i:0),0);
  ctx.clearRect(0,0,MAZE_SIZE,MAZE_SIZE);ctx.drawImage(floor(bits),0,0);
  turns.forEach((angle,i)=>ctx.drawImage(ring(i,angle),0,0));
 }};
}
