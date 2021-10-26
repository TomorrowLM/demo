import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Card, Radio, Space, Cascader, Input, Tag, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DownloadButton from '@/components/DownloadButton';
import UploadButton from '@/components/UploadButton';
import { getCityDropDown } from '@/pages/service';
import { qualifiedRangeOpts, eligibleGenderOpts } from './const.d';
import styles from './index.less';

const { TextArea } = Input;

interface BeforeQuestionProps {
  quesRef?: any,
  values?: Object
}

// let parabola: Parabola | null = null;

const BeforeQuestion: React.FC<BeforeQuestionProps> = (props) => {
  const { quesRef, values } = props;
  const [cityDropDownList, setCityDropDownList] = useState<Array<{ label: string, value: number, children: any[] }>>([]);
  const [beforeQuestionPrs, setBeforeQuestionPrs] = useState<any>({});

  /**
   * 添加城市
   * @param selectedOptions 
   */
  const addCity = (selectedOptions = []) => {
    const tagName = selectedOptions.map((o: any) => o.label).join('-');
    const tagCode = selectedOptions.map((o: any) => o.value).join('-');
    const isHaveTag = beforeQuestionPrs.addressSelect.findIndex((d: any) => d.code === tagCode);
    if (isHaveTag !== -1) {
      message.info('不可重复添加');
    } else {
      setBeforeQuestionPrs({ ...beforeQuestionPrs, addressSelect: [ ...beforeQuestionPrs.addressSelect, { code: tagCode, name: tagName }] });
    }
  }

  /**
   * 删除标签
   * @param code 
   */
  const deleteTag = (code: string) => {
    const currentSelectData = beforeQuestionPrs.addressSelect.filter((item: any): any => item.code !== code);
    setBeforeQuestionPrs({ ...beforeQuestionPrs, addressSelect: currentSelectData });
  }

  useEffect(() => {
    getCityDropDown({ terminalCode: '0' }).then(res => {
      setCityDropDownList(res.data); // 城市下拉展示数据
      
    })
  }, [])

  useEffect(() => {
    setBeforeQuestionPrs(values);
  }, [values])

  /**
   * useImperativeHandle方法的的第一个参数是目标元素的ref引用
   * 回调函数里是暴漏给父组件的方法
   * 例如：{ 方法名称: () => {} }
   */
  useImperativeHandle(quesRef, () => ({
    // 获取数据
    getValues: async () => {
      const { hasCityCondition, addressSelect, hasAgeCondition, ageStart, ageEnd } = beforeQuestionPrs;
      if (hasCityCondition === 1 && !addressSelect.length) {
        message.info('请选择城市合格范围');
        return false;
      }
      if (hasAgeCondition === 1) {
        if (!ageStart || !ageEnd) {
          message.info('请输入年龄合格范围');
          return false;
        } if (ageStart > ageEnd) {
          message.info('请输入正确的年龄合格范围');
          return false;
        } if (ageStart < 15) {
          message.info('年龄不能小于15岁');
          return false;
        } if (ageEnd > 70) {
          message.info('年龄不能大于70岁');
          return false;
        }
      }
      const params = JSON.parse(JSON.stringify(beforeQuestionPrs));
      params.ageCondition = `${ageStart}-${ageEnd}`;
      params.cityCondition = addressSelect.map((item: { code: string; }) => item.code).join(';');
      delete params.ageStart;
      delete params.ageEnd;
      delete params.addressSelect;
      return params;
    }
  }))

  return (
    <Col lg={24} xs={24} style={{ marginBottom: 16 }}>
      <Card title='1.你居住的城市？' className={styles.quesCard}>
        <Radio.Group options={qualifiedRangeOpts} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, hasCityCondition: e.target.value })} value={beforeQuestionPrs.hasCityCondition} />
        {
          beforeQuestionPrs.hasCityCondition === 1 ? <div style={{ padding: '8px 0' }}><Space>
            <span className={styles.label}>合格范围：</span>
            <div>
              {
                beforeQuestionPrs.addressSelect.map((item: any) => {
                  return <Tag closable className={styles.cityTag} key={item.code} onClose={() => deleteTag(item.code)}>{ item.name }</Tag>
                })
              }
              &nbsp;
              <Cascader options={cityDropDownList} onChange={(value, selectedOptions: any) => addCity(selectedOptions)}>
                <Tag className={styles.siteTagPlus}>
                  <PlusOutlined /> 添加
                </Tag>
              </Cascader>
              <DownloadButton path='download_city' text='下载模版' />
              <UploadButton name="file_upload" action='accurate_push/import' text='导入地址信息' onSuccess={(response) => {
                const nameList = response.data.nameList.split(';');
                const codeList = response.data.codeList.split(';');
                const addressList = nameList.map((name: string, index: number) => {
                  return {
                    code: codeList[index],
                    name
                  }
                })
                setBeforeQuestionPrs({ ...beforeQuestionPrs, addressSelect: addressList });
              }} />
            </div>
          </Space></div> : null
        }
      </Card>
      <Card title='2.你的性别？' className={styles.quesCard}>
        <Radio.Group options={qualifiedRangeOpts} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, hasGenderCondition: e.target.value })} value={beforeQuestionPrs.hasGenderCondition} />
        {
          beforeQuestionPrs.hasGenderCondition === 1 ? <div style={{ padding: '8px 0' }}>
            <Space>
              <span className={styles.label}>合格范围：</span>
              <Radio.Group options={eligibleGenderOpts} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, genderCondition: e.target.value })} value={beforeQuestionPrs.genderCondition} />
            </Space>
          </div> : null
        }
      </Card>
      <Card title='3.你的年龄？' className={styles.quesCard}>
        <Radio.Group options={qualifiedRangeOpts} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, hasAgeCondition: e.target.value })} value={beforeQuestionPrs.hasAgeCondition} />
        {
          beforeQuestionPrs.hasAgeCondition === 1 ? <div style={{ padding: '8px 0' }}>
            <Space>
              <span className={styles.label}>合格范围：</span>
              <Input.Group compact>
                <Input style={{ width: 100, textAlign: 'center' }} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, ageStart: e.target.value })} value={beforeQuestionPrs.ageStart} placeholder="最小" suffix="岁" />
                <Input
                  className={styles.siteInputSplit}
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Input style={{ width: 100, textAlign: 'center' }} onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, ageEnd: e.target.value })} value={beforeQuestionPrs.ageEnd} placeholder="最大" suffix="岁" />
              </Input.Group>
            </Space>
          </div> : null
        }
      </Card>
      <Card title='4.设置失败页面文字说明' className={styles.quesCard}>
        <div style={{ padding: '8px 0' }}><TextArea onChange={(e) => setBeforeQuestionPrs({ ...beforeQuestionPrs, failDescription: e.target.value })} value={beforeQuestionPrs.failDescription} rows={4} /></div>
      </Card>
    </Col>
  )
}

export default BeforeQuestion;