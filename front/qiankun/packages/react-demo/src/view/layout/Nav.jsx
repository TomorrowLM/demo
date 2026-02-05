import { useHistory } from "react-router-dom";
import { Layout, Row, Col, Dropdown } from "antd";
import { connect } from "react-redux";

const HomeNav = (props) => {
  const history = useHistory();
  const { Header } = Layout;
  const { info } = props;
  const signOut = () => {
    window.localStorage.setItem("token", "");
    // HashRouter 场景下，内部路由只处理 hash 部分
    history.push(`${GLOBAL_INFO.APP_ROUTER_BASE}/login`);
  };
  const menuItems = [
    {
      key: "center",
      label: <p>个人中心</p>,
    },
    {
      key: "logout",
      label: <p>退出登录</p>,
    },
  ];

  const dropdownMenu = {
    items: menuItems,
    onClick: ({ key }) => {
      if (key === "logout") {
        signOut();
      }
    },
  };
  return (
    <Header className="header">
      <Row>
        <Col span={22} style={{ color: "#fff" }}>
          react-app
        </Col>
        <Col span={2}>
          <Dropdown menu={dropdownMenu}>
            <p style={{ color: "#fff", fontSize: "20px", margin: 0 }}>
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
