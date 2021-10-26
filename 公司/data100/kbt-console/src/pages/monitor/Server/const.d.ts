
import { ProColumns } from '@ant-design/pro-table';

export const cpuColumns: object[] = [
  {
    title: '属性',
    dataIndex: 'label',
    align: 'left'
  },
  {
    title: '值',
    dataIndex: 'value',
    align: 'left',
  },
];

export const memColumns: object[] = [
  {
    title: '属性',
    dataIndex: 'label',
    align: 'left'
  },
  {
    title: '内存',
    dataIndex: 'mem',
    align: 'left',
  },
  {
    title: 'JVM',
    dataIndex: 'jvm',
    align: 'left',
  },
];

export const sysFilesColumns: object[] = [
  {
    title: '盘符路径',
    dataIndex: 'dirName',
    align: 'left',
    width: 150,
    fixed: 'left'
  },
  {
    title: '文件系统',
    dataIndex: 'sysTypeName',
    align: 'left',
    width: 150
  },
  {
    title: '盘符类型',
    dataIndex: 'typeName',
    align: 'left',
    width: 150
  },
  {
    title: '总大小',
    dataIndex: 'total',
    align: 'left',
    width: 150
  },
  {
    title: '可用大小',
    dataIndex: 'free',
    align: 'left',
    width: 150
  },
  {
    title: '已用大小',
    dataIndex: 'used',
    align: 'left',
    width: 150
  },
  {
    title: '已用百分比',
    dataIndex: 'usage',
    align: 'left',
    width: 150
  },
];