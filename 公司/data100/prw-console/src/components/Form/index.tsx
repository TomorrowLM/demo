import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ProForm, { ProFormText, ProFormDigit, ProFormRadio, ProFormCheckbox, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Cascader, Row, Col, Select, Tree, TreeSelect, Divider, Input, DatePicker } from 'antd';
import  * as Icon from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-layout';
import { iconList } from './icon.d';
import styles from './index.less';

const { Option, OptGroup } = Select;

export interface GeneralFormColumnsItem {
  name: string,
  siteName?: Array<string>,
  type: string,
  label?: string,
  width?: string,
  tip?: string,
  placeholder?: string,
  options?: Array<any>,
  rules?: Array<any>,
  siteRules?: Array<any>,
  fieldNames?: Object,
  colSpan?: number,
  colXs?: number,
  disabled?: boolean,
  precision?: number,
  mode?: string,
  showSearch?: boolean,
  showArrow?: boolean,
  optionFilterProp?: string,
  treeNodeFilterProp?: string,
  layout?: string,
  render?: (() => React.ReactNode[] | React.ReactNode | false) | false;
}

interface GeneralFormProps {
  columns: Array<any>;
  initialValues: Object;
  showFooter?: Boolean;
  onFinish: (values: any) => Promise<void>;
  onValuesChange?: (changedValues: any, allValues: any) => void;
}

const GeneralForm: React.FC<GeneralFormProps> = (props) => {
  let isSubmit = false;
  const formRef = useRef<any>();
  const { children, columns, initialValues, showFooter = true, onFinish, onValuesChange } = props;
  
  const onCheck = (checkedKeys: Array<number>, info: any, name: string) => {
    const checkedKey = checkedKeys.concat(info.halfCheckedKeys);
    formRef?.current?.setFieldsValue({[name]: checkedKey.join()})
  };

  const onPressEnter = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  }

  useEffect(() => {
    formRef?.current?.setFieldsValue(initialValues)
  }, [initialValues])

  return (
    <ProForm
      formRef={formRef}
      initialValues={initialValues}
      submitter={{
        render: (_, dom): any => { return showFooter ? <FooterToolbar style={{ position: 'absolute' }}>{dom}</FooterToolbar> : null },
      }}
      onFinish={(values) => {
        if (!isSubmit) {
          onFinish(values);
        }
        isSubmit = true;
        setTimeout(() => {
          isSubmit = false
        }, 2000);
      }}
      onValuesChange={(changedValues, allValues) => onValuesChange && onValuesChange(changedValues, allValues)}>
      <Row gutter={[16, 0]} className={styles.slsForm}>
        {
          columns.map((item: GeneralFormColumnsItem): any => {
            if (!item) {
              return false;
            }
            const { name, siteName = [], type, label, tip, placeholder, options = [], rules = [], siteRules = [], fieldNames, colSpan = 12, colXs = 12, disabled = false, precision = 0, mode, showSearch = true, showArrow = true, optionFilterProp = 'label', treeNodeFilterProp = 'title', layout = 'vertical', render = false } = item
            let defaultExpandedKeys: Array<number> = []; let defaultCheckedKeys: Array<number> = [];
            if (type === 'TREE') {
              defaultExpandedKeys = options.map(option => option.key)
              defaultCheckedKeys = initialValues[name] ? initialValues[name].split(',').map(Number) : []
            }
            const ColumnsData = {
              'CASCADER': <Form.Item key={name} name={name} label={label} rules={rules}>
                <Cascader options={options} fieldNames={fieldNames} disabled={disabled} changeOnSelect />
              </Form.Item>,
              'SELECT': <Form.Item key={name} name={name} label={label} rules={rules}>
                <Select options={options} placeholder={placeholder} disabled={disabled} mode={mode} showSearch={showSearch} showArrow={showArrow} optionFilterProp={optionFilterProp} />
              </Form.Item>,
              'SELECT_ICON': <Form.Item key={name} name={name} label={label} rules={rules}>
                <Select disabled={disabled} placeholder={placeholder} virtual={false} dropdownClassName="mySelectIconBox">
                  {
                    iconList.map((icon: any) => {
                      return <OptGroup key={`optGroup${icon}`} label={icon.label}>
                        {
                          icon.values.map((iconType: string) => {
                            return <Option key={`opt${iconType}`} value={iconType} label={iconType}>
                              <div style={{ display: 'inline-block' }}> 
                                {
                                  React.createElement(
                                    Icon[iconType],
                                    {
                                      style:{ fontSize: '16px', color: '#333' }
                                    }
                                  )
                                }
                              </div>
                            </Option>
                          })
                        }
                      </OptGroup>
                    })
                  }
                </Select>
              </Form.Item>,
              'INPUT_SITE': <Form.Item key={name} label={label}>
                <Input.Group compact>
                  <Form.Item className={styles.siteInputItem} name={siteName[0]} rules={siteRules[0]}><Input style={{ width: 100, textAlign: 'center' }} placeholder="请输入" suffix="分" /></Form.Item>
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
                  <Form.Item className={styles.siteInputItem} name={siteName[1]} rules={siteRules[1]}>
                    <Input
                      className={styles.siteInputRight}
                      style={{
                        width: 100,
                        textAlign: 'center',
                      }}
                      placeholder="请输入"
                      suffix="分"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>,
              'INPUT': <ProFormText key={name} name={name} label={label} tooltip={tip} placeholder={placeholder} rules={rules} fieldProps={ { disabled, type: mode || 'text', allowClear: true, onPressEnter: (e) => onPressEnter(e) } } />,
              'INPUT_NUM': <ProFormDigit key={name} name={name} label={label} tooltip={tip} placeholder={placeholder} rules={rules} fieldProps={ { disabled, precision } } />,
              'RADIO': <ProFormRadio.Group key={name} name={name} label={label} options={options} rules={rules} fieldProps={ { disabled } } />,
              'CHECKBOX': <ProFormCheckbox.Group key={name} name={name} label={label} options={options} layout={layout} rules={rules} fieldProps={ { disabled } } />,
              'TEXT_AREA': <ProFormTextArea key={name} name={name} label={label} tooltip={tip} placeholder={placeholder} rules={rules} fieldProps={ { disabled } } />,
              'TREE': <Form.Item key={name} name={name} label={label} rules={rules}>
                <Tree
                  checkable
                  defaultExpandedKeys={defaultExpandedKeys}
                  defaultCheckedKeys={defaultCheckedKeys}
                  onCheck={(checkedKeys: any, info: any) => onCheck(checkedKeys, info, name)}
                  treeData={options}
                />
              </Form.Item>,
              'TREE_SELECT': <Form.Item key={name} name={name} label={label} rules={rules}>
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={options}
                  placeholder={placeholder}
                  treeDefaultExpandAll
                  virtual={false}
                  showSearch={showSearch}
                  treeNodeFilterProp={treeNodeFilterProp}
                />
              </Form.Item>,
              'DATE_PICKER': <Form.Item key={name} name={name} label={label} rules={rules}>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled={disabled}
                  placeholder={placeholder}
                  showTime
                />
              </Form.Item>,
              'DIVIDER': <Divider>{label}</Divider>
            }
            return <Col key={`col${name}`} lg={colSpan} xs={colXs}>{ render || ColumnsData[type] }</Col>
          })
        }
        { children }
      </Row>
    </ProForm>
  );
};

export default GeneralForm;
