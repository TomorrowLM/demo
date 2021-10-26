import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Card } from 'antd';
import { cpuColumns, memColumns, sysFilesColumns } from './const.d';
import { getMonitorServer } from './service';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cpuData, setCpuData] = useState<object[]>([]);
  const [memData, setMenData] = useState<object[]>([]);
  const [serverData, setServerData] = useState<object[]>([]);
  const [javaData, setJavaData] = useState<object[]>([]);
  const [sysFilesData, setSysFiles] = useState<object[]>([]);

  useEffect(() => {
    getMonitorServer().then(res => {
      const { data: { cpu, mem, jvm, sys, sysFiles } } = res;
      sysFiles.usage += '%';
      setCpuData([
        {
          label: '核心数',
          value: cpu.cpuNum
        },
        {
          label: '用户使用率',
          value: cpu.used
        },
        {
          label: '系统使用率',
          value: cpu.sys
        },
        {
          label: '当前空闲率',
          value: cpu.free
        }
      ]);
      setMenData([
        {
          label: '总内存',
          mem: `${mem.total  }G`,
          jvm: `${jvm.total  }M`
        },
        {
          label: '已用内存',
          mem: `${mem.used  }G`,
          jvm: `${jvm.used  }M`
        },
        {
          label: '剩余内存',
          mem: `${mem.free  }G`,
          jvm: `${jvm.free  }M`
        },
        {
          label: '使用率',
          mem: `${mem.usage  }G`,
          jvm: `${jvm.usage  }M`
        },
      ]);
      setServerData([
        {
          label: '服务器名称',
          value: sys.computerName
        },
        {
          label: '服务器IP',
          value: sys.computerIp
        },
        {
          label: '操作系统',
          value: sys.osName
        },
        {
          label: '系统架构',
          value: sys.osArch
        }
      ]);
      setJavaData([
        {
          label: 'Java名称',
          value: jvm.name
        },
        {
          label: 'Java版本',
          value: jvm.version
        },
        {
          label: '启动时间',
          value: jvm.startTime
        },
        {
          label: '运行时长',
          value: jvm.runTime
        },
        {
          label: '安装路径',
          value: jvm.home
        },
        {
          label: '项目路径',
          value: sys.userDir
        }
      ]);
      setSysFiles(sysFiles);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <Card title="CPU"><Table columns={cpuColumns} dataSource={cpuData} pagination={false} loading={loading} /></Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card title="内存"><Table columns={memColumns} dataSource={memData} pagination={false} loading={loading} /></Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card title="服务器信息"><Table columns={cpuColumns} dataSource={serverData} pagination={false} loading={loading} /></Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card title="Java虚拟机信息"><Table columns={cpuColumns} dataSource={javaData} pagination={false} loading={loading} /></Card>
        </Col>
        <Col lg={24} xs={24}>
          <Card title="磁盘状态"><Table scroll={{ x: 'max-content' }} columns={sysFilesColumns} dataSource={sysFilesData} pagination={false} loading={loading} /></Card>
        </Col>
      </Row>
    </PageContainer>
  );
};