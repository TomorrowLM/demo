import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Divider, Table, Select, Form, Modal, Button, Tooltip, Radio, Badge, Popconfirm, Drawer, message, TreeSelect, Card, Row, Col, Space, Switch, DatePicker, Progress } from 'antd';
import { EyeOutlined, MailOutlined, ExclamationCircleOutlined, CaretRightOutlined, PauseOutlined, CloseOutlined, PlusOutlined, EditOutlined, DownloadOutlined, MinusOutlined, BarChartOutlined, UserOutlined,ProfileOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { isXsScreen, formatData } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Link, Access, useAccess, history, createBrowserHistory } from 'umi';
import { TableListItem } from './data.d';
import { tableColumnsData, assistPowerList, assistColumns, previewUrl } from './const.d';
import { getTaskList, deleteTask, updateTaskStatus, getAssistUserList, getTaskAssistant, addTaskAssistant, deleteTaskAssistant, checkTaskAssistantPower, getSystemUserList, templateQueryNameExist, templateSave, checkViewReport } from './service';
import TaskPreview from '@/components/TaskPreview'
import Bus from '@/utils/events';


const { Column } = Table;

import styles from './index.less';
let copyActionRef: any = null;
let copyOfPreviewRef: any = null;
const taskLabelDataList: object = {};

export default () => {
  const { projectId, customerId, projectName, taskType } = history.location.query;
  const actionRef = useRef<ActionType>();
  const previewRef = useRef();
  const assistFormRef = useRef();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [taskLabelData, setTaskLabelData] = useState<any>(taskLabelDataList[projectId]);
  const [selectRowKeys, setSelectRowKeys] = useState<Array<any>>([]);

  const [assistVisible, setAssistVisible] = useState<boolean>(false);
  const [assistList, setAssistList] = useState<Array<any>>([]);
  const [addedAssistList, setAddedAssistList] = useState<Array<any>>([]);

  const [taskId, setTaskId] = useState();
  const [userList, setUserList] = useState<Array<any>>([]);
  const [saveAsTemplateVisible, setSaveAsTemplateVisible] = useState<boolean>(false);


  const saveJumpTaskPath = () => {
    window.jumpTaskPath = history.location.pathname + history.location.search
  }

  const taskPublishSuccess = (record: Object) => {
    Modal.confirm({
      title: '提示',
      closable: true,
      icon: <ExclamationCircleOutlined />,
      content: '问卷发布成功',
      okText: '发送邮件通知',
      cancelText: '问卷存为模板',
      destroyOnClose: true,
      onOk: (e) => {
        let url = '/adv/projectManager/sendEmail?projectId=' + projectId + '&taskId=' + record.taskId
        history.push(url)
        e();
      },
      onCancel: (e) => {
        if (e.triggerCancel) {
        } else {
          setSaveAsTemplateVisible(true)
          e();
        }
      }
    });
  }
  const saveAsTemplateActionFinish = (params: any) => {
    params.userIds = params.userIds.toString()
    params['taskId'] = taskId
    templateQueryNameExist(params.templateName).then(res => {
      if (res.code === 200) {
        templateSave(params).then(res2 => {
          if (res2.code === 200) {
            message.success('模板保存成功')
            setSaveAsTemplateVisible(false)
          } else {
            message.error(res2.msg)
          }
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  const taskPublish = (record: any, status: string) => {
    if (record.pointFile && record.pointFile.length > 1) {
      let at
      let msg
      let title
      switch (status) {
        case '1':
          at = '发布'
          title = '确定发布所选任务吗？'
          msg = ''
          break;
        case '2':
          at = '暂停'
          title = '暂停后该任务将被临时下架'
          msg = '即执行人员在app上看不到该任务，已预约的任务状态将变为“已下架”，执行人员将无法做任务'
          break;
        case '3':
          at = '关闭'
          title = '关闭后该任务将被永久下架'
          msg = '永久下架任务将无法进行修改，系统也会立即把所有任务审核结果以APP通知形式推送给用户'
          break;
      }
      if (at) {
        Modal.confirm({
          title: title,
          icon: <ExclamationCircleOutlined />,
          content: msg,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            updateTaskStatus(record.taskId, status).then(res => {
              if (res.code == 200) {
                reload();
                if (status === '1') {
                  setTaskId(record.taskId)
                  taskPublishSuccess(record)
                } else {
                  message.success(at + "任务成功")
                }
                return true;
              } else {
                message.error(at + "任务失败：" + res.msg)
              }
            })
          }
        });
      }
    } else {
      message.warn("请先上传点位库")
    }
  };

  const addAssist = () => {
    if (selectRowKeys && selectRowKeys.length > 0) {
      if (selectRowKeys.length > 1) {
        checkTaskAssistantPower(selectRowKeys.toString()).then(res => {
          if (res.code === 200) {
            setAddedAssistList([])
            setAssistVisible(true)
            loadAddedAssistant()
          } else {
            message.error('校验任务失败：' + res.msg)
          }
        })
      } else {
        setAddedAssistList([])
        setAssistVisible(true)
        loadAddedAssistant()
      }
    } else {
      message.warn('请选择任务')
    }
  }

  const assistActionFinish = (params: any) => {
    params['powerIds'] = params['powerIds'].toString();
    params['taskId'] = selectRowKeys.toString();
    addTaskAssistant(params).then(res => {
      if (res.code == 200) {
        message.success('添加协管员成功')
        if (assistFormRef.current) {
          assistFormRef.current.resetFields()
        }
        setAddedAssistList([])
        loadAddedAssistant()
      } else {
        message.error('添加协管员失败：' + res.msg)
      }
    })
  }

  const loadAddedAssistant = () => {
    let taskIds = selectRowKeys.toString();
    getTaskAssistant(taskIds).then(res => {
      if (res.code == 200) {
        setAddedAssistList(res.data)
      } else {
        message.error('查询协管员失败：' + res.msg)
      }
    })
  }

  const deleteAS = (record: any) => {
    let params = { taskId: record.taskId, userId: record.userId };
    deleteTaskAssistant(params).then(res => {
      if (res.code == 200) {
        message.success('删除协管员成功')
        loadAddedAssistant()
        reload()
      } else {
        message.error('删除协管员失败：' + res.msg)
      }
    })
  }

  const getQueryParams = (params: any): QueryParams => {
    const { current, pageSize, taskName } = params;
    return {
      current,
      pageSize,
      projectId,
      taskName: taskName || ''
    }
  }

  const getCheckViewReport = (record) => {
    checkViewReport(record.taskId).then(res => {
      if (res.code == 200) {
        history.push('/adv/ApprovalCenter/ViewReport?projectId=' + projectId + '&projectName=' + projectName + '&customerId=' + customerId + '&taskId=' + record.taskId + '&taskType=' + record.taskType)
      } else {
        message.error(res.msg)
      }
    })
  }

  const option = {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        {(record.taskStatus === '1' || record.taskStatus === '2' || record.taskStatus === '3' || record.taskStatus === '4') ?
          <Tooltip getPopupContainer={toolTipDiv} title='报告'>
            <Button type="text" onClick={e => { getCheckViewReport(record) }} icon={<BarChartOutlined style={{ color: '#7979f5' }} />}></Button>
          </Tooltip> : <Tooltip getPopupContainer={toolTipDiv} title='新建状态不能查看报告'><BarChartOutlined style={{ color: 'rgba(0, 0, 0, 0.30)' }} /></Tooltip>
        }
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        {(record.taskStatus === '1' || record.taskStatus === '2' || record.taskStatus === '3' || record.taskStatus === '4') ?
          <Link to={{
            pathname: `/adv/approvalCenter`,
            search: `?projectId=${projectId}&projectName=${projectName}&customerId=${customerId}&taskId=${record.taskId}&taskType=${record.taskType}`,
          }}>
            <Tooltip getPopupContainer={toolTipDiv} title='审批'><UserOutlined /></Tooltip>
          </Link> : <Tooltip getPopupContainer={toolTipDiv} title='新建状态不能审批'><UserOutlined style={{ color: 'rgba(0, 0, 0, 0.30)' }} /></Tooltip>
        }
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        {(record.taskStatus === '2' || record.taskStatus === '0' || record.taskStatus === '3') ?
          <Link disabled={record.taskStatus === '3'} to={{
            pathname: `/adv/projectManager/addTaskDetail`,
            search: `?projectId=${projectId}&projectName=${projectName}&customerId=${customerId}&taskId=` + record.taskId,
          }} onClick={saveJumpTaskPath}>
            <Tooltip getPopupContainer={toolTipDiv} title='修改'><EditOutlined /></Tooltip>
          </Link> : <Tooltip getPopupContainer={toolTipDiv} title='暂停后才可以修改'><EditOutlined style={{ color: 'rgba(0, 0, 0, 0.30)' }} /></Tooltip>
        }
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        <a onClick={() => { taskPublish(record, '1') }} disabled={record.taskStatus === '1' || record.taskStatus === '3'}><Tooltip getPopupContainer={toolTipDiv} title='发布'><CaretRightOutlined /></Tooltip></ a>
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        <a onClick={() => { taskPublish(record, '2') }} disabled={record.taskStatus === '2' || record.taskStatus === '3' || record.taskStatus === '0'}><Tooltip getPopupContainer={toolTipDiv} title='暂停'><PauseOutlined /></Tooltip></ a>
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        <a onClick={() => { taskPublish(record, '3') }} disabled={record.taskStatus === '3' || record.taskStatus === '0'}><Tooltip getPopupContainer={toolTipDiv} title='关闭'><CloseOutlined /></Tooltip></ a>
      </Access>,
      <Access key='subtasks' accessible={access.canPermissions('adv:addTask')}>
          <Link to={{
            pathname: `/adv/projectManager/AddTask/subtasks`,
            search: `?taskId=` + record.taskId,
          }}>
            <Tooltip getPopupContainer={toolTipDiv} title='子任务列表'><ProfileOutlined /></Tooltip>
          </Link>
    </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        {record.pointFile && record.pointFile.length > 1 ?
          (<Link to={{
            pathname: `/adv/projectManager/previewTask`,
            search: `?taskId=` + record.taskId,
          }}>
            <Tooltip getPopupContainer={toolTipDiv} title='预览'><EyeOutlined /></Tooltip>
          </Link>) :
          (<Tooltip getPopupContainer={toolTipDiv} title='上传点位库后才可以预览'><EyeOutlined style={{ color: 'rgba(0, 0, 0, 0.30)' }} /></Tooltip>)
        }
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
        <Link to={{
          pathname: `/adv/projectManager/addEmail`,
          search: `?projectId=${record.projectId}&taskId=${record.taskId}`,
        }}>
          <Tooltip getPopupContainer={toolTipDiv} title='邮件列表' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><MailOutlined /></Tooltip>
        </Link>
      </Access>,

    ],
  }

  useEffect(() => {
    getAssistUserList().then(res => {
      if (res.code == 200) {
        let au = formatData(res.data, { userId: 'value', userName: 'label' });
        setAssistList(au)
      }
    })
    getSystemUserList().then(res => {
      if (res.code == 200) {
        let au = formatData(res.data, { adminId: 'value', nickName: 'label' });
        setUserList(au)
      }
    })
    if (actionRef.current != null && window.taskReload) {
      window.taskReload = false
      reload()
    }

    return () => {
      if (previewRef.current) {
        copyOfPreviewRef = previewRef;
      }
    }
  }, [])

  useEffect(() => {
    const curColumnsData: Array<any> = tableColumnsData(
      {
        title: '点位库',
        width: 180,
        dataIndex: 'pointFile',
        align: 'left',
        search: false,
        render: (text: any, r: any) => {
          // debugger
          let c = text == '-' ? '待上传' : (text.indexOf("[") != -1 ? JSON.parse(text) : text);
          if (Array.isArray(c) && c.length > 0) {
            return c.map((item: any, index: number) => {
              return <div key={index}>
                <Link to={{
                  pathname: `/adv/projectManager/addPoint`,
                  search: '?projectId=' + r.projectId + '&taskId=' + r.taskId + '&taskType=' + r.taskType,
                }}>
                  {item.name}
                </Link>
                <Tooltip getPopupContainer={toolTipDiv} title='下载' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><a href={item.path} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", margin: "0 0 0 10px", fontSize: "18px" }}><DownloadOutlined /></a></Tooltip>
              </div>
            })
          } else {
            if (c == "待上传") {
              return <Link to={{
                pathname: `/adv/projectManager/addPoint`,
                search: '?projectId=' + r.projectId + '&taskId=' + r.taskId + '&taskType=' + r.taskType,
              }}>
                待上传
                </Link>
            } else {
              return c.split(",").map((item: string, index: number) => {
                return <div key={index}>
                  <Link to={{
                    pathname: `/adv/projectManager/addPoint`,
                    search: '?projectId=' + r.projectId + '&taskId=' + r.taskId + '&taskType=' + r.taskType,
                  }}>
                    {item}
                  </Link>
                </div>
              })
            }


          }
        }
      },
      (text:any,record:any)=>{
        return <div>
          <span>{text}</span>
          <a href={record.failPointUrl} download>{record.failPointUrl}</a>
        </div>
      }
    )

    setColumnsData([...curColumnsData, option])
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, [projectId]);
  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }
  const preview = (taskId) => {
    const current = previewRef.current || copyOfPreviewRef.current;
    current?.perview(taskId);
  }

  const preview_ = (record) => {
    if (record.pointFile == null || record.pointFile == '') {
      message.warn('请先上传点位')
    } else {
      preview(record.taskId)
    }
  }

  const deleteTaskAction = () => {
    if (selectRowKeys && selectRowKeys.length > 0) {
      deleteTask({ 'taskIds': selectRowKeys.toString() }).then(res => {
        if (res.code == 200) {
          message.success('删除任务成功')
          reload();
        } else {
          message.error('删除任务失败：' + res.msg)
        }
      });
    } else {
      message.warn('请选择任务')
    }
  }
  const toolTipDiv = () => {
    return document.getElementById('taskListToolTipDiv')
  }

  return (
    <PageContainer title={false}>
      <KeepAlive name="任务列表" id={history.location.pathname + history.location.search} saveScrollPosition="screen">
        <div id="taskListToolTipDiv">
          <ProTable<TableListItem>
            size="small"
            className={styles.proTableBox}
            columns={columnsData}
            actionRef={actionRef}
            request={async (params: any) => {
              const paramsData = getQueryParams(params);
              const { data }: any = await getTaskList(paramsData);
              taskLabelDataList[projectId] = data;
              data.taskList.forEach((item) => {
                item['projectId'] = projectId;
                item['pointProgress'] = (item['pointProgress'] * 100).toFixed(2);
                item['auditProgress'] = (item['auditProgress'] * 100).toFixed(2);
                if (item['completeRate'] == null) {
                  item['completeRate'] = 0
                }
                item['completeRate'] = (Number(item['completeRate']) * 100).toFixed(2);
              });
              setTaskLabelData(data);
              return Promise.resolve({
                data: data.taskList,
                total: data.total,
                success: true,
              });
            }}
            scroll={{ x: 'max-content' }}
            rowKey="taskId"
            dateFormatter="string"
            headerTitle={projectName}
            search={true}
            rowSelection={{
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            }}
            toolBarRender={() => [
              <Access key='add' accessible={access.canPermissions('adv:addTask')}>
                <Link to={{
                  pathname: `/adv/projectManager/addTaskDetail`,
                  search: `?projectId=${projectId}&projectName=${projectName}&customerId=${customerId}`,
                }} onClick={saveJumpTaskPath}>
                  <Button type='primary' icon={<PlusOutlined />}>新建监播任务</Button>
                </Link>
              </Access>,
              <Access key='add' accessible={access.canPermissions('adv:addTask')}>
                <Button type='primary' icon={<PlusOutlined />} onClick={addAssist}>添加协管员</Button>
              </Access>,
              <Access key='delete' accessible={access.canPermissions('adv:deleteTask')}>
                <Button type='primary' icon={<MinusOutlined />} onClick={deleteTaskAction}>删除监播任务</Button>
              </Access>
            ]}
            tableAlertOptionRender={(selectedRowKeys, selectedRows) => {
              setSelectRowKeys(selectedRowKeys.selectedRowKeys)
            }}
          />

          <Modal
            visible={assistVisible}
            closable={true}
            footer={null}
            destroyOnClose={true}
            title="添加协管员"
            onCancel={e => { setAssistVisible(false); reload(); }}
          >
            <Form
              ref={assistFormRef}
              onFinish={assistActionFinish}
            >
              <Form.Item
                label="协管员"
                name="userId"
                rules={[{ required: true, message: '请选择协管员' }]}
              >
                <Select options={assistList} style={{ width: 320 }} />
              </Form.Item>

              <Form.Item
                label="&nbsp;&nbsp;&nbsp;权限"
                name="powerIds"
                rules={[{ required: true, message: '请选择权限' }]}
              >
                <Select options={assistPowerList} mode='multiple' style={{ width: 320 }} />
              </Form.Item>
              <Divider />
              <Table dataSource={addedAssistList} pagination={false}>
                <Column title="协管员" dataIndex="userName" key="userName" />
                <Column title="权限" dataIndex="powerIds" key="powerIds"
                  render={(powerIds, record) => {
                    let as = powerIds.split(',')
                    let text = '';
                    as.map(a => {
                      if (text.length > 0) {
                        text += ','
                      }
                      text += a == '1' ? '查看' : (a == '2' ? '编辑' : '删除')
                    })
                    return text
                  }}
                />
                <Column
                  title="操作"
                  key="action"
                  render={(text, record) => (
                    <Space size="middle">
                      <Button shape="circle" size="small" icon={<MinusOutlined />} onClick={e => { deleteAS(record) }} />
                    </Space>
                  )}
                />
              </Table>
              <Form.Item className={styles.centerbtn}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button onClick={e => { setAssistVisible(false); reload(); }}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal visible={saveAsTemplateVisible}
            footer={null}
            destroyOnClose={true}
            title="另存为模板"
            closable={true}
            onCancel={e => { setSaveAsTemplateVisible(false) }}>
            <Form
              onFinish={saveAsTemplateActionFinish}
            >
              <Form.Item
                label="模板名称"
                name="templateName"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input style={{ width: 320 }} />
              </Form.Item>

              <Form.Item
                label="模板可见账户"
                name="userIds"
              >
                <Select options={userList} mode='multiple' style={{ width: 320 }} />
              </Form.Item>
              <Form.Item className={styles.centerbtn}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button onClick={e => { setSaveAsTemplateVisible(false) }}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <TaskPreview previewRef={previewRef}></TaskPreview>
        </div>
      </KeepAlive>
    </PageContainer>
  )
}
