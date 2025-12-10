<template>
  <div class="commonCustomerTable">
    <el-table
      ref="tableRef"
      fit
      scrollbar-always-on
      :min-height="height"
      :border="isBorder"
      :data="tableOptions.tableData"
      :highlight-current-row="isSingle"
      @sort-change="sortChange"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :row-class-name="isShowSelectColor ? tableRowClassName : ''"
    >
      <el-table-column type="selection" width="45" v-if="isMultiple" />
      <el-table-column
        type="index"
        align="left"
        fixed
        label="序号"
        width="80"
      />
      <template v-for="item in tableOptions.tableColumns" :key="item.id">
        <el-table-column
          show-overflow-tooltip
          :prop="item.key"
          :fixed="item.fix"
          :label="item.label"
          :width="item.width"
          :header-align="item.headerAlign"
          :align="item.align"
          :sortable="item.sortable ? 'custom' : false"
        >
          <template #default="scope" v-if="item.isSlot">
            <slot :name="item.slotName" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        fixed="right"
        label="操作"
        :width="tableOptions.tableAction.length * 80"
        :resizable="false"
        v-if="isAction"
      >
        <template #default="{ row }">
          <template v-for="(k, v) in tableOptions.tableAction" :key="k.id">
            <el-divider v-if="v !== 0" direction="vertical" />

            <el-button
              link
              :type="k.type"
              :disabled="k.isDisable"
              size="small"
              v-if="k.isShow"
              @click="actionClick(k.key, row)"
              >{{ k.label }}</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-md d-flex justify-content-end" v-if="isPagination">
      <el-pagination
        :current-page="tableOptions.tablePage.current"
        :page-size="tableOptions.tablePage.pageSize"
        :page-sizes="tableOptions.tablePage.sizes"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableOptions.tablePage.total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, reactive } from 'vue';
import { ElTable } from 'element-plus';
import { CommonTableCustom } from '@/interface/custom.model';
const tableRef = ref<InstanceType<typeof ElTable>>();

const props = defineProps({
  // 表格参数
  // tableData 表格数据源 (必传)
  // tableColumns 表格表头数据源 (必传)
  // tableAction 表格操作数据源 (选传)
  // tablePage  表格分页数据源 (选传)
  tableOptions: {
    type: Object as PropType<CommonTableCustom>,
    default: () => [{}]
  },
  // 表格高度
  height: {
    type: Number,
    default: 300
  },
  // 是否存在操作栏
  isAction: {
    type: Boolean,
    default: false
  },
  // 是否加边框
  isBorder: {
    type: Boolean,
    default: true
  },
  // 是否分页
  isPagination: {
    type: Boolean,
    default: false
  },
  // 是否单选
  isSingle: {
    type: Boolean,
    default: false
  },
  // 是否多选
  isMultiple: {
    type: Boolean,
    default: false
  },
  // 是否自定义行颜色
  isShowSelectColor: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits([
  'actionClick',
  'sortChange',
  'multipleSelectChange',
  'singleChange',
  'paginationChange'
]);

// 分页 pageSize 改变
const handlePageSizeChange = (val: number) => {
  emits('paginationChange', {
    current: props.tableOptions.tablePage.current,
    pageSize: val
  });
};

// 分页 current 改变
const handlePageCurrentChange = (val: number) => {
  emits('paginationChange', {
    current: val,
    pageSize: props.tableOptions.tablePage.pageSize
  });
};

// 操作
const actionClick = (key: string, row) => {
  emits('actionClick', { key, row });
};

// 排序
const sortChange = ({ column, prop, order }) => {
  emits('sortChange', { prop, order });
};

// 清空单选
const clearSingleSelect = () => {
  tableRef.value!.setCurrentRow(null);
  emits('singleChange', null);
};

// 单选
const handleCurrentChange = row => {
  emits('singleChange', row);
};

// 多选
const handleSelectionChange = rows => {
  emits('multipleSelectChange', rows);
};

// 选中颜色
const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: any;
  rowIndex: number;
}) => {
  return '';
};

/**
 * 清空行选中数据
 * @param selected <boolean> 选中指定行数据，selected为true时，rows 必传, 否则无效
 * @param rows <any[]>  当rows为null时，则清空所有选中行
 * @description
 * rows  为空： 清空所有
 * rows  不为空：
 * 1. selected 为true， 选中rows数据
 * 2. selected 为false，取消rows行的选中效果
 */
const changeSelectedRows = (selected = false, rows?: []) => {
  if (rows) {
    // 选中
    if (selected) {
      // 需要做默认选中时，需要将之前的选中数据清空
      tableRef.value!.clearSelection();
    }

    rows.forEach(row => {
      tableRef.value!.toggleRowSelection(row, selected);
    });

    // 取消选中
  } else {
    // 清空所有选中
    tableRef.value!.clearSelection();
  }
};

// 导出ref方法
defineExpose({
  changeSelectedRows,
  clearSingleSelect
});
</script>

<style lang="scss" scoped>
.commonCustomerTable {
  width: 100%;
  :deep(.el-table td.el-table__cell > .cell) {
    height: auto;
  }
}
</style>
