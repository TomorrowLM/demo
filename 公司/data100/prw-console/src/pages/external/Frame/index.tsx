import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

export default () => {
  const [frameUrl, setFrameUrl] = useState<string>('');

  useEffect(() => {
    const route: any = window.localStorage.getItem(history.location.pathname);
    const oldtoken: string = window.localStorage.getItem('oldtoken') || '';
    const oldAdminId: string = window.localStorage.getItem('oldAdminId') || '';
    setFrameUrl(`${JSON.parse(route)?.frameUrl}${JSON.parse(route)?.frameUrl.indexOf('?')>-1?'&':'?'}token=${oldtoken}&id=${oldAdminId}`)
  }, []);

  return (
    <PageContainer title={false}>
      <iframe title='frame' width='100%' style={{border:"none"}} height={document.body.offsetHeight - 146} src={frameUrl} />
    </PageContainer>
  );
};