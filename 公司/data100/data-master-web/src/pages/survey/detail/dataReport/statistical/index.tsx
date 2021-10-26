// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { Access, useAccess, Link, history, connect, Loading, IndexModelState, ConnectProps } from 'umi';
import { summaryReport } from "../service"
import styles from "./index.less"
import ItemTable from "./itemTable"
import ItemChart from "./itemChart"
import { uniKey } from "../../../../../utils/utils"
import { Alert, Row, Col, Button } from "antd"
import html2canvas from "html2canvas";
/* 文字报告页面 */

interface PageProps extends ConnectProps {
  surveyDetail: IndexModelState,
  loading: boolean;
}
const Report: React.FC<PageProps> = ({ surveyDetail, dispatch }) => {
  const { surveyGroup, listData } = surveyDetail
  const getListData = async () => {
    const { data } = await summaryReport({
      groupId: history.location.query.surveyGroup,
    })
    dispatch({
      type: "surveyDetail/save",
      payload: {
        listData: data,
      }
    })
  }
  useEffect(() => {
    getListData()
  }, [])

  return (
    <div className={styles.container}>
      <Row justify="space-between">
        <Col>
          <Alert className={styles.alertMsg} message="本部分不展示填空题统计数据" type="warning" showIcon style={{ width: "250px", height: "34px", background: "#f7f2ee", fontSize: "13px", border: 'none' }} />
        </Col>
        <Col>
          {/* <Button type="primary" style={{borderRadius:"6px",marginRight:"10px"}}>
            下载数据
          </Button> */}
          {/* <Button type="primary" style={{ borderRadius: "6px" }} onClick={downLoad}>
            下载报告到PDF
          </Button> */}
        </Col>
      </Row>
      <div id="report_img">
        {listData.map((item: any, index: number) => {
          return <div style={{ margin: "10px 0 20px", borderBottom: "1px solid #ddd" }} key={index}>
            {['L', '5', '!'].includes(item.type) && item.questionList.length < 8 ? <ItemChart key={index} index={index} dataSourceItem={item} key={uniKey()} /> : <ItemTable key={index} index={index} dataSourceItem={item} key={uniKey()} />}

          </div>
        })}
      </div>

    </div>
  );
};

export default connect(
  ({ surveyDetail, loading }: { surveyDetail: IndexModelState; loading: Loading }) => ({
    surveyDetail,
    loading: loading.models.index,
  }),
)(Report)