import React from "react";
import empty from "@/pages/survey/detail/report/components/empty.less";
import {Image} from "antd";
import emptyImage from "@/assets/emptyData.png";

/**
 * @author sdx
 * @date 2021/6/29
 * 空页面展示,其实antd有一个，但是感觉有那么一点点问题。
 */

export interface EmptyProps {
  // 空页面的提示语
  emptyTips?: string;
}

const Empty: React.FC<EmptyProps> = (props) => {

  return (
    <div className={empty.container}>
      <Image src={emptyImage} width={160} height={86} preview={false}/>
      <div className={empty.desc}>{props.emptyTips == null ? '你还没有上传文字报告哦' : props.emptyTips}</div>
    </div>
  );
};

export default Empty;
