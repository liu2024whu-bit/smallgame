import { musicPoint } from '../data/mechanism-layouts.js';
import { mazeEdges } from '../puzzles/maze.js';
import { mazeSegment } from './puzzles/maze.js';
import { character } from './dom.js';

// Moving parts share the close-up art and rules, so a painted approximation
// can never add a seventh music slot or contradict the real maze route.
export function cabinetMechanisms(state){
  if(state.scene!=='collection')return '';
  const music=state.solved.includes('melody')?`<span class="world-music-mechanism" aria-hidden="true">${character('musicMechanism',0,1,1,'')}${state.progress.melody.notes.map((note,index)=>{const [x,y]=musicPoint(index,note);return `<i style="left:${(x-465)/615*100}%;top:${(y-448)/260*100}%"></i>`;}).join('')}</span>`:'';
  const maze=state.solved.includes('maze')?`<span class="world-maze-mechanism" aria-hidden="true">${character('mazeBoard',0,1,1,'')}<svg viewBox="0 0 420 420">${mazeEdges(state.progress.maze.turns).map(([a,b])=>`<path d="${mazeSegment(a,b)}"/>`).join('')}</svg></span>`:'';
  return music+maze;
}
