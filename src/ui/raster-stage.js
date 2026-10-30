// A source-pixel layout for raster parts. The SVG only scales its HTML plane;
// it draws no prop outlines or decorative shapes and owns no game state.
export function rasterStage(content,width,height){
 return `<svg class="raster-stage" viewBox="0 0 ${width} ${height}" style="display:block;width:100%;overflow:visible" aria-hidden="true"><foreignObject x="0" y="0" width="${width}" height="${height}" overflow="visible"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:${width}px;height:${height}px;overflow:visible">${content}</div></foreignObject></svg>`;
}
