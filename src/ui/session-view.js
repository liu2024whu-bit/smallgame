import {bindMusicView} from './music-view.js';
import {bindSettingsView} from './settings-view.js';
import {bindNavigationView} from './navigation-view.js';

// Optional system views own temporary listeners only for their open dialog.
export function bindSessionView(root,player,options){
 const cleanup=[bindMusicView(root,player,options),bindSettingsView(root),bindNavigationView(root)];
 return ()=>cleanup.forEach(dispose=>dispose());
}
