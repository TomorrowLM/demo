import { Input, Row, Col, message, Button, Table, Drawer, Transfer, Tree, Menu } from 'antd';
import { SearchOutlined, LeftOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Link } from 'umi';
import React, { useState, forwardRef, useImperativeHandle, Fragment } from 'react';
import defaultSettings from '../../../../config/defaultSettings';
import CreateModal from "@/components/CreateModal"
import styles from "./index.less"
import { deptUserTree, selectManagerUserInfo, addManagerUserInfo, deleteManagerUserInfo } from './service';
import Member from "./member"
import { useEffect } from 'react';
interface treeItem {
  key: string,
  parentId: string,
  roleId?: string,
  title: string,
  type: null,
  children: treeItem,
}

interface MemberProps {
  modalVisible: boolean,
  currentSid: string,
  handleModalVisible: (value: boolean) => void,
  // onClose: object,
  // onPreStep: any,
  // treeData: Array<treeItem>,
  // // checkedKeys: any,
  // changeTreeData: any,
  // treeList: Array<treeItem>,
  // drawerOk:any,//确认添加
  // drawerCancel:any,//取消
  fileType: String,//文件类型:1问卷列表 2文件夹 3卡片
}
const Index: React.FC<MemberProps> = forwardRef((props, ref) => {
  console.log(ref)
  const { currentSid, modalVisible, handleModalVisible, fileType } = props;
  const modalWidth = 640

  const [memberVisible, setMemberVisible] = useState<boolean>(false)
  const [treeData, setTreeData] = useState<Array<any>>([])
  const [treeList, setTreeList] = useState<Array<any>>([])
  const [dataSource, setDataSource] = useState<Array<any>>([])
  const [fileId, setFileId] = useState<string>('')
  const onCancel = () => {
    handleModalVisible(false)
    setMemberVisible(false)
    setDataSource([])
  }
  const getMembers = async (id: string) => {
    const { data } = await deptUserTree(id)//00代表内部  01代表外部
    if (data) {
      setTreeData(data[0].children)
      setTreeList(data[0].children)
      setMemberVisible(true)
    }
  }
  const getManagerUserInfo = async (fileId: string,) => {
    const { code, data } = await selectManagerUserInfo({
      fileId,
      fileType
    })
    setDataSource(data)
  }
  useImperativeHandle(ref, () => ({
    getManagerUser: (fileId: string,) => {
      setFileId(fileId)
      getManagerUserInfo(fileId)
    }

  }))
  const columns:Array<any> = [
    {
      title: "姓名",
      dataIndex: "nickName"
    },
    {
      title: "账号类型",
      dataIndex: "roleName"
    },
    {
      title: "操作",
      //dataIndex: "id",
      render: (item) => {
        return (
          <div>
            {
              item.isShowCopy==='1'? <Fragment><textarea id="member-copyinput" style={{
                position:'absolute',
                top: '0px',
                left: '0px',
                opacity: '0',
                zIndex: '-10',
              }}
                                                         defaultValue='复制'
              ></textarea><Button type="text" style={{color: defaultSettings.primaryColor}} onClick={() => {
                onCopy(item)
              }}>复制账号</Button></Fragment>:''
            }
            <Button type="text" style={{color: defaultSettings.primaryColor}} onClick={() => {
              delMember(item.id)
            }}>删除</Button>
          </div>
        )
      }
    }
  ]
  useEffect(() => {
  }, [])
  const onCopy = (item) => {

    const input = document.getElementById("member-copyinput");
    input.value = `欢迎使用数字一百项目交付系统\n登录地址：${item.loginUrl}\n登录账号：${item.userName}\n登录密码：${item.password}（注：若密码已更改，则使用已更改密码登录）\n\n为了提升您的账号安全性，请您登录系统后，尽快修改账户密码。`; // 修改文本框的内容
    input.select(); // 选中文本
    const result = document.execCommand("copy"); // 执行浏览器复制命令
    if (result){
      message.success('复制成功');
    }

  }
  const delMember = (id: string) => {
    deleteManagerUserInfo({ id }).then((res) => {
      if (res.code == 200) {
        message.success(res.data)
        getManagerUserInfo(fileId)
      }
    })
  }
  return (
    <CreateModal width={modalWidth} onCancel={onCancel} title='成员管理' modalVisible={modalVisible}>
      <Row justify="space-between" style={{ height: "400px" }}>
        <Col span="12" style={{ height: "50px" }} key="add1">
          <Button type="text" icon={<PlusCircleOutlined style={{ fontSize: "30px", color: "#e3e6eb", margin: "0 5px 0 0 " }} />} style={{ display: "flex", alignItems: "center", margin: "0 auto", color: '#303133', fontWeight: "bold" }} onClick={() => {
            getMembers('00')
          }}>添加企业内用户</Button>
        </Col>
        <Col span="12" style={{ height: "50px" }} key="add2">
          <Row justify="center" >
            <Col>
              <Button type="text" icon={<PlusCircleOutlined style={{ fontSize: "30px", color: "#e3e6eb", margin: "0 5px 0 0 " }} />} style={{ display: "flex", alignItems: "center", margin: "0 auto", color: '#303133', fontWeight: "bold" }} onClick={() => {
                getMembers('01')
              }}>添加客户账号</Button>
            </Col>
          </Row>
        </Col>
        <Col span="24" key="list">
          <Table size="middle" columns={columns} dataSource={dataSource} scroll={{ x: 'max-content',y:"320px" }} pagination={false} />
        </Col>

      </Row>
      <Member
        drawerOk={(adminId: string,fn?:any) => {
          addManagerUserInfo({ fileId, fileType, adminId }).then((res) => {
            fn()
            if (res.code == 200) {
              message.success(res.data)
              setMemberVisible(false)
              getManagerUserInfo(fileId)

            }
          })
        }}
        drawerCancel={() => {
          setMemberVisible(false)
          // setDataSource([])
        }}
        treeList={treeList}
        changeTreeData={(value: any) => {
          setTreeData(value)
        }}
        treeData={treeData}
        memberVisible={memberVisible}
        width={modalWidth}
        onClose={onCancel}
        onPreStep={() => { setMemberVisible(false) }}
      ></Member>


    </CreateModal>

  )
})

export default Index
