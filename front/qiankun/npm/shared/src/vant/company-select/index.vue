<!--
 * @Descripttion: 企业选择组件
 * @Author: Claude
 * @Date: 2024-03-21
-->
<template>
  <div class="company-select company-select-wrapper">
    <!-- 企业名称输入框 -->
    <van-field
      v-model="companyName"
      :label="label"
      :placeholder="placeholder"
      :rules="rules"
      :required="required"
      readonly
      right-icon="arrow"
      @click="openPicker"
    />
    <!-- 企业选择弹出层 -->
    <van-popup
      v-model="showPicker"
      position="bottom"
      style="height: 60%"
      :get-container="getContainer"
    >
      <div class="company-picker">
        <div class="picker-header">
          <span class="cancel" @click="onCancel" v-if="showPickerHandle"
            >取消</span
          >
          <span class="title">选择{{ title }}</span>
          <span class="confirm" @click="onConfirm" v-if="showPickerHandle"
            >确定</span
          >
        </div>
        <van-search
          v-model="searchValue"
          :placeholder="searchPlaceholder"
          @input="onSearch"
        />
        <div class="company-list" ref="companyList" @scroll="handleScroll">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in list"
              :key="index"
              :title="item.nsrmc"
              @click="selectCompany(item)"
              :class="{
                active: selectedCompany && selectedCompany.nsrmc === item.nsrmc,
              }"
            />
          </van-cell-group>
          <div v-if="loading" class="loading-more">
            <van-loading type="spinner" size="24px">加载中...</van-loading>
          </div>
          <div v-if="finished" class="no-more">没有更多了</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Search, Cell, CellGroup, Loading } from "vant";

export default {
  name: "CompanySelect",

  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Loading.name]: Loading,
  },

  props: {
    value: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "企业",
    },
    required: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: Array,
      default: () => [{ required: true, message: "" }],
    },
    list: {
      type: Array,
      default: () => [],
    },
    getContainer: {
      type: String,
      default: () => "body",
    },
    showPickerHandle: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    label() {
      return `${this.title}名称`;
    },
    placeholder() {
      return `请输入${this.title}名称`;
    },
    searchPlaceholder() {
      return `请输入${this.title}名称`;
    }
  },

  data() {
    return {
      showPicker: false,
      searchValue: "",
      selectedCompany: null,
      companyName: this.value,
      page: 1,
      pageSize: 10,
      loading: false,
      finished: false,
      debounceTimer: null,
    };
  },

  watch: {
    value(newVal) {
      this.companyName = newVal;
    },
  },

  methods: {
    // 打开选择器
    openPicker() {
      this.showPicker = true;
      this.searchValue = "";
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.$emit("search", this.searchValue);
    },

    // 搜索企业
    onSearch(value) {
      this.searchValue = value;
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.$emit("search", value);
    },

    // 处理滚动加载
    handleScroll(e) {
      const scrollEl = e.target;
      if (!scrollEl) return;

      const { scrollHeight, scrollTop, clientHeight } = scrollEl;
      console.log(
        "scrollHeight:",
        scrollHeight,
        "scrollTop:",
        scrollTop,
        "clientHeight:",
        clientHeight
      );
      // 距离底部20px时触发加载
      if (
        scrollHeight - scrollTop - clientHeight < 20 &&
        !this.loading &&
        !this.finished
      ) {
        console.log("触发加载更多");
        this.loadMore();
      }
    },

    // 加载更多数据
    loadMore() {
      if (this.loading || this.finished) return;

      this.loading = true;

      // 防抖处理
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        this.$emit("load-more", {
          page: this.page + 1,
          pageSize: this.pageSize,
          searchValue: this.searchValue,
        });
        this.page += 1;
      }, 300);
    },

    // 更新加载状态
    updateLoadingState(hasMore) {
      this.loading = false;
      this.finished = !hasMore;
    },

    // 选择企业
    selectCompany(company) {
      this.selectedCompany = company;
      this.companyName = company.nsrmc;
      this.$emit("input", company.nsrmc);
      this.$emit("select", company);
      this.showPicker = false;
    },

    // 取消选择
    onCancel() {
      this.showPicker = false;
      this.$emit("cancel");
    },

    // 确认选择
    onConfirm() {
      if (this.selectedCompany) {
        this.companyName = this.selectedCompany.nsrmc;
        this.$emit("input", this.selectedCompany.nsrmc);
        this.$emit("select", this.selectedCompany);
      }
      this.showPicker = false;
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.company-select {
  &.company-select-wrapper {
    width: 100%;
  }

  /deep/ .van-cell {
    display: flex;
    flex-direction: column;
    padding: 0;

    &::after {
      left: 0;
      display: none;
    }

    &::before {
      left: 0;
    }

    .van-field__label {
      position: absolute;
      color: rgba(17, 31, 44, 1);
      font-size: 1rem;
      font-weight: 500;
    }

    &.van-cell--required {
      .van-field__label {
        margin-left: 0.5rem !important;
      }
    }

    .van-field__value {
      margin-top: 2.25rem;
      flex-shrink: 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background: rgba(248, 249, 250, 1);
    }
  }
}

// 使用更具体的选择器来隔离弹出层样式
.van-popup {
  .company-picker {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    .picker-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: #fff;
      border-bottom: 1px solid #ebedf0;

      .title {
        font-weight: 500;
        font-size: 16px;
        margin: auto;
      }

      .cancel,
      .confirm {
        color: #1989fa;
        font-size: 14px;
        padding: 0 16px;
      }
    }

    .van-search {
      flex-shrink: 0;
      padding: 8px 16px;

      .van-cell {
        display: inline-block;
        background-color: #f7f8fa;
        border-radius: 4px;
        display: flex;
      }

      .van-field__value {
        margin-top: 0;
      }
    }

    .company-list {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      position: relative;
      height: 0; // 这是关键，确保flex布局下滚动正常

      .van-cell-group {
        background-color: transparent;
        padding: 0 16px;
      }

      .van-cell {
        padding: 12px 0;
        margin: 0;
        border-bottom: 1px solid #ebedf0;
        background-color: transparent;

        &.active {
          background-color: #f2f8ff;
          color: #1989fa;
        }

        &:active {
          background-color: #f8f8f8;
        }
      }

      .loading-more,
      .no-more {
        text-align: center;
        padding: 12px 16px;
        color: #969799;
        font-size: 14px;
      }
    }
  }
}
</style> 