import { Form, Input, Button, Checkbox } from "antd";
import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useHistory, Route } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: 'url("../assets/bg.jpg")',
  },
});
const login = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const onFinish = (values) => {
    let { username, password } = values;
    if (username == 1 && password == 1) {
      history.push("/");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={classes.root}>
      <div style={{ width: "50vw", height: "20vh", marginTop: "20vh" }}>
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
                required: true,
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
                required: true,
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
      </div>
    </div>
  );
};
export default login;
