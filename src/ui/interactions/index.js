import {bindGarden} from './garden.js';
import {bindPress} from './press.js';
import {bindPressBack} from './press-back.js';
import {bindLight} from './light.js';
import {bindCloud} from './cloud.js';
import {bindPostal} from './postal.js';
import {bindLibrary} from './library.js';
import {bindScreen} from './screen.js';
import {bindBelt} from './belt.js';
import { bindPacking } from './packing.js';
import { bindReorder } from './reorder.js';
import {bindAlbum} from './album.js';
import {bindBalance} from './balance.js';
import {bindMusic} from './music.js';
import { bindLocks } from './locks.js';
import { bindDials } from './dials.js';
import {bindStitch} from './stitch.js';
import { bindFilm } from './film.js';
import {bindFlipFlowers} from './flips.js';
import {bindCloudGap} from './cloud-gap.js';
import {bindWordDesk} from './wordlock.js';
import { bindChocolate } from './chocolate.js';
import { bindPouring } from './pouring.js';
import { bindMaze } from './maze.js';
import { bindEncore } from './encore.js';
import { bindRubbing } from './rubbing.js';
import { bindDrawers } from './drawers.js';
import { bindSweets } from './sweets.js';
import {bindBirthdayLock} from './birthday-lock.js';
import {bindCalendar} from './calendar.js';
import { bindRibbons } from './ribbons.js';
import {bindPiano} from './piano.js';
import {bindJianghu} from './jianghu.js';

export function bindInteractions(root, { id, progress, solved, move, activity, changeView, view={}, feedback=()=>{},playMelody=()=>{},stopMelody=()=>{},playPiano=()=>{} }) {
  // The original room remains visible while a mechanism is waiting. Its
  // miniature is scenery; do not bind a second puzzle session inside it.
  if(root.querySelector('.locked-object'))return ()=>{};
  const cleanup = [];
  cleanup.push(bindJianghu(root,{activity,changeView,view,feedback}));
  if(id==='piano')cleanup.push(bindPiano(root,{move,solved,play:playPiano,feedback,activity,changeView,view}));
  cleanup.push(bindEncore(root,changeView));
  cleanup.push(bindRubbing(root,{activity,view,feedback}));
  cleanup.push(bindWordDesk(root,progress,{move,changeView,activity,feedback,view,solved}));
  if (id === 'film') cleanup.push(bindFilm(root,progress,{view,move,changeView,feedback}));
  if(id==='cloud')cleanup.push(bindCloud(root,progress,{move,changeView,solved,feedback}));
  if(id==='calibration')cleanup.push(bindLight(root,progress,move,feedback,changeView));
  cleanup.push(bindPostal(root,changeView,feedback));
  if(id==='books')cleanup.push(bindLibrary(root,progress,{move,changeView,feedback}));
  if(id==='screen')cleanup.push(bindScreen(root,progress,{move,changeView}));
  if(id==='belt')cleanup.push(bindBelt(root,progress,{move,feedback}));
  if(id==='flowers')cleanup.push(bindGarden(root,progress,{move,feedback}));
  if(id==='paperBack')cleanup.push(bindPressBack(root,progress,{move}));
  if(id==='cloudGap')cleanup.push(bindCloudGap(root,progress,{move,solved,feedback}));
  if(id==='stitch')cleanup.push(bindStitch(root,progress,{move,view,changeView,feedback}));
  if(id==='chocolate')cleanup.push(bindChocolate(root,progress,{move,view,changeView,solved}));
  if(id==='sweets')cleanup.push(bindSweets(root,progress,{move,changeView,solved}));
  if(id==='ribbons')cleanup.push(bindRibbons(root,progress,{move,changeView,view,solved,feedback}));
  if(id==='birthdayLock')cleanup.push(bindBirthdayLock(root,progress,{move,changeView,feedback}));
  if(id==='calendar')cleanup.push(bindCalendar(root,progress,{move,changeView,feedback}));
  if(id==='maze')cleanup.push(bindMaze(root,progress,{move,changeView,feedback}));
  if(id==='balance')cleanup.push(bindBalance(root,progress,{move,view,changeView,feedback}));
  if(id==='drawers')cleanup.push(bindDrawers(root,progress,{move,view,changeView,feedback,solved}));
  if(id==='melody')cleanup.push(bindMusic(root,progress,{move,solved,play:playMelody,stopPlayback:stopMelody,feedback}));
  if(id==='flips')cleanup.push(bindFlipFlowers(root,{solved,changeView,feedback}));
  if (id && !solved) {
    if(id==='album')cleanup.push(bindAlbum(root,move));
    cleanup.push(id === 'packing' ? bindPacking(root, progress, move) : bindReorder(root, id, move));
    if(!['birthdayLock','calendar'].includes(id))cleanup.push(bindLocks(root, progress, move, feedback));
    cleanup.push(bindDials(root, progress, move));
    if(id==='cocoa')cleanup.push(bindPouring(root,progress,move));
    if(id==='paper')cleanup.push(bindPress(root,progress,move));
  }
  const pencil = root.querySelector('[data-color-drawing]');
  if (pencil) {
    const input = () => root.querySelector('.color-sketch')?.style.setProperty('--ink', `${pencil.value}%`);
    const change = () => { if (Number(pencil.value) >= 90) activity('art:color'); };
    pencil.addEventListener('input', input);
    pencil.addEventListener('change', change);
    cleanup.push(() => { pencil.removeEventListener('input', input); pencil.removeEventListener('change', change); });
  }
  return () => cleanup.forEach(dispose => dispose());
}
