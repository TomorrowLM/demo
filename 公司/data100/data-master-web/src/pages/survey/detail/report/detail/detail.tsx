import React, {useEffect, useState} from "react";
import OnLinePreview from "@/components/OnLinePreview/OnLinePreview";
import detail from './detail.less'
import {ExclamationCircleFilled} from "@ant-design/icons";
import {history} from "@@/core/history";
import {ReportDetail} from "@/pages/survey/detail/report/detail/ReportDetail";
import {get, post} from "@/utils/request";
import urlConfig from "../../../../../../config/urlConfig";
import {useAccess} from "umi";
import permissionConfig from "../../../../../../config/permissionConfig";
import {Button, message, Modal, Popover} from "antd";
import ApproveStep from "@/pages/survey/detail/report/detail/approveStep/approveStep";
import confirm from "antd/es/modal/confirm";
import {downloadFileOss} from '@/utils/uploadOss'
import OperationLog, {LogType} from "@/components/button/OperationLog";

/**
 * @author sdx
 * @date 2021/7/12
 * 文字报告在线预览
 */

interface ButtonItem {
  style: string
  text: string
  onClick?: () => void
}


const DataFileDetail: React.FC = () => {
  const fileUrl = history.location.query?.fileUrl
  const surveyGroup = history.location.query?.surveyGroup
  const reportId = history.location.query?.reportId
  let reportDetail: ReportDetail
  const [buttonList, setButtonList] = useState<Array<JSX.Element>>([])
  const [showLogModule, setShowLogModule] = useState(false)
  const [showReBackDialog, setShowReBackDialog] = useState(false)
  // 是否有审批的权限
  const permissionPreview = useAccess().canPermissions(permissionConfig.textReport.permissionReportApproval)
  const logPermission = useAccess().canPermissions(permissionConfig.textReport.permissionLog)
  // 加载详情，
  const loadDetail = () => {
    get<ReportDetail>(urlConfig.textReport.detail, {surveyGroup, textReportId: reportId}, (data) => {
      if (data != null) {
        updateUI(data)
      }
    })
  }

  // 报告交付审批
  const approveReport = () => {
    post<any>(urlConfig.textReport.approve, {surveyGroup, textReportId: reportId}, () => {
      // 交付审批成功之后刷新当前的页面
      const list = [reportDetail.applyUser, ...reportDetail.approvalUser]
      confirm({
        title: <h3>审批流程</h3>,
        icon: "",
        content: <ApproveStep list={list}/>,
        onOk: async () => {
          loadDetail()
        }
      })
    })
  }
  // 创建操作按钮
  const createButtonItem = (button: ButtonItem) => {
    return <div className={[detail.button, button.style].join(' ')} key={button.text}

                onClick={() => {
                  button.onClick?.()
                }}>{button.text}</div>
  }

  // 创建审批流程
  const createApproveList = (item: ReportDetail): JSX.Element => {
    const list = [item.applyUser, ...item.approvalUser]
    return <ApproveStep list={list}/>
  }

  // 创建审批中按钮
  const createApproveProgress = (element: JSX.Element) => {
    if (reportDetail == null || reportDetail.applyUser == null) {
      return element
    }
    return <Popover placement='bottomRight' content={createApproveList(reportDetail)} title='报告审批中，审批流程如下：'>
      {element}
    </Popover>
  }

  // 撤回交付
  function reBackReport() {
    post<any>(urlConfig.textReport.reBack, {surveyGroup, textReportId: reportId}, () => {
      message.success("撤回成功")
      loadDetail()
    })
  }
  // 更新页面
  function updateUI(data: ReportDetail) {
    reportDetail = data
    buttonList.length = 0
    if (permissionPreview) {
      // （0未交付 1审批中 2已交付）
      if (data.status === 0) {
        // 未交付
        const approve = {
          style: detail.approve, text: "交付审批", onClick: () => {
            approveReport()
          }
        }
        buttonList.push(createButtonItem(approve))
        setButtonList([...buttonList])
      } else if (data.status === 1) {
        // 审批中,
        const onApprove = {
          style: detail.onApprove, text: "审批中"
        }
        // 审批中需要一个悬浮的进度，所以进行包装
        buttonList.push(createApproveProgress(createButtonItem(onApprove)))
        setButtonList([...buttonList])
      } else {
        // 已交付
        const reBack = {
          style: detail.reBack, text: "撤回交付", onClick: () => {
            setShowReBackDialog(true)
          }
        }
        buttonList.push(createButtonItem(reBack))
        setButtonList([...buttonList])
      }
    }

    // 不管是什么权限都能下载
    // 下载按钮
    const download = {
      style: detail.download, text: "报告下载", onClick: () => {
        // window.location.href = fileUrl
        // fileDownload(fileUrl, data.name)
        downloadFileOss(fileUrl, data.name)
      }
    }
    buttonList.push(createButtonItem(download))
    setButtonList([...buttonList])
  }

  useEffect(() => {
    loadDetail()
  }, [])

  function createOperationButton() {
    if (!logPermission) {
      return null
    }
    return <div>
      <Button
        className={detail.button}
        style={{lineHeight: '0px'}}
        onClick={() => {
          setShowLogModule(true)
        }}
      >操作日志
      </Button>
      <OperationLog logType={LogType.fileReport} uId={reportId}
                    showModule={showLogModule}
                    onCancel={() => {
                      setShowLogModule(false)
                    }}/>
      <Modal visible ={showReBackDialog} title='提示' onCancel={()=>{setShowReBackDialog(false)}} onOk={()=>{
        reBackReport()
        setShowReBackDialog(false)
      }} >撤回交付后，已经交付数据将在客户界面消失，是否撤回？</Modal>
    </div>
  }

  return (
    <div className={detail.mainContainer}>
      <div className={detail.headInfo}>
        <div className={detail.tipsContent}>
          <div className={detail.tips}>
            <ExclamationCircleFilled style={{color: '#F28C48', marginRight: '10px'}}/>
            <span>报告在线批注功能即将上线，敬请期待…</span>
          </div>
        </div>
        {
          createOperationButton()
        }
        {
          buttonList.map((item) => {
            return item
          })
        }
      </div>
      <div>
        <OnLinePreview fileUrl={fileUrl}/>
      </div>
    </div>
  )
}
export default DataFileDetail;
