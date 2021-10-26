import React, {useEffect, useState, useRef} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {Select, Dropdown, Menu, message, Upload, Button, Tooltip, Input,Card,Form, Row, Col, Space } from 'antd';
import { ClockCircleOutlined,UserOutlined, DeleteOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Link, Access, useAccess, history } from 'umi';
import { getAllEmailContact,deleteEmailContact,getMailInfo,sendMail,saveMail,getLatelyEmailContact } from '../AddEmail/service';
import { getTaskAgentInfo } from '../AddTaskDetail/service';
import { tableColumnsData } from './const.d';
import Editor from '@/components/Editor'
import UploadOssFiles from '@/components/UploadOssFiles'
const { Option } = Select;
var INPUT_KEY_INDEX=0;
var INPUT_KEY_VALUE=new Date().getTime();
var AGENT_INDEX=0;
function uniKey() {
  return "key-"+INPUT_KEY_VALUE+INPUT_KEY_INDEX++;
}
let copyActionRef: any = null;

export default () => {
  const { SubMenu } = Menu;
  const { taskId, projectId, agentId_ } = history.location.query;
  const actionRef = useRef();

  const access = useAccess();
  const [timeContact, setTimeContact] = useState([]);
  const [agentId, setAgentId] = useState<any>();
  const [allContact, setAllContact] = useState([]);
  const [agentListData, setAgentListData] = useState<Array<any>>([]);
  const [emailInfo, setEmailInfo] = useState<any>(null);
  const [preview, setPreview] = useState<boolean>(false);
  const [sended, setSended] = useState<boolean>(false);
  const [agentSendListData, setAgentSendListData] = useState<Array<any>>([]);
  const process = () => {
    if (!(typeof emailInfo.receiveEmail == 'string')) {
      emailInfo.receiveEmail=emailInfo.receiveEmail.toString()
    }
    emailInfo.taskId=taskId
    emailInfo.agentId=agentId
  }

  const formSubmit = (callback) => {
    const current = actionRef.current || copyActionRef.current;
    current?.submit()
  }

  const save = () => {
    process()
    saveMail(emailInfo).then(res=>{
      if (res.code==200) {
        message.success('保存成功')
      } else {
        message.error(res.msg)
      }
    })
  }
  const send = (params:any) => {
    process()
    sendMail(emailInfo).then(res=>{
      if (res.code==200) {
        window.taskEmailReload=true
        message.success('发送成功')
        setSended(true)
      } else {
        message.error(res.msg)
      }
    })
  }

  const addReceiveEmail = (email) => {
    process()
    let emailInfoNew=JSON.parse(JSON.stringify(emailInfo))
    if (emailInfoNew.receiveEmail && emailInfoNew.receiveEmail.indexOf(email)!=-1) {
      message.warn('已有此邮件地址')
      return;
    }
    if (emailInfoNew.receiveEmail && emailInfoNew.receiveEmail.length>0) {
      emailInfoNew.receiveEmail+=','
    }
    emailInfoNew.receiveEmail+=email
    setEmailInfo(emailInfoNew)
  }

  const loadTimeContact = () => {
    getLatelyEmailContact().then(res=>{
      if (res.code==200) {
        setTimeContact(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }
  const loadAllContact = () => {
    getAllEmailContact().then(res=>{
      if (res.code==200) {
        setAllContact(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  const deleteContact = (id:string, type:string) => {
    deleteEmailContact({contactId:id}).then(res=>{
      if (res.code==200) {
        message.success('删除成功')
        if (type=='all') {
          loadAllContact()
        } else {
          loadTimeContact()
        }
      } else {
        message.error(res.msg)
      }
    })
  }

  const checkEmail=(rule, value, callback) => {
    if (value.length==0) {
      return Promise.reject('请输入收件人邮箱')
    } else {
      let msg='';
      value.map(email=>{
        let regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]+(\.[a-z]+)?)$/g;
        if (!regex.test(email)) {
          msg+='邮箱<'+email+'>无效'
        }
      })
      if (msg.length>0) {
        return Promise.reject(msg)
      } else {
        return Promise.resolve()
      }
    }
 }

  useEffect(() => {
    loadTimeContact()
    loadAllContact()
    getTaskAgentInfo(taskId).then(res => {
      if (res.code==200) {
       setAgentListData(res.data)
       if (res.data.length>0) {
         setAgentId(res.data[0].agentId)
       }
     } else {
       message.error(res.msg)
     }
    })

    }, [taskId]);

    useEffect(() => {
      if (agentId) {
        getMailInfo(taskId,agentId).then(res => {
          if (res.code==200) {
            res.data.contactEmail='addrive@data100.com.cn'
            setEmailInfo({...res.data})
            setSended(res.data.sendStatus?true:false)
         } else {
           message.error(res.msg)
         }
        })
      }
      return () => {
        if (actionRef.current) {
          copyActionRef = actionRef;
        }
      }

      }, [agentId]);

    useEffect(()=> {
      if (agentId_) {
        setAgentId(agentId_)
        // setSended(true)
      }
    },[])
    const fileFormate = (fileList:any) => {
      // console.log(fileList)
      let list:any = []
      fileList.forEach((item:any,index:number)=>{
        list.push({
          path:item.url,
          name:item.name
        })
      })
     return list
    }
  return (
    <PageContainer title={false}>
      {/* <KeepAlive name="发送邮件" id={ history.location.pathname + history.location.search } saveScrollPosition="screen"> */}
        <div>
        <Row gutter={[16, 16]}>
          <Col span={preview?0:6}>
            <Card title="联系人">
              <Menu
                style={{ width: '100%' }}
                mode="inline"
                >
                <SubMenu key="m1" icon={<ClockCircleOutlined />} title="最近联系人">
                {
                  timeContact.map((item,index)=> {
                    return <Menu.Item key={item.contactId} onClick={e=>{addReceiveEmail(item.contactEmail)}}><span>{item.contactEmail}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={e=>{deleteContact(item.contactId,'time')}}><DeleteOutlined /></span></Menu.Item>
                  })
                }
                </SubMenu>
                <SubMenu key="m2" icon={<UserOutlined />} title="全部联系人">
                  {
                    allContact.map((item,index)=> {
                      return <Menu.Item key={item.contactId} onClick={e=>{addReceiveEmail(item.contactEmail)}}><span>{item.contactEmail}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={e=>{deleteContact(item.contactId,'all')}}><DeleteOutlined /></span></Menu.Item>
                    })
                  }
                </SubMenu>
              </Menu>
            </Card>
          </Col>
          <Col span={preview?24:18} style={{padding:"20px",background:'#fff'}}>
            <Form ref={actionRef} onFinish={send} >
            <div>
              <Row>
                <Col span={16}>
                  {
                    agentListData.map((item,index)=> {
                      return <Button key={item.agentId} type={agentId==item.agentId?"primary":"default"} style={{margin:'0 10px 10px 0'}} onClick={e=>{
                        setAgentId(item.agentId)
                      }}>{item.agentName}</Button>
                    })
                  }
                </Col>
                <Col span={8} style={{textAlign:'right'}}>
                  {preview?null:<Button type="default" onClick={save}>保存</Button>}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {preview?<Button type="default" onClick={e=>{setPreview(false)}}>返回</Button>:<Button type="default" onClick={e=>{setPreview(true)}}>预览</Button>}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {preview?null:(sended?<Dropdown.Button overlay={<Menu><Menu.Item key="resend" onClick={formSubmit}>再次发送</Menu.Item></Menu>}>已发送</Dropdown.Button>:<Button type="default" onClick={formSubmit}>发送</Button>)}
                </Col>
              </Row>
            </div>
            <br/>

            {emailInfo?
            <div style={{border:'1px solid #f0f0f0',padding:'20px'}}>
              <Form.Item label="发件人"
                labelCol={{span: 2}} wrapperCol={{span: 22}}
                // name="contactEmail"
                // initialValue={[emailInfo.contactEmail]}
                rules={[{ required: true, message: '请输入发件人' }]}>
                <Select key={uniKey()} mode="tags" style={{background:'white'}} disabled value={[emailInfo.contactEmail]}>
                  <Option key={emailInfo.contactEmail}>{emailInfo.contactEmail}</Option>
                </Select>
              </Form.Item>
              <Form.Item label="收件人" 
               labelCol={{span: 2}} wrapperCol={{span: 22}}
                // name="receiveEmail"
                // initialValue={emailInfo.receiveEmail.split(',')}
                rules={[{ required: true, message: '请输入收件人' },{validator: checkEmail}]}>
                <Select key={uniKey()} mode="tags" onChange={(e)=>{
                  emailInfo.receiveEmail=String(e);
                  setEmailInfo(JSON.parse(JSON.stringify(emailInfo)))
                  }} value={emailInfo.receiveEmail.length>0?emailInfo.receiveEmail.split(','):[]} disabled={preview}>
                {
                  
                  allContact.map((item:any,index:number)=> {
                    return <Option key={item.contactEmail}>{item.contactEmail}</Option>
                  })
                }
                </Select>
              </Form.Item>
              <Form.Item label="主题"
                labelCol={{span: 2}} wrapperCol={{span: 22}}
                // name="subject" 
                // initialValue={emailInfo.subject}
                rules={[{ required: true, message: '请输入主题' }]}>
                <Input key={uniKey()} onChange={(e)=>{emailInfo.subject=e.target.value}}  disabled={preview} value={emailInfo.subject}/>
              </Form.Item>
              <Form.Item label="添加附件"
               labelCol={{span: 2}} wrapperCol={{span: 22}}
                // initialValue={emailInfo.attachPath}
                // name="attachPath" 
              >
              <UploadOssFiles accept="*" key={uniKey()} size={10} fileLists={emailInfo.attachPath} onChange={(e)=>{
                emailInfo.attachPath=JSON.stringify(fileFormate(e))
                }} disabled={preview}></UploadOssFiles>
              </Form.Item>
              <br/><br/>
              <Form.Item name="content"
              initialValue={emailInfo.content}
              rules={[{ required: true, message: '请输入发送内容' }]}>
                <Editor defaultValue={emailInfo.content} key={uniKey()} height={360} onChange={e=>{emailInfo.content=e}} disabled={preview}></Editor>
              </Form.Item>
            </div>
            :null
            }
          </Form>
          </Col>
        </Row>
        </div>
      {/* </KeepAlive> */}
    </PageContainer>
  )
}
