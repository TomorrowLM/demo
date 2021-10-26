import React, { useEffect, useState } from 'react';
import CreateModal from '@/components/CreateModal';
import { Table } from 'antd';
import { getLogDetails } from './service';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '变更时间',
    dataIndex: 'time',
    width: 200,
  },
  {
    title: '变更人',
    dataIndex: 'adminName',
    width: 100,
  },
  {
    title: '变更类型',
    dataIndex: 'operateType',
    width: 100,
  },
  {
    title: '变更字段',
    dataIndex: 'unityMatter',
    width: 200,
    render(text: string) {
      if ((/^\[(\S|\s)*\]$/g).test(text)) {
        return JSON.parse(text.replace(/\n/g,";")).map((item: any) => {
          return <div>{ item }</div>
        })
      } 
      return "--"
    }
  },
  {
    title: '变更前',
    dataIndex: 'unityBefore',
    width: 200,
    render(text: string) {
      if ((/^\[(\S|\s)*\]$/g).test(text)) {
        return JSON.parse(text.replace(/\n/g,";")).map((item: any) => {
          return <div>{ item }</div>
        })
      }
      return "--"
    }
  },
  {
    title: '变更后',
    dataIndex: 'unityAfter',
    width: 200,
    render(text: string) {
      if ((/^\[(\S|\s)*\]$/g).test(text)) {
        return JSON.parse(text.replace(/\n/g,";")).map((item: any) => {
          return <div>{ item }</div>
        })
      }
      return "--"
    }
  },
]

interface OperLogProps {
  modalVisible: boolean;
  params: { projectId: string, targetCode: number, createTime?: string, description?: string };
  onCancel: () => void;
}

const OperLog: React.FC<OperLogProps> = (props) => {
  const { modalVisible, params, onCancel } = props;
  const [ dataSource, setDataSource ] = useState<Array<any>>([]);

  useEffect(() => {
    if (modalVisible) {
      getLogDetails(params).then(({ data }) => {
        setDataSource(data);
      })
    }
    return () => {
      setDataSource([]);
    }
  }, [modalVisible]);

  return (
    <CreateModal width={1000} onCancel={() => onCancel()} title='操作日志' modalVisible={modalVisible}>
      <Table size="middle" columns={columns} dataSource={dataSource} scroll={{ x: 'max-content' }} pagination={false} />
    </CreateModal>
  );
};

export default OperLog;
