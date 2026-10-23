export const PERSISTENT_TOOL_USES = Object.freeze({ 'birthday-door':{item:'crank',requires:['stitch']} });
export const ROOM_TOOL_TARGETS = Object.freeze({
  'entry:ring-lamp':'birthday-door',
  'rain:rain-postcards':'postcard-mirror',
  'window:postcards':'postcard-mirror',
  'birthday:p-chocolate':'chocolate-cover',
});
export function toolFor(target) {
  if(target?.startsWith('flower-pin:'))return 'bookmark';
  return {'birthday-door':'crank','postcard-mirror':'mirror','chocolate-cover':'transparency'}[target];
}
