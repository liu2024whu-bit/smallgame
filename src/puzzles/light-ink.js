import {LIGHT_INK} from '../data/light.js';
// Flatten only the small authored drawing; all projected points still use the
// same physical ray model as the rule, including during a half-turn.
function flatten(path){
 const tokens=path.match(/[A-Z]|-?\d*\.?\d+/g),runs=[];let i=0,command,x=0,y=0,start,control=null,run;
 const point=(a,b)=>{x=a;y=b;run.push([x,y]);};
 while(i<tokens.length){
  if(/[A-Z]/.test(tokens[i]))command=tokens[i++];
  if(command==='M'){x=Number(tokens[i++]);y=Number(tokens[i++]);run=[[x,y]];runs.push(run);start=[x,y];command='L';control=null;}
  else if(command==='L'){point(Number(tokens[i++]),Number(tokens[i++]));control=null;}
  else if(command==='H'){point(Number(tokens[i++]),y);control=null;}
  else if(command==='V'){point(x,Number(tokens[i++]));control=null;}
  else if(command==='Q'||command==='T'){
   const a=[x,y],b=command==='Q'?[Number(tokens[i++]),Number(tokens[i++])]:control?[2*x-control[0],2*y-control[1]]:a,c=[Number(tokens[i++]),Number(tokens[i++])];
   for(let n=1;n<=16;n++){const t=n/16,u=1-t;point(u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]);}control=b;
  }else if(command==='Z'){point(...start);command=null;control=null;}
  else throw new Error('Unknown authored light path');
 }
 return runs;
}
export const LIGHT_LINES=Object.freeze(LIGHT_INK.flatMap(flatten));
