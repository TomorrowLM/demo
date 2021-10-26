import React, {useState,useEffect} from 'react';
import { Modal } from 'antd';
import GenerateQrCode from '@/assets/generateQrCode.png';
import styles from './index.less';

interface TaskPreviewProps {
  baseUrl?: string
  previewRef?: object
}

const TaskPreview: React.FC<TaskPreviewProps> = (props) => {
  // const {baseUrl = 'https://h5cs.kanbotong.net/task/details?taskId=' , previewRef} = props;
  const {baseUrl = 'https://h5.kanbotong.net/task/details?taskId=' , previewRef} = props;
  const [show, setShow] = useState<boolean>(false);
  const [url, setUrl] = useState<string>();


  const perview= (taskId:string) => {
    let newUrl=baseUrl+taskId;
    setUrl(newUrl)
    setShow(true)
  }
  useEffect(() => {
      props.previewRef.current={perview}
    },[])
  return (
    <Modal title="任务预览" footer={null} destroyOnClose={true} visible={show} onCancel={e=>{setShow(false)}} className={styles.yuModel}>
      {/* <div className={styles.yuModel_wrap}> */}
      <iframe src={url} frameborder="0" height="610px" width="100%"></iframe>
      {/* </div> */}
      {/* <img src={GenerateQrCode} alt="扫一扫" /> */}
      
    </Modal>
  )
}

export default TaskPreview;
