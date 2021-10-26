import { request } from 'umi';


export async function creatFolderService(params: Object) {
  return request(`center-data-collect/card/addFileInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function loadFolderListService(params: Object) {
  return request(`center-data-collect/card/selectCardInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function loadProjectListService(params: Object) {
  return request(`center-data-collect/survey/AddcardSelectSurvey`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function addProjectCardService(params: Object) {
  return request(`center-data-collect/card/addCardInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function folderRenameService(params: Object) {
  return request(`center-data-collect/card/updateFileInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function cardRenameService(params: Object) {
  return request(`center-data-collect/card/updateCardInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function deleteFolderService(params: Object) {
  return request(`center-data-collect/card/deleteFileInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function deleteCardService(params: Object) {
  return request(`center-data-collect/card/deleteCardInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function folterListService(params: Object) {
  return request(`center-data-collect/card/moveCardOffileListInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function moveToFolderService(params: Object) {
  return request(`center-data-collect/card/moveCardIntoFile`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
