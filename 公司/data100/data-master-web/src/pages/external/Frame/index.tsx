import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

export default () => {
  const [frameUrl, setFrameUrl] = useState<string>('');

  useEffect(() => {
    const route: any = window.localStorage.getItem(history.location.pathname);
    setFrameUrl(JSON.parse(route)?.frameUrl)
  }, []);

  return (
    <PageContainer title={false}>
      <iframe title='frame' width='100%' height={document.body.offsetHeight - 146} src={frameUrl} />
    </PageContainer>
  );
};