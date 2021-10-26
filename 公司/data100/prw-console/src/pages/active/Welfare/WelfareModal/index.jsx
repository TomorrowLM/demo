/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/**
 * Author：lsq
 * Date：2021/9/26
 * Description：公益活动管理页面组件
 */
import React, { Component } from 'react';
import { Modal, Form, Input, Space, Button,DatePicker, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import uploadOss from '@/utils/uploadOss';
import moment from 'moment';

import './index.less'

const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default class WelfareModal extends Component{
  state={
    imgUrl: this.props.data?this.props.data.picture:'',// 图片url
    loadingstyle: 'none',
    isUpImg: false,
  }

  // 上传
  ufload = (e) => {
    this.setState({
      loadingstyle: "block",
    })
    if(e.target.files[0]){
      uploadOss(e.target.files[0]).then(res => {
        this.setState({ imgUrl: res.url, loadingstyle: 'none' },()=>{
          if(this.state.imgUrl){
            this.setState({
              isUpImg:false
            })
          }
        })
      }).catch(() => {
        message.error('上传失败，请重新上传', 3)
        this.setState({ loadingstyle: 'none' })
      })
    }else{
      this.setState({ loadingstyle: 'none' })
    }
  }

  handleFinish=(value)=>{
    // debugger
    console.log(this.state.imgUrl,value)
    if(!this.state.imgUrl){
      this.setState({
        isUpImg: true
      })
      return false;
    }

    value.picture=this.state.imgUrl
    this.props.onFinish(value)
  }

  disabledDate=(current)=> {
    return current && current < moment().endOf('day');
  }

  render(){
    const { title, visible, onCancel, data}=this.props
    const { loadingstyle, imgUrl, isUpImg}=this.state
    const isDisabled = title === "查看活动"
    const layout={
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    const tailLayout = {
      wrapperCol: { offset: 18, span: 6 },
    };
    return(
      <div>
        <Modal
        className="modal-boxtwo"
        centered
        footer={ null }
        maskClosable={ false }
        title={title}
        visible={visible}
        onCancel={onCancel}
        >
          <Form
            {...layout}
            onFinish={this.handleFinish}
          >
            <Form.Item
              label="活动主题"
              name="theme"
              initialValue={data?data.theme:undefined}
              rules={[{ required: true, message: '请输入活动主题' }]}
            >
              <Input placeholder="请输入" disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
              label="证书编号"
              name="certificateId"
              initialValue={data?data.certificateId:undefined}
              rules={[{ required: true, message: '请输入证书编号' }]}
            >
              <Input placeholder="请输入" disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
              label="活动开始和结束时间"
              name="activeTime"
              initialValue={data?data.activeTime:undefined}
              rules={[{ required: true, message: '请选择活动开始和结束时间' }]}
            >
              <RangePicker disabled={isDisabled} disabledDate={this.disabledDate}/>
            </Form.Item>
            <Form.Item
              label="本期助力目标"
              name="goal"
              initialValue={data?data.goal:undefined}
              rules={[{ required: true, message: '请输入本期助力目标' }]}
            >
              <Input placeholder="请输入数字" type="number" disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
              label="证书文案"
              name="certificateContent"
              initialValue={data?data.certificateContent:undefined}
              rules={[
                { required: true, message: '请输入证书文案' },
                {
                  validator: async (_, certificateContent) => {
                    if (certificateContent && certificateContent.replace(/[\r\n]/g, "").length > 20) {
                      return Promise.reject(new Error('最多允许输入20字符'));
                    }
                  },
                },
              ]}
            >
              <TextArea rows={3} placeholder="字数控制在20字以内为宜" disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
              label="分享邀请语"
              name="invite"
              initialValue={data?data.invite:undefined}
              rules={[
                  { required: true, message: '请输入分享邀请语' },
                  {type: "string", max:10, message: '最多允许输入10字符' }
              ]}
            >
              <Input placeholder="请输入" disabled={isDisabled}/>
            </Form.Item>
            <Form.Item
              label="活动主图"
              name="picture"
             >
              <Button htmlType="button" className="btn" disabled={isDisabled}><UploadOutlined />点我上传图片</Button>
              {isUpImg?<p style={{color:"red"}}>请上传图片</p>:''}
              <Input type="file" accept=".jpg,.jpeg,.png" capture="camera" id="cardfile"
                title=""
                disabled={isDisabled}
                onChange={this.ufload}
              />
              <p style={{ color: 'red', fontSize: '12px' }}>活动主图尺寸需为：375X200，图片要求.jpg&nbsp; .jpeg&nbsp; .png&nbsp;格式，否则会影响显示效果和用户体验。</p>
              <div className="loading" style={{ display: loadingstyle }}>
                <Spin size="large" />
              </div>
              <img src={imgUrl} className="cardBg" alt="" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" htmlType="submit" style={{visibility:isDisabled?"hidden":"visible"}}>
                  提交
                </Button>
                <Button htmlType="button" onClick={ onCancel }>
                  {isDisabled?"关闭":"取消"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
