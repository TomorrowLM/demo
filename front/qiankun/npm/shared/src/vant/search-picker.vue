<template>
  <div class="search-picker">
    <!-- 搜索框 -->
    <div class="search-box">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onClear"
        show-action
        @cancel="onCancel"
      />
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-list" v-show="showSearchList">
      <div v-for="(item, index) in searchData" :key="item.value" class="list-item">
        <div class="item-content" @click="handleItemClick(item)">
          <van-checkbox 
            v-if="isMultiple" 
            v-model="item.checked"
            @change="(checked) => onCheckboxChange(checked, index, item)"
          />
          <div class="item-label">
            <span class="label-text">{{ item.label }}</span>
            <!-- <span class="path-text">{{ item.bmmcPath }}</span> -->
          </div>
        </div>
      </div>
      <div v-if="searchData.length === 0" class="empty-text">
        暂无搜索结果
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-button" v-if="showButton && isMultiple">
      <van-button type="info" block round @click="onConfirm">确定</van-button>
    </div>
  </div>
</template>

<script>
import { Search, Checkbox, Button } from 'vant';

export default {
  name: 'SearchPicker',
  components: {
    [Search.name]: Search,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
  },
  props: {
    // 是否多选模式
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 是否显示底部确认按钮
    showButton: {
      type: Boolean,
      default: true
    },
    // 外部传入的数据源
    filterData: {
      type: Array,
      default: () => []
    },
    // 已选中的值
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchValue: '',
      searchData: [],
      showSearchList: true,
      selectedItems: this.value || []
    }
  },
  watch: {
    filterData: {
      immediate: true,
      handler(newVal) {
        this.searchData = newVal.map(item => ({
          ...item,
          checked: this.value.some(selected => selected.value === item.value)
        }));
      }
    },
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.searchData = this.searchData.map(item => ({
            ...item,
            checked: newVal.some(selected => selected.value === item.value)
          }));
        }
      }
    }
  },
  methods: {
    // 搜索处理
    onSearch(value) {
      if (!value.trim()) {
        this.searchData = this.filterData.map(item => ({
          ...item,
          checked: this.value.some(selected => selected.value === item.value)
        }));
        return;
      }
      
      this.searchData = this.filterData.filter(item => {
        return item.label.includes(value) || 
               (item.bmmcPath && item.bmmcPath.includes(value));
      }).map(item => ({
        ...item,
        checked: this.value.some(selected => selected.value === item.value)
      }));
    },

    // 清空搜索
    onClear() {
      this.searchValue = '';
      this.searchData = this.filterData.map(item => ({
        ...item,
        checked: this.value.some(selected => selected.value === item.value)
      }));
    },

    // 取消搜索
    onCancel() {
      this.searchValue = '';
      this.showSearchList = false;
      this.$emit('cancel');
    },

    // Checkbox 改变事件
    onCheckboxChange(checked, index, item) {
      // 更新选中状态
      this.$set(this.searchData[index], 'checked', checked);
      
      // 触发选择事件
      const selectedData = this.searchData.filter(i => i.checked);
      this.$emit('select', selectedData);
    },

    // 点击列表项
    handleItemClick(item) {
      if (!this.isMultiple) {
        // 单选模式直接选中当前项
        this.searchData.forEach(i => {
          this.$set(i, 'checked', i.value === item.value);
        });
        const selectedData = [item];
        this.$emit('select', selectedData);
        this.$emit('confirm', selectedData);
      }
    },

    // 确认选择
    onConfirm() {
      const selectedData = this.searchData.filter(item => item.checked);
      this.$emit('confirm', selectedData);
    }
  }
}
</script>

<style lang="less" scoped>
.search-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;

  .search-box {
    padding: 8px;
  }

  .search-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;

    .list-item {
      background: #fff;
      margin-bottom: 8px;
      border-radius: 8px;

      .item-content {
        display: flex;
        align-items: center;
        padding: 12px;
        
        .van-checkbox {
          margin-right: 12px;
          flex-shrink: 0;
        }

        .item-label {
          flex: 1;
          
          .label-text {
            font-size: 16px;
            color: #323233;
            display: block;
          }

          .path-text {
            font-size: 12px;
            color: #969799;
          }
        }
      }
    }

    .empty-text {
      text-align: center;
      color: #969799;
      padding: 32px 0;
    }
  }

  .bottom-button {
    padding: 16px;
    background: #fff;
  }
}
</style>
