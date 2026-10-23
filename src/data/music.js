// No recording is substituted by a similarly named song or a synthesized cover.
export const MUSIC = Object.freeze([
  { id:'window', title:'窗边', by:'小屋里的琴声', score:0 },
  { id:'pages', title:'慢慢翻页', by:'小屋里的琴声', score:1 },
  { id:'starlight', title:'晚一点的星光', by:'小屋里的琴声', score:2 },
  { id:'encounter', title:'遇见', by:'孙燕姿' },
  { id:'birds', title:'鸟之诗', by:'Lia · AIR' },
  { id:'unknown', title:'无人知晓', by:'《流氓叙事》里的那首' },
  { id:'season', title:'等你的季节', by:'《季风2》里的那首' },
  { id:'sunshine', title:'阳光下的星星', by:'金海心' },
  { id:'farewell', title:'诀别书', by:'邓垚' },
]);
export const MUSIC_BY_ID = Object.freeze(Object.fromEntries(MUSIC.map(track=>[track.id,track])));
export const isBuiltIn = id => Number.isInteger(MUSIC_BY_ID[id]?.score);
export function nextTrack(current, available, order='cycle') {
  if(order==='repeat'&&available.includes(current))return current;
  const ids=MUSIC.filter(track=>available.includes(track.id)).map(track=>track.id);
  return ids.length?ids[(ids.indexOf(current)+1)%ids.length]:null;
}
export const formatTime = seconds => Number.isFinite(seconds)&&seconds>=0 ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00';
