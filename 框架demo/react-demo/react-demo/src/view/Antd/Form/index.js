import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Select, message, Checkbox, Form, Input, Space } from 'antd';
import { useRequest, useSetState, useReactive } from 'ahooks';



const TroubleModal = (props) => {
  const { visible, onCancel, onFinished } = props;
  const [disturbData, setdata] = useSetState()
  const [updateTime, setUpdateTime] = useState('')

  const [form] = Form.useForm();
  const initData = {
    '0': {
      "dayLimit": '',
      "timeLimit": '',
      "type": false
    },
    '1': {
      "dayLimit": '',
      "timeLimit": '',
      "type": false
    }
  }
  const { run: getDisturb } = useRequest(() => ({
    url: experience.getDisturb,
    method: 'GET',
  }), {
    onSuccess: (res) => {
      setUpdateTime(res.data.lastUpdate)
      res.data.disturbData.forEach((value, index) => {
        if (value.type === 0) {
          initData[0] = value
          initData[0]['type'] = true
        }
        if (value.type === 1) {
          initData[1] = value
          initData[1]['type'] = true
        }
      })
      setdata(initData)
    }
  });

  const { run: disturb } = useRequest((data) => ({
    url: experience.disturb,
    method: 'POST',
    data: data
  }), {
    onSuccess: (res) => {
      message.info(res.msg)
      onFinished()
    }
  });

  useEffect(() => {
    getDisturb()
    form.setFieldsValue({
      ...disturbData
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...disturbData
    });
  }, [disturbData]);

  const confirm = (e: any) => {
    let isEmpty = false
    let NewArr = Object.values(e).filter((value: any, index) => {
      if (value.type) {
        if (!value.dayLimit || !value.timeLimit) {
          isEmpty = true
        }
      }
      const NewType = value.type
      value.type = index
      return NewType
    })
    if (isEmpty) {
      message.info('必填校验')
      return
    }
    disturb(NewArr)
  }
  const replaceNum = (e, type, name) => {
    // let length = e.replace(/\D/g, '').length;
    if (Number(e.target.value) === 0) {
      return;
    } else {
      form.setFieldsValue({ [type]: { [name]: e.target.value.replace(/^0*/g, "") } })
    }
  }
  return (
    <Modal
      visible={visible}
      keyboard={false}
      maskClosable={false}
      onCancel={onCancel}
      getContainer={false}
      width={600}
      title='问卷全局免打扰设置'
      okButtonProps={{ htmlType: 'submit', form: 'editForm' }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ marginBottom: '10px' }}>满足以下任一条件，则不重复投放问卷</p>
        </div>
        <Form
          id="editForm"
          onFinish={confirm}
          initialValues={{ ...disturbData }}
          form={form}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', height: '56px' }}>
            <Space style={{ display: 'flex', alignItems: 'baseline' }}>
              <Form.Item name={['0', 'type']} valuePropName="checked"
                dependencies={[['0', 'dayLimit'], ['0', 'timeLimit']]}
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((value && (!getFieldValue(['0', 'dayLimit']) || !getFieldValue(['0', 'timeLimit']))) || (!value && (getFieldValue(['0', 'dayLimit']) || getFieldValue(['0', 'timeLimit'])))) {
                      return Promise.reject(new Error('必填校验'));
                    }
                    return Promise.resolve();
                  },
                })]} className={styles.checkbox_style}>
                <Checkbox></Checkbox>
              </Form.Item>
              <span>同一用户</span>
              <Form.Item name={['0', 'dayLimit']} rules={[{ pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/, message: ' 只能输入正整数！' },]}><Input style={{ width: 120 }} onBlur={e => replaceNum(e, '0', 'dayLimit')}></Input></Form.Item>
              <span>天内,被投放</span>
              <Form.Item name={['0', 'timeLimit']} rules={[{ pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/, message: ' 只能输入正整数！' },]}><Input style={{ width: 120 }} onBlur={e => replaceNum(e, '0', 'timeLimit')}></Input></Form.Item>
              <span>份问卷</span>
            </Space>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', height: '56px' }}>
            <Space style={{ display: 'flex', alignItems: 'baseline' }}>
              <Form.Item name={['1', 'type']} valuePropName="checked"
                dependencies={[['1', 'dayLimit'], ['1', 'timeLimit']]}
                rules={[({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((value && (!getFieldValue(['1', 'dayLimit']) || !getFieldValue(['1', 'timeLimit']))) || (!value && (getFieldValue(['1', 'dayLimit']) || getFieldValue(['1', 'timeLimit'])))) {
                      return Promise.reject(new Error('必填校验'));
                    }
                    return Promise.resolve();
                  },
                })]} className={styles.checkbox_style}>
                <Checkbox></Checkbox>
              </Form.Item>
              <span>同一用户</span>
              <Form.Item name={['1', 'dayLimit']} rules={[{ pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/, message: ' 只能输入正整数！' },]}><Input style={{ width: 120 }} onBlur={e => replaceNum(e, '1', 'dayLimit')}></Input></Form.Item>
              <span>天内,被投放</span>
              <Form.Item name={['1', 'timeLimit']} rules={[{ pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/, message: ' 只能输入正整数！' },]}><Input style={{ width: 120 }} onBlur={e => replaceNum(e, '1', 'timeLimit')}></Input></Form.Item>
              <span>份问卷</span>
            </Space>
          </div>
        </Form>
        <p style={{ marginBottom: '5px' }}>{updateTime ? `更新时间：${updateTime}` : ''}</p>
        <div>
          <p>*注意：</p>
          <div>1.问卷免打扰的设置条件在以下场景起作用：
            短信投放、邮件投放、公众号投放</div>
          <div>2.同一企业下的任何一个账号设置了免打扰条件，该条件对企业所有的问卷投放生效</div>
        </div>
      </div>
    </Modal>
  );
};

export default TroubleModal;