import React, {useEffect, useState, useRef} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { KeepAlive } from 'react-activation';
import { Button} from 'antd';
import { history } from 'umi';
import QRCode from 'qrcode.react';
import { useAliveController } from 'react-activation';

export default () => {
  const { taskId } = history.location.query;
  const [url, setUrl] = useState('');
  const { getCachingNodes, dropScope } = useAliveController();
  const cachingNodes: any = getCachingNodes ? getCachingNodes() : [];

//history.push('/adv/projectManager/addTask?projectId='+projectId+'&projectName='+projectName+'&customerId='+customerId)

const closeTab=() => {
    dropTab(history.location.pathname + history.location.search)
  }

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

  useEffect(() => {
      // setUrl('https://h5cs.kanbotong.net/task/details?taskId='+taskId)
      let previewDomain = window.location.origin.indexOf("cs")>-1|| window.location.origin.indexOf("localhost")>-1?"https://h5cs.kanbotong.net":"https://h5.kanbotong.net"
      setUrl(previewDomain+'/task/details?taskId='+taskId)
      // setUrl('http://localhost:8080/task/details?taskId='+taskId)
    }, [taskId]);
  return (
    <PageContainer title={false}>
      <KeepAlive name="任务预览" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <div style={{height:'880px'}}>
                    <div style={{width:'375px',height:'800px',margin:'0 auto'}}>
                    <iframe src={url} width="100%" height="100%" frameBorder='0' scrolling='auto'></iframe>
                    </div>
                    <div style={{marginTop:'-450px',marginLeft:'50%'}}>
                    <div style={{width:'100px',height:'100px',margin:'0 auto'}}>
                      <QRCode value={url} size={100}/>
                    </div>
                    </div>
                    <div style={{marginTop:'-400px',marginTop:'-450px',textAlign:'right'}}>
                    <Button type="primary" onClick={closeTab}>关闭预览</Button>
                    </div>
        </div>

      </KeepAlive>
    </PageContainer>
  )
}
