<template>
  <div style="width: 80%">
    <custom-form :formData="searchModel" :config="formConfig" ref="customRef">
      <template #slot-item>
        <div class="d-inline-block">
          <el-button type="primary" @click="tableRef.getTableList()">查询</el-button>
          <el-button @click="tableRef.reset()">重置</el-button>
        </div>
      </template>
    </custom-form>
    <Pro-table
      ref="tableRef"
      :border="true"
      :toolButton="[]"
      :columns="tableSourceColumns"
      :requestApi="gainPersonnePage"
      v-model:initParam="searchModel"
      :dataCallback="dataCallback"
    ></Pro-table>
  </div>
</template>

<script setup lang="ts" name="useTableHook">
import { ref, reactive } from 'vue'
// import ProTable from '@/components/ProTable/index.vue'
// import ProTable from '@/components/ProTable/index.vue'
const { setResetField, isArray } = useFun()
const state = reactive({
  tableSourceColumns: [
    // { type: 'selection', align: 'left', width: 70 },
    { prop: 'employeeName', label: '姓名' },
    { prop: 'sex', label: '性别' },
    { prop: 'idCard', label: '证件编号', width: 250 },
    { prop: 'nextExaminationDate', label: '提醒时间' },
    { prop: 'operation', label: '操作', fixed: 'right' }
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
            prop: 'idCard',
            label: '证件编号',
            type: 'input',
            labelWidth: '85px'
          },
          {
            prop: 'physicalExaminationAgency',
            label: '体检机构',
            type: 'input',
            labelWidth: '85px'
          },
          {
            prop: 'lastExaminationDate',
            label: '上次体检时间',
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

const gainPersonnePage = async () => {
  return {
    data: {
      pageNum: 1,
      pageSize: 10,
      total: 1,
      list: [{ employeeName: 'zs', sex: '男' }]
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
