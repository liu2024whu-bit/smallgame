import {displayLayout} from '../data/display.js';

export function applyGameDisplay(shell,settings,scene){
 const layout=displayLayout(settings,scene);
 for(const [key,value]of Object.entries({'--display-aspect':layout.ratio,'--display-limit':layout.limit,'--picture-width':layout.width+'%','--picture-height':layout.height+'%'}))shell.style.setProperty(key,value);
}
