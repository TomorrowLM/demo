import React, {ChangeEvent, useState} from 'react';
import {Menu, Dropdown, Input, Progress, Button, message, Tooltip} from 'antd';
import { history } from 'umi';
import {MoreOutlined} from '@ant-design/icons';
import styles from './folderCard.less';
import folderBg from '@/assets/folderBg.png';
import DropdownOperate from "@/components/DropdownOperate"
import {folderMenuList, menuList} from "@/pages/survey/folder/data.d";
import defaultSettings from "../../../../config/defaultSettings";
import {useAccess} from "@@/plugin-access/access";
import {folderRenameService, cardRenameService} from './service'
import {CardItemProps, CardProps} from './data.d'
const FolderCard: React.FC <CardProps>= (props) => {
  const item:CardItemProps = props.item as CardItemProps;
  const [cardFolderName, setCardFolderName] = useState<string>(item.folderName);
  const [isCardEdit, setIsCardEdit] = useState<boolean>(item.isEdit);
  const access = useAccess();
  // 文件夹重命名
  const folderRename = async (name:string) => {
    const param = {
      fileId:item.folderId,
      fileName:name,
    }
    console.log(param);
    try {
      const data = await folderRenameService(param);
      if (data){
        console.log(data);
        const {msg} = data;
        if (msg==='success'){
          message.success('修改成功');
          item.folderName=name;
          console.log(name);
          setCardFolderName(name);
        }else{
          setCardFolderName(item.folderName);
          message.error(msg);
        }
      }
    }catch (e) {
      setCardFolderName(item.folderName);
      message.error(e);
    }

  }
  // 卡片重命名
  const cardRename = async (name:string) => {
    const param = {
      cardId:item.folderId,
      cardName:name,
    }
    console.log(param);
    try {
      const data = await cardRenameService(param);
      if (data){
        console.log(data);
        const {msg} = data;
        if (msg==='success'){
          message.success('修改成功');
          item.folderName=name;
          setCardFolderName(name);
        }else{
          setCardFolderName(item.folderName);
          message.error(msg);
        }
      }
    }catch (e){
      setCardFolderName(item.folderName);
      message.error(e);
    }

  }
  const handelEdit = (e:ChangeEvent<HTMLInputElement>) => {
    if(item.folderType===1){
      if (access.canPermissions('folder:folderRename')){
        console.log('点击修改名称');
        item.isEdit=!item.isEdit;
        setIsCardEdit(item.isEdit);
        if (item.isEdit===false){
          if (e.target.value.trim()===''){
            message.error('文件夹名称不能为空');
            setCardFolderName(item.folderName);
            return;
          }
            folderRename(e.target.value);



        }
      }
    }else if (item.folderType===2){
      if (access.canPermissions('folder:cardRename')){
        console.log('点击修改名称');
        item.isEdit=!item.isEdit;
        setIsCardEdit(item.isEdit);
        if (item.isEdit===false){
          if (e.target.value.trim()===''){
            message.error('卡片名称不能为空');
            setCardFolderName(item.folderName);
            return;
          }
            cardRename(e.target.value);



        }
      }
    }


  }
  const handelChange = (e) => {
    console.log(e.target.value);

    setCardFolderName(e.target.value);
  }
  // 文件夹目录名称修改
  const handelInput = (e) => {
    console.log('aaaa',e);
    if (item.isEdit){
      if (e)
        e.focus();
    }

  }
  // 菜单点击回调
  const handleOkMenu = (menuItem:any) => {
    if (menuItem.access==="folder:exportData"){
      // 导出数据列表
      console.log("导出数据列表")
    }else if(menuItem.access==="folder:projectInfo"){
      // 项目资料
      console.log("项目资料")
    }else if(menuItem.access==="folder:dataCleean"){
      // 数据清洗
      console.log("数据清洗")
    }else if(menuItem.access==="folder:dataReport"){
      // 数据报告
      console.log("数据报告")
    }else if(menuItem.access==="folder:wordReport"){
      // 文字报告
      console.log("文字报告")
    }else if(menuItem.access==="folder:cardManagers"){
      // 管理成员
      console.log("管理成员")
      props.manageMembers(item);
    }else if(menuItem.access==="folder:cardRename"){
      // 重命名
      console.log("重命名")
      item.isEdit=true;
      setIsCardEdit(true);
    }else if(menuItem.access==="folder:removeCard"){
      // 移除项目
      props.deleteFolderItem(item);
      console.log("移除项目")
    }

  }
  // 菜单点击回调
  const folderHandleOkMenu = (menuItem:any) => {
    if (menuItem.access==="folder:openFolder"){
      // 打开
      // history.push({
      //   path:"/folder/detail",
      //   search:`?fileId=${item.folderId}`
      // })
    }else if(menuItem.access==="folder:folderRename"){
      // 重命名
      console.log("重命名")
      item.isEdit=true;
      setIsCardEdit(true);
    }else if(menuItem.access==="folder:manager"){
      // 成员管理
      console.log("成员管理")
      props.manageMembers(item);

    }else if(menuItem.access==="folder:folderDelete"){
      props.deleteFolderItem(item);
      console.log("删除")
    }

  }
  const onDrop = (e:any) => {
    e.preventDefault();
    console.log(e.target.className);
    const className = e.dataTransfer.getData('text');
    if (className==='myCard'){
      props.moveTofolder(item.folderId);
    }

  }
  const onDragEnter = (e:any) => {
   // console.log(e);
  }
  const onDragOver = (e:any) => {
    e.preventDefault();
  }

  const getMenu = () => {
    if (item.folderType===1){
      return (
        <DropdownOperate menuList={folderMenuList(folderHandleOkMenu,`?fileId=${item.folderId}&fileName=${item.folderName}&source=交付看板`)} position={"bottomRight"} trigger={['click']}>
          <Button className="arrImg" type="text" icon={<MoreOutlined style={{ color: defaultSettings.primaryColor, fontWeight: "bold" }} />}></Button>
        </DropdownOperate>
      )
    }else{
      return (
        <DropdownOperate menuList={menuList(handleOkMenu,`?surveyGroup=${item.surveyGroup}&surveyName=${item.surveyName}&sid=${item.sid}`)} position={"bottomRight"} trigger={['click']}>
          <Button className="arrImg" type="text" icon={<MoreOutlined style={{ color: defaultSettings.primaryColor, fontWeight: "bold" }} />}></Button>
        </DropdownOperate>
      )
    }


  };

  // 展示进度条
  const showProgress = () => {
    if (item.folderType===2){
      return <div style={{
        marginTop:"30px",
        marginLeft:"35px",
        width:"230px",
      }
      }>
      <div style={{
        float:"left",
        fontSize:"12px",
        color:"#909399",
      }
      }>采集进度</div>
        <div style={{
          float:"right",
          fontSize:"12px",
          color:"#909399",
        }}>
          {item.progressPercet+'%'}
        </div>
        <Progress percent={item.progressPercet} showInfo={false} strokeColor="#01CF97" />
      </div>;
    }
    return <div></div>;
  }
  return (
    <div className={styles.myCard}
         key={item.folderId}
         onDrop={onDrop}
         onDragEnter={onDragEnter}
         onDragOver={onDragOver}
         style={{
    background:`url(${folderBg})`,
    backgroundSize:"cover",
    }
    }>
      <div className={styles.folderContain}>
        {isCardEdit ?
          <Input className={styles.folderInput} value={cardFolderName}
                 ref={(input) => handelInput(input)}
                 onBlur={(e) => handelEdit(e)}
                 onChange={(e) => handelChange(e)}
                 type="text"/>
          : <Tooltip title={cardFolderName}>
            <span className={styles.folderTitle}
                 onClick={(e) => handelEdit(e)}>{cardFolderName}</span>
          </Tooltip>}
        {getMenu()}
      </div>
      <div className={styles.iconContain}>
        <img className={styles.iconImg} alt="" src={item.iconUrl}/>
        <div className={styles.creatName}>{item.creatName}</div>
      </div>
      {showProgress()}
      <div className={styles.creatTime}>创建日期：{item.creatTime}</div>
    </div>
  )

}
export default FolderCard
