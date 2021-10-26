import React, {ReactDOM, useState} from 'react';
import {Modal, Input, Button} from "antd";
import styles from './folderCard.less';
import {AlertInputProps} from "./alertFolderInput";

const AlertDeleteConfirm: React.FC<AlertInputProps> = (props) => {

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

      <div style={{
        fontSize:"14px",
        fontFamily:"PingFangSC, PingFangSC-Regular",
        color:"#606266",
        marginLeft:"15%",
        marginRight:"15%",
      }
      }>{props.content}</div>
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
        >确认</Button>

      </div>
    </Modal>
  )
}
export default AlertDeleteConfirm
