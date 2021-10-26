import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Row, Col, Space, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getTurnLocation } from './service';

import styles from './index.less';

interface MapProps {
  mapRef?: any
}

let map: any = null;

const Map: React.FC<MapProps> = (props) => {
  const { mapRef } = props;

  const [addressPoint, setAddressPoint] = useState<any>();
  const [addressModal, setAddressModal] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const initMap = () => {
    map = new window.BMap.Map("allmap_duocai");
    
    map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);// 初始化地图,设置中心点坐标和地图级别

    map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    // 点击监听，获得点击地址
    map.addEventListener("click", async (e: { point: { lat: any; lng: any; }; }) => {
      setAddressPoint(e.point);
      
      const { data } = await getTurnLocation({ latitude: e.point.lat, longitude: e.point.lng });
      setAddressModal(data.formatted_address);
    });
  }

  const searchAddress = () => {
    const local = new window.BMap.LocalSearch(map, {
      renderOptions: { map }
    });
    local.search(address);
  }

  useEffect(() => {
    initMap();
  }, [])
  
  /**
   * useImperativeHandle方法的的第一个参数是目标元素的ref引用
   * 回调函数里是暴漏给父组件的方法
   * 例如：{ 方法名称: () => {} }
   */
  useImperativeHandle(mapRef, () => ({
    // 获取数据
    getValues: async () => {
      return {
        addressPoint,
        addressModal
      };
    }
  }))

  return (
    <Row gutter={[0, 10]}>
      <Col lg={24} xs={24}>
        <Space>
          <Input style={{ width: 200 }} placeholder='请输入地址' value={address} onChange={(e) => setAddress(e.target.value)} />
          <Button type='primary' icon={<SearchOutlined />} onClick={ searchAddress }>搜索</Button>
        </Space>
      </Col>
      {addressModal ? <Col lg={24} xs={24}>
        <span className={styles.label}>选中的位置：{ addressModal }</span>
      </Col> : null}
      <Col lg={24} xs={24}>
        <div id="allmap_duocai" style={{ height: 500 }} />
      </Col>
    </Row>
  )
}

export default Map;