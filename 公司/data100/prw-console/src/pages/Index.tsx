import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Timeline } from 'antd';
import Version from "../pages/system/Log/Version"
interface TimeLineItem {
  createTime: string,
  description: string,
  orderNum: string,
  version: string,
}
export default (): React.ReactNode => {
  return (
    <PageContainer>
      <Card>
        欢迎使用拼任务控制台
      </Card>
      <Card >
        <Version />
      </Card>
    </PageContainer>
  )
};
