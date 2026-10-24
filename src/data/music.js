const official=id=>'https://music.163.com/song/media/outer/url?id='+id+'.mp3';
export const MUSIC = Object.freeze([
  {id:'window',title:'窗边',by:'小屋里的琴声',file:'assets/audio/window.mp3'},
  {id:'pages',title:'慢慢翻页',by:'小屋里的琴声',file:'assets/audio/pages.mp3'},
  {id:'starlight',title:'晚一点的星光',by:'小屋里的琴声',file:'assets/audio/starlight.mp3'},
  {id:'birthday',title:'生日快乐',by:'小屋里的八音盒',file:'assets/audio/birthday.mp3'},
  {id:'birthday-whistle',title:'生日快乐 · 口哨',by:'Joseph SARDIN',file:'assets/audio/birthday-whistle.mp3'},
  {id:'encounter',title:'遇见',by:'孙燕姿 · 2010垦丁现场',stream:official(34200629),link:'https://music.163.com/song?id=34200629'},
  {id:'birds',title:'鸟之诗',by:'Lia · AIR / Ornithopter',stream:official(761594),link:'https://music.163.com/song?id=761594'},
  {id:'unknown',title:'无人知晓',by:'田馥甄 ·《流氓叙事》歌单收录',link:'https://music.163.com/song?id=1481929839'},
  {id:'season',title:'等你的季节',by:'严艺丹 · 请服仙丹现场',stream:official(3392065663),link:'https://music.163.com/song?id=3392065663',note:'《季风2》里那首歌，另备了作曲者的现场版。'},
  {id:'sunshine',title:'阳光下的星星',by:'金海心 · 创作自选集',stream:official(1353159923),link:'https://music.163.com/song?id=1353159923'},
  {id:'farewell',title:'诀别书',by:'邓垚',stream:official(2038191895),link:'https://music.163.com/song?id=2038191895'},
]);
export const MUSIC_BY_ID = Object.freeze(Object.fromEntries(MUSIC.map(track=>[track.id,track])));
export const isBuiltIn = id => Boolean(MUSIC_BY_ID[id]?.file);
export const preparedSource = id => MUSIC_BY_ID[id]?.file??MUSIC_BY_ID[id]?.stream??null;
export function nextTrack(current,available,order='cycle') {
  if(order==='repeat'&&available.includes(current))return current;
  const ids=MUSIC.filter(track=>available.includes(track.id)).map(track=>track.id);
  return ids.length?ids[(ids.indexOf(current)+1)%ids.length]:null;
}
export const formatTime = seconds => Number.isFinite(seconds)&&seconds>=0 ? Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0') : '0:00';
