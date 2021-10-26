import { Tooltip, Tag, Space, Button } from 'antd';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang, IndexModelState, ConnectProps, Loading, connect } from 'umi';
import { isXsScreen } from '@/utils/utils';
import Avatar from './AvatarDropdown';
import DownloadCenter from '../DownloadCenter';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { refreshSurveyList } from "@/pages/survey/list/service"

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};
interface PageProps extends ConnectProps {
  rightContent: IndexModelState;
  loading: boolean;
  reload?: any
}

const GlobalHeaderRight: React.FC<PageProps> = ({ rightContent, dispatch }) => {
  const { refreshTime, reload ,isRefresh} = rightContent
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const refreshList = () => {
    refreshSurveyList({
      refreshTime,
    }).then(() => {
      if (reload)
        reload()
    })
  }
  return (
    <Space className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   //console.log('input', value);
        // }}
      />
      <Tooltip title="使用文档">
        <span
          className={styles.action}
          onClick={() => {
            window.location.href = 'https://pro.ant.design/docs/getting-started';
          }}
        >
          <QuestionCircleOutlined />
        </span>
      </Tooltip> */}

      {/* { !isXsScreen && <DownloadCenter /> } */}
      {isRefresh ?
        <Button type="text" icon={<ReloadOutlined />} onClick={refreshList}></Button> : ''}
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {/* <SelectLang className={styles.action} /> */}
    </Space>
  );
};
export default connect(
  ({ rightContent, loading }: { rightContent: IndexModelState; loading: Loading }) => ({
    rightContent,
    loading: loading.models.index,
  }),
)(GlobalHeaderRight);
