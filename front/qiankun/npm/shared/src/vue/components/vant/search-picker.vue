<template>
  <div class="search-picker">
    <!-- 搜索框 -->
    <div class="search-box">
      <van-search
        v-model="searchValue"
        placeholder="请输入搜索关键词"
        @search="onSearch(searchValue)"
        @clear="onClear"
        show-action
      >
        <template #action>
          <div @click="onSearch(searchValue)">搜索</div>
        </template>
      </van-search>
    </div>

    <!-- 搜索结果列表 -->
    <div class="search-list" v-show="showSearchList">
      <!-- 全选选项 -->
      <div v-if="isMultiple && searchData.length > 0" class="list-item">
        <div class="item-content">
          <van-checkbox
            v-model="isAllSelected"
            @click="handleSelectAll(isAllSelected)"
          >
          </van-checkbox>
          <div class="item-label">
            <span class="label-text">全选</span>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in searchData"
        :key="item.value"
        class="list-item"
      >
        <div class="item-content">
          <van-checkbox
            v-if="isMultiple"
            v-model="item.checked"
            @click="(checked) => onCheckboxChange(item.checked, index, item)"
          />
          <div class="item-label">
            <span class="label-text">{{ item.label }}</span>
            <!-- <span class="path-text">{{ item.bmmcPath }}</span> -->
          </div>
        </div>
      </div>
      <div v-if="searchData.length === 0" class="empty-text">暂无搜索结果</div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-button" v-if="showButton && isMultiple">
      <van-button type="info" block round @click="onConfirm">确定</van-button>
    </div>
  </div>
</template>

<script>
import { Search, Checkbox, Button } from "vant";
import { cloneDeep, throttle, debounce } from "lodash";
export default {
  name: "SearchPicker",
  components: {
    [Search.name]: Search,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
  },
  props: {
    // 是否多选模式
    isMultiple: {
      type: Boolean,
      default: false,
    },
    // 是否显示底部确认按钮
    showButton: {
      type: Boolean,
      default: true,
    },
    // 外部传入的数据源
    filterData: {
      type: Array,
      default: () => [],
    },
    // 已选中的值
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchValue: "",
      searchData: [],
      showSearchList: true,
      selectedItems: this.value || [],
      isAllSelected: false,
    };
  },
  watch: {
    //  监听外部数据源变化
    filterData: {
      immediate: true,
      handler(newVal) {
        this.searchData = newVal.map((item) => ({
          ...item,
          checked: this.value.some((selected) => selected.value === item.value),
        }));
      },
    },
    //  监听已选值变化
    value: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log("value变化了", newVal);
        if (newVal) {
          this.searchData = this.searchData.map((item) => ({
            ...item,
            checked: newVal.some((selected) => selected.value === item.value),
          }));
        }
      },
    },
    // 监听搜索数据变化，更新全选状态
    searchData: {
      handler(newVal) {
        console.log("searchData变化了");
        this.updateSelectAllStatus();
      },
      deep: true,
    },
  },
  mounted() {
    this.updateSelectAllStatus();
    console.log("filterData", this.filterData);
    this.resetCheck();
  },
  methods: {
    resetCheck() {
      this.filterData.forEach((item) => {
        this.$set(item, "checked", false);
      });
    },
    // 更新全选状态
    updateSelectAllStatus() {
      console.log("更新全选状态");
      this.isAllSelected =
        this.searchData.length > 0 &&
        this.searchData.every((item) => item.checked);
    },

    // 处理全选/取消全选
    handleSelectAll(checked) {
      console.log("全选", checked);
      this.searchData.forEach((item) => {
        this.$set(item, "checked", checked);
      });
      if (!checked) {
        const data = this.searchData.filter((val) => !val.checked);
        this.value = this.value.filter(
          (val) => !data.some((item) => item.value === val.value)
        );
      } else {
        this.value = [...this.searchData, ...this.value];
        // this.value.
      }
      console.log(this.value);
      // 触发选择事件
      const selectedData = checked ? [...this.searchData] : [];
      this.$emit("select", selectedData);
    },

    // 搜索处理
    onSearch(value) {
      if (!value || !value.trim()) {
        // 搜索为空时显示所有数据，但保持选中状态
        this.searchData = this.filterData.map((item) => {
          const existingItem = this.searchData.find(
            (i) => i.value === item.value
          );
          return {
            ...item,
            checked: existingItem
              ? existingItem.checked
              : this.value.some((selected) => selected.value === item.value),
          };
        });
        return;
      }

      const searchText = value.trim();
      // 过滤数据时保持选中状态
      this.searchData = this.filterData
        .filter((item) => {
          return (
            item.label.includes(searchText) ||
            (item.bmmcPath && item.bmmcPath.includes(searchText))
          );
        })
        .map((item) => {
          const existingItem = this.searchData.find(
            (i) => i.value === item.value
          );
          return {
            ...item,
            checked: existingItem
              ? existingItem.checked
              : this.value.some((selected) => selected.value === item.value),
          };
        });
    },

    // 清空搜索
    onClear() {
      console.log(
        "清空搜索",
        cloneDeep(this.searchData),
        cloneDeep(this.filterData),
        cloneDeep(this.value)
      );
      this.searchValue = "";
      // 恢复所有数据，但保持选中状态
      this.searchData = this.filterData.map((item) => {
        return {
          ...item,
          checked: this.value.some((selected) => selected.value === item.value),
        };
      });
      console.log("searchData", cloneDeep(this.searchData));
    },

    // 取消搜索
    onCancel() {
      this.searchValue = "";
      this.showSearchList = false;
      this.$emit("cancel");
    },

    // Checkbox 改变事件
    onCheckboxChange(checked, index, item) {
      console.log("Checkbox 改变事件", checked, index, item);
      // 更新选中状态
      // this.$set(this.searchData[index], "checked", checked);
      console.log("value123", cloneDeep(this.value));
      // 处理value
      if (checked) {
        this.value.push(item);
      } else {
        this.value = this.value.filter((i) => i.value !== item.value);
      }
      // 更新全选状态
      console.log("value123", cloneDeep(this.value));
      this.updateSelectAllStatus();
      // 触发选择事件
      const selectedData = this.searchData.filter((i) => i.checked);
      this.$emit("select", selectedData);
    },

    // 点击列表项
    // handleItemClick(item) {
    //   console.log("点击列表项", item);
    //   if (!this.isMultiple) {
    //     // 单选模式直接选中当前项
    //     this.searchData.forEach((i) => {
    //       this.$set(i, "checked", i.value === item.value);
    //     });
    //     const selectedData = [item];
    //     this.$emit("select", selectedData);
    //     this.$emit("confirm", selectedData);
    //   }
    // },

    // 确认选择
    onConfirm() {
      const selectedData = this.searchData.filter((item) => item.checked);
      this.$emit("confirm", selectedData);
    },
  },
};
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
            font-size: 16px !important;
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
