# Smallgame Puzzle Kernel

Dependency-free JavaScript rules for five small puzzle mechanisms: coupled rotors, interlocking drawers, neighboring flips, picture-preserving polyomino packing, and a six-note mechanism. The rules are independent of the renderer and input device.

Each rule exposes `create()`, `valid(state)`, `move(state, action)` and `solved(state)`. Moves return a new state or leave the previous state unchanged when an action is invalid. Rendering, pointer gestures, undo history and progression belong to the application consuming these rules.

```js
import { drawers } from './src/index.js';

let state = drawers.create();
state = drawers.move(state, { type: 'drawer', index: 0 });
console.log(drawers.valid(state), drawers.solved(state));
```

The optional Node utility `tools/atomic-file.mjs` writes a temporary file, flushes it, and renames it into place. Callers own validation, backups and coordination between concurrent writers; the utility alone does not provide those policies.

Run `node --test tests/*.test.mjs` with Node 22 or later. No installation or network access is required. Tests explore finite state spaces, verify packing and printed orientation, and exercise actual file replacement.

This branch contains only reusable mechanism code. It has an independent root history and includes no game artwork, narrative, personal datasets, saved progress, browser profiles or recordings. It is a code library, not the complete game application.
