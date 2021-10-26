// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import EmptyReport from "@/pages/survey/detail/report/components/emptyReport";
import OssFileUpload, {AccessType, OssFileType} from "@/components/FileUpload/OssFileUpload";
import {useAccess} from "umi";
import {get, post} from "@/utils/request";
import {ModuleProjectItem} from "@/pages/survey/detail/data/ModuleProjectItem";
import {history} from "@@/core/history";
import {Image, Menu, message, Spin} from "antd";
import {FileUploadInfo} from "@/components/FileUpload/interface";
import {DateUtil} from "@/utils/DateUtil";
import fileAdd from "@/assets/fileAdd.png";
import ReportFileItem from "@/pages/survey/detail/report/components/fileItem";
import {RcFile} from "antd/lib/upload/interface";
import urlConfig from "../../../../../config/urlConfig";
import permissionConfig from "../../../../../config/permissionConfig";
import index from './index.less'
import { downloadFileOss } from '@/utils/uploadOss'
/**
 * @author sdx
 * @date 2021/6/29
 *  项目资料
 */

const Report: React.FC = () => {
  const surveyGroup = history.location.query?.surveyGroup
  const [dataList, setDataList] = useState<ModuleProjectItem[]>([])
  const [upload, setOnUpload] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const access = useAccess();
  const perMissionUpload = access.canPermissions(permissionConfig.fileManager.permissionUpload)
  const perMissionPreview = access.canPermissions(permissionConfig.fileManager.permissionPreview)
  const perMissionDownload = access.canPermissions(permissionConfig.fileManager.permissionDownload)
  const perMissionDel = access.canPermissions(permissionConfig.fileManager.permissionDel)


  // 加载项目资料列表
  const loadList = () => {
    get<ModuleProjectItem[]>(urlConfig.projectFile.list, {surveyGroup}, (list?: ModuleProjectItem[]) => {
      if (list != null) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of list) {
          const pointIndex = item.name.lastIndexOf(".")
          if (pointIndex > -1) {
            item.extraName = item.name.substring(pointIndex)
          }
        }
        setDataList(list)
      } else {
        setDataList([])
      }
      setLoadSuccess(true)
    })
  }

  useEffect(() => {
    loadList()
  }, [])

  // 删除项目资料
  const delFile = (item: ModuleProjectItem) => {
    const reportId = item.projectDataId
    if (reportId) {
      post<any>(urlConfig.projectFile.del, {surveyGroup, projectDataId: reportId}, () => {
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
  // 下载
  const downloadFile = (item: ModuleProjectItem) => {
    // fileDownload(item.fileUrl, item.name)
    downloadFileOss(item.fileUrl, item.name)
  }
  // 查看
  const preViewFile = (item: ModuleProjectItem) => {
    history.push({
      pathname: "/list/detail/dataDetail",
      query: {
        ...history.location.query,
        fileUrl: item.fileUrl
      }
    })
  }
  // 条目的菜单
  const createMenu = (item: ModuleProjectItem) => {
    return <Menu>
      {
        perMissionPreview ? (
          <Menu.Item key="1" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
            preViewFile(item)
          }}>
            查看
          </Menu.Item>) : null
      }
      {
        perMissionDownload ? (
          <Menu.Item key="2" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
            downloadFile(item)
          }}>
            下载
          </Menu.Item>) : null
      }
      {
        perMissionDel ? (<Menu.Item key="3" style={{width: '100px', paddingLeft: '20px'}} onClick={() => {
          delFile(item)
        }}>
          删除
        </Menu.Item>) : null
      }
    </Menu>
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
  // 上传文件成功
  const uploadFileSuccess = (info: FileUploadInfo) => {
    setOnUpload(false)
    post<string>(urlConfig.projectFile.add, {
      surveyGroup,
      name: info.fileName,
      fileUrl: info.url,
    }, (data) => {
      const pointIndex = info.fileName.lastIndexOf(".")
      let extraName = ""
      if (pointIndex > -1) {
        extraName = info.fileName.substring(pointIndex)
      }
      const result: ModuleProjectItem = {
        fileUrl: info.url,
        name: info.fileName,
        projectDataId: data || "",
        createTime: new DateUtil(new Date(),'yyyy-MM-dd').format(),
        extraName
      }
      setDataList([...dataList, result])
      message.success(`${info.fileName} 上传成功`);
    }).catch((res) => {
      message.error(res)
    })

  }
  // 上传文件失败
  const uploadFileFailed = (info: string) => {
    setOnUpload(false)
    message.error(info);
  }
  // 列表，有数据的情况
  const listView = () => {
    return <div className={index.listContainer}>
      {
        perMissionUpload ? <OssFileUpload uploadFailed={uploadFileFailed} uploadSuccess={uploadFileSuccess}
                                          beforeUpload={beforeUpload}
                                          savePath={surveyGroup}
                                          accept={[AccessType.word, AccessType.excel, AccessType.ppt, AccessType.pdf, AccessType.image]}
                                          ossFileType={OssFileType.textReportType}>
          <div className={index.listItem}>
            <div className={index.fileUpload}>
              <Image src={fileAdd} width={44} height={48} preview={false}/>
              <div className={index.addText}>新增资料</div>
            </div>
          </div>
        </OssFileUpload> : null
      }
      {
        dataList.map((item) => {
          return <ReportFileItem fileName={item.name}
                                 fileTime={`创建时间：${item.createTime}`}
                                 fileType={item.extraName}
                                 className={index.listItem}
                                 overlay={createMenu(item)}
                                 key={item.projectDataId}/>
        })
      }
    </div>
  }


  // 空页面状态,没有数据的情况
  const emptyView = () => {
    // 没有接口还没请求通，就先不展示空页面
    if (!loadSuccess) {
      return null
    }
    return <div className={index.emptyContainer}>
      <EmptyReport emptyTips='您还没有上传项目资料哦'
                   showUpload={perMissionUpload}
                   beforeUpload={beforeUpload}
                   savePath={surveyGroup}
                   accept={[AccessType.word, AccessType.excel, AccessType.ppt, AccessType.pdf, AccessType.image]}
                   ossFileType={OssFileType.projectFile}
                   uploadSuccess={uploadFileSuccess}
      />
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
