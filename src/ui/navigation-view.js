// Scale a complete painting, including measured details and type, as one miniature.
export function bindNavigationView(root){
 const windows=[...root.querySelectorAll('.route-scene')];if(!windows.length)return ()=>{};
 const paint=()=>windows.forEach(el=>el.style.setProperty('--scene-scale',el.clientWidth/1600));
 paint();const observer=new ResizeObserver(paint);windows.forEach(el=>observer.observe(el));
 return ()=>observer.disconnect();
}
