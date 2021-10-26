import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { history, Access, useAccess, } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { isXsScreen, formatTreeData, formatTreeValue, } from '@/utils/utils';
import { columnsList } from "./const.d"
import { TableListItem, QueryParams } from './data.d';
import { Tooltip, Button, Modal, message, Space, TreeSelect } from 'antd';
import { getSubTaskList, cancelDestine, getAreaInfo, updatenlineStatus } from "./service"
const { SHOW_PARENT, SHOW_ALL } = TreeSelect;
// interface Array []
/**
 * 处理查询与下载列表时的参数
 * @param params
 */
const getQueryParams = (params: any): QueryParams => {
  const { current, pageSize, address, city, finishStat, phone } = params;

  return {
    current,
    pageSize,
    address: address || '',
    city: city || '',
    finishStat: finishStat || '',
    phone: phone || '',
    taskId: history.location.query.taskId,
  }
}
console.log(history)
export default () => {
  const actionRef = useRef<ActionType>();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array>([])
  const [cityStr, setCityStr] = useState<any>([])


  const Unsubscribe = async () => {
    // console.log(selectedRowKeys)
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      const res = await cancelDestine({ subTaskId: selectedRowKeys })
      if (res.code == 200) {
        message.success(res.msg)
        actionRef.current.clearSelected();// 清空选中项
        actionRef.current.reload();// 刷新列表
      }
    } else {
      message.warn('请选择需要解除的子任务')
    }
  }

  const statusChange = async (status: string, subTaskId: string) => {
    const res = await updatenlineStatus({
      status,
      subTaskId
    })
    if (res.code == 200) {
      message.success(res.msg)
      actionRef.current.reload();// 刷新列表
    }
  }

  const selectTreeData = (value: any, label: any, treeData: any) => {
    console.log(value, label, formatTreeValue(value, treeData))
    setCityStr(formatTreeValue(value, treeData))
  }
  useEffect(() => {
    getAreaInfo().then(res => {
      const tProps = {
        treeData: formatTreeData(res.data, ''),
        filterTreeNode: (inputValue: string, treeNode: any) => {
          if (treeNode.title.indexOf(inputValue) != -1) {
            return true
          }
        },
        placeholder: '请选择',
      };
      setColumnsData(columnsList((status: string, record: any) => {
        return <div>
          <Button type="text" danger disabled={status == "1"} icon={<CheckCircleOutlined style={{ color: status == "1" ? "green" : "#aaa", fontWeight: "bold", fontSize: "18px" }} />} onClick={() => statusChange("1", record.subTaskId)}></Button>
          <Button type="text" danger disabled={status == "2"} icon={<CloseCircleOutlined style={{ color: status == "2" ? "red" : "#aaa", fontWeight: "bold", fontSize: "18px" }} />} onClick={() => statusChange("2", record.subTaskId)}></Button>
        </div>
      }, {
        title: () => {
          return <div><span>完成状态</span><QuestionCircleOutlined style={{ fontWeight: "bold", margin: "0 0 0 5px" }} onClick={() => {
            Modal.info({
              title: '完成状态',
              icon: <ExclamationCircleOutlined />,
              closable: true,
              getContainer: "#root",
              content: (
                <div>
                  <p>【未预订】： 子任务没有被任何人预订，在子任务列表中能搜索到。</p>
                  <p>【执行中】：
                  1 子任务被预订，在子任务列表中搜索不到， 在预订人的待完成列表中可以看到。归属为【执行中】;
                  2 子任务某个点位审核不合格，访问员点击重拍会生成一个新的子任务，该子任务的状态是【重拍】归属为【执行中】
                  </p>
                  <p>【已完成】：（京东项目）子任务的所有点位被完成。该任务变成【已完成】状态</p>
                  <p>【已下架】：（新潮项目）子任务完成预设点位数，变成【已下架】状态。</p>
                </div>
              ),
            });
          }} /></div>
        }
      }, (fieldProps: any) => {
        console.log(fieldProps)
        return <TreeSelect
          treeCheckable={true}
          showCheckedStrategy={SHOW_PARENT}
          {...fieldProps}
          {...tProps}
          // value={getTreeValue(item.areaInfo)}
          onChange={(value, label, extra) => { selectTreeData(value, label, res.data) }}
        ></TreeSelect>
      }))
    })
    return () => {
      // Modal.destroyAll()
    }
  }, [])
  return (<PageContainer title={false}>
    <ProTable<TableListItem>
      actionRef={actionRef}
      size="small"
      scroll={{ x: 'max-content' }}
      columns={columnsData}
      onReset={(a: any) => {
        setCityStr([])
      }}
      request={async (params: any) => {
        params.city = JSON.stringify(cityStr)
        const paramsData = getQueryParams(params);
        const res = await getSubTaskList(paramsData)
        return Promise.resolve({
          data: res.data.list,
          total: res.data.total,
          success: true,
        });

      }}
      rowKey="subTaskId"
      options={{ setting: true, density: false, reload: false }}
      rowSelection={{
        type: 'checkbox',
        getCheckboxProps: (record: TableListItem) => ({
          disabled: !(record.finishStat === '执行中'), // Column configuration not to be checked
        }),
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT], //全选  反选
      }}
      tableAlertOptionRender={(selectedRowKeys: any, selectedRows: any) => {
        // console.log(selectedRowKeys,selectedRows)
      }}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
        setSelectedRowKeys(selectedRowKeys)
        // return (
        //   <Space size={16}>
        //     <a onClick={() => Unsubscribe(selectedRowKeys)}>解除预订</a>
        //   </Space>
        // );
      }}
      search={{
        labelWidth: "auto",
        defaultCollapsed: false,
        span: {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 8,
          xl: 8,
          xxl: 6,
        },
      }}

      dateFormatter="string"
      headerTitle="子任务列表"
      toolBarRender={() => [
        // <Access key='add' accessible={access.canPermissions('adv:addTaskPoint')}> onClick={insertPointAction}
        <Button type='primary' onClick={Unsubscribe}>解除预订</Button>
        // </Access>,

      ]}
    />
  </PageContainer>
  )
}