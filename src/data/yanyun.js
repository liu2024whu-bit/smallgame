// The paper folio is an optional keepsake, separate from the twelve records.
export const YANYUN_PAGES=Object.freeze([
 {id:'pair',name:'九流门与天泉',caption:'九流门 · 天泉',asset:'jianghuPair'},
 {id:'jiang',name:'江叔',caption:'江无浪',asset:'jianghuJiang'},
 {id:'han',name:'寒姨',caption:'寒香寻',asset:'jianghuHan'},
 {id:'chen',name:'陈叔',caption:'陈子奚',asset:'jianghuChen'},
 {id:'hong',name:'红线',caption:'红线',asset:'jianghuHong'},
 {id:'dao',name:'刀哥',caption:'伊刀',asset:'jianghuDao'},
 {id:'young',name:'少东家',caption:'少东家',asset:'jianghuYoung'},
 {id:'ying',name:'盈盈',caption:'盈盈',asset:'jianghuYing'},
]);
export const YANYUN_CAMERA=Object.freeze([35,210,1466,775]);
export const yanyunVisited=state=>YANYUN_PAGES.filter(p=>p.id==='pair'?state.activities.includes('yanyun:open'):state.activities.includes(`yanyun:person:${p.id}`));
