import React, { FC, useState, useRef } from "react";
import {
  Modal,
  Button,
  Select,
  message,
  Checkbox,
  Form,
  Input,
  Space,
} from "antd";
import { useRequest, useSetState, useReactive, useBoolean } from "ahooks";

const { Option } = Select;
const initialValues = { isDefault: true, mailboxSSL: "465" };
export const initialMailboxTypeList = [
  {
    label: "@163.com",
    value: "@163.com",
  },
  {
    label: "@126.com",
    value: "@126.com",
  },
  {
    label: "@yeah.net",
    value: "@yeah.net",
  },
  {
    label: "@qq.com",
    value: "@qq.com",
  },
  {
    label: "@sina.com",
    value: "@sina.com",
  },
  {
    label: "@189.cn",
    value: "@189.cn",
  },
  {
    label: "@sohu.com",
    value: "@sohu.com",
  },
  {
    label: "@aliyun.com",
    value: "@aliyun.com",
  },
  {
    label: "@cempro.cn",
    value: "@cempro.cn",
  },
  {
    label: "@21cn.com",
    value: "@21cn.com",
  },
  {
    label: "@data100.com",
    value: "@data100.com",
  },
];
const SelectModal = () => {
  const [visible, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [form] = Form.useForm();
  const formRef = useRef();

  const [state, setState] = useSetState({
    mailboxTypeList: initialMailboxTypeList,
    controlMailBoxType: "",
  });
  const [isChange, setIsChange] = useState(false);
  const [newMailboxType, setNewMailboxType] = useState("");
  const searchMailBox = (value) => {
    if (value) {
      setNewMailboxType(value);
    }
    setIsChange(true);
  };

  const changeMailBox = (value) => {
    setNewMailboxType(value);
  };

  const blurMailBox = (value) => {
    if (isChange) {
      if (!/^@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(newMailboxType)) {
        message.info("");
      } else {
        state.mailboxTypeList.push({
          value: newMailboxType,
          label: newMailboxType,
        });
      }
    }
    if (/^@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(newMailboxType)) {
      formRef.current.setFieldsValue({ mailboxType: newMailboxType });
    }
    setIsChange(false);
  };
  const prefixSelector = (
    <Form.Item name="mailboxType" noStyle>
      <Select
        allowClear
        placeholder="请选择或输入邮箱尾缀"
        className="mailbox_type_select"
        size="middle"
        showSearch
        onChange={(value) => changeMailBox(value)}
        onSearch={(value) => searchMailBox(value)}
        onBlur={(value) => blurMailBox(value)}
      >
        {state.mailboxTypeList.map((item) => {
          console.log(item);
          return <Option key={item.label}>{item.value}</Option>;
        })}
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Modal
        forceRender
        visible={visible}
        onCancel={setFalse}
        getContainer={false}
        width={600}
        title="投放设置"
        okButtonProps={{ htmlType: "submit", form: "editForm" }}
      >
        <div>
          <Form
            id="editForm"
            onFinish={() => toggle()}
            initialValues={initialValues}
            form={form}
            ref={formRef}
          >
            <Form.Item
              name="mailboxName"
              label="邮箱账号"
              rules={[{ required: true, message: "请输入邮箱账号" }]}
            >
              <Input
                className="mailbox_name"
                addonAfter={prefixSelector}
                size="large"
                placeholder="请输入邮箱账号"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Button onClick={setTrue}>form+modal+select</Button>
    </div>
  );
};

export default SelectModal;
