import React from 'react';
import { useHistory, useLocation } from 'umi';
import { useAliveController } from 'react-activation';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

interface TabProps {
}

const Tab: React.FC<TabProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const { getCachingNodes, dropScope } = useAliveController();
  const cachingNodes: any = getCachingNodes ? getCachingNodes() : [];

  // const hash = {};
  // const cachingList = cachingNodes.reduce((item: any[], next: { id: string; })=>{
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   hash[next.id.slice(0, next.id.length - 2)] ? '' : hash[next.id.slice(0, next.id.length - 2)] = true && item.push(next);
  //   return item;
  // }, []);

  const dropTab = (targetKey: any) => {
    const { name, id } = cachingNodes.find((node: any) => node.id.slice(0, node.id.length - 2) === targetKey);

    // 如果关闭激活中的 KeepAlive Tab，需要先离开当前路由
    // 触发 KeepAlive unactivated 后再进行 drop
    if (location.pathname + location.search === id.slice(0, id.length - 2)) {
      const unlisten = history.listen(() => {
        setTimeout(() => {
          dropScope(name);
        }, 60)
      })

      unlisten();

      if (cachingNodes.length > 1) {
        // 前往排除当前 node 后的最后一个 tab
        const lastNode = cachingNodes.filter((node: { name: any; }) => node.name !== name).pop();
        history.push(
          lastNode.id.slice(0, lastNode.id.length - 2) || ''
        )
      }
    } else {
      dropScope(name);
    }
  }

  const onEdit = (targetKey: any, action: any) => {
    if (action === 'remove') {
      dropTab(targetKey);
    }
  }
 
  const onTabClick= (targetKey: any) => {
    const { id } = cachingNodes.find((node: any) => node.id.slice(0, node.id.length - 2) === targetKey);
    history.push(id.slice(0, id.length - 2) || '');
  }

  return (
    <Tabs
      style={{ margin: '8px 0 0 0' }}
      type="editable-card"
      hideAdd
      activeKey={location.pathname + location.search}
      onEdit={onEdit}
      onTabClick={onTabClick}
    >
      {cachingNodes.map((node: { name: string; id: string; }) => (
        <TabPane tab={node.name.split('-')[0]} key={node.id.slice(0, node.id.length - 2)} />
      ))}
    </Tabs>
  )
}

export default Tab;