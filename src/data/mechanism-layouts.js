// Coordinates measured from the decoded raster, never from a viewport screenshot.
export const MUSIC_LANES=[[503,456,488,691],[610,455,598,692],[713,455,710,692],[819,455,820,692],[925,455,932,692],[1027,455,1044,692]];
export function musicPoint(index,note) {
  const [topX,topY,bottomX,bottomY]=MUSIC_LANES[index],t=note/4;
  return [bottomX+(topX-bottomX)*t,bottomY+(topY-bottomY)*t];
}
export function musicRect(index) {
  const [a,y,b,end]=MUSIC_LANES[index];
  return [Math.min(a,b)-34,y-6,Math.abs(a-b)+68,end-y+12];
}
export function musicPinStyle(index,note) {
  const [x,y]=musicPoint(index,note),[left,top,width,height]=musicRect(index);
  return `left:${(x-left)/width*100}%;top:${(y-top)/height*100}%;`;
}
export const BINDING_HOLES=[27,42,58,73].map(x=>[x,45.2]).concat([27,42,58,73].map(x=>[x,51]));
export const DRAWER_RECTS=[11.6,29.5,47.5,65.4].map(top=>[16.6,top,66.5,17.1]);
export const FLIP_RECT=[15.4,10,69.8,65.6];
