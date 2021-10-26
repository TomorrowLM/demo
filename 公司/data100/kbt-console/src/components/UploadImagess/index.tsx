import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Upload, message, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';

const toFileList = (fileUrl:any) => {
  let fl=new Array()
  if (fileUrl) {
    fileUrl.map((item:any,index:number) => {
      fl.push({
        imgIndex:index,
        uid: index,
        name: item,
        status: 'done',
        response: item,
        url: item,
      })
    })
  }
  return fl
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const uploadFn = async (param: any) => {
  const { code, url } = await uploadOss(param.file);
  if (code === 1) {
    console.log({ ...param.file })
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
  imageUrl?: string,
  fileList?: any,
  disabled?:boolean,
  onChange?: (e: any) => void
}
/**
 * 上传文件按钮
 * @param props
 */
const UploadImages = forwardRef((props, ref) => {
  const { name = 'fileUpload', size = 1, action, accept = (props.type == 'video' ? '.mp4' : '.jpg,.jpeg,.png'), data = {}, disabled = false, onSuccess } = props;
  const [loading, setLoading] = useState<Boolean>(false);

  const [previewVisible, setPreviewVisible] = useState<Boolean>(false);
  const [previewImage, setPreviewImage] = useState<String>('');
  // const [fileList, setfileList] = useState<Array<any>>(toFileList(props.fileList));

  const handleCancel = () => { setPreviewVisible(false) }
  const handleChange = (info: any) => {
    // props.onChange(info.fileList)
    // setfileList(info.fileList)
  }
  const handleRemove = (file: any) => {
    // console.log(file,toFileList(props.fileList))
    let urlList:string[] = []
    let newFileList = toFileList(props.fileList)
    for(var i =0;i<newFileList.length;i++){
      if(newFileList[i].imgIndex != file.imgIndex){
        urlList.push(newFileList[i].url)
      }
    }
    // console.log(JSON.stringify(urlList))
    props.onChange(JSON.stringify(urlList))
  }
  // useImperativeHandle(ref, () => ({
  //   fileListChange: () => {
  //     setfileList(toFileList(props.fileList))
  //   },
  //   func2: () => {
  //     console.log('孩子2的方法2');
  //   }
  // }));
  const handlePreview = (file: any) => {
    if (!file.url && !file.preview && !file.originFileObj.url) {
      getBase64(file.originFileObj).then(data => {
        // console.log(data)
        file.preview = data;
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
      });
    } else {
      setPreviewImage(file.url || file.preview || file.originFileObj.url);
      setPreviewVisible(true);
    }
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传{props.type == 'video' ? '视频' : '图片'}</div>
    </div>
  );

  const uploadProps = {
    name,
    action(file: any) {
      // console.log(file)
      uploadFn({
        file, success(data: any) {
          file['url'] = data.url
          let urlList = []
          let newFileList = toFileList(props.fileList)
          newFileList.forEach((item: any, index: number) => {
            urlList.push(item.url)
          })
          urlList.push(data.url)
          props.onChange(JSON.stringify(urlList))
         
        }
      })
    },
    // headers: { authorization: window.localStorage.getItem('authorization') || '' },
    accept,
    data
  };

  return (
    [
      <Upload
        {...uploadProps}
        fileList={toFileList(props.fileList)}
        multiple={false}
        disabled={disabled}
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
        onRemove={handleRemove}
      >
        {uploadButton}
        {/* {fileList.length >= 8 ? null : uploadButton} */}
      </Upload>,
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={handleCancel}
        style={{ maxHeight: "700px" }}
      >
        {props.type == 'video' ?
          <video src={previewImage} autoPlay={true} height="600" width="500" controls="controls"></video>
          : <img style={{ width: '100%' }} src={previewImage} />}
      </Modal>
    ])
})

export default UploadImages;
