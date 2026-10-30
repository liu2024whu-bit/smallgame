import {viewControl} from '../view-control.js';
import {BALANCE_CAMERAS,BALANCE_CROWDED} from '../../data/balance-apparatus.js';
import {balanceModel} from '../balance-props.js';
export function renderBalance(p,{view={},state}={}){
 const mode=view.balanceView==='paper'?'paper':'whole',camera=BALANCE_CAMERAS[mode],done=state?.solved.includes('balance')??false;
 const model=balanceModel(p,{done,reading:mode==='paper'}),notice=!done&&view.balanceCrowded?BALANCE_CROWDED:'';
 return `<div class="balance-workbench"><div class="balance-viewport" style="--balance-aspect:${camera[2]/camera[3]}"><div class="balance-world" data-source-camera="${camera}">${model}</div></div><nav class="balance-navigation" aria-label="天平取景">${[['whole','天平'],['paper','称量纸']].map(([id,label])=>`${viewControl(`${label}`,`data-balance-view="${id}" data-focus="balance-view-${id}" aria-current="${mode===id}"`)}`).join('')}</nav><p class="balance-status" role="status">${notice}</p><span class="sr-only">六件小砝码，分到两边，各有三件。纸上记录了三次平衡的称量。可以直接拖动，也可以先拿起再放到空位；方向键可以换位置，Esc放回。盘里还有位置时，可以自由试称。</span></div>`;
}
