const AUDIO_KEYS=new Set(['sound','volume','music','musicVolume','effectsVolume','musicTrack','musicOrder']);

// A background song ending must not rebuild a puzzle under the player's pointer.
export function audioOnlyUpdate(previous,next){
  if(!previous||previous===next||previous.settings===next.settings)return false;
  if(Object.keys(next).some(key=>key!=='settings'&&previous[key]!==next[key]))return false;
  return Object.keys(next.settings).every(key=>AUDIO_KEYS.has(key)||previous.settings[key]===next.settings[key]);
}
