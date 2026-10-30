import { motionAllowed } from '../../services/motion.js';

export function blockedMove(button) {
  if(motionAllowed())button.animate([{translate:'0px'},{translate:'-3px'},{translate:'2px'},{translate:'0px'}],{duration:240});
}
