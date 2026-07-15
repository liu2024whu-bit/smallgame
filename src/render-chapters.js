import { ART, imageMarkup } from './assets.js';
import { STORY } from './content.js';
import { breathWord, postmarkCode, ringAge, starCode, windLetters, WIND_RINGS } from './puzzles.js';
import { DIRECTIONS, escapeHTML } from './runtime.js';
import { BREATH_LABELS, endingCopy, orderControls, solvedBanner, stageHeader, STAR_LABELS } from './view-helpers.js';

const WIND_OBJECTS = Object.freeze(['魈的长枪', '魈的面具', '流浪者的斗笠', '流浪者的羽饰']);

function picture(asset, className, caption = '') {
  return `<figure class="${className}">${imageMarkup(asset, `${className}__image`)}${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}</figure>`;
}

export function renderBirth(state, chapter) {
  const solved = state.solved.birth;
  return `${stageHeader(chapter, '房间里只开着一盏桌灯。两只小动物分别守着高处和地面，项圈背面各压住半句年份。')}
    <div class="room-photo-scene">
      <div class="room-photo-scene__shade" aria-hidden="true"></div>
      <button class="pet-photo pet-photo--cat ${state.discoveries.cat ? 'is-found' : ''}" type="button" data-pet="cat" aria-label="调查窗边的猫">
        ${imageMarkup(ART.pets.cat, 'pet-photo__image')}
        <span class="pet-photo__tag">Ⅱ ○</span>
      </button>
      <div class="room-letter"><small>NO ADDRESS</small><strong>写给第20圈</strong><span>信封边缘压着一根红线</span></div>
      <button class="pet-photo pet-photo--dog ${state.discoveries.dog ? 'is-found' : ''}" type="button" data-pet="dog" aria-label="调查桌边的小狗">
        ${imageMarkup(ART.pets.dog, 'pet-photo__image')}
        <span class="pet-photo__tag">○ Ⅵ</span>
      </button>
    </div>
    <div class="chapter-actions">
      ${solved ? solvedBanner(chapter, '高处的吊牌排在前面，地面的吊牌排在后面，四格旧锁终于转到2006。') : `
        <div class="found-strip"><span>${state.discoveries.cat ? '高处：Ⅱ ○' : '高处仍被遮住'}</span><span>${state.discoveries.dog ? '地面：○ Ⅵ' : '地面仍被遮住'}</span></div>
        <button class="primary-button" type="button" data-open-birth-lock ${state.discoveries.cat && state.discoveries.dog ? '' : 'disabled'}>检查信封上的旧锁</button>`}
    </div>`;
}

export function renderStars(state, chapter) {
  const code = starCode(state.starOrder);
  return `${stageHeader(chapter, '初三那一页被做成一张夜航照片：巫师帽、短发光环、樱花与玫瑰各占据一段星轨。')}
    <div class="memory-collage memory-collage--stars">
      ${picture(ART.sky.wizard, 'memory-cutout memory-cutout--hat', '巫师帽')}
      ${picture(ART.sky.child, 'memory-cutout memory-cutout--halo', '短发光环')}
      ${picture(ART.flowers.cherry, 'memory-photo memory-photo--blossom', '樱花')}
      ${picture(ART.flowers.rose, 'memory-photo memory-photo--rose', '被保护的玫瑰')}
      <div class="memory-red-thread" aria-hidden="true"></div>
    </div>
    ${state.solved.stars ? solvedBanner(chapter, '四张照片按星轨顺序装订后，背面的点数读作2020。') : `
      <div class="puzzle-card puzzle-card--photo-order">
        <p class="puzzle-riddle">最早出现的是帽檐。光环从它右侧升起；樱花落下以后，玫瑰才被收进玻璃罩。照片背面的孔洞会随着顺序重新对齐。</p>
        ${orderControls(state.starOrder, STAR_LABELS, null, 'starOrder')}
        <div class="result-window"><small>照片背面的孔洞</small><strong>${code === '2020' ? code : code.replaceAll('0', '○').replaceAll('2', '••')}</strong></div>
        <button class="primary-button" type="button" data-check-stars>压下四枚图钉</button>
      </div>`}`;
}

export function renderWind(state, chapter) {
  const letters = windLetters(state.windRotations);
  return `${stageHeader(chapter, '高中那一页有两张被风掀起的角色立绘。魈与流浪者分居纸页两侧，四枚转盘藏在衣摆、长枪、斗笠与羽饰附近。')}
    <div class="character-scene character-scene--wind">
      ${picture(ART.genshin.xiao, 'character-cutout character-cutout--xiao', '魈')}
      ${picture(ART.genshin.wanderer, 'character-cutout character-cutout--wanderer', '流浪者')}
      <div class="wind-paper-trail" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
    ${state.solved.wind ? solvedBanner(chapter, '上一页的年份被拆成四个转动次数，四个观察窗最终停在EAST。') : `
      <div class="puzzle-card puzzle-card--wind">
        <p class="puzzle-riddle">照片角落写着“相识年份不是门牌，而是四次风向校准”。转盘从左到右对应长枪、面具、斗笠与羽饰。</p>
        <div class="wind-wheels">${state.windRotations.map((rotation, index) => `
          <article><small>${WIND_OBJECTS[index]}</small><button type="button" data-turn-wind="${index}"><span>${WIND_RINGS[index][rotation]}</span><em>已转${rotation}格</em></button></article>`).join('')}</div>
        <div class="result-window"><small>四扇风窗</small><strong>${letters}</strong></div>
        <button class="primary-button" type="button" data-check-wind>锁住风向</button>
      </div>`}`;
}

export function renderBreath(state, chapter) {
  return `${stageHeader(chapter, '大一的书页留下三位柱的角色图与一串垂落的紫藤。每张图背后都有一段字片，只有正确的相邻关系才能让句子完整。')}
    <div class="character-scene character-scene--breath">
      ${picture(ART.demonSlayer.giyu, 'character-cutout character-cutout--giyu', '富冈义勇')}
      ${picture(ART.demonSlayer.sanemi, 'character-cutout character-cutout--sanemi', '不死川实弥')}
      ${picture(ART.demonSlayer.obanai, 'character-cutout character-cutout--obanai', '伊黑小芭内')}
      ${picture(ART.flowers.wisteria, 'wisteria-photo', '紫藤')}
    </div>
    ${state.solved.breath ? solvedBanner(chapter, '水柱、风柱、蛇柱与紫藤按线索排好后，四段字片组成BIRTHDAY。') : `
      <div class="puzzle-card puzzle-card--photo-order">
        <p class="puzzle-riddle">水的照片早于风；蛇必须紧贴紫藤左侧；风不愿站在队尾。高中页留下的方向仍然有效。</p>
        ${orderControls(state.breathOrder, BREATH_LABELS, null, 'breathOrder')}
        <div class="result-window"><small>照片背后的字片</small><strong>${breathWord(state.breathOrder) || '········'}</strong></div>
        <button class="primary-button" type="button" data-check-breath>装订这一页</button>
      </div>`}`;
}

export function renderFilm(state, chapter) {
  return `${stageHeader(chapter, '大二的暗房里晾着三张真实画稿。红灯亮起以后，104被拆成三种观察动作，答案只会从作品本身显影。')}
    <div class="film-room film-room--photographic">
      <div class="safe-light"></div>
      <div class="film-strip">${[1,2,3,4,5].map(() => '<i></i>').join('')}</div>
      <div class="artwork-stack artwork-stack--overlap">
        <figure class="artwork-photo artwork-photo--duo">${imageMarkup(ART.owned.duo, 'artwork-photo__image')}<figcaption>双人画稿</figcaption><button class="art-hotspot art-hotspot--red" type="button" data-film-step="red" aria-label="检查双人画稿中央红色焦点"></button></figure>
        <figure class="artwork-photo artwork-photo--keychain ${state.filmSteps.invert ? 'is-inverted' : ''}"><button class="artwork-action" type="button" data-film-step="invert" aria-label="把钥匙扣设计稿切换为负片">${imageMarkup(ART.owned.keychain, 'artwork-photo__image')}</button><figcaption>钥匙扣正反面</figcaption></figure>
        <figure class="artwork-photo artwork-photo--cats">${imageMarkup(ART.owned.cats, 'artwork-photo__image')}<figcaption>猫咪动作稿</figcaption><div class="cat-hotspots">${[1,2,3,4,5].map((n) => `<button type="button" data-cat-choice="${n}" aria-label="检查第${n}组猫咪动作">${n}</button>`).join('')}</div></figure>
      </div>
    </div>
    ${state.solved.film ? `${solvedBanner(chapter, '第一处红色、一次负片翻转与第四只猫共同显影出LXY。')}<button class="secondary-button" type="button" data-open-notebook>${state.notebookSolved ? '查看并肩灯' : '打开双页手账'}</button>` : `
      <div class="puzzle-card film-puzzle">
        <p class="puzzle-riddle">暗房记录只有“1 / 0 / 4”。在三张画稿上完成对应观察，再回来检查显影结果。</p>
        <div class="film-progress">
          <span class="${state.filmSteps.red ? 'is-done' : ''}">第一处红色 ${state.filmSteps.red ? '已找到' : '未找到'}</span>
          <span class="${state.filmSteps.invert ? 'is-done' : ''}">负片交叉 ${state.filmSteps.invert ? '已显影' : '未显影'}</span>
          <span class="${state.filmSteps.cat ? 'is-done' : ''}">第四组猫咪 ${state.filmSteps.cat ? '已确认' : '未确认'}</span>
        </div>
        <div class="result-window"><small>底片显影</small><strong>${state.filmSteps.red ? 'L' : '·'}${state.filmSteps.invert ? 'X' : '·'}${state.filmSteps.cat ? 'Y' : '·'}</strong></div>
        <button class="primary-button" type="button" data-check-film>冲洗104号底片</button>
      </div>`}`;
}

export function renderCities(state, chapter) {
  return `${stageHeader(chapter, '大三的两张校园照片被同一根红线缝在一起。左页是珞珈山的樱花，右页是南京的长路，邮戳的植物方向决定花窗里的日期。')}
    <div class="campus-scene">
      ${picture(ART.campuses.wuhan, 'campus-photo campus-photo--wuhan', '武汉大学 · 樱花与江风')}
      <div class="campus-red-thread" aria-hidden="true"></div>
      ${picture(ART.campuses.nanjing, 'campus-photo campus-photo--nanjing', '南京大学 · 梧桐与旧楼')}
    </div>
    ${state.solved.cities ? solvedBanner(chapter, '武汉邮戳转向东，南京邮戳转向西，两扇花窗合成1029。') : `
      <div class="puzzle-card puzzle-card--postmarks">
        <p class="puzzle-riddle">高中页已经留下读取方向。让左侧照片中的樱花顺着它转动，让右侧照片中的梧桐与之相望。</p>
        <div class="postmarks postmarks--photos">
          <article><small>武汉邮戳</small><button type="button" data-turn-postmark="wuhan">${imageMarkup(ART.flowers.cherry, 'postmark-photo', `style="transform:rotate(${state.postmarks.wuhan * 90}deg)"`)}<strong>${DIRECTIONS[state.postmarks.wuhan]}</strong></button><em>${state.postmarks.wuhan === 1 ? '10' : '??'}</em></article>
          <article><small>南京邮戳</small><button type="button" data-turn-postmark="nanjing">${imageMarkup(ART.campuses.planeLeaf, 'postmark-photo', `style="transform:rotate(${state.postmarks.nanjing * 90}deg)"`)}<strong>${DIRECTIONS[state.postmarks.nanjing]}</strong></button><em>${state.postmarks.nanjing === 3 ? '29' : '??'}</em></article>
        </div>
        <div class="result-window"><small>重合日期</small><strong>${postmarkCode(state.postmarks.wuhan, state.postmarks.nanjing) || '····'}</strong></div>
        <button class="primary-button" type="button" data-check-cities>压下双城邮戳</button>
      </div>`}`;
}

export function renderRings(state, chapter) {
  const age = ringAge(state.rings);
  return `${stageHeader(chapter, '一张树木横截面照片压在最后三页之间。出生、相识和现在分别属于树根、枝条与树冠，真正的年龄藏在它们之间的距离里。')}
    <div class="ring-photo-scene">
      <div class="ring-photo-scene__image" role="img" aria-label="真实树木年轮横截面照片"></div>
      <div class="ring-pin ring-pin--crown"><span>树冠</span><strong>${escapeHTML(state.rings.crown || '????')}</strong></div>
      <div class="ring-pin ring-pin--branch"><span>枝条</span><strong>${escapeHTML(state.rings.branch || '????')}</strong></div>
      <div class="ring-pin ring-pin--root"><span>树根</span><strong>${escapeHTML(state.rings.root || '????')}</strong></div>
    </div>
    ${state.solved.rings ? solvedBanner(chapter, '2020−2006是14，2026−2020是6，两段距离合成第20圈。') : `
      <div class="puzzle-card">
        <p class="puzzle-riddle">三张年份卡只能各用一次。把它们放回对应位置，再计算相邻两段时间。</p>
        <div class="ring-fields">${[['root','树根'],['branch','枝条'],['crown','树冠']].map(([key,label]) => `<label>${label}<select data-ring="${key}"><option value="">选择年份</option>${['2006','2020','2026'].map((year) => `<option value="${year}" ${state.rings[key] === year ? 'selected' : ''}>${year}</option>`).join('')}</select></label>`).join('')}</div>
        <div class="ring-math"><span>${state.rings.branch && state.rings.root ? Number(state.rings.branch)-Number(state.rings.root) : '?'}</span><b>+</b><span>${state.rings.crown && state.rings.branch ? Number(state.rings.crown)-Number(state.rings.branch) : '?'}</span><b>=</b><strong>${Number.isFinite(age) ? age : '?'}</strong></div>
        <button class="primary-button" type="button" data-check-rings>闭合新年轮</button>
      </div>`}`;
}

export function renderGift(state, chapter) {
  if (state.solved.gift) return renderEnding(state, chapter);
  return `${stageHeader(chapter, '零点以前，桌上只剩一只礼物盒和已经收集的花。最终锁不会提供新答案，它只检查玩家是否真正理解前面每一页的关系。')}
    <div class="gift-photo-scene">
      <div class="gift-photo-scene__gift" aria-label="生日礼物盒照片"></div>
      <div class="gift-bouquet">
        ${imageMarkup(ART.flowers.daisy, 'gift-flower gift-flower--one')}
        ${imageMarkup(ART.flowers.rose, 'gift-flower gift-flower--two')}
        ${imageMarkup(ART.flowers.sunflower, 'gift-flower gift-flower--three')}
        ${imageMarkup(ART.flowers.wisteria, 'gift-flower gift-flower--four')}
      </div>
    </div>
    <form class="puzzle-card gift-lock" data-gift-form>
      <p class="puzzle-riddle">数字缎带由出生年份尾两位、月日与年龄依次缝合；另外两格分别接收名字封蜡和花窗词条。</p>
      <label><span>数字缎带</span><input name="ribbon" inputmode="numeric" maxlength="8" placeholder="8位数字" autocomplete="off"/></label>
      <label><span>名字封蜡</span><input name="name" maxlength="3" placeholder="3个字母" autocomplete="off"/></label>
      <label><span>花窗词条</span><input name="word" maxlength="8" placeholder="8个字母" autocomplete="off"/></label>
      <button class="primary-button" type="submit">打开生日礼物</button>
    </form>`;
}

export function renderEnding(state, chapter) {
  if (!state.ending) {
    return `${stageHeader(chapter, '礼物已经打开。最后一页只决定这份祝福以怎样的方式被保存。')}
      ${solvedBanner(chapter, '完整线索为06102920 / LXY / BIRTHDAY。')}
      <div class="ending-choice ending-choice--photos">
        <button type="button" data-ending="future">${imageMarkup(ART.flowers.daisy, 'ending-choice__image')}<strong>把种子留在树下</strong><small>未来不被提前写完</small></button>
        <button type="button" data-ending="keepsake">${imageMarkup(ART.flowers.rose, 'ending-choice__image')}<strong>把花压进今天</strong><small>认真保存这一页</small></button>
        ${state.notebookSolved ? `<button type="button" data-ending="side">${imageMarkup(ART.owned.duo, 'ending-choice__image')}<strong>让两盏灯彼此看见</strong><small>隐藏的并肩结局</small></button>` : ''}
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
