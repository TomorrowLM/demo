import { Input, Row, Col, message, Button } from 'antd';
import { EditFilled } from '@ant-design/icons'
import { Link } from 'umi';
import React, { useState } from 'react';
import defaultSettings from '../../../../config/defaultSettings';

import { updateSurveyInfo } from './service';

interface EditTableProps {
  text: string,
  refreshTime: string,
  name: string,
  sid: string,
  reload: any,
  maxWidth: number,
}
const EditTable: React.FC<EditTableProps> = (props) => {
  const { text, refreshTime, name, sid, reload, maxWidth } = props;
  // console.log(maxWidth)
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [value, setValue] = useState<string>(text)
  const handleOk = async () => {
    setLoading(true)
    var res = await updateSurveyInfo({
      refreshTime,
      [name]: value,
      sid
    })

    if (res.code == 200) {
      message.success(res.data)
      // setIsEdit(false)
      setVisible(false);
      setLoading(false);
      reload()
    }
  }
  const handleCancel = () => {
    setVisible(false);
  }

  return (
    <div>
      <div style={{ wordBreak: "break-all", display: visible ? 'none' : 'flex', alignItems: "center", maxWidth: document.body.clientWidth > 1435 ? "auto":maxWidth + 'px'  , minWidth: "60px" }}>
        <span>{text}</span>
        <img src={require('@/assets/iconImages/edit@2x.png')} style={{ cursor: "pointer", width: '12px', height: "12px", margin: "0 0 0 5px" }} onClick={() => {
          setVisible(true)
        }} />
      </div>
      <Row style={{ display: visible ? 'flex' : 'none', minWidth: "180px" }} justify="start">
        <Col flex="1">
          <div style={{ position: "relative" }}>
            <Input style={{ position: "absolute", left: 0, right: '0px', minWidth: "50px" }} value={value} onChange={(e) => { setValue(e.target.value) }} />
            <div style={{ padding: "0 11px" }}>{value}</div>
          </div>
        </Col>
        <Col style={{ minWidth: "110px", maxWidth: "130px", marginLeft: "5px" }}>
          <Button loading={loading} type="primary" onClick={() => { handleOk() }}>确定</Button>&nbsp;
          <Button onClick={() => { handleCancel() }}>取消</Button>
        </Col>
      </Row>
      {/* <Popconfirm placement="top" okText="确定" cancelText="取消"
        title={() => {
          return <Input value={value} onChange={(e) => { setValue(e.target.value) }} />
        }}
        visible={visible}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
      >
        <div>
          <span>{text}</span>
          <Button icon={<EditFilled style={{color:defaultSettings.primaryColor}}/>} type="text" onClick={() => { setVisible(true) }}></Button>
        </div>
      </Popconfirm> */}
    </div>

  )
}

export default EditTable;