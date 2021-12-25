import React from "react";
import { Chart } from "@antv/g2";
import styles from "./dashboard.less";
import { Card, Col, Row } from "antd";
import { useEffect } from "react";
import Zhexiang from "./AntV-G2/zhexiang";
import Zhuzhuang from "./AntV-G2/zhuzhuang";
import AntVL7 from "./AntV-L7";
import Donghua from "./AntV-L7/donghua";

export default function Dashboard() {
  return (
    <div className={styles.hello}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card
            title="G2-折线图"
            // extra={<a href="#">More</a>}
            style={{ width: 500 }}
          >
            <Zhexiang />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="G2-柱状图"
            // extra={<a href="#">More</a>}
            style={{ width: 500 }}
          >
            <Zhuzhuang />
          </Card>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card
            title="地图"
            // extra={<a href="#">More</a>}
            style={{ width: 500 }}
          >
            <AntVL7 />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="动画"
            // extra={<a href="#">More</a>}
            style={{ width: 500 }}
          >
            <Donghua />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
