import React from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { request } from 'umi';

interface ExportButtonProps {
  text?: string,
  path: string,
  params?: object
}


const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const { text = '导出', path, params = {} } = props;

  const exportExcel = async () => {
    const { msg } = await request(path, { params });
    window.location.href = `${process.env.PROXY_API  }common/download?fileName=${  encodeURI(msg)  }&delete=${  true}`;
  }

  return (
    <Button key='export' icon={<ExportOutlined />} onClick={() => exportExcel()}>{ text }</Button>
  )
}

export default ExportButton;