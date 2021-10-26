// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React from 'react';
import empty from './emptyReport.less'
import {Button} from "antd";
import OssFileUpload, {FileUploadProps} from "@/components/FileUpload/OssFileUpload";
import Empty, {EmptyProps} from "@/pages/survey/detail/report/components/empty";

/**
 * @author sdx
 * @date 2021/6/28
 *
 * 空页面状态(包含一个上传按钮 .)
 */

interface EmptyReportProps extends EmptyProps, FileUploadProps {
  showUpload?: boolean
}

const EmptyReport: React.FC<EmptyReportProps> = (props) => {

  return (
    <div className={empty.container}>
      <Empty emptyTips={props.emptyTips}/>
      {
        props.showUpload === true ?
          <OssFileUpload {...props} renameFile={false}>
            <Button type="primary" shape="round" className={empty.upload}>立即上传</Button>
          </OssFileUpload> : null
      }
    </div>
  );
}

export default EmptyReport;
