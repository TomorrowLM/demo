<template>
  <div class="export">
    <el-dialog
      v-model="dialogVisible"
      @close="emits('handleClose')"
      title="导出"
      style="height: 80vh; width: 80vw"
    >
      <div class="d-flex mt-md content-warpper">
        <div class="condition-warpper">
          <div style="padding: 0 12px">
            <CommonTitle :title="leftTitle"></CommonTitle>
          </div>
          <div style="padding: 0 12px">
            <p class="mb-md">导出内容:</p>
            <div class="table-body-warpper">
              <el-table
                ref="tableTplRef"
                :data="tableData"
                width="100%"
                max-height="50vh"
                border
                stripe
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="内容" prop="title" />
                <el-table-column label="是否排序">
                  <template #default="{ row }">
                    <el-checkbox v-model="row.sortable" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div
            class="btn-list-warpper d-flex align-items-center justify-content-center"
          >
            <el-button
              type="primary"
              :loading="exportLoading"
              @click="exportData"
              >导出</el-button
            >
            <el-button type="primary" :loading="prevLoading" @click="preview"
              >预览</el-button
            >
            <el-button @click="emits('handleClose')">取消</el-button>
          </div>
        </div>
        <div
          class="flex-1 d-flex flex-wrap justify-content-center"
          style="padding: 0 12px"
        >
          <CommonTitle :title="rightTitle"></CommonTitle>
          <div v-if="tableOptions.data?.length" style="width: 100%">
            <div class="table_body_wrapper">
              <DymicList
                ref="multipleTableRef"
                :tableOptions="tableOptions"
                @sortChange="sortChange"
              />
            </div>
            <div class="d-flex justify-content-end mt-md">
              <Pagination
                :total="total"
                v-model:page="pagination.pageNum"
                v-model:size="pagination.pageSize"
                @pagination="handleQuery"
              />
            </div>
          </div>
          <div v-else style="text-align: center">
            <img
              src="@/assets/img/export.png"
              alt=""
              style="width: 214px; height: 228px"
            />
            <p>左侧选择要导出/预览的数据的时间区间、导出内容</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import CommonTitle from '@/components/commonTitle/index.vue';
import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DymicList from '@/components/TableList/DymicList/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import { TableOptions, ApiData } from '@/interface/common.model';
import { ElTable, ElMessage } from 'element-plus';
import { exportExcel } from '@/utils/excelConfig';

const emits = defineEmits(['handleClose']);
const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  actionPosition: {
    type: String,
    required: true,
    default: ''
  },
  params: {
    type: String,
    required: false,
    default: ''
  }
});
const tableTplRef = ref<InstanceType<typeof ElTable> | null>(null);
const tableOptions: TableOptions<any> = reactive({
  columns: [],
  data: [],
  loading: false,
  height: 550,
  primaryKey: '' // 记录列属性中的唯一主键值对应的 key
});
const state = reactive({
  dialogVisible: true,
  exportLoading: false,
  prevLoading: false,
  leftTitle: '数据导出',
  rightTitle: '预览',
  operateTime: '',
  tableData: [] as any[],
  multipleSelection: [] as any[],
  total: 0,
  pagination: {
    pageSize: 10,
    pageNum: 1
  },
  tempTabelData: [] as any[],
  totalData: [] as any[],
  isPrev: false,
  sortConfig: {
    sortField: '',
    sortOrder: ''
  }
});
const {
  dialogVisible,
  exportLoading,
  prevLoading,
  leftTitle,
  rightTitle,
  operateTime,
  multipleSelection,
  tableData,
  total,
  pagination
} = toRefs(state);

const handleSelectionChange = (list: any[]) => {
  state.multipleSelection = list;
};

watch(
  () => state.exportLoading,
  (newVal, oldVal) => {
    if (!newVal) {
      writeExcel();
    }
  }
);

/** 导出 */
const exportData = () => {
  state.exportLoading = true;
  getTableList(-1).then(
    (res: any) => {
      state.exportLoading = false;
      if (res.data && Array.isArray(res.data)) {
        state.totalData = res.data;
      } else {
        state.totalData = res.data.records;
      }
    },
    _ => (state.exportLoading = false)
  );
};

const sortChange = (sortConfig: { sortField: string; sortOrder: string }) => {
  sortConfig.sortField = sortConfig.sortField
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase();
  state.sortConfig = sortConfig;
  getTableList();
};
/** 写入excel */
const writeExcel = () => {
  let exc_data: any = [];
  const titleObj = state.multipleSelection.map(item => {
    return {
      key: item.key,
      text: item.title
    };
  });
  let value: any[] = [];
  if (state.totalData?.length) {
    value = state.totalData.map(obj => {
      let row: any = [];
      for (let i = 0; i < titleObj.length; i++) {
        let flag = true;
        Object.entries(obj).forEach(arr => {
          if (arr[0] === titleObj[i].key) {
            row.push(arr[1]);
            flag = false;
          }
        });
        if (flag) row.push('');
      }
      return row;
    });
  }
  const title = titleObj.map(obj => obj.text);
  // 以下为导出时转义代码，若大数据量导出时缓慢，请注释
  title.forEach(item => {
    if (
      state.multipleSelection.find(item1 => {
        return item1.title === item;
      })?.statusConfig !== undefined
    ) {
      let nihao = title.findIndex(item3 => item3 === item);
      value.forEach(item4 => {
        let temp = item4[nihao];
        item4[nihao] = state.multipleSelection.find(item5 => {
          return item5.title === item;
        })?.statusConfig[temp];
      });
    }
  });
  // 转义结束
  exc_data = [title, ...value];
  try {
    exportExcel('导出的表格', exc_data);
    ElMessage.success('导出成功');
    emits('handleClose');
  } catch {
    ElMessage.error('导出失败');
  }
};
/** 预览 */
const preview = () => {
  state.prevLoading = true;
  state.pagination.pageNum = 1;
  state.pagination.pageSize = 10;
  console.log(state.tempTabelData);

  tableOptions.data = state.tempTabelData;
  tableOptions.columns = state.multipleSelection.map(obj => ({
    ...obj,
    editable: false
  }));
  state.isPrev = true;
  state.prevLoading = false;
};
const getTableList = (pageSize?: number) => {
  const promise = new Promise((resolve, reject) => {
    // const opt = {
    //   ...state.pagination,
    //   specifyId: props.actionPosition,
    //   queryType: false,
    //   ...JSON.parse(props.params)
    // };
    let opt = {
      pageNum: state.pagination.pageNum,
      pageSize: pageSize ? pageSize : state.pagination.pageSize,

      specifyId: props.actionPosition,
      queryType: false,
      ...state.sortConfig
    };
    if (props.params !== '') {
      opt = {
        ...opt,
        ...JSON.parse(props.params)
      };
    }
    tableOptions.loading = true;
    props.api(opt).then(
      (res: ApiData) => {
        tableOptions.loading = false;
        const data = res.data;
        if (state.isPrev) {
          if (data && Array.isArray(data)) {
            tableOptions.data = data;
          } else {
            tableOptions.data = data.records;
          }
        } else {
          if (data && Array.isArray(data)) {
            state.tempTabelData = data;
          } else {
            state.tempTabelData = data.records;
          }
        }
        state.total = data.total;
        state.pagination.pageSize = data.size;
        state.pagination.pageNum = data.current;
        resolve(res);
      },
      _ => {
        tableOptions.loading = false;
        reject();
      }
    );
  });
  return promise;
};
// 分页
const handleQuery = ({ page, size }) => {
  state.pagination.pageSize = size;
  state.pagination.pageNum = page;
  getTableList();
};

onMounted(() => {
  getTableList();
  if (props.columns) {
    state.tableData = props.columns;
    tableOptions.columns = props.columns.filter(
      (item: any) => item.show
    ) as any;
    props.columns.forEach((row: any) => {
      if (row.show) {
        nextTick(() => {
          tableTplRef.value!.toggleRowSelection(row, true);
        });
      }
    });
  }
});
</script>

<style scoped lang="scss">
.export {
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .common-title {
    width: 100%;
    height: 20px;
  }
  .condition-warpper {
    width: 20%;
    height: calc(80vh - 58px);
    border-right: 1px solid #dadde9;
    position: relative;
    .btn-list-warpper {
      width: 100%;
      height: 50px;
      border-top: 1px solid #dadde9;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
