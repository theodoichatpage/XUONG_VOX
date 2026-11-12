export function updateProjectIndex(index,project){const item={id:project.projectId,name:project.name||'Dự án chưa đặt tên',updatedAt:Date.now()};return [item,...index.filter(x=>x.id!==item.id)]}
export function assignProjectId(project,id){return {...project,projectId:id}}
