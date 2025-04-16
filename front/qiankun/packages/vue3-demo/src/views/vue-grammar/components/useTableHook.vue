<template>
  <div style="width: 80%">
    <custom-form :formData="searchModel" :config="formConfig" ref="customRef">
      <template #slot-item>
        <div class="d-inline-block">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="tableRef.reset()">重置</el-button>
        </div>
      </template>
    </custom-form>
    <Pro-table
      v-model:searchParam="searchModel"
      ref="tableRef"
      :border="true"
      :toolButton="[]"
      :columns="tableSourceColumns"
      :requestApi="gainPersonnePage"
      :dataCallback="dataCallback"
      :paramsHandler="paramsHandler"
      :requestAuto="false"
    ></Pro-table>
  </div>
</template>

<script setup lang="ts" name="useTableHook">
import { ref, reactive } from 'vue'

const state = reactive({
  tableSourceColumns: [
    // { type: 'selection', align: 'left', width: 70 },
    // { type: 'selection' },
    { type: 'sort', label: '拖拽' },
    { prop: 'employeeName', label: '姓名' },
    { prop: 'sex', label: '性别' },
    { prop: 'idCard', label: '证件编号', width: 250 },
    { prop: 'nextExaminationDate', label: '提醒时间' }
    // { prop: 'operation', label: '操作', fixed: 'right' }
  ],
  formConfig: {
    styleConfig: {
      labelPosition: 'left',
      width: '300px',
      marginBottom: '16px'
    },
    panels: [
      {
        elements: [
          {
            prop: 'employeeName',
            label: '姓名',
            type: 'input',
            labelWidth: '85px'
          },
          {
            prop: 'idCard',
            label: '证件编号',
            type: 'input',
            labelWidth: '85px'
          },
          {
            prop: 'nextExaminationDate',
            label: '提醒时间',
            type: 'daterange',
            width: '330px',
            'value-format': 'YYYY-MM-DD'
          },
          {
            type: 'slot-item'
          }
        ]
      }
    ]
  }
})
const { tableSourceColumns, formConfig } = toRefs(state)

const gainPersonnePage = async (data) => {
  if (data.employeeName.includes('zs') || !data.employeeName) {
    return {
      data: {
        pageNum: 1,
        pageSize: 10,
        total: 1,
        list: [
          { employeeName: 'zs1', sex: '男' },
          { employeeName: 'zs2', sex: '男' }
        ]
      }
    }
  }
  return {
    data: {
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  }
}
const searchModel = ref({
  employeeName: '',
  sex: '',
  idCard: '',
  nextExaminationDate: []
})

const dataCallback = (res) => {
  return res
}
const tableRef = ref()
const paramsHandler = (data) => {
  if (data.nextExaminationDate.length) {
    data.nextExaminationDateStart = data.nextExaminationDate ? data.nextExaminationDate[0] : ''
    data.nextExaminationDateEnd = data.nextExaminationDate ? data.nextExaminationDate[1] : ''
    delete data.nextExaminationDate
  } else {
    data.nextExaminationDate = null
  }
  return data
}
if(1){
  const tableRef = ref(1)
}
const search = () => {
  tableRef.value.getTableList()
  console.log(searchModel.value)
}

// const search = (isReset?: boolean) => {
//   console.log(tableRef.value)
//   if (isReset) {
//     const resetFields = [
//       'idCard',
//       'physicalExaminationAgency',
//       'jobItem',
//       'jobCodes',
//       'lastExaminationDate'
//     ]
//     setResetField(searchModel.value, resetFields)
//   }
//   const reqData = { ...searchModel.value }
//   tableRef.value.getTableList(reqData)
// }
onMounted(() => {})
</script>
