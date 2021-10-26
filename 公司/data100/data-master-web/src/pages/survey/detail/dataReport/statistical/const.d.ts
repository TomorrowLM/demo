
import { Columns } from '@ant-design/table';

export const columns= (percentage): Columns<TableListItem>[]=>{
  return [
    {
      title:"选项",
      dataIndex: 'name',
      width:200,
    },
    {
      title:"小计",
      dataIndex: 'number',
      width:100,
    },
    {
      title:"比例",
      dataIndex: 'percentage',
      width:'auto',
      render:(text,record,index)=>{
        return percentage(text,index)
      }
    },
  ]
}
/**
 * 题型枚举
 */
export const questionType = {
  '5':"5分单选",
  'L':'button单选/radio单选/带评论单选',
  '!':"下拉单选",
  'A':'5分阵列',
  'B':'10分阵列',
  'H':'按列阵列',
  'F':'阵列单选',
  'E':'阵列（增加、减少、不变）',
  ';':'阵列文本/阵列多选',
  '1':'阵列双尺度',
  ':':'阵列数字',
  '':'阵列（是、否、不确定）',
  'M':'多选/button多选',
  'p':'带评论多选',
}
export const chartColor = [
  '#214F7E','#BED0E1','#1B8BCF','#A8DDDB','#FFC23F','#FBC3BD','#E2243C','#8490C7','#61709D','#9E82C2',
]