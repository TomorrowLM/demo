import { createFromIconfontCN } from '@ant-design/icons';
import { Badge, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { queryDownloadCenterList, deleteDownloadCenterList } from '@/services/user';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import DownloadList from './DownloadList';
import styles from './index.less';

let current: number = 1;
const pageSize: number = 10;
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2226712_reqccqgeht.js',
  ],
});

interface DownloadCenterProps {
}

const DownloadCenter: React.FC<DownloadCenterProps> = () => {
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ initLoading, setInitLoading ] = useState<boolean>(true);
  const [ loadingComplete, setLoadingComplete ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ list, setList ] = useState<Array<any>>([]);

  const getDownloadCenterList = async () => {
    const result = await queryDownloadCenterList({ current, pageSize });
    const data = current === 1 ? result.data.list : [...list, ...result.data.list];
    if (data.length >= result.data.total) {
      setLoadingComplete(true);
    }
    setList(data);
    setInitLoading(false);
    setLoading(false);
  }

  const loadMoreList = () => {
    setLoading(true);
    current += 1;
    getDownloadCenterList();
  }

  const refresh = () => {
    current = 1;
    setInitLoading(true);
    setLoadingComplete(false);
    getDownloadCenterList();
  }

  const removeList = async (id: Number) => {
    await deleteDownloadCenterList({ id, type: '1' });
    message.success('删除成功');
    refresh();
  }

  const clearList = async () => {
    await deleteDownloadCenterList({ type: '2' });
    message.success('清除成功');
    refresh();
  }

  const visibleChange = (val: boolean) => {
    setVisible(val);
    current = 1;
    if (val) {
      setInitLoading(true);
      setLoadingComplete(false);
      getDownloadCenterList();
    }
  }

  const noticeButtonClass = classNames(styles.noticeButton);
  const NoticeBellIcon = <IconFont type="iconxiazaizhongxin" className={styles.icon} />
  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={undefined} style={{ boxShadow: 'none' }} className={styles.slsBadge}>
        <Tooltip placement="bottom" title="下载中心">
          {NoticeBellIcon}
        </Tooltip>
      </Badge>
    </span>
  );

  return (
    <HeaderDropdown
      className="downloadCenter"
      placement="bottomRight"
      getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
      overlay={<DownloadList
        initLoading={initLoading}
        loading={loading}
        list={list}
        loadingComplete={loadingComplete}
        loadMoreList={loadMoreList}
        refresh={refresh}
        removeList={removeList}
        clearList={clearList}
      />}
      overlayClassName={styles.slsPopover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={(val) => visibleChange(val)}
    >
      { trigger }
    </HeaderDropdown>
  );
}

export default DownloadCenter;