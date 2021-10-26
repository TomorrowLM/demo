import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

interface CheckBoxAllProps {
  options: Array<{ label: string, value: string }>,
  defaultCheckedList?: Array<string>,
  onCheckeChange?: (values: any) => void,
  onCheckeObjectChange?: (values: any) => void
}

const CheckBoxAll: React.FC<CheckBoxAllProps> = (props) => {
  const { options, defaultCheckedList = [], onCheckeChange, onCheckeObjectChange } = props;

  const [checkedList, setCheckedList] = useState<Array<string>>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  useEffect(() => {
    setCheckAll(!!defaultCheckedList.length && defaultCheckedList.length === options.length);
    setIndeterminate(!!defaultCheckedList.length && defaultCheckedList.length < options.length);
  }, [])

  const onChange = (list: any[]) => {
    const isCheckAll = !!list.length && list.length === options.length;
    const values = isCheckAll ? [ '-1', ...list ] : list;
    const valuesObject = list.map(val => {
      return {
        [val]: options.find(item => item.value === val)?.label
      }
    })
    setCheckedList(values);
    if (onCheckeChange) {
      onCheckeChange(values);
    }
    if (onCheckeObjectChange) {
      onCheckeObjectChange(valuesObject);
    }
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: { target: { checked: React.SetStateAction<boolean>; }; }) => {
    const o = options.map(item => item.value);
    const list = e.target.checked ? [ '-1', ...o ] : [];
    const newO =e.target.checked ? [...o]:[]
    const valuesObject = newO.map(val => {
      return {
        [val]: options.find(item => item.value === val)?.label
      }
    })
    setCheckedList(list);
    if (onCheckeChange) {
      onCheckeChange(list);
    }
    if (onCheckeObjectChange) {
      onCheckeObjectChange(valuesObject);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} style={{ marginRight: 8, flexShrink: 0 }}>全部</Checkbox>
      <Checkbox.Group options={options} value={checkedList} onChange={onChange} />
    </div>
  )
}

export default CheckBoxAll;