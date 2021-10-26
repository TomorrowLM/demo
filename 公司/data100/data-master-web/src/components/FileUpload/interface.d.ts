
/**
 * @author sdx
 * @date 2021/6/28
 * 上传文件之后的数据对象
 */
export interface FileUploadInfo {
  // 文件在远程的路径
  url: string,
  // 除去host 的path路径
  path:string,
  // host
  host:string,
  // 文件原始名字。请注意，如果上传的时候没有指定名字，那么会把文件重命名成时间戳
  fileName: string,

}
