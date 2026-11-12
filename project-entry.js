export function projectHash(id){return '#edit='+encodeURIComponent(id)}
export function projectFromHash(hash){if(!hash.startsWith('#edit='))return null;try{return decodeURIComponent(hash.slice(6))||null}catch{return null}}
