import { UserOutlined, PhoneOutlined, MailOutlined, ContactsOutlined, ClusterOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { RouteChildrenProps } from 'react-router';
import { ModalState } from './model';
import BasicData from './components/BasicData';
import ResetPassword from './components/ResetPassword';
import { CurrentUser } from './data.d';
import styles from './Center.less';

const operationTabList = [
  {
    key: 'basicData',
    tab: (
      <span>基本资料</span>
    ),
  },
  {
    key: 'resetPassword',
    tab: (
      <span>修改密码</span>
    ),
  }
];

interface AccountCenterProps extends RouteChildrenProps {
  dispatch: any;
  currentUser: Partial<CurrentUser>;
  currentUserLoading: boolean;
}
interface AccountCenterState {
  tabKey?: 'basicData' | 'resetPassword';
}

class AccountCenter extends Component<
  AccountCenterProps,
  AccountCenterState
> {

  state: AccountCenterState = {
    tabKey: 'basicData',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userAndAccountCenter/fetchCurrent',
    });
  }

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key as AccountCenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: AccountCenterState['tabKey']) => {
    if (tabKey === 'basicData') {
      return <BasicData />;
    }
    if (tabKey === 'resetPassword') {
      return <ResetPassword />;
    }
    return null;
  };

  renderUserInfo = (currentUser: Partial<CurrentUser>) => (
    <div className={styles.detail}>
      <p>
        <UserOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.data.userName}
      </p>
      <p>
        <ContactsOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.roleGroup}
      </p>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.data.dept.deptName} / {currentUser.postGroup}
      </p>
      <p>
        <PhoneOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.data.phonenumber}
      </p>
      <p>
        <MailOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.data.email}
      </p>
      <p>
        <FieldTimeOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.data.createTime}
      </p>
    </div>
  );

  render() {
    const { tabKey } = this.state;
    const { currentUser = {}, currentUserLoading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24} xs={24} className='userCol'>
            <Card bordered={false} title="个人信息" style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
                    <div className={styles.name}>{currentUser.data.nickName}</div>
                    {/* <div>{currentUser.roleGroup}</div> */}
                  </div>
                  {this.renderUserInfo(currentUser)}
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24} xs={24} className='userCol'>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default connect(
  ({
    loading,
    userAndAccountCenter,
  }: {
    loading: { effects: { [key: string]: boolean } };
    userAndAccountCenter: ModalState;
  }) => ({
    currentUser: userAndAccountCenter.currentUser,
    currentUserLoading: loading.effects['userAndAccountCenter/fetchCurrent'],
  }),
)(AccountCenter);
