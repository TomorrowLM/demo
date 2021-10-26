import React, {ChangeEvent, ReactDOM, useEffect, useState} from 'react';
import {Modal, Button, Transfer, Input, List, Checkbox, message} from "antd";
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons'
import ProjectLogo from '@/assets/projectLogo.png';
import styles from './folderCard.less';
import {loadProjectListService, addProjectCardService} from './service'
import {CardItemProps} from "@/pages/survey/folder/folderCard";
export interface AddProjectProps {
  visible?:boolean;
  title?:string;
  inputValue?:string;
  handleOk?:() => any;
  handleCancel?:() => any;
  projectHandleSelect?:(e:ChangeEvent<HTMLInputElement>) => any;
  projectHandleOk?:(itemList:ProjectItem[]) => any;
  projectList?:Array<ProjectItem>;
  originProjectList?:Array<ProjectItem>;
}
export interface ProjectItem {
  key:string;
  surveyGroup?:string;
  surveyName?:string;
  selected?:boolean;
  cardStatus?:string;
  sid?:string;
}
const AlertAddProject:React.FC<AddProjectProps> = (props) => {
  const mockData:ProjectItem[] = [];

  const oriTargetKeys:string[] = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

  const [itemList, setItemList] = useState<ProjectItem[]>([]);
  const [selectitemList, setSelectitemList] = useState<ProjectItem[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [confirmLoading, setConfirmLoading] = useState(false);



  useEffect(() => {

    // })
  },[]);
  const handelChange = (e:any) => {

    props.projectHandleSelect(e);

  }
  const handleOk = () => {
    if (selectitemList.length===0){
      message.error('请选择项目');
      return;
    }
    props.projectHandleOk(selectitemList);

  }
  const handleSelect = (e:any,index:number) => {
    console.log(e,itemList,index);
    props.projectList[index].selected=e.target.checked;
    const list = selectitemList;
    const item = props.projectList[index];
    if (e.target.checked===true){
      list.push(item);

    }else{
      list.pop(item);

    }
    setSelectitemList([...list]);



    // const list = JSON.parse(JSON.stringify(itemList))
    //
    // list[index]= {...list[index],selected:e.target.checked}
    //  setItemList([...itemList]);
  }
  const handleDelete = (index:number) => {
    const list = selectitemList;
    const item = selectitemList[index];
    item.selected=false;
    list.splice(index,1);
    setSelectitemList([...list]);

  }
  const handleCancle =() => {
    setSelectitemList([]);
    props.handleCancel();
  }
  const footer = (
      <div style={{
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-end",
        paddingTop:"20px",
        paddingBottom:"20px",

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
         display:"flex",
         flexDirection:"row",
         background:"#f8f8f8",
         width:"100%",
         height:"270px",
       }
       }>
         <div style={{
           width:"50%",
           height:"100%",
           border: "1px solid #e9e9eb",
           borderRadius: "6px 0px 0px 6px",
         }}>
           <Input style={{
             margin:"16px 5% 0 5%",
             width:"90%",
             height:"32px",
             borderRadius:"7px"

           }}
                  prefix={<SearchOutlined />}
                  placeholder="请输入搜索内容"
                  value={props.inputValue}
                  onChange={(e) => handelChange(e)}

           />
           <div style={{
             margin:"16px 5% 0 5%",
             width:"90%",
             height:"1px",
             background:"#e9e9eb",
           }}></div>
           <div style={{
             margin:"22px 0 0 16px",
             color:"303133",
           }}>请选择项目</div>
           <List style={{
             margin:"10px 5% 0 5%",
             width:"90%",
             height:"150px",
             overflow:"scroll",
           }}
             dataSource={props.projectList}
             renderItem={(item,index) => (
               <List.Item >
                  <div style={{
                    overflow:"hidden",
                    display:"flex",
                    flexDirection:"row",
                    alignItems:"center",

                  }}>
                    <img style={{
                      // float:"left",

                      width:"14px",
                      height:"14px",
                       marginTop:"auto",
                       marginBottom:"auto",

                    }} src={ProjectLogo} alt=''/>
                    <div style={{
                      float:"left",
                      marginLeft:"5px",
                      color:item.cardStatus==='1'?"#909399":"#909399",
                    }}>{item.surveyName}</div>
                  </div>
                 <Checkbox style={{
                   float:"right",
                   marginTop:"auto",
                   marginBottom:"auto",
                   marginRight:"10px",
                 }}
                           onChange={(e) => handleSelect(e,index)}
                            checked={item.selected}
                           disabled={item.cardStatus==='1'}

                 />

               </List.Item>
             )}
           />
         </div>
         <div style={{
           width:"50%",
           height:"100%",
           border: "1px solid #e9e9eb",
           borderRadius: "6px 0px 0px 6px",
         }}>
           <div style={{
             margin:"16px 5% 0 5%",
             width:"90%",
             height:"32px",
             borderRadius:"7px",
             color:"#909399",
             lineHeight:"32px",

           }} >已选择<span style={{color:"#303133",}}>{selectitemList.length}</span>个项目</div>
           <div style={{
             margin:"16px 5% 0 5%",
             width:"90%",
             height:"1px",
             background:"#e9e9eb",
           }}></div>
           <List style={{
             margin:"10px 5% 0 5%",
             width:"90%",
             height:"190px",
             overflow:"scroll",
           }}
                 dataSource={selectitemList}
                 renderItem={(item,index)=> (
                   <List.Item >
                     <div style={{
                       overflow:"hidden",
                       display:"flex",
                       flexDirection:"row",
                       alignItems:"center",
                     }}>
                       <img style={{
                         width:"14px",
                         height:"14px",
                         marginTop:"auto",
                         marginBottom:"auto",
                       }} src={ProjectLogo} alt=''/>
                       <div style={{
                         float:"left",
                         marginLeft:"5px",
                         color:"#909399",
                       }}>{item.surveyName}</div>
                     </div>

                     <CloseCircleFilled  style={{
                       float:"right",
                       marginRight:"10px",
                       color:"#909399",
                     }}
                     onClick={() => handleDelete(index)}/>
                   </List.Item>
                 )}
           />
         </div>
       </div>



      </Modal>
    )
}
export default AlertAddProject
