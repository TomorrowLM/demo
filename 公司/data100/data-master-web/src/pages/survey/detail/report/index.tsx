// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';

import index from './index.less';
import ReportFileItem from "@/pages/survey/detail/report/components/fileItem";
import EmptyReport from "@/pages/survey/detail/report/components/emptyReport";
import {Image, Menu, message, Spin} from "antd";
import {FileUploadInfo} from "@/components/FileUpload/interface";
import OssFileUpload, {AccessType, OssFileType} from "@/components/FileUpload/OssFileUpload";
import fileAdd from "@/assets/fileAdd.png";
import {useAccess} from "@@/plugin-access/access";
import {history} from "umi";
import {get, post} from "@/utils/request";
import {DataReportItem} from "@/pages/survey/detail/report/DataReportItem";
import {DateUtil} from "@/utils/DateUtil";
import permissionConfig from "../../../../../config/permissionConfig";
import urlConfig from "../../../../../config/urlConfig";
import {RcFile} from "antd/lib/upload/interface";
import { downloadFileOss } from '@/utils/uploadOss'
/**
 * @author sdx
 * @date 2021/6/28
 * 文字报告页面。
 */

const Report: React.FC = () => {
  const surveyGroup = history.location.query?.surveyGroup
  const [upload, setOnUpload] = useState(false);
  const [dataList, setDataList] = useState<DataReportItem[]>([]);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const access = useAccess();
  const permissionUpload = access.canPermissions(permissionConfig.textReport.permissionReportUpload)
  const permissionDel = access.canPermissions(permissionConfig.textReport.permissionReportDel)
  const permissionPreview = access.canPermissions(permissionConfig.textReport.permissionReportPreview)
  const permissionDownload = access.canPermissions(permissionConfig.textReport.permissionReportDownload)

  //
  useEffect(() => {
    get<DataReportItem[]>(urlConfig.textReport.dataReportList, {surveyGroup}, (list?: DataReportItem[]) => {
      if (list != null) {
        // eslint-disable-next-line no-restricted-syntax
        for (const dataReportItem of list) {
          const pointIndex = dataReportItem.name.lastIndexOf(".")
          if (pointIndex > -1) {
            dataReportItem.extraName = dataReportItem.name.substring(pointIndex)
          }
        }
        setDataList(list)
      }
      setLoadSuccess(true)
    })

  }, [])

  // 上传文件成功
  const uploadFileSuccess = (info: FileUploadInfo) => {
    setOnUpload(false)
    post<string>(urlConfig.textReport.urlUploadDataReport, {
      surveyGroup,
      name: info.fileName,
      fileUrl: info.url,
    }, (data) => {
      const pointIndex = info.fileName.lastIndexOf(".")
      let extraName = ""
      if (pointIndex > -1) {
        extraName = info.fileName.substring(pointIndex)
      }
      const result: DataReportItem = {
        fileUrl: info.url,
        name: info.fileName,
        surveyGroup,
        textReportId: data,
        status: 0,
        createTime: new DateUtil(new Date(),'yyyy-MM-dd').format(),
        extraName
      }
      setDataList([...dataList, result])
      message.success(`${info.fileName} 上传成功`);
    }).catch((res) => {
      message.error(res)
    })

  }
  const beforeUpload = (file: RcFile) => {

    const list = dataList.filter(((value) => {
      return value.name === file.name
    }))
    if (list.length > 0) {
      message.error(`${file.name}已经存在`)
      setOnUpload(false)
      return false
    }
    setOnUpload(true)
    return true

  }
  // 上传文件失败
  const uploadFileFailed = (info: string) => {
    setOnUpload(false)
    message.error(info);
  }
  const preViewReport = (item: DataReportItem) => {
    const reportId = item.textReportId
    if (reportId) {
      history.push({
        pathname: "/list/detail/reportDetail",
        query: {
          ...history.location.query,
          fileUrl: item.fileUrl,
          surveyGroup,
          reportId,
        }
      })
    } else {
      message.error('无效的报告id')
    }
  }

  // 下载
  const downloadFile = (item: DataReportItem) => {
    // fileDownload(item.fileUrl, item.name)
   downloadFileOss(item.fileUrl, item.name)
  }
  const delReport = (item: DataReportItem) => {
    const reportId = item.textReportId
    if (reportId) {
      post<any>(urlConfig.textReport.delTextReport, {surveyGroup, textReportId: reportId}, () => {
        message.success("删除成功")
        const itemIndex = dataList.indexOf(item)
        if (itemIndex > -1) {
          dataList.splice(itemIndex, 1)
          setDataList([...dataList])
        }


      })
    } else {
      message.error('无效的报告id')
    }
  }
  // 条目的菜单
  const createMenu = (item: DataReportItem) => {
    return <Menu>
      {
        permissionPreview ? (
          <Menu.Item key="1" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
            preViewReport(item)
          }}>
            查看
          </Menu.Item>) : null
      }
      {
        permissionDownload ? (
          <Menu.Item key="2" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
            downloadFile(item)
          }}>
            下载
          </Menu.Item>) : null
      }
      {
        permissionDel ? (<Menu.Item key="3" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
          delReport(item)
        }}>
          删除
        </Menu.Item>) : null
      }
    </Menu>
  }
  // 空页面状态,没有数据的情况
  const emptyView = () => {
    // 没有接口还没请求通，就先不展示空页面
    if (!loadSuccess) {
      return null
    }
    const emptyDesc = permissionUpload ? "你还没有上传文字报告哦" : "此项目还未进入提交报告环节，如有需要请联系项目经理。"
    return <div className={index.emptyContainer}>
      <EmptyReport uploadFailed={uploadFileFailed} uploadSuccess={uploadFileSuccess} emptyTips={emptyDesc}
                   beforeUpload={beforeUpload}
                   accept={[AccessType.word, AccessType.excel, AccessType.ppt, AccessType.pdf]}
                   ossFileType={OssFileType.textReportType}
                   showUpload={permissionUpload}/>
    </div>
  }

  // 列表，有数据的情况
  const listView = () => {
    return <div className={index.listContainer}>
      {
        permissionUpload ? <OssFileUpload uploadFailed={uploadFileFailed} uploadSuccess={uploadFileSuccess}
                                          beforeUpload={beforeUpload}
                                          accept={[AccessType.word, AccessType.excel, AccessType.ppt, AccessType.pdf]}
                                          ossFileType={OssFileType.textReportType}>
          <div className={index.listItem}>
            <div className={index.fileUpload}>
              <Image src={fileAdd} width={44} height={48} preview={false}/>
              <div className={index.addText}>新增报告</div>
            </div>
          </div>
        </OssFileUpload> : null
      }
      {
        dataList.map((item) => {
          return <ReportFileItem fileName={item.name}
                                 overlay={createMenu(item)}
                                 status={item.status}
                                 fileTime={`创建时间：${item.createTime}`}
                                 fileType={item.extraName}
                                 className={index.listItem}
                                 key={item.textReportId}/>
        })
      }
    </div>
  }

  return (
    <div className={index.container}>
      {dataList.length === 0 ? emptyView() : listView()}
      <div className={index.loadContainer}>
        <Spin delay={500} size="large" tip='正在上传' spinning={upload}/>
      </div>
    </div>
  );
};

export default Report;
