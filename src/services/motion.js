import { motionAllowed } from './motion/shared.js';
import { objectMotion } from './motion/objects.js';
import { mechanismMotion } from './motion/mechanisms.js';
import { paperMotion } from './motion/paper.js';
import { materialMotion } from './motion/materials.js';

export { motionAllowed };
// Measured presentation belongs to its material, never to the save or rules.
const drivers = [objectMotion, mechanismMotion, paperMotion, materialMotion];
export const captureMotion = root => motionAllowed() ? drivers.map(driver => driver.capture(root)) : null;
export function playMotion(root, before) {
  if (before && motionAllowed()) drivers.forEach((driver, i) => driver.play(root, before[i]));
}
