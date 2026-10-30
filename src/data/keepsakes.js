const gift = (id, name, asset, index, columns, rows, source) => ({ id, name, asset, index, columns, rows, ...source });

export const KEEPSAKES = Object.freeze([
  gift('wood-bookmark', '武大木书签', 'bookmarkFull', 0, 1, 1, { pickup: 'bookmark' }),
  gift('city-bookmark', '武汉城市书签', 'gifts', 1, 3, 2, { puzzle: 'paper' }),
  gift('prince-notebook', '小王子笔记本', 'gifts', 2, 3, 2, { puzzle: 'books' }),
  gift('windbell', '风铃', 'gifts', 3, 3, 2, { puzzle: 'melody' }),
  gift('cube', '四阶魔方', 'gifts', 4, 3, 2, { puzzle: 'flips' }),
  gift('keyboard', '迈从键盘', 'giftsMore', 0, 3, 3, { puzzle: 'belt' }),
  gift('umbrella', '小雨伞', 'giftsMore', 1, 3, 3, { puzzle: 'maze' }),
  gift('muichiro-block', '霞柱亚克力砖', 'giftsMore', 2, 3, 3, { puzzle: 'calibration' }),
  gift('mitsuri-block', '恋柱亚克力砖', 'giftsMore', 3, 3, 3, { puzzle: 'screen' }),
  gift('snacks', '零食', 'drawerSnacks', 0, 1, 1, { puzzle: 'drawers' }),
  gift('small-care', '护手霜与小瓶', 'giftsMore', 5, 3, 3, { puzzle: 'flowers' }),
  gift('writing-book', '写作本', 'giftsMore', 6, 3, 3, { puzzle: 'paperBack' }),
  gift('cat-charm', '小黑猫挂件', 'giftsMore', 7, 3, 3, { puzzle: 'packing' }),
  gift('puppy-parcel', '包好的礼物', 'puppyParcel', 0, 1, 1, { puzzle: 'cloud' }),
]);
export const KEEPSAKE_BY_ID = Object.freeze(Object.fromEntries(KEEPSAKES.map(item => [item.id, item])));
