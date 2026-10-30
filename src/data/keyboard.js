// Standard 104-key ANSI arrangement, in physical key units. Legends belong
// on raster keycaps; artwork never decides the keyboard's layout or spelling.
const keys=[];
const add=(id,label,x,y,w=1,h=1)=>keys.push({id,label,x,y,w,h});
add('Escape','Esc',0,0);
for(let n=1;n<=12;n++)add('F'+n,'F'+n,[2,3,4,5,6.5,7.5,8.5,9.5,11,12,13,14][n-1],0);
['PrintScreen','ScrollLock','Pause'].forEach((id,i)=>add(id,['PrtSc','Scroll','Pause'][i],15.5+i,0));
let x=0;['`','1','2','3','4','5','6','7','8','9','0','-','='].forEach(label=>{add(label,label,x++,1.5);});add('Backspace','Backspace',13,1.5,2);
x=1.5;add('Tab','Tab',0,2.5,1.5);[...'QWERTYUIOP[]'].forEach(label=>{add(label,label,x++,2.5);});add('Backslash','\\',13.5,2.5,1.5);
x=1.75;add('CapsLock','Caps',0,3.5,1.75);[...'ASDFGHJKL;\''].forEach(label=>{add(label,label,x++,3.5);});add('Enter','Enter',12.75,3.5,2.25);
x=2.25;add('ShiftLeft','Shift',0,4.5,2.25);[...'ZXCVBNM,./'].forEach(label=>{add(label,label,x++,4.5);});add('ShiftRight','Shift',12.25,4.5,2.75);
x=0;for(const [id,label,w]of [['ControlLeft','Ctrl',1.25],['MetaLeft','Win',1.25],['AltLeft','Alt',1.25],['Space','',6.25],['AltRight','Alt',1.25],['MetaRight','Win',1.25],['ContextMenu','Menu',1.25],['ControlRight','Ctrl',1.25]]){add(id,label,x,5.5,w);x+=w;}
['Insert','Home','PageUp','Delete','End','PageDown'].forEach((id,i)=>add(id,{PageUp:'PgUp',PageDown:'PgDn'}[id]??id,15.5+i%3,1.5+Math.floor(i/3)));
add('ArrowUp','↑',16.5,4.5);['ArrowLeft','ArrowDown','ArrowRight'].forEach((id,i)=>add(id,['←','↓','→'][i],15.5+i,5.5));
['NumLock','NumpadDivide','NumpadMultiply','NumpadSubtract'].forEach((id,i)=>add(id,['Num','/','*','−'][i],19+i,1.5));
for(const [row,numbers]of [[2.5,'789'],[3.5,'456'],[4.5,'123']])for(const [i,n]of [...numbers].entries())add('Numpad'+n,n,19+i,row);
add('NumpadAdd','+',22,2.5,1,2);add('NumpadEnter','Enter',22,4.5,1,2);add('Numpad0','0',19,5.5,2);add('NumpadDecimal','.',21,5.5);
export const KEYBOARD_KEYS=Object.freeze(keys.map(Object.freeze));
export const KEYBOARD_UNITS=Object.freeze({width:23,height:6.5,unit:60});
export function letterKeyAction(id,cursor){
 if(/^[A-Z]$/.test(id))return {type:'key',value:id.charCodeAt(0)-65};
 if(id==='Backspace'||id==='Delete')return {type:'erase'};
 if(id==='Enter'||id==='NumpadEnter')return {type:'submit'};
 if(id==='ArrowLeft'||id==='ArrowRight')return {type:'cursor',index:Math.max(0,Math.min(4,cursor+(id==='ArrowLeft'?-1:1)))};
 if(id==='Home'||id==='End')return {type:'cursor',index:id==='Home'?0:4};
 return null;
}
