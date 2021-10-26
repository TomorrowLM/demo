import React, {useEffect, useState, useRef} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message,Upload, Button, Tooltip, Radio, Badge, Popconfirm,Modal,Form, Drawer, TreeSelect, Card, Row, Col, Space, Switch, DatePicker,Progress } from 'antd';
import { PlusOutlined, EditOutlined, SendOutlined, FormOutlined, MinusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Link, Access, useAccess, history } from 'umi';
import { TableListItem } from './data.d';
import { tableColumnsData } from './const.d';
import { getTaskPointList, deletePoints, insertPoints } from './service';
import { Table } from 'antd';

import styles from './index.less';
let copyActionRef: any = null;
const taskLabelDataList: object = {};

export default () => {
  const fromRef = useRef(null);
  const { taskId, taskType, projectId } = history.location.query;
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [selectRowKeys, setSelectRowKeys] = useState<Array<any>>([]);


  const [insertModelVisible, setInsertModelVisible] = useState<Boolean>(false);
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [insertType, setInsertType] = useState<string>('1');

  useEffect(() => {
    const curColumnsData: Array<any> = tableColumnsData([])
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
    setInsertModelVisible(true)
  }
  const insertPointActionFinish = () => {
    let formData = new FormData();
    fileList.forEach(file => {
      formData.append('pointPath', file);
    });
    formData.append('taskId', taskId);
    formData.append('taskType', taskType);
    formData.append('projectId', projectId);
    formData.append('insertType', insertType);
    formData.append('pointTable', '');

    insertPoints(formData).then(res => {
        if (res.code==200) {
          message.success('更新点位库成功')
          reload();
          setInsertModelVisible(false)
        } else {
          message.error('更新点位库失败：'+res.msg)
        }
    });
  }

    const deleteTaskPointAction = () => {
      if (selectRowKeys && selectRowKeys.length>0) {
          deletePoints({
            parentTaskId:taskId,
            taskType,
            'pointIds':selectRowKeys.toString()}).then(res => {
            if (res.code==200) {
              message.success('删除点位成功')
              reload();
            } else {
              message.error('删除点位失败：'+res.msg)
            }
        });
      } else {
        message.warn('请选择任务')
      }
    }


    const fileRemove = (file) => {
      let index = fileList.indexOf(file);
      let newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    }
    const fileBefore = (file) => {
      let { name } = file;
      var fileExtension = name.substring(name.lastIndexOf('.') + 1);
      fromRef.current.setFieldsValue({ 'filename': name, 'filetype': fileExtension });//选择完文件后把文件名和后缀名自动填入表单
      let newFileList = fileList.slice();
      newFileList.push(file);
      setFileList(newFileList);
      return false;
    }

  return (
    <PageContainer title={false}>
      <KeepAlive name="点位库列表" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <div>
          <ProTable<TableListItem>
            size="small"
            className={styles.proTableBox}
            columns={columnsData}
            actionRef={actionRef}
            request={async () => {
              const { data }: any = await getTaskPointList({ taskId,taskType });
              return Promise.resolve({
                data: data.monitorPointList,
                total: data.total,
                success: true,
              });
            }}
            scroll={{ x: 'max-content' }}
            rowKey="pointId"
            pagination={true}
            dateFormatter="string"
            headerTitle=""
            search={true}
            options={false}
            rowSelection={{
                selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
           }}
            toolBarRender={() => [
              <Access key='add' accessible={access.canPermissions('adv:addTaskPoint')}>
                <Button type='primary' icon={<PlusOutlined />} onClick={insertPointAction}>更新点位</Button>
              </Access>,
              <Access key='delete' accessible={access.canPermissions('adv:deleteTaskPoint')}>
                <Button type='primary' icon={<MinusOutlined />} onClick={deleteTaskPointAction}>删除点位</Button>
              </Access>
            ]}
            tableAlertOptionRender={(selectedRowKeys, selectedRows) => {
                   setSelectRowKeys(selectedRowKeys.selectedRowKeys)
            }}
          />

          <Modal
            visible={insertModelVisible}
            footer={null}
            title="更新点位库"
            onCancel={e=>{setInsertModelVisible(false)}}
          >
            <Form
              ref={fromRef}
                  onFinish={insertPointActionFinish}
                >
                  <Form.Item
                    label="类型"
                    initialValue={insertType}
                    rules={[{ required: true, message: '请选择类型' }]}
                  >
                      <Radio.Group onChange={e=>{setInsertType(e)}} defaultValue={insertType}>
                            <Radio value="1">全量</Radio>
                            <Radio value="2">增量</Radio>
                      </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="点位库"
                    initialValue={fileList}
                    rules={[{ required: true, message: '请上传点位库' }]}
                  >
                    <Upload
                     name="pointPath"
                     accept=".xls,.xlsx"
                     fileList={fileList}
                     onRemove={fileRemove}
                     beforeUpload={fileBefore}
                     >
                     <Button type="primary">点击上传</Button>
                     </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      确定
                    </Button>
                    <Button onClick={e=>{setInsertModelVisible(false)}}>
                      取消
                    </Button>
                  </Form.Item>
                </Form>
          </Modal>
        </div>
      </KeepAlive>
    </PageContainer>
  )
}
