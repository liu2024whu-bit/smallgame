import {deckFader} from './deck-fade.js';

// This owns native decks and their fades. The player owns intent and position.
export function musicDecks(){
  let current=null,level=0;const retiring=new Map();
  const destroy=handle=>{if(!handle)return;handle.fade.dispose();handle.abort.abort();handle.deck.stop();};
  function clearRetiring(){for(const [handle,timer] of retiring){clearTimeout(timer);destroy(handle);}retiring.clear();}
  function retire(handle,immediate=false){
    if(!handle)return;
    if(immediate){destroy(handle);return;}
    handle.fade.to(0,180);retiring.set(handle,setTimeout(()=>{retiring.delete(handle);destroy(handle);},200));
  }
  return {
    get current(){return current;},
    create(id,deck,abort,source){const handle={id,deck,abort,source,fade:deckFader(deck)};handle.fade.level(level);return handle;},
    admit(handle){
      const previous=current;current=handle;handle.fade.to(1,550);
      if(previous){previous.fade.to(0,450);retiring.set(previous,setTimeout(()=>{retiring.delete(previous);destroy(previous);},500));}
    },
    release(handle){if(current===handle)current=null;if(retiring.has(handle)){clearTimeout(retiring.get(handle));retiring.delete(handle);}destroy(handle);},
    pause(immediate=false){clearRetiring();const previous=current;current=null;retire(previous,immediate);},
    recover(){
      if(current)return current;
      const previous=[...retiring.keys()].at(-1);if(!previous)return null;
      clearTimeout(retiring.get(previous));retiring.delete(previous);current=previous;previous.fade.to(1,160);return previous;
    },
    level(value){level=value;current?.fade.level(level);for(const handle of retiring.keys())handle.fade.level(level);},
    dispose(){clearRetiring();destroy(current);current=null;},
  };
}
