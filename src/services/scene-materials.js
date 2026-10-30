import {hydrateGapPaper} from './gap-paper.js';
import {hydrateWordPapers} from './word-papers.js';
import {hydrateCocoaRoom} from './cocoa-room-paint.js';
import {hydrateSweetsMaterial} from './sweets-material.js';
import {hydrateRibbonMaterial} from './ribbon-material.js';
import {hydrateMazeMaterial} from './maze-material.js';
import {hydrateBalanceMaterial} from './balance-material.js';
import {hydrateDrawerRoom} from './drawer-room-paint.js';
import {hydrateFlipRoom} from './flip-room-paint.js';
import {hydratePackingRoom} from './packing-room-paint.js';
import {hydrateCloudMaterial} from '../ui/cloud-material.js';

// Rooms and source close-ups share the same material registration.
export function hydrateSceneMaterials(root){
 for(const hydrate of [hydrateGapPaper,hydrateWordPapers,hydrateCocoaRoom,hydrateSweetsMaterial,hydrateRibbonMaterial,hydrateMazeMaterial,hydrateBalanceMaterial,hydrateDrawerRoom,hydrateFlipRoom,hydratePackingRoom,hydrateCloudMaterial])hydrate(root);
}
