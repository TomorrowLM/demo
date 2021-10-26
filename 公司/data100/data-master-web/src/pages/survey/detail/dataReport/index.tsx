// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Access, useAccess, IndexModelState, history, connect, ConnectProps, useModel } from 'umi';
import GeneralBreadcrumb from '@/components/GeneralBreadcrumb'
import { Button, Tabs } from 'antd';
import * as Icon from '@ant-design/icons';
import defaultSettings from '../../../../../config/defaultSettings';
import styles from './index.less';
import Menu from '@/components/Menu'
import Item from 'antd/lib/list/Item';
import Statistical from "./statistical"
import Analysis from "./analysis"
import AnalysisCustomer from "./analysis"
import { deliveredRuleGroups, getDeliver } from "./service"
import { deliverRuleItem } from './analysis/data.d'
import Empty from '@/pages/survey/detail/report/components/empty';
import {useAliveController } from 'react-activation';
const { TabPane } = Tabs;
const menu = [
  {
    name: '统计分析',
    key: 'statistical',
    disabled: false,
    components: Statistical
  },
  {
    name: '数据报告',
    key: 'analysis',
    disabled: false,
    components: Analysis
  },
  {
    name: '自定义分析',
    key: 'statistil',
    components: AnalysisCustomer,
    disabled: false
  },

]
interface PageProps extends ConnectProps {
  surveyDetail: IndexModelState,
}
const Report: React.FC<PageProps> = ({ surveyDetail, dispatch }) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];
  const access = useAccess()
  const { surveyGroup } = surveyDetail
  const [deliverRule, setDeliverRule] = useState<Array<deliverRuleItem>>()
  const [deliverReport, setDeliverReport] = useState<string>()//是否有交付的数据报告
  const getDeliverRule = async () => {
    const { data, code } = await deliveredRuleGroups({ groupId: history.location.query.surveyGroup })
    setDeliverRule(data)
  }
  const getDeliverDataReport = async () => {
    const { data, code } = await getDeliver({ groupId: history.location.query.surveyGroup })
    setDeliverReport(data)
  }

  useEffect(() => {
    // console.log(initialState)
    getDeliverRule()
    getDeliverDataReport()
    // dispatch({
    //   type: 'surveyDetail/save',
    //   payload: {
    //     surveyGroup: history.location.query.surveyGroup,
    //   }
    // })
  }, [])

  return (
    <div >
      <div>
        <Tabs defaultActiveKey={menu[1].key} destroyInactiveTabPane={true} onTabClick={()=>{
          getDeliverDataReport()
        }}>
          {menu.map((tab:any, index:number) => {
            if (tab.key === 'analysis') {
              if(deliverRule){
                if(!(initialState.currentUser&&initialState.currentUser.permissions&&initialState.currentUser.permissions[0]==='*:*:*')&&access.canPermissions('list:detail:dataReport:CustomerTips')){//客户
                  return <TabPane tab={tab.name} key={tab.key} disabled={tab.disabled}>
                  {deliverReport ? deliverReport !=='' ?<tab.components type={index + ''} deliverRule={deliverRule} /> :
                    <div className={styles.container}>
                      <Empty emptyTips={'项目经理在玩命准备数据报告，请耐心等待'} />
                    </div>:''
                  }
                </TabPane>
                }else{
                  return <TabPane tab={tab.name} key={tab.key} disabled={tab.disabled}>
                  {deliverRule.length > 0 ? <tab.components type={index + ''} deliverRule={deliverRule} /> :
                    <div className={styles.container}>
                      <Empty emptyTips={"此项目尚未完成数据清洗"} />
                    </div>
                  }
                </TabPane>
                }
              }else {
                return <TabPane tab={tab.name} key={tab.key} disabled={tab.disabled}></TabPane>
              }
              
            } else {
              return <TabPane tab={tab.name} key={tab.key} disabled={tab.disabled}>
                {deliverReport !=='' ? <tab.components type={index + ''} deliverRule={deliverRule} deliverReportId={deliverReport}/> :
                  <div className={styles.container}>
                    <Empty emptyTips={'项目经理在玩命准备数据报告，请耐心等待'} />
                  </div>
                }
              </TabPane>
            }

          })}
        </Tabs>
      </div>
    </div>
  );
};

export default connect(
  ({ surveyDetail }: { surveyDetail: IndexModelState; }) => ({
    surveyDetail,
  }),
)(Report)
