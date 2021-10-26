import React from "react";
import OnLinePreview from "@/components/OnLinePreview/OnLinePreview";
import detail from './detail.less'
import {history} from "@@/core/history";

/**
 * 项目管理在线预览
 * @constructor
 */
const DataFileDetail: React.FC = () => {
  const fileUrl = history.location.query?.fileUrl
  return (
    <div className={detail.mainContainer}>
      <OnLinePreview fileUrl={fileUrl}/>
    </div>
  )
}
export default DataFileDetail;
