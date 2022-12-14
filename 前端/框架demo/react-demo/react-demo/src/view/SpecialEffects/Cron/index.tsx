import { useSetState } from 'ahooks';
import React from 'react';
import { useRef } from 'react';
import CustomCron from './CustomCron'
// import Cron from 'react-cron-generator'
// import 'react-cron-generator/dist/cron-builder.css'
// import Cron from "qnn-react-cron";
// import * as Cron from 'react-cron-antd';
import Cron from '@tuyeye/cron';
function Page() {
  // 调用接口校验
  const getCronTime = (cronText) => {
    console.log(cronText)
    // this.props.actions.getCron(cronText)
  }
  const [state, setState] = useSetState({
    cronText: '',
    value: ''
  })
  const refCronGenerator = useRef(null)
  // language 为可选参数， 具体配置如下
  const language = {

    // 面板标题,
    // panel title,
    paneTitle: {
      second: "秒",
      minute: "分",
      hour: "时",
      day: "日",
      month: "月",
      week: "周",
      year: "年",
    },

    // assign  指定
    assign: "指定",
    // Don't assign  不指定
    donTAssign: "不指定",

    // Every minute ...   每一秒钟、每一分钟
    everyTime: {
      second: "每一秒钟",
      minute: "每一分钟",
      hour: "每一小时",
      day: "每一日",
      month: "每一月",
      week: "每一周",
      year: "每年",
    },

    // weel option  周选项
    week: {
      sun: "星期日",
      mon: "星期一",
      tue: "星期二",
      wed: "星期三",
      thu: "星期四",
      fri: "星期五",
      sat: "星期六",
    },

    // from [a] to [b] [unit], executed once [unit]    a 到 b 每一个时间单位执行一次
    aTob: {
      second: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}秒，每秒执行一次
        </span>
      ),
      minute: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}分，每分钟执行一次
        </span>
      ),
      hour: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}时，每小时执行一次
        </span>
      ),
      day: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}日，每日执行一次
        </span>
      ),
      month: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}月，每月执行一次
        </span>
      ),
      week: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}，每星期执行一次
        </span>
      ),
      year: (AInput, BInput) => (
        <span>
          从{AInput}-{BInput}年，每年执行一次
        </span>
      ),
    },

    // from [a] [unit] start, every [b] Execute once [unit]   从 a 开始, 每一个时间单位执行一次
    aStartTob: {
      second: (AInput, BInput) => (
        <span>
          从{AInput}秒开始，每{BInput}秒执行一次
        </span>
      ),
      minute: (AInput, BInput) => (
        <span>
          从{AInput}分开始，每{BInput}分执行一次
        </span>
      ),
      hour: (AInput, BInput) => (
        <span>
          从{AInput}时开始，每{BInput}小时执行一次
        </span>
      ),
      day: (AInput, BInput) => (
        <span>
          从{AInput}日开始，每{BInput}日执行一次
        </span>
      ),
      month: (AInput, BInput) => (
        <span>
          从{AInput}月开始，每{BInput}月执行一次
        </span>
      ),

      // [n] in the NTH week of this month    本月第 n 周的 星期[n] 执行一次
      week: (AInput, BInput) => (
        <span>
          本月第{AInput}周的{BInput}执行一次
        </span>
      ),

      // 本月的最后一个 星期[n] 执行一次
      week2: (AInput) => <span>月的最后一个{AInput}执行一次</span>,

      year: (AInput, BInput) => (
        <span>
          从{AInput}年开始，每{BInput}年执行一次
        </span>
      ),
    }

  };
  return <>
    <CustomCron
      // ref主要用于从自组件获取cronText
      ref={refCronGenerator}
      cronText={state.cronText}
      getCron={getCronTime}
    />
    {/* no */}
    {/* <Cron
      onChange={(e) => { console.log(e); }}
      value={state.value}
      showResultText={true}
      showResultCron={true}
    /> */}
    <Cron setValue={value => console.log(value)} showResult />
  </>
}

export default Page;