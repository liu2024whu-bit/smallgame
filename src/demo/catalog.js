import {PUZZLES} from '../data/puzzles.js';
import {KEEPSAKES} from '../data/keepsakes.js';
import {ITEMS} from '../data/items.js';
import {COLLECTIONS} from '../data/assets.js';
import {ACHIEVEMENTS} from '../data/activities.js';
import {EVIDENCE_TITLES} from '../ui/evidence.js';
import {FLOWERS} from '../data/clues.js';
import {SCENE_BY_ID} from '../data/scenes.js';
import {RECORD_DISPLAY} from '../data/record-display.js';

export const REVIEW_CASES=[
  {id:'opening',name:'开始',group:'故事',mode:'title',source:'src/ui/welcome.js'},
  ...[0,1,2].map(step=>({id:'intro-'+step,name:['邀请','风先到了','邀请背面'][step],group:'故事',mode:'intro',step,source:'src/ui/intro.js'})),
  ...PUZZLES.flatMap(p=>[false,true].map(completed=>({id:p.id+(completed?'-done':''),name:p.title+(completed?' · 已解开':''),group:completed?'机关完成后':'每个机关',puzzle:p.id,keywords:p.instruction+' '+p.hints.join(' '),completed,panel:{type:'puzzle',id:p.id},source:'src/ui/puzzles/ · src/data/puzzles.js'}))),
  ...PUZZLES.map(p=>({id:p.id+'-hints',name:p.title+' · 提醒',group:'主动打开的提醒',puzzle:p.id,hints:true,panel:{type:'puzzle',id:p.id},source:'src/data/puzzles.js'})),
  ...['desk','window','collection','entry','rain','atelier','birthday','party'].map(id=>({id:'room-'+id,name:({desk:'书桌',window:'窗边',collection:'收藏柜',entry:'门边',rain:'雨廊',atelier:'画桌',birthday:'生日桌',party:'准备台'})[id],group:'场景',full:true,scene:id,source:'src/ui/room.js · src/data/scenes.js'})),
  ...['sky','naruto','hashira','genshin','hei','prince','cities','gifts'].map(id=>({id:'collection-'+id,name:({sky:'光遇',naruto:'带土与卡卡西',hashira:'九位柱',genshin:'魈与流浪者',hei:'罗小黑战记Ⅱ',prince:'小王子',cities:'校园折页',gifts:'小物'})[id],group:'收藏与小记',full:true,panel:{type:'collection',id},source:'src/ui/exhibits.js · src/data/memories.js'})),
  ...['clues','memories','activities'].map(tab=>({id:'journal-'+tab,name:({clues:'线索',memories:'以前',activities:'小记'})[tab],group:'收藏与小记',full:true,panel:{type:'journal',tab},source:'src/ui/notebook.js · src/data/activities.js'})),
  ...['cat','dog'].flatMap(id=>[false,true].map(petAwake=>({id:id+(petAwake?'-awake':''),name:(id==='cat'?'小猫':'小狗')+(petAwake?' · 醒着':''),group:'小住客',panel:{type:'pet',id,view:{petAwake}},source:'src/ui/pets.js'}))),
  {id:'candles',name:'点蜡烛',group:'故事',full:true,beforeEnding:true,panel:{type:'candles',view:{candles:0}},source:'src/ui/birthday.js'},
  {id:'ending',name:'生日快乐',group:'故事',full:true,panel:{type:'ending'},source:'src/ui/ending.js · src/data/memories.js'},
  {id:'ending-last',name:'下一页',group:'故事',full:true,panel:{type:'ending',view:{lastPage:true}},source:'src/ui/ending.js'},
  {id:'encore',name:'彩蛋',group:'故事',full:true,panel:{type:'encore',view:{wind:360,letter:true}},source:'src/ui/achievements.js'},
  ...['picture','save'].map(section=>({id:'settings-'+section,name:section==='picture'?'画面设置':'存档设置',group:'其他页面',full:true,panel:{type:'settings',view:{section}},source:'src/ui/settings.js'})),
  ...['rooms','settings','music','about','how-to','flowers','reading','interests'].map(type=>({id:type==='flowers'?'flower-book':type,name:({rooms:'小屋导航',settings:'设置',music:'唱片',about:'这间小屋','how-to':'怎么玩',flowers:'花',reading:'书与电影',interests:'平时'})[type],group:'其他页面',full:true,panel:{type},source:'src/ui/'+({rooms:'navigation',about:'welcome','how-to':'panels',flowers:'notebook',reading:'notebook',interests:'notebook'}[type]??type)+'.js'})),
  {id:'music-songs',name:'想一起听的',group:'唱片的另一面',full:true,panel:{type:'music',view:{musicShelf:'songs'}},source:'src/ui/music.js · src/data/music.js'},
  {id:'music-original',name:'无人知晓 · 录音选择',group:'唱片的另一面',full:true,panel:{type:'music',view:{musicShelf:'songs'}},click:'[data-track-row="unknown"] summary',source:'src/ui/music.js · src/data/music.js'},
  ...[0,1].map(id=>({id:'campus-'+id,name:id?'南京大学':'武汉大学',group:'其他页面',full:true,panel:{type:'campus',id},source:'src/ui/campus.js'})),

  ...KEEPSAKES.map(k=>({id:'keepsake-'+k.id,name:k.name,group:'收集物近景',full:true,panel:{type:'keepsake',id:k.id},source:'src/ui/notebook.js · src/data/keepsakes.js'})),
  ...Object.entries(ITEMS).map(([id,item])=>({id:'item-'+id,name:item.name,group:'随身物件',full:true,panel:{type:'item',id},source:'src/ui/notebook.js · src/data/items.js'})),
  {id:'card-back',name:'贺卡背面',group:'随身物件',full:true,panel:{type:'item',id:'birthdayCard',view:{back:true}},source:'src/ui/birthday-tools.js'},
  {id:'ribbon-turned',name:'纸带另一头',group:'随身物件',full:true,panel:{type:'item',id:'birthdayRibbon',view:{turned:true}},source:'src/ui/birthday-tools.js'},
  ...Object.entries(EVIDENCE_TITLES).map(([id,name])=>({id:'evidence-'+id,name,group:'纸面线索',full:true,panel:{type:'evidence',id},source:'src/ui/evidence.js · src/data/ciphers.js'})),
  {id:'evidence-rows-flipped',name:'透片翻正',group:'纸面线索',full:true,panel:{type:'evidence',id:'rows',view:{flipped:true}},source:'src/ui/evidence.js'},
  {id:'flower-strip',name:'胶片纸条',group:'纸面线索',full:true,panel:{type:'flower-note'},source:'src/ui/puzzles/flowers.js'},
  ...[0,1,2].map(focus=>({id:'naruto-detail-'+focus,name:['稿本','明信片','挂件'][focus],group:'收藏的另一面',full:true,panel:{type:'collection',id:'naruto',view:{focus}},source:'src/ui/exhibits.js'})),
  {id:'genshin-pencil',name:'画稿未添色',group:'收藏的另一面',full:true,omitActivities:['art:color'],panel:{type:'collection',id:'genshin'},source:'src/ui/exhibits.js'},
  {id:'cinema-playing',name:'电影开场',group:'收藏的另一面',full:true,panel:{type:'collection',id:'hei',view:{playing:true}},source:'src/ui/exhibits.js'},
  {id:'prince-open',name:'小王子翻开',group:'收藏的另一面',full:true,panel:{type:'collection',id:'prince',view:{open:true}},source:'src/ui/exhibits.js'},
  {id:'sky-second',name:'正太与樱花',group:'收藏的另一面',full:true,click:'[data-action="sky-pair"]',panel:{type:'collection',id:'sky'},source:'src/ui/sky.js'},
  ...COLLECTIONS.hashira.names.slice(1).map((name,index)=>({id:'hashira-'+(index+1),name,group:'收藏的另一面',full:true,panel:{type:'collection',id:'hashira',view:{figure:index+1}},source:'src/ui/exhibits.js'})),
  ...[0,1].flatMap(card=>[false,true].map(reflected=>({id:'postcard-'+card+'-'+reflected,name:(card?'南京':'武汉')+(reflected?' · 照正':' · 纸背'),group:'纸面线索',full:true,panel:{type:'collection',id:'cities',view:{card,back:true,reflected}},source:'src/ui/exhibits.js'}))),
  ...[0,1].map(id=>({id:'campus-'+id+'-blank',name:(id?'南京':'武汉')+' · 未盖图章',group:'校园里的角落',full:true,omitActivities:[id?'campus:nju':'campus:whu'],panel:{type:'campus',id},source:'src/ui/campus.js · src/ui/campus-marks.js'})),
  ...[0,1,2,3].map(corner=>({id:'campus-stop-'+corner,name:['杜厦图书馆','香雪海','页边的书桌','北大楼'][corner],group:'校园里的角落',full:true,omitActivities:corner===2?['campus:desk']:[],panel:{type:'campus',id:1,view:{corner,looked:true}},source:'src/ui/campus.js · src/data/campuses.js'})),
  ...ACHIEVEMENTS.flatMap(record=>[false,true].map(full=>({id:'record-'+record.id+(full?'-done':''),name:record.title+(full?' · 已收好':' · 还没翻到'),group:'每张小记',full,panel:{type:'journal',tab:'activities',view:{record:record.id,recordSide:RECORD_DISPLAY[record.id].x>50?'right':'left'}},source:'src/ui/achievements.js · src/data/activities.js'}))),
  ...FLOWERS.map(flower=>({id:'flower-'+flower.id,name:flower.name,group:'花的祝福',full:true,flower:flower.id,panel:{type:'flowers'},source:'src/data/clues.js'})),
  ...['rain','atelier','birthday'].map(id=>({id:'passage-'+id,name:SCENE_BY_ID[id].title+' · 门外',group:'还没打开的地方',panel:{type:'passage',id},source:'src/ui/birthday.js'})),
  ...['fries','parcel'].map(id=>({id:'birthday-'+id,name:id==='fries'?'薯条纸袋':'未拆的礼物袋',group:'生日桌边',full:true,beforeEnding:true,panel:{type:'birthday-note',id},source:'src/ui/birthday.js'})),
  {id:'parcel-open',name:'米色小兔',group:'生日桌边',full:true,panel:{type:'birthday-note',id:'parcel'},source:'src/ui/birthday.js'},
  ...['restart','birthday','birthday-wait'].map(type=>({id:'dialog-'+type,name:({'restart':'重新开始确认',birthday:'留给生日的','birthday-wait':'蛋糕还在等'})[type],group:'系统与回应',panel:{type},source:'src/ui/panels.js'})),
  {id:'music-remove',name:'移除本地音源确认',group:'系统与回应',full:true,panel:{type:'music-remove',id:'encounter'},source:'src/ui/panels.js'},
];
