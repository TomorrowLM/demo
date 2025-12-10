<style type='text/scss' lang="scss">
@import "../../../assets/styles/checkbox_v2";
@import "../views/xxts/scss/xxts-new";

.multiple-tree-menu {
  height: 100%;
  flex: 1;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f6f6f6;
  &.single {
    padding-top: 16px;
  }
  .tree-head-box {
    margin-bottom: 16px;
    padding: 0 16px;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    .box {
      height: 56px;
      display: flex;
      align-items: center;
      overflow: scroll;
      font-size: 17px;
    }
    p {
      display: flex;
      align-items: center;
      white-space: nowrap;
      color: #7a7d81;
      &:first-child i {
        display: none;
      }
      &:not(:last-child) {
        color: #3296fa;
      }
    }
    i {
      width: 15px;
      height: 15px;
      margin-right: 7px;
      background: url(../assets/images/icon_arrow_right@2x.png) no-repeat;
      background-size: contain;
    }
  }
  .am-list-item {
    justify-content: space-between;
  }
  .am-checkbox {
    flex-shrink: 0;
  }
  .dt-checkbox {
    padding: 15px 7px;
  }
  .dt-checkbox .checkbox-icon {
    flex-shrink: 0;
    margin-right: 12px;
  }
  .mint-cell-wrapper {
    justify-content: space-between;
  }
  .next {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: #3296fa;
    i {
      height: 32px;
      width: 1px;
      margin-right: 8px;
      border-left: 1px solid #d9d9d9;
    }
    b {
      width: 15px;
      height: 15px;
      background: url(../assets/images/xiaji@2x.png) no-repeat;
      background-size: contain;
    }
    &.gray {
      b {
        background-image: url(../assets/images/xiaji_disable@2x.png);
      }
      span {
        color: #c7e1fb;
      }
    }
  }
  .first-tree-cell {
    margin-top: 16px;
    .mint-cell-wrapper {
      background-image: none;
    }
  }
  .blank {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-30%);
    text-align: center;
    height: 100%;
    img {
      width: 90px;
      height: 90px;
    }
    p {
      margin: 14px 0 8px;
      font-size: 17px;
      color: rgba(25, 31, 37, 1);
    }
    span {
      font-size: 14px;
      color: rgba(180, 181, 182, 1);
    }
  }
}
</style>

<template>
  <div class="multiple-tree-menu" :class="{ single: single }">
    <div class="tree-head-box" v-if="!single">
      <div class="box" id="multiple-tree-menu-head-box">
        <p
          v-for="(item, index) in labelList"
          @click="toForwardFloor(index)"
          :key="index"
        >
          <i></i><span>{{ item }}</span>
        </p>
      </div>
    </div>
    <div class="mint-cell cell-first" v-show="hasAllCheck && !isSingleSelect">
      <div class="mint-cell-wrapper">
        <label class="dt-checkbox checkbox-border" @click="allCheck">
          <input
            type="checkbox"
            class="checkbox-icon"
            :checked="allChecked[nowFloor]"
          />
          <span class="checkbox-name">全选</span>
        </label>
      </div>
    </div>
    <div class="mint-cell" v-for="(item, index) in treeList" :key="index">
      <div class="mint-cell-wrapper">
        <label
          class="dt-checkbox checkbox-border"
          @click="singleCheck(index, item, 1)"
        >
          <input
            type="checkbox"
            class="checkbox-icon"
            :checked="item.checked"
            v-show="hasCheck"
          />
          <span class="checkbox-name">{{ item.label }}</span>
        </label>
        <div
          v-show="item.children"
          class="next"
          :class="item.checked ? 'gray' : ''"
          @click="toNextFloor(item)"
        >
          <i></i><b></b><span>下级</span>
        </div>
      </div>
    </div>
    <div
      class="mint-cell"
      v-for="(item, index) in treeList2"
      :key="index"
      :class="index == 0 ? 'first-tree-cell' : ''"
    >
      <div class="mint-cell-wrapper">
        <label
          class="dt-checkbox checkbox-border"
          @click="singleCheck(index, item, 2)"
        >
          <input
            type="checkbox"
            class="checkbox-icon"
            :checked="item.checked"
          />
          <span class="checkbox-name">{{ item.label }}</span>
        </label>
        <div
          v-show="item.children"
          class="next"
          :class="item.checked ? 'gray' : ''"
          @click="toNextFloor(item)"
        >
          <i></i><b></b><span>下级</span>
        </div>
      </div>
    </div>
    <div class="blank" v-show="!treeList.length && !treeList2.length">
      <img src="../assets/images/blank.png" alt="" />
      <p>暂无数据~</p>
    </div>
    <infinite-loading
      @infinite="loadMoreTreeList2"
      :spinner="spinnerName"
      ref="InfiniteLoading2"
      v-if="state == '6' && nowFloor != 0"
    >
      <span slot="no-results">没有更多数据了</span>
      <span slot="no-more">没有更多数据了</span>
    </infinite-loading>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import { ddAlert, setRight, toast, confirm, uploadImage } from '@package/dingTalk/ddApi/ddApiUtils'
import { mapState } from "vuex";
import infiniteLoading from 'vue-infinite-loading'

export default {
  name: 'dt-multiple-tree',
  components: { MtCell: Cell },
  props: {
    single: Boolean,
    isSingleSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allChecked: [false],
      cacheName: '',
      checkedList: [],
      treeBox: [],
      treeBox2: [],
      treeList: [],
      treeList2: [],
      labelList: [],
      nowFloor: 0,
      hasAllCheck: true,
      hasCheck: true,
      //
      state: 0,
      pageNum: 2
    }
  },
  computed: {
    ...mapState({ messageData: state => state.Public.messageData }),
  },
  methods: {
    init (name, label, state) {
      this.state = state
      this.cacheName = name
      this.labelList[0] = label || '全部'
      this.checkedList = this.messageData[this.cacheName] || []
      console.log(this.checkedList, '<<<<<<<<<<<<<checkedList')
      this.$emit('changeNum', this.checkedList.length)
      if (this.state === 6 || this.state === 7) { this.hasAllCheck = false; this.hasCheck = false }
    },
    dealData (list, state, list2) {
      if (state !== 'search') {
        this.treeList = list;
        if (list2) {
          this.treeList2 = list2;
        }
        this.treeBox[this.nowFloor] = this.treeList;
        this.treeBox2[this.nowFloor] = this.treeList2;
      } else {
        this.checkedList = this.messageData[this.cacheName] || []
      }
      // 判断下是否有已选
      this.dealCheckedItem()
      // 判断是否全选
      if (this.treeList.every(this.isAllCheck) && this.treeList2.every(this.isAllCheck)) this.allChecked[this.nowFloor] = true
      setTimeout(() => {
        document.getElementById('multiple-tree-menu-head-box') && document.getElementById('multiple-tree-menu-head-box').scrollTo({ left: document.getElementById('multiple-tree-menu-head-box').offsetWidth })
      }, 10)
    },
    // 选择下级
    toNextFloor (val) {
      if (val.checked) return
      window.Indicator.open({
        spinnerType: 'fading-circle'
      });
      this.nowFloor++
      this.labelList[this.nowFloor] = val.label
      this.$emit('update', val)
    },
    // 向前选择某级
    toForwardFloor (index) {
      if (index === this.treeBox.length - 1) return
      this.nowFloor = index
      this.treeList = this.treeBox[this.nowFloor]
      this.treeList2 = this.treeBox2[this.nowFloor]
      this.labelList.splice(index + 1)
      this.allChecked.splice(index + 1)
      this.treeBox.splice(index + 1)
      this.dealCheckedItem()


      if (this.state === 6) {
        this.pageNum = 1
        this.$refs.InfiniteLoading2.$emit('$InfiniteLoading:reset');
        this.$emit('updateParams', index)
      }
    },
    // 当前级是否有选中项
    dealCheckedItem () {
      this.treeList.forEach((item) => {
        if (this.checkedList && this.checkedList.length === 0) {
          item.checked = false
        } else {
          this.checkedList.forEach((n) => {
            if (n.value === item.value) {
              item.checked = true
            }
          })
        }
      })
      this.treeList2.forEach((item) => {
        if (this.checkedList && this.checkedList.length === 0) {
          item.checked = false
        } else {
          this.checkedList.forEach((n) => {
            if (n.value === item.value) {
              item.checked = true
            }
          })
        }
      })
    },
    // 判断存储盒内是否不存在并添加(为选中进行筛选)
    judgeNotExitAdd (val) {
      let result = this.checkedList.every(item => {
        return val.value !== item.value
      })
      if (result) this.checkedList.push(val)
    },
    // 判断存储盒内存在并删除(为取消选中进行筛选)
    judgeExitDelete (value) {
      this.checkedList.forEach((item, index) => {
        if (item.value === value) this.checkedList.splice(index, 1)
      })
    },
    // 判断是否全选
    isAllCheck (el) {
      return el.checked
    },
    // 全选
    allCheck () {
      this.allChecked[this.nowFloor] = !this.allChecked[this.nowFloor]
      this.treeList.forEach((item, index) => {
        item.checked = this.allChecked[this.nowFloor]
        this.$set(this.treeList, index, item)
        this.allChecked[this.nowFloor] ? this.judgeNotExitAdd(item) : this.judgeExitDelete(item.value)
      })
      this.treeList2.forEach((item, index) => {
        item.checked = this.allChecked[this.nowFloor]
        this.$set(this.treeList2, index, item)
        this.allChecked[this.nowFloor] ? this.judgeNotExitAdd(item) : this.judgeExitDelete(item.value)
      })
      this.$emit('changeNum', this.checkedList.length)
      this.messageData[this.cacheName] = this.checkedList
    },
    // 单选
    singleCheck (i, val, type) {
      if (type == 1 && !this.hasCheck) {
        return;
      }
      let treeList_ = [];
      type == '2' ? treeList_ = this.treeList2 : treeList_ = this.treeList;
      let obj = treeList_[i]
      
      // 单选模式处理
      if (this.isSingleSelect) {
        // 如果点击的是已选中的项，则取消选择
        if (obj.checked) {
          obj.checked = false;
          this.$set(treeList_, i, obj);
          this.checkedList = [];
          this.$emit('changeNum', this.checkedList.length);
          this.messageData[this.cacheName] = this.checkedList;
          return;
        }
        
        // 清除之前的选择
        this.checkedList.forEach(item => {
          this.treeList.forEach((treeItem, index) => {
            if (treeItem.value === item.value) {
              treeItem.checked = false;
              this.$set(this.treeList, index, treeItem);
            }
          });
          this.treeList2.forEach((treeItem, index) => {
            if (treeItem.value === item.value) {
              treeItem.checked = false;
              this.$set(this.treeList2, index, treeItem);
            }
          });
        });
        this.checkedList = [];
        
        // 设置新的选中项
        obj.checked = true;
        this.$set(treeList_, i, obj);
        this.checkedList.push(val);
        this.$emit('changeNum', this.checkedList.length);
        this.messageData[this.cacheName] = this.checkedList;
        return;
      }

      // 以下是多选模式的原有逻辑
      if (this.state === 6) {
        if (!type) {
          obj.checked = val.checked
          this.$set(treeList_, i, obj)
          return;
        }
        if (this.checkedList.length > 999 && val.checked == false) {
          obj.checked = val.checked
          this.$set(treeList_, i, obj)
          toast('', '最多可选择1000户', 2, 0)
          return;
        }
      }
      obj.checked = !val.checked
      this.$set(treeList_, i, obj)
      if (val.checked) {
        this.judgeNotExitAdd(val)
        if (this.treeList.every(this.isAllCheck) && this.treeList2.every(this.isAllCheck)) this.allChecked[this.nowFloor] = true
      } else {
        this.allChecked[this.nowFloor] = false
        this.judgeExitDelete(val.value)
      }
      this.$emit('changeNum', this.checkedList.length)
      this.messageData[this.cacheName] = this.checkedList
    },
    loadMoreTreeList2 () {
      this.$emit('moreData', this.pageNum++)
    },
    concatTreeList2 (list) {
      if (!list || !list.length) {
        this.$refs.InfiniteLoading2.$emit('$InfiniteLoading:complete');
      } else {
        this.treeList2 = this.treeList2.concat(list);
        this.$refs.InfiniteLoading2.$emit('$InfiniteLoading:loaded');
      }
    },
    resetInfinite () {
      this.pageNum = 2
      this.$refs.InfiniteLoading2.$emit('$InfiniteLoading:reset');
    }
  }
}
</script>
