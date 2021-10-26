import React from 'react';
import { CloseOutlined, ClearOutlined, RedoOutlined } from '@ant-design/icons';
import { List, Button, Skeleton, Badge, Tooltip, Popconfirm } from 'antd';
import classNames from 'classnames';
import styles from './DownloadList.less';

export interface DownloadListProps {
  initLoading: boolean,
  loadingComplete: boolean,
  loading: boolean,
  list: Array<any>,
  loadMoreList: () => void;
  refresh: () => void;
  removeList: (id: Number) => void;
  clearList: () => void;
}

const DownloadList: React.FC<DownloadListProps> = (props) => {
  const { initLoading, loadingComplete, loading, list, loadMoreList, refresh, removeList, clearList } = props;

  const onLoadMore = () => {
    loadMoreList();
  };

  const onRefresh = () => {
    refresh();
  }

  const onRemoveList = (id: Number) => {
    removeList(id);
  }

  const onClear = () => {
    clearList();
  }

  const loadMore = !initLoading && !loading && list.length ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      { loadingComplete ? '已加载全部' : <Button type="link" onClick={onLoadMore}>点击加载更多...</Button> }
    </div>
  ) : null;

  return (
    <div>
      {/* <div className={styles.refresh} onClick={onRefresh}>
        <SyncOutlined spin={initLoading} />
      </div> */}
      <div className={styles.tips}>
        提示：文件有效期为7天，7天后自动删除，请提前备份。
      </div>
      <List
        className={styles.list}
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });

          const actions = {
            '0': <Badge status="processing" text="打包中..." />,
            '1': <Badge status="processing" text="打包中..." />,
            '2': <a key="list-loadmore-more" href={item.url}>下载</a>,
            '3': <Badge status="warning" text="打包失败" />,
            '4': <Badge status="error" text="已失效" />,
          }
          
          return <List.Item
            className={itemCls}
            actions={[actions[`${item.state}`]]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                className={styles.meta}
                title={<Tooltip title={item.titleName}>
                  <span style={{
                    width: '100%',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{ item.titleName }</span>
                </Tooltip>}
                description={
                  <div>
                    { item.surveyName ? <div style={{ fontSize: 12, display: 'flex' }}>
                      <span style={{ width: 60, flexShrink: 0 }}>任务名称：</span>
                      <p style={{ marginBottom: 0 }}>{item.surveyName}</p>
                    </div> : null }
                    <div style={{ fontSize: 12, display: 'flex' }}>
                      <span style={{ width: 60, flexShrink: 0 }}>创建时间：</span>
                      <p style={{ marginBottom: 0 }}>{item.applyTime}</p>
                    </div>
                    <div style={{ fontSize: 12, display: 'flex' }}>
                      <span style={{ width: 60, flexShrink: 0 }}>花费时间：</span>
                      <p style={{ marginBottom: 0 }}>{item.packTimes}</p>
                    </div>
                    <CloseOutlined className={styles.delete} onClick={() => onRemoveList(item.id)} />
                  </div>
                }
              />
            </Skeleton>
          </List.Item>
        }}
      />
      <div className={styles.bottomBar}>
        <div className={styles.clear}>
          <Popconfirm title="确认要清除所有下载中心数据吗？" okText="确认" cancelText="取消" onConfirm={onClear}>
            <span><ClearOutlined /> 清除</span>
          </Popconfirm>
        </div>
        <div onClick={onRefresh} className={styles.redo}><RedoOutlined /> 刷新</div>
      </div>
    </div>
  );
};

export default DownloadList;
