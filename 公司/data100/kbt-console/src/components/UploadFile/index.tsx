import React, {useEffect, useState, useRef} from 'react';
import { Button, Upload, Message, Tooltip,Image } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PictureOutlined, ClusterOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';

const toFileList = (fileUrl) => {
  let fl=new Array()
  if (fileUrl) {
    let fus=fileUrl.split(',')
    fus.map((item,index) => {
      fl.push({
        uid: ''+index,
        name: item,
        status: 'done',
        response: '',
        url: item,
      })
    })
  }
  return fl
}

const uploadFn = async (param: any) => {
  const { code, url } = await uploadOss(param.file);
  if (code === 1) {
    param.success({
      url,
      meta: {}
    })
  } else {
    message.error('上传失败');
  }
}

interface UploadFileProps {
  size?: number,
  text?:string,
  fileUrl?:string,
  accept?:string,
  disabled?:boolean,
  onChange?: (e: any) => void
}

/**
 * 上传文件按钮
 * @param props
 */
const UploadFile: React.FC<UploadFileProps> = (props) => {
  const { name = 'fileUpload',size=1, action, accept="*.*", data = {}, disabled=false, onSuccess,text } = props;
  const [fileUrl, setFileUrl] = useState<string>(toFileList(props.fileUrl));
  const [ fileList,setFileList ] = useState<Array<any>>(toFileList(props.fileUrl));
  const [ enable,setEnable ] = useState<boolean>(true);

const handleBefore = (file,files) => {
  if (fileList.length>=size) {
    Message.warn("仅允许上传"+size+"个文件");
    return Upload.LIST_IGNORE;
  } else {
    return true;
  }
}

const handleChange = (info) => {
    setFileList(info.fileList)
    if (info.file.status=='done' || info.file.status=='removed') {
        if (props.onChange) {
          let url=''
          info.fileList.forEach(file => {
            if (url.length>0) {
              url+=','
            }
            if (file.originFileObj.url) {
              url+=file.originFileObj.url
            }
          })
          props.onChange(url)
        }
        setEnable(info.fileList.length<size)
    }

  }

  const uploadProps = {
    name,
    action(file) {
      uploadFn({
        file,
        success(data) {
            file['url']=data.url
        }
      })
    },
    defaultFileList: fileList,
    headers: { authorization: window.localStorage.getItem('authorization') || '' },
    accept,
    data
  };

  return <Upload {...uploadProps}
    multiple={false}
    disabled={disabled}
    onChange={handleChange}
    beforeUpload={handleBefore}
    >
    <Button disabled={!enable} type="primary" icon={<UploadOutlined />}>{text?text:'上传文件'}</Button>
  </Upload>
}

export default UploadFile;
