import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import { updataShortUrlAdd } from '../service';

const { TextArea } = Input;

interface ShortAddressTransProps {
}


const ShortAddressTrans: React.FC<ShortAddressTransProps> = () => {
  const [longAddress, setLongAddress] = useState<string>('');
  const [shortAddress, setShortAddress] = useState<string>('');

  const startTrans = async () => {
    if (!longAddress) {
      message.info('长网址不可为空');
    } else {
      const urlArrys = longAddress.split(/[\r\n]/);
      const { data } = await updataShortUrlAdd({ urlArrys })
      setShortAddress(data.join(',').replace(/,/g, "\n"));
    }
  }

  return (
    <div>
      <TextArea rows={4} allowClear placeholder='长网址输入：每行一个，最多100条' onBlur={(e: any) => setLongAddress(e.target.value)} />
      <Button type="primary" icon={<RetweetOutlined />} onClick={() => startTrans()} style={{ margin: '20px auto', display: 'block' }}>开始转换</Button>
      <TextArea rows={4} value={shortAddress} placeholder='短网址输出区域' />
    </div>
  )
}

export default ShortAddressTrans;