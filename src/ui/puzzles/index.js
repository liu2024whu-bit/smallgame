import {renderCalendar} from './calendar.js';
import { renderPaper, renderPaperBack } from './paper.js';
import { renderCloud, renderCalibration } from './light.js';
import { renderBooks, renderScreen } from './collection.js';
import { renderBelt } from './mechanical.js';
import { renderFlowers } from './flowers.js';
import { renderFilm } from './film.js';
import { renderAlbum, renderStitch } from './assembly.js';
import { renderBalance, renderDrawers, renderFlips } from './toys.js';
import { renderMaze } from './maze.js';
import { renderPacking } from './packing.js';
import { renderMelody } from './melody.js';
import { renderPostbox, renderWordlock } from './locks.js';
import { renderNegative } from './negative.js';
import { renderChocolate, renderCocoa } from './birthday.js';
import { renderSweets } from './sweets.js';
import { renderRibbons } from './ribbons.js';
import { renderBirthdayLock } from './birthday-lock.js';

export const PUZZLE_VIEWS = Object.freeze({
  calendar:renderCalendar, paper: renderPaper, cloud: renderCloud, calibration: renderCalibration,
  books: renderBooks, screen: renderScreen, belt: renderBelt,
  film: renderFilm, flowers: renderFlowers, paperBack: renderPaperBack,
  cloudGap: renderNegative,
  album: renderAlbum, stitch: renderStitch, maze: renderMaze,
  balance: renderBalance, drawers: renderDrawers, flips: renderFlips,
  packing: renderPacking, melody: renderMelody,
  postbox: renderPostbox, wordlock: renderWordlock,
  chocolate:renderChocolate,cocoa:renderCocoa,
  sweets:renderSweets,ribbons:renderRibbons,birthdayLock:renderBirthdayLock,
});
