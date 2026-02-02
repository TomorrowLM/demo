import React, { Suspense } from "react";
import styles from "@/assets/styles/index.module.less";
import { Card, Col, Row } from "antd";

const Zhexiang = React.lazy(() => import("./AntV-G2/zhexiang"));
const Zhuzhuang = React.lazy(() => import("./AntV-G2/zhuzhuang"));
const Donghua = React.lazy(() => import("./AntV-L7/donghua"));
const AntVL7 = React.lazy(() => import("./AntV-L7"));

export default function Dashboard() {
  return (
    <div className={styles.hello}>
      <p>hello</p>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card title="G2-折线图" style={{ width: 500 }}>
            <Suspense fallback={<div>加载中...</div>}>
              <Zhexiang />
            </Suspense>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="G2-柱状图" style={{ width: 500 }}>
            <Suspense fallback={<div>加载中...</div>}>
              <Zhuzhuang />
            </Suspense>
          </Card>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card title="地图" style={{ width: 500 }}>
            <Suspense fallback={<div>加载中...</div>}>
              <AntVL7 />
            </Suspense>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="动画" style={{ width: 500 }}>
            <Suspense fallback={<div>加载中...</div>}>
              <Donghua />
            </Suspense>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
