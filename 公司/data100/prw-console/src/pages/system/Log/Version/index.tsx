import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Timeline, Card } from 'antd';
import { getVersionlogList } from './service';
import styles from './index.less';

export default () => {
  const [versionList, setVersionList] = useState<Array<any>>([]);

  useEffect(() => {
    getVersionlogList().then(({ data }) => {
      setVersionList(data)
    })
  }, []);

  return (
    <PageContainer title={false}>
      <Card bordered={false}>
        <Timeline>
          {
            versionList.map(item => {
              return <Timeline.Item key={item.version}>
                <div className={styles.timeline}>
                  <h3>{ item.version }</h3>
                  <p><code>{ item.createTime }</code></p>
                  <ul>
                    {
                      item.description.split(/[\|]/).map((des: React.ReactNode) => {
                        return des ? <li>{ des }</li> : ''
                      })
                    }
                  </ul>
                </div>
              </Timeline.Item>
            })
          }
        </Timeline>
      </Card>
    </PageContainer>
  );
};