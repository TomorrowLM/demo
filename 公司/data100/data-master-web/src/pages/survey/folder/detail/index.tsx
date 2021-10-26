// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import ProjectCard from "../projectCard";
import {CardItemProps} from '../data.d';
import styles from "@/pages/survey/folder/folderCard.less";
import {Button, Input, message, Breadcrumb, Empty} from "antd";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import creatFolderIcon from "@/assets/creatFolder.png";
import {useAccess} from "@@/plugin-access/access";
import {
  addProjectCardService, deleteCardService,
  deleteFolderService,
  loadFolderListService,
  loadProjectListService, moveToFolderService
} from "@/pages/survey/folder/service";
import AlertAddProject, {ProjectItem} from "@/pages/survey/folder/alertAddProject";
import {history} from "umi";
import AlertDeleteConfirm from "@/pages/survey/folder/alertDeleteConfirm";
import {debounce} from "../data.d";
import MemberModal from "@/pages/survey/list/memberModal";
import AlertFolderList from "@/pages/survey/folder/alertFolderList";

/**
 * @author sdx
 * @date 2021/6/29
 *  项目资料
 */

const Report: React.FC = () => {
  const access = useAccess();
  const [addProjectVisible, setAddProjectVisible] = React.useState(false);
  const [projectAlertList, setProjectAlertList] = useState<ProjectItem[]>([]);
  const [originProjectAlertList, setOriginProjectAlertList] = useState<ProjectItem[]>([]);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<CardItemProps>({});
  const [projectList, setProjectList] = useState<Array<CardItemProps>>([]);
  const [deleteVisible, setDeleteVisible] = React.useState(false);
  const [empty,setEmpty] = useState<boolean>(false);
  const [addMemberVisible, setAddMemberVisible] = useState<boolean>(false);
  const [deleteAlertStr, setDeleteAlertStr] = useState<string>('');
  const [deleteAlertTitle, setDeleteAlertTitle] = useState<string>('');
  const memberModalRef:any = useRef(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string>('')
  const [projectInputValue, setProjectInputValue] = useState<string>('')
  const [folderListVisible,setFolderListVisible] = useState<boolean>(false);
  const alertFolderListRef:any = useRef(null);
  const {fileId} = history.location.query;
  console.log(history);
  // 请求卡片列表
  const loadFolderData = async (word:string) => {
    const param ={
      queryWords:word,
      fileId,
    }
    const data = await loadFolderListService(param);
    setConfirmLoading(false);
    if (data){
      console.log(data);
      const {msg} = data;
      if (msg==='success'){
        const { cardList } = data.data;
        if (cardList.length===0){
          setEmpty(true);
        }else{
          setEmpty(false);
        }
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
      fileId:history.location.query.fileId,
    };
    console.log(param);
    const data = await addProjectCardService(param);
    setConfirmLoading(false);
    if (data){
      console.log(data);
      const {msg} = data;
      if (msg==='success'){
        message.success('添加成功');
        setAddProjectVisible(false);
        let i:number;
        for (i=0; i < projectAlertList.length; i+=1){
          const item = projectAlertList[i];
          item.selected=false;
        }
        selectitemList.splice(0,selectitemList.length);
        loadFolderData('');
      }

    }
  };
  // 删除文件夹和卡片
  const deleteCard = async (item:CardItemProps) => {
    console.log('删除',item);

    const param = {
      cardId:item.folderId,
      fileId:history.location.query.fileId,
    }
    const data = await deleteCardService(param);

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
      fromFileId:fileId,
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
  useEffect(() => {
    setConfirmLoading(true);
    loadFolderData('');
  }, [])

  const addProjectClick = () => {
    loadProjectAlertData().then(()=>{
      setAddProjectVisible(true);
      setProjectInputValue('')
    });

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
  // 看板搜索框

  // const handelChange = (e:ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //
  //   loadFolderData(e.target.value);
  // }
  const handleAddProject = () => {

  }
  const dragProjectItem = (item) => {
    setCurrentItem(item);
  }
  // 删除卡片
  const deleteFolderItem = (item:CardItemProps) => {
    setDeleteVisible(true);
    setDeleteAlertTitle('确认删除此卡片');
    setDeleteAlertStr('是否删除卡片？');
    setCurrentItem(item)

  }
  const handleDeleteCancel = () => {
    setDeleteVisible(false);
  }
  const handleDeleteOk = () => {

    setConfirmLoading(true);
    deleteCard(currentItem);

  }
  // 返回上一级
  const breadClick = () => {
    history.replace('/folder');
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
  // 管理成员
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
  // 返回卡片item
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
  return (
    <div>
      <AlertDeleteConfirm title={deleteAlertTitle}
                          content={deleteAlertStr}
                          visible={deleteVisible}
                          handleOk={handleDeleteOk}
                          handleCancel={handleDeleteCancel}
                          sureBtnName="确认"
      />
      <AlertAddProject visible={addProjectVisible}
                       title="添加项目"
                       handleCancel={() => setAddProjectVisible(false)}
                       inputValue={projectInputValue}
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
      <div>
        <Breadcrumb style={{
          marginLeft:"15px",
        }}>
          <Breadcrumb.Item><div className="backHover" onClick={breadClick} >{history.location.query.source}</div></Breadcrumb.Item>

          <Breadcrumb.Item>{history.location.query.fileName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {
        empty?<div style={{
          position:"absolute",
          top:"50%",
          transform:"translate(-50%,-50%)",
          left:"50%",
        }}><Empty/></div>:<div className={styles.cardContain}>
          {getProjectItems()}
        </div>
      }

    </div>
  );
};

export default Report;
