import {updateProjectIndex} from './project-library.js';
export function readProjectValue(db,key){return new Promise((resolve,reject)=>{if(!db)return resolve(null);const req=db.transaction('projects').objectStore('projects').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export function writeProjectValue(db,key,value){return new Promise((resolve,reject)=>{if(!db)return reject(Error('IndexedDB không khả dụng'));let tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(structuredClone(value),key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Không lưu được'))})}
export function persistProject(db,project,index){
  return new Promise((resolve,reject)=>{
    if(!db)return reject(Error('IndexedDB không khả dụng'));
    const next=updateProjectIndex(index,project);
    const tx=db.transaction('projects','readwrite');
    const store=tx.objectStore('projects');
    // IndexedDB takes a structured snapshot synchronously for each put.
    store.put(project,'current');
    store.put(project,'project:'+project.projectId);
    store.put(next,'project-index');
    tx.oncomplete=()=>resolve(next);
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||Error('Không lưu được dự án'));
  });
}
export function deleteProject(db,id,index,current){return new Promise((resolve,reject)=>{if(!db)return reject(Error('IndexedDB không khả dụng'));if(!current?.projectId||current.projectId===id)return reject(Error('Cần chọn dự án khác trước khi xóa'));let next=index.filter(p=>p.id!==id),snapshot=structuredClone(current),tx=db.transaction('projects','readwrite'),store=tx.objectStore('projects');store.delete('project:'+id);store.put(snapshot,'current');store.put(snapshot,'project:'+snapshot.projectId);store.put(next,'project-index');tx.oncomplete=()=>resolve(next);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Không xóa được dự án'))})}

export function hasProjectValue(db,key){
  return new Promise((resolve,reject)=>{
    if(!db){resolve(false);return}
    const request=db.transaction('projects').objectStore('projects').getKey(key);
    request.onsuccess=()=>resolve(request.result!==undefined);
    request.onerror=()=>reject(request.error);
  });
}
