import { Form, Input, Button, Checkbox } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import request from "@/utils/request";
import { Row, Col } from "antd";
import styles from "@/assets/styles/index.module.less";

const Login = (props) => {
  const history = useHistory();
  const onFinish = (values) => {
    let { username, password } = values;
    console.log("Success:", values);
    request.post("/white/login", { username, password }).then((res) => {
      const { data } = res;
      console.log("login", res);
      window.localStorage.setItem("token", data);
      history.push(`${GLOBAL_INFO.APP_ROUTER_BASE}/dashboard`);
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div
      className={styles.login}
      style={{ backgroundImage: `url(require(img/bg.jpg))` }}
    >
      <Row style={{ marginTop: "20vh", overflow: "hidden" }}>
        <Col xs={2} sm={4} md={4} lg={4} xl={4}></Col>
        <Col xs={20} sm={16} md={12} lg={12} xl={12}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: false,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input placeholder="账号：liming" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: false,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="密码：1" />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={2} sm={4} md={4} lg={4} xl={4}></Col>
      </Row>
    </div>
  );
};
export default Login;
