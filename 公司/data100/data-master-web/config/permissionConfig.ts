/**
 * @author sdx
 * @date 2021/7/5
 * 存放定义权限的地方
 */

export default {
  // 数据报告
  dataReport:{
    permissionLog: 'data:report:log',
  },
  // 数据清洗
  dataClean:{
    permissionLog: 'data:clean:log',
  },
  //问卷列表
  surveyList:{
    // 操作日志权限
    permissionLog: 'survey:list:log',
  },
  // 文字报告
  textReport: {
    // 文字报告上传
    permissionReportUpload: 'list:detail:report:upload',
    // 交付审批
    permissionReportApproval: 'list:detail:report:approval',
    // 文字报告查看
    permissionReportPreview: 'list:detail:report:preview',
    // 文字下载
    permissionReportDownload: 'list:detail:report:download',
    // 删除报告
    permissionReportDel: 'list:detail:report:delete',
    // 操作日志权限
    permissionLog: 'textReport:log',
  },
  // 项目资料管理
  fileManager: {
    // 新增文件 上传
    permissionUpload: 'fileManager:upload',
    // 查看
    permissionPreview: 'fileManager:preview',
    //  下载
    permissionDownload: 'fileManager:download',
    // 删除
    permissionDel: 'fileManager:delete',
  },
};
