const keys=['duration','layers','camera','audio','groups'];
export function captureSceneState(project){let state={};for(const key of keys)if(project[key]!==undefined)state[key]=structuredClone(project[key]);return state}
export function ensureScenes(project,makeId){if(!Array.isArray(project.scenes)||!project.scenes.length){const id=makeId();project.scenes=[{id,name:'Cảnh 1',state:captureSceneState(project)}];project.activeSceneId=id}if(!project.scenes.some(x=>x.id===project.activeSceneId))project.activeSceneId=project.scenes[0].id;return project}
export function syncActiveScene(project){let item=project.scenes?.find(x=>x.id===project.activeSceneId);if(item)item.state=captureSceneState(project);return project}
export function applyScene(project,id){let item=project.scenes?.find(x=>x.id===id);if(!item)throw Error('Không tìm thấy cảnh');for(const key of keys){if(Object.hasOwn(item.state,key))project[key]=structuredClone(item.state[key]);else delete project[key]}project.activeSceneId=id;return item}
export function addScene(project,id,state,name){project.scenes.push({id,name,state:structuredClone(state)});return id}
export function moveScene(project,id,delta){let i=project.scenes.findIndex(s=>s.id===id),j=i+delta;if(i<0||j<0||j>=project.scenes.length)return false;[project.scenes[i],project.scenes[j]]=[project.scenes[j],project.scenes[i]];return true}
