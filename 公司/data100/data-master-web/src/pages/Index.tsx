import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import Version from "../pages/system/Log/Version"
interface TimeLineItem {
  createTime: string,
  description: string,
  orderNum: string,
  version: string,
}

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      欢迎使用数据交付平台
    </Card>
    <Card >
      {/* <Version /> */}
    </Card>
  </PageContainer>
);
