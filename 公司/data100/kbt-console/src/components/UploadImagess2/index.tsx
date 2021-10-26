import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Upload, message, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';

const toFileList = (fileUrl) => {
  let fl = new Array()
  if (fileUrl) {
    let fus = fileUrl.split(',')
    fus.map((item, index) => {
      fl.push({
        uid: '' + index,
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
  disabled?: boolean,
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
  const [fileList, setfileList] = useState<Array<any>>(toFileList(props.imageUrl));

  const handleCancel = () => { setPreviewVisible(false) }
  const trigerChanged = (url_) => {
    if (props.onChange) {
      let url = ''
      fileList.forEach(file => {
        if (url.length > 0) {
          url += ','
        }
        if (file.url) {
          url += file.url
        } else if (file.originFileObj && file.originFileObj.url) {
          url += file.originFileObj.url
        }
        console.error("change: " + url)
      })
      if (url_) {
        if (url.length > 0) {
          url += ','
        }
        url += url_
      }
      props.onChange(url)
    }
  }
  const handleChange = (info: any) => {
    setfileList(info.fileList)
    if (info.file.status == 'removed') {
      trigerChanged()
    }
  }
  useImperativeHandle(ref, () => ({
    fileListChange: () => {
      JSON.parse(JSON.stringify(fileList))
      setfileList(props.fileList)
      console.log(props.fileList)
    },
    func2: () => {
      console.log('孩子2的方法2');
    }
  }));
  const handlePreview = (file: any) => {
    if (!file.url && !file.preview && !file.originFileObj.url) {
      getBase64(file.originFileObj).then(data => {
        console.log(data)
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
      console.log(file)
      uploadFn({
        file, success(data: any) {
          // console.log(props, data.url, "=========")
          file['url'] = data.url
          trigerChanged(data.url)
          // if (props.type == "video") {
          //   fileList.push({ url: data.url })
          //   props.onChange(fileList)
          // }
        }
      })
    },
    // headers: { authorization: window.localStorage.getItem('authorization') || '' },
    accept,
    data
  };

  return (
    <div onClick={(e) => { e.stopPropagation() }} style={{width:"150px"}}>
      <Upload
        {...uploadProps}
        // type={props.type}
        // key={props.key}
        fileList={fileList}
        multiple={false}
        disabled={disabled}
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
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
    </div>)
})

export default UploadImages;
