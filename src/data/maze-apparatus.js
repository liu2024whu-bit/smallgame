// The painted cutouts, collisions, ball and room share these source coordinates.
export const MAZE_SIZE=1254,MAZE_CENTER=[627,600];
export const MAZE_RADII=[390,270,150],MAZE_BOUNDARIES=[450,330,210,90];
export const MAZE_ARCS=[[[0,1],[1,2],[3,4]],[[0,1],[2,3],[3,4],[4,5]],[[0,1],[1,2],[2,3],[4,5]]];
export const MAZE_INNER_PORTS=[[2,4],[1,5],[0,3]],MAZE_OUTER_PORTS=[[0,3],[0,1],[0,1]];
export const MAZE_MARKS=[8,17],MAZE_START=18,MAZE_END=19;
export const MAZE_EXIT_STOP=(150-90-17)/(150-60);
export const mazeSeenStars=path=>MAZE_MARKS.filter(n=>path.slice(path.lastIndexOf(MAZE_START)).includes(n));
export const mazeExitLimit=path=>mazeSeenStars(path).length===2?1:MAZE_EXIT_STOP;
export const MAZE_PARTS={width:1536,height:1024,frames:[[601,76,522,523],[1235,265,255,245]]};
export const MAZE_MARKERS={width:1774,height:887,frames:[[69,64,730,737],[922,368,323,305],[1378,368,320,305]]};
export const MAZE_LATCH_PARTS={width:1536,height:1024,frames:[[90,296,657,433],[895,413,603,223]]};
export const MAZE_BRAKE_PIVOT=[627,1077];
export const MAZE_CAMERAS={whole:[25,30,1204,1160],play:[97,95,1060,1060],moon:[490,475,275,290]};
export const MAZE_LID=[540,511,174,176],MAZE_WELL=[540,513,174,174];
export const MAZE_ROOM_REGION=[63.8,49.6,9.5,15.5];
export const MAZE_ROOM_FACE=[[1095.3,506],[1181.6,507.2],[1181.3,589.3],[1096.2,589.5]];
export const MAZE_SOURCE_FACE=[[177,150],[1077,150],[1077,1050],[177,1050]];
export const MAZE_ROOM_HOTSPOT={x:68.1,y:58.5,width:7,height:13.8};
export const MAZE_WITNESS=[18,0,1,2,8,9,15,16,17,16,15,19];
export const mazeRect=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
export function mazeRingClip(index){
 const [x,y]=MAZE_CENTER,r=MAZE_BOUNDARIES[index],s=MAZE_BOUNDARIES[index+1];
 return `path('M${x-r} ${y} A${r} ${r} 0 1 0 ${x+r} ${y} A${r} ${r} 0 1 0 ${x-r} ${y} Z M${x-s} ${y} A${s} ${s} 0 1 1 ${x+s} ${y} A${s} ${s} 0 1 1 ${x-s} ${y} Z')`;
}
const mod=x=>(x%6+6)%6;
export const mazeAngle=n=>Math.PI+n*Math.PI/3;
export const mazePolar=(radius,n)=>[MAZE_CENTER[0]+radius*Math.cos(mazeAngle(n)),MAZE_CENTER[1]+radius*Math.sin(mazeAngle(n))];
export function mazePoint(node){
 if(node===MAZE_START)return mazePolar(470,0);
 if(node===MAZE_END)return mazePolar(60,3);
 return mazePolar(MAZE_RADII[Math.floor(node/6)],node%6);
}
export function mazeConnections(turns){
 const edges=MAZE_ARCS.flatMap((list,r)=>list.map(([a,b])=>[r*6+mod(a+turns[r]),r*6+mod(b+turns[r])]));
 for(let r=0;r<2;r++)for(const a of MAZE_INNER_PORTS[r]){
  const n=mod(a+turns[r]);
  if(MAZE_OUTER_PORTS[r+1].some(b=>mod(b+turns[r+1])===n))edges.push([r*6+n,(r+1)*6+n]);
 }
 if(MAZE_OUTER_PORTS[0].some(n=>mod(n+turns[0])===0))edges.push([MAZE_START,0]);
 if(MAZE_INNER_PORTS[2].some(n=>mod(n+turns[2])===3))edges.push([15,MAZE_END]);
 return edges;
}
export function mazeEdgePoint(from,to,amount){
 const a=mazePoint(from),b=mazePoint(to);
 if(from<18&&to<18&&Math.floor(from/6)===Math.floor(to/6)){
  const direction=mod(to-from)===1?1:-1;
  return mazePolar(MAZE_RADII[Math.floor(from/6)],from%6+direction*amount);
 }
 return a.map((v,i)=>v+(b[i]-v)*amount);
}
export function mazeEdgeLength(from,to){
 if(from<18&&to<18&&Math.floor(from/6)===Math.floor(to/6))return MAZE_RADII[Math.floor(from/6)]*Math.PI/3;
 const a=mazePoint(from),b=mazePoint(to);return Math.hypot(a[0]-b[0],a[1]-b[1]);
}
