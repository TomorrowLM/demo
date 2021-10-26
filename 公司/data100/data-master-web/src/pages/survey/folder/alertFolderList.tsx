import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Button, Modal, Tree, Input, message} from 'antd';
import { SearchOutlined, FolderFilled } from '@ant-design/icons'
import folderLogo from '@/assets/folderLogo.png';
import {folterListService} from './service';
import styles from './folderCard.less'
import {debounce} from "./data.d";
export interface AlertFolderListProps {
  title?:string;
  visible?:boolean;
  handleOk?:() => any;
  handleCancel?:() => any;
}
interface FolderProps {
  title?:string;
  key?:string;
  children?:[];
  isLeaf?:boolean;
  folderId?:string;
}
const { DirectoryTree } = Tree;

const treeData = [
  {
    title: 'parent 0',
    key: '1',
    children: [
      { title: 'leaf 0-0', key: '2', isLeaf: true},
      { title: 'leaf 0-1', key: '3', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '4',
    children: [
      { title: 'leaf 1-0', key: '5', isLeaf: true },
      { title: 'leaf 1-1', key: '6', isLeaf: true },
    ],
  },
];
 const AlertFolderList:React.FC<AlertFolderListProps> =forwardRef((props,ref) => {
  console.log(ref);
  const [dataSource,setDataSource] = useState<[]>([]);
  const [extendAll, setExtendAll] = useState<boolean>(true);
  const [currentFolderId,setCurrentFolderId] = useState<string>('');
   const [treeVisible,setTreeVisible] = useState<boolean>(false);
   const [inputVisible,setInputVisible] = useState<boolean>(true);
   const creatTreeData = (parentNode:any) => {
     let childArr:any = [];
        if (parentNode.children.length>0){
          for (let i:number=0;i<parentNode.children.length;i+=1){
            const item = parentNode.children[i];
            const node = {
              title:item.fileName,
              key:item.fileId,
              children:[],
              isLeaf:item.children.length>0,
              folderId:item.fileId,
            }
            childArr = [...childArr,node];
            if (node.children.length>0){
              creatTreeData(node);
            }
          }
        }
   }
  const loadFolderList = async (word:string) => {
    const param = {
      queryWords:word,
    }
    try {
      const data = await folterListService(param);
      if (data){
        console.log(data);
        const {msg} = data;
        if (msg==='success'){
          const {data:arr} = data;
          let childArr:any = [];
          for (let i=0;i<arr.length;i+=1){
            const item = arr[i];
            const node = {
              title:item.fileName,
              key:item.fileId,
              children:[],
              isLeaf:false,
              folderId:item.fileId,
            }
            childArr = [...childArr,node];
          }

          const rootNode:FolderProps = {
            title:"交付看板",
            key:"0",
            children:childArr,
            isLeaf:false,
            folderId:"0",
          }
          const treeArr:any = [rootNode];
          creatTreeData(rootNode);
          console.log(treeArr);
          setDataSource(treeArr);
          setCurrentFolderId('');
          setExtendAll(true);
          setTreeVisible(true);

        }else{
          message.error(msg);
        }
      }
    }catch (e) {
      message.error(e);
    }

  }
  useEffect(() => {

  },[])

   useImperativeHandle(ref,() => (
     {
       loadData:() => {
         setTreeVisible(false);
         setInputVisible(true);
         loadFolderList('');
       }

     }
   ));
   const handleOk = () => {
     if(currentFolderId===''){
       message.error('请选择文件夹');
       return;
     }
      props.handleOK(currentFolderId);
   }
  const handleCancle = () => {
     setInputVisible(false);
    props.handleCancle();
  }
   const onSelect = (keys: React.Key[], info: any) => {
     console.log('Trigger Select', keys, info);
     setCurrentFolderId(info.node.folderId);
   };

   const onExpand = () => {
     console.log('Trigger Expand');
   };

   const footer = (
     <div style={{
       display:"flex",
       flexDirection:"row",
       justifyContent:"flex-end",
       paddingTop:"12px",
       paddingBottom:"12px",

     }
     }>
       <Button style={{
         marginRight:"10px",
         width:"100px",
         height:"32px",
         borderRadius:"7px",
         font:"14px",
       }
       }
               onClick={handleCancle}>取消</Button>
       <Button type="primary"
               style={{
                 width:"100px",
                 height:"32px",
                 borderRadius:"7px",
                 font:"14px",
               }}
               onClick={handleOk}
       >确认</Button>

     </div>
   )
   return (
     <Modal

       title="添加项目"
       visible={props.visible}
       onOk={props.handleOk}
       onCancel={handleCancle}
       centered
       footer={footer}
     >
       <div style={{
         width:"100%",

         boxSizing:"border-box",
         paddingLeft:"9px",
         paddingRight:"9px",
         marginTop:"9px"
       }}>
         <div style={{
           background:"#f8f8f8",
           width:"100%",
           minHeight:"358px",
           border:"1px solid #e9e9eb",
           borderRadius:"6px",
           paddingLeft:"16px",
           paddingRight:"16px",
         }}>{inputVisible?
           <Input style={{

             marginTop:"16px",
             marginBottom:"10px",
             height:"32px",
             background:"#ffffff",
             border:"1px solid #dcdfe6",
             borderRadius:"6px",
             width:"100%",

           }}
                  onChange={debounce((value:string) => {

                    loadFolderList(value);
                  },500)}
                  prefix={<SearchOutlined />}
                  placeholder="请输入搜索内容"
           />:<></>
         }

           <hr className={styles.hr}
           />
           {treeVisible?<DirectoryTree
             style={{
               height:"300px",
               maxHeight:"300px",
               background:"#f8f8f8",
               color:"#303133",
               fontSize:"14px",
               lineHeight:"20px",
             }}
             icon={<img src={folderLogo} alt=''/>}
             defaultExpandAll={extendAll}
             onSelect={onSelect}
             onExpand={onExpand}
             treeData={dataSource}
             // expandedKeys={['0']}

           />:<></>}

         </div>
       </div>

     </Modal>
   )

 })
export default AlertFolderList;
