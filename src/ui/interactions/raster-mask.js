// Read the actual painted mask once. Input and rendering share the same pixels.
const masks=new Map();
export function luminanceMask(url){
 if(!masks.has(url))masks.set(url,(async()=>{
  const image=new Image();image.src=url;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
  const {width,height}=canvas,pixels=context.getImageData(0,0,width,height).data,holes=new Uint8Array(width*height);
  for(let at=0;at<holes.length;at++)holes[at]=pixels[at*4]+pixels[at*4+1]+pixels[at*4+2]<384?1:0;
  canvas.width=canvas.height=0;
  return (u,v)=>{
   if(u<0||u>1||v<0||v>1)return false;
   return holes[Math.min(height-1,Math.floor(v*height))*width+Math.min(width-1,Math.floor(u*width))]===1;
  };
 })());
 return masks.get(url);
}
