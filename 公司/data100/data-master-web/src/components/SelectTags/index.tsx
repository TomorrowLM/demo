import { Select, Tag, message, Tooltip } from 'antd';
import React from 'react';
// import { useState } from 'react';
import { uniKey } from '@/utils/utils'
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
interface option {
  label: string, value: string
}
interface SelectTagsProps {
  disabled: boolean,
  title: string,
  options: option[],
  onChange: any,
  value: Array<option>,
  placeholder: string,
  getOptionInfo?: any,//选择题目时触发的方法
}

const SelectTags: React.FC<SelectTagsProps> = (props) => {
  const { title, options, onChange, value, placeholder, getOptionInfo, disabled } = props
  // console.log(title, options, onChange, value,placeholder)
  return (
    <span>
      &nbsp;{title}&nbsp;
      <Select disabled={disabled} allowClear showSearch optionFilterProp="label" placeholder={placeholder}
        options={options}
        onChange={(e, option: any) => {
          if (e) {
            if (value.filter((option: any) => option.value === e).length > 0) {
              message.warning("不可重复选择")
              return
            }
            option.title = option.subtitle
            delete option.subtitle
            // console.log(value)
            if (option.qid) {//选择题目
              getOptionInfo(option.qid, (list: any) => {
                console.log(list)
                option.optionList = [...list]
                value.push(option)
                onChange([...value])
              })
            } else {
              value.push(option)
              onChange([...value])
            }
          }
        }} style={{ width: "280px" }}>

      </Select>
      &nbsp;
      {
        value.length > 0 ? value.map((optionItem: any, optionIndex: number) => {
          return <Tooltip placement="topLeft" title={optionItem.label} arrowPointAtCenter><Tag closable={!disabled} key={uniKey()} style={{ height: '28px', lineHeight: '28px', display: "inline-flex", alignItems: "center" }} onClose={(e) => {
            e.preventDefault();
            value.splice(optionIndex, 1)
            onChange([...value])
          }}>
            <span style={{ display: "inline-block", maxWidth: "300px", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: "nowrap" }}>{optionItem.label}</span>
          </Tag>  </Tooltip>
        }) : ''
      }
      &nbsp;
    </span>
  )
};

export default SelectTags;
