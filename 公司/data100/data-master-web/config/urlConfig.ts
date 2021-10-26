/**
 * @author sdx
 * @date 2021/7/5
 * 存放网络请求地址的地方，。
 */

export default {
  // 全局
  global:{
    logList:'/center-account/operLog/list',
  },
  //文字报告
  textReport: {
    // 添加文字报告
    urlUploadDataReport: '/center-data-show/textReport/add',
    // 文字报告页面
    dataReportList: '/center-data-show/textReport/list',
    // 删除文字报告
    delTextReport: '/center-data-show/textReport/del',
    // 文字报告详情
    detail: '/center-data-show/textReport/detail',
    // 交付审批
    approve:'/center-data-show/textReport/applyApproval',
    // 撤回交付
    reBack:'/center-data-show/textReport/recallDeliver',
  },
  //项目资料
  projectFile: {
    // 列表
    list: '/center-data-show/projectData/list',
    // 删除
    del: '/center-data-show/projectData/del',
    // 新增
    add: '/center-data-show/projectData/add',
  },
  // oss
  oss: {
    previewUrl: '/center-data-show/cs/getOfficePreviewUrl',
    onLineEditFile:'center-data-clean/immtest/t1',
  },
}
