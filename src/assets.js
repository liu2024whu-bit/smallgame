export const ART = Object.freeze({
  flowers: Object.freeze({
    daisy: Object.freeze({
      src: 'https://images.unsplash.com/photo-1659472499304-83f4279e0436?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '带露水的白色雏菊真实近景',
      credit: 'Unsplash / Jana Ohajdova'
    }),
    cherry: Object.freeze({
      src: 'https://images.unsplash.com/photo-1588822172033-964244c83ab5?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '浅粉色樱花真实照片',
      credit: 'Unsplash / White.Rainforest'
    }),
    rose: Object.freeze({
      src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '自然光下的真实玫瑰花',
      credit: 'Unsplash'
    }),
    sunflower: Object.freeze({
      src: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '真实向日葵花盘与花瓣',
      credit: 'Unsplash'
    }),
    wisteria: Object.freeze({
      src: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '紫藤花串真实照片',
      credit: 'Unsplash'
    }),
    forgetMeNot: Object.freeze({
      src: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&fm=jpg&q=82&w=1200',
      alt: '蓝色小花真实近景',
      credit: 'Unsplash'
    })
  }),
  pets: Object.freeze({
    cat: Object.freeze({
      src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&fm=jpg&q=84&w=1200',
      alt: '窗边灰白猫的真实照片',
      credit: 'Unsplash'
    }),
    dog: Object.freeze({
      src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&fm=jpg&q=84&w=1200',
      alt: '暖色光线下小狗的真实照片',
      credit: 'Unsplash'
    })
  }),
  campuses: Object.freeze({
    wuhan: Object.freeze({
      src: 'https://k.sinaimg.cn/n/spider2020221/109/w685h1024/20200221/657d-ipvnsze3647741.jpg/w700d1q75cms.jpg',
      alt: '武汉大学樱花季校园照片',
      credit: 'Sina image source'
    }),
    nanjing: Object.freeze({
      src: 'https://www.nju.edu.cn/images/277.jpg',
      alt: '南京大学仙林校区校园照片',
      credit: 'Nanjing University official website'
    })
  }),
  genshin: Object.freeze({
    xiao: Object.freeze({
      src: 'https://upload.wikimedia.org/wikipedia/en/b/b0/Xiao_in_Genshin_Impact.png',
      alt: '魈的官方角色立绘',
      credit: 'Genshin Impact / HoYoverse; image served by Wikipedia'
    }),
    wanderer: Object.freeze({
      src: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Wanderer_in_Genshin_Impact.png',
      alt: '流浪者的官方角色立绘',
      credit: 'Genshin Impact / HoYoverse; image served by Wikipedia'
    })
  }),
  demonSlayer: Object.freeze({
    giyu: Object.freeze({
      src: 'https://www.kindpng.com/picc/m/14-142137_kimetsu-no-yaiba-characters-hd-png-download.png',
      alt: '水柱富冈义勇透明背景角色图',
      credit: 'Demon Slayer character art; external personal-use image host'
    }),
    sanemi: Object.freeze({
      src: 'https://image.pngaaa.com/214/4482214-middle.png',
      alt: '风柱不死川实弥透明背景角色图',
      credit: 'Demon Slayer character art; external non-commercial image host'
    }),
    obanai: Object.freeze({
      src: 'https://image.pngaaa.com/970/5367970-middle.png',
      alt: '蛇柱伊黑小芭内透明背景角色图',
      credit: 'Demon Slayer character art; external non-commercial image host'
    })
  }),
  sky: Object.freeze({
    wizard: Object.freeze({
      src: 'https://static.wikia.nocookie.net/sky-children-of-the-light/images/5/54/Witch_Hat.png',
      alt: '光遇巫师帽造型参考图',
      credit: 'Sky: Children of the Light community wiki'
    }),
    child: Object.freeze({
      src: 'https://static.wikia.nocookie.net/sky-children-of-the-light/images/7/7d/Valley_Elder_Hair.png',
      alt: '光遇短发造型参考图',
      credit: 'Sky: Children of the Light community wiki'
    })
  }),
  owned: Object.freeze({
    duo: Object.freeze({ src: 'assets/art/duo.webp', alt: '收礼人创作的带土与卡卡西双人作品' }),
    keychain: Object.freeze({ src: 'assets/art/keychain.webp', alt: '收礼人创作的钥匙扣正反面设计' }),
    cats: Object.freeze({ src: 'assets/art/cats.webp', alt: '收礼人创作的猫咪动作稿' })
  })
});

export function imageMarkup(asset, className = '', extra = '') {
  if (!asset) return '';
  return `<img class="${className}" src="${asset.src}" alt="${asset.alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" ${extra}>`;
}
