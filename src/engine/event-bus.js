// Lightweight event bus.
// UI, puzzles and state communicate without creating circular dependencies.

const listeners = new Map();

export function on(event, callback) {
  const group = listeners.get(event) ?? [];
  group.push(callback);
  listeners.set(event, group);
}

export function emit(event, payload) {
  for (const callback of listeners.get(event) ?? []) {
    callback(payload);
  }
}

export function clear(event) {
  listeners.delete(event);
}
