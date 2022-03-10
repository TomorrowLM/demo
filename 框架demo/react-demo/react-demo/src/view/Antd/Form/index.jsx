import React, { FC, useState, useEffect } from "react";
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

const TroubleModal = (props) => {
  const [visible, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [form] = Form.useForm();
  const initData = {
    0: {
      dayLimit: "",
      timeLimit: "",
      type: false,
    },
    1: {
      dayLimit: "",
      timeLimit: "",
      type: false,
    },
  };

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue({
        ...initData,
      });
    }, 10);
  }, []);

  const confirm = (e) => {
    console.log(e);
    let isEmpty = false;
    let NewArr = Object.values(e).filter((value, index) => {
      if (value.type) {
        if (!value.dayLimit || !value.timeLimit) {
          isEmpty = true;
        }
      }
      const NewType = value.type;
      value.type = index;
      return NewType;
    });
    if (isEmpty) {
      message.info("必填校验");
      return;
    }
    message.info("成功");
  };
  const replaceNum = (e, type, name) => {
    // let length = e.replace(/\D/g, '').length;
    if (Number(e.target.value) === 0) {
      return;
    } else {
      form.setFieldsValue({
        [type]: { [name]: e.target.value.replace(/^0*/g, "") },
      });
    }
  };
  const Formlayout = {
    // labelCol: { span: 4 },
    // wrapperCol: { span: 25 },
  };
  return (
    <div>
      <Modal
        forceRender
        visible={visible}
        // keyboard={false}
        // maskClosable={false}
        onCancel={setFalse}
        getContainer={false}
        width={600}
        title="投放设置"
        okButtonProps={{ htmlType: "submit", form: "editForm" }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ marginBottom: "10px" }}>
              满足以下任一条件，则不重复投放问卷
            </p>
          </div>
          <Form
            id="editForm"
            onFinish={confirm}
            initialValues={{ ...initData }}
            form={form}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                height: "56px",
              }}
            >
              <Space style={{ display: "flex", alignItems: "baseline" }}>
                <Form.Item
                  name={["0", "type"]}
                  valuePropName="checked"
                  dependencies={[
                    ["0", "dayLimit"],
                    ["0", "timeLimit"],
                  ]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          (value &&
                            (!getFieldValue(["0", "dayLimit"]) ||
                              !getFieldValue(["0", "timeLimit"]))) ||
                          (!value &&
                            (getFieldValue(["0", "dayLimit"]) ||
                              getFieldValue(["0", "timeLimit"])))
                        ) {
                          return Promise.reject(new Error("必填校验"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Checkbox></Checkbox>
                </Form.Item>
                <span>同一用户</span>
                <Form.Item
                  name={["0", "dayLimit"]}
                  rules={[
                    {
                      pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/,
                      message: " 只能输入正整数！",
                    },
                  ]}
                >
                  <Input
                    style={{ width: 120 }}
                    onBlur={(e) => replaceNum(e, "0", "dayLimit")}
                  ></Input>
                </Form.Item>
                <span>天内,被投放</span>
                <Form.Item
                  name={["0", "timeLimit"]}
                  rules={[
                    {
                      pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/,
                      message: " 只能输入正整数！",
                    },
                  ]}
                >
                  <Input
                    style={{ width: 120 }}
                    onBlur={(e) => replaceNum(e, "0", "timeLimit")}
                  ></Input>
                </Form.Item>
                <span>份问卷</span>
              </Space>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                height: "56px",
              }}
            >
              <Space style={{ display: "flex", alignItems: "baseline" }}>
                <Form.Item
                  name={["1", "type"]}
                  valuePropName="checked"
                  dependencies={[
                    ["1", "dayLimit"],
                    ["1", "timeLimit"],
                  ]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          (value &&
                            (!getFieldValue(["1", "dayLimit"]) ||
                              !getFieldValue(["1", "timeLimit"]))) ||
                          (!value &&
                            (getFieldValue(["1", "dayLimit"]) ||
                              getFieldValue(["1", "timeLimit"])))
                        ) {
                          return Promise.reject(new Error("必填校验"));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Checkbox></Checkbox>
                </Form.Item>
                <span>同一用户</span>
                <Form.Item
                  name={["1", "dayLimit"]}
                  rules={[
                    {
                      pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/,
                      message: " 只能输入正整数！",
                    },
                  ]}
                >
                  <Input
                    style={{ width: 120 }}
                    onBlur={(e) => replaceNum(e, "1", "dayLimit")}
                  ></Input>
                </Form.Item>
                <span>天内,被投放</span>
                <Form.Item
                  name={["1", "timeLimit"]}
                  rules={[
                    {
                      pattern: /(^[0-9]{2,}\d*$)|(^[1-9]\d*$)/,
                      message: " 只能输入正整数！",
                    },
                  ]}
                >
                  <Input
                    style={{ width: 120 }}
                    onBlur={(e) => replaceNum(e, "1", "timeLimit")}
                  ></Input>
                </Form.Item>
                <span>份问卷</span>
              </Space>
            </div>
          </Form>
        </div>
      </Modal>
      <Button onClick={setTrue}>form+modal+dependencies</Button>
    </div>
  );
};

export default TroubleModal;
