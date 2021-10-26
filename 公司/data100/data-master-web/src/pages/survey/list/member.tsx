import { Input, Row, message, Button, Drawer, Tree, } from 'antd';
import { SearchOutlined, LeftOutlined, CloseCircleFilled } from '@ant-design/icons'
import React, { useState } from 'react';
import styles from "./index.less"


interface treeItem {
  key: string,
  parentId: string,
  roleId?: string,
  title: string,
  type: null,
  children: treeItem,
}

interface MemberProps {
  memberVisible: boolean,
  width: number,
  onClose: object,
  onPreStep: any,
  treeData: Array<treeItem>,
  // checkedKeys: any,
  changeTreeData: any,
  treeList: Array<treeItem>,
  drawerOk: (adminId: string) => void,//确认添加
  drawerCancel: any,//取消
}
const Index: React.FC<MemberProps> = (props) => {
  const { memberVisible, width, onClose, onPreStep, treeData, changeTreeData, treeList, drawerOk, drawerCancel } = props;
  // console.log(memberVisible, width, onClose, onPreStep, treeData)
  // const [loading, setLoading] = useState<boolean>(false)
  const [targetKeys, setTargetKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['', '']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['']);
  // const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [checkedList, setCheckedList] = useState<Array<any>>([])
  const [checkedListKey, setCheckedListKey] = useState<Array<string>>([])

  const onChange = (keys: any) => {
    setTargetKeys(keys);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const getCheckedItem = (checkedKeys: any) => {
    var checkedList: any = []
    var keyArr: Array<string> = []
    function flatten(list: any) {
      list.forEach((item: any, index: number) => {
        if (item.type === 2) {//人员
          checkedKeys.forEach((key: string) => {
            if (item.key === key) {
              checkedList.push(item)
              keyArr.push(key)
            }
          })
        } else if (item.type === 1) {//部门
          if (item.children) {
            flatten(item.children)
          } else {
            // checkedList.push({
            //   key: item.key,
            //   parentId: item.parentId,
            //   roleId: item.roleId,
            //   title:item.title,
            //   type: item.type,
            // })
          }
        }
      })
    }
    flatten(treeData)
    // console.log(checkedList)
    setCheckedList(checkedList)
    setCheckedListKey(keyArr)
  }

  const delChecked = (delItem: any, index: number) => {
    checkedList.splice(index, 1)
    setCheckedList(checkedList)
    var keys: string[] = []
    setCheckedKeys(keys)
    checkedList.forEach((item: string) => {
      keys.push(item.key)
    })
    setCheckedKeys(keys)
  }
  const searchTree = (value: any) => {
    var newLists: any = []
    function flattenTreeData(lists: any) {
      lists.forEach((item: any, index: number) => {
        if (item.title.indexOf(value) > -1) {
          newLists.push(item)
        } else {
          if (item.children) {
            flattenTreeData(item.children)
          }
        }
      })
    }
    flattenTreeData(treeList)
    changeTreeData(newLists)
    // console.log(newLists)
  }
  const emptyCheckList = () => {
    setCheckedList([])
    setCheckedKeys([''])
  }
  return (
    <Drawer
      width={width}
      title={<div><Button type="text" icon={<LeftOutlined style={{ color: "#bbb" }} />} onClick={onPreStep}></Button>添加企业内用户</div>
      }
      footer={
        <Row justify="end">
          <Button type="default" onClick={drawerCancel} style={{ width: "100px", height: '32px', borderRadius: '6px' }}>取消</Button>&nbsp;&nbsp;
          <Button type="primary" onClick={() => {
            if (checkedList.length === 0) {
              message.info("请选择要添加的账号")
              return
            }

            drawerOk(String(checkedListKey), emptyCheckList)
          }} style={{ width: "100px", height: '32px', borderRadius: '6px', marginRight: "16px" }}>确认</Button>
        </Row>

      }
      placement="right"
      closable={true}
      onClose={onClose}
      visible={memberVisible}
      getContainer={false}
      destroyOnClose={true}
      style={{ position: 'absolute', borderRadius: "6px" }}
    >
      <div className={styles.memberBox}>
        <div className={styles.transferBox}>
          <Input className={styles.input} placeholder="请输入搜索内容" prefix={<SearchOutlined style={{ fontSize: "18px", color: '#c0c4cc' }} />} onChange={(e) => {
            searchTree(e.target.value)
          }} />
          <div className={styles.line}></div>
          <div className={styles.transferBox_tree}>
            <Tree
              blockNode={true}
              checkable
              onExpand={onExpand}
              className={styles.tree}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              checkedKeys={checkedKeys}
              // selectedKeys={selectedKeys}
              height={240}
              treeData={treeData}
              onCheck={(checkedKeysValue: React.Key[]) => {
                setCheckedKeys(checkedKeysValue);
                getCheckedItem(checkedKeysValue)
              }}
              titleRender={(nodeData: any) => {
                return <div>
                  {nodeData.avatar ? <img src={nodeData.avatar} style={{ width: "20px", borderRadius: "50%", marginRight: "10px" }} /> : ''}
                  <span>{nodeData.title}</span>
                </div>
              }}
            // onSelect={(selectedKeysValue: React.Key[], info: any) => {
            //   console.log('onSelect', info, selectedKeysValue);
            //   // setSelectedKeys(selectedKeysValue);
            // }}
            >
              {/* {treeData.map((data:any,index:number) => (
                <TreeNode />
              ))} */}
            </Tree>
          </div>
        </div>
        <div className={styles.transferBox}>
          <div className={styles.transferBox_title}>
            已选择&nbsp;<span>{checkedList.length}</span>&nbsp;位联系人
            <div className={styles.line}></div>
            <ul style={{ height: "240px", overflow: "auto", boxSizing: "border-box", padding: "10px 0 0", background: "#f8f8f8" }}>
              {checkedList.map((item: object, index: number) => {
                return <li key={item.key} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <img src={item.avatar} style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "10px" }} />
                    <span>{item.title}</span>
                  </div>
                  <Button type="text" icon={<CloseCircleFilled style={{ color: "#909399" }} />} onClick={() => { delChecked(item, index) }}></Button>
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>

    </Drawer>

  )
}

export default Index;