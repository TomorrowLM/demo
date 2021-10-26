import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Button, Radio, message, Modal, Input, Checkbox, Row, Col } from 'antd';
import { KeepAlive, useAliveController } from 'react-activation';
import styles from './index.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { queryFastPointAnswer, queryFastPoint, updateTaskAnswerTwo, updateTaskAnswerOne } from './service';

const { TextArea } = Input;
// 一个点位 多道图片题  一个题有多张图片

export default () => {
  let commonParams: object = JSON.parse(localStorage.getItem("commonParams"))
  const [roleId, setRoleId] = useState<string>(localStorage.getItem("roleIds"));//roleId 1:超级管理员 2：管理员 3：一审 4：二审
  const [answers, setAnswers] = useState<Array<any>>([]);//答案列表 极速审批只有图片题
  const [answerImgs, setAnswerImgs] = useState<Array<any>>([]);//答案列表 极速审批只有图片题
  const [fastPoint, setFastPoint] = useState<Array<any>>(JSON.parse(localStorage.getItem("fastPoint")) || []);
  const [curImgIndex, setCurImgIndex] = useState<number>(0);//当前图片
  const [curPointIndex, setCurPointIndex] = useState<number>(0);//当前点位
  const [curTaskAnswer, setCurTaskAnswer] = useState<Object>({pointNo:""});
  const [type, setType] = useState<string>("0");//是否通知审核结果 0：不通知 1：通知
  const [auditStatus, setAuditStatus] = useState<string>("");//审核结果 1：合格 2：不合格
  const [auditOpinion, setAuditOpinion] = useState<string>("");//审核意见
  const [terminalId, setTerminalId] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");//上刊情况
  const [phone, setPhone] = useState<string>("");//上刊情况
  const [previewImg, setPreviewImg] = useState<Boolean>(false);//查看大图  

  const loadNext = () => {
    if (curPointIndex < fastPoint.length - 1) {
      setCurPointIndex(curPointIndex + 1)
      // getQueryFastPointAnswer(fastPoint[curPointIndex + 1].answerId)
    } else if (curPointIndex == fastPoint.length - 1) {
      // message.info("当前点位是最后一个点位")
      setCurPointIndex(0)
      // getQueryFastPointAnswer(fastPoint[0].answerId)
    }
  }
  useEffect(() => {
    getQueryFastPointAnswer(fastPoint[curPointIndex].answerId)
  }, [curPointIndex])
  const getQueryFastPointAnswer = async (answerId: string) => {
    // console.log(answerId)
    setCurImgIndex(0)
    setAnswerImgs([])
    setAnswers([])
    setCurTaskAnswer({pointNo:""})
    setPublishStatus('')
    let res = await queryFastPointAnswer(answerId)
    if (res.code == 200) {
      let answersArr = res.data.answers
      let taskAnswer = res.data.taskAnswer
      let newAnswerImgs: Array<any> = []
      answersArr.forEach((item: object, index: number) => {
        for (let i = 0; i < JSON.parse(item.answer).length; i++) {
          newAnswerImgs.push({
            url: JSON.parse(item.answer)[i],
            questionType: item.questionType
          })
        }
      })
      // console.log(newAnswerImgs)
      if (roleId.indexOf('1') != -1 || roleId.indexOf('2') != -1 || roleId.indexOf('4') != -1) {//二审账号
        setAuditStatus(taskAnswer.secondAuditStatus ? taskAnswer.secondAuditStatus : "1")
        setType(taskAnswer.secondAuditStatus ? (taskAnswer.secondAuditStatus == 2 ? "1" : "0") : "0")
        setAuditOpinion(taskAnswer.secondAuditOpinion ? taskAnswer.secondAuditOpinion : "")
      } else if (roleId.indexOf('3') != -1) {//一审账号
        setAuditStatus(taskAnswer.firstAuditStatus ? taskAnswer.firstAuditStatus : "1")
        setType(taskAnswer.firstAuditStatus ? (taskAnswer.firstAuditStatus == 2 ? "1" : "0") : "0")
        setAuditOpinion(taskAnswer.firstAuditOpinion ? taskAnswer.firstAuditOpinion : "")
      }
      setAnswerImgs(newAnswerImgs)
      setAnswers(res.data.answers)
      setCurTaskAnswer(res.data.taskAnswer)
      setPublishStatus(res.data.publishStatus)
      setPhone(res.data.phone)
    } else if (res.code == 400) {
      // debugger;
      message.error(res.msg)
      loadNext()
    }
  }
  const addListener = (e: any) => {
    console.log(curImgIndex, answerImgs.length - 1)
    if (e.key === "ArrowLeft") {
      if (curImgIndex == 0) {
        prevPoint()
      } else {
        prevImg()
      }
    } else if (e.key === "ArrowRight") {
      if (curImgIndex == answerImgs.length - 1) {
        submitAnswer()
      } else {
        nextImg()
      }
    }
    //  else if (e.key === "ArrowUp") {
    //   prevPoint()
    // } else if (e.key === "ArrowDown") {
    //   nextPoint()
    // }

  }

  useEffect(() => {
    document.addEventListener("keyup", addListener, false)
    return () => {
      document.removeEventListener("keyup", addListener, false)
    }
  })
  // 上一张
  const prevImg = () => {
    if (curImgIndex > 0) {
      setCurImgIndex(curImgIndex - 1)
    }
  }

  // 下一张
  const nextImg = () => {
    if (curImgIndex < answerImgs.length - 1) {
      console.log(curImgIndex)
      setCurImgIndex(curImgIndex + 1)
    }
  }

  const prevPoint = () => {
    if (curPointIndex > 0) {
      setCurPointIndex(curPointIndex - 1)
    }
  }

  const nextPoint = () => {
    if (curPointIndex < fastPoint.length - 1) {
      setCurPointIndex(curPointIndex + 1)
      // getQueryFastPointAnswer(fastPoint[curPointIndex + 1].answerId)
    }
  }
  const submitAnswer = async () => {
    let params = {
      answerId: fastPoint[curPointIndex].answerId,
      taskId: commonParams.taskId,
      auditStatus,
      type,
      auditOpinion,
      pointId: fastPoint[curPointIndex].pointId,
    }
    loadNext()
    let res
    if (roleId.indexOf("1") != -1 || roleId.indexOf('2') != -1 || roleId.indexOf('4') != -1) {//二审账号
      res = await updateTaskAnswerTwo(params)

    } else if (roleId.indexOf('3') != -1) {//一审账号
      res = await updateTaskAnswerOne(params)
    }

    if (res.code == 200) {
      message.success("审核成功")
      // loadNext()
    } else if (res.code == 400) {
      message.error(res.msg)
      // loadNext()
    }
  }
  const goDetail = () => {
    // localStorage.setItem("answerIdIndex", curPointIndex)
    let answerIds = JSON.parse(localStorage.getItem("answerIds"))
    history.push({
      pathname: "/adv/approvalCenter/details",
      search: `?taskId=${commonParams.taskId}&answerId=${answerIds[curPointIndex]}`,
    })
  }
  return (

    <PageContainer title={false}>
      <Modal
        className={styles.modal}
        width="100%"
        height="80%"
        visible={previewImg}
        footer={null}
        onCancel={() => { setPreviewImg(false) }}
      >

        {answerImgs.length > 0 ? (answerImgs[curImgIndex].questionType == '3' ? <img src={answerImgs[curImgIndex].url} alt="" /> :
          <video src={answerImgs[curImgIndex].url} controls="controls"></video>) : ""}
      </Modal>
      {/* <KeepAlive name="极速审批" id={history.location.pathname} saveScrollPosition="screen"> */}
      <div>
        <Row>
          <Col span={8}>
            <Button disabled={curPointIndex == 0} type="primary" className={styles.pointBtn} onClick={prevPoint}>上一个点位</Button>
            <Button disabled={curPointIndex == fastPoint.length - 1} type="primary" className={styles.pointBtn} onClick={nextPoint}>下一个点位</Button>
          </Col>
          <Col>
            <span style={{ lineHeight: "28px" }}>当前点位： {curPointIndex + 1} / {fastPoint.length}，</span>
            {answerImgs.length > 0 ? <span style={{ lineHeight: "28px" }}>当前物料：{curImgIndex + 1} / {answerImgs.length}</span> : ""}
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col span={18}>
            <div className={styles.imgBox}>
              {answerImgs.length > 0 ? <div style={{ cursor: "pointer" }} onClick={() => { setPreviewImg(true) }}>
                {answerImgs.map((mediaItem: any, mediaIndex: number) => {
                  return mediaItem.questionType == '3' ? <img src={mediaItem.url} alt="" style={{ display: mediaIndex == curImgIndex ? "block" : "none" }} /> :
                    <video src={mediaItem.url} controls="controls" style={{ display: mediaIndex == curImgIndex ? "block" : "none" }}></video>
                })}
                {/* {answerImgs[curImgIndex].questionType == '3' ? <img src={answerImgs[curImgIndex].url} alt="" /> :
                  <video src={answerImgs[curImgIndex].url} controls="controls"></video>} */}
              </div> : ""}
              {curImgIndex == 0 ? (curPointIndex == 0 ? "" : <div className={styles.leftPoint} onClick={prevPoint}>
                <LeftOutlined /><span>上一个点位</span>
              </div>) : <div className={styles.leftPoint} onClick={prevImg}>
                <LeftOutlined /><span>上一张</span>
              </div>}
              {(curImgIndex == answerImgs.length - 1) ?
                <div onClick={submitAnswer} className={styles.rightPoint}><span>{curPointIndex == fastPoint.length - 1 ? "完成" : "下一个点位"}</span><RightOutlined /></div>
                : <div onClick={nextImg} className={styles.rightPoint}><span>下一张</span><RightOutlined /></div>}
            </div>
          </Col>
          <Col span={6} className={styles.rightBox}>
            <div >
              {/* 已审批是  绿色  未审批是红色 */}
              <span className={styles.point} style={{ background: (fastPoint[curPointIndex].progress === "已审批" || fastPoint[curPointIndex].progress === "已完成") ? "green" : "red" }}></span>
              {fastPoint.length > 0 ? <span style={{ color: (fastPoint[curPointIndex].progress === "已审批" || fastPoint[curPointIndex].progress === "已完成") ? "green" : "red" }}>{fastPoint[curPointIndex].progress}</span>
                : ""}
            </div>
            {fastPoint.length > 0 ? <div>{fastPoint[curPointIndex].terminalId}</div> : ""}
            <div style={{ margin: "15px 0", color: publishStatus == null ? "red" : "green", fontWeight: "bold" }}>{publishStatus == null ? "空" : publishStatus}</div>
            <Row>
              <Button type="primary" className={styles.marginTB} onClick={goDetail}>查看详情</Button>
            </Row>
            <Row justify="center">
              <Col>{ curTaskAnswer.pointNo}</Col>
            </Row>
            <Row justify="center">
              <Col>用户：{phone}</Col>
            </Row>
            <Row >
              <Radio.Group style={{ margin: "20px auto" }} onChange={e => {
                setAuditStatus(e.target.value)
                setType(e.target.value === "2" ? "1" : "0")
              }} value={auditStatus}>
                <Radio value="1">合格</Radio>
                <Radio value="2">不合格</Radio>
                {roleId.indexOf("3") != -1 ? <Radio value={'3'}>待定</Radio> : ""}
              </Radio.Group>
            </Row>
            <Row style={{ margin: "0 auto 10px", width: "80%" }}>
              <TextArea style={{ width: "100%" }} className={styles.textA} rows={5} maxLength={150} showCount={true} value={auditOpinion} onChange={(e: any) => { setAuditOpinion(e.target.value) }} />
              {roleId.indexOf("3") != -1 && auditStatus == "3" ? "" : <Checkbox onChange={e => { setType(e.target.checked ? "1" : "0") }} checked={type == "1"}><span>通知审核结果</span></Checkbox>}
            </Row>
            <Row >
              <Button onClick={submitAnswer} style={{ margin: "0 auto" }} type="primary">提交</Button>
            </Row>
          </Col>
        </Row>
      </div>
      {/* </KeepAlive> */}
    </PageContainer>
  )
}