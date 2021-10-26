import { Input, Row, Col, message, Button, Table, Drawer, Transfer, Empty, Checkbox, Divider } from 'antd';
import { SearchOutlined, LeftOutlined, CloseCircleFilled } from '@ant-design/icons'
import { Link } from 'umi';
import React, { useState } from 'react';
import { questionInfo, optionInfo } from "@/pages/survey/detail/clean/service"
import CreateModal from "@/components/CreateModal"
import styles from "./index.less"
import { useEffect } from 'react';
const CheckboxGroup = Checkbox.Group;
interface treeItem {
  key: string,
  parentId: string,
  roleId?: string,
  title: string,
  type: null,
  children: treeItem,
}

interface MemberProps {
  plainOptions: any,//全部数据 搜索功能需要
  optionsList: any,//当前页面显示数据
  changeData: any,
  checkedListChange: (value: any) => void,
  isCheckedAll?: boolean,
  isChecked: boolean,
  isShowCheckedAll: boolean,

}
const Index: React.FC<MemberProps> = (props) => {
  const { plainOptions, optionsList, changeData, checkedListChange, isCheckedAll, isChecked, isShowCheckedAll } = props;
  // console.log(optionsList)
  // const [loading, setLoading] = useState<boolean>(false)

  const [checkedItemList, setCheckedItemList] = useState<Array<any>>([])
  const [checkedList, setCheckedList] = useState<Array<any>>([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const getOptionList = async (qid: string, fn: (data: any) => void) => {
    const { code, data } = await optionInfo({
      qid
    })
    if (code == 200) {
      fn(data)
    }
  }
  useEffect(() => {
    return ()=>{
      searchList('')
    }
  },[])
  const delChecked = (delItem: any, index: number) => {
    var newCheckedList = JSON.parse(JSON.stringify(checkedList))
    newCheckedList.splice(index, 1)
    checkedItemList.splice(index, 1)
    setCheckedItemList(checkedItemList)
    checkedListChange(checkedItemList)
    setCheckedList([...newCheckedList])
    setIndeterminate(newCheckedList.length != 0)
  }
  const searchList = (value: any) => {
    var newLists: any = []
    function flattenTreeData(lists: any) {
      lists.forEach((item: any, index: number) => {
        if (item.label.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          newLists.push(item)
        }
      })
    }
    flattenTreeData(plainOptions)
    changeData(newLists)
  }
  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const onchangeItem = (e: any) => {//bug未请求完数据时  不能选上改数据
    let item: any = plainOptions.filter((item: any) => item.value === e.target.value)
    // console.log(item)
    if (e.target.checked) {
      checkedItemList.push(item[0])
      setCheckedItemList([...checkedItemList])
      checkedListChange(checkedItemList)
      // getOptionList(item[0].qid, (data: any) => {
      //   item[0].optionList = data
      //   checkedItemList.push(item[0])
      //   setCheckedItemList([...checkedItemList])
      //   checkedListChange(checkedItemList)
      // })
    } else {
      let newCheckedItemList = checkedItemList.filter((item: any) => item.value !== e.target.value)
      setCheckedItemList(newCheckedItemList)
      checkedListChange(newCheckedItemList)
    }
  }
  const onCheckAllChange = e => {
    var options = optionsList.map(item => {
      if (!item.disabled) {
        return item.value
      }
    })
    setCheckedList(e.target.checked ? options : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    setCheckedItemList(e.target.checked ? [...optionsList.filter((item: any) => !item.disabled)] : [])
    checkedListChange(e.target.checked ? [...optionsList.filter((item: any) => !item.disabled)] : [])
  };

  return (
    <div className={styles.memberBox}>
      <div className={styles.transferBox}>
        <Input className={styles.input} placeholder="请输入搜索内容" prefix={<SearchOutlined style={{ fontSize: "18px", color: '#c0c4cc' }} />} onChange={(e) => {
          searchList(e.target.value)
        }} />
        <div className={styles.line}></div>
        <div className={styles.transferBox_tree}>
          {optionsList.length > 0 ? <CheckboxGroup value={checkedList} onChange={onChange} style={{ lineHeight: "20px" }} disabled={isChecked}>
            {optionsList.map((option: any) => {
              return <div key={option.value}>
                <Checkbox disabled={option.disabled} checked={option.checked} key={option.value} value={option.value} onChange={onchangeItem}>{option.label}</Checkbox>
              </div>
            })}
          </CheckboxGroup> : <Empty />}

        </div>
        <Divider style={{ margin: "12px 0" }} />
        {isShowCheckedAll ? <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} disabled={isCheckedAll}>
          全选
        </Checkbox> : ''}
      </div>
      <div className={styles.transferBox}>
        <div className={styles.transferBox_title}>
          已选择&nbsp;<span>{checkedList.length}</span>&nbsp;项
          <div className={styles.line}></div>
          <ul className={styles.rightBox} style={{ height: "240px", overflow: "auto", boxSizing: "border-box", padding: "10px 0 0", background: "#f8f8f8" }}>
            {checkedItemList.map((item: object, index: number) => {
              return <li key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                <span >{item.label}</span>
                <Button type="text" icon={<CloseCircleFilled style={{ color: "#909399" }} />} onClick={() => { delChecked(item, index) }}></Button>
              </li>
            })}
          </ul>
        </div>
      </div>
    </div>


  )
}

export default Index;