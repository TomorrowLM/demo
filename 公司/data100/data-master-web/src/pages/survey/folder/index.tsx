import React, {ChangeEvent, ReactHTMLElement, useEffect, useRef, useState} from 'react';
import FolderCard ,{CardItemProps} from './folderCard';
import styles from './folderCard.less';
import {Button, message, Input, Empty} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AlertFolderInput from "./alertFolderInput";
import AlertDeleteConfirm from "./alertDeleteConfirm";
import AlertAddProject,{ProjectItem} from "./alertAddProject";
import creatFolderIcon from '@/assets/creatFolder.png';
import {set} from "immer/dist/utils/common";
import {useAccess} from "@@/plugin-access/access";
import {addProjectCardService, creatFolderService, loadFolderListService, loadProjectListService, deleteFolderService, deleteCardService, moveToFolderService} from "./service";
import {debounce} from "./data.d";
import MemberModal from "../list/memberModal";
import ProjectCard from "@/pages/survey/folder/projectCard";
import AlertFolderList from "./alertFolderList";
import {abortBucketWorm} from "ali-oss/lib/common/bucket/abortBucketWorm";
export interface FolerList {
  folderList?:Array<CardItemProps>
  projectList?:Array<CardItemProps>
}

export default () => {
  const [folderList, setFolderList] = useState<Array<CardItemProps>>([]);
  const [projectList, setProjectList] = useState<Array<CardItemProps>>([]);
  ///
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const [deleteVisible, setDeleteVisible] = React.useState(false);
  const [addProjectVisible, setAddProjectVisible] = React.useState(false);
  const [deleteAlertStr, setDeleteAlertStr] = useState<string>('');
  const [deleteAlertTitle, setDeleteAlertTitle] = useState<string>('');
  const [currentItem, setCurrentItem] = React.useState<CardItemProps>({});
  const [folderName, setFolderName] = useState<string>('');
  const [projectAlertList, setProjectAlertList] = useState<ProjectItem[]>([]);
  const [originProjectAlertList, setOriginProjectAlertList] = useState<ProjectItem[]>([]);
  const [empty,setEmpty] = useState<boolean>(false);
  const memberModalRef:any = useRef(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string>('')
  const [projectInputValue, setProjectInputValue] = useState<string>('')
  const [folderListVisible,setFolderListVisible] = useState<boolean>(false);
  const alertFolderListRef:any = useRef(null);
  const access = useAccess();
// 请求卡片列表
  const loadFolderData = async (word:string) => {
    const param ={
      queryWords:word,
    }
    const data = await loadFolderListService(param);
    if (data){
      console.log(data);
      const {msg} = data;
      if (msg==='success'){
        const {fileList, cardList} = data.data;
        if ((fileList.length+cardList.length)===0){
          setEmpty(true);
        }else{
          setEmpty(false);
        }
        const folderlist = fileList.map((value:any,index:number) => {
          const cardItem:CardItemProps= {
            folderId:value.fileId,
            folderName:value.fileName,
            creatName:value.userName,
            creatTime:value.createTime,
            folderType:1,
            itemIndex:index,
            iconUrl:value.avatar,
            isContainCards:value.isContainCards,
          }
          return cardItem;
        });
        const list = cardList.map((value:any,index:number) => {
          console.log(value.creatTime);
          const cardItem:CardItemProps= {
            folderId:value.cardId,
            folderName:value.cardName,
            creatName:value.userName,
            creatTime:value.createTime,
            folderType:2,
            itemIndex:index,
            progressPercet:value.progress,
            iconUrl:value.avatar,
            sid:value.sid,
            surveyGroup:value.surveyGroup,
            surveyName:value.surveyName,
            showMove:value.moveFlag==='1',
          }
          return cardItem;
        });
        console.log(list);
        setFolderList([...folderlist]);
        setProjectList([...list]);
      }else{
        message.error(msg);
      }

    }

  }
  // 新建卡片弹框列表数据
  const loadProjectAlertData = async () => {
    const data = await loadProjectListService({});

    if (data){
      console.log(data);
      const dataList:ProjectItem[] = data.data;
      const list = dataList.map((value:any,index:number) => {
        const item:ProjectItem = {
          key: value.surveyGroup,
          surveyGroup:value.surveyGroup,
          surveyName:value.surveyName,
          cardStatus:value.cardStatus,
          sid:value.sid,

        }
        return item;
      });
      setProjectAlertList([...list]);
      setOriginProjectAlertList([...list]);
    }
  };
  // 添加项目卡片
  const addProjectCard = async (selectitemList:ProjectItem[]) => {
    console.log(selectitemList);
    const list = selectitemList.map(((value, index) => {
      return value.surveyGroup;
    }));
    const listStr=list.join(',');
    const param = {
      surveyGroupIds:listStr,
    };
    console.log(param);
    const data = await addProjectCardService(param);
    setConfirmLoading(false);
    if (data){
      console.log(data);
      const {msg} = data;
      if (msg==='success'){
        setAddProjectVisible(false);
        message.success('添加成功');
        let i:number;
        for (i=0; i < projectAlertList.length; i+=1){
          const item = projectAlertList[i];
          item.selected=false;
        }
        selectitemList.splice(0,selectitemList.length);
        loadFolderData('');
      }else{
        message.error(msg);
      }

    }
  };
  // 删除文件夹和卡片
  const deleteFolder = async (item:CardItemProps) => {
    console.log('删除',item);
    let data;
    if (item.folderType===1){
      const param = {
        fileId:item.folderId
      }
      data = await deleteFolderService(param);
    }else if(item.folderType===2){
      const param = {
        cardId:item.folderId
      }
      data = await deleteCardService(param);
    }


    const {msg} = data;
    if (msg==='success'){
      setDeleteVisible(false);
      setConfirmLoading(false);
      message.success('删除成功');
      loadFolderData('');
    }else{
      message.error(msg);
    }
  }
// 移动到文件夹
  const moveToFolder = async (folderId:string) => {
    const param = {
      cardId:currentItem.folderId,
      toFileId:folderId,
      fromFileId:"0",
    }
    try {
      const data = await moveToFolderService(param);
      if (data){
        const {msg} = data;
        if (msg==='success'){
          message.success('操作成功');
          setFolderListVisible(false);
          loadFolderData('');
        }else{
          message.error(msg);
        }
      }
    }catch (e) {
      message.error(e);
    }

  }
  useEffect(  () => {
    loadFolderData('');
    loadProjectAlertData();

  },[]);

  const showModal = () => {
    console.log('aaaa');
    setVisible(true);
  };
// 创建文件夹
  const creatFolderData = async (folder:string) => {
    const param = {
      fileName:folder,
    }
    const data = await creatFolderService(param);

    if (data) {
      console.log(data);
      setConfirmLoading(false);
      const {msg} = data;
      if (msg==='success'){
        setVisible(false);
        setFolderName('');
        message.success('添加成功');
        loadFolderData('');
      }else{
        message.error(msg);
      }


    }
  };
  // 创建文件夹确定按钮
  const handleOk = () => {
    if (folderName.length>0){
      setConfirmLoading(true);
      creatFolderData(folderName);
    }else {
      message.error('文件夹名称不能为空');
    }



  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };
  const handleDeleteOk = () => {

    setConfirmLoading(true);
    deleteFolder(currentItem);

  }
  const handleDeleteCancel = () => {
    setDeleteVisible(false);
  }
  const handleAddProject = () => {

  }
  const creatFolder = (e) => {
    setFolderName('');
    showModal();
  }

  const deleteFolderItem = (item:CardItemProps) => {
    if (item.folderType===1){
      if (item.isContainCards==='1'){
        setDeleteAlertTitle('确认删除此文件夹');
        setDeleteAlertStr('删除后，文件夹里的卡片将释放到交付看版列表中，是否删除？');
      }else{
        setDeleteAlertTitle('确认删除此文件夹');
        setDeleteAlertStr('是否删除文件夹？');
      }
    }else if (item.folderType===2){
      setDeleteAlertTitle('确认删除此卡片');
      setDeleteAlertStr('是否删除卡片？');
    }
    setDeleteVisible(true);
    setCurrentItem(item)

  }
const manageMembers = (item:CardItemProps) => {
    console.log('管理成员');
    console.log(item.folderType);
  setModalVisible(true)

  console.log(memberModalRef, memberModalRef.current)

    if (item.folderType===1){
      setFileType('2');
      memberModalRef.current.getManagerUser(item.folderId,'2')
    }else if (item.folderType===2){
      setFileType('3');
      memberModalRef.current.getManagerUser(item.folderId,'3')
    }
}

  // 看板搜索框
  const handelChange = (e:ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      loadFolderData(e.target.value);
  }

  // 移动到文件夹
  const handleOkmove = (folderId:string) => {
    moveToFolder(folderId);
  }
  // 取消移动文件夹
  const cancleMoveToFolder = () => {
    setFolderListVisible(false);
  }
  const moveProjectItem = (item) => {
    setFolderListVisible(true);
    setCurrentItem(item);
    alertFolderListRef.current.loadData();
  }
  const dragProjectItem = (item) => {
    setCurrentItem(item);
  }
  const getFolderItems = () => {

    return folderList.map((value:CardItemProps, index) => {
      value.index=index;
      return <FolderCard item={value}
                         key={value.folderId}
                         deleteFolderItem= {deleteFolderItem}
                         manageMembers={manageMembers}
                         moveTofolder={handleOkmove}


      />
    })

  }
  const getProjectItems = () => {
    return projectList.map((value:CardItemProps, index) => {
      value.index=index;
      return <ProjectCard item={value}
                         key={value.folderId}
                         deleteFolderItem= {deleteFolderItem}
                         manageMembers={manageMembers}
                          moveProjectItem={moveProjectItem}
                          dragProjectItem={dragProjectItem}


      />
    })

  }
  const projectHandleSelect = (e:ChangeEvent<HTMLInputElement>) =>{
    setProjectInputValue(e.target.value);
    if (e.target.value.length>0){
      let i:number;
      const list = [];

      for ( i=0 ; i < originProjectAlertList.length ; i+=1){
        const item:ProjectItem = originProjectAlertList[i];


        if (item.surveyName.indexOf(e.target.value)!==-1||item.sid?.indexOf(e.target.value)!==-1){
          console.log(item);
          list.push(item);
        }

      }
      setProjectAlertList([...list]);
    }else{
      setProjectAlertList([...originProjectAlertList]);
    }
  };
  const projectHandleAlertOk = (selectProjectItem:ProjectItem[]) =>{

    setConfirmLoading(true);
    addProjectCard(selectProjectItem);
  }
  const handleFolderInputChange = (e:ChangeEvent<HTMLInputElement>) => {

    setFolderName(e.target.value) ;

  }
  const addProjectClick = () => {
    loadProjectAlertData().then(()=>{
      setAddProjectVisible(true);
      setProjectInputValue('')
    });

  }
  return (
    <div >
      <AlertFolderInput title="新建文件夹"
                       visible={visible}
                       handleOk={handleOk}
                       handleCancel={handleCancel}
                       handleFolderInputChange={handleFolderInputChange}
                        sureBtnName="确认"
                        content={folderName}
      />
      <AlertDeleteConfirm title={deleteAlertTitle}
                          content={deleteAlertStr}
                          visible={deleteVisible}
                          handleOk={handleDeleteOk}
                          handleCancel={handleDeleteCancel}
                          sureBtnName="确认"
                         />
      <AlertAddProject visible={addProjectVisible}
                       title="添加项目"
                       inputValue={projectInputValue}
                       handleCancel={() => setAddProjectVisible(false)}
                       handleOk={handleAddProject}
                       projectList={projectAlertList}
                       originProjectList={originProjectAlertList}
                       projectHandleSelect={projectHandleSelect}
                       projectHandleOk={projectHandleAlertOk}
      />
      <AlertFolderList ref={alertFolderListRef}
                       title="移动"
                       visible={folderListVisible}
                       handleOK={handleOkmove}
                       handleCancle={cancleMoveToFolder}


      />
      <div style={{ position: 'relative', background: "#fff" }}>
        <MemberModal
          ref={memberModalRef}
          fileType={fileType}
          modalVisible={modalVisible}
          handleModalVisible={(value: boolean) => {
            setModalVisible(value)
          }}
        />
      </div>
      <div className={styles.btnContain}>
        {access.canPermissions('folder:creatCard')?<Button className={styles.projetBtn}
                                                                  type="primary"
                                                                  icon={<PlusOutlined />}
                                                                  onClick={() => addProjectClick()}
        >
          新建卡片
        </Button>:<div></div>}
        {access.canPermissions('folder:creatFolder')?<Button className={styles.folderBtn}
                                                                    type="text"
                                                                    onClick={creatFolder}
        >
          <img style={{
            marginRight:'5px',
            marginTop:'-3px',
          }} alt='' src={creatFolderIcon}/>
          新建文件夹
        </Button>:<div></div>}

        <Input style={{
          marginRight:"16px",
          marginTop:"-5px",
          width:"360px",
          height:"40px",
          borderRadius:"7px",
          float:"right",

        }}
               prefix={<SearchOutlined style={{
                 color:"#c0c4cc",
               }}/>}
               placeholder="搜索"
               onChange={debounce((value:string) => {
                 loadFolderData(value);
               },500)}

        />


      </div>
      <div className={styles.listTitle}>全部</div>
      {empty?<div style={{
        position:"absolute",
        top:"50%",
        transform:"translate(-50%,-50%)",
        left:"50%",
      }}><Empty/></div>:<div><div className={styles.cardContain}>
        {getFolderItems()}
      </div>
        <div className={styles.cardContain}>
          {getProjectItems()}
        </div></div>}

    </div>
  )
}
