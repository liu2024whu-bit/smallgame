async function loadAudio(blob) {
  const url=URL.createObjectURL(blob),element=new Audio();
  element.preload='auto';element.src=url;
  try{
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>done(new Error('这份音频暂时读不开，换个 MP3 试试？')),12000);
      const done=error=>{clearTimeout(timer);element.onloadedmetadata=null;element.onerror=null;error?reject(error):resolve();};
      element.onloadedmetadata=()=>done(Number.isFinite(element.duration)&&element.duration>0?null:new Error('这份音频还没有读出长度。'));
      element.onerror=()=>done(new Error('浏览器读不开这份音频，换个格式试试？'));
      element.load();
    });
    return {element,url};
  }catch(error){element.removeAttribute('src');element.load();URL.revokeObjectURL(url);throw error;}
}
export async function probeAudio(blob) {
  const {element,url}=await loadAudio(blob);
  const duration=element.duration;element.removeAttribute('src');element.load();URL.revokeObjectURL(url);return duration;
}
export async function createMediaDeck(context,destination,blob,offset,onEnded,onError) {
  const {element,url}=await loadAudio(blob);
  let source,stopped=false;
  function stop(){if(stopped)return;stopped=true;element.onended=null;element.onerror=null;element.pause();element.removeAttribute('src');element.load();source?.disconnect();URL.revokeObjectURL(url);}
  try{
    source=context.createMediaElementSource(element);source.connect(destination);
    element.currentTime=Math.max(0,Math.min(offset,element.duration-.05));
    element.onended=onEnded;element.onerror=()=>onError('这首歌刚才停了一下，可以再试一次。');
    await element.play();
    return {get duration(){return element.duration;},get time(){return element.currentTime;},stop};
  }catch(error){stop();throw error;}
}
