import { bounded, indexIn, mod, same } from './common.js';

export const CLOUD_LINKS=Object.freeze([{outer:0,inner:1,ratio:1},{outer:1,inner:2,ratio:1},{outer:0,inner:2,ratio:2}]);

export const cloudReadings=values=>CLOUD_LINKS.map(link=>mod(values[link.outer]+link.ratio*values[link.inner],4));

function makeRotors(seed, target, read) {
  return {
    create: () => ({ values: [...seed] }),
    valid: state => bounded(state?.values,3,4)&&state.back===undefined,
    move(state, action) {
      if (action.type === 'set-turn' && indexIn(action.index, 3) && indexIn(action.value, 4)) return { ...state, values: state.values.map((v,i) => i === action.index ? action.value : v) };
      if (action.type !== 'turn' || !indexIn(action.index, 3) || ![-1, 1].includes(action.direction)) return state;
      return { ...state, values: state.values.map((v, i) => i === action.index ? mod(v + action.direction, 4) : v) };
    },
    solved: state => same(read(state.values), target),
  };
}

export const CLOUD_TARGET = cloudReadings([3, 2, 2]);
export const cloud = makeRotors([0, 0, 0], CLOUD_TARGET, cloudReadings);
export const cloudAngles=values=>CLOUD_LINKS.map((link,index)=>[values[link.outer],mod(CLOUD_TARGET[index]-link.ratio*values[link.inner],4)]);
