import {PUZZLES} from '../data/puzzles.js';
import {KEEPSAKES} from '../data/keepsakes.js';
import {ITEMS} from '../data/items.js';
import {COLLECTIONS} from '../data/assets.js';
import {ACHIEVEMENTS} from '../data/activities.js';
import {EVIDENCE_TITLES} from '../ui/evidence.js';
import {FLOWERS} from '../data/clues.js';
import {SCENE_BY_ID} from '../data/scenes.js';
import {RECORD_DISPLAY} from '../data/record-display.js';
import {WITNESSES} from './walkthrough.js';
import {BOOKS} from '../puzzles/books.js';

export const REVIEW_CASES=[
  {id:'opening',name:'开始',group:'故事',mode:'title',source:'src/ui/welcome.js'},
  ...[0,1,2].map(step=>({id:'intro-'+step,name:['邀请','风先到了','邀请背面'][step],group:'故事',mode:'intro',step,source:'src/ui/intro.js'})),
  ...['with-slip','ready','attempt','returned'].map(stage=>({id:'books-'+stage,name:'书脊之间 · '+({'with-slip':'借阅签放好了',ready:'还没拉抽屉',attempt:'抽屉还合着',returned:'纸签取回了'})[stage],group:'机关里的变化',puzzle:'books',setupMoves:stage==='ready'?WITNESSES.books.slice(0,-1):stage==='returned'?[{type:'fit',index:0},{type:'reorder',from:0,to:2},{type:'unfit',index:0}]:[{type:'fit',index:0},...(stage==='attempt'?[{type:'submit'}]:[])],panel:{type:'puzzle',id:'books'},source:'src/ui/puzzles/library.js · src/puzzles/books.js'})),
  ...[false,true].map(askedSlip=>({id:'books-unfound'+(askedSlip?'-asked':''),name:'书脊之间 · '+(askedSlip?'空夹座':'借阅签还没带来'),group:'机关里的变化',puzzle:'books',unclaimed:['postbox'],panel:{type:'puzzle',id:'books',view:{askedSlip}},source:'src/ui/puzzles/library.js'})),
  ...[false,true].flatMap(completed=>BOOKS.map((title,book)=>({id:'books-page-'+(completed?'done-':'')+book,name:'书脊之间 · '+title+(completed?'（后来又翻开）':''),group:'机关里的变化',puzzle:'books',completed,unclaimed:completed?['books']:[],panel:{type:'puzzle',id:'books',view:{library:'book',book}},source:'src/ui/library-papers.js'}))),
  ...[false,true].flatMap(completed=>[false,true].map(slipBack=>({id:'books-slip-'+(completed?'done-':'')+slipBack,name:'书脊之间 · 借阅签'+(slipBack?'背面':'正面')+(completed?'（抽屉开了）':''),group:'机关里的变化',puzzle:'books',completed,unclaimed:completed?['books']:[],setupMoves:completed?[]:[{type:'fit',index:0}],panel:{type:'puzzle',id:'books',view:{library:'slip',slipBack}},source:'src/ui/library-papers.js'}))),
  {id:'item-borrowSlip-back',name:'借阅签 · 背面',group:'纸面线索',full:true,panel:{type:'item',id:'borrowSlip',view:{slipBack:true}},source:'src/ui/library-papers.js'},
  ...PUZZLES.flatMap(p=>[false,true].map(completed=>({id:p.id+(completed?'-done':''),name:p.title+(completed?' · 已解开':''),group:completed?'机关完成后':'每个机关',puzzle:p.id,keywords:p.instruction+' '+p.hints.join(' '),completed,unclaimed:completed?[p.id]:[],panel:{type:'puzzle',id:p.id},source:'src/ui/puzzles/ · src/data/puzzles.js'}))),
  ...PUZZLES.filter(p=>p.rewards.length).flatMap(p=>Array.from({length:2**p.rewards.length-1},(_,i)=>({id:p.id+'-collected-'+(i+1),name:p.title+' · 已拿起'+p.rewards.filter((_,j)=>(i+1)&(1<<j)).length+'件',group:'物件拿走以后',puzzle:p.id,completed:true,unclaimed:[p.id],takeRewards:p.rewards.filter((_,j)=>(i+1)&(1<<j)),panel:{type:'puzzle',id:p.id},source:'src/data/rewards.js · src/ui/puzzles/'}))),
  ...PUZZLES.map(p=>({id:p.id+'-hints',name:p.title+' · 提醒',group:'主动打开的提醒',puzzle:p.id,hints:true,panel:{type:'puzzle',id:p.id},source:'src/data/puzzles.js'})),
  {id:'paper-unfound',name:'试印 · 还没拾起书签',group:'机关里的变化',puzzle:'paper',pickups:['thread'],panel:{type:'puzzle',id:'paper'},source:'src/ui/puzzles/press.js'},
  {id:'paper-open',name:'试印 · 滑盖打开',group:'机关里的变化',puzzle:'paper',setupMoves:[{type:'open'}],panel:{type:'puzzle',id:'paper'},source:'src/ui/puzzles/press.js'},
  ...[false,true].map(pressProof=>({id:pressProof?'paper-proof-look':'paper-proof',name:pressProof?'试印 · 拿近比较':'试印 · 留下试纸',group:'机关里的变化',puzzle:'paper',setupMoves:[{type:'open'},{type:'print'}],panel:{type:'puzzle',id:'paper',view:{pressProof}},source:'src/ui/puzzles/press.js'})),
  {id:'paper-done-proof-look',name:'试印 · 完成后拿近比较',group:'机关里的变化',puzzle:'paper',completed:true,unclaimed:['paper'],panel:{type:'puzzle',id:'paper',view:{pressProof:true}},source:'src/ui/puzzles/press.js'},
  {id:'cloud-unfound',name:'两面的云 · 棉线还没拾起',group:'机关里的变化',puzzle:'cloud',pickups:['bookmark'],panel:{type:'puzzle',id:'cloud'},source:'src/ui/puzzles/cloud.js'},
  {id:'cloud-back',name:'两面的云 · 背面的星',group:'机关里的变化',puzzle:'cloud',panel:{type:'puzzle',id:'cloud',view:{back:true}},source:'src/ui/puzzles/cloud.js'},
  ...[false,true].map(back=>({id:back?'cloud-front-paired-back':'cloud-front-paired',name:back?'两面的云 · 星还分着':'两面的云 · 前窗合拢',group:'机关里的变化',puzzle:'cloud',setupMoves:[{type:'set-turn',index:0,value:1}],panel:{type:'puzzle',id:'cloud',view:{back}},source:'src/ui/puzzles/cloud.js'})),
  {id:'cloud-done-back',name:'两面的云 · 合上的星',group:'机关里的变化',puzzle:'cloud',completed:true,panel:{type:'puzzle',id:'cloud',view:{back:true}},source:'src/ui/puzzles/cloud.js'},
  ...['empty-lit','film','mirror','book','aligned','flipped-wrong'].map((stage,index)=>({id:'calibration-'+stage,name:'借点光 · '+['空架开灯','透片在滑架上','圆镜借来光','三件都在','还没描下的窗','小伞反过来了'][index],group:'机关里的变化',puzzle:'calibration',setupMoves:[{type:'power'},...(index>0?[{type:'fit',index:0}]:[]),...(index>1?[{type:'fit',index:1}]:[]),...(index>2?[{type:'fit',index:2}]:[]),...(index>3?[{type:'set-turn',index:0,value:2},{type:'set-turn',index:1,value:1},{type:'set-turn',index:2,value:3}]:[]),...(index===4?[{type:'flip'}]:[])],panel:{type:'puzzle',id:'calibration'},source:'src/ui/puzzles/light.js · src/puzzles/light-geometry.js'})),
  ...[['mirror-only',[1]],['book-only',[2]],['film-book',[0,2]],['mirror-book',[1,2]]].map(([stage,slots])=>({id:'calibration-'+stage,name:'借点光 · '+slots.map(index=>['透片','圆镜','书签'][index]).join('与'),group:'机关里的变化',puzzle:'calibration',setupMoves:[{type:'power'},...slots.map(index=>({type:'fit',index}))],panel:{type:'puzzle',id:'calibration'},source:'src/ui/puzzles/light.js'})),
  ...[false,true].map(done=>({id:'calibration-'+(done?'done':'aligned')+'-close',name:'借点光 · '+(done?'留住的窗':'窗影')+'近看',group:'机关里的变化',puzzle:'calibration',completed:done,setupMoves:done?[]:[{type:'power'},...[0,1,2].map(index=>({type:'fit',index})),...[2,1,3].map((value,index)=>({type:'set-turn',index,value})),{type:'flip'}],panel:{type:'puzzle',id:'calibration',view:{closeLook:true}},source:'src/ui/puzzles/light.js · src/ui/view-actions.js'})),
  ...['detail','ready','attempt'].map(stage=>({id:'postbox-'+stage,name:'晚邮 · '+({detail:'字轮近看',ready:'还没拉扣',attempt:'锁扣弹回'})[stage],group:'机关里的变化',puzzle:'postbox',setupMoves:stage==='ready'?[1,0,2,9].map((value,index)=>({type:'set',index,value})):stage==='attempt'?[{type:'submit'}]:[],panel:{type:'puzzle',id:'postbox',view:{postal:'detail'}},source:'src/ui/puzzles/postal.js · src/puzzles/locks.js'})),
  ...[0,1].flatMap(card=>[false,true].map(back=>({id:`postbox-paper-${card}-${back}`,name:'晚邮 · '+(card?'南京':'武汉')+(back?'纸背':'邮片'),group:'机关里的变化',puzzle:'postbox',panel:{type:'puzzle',id:'postbox',view:{postal:'papers',card,back}},source:'src/ui/puzzles/postal.js · src/ui/postal-papers.js'}))),
  ...[0,.5,1].map((postalAim,i)=>({id:'postbox-mirror-'+i,name:'晚邮 · '+['雨在镜中','镜子转过中间','树在镜中'][i],group:'机关里的变化',puzzle:'postbox',panel:{type:'puzzle',id:'postbox',view:{postal:'papers',card:1,back:true,reflected:true,postalAim}},source:'src/ui/puzzles/postal.js · src/ui/interactions/postal.js'})),
  {id:'postbox-done-papers',name:'晚邮 · 又翻了翻',group:'机关里的变化',puzzle:'postbox',completed:true,panel:{type:'puzzle',id:'postbox',view:{postal:'papers',card:1,back:true,reflected:true,postalAim:1}},source:'src/ui/puzzles/postal.js'},
  ...['desk','window','collection','entry','rain','atelier','birthday','party'].map(id=>({id:'room-'+id,name:({desk:'书桌',window:'窗边',collection:'收藏柜',entry:'门边',rain:'雨廊',atelier:'画桌',birthday:'生日桌',party:'准备台'})[id],group:'场景',full:true,scene:id,source:'src/ui/room.js · src/data/scenes.js'})),
  ...['sky','naruto','hashira','genshin','hei','prince','cities','gifts'].map(id=>({id:'collection-'+id,name:({sky:'光遇',naruto:'带土与卡卡西',hashira:'九位柱',genshin:'魈与流浪者',hei:'罗小黑战记Ⅱ',prince:'小王子',cities:'校园折页',gifts:'小物'})[id],group:'收藏与小记',full:true,panel:{type:'collection',id},source:'src/ui/exhibits.js · src/data/memories.js'})),
  ...['clues','memories','collections','activities'].map(tab=>({id:'journal-'+tab,name:({clues:'线索',memories:'以前',collections:'收藏目录',activities:'小记'})[tab],group:'收藏与小记',full:true,panel:{type:'journal',tab},source:'src/ui/notebook.js · src/data/activities.js'})),
  ...['cat','dog'].flatMap(id=>[false,true].map(petAwake=>({id:id+(petAwake?'-awake':''),name:(id==='cat'?'小猫':'小狗')+(petAwake?' · 醒着':''),group:'小住客',panel:{type:'pet',id,view:{petAwake}},source:'src/ui/pets.js'}))),
  {id:'candles',name:'点蜡烛',group:'故事',full:true,beforeEnding:true,panel:{type:'candles',view:{candles:0}},source:'src/ui/birthday.js'},
  {id:'ending',name:'生日快乐',group:'故事',full:true,panel:{type:'ending'},source:'src/ui/ending.js · src/data/memories.js'},
  {id:'ending-last',name:'下一页',group:'故事',full:true,panel:{type:'ending',view:{lastPage:true}},source:'src/ui/ending.js'},
  {id:'encore',name:'彩蛋',group:'故事',full:true,panel:{type:'encore',view:{wind:360,letter:true}},source:'src/ui/achievements.js'},
  ...['picture','save'].map(section=>({id:'settings-'+section,name:section==='picture'?'画面设置':'存档设置',group:'其他页面',full:true,panel:{type:'settings',view:{section}},source:'src/ui/settings.js'})),
  ...['rooms','settings','music','about','how-to','flowers','reading','interests'].map(type=>({id:type==='flowers'?'flower-book':type,name:({rooms:'小屋导航',settings:'设置',music:'唱片',about:'这间小屋','how-to':'怎么玩',flowers:'花',reading:'书与电影',interests:'平时'})[type],group:'其他页面',full:true,panel:{type},source:'src/ui/'+({rooms:'navigation',about:'welcome','how-to':'panels',flowers:'notebook',reading:'notebook',interests:'notebook'}[type]??type)+'.js'})),
  {id:'music-songs',name:'想一起听的',group:'唱片的另一面',full:true,panel:{type:'music',view:{musicShelf:'songs'}},source:'src/ui/music.js · src/data/music.js'},
  {id:'music-original',name:'无人知晓 · 录音选择',group:'唱片的另一面',full:true,panel:{type:'music',view:{musicShelf:'songs'}},click:'[data-track-row="unknown"] summary',source:'src/ui/music.js · src/data/music.js'},
  {id:'about-credits',name:'页脚的小字',group:'其他页面',full:true,panel:{type:'about'},click:'.about-credits summary',source:'src/ui/welcome.js'},
  {id:'how-to-keyboard',name:'键盘也有一份',group:'其他页面',full:true,panel:{type:'how-to'},click:'.keyboard-note summary',source:'src/ui/panels.js'},
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
  ...[0,1].flatMap(card=>[false,true].map(reflected=>({id:'postcard-'+card+'-'+reflected,name:(card?'南京':'武汉')+(reflected?' · 镜中':' · 纸背'),group:'纸面线索',full:true,panel:{type:'collection',id:'cities',view:{card,back:true,reflected,postalAim:1}},source:'src/ui/exhibits.js · src/ui/puzzles/postal.js'}))),
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
