import {writeFile} from 'node:fs/promises';
import {PUZZLES,PUZZLE_BY_ID} from '../src/data/puzzles.js';
import {SCENES} from '../src/data/scenes.js';
import {ITEMS} from '../src/data/items.js';
import {PERSISTENT_TOOL_USES,PUZZLE_TOOL_INPUTS} from '../src/data/tool-uses.js';

const names=ids=>ids.length?ids.map(id=>ITEMS[id]?.name??PUZZLE_BY_ID[id]?.title??id).join('、'):'—';
const main=PUZZLES.filter(p=>!p.optional),tools=[...new Set(PUZZLES.flatMap(p=>p.tools))];
const graph=['flowchart LR',...main.map(p=>`  ${p.id}["${p.title}"]`),
 ...main.flatMap(p=>p.requires.map(id=>`  ${id} --> ${p.id}`)),
  '  postbox -->|实际拾取| borrowSlip["借阅签"]','  borrowSlip -->|夹座释放书列| books',
  '  stitch --> birthdayDoor["摇柄装入生日门"]','  birthdayDoor --> chocolate','  birthdayDoor --> sweets','  birthdayDoor --> ribbons',
 '  sweets --> birthdayLock','  cocoa --> candles["点烛与许愿"]','  sweets --> candles','  birthdayLock --> candles'];
const text=`# V2.9 现有关系图与道具审查底稿

由 \`node tools/relations.mjs\` 从当前数据生成。它描述已实现的依赖，不是改造后的设计承诺；每个项目修改关系后重新生成。场景准入和工具放置仍由core校验，不以此文档驱动游戏。

## 主线与汇合

\`\`\`mermaid
${graph.join('\n')}
\`\`\`

## 每个机关

“完成得到”列记录解开后可领取的物件；实际点击拾取后才进入库存。晚邮的借阅签留在匣内，拿走后可放入书架夹座释放书列。抽看和翻纸不写解题旗标；合适的排列还需实际拉屉，画页与针分别拿起。

| 机关 | 所在场景 | 前置机关 | 所需物品 | 完成得到 | 类型 |
| --- | --- | --- | --- | --- | --- |
${PUZZLES.map(p=>`| ${p.title} | ${SCENES.find(s=>s.id===p.scene)?.title} | ${names(p.requires)} | ${names(p.tools)} | ${names(p.rewards)} | ${p.optional?'独立':'主线'} |`).join('\n')}

## 重复使用

| 物品 | 数据要求它的机关 |
| --- | --- |
${tools.map(id=>`| ${names([id])} | ${PUZZLES.filter(p=>p.tools.includes(id)).map(p=>p.title).join('、')} |`).join('\n')}

独立放置：${Object.entries(PERSISTENT_TOOL_USES).map(([id,use])=>`${names([use.item])} → ${id}（${names(use.requires)}以后）`).join('；')}。机关内嵌合：${Object.entries(PUZZLE_TOOL_INPUTS).map(([id,items])=>`${names(items)} → ${names([id])}`).join('；')}。

## 逐关要继续追问的地方

上表“所需”包含准入检查，不能据此声称每件物品都已有完整抓取、操作或材料反馈。目前明确的直接使用包括试印夹扣、云景牵线、借光三工具嵌合与回收、书架夹座与退签、花架书签、透片覆巧克力、摇柄装门，以及贺卡／纸带／镜子嵌入生日匣。其余关系按P3—P28逐关检查，必要时把仅检查拥有的条件改为可见且合理的操作，或删去不必要条件。

试印与云景可并行；借点光以后，书架与纸屏两支汇入穿线。花架后，纸盒夹层与云间留白两支汇入字间。生日桌与准备台两支汇入许愿。七个独立机关不进入结尾门槛；可选活动和收集物由真实状态派生成就，不维护第二套通关表。

未来改动须同时复核：证据在哪里出现、跨支线是否可能缺物、回访是否有新意义、可否撤销/取消、旧档已完成节点是否仍合法、近远景是否一致。关系多不等于玩法深，避免为了复用而把同一动作重复塞入不同关卡。
`;
await writeFile(new URL('../docs/v29-relations.md',import.meta.url),text,'utf8');
console.log('Wrote current 26-puzzle dependency and tool review.');
