// Regions include the whole changed object and a quiet feathered margin.
// Each completed mechanism reveals only its own paint; unrelated puzzles stay intact.
import {POSTAL_ROOM_AREA} from './postal.js';
import {GARDEN_ROOM_DRAWER_REGION} from './garden.js';
import {CLOUD_ROOM_REGION} from './cloud.js';
import {LIBRARY_ROOM_DRAWER_REGION} from './library.js';
import {SCREEN_ROOM_REGION,SCREEN_ROOM_POCKET_REGION} from './screen.js';
import {CHOCOLATE_ROOM_PATCH} from './chocolate.js';
import {COCOA_ROOM_PATCH} from './cocoa.js';
import {MAZE_ROOM_REGION} from './maze-apparatus.js';
import {BALANCE_ROOM} from './balance-apparatus.js';
import {DRAWER_ROOM_REGION} from './drawer-apparatus.js';
import {PACKING_ROOM} from './packing-apparatus.js';
import {PIANO_ROOM_REGION} from './piano.js';
export const BASE_SCENE_PAINT=Object.freeze([
  {scene:'entry',asset:'flipRoom',region:[66.1,68.3,9.3,8.7]},
  {scene:'birthday',asset:'pianoRoom',region:PIANO_ROOM_REGION},
  {scene:'entry',asset:'drawerRoomClear',region:DRAWER_ROOM_REGION},
  {scene:'entry',asset:'packingRoom',region:PACKING_ROOM.region},
  {scene:'collection',asset:'collectionScreenRoom',region:SCREEN_ROOM_REGION},
  {scene:'collection',asset:'mazeRoomBase',region:MAZE_ROOM_REGION},
  {scene:'collection',asset:'balanceRoom',region:BALANCE_ROOM.region},
  {scene:'birthday',asset:'chocolateRoomTable',region:CHOCOLATE_ROOM_PATCH},
  {scene:'birthday',asset:'cocoaRoomTable',region:COCOA_ROOM_PATCH},
]);
export const SCENE_CHANGES=Object.freeze([
  {scene:'rain',activity:'yanyun:open',asset:'jianghuRoomOpen',region:[36,55,24,14.5],alt:'桌下的小抽屉打开了，纸签和铜钱仍在里面'},
  {scene:'collection',puzzle:'screen',asset:'collectionScreenOpen',region:SCREEN_ROOM_POCKET_REGION,alt:'纸屏底座的小匣打开了'},
  {scene:'desk',puzzle:'books',asset:'deskBooksOpen',region:LIBRARY_ROOM_DRAWER_REGION,alt:'书座的小抽屉打开了'},
  {scene:'window',puzzle:'cloud',unless:'cloudGap',asset:'windowCloudOpen',region:CLOUD_ROOM_REGION,alt:'双面云景的两侧纸门打开了'},
  {scene:'window',puzzle:'cloudGap',asset:'windowCloudBack',region:CLOUD_ROOM_REGION,alt:'云景的背面朝外，纸带留在木边'},
  {scene:'window',puzzle:'flowers',asset:'windowRoomOpen',region:GARDEN_ROOM_DRAWER_REGION,alt:'花架底座的小屉拉开了'},
  {scene:'rain',puzzle:'postbox',asset:'postalRoomOpen',region:POSTAL_ROOM_AREA,alt:'邮匣打开了，柜门仍在原来的铰链上'},
  {scene:'atelier',puzzle:'wordlock',asset:'wordDeskOpen',region:[40.5,36.5,40,21.5],alt:'五格字匣的小抽屉松开了'},
  {scene:'collection',puzzle:'melody',asset:'collectionAfter',region:[74,47,11,19],alt:'音乐盒打开了，音钉停在曲谱的高低上'},
  {scene:'birthday',activity:'birthday:unwrap',asset:'birthdayUnwrapped',region:[74,32,14,33],alt:'礼物袋拆开了，米色小兔露出头来'},
]);

export const sceneChanges=state=>SCENE_CHANGES.filter(change=>change.scene===state.scene&&(!change.unless||!state.solved.includes(change.unless))&&(change.activity?state.activities.includes(change.activity):state.solved.includes(change.puzzle)));
export function paintMask([x,y,width,height]) {
  const feather=.6;
  return `linear-gradient(to right,transparent ${x}%,#000 ${x+feather}%,#000 ${x+width-feather}%,transparent ${x+width}%),linear-gradient(to bottom,transparent ${y}%,#000 ${y+feather}%,#000 ${y+height-feather}%,transparent ${y+height}%)`;
}
