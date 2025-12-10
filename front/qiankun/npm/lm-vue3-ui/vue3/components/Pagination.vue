<!--
 * @Author: 徐小玉
 * @Date: 2024-10-09 10:04:57
 * @LastEditors: xxy xiaoyu.xu@cisdi.com.cn
 * @LastEditTime: 2024-11-08 18:54:06
 * @FilePath: \dedust_advanced_web\src\components\ProTable\components\Pagination.vue
 * @Description: 
-->
<template>
  <!-- 分页组件 -->
  <el-pagination
    :background="true"
    :current-page="pageable.pageNum"
    :page-size="pageable.pageSize"
    :page-sizes="[15, 25, 50, 100]"
    :total="pageable.total"
    layout="total, slot, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :small="true"
  >
    <div class="custom-pagination d-flex align-items-center">
      <span>每页</span>
      <el-select
        @change="handleSizeChange"
        v-model="pageable.pageSize"
        placeholder=""
				size="small"
      >
        <el-option
          v-for="(item, index) in [15, 25, 50, 100]"
          :label="item"
          :key="index"
          :value="item"
        ></el-option>
      </el-select>
      <span>条</span>
    </div>
  </el-pagination>
</template>

<script setup lang="ts" name="Pagination">
import { toRefs, defineProps } from 'vue';
interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}

interface PaginationProps {
  pageable: Pageable;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
}
const props = defineProps<PaginationProps>();
const { pageable, handleSizeChange } = toRefs(props);

console.log(handleSizeChange, 123);
</script>

<style lang="scss" scoped>
.custom-pagination {
  > span {
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: rgba(34, 34, 34, 0.75);
    line-height: 14px;

    &:first-of-type {
      margin-left: 12px;
    }
  }

  .el-select {
    width: 60px !important;
    min-width: initial;
    border-radius: 4px;
    color: #222222;
    margin: 0 6px;
  }

  .el-select__selected-item {
    color: #222;
  }
}
</style>
