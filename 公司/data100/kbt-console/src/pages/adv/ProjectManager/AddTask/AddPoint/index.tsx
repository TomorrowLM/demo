import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  message,
  Upload,
  Button,
  Tooltip,
  Radio,
  Badge,
  Popconfirm,
  Modal,
  Form,
  Drawer,
  Message,
  TreeSelect,
  Card,
  Row,
  Col,
  Space,
  Switch,
  DatePicker,
  Progress,
  Input
} from 'antd';
import { PlusOutlined, EditOutlined, SendOutlined, FormOutlined, MinusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Link, Access, useAccess, history } from 'umi';
import { QueryParams, TableListItem } from './data.d';
import { tableColumnsDatas, templateFiles } from './const.d';
import { getTaskPointList, deletePoints, insertPoints, getPointUploadProgress } from './service';
import { Table } from 'antd';
import UploadOssFiles from '@/components/UploadOssFiles'

import styles from './index.less';
import { Key } from "antd/lib/table/interface";
let copyActionRef: any = null;
let updatePercentId: number = 0;
const taskLabelDataList: object = {};


export default () => {
  const { taskId, taskType, projectId } = history.location.query;
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [selectRowKeys, setSelectRowKeys] = useState<Array<any>>([]);

  const [selectAll, setSelectAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [queryParams, setQueryParams] = useState<QueryParams>();
  const [insertModelVisible, setInsertModelVisible] = useState<Boolean>(false);
  const [insertParams, setInsertParams] = useState<any>({ insertType: '1', pointPath: '', pointTable: '', projectId, taskId, taskType });

  const [percentVisible, setPercentVisible] = useState<Boolean>(false);
  const [updatePercent, setUpdatePercent] = useState(0);
  const [pageSelect, setPageSelect] = useState([]);


  const getQueryParams = (params: any): QueryParams => {
    const { current, pageSize, field, keyword } = params;
    return {
      current,
      pageSize,
      taskId,
      taskType,
      projectId,
      field: field || '',
      keyword: keyword || '',
    }
  }
  useEffect(() => {
    const curColumnsData: Array<any> = tableColumnsDatas[taskType]([])
    for (let i = 0; i < curColumnsData.length; i++) {
      if (curColumnsData[i].title === "关键字") {
        curColumnsData[i] = {
          ...curColumnsData[i],
          renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
            const status = form.getFieldValue('state');
            if (status !== 'open') {
              return (
                // value 和 onchange 会通过 form 自动注入。
                <div style={{ position: 'relative' }}>
                  <Input.TextArea
                    // 组件的配置
                    {...fieldProps}
                    // 自定义配置
                    placeholder="请输入关键字，每行一个，最多1000个"
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    onPressEnter={(e) => {
                      if (form.getFieldValue('keyword') && form.getFieldValue('keyword').split("\n").length >= 1000) {
                        message.info("不能超过1000个")
                        e.preventDefault()
                      }
                    }}
                    onChange={(e: any) => {
                      form.setFieldsValue({ keyword: e.target.value })
                      form.submit = () => {
                        return false

                      }
                    }}
                  />
                  <span style={{ position: 'absolute', bottom: '5px', right: "25px" }}>{form.getFieldValue('keyword') ? form.getFieldValue('keyword').split("\n").length : 0}/1000</span>
                </div>
              );
            }
            return defaultRender(item);
          }
        }
      }
    }

    setColumnsData([...curColumnsData])
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, []);
  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }
  const insertPointAction = () => {
    setUpdatePercent(0)
    insertParams.pointPath = ''
    setPercentVisible(false)
    setInsertModelVisible(true)
  }
  const insertPointActionFinish = () => {
    if (insertParams.pointPath === '') {
      message.warn('请上传点位库文件')
      return
    }
    insertPoints(insertParams).then(res => {
      if (res.code == 200) {
        window.taskReload = true
        setPercentVisible(true)
      } else {
        message.error('更新点位库失败：' + res.msg)
      }
    });

    updatePercentId = window.setInterval(() => {
      getPointUploadProgress(taskId).then(res => {
        if (res.code === 200) {
          setUpdatePercent(res.data * 100)
          if (res.data == 1) {
            window.clearInterval(updatePercentId)
            setInsertModelVisible(false)
            message.success('更新点位库成功')
            reload();
          }
        } else {
          window.clearInterval(updatePercentId)
          setInsertModelVisible(false)
          message.info(res.msg)
        }
      })
    }, 1000);
  }

  const fileOnChange = (fileList: any) => {
    // console.log(fileList)
    let pointPath: any = []
    fileList.forEach((item: any, index: number) => {
      pointPath.push({
        path: item.url,
        name: item.name
      })
    })
    insertParams.pointPath = JSON.stringify(pointPath)
    setInsertParams(insertParams)

  }

  const deleteTaskPointAction = () => {
    if (selectRowKeys && selectRowKeys.length > 0) {
      deletePoints({
        parentTaskId: taskId,
        taskType,
        filed: queryParams?.field,
        keyword: queryParams?.keyword,
        selectType: selectAll ? "1" : "2",
        'pointIds': selectRowKeys.toString()
      }).then(res => {
        if (res.code == 200) {
          Message.success('删除点位成功')
          window.taskReload = true
          // 清空选中项
          actionRef.current.clearSelected();
          reload();
        } else {
          Message.error('删除点位失败：' + res.msg)
        }
      });
    } else {
      Message.warn('请选择任务')
    }
  }

  return (
    <PageContainer title={false}>
      {/* <KeepAlive name="点位库列表" id={ history.location.pathname + history.location.search } saveScrollPosition="screen"> */}
      <div>
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          request={async (params: any) => {
            console.log(params)
            const paramsData = getQueryParams(params);
            setQueryParams(params)
            const { data }: any = await getTaskPointList(paramsData);
            if (taskType == '1') {
              data.monitorPointList.map((item, index) => {
                if (item.cityLevel == '四级') {
                  item.cityLevel = '-'
                }
              })
            }
            if (selectAll) {
              const list = data.monitorPointList
              const pageKey = []
              for (const index in list) {
                pageKey.push(list[index].pointId)
              }
              setPageSelect(pageKey)
            }
            setTotalCount(data.total)
            return Promise.resolve({
              data: data.monitorPointList,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="pointId"
          dateFormatter="string"
          headerTitle=""
          search={{}}
          rowSelection={{
            onChange: (selectedRowKeys) => {
              setPageSelect(selectedRowKeys)
            },
            // 选择全部
            onSelectAll: (selected) => {
              // 是否全部选择
              if (!selected) {
                setPageSelect([])
              }
              setSelectAll(selected)
            },
            // 选择某一个的回调
            // 如果单击了某个条目，那就认为不是全选
            onSelect: () => {
              setSelectAll(false)
            },
            selectedRowKeys: pageSelect,
          }}
          toolBarRender={() => [
            <Access key='add' accessible={access.canPermissions('adv:addTaskPoint')}>
              <Button type='primary' icon={<PlusOutlined />} onClick={insertPointAction}>更新点位</Button>
            </Access>,
            <Access key='delete' accessible={access.canPermissions('adv:deleteTaskPoint')}>
              <Button type='primary' icon={<MinusOutlined />} onClick={deleteTaskPointAction}>删除点位</Button>
            </Access>
          ]}
          tableAlertOptionRender={(selectedRowKeys: { selectedRowKeys: React.SetStateAction<any[]>; }, selectedRows: any) => {
            setSelectRowKeys(selectedRowKeys.selectedRowKeys)
          }}
          tableAlertRender={({ selectedRowKeys }) => {
            return <Space size={24}>
              <span>{selectAll ? (`已经选择全部 ${totalCount} 项`) : (`已选 ${selectedRowKeys.length}项`)}</span>
            </Space>
          }}
        />

        <Modal
          visible={insertModelVisible}
          destroyOnClose={true}
          footer={null}
          title="更新点位库"
          onCancel={e => { setInsertModelVisible(false); window.clearInterval(updatePercentId); }}
        >
          {percentVisible ?
            (
              <Progress percent={updatePercent} />
            ) : (
              <Form
                onFinish={insertPointActionFinish}
              >
                <Form.Item
                  label="类型"
                  initialValue={insertParams.insertType}
                  rules={[{ required: true, message: '请选择类型' }]}
                >
                  <Radio.Group onChange={e => { insertParams.insertType = e.target.value }} defaultValue={insertParams.insertType}>
                    <Radio value="1" ><Tooltip title="上传的点位是本任务的所有点位（包括增加，删除和修改的点位）">全量</Tooltip></Radio>
                    <Radio value="2"><Tooltip title="上传的点位仅为本任务新增或修改的点位）">增量</Tooltip></Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="点位库"
                  initialValue={insertParams.pointPath}
                  rules={[{ required: true, message: '请上传点位库' }]}
                >
                  <div style={{ width: "120px", float: "left" }}>
                    <UploadOssFiles taskId={taskId} onChange={(e) => { fileOnChange(e) }}></UploadOssFiles>
                  </div>
                  {/* <Upload
                  name="file"
                  accept=".xls,.xlsx"
                  action="/adconsole/point/uploadFile"
                  onChange={fileOnChange}
                  className={styles.upbtn}
                  >
                  <Button type="primary">点击上传</Button>
                </Upload> */}
                  <Button type="primary" className={styles.upbtn}><a href={templateFiles[taskType]} target="_blank">下载模版</a></Button>
                </Form.Item>
                <Form.Item className={styles.centerbtn}>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                  <Button onClick={e => { setInsertModelVisible(false) }}>
                    取消
                  </Button>
                </Form.Item>
              </Form>
            )}
        </Modal>
      </div>
      {/* </KeepAlive> */}
    </PageContainer>
  )
}
