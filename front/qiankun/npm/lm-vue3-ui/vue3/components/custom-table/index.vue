<template>
  <div class="layout">
    <!-- :height="tableStyleInit.height"
        :max-height="tableFitHeight ? tableFitHeight : 'initial'"
        :size="tableStyleInit.size"
        :border="tableStyleInit.border"
        :stripe="tableStyleInit.stripe"
       
        v-loading="tableOption.loading || loading"
        row-key="selectRow"
        :row-class-name="tableRowClassName"
        :row-style="tableRowStyle"
        @row-click="clickRow"
        @selection-change="selectChange"
        @sort-change="sortChanged" -->
    <!-- border -->
    <el-table
      row-key="id"
      class="table layout-content"
      ref="table"
      style="width: 100%"
      :data="tableConfig.contentList"
      :tree-props="tableConfig.treeProps"
      tooltip-effect="light"
      show-overflow-tooltip
    >
      <!--  空数据状态的插槽 -->
      <!-- <template v-slot:empty>
        <el-empty :image-size="100" description="暂无数据"></el-empty>
      </template> -->
      <template v-slot:empty>
        <slot name="empty"></slot>
      </template>

      <template v-for="(val, index) in tableConfig.headerList">
        <el-table-column
          :resizable="false"
          type="selection"
          :fixed="val.fixed || true"
          v-if="val.showSelect"
          :key="`'order_'+${index}`"
          width="100"
          :reserve-selection="true"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- 序号 -->
        <el-table-column
          :resizable="false"
          type="index"
          label="序号"
          v-else-if="val.hasOwnProperty('showOrder') && val.showOrder"
          width="80"
          :key="index"
        ></el-table-column>
        <!-- render -->
        <el-table-column
          :resizable="false"
          :fixed="val.fixed"
          :prop="val.prop"
          :label="val.label"
          :width="val.width"
          :key="`'template_'+${index}`"
          v-else-if="val.hasOwnProperty('render')"
        >
          <template v-slot="{ row }">
            <slot
              :row="row"
              :name="val.render.type"
              v-if="val.render.type.includes('slot')"
            ></slot>
            <div
              v-if="val.render.type === 'radio-status'"
              class="flex"
              style="align-items: center"
            >
              <div
                class="m-r-4"
                :style="{
                  ...val.render.styleFn(row, 1),
                  width: '10px',
                  height: '10px',
                  borderRadius: '10px'
                }"
              ></div>
              <div :style="{ ...val.render.styleFn(row, 2) }">
                {{ val.render.label(row) }}
              </div>
            </div>
            <div v-if="val.render.type === 'formatter'">
              {{ val.render.label(row) }}
            </div>
            <div v-if="val.render.type === 'time'">
              {{ dayjs(row[val.prop]).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <!-- 操作 -->
            <div v-if="val.render.type === 'operation'" class="operation flex">
              <div
                v-for="(valTem, index) in val.render.operation"
                :key="`'operate_'+${index}`"
                class="el-table__button-group"
              >
                <el-popconfirm
                  v-if="valTem.popConfirmMes"
                  placement="bottom"
                  :title="
                    typeof valTem.label === 'string'
                      ? valTem.popConfirmMes
                      : valTem.popConfirmMes(row)
                  "
                  @confirm="emitTable(row, valTem.type)"
                  width="180px"
                >
                  <template #reference>
                    <!-- {{ valTem.style() }} -->
                    <el-button
                      :style="{
                        ...(valTem.style && valTem.style(row)),
                        display: !valTem.displayFn
                          ? 'initial'
                          : valTem.displayFn(row, valTem)
                          ? 'initial'
                          : 'none'
                      }"
                      link
                      type="primary"
                      size="small"
                    >
                      {{
                        typeof valTem.label === 'string'
                          ? valTem.label
                          : valTem.label(row)
                      }}</el-button
                    >
                  </template>
                </el-popconfirm>
                <slot
                  v-bind:row="row"
                  v-else-if="valTem.render && valTem.render.includes('slot')"
                  :name="valTem.render"
                ></slot>
                <el-button
                  v-else
                  type="primary"
                  link
                  :style="{
                    ...(valTem.style && valTem.style(row)),
                    display: !valTem.displayFn
                      ? 'initial'
                      : valTem.displayFn(row, valTem)
                      ? 'initial'
                      : 'none'
                  }"
                  @click="emitTable(row, valTem.type)"
                  >{{
                    typeof valTem.label === 'string'
                      ? valTem.label
                      : valTem.label(row)
                  }}</el-button
                >
                <el-divider
                  style="margin: 0 6px"
                  v-if="val.render.operation.length !== index + 1"
                  direction="vertical"
                >
                </el-divider>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- default -->
        <el-table-column
          :resizable="false"
          v-else-if="!val.operation"
          :fixed="val.fixed"
          :key="`'default_'+${index + 100}`"
          :prop="val.prop"
          :label="typeof val.label === 'string' ? val.label : val.label(row)"
          :width="val.width"
          :sortable="val.sortable"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>
    </el-table>
    <!-- <div class="pagination mt-xs" v-if="!tableOption.hidePagination">
        <pagination @pagination="handlePaginationChange" :total="total" :page="syncFormState.currentPage" :size="syncFormState.pageSize"></pagination>
      </div> -->
    <!-- <pagination
      v-model:pageConfig="pageConfig"
      @update="updateTable"
    ></pagination> -->
  </div>
</template>

<script lang="ts" setup>
import pagination from '@/components/Pagination/index.vue';
import dayjs from 'dayjs';
import { PropType, reactive, toRefs, watch } from 'vue';
//表格操作列
type RenderProps = {
  type: string; // 'formatter','operation'
  label: string;
  operation?: {
    type: string;
    label: string | Function;
  }[]; // 表格操作列表
  displayFn?: Function; //是否展示操作
  renderList?: any;
};

//表格列属性参数
type TableColumnsProps = {
  label: string; //列名
  prop: string; //列名字段
  width?: string; //宽度
  fixed?: boolean; //默认true,固定位置left,right
  render?: RenderProps; //渲染指定
  showSelect?: boolean; //是否展示选择框
  showOrder?: boolean; //是否展示序号
  sortable?: boolean | string; //是否排序
}[];

const props = defineProps<{
  styleConfig: any; //表单项列表
  tableConfig: {
    headerList: any[];
    contentList: TableColumnsProps;
    treeProps?: object;
  }; //表单项列表
  pageConfig: {
    total: number;
    limit: number;
    pageNum: number;
    pageSize: number;
    layout: string;
  };
}>();
const emit = defineEmits(['emitTable', 'update']);
const emitTable = (row: any, type: any) => {
  emit('emitTable', { row, type });
};
const pageConfig = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 10
});
const updateTable = () => {
  emit('update', pageConfig);
};
if (props.pageConfig) {
  watch(
    () => props.pageConfig.total,
    () => {
      console.log(props.pageConfig.total, 2);
      pageConfig.total = props.pageConfig.total;
    },
    { deep: true, immediate: true }
  );
}

const { tableConfig, styleConfig } = toRefs(props);

const setPage = data => {
  console.log(data);
  // Object.assgin(pageConfig, data);
  pageConfig.pageNum = data.pageNum;
  // pageConfig.pageSize=data.pageSize
};

defineExpose({ setPage });
</script>

<style lang="scss" scoped>
.table {
  flex: 1;
  // height: 0;
}
.el-table td.el-table__cell div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
