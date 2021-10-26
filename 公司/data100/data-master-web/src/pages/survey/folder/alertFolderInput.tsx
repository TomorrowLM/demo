import React, {ReactDOM, useState} from 'react';
import {Modal, Input, Button} from "antd";
import styles from './folderCard.less';
import {content} from "html2canvas/dist/types/css/property-descriptors/content";
export interface AlertInputProps {
  title?:string;
  content?:string;
  visible?:boolean;
  handleOk?:() => any;
  handleCancel?:() => any;
  handleFolderInputChange?:(e:ReactDOM) => any;
  sureBtnName?:string;

}
const AlertFolderInput: React.FC<AlertInputProps> = (props) => {

  return (
    <Modal

      visible={props.visible}
      onOk={props.handleOk}
      confirmLoading
      onCancel={props.handleCancel}
      centered
      footer={null}
      closable={false}
    >
      <div style={{
        fontSize:"18px",
        fontFamily:"PingFangSC, PingFangSC-Medium",
        textAlign:"center",
        color:"#303133",
        marginTop:"24px",
        marginBottom:"20px",
      }
      }>{props.title}</div>

      <Input style={{
        width:"70%",
        height:"40px",
        marginLeft:"15%",
        marginRight:"15%",

      }} placeholder="请输入文件夹名称"
             maxLength={30}
             onChange={(e) => props.handleFolderInputChange(e)}
             value={props.content}
      />
      <div style={{
          display:"flex",
          flexDirection:"row",
          justifyContent:"center",
          paddingTop:"20px",
          paddingBottom:"24px",

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
        onClick={props.handleCancel}>取消</Button>
        <Button type="primary"
                style={{
                  width:"100px",
                  height:"32px",
                  borderRadius:"7px",
                  font:"14px",
                }}
                onClick={props.handleOk}
        >{props.sureBtnName}</Button>

      </div>
    </Modal>
  )
}
export default AlertFolderInput
