import React, { useEffect } from "react";
import { Route, Link, Switch, Redirect, useHistory } from "react-router-dom";
import { Layout, Menu, Row, Col, Dropdown } from "antd";
import { connect } from "react-redux";
import request from "../../api/request";
import { userInfo } from "../../store/actions/userInfo";
import { DownOutlined } from "@ant-design/icons";
const HomeNav = (props) => {
  const { Header } = Layout;
  const { info, getuserInfo } = props;
  const history = useHistory()
  const signOut = () => {
    console.log(history);
    window.localStorage.setItem('token','')
    window.location.hash = "/login"
  }
  const menu = (
    <Menu>
      <Menu.Item key={1}>
        <p>个人中心</p>
      </Menu.Item>
      <Menu.Item key={2}>
        <p onClick={signOut}>退出登录</p>
      </Menu.Item>
    </Menu>
  );
  // useEffect(() => {
  //   request.get("/users").then((res) => {
  //     const action = userInfo(res.data.data);
  //     // store.dispatch(action);
  //     getuserInfo(action);
  //   });
  // }, []);
  return (
    <Header className="header">
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <Col span={2}>
          <div className="logo" />
        </Col>
        <Col span={19}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Col>
        <Col span={2}>
          <Dropdown overlay={menu}>
            <p style={{ color: "white", fontSize: "20px" }}>
              {info ? info.name : "undefine"}
            </p>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

function mapStateToProps(state) {
  console.log(state);
  return {
    info: state.userInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getuserInfo: (action) => dispatch(action),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeNav); // 挂载到props
