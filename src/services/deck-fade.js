// One volume owner per deck for cross-fades and effects ducking.
export function deckFader(deck,initial=0) {
  let value=initial,target=initial,level=1,timer;
  const paint=()=>{deck.volume=value*level;};paint();
  return {
    level(next){level=next;paint();},
    to(next,milliseconds){
      clearInterval(timer);target=next;
      if(!milliseconds){value=next;paint();return;}
      const start=performance.now(),from=value;
      timer=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/milliseconds);value=from+(target-from)*(t*t*(3-2*t));paint();if(t===1)clearInterval(timer);},30);
    },
    dispose(){clearInterval(timer);},
  };
}
