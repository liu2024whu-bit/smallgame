import {renderCalendar} from './calendar.js';
import {renderPaperBack,backInspection} from './paper.js';
import {renderPaper,pressInspection} from './press.js';
import { renderCalibration } from './light.js';
import {renderCloud} from './cloud.js';
import {renderScreen} from './screen.js';
import {renderBooks,libraryInspection} from './library.js';
import { renderBelt } from './belt.js';
import { renderFlowers } from './flowers.js';
import { renderFilm,filmInspection } from './film.js';
import { renderAlbum, renderStitch } from './assembly.js';
import {renderBalance} from './balance.js';
import {renderDrawers} from './drawers.js';
import {renderFlips} from './flips.js';
import { renderMaze } from './maze.js';
import { renderPacking } from './packing.js';
import { renderMelody } from './melody.js';
import { renderWordlock } from './wordlock.js';
import {renderPostbox} from './postal.js';
import { renderNegative } from './negative.js';
import {renderCocoa} from './cocoa.js';
import {renderChocolate} from './chocolate.js';
import { renderSweets } from './sweets.js';
import { renderRibbons } from './ribbons.js';
import { renderBirthdayLock } from './birthday-lock.js';
import {renderPiano} from './piano.js';

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
  sweets:renderSweets,ribbons:renderRibbons,birthdayLock:renderBirthdayLock,piano:renderPiano,
});

// Object inspection is owned by its material, separate from machine controls.
export const PUZZLE_INSPECTIONS=Object.freeze({paper:pressInspection,books:libraryInspection,film:filmInspection,paperBack:backInspection});
