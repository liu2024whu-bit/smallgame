import {PUZZLES} from './puzzles.js';

export const PICKUPS=['bookmark','thread'];
export const REWARD_SOURCES=Object.freeze(Object.fromEntries(PUZZLES.flatMap(puzzle=>puzzle.rewards.map(item=>[item,puzzle.id]))));
export const COLLECTIBLE_IDS=Object.freeze([...PICKUPS,...Object.keys(REWARD_SOURCES)]);
export const pendingRewards=(state,id)=>PUZZLES.find(p=>p.id===id)?.rewards.filter(item=>state.solved.includes(id)&&!state.collected.includes(item))??[];

