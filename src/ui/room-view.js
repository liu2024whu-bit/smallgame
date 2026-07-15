export function createRoomView(state) {
  return {
    type: 'room',
    title: '没有地址的信',
    chapter: state.chapter ?? 'prologue',
    objects: ['cat', 'dog', 'memory-book', 'tree-ring', 'desk'],
  };
}

export function inspectObject(objectId) {
  return { objectId, inspected: true };
}
