import {icon,motif,escape} from './dom.js';
// Looking closer is a camera action, not a line of narration below the prop.
export function viewControl(label,attrs='',mark=''){
 if(/aria-current=["']true["']/.test(attrs))return `<span class="sr-only">当前：${escape(label)}</span>`;
 if(!mark)mark=/整|架上|桌边|纸屏|回到|合上/.test(label)?'zoom-out':/左|前一/.test(label)?'left':/右|后一/.test(label)?'right':/背|翻|转/.test(label)?'undo':/匣|锁|字轮/.test(label)?'lock':/月/.test(label)?'moon':/花|菊|薰|郁/.test(label)?'daisy':/纸|书|页|谱|画/.test(label)?'book':/片场|放/.test(label)?'play':'zoom-in';
 const drawing=['book','moon','daisy'].includes(mark)?motif(mark):icon(mark);
 return `<button class="object-view-control" ${attrs} ${/aria-label=/.test(attrs)?'':`aria-label="${escape(label)}"`} title="${escape(label)}">${drawing}<span class="view-control-label" aria-hidden="true">${escape(label)}</span></button>`;
}
