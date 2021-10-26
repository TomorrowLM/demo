import React from 'react';
import { Button, Upload, message, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface UploadButtonProps {
  name?: string,
  multiple?: boolean,
  action: string,
  accept?: string,
  tip?: string,
  text?: string,
  data?: object,
  onSuccess?: (e: any) => void
}

/**
 * 上传文件按钮
 * @param props 
 */
const UploadButton: React.FC<UploadButtonProps> = (props) => {
  const { name = 'fileUpload', multiple = false, action, accept = '.xls,.xlsx', tip, text = '上传', data = {}, onSuccess } = props;

  const uploadProps = {
    name,
    multiple,
    action: `${process.env.PROXY_API  }${action}`,
    headers: { authorization: window.localStorage.getItem('authorization') || '' },
    accept,
    data,
    fileList: [],
    onChange(info: any) {
      const { file: { status, name: fileName, response } } = info;
      const key: string = 'updatable';
      if (status === 'uploading') {
        message.loading({ content: '上传中，请稍后...', key });
      }
      if (status === 'done' && response) {
        if (response.code === 200) {
          message.success({ content: `${fileName} 上传成功.`, key });
          if (onSuccess) {
            onSuccess(response)
          }
        } else {
          message.error({ content: response.msg, key });
        }
      } else if (status === 'error') {
        message.error({ content: `${fileName} 上传失败.`, key });
      }
    }
  };

  return (
    <Upload {...uploadProps}>
      {
        tip ? <Tooltip placement="topRight" title={tip}>
          <Button icon={<UploadOutlined />}>{ text }</Button>
        </Tooltip> : <Button icon={<UploadOutlined />}>{ text }</Button>
      }
    </Upload>
  )
}

export default UploadButton;