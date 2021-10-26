import React from "react";
import { ApplyUser } from "@/pages/survey/detail/report/detail/ReportDetail";
import style from './approveStep.less'
import { Image } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";


/**
 * @author sdx
 * @date 2021/7/13
 * 在线预览，审批流程。
 */

interface StepProps {
  list: ApplyUser[]
}
const textEnum = {
  'null': "提交审批",
  '1': '待审批',
  '2': '已通过',
  '3': '已驳回',
}
const colorEnum = {
  'null': "rgba(33,79,126,1)",
  '1': "rgba(255,174,127,1)",
  '2': "rgba(1,207,151,1)",
  '3': "rgba(247,69,69,1)",
}
const imageEnum = {
  'null': require('@/assets/iconImages/submit@2x.png'),
  '1': require('@/assets/iconImages/approval@2x.png'),
  '2': require('@/assets/iconImages/success@2x.png'),
  '3': require('@/assets/iconImages/fail@2x.png'),
}

// 笨方法。。
const ApproveStep: React.FC<StepProps> = (props) => {
  const { list } = props
  console.log(list)
  function personItem(user: ApplyUser, index: number) {

    return <div className={style.userItem}>
      {
        index !== 0 ? (<div className={style.line} />) : null
      }
      {
        index !== 0 ? (<CaretRightOutlined style={{ color: '#DDD' }} />) : null
      }
      <Image src={user.avatar} className={style.userHead} />
      <div className={style.userName}>
        <div>
          {user.name}
        </div>
        {user.status||index===0?<div style={{ color: colorEnum[user.status + '']}}>
          <span>{textEnum[user.status + '']}</span>
          <Image src={imageEnum[user.status + '']} className={style.statusImg} />
        </div>:''}
      </div>

    </div>
  }

  return (<div className={style.container}>
    {
      list.map((item, index) => {
        return personItem(item, index)
      })
    }
  </div>)

}
export default ApproveStep
