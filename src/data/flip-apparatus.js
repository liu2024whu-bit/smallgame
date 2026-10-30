export const FLIP_CASE_SIZE=1254;
export const FLIP_CAMERA=[70,90,1120,1100];
const FACE_COLUMNS=[18,323,625,930,1232],FACE_WIDTHS=[287,285,288,286,288];
export const FLIP_FACES={width:1536,height:1024,frames:[188,550].flatMap(y=>FACE_COLUMNS.map((x,i)=>[x,y,FACE_WIDTHS[i],283]))};
export const FLIP_QUADS=[
 [[215,193],[469,193],[466,411],[201,411]],[[503,193],[753,193],[758,411],[498,411]],[[789,193],[1044,193],[1054,411],[795,411]],
 [[194,440],[463,440],[460,674],[184,674]],[[499,440],[758,440],[765,674],[494,674]],[[795,440],[1054,440],[1068,674],[801,674]],
 [[174,705],[458,705],[452,951],[164,951]],[[496,705],[763,705],[773,951],[489,951]],[[802,705],[1075,705],[1094,951],[808,951]],
];
export const FLIP_TOP_SOURCE=[[175,157],[1085,157],[1135,998],[110,998]];
export const FLIP_TOP_ROOM=[[1125,653],[1228,653],[1240,698],[1119,698]];
export const FLIP_BLESSINGS=[
 ['铃兰','愿你平安。'],['风铃草','轻轻松松的一天。'],['雏菊','多一点好心情。'],
 ['桔梗','喜欢的事，慢慢来。'],['鸢尾','总有新的风景。'],['三色堇','偶尔偷懒，也不错。'],
 ['山茶','新的一岁，依然自在。'],['桂花','小小的好事，也值得开心。'],['金盏花','今天，当然要亮一点。'],
];
export function flipCamera(flower){if(!Number.isInteger(flower)||flower<0||flower>8)return FLIP_CAMERA;const q=FLIP_QUADS[flower],xs=q.map(p=>p[0]),ys=q.map(p=>p[1]);return [Math.min(...xs)-75,Math.min(...ys)-65,Math.max(...xs)-Math.min(...xs)+150,Math.max(...ys)-Math.min(...ys)+130];}
