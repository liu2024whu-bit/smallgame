export const DISPLAY_ASPECTS=Object.freeze([
 {id:'auto',label:'自动 · 原画'},
 {id:'16:9',label:'16:9',ratio:16/9},
 {id:'16:10',label:'16:10',ratio:16/10},
 {id:'4:3',label:'4:3',ratio:4/3},
]);
export const DISPLAY_SIZES=Object.freeze(['fit','1280','1600','1920']);
export const sceneAspect=scene=>scene==='party'?1.5:1672/941;

// The chosen frame contains the complete painting. Hit regions stay on the
// unchanged painting plane; letterboxing never stretches their geometry.
export function displayLayout(settings={},scene='desk'){
 const painting=sceneAspect(scene),ratio=DISPLAY_ASPECTS.find(x=>x.id===settings.displayAspect)?.ratio??painting;
 const limit=DISPLAY_SIZES.includes(settings.displaySize)&&settings.displaySize!=='fit'?settings.displaySize+'px':'100vw';
 return {ratio,limit,width:Math.min(1,painting/ratio)*100,height:Math.min(1,ratio/painting)*100};
}
export function displaySizeChoices(settings,scene){
 const {ratio}=displayLayout(settings,scene);
 return DISPLAY_SIZES.map(id=>({id,label:id==='fit'?'适应窗口':`${id} × ${Math.round(Number(id)/ratio)}`}));
}
