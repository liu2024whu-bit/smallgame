// Buildings and garden layouts follow the official sources in asset-sources.md.
// Paper tabs, sketches and postmarks are fictional game props, not campus maps.
export const CAMPUSES = Object.freeze([
  { key:'whu', name:'武汉大学', stops:[{id:'residence',name:'老斋舍',asset:'campusWhu',detail:'红窗与石阶',x:30,y:43}] },
  { key:'nju', name:'南京大学', stops:[
    {id:'duxia',name:'杜厦图书馆',campus:'仙林',asset:'campusXianlin',detail:'展开的书',x:50,y:49,activity:'campus:duxia'},
    {id:'plum',name:'香雪海',campus:'仙林',asset:'campusPlum',detail:'花间的亭子',x:50,y:49,activity:'campus:plum'},
    {id:'notes',name:'窗边',campus:'仙林',kind:'study'},
    {id:'gulou',name:'北大楼',campus:'鼓楼',asset:'campusNju',detail:'藤蔓与屋脊',x:50,y:40},
  ]},
]);
export const campusStop = (index, corner = 0) => {
  const campus = CAMPUSES[index] ?? CAMPUSES[0];
  return {campus,stop:campus.stops[corner] ?? campus.stops[0]};
};
