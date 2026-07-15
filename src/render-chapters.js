import { STORY } from './content.js';
import { breathWord, finalRibbonCode, ringAge, starCode, windLetters, WIND_RINGS } from './puzzles.js';
import { DIRECTIONS, escapeHTML, store } from './runtime.js';
import { BREATH_GLYPHS, BREATH_LABELS, endingCopy, orderControls, solvedBanner, stageHeader, STAR_GLYPHS, STAR_LABELS } from './view-helpers.js';

export function renderBirth(state, chapter) {
  const solved = state.solved.birth;
  return `${stageHeader(chapter, '第一把锁没有写答案。猫和狗把同一个年份拆成两张吊牌。')}
    <div class="room-scene">
      <div class="room-window"><i></i><i></i><i></i><span>南京的夜色</span></div>
      <div class="room-shelf"><span></span><span></span><span></span><span></span></div>
      <button class="pet pet--cat ${state.discoveries.cat ? 'is-found' : ''}" type="button" data-pet="cat" aria-label="调查书架上的猫">
        <span class="cat-ears"></span><span class="pet-face">• ᴗ •</span><em>Ⅱ ○</em>
      </button>
      <div class="room-desk"><div class="desk-lamp"></div><div class="letter-stack">无地址信</div></div>
      <button class="pet pet--dog ${state.discoveries.dog ? 'is-found' : ''}" type="button" data-pet="dog" aria-label="调查桌边的狗">
        <span class="dog-ears"></span><span class="pet-face">• ﻌ •</span><em>○ Ⅵ</em>
      </button>
      <div class="room-tree"><span></span><i></i><i></i><i></i></div>
    </div>
    <div class="chapter-actions">
      ${solved ? solvedBanner(chapter, '猫在高处，狗在地面。两张吊牌最终组成2006。') : `
        <div class="found-strip"><span>${state.discoveries.cat ? '猫：Ⅱ ○' : '猫：尚未调查'}</span><span>${state.discoveries.dog ? '狗：○ Ⅵ' : '狗：尚未调查'}</span></div>
        <button class="primary-button" type="button" data-open-birth-lock ${state.discoveries.cat && state.discoveries.dog ? '' : 'disabled'}>打开四位旧锁</button>`}
    </div>`;
}

export function renderStars(state, chapter) {
  return `${stageHeader(chapter, '初三那一页没有人物立绘，只留下巫师帽、光环、樱花与一朵被保护的玫瑰。')}
    <div class="star-field">
      <div class="little-planet"><span>玫瑰</span></div>
      ${state.starOrder.map((id, index) => `<div class="constellation constellation--${index + 1}"><i>${STAR_GLYPHS[id]}</i><small>${STAR_LABELS[id]}</small></div>`).join('')}
      <div class="star-thread"></div>
    </div>
    ${state.solved.stars ? solvedBanner(chapter, '四枚星章排好以后，星点数读作2020——从初三开始的那一年。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">巫师帽最早看见光；光环紧随其后。樱花落下以后，玫瑰才被玻璃罩保护。</p>
        ${orderControls(state.starOrder, STAR_LABELS, STAR_GLYPHS, 'starOrder')}
        <div class="result-window"><small>星点读数</small><strong>${starCode(state.starOrder)}</strong></div>
        <button class="primary-button" type="button" data-check-stars>固定星章</button>
      </div>`}`;
}

export function renderWind(state, chapter) {
  const letters = windLetters(state.windRotations);
  return `${stageHeader(chapter, '高中被画成四阵风：青玉长枪、旧风铃、流云斗笠和蓝白羽毛。')}
    <div class="wind-sky">
      <span class="wind-cloud wind-cloud--one"></span><span class="wind-cloud wind-cloud--two"></span>
      <div class="wind-compass"><i></i><b>东</b></div>
      <div class="wind-figure">⌁</div>
    </div>
    ${state.solved.wind ? solvedBanner(chapter, '上一页的2020成为四个转动次数，风轮最终指向EAST。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">“上一页的年份不是终点。把它拆成四个步数，让四阵风各自转动。”</p>
        <div class="wind-wheels">${state.windRotations.map((rotation, index) => `
          <article><small>${['长枪','旧铃','斗笠','羽毛'][index]}</small><button type="button" data-turn-wind="${index}"><span>${WIND_RINGS[index][rotation]}</span><em>${rotation}步</em></button></article>`).join('')}</div>
        <div class="result-window"><small>风窗读数</small><strong>${letters}</strong></div>
        <button class="primary-button" type="button" data-check-wind>让风停下</button>
      </div>`}`;
}

export function renderBreath(state, chapter) {
  return `${stageHeader(chapter, '大一的角色记忆被收进四条线：水纹、风痕、蛇线与紫藤，不与其他章节的画风冲突。')}
    <div class="breath-banner"><span>≈</span><span>〽</span><span>∿</span><span>❋</span></div>
    ${state.solved.breath ? solvedBanner(chapter, '水、风、蛇、紫藤朝东方读取，四段字片组成BIRTHDAY。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">水纹在风痕之前；蛇线紧贴紫藤左边；风痕不在最后。按东方向读取。</p>
        ${orderControls(state.breathOrder, BREATH_LABELS, BREATH_GLYPHS, 'breathOrder')}
        <div class="result-window"><small>呼吸谱</small><strong>${breathWord(state.breathOrder) || '········'}</strong></div>
        <button class="primary-button" type="button" data-check-breath>合上呼吸谱</button>
      </div>`}`;
}

export function renderFilm(state, chapter) {
  return `${stageHeader(chapter, '这是整条时间线里最接近她本人创作的一页。作品不再作为普通图片展示，而是成为底片观察机关。')}
    <div class="film-room">
      <div class="safe-light"></div>
      <div class="film-strip">${[1,2,3,4,5].map(() => '<i></i>').join('')}</div>
      <div class="artwork-stack">
        <figure><img src="assets/art/duo.webp" alt="她创作的带土与卡卡西双人作品"/><figcaption>双人画稿</figcaption></figure>
        <figure class="${state.filmSteps.invert ? 'is-inverted' : ''}"><img src="assets/art/keychain.webp" alt="她创作的钥匙扣正反面设计稿"/><figcaption>正反面设计</figcaption></figure>
        <figure><img src="assets/art/cats.webp" alt="她创作的白猫贴纸画稿"/><figcaption>猫咪动作稿</figcaption></figure>
      </div>
    </div>
    ${state.solved.film ? `${solvedBanner(chapter, '104被拆成三次观察：第一处红色、一次负片、第四只猫，最终得到LXY。')}<button class="secondary-button" type="button" data-open-notebook>${state.notebookSolved ? '查看并肩灯' : '打开隐藏双页手账'}</button>` : `
      <div class="puzzle-card film-puzzle">
        <p class="puzzle-riddle">“104是带卡的数字缩写。”把1、0、4理解为三个动作，而不是一个可直接输入的密码。</p>
        <div class="film-steps">
          <article class="${state.filmSteps.red ? 'is-done' : ''}"><span>1</span><div><strong>第一处醒着的红色</strong><p>双人作品中，哪一处是构图的中央焦点？</p><button type="button" data-film-step="red">选择中央红色纹样</button></div></article>
          <article class="${state.filmSteps.invert ? 'is-done' : ''}"><span>0</span><div><strong>把中间画稿翻成负片</strong><p>正面与反面之间，有一个交叉留下的字母。</p><button type="button" data-film-step="invert">${state.filmSteps.invert ? '负片已显影：X' : '开启负片显影'}</button></div></article>
          <article class="${state.filmSteps.cat ? 'is-done' : ''}"><span>4</span><div><strong>按阅读顺序寻找第四只猫</strong><p>从左上到右下，第四组动作位于哪里？</p><div class="cat-choice">${[1,2,3,4,5].map((n) => `<button type="button" data-cat-choice="${n}">${n}</button>`).join('')}</div></div></article>
        </div>
        <div class="result-window"><small>底片显影</small><strong>${state.filmSteps.red ? 'L' : '·'}${state.filmSteps.invert ? 'X' : '·'}${state.filmSteps.cat ? 'Y' : '·'}</strong></div>
        <button class="primary-button" type="button" data-check-film>冲洗104号底片</button>
      </div>`}`;
}

export function renderCities(state, chapter) {
  return `${stageHeader(chapter, '武汉与南京没有被写成竞争的两座学校，而是两个人此刻生活中的两个坐标。')}
    <div class="city-postcard">
      <div class="city city--wuhan"><span class="city-building">⌂</span><strong>武汉大学</strong><small>樱花 · 江风</small></div>
      <div class="red-thread"></div>
      <div class="city city--nanjing"><span class="city-building">▥</span><strong>南京大学</strong><small>梧桐 · 旧楼</small></div>
    </div>
    ${state.solved.cities ? solvedBanner(chapter, '武汉樱花向东，南京梧桐向西。两枚邮戳的花窗合成1029。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">让武汉的樱花朝东，让南京的梧桐朝西。两片植物隔着红线相望。</p>
        <div class="postmarks">
          <article><small>武汉邮戳</small><button type="button" data-turn-postmark="wuhan"><span style="transform:rotate(${state.postmarks.wuhan * 90}deg)">✿</span><strong>${DIRECTIONS[state.postmarks.wuhan]}</strong></button><em>${state.postmarks.wuhan === 1 ? '10' : '??'}</em></article>
          <article><small>南京邮戳</small><button type="button" data-turn-postmark="nanjing"><span style="transform:rotate(${state.postmarks.nanjing * 90}deg)">❧</span><strong>${DIRECTIONS[state.postmarks.nanjing]}</strong></button><em>${state.postmarks.nanjing === 3 ? '29' : '??'}</em></article>
        </div>
        <div class="result-window"><small>重合数字</small><strong>${postmarkCode(state.postmarks.wuhan, state.postmarks.nanjing) || '····'}</strong></div>
        <button class="primary-button" type="button" data-check-cities>压下双城邮戳</button>
      </div>`}`;
}

export function renderRings(state, chapter) {
  const age = ringAge(state.rings);
  return `${stageHeader(chapter, '树根、枝条与树冠分别收纳出生、相识和现在。最后的数字来自距离，而不是直接写在年轮上。')}
    <div class="ring-tree">
      <div class="ring-tree__crown"><span>树冠</span><strong>${escapeHTML(state.rings.crown || '????')}</strong></div>
      <div class="ring-tree__branch"><span>枝条</span><strong>${escapeHTML(state.rings.branch || '????')}</strong></div>
      <div class="ring-tree__trunk"><i></i><i></i><i></i><i></i></div>
      <div class="ring-tree__root"><span>树根</span><strong>${escapeHTML(state.rings.root || '????')}</strong></div>
    </div>
    ${state.solved.rings ? solvedBanner(chapter, '2020−2006是14，2026−2020是6，两段距离合成第20圈。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">把2006、2020、2026分别放回树根、枝条、树冠，再把两段距离相加。</p>
        <div class="ring-fields">${[['root','树根'],['branch','枝条'],['crown','树冠']].map(([key,label]) => `<label>${label}<select data-ring="${key}"><option value="">选择年份</option>${['2006','2020','2026'].map((year) => `<option value="${year}" ${state.rings[key] === year ? 'selected' : ''}>${year}</option>`).join('')}</select></label>`).join('')}</div>
        <div class="ring-math"><span>${state.rings.branch && state.rings.root ? Number(state.rings.branch)-Number(state.rings.root) : '?'}</span><b>+</b><span>${state.rings.crown && state.rings.branch ? Number(state.rings.crown)-Number(state.rings.branch) : '?'}</span><b>=</b><strong>${Number.isFinite(age) ? age : '?'}</strong></div>
        <button class="primary-button" type="button" data-check-rings>闭合新年轮</button>
      </div>`}`;
}

export function renderGift(state, chapter) {
  if (state.solved.gift) return renderEnding(state, chapter);
  return `${stageHeader(chapter, '所有答案都已经出现。礼物盒不再要求一次无根据的新猜测，只需要把线索重新装订。')}
    <div class="gift-scene"><div class="gift-box"><i></i><span>FOR YOU</span></div><div class="gift-flowers">✼ ✿ ☼ ❋ ❉ ❊ ♧</div></div>
    <form class="puzzle-card gift-lock" data-gift-form>
      <p class="puzzle-riddle">数字缎带＝出生年份尾两位＋月日＋年龄。</p>
      <label><span>数字缎带</span><input name="ribbon" inputmode="numeric" maxlength="8" placeholder="8位数字" autocomplete="off"/></label>
      <label><span>名字封蜡</span><input name="name" maxlength="3" placeholder="3个字母" autocomplete="off"/></label>
      <label><span>花窗词条</span><input name="word" maxlength="8" placeholder="8个字母" autocomplete="off"/></label>
      <button class="primary-button" type="submit">打开生日礼物</button>
    </form>`;
}

export function renderEnding(state, chapter) {
  if (!state.ending) {
    return `${stageHeader(chapter, '礼物已经打开。最后一页不是对关系的定义，而是把祝福放在三个不同的位置。')}
      ${solvedBanner(chapter, '完整线索为06102920 / LXY / BIRTHDAY。')}
      <div class="ending-choice">
        <button type="button" data-ending="future"><span>芽</span><strong>把种子留在树下</strong><small>未来不被提前写完</small></button>
        <button type="button" data-ending="keepsake"><span>花</span><strong>把花压进今天</strong><small>认真保存这一页</small></button>
        ${state.notebookSolved ? '<button type="button" data-ending="side"><span>灯</span><strong>让两盏灯彼此看见</strong><small>隐藏的并肩结局</small></button>' : ''}
      </div>`;
  }
  return `${stageHeader(chapter, '00:00以后，房间没有突然改变，只是树上多了一圈安静的光。')}
    <article class="final-letter">
      <div class="letter-seal">20</div>
      ${STORY.finalLetter.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('')}
      <p class="letter-signature">${escapeHTML(STORY.signature)}</p>
      <div class="ending-caption">${endingCopy(state.ending)}</div>
    </article>
    <div class="final-actions"><button class="secondary-button" type="button" data-change-ending>查看其他结局</button><button class="primary-button" type="button" data-open-prologue>重读序章</button></div>`;
}
