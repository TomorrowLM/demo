import { Form, Input, Button, Checkbox } from "antd";
import React, { useState } from "react";
import { useHistory, Route } from "react-router-dom";
import request from "../api/request";
import { Row, Col } from "antd";
const login = (props) => {
  const history = useHistory();
  const onFinish = (values) => {
    let { username, password } = values;
    request.post("/login", { username, password }).then((res) => {
      console.log(res);
      const { token } = res.data;
      window.localStorage.setItem("token", token);
      history.push("/dashboard");
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div style={{width:"100%", height:"100vh", overflow:"hidden", background:"url('../assets/bg.jpg')"}}>
      <Row style={{marginTop:'20vh', overflow:"hidden"}}>
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
              <Input />
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
              <Input.Password />
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
export default login;
