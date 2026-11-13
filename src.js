import {historyLineLayout} from './history-line.js';
import {shapeCanvas,shapeNames,popScale} from './shapes.js';
import {createImageStrip} from './image-strip.js';
import {splitSelectedLayers,placeOnLane,duplicateTimelineClips,clipPlacement,fitClipOffset,laneNeighbors,exactClipEdge,separateOverlappingLanes,fitClipOnLane,detachClipFromLane} from './timeline-lanes.js';
import {layerColor} from './layer-colors.js';
import {createJoinTransition,clipJoin,transitionAt,transitionOptions} from './transitions.js';
import {placeFolders} from './batch-timeline.js';
import {partitionFolderFiles,matchFolderImages,applyFolderReplacements} from './asset-folders.js';
import {readProjectValue,hasProjectValue,writeProjectValue,persistProject,deleteProject} from './project-db.js';
import {createProjectArchive,openProjectArchive} from './project-archive.js';
import {ensureScenes,syncActiveScene,applyScene,addScene,moveScene,captureSceneState} from './scenes.js';
import {updateProjectIndex,assignProjectId} from './project-library.js';
import {textFontFamily,ensureTextFont} from './text-fonts.js';
import {drawAnnotation,selectedTextRange} from './text-annotations.js';
import {TEXT_DEFAULTS,textAnimation} from './text-effects.js';
import {savePreset as updatePresetList,textPresetState} from './presets.js';
import {repairAvcMetadata} from './avc.js';
import {groupLayers,ungroupLayers,addSplitToGroup,removeMissingGroupMembers,reorderLayer} from './groups.js';
import {classifyFiles,projectFileName} from './files.js';
import {attachAudio,inspectAudio,audioExportConfig,encodeAudioTrack,encodeAudioTimeline} from './audio.js';
import {ProjectHistory} from './history.js';
import './style.css';import * as THREE from 'three';import {OrbitControls} from 'three/addons/controls/OrbitControls.js';import {TransformControls} from 'three/addons/controls/TransformControls.js';import {clamp,evaluate,initialCamera,newProject,firstVisibleHit,clipBounds,layerVisibleAt,setScaleComponent,splitLayerAt,trimLayerEndAt,normalizeEntity,evaluateEntity,putPropertyKey,holdPreviousKeys,editEntity,toggleProperty,duplicatePropertyKeys,isEasedKey,moveClipIntervals,resizeClipEnds,moveLayerPositions} from './model.js';
const $=s=>document.querySelector(s);document.querySelector('#app').innerHTML=`<header><strong>◈ XƯỞNG VOX</strong><span class="project-name-label">Dự án</span><div class="project-picker"><button id="projectList" type="button" aria-label="Danh sách dự án" aria-haspopup="true" aria-expanded="false">Đang tải dự án…</button><div id="projectMenu" class="project-menu" hidden></div></div><button id="renameProject" type="button" title="Đổi tên dự án" aria-label="Đổi tên dự án">✎</button><details class="import-menu"><summary>＋ Nhập file ▾</summary><div><button id="add" type="button">Chọn file</button><button id="importFolder" type="button">Chọn thư mục</button></div></details><input id="mediaFiles" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg,audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.opus" multiple><span class="spacer"></span><span id="message" hidden></span><button id="settings" type="button" aria-label="Hướng dẫn và cài đặt" title="Hướng dẫn">⚙</button><details class="export-menu"><summary>Xuất file ▾</summary><div><button id="export" type="button">Xuất MP4</button><button id="savezip" type="button">Xuất dự án ZIP</button><button id="openzip" type="button">Mở dự án ZIP</button></div></details><input id="zip" type="file" accept=".zip"><dialog id="historyLineDialog"><form method="dialog" class="history-line-form"><h3>Dòng lịch sử</h3><label>Bố cục <select id="historyLineLayout"><option value="alternate">Xen kẽ trên / dưới</option><option value="above">Cùng phía trên</option></select></label><label>Số mốc <input id="historyLineCount" type="number" min="2" max="10" value="4" required></label><div><button type="submit" value="cancel" formnovalidate>Hủy</button><button type="submit" value="create">Tạo mẫu</button></div></form></dialog><dialog id="helpDialog"><form method="dialog"><h3>Hướng dẫn</h3><p><b>Chuyển cảnh:</b> Kéo thẻ chuyển cảnh vào mép nối của hai clip đặt sát nhau. Bạn cũng có thể chọn mép nối rồi bấm thẻ.</p><p><b>Phím tắt:</b> C tách layer · X cắt timeline · D xóa · Alt+kéo clip hoặc keyframe để sao chép · Shift+cuộn phóng timeline.</p><p><b>Timeline:</b> Chọn các layer rồi bấm Nhóm; bấm Thu gọn để ẩn nhóm và thông số.</p><details class="advanced-timeline"><summary>Công cụ Timeline và cảnh</summary><div class="advanced-timeline-controls"><select id="sceneList" aria-label="Danh sách cảnh"></select><details class="scene-menu"><summary>Cảnh ▾</summary><div><button type="button" id="scenePlayAll">▶ Phát tất cả cảnh</button><button type="button" id="sceneAdd">＋ Thêm cảnh</button><button type="button" id="sceneDuplicate">Nhân đôi cảnh</button><button type="button" id="sceneLeft">← Chuyển lên</button><button type="button" id="sceneRight">→ Chuyển xuống</button><button type="button" id="sceneRename">Đổi tên cảnh</button><button type="button" id="sceneDelete">Xóa cảnh</button></div></details><button type="button" id="removeAudio" hidden>Xóa âm thanh</button><button type="button" id="addKey">＋ Keyframe</button><button type="button" id="deleteKey">Xóa keyframe</button><button type="button" id="groupLayersButton" title="Nhóm các layer đã chọn">Nhóm</button><button type="button" id="collapseTracks" title="Thu gọn hoặc mở các nhóm và thông số">Thu gọn</button><label>Giây <input id="keyTime" type="number" min="0" step="0.0333"></label><button type="button" id="moveKey">Đổi giờ keyframe</button></div></details><button value="close">Đóng</button></form></dialog></header><div class="layout"><aside id="mediaPane"><div class="workspace-panel-title"><div class="media-panel-tabs" aria-label="Bảng tài nguyên"><button id="mediaTab" type="button" aria-pressed="true" aria-controls="mediaPanel">Phương tiện</button><button id="graphicsTab" type="button" aria-pressed="false" aria-controls="graphicsPanel">Đồ họa</button></div><button id="panelImport" type="button">＋ Nhập</button></div><div id="mediaPanel"><button id="camera" class="layer" hidden>◉ Camera</button><input id="folderFiles" type="file" webkitdirectory multiple><input id="replacementFiles" type="file" webkitdirectory multiple><div id="folderNav" hidden><button id="folderBack">← Quay lại</button><span id="folderTitle"></span><button id="replaceFolder">Thay bộ ảnh</button></div><div id="layers"></div></div><div id="graphicsPanel" hidden><h3>Mẫu</h3><div class="graphics-items"><button id="addHistoryLine" type="button">＋ Dòng lịch sử</button></div><h3>Hình cơ bản</h3><div class="graphics-items">${Object.entries(shapeNames).map(([type,label])=>`<button type="button" data-add-shape="${type}">＋ ${label}</button>`).join('')}</div></div></aside><div id="mediaResize" class="workspace-divider" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Đổi chiều rộng Phương tiện"></div><main id="viewport"><div class="view-pane landscape-pane"><div class="pane-title camera-title"><span>Active Camera · <select id="cameraAspect" aria-label="Tỉ lệ khung hình"><option value="landscape">16:9</option><option value="portrait">9:16</option></select></span><label>Thu phóng <select id="previewZoom" aria-label="Thu phóng khung xem camera"><option value="0.25">25%</option><option value="0.5">50%</option><option value="0.75">75%</option><option value="1" selected>100%</option><option value="1.5">150%</option><option value="2">200%</option></select></label></div><div id="cameraView"><div id="cameraFrame"></div><div id="portraitFrame" hidden></div></div></div><div id="previewResize" class="workspace-divider" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Đổi tỷ lệ hai khung xem"></div><div class="view-pane custom-pane"><div class="pane-title">Custom 3D View · Chỉnh Vị Trí</div><div id="customView"></div></div></main><div id="inspectorResize" class="workspace-divider" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Đổi chiều rộng Thuộc tính"></div><aside id="inspectorPane"><div class="inspector-tabs"><button id="propertiesTab" class="active">Thuộc tính</button><button id="textTab">Văn bản</button><button id="effectsTab">Chuyển cảnh</button></div><div id="propertiesPanel"><h3 id="selectedTitle">Camera</h3><div class="copy-all-actions"><button id="copyProperties">Sao chép thông số</button><button id="pasteProperties">Dán thông số</button></div><div id="fields"></div><div class="actions"><button id="cameraKey">＋ Keyframe camera</button></div></div><div id="effectsPanel" hidden><section class="transition-settings"><h3>Chuyển cảnh</h3><div class="transition-controls"><label><input id="transitionDuration" type="number" min="0.1" max="10" step="0.1" value="0.6" aria-label="Thời lượng chuyển cảnh"> s</label><button id="removeTransition" type="button">Gỡ</button></div><div class="transition-cards">${transitionOptions.map(([id,label],i)=>`<button type="button" draggable="true" data-transition="${id}"><span aria-hidden="true">${['◐','←','→','↑','↓'][i]}</span>${label}</button>`).join('')}</div><p id="transitionHint" role="status">Kéo thẻ vào mép nối hoặc chọn mép nối rồi bấm thẻ.</p></section><section class="image-strip-settings"><h3>Mở rộng ảnh</h3><p>Chọn một ảnh hoặc giữ Ctrl chọn hai ảnh theo thứ tự trái → phải.</p><label>Cách ghép <select id="imageStripMode"><option value="extend">Mở rộng 1 ảnh</option><option value="blend">Ghép 2 ảnh</option><option value="bridge">Ghép 2 ảnh + đoạn nối</option></select></label><label id="imageStripTilesField">Số ô thêm <input id="imageStripTiles" type="number" min="1" max="8" value="1"></label><label id="imageStripEdgeField">Lấy nền từ mép phải (%) <input id="imageStripEdge" type="number" min="1" max="100" value="20"></label><label id="imageStripOverlapField" hidden>Chồng mép (px) <input id="imageStripOverlap" type="number" min="0" value="64"></label><label id="imageStripOffsetField" hidden>Lệch dọc ảnh phải (px) <input id="imageStripOffset" type="number" value="0"></label><button id="makeImageStrip" type="button">Tạo layer ảnh</button><p id="imageStripStatus" role="status"></p></section></div><div id="textPanel" hidden></div></aside></div><section class="timeline"><div id="timelineResize" role="separator" tabindex="0" aria-orientation="horizontal" aria-label="Kéo để thay đổi chiều cao timeline" title="Kéo lên hoặc xuống để đổi chiều cao timeline"></div><div class="timelinebar"><div class="timeline-tools"><button id="play">▶ Phát</button><span id="timeLabel">0.00s</span><button id="timelineSplit" type="button" title="Tách clip tại vạch thời gian (C)">Tách</button><button id="timelineDelete" type="button" title="Xóa mục đã chọn (D)">Xóa</button><button id="timelineKey" type="button" title="Thêm keyframe cho thông số đang bật">◆ Keyframe</button><button id="timelineEffects" type="button" title="Mở bảng chuyển cảnh">Chuyển cảnh</button></div><div class="timeline-options"><label>Thời lượng <input id="duration" type="number" min="1" max="60" value="10"> giây</label><select id="ease" aria-label="Kiểu nội suy keyframe"><option value="linear">Linear</option><option value="easeIn">Ease In</option><option value="easeOut">Ease Out</option><option value="easeInOut">Ease In/Out</option></select><button id="timelineMagnet" type="button" aria-label="Nam châm Timeline" aria-pressed="true" title="Tắt nam châm Timeline">🧲</button><label class="timeline-zoom">Zoom <input id="timelineZoom" type="range" min="1" max="10" step="0.1" value="1" aria-label="Phóng to Timeline"></label></div></div><div id="timelineScroll"><div id="timelineCanvas"><div id="timelinePlayhead" aria-hidden="true"></div><div class="time-ruler"><div class="ruler-control"><input type="range" id="time" aria-label="Vị trí đầu phát" min="0" max="10" step="0.0333333" value="0"><div id="ticks" class="ticks"></div><span id="rulerPlayhead" aria-hidden="true"></span></div></div><div class="tracks" id="tracks"></div><div id="timelineNewRow" aria-hidden="true"></div></div></div></section>`;
const dbReady=new Promise((resolve,reject)=>{
  const request=indexedDB.open('xuong-vox',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('projects');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
}).catch(error=>{
  message('Không mở được IndexedDB: '+error.message);
  return null;
});
let project=newProject(),selected='camera',time=0,selectedKey=null,playing=false,meshes=new Map(),busy=false,selectedKeys=new Set(),selectedClips=new Set(),keyElements=new Map(),needsRender=true,propertyClipboard=null,multiDrag=null,selectedAudio=false,audioElement=new Audio(),loadedAudioSrc=null;audioElement.preload='auto';const scene=new THREE.Scene();scene.background=new THREE.Color('#161d28');const active=new THREE.PerspectiveCamera(45,16/9,.01,1000),portraitCamera=new THREE.PerspectiveCamera(45,9/16,.01,1000),custom=new THREE.PerspectiveCamera(50,1,.01,1000);custom.position.set(8,6,14);custom.lookAt(0,0,0);const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));$('#customView').prepend(renderer.domElement);const previewRenderer=new THREE.WebGLRenderer({antialias:true});previewRenderer.setPixelRatio(Math.min(devicePixelRatio,2));$('#cameraFrame').append(previewRenderer.domElement);const cameraHandle=new THREE.Object3D();scene.add(cameraHandle);const cameraHelper=new THREE.CameraHelper(active);scene.add(cameraHelper);
// Editor-only camera body; the lens points along the camera's local -Z axis.
const cameraIcon=new THREE.Group(),cameraIconParts=[];
function cameraPart(geometry,color,position,rotationX=0){let mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color,depthTest:false}));mesh.position.set(...position);mesh.rotation.x=rotationX;mesh.renderOrder=1000;mesh.userData.cameraIcon=true;cameraIcon.add(mesh);cameraIconParts.push(mesh)}
cameraPart(new THREE.BoxGeometry(.72,.46,.30),0xd4f733,[0,0,0]);cameraPart(new THREE.CylinderGeometry(.16,.22,.30,16),0xeaf9a0,[0,0,-.29],Math.PI/2);cameraPart(new THREE.BoxGeometry(.25,.12,.22),0xd4f733,[0,.29,.02]);scene.add(cameraIcon);const orbit=new OrbitControls(custom,renderer.domElement);orbit.enableDamping=true;orbit.addEventListener('change',()=>{needsRender=true});const gizmo=new TransformControls(custom,renderer.domElement);scene.add(gizmo.getHelper());gizmo.addEventListener('change',()=>{needsRender=true});gizmo.addEventListener('dragging-changed',e=>{orbit.enabled=!e.value;if(e.value){if(history)history.begin();let layers=project.layers.filter(l=>selectedClips.has(l.id));multiDrag=selected!=='camera'&&selectedClips.has(selected)&&layers.length>1?{origin:gizmo.object.position.toArray(),entries:layers.map(layer=>({layer,position:evaluateEntity(layer,time).position}))}:null}else{multiDrag=null;if(history)history.end()}});gizmo.addEventListener('objectChange',()=>{if(!gizmo.object)return;const position=gizmo.object.position.toArray();if(multiDrag){let delta=position.map((v,i)=>v-multiDrag.origin[i]);moveLayerPositions(multiDrag.entries,delta,time,$('#ease').value);renderTracks();applyAtTime();scheduleSave()}else mutateValue(v=>v.position=position);showFields()});const grid=new THREE.GridHelper(30,30,0x495c73,0x29384b);grid.rotation.x=Math.PI/2;grid.position.z=-2;scene.add(grid);
function sortTransparent(a,b){if(a.groupOrder!==b.groupOrder)return a.groupOrder-b.groupOrder;if(a.renderOrder!==b.renderOrder)return a.renderOrder-b.renderOrder;if(a.z!==b.z)return b.z-a.z;let ai=project.layers.findIndex(l=>l.id===a.object.userData.id),bi=project.layers.findIndex(l=>l.id===b.object.userData.id);if(ai>=0&&bi>=0&&ai!==bi)return bi-ai;return a.id-b.id}renderer.setTransparentSort(sortTransparent);previewRenderer.setTransparentSort(sortTransparent);
const db=await dbReady;function message(t){$('#message').textContent=t}let projectIndex=[],textPresets=[];function readStore(key){return readProjectValue(db,key)}function writeStore(key,value){return writeProjectValue(db,key,value)}function renderProjectList(){let button=$('#projectList'),menu=$('#projectMenu');button.textContent=(project.name||'Dự án chưa đặt tên')+' ▾';menu.replaceChildren();for(const p of projectIndex){let row=document.createElement('div');row.className='project-menu-row';let choose=document.createElement('button');choose.type='button';choose.className='project-choice';choose.textContent=p.name;choose.title=p.name;choose.onclick=()=>switchProject(p.id);let remove=document.createElement('button');remove.type='button';remove.className='project-remove';remove.textContent='×';remove.title='Xóa dự án '+p.name;remove.setAttribute('aria-label',remove.title);remove.onclick=()=>removeProject(p.id);row.append(choose,remove);menu.append(row)}let create=document.createElement('button');create.type='button';create.className='project-create';create.textContent='＋ Dự án mới';create.onclick=createProject;menu.append(create)}async function saveDB(){syncActiveScene(project);projectIndex=await persistProject(db,project,projectIndex);renderProjectList()}
let saveTimer,history=null,layerClipboard=null,lastSaveError=false;function scheduleSave(){syncActiveScene(project);history?.record(project);message('Đang lưu…');clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveDB().then(()=>{lastSaveError=false;message('Đã lưu trên trình duyệt')}).catch(e=>{message('Lưu thất bại: '+e.message);if(!lastSaveError){lastSaveError=true;alert('Không tự lưu được dự án: '+e.message+'. Hãy xuất dự án ZIP để giữ bản sao.') }}),350)}
try{
  const saved=await readStore('current');
  project=saved||project;
  const hasActiveScene=Array.isArray(project.scenes)&&project.scenes.some(scene=>scene.id===project.activeSceneId);
  const needsMigration=!project.projectId||!hasActiveScene;
  project.projectId=project.projectId||crypto.randomUUID();
  ensureScenes(project,()=>crypto.randomUUID());
  const [index,presets,hasNamedRecord]=await Promise.all([
    readStore('project-index'),
    readStore('text-presets'),
    !needsMigration&&hasProjectValue(db,'project:'+project.projectId),
  ]);
  projectIndex=index||[];
  textPresets=presets||[];
  const currentEntry=projectIndex[0];
  const name=project.name||'Dự án chưa đặt tên';
  if(needsMigration||!hasNamedRecord||currentEntry?.id!==project.projectId||currentEntry.name!==name){
    await saveDB();
  }else{
    renderProjectList();
  }
  $('#duration').value=project.duration;
  $('#time').max=project.duration;
  message('Đã mở dự án trên trình duyệt');
}catch(e){
  project.projectId=project.projectId||crypto.randomUUID();
  projectIndex=updateProjectIndex(projectIndex,project);
  renderProjectList();
  message('Không mở được dự án: '+e.message);
}
normalizeEntity(project.camera);for(const layer of project.layers)normalizeEntity(layer);history=new ProjectHistory(project);
function layerDefaults(){return {position:[0,0,0],rotation:[0,0,0],scale:[1,1,1],opacity:1}}
function toggleLayer(id){let l=project.layers.find(x=>x.id===id);if(!l)return;l.visible=l.visible===false;let mesh=meshes.get(id);if(mesh)mesh.visible=layerVisibleAt(l,time,project.duration);renderLayerList();renderTracks();attach();scheduleSave()}
function eyeButton(l){let button=document.createElement('button');button.className='eye';button.type='button';button.textContent=l.visible===false?'◌':'◉';button.title=l.visible===false?'Hiện layer':'Ẩn layer';button.setAttribute('aria-label',button.title+' '+l.name);button.setAttribute('aria-pressed',String(l.visible!==false));button.onclick=e=>{e.stopPropagation();toggleLayer(l.id)};return button}
let openAssetFolder=null,selectedAssetFolders=new Set();
function renderLayerList(){let root=$('#layers');root.replaceChildren();const historyGroups=(project.groups||[]).filter(group=>group.historyLine);
const historyFolder=historyGroups.find(group=>group.id===openAssetFolder);
const historyMembers=new Set(historyGroups.flatMap(group=>group.layerIds));
let library=project.assetFolders||[],folder=library.find(f=>f.id===openAssetFolder),folderLayers=project.layers.filter(l=>historyFolder?historyFolder.layerIds.includes(l.id):l.folderId===openAssetFolder);if(openAssetFolder&&!folder&&!folderLayers.length)openAssetFolder=null;$('#folderNav').hidden=!openAssetFolder;$('#folderTitle').textContent=historyFolder?.name||folder?.name||(folderLayers[0]?.folderName||'');$('#replaceFolder').hidden=!!(folder||historyFolder);let displayed=openAssetFolder?(folder?folder.files:folderLayers):project.layers.filter(l=>!l.folderId&&!historyMembers.has(l.id));if(!openAssetFolder){let folders=new Map(library.map(f=>[f.id,{name:f.name,library:true}]));for(const group of historyGroups)if(group.layerIds.some(id=>project.layers.some(layer=>layer.id===id)))folders.set(group.id,{name:group.name,library:false});for(const l of project.layers)if(l.folderId&&!folders.has(l.folderId))folders.set(l.folderId,{name:l.folderName||'Thư mục',library:false});for(const [id,info] of folders){let button=document.createElement('button');button.className='asset-folder'+(selectedAssetFolders.has(id)?' selected-folder':'');button.title=info.name+(info.library?' · Kéo xuống Timeline; Ctrl để chọn nhiều':' · Thư mục layer cũ');button.draggable=info.library;let icon=document.createElement('span');icon.className='asset-icon';icon.textContent='📁';let caption=document.createElement('span');caption.className='asset-caption';caption.textContent=info.name;button.append(icon,caption);button.onclick=e=>{if(e.detail>1)return;if(e.ctrlKey||e.metaKey){if(selectedAssetFolders.has(id))selectedAssetFolders.delete(id);else selectedAssetFolders.add(id)}else{selectedAssetFolders.clear();selectedAssetFolders.add(id)}for(const node of root.querySelectorAll('.asset-folder'))node.classList.toggle('selected-folder',selectedAssetFolders.has(node.dataset.folderId))};button.dataset.folderId=id;button.ondblclick=()=>{openAssetFolder=id;renderLayerList()};button.ondragstart=e=>{if(!selectedAssetFolders.has(id)){selectedAssetFolders.clear();selectedAssetFolders.add(id)}e.dataTransfer.setData('application/x-vox-folders',JSON.stringify([...selectedAssetFolders]));e.dataTransfer.effectAllowed='copy'};root.append(button)}}for(const l of displayed){let row=document.createElement('div');row.className='asset-card'+(selected===l.id?' active':'')+(selectedClips.has(l.id)?' multi-selected':'');let b=document.createElement('button');b.className='layer-name asset-layer';b.title=l.name+(folder?'':' — nhấn đúp để đổi tên');if(!folder)b.dataset.layerId=l.id;let icon=document.createElement('span');icon.className='asset-icon';if(l.kind==='text')icon.textContent='T';else{let img=document.createElement('img');img.src=l.src;img.alt='';icon.append(img)}let caption=document.createElement('span');caption.className='asset-caption';caption.textContent=l.name;b.append(icon,caption);if(!folder)b.onclick=e=>layerNameClick(l.id,'sidebar',e);row.append(b);root.append(row)}$('#camera').classList.toggle('active',selected==='camera')}

function readImageFile(file){return new Promise((resolve,reject)=>{let r=new FileReader();r.onerror=()=>reject(Error('Không đọc được '+file.name));r.onload=()=>{let img=new Image();img.onload=()=>resolve({src:r.result});img.onerror=()=>reject(Error('Ảnh không hợp lệ: '+file.name));img.src=r.result};r.readAsDataURL(file)})}
$('#folderBack').onclick=()=>{openAssetFolder=null;renderLayerList()};
$('#importFolder').onclick=()=>{document.querySelector('.import-menu').open=false;$('#folderFiles').click()};

$('#folderFiles').onchange=async e=>{let input=e.target;try{let dirs=partitionFolderFiles([...input.files]);if(!dirs.length)throw Error('Không tìm thấy ảnh PNG hoặc JPG trong thư mục.');let entries=await Promise.all(dirs.map(async dir=>({dir,data:await Promise.all(dir.files.map(readImageFile))})));project.assetFolders??=[];for(const {dir,data} of entries)project.assetFolders.push({id:crypto.randomUUID(),name:dir.name,files:dir.files.map((file,i)=>({name:file.name,src:data[i].src}))});openAssetFolder=null;selectedAssetFolders.clear();renderLayerList();scheduleSave()}catch(err){alert('Không nhập được thư mục: '+err.message)}finally{input.value=''}};
const timelineDrop=$('.timeline');timelineDrop.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('application/x-vox-folders')){e.preventDefault();e.dataTransfer.dropEffect='copy'}});timelineDrop.addEventListener('drop',async e=>{let raw=e.dataTransfer.getData('application/x-vox-folders');if(!raw)return;e.preventDefault();try{let ids=JSON.parse(raw),folders=(project.assetFolders||[]).filter(f=>ids.includes(f.id));if(!folders.length)throw Error('Không tìm thấy thư mục');let groups=placeFolders(project,folders,10,()=>crypto.randomUUID());await rebuild();selectedClips=new Set(groups.flatMap(g=>g.layerIds));selected=groups[0].layerIds[0]||'camera';renderTracks();renderTicks();showFields();attach();scheduleSave()}catch(err){alert('Không đưa được thư mục xuống Timeline: '+err.message)}});

$('#replaceFolder').onclick=()=>$('#replacementFiles').click();
$('#replacementFiles').onchange=async e=>{let input=e.target,folderId=openAssetFolder;try{let dirs=partitionFolderFiles([...input.files]);if(dirs.length!==1)throw Error('Hãy chọn một thư mục cảnh chứa trực tiếp các ảnh cần thay.');let layers=project.layers.filter(l=>l.folderId===folderId&&l.kind!=='text');if(!layers.length)throw Error('Thư mục này không có layer ảnh.');let mapping=matchFolderImages(layers,dirs[0].files);let data=await Promise.all(mapping.map(x=>readImageFile(x.file)));if(openAssetFolder!==folderId||layers.some(l=>!project.layers.includes(l)))throw Error('Dự án đã thay đổi, vui lòng thử lại.');applyFolderReplacements(mapping,data,dirs[0].name);for(const l of project.layers.filter(l=>l.folderId===folderId))l.folderName=dirs[0].name;await rebuild();scheduleSave();alert('Đã thay '+mapping.length+' ảnh trong '+dirs[0].name+'.')}catch(err){alert('Chưa thay ảnh: '+err.message)}finally{input.value=''}};

let lastLayerClick=null;
function layerNameClick(id,source,e){selectedAudio=false;if(e&&(e.ctrlKey||e.metaKey||e.shiftKey)){lastLayerClick=null;if(!selectedClips.size&&selected!=='camera')selectedClips.add(selected);if(selectedClips.has(id))selectedClips.delete(id);else selectedClips.add(id);selected=id;selectedKey=null;selectedKeys.clear();renderLayerList();renderTracks();showFields();attach();return}let now=performance.now();if(lastLayerClick&&lastLayerClick.id===id&&lastLayerClick.source===source&&now-lastLayerClick.time<450){lastLayerClick=null;beginLayerRename(id,source);return}lastLayerClick={id,source,time:now};select(id)}
function beginLayerRename(id,source){let layer=project.layers.find(l=>l.id===id);if(!layer)return;let selector=source==='sidebar'?'.layer-name':'.track-label';let host=[...document.querySelectorAll(selector)].find(el=>el.dataset.layerId===id);if(!host)return;let input=document.createElement('input');input.type='text';input.className='layer-rename';input.value=layer.name;input.setAttribute('aria-label','Tên layer');let cancelled=false,finished=false;function finish(){if(finished)return;finished=true;let name=input.value.trim();if(!cancelled&&name&&name!==layer.name){layer.name=name;scheduleSave()}renderLayerList();renderTracks();showFields()}input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();input.blur()}else if(e.key==='Escape'){e.preventDefault();cancelled=true;input.blur()}e.stopPropagation()});input.addEventListener('blur',finish);host.replaceWith(input);input.focus();input.select()}
let inspectorSelection=null,inspectorTab='properties';
function setInspectorTab(tab){inspectorTab=tab;$('#propertiesPanel').hidden=tab!=='properties';$('#textPanel').hidden=tab!=='text';$('#effectsPanel').hidden=tab!=='effects';$('#effectsTab').classList.toggle('active',tab==='effects');$('#propertiesTab').classList.toggle('active',tab==='properties');$('#textTab').classList.toggle('active',tab==='text');if(tab==='text')renderTextPanel()}
$('#settings').onclick=()=>$('#helpDialog').showModal();$('#propertiesTab').onclick=()=>setInspectorTab('properties');$('#effectsTab').onclick=()=>setInspectorTab('effects');
$('#timelineEffects').onclick=()=>setInspectorTab('effects');
$('#timelineSplit').onclick=()=>trimSelectedClips();
$('#timelineDelete').onclick=()=>deleteTimelineSelection();
$('#timelineKey').onclick=()=>$('#addKey').click();
$('#panelImport').onclick=()=>$('#mediaFiles').click();
function showMediaTab(graphics){
  $('#mediaTab').setAttribute('aria-pressed',String(!graphics));
  $('#graphicsTab').setAttribute('aria-pressed',String(graphics));
  $('#mediaPanel').hidden=graphics;
  $('#graphicsPanel').hidden=!graphics;
}
$('#mediaTab').onclick=()=>showMediaTab(false);
$('#graphicsTab').onclick=()=>showMediaTab(true);

$('#textTab').onclick=()=>setInspectorTab('text');
function textCanvas(layer,reveal=null,highlight=1,annotation=1){let t={...TEXT_DEFAULTS,...layer.text},c=document.createElement('canvas');c.width=1536;c.height=512;let x=c.getContext('2d');x.font=(t.bold?'bold ':'')+Math.max(20,Math.min(220,Number(t.fontSize)||100))+'px '+JSON.stringify(textFontFamily(layer));x.textAlign=t.align;x.textBaseline='middle';let chars=Array.from(t.content||''),content=(reveal===null?chars:chars.slice(0,reveal)).join(''),lines=content.split('\n').slice(0,3),lineHeight=(Number(t.fontSize)||100)*1.25,anchor=t.align==='left'?70:t.align==='right'?1466:768,[start,end]=selectedTextRange(t.content||'',t.annotationStart,t.annotationEnd),offset=0;lines.forEach((line,i)=>{let y=256+(i-(lines.length-1)/2)*lineHeight,metrics=x.measureText(line),width=Math.min(1390,metrics.width),factor=metrics.width>1390?1390/metrics.width:1,left=t.align==='left'?anchor:t.align==='right'?anchor-width:anchor-width/2,lo=Math.max(0,start-offset),hi=Math.min(line.length,end-offset),rect=null;if(hi>lo){let prefix=x.measureText(line.slice(0,lo)).width*factor,marked=x.measureText(line.slice(lo,hi)).width*factor;let glyph=x.measureText(line.slice(lo,hi)),asc=glyph.actualBoundingBoxAscent,desc=glyph.actualBoundingBoxDescent,hasGlyph=Number.isFinite(asc)&&Number.isFinite(desc)&&asc+desc>0;rect={left:left+prefix,top:hasGlyph?y-asc:y-lineHeight*.39,width:marked,height:hasGlyph?asc+desc:lineHeight*.78}}if(t.effect==='highlight'&&highlight>0){x.fillStyle=t.highlight||'#d4f733';x.fillRect(left-8,y-lineHeight*.45,(width+16)*highlight,lineHeight*.9)}if(rect)drawAnnotation(x,t.annotation,rect,annotation,t.annotationColor,t.annotationWidth,true,t.annotationOpacity);x.fillStyle=t.color||'#ffffff';x.fillText(line,anchor,y,1390);if(rect)drawAnnotation(x,t.annotation,rect,annotation,t.annotationColor,t.annotationWidth,false,t.annotationOpacity);offset+=line.length+1});return c}
function createTextMesh(layer){let canvas=textCanvas(layer),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;let mesh=new THREE.Mesh(new THREE.PlaneGeometry(12,4),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false}));mesh.userData.id=layer.id;mesh.userData.textFrame='initial';mesh.visible=layer.visible!==false;scene.add(mesh);meshes.set(layer.id,mesh)}
function updateTextMesh(layer,fx,force=false){let mesh=meshes.get(layer.id);if(!mesh)return;let frame=[fx.reveal,layer.text?.effect==='highlight'?Math.round(fx.highlight*1000):0,layer.text?.annotation&&layer.text.annotation!=='none'?Math.round(fx.annotationProgress*1000):0].join(':');if(!force&&mesh.userData.textFrame===frame)return;let canvas=textCanvas(layer,fx.reveal,fx.highlight,fx.annotationProgress),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;mesh.material.map?.dispose();mesh.material.map=texture;mesh.material.needsUpdate=true;mesh.userData.textFrame=frame;needsRender=true}
$('#addHistoryLine').onclick=()=>{
  $('#historyLineDialog').showModal();
};
$('#historyLineDialog form').onsubmit=event=>{
  if(event.submitter?.value!=='create')return;
  const count=Number($('#historyLineCount').value);
  if(!Number.isInteger(count)||count<2||count>10)return;
  createHistoryLine(count,$('#historyLineLayout').value);
};

function createHistoryLine(count,layout){
  const start=Math.min(time,Math.max(0,project.duration-1/30));
  const {span,drawTime,marks}=historyLineLayout(count,layout,start,project.duration);
  const color='#e14c36';
  const camera=project.aspect==='portrait'?portraitCamera:active;
  const distance=8;
  const viewHeight=2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const fit=viewHeight*Math.min(1/4,camera.aspect/12);
  const rotation=new THREE.Euler().setFromQuaternion(camera.quaternion).toArray().slice(0,3).map(THREE.MathUtils.radToDeg);
  function makeLayer(name,x,y,z,scale,clipStart=start){
    const value=layerDefaults();
    value.position=new THREE.Vector3(x*fit,y*fit,-distance+z).applyQuaternion(camera.quaternion).add(camera.position).toArray();
    value.rotation=[...rotation];
    value.scale=scale.map(component=>component*fit);
    return {id:crypto.randomUUID(),name,value,keys:[],clipStart};
  }
  function makeShape(type,name,x,y,z,scale,clipStart,style={}){
    const layer=makeLayer(name,x,y,z,scale,clipStart);
    layer.kind='shape';
    layer.shape={type,color,thickness:8,dashed:false,...style};
    layer.src=shapeCanvas(layer.shape).toDataURL('image/png');
    return layer;
  }
  const arrow=makeShape('arrow','Trục lịch sử',.25,0,0,[(span+.5)/16,.2,1]);
  arrow.value.length=100;
  arrow.animated={length:true};
  putPropertyKey(arrow,'length',start,0,'linear');
  putPropertyKey(arrow,'length',start+drawTime,100,'linear');
  const layers=marks.flatMap((mark,index)=>{
    const {x,side,time:appear,textWidth}=mark;
    const textX=x+Math.min(textWidth*.48,.72);
    const makeLabel=(name,content,y,fontSize,color,bold)=>{
      const label=makeLayer(name,textX,side*y,.06,[textWidth/12,.29,1],appear);
      label.kind='text';
      label.text={...TEXT_DEFAULTS,content,fontSize,color,bold,align:'left'};
      label.src=textCanvas(label).toDataURL('image/png');
      label.popIn=true;
      return label;
    };
    const year=makeLabel('Năm mốc '+(index+1),'Năm '+(index+1),.61,145,color,true);
    const caption=makeLabel('Chú thích mốc '+(index+1),'Chú thích',.92,104,'#e6d9cc',false);
    const stem=makeShape('line','Nét nối '+(index+1),x,side*.61,.01,[1.22/16,.28,1],appear,{color:'#c7a785',dashed:true,thickness:5});
    const stemRotation=camera.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),side*Math.PI/2));
    stem.value.rotation=new THREE.Euler().setFromQuaternion(stemRotation).toArray().slice(0,3).map(THREE.MathUtils.radToDeg);
    const endpoint=makeShape('circle','Đầu nét nối '+(index+1),x,side*1.22,.03,[.032,.032,1],appear,{color:'#c7a785'});
    const dot=makeShape('circle','Mốc '+(index+1),x,0,.04,[.057,.057,1],appear);
    dot.popIn=true;
    return [year,caption,dot,endpoint,stem];
  });
  layers.push(arrow);
  project.layers.unshift(...layers);
  const group=groupLayers(project,layers.map(layer=>layer.id),crypto.randomUUID());
  Object.assign(group,{name:'Dòng lịch sử',historyLine:true,collapsed:true});
  openAssetFolder=null;
  selected=layers[0].id;
  rebuild();
  scheduleSave();
  setInspectorTab('text');
}

function createShapeLayer(type){
  const shape={type,color:'#e14c36',thickness:10,dashed:false};
  const layer={id:crypto.randomUUID(),kind:'shape',name:shapeNames[type],shape,
    src:shapeCanvas(shape).toDataURL('image/png'),value:layerDefaults(),keys:[],clipStart:time};
  layer.value.position=[0,0,2];
  if(type==='line'||type==='arrow'){
    layer.value.scale=[.5,.5,1];
    layer.value.length=100;
    if(type==='line'&&time<project.duration-1/30){
      layer.animated={length:true};
      putPropertyKey(layer,'length',time,0,'linear');
      putPropertyKey(layer,'length',Math.min(time+1,project.duration),100,'linear');
    }
  }else{
    layer.value.scale=type==='rectangle'?[.6,.3,1]:[.25,.25,1];
  }
  project.layers.unshift(layer);
  selected=layer.id;
  rebuild();
  scheduleSave();
}
for(const button of document.querySelectorAll('[data-add-shape]')){
  button.onclick=()=>{
    createShapeLayer(button.dataset.addShape);
  };
}
function appendShapeFields(box,item,value){
  const shape=item.shape;
  const change=()=>{
    const canvas=shapeCanvas(shape);
    item.src=canvas.toDataURL('image/png');
    const mesh=meshes.get(item.id);
    if(mesh){
      mesh.material.map.image=mesh.userData.arrowTip?shapeCanvas({...shape,type:'line'}):canvas;
      mesh.userData.arrowTip?.material.color.set(shape.color);
      mesh.material.map.needsUpdate=true;
    }else rebuild();
    renderLayerList();
    applyAtTime();
    scheduleSave();
  };
  const addField=(name,input)=>{
    const row=document.createElement('label');
    row.className='scalar';
    row.append(name,input);
    input.disabled=!!item.locked;
    box.append(row);
  };
  const color=document.createElement('input');
  color.type='color';
  color.value=shape.color;
  color.onchange=()=>{shape.color=color.value;change()};
  addField('Màu hình',color);
  if(shape.type==='line'||shape.type==='arrow'){
    const thickness=document.createElement('input');
    thickness.type='number';
    thickness.min=1;thickness.max=60;
    thickness.value=shape.thickness;
    thickness.onchange=()=>{
      shape.thickness=clamp(Number(thickness.value)||1,1,60);
      thickness.value=shape.thickness;
      change();
    };
    addField('Độ dày nét',thickness);
    const dashed=document.createElement('input');
    dashed.type='checkbox';
    dashed.checked=shape.dashed;
    dashed.onchange=()=>{shape.dashed=dashed.checked;change()};
    addField('Nét đứt',dashed);
    const length=document.createElement('input');
    length.type='number';
    length.min=0;length.max=100;
    length.value=Number((value.length??100).toFixed(2));
    length.onchange=()=>{
      mutateValue(v=>v.length=clamp(Number(length.value)||0,0,100));
      showFields();
    };
    addField('Chiều dài (%)',length);
    length.parentElement.prepend(propertyToggle('length','Chiều dài'));
  }
}
function appendPopField(box,item){
  const row=document.createElement('label');
  row.className='scalar';
  const toggle=document.createElement('input');
  toggle.type='checkbox';
  toggle.checked=!!item.popIn;
  toggle.disabled=!!item.locked;
  toggle.onchange=()=>{
    item.popIn=toggle.checked;
    applyAtTime();
    scheduleSave();
  };
  row.append('Bật ra khi xuất hiện',toggle);
  box.append(row);
}

function createTextLayer(){let layer={id:crypto.randomUUID(),kind:'text',name:'Chữ mới',text:{...TEXT_DEFAULTS},value:layerDefaults(),keys:[],animated:{},clipStart:time};layer.value.position=[0,0,2];layer.src=textCanvas(layer).toDataURL('image/png');project.layers.unshift(layer);selected=layer.id;rebuild();scheduleSave();setInspectorTab('text');$('#textContent')?.focus()}
function renderTextPanel(){let panel=$('#textPanel');panel.replaceChildren();let item=current(),add=document.createElement('button');add.className='text-add';add.textContent='＋ Thêm layer chữ';add.onclick=createTextLayer;panel.append(add);if(item?.kind!=='text'){let note=document.createElement('p');note.className='text-note';note.textContent='Chọn layer chữ để chỉnh sửa.';panel.append(note);return}item.text={...TEXT_DEFAULTS,...item.text};let title=document.createElement('h3');title.textContent=item.name;panel.append(title);let templateHead=document.createElement('div');templateHead.className='text-template-head';let saveTemplate=document.createElement('button');saveTemplate.type='button';saveTemplate.textContent='Lưu mẫu chữ';saveTemplate.onclick=async()=>{let name=prompt('Tên mẫu chữ:');if(!name?.trim())return;let saved={id:crypto.randomUUID(),name:name.trim(),projectName:project.name||'Dự án chưa đặt tên',text:structuredClone(item.text),animated:structuredClone(item.animated||{}),keys:structuredClone(item.keys||[]),duration:project.duration};let old=textPresets;textPresets=updatePresetList(textPresets,saved);try{await writeStore('text-presets',textPresets);renderTextPanel()}catch(e){textPresets=old;alert('Không lưu được mẫu chữ: '+e.message)}};templateHead.append(saveTemplate);panel.append(templateHead);let templateList=document.createElement('div');templateList.className='text-template-list';for(const preset of textPresets){let card=document.createElement('div');card.className='text-template-card';let previewLayer={id:'preset_'+preset.id,text:{...preset.text,content:'Mẫu chữ',annotationStart:null,annotationEnd:null}},preview=textCanvas(previewLayer);preview.className='text-template-preview';if(previewLayer.text.fontData)ensureTextFont(previewLayer).then(()=>{if(preview.isConnected){let loaded=textCanvas(previewLayer);loaded.className='text-template-preview';preview.replaceWith(loaded);preview=loaded}}).catch(()=>{});let caption=document.createElement('span');caption.textContent=preset.name;let apply=document.createElement('button');apply.textContent='Dùng';apply.onclick=async()=>{if(item.keys?.length&&!confirm('Dùng mẫu sẽ thay các keyframe của layer chữ này. Tiếp tục?'))return;Object.assign(item,textPresetState(preset,item.text.content,project.duration,TEXT_DEFAULTS));try{await ensureTextFont(item)}catch(e){alert('Không nạp được font của mẫu: '+e.message)}change();renderTracks();renderTextPanel()};let remove=document.createElement('button');remove.textContent='×';remove.title='Xóa mẫu chữ';remove.onclick=async()=>{if(!confirm('Xóa mẫu chữ này?'))return;let old=textPresets;textPresets=textPresets.filter(p=>p.id!==preset.id);try{await writeStore('text-presets',textPresets);renderTextPanel()}catch(e){textPresets=old;alert('Không xóa được mẫu chữ: '+e.message)}};card.append(preview,caption,apply,remove);templateList.append(card)}panel.append(templateList);function field(label,el){let wrap=document.createElement('label');wrap.className='text-field';let caption=document.createElement('span');caption.textContent=label;wrap.append(caption,el);panel.append(wrap);return el}function change(){item.src=textCanvas(item).toDataURL('image/png');let b=clipBounds(item,project.duration);updateTextMesh(item,textAnimation(item.text,time,b.start,b.end),true);needsRender=true;scheduleSave()}let content=document.createElement('textarea');content.id='textContent';content.rows=3;content.value=item.text.content;content.oninput=()=>{item.text.content=content.value;item.text.annotationStart=null;item.text.annotationEnd=null;scope.textContent='Đang đánh dấu toàn bộ chữ';change()};field('Nội dung',content);let font=document.createElement('select');for(const f of ['Arial','UTM Bebas','Georgia','Times New Roman','Verdana','Tahoma'])font.add(new Option(f,f));font.value=item.text.font;font.onchange=()=>{item.text.font=font.value;change()};field('Phông chữ',font);let fontUpload=document.createElement('input');fontUpload.type='file';fontUpload.accept='.ttf,.otf,.woff,.woff2';fontUpload.hidden=true;let fontButton=document.createElement('button');fontButton.type='button';fontButton.textContent='Nhập font UTM Bebas';fontButton.onclick=()=>fontUpload.click();fontUpload.onchange=async()=>{let file=fontUpload.files?.[0];if(!file)return;try{if(file.size>10*1024*1024)throw Error('Tệp font vượt quá 10 MB');let data=await new Promise((resolve,reject)=>{let reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Không đọc được tệp font'));reader.readAsDataURL(file)});let next={...item,text:{...item.text,font:'UTM Bebas',fontData:data}};await ensureTextFont(next);item.text.font='UTM Bebas';item.text.fontData=data;font.value='UTM Bebas';change()}catch(e){alert('Không nạp được font: '+e.message)}finally{fontUpload.value=''}};panel.append(fontButton,fontUpload);let fontHint=document.createElement('p');fontHint.className='text-note';fontHint.textContent='Chọn UTM Bebas nếu máy đã cài, hoặc nhập file font để lưu cùng dự án.';panel.append(fontHint);let size=document.createElement('input');size.type='number';size.min=20;size.max=220;size.value=item.text.fontSize;size.onchange=()=>{item.text.fontSize=clamp(Number(size.value)||100,20,220);change()};field('Cỡ chữ',size);let color=document.createElement('input');color.type='color';color.value=item.text.color;color.oninput=()=>{item.text.color=color.value;change()};field('Màu chữ',color);let align=document.createElement('select');for(const [n,v] of [['Trái','left'],['Giữa','center'],['Phải','right']])align.add(new Option(n,v));align.value=item.text.align;align.onchange=()=>{item.text.align=align.value;change()};field('Căn chữ',align);let bold=document.createElement('input');bold.type='checkbox';bold.checked=item.text.bold;bold.onchange=()=>{item.text.bold=bold.checked;change()};field('Chữ đậm',bold);let effect=document.createElement('select');for(const [n,v] of [['Không','none'],['Mờ dần','fade'],['Trượt lên','slide'],['Phóng to','zoom'],['Gõ từng chữ','typewriter'],['Tô nền Vox','highlight']])effect.add(new Option(n,v));effect.value=item.text.effect;effect.onchange=()=>{item.text.effect=effect.value;change()};field('Hiệu ứng vào',effect);let out=document.createElement('select');for(const [n,v] of [['Không','none'],['Mờ dần','fade'],['Trượt lên','slide'],['Thu nhỏ','zoom']])out.add(new Option(n,v));out.value=item.text.outEffect;out.onchange=()=>{item.text.outEffect=out.value;change()};field('Hiệu ứng ra',out);let duration=document.createElement('input');duration.type='number';duration.min=.1;duration.max=10;duration.step=.1;duration.value=item.text.duration;duration.onchange=()=>{item.text.duration=clamp(Number(duration.value)||.7,.1,10);change()};field('Thời gian hiệu ứng (giây)',duration);let hl=document.createElement('input');hl.type='color';hl.value=item.text.highlight;hl.oninput=()=>{item.text.highlight=hl.value;change()};field('Màu nền Vox',hl);let annotationTitle=document.createElement('h3');annotationTitle.textContent='Đánh dấu chữ';panel.append(annotationTitle);let annotation=document.createElement('select');for(const [n,v] of [['Không','none'],['Tô sáng','highlight'],['Gạch chân','underline'],['Khoanh tròn','circle'],['Gạch chéo','cross']])annotation.add(new Option(n,v));annotation.value=item.text.annotation;annotation.onchange=()=>{item.text.annotation=annotation.value;change()};field('Kiểu đánh dấu',annotation);let choose=document.createElement('button');choose.type='button';choose.className='text-add annotation-select';choose.textContent='Dùng đoạn chữ đang chọn';choose.onclick=()=>{let a=content.selectionStart,b=content.selectionEnd;if(a===b){alert('Hãy bôi đen đoạn chữ trong ô Nội dung trước.');return}item.text.annotationStart=a;item.text.annotationEnd=b;scope.textContent='Đang đánh dấu: '+item.text.content.slice(a,b);change()};panel.append(choose);let scope=document.createElement('p');scope.className='text-note';let [a,b]=selectedTextRange(item.text.content,item.text.annotationStart,item.text.annotationEnd);scope.textContent=item.text.annotationStart==null?'Đang đánh dấu toàn bộ chữ':'Đang đánh dấu: '+item.text.content.slice(a,b);panel.append(scope);let all=document.createElement('button');all.type='button';all.textContent='Đánh dấu toàn bộ';all.onclick=()=>{item.text.annotationStart=null;item.text.annotationEnd=null;scope.textContent='Đang đánh dấu toàn bộ chữ';change()};panel.append(all);let ac=document.createElement('input');ac.type='color';ac.value=item.text.annotationColor;ac.oninput=()=>{item.text.annotationColor=ac.value;change()};field('Màu đánh dấu',ac);let ao=document.createElement('input');ao.type='number';ao.min=0;ao.max=100;ao.step=5;ao.value=Math.round(item.text.annotationOpacity*100);ao.onchange=()=>{item.text.annotationOpacity=clamp(Number(ao.value),0,100)/100;change()};field('Độ đậm nét (%)',ao);let aw=document.createElement('input');aw.type='number';aw.min=1;aw.max=30;aw.value=item.text.annotationWidth;aw.onchange=()=>{item.text.annotationWidth=clamp(Number(aw.value)||6,1,30);change()};field('Độ dày nét',aw);let delay=document.createElement('input');delay.type='number';delay.min=0;delay.max=60;delay.step=.1;delay.value=item.text.annotationDelay;delay.onchange=()=>{item.text.annotationDelay=clamp(Number(delay.value)||0,0,60);change()};field('Bắt đầu sau (giây)',delay);let ad=document.createElement('input');ad.type='number';ad.min=.1;ad.max=10;ad.step=.1;ad.value=item.text.annotationDuration;ad.onchange=()=>{item.text.annotationDuration=clamp(Number(ad.value)||.8,.1,10);change()};field('Thời gian vẽ (giây)',ad);let help=document.createElement('p');help.className='text-note';help.textContent='Chọn Thuộc tính để chỉnh vị trí, kích thước và keyframe của chữ.';panel.append(help)}
let changingScene=false,playAllScenes=false;function renderSceneList(){let select=$('#sceneList');if(!select)return;select.replaceChildren();for(const item of project.scenes||[])select.add(new Option(item.name,item.id));select.value=project.activeSceneId||''}
async function changeScene(id){if(changingScene||busy||id===project.activeSceneId)return;changingScene=true;document.body.classList.add('switching-scene');try{clearTimeout(saveTimer);syncActiveScene(project);await saveDB();applyScene(project,id);playing=false;audioElement.pause();$('#play').textContent='▶ Phát';time=0;selected='camera';history=new ProjectHistory(project);renderTicks();await rebuild();await saveDB()}finally{changingScene=false;document.body.classList.remove('switching-scene')}}
$('#sceneList').onchange=e=>{playAllScenes=false;changeScene(e.target.value).catch(err=>{renderSceneList();alert('Không mở được cảnh: '+err.message)})};$('#scenePlayAll').onclick=async()=>{try{if(playing){playing=false;audioElement.pause();$('#play').textContent='▶ Phát'}let first=project.scenes[0];if(first.id!==project.activeSceneId)await changeScene(first.id);time=0;seekAudio();applyAtTime();playAllScenes=true;$('#play').click()}catch(e){playAllScenes=false;alert('Không phát được các cảnh: '+e.message)}};document.querySelectorAll('.scene-menu button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.scene-menu').open=false}));
$('#sceneAdd').onclick=()=>{if(changingScene||busy)return;syncActiveScene(project);let id=crypto.randomUUID(),fresh=newProject();addScene(project,id,captureSceneState(fresh),'Cảnh '+(project.scenes.length+1));changeScene(id).catch(e=>alert('Không thêm được cảnh: '+e.message))};
$('#sceneDuplicate').onclick=()=>{if(changingScene||busy)return;syncActiveScene(project);let old=project.scenes.find(x=>x.id===project.activeSceneId),id=crypto.randomUUID();addScene(project,id,old.state,old.name+' (bản sao)');changeScene(id).catch(e=>alert('Không nhân đôi được cảnh: '+e.message))};
for(const [id,delta] of [['sceneLeft',-1],['sceneRight',1]])$('#'+id).onclick=()=>{syncActiveScene(project);if(moveScene(project,project.activeSceneId,delta)){renderSceneList();scheduleSave()}};
$('#sceneRename').onclick=()=>{let item=project.scenes.find(x=>x.id===project.activeSceneId),name=prompt('Tên cảnh:',item.name);if(name?.trim()){item.name=name.trim();renderSceneList();scheduleSave()}};
$('#sceneDelete').onclick=async()=>{if(changingScene||busy)return;if(project.scenes.length<=1){alert('Dự án cần có ít nhất một cảnh.');return}if(!confirm('Xóa cảnh hiện tại?'))return;changingScene=true;document.body.classList.add('switching-scene');clearTimeout(saveTimer);syncActiveScene(project);let previous=structuredClone(project);try{let index=project.scenes.findIndex(x=>x.id===project.activeSceneId);project.scenes.splice(index,1);let next=project.scenes[Math.min(index,project.scenes.length-1)];applyScene(project,next.id);playing=false;playAllScenes=false;audioElement.pause();$('#play').textContent='▶ Phát';time=0;selected='camera';history=new ProjectHistory(project);renderTicks();await rebuild();await saveDB()}catch(e){project=previous;history=new ProjectHistory(project);renderTicks();await rebuild();alert('Không xóa được cảnh: '+e.message)}finally{changingScene=false;document.body.classList.remove('switching-scene')}};
function syncAudio(){let src=project.audio?.src||null;if(src!==loadedAudioSrc){audioElement.pause();loadedAudioSrc=src;if(src)audioElement.src=src;else{audioElement.removeAttribute('src');audioElement.load()}}$('#removeAudio').hidden=!src;$('#duration').disabled=!!src;$('#duration').max=Math.max(60,project.duration);$('#duration').value=Number(project.duration.toFixed(3));$('#time').max=project.duration}
function seekAudio(){if(loadedAudioSrc)try{let start=clipBounds(project.audio,project.duration).start;audioElement.currentTime=clamp(time-start,0,Number.isFinite(audioElement.duration)?audioElement.duration:project.duration)}catch{}}
audioElement.addEventListener('loadedmetadata',()=>{if(loadedAudioSrc)seekAudio()});
let rebuildVersion=0;

function rebuild(){
  const version=++rebuildVersion;
  separateOverlappingLanes(project);
  for(const group of project.groups||[]){
    if(group.historyLine||group.name!=='Dòng lịch sử')continue;
    const hasAxis=project.layers.some(layer=>group.layerIds.includes(layer.id)&&layer.shape?.type==='arrow'&&layer.name==='Trục lịch sử');
    if(hasAxis)Object.assign(group,{historyLine:true,collapsed:true});
  }
  renderSceneList();
  selectedAudio=false;
  syncCameraAspect();
  syncAudio();
  selectedKeys.clear();
  selectedClips.clear();
  selectedKey=null;
  for(const mesh of meshes.values()){
    scene.remove(mesh);
    const tip=mesh.userData.arrowTip;
    if(tip){
      scene.remove(tip);
      tip.geometry.dispose();
      tip.material.dispose();
    }
    mesh.geometry.dispose();
    mesh.material.map?.dispose();
    mesh.material.dispose();
  }
  meshes.clear();
  gizmo.detach();

  const images=new Map();
  const pending=project.layers.map(layer=>{
    if(layer.kind==='text'){
      createTextMesh(layer);
      return ensureTextFont(layer).then(()=>{
        if(version!==rebuildVersion||!project.layers.includes(layer))return;
        const bounds=clipBounds(layer,project.duration);
        updateTextMesh(layer,textAnimation(layer.text||TEXT_DEFAULTS,time,bounds.start,bounds.end),true);
      }).catch(error=>console.error('Không nạp được font chữ:',error));
    }

    const src=layer.src;
    if(!images.has(src)){
      images.set(src,new Promise(resolve=>{
        const image=new Image();
        image.onload=()=>resolve(image);
        image.onerror=()=>resolve(null);
        image.src=src;
      }));
    }

    return images.get(src).then(image=>{
      if(!image||version!==rebuildVersion||layer.src!==src||!project.layers.includes(layer))return;
      const arrow=layer.shape?.type==='arrow';
      const texture=new THREE.Texture(arrow?shapeCanvas({...layer.shape,type:'line'}):image);
      texture.needsUpdate=true;
      texture.colorSpace=THREE.SRGBColorSpace;
      const aspect=image.width/image.height;
      const mesh=new THREE.Mesh(
        new THREE.PlaneGeometry(4*aspect,4),
        new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide,depthWrite:false}),
      );
      mesh.userData.id=layer.id;
      if(arrow){
        const triangle=new THREE.Shape();
        triangle.moveTo(0,-.5);
        triangle.lineTo(1,0);
        triangle.lineTo(0,.5);
        triangle.closePath();
        const tip=new THREE.Mesh(new THREE.ShapeGeometry(triangle),new THREE.MeshBasicMaterial({
          color:layer.shape.color,transparent:true,side:THREE.DoubleSide,depthWrite:false,
        }));
        tip.userData.id=layer.id;
        mesh.userData.arrowTip=tip;
        scene.add(tip);
      }
      scene.add(mesh);
      meshes.set(layer.id,mesh);
      applyLayerAtTime(layer,mesh);
      if(selected===layer.id)attach();
      needsRender=true;
    });
  });
  renderLayerList();
  renderTracks();
  showFields();
  applyAtTime();
  attach();
  return Promise.all(pending);
}
function syncCameraAspect(){
  const portrait=project.aspect==='portrait';
  const landscapeFrame=$('#cameraFrame');
  const portraitFrame=$('#portraitFrame');
  $('#cameraAspect').value=portrait?'portrait':'landscape';
  landscapeFrame.hidden=portrait;
  portraitFrame.hidden=!portrait;
  cameraHelper.camera=portrait?portraitCamera:active;
  const frame=portrait?portraitFrame:landscapeFrame;
  if(previewRenderer.domElement.parentElement!==frame){
    frame.append(previewRenderer.domElement);
    resize();
  }
  needsRender=true;
}
$('#cameraAspect').onchange=event=>{
  project.aspect=event.target.value;
  syncCameraAspect();
  scheduleSave();
};
function applyLayerAtTime(layer,mesh){
  const value=evaluateEntity(layer,time);
  mesh.position.fromArray(value.position);
  mesh.rotation.set(...value.rotation.map(THREE.MathUtils.degToRad));
  mesh.scale.fromArray(value.scale);
  let edge=layer.transition;
  if(edge?.atJoin){
    const partner=project.layers.find(item=>item.id===edge.partner);
    const cut=edge.role==='out'?clipJoin(layer,partner,project.duration):clipJoin(partner,layer,project.duration);
    if(cut===null||Math.abs(cut-(edge.start+edge.end)/2)>1e-7)edge=null;
  }
  const transition=transitionAt(layer,time,edge);
  mesh.material.opacity=value.opacity*transition.alpha;
  if(edge?.atJoin&&(transition.x||transition.y)){
    // A slide travels one visible camera frame at the layer's depth.
    const camera=project.aspect==='portrait'?portraitCamera:active;
    const depth=-mesh.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
    const height=2*Math.max(camera.near,depth)*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    const displacement=new THREE.Vector3(transition.x*height*camera.aspect/4,transition.y*height/4,0);
    mesh.position.add(displacement.applyQuaternion(camera.quaternion));
  }else{
    mesh.position.x+=transition.x;
    mesh.position.y+=transition.y;
  }
  if(layer.kind==='text'){
    const range=clipBounds(layer,project.duration);
    const fx=textAnimation(layer.text||TEXT_DEFAULTS,time,range.start,range.end);
    mesh.material.opacity*=fx.alpha;
    mesh.position.y+=fx.offsetY;
    mesh.scale.x*=fx.scale;
    mesh.scale.y*=fx.scale;
    updateTextMesh(layer,fx);
  }
  const bounds=clipBounds(layer,project.duration);
  if(layer.popIn&&bounds.end>bounds.start){
    const scale=popScale(time-bounds.start,Math.min(.3,bounds.end-bounds.start));
    mesh.scale.x*=scale;
    mesh.scale.y*=scale;
  }
  const length=clamp((value.length??100)/100,0,1);
  const duringJoin=edge?.atJoin&&time>=edge.start&&time<edge.end;
  mesh.visible=length>0&&(layerVisibleAt(layer,time,project.duration)||!!(duringJoin&&layer.visible!==false));
  if(layer.shape&&(layer.shape.type==='line'||layer.shape.type==='arrow')){
    const direction=Math.sign(mesh.scale.x)||1;
    const fullWidth=mesh.geometry.parameters.width*Math.abs(mesh.scale.x);
    const width=fullWidth*length;
    const tip=mesh.userData.arrowTip;
    // Size the triangle from stroke thickness, independently of the shaft length.
    const tipHeight=layer.shape.thickness*Math.abs(mesh.scale.y)*4/128*2.6;
    const tipWidth=tip?Math.min(width,tipHeight*1.15):0;
    const shaftWidth=width-tipWidth;
    const left=-fullWidth/2;
    if(tip){
      tip.position.copy(mesh.position).add(new THREE.Vector3(direction*(left+shaftWidth),0,0).applyQuaternion(mesh.quaternion));
      tip.quaternion.copy(mesh.quaternion);
      tip.scale.set(direction*tipWidth,tipHeight,1);
      tip.material.opacity=mesh.material.opacity;
      tip.visible=mesh.visible&&tipWidth>0;
    }
    mesh.position.add(new THREE.Vector3(direction*(left+shaftWidth/2),0,0).applyQuaternion(mesh.quaternion));
    mesh.scale.x=direction*shaftWidth/mesh.geometry.parameters.width;
    mesh.material.map.repeat.x=fullWidth?shaftWidth/fullWidth:0;
    mesh.visible=mesh.visible&&shaftWidth>0;
  }
}
function applyAtTime(exporting=false){needsRender=true;if(project.audio){let range=clipBounds(project.audio,project.duration);audioElement.muted=time<range.start||time>=range.end;if(playing&&time>=range.start&&time<range.end&&Math.abs(audioElement.currentTime-(time-range.start))>.2)seekAudio()}const c=evaluateEntity(project.camera,time);active.position.fromArray(c.position);active.fov=c.fov;active.updateProjectionMatrix();const heading=project.camera.fixedHeading;if(heading)active.quaternion.fromArray(heading);else active.lookAt(...c.target);active.rotateX(THREE.MathUtils.degToRad(c.rotation[0]));active.rotateY(THREE.MathUtils.degToRad(c.rotation[1]));active.rotateZ(THREE.MathUtils.degToRad(c.rotation[2]));active.updateMatrixWorld();portraitCamera.position.copy(active.position);portraitCamera.quaternion.copy(active.quaternion);portraitCamera.fov=active.fov;portraitCamera.updateProjectionMatrix();portraitCamera.updateMatrixWorld();cameraHelper.update();cameraHandle.position.fromArray(c.position);cameraIcon.position.copy(active.position);cameraIcon.quaternion.copy(active.quaternion);for(const l of project.layers){let mesh=meshes.get(l.id);if(!mesh)continue;applyLayerAtTime(l,mesh)}if(selected!=='camera'){const m=meshes.get(selected);if(m&&((m.visible&&gizmo.object!==m)||(!m.visible&&gizmo.object===m)))attach()}if(!exporting){updatePlayhead();$('#time').value=time;$('#timeLabel').textContent=time.toFixed(2)+'s'}}
function current(){return selected==='camera'?project.camera:project.layers.find(x=>x.id===selected)}function selectedValue(){return evaluateEntity(current(),time)}function mutateValue(fn){let item=current();if(item?.locked)return;const changed=editEntity(item,time,fn,$('#ease').value);if(changed.length){selectedKey=changed[changed.length-1];selectedKeys.clear();for(const k of changed)selectedKeys.add(k)}renderTracks();applyAtTime();scheduleSave()}
function resetField(key){let defaults=selected==='camera'?initialCamera():layerDefaults();if(!(key in defaults))return;mutateValue(v=>v[key]=structuredClone(defaults[key]));showFields()}
function resetButton(key,label){let b=document.createElement('button');b.type='button';b.className='reset-field';b.textContent='↺';b.title='Đặt lại '+label;b.setAttribute('aria-label',b.title);b.onclick=()=>resetField(key);return b}
function propertyToggle(key,label){let item=current();normalizeEntity(item);let button=document.createElement('button');button.type='button';button.className='property-toggle'+(item.animated[key]?' enabled':'');button.textContent='◷';button.title=(item.animated[key]?'Tắt':'Bật')+' keyframe '+label;button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(!!item.animated[key]));button.onclick=()=>{if(item.locked)return;let enabled=toggleProperty(item,key,time,$('#ease').value);selectedKeys.clear();selectedKey=null;renderTracks();applyAtTime();showFields();scheduleSave();message((enabled?'Đã bật':'Đã tắt')+' keyframe '+label)};return button}
function fieldRow(label,key,v){let row=document.createElement('div');row.className='fields';row.append(propertyToggle(key,label));let title=document.createElement('span');title.textContent=label;row.append(title);v.forEach((x,i)=>{let input=document.createElement('input');input.type='number';input.step='0.1';input.value=Number(x.toFixed(2));let axis=key==='scale'&&i===2?'Đồng đều X/Y':['X','Y','Z'][i];input.title=label+' '+axis+' — kéo ngang để điều chỉnh, hoặc nhấp để nhập số';input.setAttribute('aria-label',label+' '+axis);let drag=null;input.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,start:Number(input.value)||0,moved:false};history?.begin();input.setPointerCapture(e.pointerId)});input.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;let dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)<4)return;drag.moved=true;let sensitivity=key==='rotation'?.25:key==='scale'?.01:.05;let next=Math.round((drag.start+dx*sensitivity)*100)/100;if(key==='scale')next=Math.max(.01,next);input.value=next;mutateValue(v=>{if(key==='scale')v.scale=setScaleComponent(v.scale,i,next);else v[key][i]=next})});input.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;let moved=drag.moved;drag=null;history?.end();if(moved){e.preventDefault();input.blur()} });input.addEventListener('pointercancel',()=>{drag=null;history?.end()});input.onchange=()=>{let next=Number(input.value);if(!Number.isFinite(next))return;if(key==='scale')next=Math.max(.01,next);mutateValue(v=>{if(key==='scale')v.scale=setScaleComponent(v.scale,i,next);else v[key][i]=next});showFields()};row.append(input)});row.append(resetButton(key,label));return row}
function showFields(){let item=current();if(!item)return;if(inspectorSelection!==selected){inspectorSelection=selected;setInspectorTab(item.kind==='text'?'text':'properties')}let v=selectedValue(),box=$('#fields');box.replaceChildren();$('#selectedTitle').textContent=selected==='camera'?'Camera':item.name;box.append(fieldRow('Position','position',v.position),fieldRow('Rotation','rotation',v.rotation));if(selected==='camera'){
  const headingRow=document.createElement('label');
  headingRow.className='scalar';
  headingRow.textContent='Hướng nhìn';
  const heading=document.createElement('select');
  heading.setAttribute('aria-label','Hướng nhìn camera');
  heading.append(new Option('Nhìn theo Target','target'),new Option('Giữ hướng','fixed'));
  heading.value=item.fixedHeading?'fixed':'target';
  heading.onchange=()=>{
    if(heading.value==='fixed'){
      const {position,target}=evaluateEntity(item,time);
      const basis=new THREE.Matrix4().lookAt(new THREE.Vector3(...position),new THREE.Vector3(...target),active.up);
      item.fixedHeading=new THREE.Quaternion().setFromRotationMatrix(basis).toArray();
    }else delete item.fixedHeading;
    applyAtTime();
    showFields();
    scheduleSave();
  };
  headingRow.append(heading);
  box.prepend(headingRow);
  if(!item.fixedHeading)box.append(fieldRow('Target','target',v.target));
}else box.append(fieldRow('Scale','scale',v.scale));const key=selected==='camera'?'fov':'opacity';let row=document.createElement('div');row.className='scalar property-scalar';row.append(propertyToggle(key,key==='fov'?'FOV':'Opacity'));let scalarLabel=document.createElement('span');scalarLabel.textContent=key==='fov'?'FOV (độ)':'Opacity (0–1)';row.append(scalarLabel);let input=document.createElement('input');input.type='number';input.min=key==='fov'?1:0;input.max=key==='fov'?160:1;input.step=key==='fov'?1:.05;input.value=v[key];input.onchange=()=>{mutateValue(v=>v[key]=clamp(Number(input.value),+input.min,+input.max));showFields()};row.append(input,resetButton(key,key==='fov'?'FOV':'Opacity'));box.append(row);if(selected!=='camera'){let colorRow=document.createElement('label');colorRow.className='scalar';colorRow.append(document.createTextNode('Màu thanh timeline'));let color=document.createElement('input');color.type='color';color.title='Đổi màu thanh layer';color.setAttribute('aria-label','Màu thanh timeline');color.value=layerColor(item);color.oninput=()=>{let bar=document.querySelector('.clip-bar[data-layer-id="'+CSS.escape(item.id)+'"]');if(bar)bar.style.setProperty('--clip-color',color.value)};color.onchange=()=>{item.color=color.value;renderTracks();scheduleSave()};colorRow.append(color);box.append(colorRow);if(item.shape)appendShapeFields(box,item,v);appendPopField(box,item)}}
function attach(){needsRender=true;let m=selected==='camera'?cameraHandle:meshes.get(selected);if(m&&m.visible&&!(current()?.locked))gizmo.attach(m);else gizmo.detach()}function select(id){selectedAudio=false;selected=id;selectedKey=null;selectedKeys.clear();selectedClips.clear();renderLayerList();renderTracks();showFields();attach()}
// Use the visible pixel beneath a click, so transparent parts of PNGs do not block layers behind them.
const layerRaycaster=new THREE.Raycaster(),alphaCanvases=new WeakMap();
function opaqueAtIntersection(hit){if(!hit.uv)return true;const image=hit.object.material.map?.image;if(!image)return true;try{let context=alphaCanvases.get(image);if(!context){let canvas=document.createElement('canvas');canvas.width=image.naturalWidth||image.width;canvas.height=image.naturalHeight||image.height;context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);alphaCanvases.set(image,context)}let x=Math.min(context.canvas.width-1,Math.max(0,Math.floor(hit.uv.x*hit.object.material.map.repeat.x*context.canvas.width))),y=Math.min(context.canvas.height-1,Math.max(0,Math.floor((1-hit.uv.y)*context.canvas.height)));return context.getImageData(x,y,1,1).data[3]>10}catch{return true}}
function enableImageSelection(canvas,getCamera,usesGizmo){let click=null;canvas.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;click={id:e.pointerId,x:e.clientX,y:e.clientY,gizmo:usesGizmo&&!!gizmo.axis}});canvas.addEventListener('pointercancel',()=>{click=null});canvas.addEventListener('pointerup',e=>{if(!click||click.id!==e.pointerId)return;let start=click;click=null;if(start.gizmo||gizmo.dragging||Math.hypot(e.clientX-start.x,e.clientY-start.y)>4)return;let rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;let pointer=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);scene.updateMatrixWorld(true);const camera=getCamera();camera.updateMatrixWorld(true);layerRaycaster.setFromCamera(pointer,camera);let candidates=[...meshes.values()].flatMap(mesh=>[mesh,mesh.userData.arrowTip]).filter(mesh=>mesh?.visible);if(usesGizmo)candidates.push(...cameraIconParts);let hits=layerRaycaster.intersectObjects(candidates,false);hits.sort((a,b)=>Math.abs(a.distance-b.distance)>1e-7?a.distance-b.distance:project.layers.findIndex(l=>l.id===a.object.userData.id)-project.layers.findIndex(l=>l.id===b.object.userData.id));let cameraHit=usesGizmo?hits.find(hit=>hit.object.userData.cameraIcon):null;let hit=cameraHit||firstVisibleHit(hits,opaqueAtIntersection);if(hit)selectFromViewport(hit.object.userData.cameraIcon?'camera':hit.object.userData.id)})}
function selectFromViewport(id){if(id!=='camera'){for(const group of project.groups||[])if(group.layerIds?.includes(id))group.collapsed=false}select(id);if(id!=='camera'){selectedClips.add(id);renderTracks();let bar=[...document.querySelectorAll('.timeline .clip-bar')].find(el=>el.dataset.layerId===id);bar?.closest('.track')?.scrollIntoView({block:'nearest',inline:'nearest'})}}
enableImageSelection(renderer.domElement,()=>custom,true);
enableImageSelection(previewRenderer.domElement,()=>project.aspect==='portrait'?portraitCamera:active,false);
for(const view of [renderer,previewRenderer]){
  // Three.js restores its WebGL state. The idle editor still needs a new frame.
  view.domElement.addEventListener('webglcontextrestored',()=>{needsRender=true});
}
function installAltDuplicate(target,rail,getEntries,ownerId){let drag=null;target.addEventListener('pointerdown',e=>{if(!e.altKey||e.button!==0||e.target.closest('.clip-handle'))return;let entries=getEntries();if(!entries.length){message('Layer chưa có keyframe để sao chép');return}e.preventDefault();e.stopPropagation();target.draggable=false;let bounds=entries.map(({entity,key})=>{if(entity===project.camera)return {lo:-key.time,hi:project.duration-key.time};let range=clipBounds(entity,project.duration);return {lo:range.start-key.time,hi:(range.end===project.duration?range.end:range.end-1/30)-key.time}});drag={id:e.pointerId,x:e.clientX,entries,width:rail.getBoundingClientRect().width,delta:0,moved:false,lo:Math.max(...bounds.map(b=>b.lo)),hi:Math.min(...bounds.map(b=>b.hi)),ghosts:[]};for(const [el,key] of keyElements)if(entries.some(v=>v.key===key)){let ghost=el.cloneNode(true);ghost.className='key key-copy-ghost'+(isEasedKey(key)?' eased':'');ghost.removeAttribute('draggable');el.parentElement.append(ghost);drag.ghosts.push({ghost,key})}target.setPointerCapture(e.pointerId)});target.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;e.preventDefault();e.stopPropagation();let dx=e.clientX-drag.x;if(Math.abs(dx)>=4)drag.moved=true;if(!drag.width)return;drag.delta=clamp(dx/drag.width*project.duration,drag.lo,drag.hi);for(const {ghost,key} of drag.ghosts)ghost.style.left=((key.time+drag.delta)/project.duration*100)+'%'});function end(e){if(!drag||drag.id!==e.pointerId)return;e.stopPropagation();e.preventDefault();let d=drag;drag=null;target.draggable=target.classList.contains('key');for(const x of d.ghosts)x.ghost.remove();if(e.type==='pointercancel'||!d.moved)return;let result=duplicatePropertyKeys(d.entries,d.delta,project.duration);if(result.error){message(result.error==='collision'?'Đã có keyframe tại vị trí đó; hãy kéo sang vị trí khác':'Kéo keyframe xa hơn để tạo bản sao');return}selectedKeys.clear();selectedClips.clear();for(const key of result.copies)selectedKeys.add(key);selectedKey=result.copies[result.copies.length-1];if(ownerId)selected=ownerId;time=clamp(selectedKey.time,0,project.duration);renderLayerList();renderTracks();applyAtTime();showFields();attach();scheduleSave();message('Đã nhân '+result.copies.length+' keyframe')}target.addEventListener('pointerup',end);target.addEventListener('pointercancel',end)}
let timelineMagnet=true;
$('#timelineMagnet').onclick=event=>{
  timelineMagnet=!timelineMagnet;
  event.currentTarget.setAttribute('aria-pressed',String(timelineMagnet));
  event.currentTarget.title=timelineMagnet?'Tắt nam châm Timeline':'Bật nam châm Timeline';
};

function magnetDistance(width){
  return timelineMagnet?8*project.duration/width:0;
}

function enableClipMove(bar,layer,rail,isAudio=false){
  let drag=null,suppress=false;
  bar.addEventListener('pointerdown',event=>{
    if(event.button!==0||layer.locked||event.ctrlKey||event.metaKey||event.shiftKey||(!event.altKey&&event.target.closest('.clip-handle')))return;
    const duplicate=event.altKey;
    if(duplicate&&isAudio)return;
    const grouped=isAudio?selectedAudio:selectedClips.has(layer.id);
    const ids=grouped?selectedClips:new Set(isAudio?[]:[layer.id]);
    const layers=project.layers.filter(item=>ids.has(item.id)&&!item.locked);
    if(!duplicate&&project.audio&&(isAudio||grouped&&selectedAudio))layers.push(project.audio);
    const width=rail.getBoundingClientRect().width;
    if(!layers.length||!width)return;
    const clipBars=new Map([...document.querySelectorAll('#tracks .clip-bar')].map(node=>[node.dataset.layerId,node]));
    const entries=layers.map(item=>({
      item,
      bounds:clipBounds(item,project.duration),
      bar:item===project.audio?$('#tracks .audio-bar'):clipBars.get(item.id),
    }));
    const keys=new Set(layers.flatMap(item=>item.keys||[]));
    drag={
      id:event.pointerId,x:event.clientX,y:event.clientY,width,duplicate,entries,delta:0,moved:false,
      placement:clipPlacement(project,layers,duplicate),
      sharedRow:!isAudio&&!duplicate&&laneNeighbors(project,layer).length>0,
      keyNodes:[...keyElements].filter(([,key])=>keys.has(key)),
    };
    bar.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  });
  function getDropRow(event){
    const hit=document.elementFromPoint(event.clientX,event.clientY);
    const row=hit?.closest('.track[data-clip-row]');
    if(row){
      if(row.dataset.clipRow===(layer.laneId||layer.id))return null;
      const target=project.layers.find(item=>item.id===row.dataset.clipOwner);
      return target?{row,target,rail:row.querySelector('.rail')}:null;
    }
    if(!drag.sharedRow||Math.abs(event.clientY-drag.y)<8||!hit?.closest('#timelineCanvas')||hit.closest('.time-ruler'))return null;
    const track=hit.closest('.track');
    if(track&&!track.classList.contains('property-track'))return null;
    const zone=$('#timelineNewRow');
    return {row:zone,rail:zone,newRow:true};
  }
  function markDrop(drag,drop,offset){
    drag.drop?.row.classList.remove('clip-drop-valid','clip-drop-blocked');
    drag.drop=drop;
    if(!drop){
      drag.rowGhost?.remove();
      drag.rowGhost=null;
      return;
    }
    drop.row.classList.add(offset===null?'clip-drop-blocked':'clip-drop-valid');
    if(offset===null){
      drag.rowGhost?.remove();
      drag.rowGhost=null;
      return;
    }
    if(!drag.rowGhost){
      const ghost=bar.cloneNode(false);
      delete ghost.dataset.layerId;
      ghost.classList.add('clip-copy-ghost');
      ghost.setAttribute('aria-hidden','true');
      drag.rowGhost=ghost;
    }
    if(drag.rowGhost.parentElement!==drop.rail)drop.rail.append(drag.rowGhost);
    drag.rowGhost.style.left=(100*(clipBounds(layer,project.duration).start+offset)/project.duration)+'%';
  }
  bar.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const dx=event.clientX-drag.x;
    const canChangeRow=!isAudio&&!drag.duplicate;
    if(!drag.moved&&Math.abs(dx)<4&&(!canChangeRow||Math.abs(event.clientY-drag.y)<4))return;
    if(!drag.moved&&drag.duplicate){
      for(const entry of drag.entries){
        if(!entry.bar)continue;
        const ghost=entry.bar.cloneNode(false);
        delete ghost.dataset.layerId;
        ghost.classList.add('clip-copy-ghost');
        ghost.setAttribute('aria-hidden','true');
        entry.bar.after(ghost);
        entry.ghost=ghost;
      }
    }
    drag.moved=true;
    event.preventDefault();
    const duration=project.duration;
    const requested=Math.round((dx/drag.width*duration)*30)/30;
    const snap=magnetDistance(drag.width);
    const drop=canChangeRow?getDropRow(event):null;
    if(drop){
      const bounds=clipBounds(layer,duration);
      drag.delta=drop.newRow
        ?clamp(requested,-bounds.start,duration-bounds.end)
        :fitClipOnLane(project,layer,drop.target,requested,snap);
      markDrop(drag,drop,drag.delta);
      for(const entry of drag.entries)if(entry.bar)entry.bar.style.left=(100*entry.bounds.start/duration)+'%';
      for(const [node,key] of drag.keyNodes)node.style.left=(100*key.time/duration)+'%';
      return;
    }
    markDrop(drag,null,null);
    drag.delta=fitClipOffset(drag.placement,requested,snap);
    if(drag.delta===null){
      for(const entry of drag.entries)if(entry.ghost)entry.ghost.hidden=true;
      return;
    }
    for(const entry of drag.entries)if(entry.ghost)entry.ghost.hidden=false;
    for(const entry of drag.entries){
      const node=drag.duplicate?entry.ghost:entry.bar;
      if(node)node.style.left=((entry.bounds.start+drag.delta)/duration*100)+'%';
    }
    if(!drag.duplicate){
      for(const [node,key] of drag.keyNodes)node.style.left=((key.time+drag.delta)/duration*100)+'%';
    }
  });
  function finish(event){
    if(!drag||drag.id!==event.pointerId)return;
    const completed=drag;
    drag=null;
    event.stopPropagation();
    if(!completed.moved)return;
    if(event.type!=='pointerup'){
      renderTracks();
      return;
    }
    suppress=true;
    setTimeout(()=>suppress=false,0);
    const items=completed.drop?[layer]:completed.entries.map(entry=>entry.item);
    if(completed.delta===null){
      renderTracks();
      message(completed.drop?.target?.locked?'Hàng đích đang khóa':'Không đủ chỗ trống trên hàng Timeline');
      return;
    }
    if(completed.duplicate){
      const copies=duplicateTimelineClips(project,items.map(item=>item.id),completed.delta,()=>crypto.randomUUID());
      if(!copies.length){
        renderTracks();
        return;
      }
      const grabbed=items.indexOf(layer);
      selected=copies[grabbed].id;
      rebuild();
      selectedClips=new Set(copies.map(copy=>copy.id));
      renderLayerList();
      renderTracks();
      showFields();
      attach();
      scheduleSave();
      message('Đã sao chép '+copies.length+' layer cùng keyframe');
      return;
    }
    const moved=moveClipIntervals(items,completed.delta,project.duration);
    if(!moved&&!completed.drop){
      renderTracks();
      return;
    }
    if(completed.drop?.newRow)detachClipFromLane(project,layer,crypto.randomUUID());
    else if(completed.drop)placeOnLane(project,layer.id,completed.drop.target.id);
    const moving=new Set(items);
    for(const item of items){
      const neighbors=laneNeighbors(project,item,moving);
      const bounds=clipBounds(item,project.duration);
      item.clipStart=exactClipEdge(bounds.start,neighbors,'end');
      item.clipEnd=exactClipEdge(bounds.end,neighbors,'start');
    }
    selectedClips=new Set(items.filter(item=>item!==project.audio).map(item=>item.id));
    selectedAudio=items.includes(project.audio);
    if(!isAudio)selected=layer.id;
    seekAudio();
    selectedKey=null;
    selectedKeys.clear();
    renderLayerList();
    renderTracks();
    applyAtTime();
    showFields();
    attach();
    scheduleSave();
    message(completed.drop?.newRow?'Đã tách clip thành hàng mới':completed.drop?'Đã chuyển clip sang hàng đích':'Đã di chuyển '+items.length+' layer cùng keyframe');
  }
  bar.addEventListener('pointerup',finish);
  bar.addEventListener('pointercancel',finish);
  bar.addEventListener('lostpointercapture',finish);
  bar.addEventListener('click',event=>{
    if(suppress){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
}
function addClipResizeHandle(bar,item,rail,edge,isAudio){let grip=document.createElement('div');grip.className='clip-handle '+edge;grip.setAttribute('role','slider');grip.setAttribute('aria-label',edge==='start'?'Kéo điểm bắt đầu':'Kéo điểm kết thúc các thanh đã chọn');grip.title=edge==='start'?'Kéo điểm bắt đầu':'Kéo điểm kết thúc các thanh đã chọn';let drag=null;grip.addEventListener('pointerdown',e=>{if(e.button!==0||e.altKey||item.locked)return;e.stopPropagation();e.preventDefault();let grouped=isAudio?selectedAudio:selectedClips.has(item.id);let items=grouped?project.layers.filter(l=>selectedClips.has(l.id)&&!l.locked):[item];if(grouped&&selectedAudio&&project.audio)items.push(project.audio);if(!items.includes(item))items.push(item);if(edge==='start')items=[item];let entries=items.map(x=>{let b=clipBounds(x,project.duration);const neighbors=laneNeighbors(project,x);const next=Math.min(project.duration,...neighbors.filter(n=>n.start>=b.end-1e-8).map(n=>n.start));const previous=Math.max(0,...neighbors.filter(n=>n.end<=b.start+1e-8).map(n=>n.end));return {item:x,start:b.start,end:b.end,previous,next,neighbors,maxEnd:x===project.audio?Math.min(project.duration,b.start+(Number(x.duration)||project.duration)):next}});drag={id:e.pointerId,x:e.clientX,width:rail.getBoundingClientRect().width,entries};grip.setPointerCapture(e.pointerId);history.begin()});grip.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id||!drag.width)return;e.stopPropagation();let delta=Math.round((e.clientX-drag.x)/drag.width*project.duration*30)/30;if(edge==='end'){const stop=Math.min(...drag.entries.map(x=>x.maxEnd-x.end));if(Math.abs(stop-delta)<=magnetDistance(drag.width))delta=stop;resizeClipEnds(drag.entries,delta,project.duration);for(const x of drag.entries)x.item.clipEnd=exactClipEdge(x.item.clipEnd,x.neighbors,'start')}else{let x=drag.entries[0];if(Math.abs(x.start+delta-x.previous)<=magnetDistance(drag.width))delta=x.previous-x.start;x.item.clipStart=exactClipEdge(clamp(x.start+delta,x.previous,Math.max(x.previous,x.end-1/30)),x.neighbors,'end')}for(const x of drag.entries){let el=x.item===project.audio?document.querySelector('.audio-bar'):[...document.querySelectorAll('.clip-bar')].find(n=>n.dataset.layerId===x.item.id);if(el){let b=clipBounds(x.item,project.duration);el.style.left=(100*b.start/project.duration)+'%';el.style.width=(100*(b.end-b.start)/project.duration)+'%'}}applyAtTime();scheduleSave()});function finish(e){if(!drag||e.pointerId!==drag.id)return;e.stopPropagation();if(e.type==='pointercancel'){for(const x of drag.entries){x.item.clipStart=x.start;x.item.clipEnd=x.end}applyAtTime();scheduleSave()}drag=null;history.end();renderTracks()}grip.addEventListener('pointerup',finish);grip.addEventListener('pointercancel',finish);grip.addEventListener('click',e=>e.stopPropagation());bar.append(grip)}
function makeClipBar(layer,rail){let bar=document.createElement('div');bar.className='clip-bar';bar.dataset.layerId=layer.id;const caption=document.createElement('span');caption.className='clip-caption';caption.textContent=layer.name;bar.append(caption);enableClipMove(bar,layer,rail);bar.classList.toggle('selected-clip',selectedClips.has(layer.id));bar.addEventListener('click',e=>{e.stopPropagation();if(e.altKey)return;if(!(e.ctrlKey||e.metaKey||e.shiftKey)){selectedAudio=false;selectedKeys.clear();selectedClips.clear()}if(selectedClips.has(layer.id)&&(e.ctrlKey||e.metaKey||e.shiftKey))selectedClips.delete(layer.id);else selectedClips.add(layer.id);selected=layer.id;selectedKey=null;renderLayerList();renderTracks();showFields();attach()});bar.style.setProperty('--clip-color',layerColor(layer));function position(){const {start,end}=clipBounds(layer,project.duration);bar.style.left=(start/project.duration*100)+'%';bar.style.width=((end-start)/project.duration*100)+'%';bar.title=layer.name+' · '+start.toFixed(2)+'s đến '+end.toFixed(2)+'s · Kéo để di chuyển hoặc chuyển hàng · Alt+kéo để sao chép clip'}position();for(const edge of ['start','end'])addClipResizeHandle(bar,layer,rail,edge,false);return bar}
function makeGroupRow(group){let row=document.createElement('div');row.className='track group-track';let name=document.createElement('span');name.className='track-name';let toggle=document.createElement('button');toggle.className='group-toggle';toggle.textContent=group.collapsed?'▸':'▾';toggle.title=group.collapsed?'Mở nhóm':'Thu gọn nhóm';toggle.onclick=()=>{group.collapsed=!group.collapsed;renderTracks();scheduleSave()};let title=document.createElement('span');title.className='track-label';title.textContent='▣ '+group.name;title.title='Chọn các layer trong nhóm';title.onclick=e=>{selectedKeys.clear();if(!(e.ctrlKey||e.metaKey||e.shiftKey))selectedClips.clear();let members=group.layerIds.filter(id=>project.layers.some(l=>l.id===id)),remove=(e.ctrlKey||e.metaKey)&&members.every(id=>selectedClips.has(id));for(const id of members)if(remove)selectedClips.delete(id);else selectedClips.add(id);selected=[...selectedClips][0]||'camera';renderLayerList();renderTracks();showFields();attach();message('Đã chọn '+selectedClips.size+' layer trong '+group.name)};let ungroup=document.createElement('button');ungroup.className='ungroup';ungroup.textContent='×';ungroup.title='Tách nhóm';ungroup.setAttribute('aria-label','Tách '+group.name);ungroup.onclick=()=>{ungroupLayers(project,group.id);renderTracks();scheduleSave();message('Đã tách nhóm; Ctrl+Z để hoàn tác')};name.append(toggle,title,ungroup);row.append(name,createTrackRail());return row}
$('#groupLayersButton').onclick=()=>groupSelection();
let tracksCollapsed=false;$('#collapseTracks').onclick=()=>{tracksCollapsed=!tracksCollapsed;for(const g of project.groups||[])g.collapsed=tracksCollapsed;for(const l of [project.camera,...project.layers])l.effectsCollapsed=tracksCollapsed;$('#collapseTracks').textContent=tracksCollapsed?'Mở nhóm':'Thu gọn';renderTracks();scheduleSave()};
const transitionMime='application/x-vox-transition';
function joinPair(ids){
  const clips=ids?.map(id=>project.layers.find(layer=>layer.id===id));
  if(clips?.length!==2||clips.some(layer=>!layer))return null;
  for(const pair of [clips,[clips[1],clips[0]]]){
    if(clipJoin(...pair,project.duration)!==null)return pair;
  }
  return null;
}
$('#imageStripMode').onchange=()=>{
  const mode=$('#imageStripMode').value;
  $('#imageStripTilesField').hidden=mode!=='extend';
  $('#imageStripEdgeField').hidden=mode==='blend';
  $('#imageStripOverlapField').hidden=mode==='extend';
  $('#imageStripOffsetField').hidden=mode==='extend';
};
$('#makeImageStrip').onclick=async()=>{
  const button=$('#makeImageStrip'),status=$('#imageStripStatus');
  const mode=$('#imageStripMode').value;
  const ids=selectedClips.size?[...selectedClips]:[selected];
  const sources=ids.map(id=>project.layers.find(layer=>layer.id===id));
  if(sources.length!==(mode==='extend'?1:2)||sources.some(layer=>!layer?.src||layer.kind==='text')){
    status.textContent=mode==='extend'?'Chọn một layer ảnh.':'Chọn hai layer ảnh theo thứ tự trái → phải.';
    return;
  }
  const origin=project,sceneId=project.activeSceneId,startTime=time;
  const first=sources[0],value=evaluateEntity(first,startTime);
  const sourceUrls=sources.map(layer=>layer.src);
  button.disabled=true;
  try{
    const images=await Promise.all(sourceUrls.map(async src=>{
      const image=new Image();
      image.src=src;
      await image.decode();
      return image;
    }));
    if(project!==origin||project.activeSceneId!==sceneId||sources.some((layer,i)=>!project.layers.includes(layer)||layer.src!==sourceUrls[i])){
      throw Error('Cảnh hoặc ảnh nguồn đã thay đổi. Hãy chọn lại ảnh.');
    }
    const number=id=>Math.round(Number($(id).value)||0);
    const {canvas,top}=createImageStrip(images[0],images[1],{
      mode,tiles:clamp(number('#imageStripTiles'),1,8),edgePercent:clamp(number('#imageStripEdge'),1,100),
      overlap:Math.max(0,number('#imageStripOverlap')),
      offset:number('#imageStripOffset'),maxSize:Math.min(renderer.capabilities.maxTextureSize,previewRenderer.capabilities.maxTextureSize),
    });
    const src=canvas.toDataURL('image/png');
    if(src==='data:,')throw Error('Không lưu được ảnh ghép.');
    const firstWidth=images[0].naturalWidth,firstHeight=images[0].naturalHeight;
    const shift=new THREE.Vector3(
      (canvas.width-firstWidth)*2/firstHeight*value.scale[0],
      -(top+(canvas.height-firstHeight)/2)*4/firstHeight*value.scale[1],0,
    ).applyEuler(new THREE.Euler(...value.rotation.map(THREE.MathUtils.degToRad)));
    value.position=new THREE.Vector3(...value.position).add(shift).toArray();
    value.scale=value.scale.map((scale,i)=>i<2?scale*canvas.height/firstHeight:scale);
    const layer={id:crypto.randomUUID(),name:first.name+' · '+(images.length===1?'Mở rộng':'Ảnh ghép'),src,value,keys:[]};
    const bounds=sources.map(item=>clipBounds(item,project.duration));
    layer.clipStart=Math.min(...bounds.map(item=>item.start));
    layer.clipEnd=Math.max(...bounds.map(item=>item.end));
    project.layers.unshift(layer);
    selected=layer.id;
    time=clamp(startTime,layer.clipStart,Math.max(layer.clipStart,layer.clipEnd-1/30));
    seekAudio();
    const ready=rebuild();
    setInspectorTab('effects');
    scheduleSave();
    await ready;
    const mesh=meshes.get(layer.id);
    if(mesh&&project===origin&&project.activeSceneId===sceneId){
      const box=new THREE.Box3().setFromObject(mesh);
      const center=box.getCenter(new THREE.Vector3()),sphere=box.getBoundingSphere(new THREE.Sphere());
      const angle=Math.atan(Math.tan(THREE.MathUtils.degToRad(custom.fov/2))*Math.min(1,custom.aspect));
      const distance=Math.max(1,sphere.radius/Math.sin(angle)*1.1);
      const direction=custom.position.clone().sub(orbit.target).normalize();
      orbit.target.copy(center);
      custom.position.copy(center).addScaledVector(direction,distance);
      orbit.update();
      needsRender=true;
    }
    if(project===origin&&project.activeSceneId===sceneId)status.textContent='Đã tạo ảnh '+canvas.width+' × '+canvas.height+' px.';
  }catch(error){
    status.textContent=error.message||'Không tạo được dải ảnh.';
  }finally{
    button.disabled=false;
  }
};

function transitionHint(text){
  $('#transitionHint').textContent=text;
}
function clearPairTransitions(pair){
  const ids=new Set(pair.map(layer=>layer.id));
  for(const layer of project.layers){
    if(ids.has(layer.id)||ids.has(layer.transition?.partner))delete layer.transition;
  }
}
function seekTransitionStart(transition){
  time=Math.max(0,transition.start-0.15);
  seekAudio();
  applyAtTime();
}
function applyJoinCard(type,ids,curve=$('#ease').value){
  const pair=joinPair(ids);
  if(!pair||pair.some(layer=>layer.locked)){
    transitionHint('Chọn hai clip đặt sát nhau và đã mở khóa.');
    return;
  }
  const duration=$('#transitionDuration');
  try{
    const draft=pair.map(layer=>({...layer}));
    const actual=createJoinTransition(...draft,Number(duration.value),type,project.duration,curve);
    clearPairTransitions(pair);
    for(let i=0;i<pair.length;i++)pair[i].transition=draft[i].transition;
    duration.value=Number(actual.toFixed(3));
    seekTransitionStart(pair[0].transition);
    renderTracks();
    scheduleSave();
    transitionHint('Đã thêm '+transitionOptions.find(([id])=>id===type)[1]+'. Bấm Phát trên Timeline.');
  }catch(error){transitionHint(error.message)}
}
function currentJoin(){
  return selectedClips.size===2?[...selectedClips]:null;
}
for(const card of document.querySelectorAll('.transition-cards button')){
  card.ondragstart=event=>{
    event.dataTransfer.setData(transitionMime,card.dataset.transition);
    event.dataTransfer.effectAllowed='copy';
    document.body.classList.add('dragging-transition');
  };
  card.ondragend=()=>document.body.classList.remove('dragging-transition');
  card.onclick=()=>applyJoinCard(card.dataset.transition,currentJoin());
}
$('#removeTransition').onclick=()=>{
  const pair=joinPair(currentJoin());
  const clip=project.layers.find(layer=>layer.id===selected);
  if(!pair&&!clip)return;
  clearPairTransitions(pair||[clip]);
  applyAtTime();
  renderTracks();
  scheduleSave();
  transitionHint('Đã gỡ chuyển cảnh.');
};
$('#transitionDuration').onchange=()=>{
  const pair=joinPair(currentJoin());
  if(pair?.[0].transition?.partner===pair[1].id)applyJoinCard(pair[0].transition.type,pair.map(layer=>layer.id),pair[0].transition.easing??null);
};
function appendTransitionJoins(laneRails){
  const clipsByLane=new Map();
  for(const clip of project.layers){
    const lane=clip.laneId||clip.id;
    if(!laneRails.has(lane))continue;
    if(!clipsByLane.has(lane))clipsByLane.set(lane,[]);
    clipsByLane.get(lane).push(clip);
  }
  for(const [lane,clips] of clipsByLane){
    const rail=laneRails.get(lane);
    clips.sort((a,b)=>clipBounds(a,project.duration).start-clipBounds(b,project.duration).start);
    for(let i=1;i<clips.length;i++){
      const outgoing=clips[i-1],incoming=clips[i];
      const cut=clipJoin(outgoing,incoming,project.duration);
      if(cut===null)continue;
      const ids=[outgoing.id,incoming.id];
      const edge=outgoing.transition;
      const applied=edge?.atJoin&&edge.partner===incoming.id&&Math.abs(cut-(edge.start+edge.end)/2)<1e-7;
      const button=document.createElement('button');
      button.type='button';
      button.className='transition-join'+(applied?' applied':'');
      button.textContent='◇';
      button.title=applied?'Chỉnh chuyển cảnh':'Chọn mép nối để thêm chuyển cảnh';
      button.setAttribute('aria-label',button.title);
      button.style.left=(100*cut/project.duration)+'%';
      button.onclick=event=>{
        event.stopPropagation();
        selectedKey=null;
        selectedKeys.clear();
        selectedClips=new Set(ids);
        if(applied){
          $('#ease').value=edge.easing||'easeInOut';
          $('#transitionDuration').value=Number((edge.end-edge.start).toFixed(3));
          seekTransitionStart(edge);
        }
        setInspectorTab('effects');
        transitionHint(applied?'Bấm Phát trên Timeline hoặc chọn thẻ khác để đổi kiểu.':'Bấm thẻ để dùng tại mép nối đã chọn.');
      };
      button.ondragover=event=>{
        if(!event.dataTransfer.types.includes(transitionMime)||outgoing.locked||incoming.locked)return;
        event.preventDefault();
        event.dataTransfer.dropEffect='copy';
      };
      button.ondrop=event=>{
        const type=event.dataTransfer.getData(transitionMime);
        if(!type)return;
        event.preventDefault();
        event.stopPropagation();
        document.body.classList.remove('dragging-transition');
        selectedKey=null;
        selectedKeys.clear();
        selectedClips=new Set(ids);
        applyJoinCard(type,ids);
      };
      rail.append(button);
    }
  }
}
function groupSelection(){let ids=[...selectedClips];if(ids.length<2){message('Giữ Ctrl và bấm chọn ít nhất hai layer để tạo nhóm');return}let group=groupLayers(project,ids,crypto.randomUUID());if(!group)return;renderLayerList();renderTracks();scheduleSave();message('Đã tạo '+group.name+' · bấm tên nhóm để chọn các layer')}
function renderTracks(){const newRow=$('#timelineNewRow');newRow.replaceChildren();newRow.classList.remove('clip-drop-valid','clip-drop-blocked');let root=$('#tracks');root.replaceChildren();keyElements.clear();let laneRails=new Map(),rows=[['camera',project.camera]],grouped=new Set();for(const group of project.groups||[]){let members=(group.layerIds||[]).map(id=>project.layers.find(l=>l.id===id)).filter(Boolean);if(!members.length)continue;rows.push(['group:'+group.id,group]);for(const l of members)grouped.add(l.id);if(!group.collapsed)for(const l of members)rows.push([l.id,l])}for(const l of project.layers)if(!grouped.has(l.id))rows.push([l.id,l]);for(const [id,item] of rows){if(id.startsWith('group:')){root.append(makeGroupRow(item));continue}normalizeEntity(item);let main=document.createElement('div');let selectedLane=id!=='camera'&&project.layers.some(l=>(l.laneId||l.id)===(item.laneId||item.id)&&selectedClips.has(l.id));main.className='track'+(selectedLane?' multi-selected':'');let name=document.createElement('span');name.className='track-name';if(id!=='camera'){let members=project.layers.filter(l=>(l.laneId||l.id)===(item.laneId||item.id));let eye=eyeButton(item);eye.onclick=e=>{e.stopPropagation();let visible=members.some(l=>l.visible!==false);for(const l of members)l.visible=!visible;applyAtTime();renderLayerList();renderTracks();attach();scheduleSave()};name.append(eye);let lock=document.createElement('button');lock.type='button';lock.className='track-lock';lock.textContent=item.locked?'🔒':'🔓';lock.title=item.locked?'Mở khóa hàng':'Khóa hàng';lock.setAttribute('aria-label',lock.title);lock.onclick=e=>{e.stopPropagation();let value=!members.every(l=>l.locked);for(const l of members)l.locked=value;attach();renderTracks();scheduleSave()};name.append(lock)}else{let icon=document.createElement('span');icon.className='camera-icon';icon.textContent='◉';name.append(icon)}let expand=document.createElement('button');expand.className='effect-toggle';expand.textContent=item.effectsCollapsed?'▸':'▾';expand.title=item.effectsCollapsed?'Hiện thông số':'Ẩn thông số';expand.setAttribute('aria-label',expand.title+' '+(id==='camera'?'Camera':item.name));expand.setAttribute('aria-expanded',String(!item.effectsCollapsed));expand.onclick=()=>{item.effectsCollapsed=!item.effectsCollapsed;renderTracks();scheduleSave()};name.append(expand);if(id!=='camera'){let grip=document.createElement('span');grip.className='reorder-grip';grip.textContent='⋮⋮';grip.title='Kéo để đổi thứ tự; giữ Shift khi thả vào hàng khác để ghép';grip.draggable=true;grip.ondragstart=e=>{if(item.locked){e.preventDefault();return}e.dataTransfer.setData('application/x-xuong-layer',id);e.dataTransfer.effectAllowed='move'};main.ondragover=e=>{if([...e.dataTransfer.types].includes('application/x-xuong-layer')){e.preventDefault();e.dataTransfer.dropEffect='move'}};main.ondrop=e=>{let source=e.dataTransfer.getData('application/x-xuong-layer');if(!source)return;e.preventDefault();try{let after=e.clientY>main.getBoundingClientRect().top+main.getBoundingClientRect().height/2;let changed=e.shiftKey?placeOnLane(project,source,id):reorderLayer(project,source,id,after);if(changed){renderLayerList();renderTracks();needsRender=true;scheduleSave()}}catch(err){alert('Không thể ghép hàng: '+err.message)}};name.append(grip)}let label=document.createElement('span');label.className='track-label'+(id==='camera'?'':' object-track-label');label.textContent=id==='camera'?'Camera':item.name;label.dataset.layerId=id;label.title=id==='camera'?'Camera':'Nhấn đúp để đổi tên';label.onclick=e=>id==='camera'?select(id):layerNameClick(id,'timeline',e);name.append(label);if(id!=='camera'){let hold=document.createElement('button');hold.type='button';hold.className='hold-key-button';hold.textContent='◆';hold.title='Giữ giá trị key trước tại thời điểm hiện tại';hold.setAttribute('aria-label',hold.title+' · '+item.name);hold.onclick=e=>{e.stopPropagation();if(item.locked)return;let bounds=clipBounds(item,project.duration);if(time<bounds.start||time>=bounds.end&&bounds.end<project.duration){alert('Đặt vạch thời gian trong khoảng hiển thị của layer.');return}let keys=holdPreviousKeys(item,time,$('#ease').value);if(!keys.length){alert('Không có key trước đó để giữ, hoặc thời điểm này đã có key.');return}selected=id;selectedAudio=false;selectedClips.clear();selectedKeys=new Set(keys);selectedKey=keys.at(-1);$('#keyTime').value=time.toFixed(2);renderLayerList();renderTracks();applyAtTime();showFields();attach();scheduleSave()};name.append(hold)}main.append(name);let lane=id==='camera'?'camera':(item.laneId||id),existing=laneRails.get(lane),rail=existing||createTrackRail();if(id!=='camera'){rail.append(makeClipBar(item,rail));if(item.transition&&!item.transition.atJoin){let mark=document.createElement('span');mark.className='transition-marker';mark.textContent='◇';mark.title=(transitionOptions.find(([type])=>type===item.transition.type)?.[1]||'Trượt trái')+' · '+item.transition.start.toFixed(2)+'–'+item.transition.end.toFixed(2)+'s';mark.style.left=(100*(item.transition.start+item.transition.end)/2/project.duration)+'%';rail.append(mark)}}if(!existing){if(id!=='camera'){main.dataset.clipRow=lane;main.dataset.clipOwner=id}laneRails.set(lane,rail);main.append(rail);root.append(main)}
if(!item.effectsCollapsed)for(const prop of Object.keys(item.value)){let keys=item.keys.filter(k=>k.property===prop);if(!keys.length&&!item.animated[prop])continue;let row=document.createElement('div');row.className='track property-track';let name=document.createElement('span');name.className='track-name property-track-name';name.textContent='↳ '+({position:'Position',rotation:'Rotation',target:'Target',fov:'FOV',scale:'Scale',opacity:'Opacity',length:'Chiều dài'}[prop]||prop)+(item.animated[prop]?'':' (tắt)');name.onclick=()=>select(id);row.append(name);let rail=createTrackRail();for(const key of keys){if(id!=='camera'){let bounds=clipBounds(item,project.duration);if(key.time<bounds.start||key.time>=bounds.end&&bounds.end<project.duration)continue}let b=document.createElement('button');keyElements.set(b,key);installAltDuplicate(b,rail,()=>{let chosen=selectedKeys.has(key)?[...selectedKeys]:[key];return chosen.map(k=>({entity:[project.camera,...project.layers].find(e=>e.keys.includes(k)),key:k})).filter(x=>x.entity&&!x.entity.locked)},id);b.className='key'+(selectedKeys.has(key)||selectedKey===key?' selected':'')+(isEasedKey(key)?' eased':'');b.textContent=isEasedKey(key)?'':'◆';b.setAttribute('aria-label',prop+' '+key.time.toFixed(2)+'s '+(key.easing||'linear'));b.style.left=(key.time/project.duration*100)+'%';b.title=prop+' · '+key.time.toFixed(2)+'s · '+(key.easing||'linear');b.onclick=e=>{e.stopPropagation();if(e.altKey)return;if(!(e.ctrlKey||e.metaKey||e.shiftKey)){selectedKeys.clear();selectedClips.clear()}if(selectedKeys.has(key)&&(e.ctrlKey||e.metaKey||e.shiftKey)){selectedKeys.delete(key);selectedKey=null}else{selectedKeys.add(key);selectedKey=key}selected=id;time=key.time;seekAudio();$('#keyTime').value=key.time.toFixed(2);$('#ease').value=key.easing;renderLayerList();renderTracks();applyAtTime();showFields();attach()};b.draggable=true;b.ondragend=e=>{if(!e.clientX)return;let desired=clamp((e.clientX-rail.getBoundingClientRect().left)/rail.clientWidth*project.duration,0,project.duration);let group=selectedKeys.has(key)?[...selectedKeys]:[key];let delta=clamp(desired-key.time,-Math.min(...group.map(k=>k.time)),project.duration-Math.max(...group.map(k=>k.time)));for(const k of group)k.time+=delta;time=key.time;renderTracks();applyAtTime();scheduleSave()};rail.append(b)}row.append(rail);root.append(row)}}if(project.audio){let row=document.createElement('div');row.className='track audio-track';let name=document.createElement('span');name.className='track-name audio-name';name.textContent='♫ '+project.audio.name;name.title=project.audio.name;row.append(name);let rail=createTrackRail(),bar=document.createElement('div');bar.className='audio-bar'+(selectedAudio?' audio-selected':'');bar.textContent='♫ Âm thanh';let audioBounds=clipBounds(project.audio,project.duration);bar.style.left=(100*audioBounds.start/project.duration)+'%';bar.style.width=(100*(audioBounds.end-audioBounds.start)/project.duration)+'%';enableClipMove(bar,project.audio,rail,true);addClipResizeHandle(bar,project.audio,rail,'end',true);bar.title='Chọn âm thanh, đặt vạch thời gian và nhấn C để cắt';bar.onclick=e=>{e.stopPropagation();if(e.ctrlKey||e.metaKey||e.shiftKey)selectedAudio=!selectedAudio;else{selectedAudio=true;selectedClips.clear();selectedKeys.clear();selectedKey=null}renderTracks()};name.onclick=bar.onclick;rail.append(bar);row.append(rail);root.append(row)}appendTransitionJoins(laneRails)}
function createTrackRail(){let rail=document.createElement('div');rail.className='rail';rail.onclick=e=>{time=clamp((e.clientX-rail.getBoundingClientRect().left)/rail.clientWidth*project.duration,0,project.duration);seekAudio();applyAtTime();showFields()};return rail}

function deleteTimelineSelection(keysOnly=false){let keys=new Set(selectedKeys);if(selectedKey)keys.add(selectedKey);let clipIds=keysOnly?new Set():new Set(selectedClips);if(!keysOnly&&!keys.size&&!clipIds.size&&selected!=='camera'&&project.layers.some(l=>l.id===selected))clipIds.add(selected);for(const id of [...clipIds])if(project.layers.find(l=>l.id===id)?.locked)clipIds.delete(id);for(const key of [...keys])if(project.layers.some(l=>l.locked&&l.keys?.includes(key)))keys.delete(key);if(!keys.size&&!clipIds.size){message('Chọn layer hoặc keyframe chưa khóa');return}project.camera.keys=project.camera.keys.filter(k=>!keys.has(k));for(const layer of project.layers)layer.keys=layer.keys.filter(k=>!keys.has(k));if(clipIds.size){project.layers=project.layers.filter(l=>!clipIds.has(l.id));removeMissingGroupMembers(project)}selectedKey=null;selectedKeys.clear();selectedClips.clear();if(selected!=='camera'&&!project.layers.some(l=>l.id===selected))selected='camera';if(clipIds.size)rebuild();else{renderTracks();applyAtTime();showFields()}scheduleSave();message('Đã xóa; Ctrl+Z để hoàn tác')}
function trimSelectedClips(){if(selectedAudio){alert('Tách âm thanh chưa được hỗ trợ; âm thanh chưa bị thay đổi.');return}let ids=selectedClips.size?[...selectedClips]:(selected==='camera'?[]:[selected]);let result=splitSelectedLayers(project,ids,time,()=>crypto.randomUUID());if(!result.length){alert('Chọn layer chưa khóa và đặt vạch thời gian bên trong đoạn cần tách.');return}selected=result[1];rebuild().then(()=>{selectedClips.clear();selectedClips.add(selected);renderTracks();showFields();attach()});scheduleSave()}
function trimTimelineToPlayhead(){if(time<1/30||time>=project.duration)return;project.duration=time;playing=false;audioElement.pause();$('#play').textContent='▶ Phát';$('#duration').value=Number(project.duration.toFixed(3));$('#time').max=project.duration;renderTicks();renderTracks();seekAudio();applyAtTime();scheduleSave()}
// Selection starts only on empty timeline space and remains within the track area.
let selectionDrag=null,suppressRailClick=false;const trackRoot=$('#tracks');
trackRoot.addEventListener('pointerdown',e=>{if(!e.target.closest('.audio-bar,.audio-name,.clip-bar')&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey)selectedAudio=false;if(e.button!==0||!e.target.closest('.rail')||e.target.closest('.key,.clip-handle,.clip-bar'))return;selectionDrag={id:e.pointerId,x:e.clientX,y:e.clientY,add:e.ctrlKey||e.metaKey||e.shiftKey,active:false}});
trackRoot.addEventListener('pointermove',e=>{if(!selectionDrag||e.pointerId!==selectionDrag.id)return;const d=selectionDrag;if(!d.active&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<5)return;if(!d.active){d.active=true;trackRoot.setPointerCapture(e.pointerId);d.box=document.createElement('div');d.box.className='selection-box';trackRoot.append(d.box)}const rect=trackRoot.getBoundingClientRect();let x=Math.max(rect.left,Math.min(rect.right,e.clientX)),y=Math.max(rect.top,Math.min(rect.bottom,e.clientY)),left=Math.max(rect.left,Math.min(d.x,x)),top=Math.max(rect.top,Math.min(d.y,y));Object.assign(d.box.style,{left:(left-rect.left)+'px',top:(top-rect.top)+'px',width:Math.abs(x-d.x)+'px',height:Math.abs(y-d.y)+'px'})});
function endSelection(e){if(!selectionDrag||e.pointerId!==selectionDrag.id)return;let d=selectionDrag;selectionDrag=null;if(!d.active)return;let r=d.box.getBoundingClientRect();d.box.remove();if(e.type==='pointercancel')return;if(!d.add){selectedKeys.clear();selectedClips.clear();selectedAudio=false}const intersects=el=>{let b=el.getBoundingClientRect();return b.right>=r.left&&b.left<=r.right&&b.bottom>=r.top&&b.top<=r.bottom};for(const [el,key] of keyElements)if(intersects(el))selectedKeys.add(key);for(const bar of trackRoot.querySelectorAll('.clip-bar'))if(intersects(bar))selectedClips.add(bar.dataset.layerId);let audioBar=trackRoot.querySelector('.audio-bar');if(audioBar&&intersects(audioBar))selectedAudio=true;selectedKey=selectedKeys.size?[...selectedKeys][0]:null;suppressRailClick=true;setTimeout(()=>suppressRailClick=false,0);renderTracks();message('Đã chọn '+selectedKeys.size+' keyframe, '+selectedClips.size+' thanh')}
trackRoot.addEventListener('pointerup',endSelection);trackRoot.addEventListener('pointercancel',endSelection);trackRoot.addEventListener('click',e=>{if(suppressRailClick){e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||busy)return;let target=e.target;if(target instanceof HTMLElement&&(target.isContentEditable||/^(TEXTAREA|SELECT)$/.test(target.tagName)||(target.tagName==='INPUT'&&target.type!=='range')))return;let k=e.key.toLowerCase();if(k==='t'){e.preventDefault();setInspectorTab('text');if(current()?.kind==='text')$('#textContent')?.focus()}else if(k==='c'){e.preventDefault();trimSelectedClips()}else if(k==='x'){e.preventDefault();trimTimelineToPlayhead()}else if(k==='d'){e.preventDefault();deleteTimelineSelection()}});
$('#addKey').onclick=()=>{let item=current();if(item?.locked)return;let value=selectedValue(),props=Object.keys(value).filter(p=>item.animated[p]);if(!props.length){message('Bật nút ◷ ở đầu dòng thông số cần tạo keyframe');return}selectedKeys.clear();selectedClips.clear();for(const prop of props){selectedKey=putPropertyKey(item,prop,time,value[prop],$('#ease').value);selectedKeys.add(selectedKey)}$('#keyTime').value=time.toFixed(2);renderTracks();scheduleSave()};$('#deleteKey').onclick=()=>deleteTimelineSelection(true);$('#moveKey').onclick=()=>{if(!selectedKey||project.layers.some(l=>l.locked&&l.keys?.includes(selectedKey)))return;selectedKey.time=clamp(Number($('#keyTime').value),0,project.duration);time=selectedKey.time;seekAudio();renderTracks();applyAtTime();scheduleSave()};$('#ease').onchange=()=>{let keys=selectedKeys.size?[...selectedKeys]:selectedKey?[selectedKey]:[];if(!keys.length){
  const pair=joinPair(currentJoin());
  const edge=pair?.[0].transition;
  if(!edge?.atJoin||edge.partner!==pair[1].id||pair.some(layer=>layer.locked))return;
  for(const layer of pair)layer.transition.easing=$('#ease').value;
  applyAtTime();
  scheduleSave();
  return;
}for(const key of keys)key.easing=$('#ease').value;renderTracks();applyAtTime();scheduleSave()};$('#time').oninput=e=>{time=Number(e.target.value);seekAudio();applyAtTime();showFields()};function renderTicks(){let box=$('#ticks');box.replaceChildren();for(let i=0;i<=10;i++){let mark=document.createElement('span');mark.textContent=Number((project.duration*i/10).toFixed(1))+'s';mark.style.left=(i*10)+'%';box.append(mark)}}
$('#duration').onchange=e=>{project.duration=clamp(Number(e.target.value)||10,1,Math.max(60,project.duration));e.target.value=project.duration;$('#time').max=project.duration;time=Math.min(time,project.duration);renderTicks();renderTracks();applyAtTime();scheduleSave()};
$('#copyProperties').onclick=()=>{let item=current();if(!item)return;propertyClipboard={type:selected==='camera'?'camera':'layer',value:structuredClone(selectedValue()),color:selected==='camera'?null:(item.color||'#888888')};message('Đã sao chép toàn bộ thông số')};
$('#pasteProperties').onclick=()=>{if(!propertyClipboard){message('Hãy sao chép thông số trước');return}let kind=selected==='camera'?'camera':'layer';if(propertyClipboard.type!==kind){message('Chỉ dán thông số ảnh sang ảnh hoặc camera sang camera');return}let item=current();if(kind==='layer')item.color=propertyClipboard.color;mutateValue(v=>Object.assign(v,structuredClone(propertyClipboard.value)));showFields();message('Đã dán toàn bộ thông số')};
$('#camera').onclick=()=>select('camera');$('#cameraKey').onclick=()=>{select('camera');$('#addKey').click()};
function restoreHistory(next){if(!next)return;playing=false;audioElement.pause();$('#play').textContent='▶ Phát';clearTimeout(saveTimer);project=next;selectedKey=null;selectedKeys.clear();selectedClips.clear();if(selected!=='camera'&&!project.layers.some(l=>l.id===selected))selected='camera';time=Math.min(time,project.duration);$('#duration').value=project.duration;$('#time').max=project.duration;renderTicks();rebuild();saveDB().then(()=>message('Đã lưu trên trình duyệt')).catch(e=>message('Lưu thất bại: '+e.message))}
function copyLayer(cut=false){let layer=project.layers.find(l=>l.id===selected);if(!layer){message('Chọn một layer ảnh trước');return}layerClipboard=structuredClone(layer);if(cut){project.layers=project.layers.filter(l=>l.id!==selected);removeMissingGroupMembers(project);selected='camera';selectedKey=null;rebuild();scheduleSave();message('Đã cắt layer')}else message('Đã sao chép layer')}
function pasteLayer(){if(!layerClipboard){message('Chưa có layer được sao chép');return}let layer=structuredClone(layerClipboard);layer.id=crypto.randomUUID();layer.name=layer.name.replace(/( \(bản sao\))?$/, ' (bản sao)');project.layers.push(layer);selected=layer.id;selectedKey=null;rebuild();scheduleSave();message('Đã dán layer')}
document.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey||busy)return;let target=e.target;if(target instanceof HTMLElement&&(target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))return;let k=e.key.toLowerCase();if(k==='z'){e.preventDefault();restoreHistory(e.shiftKey?history.redo():history.undo())}else if(k==='y'){e.preventDefault();restoreHistory(history.redo())}else if(k==='c'){e.preventDefault();copyLayer(false)}else if(k==='x'){e.preventDefault();copyLayer(true)}else if(k==='v'){e.preventDefault();pasteLayer()}else if(k==='g'){e.preventDefault();groupSelection()}});
async function activateProject(next){playing=false;audioElement.pause();$('#play').textContent='▶ Phát';project=next;project.projectId=project.projectId||crypto.randomUUID();ensureScenes(project,()=>crypto.randomUUID());normalizeEntity(project.camera);for(const layer of project.layers)normalizeEntity(layer);selected='camera';time=0;history=new ProjectHistory(project);$('#duration').value=project.duration;$('#time').max=project.duration;renderTicks();await rebuild();await saveDB()}
function closeProjectMenu(){$('#projectMenu').hidden=true;$('#projectList').setAttribute('aria-expanded','false')}
$('#projectList').onclick=()=>{let menu=$('#projectMenu');menu.hidden=!menu.hidden;$('#projectList').setAttribute('aria-expanded',String(!menu.hidden))};document.addEventListener('click',e=>{if(!e.target.closest('.project-picker'))closeProjectMenu()});
async function switchProject(id){closeProjectMenu();if(id===project.projectId)return;try{clearTimeout(saveTimer);await saveDB();let next=await readStore('project:'+id);if(!next)throw Error('Không tìm thấy dự án');await activateProject(next)}catch(err){renderProjectList();alert('Không mở được dự án: '+err.message)}}
async function createProject(){closeProjectMenu();try{clearTimeout(saveTimer);await saveDB();await activateProject(assignProjectId(newProject(),crypto.randomUUID()))}catch(e){alert('Không tạo được dự án: '+e.message)}}
async function removeProject(id){let target=projectIndex.find(p=>p.id===id);if(!target||!confirm('Xóa dự án “'+target.name+'”? Thao tác này không thể hoàn tác.'))return;closeProjectMenu();try{clearTimeout(saveTimer);await saveDB();let next=project;if(id===project.projectId){let other=projectIndex.find(p=>p.id!==id);next=other?await readStore('project:'+other.id):assignProjectId(newProject(),crypto.randomUUID());if(!next)throw Error('Không mở được dự án tiếp theo');next.projectId||=crypto.randomUUID();ensureScenes(next,()=>crypto.randomUUID())}projectIndex=await deleteProject(db,id,projectIndex,next);if(id===project.projectId)await activateProject(next);else renderProjectList()}catch(e){alert('Không xóa được dự án: '+e.message)}}

$('#renameProject').onclick=()=>{let value=prompt('Đổi tên dự án:',project.name||'Dự án chưa đặt tên');if(value===null)return;let name=value.trim().slice(0,100)||'Dự án chưa đặt tên';if(project.name!==name){project.name=name;renderProjectList();scheduleSave()}};
$('#add').onclick=()=>{document.querySelector('.import-menu').open=false;$('#mediaFiles').click()};$('#mediaFiles').onchange=async e=>{let input=e.target;let {images,audio,unsupported}=classifyFiles([...input.files]);if(unsupported.length){alert('Không hỗ trợ: '+unsupported.map(f=>f.name).join(', '));input.value='';return}if(audio.length>1){alert('Mỗi dự án hiện hỗ trợ một tệp âm thanh. Hãy chọn một tệp âm thanh.');input.value='';return}if(audio.length&&project.audio&&!confirm('Thay tệp âm thanh hiện tại bằng tệp mới?')){input.value='';return}try{let imageData=await Promise.all(images.map(f=>new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve({file:f,src:r.result});r.onerror=()=>reject(r.error);r.readAsDataURL(f)})));let track=audio.length?await inspectAudio(audio[0]):null;for(const {file,src} of imageData)project.layers.push({id:crypto.randomUUID(),name:file.name,src,value:layerDefaults(),keys:[]});if(track){attachAudio(project,track);time=0;playing=false;audioElement.pause();$('#play').textContent='▶ Phát'}rebuild();renderTicks();seekAudio();applyAtTime();scheduleSave();message(track?'Đã nhập file · '+track.duration.toFixed(2)+' giây':'Đã nhập '+imageData.length+' ảnh')}catch(error){alert('Không nhập được file: '+error.message)}finally{input.value=''}};
$('#removeAudio').onclick=()=>{if(!project.audio)return;delete project.audio;playing=false;$('#play').textContent='▶ Phát';syncAudio();renderTracks();applyAtTime();scheduleSave()};

$('#savezip').onclick=async()=>{document.querySelector('.export-menu').open=false;try{syncActiveScene(project);download(await createProjectArchive(project),projectFileName(project.name,'zip'))}catch(e){alert('Không xuất được ZIP: '+e.message)}};$('#openzip').onclick=()=>{document.querySelector('.export-menu').open=false;$('#zip').click()};$('#zip').onchange=async e=>{try{const copy=await openProjectArchive(e.target.files[0]);clearTimeout(saveTimer);await saveDB();copy.projectId=crypto.randomUUID();await activateProject(copy)}catch(err){alert('Không mở được ZIP: '+err.message)}e.target.value=''};function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}
function exportStatus(text){$('#export').textContent=text;document.querySelector('.export-menu summary').textContent=text==='Xuất MP4'?'Xuất file ▾':text}
$('#export').onclick=async()=>{document.querySelector('.export-menu').open=false;if(busy)return;playAllScenes=false;syncActiveScene(project);const originalTime=time,originalScene=project.activeSceneId,originalSelected=selected,sceneList=project.scenes.map(x=>({id:x.id,name:x.name,state:structuredClone(x.state)}));let output=null,encoder=null;busy=true;playing=false;audioElement.pause();$('#play').textContent='▶ Phát';$('#export').disabled=true;document.body.classList.add('exporting');try{if(!window.VideoEncoder||!window.VideoFrame)throw Error('Trình duyệt không hỗ trợ WebCodecs. Hãy thử Chrome hoặc Edge mới.');let portrait=project.aspect==='portrait',width=portrait?1080:1920,height=portrait?1920:1080,exportCamera=portrait?portraitCamera:active,config={codec:'avc1.420028',width,height,bitrate:8_000_000,framerate:30,avc:{format:'avc'}};let supported=await VideoEncoder.isConfigSupported(config);if(!supported.supported)throw Error('Trình duyệt hoặc máy này không hỗ trợ mã hóa H.264 1080p.');const {Muxer,ArrayBufferTarget}=await import('mp4-muxer');let aacConfig=sceneList.some(s=>s.state.audio?.src)?await audioExportConfig():null,target=new ArrayBufferTarget(),muxer=new Muxer({target,video:{codec:'avc',width,height},...(aacConfig?{audio:{codec:'aac',numberOfChannels:2,sampleRate:48000}}:{}),firstTimestampBehavior:'offset',fastStart:'in-memory'}),failure=null;encoder=new VideoEncoder({output:(chunk,meta)=>muxer.addVideoChunk(chunk,repairAvcMetadata(meta)),error:e=>failure=e});encoder.configure(config);output=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});output.setTransparentSort(sortTransparent);output.setSize(width,height,false);output.setPixelRatio(1);let total=sceneList.reduce((sum,scene)=>sum+Math.ceil(scene.state.duration*30),0),frameIndex=0;for(const entry of sceneList){applyScene(project,entry.id);selected='camera';time=0;await Promise.all(project.layers.filter(l=>l.kind==='text').map(ensureTextFont));await document.fonts.ready;await rebuild();if(project.layers.some(l=>!meshes.has(l.id)))throw Error('Không tải được ảnh trong '+entry.name);let frames=Math.ceil(project.duration*30);for(let i=0;i<frames;i++,frameIndex++){if(failure)throw failure;time=i/30;applyAtTime(true);grid.visible=false;gizmo.getHelper().visible=false;cameraHelper.visible=false;cameraIcon.visible=false;output.render(scene,exportCamera);let frame=new VideoFrame(output.domElement,{timestamp:Math.round(frameIndex*1e6/30),duration:Math.round(1e6/30)});encoder.encode(frame,{keyFrame:i===0||frameIndex%60===0});frame.close();if(encoder.encodeQueueSize>8)await encoder.flush();if(frameIndex%10===0){exportStatus('Đang xuất '+Math.round(frameIndex/total*100)+'%');await new Promise(r=>setTimeout(r,0))}}}await encoder.flush();if(failure)throw failure;encoder.close();if(aacConfig){exportStatus('Đang xử lý âm thanh');await encodeAudioTimeline(muxer,sceneList.map(s=>s.state),aacConfig,p=>{exportStatus('Âm thanh '+Math.round(p*100)+'%')})}muxer.finalize();download(new Blob([target.buffer],{type:'video/mp4'}),projectFileName(project.name,'mp4'))}catch(e){alert('Không xuất được MP4: '+e.message)}finally{try{if(encoder&&encoder.state!=='closed')encoder.close()}catch{}output?.dispose();applyScene(project,originalScene);time=originalTime;selected=originalSelected;grid.visible=true;gizmo.getHelper().visible=true;cameraHelper.visible=true;cameraIcon.visible=true;await rebuild();seekAudio();applyAtTime();busy=false;$('#export').disabled=false;exportStatus('Xuất MP4');document.body.classList.remove('exporting');resize()}};
const timelineGutter=164;
function updatePlayhead(){
  const canvas=$('#timelineCanvas');
  if(!canvas||!project.duration)return;
  const progress=clamp(time/project.duration,0,1);
  $('#timelinePlayhead').style.left=(timelineGutter+Math.max(0,canvas.clientWidth-timelineGutter)*progress)+'px';
  $('#rulerPlayhead').style.left=(progress*100)+'%';
}
let timelineZoom=1;const timelineScroll=$('#timelineScroll'),timelineCanvas=$('#timelineCanvas');function updateTimelineZoom(){$('#timelineZoom').value=timelineZoom;let width=timelineScroll.clientWidth;if(width)timelineCanvas.style.width=(timelineGutter+Math.max(1,width-timelineGutter)*timelineZoom)+'px';updatePlayhead()}$('#timelineZoom').oninput=event=>{timelineZoom=Number(event.target.value);updateTimelineZoom()};new ResizeObserver(updateTimelineZoom).observe(timelineScroll);document.querySelector('.timeline').addEventListener('wheel',e=>{if(!e.shiftKey||e.ctrlKey||e.metaKey||e.altKey)return;e.preventDefault();let r=timelineScroll.getBoundingClientRect(),x=clamp(e.clientX-r.left,timelineGutter,timelineScroll.clientWidth),old=timelineZoom;timelineZoom=clamp(timelineZoom*(e.deltaY<0?1.2:1/1.2),1,10);let anchor=Math.max(0,timelineScroll.scrollLeft+x-timelineGutter)/old;updateTimelineZoom();timelineScroll.scrollLeft=timelineGutter+anchor*timelineZoom-x},{passive:false});updateTimelineZoom();
$('#previewZoom').onchange=e=>{for(const frame of [$('#cameraFrame'),$('#portraitFrame')])frame.style.transform='scale('+Number(e.target.value)+')'};
const workspace=$('.layout'),viewport=$('#viewport');
const workspaceSizesKey='vox-workspace-sizes-v2';
const sizeDefaults={
  media:Math.round(innerWidth*.178),
  inspector:Math.round(innerWidth*.136),
  preview:39,
  timeline:Math.round(innerHeight*.58),
};
let workspaceSizes={...sizeDefaults};
try{workspaceSizes={...workspaceSizes,...JSON.parse(localStorage.getItem(workspaceSizesKey)||'{}')}}catch{}
function layoutLimits(key){
  if(key==='timeline')return [Math.min(170,innerHeight*.35),Math.max(170,innerHeight-189)];
  if(key==='preview')return [25,75];
  const width=workspace.clientWidth;
  const other=key==='media'?'inspector':'media';
  return [Math.min(175,width*.22),Math.max(Math.min(175,width*.22),width-Math.min(410,width*.5)-workspaceSizes[other]-16)];
}
function applyWorkspaceSizes(){
  for(const key of Object.keys(sizeDefaults)){
    const [min,max]=layoutLimits(key);
    const value=Number.isFinite(workspaceSizes[key])?workspaceSizes[key]:sizeDefaults[key];
    workspaceSizes[key]=clamp(value,min,max);
    workspace.style.setProperty('--workspace-'+key,workspaceSizes[key]+(key==='preview'?'%':'px'));
  }
  document.documentElement.style.setProperty('--timeline-height',workspaceSizes.timeline+'px');
}
function saveWorkspaceSizes(){
  try{localStorage.setItem(workspaceSizesKey,JSON.stringify(workspaceSizes))}catch{}
}
for(const [id,key,axis,sign] of [
  ['mediaResize','media','clientX',1],['inspectorResize','inspector','clientX',-1],
  ['previewResize','preview','clientX',1],['timelineResize','timeline','clientY',-1],
]){
  const divider=$('#'+id);
  let drag=null;
  const adjust=value=>{
    workspaceSizes[key]=clamp(value,...layoutLimits(key));
    applyWorkspaceSizes();
  };
  divider.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    event.preventDefault();
    drag={id:event.pointerId,position:event[axis],size:workspaceSizes[key]};
    divider.setPointerCapture(event.pointerId);
  });
  divider.addEventListener('pointermove',event=>{
    if(drag?.id!==event.pointerId)return;
    const scale=key==='preview'?100/Math.max(1,viewport.clientWidth):1;
    adjust(drag.size+(event[axis]-drag.position)*sign*scale);
  });
  divider.addEventListener('lostpointercapture',()=>{drag=null;saveWorkspaceSizes()});
  divider.addEventListener('dblclick',()=>{adjust(sizeDefaults[key]);saveWorkspaceSizes()});
  divider.addEventListener('keydown',event=>{
    const arrows=axis==='clientX'?['ArrowLeft','ArrowRight']:['ArrowUp','ArrowDown'];
    const index=arrows.indexOf(event.key);
    if(index<0)return;
    event.preventDefault();
    adjust(workspaceSizes[key]+(index===0?-1:1)*sign*(key==='preview'?3:16));
    saveWorkspaceSizes();
  });
}
applyWorkspaceSizes();
window.addEventListener('resize',applyWorkspaceSizes);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||e.ctrlKey||e.metaKey||e.altKey||e.repeat||busy)return;const t=e.target;if(t instanceof HTMLElement&&(t.isContentEditable||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.tagName==='INPUT'&&t.type!=='range'))return;e.preventDefault();$('#play').click()});
let last=performance.now(),lastFieldsRefresh=0;$('#play').onclick=async()=>{if(playing){playAllScenes=false;playing=false;audioElement.pause();$('#play').textContent='▶ Phát';return}if(time>=project.duration)time=0;playing=true;$('#play').textContent='❚❚ Dừng';last=performance.now();if(loadedAudioSrc){seekAudio();try{await audioElement.play()}catch(e){playAllScenes=false;playing=false;$('#play').textContent='▶ Phát';alert('Không phát được âm thanh: '+e.message)}}};function resize(){needsRender=true;let w=$('#customView').clientWidth,h=$('#customView').clientHeight;if(w&&h){renderer.setSize(w,h,false);custom.aspect=w/h;custom.updateProjectionMatrix()}let frame=previewRenderer.domElement.parentElement,fw=frame.clientWidth,fh=frame.clientHeight;if(fw&&fh)previewRenderer.setSize(fw,fh,false);active.aspect=16/9;active.updateProjectionMatrix();cameraHelper.update()}const viewSizeObserver=new ResizeObserver(resize);viewSizeObserver.observe($('#cameraView'));viewSizeObserver.observe($('#customView'));function tick(now){requestAnimationFrame(tick);if(playing&&!busy){time=time+(now-last)/1000;if(time>=project.duration){time=project.duration;playing=false;audioElement.pause();$('#play').textContent='▶ Phát';if(playAllScenes){let i=project.scenes.findIndex(x=>x.id===project.activeSceneId),next=project.scenes[i+1];if(next)changeScene(next.id).then(()=>{if(playAllScenes)$('#play').click()}).catch(e=>{playAllScenes=false;alert('Không phát được cảnh tiếp theo: '+e.message)});else playAllScenes=false}}applyAtTime();if(now-lastFieldsRefresh>=200){showFields();lastFieldsRefresh=now}}last=now;orbit.update();if(busy||!needsRender)return;needsRender=false;grid.visible=false;gizmo.getHelper().visible=false;cameraHelper.visible=false;cameraIcon.visible=false;previewRenderer.render(scene,project.aspect==='portrait'?portraitCamera:active);grid.visible=true;gizmo.getHelper().visible=true;cameraHelper.visible=true;cameraIcon.visible=true;renderer.render(scene,custom)}renderTicks();rebuild();resize();requestAnimationFrame(tick);window.__vox={get project(){return project},get time(){return time}};
