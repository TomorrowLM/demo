import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import { Button, Card, Radio, Checkbox, Row, Col, Space, Input, Cascader, Tag, Tabs, Collapse, Modal, message, Select } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CreateModal from '@/components/CreateModal';
import DownloadButton from '@/components/DownloadButton';
import UploadButton from '@/components/UploadButton';
import CheckBoxAll from '@/pages/statistics/QueryTools/CheckBoxAll';
import { getCityDropDown } from '@/pages/service';
import { isXsScreen } from '@/utils/utils';
import { basicParameters, revisitExclusiveOptions, idTypeOptions, surveyResultStatusOptions, isPhoneCheckedOptions, qualityOptions } from './const.d';
import { getGeneralTab, queryEsPushTotal, addSurveyLabel, editSurveyLabel, getSurveyLabelGroupInfo, getTurnLocation, getPhoneModel } from './service';
import Map from './Map';
import styles from './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;

export default (props: { id: any; isCopy: Boolean; onSuccess: () => void }) => {
  const { surveyId } = history.location.query;
  const { id = '', isCopy = false, onSuccess } = props;
  const mapRef = useRef<{ getValues: () => any }>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [ageValue, setAge] = useState<string>('');
  const [kilometre, setKilometre] = useState<string>('');
  const [addressModal, setAddressModal] = useState<string>('');
  const [addressPoint, setAddressPoint] = useState<any>({});
  const [tabsKey, setTabsKey] = useState<string>('tabs-12');
  const [ageInputVisible, setAgeInputVisible] = useState<boolean>(false);
  const [childrenAgeInputVisible, setChildrenAgeInputVisible] = useState<boolean>(false);
  const [cityDropDownList, setCityDropDownList] = useState<Array<{ label: string, value: number, children: any[] }>>([]);
  const [positionInfo, setPositionInfo] = useState<Array<any>>([]);
  const [positionType, setPositionType] = useState<number>(1);
  const [basicInfo, setBasicInfo] = useState<Array<any>>([]);
  const [collapseData, setCollapseData] = useState<Array<any>>([]);
  const [basicParams, setBasicParams] = useState<any>(basicParameters);
  const [surveyLabelRel, setSurveyLabelRel] = useState<any>('');
  const [phoneModelData, setPhoneModelData] = useState<any>([]);

  useEffect(() => {
    Promise.all([getGeneralTab(), getCityDropDown({ terminalCode: '0' })])
      .then(([generalTabData, cityDropDownData]) => {
        setCityDropDownList(cityDropDownData.data); // 城市下拉展示数据
        setPositionInfo(generalTabData.data[0].list); // 位置信息展示数据
        setBasicInfo(generalTabData.data[1].list[0].list); // 基础信息展示数据
        setCollapseData([generalTabData.data[2], generalTabData.data[3]]); // 特殊人群/企业标签展示数据
      });

    if (id) {
      getSurveyLabelGroupInfo({ id }).then(({ data }) => {
        const { conditionName, revisitExclusiveId, idType, isPhoneChecked, number, quality, revisitExclusive, surveyResultStatus } = data;
        const surveyLabelData = JSON.parse(data.surveyLabel);
        const surveyLabelMap: any = {};
        surveyLabelData.forEach((element: { list: Array<any> }) => {
          element.list.forEach((typeList: { list: Array<any>, code: string }) => {
            typeList.list.forEach((ele: { list: Array<any>, code: string, option: number }) => {
              ele.list.forEach((item: any) => {
                if (item.iselect) {
                  if (!surveyLabelMap[ele.code]) {
                    surveyLabelMap[ele.code] = []
                  }
                  if (item.list) {
                    const labelList = item.list.map((name: string, index: number) => { return { [index + 1]: name } });
                    surveyLabelMap[ele.code] = labelList;
                  } else {
                    if (ele.option === 3) {
                      getPhoneModelData(formatSelPhone(surveyLabelMap['454']), (phoneData: any) => {
                        const value = formatPhonemodalToName(phoneData, item.name.split(";"))
                        surveyLabelMap[ele.code] = value
                        // console.log(surveyLabelMap, surveyLabelData)
                        setSurveyLabelRel({ ...surveyLabelMap })
                      })
                    } else {
                      surveyLabelMap[ele.code].push({ [item.code]: item.name });
                    }
                  }
                }
              })

            })
          })
        });

        if (surveyLabelMap['12'] && surveyLabelMap['12'].length) {
          const [point, kilometreVal] = surveyLabelMap['12'][0]['1'].split(';');
          const [longitude, latitude] = point.split('-');
          getTurnLocation({ latitude, longitude }).then(result => {
            setPositionType(2);
            setAddressModal(result.data.formatted_address);
            setKilometre(kilometreVal);
            setAddressPoint(point);
            surveyLabelMap['12'][0]['1'] = point;
            setTabsKey('tabs-12');
          })
        }
        if (surveyLabelMap['100'] && surveyLabelMap['100'].length) {
          setPositionType(2);
          setTabsKey('tabs-100');
        }
        if (surveyLabelMap['101'] && surveyLabelMap['101'].length) {
          setPositionType(2);
          setTabsKey('tabs-101');
        }
        if (surveyLabelMap['454'] && surveyLabelMap['454'].length > 0) {
          getPhoneModelData(formatSelPhone(surveyLabelMap['454']))
        }
        setSurveyLabelRel(surveyLabelMap);
        setBasicParams({ name: conditionName, idContent: revisitExclusiveId, idType: `${idType}`, isPhoneChecked: `${isPhoneChecked}`, number, quality: `${quality}`, revisitExclusive: `${revisitExclusive}`, surveyResultStatus: surveyResultStatus ? surveyResultStatus.split() : [] });
      })
    } else {
      setSurveyLabelRel({});
    }
  }, [id]);


  /**
   * 获取手机品牌对应的手机型号
   * @param code 
   */
  const getPhoneModelData = async (phoneType: any, fn?: any) => {
    const res = await getPhoneModel({ phoneType })
    console.log(res)
    setPhoneModelData(res.data)
    if (fn)
      fn(res.data)
  }

  const formatSelPhone = (surveyLabelRel_selPhone: any) => {
    return surveyLabelRel_selPhone.map((item: any) => {
      return Object.values(item)[0]
    })
  }
  const formatValue = (value: any) => {
    return value.map((item: string, index: number) => {
      return {
        [index]: item
      }
    })
  }
  const formatPhonemodalToName = (phoneData: any, selPhoneData: any) => {
    var newSelOptions: any = []
    phoneData.map((phoneItem: any, phoneIndex: number) => {
      for (var phoneIndex = 0; phoneIndex < selPhoneData.length; phoneIndex++) {
        if (phoneItem.model == selPhoneData[phoneIndex]) {
          newSelOptions.push(selPhoneData[phoneIndex])
        }
      }
    })
    return formatValue(newSelOptions)
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
    Object.keys(params).forEach(key => {
      if (Array.isArray(params[key])) {
        params[key] = params[key].join(',');
      }
    })
    return params;
  }

  const searchNumber = async () => {
    if (addressModal && kilometre && tabsKey === 'tabs-12') {
      surveyLabelRel['12'] = [{ '1': `${addressPoint.lng}-${addressPoint.lat}` }, { '2': kilometre }];
      delete surveyLabelRel['100'];
      delete surveyLabelRel['101'];
    } else if (tabsKey === 'tabs-100') {
      delete surveyLabelRel['12'];
      delete surveyLabelRel['101'];
    } else if (tabsKey === 'tabs-101') {
      delete surveyLabelRel['12'];
      delete surveyLabelRel['100'];
    }
    const { name, quality, revisitExclusive, idContent, surveyResultStatus } = basicParams;
    if (!name) {
      message.info('请输入分组名称');
    } else if (revisitExclusive === '0' && !Object.keys(surveyLabelRel).length && !quality) {
      message.info('请选择有效推送条件');
    } else if (revisitExclusive !== '0' && !idContent) {
      message.info('请输入项目/会员ID');
    } else if (revisitExclusive !== '0' && !surveyResultStatus.length&&basicParams.idType==='0') {
      message.info('请选择会员状态');
    } else if (addressModal && !kilometre) {
      message.info('请填写公里数');
    } else {
      const params = { ...getParams(), surveyResultStatus:getParams()['surveyResultStatus'].replace(/,/g,';'),surveyLabelRel: JSON.stringify(surveyLabelRel) };
      if (params) {
        const { data: { number, activeNum } } = await queryEsPushTotal(params);
        confirm({
          title: '是否要继续推送?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <p>符合条件总数{number}</p>
              <p>其中，最近三月活跃人数为{activeNum}</p>
            </div>
          ),
          onOk: async () => {
            const { msg } = id && !isCopy ? await editSurveyLabel({ ...params, surveyId, id, number }) : await addSurveyLabel({ ...params, surveyId, number });
            message.success(msg);
            onSuccess();
          }
        });
      }
    }
  }

  return (
    <section>
      <CreateModal title="地图选点" modalVisible={modalVisible} onCancel={() => setModalVisible(false)} onHandleOk={async () => {
        const { addressModal: addressM, addressPoint: addressP } = await mapRef.current?.getValues();
        setAddressModal(addressM);
        setAddressPoint(addressP);
        setModalVisible(false);
      }}><Map mapRef={mapRef} /></CreateModal>
      <div>
        <Card>
          <Row gutter={[16, 16]}>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>分组名称：</span>
                <Input style={{ width: isXsScreen ? 200 : 300 }} placeholder='请输入分组名称' value={basicParams.name} onChange={e => setBasicParams({ ...basicParams, name: e.target.value })} />
              </Space>
            </Col>
            <Col lg={24} xs={24}>
              <Space>
                <span className={styles.label}>重访/排他：</span>
                <Radio.Group options={revisitExclusiveOptions} value={basicParams.revisitExclusive} onChange={e => setBasicParams({ ...basicParams, revisitExclusive: e.target.value })} />
              </Space>
            </Col>
            {basicParams.revisitExclusive !== '0' ?
              <div style={{ width: '100%' }}>
                <Col lg={24} xs={24}>
                  <Space>
                    <span className={styles.label}>ID类型：</span>
                    <div>
                      <Radio.Group options={idTypeOptions} value={basicParams.idType} onChange={e => setBasicParams({ ...basicParams, idType: e.target.value })} />
                      <TextArea placeholder="请以换行区分" rows={4} value={basicParams.idContent} onChange={e => setBasicParams({ ...basicParams, idContent: e.target.value })} />
                    </div>
                  </Space>
                </Col>
                {basicParams.idType==='0'?<Col lg={24} xs={24}>
                  <Space>
                    <span className={styles.label}>会员状态：</span>
                    <Checkbox.Group options={surveyResultStatusOptions} value={basicParams.surveyResultStatus} onChange={e => {
                      if (e.includes('0')) {
                        setBasicParams({ ...basicParams, surveyResultStatus: ['0'] })
                      } else {
                        setBasicParams({ ...basicParams, surveyResultStatus: e })
                      }
                    }} />
                  </Space>
                </Col>:""}
              </div>
              : null
            }
            {basicParams.revisitExclusive !== '1' ?
              <div style={{ width: '100%' }}>
                <Col lg={24} xs={24}>
                  <Space>
                    <span className={styles.label}>手机号是否验证：</span>
                    <Radio.Group options={isPhoneCheckedOptions} value={basicParams.isPhoneChecked} onChange={e => setBasicParams({ ...basicParams, isPhoneChecked: e.target.value })} />
                  </Space>
                </Col>
                <Col lg={24} xs={24}>
                  <Space>
                    <span className={styles.label}>会员等级质量：</span>
                    <Checkbox.Group options={qualityOptions} value={basicParams.quality} onChange={e => setBasicParams({ ...basicParams, quality: e })} />
                  </Space>
                </Col>
              </div>
              : null
            }
          </Row>
        </Card>
        {basicParams.revisitExclusive !== '1' && surveyLabelRel ? <div style={{ width: '100%' }}>
          <Card title="位置信息" className={styles.card}>
            <Row gutter={[16, 16]}>
              <Col lg={24} xs={24}>
                <Space>
                  <span className={styles.label}>地址：</span>
                  <Radio.Group value={positionType} onChange={(e) => setPositionType(e.target.value)}>
                    {positionInfo.map((item: any) => <Radio value={item.code} key={item.name + item.code}>{item.name}</Radio>)}
                  </Radio.Group>
                </Space>
              </Col>
              {
                positionType === 1 && positionInfo[0] && positionInfo[0].list.map((info: any) => {
                  if (info.option === 1) {
                    return <Col lg={24} xs={24} key={`position${info.code}`}><Space>
                      <span className={styles.label}>{info.name}：</span>
                      <CheckBoxAll
                        defaultCheckedList={surveyLabelRel[info.code] ? surveyLabelRel[info.code].map((item: {}) => Object.keys(item)[0]) : []}
                        options={info.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                        onCheckeObjectChange={e => {
                          if (e.length > 0) {
                            setSurveyLabelRel({ ...surveyLabelRel, [info.code]: e })
                          } else {
                            delete surveyLabelRel[info.code]
                            setSurveyLabelRel({ ...surveyLabelRel })
                          }
                        }}
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
              {
                positionType === 2 && positionInfo[1] ? <Tabs style={{ margin: '0 10px' }} activeKey={tabsKey} onChange={e => {
                  setTabsKey(e)
                }}>
                  {
                    positionInfo[1].list.map((info: any) => {
                      let paneChild = null;
                      if (info.code === 100 || info.code === 101) {
                        paneChild = <div>
                          <Col lg={24} xs={24} key={`position${info.code}`}><Space>
                            <span className={styles.label}>{info.name}：</span>
                            <div>
                              {
                                surveyLabelRel[info.code] && surveyLabelRel[info.code].map((item: any) => {
                                  const label: any = Object.values(item)[0];
                                  return <Tag closable className={styles.cityTag} key={label} onClose={() => deleteTag(info.code, label)}>{label}</Tag>
                                })
                              }
                              &nbsp;
                              {
                                info.code === 100 ? <Cascader showSearch={true} options={cityDropDownList} onChange={(value, selectedOptions: any) => addCity(selectedOptions, info.code)}>
                                  {/* <Tag className={styles.siteTagPlus}>
                                    <PlusOutlined /> 添加
                                  </Tag> */}
                                </Cascader> : null
                              }
                              <DownloadButton path={info.code === 100 ? 'download_city' : 'download_location'} text='下载模版' />
                              <UploadButton name="file_upload" action={info.code === 100 ? 'accurate_push/import' : 'accurate_push/import_location'} text={info.code === 100 ? '导入地址信息' : '导入位置信息'} onSuccess={(response) => {
                                if (info.code === 100) {
                                  const nameList = response.data.nameList.split(';');
                                  const labelRel = nameList.map((name: string, index: number) => {
                                    return { [index + 1]: name }
                                  })
                                  setSurveyLabelRel({ ...surveyLabelRel, [info.code]: labelRel });
                                } else {
                                  const labelRel = response.data.map((item: any, index: number) => {
                                    return { [index + 1]: `${item.location};${item.range};${item.longitude}-${item.latitude}` }
                                  })
                                  setSurveyLabelRel({ ...surveyLabelRel, [info.code]: labelRel });
                                }
                              }} />
                            </div>
                          </Space></Col>
                        </div>
                      } else {
                        paneChild = <div>
                          <Col lg={24} xs={24} key={`position${info.code}`}>
                            <Space>
                              <Button type='primary' onClick={() => setModalVisible(true)}>地图选点</Button>
                              <Input style={{ width: 200 }} placeholder='请输入公里数' addonAfter="公里范围内" value={kilometre} onChange={(e) => setKilometre(e.target.value)} />
                              <span className={styles.tips}>公里数大于0,保留一位小数</span>
                            </Space>

                          </Col>
                          {addressModal ? <Col lg={24} xs={24} key={`position${info.code}-address`}>
                            <Space>
                              <span className={styles.label}>选中的位置：</span> {addressModal}
                            </Space>
                          </Col> : null}
                        </div>
                      }
                      return <TabPane tab={info.name} key={`tabs-${info.code}`}>
                        {paneChild}
                      </TabPane>
                    })
                  }
                </Tabs> : null
              }
            </Row>
          </Card>
          <Card title="基础信息" className={styles.card}>
            <Row gutter={[16, 16]}>
              {
                basicInfo.map(info => {
                  if (info.option === 0) {
                    return <Col lg={24} xs={24} key={`basic${info.code}`}><Space>
                      <span className={styles.label}>{info.name}：</span>
                      <Radio.Group defaultValue={surveyLabelRel[info.code] ? surveyLabelRel[info.code].map((item: {}) => Object.keys(item)[0])[0] : ''} onChange={(e) => {
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
                        defaultCheckedList={surveyLabelRel[info.code] ? surveyLabelRel[info.code].map((item: {}) => Object.keys(item)[0]) : []}
                        options={info.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                        onCheckeObjectChange={e => {
                          if (e.length > 0) {
                            setSurveyLabelRel({ ...surveyLabelRel, [info.code]: e })
                          } else {
                            delete surveyLabelRel[info.code]
                            setSurveyLabelRel({ ...surveyLabelRel })
                          }

                        }}
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
            {
              collapseData.map(panel => {
                return <Panel header={panel.name} key={panel.code}>
                  <Tabs defaultActiveKey={`${panel.list[0].name}-${panel.list[0].code}`}>
                    {
                      panel.list.map((info: any) => {
                        const paneItem = info.list.map((pane: any, paneIndex: number) => {
                          if (pane.option === 1) {
                            return <Col lg={24} xs={24} key={`pane-${pane.name}-${pane.code}`}><Space>
                              <span className={styles.label}>{pane.name}：</span>
                              <CheckBoxAll
                                defaultCheckedList={surveyLabelRel[pane.code] ? surveyLabelRel[pane.code].map((item: {}) => Object.keys(item)[0]) : []}
                                options={pane.list.map((item: { name: string; code: string; }) => { return { label: item.name, value: item.code } })}
                                onCheckeObjectChange={e => {
                                  if (pane.code == 454) {
                                    if (e.length > 0) {
                                      getPhoneModelData(formatSelPhone(e), (phoneData: any) => {
                                        const value = formatPhonemodalToName(phoneData, surveyLabelRel["456"] ? formatSelPhone(surveyLabelRel["456"]) : [])
                                        if (value.length > 0) {
                                          setSurveyLabelRel({ ...surveyLabelRel, [pane.code]: e, "456": value })
                                        } else {
                                          delete surveyLabelRel["456"]
                                          setSurveyLabelRel({ ...surveyLabelRel, [pane.code]: e })
                                        }
                                      })
                                    } else {//未选中手机品牌的情况下
                                      setPhoneModelData([])
                                      delete surveyLabelRel[pane.code]
                                      delete surveyLabelRel["456"]
                                      setSurveyLabelRel({ ...surveyLabelRel })
                                    }

                                  } else {
                                    if (e.length > 0) {
                                      setSurveyLabelRel({ ...surveyLabelRel, [pane.code]: e })
                                    } else {
                                      delete surveyLabelRel[pane.code]
                                      setSurveyLabelRel({ ...surveyLabelRel })
                                    }
                                  }
                                }}
                              />
                            </Space></Col>
                          }
                          if (pane.option === 2) {
                            return <Col lg={24} xs={24} key={`pane-${pane.name}-${pane.code}`}><Space>
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
                          if (pane.option === 3) {//当不选择手机型号时 则不传手机型号这一字段 代表推送整个手机品牌
                            return <Col lg={24} xs={24} key={`pane-${pane.name}-${pane.code}`}><Space>
                              <span className={styles.label}>{pane.name}：</span>
                              <Select filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              } value={surveyLabelRel[pane.code] ? formatSelPhone(surveyLabelRel[pane.code]) : []}
                                allowClear={true} mode="multiple" style={{ width: '500px' }} placeholder="请选择手机型号" onChange={(e: any) => {
                                  if (e.length > 0) {
                                    setSurveyLabelRel({ ...surveyLabelRel, [pane.code]: formatValue(e) })
                                  } else {
                                    delete surveyLabelRel["456"]
                                    setSurveyLabelRel({ ...surveyLabelRel })
                                  }
                                }}>
                                {phoneModelData.map((phoneItem: any, phoneIndex: number) => {
                                  return <Option key={phoneItem.model} value={phoneItem.model}>{phoneItem.name}</Option>
                                })}
                              </Select>
                            </Space></Col>
                          }
                          return null;
                        })
                        return <TabPane tab={info.name} key={`${info.name}-${info.code}`}>
                          <Row gutter={[16, 16]}>{paneItem}</Row>
                        </TabPane>
                      })
                    }
                  </Tabs>
                </Panel>
              })
            }
          </Collapse>
        </div> : null}
        <div className={styles.footer}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={searchNumber}>仅查询</Button>
          </Space>
        </div>
      </div>
    </section>
  );
};