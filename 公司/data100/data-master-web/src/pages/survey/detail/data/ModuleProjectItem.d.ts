
// 项目资料列表item
export type ModuleProjectItem = {
  createTime: string;
  fileUrl: string;
  name: string;
  projectDataId: string;
  // 本地获取的扩展名，暂时不是服务器返回的
  extraName:string;
}
