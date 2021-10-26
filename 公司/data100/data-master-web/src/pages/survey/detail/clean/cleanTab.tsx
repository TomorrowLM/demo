import React, {ChangeEvent, useEffect, useState,useImperativeHandle} from 'react';
import {Button, Tabs, message, Input, Tooltip, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {addCleanTabsService, getCleanTabsService, deleteCleanTabsService, editCleanTabsService} from './service';
import styles from './cleanTab.less';

const {TabPane} = Tabs;

interface PaneProps {
  copyRef:any,
  ruleGroupId: string;
  ruleGroupName: string;
  id: string;
  isEdit: boolean;
}

interface CleanTabProps {
  surveyId: string;
  tabClick: (ruleGroupId: string) => any;
  csvState: string,// 打包状态：0打包中 ；1完成 2未拉取数据
  stopCleanGroup: boolean,
}

const CleanTab: React.FC<CleanTabProps> = (props) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [panes, setPanes] = useState<Array<PaneProps>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {surveyId, tabClick, csvState, copyRef, stopCleanGroup} = props;
  useImperativeHandle(copyRef, () => ({
    copyRule: () => {
      loadData('add')
    }
  }));
  const loadData = async (action?: string) => {
    const param = {
      groupId: surveyId,
    }
    const data = await getCleanTabsService(param)
    const {msg, data: dataArr} = data;
    if (msg === 'success') {
      const panes = dataArr.map((value, index) => {
        const pane = {
          ruleGroupName: value.ruleGroupName,
          ruleGroupId: value.ruleGroupId,
          id: `${value.id  }`,
          isEdit: false,
        }
        return pane;
      })
      setPanes(panes);
      if (panes.length > 0) {
        console.log(action);
        switch (action) {
          case 'load':
            setActiveKey(panes[0].id)
            tabClick(panes[0].id)
            break;
          case 'add':
            setActiveKey(panes[panes.length - 1].id)
            tabClick(panes[panes.length - 1].id)
            break;
          case 'edit':
            break;
          default:
            break;
        }

      }

    } else {
      message.error(msg);
    }
  }
  useEffect(() => {
    loadData('load');
  }, []);
  const add = async () => {
    const param = {
      groupId: surveyId,
    }
    const data = await addCleanTabsService(param);
    const {msg} = data;
    if (msg === 'success') {
      loadData('add');
    } else {
      message.error(msg);
    }
    ;

  }
  const remove = async (value: PaneProps) => {
    const param = {
      groupId: surveyId,
      ruleGroupId: value.id,
    }
    const data = await deleteCleanTabsService(param);
    const {code, msg} = data;
    if (code === 200) {
      let newActiveKey = activeKey;
      let lastIndex;
      panes.forEach((pane, i) => {
        if (pane.id === value.id) {
          lastIndex = i - 1;
        }
      });
      const newPanes = panes.filter(pane => pane.id !== value.id);
      if (newPanes.length && newActiveKey === value.id) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].id;
          tabClick(newPanes[lastIndex].id)
        } else {
          newActiveKey = newPanes.length > 0 ? newPanes[0].id : '';
          newPanes.length > 0 ? tabClick(newPanes[0].id) : ''
        }
      }
      setPanes(newPanes);
      setActiveKey(newActiveKey);

    } else {
      message.error(msg);
    }


  }
  const findValueWithKey = (key) => {
    return panes.find((value) => {
      return value.id === key;
    })
  }
  const findIndexWithKey = (key) => {
    return panes.findIndex((value) => {
      return value.ruleGroupId === key;
    })
  }
  const onChange = (nowActiveKey:string) => {
    if (nowActiveKey===activeKey || stopCleanGroup){
      return;
    }
    setActiveKey(nowActiveKey);
    const pane = findValueWithKey(nowActiveKey);
    tabClick(pane.id);
  }
  const onEdit = (targetKey, action) => {
    switch (action) {
      case 'add':
        if (csvState !== '1') {
          return;
        }
        console.log('addaction');

        add();
        break;
      case 'remove':
        console.log(targetKey);
        if(!stopCleanGroup || csvState == 3){
          Modal.confirm({
            centered: true,
            content: '是否删除该清洗组？',
            title: <div style={{textAlign:'center'}}>温馨提示</div>,

            icon: null, onOk: () => {
              const pane = findValueWithKey(targetKey);
              remove(pane);
            }
          });
        }
        break;
      default:
        break;
    }


  }


  const tabButton = (pane: PaneProps) => {
    return (
      <Button style={{
        background: activeKey === pane.ruleGroupId ? '#214f7e' : '#ffffff',
        color: activeKey === pane.ruleGroupId ? '#ffffff' : '#909399',
        border: 'none'
      }}
              type='primary'
      >{pane.title}</Button>
    )
  }

  const editTab = async (param) => {
    const data = await editCleanTabsService(param);
    const {code, msg} = data;
    if (code === 200) {
      message.success('修改成功');
      loadData('edit');
    } else {
      message.error(msg);
    }

  }
  const edit = (pane: PaneProps) => {
    console.log('edit');
    if(!stopCleanGroup){
      pane.isEdit = true;
      setInputText(pane.ruleGroupName);
      const arr = [...panes];
      setPanes(arr);
    }
  }
  const handleEdit = (pane: PaneProps) => {

  }
  const handleOnBlur = (event: ChangeEvent<HTMLInputElement>, pane: PaneProps) => {
    const param = {
      ruleGroupId: pane.id,
      ruleGroupName: event.target.value,
    }
    console.log('onblur');
    editTab(param);


  }
  const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);

    setInputText(event.target.value);
  }
  const becomeFirstResponse = (input?: HTMLInputElement, pane: PaneProps) => {
    if (input) {
      input.focus();

    }

  }
  /**
   * 修改tab选中的颜色
   */
  const setActiveColor = () => {
    const otherTab = document.getElementsByClassName('ant-tabs-tab'); // 包含了当前的active
    for (const j in otherTab) {
      if (otherTab.hasOwnProperty(j)) {
        const i = otherTab[j];
        if (i.className.includes('ant-tabs-tab-active') && !stopCleanGroup) {
          // 当前点击的
          i.style.backgroundColor = '#214f7e';
          i.getElementsByClassName('ant-tabs-tab-btn')[0].style.color = '#fff';
        } else if (i.className.includes('ant-tabs-tab-active') && stopCleanGroup) {
          // 其他默认的样式
          i.style.backgroundColor = '#fafafa';
          i.getElementsByClassName('ant-tabs-tab-btn')[0].style.color = 'black';
        } else if (!i.className.includes('ant-tabs-tab-active')) {
          i.style.backgroundColor = '#fafafa';
          i.getElementsByClassName('ant-tabs-tab-btn')[0].style.color = 'black';
        }
      }
    }
  };
  const renderTabBar = (props, DefaultTabBar) => {
      return <DefaultTabBar {...props}>
        {node => {

          const value = findValueWithKey(node.key);
          const index = findIndexWithKey(node.key);
          setActiveColor()
          return <div className={styles.nodeContain}
                      onDoubleClick={() => edit(value)}
          >
            {
              value.isEdit ? <Input value={inputText} style={{width:"100px"}}
                                    onBlur={event => {
                                      handleOnBlur(event, value)
                                    }}
                                    ref={(input) => {
                                      becomeFirstResponse(input, value)
                                    }}
                                    onChange={inputOnChange}
                                    disabled={stopCleanGroup}

              /> : node
            }

          </div>

        }
        }
      </DefaultTabBar>
    }
  ;
  const addIcon = (
    <Tooltip placement="right" title='新增清洗组'>
      <Button style={{
        border: 'none',
      }}
              size='large'
              type="primary"
              icon={<PlusOutlined/>}
              disabled={csvState !== '1' || stopCleanGroup}

       />
    </Tooltip>
  )
  return (

    <Tabs id='cleanTabs'
          // type={stopCleanGroup?'card':"editable-card"}
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          renderTabBar={renderTabBar}
          addIcon={addIcon}
    >
      {panes.map(pane => (
        <TabPane tab={pane.ruleGroupName}
                 key={pane.id}
        >
          {props.children}
        </TabPane>
      ))}
    </Tabs>

  )
}
export default CleanTab
