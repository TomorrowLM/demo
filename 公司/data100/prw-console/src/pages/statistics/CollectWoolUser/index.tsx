import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, DatePicker, Space, Button, message } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { update } from 'lodash';
import { downLoadRuleUser,downLoadBrushAnswerUser,exportMouthReportData,downLoadUpdateDaily } from './service';

const formatDateParams = (date: moment.MomentInput) => { return moment(date).format('YYYY-MM-DD') };

export default () => {
  const [queryDate, setQueryDate] = useState<string>('');
  const [queryAnswerUserDate, setQueryAnswerUserDate] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [queryDaily, setQueryDaily] = useState<string>('');

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current > moment().startOf('day');
  }

  const downLoadList = async () => {
    if (!queryDate) {
      message.info('请选择日期');
      return false
    }
    await downLoadRuleUser({ queryDate })
    message.success('已提交，请在下载中心查看下载进度！');
  }
  const downLoadAnswerUserList = async () => {
    if (!queryAnswerUserDate) {
      message.info('请选择日期');
      return false
    }
    await downLoadBrushAnswerUser({ queryDate:queryAnswerUserDate })
    message.success('已提交，请在下载中心查看下载进度！');
  }
  const DownLoadUpdateDaily = async () => {
    if (!queryDaily) {
      message.info('请选择日期');
      return false
    }
    await downLoadUpdateDaily({date:queryDaily})
    message.success('更新成功')
  }
  return (
    <PageContainer title={false}>
      <Card>
        <Space>
          <span>疑似薅羊毛用户：</span>
          <DatePicker disabledDate={disabledDate} onChange={(e) => setQueryDate(formatDateParams(e))} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => downLoadList()}>下载</Button>
        </Space>
      </Card>
      <Card>
        <Space>
          <span>疑似刷题用户：</span>
          <DatePicker disabledDate={disabledDate} onChange={(e) => setQueryAnswerUserDate(formatDateParams(e))} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => downLoadAnswerUserList()}>下载</Button>
        </Space>
      </Card>
      <Card>
        <Space>
          <span>月度报告：</span>
          <DatePicker format="YYYY-MM" picker="month" disabledDate={disabledDate} onChange={(date,dateString) => setMonth(dateString)} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
            window.location.href = `/taidu8/crontab/daily/exportMouthReportData?date=${month}`
          }}>下载</Button>
        </Space>
      </Card>
      <Card>
        <Space>
          <span>日报下载：</span>
          <DatePicker disabledDate={disabledDate} onChange={(e) => setQueryDaily(formatDateParams(e))} />
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
            window.location.href = "/taidu8/crontab/daily/exportDailyData"
          }}>下载</Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={() =>{
            DownLoadUpdateDaily()
          }}>更新</Button>
        </Space>
      </Card>
      <Card>
        <Space>
          <span>周报下载：</span>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
            window.location.href = "/taidu8/crontab/week/exportWeekData"
          }}>下载</Button>
        </Space>
      </Card>
    </PageContainer>
  )
}