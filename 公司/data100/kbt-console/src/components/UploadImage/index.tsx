import React, {useEffect, useState, useRef} from 'react';
import { Button, Upload, message, Tooltip,Image } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PictureOutlined, ClusterOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';

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

interface UploadImageProps {
  name?: string,
  type?: string,
  imageUrl?:string,
  disabled?:boolean,
  onChange?: (e: any) => void
}

/**
 * 上传文件按钮
 * @param props
 */
const UploadImage: React.FC<UploadImageProps> = (props) => {
  const { name = 'fileUpload',size=1, action, accept = (props.type=='video'?'.mp4':'.jpg,.jpeg,.png'), data = {}, disabled=false, onSuccess } = props;
  const [ loading,setLoading ] = useState<Boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(props.imageUrl);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传{props.type=='video'?'视频':'图片'}</div>
    </div>
    );

  const uploadProps = {
    name,
    action(file) {
      uploadFn({
        file,
        success(data) {
            setImageUrl(data.url)
            if (props.onChange) {
              props.onChange(data.url)
            }
        }
      })
    },
    headers: { authorization: window.localStorage.getItem('authorization') || '' },
    accept,
    data,
    onChange: (info: any) => {
      const { file: { status, name: fileName, response } } = info;
      const key: string = 'updatable';
      if (status === 'uploading') {
        setLoading(true)
      }
      if (status === 'done' && response) {
        setLoading(false)
        if (response.code === 200) {
          if (onSuccess) {
            onSuccess(response)
          }
        } else if (response.msg && response.msg.length>0) {
          message.error(response.msg);
        }
      }/* else if (status === 'error') {
        message.error(`${fileName} 上传失败.`)
      }*/
    }
  };

  return <Upload {...uploadProps}
    multiple={false}
    disabled={disabled}
    listType="picture-card"
    showUploadList={size>1}
    >
    {imageUrl ? (props.type=='video'?<video src={imageUrl} controls="controls" style={{ width: '100%', height: '100%' }}/>:<img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />) : uploadButton}
  </Upload>
}

export default UploadImage;
