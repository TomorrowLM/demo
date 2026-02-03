import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Menu, Row, Col, Dropdown } from "antd";
import { connect } from "react-redux";

const HomeNav = (props) => {
  const { Header } = Layout;
  const { info } = props;
  const signOut = () => {
    window.localStorage.setItem("token", "");
    window.location.hash = "user/login";
  };
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
  return (
    <Header className="header">
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <Col span={22} style={{ color: "#fff" }}>
          react-app
        </Col>
        <Col span={2}>
          <Dropdown overlay={menu}>
            <p style={{ color: "#fff", fontSize: "20px" }}>
              {info ? info.name : "个人中心 👤"}
            </p>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

function mapStateToProps(state) {
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
