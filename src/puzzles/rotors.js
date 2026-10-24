import { bounded, indexIn, mod, same } from './common.js';

export const CLOUD_LINKS=Object.freeze([{outer:0,inner:1,ratio:1},{outer:1,inner:2,ratio:1},{outer:0,inner:2,ratio:2}]);

export function cloudReadings(values, negative = false) {
  const [a, b, c] = values;
  return negative ? [mod(a + c, 4), mod(b + c, 4), mod(2 * a + 2 * b + c, 4)] : CLOUD_LINKS.map(link=>mod(values[link.outer]+link.ratio*values[link.inner],4));
}

function makeRotors(seed, target, read,{hasFace=true}={}) {
  return {
    create: () => ({ values: [...seed], ...(hasFace?{back:false}:{}) }),
    valid: state => bounded(state?.values,3,4)&&(hasFace?typeof state.back==='boolean':state.back===undefined),
    move(state, action) {
      if (action.type === 'view') return hasFace?{ ...state, back: !state.back }:state;
      if (action.type === 'set-turn' && indexIn(action.index, 3) && indexIn(action.value, 4)) return { ...state, values: state.values.map((v,i) => i === action.index ? action.value : v) };
      if (action.type !== 'turn' || !indexIn(action.index, 3) || ![-1, 1].includes(action.direction)) return state;
      return { ...state, values: state.values.map((v, i) => i === action.index ? mod(v + action.direction, 4) : v) };
    },
    solved: state => same(read(state.values), target),
  };
}

export const CLOUD_TARGET = cloudReadings([3, 2, 2]);
export const GAP_TARGET = cloudReadings([1, 3, 2], true);
export const cloud = makeRotors([0, 0, 0], CLOUD_TARGET, values => cloudReadings(values),{hasFace:false});
export const cloudAngles=values=>CLOUD_LINKS.map((link,index)=>[values[link.outer],mod(CLOUD_TARGET[index]-link.ratio*values[link.inner],4)]);
export const cloudGap = makeRotors([3, 2, 2], GAP_TARGET, values => cloudReadings(values, true));
export const CALIBRATION_TARGET = Object.freeze([2, 1, 3]);
export const calibration = makeRotors([0, 0, 0], CALIBRATION_TARGET, values => values);
