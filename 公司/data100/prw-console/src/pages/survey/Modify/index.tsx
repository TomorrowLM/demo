import React, { useEffect, useState, useRef } from 'react';
import { message, Col, Form, Radio } from 'antd';
import moment from 'moment';
import GeneralForm from '@/components/Form';
import { getSurveyAttributionList, getDepartmentList } from '@/pages/service';
import { formatData } from '@/utils/utils';
import BeforeQuestion from './BeforeQuestion';
import { getSurveyManagerDetail, surveyManagerEdit, surveyManagerAdd } from './service';
import { initParams, initBeforeQueParams, initSubmitBeforeQueParams, surveyFormColumns, requireColumn, deviceSwitchOptions, deviceTypeOptions } from './const.d';
import styles from './index.less';

let attributionData: any = [];
let departmentData: any = [];

export default (props: { surveyId: string, type: string, onSuccess: () => void }) => {
  const quesRef = useRef<{ getValues: () => Array<any> }>();
  const { surveyId, type, onSuccess } = props;
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [initialValues, setInitialValues] = useState<any>({ ...initParams, actionline: moment(new Date()) });
  const [formColumns, setFormColumns] = useState<Array<any>>([]);
  const [showBeforeQuestion, setShowBeforeQuestion] = useState<Boolean>(false);
  const [deviceSwitchPrs, setDeviceSwitchPrs] = useState<any>({ deviceSwitch: 0, deviceType: 1 });
  const [beforeQueParams, setBeforeQueParams] = useState<any>(initBeforeQueParams)

  const onFinish = async (values: any) => {
    const params = values;
    params.isAppShow = params.onlinePort.includes(0) ? 1 : 0;
    params.isPcShow = params.onlinePort.includes(1) ? 1 : 0;
    params.isWechatpubShow = params.onlinePort.includes(2) ? 1 : 0;
    // params.isWechatminiShow = params.onlinePort.includes(3) ? 1 : 0;
    params.isWechatminiShow = 0;
    params.isH5Show = params.onlinePort.includes(4) ? 1 : 0;
    params.isChannelShow = params.onlinePort.includes(5) ? 1 : 0;
    params.answerTime = `${params.answerTimeStart}-${params.answerTimeEnd}`;
    params.status = type === '2' ? '1' : '3';
    delete params.onlinePort;
    delete params.answerTimeStart;
    delete params.answerTimeEnd;
    const questionValues =  quesRef?.current ? await quesRef?.current?.getValues() : initSubmitBeforeQueParams;
    let result = null;
    if (!type || type === '2') {
      result = await surveyManagerAdd({ ...params, ...questionValues, ...deviceSwitchPrs })
    } else if (type === '1') {
      result = await surveyManagerEdit({ ...params, ...questionValues, ...deviceSwitchPrs, surveyId })
    }
    message.success(result.data);
    onSuccess();
  }

  const onValuesChange = (changedValues: any) => {
    const key = Object.keys(changedValues)[0];
    if (key === 'hasWelcome') {
      if (changedValues.hasWelcome === 1) {
        setFormColumns(surveyFormColumns(attributionData, departmentData, requireColumn));
      } else {
        setFormColumns(surveyFormColumns(attributionData, departmentData));
      }
    }
    if (key === 'hasBeforeQuestion') {
      if (changedValues.hasBeforeQuestion === 1) {
        setShowBeforeQuestion(true);
      } else {
        setShowBeforeQuestion(false);
      }
    }
  }

  const getSurveyManagerDetailData = async () => {
    const { data } = await getSurveyManagerDetail({ surveyId, isPause: '1', terminalCode: '0' });
    const {
      surveyName, projectName, actionline, deadline, answerTime, isAppShow, isPcShow, isWechatpubShow, isH5Show, isChannelShow, require,hasWelcome,
      hasBeforeQuestion, hasCityCondition, hasGenderCondition, genderCondition, hasAgeCondition, failDescription, ageCondition, cityCondition, cityConditionList
    } = data;
    
    data.actionline = actionline ? moment(actionline) : null;
    data.deadline = deadline ? moment(deadline) : null;
    data.answerTimeStart = answerTime ? answerTime.split('-')[0] : '';
    data.answerTimeEnd =answerTime ? answerTime.split('-')[1] : '';
    data.onlinePort = [];
    if (isAppShow) {
      data.onlinePort.push(0)
    }
    if (isPcShow) {
      data.onlinePort.push(1)
    }
    if (isWechatpubShow) {
      data.onlinePort.push(2)
    }
    if (isH5Show) {
      data.onlinePort.push(4)
    }
    if (isChannelShow) {
      data.onlinePort.push(5)
    }
    if (!require) {
      data.require = '1.问卷内填写的个人基本信息与个人资料一致，问卷通过率会更高。\n2.问卷调查是严肃的，只有真实观点才能有助于相关研究，帮助消费者获得更好的产品和服务。\n3.本问卷已开启AI智能监测，答题不认真将被甄别。'
    }
    if (type === '2') {
      data.surveyName = `${surveyName}-复制`;
      data.projectName = `${projectName}-复制`;
    }
    if (hasWelcome === 1) {
      setFormColumns(surveyFormColumns(attributionData, departmentData, requireColumn));
    }
    if (hasBeforeQuestion === 1) {
      const [ ageStart, ageEnd ] = ageCondition.split('-');
      const addressSelect = cityCondition ? cityCondition.split(';').map((code: string, index: number) => {
        return { code, name: cityConditionList[index] }
      }) : []
      setShowBeforeQuestion(true);
      setBeforeQueParams({ hasCityCondition, hasGenderCondition, genderCondition, hasAgeCondition, ageStart, ageEnd, failDescription, addressSelect })
    }
    setDeviceSwitchPrs({ deviceSwitch: data.deviceSwitch, deviceType: data.deviceType });
    setInitialValues(data);
  }

  const initFormColumns = async () => {
    const [attribution, department] = await Promise.all([getSurveyAttributionList(), getDepartmentList()]);
    attributionData = formatData(attribution.data, { itemCode: 'value', itemName: 'label' });
    departmentData = formatData(department.data, { itemCode: 'value', itemName: 'label' });
    setFormColumns(surveyFormColumns(attributionData, departmentData));
    setIsLoaded(true);
  }

  useEffect(() => {
    initFormColumns()
    if (surveyId) {
      getSurveyManagerDetailData()
    }
  }, [])

  return (
    <div className={styles.modifyBox}>
      <GeneralForm initialValues={initialValues} columns={formColumns} onFinish={(values => onFinish(values))} onValuesChange={(changedValues) => onValuesChange(changedValues)}>
        { showBeforeQuestion ? <BeforeQuestion quesRef={quesRef} values={beforeQueParams} /> : null }
        { isLoaded ? <Col lg={24} xs={24}>
          <Form.Item key="deviceSwitch" label="设备限制">
            <Radio.Group options={deviceSwitchOptions} onChange={(e) => setDeviceSwitchPrs({ ...deviceSwitchPrs, deviceSwitch: e.target.value })} value={deviceSwitchPrs.deviceSwitch} />
            {
              deviceSwitchPrs.deviceSwitch === 1 ? <div style={{ padding: '8px 0' }}>
                <Radio.Group options={deviceTypeOptions} onChange={(e) => setDeviceSwitchPrs({ ...deviceSwitchPrs, deviceType: e.target.value })} value={deviceSwitchPrs.deviceType} />
              </div> : null
            }
          </Form.Item>
        </Col> : null }
      </GeneralForm>
    </div>
  )
}