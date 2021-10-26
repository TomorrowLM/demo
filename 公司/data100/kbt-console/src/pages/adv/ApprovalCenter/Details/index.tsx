
import React, { useEffect, useState, useRef, createRef } from 'react';
import { KeepAlive } from 'react-activation';
import { Table, Modal, Space, Radio, Input, Checkbox, Button, Upload, message, Row, Col } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined, } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import { getPointAnswerDetail, updateTaskAnswer, auditTaskAuthority } from './service';
// import { initParams } from './data.d';
import { history, useModel } from 'umi';
import { AnyArray } from 'immer/dist/internal';
import UploadImages from '@/components/UploadImagess'
// import { forEach } from 'lodash';


const { TextArea } = Input;

// let initParams: Object = {answer
//   buildingName: String,
//   pointQuestions: Array,
//   pointId: String
// }

export default () => {
  const [detailData, setDetailData] = useState<Object>({});
  const [detailItems, setDetailItems] = useState<Array<any>>([]);
  const [loadings1, setLoadings1] = useState<Boolean>(false);
  const [loadings2, setLoadings2] = useState<Boolean>(false);
  const [loadings3, setLoadings3] = useState<Boolean>(false);
  const [auditStatus, setAuditStatus] = useState<String>('1');
  const [tapeLink, setTapeLink] = useState<any>(null);
  const [auditOpinion, setAuditOpinion] = useState<String>('');
  // const [answerId, setAnswerId] = useState<String>(history.location.query.answerId);
  const [type, setType] = useState<String>("0");
  const [answerIdIndex, setAnswerIdIndex] = useState<any>(0);
  const [questionLists, setQuestionLists] = useState<any>(0);
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const [previewImg, handlePreviewImg] = useState<boolean>(false);
  const [auditTaskEdit, setAuditTaskEdit] = useState<any>('');
  const uploadImagesRef: any = useRef(null)

  const [previewImages, setPreviewImages] = useState<any>([]);

  const [roleId, setRoleId] = useState<String>('');

  const answerIds: string[] = localStorage.getItem('answerIds') ? JSON.parse(localStorage.getItem('answerIds')) : []

  let answerId: String = history.location.query.answerId//answerIds[localStorage.getItem("answerIdIndex")]
  let taskId: any = history.location.query.taskId;

  const getAnswerIdIndex = (answerId: String, answerIds: AnyArray) => {
    for (var i = 0; i < answerIds.length; i++) {
      if (answerId == answerIds[i]) {
        console.log(i)
        setAnswerIdIndex(i)
        localStorage.setItem("answerIdIndex", i)
      }
    }
  }
  const answerDetail = async (taskId: String, answerId: String, curIndex: any) => {
    const res = await getPointAnswerDetail(taskId, answerId)
    if (res.code == 200) {
      if (curIndex) {
        setAnswerIdIndex(curIndex)
      }
      setLoadings1(false)
      setLoadings2(false)
      setLoadings3(false)
      setDetailData(res.data)
      setAuditStatus("1")
      setAuditOpinion("")
      setType("0")
      setQuestionLists(res.data.pointQuestions)
      setTapeLink(res.data.tapeLink)
      let items = [
        { type: '品牌', value: res.data.brand },
        { type: '省份', value: res.data.province },
        { type: '城市', value: res.data.city },
        { type: '城市级别', value: res.data.cityLevel ? "一线" : res.data.cityLevel == '2' ? "二线" : "三线" },
        { type: '地址', value: res.data.address },
        { type: '媒体形式', value: res.data.mediaStyle },
        { type: '楼宇', value: res.data.buildingName },
        { type: '安装位置', value: res.data.installPosition },
        { type: '设备编号', value: res.data.deviceNum },
        { type: '用户', value: res.data.mobile ? res.data.mobile.substr(0, 3) + '****' + res.data.mobile.substr(7, 4) : "" },
        { type: '提交时间', value: res.data.answerTime },
        { type: '执行地址', value: res.data.execAddress },
        { type: '距离', value: res.data.execDistance },
        { type: '邀请码', value: res.data.inviteCode },
        { type: '进度', value: res.data.progress },
        { type: '一审', value: res.data.firstAudit },
        { type: '二审', value: res.data.secondAudit },
        { type: '审核意见', value: res.data.auditOpinion },
      ]
      setDetailItems(items)
    }

  }
  const getauditTaskAuthority = async (taskId: string) => {
    let res = await auditTaskAuthority(taskId)
    if (res.data) {
      setAuditTaskEdit(res.data)

    }
  }
  const noticeChange = (e: any) => {
    let typeValue: String = e.target.checked ? "1" : "0"
    setType(typeValue)
    console.log(type)
  }

  useEffect(() => {
    answerDetail(taskId, answerId, "");
    getAnswerIdIndex(answerId, answerIds)
    getauditTaskAuthority(taskId)
    let roles: any = initialState.currentUser.user.roles
    let roleId: string = ''
    if (initialState.currentUser.user.isSpecialPowers == 1) {//超级管理员
      roleId = "1"
    } else {
      roles.forEach((item: any, index: number) => {
        roleId += item.roleId
      })
    }
    // console.log(roleId)
    setRoleId(roleId)
  }, []);
  const submitReslt = async () => {
    let requestUrl: string = ''
    if (roleId.indexOf("1") != -1 || roleId.indexOf("4") != -1 || roleId.indexOf("2") != -1) { //roleId 1:超级管理员 2：管理员 3：一审 4：二审
      requestUrl = `approve/updateTaskAnswerTwo`
    } else {
      requestUrl = `approve/updateTaskAnswerOne`
    }
    setLoadings1(true)
    const { buildingName, pointId } = detailData
    // console.log(questionLists)
    const res = await updateTaskAnswer(requestUrl, {
      taskId,
      answerId: answerIds[answerIdIndex],
      buildingName: buildingName,
      questions: JSON.stringify(questionLists),
      pointId,
      auditStatus,
      auditOpinion,
      type
    })
    if (res.code == 200) {
      message.success("审核成功")
      setLoadings1(false)
      setLoadings2(false)
      setLoadings3(false)
      if (answerIdIndex == answerIds.length - 1) {
        answerDetail(taskId, answerIds[answerIdIndex], answerIdIndex)
      } else {
        nextLoading()
      }
    } else {
      message.info(res.msg);
    }

  }
  const preLoading = () => {
    if (answerIdIndex == 0) {
      return
    }
    let curIndex: any = answerIdIndex - 1
    localStorage.setItem("answerIdIndex", curIndex)
    setAnswerIdIndex(curIndex)
    setLoadings2(true)

    answerDetail(taskId, answerIds[curIndex], curIndex)
  }
  const nextLoading = () => {
    if (answerIdIndex == answerIds.length - 1) {
      return
    }
    let curIndex = answerIdIndex + 1
    // uploadImagesRef.current.fileListChange()//触发子组件重新渲染
    console.log(answerIds[curIndex], curIndex)
    localStorage.setItem("answerIdIndex", curIndex)
    setAnswerIdIndex(curIndex)
    setLoadings3(true)
    answerDetail(taskId, answerIds[curIndex], curIndex)
  }

  const answerChange = (qIndex: any, e: any, type: String) => {
    if (type == 'radio') {//单选题
      questionLists[qIndex].answerResult = e.target.value
    } else if (type == "video") {//图片题\视频题
      console.log(e)
      questionLists[qIndex].answerResult = e

    } else if (type == "image") {
      if (questionLists[qIndex].watermark && JSON.parse(questionLists[qIndex].watermark).length > 0) {
        questionLists[qIndex].watermark = e
        questionLists[qIndex].answerResult = e
      } else {
        questionLists[qIndex].answerResult = e
      }

    } else if (type == "checkbox") {//多选
      var answerResult = JSON.parse(questionLists[qIndex].answerResult)
      if (e.target.checked) {
        answerResult.push(String(e.target.value))
      } else {
        for (var i = 0; i < answerResult.length; i++) {
          if (e.target.value == answerResult[i]) {
            answerResult.splice(i, 1)
            i--
          }
        }
      }
      questionLists[qIndex].answerResult = JSON.stringify(answerResult)

    } else if (type == "text") {
      questionLists[qIndex].answerResult = e.target.value

    }
    setQuestionLists(JSON.parse(JSON.stringify(questionLists)))
  }

  const columns = [
    {
      title: '题号',
      dataIndex: 'key',
      key: 'key',
      render: (text: any, record: any, index: any) => {
        return index + 1
      }
    },
    {
      title: '题目',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      width: 150,
    },
    {
      title: '答案',
      dataIndex: 'answerResult',
      key: 'answerResult',
      render: (text: any, record: any, qIndex: any) => {
        if (record.questionType == 1) {//选择题
          // console.log(record.options)
          if (record.selectDisplayType == 1) {//单选
            return <Radio.Group onChange={e => { answerChange(qIndex, e, "radio") }} value={text} disabled={auditTaskEdit.indexOf("2") == -1}>
              {record.options.map((item: any, optionIndex: any) => {
                return <Radio key={item.optionId} style={{ display: "block", lineHeight: "30px" }} value={item.optionId}>{item.optionContent} </Radio>
              })}
            </Radio.Group>
          } else {//多选
            return <Row>
              {record.options.map((item: any, optionIndex: any) => {
                return <Col key={optionIndex} span={24} style={{ lineHeight: "30px" }}>
                  <Checkbox disabled={auditTaskEdit.indexOf("2") == -1} value={item.optionId} checked={text.indexOf(item.optionId) != -1} onChange={e => { answerChange(qIndex, e, "checkbox") }}>{item.optionContent}</Checkbox>
                </Col>
              })}
            </Row>

          }

        } else if (record.questionType == 2) {//文本题
          if (record.textDisplayType == 2) {//多行文本
            return <TextArea rows={3} disabled={auditTaskEdit.indexOf("2") == -1} showCount={true} value={text} onChange={e => { answerChange(qIndex, e, "text") }} />
          } else {//单行文本
            return <Input type="text" disabled={auditTaskEdit.indexOf("2") == -1} value={text} onChange={e => { answerChange(qIndex, e, "text") }} />
          }

        } else if (['3', '4'].includes(record.questionType)) {//3:图片题 4:视频题
          if (record.questionType == 3) {
            // ref={uploadImagesRef} 
            let newText = ""
            if (record.watermark && JSON.parse(record.watermark).length > 0) {
              newText = JSON.parse(record.watermark)
            } else {
              newText = text ? JSON.parse(text) : []
            }
            return <div key={answerId + record.questionId} >
              <Button disabled={newText.length == 0} type="primary" className={styles.imgButton} onClick={() => {
                setPreviewImages(newText)
                handlePreviewImg(true)
              }}>预览全部图片</Button>
              <UploadImages type="image" disabled={auditTaskEdit.indexOf("2") == -1} fileList={newText} onChange={e => { answerChange(qIndex, e, "image") }}></UploadImages>

            </div>

          } else if (record.questionType == 4) {//视频
            return <UploadImages type="video" disabled={auditTaskEdit.indexOf("2") == -1} fileList={text ? JSON.parse(text) : []} onChange={e => { answerChange(qIndex, e, "video") }}></UploadImages>
          }
        } else if (record.questionType == 6) {
          return <p>{text}</p>
        }
      }
    },
  ];
  // 题目分为：判断题 填空题  图片题  视频题
  return (
    <PageContainer title={false} className={styles.mg}>
      {/* <KeepAlive name="答案详情" id={history.location.pathname + history.location.search} saveScrollPosition="screen"> */}
      <div className={styles.filterHead}
      >
        <Modal
          visible={previewImg}
          footer={null}
          onCancel={() => { handlePreviewImg(false) }}
        >
          <div style={{ height: "760px", background: "#fff", overflowY: "auto" }}>
            {previewImages.map((img: string, imgIndex: number) => {
              return <img style={{ width: '100%', margin: "5px 0" }} src={img} key={imgIndex} />
            })}
          </div>

        </Modal>
        <h2 className={styles.headTitle}>
          点位审核
        </h2>
        <div className={styles.bg1}>
          <div className={styles.bg1_left}>
            {detailItems.map((item, index) => {
              return <div key={index} className={styles.descriptionsItem}><span className={styles.title}>{item.type}：</span><span className={styles.content}>{item.value}</span></div>
            })}
          </div>
          <div className={styles.bg1_right}>
            <div className={styles.descriptionsItem}>
              <span className={styles.title} style={{width:"96px",lineHeight:"58px"}}>全程录音文件：</span>
              <span className={styles.content}>
              {tapeLink?<audio src={tapeLink} controls></audio>:<span style={{lineHeight:"58px"}}>无</span>}
              </span>
            </div>

          <Table
            rowKey='questionId'
            dataSource={questionLists}
            pagination={false}
            columns={columns}

          ></Table>

        </div>
      </div>
      <div className={styles.center}>
        <Space direction="vertical">
          <div>
            <div className={styles.title}><span className={styles.mustFlag}>*</span>审核结果：</div>
            <Radio.Group onChange={(e: any) => {
              setAuditStatus(e.target.value);
            }} value={auditStatus}>
              <Radio value={'1'}>合格</Radio>
              <Radio value={'2'}>不合格</Radio>
              {roleId.indexOf("3") != -1 ? <Radio value={'3'}>待定</Radio> : ""}
            </Radio.Group>
          </div>
          <div>
            <div className={styles.title}>审核意见：</div>
            <TextArea className={styles.textA} rows={5} maxLength={150} showCount={true} value={auditOpinion} onChange={(e: any) => { setAuditOpinion(e.target.value) }} />
          </div>
          <div className={styles.tips}>
            <Checkbox onChange={noticeChange} checked={type == '1'}><span>通知审核结果</span></Checkbox>
          </div>
        </Space>
        <div className={styles.padSpace}>
          <Space>
            <Button
              key="loading1"
              type="primary"
              icon={<CheckOutlined />}
              loading={loadings1}
              onClick={() => submitReslt()}
            >
              提交
            </Button>
            <Button
              key="loading2"
              type="primary"
              icon={<UpOutlined />}
              disabled={answerIdIndex == 0 || answerIds.length == 0}
              loading={loadings2}
              onClick={() => preLoading()}
            >
              上一个
            </Button>
            <Button
              key="loading3"
              type="primary"
              icon={<DownOutlined />}
              disabled={answerIdIndex == answerIds.length - 1 || answerIds.length == 0}
              loading={loadings3}
              onClick={() => nextLoading()}
            >
              下一个
            </Button>
          </Space>

        </div>
      </div>

      </div>
      {/* </KeepAlive> */ }

    </PageContainer >
  )
}