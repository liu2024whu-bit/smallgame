export function createEndingView(type = 'future') {
  const endings = {
    future: '未来仍然留白。',
    memory: '这些年被认真记住。',
    parallel: '不同方向，也能看见同一片光。',
  };

  return {
    type,
    text: endings[type] ?? endings.future,
  };
}
