import {gardenMotion} from './motion/garden.js';
import { motionAllowed } from './motion/shared.js';
import { objectMotion } from './motion/objects.js';
import { mechanismMotion } from './motion/mechanisms.js';
import { paperMotion } from './motion/paper.js';
import { materialMotion } from './motion/materials.js';
import { workshopMotion } from './motion/workshop.js';

export { motionAllowed };
export { watchMotionPreferences } from './motion/shared.js';
// Measured presentation belongs to its material, never to the save or rules.
const drivers = [gardenMotion, objectMotion, mechanismMotion, paperMotion, materialMotion, workshopMotion];
export const captureMotion = root => motionAllowed() ? drivers.map(driver => driver.capture(root)) : null;
export function playMotion(root, before) {
  if (before && motionAllowed()) drivers.forEach((driver, i) => driver.play(root, before[i]));
}
