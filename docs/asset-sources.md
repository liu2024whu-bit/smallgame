# 画面与参考

运行时的图片全部随仓库提供，不依赖远程热链。七幅完整书房场景、机关物件、猫狗和角色同人插画由图像生成工具绘制，再以 WebP 导出；图片本身不是用CSS或矢量图形拼出来的场景。源码中的小图标、连线和轨道只承担界面与规则表达。

游戏使用的新绘画面不等同于原作官方素材，也不等同于收礼者的真实画作。代码的MIT许可不覆盖第三方角色与作品的原有权利。此项目未取得这些角色的商业授权，不对素材目录作此授权声明。

## 运行资产

| 路径 | 内容与处理 |
| --- | --- |
| `assets/scenes/desk.webp` | 书桌、画册、台灯、玫瑰和猫；可拾取物件独立绘制，拿走后场景不残留重复物件 |
| `assets/scenes/window.webp` | 双面云景、联动花架、玫瑰与明信片 |
| `assets/scenes/collection.webp` | 软木板中的带土/卡卡西画稿，书架上的魈/流浪者立牌，与柜中机械摆件；角色作为场景内物件整合绘制 |
| `assets/scenes/entry.webp` | 门边、礼物、狗和年轮灯 |
| `assets/scenes/rain.webp` | 雨廊、邮匣、两张明信片与分拣格纸件 |
| `assets/scenes/atelier.webp` | 画桌、五格字匣、机械键盘、字表与孔带 |
| `assets/illustrations/items.webp` | 12件可重复使用的工具与画页；木书签按描述的实物外观重绘，刻尺纸套是游戏虚构 |
| `assets/illustrations/motifs.webp` | 云、星、叶、玫瑰、猫爪、月、三盆花、书、信封与花瓣 |
| `assets/illustrations/board.webp` | 可放大机关的纸面工作台，不参与判断答案 |
| `assets/illustrations/sky-clouds.webp` | 两组造型作为同一木纸景的正面，第三格为真实纸景背面；旧四套孤立角色图集已从运行资产删除 |
| `assets/illustrations/hei2.webp` | 小黑、无限、鹿野、哪吒、小黑猫形与黑咻、师徒同行 |
| `assets/illustrations/naruto.webp` | 带土和卡卡西的少年/后来造型 |
| `assets/illustrations/genshin.webp` | 魈、流浪者 |
| `assets/illustrations/hashira.webp` | 九位柱，顺序与角色标签一致 |
| `assets/illustrations/prince-hei.webp` | 小王子、玫瑰与小黑相关图案；小王子收藏只使用前两格 |
| `assets/illustrations/pets.webp` | 猫与狗各两种姿态 |
| `assets/illustrations/campuses.webp` | 武大老斋舍、南大北大楼，依据公开照片新绘 |
| `assets/illustrations/gifts.webp` | 根据已描述的实物外观新绘，未提交原始照片；使用单独裁切框避免宽物件被精灵格切掉 |

| `assets/illustrations/bookmark-full.webp` | 单独完整绘制木书签，代替旧工具图集中底部不全的版本 |
| `assets/illustrations/gifts-more.webp` | 键盘、雨伞、独立霞/恋柱砖、零食、小瓶护手霜、写作本、猫挂件；采用不透明浅纸底清理彩色透明边缘 |
| `assets/illustrations/puppy-parcel.webp` | 小狗包装礼物单独绘制并完整留边，避免图集右边缘压住盒角 |
| `assets/illustrations/memory-genshin.webp` | 原创同人绘画跨页，作为添色互动，非她本人画作 |
| `assets/illustrations/memory-naruto.webp` | 共同视角中的稿本、明信片与挂件，不重现已有漫画分镜，非她本人画作 |
| `assets/illustrations/cinema.webp` | 横向完整石桥画面，小黑绿袖宽裤、无限深色长发灰青袍、鹿野银色偏分短发裤装按官方角色图核对；替换三张窄竖幅电影图，旧文件已移除 |
| `assets/illustrations/puzzle-garden.webp` | 同原书房笔触与浅色调的花架近景；可动花盆独立叠在支架上 |
| `assets/illustrations/puzzle-props.webp` | 保留抽屉柜与翻片盒；图集中的旧迷宫、天平、音乐盒和装订近景已由独立完整位图替换 |
| `assets/illustrations/packing-picture.webp` | 专门为五块木片制作完整画面，替代孤立角色白底切片 |
| `assets/illustrations/postbox.webp` | 四轮邮匣近景，动态字轮与锁扣对齐原画位置 |
| `assets/illustrations/keyboard.webp` | 五格字匣与键盘近景，文字由界面排印，保留可输入操作 |
| `assets/illustrations/lightbench.webp` | 透片灯台、镜子、刻尺与三个旋钮，投影随真实机关状态改变 |
| `assets/illustrations/projector.webp` | 打开放映机侧板；轮心按实际图像重新定位，动态棉线独立连入 |
| `assets/illustrations/campus-whu.webp` | 武大老斋舍折页，以公开实景照片的石砌入口、红色平开窗和屋檐为依据，日字斋牌文字由HTML排印 |
| `assets/illustrations/campus-nju.webp` | 南大鼓楼校区北大楼折页，核对灰瓦屋脊、中央方塔、红星、藤蔓、台阶与正门 |

最新绘制/修饰的提示词与参考角色对应关系保存在 [art-prompts.json](art-prompts.json)。使用内置图像工具；Pillow仅用于WebP编码转换，没有用程序图形替代场景，也未将私人原照或信件发送给绘图工具。

裁切按实际像素边界配置，检查头发、斗篷、武器、穗子、星球和页角。仅在相邻物件落入空白角时用图集遮罩排除碎角，不能靠缩小窗口截掉本体来隐藏问题。缩略图和放大图按原比例contain，不能固定宽高后把人物拉瘦。九柱图集增加留白，非等分旧图集不再统一套格。

生成后检查了解码尺寸、透明通道、裁切和实际浏览器呈现。发型/服装等识别度还可继续根据目视反馈精修，不能只因名称匹配就宣称与实机完全一致。

## 光遇外观核对

- [TGC 2021年9月补丁说明](https://thatgamecompany.helpshift.com/hc/en/17-sky-children-of-the-light/faq/841-patch-notes---september-28-2021---0-15-0-176984-ios-switch-177511-android/)用于区分经典巫师帽的发型槽位关系，不能把它与正太发型同时叠戴。
- [鸣谢收藏家发型实机展示](https://wiki.biligame.com/sky/旅行先祖：鸣谢收藏家)：正太为紧贴头部的短发轮廓、不规则刘海、两侧较长发尖与小翘发，按多角度展示核对。
- [火先知整套服装展示](https://wiki.biligame.com/sky/旅行先祖：火先知)与[服装说明](https://sky-children-of-the-light.fandom.com/wiki/Prophet_of_Fire)：浅蓝交叠领上衣、中袖、宽腰带、灰蓝宽裤与深色尖头靴。已弃用“普通白衫＋宽裤”的早期稿。
- [经典巫师帽实机图](https://www.9game.cn/skygy/4781959.html)、[樱花发型实机图](https://shouyou.3dmgame.com/gl/254143.html)用于核对帽檐、自带白发、低双尾和花结。
- [蝙蝠斗篷搭配实机图](https://game.xiaomi.com/viewpoint/1359077112_1675851105710_100)与中国绊爱斗篷展示用于黑色外层、橙红内衬、下摆与白粉斗篷的区分。这些属于造型研究记录；当前用双人纸景替换换装界面，不宣称实现了完整衣柜。
- [国服官方App版本记录](https://apps.apple.com/cn/app/id1344733855)确认“回归童真面具”的正式名称；[2026年儿童节图鉴](https://wiki.biligame.com/sky/2026年儿童节)用于面具图标参考。用户确认矮个子使用矮人面具。童真面具属于参考记录，当前纸景不提供换装按钮。

公开的参考原图没有被直接拷入游戏资产。角色的身高与面具分工来自用户确认，不由发型名称推测人物身份。

## 其他依据

- [《罗小黑战记2》官方角色页](https://luoxiaohei-movie.com/2nd/character/)用于核对小黑、无限、鹿野、哪吒的第二部造型。
- [武汉大学老斋舍照片](https://news.whu.edu.cn/info/1002/46686.htm)、[南京大学北大楼介绍与照片](https://www.nju.edu.cn/info/4041/422051.htm)用于校园明信片外观，不用于推断人物升学或同行经历。
- [《她的树》作者页面](https://stonetreebook.itch.io/her-trees-2)、[Rusty Lake 开发日志](https://blog.rustylake.com/the-past-within-devlog-3/)、[《拣爱》官网](https://akabastudio.com/lovechoice/)作为观察、关联推理、点击动作与温柔手绘情绪的研究依据。房间构图、机关参数、依赖链和叙事均为本作设计，不复刻对应场景或谜题。
- 小王子收藏中的法语短句引自 Antoine de Saint-Exupéry《Le Petit Prince》；中文说明为本作表述，不引用现代中文译本的整段文字。

V1中的三张既有WebP在仓库历史中已经截断，无法正常解码；V2不继续引用，也不把重新生成的插画伪称为修复后的原作。原文件仍可在归档分支查看。

## 动效实现依据

核对了 [Motion](https://github.com/motiondivision/motion) 与 [Anime.js](https://github.com/juliangarnier/anime) 的项目说明。当前位移、旋转、描线与减少动态效果可用浏览器原生动画接口完成，因此未引入额外运行库或克隆依赖。只动画实际被操作的对象，省去常驻粒子、全屏发光与持续漂浮。开源库目录没有新增安装。

## V2.2校园核对边界

校园折页是依实景绘制的插画，不充当测绘地图或官方导览。名称和可辨识建筑细节使用两校公开资料：[武汉大学老斋舍实景](https://news.whu.edu.cn/info/1002/46686.htm)、[南京大学北大楼官方介绍](https://www.nju.edu.cn/info/4041/422051.htm)。没有添加未经确认的就读学校、同行游览、校史、路线、官方纪念章或校内编号。游戏中的邮戳、格号与密码只在纸件边缘出现，属于本作机关。

## V2.3 新资产与状态画面

新增生日桌、留白巧克力、玻璃量壶、米色小兔、三扇门、独立巧克力精灵，以及七幅解开后的局部状态画面。另有结尾亮烛与拆袋状态。书桌、窗边、收藏柜、门边、雨廊、画桌与生日桌的变化按物件单独显现，不直接把整张完成图盖过未完成机关。

音乐盒近景使用六道无固定音钉的空槽；动态音钉与槽坐标一一对应。迷宫使用空圆木盘，路线由真实规则绘制；天平使用透明完整底座，装订使用未预先缝线的书页。重绘花架去掉固定平台和重复猫狗，平台、花盆与书签单独动作。柜内的音乐机关与迷宫微缩图使用同源位图和动态部件，避免把远景绘画的近似雕纹当成规则依据。

`hei-cat.webp` 是依既有小黑猫形参考新绘的四帧透明图：睁眼、闭眼、歪头、抬爪。按完整源像素框保留耳朵、脚和尾巴，以固定脚下位置切换；它是可选场景角色，不增加通关门槛。猫狗沿用完整栅格姿态，以脚下为锚点增加轻微呼吸与受摸伸展。

米色小兔外观核对 [Jellycat官方Yummy Bunny](https://jellycat.com/yummy-bunny/?src=google_feed)：短垂耳、圆润身体、米色绒毛与小鼻子。官方产品照片只作外观参考，未放入仓库。薯条意象核对 [脆升升品牌页](https://www.cuishengsheng.cn/Brand-Story)，游戏使用无品牌字样的黄色纸袋，不臆定口味或具体包装。上述生日礼物尚未交付，游戏不写成过去已经收到。

所有新图只通过图像工具绘制/修饰；Pillow仅编码WebP与读取尺寸/透明通道统计。私人信件没有进入生成引用、仓库、设计记录或运行资产。

V2.3 的机关重绘、场景校正与四帧角色提示词另见 [v23-art-prompts.json](v23-art-prompts.json)。

## V2.4 仙林与纸上小物

用户确认目前的校区为南京大学仙林校区，专业名称使用用户提供的“马克思主义原理”；不推断培养层次、课程、教师、宿舍位置或个人校园经历。

- [南京大学官方仙林风光](https://nh.nju.edu.cn/xysh/xyfg/xlxq.htm)中的杜厦图书馆正面照片与香雪海俯拍照片，用于建筑外形、亭顶和园路的核对。[图书馆校方说明](https://lib.nju.edu.cn/gytsg/xlxgjsgk/xgjsdsj.htm)用于核对建筑名称。北大楼仍明确放在鼓楼分栏。
- campus-xianlin.webp 保留双翼弧形立面、竖向格栅与中间玻璃入口；campus-plum.webp 保留实景俯拍的亭顶、道路和右侧园墙。不是导航地图，未绘制虚构校内路线。
- campus-desk.webp 是虚构的窗边书桌，专业书名由HTML落在书封的小标签上，建筑明信片绘进场景；campus-rubbing.webp 是同一建筑的透明石墨拓印素材，通过实际笔画遮罩逐渐显现，不使用实景照片直接覆盖桌面。
- records-folio.webp 是空白纸面底图，邮片、票根和小物按纸面空间排布；图片保留原比例，印在纸面的元素与纸纹混合，不把白底人物大图盖在家具上。
- encore-theatre.webp 的花园、信封和纸层作为完整纸艺绘画。摇柄单独使用原有透明精灵，底图留下轴孔，转轴按同源坐标定位。

六张新资源只使用公开校方照片或已在本项目中的插画作参考。Pillow仅做WebP编码和尺寸读取；私人信件、个人原照没有进入输入、提示词或仓库。简要提示词与图层用途见 [v24-art-prompts.json](v24-art-prompts.json)。


## V2.6 准备台与边缘处理

三张新位图是准备台、透明生日道具图集及同源开匣状态，使用项目已有生日桌与窗边书桌作风格参考。没有新增角色重绘、私人照片或信件引用；提示词简述见[v26-art-prompts.json](v26-art-prompts.json)。

新桌面保留3:2源比例，避免在16:9房间框里压扁碟子。分糖近景从整张桌面裁出完整纸卡与四只碟；盒盖近景保留实物外沿。透明图集按完整对象边界取框，包含樱桃梗、卡片、纸带和烛台底座。打开的匣子使用同场景完整画，保留盒沿、衬纸和软阴影，字轮按开盖后的实测位置显示真实密码。

纸面文字、开孔、糖的位置与交叉纸带由规则数据决定；不是把已有截图叠在画面上。孔带使用同一张格纹材料的纹理，实际切孔与反印字共用坐标。近景与远景的小碟分配、纸带移除及开匣状态同步；贴合点、比例、边界和文字可读性均在桌面与手机截图中核对。

换景过渡由原生动画在图片解码后短暂交叠；构图比例不同时仅淡入新画，避免旧画被拉伸。删除原先重复的scene-image淡入规则，减少动画模式下跳过过渡。没有新增依赖、动画素材包或技能安装。
