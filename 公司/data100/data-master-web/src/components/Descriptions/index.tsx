import React from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { EditTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';

interface GeneralDescriptionsProps {
  data: object,
  columns: Array<any>,
  column?: number,
  title?: string,
  tip?: string,
  onEditClick?: (type: any) => void 
}

const GeneralDescriptions: React.FC<GeneralDescriptionsProps> = (props) => {
  const { data, columns, column = 1, tip, title, onEditClick } = props;

  return (
    <ProDescriptions className='sls-ant-descriptions' column={column} tip={tip} title={title}>
      {
        columns.map((item: any) => {
          let valueName = '';
          if (Array.isArray(item.value)) {
            item.value.forEach((key: string, index: number) => {
              if (index === item.value.length - 1) {
                valueName += data[key]
              } else {
                valueName += `${data[key]  } / `
              }
            })
          } else {
            valueName = data[item.value]
          }
          return <ProDescriptions.Item key={`Descriptions${item.label}`} tip={item.tip} label={item.label} valueType={item.type} valueEnum={item.valueEnum} span={item.span || 1}>
            { 
              // eslint-disable-next-line no-nested-ternary
              item.type === 'link' && valueName
              ? 
              <a href={item.href || valueName} rel="noopener noreferrer" target='_blank'>{ valueName }</a>
              :
              (
                item.valueEnum || ['jsonCode', 'code'].includes(item.type) ? valueName : <Tooltip title={valueName}>
                  <span>{ valueName }</span>
                </Tooltip>
              )
            }
            { item.edit && <EditTwoTone style={{ marginLeft: 10, cursor: 'pointer' }} onClick={() => onEditClick && onEditClick(item.value)} /> }
          </ProDescriptions.Item>
        })
      }
    </ProDescriptions>
  )
}

export default GeneralDescriptions;