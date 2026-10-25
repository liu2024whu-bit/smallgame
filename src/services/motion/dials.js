import { ease, motionAllowed, turnDelta } from './shared.js';

// The released angle is the start of the settling motion, including full turns.
export function settleDial(face, from, to) {
  if (!face?.isConnected || !motionAllowed() || from === to) return;
  const delta = turnDelta(from, to);
  const frames = [{ transform: `rotate(${to + delta}deg)` }, { transform: `rotate(${to}deg)` }];
  const timing = { duration: Math.max(120, Math.min(320, Math.abs(delta) * 3)), easing: ease };
  face.querySelector('.item-art')?.animate(frames, timing);
}
