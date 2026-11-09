import test from 'node:test';
import assert from 'node:assert/strict';
import {pointerSession} from '../src/ui/interactions/pointer.js';

async function session(run){
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 const win=Object.assign(new EventTarget(),{innerWidth:1366,innerHeight:850,setTimeout,clearTimeout});
 const doc=Object.assign(new EventTarget(),{hidden:false});
 const classes=new Set(),root=Object.assign(new EventTarget(),{dataset:{},classList:{add:value=>classes.add(value),remove:value=>classes.delete(value)}});
 const source={isConnected:true},ends=[];
 globalThis.window=win;globalThis.document=doc;
 const dispose=pointerSession(root,{pick:()=>({source}),move(){},end:(_,event,cancelled)=>ends.push(cancelled)});
 const pointer=(target,type,x)=>target.dispatchEvent(Object.assign(new Event(type,{cancelable:true}),{pointerId:7,pointerType:'touch',button:0,isPrimary:true,clientX:x,clientY:20}));
 const drag=()=>{pointer(root,'pointerdown',20);pointer(win,'pointermove',70);pointer(win,'pointerup',70);};
 try{await run({win,root,ends,drag,dispose,classes});}
 finally{dispose();globalThis.window=oldWindow;globalThis.document=oldDocument;}
}
const settle=()=>new Promise(resolve=>setTimeout(resolve,10));

test('a touch release commits once and leaves the next drag usable',()=>session(async({drag,ends,classes})=>{
 drag();await settle();drag();await settle();assert.deepEqual(ends,[false,false]);assert.equal(classes.size,0);
}));
test('leaving the window cancels the pending touch drop instead of committing it later',()=>session(async({win,drag,ends,classes})=>{
 drag();win.dispatchEvent(new Event('blur'));await settle();assert.deepEqual(ends,[true]);assert.equal(classes.size,0);
 drag();await settle();assert.deepEqual(ends,[true,false]);
}));
test('resizing or disposing after touch release cancels the old-coordinate drop',()=>session(async({win,drag,ends,dispose})=>{
 drag();win.innerWidth=844;win.dispatchEvent(new Event('resize'));await settle();assert.deepEqual(ends,[true]);
 drag();dispose();await settle();assert.deepEqual(ends,[true,true]);
}));
