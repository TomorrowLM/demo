import React, { useState } from 'react';
import { Radio } from 'antd';

interface RepeatRadioProps {}
const RepeatRadio: React.FC<RepeatRadioProps> = (props) => {
  const [radioData, setRadioData] = useState<number>(1);
  const [radioText, setRadioText] = useState<number>(1);
  /**
   * 数据重复（多条数据）
   */
  const radioDataChange = (e) => {
    setRadioData(e.target.value);
  };
  /**
   * 文本题重复
   */
  const radioTextChange = (e) => {
    setRadioText(e.target.value);
  };
  return (
    <div>
      <strong style={{ fontSize: '14px' }}>数据重复（多条数据）：</strong>
      <div style={{ width: '100%' }}>
        <Radio.Group onChange={radioDataChange} value={radioData} size="large">
          <Radio value={1}>全部数据</Radio>
          <Radio value={2}>只保留第一条</Radio>
          <Radio value={3}>只保留最后一条</Radio>
        </Radio.Group>
      </div>
      <strong style={{ fontSize: '14px' }}>文本题重复：</strong>
      <div>
        <Radio.Group onChange={radioTextChange} value={radioText}>
          <Radio value={1}>全部数据</Radio>
          <Radio value={2}>只保留第一条</Radio>
          <Radio value={3}>只保留最后一条</Radio>
        </Radio.Group>
      </div>
    </div>
  );
};
export default RepeatRadio;
