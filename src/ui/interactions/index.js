import {bindGarden} from './garden.js';
import {bindPress} from './press.js';
import {bindLight} from './light.js';
import {bindCloud} from './cloud.js';
import {bindPostal} from './postal.js';
import { bindPacking } from './packing.js';
import { bindReorder } from './reorder.js';
import { bindObjects } from './objects.js';
import { bindLocks } from './locks.js';
import { bindDials } from './dials.js';
import { bindTracing } from './tracing.js';
import { bindFilm } from './film.js';
import { bindNeighbors } from './feedback.js';
import { bindShadows } from './shadows.js';
import { bindChocolate } from './chocolate.js';
import { bindPouring } from './pouring.js';
import { bindMaze } from './maze.js';
import { bindEncore } from './encore.js';
import { bindRubbing } from './rubbing.js';
import { bindDrawers } from './drawers.js';
import { bindSweets } from './sweets.js';
import { bindRibbons } from './ribbons.js';

export function bindInteractions(root, { id, progress, solved, move, activity, changeView, feedback=()=>{} }) {
  const cleanup = [];
  cleanup.push(bindEncore(root,changeView));
  cleanup.push(bindRubbing(root,activity));
  if (id === 'film') cleanup.push(bindFilm(root,progress));
  if(id==='cloud')cleanup.push(bindCloud(root,progress,{move,changeView,solved,feedback}));
  if(id==='calibration')cleanup.push(bindLight(root,progress,move,feedback,changeView));
  cleanup.push(bindPostal(root,changeView,feedback));
  if (id && !solved) {
    cleanup.push(id === 'packing' ? bindPacking(root, progress, move) : bindReorder(root, id, move));
    cleanup.push(bindObjects(root, id, move, progress));
    cleanup.push(bindLocks(root, progress, move, feedback));
    cleanup.push(bindDials(root, progress, move));
    cleanup.push(bindTracing(root, id, progress, move));
    cleanup.push(bindNeighbors(root));
    cleanup.push(bindShadows(root,progress,move));
    if(id==='chocolate')cleanup.push(bindChocolate(root,progress,move));
    if(id==='cocoa')cleanup.push(bindPouring(root,progress,move));
    if(id==='maze')cleanup.push(bindMaze(root,progress,move));
    if(id==='flowers')cleanup.push(bindGarden(root,progress,move,feedback));
    if(id==='paper')cleanup.push(bindPress(root,progress,move));
    if(id==='drawers')cleanup.push(bindDrawers(root,progress,move));
    if(id==='sweets')cleanup.push(bindSweets(root,progress,move));
    if(id==='ribbons')cleanup.push(bindRibbons(root,progress,move));
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
