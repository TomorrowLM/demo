import { Input, Row, Col, message, Button, Table, Drawer, Transfer, Tree, Checkbox, Divider } from 'antd';
import { SearchOutlined, LeftOutlined, CloseCircleFilled } from '@ant-design/icons'
import { Link } from 'umi';
import React, { useState } from 'react';

import CreateModal from "@/components/CreateModal"
import styles from "./index.less"
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
  plainOptions: any,
  optionsList: any,
  changeData: any,
  checkedListChange:(value:any)=>void,
  isRadio:boolean

}
const Index: React.FC<MemberProps> = (props) => {
  const {plainOptions,optionsList,  changeData,checkedListChange,isRadio } = props;
  // console.log(plainOptions)
  // const [loading, setLoading] = useState<boolean>(false)
 
  const [checkedList, setCheckedList] = useState<Array<any>>([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const handleOk = async () => {
    // setLoading(true)
    // var res = await updateSurveyInfo({
    //   refreshTime,
    //   [name]: value,
    //   sid
    // })

    // if (res.code == 200) {
    //   message.success(res.data)
    //   // setIsEdit(false)
    //   setVisible(false);
    //   setLoading(false);
    //   reload()
    // }
  }
  // const onClose = () => {

  // }


 


  const delChecked = (delItem: any, index: number) => {
    var newCheckedList =JSON.parse(JSON.stringify(checkedList))
    newCheckedList.splice(index, 1)
    setCheckedList([...newCheckedList])
    checkedListChange(formateCheckedList([...newCheckedList]))
    setIndeterminate(newCheckedList.length!=0)
  }
  const searchList = (value: any) => {
    var newLists: any = []
    function flattenTreeData(lists: any) {
      lists.forEach((item: any, index: number) => {
        if (item.label.indexOf(value) > -1) {
          newLists.push(item)
        }
      })
    }
    flattenTreeData(plainOptions)
    changeData(newLists)
  }
  const onChange = list => {
    console.log(list)
    setCheckedList(list);
    checkedListChange(formateCheckedList([...list]))
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const onCheckAllChange = e => {
    var options = plainOptions.map(item=>item.value)
    setCheckedList(e.target.checked ? options : []);
    checkedListChange(e.target.checked ?plainOptions:[])
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const formateCheckedList = (checkedList:any)=>{
    var newList:any = []
    checkedList.map((item:any,inde:number)=>{
      return  plainOptions.map((ele:any,eleIndex:number)=>{
        if(item ==ele.value){
          newList.push(ele)
        }
      })
    })
    return newList
  }
  return (

    <div className={styles.memberBox}>
      <div className={styles.transferBox}>
        <Input className={styles.input} placeholder="请输入搜索内容" prefix={<SearchOutlined style={{ fontSize: "18px", color: '#c0c4cc' }} />} onChange={(e) => {
          searchList(e.target.value)
        }} />
        <div className={styles.line}></div>
        <div className={styles.transferBox_tree}>
          <CheckboxGroup options={optionsList} value={checkedList} onChange={onChange} style={{lineHeight:"20px"}}  disabled={isRadio}/>
        </div>
        <Divider style={{margin:"12px 0"}}/>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} disabled={isRadio}>
          全选
        </Checkbox>
      </div>
      <div className={styles.transferBox}>
        <div className={styles.transferBox_title}>
          已选择&nbsp;<span>{checkedList.length}</span>&nbsp;项
          <div className={styles.line}></div>
          <ul className={styles.rightBox} style={{ height: "240px", overflow: "auto", boxSizing: "border-box", padding: "10px 0 0", background: "#f8f8f8" }}>
            {formateCheckedList(checkedList).map((item: object, index: number) => {
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