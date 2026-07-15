import { createChapterLoader } from './engine/chapter-loader.js';
import { createStore } from './state/store.js';
import { createEventBus } from './engine/event-bus.js';

export function createGameApp() {
  const bus = createEventBus();
  const store = createStore();
  const chapters = createChapterLoader();

  return {
    bus,
    store,
    chapters,
    start() {
      bus.emit('game:start', { chapter: store.getState().chapter });
    },
  };
}
