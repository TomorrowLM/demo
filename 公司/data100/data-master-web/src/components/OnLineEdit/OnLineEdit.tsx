import {cdnAddress, ossPath} from "@/utils/uploadOss";
import {get} from "@/utils/request";
import urlConfig from "../../../config/urlConfig";
import React, {useEffect} from "react";
import {OssOnLineEditData} from "@/components/OnLineEdit/OssOnLineEditData";


/**
 * 在线编辑文档，只能是存放在oss的文件
 * @author sdx
 * @date 2021/8/13
 */


export interface OnLineEditProps {
  fileUrl: string
}


const OnLineEdit:React.FC<OnLineEditProps>=(props)=>{

  const loadDetail = () => {
    const ossFilePath = props.fileUrl.replace(cdnAddress, ossPath)
    get<OssOnLineEditData>(urlConfig.oss.onLineEditFile, {srcUri: ossFilePath}, (data) => {
      // 报错不用管，aliyun会自动挂载在window
      const instance = aliyun.config({
        mount: document.querySelector('#editContainer'),
        url: data?.webofficeURL
      })
      // 设置AccessToken。
      instance?.setToken({
        token: data?.accessToken,
        timeout: 120 * 60 * 1000
      })
    })

  }

  useEffect(() => {
    loadDetail()
  }, []);


  return (
    <div id='editContainer' style={{width: '100%', height: '100%'}}/>
  )
}
export default OnLineEdit
