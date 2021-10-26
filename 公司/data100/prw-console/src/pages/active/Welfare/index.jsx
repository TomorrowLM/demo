/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/**
 * Author：lsq
 * Date：2021/9/24
 * Description：公益活动管理页面
 */

import React, { Component } from 'react';
import { Row, Col, Space, Button, Radio, Select, Table, message, Tooltip } from 'antd';
import { PlusOutlined, DownloadOutlined, EditOutlined, DeleteOutlined,SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import WelfareModal from './WelfareModal';
import {getList, addWelfare, deleteWelfare, editWelfare, downloadUrl } from './service'
import "./index.less"

const { Option } = Select;

class WelfareActivity extends Component {
  state = {
    limit: 10,  // 每页条数
    offset: 1,  // 页码
    datas: [],  // 列表数据
    total: 0,   // 总数据条数
    status: "", // 活动状态
    addVisible:false, // 新增开关
    editVisible:false, // 编辑开关
    showVisible:false, // 查看开关
    selecteData:{},// 选中数据
    editWelfareModalkey:0,// 配置组件key值
    showWelfareModalkey:101,
  };

  componentDidMount() {
    this.getWelfareList()
  }

  // 获取活动列表
  getWelfareList = async () => {
    try {
      const {limit,offset,status}=this.state
      const param = {
       limit,offset,status
      }
      const {data}= await getList(param)
      this.setState({
        datas:data.list,
        total:data.total,
      })
    } catch (err) {
      console.log(err)
    }
  }

  // 选择活动状态
  createName = (value) => { this.setState({ status: value }) }

  // 新增活动
  handleAdd = () => { this.setState({ addVisible: true }) }

  // 提交新增or编辑
  addOrEditWelfareActive = async (value, type) =>{
    try {
      const {selecteData}=this.state
      value.startTime = (value.activeTime && value.activeTime[0] && value.activeTime[0].format('YYYY-MM-DD')) || undefined
      value.endTime = (value.activeTime && value.activeTime[1] && value.activeTime[1].format('YYYY-MM-DD')) || undefined
      delete value.activeTime
      const param={
        ...value,
      }
      const setParam = {}
      if(type === "add"){
        await addWelfare(param)
        message.success("创建成功")
        setParam.addVisible = false
      }else{
        param.activityId = selecteData.activityId
        param.id = selecteData.id
        await editWelfare(param)
        message.success("编辑成功")
        setParam.editVisible = false
      }
      this.setState({
        ...setParam
      },this.getWelfareList)
    } catch (err) {
      console.log(err)
    }
  }

  // 编辑or查看
  handleEditOrShow=(record, type)=>{
    const {editWelfareModalkey,showWelfareModalkey}=this.state
    const selecteData={
      ...record,
      activeTime:[moment(record.startTime?record.startTime:undefined, 'YYYY-MM-DD'),moment(record.endTime?record.endTime:undefined, 'YYYY-MM-DD')]
    }
    const param = type==="edit"?{
      editVisible:true,
      selecteData,
      editWelfareModalkey:(editWelfareModalkey + 1) > 100 ? 0 : (editWelfareModalkey + 1),
    }:{
      showVisible:true,
      selecteData,
      showWelfareModalkey:(showWelfareModalkey + 1) > 200 ? 101 : (showWelfareModalkey + 1),
    }
    this.setState({
      ...param
    })
  }

  // 删除
  handleDel =async (id) => {
    try{
      await deleteWelfare({id})
      message.success('删除成功')
      this.getWelfareList()
    }catch (err){
      console.log(err)
    }
  }

  // 分页查询
  handleOnChange = (pageNum,pageSize)=>{
    this.setState({
      offset:pageNum,
      limit:pageSize
    },this.getWelfareList)
  }

  // 下载列表
  downloadClick= async()=>{
    window.location.href = `${downloadUrl}?status=${this.state.status}`
  }

  // 渲染table
  renderTable = () => {
    const { datas, offset, limit, total} = this.state
    const columns = [
      {
        title: '活动ID',
        dataIndex: 'activityId',
        width: 120,
      }, {
        title: '操作',
        dataIndex: 'edit',
        width: 60,
        render: ( text, record ) => {
          if (record) {
            if (record.status == 0) {
              return <div>
                <Tooltip placement="bottom" title="编辑">
                  <EditOutlined style={{ fontSize: "18px", color: '#7979f5' }}
                  onClick={this.handleEditOrShow.bind(this, record, "edit")}/>
                </Tooltip>
                <Tooltip placement="bottom" title="删除">
                  <DeleteOutlined style={{ fontSize: "18px", color: '#7979f5', marginLeft: '12px' }}
                  onClick={this.handleDel.bind(this, record.id)} />
                </Tooltip>
              </div>
            }
            return <Tooltip placement="bottom" title="查看">
              <SearchOutlined style={{ fontSize: "18px", color: '#7979f5' }}
              onClick={this.handleEditOrShow.bind(this, record, "show")}/>
            </Tooltip>
          }
        },
      }, {
        title: '当前活动状态',
        dataIndex: 'status',
        width: 80,
        render: (text,record) => {
          if(record) {
            switch (record.status) {
              case 0 :
                return '未开始'
              case 1 :
                return '进行中'
              default :
                return '已结束'
            }
          }
        },
      }, {
        title: '活动创建时间',
        dataIndex: 'createTime',
        width: 120,
      }, {
        title: '活动开始时间',
        dataIndex: 'startTime',
        width: 120,
      }, {
        title: '活动结束时间',
        dataIndex: 'endTime',
        width: 120,
      }, {
        title: '问卷参与量',
        dataIndex: 'questionnaireNum',
        width: 63,
      }, {
        title: '参与人数',
        dataIndex: 'participantNum',
        width: 60,
      },
      {
        title: '助力目标',
        dataIndex: 'goal',
        width: 60,
      }, {
        title: '是否达标',
        dataIndex: 'success',
        width: 60,
        render:(text,record) => {
          if(record) {
            switch (record.success) {
              case 0 :
                return '否'
              default :
                return '是'
            }
          }
        },
      }
    ];
    return (
      <Table className="table"
        columns={columns}
        dataSource={datas}
        rowKey={record=>record.id}
        scroll={{ x: 1080, y: 430 }}
        bordered
        align="center"
        pagination={{
          current: offset,
          pageSize: limit,
          position:["bottomLeft"],
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: this.handleOnChange,
          showTotal: total => `总共 ${total} 条记录`
        }}
      />
    )
  }

  render() {
    const {addVisible, editVisible, selecteData, editWelfareModalkey, showVisible, showWelfareModalkey}=this.state
    return (
      <PageContainer title={false}>
        <div className="gutter-example">
          <div style={{ margin: '20px', border: '1px solid #ccc', borderTop: '3px solid #108ee9', borderRadius: '3px', padding: '10px' }}>
            <h2>公益活动管理</h2>
            <div>
              <Row span={24} style={{ minWidth: 790, paddingTop: '10px' }}>
                <Col span={16} style={{ marginTop: '10px' }}>
                  <Row span={24} style={{ minWidth: '680px' }}>
                    <Col span={8} style={{ minWidth: '150px' }}>活动状态：
                      <Select defaultValue="请选择活动状态" style={{ width: '150px' }} onChange={this.createName} >
                        <Option value='' >--全部--</Option>
                        <Option value='0'>未开始</Option>
                        <Option value='1'>进行中</Option>
                        <Option value='2'>已结束</Option>
                      </Select>
                    </Col>
                    <Col span={5}>
                      <Button type="primary" onClick={() => { this.handleOnChange(1,10) }}>查询</Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Radio.Group >
                  <Space>
                    <Radio.Button className="pro-add" onClick={this.handleAdd}><PlusOutlined />  创建活动</Radio.Button>
                    <Radio.Button className="pro-add" onClick={this.downloadClick}><DownloadOutlined />  下载列表</Radio.Button>
                  </Space>
                  </Radio.Group>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px', background: '#fff', borderRadius: '5px' }}>
                {this.renderTable()}
              </Row>
              <div>
                <p>1、进行中或已结束活动，不可进行编辑。</p>
              </div>
            </div>
          </div>
          <WelfareModal
            title="创建活动"
            visible={addVisible}
            onCancel={()=>{this.setState({addVisible:false})}}
            onFinish={(value)=>{this.addOrEditWelfareActive(value, "add")}}
          />
          <WelfareModal
            key={editWelfareModalkey}
            title="编辑活动"
            visible={editVisible}
            onCancel={()=>{this.setState({editVisible:false,selecteData:{}})}}
            onFinish={(value)=>{this.addOrEditWelfareActive(value, "edit")}}
            data={selecteData}
          />
          <WelfareModal
            key={showWelfareModalkey}
            title="查看活动"
            visible={showVisible}
            onCancel={()=>{this.setState({showVisible:false,selecteData:{}})}}
            data={selecteData}
          />
        </div>
      </PageContainer>
    )
  }
}

export default WelfareActivity;
