import {gardenMotion} from './motion/garden.js';
import {pressMotion} from './motion/press.js';
import {pressBackMotion} from './motion/press-back.js';
import {cloudGapMotion} from './motion/cloud-gap.js';
import {lightMotion} from './motion/light.js';
import {cloudMotion} from './motion/cloud.js';
import {postalMotion} from './motion/postal.js';
import {libraryMotion} from './motion/library.js';
import {skyMotion} from './motion/sky.js';
import {screenMotion} from './motion/screen.js';
import {beltMotion} from './motion/belt.js';
import {filmMotion} from './motion/film.js';
import { motionAllowed } from './motion/shared.js';
import {melodyMotion} from './motion/melody.js';
import { mechanismMotion } from './motion/mechanisms.js';
import { paperMotion } from './motion/paper.js';
import {birthdayLockMotion} from './motion/birthday-lock.js';
import {calendarMotion} from './motion/calendar.js';
import {mazeMotion} from './motion/maze.js';
import {wordlockMotion} from './motion/wordlock.js';
import {albumMotion} from './motion/album.js';
import {stitchMotion} from './motion/stitch.js';
import {chocolateMotion} from './motion/chocolate.js';
import {cocoaMotion} from './motion/cocoa.js';
import {sweetsMotion} from './motion/sweets.js';
import {ribbonsMotion} from './motion/ribbons.js';
import {balanceMotion} from './motion/balance.js';
import {drawersMotion} from './motion/drawers.js';
import {flipsMotion} from './motion/flips.js';
import {packingMotion} from './motion/packing.js';
import {memoriesMotion} from './motion/memories.js';
import {recordsMotion} from './motion/records.js';
import {petsMotion} from './motion/pets.js';
import {birthdayMotion} from './motion/birthday.js';
import {pianoMotion} from './motion/piano.js';
import {jianghuMotion} from './motion/jianghu.js';

export { motionAllowed };
export { watchMotionPreferences,settleWorkbenchZoom } from './motion/shared.js';
// Measured presentation belongs to its material, never to the save or rules.
const drivers = [gardenMotion,pressMotion,pressBackMotion,cloudGapMotion,cloudMotion,lightMotion,postalMotion,libraryMotion,skyMotion,screenMotion,beltMotion,filmMotion,wordlockMotion,albumMotion,stitchMotion,chocolateMotion,cocoaMotion,sweetsMotion,ribbonsMotion,melodyMotion,mechanismMotion,paperMotion,birthdayLockMotion,calendarMotion,mazeMotion,balanceMotion,drawersMotion,flipsMotion,packingMotion,memoriesMotion,recordsMotion,petsMotion,birthdayMotion,pianoMotion,jianghuMotion];
const scopes=new WeakMap();
function activeScope(root){
 if(!root.querySelector('.scene-source'))return root;
 // A composed source painting is scenery, not a second active workbench.
 // Keep native DOM methods bound while excluding its decorative descendants
 // from every material driver's queries, both before and after a render.
 if(!scopes.has(root))scopes.set(root,new Proxy(root,{get(target,key){
  if(key==='querySelectorAll'||key==='querySelector')return selector=>{const list=[...target.querySelectorAll(selector)].filter(el=>!el.closest('.scene-source'));return key==='querySelector'?list[0]??null:list;};
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
 }}));
 return scopes.get(root);
}
export const captureMotion = root => {if(!motionAllowed())return null;const scope=activeScope(root);return drivers.map(driver=>driver.capture(scope));};
export function playMotion(root, before) {
  if (before && motionAllowed()) {const scope=activeScope(root);drivers.forEach((driver,i)=>driver.play(scope,before[i]));}
}
