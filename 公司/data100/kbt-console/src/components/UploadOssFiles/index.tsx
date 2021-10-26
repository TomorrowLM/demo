import React, { useEffect, useState, useRef } from 'react';
import { Button, Upload, message, Tooltip, Image } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PictureOutlined, ClusterOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';

interface UploadFileProps {
  size?: number,
  text?: string,
  fileUrl?: string,
  accept?: string,
  disabled?: boolean,
  onChange?: (e: any) => void,
  name: string,
  taskId: string,
  fileLists:string,
}
const toFileList = (fileListsStr:any) => {
  let fl=new Array()
  if (fileListsStr) {
    JSON.parse(fileListsStr).map((item:any,index:number) => {
      fl.push({
        imgIndex:index,
        uid: index,
        name: item.name,
        status: 'done',
        response: item.path,
        url: item.path,
      })
    })
  }
  return fl
}
/**
 * 上传文件按钮
 * @param props
 */
const UploadFile: React.FC<UploadFileProps> = (props) => {
  const { name = 'fileUpload', size = 100, accept, disabled = false, text,fileLists } = props;
  const [fileList, setFileList] = useState<Array<any>>(toFileList(fileLists));//toFileList(fileLists)
  const [enable, setEnable] = useState<boolean>(true);

  const handleChange = (info: any) => {
    console.log(info)
    setFileList(info.fileList)
  }
  const uploadProps = {
    name,
    accept:accept ||".xls,.xlsx"
  };
  const onRemove = (file:any)=>{
    const {onChange } = props;
    const files = fileList.filter(v => v.url !== file.url);
    if (onChange) {
      onChange(files);
    }
  }
  const handleBefore = async (file:any) => {
    const { code, url } = await uploadOss(file, { taskId: props.taskId });
    if (code === 1) {
      file.url = url
      if (props.onChange) {
        props.onChange(fileList.concat(file))
      }
    } else {
      message.error('上传失败');
    }
    return false
  }
  return <Upload
    {...uploadProps}
    fileList={fileList}
    multiple={false}
    disabled={disabled}
    onChange={handleChange}
    onRemove = {onRemove}
    beforeUpload={handleBefore}
  >
    <Button disabled={!enable} type="primary" icon={<UploadOutlined />}>{text ? text : '上传文件'}</Button>
  </Upload>
}

export default UploadFile;
