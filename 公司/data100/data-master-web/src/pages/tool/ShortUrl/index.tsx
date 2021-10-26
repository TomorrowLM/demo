import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { Button, message } from 'antd';
import { Access, useAccess } from 'umi';
import { RetweetOutlined, PlusOutlined } from '@ant-design/icons';
import CreateModal from '@/components/CreateModal';
import DownloadButton from '@/components/DownloadButton';
import { isXsScreen } from '@/utils/utils';
import { TableListItem } from './data.d';
import { columns } from './const.d';
import { getShortUrlList, shortUrlImport } from './service';
import ShortAddressTrans from './components/ShortAddressTrans';
import LongAddressUpload from './components/LongAddressUpload';
import styles from './index.less';

export interface LongType {
  getValues: () => Array<any>;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const longRef = useRef<LongType>();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [createModalAdd, handleModalAdd] = useState<boolean>(false);
  const [createModalTrans, handleModalTrans] = useState<boolean>(false);

  useEffect(() => {
    setColumnsData(columns(
      {
        title: '操作',
        width: isXsScreen ? 50 : 100,
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_: any, record: any) => [
          <Access key='download' accessible={access.canPermissions('tool:shortUrl:export')}>
            <DownloadButton path={`tool/shortUrl/export/${record.batchId}`} type='text' text={isXsScreen ? '' : '下载'} />
          </Access>
        ],
      }
    ))
  }, []);

  const onHandleOk = async () => {
    const { name, fileList }: any = await longRef.current?.getValues();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', fileList[0]);
    const { msg } = await shortUrlImport(formData);
    handleModalAdd(false);
    message.success(msg);
    actionRef.current?.reload();
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalAdd(false)} onHandleOk={() => onHandleOk()} title='新增短网址' modalVisible={createModalAdd}>
        <LongAddressUpload longRef={longRef} />
      </CreateModal>
      <CreateModal onCancel={() => handleModalTrans(false)} title='短网址转换' modalVisible={createModalTrans}>
        <ShortAddressTrans />
      </CreateModal>
      <ProTable<TableListItem>
        size="small"
        className={styles.proTableBox}
        columns={columnsData}
        actionRef={actionRef}
        request={async (params: any) => {
          const { data }: any = await getShortUrlList(params)
          return Promise.resolve({
            data: data.records,
            total: data.total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="batchId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="短网址"
        search={false}
        options={false}
        toolBarRender={() => [
          <Access key='add1' accessible={access.canPermissions('tool:shortUrl:import')}>
            <Button type="primary" onClick={() => handleModalAdd(true)} icon={<PlusOutlined />}>新增</Button>
          </Access>,
          <Access key='add2' accessible={access.canPermissions('tool:shortUrl:add')}>
            <Button type="primary" onClick={() => handleModalTrans(true)} icon={<RetweetOutlined />}>转换</Button>
          </Access>,
          <Access key='download2' accessible={access.canPermissions('tool:shortUrl:export')}>
            <DownloadButton path="https://wwwtest.taidu8.com/excelDown/BatchTemplate.xlsx" text='下载模版'/>
          </Access>
        ]}
      />
    </PageContainer>
  );
};