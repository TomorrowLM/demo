import {message, Upload} from "antd";
import React from "react";
import {RcFile, UploadChangeParam, UploadFile} from "antd/lib/upload/interface";
import {FileUploadInfo} from "@/components/FileUpload/interface";
import {accessKeyId, cdnAddress, ossHost} from "@/utils/uploadOss";
import {DateUtil} from "@/utils/DateUtil";


/**
 * @author sdx
 * @date 2021/6/28
 * 文件上传，上传到oss。抛弃了antd自带的列表功能
 */

// oss上传文件类型

export enum OssFileType {
  // 项目资料
  projectFile = "project",
  // 文字报告
  textReportType = "report",
  dataReport = "dataReport",
  clean = "clean"
}
export enum AccessType{
  pdf='application/pdf,',
  word='application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,',
  excel='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,',
  ppt='application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,',
  image='image/*,',
  csv=".csv",

}
// 上传组件需要的参数，必须定义成功之后的回调
export interface FileUploadProps {
  ossFileType: OssFileType,
  // 如果不做限制请不要传此参数
  accept?: AccessType[],
  // 文件存储在oss的路径，！！注意，路径会经过处理
  savePath?: string
  // 文件名，如果不传入的话，默认是时间戳，
  fileName?: string,
  // 是否重命名文件,如果filename 是空的时候会生效，
  renameFile?: boolean,
  beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>;
  uploadSuccess: (url: FileUploadInfo) => void
  uploadFailed?: (msg: string) => void
  returnStopGroupStatus: (result: boolean) => void
}


const OssFileUpload: React.FC<FileUploadProps> = (props) => {
  function getAcceptType(){
    let accept="";
    if (props.accept){
      for (const accessType of props.accept) {
        accept+=accessType.valueOf()
      }
    }
    return accept
  }
  const policyBase64 = 'eyJleHBpcmF0aW9uIjoiMjAyMi0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ=='
  const signStr = 'oWZ2pKpNlar/M90rKODb7d78rUI='
  let remotePath = ""
  if (props.savePath) {
    remotePath = `${props.ossFileType.valueOf()}/${props.savePath}`;
  } else {
    remotePath = `${props.ossFileType.valueOf()}`;
  }

  let remoteFullPath = "";
  const getExtra = (file: UploadFile) => {
    // 存放在远程的全路径
    let fileName = ""

    if (props.fileName) {
      fileName = props.fileName
    } else if (props.renameFile){
      fileName = `${file.lastModified}_${new Date().getTime()}${file.name.substring(file.name.lastIndexOf("."), file.name.length)}`;
    }else {
      fileName = `${new DateUtil(new Date(), 'yyyy-MM-dd hh_mm_ss').format()}-${file.name}`;
    }

    remoteFullPath = `${remotePath}/${fileName}`;
    // 需要上传的参数，
    return {
      key: remoteFullPath,
      success_action_status: '200',
      OSSAccessKeyId: accessKeyId,
      policy: policyBase64,
      Signature: signStr,
    }
  }
  const uploadProps = {
    name: 'file',
    accept:getAcceptType(),
    action: ossHost,
    data: (file: UploadFile) => getExtra(file),
    showUploadList: false,
    heads: {
      'content-type': 'multipart/form-data'
    },
    beforeUpload: (file: RcFile, FileList: RcFile[]) => {
      if (props.beforeUpload) {
        return props.beforeUpload(file, FileList)
      }
      return true

    },
    onChange: (info: UploadChangeParam) => {
      if (info.file.status !== 'up') {
        // console.log('上传中...')
        props.returnStopGroupStatus(true)
      }
      if (info.file.status === 'done') {
        // 表示上传成功，返回一些参数
        const result: FileUploadInfo = {
          fileName: info.file.name,
          url: `${cdnAddress}/${remoteFullPath}`,
          host: cdnAddress,
          path: remoteFullPath,
        }
        props.uploadSuccess(result)

      } else if (info.file.status === 'error') {
        //  如果没有定义失败，就弹出消息
        if (props.uploadFailed) {
          props.uploadFailed?.("error")
        } else {
          message.error(`上传文件失败${info.file.name}`)
        }

      }
    },
  };
  return (
    <Upload {...uploadProps} >{props.children}</Upload>
  )
}

export default OssFileUpload
