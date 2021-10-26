import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Button, Card, Radio, Checkbox, Row, Col, Space, DatePicker, Input, InputNumber, Select, Cascader, Spin, Tag, Tabs, Collapse, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DownloadButton from '@/components/DownloadButton';
import UploadButton from '@/components/UploadButton';
import { getCityDropDown } from '@/pages/service';
import { getPhoneModel } from './service';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {
  basicParameters,
  queryTypeOptions,
  phoneTypeOptions,
  questionStatusOptions,
  whetherOptions,
  completeShareTypeOptions,
} from './const.d';
import { getApiChannelList, getAppChannelList, getMobileTypeList, searchApp, getSurveyAnswerChannelList, getGeneralTab, searchNumber, downLoadMember } from './service';
import CheckBoxAll from './CheckBoxAll';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD';
const formatDateParams = (date: moment.MomentInput) => { return moment(date).format('YYYY-MM-DD') };
const maxCol = 1000;

export default () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [ageValue, setAge] = useState<string>('');
  const [dates, setDates] = useState<any>([]);
  const [ageInputVisible, setAgeInputVisible] = useState<boolean>(false);
  const [childrenAgeInputVisible, setChildrenAgeInputVisible] = useState<boolean>(false);
  const [appNameList, setAppNameList] = useState<Array<string>>([]);
  const [appSourcehannelList, setAppSourcehannelList] = useState<Array<{ name: string, value: string }>>([]);
  const [apiSourcehannelList, setApiSourcehannelList] = useState<Array<{ name: string, value: string }>>([]);
  const [mobileTypeList, setMobileTypeList] = useState<Array<{ name: string, value: string }>>([]);
  const [terminalList, setTerminalList] = useState<Array<{ name: string, value: string }>>([]);
  const [cityDropDownList, setCityDropDownList] = useState<Array<{ label: string, value: number, children: any[] }>>([]);
  const [positionInfo, setPositionInfo] = useState<any>(null);
  const [positionInfoType, setPositionInfoType] = useState<string>("");//1:区域 2;精准位置
  const [basicInfo, setBasicInfo] = useState<Array<any>>([]);
  const [specialGroupsInfo, setSpecialGroupsInfo] = useState<Array<any>>([]);
  const [basicParams, setBasicParams] = useState<any>(basicParameters);
  const [surveyLabelRel, setSurveyLabelRel] = useState<any>({});
  const [phoneModelData, setPhoneModelData] = useState<any>([]);

  useEffect(() => {
    Promise.all([getApiChannelList(), getAppChannelList(), getMobileTypeList(), getSurveyAnswerChannelList(), getGeneralTab(), getCityDropDown({ terminalCode: '0' })])
      .then(([apiChannelData, appChannelData, mobileTypeData, terminalData, generalTabData, cityDropDownData]) => {
        setApiSourcehannelList(apiChannelData.data); // api渠道展示数据
        setAppSourcehannelList(appChannelData.data); // app渠道展示数据
        setMobileTypeList(mobileTypeData.data); // 手机品牌展示数据
        setTerminalList(terminalData.data); // 答题终端展示数据
        setCityDropDownList(cityDropDownData.data); // 城市下拉展示数据
        setPositionInfoType(generalTabData.data[0].list[0].code)
        setPositionInfo(generalTabData.data[0]); // 位置信息展示数据
        setBasicInfo(generalTabData.data[1].list[0].list); // 基础信息展示数据
        setSpecialGroupsInfo(generalTabData.data[2].list); // 特殊人群展示数据
      });
  }, []);

  /**
  * 获取手机品牌对应的手机型号
  * @param code 
  */
  const getPhoneModelData = async (phoneType: any, fn: any) => {
    const res = await getPhoneModel({ phoneType })
    console.log(res)
    setPhoneModelData(res.data)
    fn(res.data)
  }

  const disabledDate = (current: any) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 90;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 90;
    return tooEarly || tooLate;
  };

  const fetchSource: any = async (value: string) => {
    setFetching(true);
    const appNameData = await searchApp({ appName: value })
    setAppNameList(appNameData.data);
    setFetching(false);
  }

  /**
   * 添加年龄
   * @param code 
   */
  const handleAgeInputConfirm = (code: string) => {
    const currentSelectData = surveyLabelRel[code] || [];
    const isHaveTag = currentSelectData.findIndex((d: any) => Object.values(d)[0] === ageValue);
    const [startAge, endAge] = ageValue.split('-');
    if (ageValue && ageValue.includes('-')) {
      if (isHaveTag !== -1) {
        message.info('不可重复添加');
      } else if (startAge > endAge) {
        message.info("请输入正确的年龄段");
      } else {
        setSurveyLabelRel({ ...surveyLabelRel, [code]: [...currentSelectData, { [currentSelectData.length + 1]: ageValue }] });
      }
      setAgeInputVisible(false);
      setChildrenAgeInputVisible(false);
      setAge('');
    } else {
      setAgeInputVisible(false);
      setChildrenAgeInputVisible(false);
      setAge('');
    }
  }

  /**
   * 添加城市
   * @param selectedOptions 
   * @param code 
   */
  const addCity = (selectedOptions = [], code: string) => {
    if(selectedOptions.length == 0){
      return 
    }
    const currentSelectData = surveyLabelRel[code] || [];
    const tagName = selectedOptions.map((o: any) => o.label).join('-');
    const isHaveTag = currentSelectData.findIndex((d: any) => Object.values(d)[0] === tagName);
    if (isHaveTag !== -1) {
      message.info('不可重复添加');
    } else {
      setSurveyLabelRel({ ...surveyLabelRel, [code]: [...currentSelectData, { [currentSelectData.length + 1]: tagName }] });
    }
  }

  /**
   * 删除标签
   * @param code 
   * @param removedTag 
   */
  const deleteTag = (code: string, removedTag: string) => {
    const currentSelectData = surveyLabelRel[code] || []
    const delCurrentSelectData = currentSelectData.filter((tag: any): any => Object.values(tag)[0] !== removedTag);
    const selectData = delCurrentSelectData.map(((item: any, index: number) => {
      const tagName: any = Object.values(item)[0];
      return { [index + 1]: tagName }
    }))
    setSurveyLabelRel({ ...surveyLabelRel, [code]: selectData })
  }

  const getParams = () => {
    const params = JSON.parse(JSON.stringify(basicParams));
    const {
      searchType, userIdStr, phoneStr, surveyIdStr,
      registeredStartTime, loginStartTime, answerStartTime,
      participateAllSurveyNum, participateInternalSurveyNum, participateBusinessSurveyNum, participateApiSurveyNum,
      completeAllSurveyNum, completeInternalSurveyNum, completeBusinessSurveyNum, completeApiSurveyNum
    } = params;
    if (userIdStr.split('\n').length > maxCol) {
      message.info(`UID大于${maxCol}个，请重新输入`);
      return false;
    }
    if (phoneStr.split('\n').length > maxCol) {
      message.info(`手机号大于${maxCol}个，请重新输入`);
      return false;
    }
    if (surveyIdStr.split('\n').length > maxCol) {
      message.info(`问卷ID大于${maxCol}个，请重新输入`);
      return false;
    }
    if (searchType === '1' && !registeredStartTime && !loginStartTime) {
      message.info(`注册时间与最后登录时间至少选择一项`);
      return false;
    }
    if (searchType !== '4') {
      if (participateAllSurveyNum || participateInternalSurveyNum || participateBusinessSurveyNum || participateApiSurveyNum || completeAllSurveyNum || completeInternalSurveyNum || completeBusinessSurveyNum || completeApiSurveyNum) {
        if (!answerStartTime) {
          message.info(`选择参与问卷与完成问卷后，答题时间必填`);
          return false;
        }
      }
    }
    Object.keys(params).forEach(key => {
      if (Array.isArray(params[key])) {
        if (key === "devMobile") {
          params[key] = params[key].join('-');
        } else {
          params[key] = params[key].join(',');
        }
      }
    })
    return params;
  }

  const searchData = async () => {
    const params = getParams();
    if (params) {
      const { data } = await searchNumber({ ...params, surveyLabelRel: JSON.stringify(surveyLabelRel) });
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `符合条件总数${data}人！`
      });
    }
  }

  const downLoad = async () => {
    const params = getParams();
    if (params) {
      await downLoadMember({ ...params, surveyLabelRel: JSON.stringify(surveyLabelRel) });
      message.success('已提交，请在下载中心查看下载进度！');
    }
  }

  const formatMobile = (mobile: any, mobileTypeList: any) => {
    return mobile.map((item: any, index: number) => {
      var name = ""
      for (var i = 0; i < mobileTypeList.length; i++) {
        if (item === mobileTypeList[i].value) {
          name = mobileTypeList[i].name
        }
      }
      return name
    })
  }

  return (
    <PageContainer title={false}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col lg={24} xs={24}>
            <Radio.Group onChange={(e) => {
              setBasicParams({ ...basicParameters, searchType: e.target.value });
              setSurveyLabelRel({});
            }} options={queryTypeOptions} value={basicParams.searchType} />
          </Col>
        </Row>
        {/* 按时间查询 */}
        {
          basicParams.searchType === '1' ? <Row gutter={[16, 16]}>
            <Col lg={8} xs={24}>
              <Space>
                <span className={styles.label}>注册时间：</span>
                <RangePicker format={dateFormat} disabledDate={disabledDate} onCalendarChange={val => setDates(val)} onChange={(e: any) => setBasicParams({ ...basicParams, registeredStartTime: formatDateParams(e[0]), registeredEndTime: formatDateParams(e[1]) })} />
              </Space>
            </Col>
            <Col lg={8} xs={24}>
              <Space>
                <span className={styles.label}>最后登录时间：</span>
                <RangePicker format={dateFormat} disabledDate={disabledDate} onCalendarChange={val => setDates(val)} onChange={(e: any) => setBasicParams({ ...basicParams, loginStartTime: formatDateParams(e[0]), loginEndTime: formatDateParams(e[1]) })} />
              </Space>
            </Col>
            {/* <Col lg={8} xs={24}>
              <Space>
                <span className={styles.label}>最后答题时间：</span>
                <RangePicker format={dateFormat} onChange={(e: any) => setBasicParams({ ...basicParams, surveyAnswerStartTime: formatDateParams(e[0]), surveyAnswerEndTime: formatDateParams(e[1]) })} />
              </Space>
            </Col> */}
          </Row> : null
        }
        {/* 按UID查询 */}
        {
          basicParams.searchType === '2' ? <Row gutter={[16, 16]}>
            <Col lg={16} xs={24}>
              <Space>
                <span className={styles.label}>UID输入区：</span>
                <TextArea className={styles.textArea} rows={4} placeholder='请输入UID，每行一个，最多1000个' onBlur={e => setBasicParams({ ...basicParams, userIdStr: e.target.value })} />
              </Space>
            </Col>
          </Row> : null
        }
        {/* 按手机号查询 */}
        {
          basicParams.searchType === '3' ? <Row gutter={[16, 16]}>
            <Col lg={16} xs={24}>
              <Space>
                <span className={styles.label}>手机号输入区：</span>
                <TextArea className={styles.textArea} rows={4} placeholder='请输入手机号码，每行一个，最多1000个' onBlur={e => setBasicParams({ ...basicParams, phoneStr: e.target.value })} />
              </Space>
            </Col>
          </Row> : null
        }
        {/* 按问卷ID查询 */}
        {
          basicParams.searchType === '4' ? <Row gutter={[16, 16]}>
            <Col lg={16} xs={24}>
              <Space>
                <span className={styles.label}>问卷ID输入区：</span>
                <TextArea className={styles.textArea} rows={4} placeholder='请输入问卷ID，每行一个，最多1000个' onBlur={e => setBasicParams({ ...basicParams, surveyIdStr: e.target.value })} />
              </Space>
            </Col>
          </Row> : null
        }
        <Row gutter={[16, 16]}>
          <Col lg={8} xs={24}>
            <Space>
              <span className={styles.label}>手机号码：</span>
              <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, showPhone: e.target.value })} options={phoneTypeOptions} value={basicParams.showPhone} />
            </Space>
          </Col>
          {/* 按问卷ID查询 */}
          {
            basicParams.searchType === '4' ?
              <Col lg={16} xs={24}>
                <Space>
                  <span className={styles.label}>问卷完成状态：</span>
                  <CheckBoxAll options={questionStatusOptions} onCheckeChange={e => setBasicParams({ ...basicParams, surveyStat: e })} />
                </Space>
              </Col> : null
          }
          <Col lg={24} xs={24}>
            <Space>
              <span className={styles.label}>来源渠道：</span>
              <Select
                className={styles.select}
                mode="multiple"
                value={basicParams.appSourcehannel}
                placeholder="请选择渠道名称"
                onChange={(value) => setBasicParams({ ...basicParams, appSourcehannel: value })}
              >
                {appSourcehannelList.map(d => (
                  <Option value={d.value} key={d.value}>{d.name}</Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
        {
          basicParams.searchType !== '4' ? <Card title="问卷信息" className={styles.card}>
            <Row gutter={[16, 16]}>
              <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>答题时间：</span>
                  <RangePicker format={dateFormat} disabledDate={disabledDate} onCalendarChange={val => setDates(val)} onChange={(e: any) => setBasicParams({ ...basicParams, answerStartTime: formatDateParams(e[0]), answerEndTime: formatDateParams(e[1]) })} />
                </Space>
              </Col>
              <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>参与问卷：</span>
                  <Checkbox checked={basicParams.participateAllSurveyNum} onChange={e => setBasicParams({ ...basicParams, participateAllSurveyNum: e.target.checked ? '1' : '' })}>
                    全部问卷，大于等于<InputNumber value={basicParams.participateAllSurveyNum} disabled={!basicParams.participateAllSurveyNum} onBlur={e => setBasicParams({ ...basicParams, participateAllSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.participateInternalSurveyNum} onChange={e => setBasicParams({ ...basicParams, participateInternalSurveyNum: e.target.checked ? '1' : '' })}>
                    内投问卷，大于等于<InputNumber value={basicParams.participateInternalSurveyNum} disabled={!basicParams.participateInternalSurveyNum} onBlur={e => setBasicParams({ ...basicParams, participateInternalSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.participateBusinessSurveyNum} onChange={e => setBasicParams({ ...basicParams, participateBusinessSurveyNum: e.target.checked ? '1' : '' })}>
                    商业问卷，大于等于<InputNumber value={basicParams.participateBusinessSurveyNum} disabled={!basicParams.participateBusinessSurveyNum} onBlur={e => setBasicParams({ ...basicParams, participateBusinessSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.participateApiSurveyNum} onChange={e => setBasicParams({ ...basicParams, participateApiSurveyNum: e.target.checked ? '1' : '' })}>
                    API问卷，大于等于<InputNumber value={basicParams.participateApiSurveyNum} disabled={!basicParams.participateApiSurveyNum} onBlur={e => setBasicParams({ ...basicParams, participateApiSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                </Space>
              </Col>
              {
                basicParams.participateAllSurveyNum || basicParams.participateInternalSurveyNum || basicParams.participateBusinessSurveyNum || basicParams.participateApiSurveyNum ? <Col lg={24} xs={24}>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>问卷奖励限制：</span>
                      <Radio.Group value={basicParams.participateGoldType} onChange={e => setBasicParams({ ...basicParams, participateGoldType: e.target.value, participateGold: e.target.value === '0' ? 200 : null })}>
                        <Radio value='1'>否</Radio>
                        <Radio value='0'>是，问卷奖励大于等于<InputNumber value={basicParams.participateGold} disabled={basicParams.participateGoldType !== '0'} min={10} onChange={e => setBasicParams({ ...basicParams, participateGold: e })} size="small" className={styles.w50} />金币</Radio>
                      </Radio.Group>
                    </Space>
                  </Col>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>答题终端：</span>
                      <CheckBoxAll options={terminalList.map(item => { return { label: item.name, value: item.value } })} onCheckeChange={e => setBasicParams({ ...basicParams, participateTerminal: e })} />
                    </Space>
                  </Col>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>API客户：</span>
                      <CheckBoxAll options={apiSourcehannelList.map(item => { return { label: item.name, value: item.value } })} onCheckeChange={e => setBasicParams({ ...basicParams, participateApiClient: e })} />
                    </Space>
                  </Col>
                </Col> : null
              }
              <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>完成问卷：</span>
                  <Checkbox checked={basicParams.completeAllSurveyNum} onChange={e => setBasicParams({ ...basicParams, completeAllSurveyNum: e.target.checked ? '1' : '' })}>
                    全部问卷，大于等于<InputNumber value={basicParams.completeAllSurveyNum} disabled={!basicParams.completeAllSurveyNum} onBlur={e => setBasicParams({ ...basicParams, completeAllSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.completeInternalSurveyNum} onChange={e => setBasicParams({ ...basicParams, completeInternalSurveyNum: e.target.checked ? '1' : '' })}>
                    内投问卷，大于等于<InputNumber value={basicParams.completeInternalSurveyNum} disabled={!basicParams.completeInternalSurveyNum} onBlur={e => setBasicParams({ ...basicParams, completeInternalSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.completeBusinessSurveyNum} onChange={e => setBasicParams({ ...basicParams, completeBusinessSurveyNum: e.target.checked ? '1' : '' })}>
                    商业问卷，大于等于<InputNumber value={basicParams.completeBusinessSurveyNum} disabled={!basicParams.completeBusinessSurveyNum} onBlur={e => setBasicParams({ ...basicParams, completeBusinessSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                  <Checkbox checked={basicParams.completeApiSurveyNum} onChange={e => setBasicParams({ ...basicParams, completeApiSurveyNum: e.target.checked ? '1' : '' })}>
                    API问卷，大于等于<InputNumber value={basicParams.completeApiSurveyNum} disabled={!basicParams.completeApiSurveyNum} onBlur={e => setBasicParams({ ...basicParams, completeApiSurveyNum: e.target.value })} size="small" className={styles.w50} />次
                  </Checkbox>
                </Space>
              </Col>
              {
                basicParams.completeAllSurveyNum || basicParams.completeInternalSurveyNum || basicParams.completeBusinessSurveyNum || basicParams.completeApiSurveyNum ? <Col lg={24} xs={24}>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>问卷奖励限制：</span>
                      <Radio.Group value={basicParams.completeGoldType} onChange={e => setBasicParams({ ...basicParams, completeGoldType: e.target.value, completeGold: e.target.value === '0' ? 200 : null })}>
                        <Radio value='1'>否</Radio>
                        <Radio value='0'>是，问卷奖励大于等于<InputNumber value={basicParams.completeGold} min={10} disabled={basicParams.completeGoldType !== '0'} onChange={e => setBasicParams({ ...basicParams, completeGold: e })} size="small" className={styles.w50} />金币</Radio>
                      </Radio.Group>
                    </Space>
                  </Col>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>答题终端：</span>
                      <CheckBoxAll options={terminalList.map(item => { return { label: item.name, value: item.value } })} onCheckeChange={e => setBasicParams({ ...basicParams, completeTerminal: e })} />
                    </Space>
                  </Col>
                  <Col lg={24} xs={24}>
                    <Space>
                      <span className={styles.label}>API客户：</span>
                      <CheckBoxAll options={apiSourcehannelList.map(item => { return { label: item.name, value: item.value } })} onCheckeChange={e => setBasicParams({ ...basicParams, completeApiClient: e })} />
                    </Space>
                  </Col>
                </Col> : null
              }
              <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>分享问卷：</span>
                  <Radio.Group options={completeShareTypeOptions} value={basicParams.completeShareType} onChange={e => setBasicParams({ ...basicParams, completeShareType: e.target.value })} />
                </Space>
              </Col>
            </Row>
          </Card> : null
        }
        <Card title="监测数据" className={styles.card}>
          <Row gutter={[16, 16]}>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>APP名称：</span>
                <Select
                  className={styles.select}
                  mode="multiple"
                  value={basicParams.monitorAppName}
                  placeholder="请输入APP名称搜索"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounce(fetchSource, 800)}
                  onChange={(value) => setBasicParams({ ...basicParams, monitorAppName: value })}
                >
                  {appNameList.map(d => (
                    <Option value={d} key={d}>{d}</Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>APP使用时间：</span>
                <RangePicker format={dateFormat} disabledDate={disabledDate} onCalendarChange={val => setDates(val)} onChange={(e: any) => setBasicParams({ ...basicParams, appStartTime: formatDateParams(e[0]), appEndTime: formatDateParams(e[1]) })} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>监测任务开启天数：</span>
                <Radio.Group value={basicParams.openDayType} onChange={e => setBasicParams({ ...basicParams, openDayType: e.target.value, openDay: e.target.value === '0' ? 1 : null })}>
                  <Radio value='1'>否</Radio>
                  <Radio value='0'>是，开启天数大于等于<InputNumber value={basicParams.openDay} disabled={basicParams.openDayType !== '0'} min={1} onChange={e => setBasicParams({ ...basicParams, openDay: e })} size="small" className={styles.w50} />天</Radio>
                </Radio.Group>
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title="设备信息" className={styles.card}>
          <Row gutter={[16, 16]}>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>手机品牌：</span>
                <CheckBoxAll options={mobileTypeList.map(item => { return { label: item.name, value: item.value } })} onCheckeChange={e => {
                  console.log(e)
                  if (e.length > 0) {
                    getPhoneModelData(formatMobile(e, mobileTypeList), (phoneData: any) => {
                      var newSelOptions: any = []
                      var devMobile = basicParams['devMobile'] ? basicParams['devMobile'] : []
                      phoneData.map((phoneItem: any, phoneIndex: number) => {
                        for (var phoneIndex = 0; phoneIndex < devMobile.length; phoneIndex++) {
                          if (phoneItem.model == devMobile[phoneIndex]) {
                            newSelOptions.push(devMobile[phoneIndex])
                            return
                          }
                        }
                      })
                      console.log(newSelOptions)
                      setBasicParams({ ...basicParams, mobileType: e, devMobile: newSelOptions })
                    })

                  } else {//未选中手机品牌
                    setPhoneModelData([])
                    setBasicParams({ ...basicParams, mobileType: e, devMobile: [] })
                  }
                }} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>手机型号：</span>
                <Select value={basicParams.devMobile} filterOption={(input:any, option:any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                } mode="multiple" style={{ width: '500px' }} placeholder="请选择手机型号" onChange={e => {
                  setBasicParams({ ...basicParams, devMobile: e })
                }}>
                  {phoneModelData.map((phoneItem: any, phoneIndex: number) => {
                    return <Option key={phoneItem.model}>{phoneItem.name}</Option>
                  })}
                </Select>
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>设备识别号：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, deviceNum: e.target.value })} options={whetherOptions} value={basicParams.deviceNum} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>公众号openID：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, wechatOpenId: e.target.value })} options={whetherOptions} value={basicParams.wechatOpenId} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>换机信息：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, changePhone: e.target.value })} options={whetherOptions} value={basicParams.changePhone} />
              </Space>
            </Col>
          </Row>
        </Card>
        <Card title="金币信息" className={styles.card}>
          <Row gutter={[16, 16]}>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>当前金币余额：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, totalGoldType: e.target.value })} options={whetherOptions} value={basicParams.totalGoldType} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>获取金币余额：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, historyTotalGoldType: e.target.value })} options={whetherOptions} value={basicParams.historyTotalGoldType} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>提现次数：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, withdrawNum: e.target.value })} options={whetherOptions} value={basicParams.withdrawNum} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>提现金额：</span>
                <Radio.Group onChange={(e) => setBasicParams({ ...basicParams, withdrawGold: e.target.value })} options={whetherOptions} value={basicParams.withdrawGold} />
              </Space>
            </Col>
          </Row>
        </Card>
        {positionInfo ? <Card title="位置信息" className={styles.card}>
          <Row gutter={[16, 16]}>
            <Col lg={24} xs={24} key={`basic${positionInfo.code}`}><Space>
              <span className={styles.label}>{positionInfo.name}：</span>
              <Radio.Group onChange={(e) => {
                setPositionInfoType(e.target.value)
                let labelRelPosition = { ...surveyLabelRel }
                positionInfo.list.forEach((item: any) => {
                  item.list.forEach((list: any) => {
                    delete labelRelPosition[list.code]
                  })
                });
                setSurveyLabelRel({ ...labelRelPosition })
              }} value={positionInfoType}>
                {positionInfo.list.map((item: any) => <Radio value={item.code} key={positionInfo.name + item.code}>{item.name}</Radio>)}
              </Radio.Group>
            </Space></Col>
          </Row>
          <Row gutter={[0, 16]} style={{ width: "80%", boxSizing: "border-box", padding: "10px", marginLeft: "75px", background: "#eee" }}>
            {
              positionInfoType == positionInfo.list[0].code ? positionInfo.list[0].list.map((info: any, index: number) => {
                if (info.option === 1) {
                  return <Col lg={24} xs={24} key={`position${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    <CheckBoxAll
                      options={info.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                      onCheckeObjectChange={e => setSurveyLabelRel({ ...surveyLabelRel, [info.code]: e })}
                    />
                  </Space></Col>
                }
                if (info.option === 2) {
                  return <Col lg={24} xs={24} key={`position${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    <div>
                      {
                        surveyLabelRel[info.code] && surveyLabelRel[info.code].map((item: any) => {
                          const label: any = Object.values(item)[0];
                          return <Tag closable className={styles.cityTag} key={label} onClose={() => deleteTag(info.code, label)}>{label}</Tag>
                        })
                      }
                      &nbsp;
                      <Cascader showSearch={true} options={cityDropDownList} onChange={(value, selectedOptions: any) => addCity(selectedOptions, info.code)}>
                        {/* <Tag className={styles.siteTagPlus}>
                            <PlusOutlined /> 添加
                        </Tag> */}
                      </Cascader>
                      <DownloadButton path='download_city' text='下载模版' />
                      <UploadButton name="file_upload" action='accurate_push/import' text='导入地址信息' onSuccess={(response) => {
                        console.log(response)
                        const nameList = response.data.nameList.split(';');
                        const labelRel = nameList.map((name: string, index: number) => {
                          return { [index + 1]: name }
                        })
                        setSurveyLabelRel({ ...surveyLabelRel, [info.code]: labelRel });
                      }} />
                    </div>
                  </Space></Col>
                }
                return null;
              }) : positionInfo.list[1].list.map((info: any, index: number) => {
                if (index === 1) {
                  return <Col lg={24} xs={24} key={`position${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    <div>
                      {
                        surveyLabelRel[info.code] && surveyLabelRel[info.code].map((item: any) => {
                          const label: any = Object.values(item)[0];
                          return <Tag closable className={styles.cityTag} key={label} onClose={() => deleteTag(info.code, label)}>{label}</Tag>
                        })
                      }
                    &nbsp;
                    <Cascader showSearch={true} options={cityDropDownList} onChange={(value, selectedOptions: any) => addCity(selectedOptions, info.code)}>
                        {/* <Tag className={styles.siteTagPlus}>
                          <PlusOutlined /> 添加
                      </Tag> */}
                      </Cascader>
                      <DownloadButton path='download_city' text='下载模版' />
                      <UploadButton name="file_upload" action='accurate_push/import' text='导入地址信息' onSuccess={(response) => {
                        const nameList = response.data.nameList.split(';');
                        const labelRel = nameList.map((name: string, index: number) => {
                          return { [index + 1]: name }
                        })
                        setSurveyLabelRel({ ...surveyLabelRel, [info.code]: labelRel });
                      }} />
                    </div>
                  </Space></Col>
                }
                return null;
              })
            }
          </Row>
        </Card> : ""}
        <Card title="基础信息" className={styles.card}>
          <Row gutter={[16, 16]}>
            {
              basicInfo.map(info => {
                if (info.option === 0) {
                  return <Col lg={24} xs={24} key={`basic${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    <Radio.Group onChange={(e) => {
                      setSurveyLabelRel({ ...surveyLabelRel, [info.code]: [{ [e.target.value]: info.list.find((item: any) => item.code === e.target.value)?.name }] })
                    }}>
                      {info.list.map((item: any) => <Radio value={item.code} key={info.name + item.code}>{item.name}</Radio>)}
                    </Radio.Group>
                  </Space></Col>
                }
                if (info.option === 1) {
                  return <Col lg={24} xs={24} key={`basic${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    <CheckBoxAll
                      options={info.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                      onCheckeObjectChange={e => setSurveyLabelRel({ ...surveyLabelRel, [info.code]: e })}
                    />
                  </Space></Col>
                }
                if (info.option === 2) {
                  return <Col lg={24} xs={24} key={`basic${info.code}`}><Space>
                    <span className={styles.label}>{info.name}：</span>
                    {
                      surveyLabelRel[info.code] && surveyLabelRel[info.code].map((item: any) => {
                        const label: any = Object.values(item)[0];
                        return <Tag closable key={label} onClose={() => deleteTag(info.code, label)}>{label}</Tag>
                      })
                    }
                    {ageInputVisible && (
                      <Input
                        type="text"
                        size="small"
                        placeholder="格式n-n"
                        className={styles.tagInput}
                        value={ageValue}
                        onChange={(e) => setAge(e.target.value)}
                        onBlur={() => handleAgeInputConfirm(info.code)}
                        onPressEnter={() => handleAgeInputConfirm(info.code)}
                      />
                    )}
                    {!ageInputVisible && (
                      <Tag className={styles.siteTagPlus} onClick={() => setAgeInputVisible(true)}>
                        <PlusOutlined /> 添加
                      </Tag>
                    )}
                  </Space></Col>
                }
                return null;
              })
            }
          </Row>
        </Card>
        <Collapse className={styles.card}>
          <Panel header="特殊人群" key="1">
            <Tabs defaultActiveKey={`special${specialGroupsInfo[0] ? specialGroupsInfo[0].code : 0}`}>
              {
                specialGroupsInfo.map(info => {
                  const paneItem = info.list.map((pane: any) => {
                    if (pane.option === 1) {
                      return <Col lg={24} xs={24} key={`pane${info.code}`}><Space>
                        <span className={styles.label}>{pane.name}：</span>
                        <CheckBoxAll
                          options={pane.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                          onCheckeObjectChange={e => setSurveyLabelRel({ ...surveyLabelRel, [pane.code]: e })}
                        />
                      </Space></Col>
                    }
                    if (pane.option === 2) {
                      return <Col lg={24} xs={24} key={`pane${info.code}`}><Space>
                        <span className={styles.label}>{pane.name}：</span>
                        {
                          surveyLabelRel[pane.code] && surveyLabelRel[pane.code].map((item: any) => {
                            const label: any = Object.values(item)[0];
                            return <Tag closable key={label} onClose={() => deleteTag(pane.code, label)}>{label}</Tag>
                          })
                        }
                        {childrenAgeInputVisible && (
                          <Input
                            type="text"
                            size="small"
                            placeholder="格式n-n"
                            className={styles.tagInput}
                            value={ageValue}
                            onChange={(e) => setAge(e.target.value)}
                            onBlur={() => handleAgeInputConfirm(pane.code)}
                            onPressEnter={() => handleAgeInputConfirm(pane.code)}
                          />
                        )}
                        {!childrenAgeInputVisible && (
                          <Tag className={styles.siteTagPlus} onClick={() => setChildrenAgeInputVisible(true)}>
                            <PlusOutlined /> 添加
                          </Tag>
                        )}
                      </Space></Col>
                    }
                    return null;
                  })
                  return <TabPane tab={info.name} key={`special${info.code}`}>
                    <Row gutter={[16, 16]}>{paneItem}</Row>
                  </TabPane>
                })
              }
            </Tabs>
          </Panel>
        </Collapse>
        <div className={styles.footer}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => searchData()}>仅查询</Button>
            <Button icon={<DownloadOutlined />} onClick={() => downLoad()}>下载数据</Button>
          </Space>
        </div>
      </Card>
    </PageContainer>
  );
};