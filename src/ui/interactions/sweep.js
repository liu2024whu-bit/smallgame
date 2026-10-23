// Ordered rectangle crossings keep a quick stroke continuous between pointer events.
export function sweptTargets(from, to, boxes, padding = 0) {
  return boxes.map((box, index) => {
    let enter = 0, leave = 1;
    for (const [axis, low, high] of [['x', box.left - padding, box.right + padding], ['y', box.top - padding, box.bottom + padding]]) {
      const delta = to[axis] - from[axis];
      if (delta === 0) { if (from[axis] < low || from[axis] > high) return null; continue; }
      const a = (low - from[axis]) / delta, b = (high - from[axis]) / delta;
      enter = Math.max(enter, Math.min(a, b)); leave = Math.min(leave, Math.max(a, b));
      if (enter > leave) return null;
    }
    return { index, enter };
  }).filter(Boolean).sort((a, b) => a.enter - b.enter || a.index - b.index).map(hit => hit.index);
}
