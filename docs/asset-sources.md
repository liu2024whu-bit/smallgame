# 画面与参考

运行时的图片全部随仓库提供，不依赖远程热链。八幅完整书房场景、机关物件、猫狗和角色同人插画由图像生成工具绘制，再以 WebP 导出；图片本身不是用CSS或矢量图形拼出来的场景。源码中的小图标、连线和轨道只承担界面与规则表达。

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
| `assets/illustrations/pet-corners.webp` | 猫与金毛各两种完整角落；替换旧孤立图集 |
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

核对了 [Motion](https://github.com/motiondivision/motion) 与 [Anime.js](https://github.com/juliangarnier/anime) 的项目说明。V2.8的位移、旋转、描线与减少动态效果使用浏览器原生动画接口，没有引入运行库。V2.9按用户指定目录下载Anime.js作开发工具，采样唱臂轻微落定曲线；发布内容仍只使用原生CSS/RAF，详见下文固定版本及许可。只动画实际被操作的对象，省去常驻粒子、全屏发光与持续漂浮。

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


## V2.7 入口与唱片（历史方案，已由下述V2.8更新）

`assets/scenes/welcome.webp` 为内置 ImageGen 生成的1536×1024入口环境。仅引用项目现有 desk.webp 与 entry.webp 的风格、材料和空间，不引用个人原照或信件。画面没有生成文字或按钮；献词和菜单原生排版在留白处。横屏按画面真实边界柔化，竖屏保留整张画，门、猫和风铃不按固定卡片裁掉。原始提示词及最终文件记录见 [v27-art-prompts.json](v27-art-prompts.json)。Pillow只负责WebP编码。

窗边、慢慢翻页、晚一点的星光是为小屋写的三段原创合成短曲，没有借用六首歌的旋律。六首名称是按用户提供的信息保留的歌单位，仓库不附录音、不抓取付费音源、不上传本地音频。两首剧本杀用曲没有擅自匹配同名歌手版本，按用户指认的剧本标注，实际录音由用户选择。

曲目核对仅用于名称与来源，不代表取得录音分发授权：[孙燕姿《遇见》的平台收录](https://music.apple.com/us/playlist/%E5%AD%99%E7%87%95%E5%A7%BF%E4%BB%A3%E8%A1%A8%E4%BD%9C/pl.542bacdd2b87490183a2257e139cc22d?l=zh-Hans-CN)、[邓垚《诀别书》的官方发行录音信息](https://www.youtube.com/watch?v=4kRT0g137i0)。没有下载这些平台的音频。

## V2.8：花架、住客、日历与图章

本轮接入画面的提示方向摘要见 [v28-art-prompts.json](v28-art-prompts.json)。使用原书房统一纸色、轮廓和日光；文字、密码、开孔与高低由真实数据绘制。第一轮花架仅留在对照页，不进入运行资源。

| 资源 | 处理与核对 |
| --- | --- |
| `scenes/desk.webp` | 原书桌加入小日历；日期与机关位置对齐，保留1672×941 |
| `scenes/window.webp` | 保留木凳上的小王子；去掉右侧固定花架，独立木架、花盆和摇柄按真实状态呈现 |
| `illustrations/puzzle-garden.webp` | 第二轮近景，去掉冲突的贯通轴、固定平台和直接泄题的目标虚线 |
| `illustrations/garden-body.webp` | 透明完整木架，远景按实际透视单独标定立柱、轴心和槽口 |
| `illustrations/garden-crank.webp` | 正视摇柄，保留完整轴心与握把，不按默认图集切格 |
| `illustrations/garden-bookmark.webp` | 侧面书签与完整棕穗；按透明边界取框，入槽和抽出使用同一部件 |
| `illustrations/pet-corners.webp` | 猫、金毛各自睡着／醒着的完整角落，替换旧孤立动物图集 |
| `illustrations/hei-greeting.webp` | 参照既有已核对造型补六帧过渡，脚下锚点与眨眼帧一致 |
| `illustrations/calendar.webp` | 木座台历；29日、三张纸签与六位字轮由界面排印 |
| `illustrations/campus-marks.webp` | 小蓝鲸与小狐狸珞珞、珈珈彩墨图章；完整耳尖、尾巴和花朵，只印在纸面 |

学校形象参照：[南京大学小蓝鲸发布](https://www.nju.edu.cn/info/3191/185201.htm)、[南大文创形象参考](https://hnc.nju.edu.cn/info/1305/35791.htm)、[南大记忆特许纪念品店](https://hqjt.nju.edu.cn/gmgs/1e/3b/c1642a138811/page.htm)、[武汉大学出版社“珞珈印象”官方文创](https://www.wdp.com.cn/creative/)。

小狐狸保留官方商品一粉一橙的配色、耳尖、白围脖与樱花。图章是重新绘制的彩墨诠释，**不是学校发行的真实印章，也不意味着学校参与本游戏**。商品照片仅用于核对，没有复制进发布目录。专业页仍是虚构窗边书桌，不声称是真实课堂或个人笔记。

农历九月初八与2026年10月29日不是同一天，夹页保留农历表达。日期依据：[香港天文台2026年公历与农历对照](https://www.hko.gov.hk/tc/gts/astron2026/files/HKO_almanac_2026.pdf)。

## V2.8：实际备好的声音

- `assets/audio/window.mp3`、`pages.mp3`、`starlight.mp3`：项目原创琴声。`tools/render-audio.py`保留生成方式，没有引用歌单歌曲旋律。
- `assets/audio/birthday.mp3`：公共领域《生日快乐》旋律的本项目八音盒录音。
- `assets/audio/birthday-whistle.mp3`：Joseph SARDIN 原创口哨录音，来源以CC0分享：[BigSoundBank — Happy Birthday, whistling](https://bigsoundbank.com/happy-birthday-whistling-s2193.html)。
- `src/services/foley.js`：木齿、摩擦、书签入槽／抽出、端点轻碰和盖章声，使用滤波噪声与短共振。没有下载音效包。`review/flowers/sounds.mp3`是音色小样，试听放大3倍；游戏中随独立音效音量调整。

在线录音通过官方公开媒体入口播放，未复制到仓库：[孙燕姿《遇见》2010垦丁现场](https://music.163.com/song?id=34200629)、[Lia《鸟之诗》AIR / Ornithopter](https://music.163.com/song?id=761594)、[严艺丹《等你的季节》请服仙丹现场](https://music.163.com/song?id=3392065663)、[金海心《阳光下的星星》创作自选集](https://music.163.com/song?id=1353159923)、[邓垚《诀别书》](https://music.163.com/song?id=2038191895)。

《等你的季节》标为另备的作曲者现场版，不冒充《季风2》现场剪辑。[田馥甄《无人知晓》](https://music.163.com/song?id=1481929839)保留官方入口；没有可用完整公开外链，没有下载或绕过账号／付费限制。平台曲目可使用仅存当前设备的本地覆盖，音频不进存档导出。

`review/flowers/playthrough.mp4`约18秒，为真实鼠标操作录像，配本项目原创《窗边》。录像不含指定商业歌曲，也未宣称录下浏览器原生音效，音色小样单独提供。

## V2.9 P1：唱片机与缺曲

`illustrations/turntable.webp`是三个完整透明部件：木质机身、独立唱片和唱臂。只参考项目既有musicbox.webp与desk.webp的细线、暖木和纸色；不引用私人原照或信件。生成后精确去掉机身原先重复的唱臂座，独立唱臂覆盖一个小定位点。完整提示词见[v29-art-prompts.json](v29-art-prompts.json)。Pillow仅编码和检查边界，文字与20标记由HTML排版。

《无人知晓》新增可公开播放的[Fayeii翻唱版](https://music.163.com/song?id=1878024509)，实际录音时长278.711746秒，2026-10-25在原生播放器中实播核对。界面明确标注翻唱，另留[田馥甄原唱入口](https://music.163.com/song?id=1481929839)。不冒充剧本的现场剪辑；录音没有下载或随游戏分发。其他五个在线版本不变，仍直接使用平台公开媒体入口。

动画开发工具采用[Anime.js v4.5.0](https://github.com/juliangarnier/anime/releases/tag/v4.5.0)，固定提交`2c9cf8ea00329f6768c7d7902252ed977d75ce42`，许可MIT。用户指定的本地目录为`E:\github\github\animejs`；发布代码不依赖该绝对路径。`tools/sample-motion.mjs`从该工具的spring ESM采样41点，写成CSS原生linear()缓动，参数bounce0.08、duration430。不支持linear()时使用普通cubic-bezier，减少动态时跳过。没有把完整动画库塞进游戏。

工具许可原文随[animejs-license.txt](animejs-license.txt)保留。对照录像只配项目原创琴声，不录入六首商业歌曲。

## V2.9 P2：邀请与原生光标

`illustrations/invitation.webp`由ImageGen参照既有welcome.webp绘制四个完整纸层：背板、前袋、翻盖、信纸。文字由HTML加入，背面祝福不引用任何私人信件。展开/翻转使用同一部件连续插值；未把多张随机姿态的整幅图交替当作动画。生成提示词追加在[v29-art-prompts.json](v29-art-prompts.json)，Pillow只编码与检查透明边界。

`assets/cursors/`的六个32×32 SVG是项目原生UI图标，沿用奶油、草绿和细轮廓，代码制作，无第三方素材或运行库。热点分别校准到箭尖、指尖、镜心和手心；触屏/高对比/关闭偏好使用原生回退，不叠加跟随鼠标的可见DOM。原有抓取和方向调整逻辑保留。

导航图由renderScenePicture共用实际进度渲染，再整体缩小，包含局部完成变化；未打开的场景不加载内容缩略图。门口环境不重新生成，维持原书房的色彩与比例。
