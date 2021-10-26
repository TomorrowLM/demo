import React, { useEffect, useState } from 'react';
import { Access, useAccess, history, connect, Loading, IndexModelState, ConnectProps } from 'umi';
import Empty from "../../report/components/empty";
import styles from "./index.less"
import fileAdd from "@/assets/fileAdd.png";
import fileReportStatus0 from "@/assets/fileReportStatus0.png";
import fileReportStatus1 from "@/assets/fileReportStatus1.png";
import fileReportStatus2 from "@/assets/fileReportStatus2.png";
import { menuList } from './const.d';
import { Button, Image, message, Tooltip } from 'antd';
import EditItem from "./edit"
import { crossAnalysisList, delCrossAnalysis,crossAnalysisState } from "./service"
import DropdownOperate from "@/components/DropdownOperate";
import { dataListItem,deliverRuleItem } from "./data.d"
import { formatListToOptions } from '@/utils/utils'
/* 文字报告页面 */
interface PageProps extends ConnectProps {
  surveyDetail: IndexModelState,
  type: string, //1:数据报告  2：自定义分析
  deliverRule?:Array<deliverRuleItem>,
  deliverReportId?:string,//已交付的数据报告id
}
const Report: React.FC<PageProps> = ({ type, surveyDetail,deliverReportId, dispatch,deliverRule }) => {
  const { listData } = surveyDetail
  const [isEdit, setIsEdit] = useState<Boolean>(false)
  const [curState, setCurState] = useState<any>()
  const [dataList, setDataList] = useState<Array<dataListItem>>()
  const [surveyGroup, setsurveyGroup] = useState<string>(history.location.query.surveyGroup)
  const [editId, setEditId] = useState<string>('')
  // const [deliverRule, setDeliverRule] = useState<Array<deliverRuleItem>>()
  // const getDeliverRule = async () => {
  //   const { data, code } = await deliveredRuleGroups({ groupId: history.location.query.surveyGroup })
  //   setDeliverRule(data)
  // }
  const access = useAccess()
  useEffect(() => {
    console.log("数据报告")
    getCrossAnalysisList()
  }, [])

  const getCrossAnalysisList = async () => {
    const { code, data } = await crossAnalysisList({
      groupId: surveyGroup,
      type: type
    })
    if (code == 200) {
      setDataList(data)
    }
  }
  const getCrossAnalysisState = async (id:string,fn:(data:number)=>void) => {
    const { code, data } = await crossAnalysisState({
      id,
    })
    if (code == 200) {
      fn(data)
    }
  }
  const editReport = (id: string,state:any) => {
    setIsEdit(true)
    setEditId(id)
    setCurState(state)
  }
  return (
    <div >
      {
        isEdit ? < div className={styles.container}>
          <EditItem
            deliverReportId={deliverReportId?deliverReportId:-1}
            deliverRule={deliverRule}
            state={curState}
            type={type}
            edit_id={editId}
            drawerOk={() => {
              console.log("编辑成功")
            }}
            drawerCancel={() => {
              setIsEdit(false)
            }}
            dataListLegnth={dataList ? dataList.length : 0}
            visible={isEdit}
            onClose={(isRefresh?: boolean) => {
              if (isRefresh) {
                getCrossAnalysisList()
              }
              setIsEdit(false)
            }}

          ></EditItem>
        </div> : (dataList ? dataList.length == 0 ? <div className={styles.edit_empty}>
          <Empty emptyTips={"你还没有编辑数据报告哦"} />
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:edit') : access.canPermissions('list:detail:dataReport:analysisCustomer:edit')}>
            <Button type="primary" onClick={() => editReport('',1)} style={{ width: "180px", height: "40px", borderRadius: "20px", marginTop: "30px" }}>立即编辑</Button>
          </Access>
        </div> :
          <div className={styles.container}>
            {/* list:detail:dataReport:analysisCustomer:edit */}
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:edit') : access.canPermissions('list:detail:dataReport:analysisCustomer:edit')}>
              <div className={styles.listItem} onClick={() => editReport('',1)}>
                <div className={styles.editTable}>
                  <Image src={fileAdd} width={44} height={48} preview={false} />
                  <Button type="text" className={styles.addText}>新建数据报告</Button>
                </div>
              </div>
            </Access>
            {dataList.map((list: any, index: number) => {
              return <div className={styles.list} key={index}>
                <div className={styles.name}>
                  <div>{list.name}</div>
                  {list.reportState === 1 ?
                    <div style={{ color: '#999',transform:'scale(0.9)'}}>报告未生成</div> :
                    list.reportState === 2 ? <div style={{ color: 'red',transform:'scale(0.9)' }}>报告生成中</div> : list.reportState === 3 ?
                      <div style={{ color: 'green',transform:'scale(0.9)' }}>报告已生成</div> : ''}
                </div>
                <p>创建时间：{list.createTime}</p>
                {/* 1：未交付  2：审批中  3：已交付  4：交付驳回  5：交付撤销 */}
                {type == "1" ? <Tooltip placement="topLeft" title={list.state == 1 || list.state == 4 || list.state == 5 ? '未交付' : list.state == 2 ? "审批中" : "已交付"} arrowPointAtCenter>
                  <img src={list.state == 1 || list.state == 4 || list.state == 5 ? fileReportStatus0 : list.state == 2 ? fileReportStatus1 : fileReportStatus2} alt="" />
                </Tooltip> : ""}
                <div className={styles.dropDown}>
                  <DropdownOperate menuList={menuList(() => {
                    if (list.reportState == 2) {//生成中报告不可查看
                      message.info('该报告生成中，请稍后查看')
                      return
                    }
                    editReport(list.id + '',list.state)
                  }, () => {
                    if (list.state == 3) {//已交付  不可删除
                      message.info('该报告已交付，不可删除')
                      return
                    }
                    delCrossAnalysis({ id: list.id }).then((res) => {
                      if (res.code == 200) {
                        message.success("操作成功")
                        getCrossAnalysisList()
                      }
                    })
                  }, type,list.reportState == 2,()=>{
                    getCrossAnalysisState(list.id,(data:number)=>{
                      dataList[index].reportState = data
                      setDataList([...dataList])
                    })
                  })} position={"bottomLeft"} trigger={['click']}>
                    <Button type="text" icon={<img src={require("@/assets/iconImages/more@2x.png")} style={{ width: "16px", height: "4px" }} />}></Button>
                  </DropdownOperate>
                </div>
              </div>
            })}

          </div> : '')

      }
    </div>
  );
};

export default connect(
  ({ surveyDetail }: { surveyDetail: IndexModelState }) => ({
    surveyDetail,
  }),
)(Report);
