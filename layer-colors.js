export function layerColor(layer){if(/^#[0-9a-f]{6}$/i.test(layer.color||''))return layer.color;if(layer.kind==='text')return '#e1bb42';if(layer.kind==='video')return '#5ca978';return '#6089cf'}
