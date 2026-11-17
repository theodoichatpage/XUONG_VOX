const loadedFonts=new Map();
export function textFontFamily(layer){
  const text=layer.text;
  if(text?.fontData&&((text.font==='UTM Bebas'&&!text.fontName)||text.font==='custom')){
    const prefix=text.font==='custom'?'VoxFont_':'VoxUTM_';
    return prefix+layer.id.replace(/[^a-zA-Z0-9]/g,'_');
  }
  return text?.font==='custom'?'Arial':text?.font||'Arial';
}
export async function ensureTextFont(layer){const text=layer.text;if(!text?.fontData||(text.font!=='custom'&&(text.font!=='UTM Bebas'||text.fontName)))return;const family=textFontFamily(layer),cached=loadedFonts.get(family);if(cached?.data===text.fontData)return cached.promise;const data=text.fontData;const promise=(async()=>{const bytes=await (await fetch(data)).arrayBuffer();const face=new FontFace(family,bytes);await face.load();if(cached){try{const previous=await cached.promise;document.fonts.delete(previous)}catch{}}document.fonts.add(face);return face})();loadedFonts.set(family,{data,promise});try{return await promise}catch(e){if(loadedFonts.get(family)?.promise===promise)loadedFonts.delete(family);throw e}}
