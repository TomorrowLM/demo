import React, {useEffect} from "react";
import {get} from "@/utils/request";
import {OssPreviewData} from "@/components/OnLinePreview/OssPreviewData";
import urlConfig from "../../../config/urlConfig";
import {cdnAddress, ossPath} from "@/utils/uploadOss";

export interface OnLineProps {
  fileUrl: string
}


const OnLinePreview: React.FC<OnLineProps> = (props) => {

  function isImage(url: string) {
    const reg = /\.(png|jpg|gif|jpeg|webp)$/;
    return reg.test(url);
  }

  const loadDetail = () => {
    console.log(props.fileUrl)
    const ossFilePath = props.fileUrl.replace(cdnAddress, ossPath)
    get<OssPreviewData>(urlConfig.oss.previewUrl, {srcUri: ossFilePath}, (data) => {
      // 报错不用管，aliyun会自动挂载在window
      const instance = aliyun.config({
        mount: document.querySelector('#previewContainer'),
        url: data?.previewUrl // 设置文档预览URL地址。
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
    <div id='previewContainer' style={{width: '100%', height: '100%'}}/>
  )
}
export default OnLinePreview
