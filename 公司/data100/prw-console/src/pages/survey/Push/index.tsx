import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Tooltip, Radio, Badge, Popconfirm, Drawer, message, Card, Row, Col, Space, Switch, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined, FormOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import DownloadButton from '@/components/DownloadButton';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Access, useAccess, history } from 'umi';
import { TableListItem } from './data.d';
import { tableColumnsData, statusValueEnum } from './const.d';
import { getSurveyLabelGroupList, updateSurveyLabelRelEntity, updateStatus, updateLimiting } from './service';
import PrecisePush from './PrecisePush';
import styles from './index.less';

const formatDateParams = (date: moment.MomentInput, mat = 'YYYY-MM-DD') => { return moment(date).format(mat) };
const { RangePicker } = DatePicker;
let editStatus: string = '';
let copyActionRef: any = null;
const surveyLabelDataList: object = {};

export default () => {
  const { surveyId } = history.location.query;
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [title, setTitle] = useState<string>('');
  const [pushId, setPushId] = useState<string>('');
  const [isCopy, setIsCopy] = useState<Boolean>(false);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [pushVisible, setPushVisible] = useState<any>(false);
  const [userRegTime, setUserRegTime] = useState<any>(null);
  const [allUserShowTime, setAllUserShowTime] = useState<any>(null);
  const [surveyLabelData, setSurveyLabelData] = useState<any>(surveyLabelDataList[surveyId]);

  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }

  /**
   * 更改推送状态
   * @param id
   */
  const editPushStatus = async (id: string) => {
    await updateSurveyLabelRelEntity({ id, state: editStatus });
    message.success('修改成功');
    reload();
  }

  const updatePushStatus = async (checked: Boolean, type: string) => {
    const dateParams = {
      userRegTimeStart: userRegTime || surveyLabelData.userRegTimeStart ? formatDateParams(userRegTime ? userRegTime[0] : surveyLabelData.userRegTimeStart) : '',
      userRegTimeEnd: userRegTime || surveyLabelData.userRegTimeEnd ? formatDateParams(userRegTime ? userRegTime[1] : surveyLabelData.userRegTimeEnd) : '',
      allUserShowTime: allUserShowTime || surveyLabelData.allUserShowTime ? formatDateParams(allUserShowTime || surveyLabelData.allUserShowTime, 'YYYY-MM-DD HH:mm:ss') : ''
    }
    const params = {
      surveyId,
      type,
      status: checked ? 1 : 0
    }
    const { msg } = await updateStatus(type === '2' ? { ...params, ...dateParams } : params);
    message.success(msg);
    reload();
  }

  const updataPushLimiting = async (checked: Boolean) => {
    const params = { flag: checked ? 1 : 0, surveyId }
    const { msg } = await updateLimiting(params);
    message.success(msg);
    reload();
  }

  const option = {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='edit' accessible={access.canPermissions('project:survey:surveyLabel')}>
        <a onClick={() => {setPushVisible(true);setTitle('编辑推送');setPushId(record.id);setIsCopy(false)}}><Tooltip title='修改'><EditOutlined /></Tooltip></a>
      </Access>,
      <Access key='copy' accessible={access.canPermissions('project:survey:surveyLabel')}>
        <a onClick={() => {setPushVisible(true);setTitle('复制推送');setPushId(record.id);setIsCopy(true)}}><Tooltip title='复制'><CopyOutlined /></Tooltip></a>
      </Access>,
      <Access key='download' accessible={access.canPermissions('project:survey:surveyLabel')}>
        <Tooltip title='下载用户ID列表'>
          <span><DownloadButton params={{ groupId: record.conditionId }} type="text" showIcon downloadCenter path='surveyLabel/downloadUserId' text='' /></span>
        </Tooltip>
      </Access>
    ],
  }

  useEffect(() => {
    const curColumnsData: Array<any> = tableColumnsData(
      [
        {
          title: '状态',
          width: 100,
          dataIndex: 'state',
          align: 'left',
          order: 7,
          valueEnum: statusValueEnum,
          hideInTable: !access.canPermissions('project:survey:surveyLabel'),
          render: (_: any, record: any) => {
            const radio = Object.keys(statusValueEnum).map((key: string) => {
              return <Radio key={`status${key}`} value={key}>{ statusValueEnum[key].text }</Radio>
            })
            return <div key={`popconfirm${record.id}`}>
              <Badge status={statusValueEnum[record.state].status} text={statusValueEnum[record.state].text} />
              { record.state !== 2 ? <Popconfirm destroyTooltipOnHide onConfirm={() => editPushStatus(record.id)} title={
                <div className={styles.popconfirmBox}>
                  <h3>请选择状态：</h3>
                  <Radio.Group defaultValue={`${record.state}`} onChange={(e) => { editStatus = e.target.value }}>
                    { radio }
                  </Radio.Group>
                </div>
              } icon={<FormOutlined />}>
                <a style={{ marginLeft: 20 }} onClick={() => { editStatus = record.state }}><FormOutlined /></a>
              </Popconfirm> : null }
            </div>
          }
        }
      ]
    )
   
    setColumnsData([...curColumnsData, option])
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, [surveyId]);

  return (
    <PageContainer title={false}>
      <Drawer title={title} width={isXsScreen ? '100%': '70%'} placement="right" onClose={() => setPushVisible(false)} visible={pushVisible}>
        { pushVisible ? <PrecisePush id={pushId} isCopy={isCopy} onSuccess={() => {reload();setPushVisible(false);}} /> : null }
      </Drawer>
      <KeepAlive name="精准推送" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <div>
          <Card style={{ marginBottom: 16 }}>
            { surveyLabelData ? <Row gutter={[0, 10]} style={{ margin: 0 }}>
              <Col lg={8} xs={24}>
                <Space>
                  <span className={styles.label}>精准推送限制(关闭后所有用户可见)：</span>
                  <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={surveyLabelData.hasCondition} onChange={e => updatePushStatus(e, '0')} />
                </Space>
              </Col>
              <Col lg={8} xs={24}>
                <Space>
                  <span className={styles.label}>新用户(注册1天内)无视精准推送：</span>
                  <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={surveyLabelData.newuserIgnoreCondition} onChange={e => updatePushStatus(e, '1')} />
                </Space>
              </Col>
              <Col lg={8} xs={24}>
                <Space>
                  <span className={styles.label}>是否限流：</span>
                  <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={surveyLabelData.limiting} onChange={e => updataPushLimiting(e)} />
                </Space>
              </Col>
              <Col lg={8} xs={24}>
                <Space>
                  <span className={styles.label}>问卷部分用户可见：</span>
                  <Switch checkedChildren="开" unCheckedChildren="关" checked={surveyLabelData.someuserShow} onChange={e => {
                    if (surveyLabelData.hasCondition === 1) {
                      message.info('此问卷已设置精准推送，不可开启此按钮');
                    } else if (e) {
                      setSurveyLabelData({ ...setSurveyLabelData, someuserShow: e ? 1 : 0 });
                      message.warning('按钮开启后需要立即设置准确的显示时间，否则按钮功能将失效！', 2);
                    } else {
                      updatePushStatus(e, '2')
                    }
                  }} />
                </Space>
              </Col>
              { surveyLabelData.someuserShow ? <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>用户注册时间：</span>
                  <RangePicker defaultValue={surveyLabelData.userRegTimeStart ? [ moment(surveyLabelData.userRegTimeStart), moment(surveyLabelData.userRegTimeEnd) ] : null} onChange={e => setUserRegTime(e)} />
                  <DatePicker showTime defaultValue={surveyLabelData.allUserShowTime ? moment(surveyLabelData.allUserShowTime) : undefined} onOk={e => setAllUserShowTime(e)} />
                  <span className={styles.label}>后对所有用户可见</span>
                  <Button type="primary" onClick={() => {
                    updatePushStatus(surveyLabelData.someuserShow, '2')
                  }}>保存</Button>
                </Space>
              </Col> : null }
            </Row> : null }
          </Card>
          <ProTable<TableListItem>
            size="small"
            className={styles.proTableBox}
            columns={columnsData}
            actionRef={actionRef}
            request={async () => {
              const { data }: any = await getSurveyLabelGroupList({ surveyId });
              surveyLabelDataList[surveyId] = data;
              setSurveyLabelData(data);
              return Promise.resolve({
                data: data.list,
                success: true,
              });
            }}
            scroll={{ x: 'max-content' }}
            rowKey="conditionId"
            pagination={false}
            dateFormatter="string"
            headerTitle="精准推送"
            search={false}
            options={false}
            toolBarRender={() => [
              <Access key='add' accessible={access.canPermissions('project:survey:surveyLabel')}>
                <Button type='primary' icon={<PlusOutlined />} onClick={() => {setPushVisible(true);setTitle('添加推送');setPushId('');setIsCopy(true)}}>添加</Button>
              </Access>,
            ]}
          />
        </div>
      </KeepAlive>
    </PageContainer>
  )
}