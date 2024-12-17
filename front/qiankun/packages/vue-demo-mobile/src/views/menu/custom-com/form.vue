<template>
  <div v-if="!widget.options.hidden" class="common-component-container px-10px flex flex-col" :class="{
    'is-disabled': widget.options.disabled
  }">
    <div class="nav flex-row flex-between h-48px pt-12px pb-12px flex-row-center">
      <div class="w-60px" @click="jumpRoute()">
        <van-icon name="arrow-left" />返回
      </div>
      <div>{{ type === 'page' ? '派工管理' : '派工申请' }}</div>
      <div v-if="type !== 'page'" class="w-60px" />
      <div v-else class="w-60px flex-row" style="justify-content: end;">
        <!-- <i class="el-icon-bell"></i> -->
      </div>
    </div>
    <div v-if="type === 'page'">
      <van-collapse v-model="activeNames" class="collapse">
        <!--<van-collapse-item title="我发起的" name="1">      </van-collapse-item> -->

        <div id="list" class="list h-full">
          <div v-for="val in list" :key="val.id" class="flex-row flex-between item" @click="jumpRoute(val.status, val)">
            <div class="left-item flex-column flex-row" style="flex-direction:column">
              <span>派工单号：{{ val.dispCode }}</span>
              <span>工程名称：{{ val.name }}</span>
            </div>
            <div class="right-item flex-column flex-row">
              <div class="status mr-20px">
                {{ val.status }}
              </div>
              <van-icon class="flex-col-center" name="arrow" />
            </div>
          </div>
        </div>
      </van-collapse>
      <div class="flex-row flex-center mt-20px w-full">
        <van-button v-if="access.builder" round type="primary" class="w-200px" @click="jumpRoute('add')">
          发起派工
        </van-button>
      </div>
    </div>
    <div v-else class="form">
      <div class="wrap">
        <div v-if="type === 'edit' || type === 'detail'" class="header">
          <div class="form-title">
            派工单号
          </div>
          <div class="flex-row flex-center h-32px">
            {{ formData.dispCode }}
          </div>
        </div>
        <div class="form-title">
          基本信息
        </div>
        <van-cell-group>
          <van-form ref="form" style="padding:0">
            <div v-for="(val, index) in renderList" :key="val.prop">
              <van-field v-show="showItem[index]" v-if="val.render === 'field'" v-model="formData[val.prop]" :rules="val.rule" :readonly="disabled[index]" :label="val.label" :placeholder="val.placeholder ? val.placeholder : `请输入${val.label}`" />
              <van-field v-show="showItem[index]" v-if="val.render.includes('picker')" :rules="val.rule" :readonly="true" clickable :label="val.label" :value="val?.fieldProp ?
                val?.fieldProp.includes('.') ?
                  formData[val.fieldProp.split('.')[0]][val.fieldProp.split('.')[1]]
                  : formData[val.fieldProp]
                : formData[val.prop]?.text" :placeholder="val.placeholder ? val.placeholder : `请输入${val.label}`" @click="!disabled[index] && pickerClick(val, index)" />
              <!-- !disabled[index]&& -->
              <van-popup v-show="showItem[index]" v-if="val.render === 'picker'" v-model="showPicker[index]" round position="bottom">
                <van-picker :ref="`item${index}`" :title="val.pickerTitle" show-toolbar :columns="val.pickerColumns" value-key="name" @cancel="pickerCancel(index)" @confirm="value => val.onConfirm(val, index, value)">
                  <template #option="option">
                    <div class="flex-row w-full flex-center">
                      <div class="pl-20px pr-20px">
                        {{ option.name }}
                      </div>
                    </div>
                  </template>
                </van-picker>
              </van-popup>
              <van-popup v-show="showItem[index]" v-if="val.render === 'picker-search'" v-model="showPicker[index]" round position="bottom">
                <!-- 每个元素的两侧间隔相等 -->
                <van-row class="popup-header" type="flex" justify="space-between">
                  <van-col span="4" class="flex-row flex-center van-picker__cancel" @click="pickerCancel(index)">
                    取消
                  </van-col>
                  <van-col span="12" class="flex-row flex-center van-picker__title">
                    {{ val.pickerTitle }}
                  </van-col>
                  <van-col span="4" class="flex-row flex-center van-picker__confirm" @click="val.onConfirm(val, index)">
                    确定
                  </van-col>
                </van-row>
                <van-search v-model="formData[val.searchProp]" placeholder="请输入搜索关键词" @search="search(val, index)" @blur="search(val, index)" @clear="searchClear(val, index)" />
                <van-picker :ref="`picker${index}`" :title="val.pickerTitle" :show-toolbar="false" :columns="val.pickerColumns" @change="val.changePicker(val, index)">
                  <template #option="option">
                    <div class="flex-row w-full">
                      <div class="pl-20px pr-20px">
                        {{ option.name }}
                      </div>
                    </div>
                  </template>
                </van-picker>
              </van-popup>
              <van-popup v-show="showItem[index]" v-if="val.render === 'picker-split-search'" v-model="showPicker[index]" round position="bottom">
                <!-- 每个元素的两侧间隔相等 -->
                <van-row class="popup-header" type="flex" justify="space-between">
                  <van-col span="4" class="flex-row flex-center van-picker__cancel" @click="pickerCancel(index)">
                    取消
                  </van-col>
                  <van-col span="12" class="flex-row flex-center van-picker__title">
                    {{ val.pickerTitle }}
                  </van-col>
                  <van-col span="4" class="flex-row flex-center van-picker__confirm" @click="val.onConfirm(val, index)">
                    确定
                  </van-col>
                </van-row>
                <van-search v-model="formData[val.searchProp]" placeholder="请输入搜索关键词" @blur="search(val, index)" @clear="searchClear(val, index)" />
                <van-picker :ref="`picker${index}`" :title="val.pickerTitle" :show-toolbar="false" :columns="val.pickerColumns" @change="val.changePicker(val, index)">
                  <template #option="option">
                    <div class="flex-row w-full picker-split-item">
                      <div style="word-wrap: break-word;">
                        {{ option.pickerCode }}
                      </div>
                      <div :class="[option.pickerName.length < 13 ? 'flex-col-center' : '']">
                        {{ option.pickerName }}
                      </div>
                    </div>
                  </template>
                </van-picker>
              </van-popup>
              <van-popup v-show="showItem[index]" v-if="val.render === 'picker-tree'" v-model="showPicker[index]" round position="bottom">
                <van-row class="popup-header" type="flex" justify="space-between">
                  <van-col span="4" class="flex-row flex-center" @click="pickerCancel(index)">
                    取消
                  </van-col>
                  <van-col span="12" class="flex-row flex-center">
                    {{ val.pickerTitle }}
                  </van-col>
                  <van-col span="4" class="flex-row flex-center" @click="val.onConfirm(val, index)">
                    确定
                  </van-col>
                </van-row>
                <div style="height:60vh" class="pl-20px pr-20px">
                  <el-input v-model="formData[val.searchProp]" placeholder="输入关键字进行过滤" @input="(e) => val.filterChange(val, index, e)" />
                  <el-tree :ref="`tree${index}`" class="filter-tree" :data="val.pickerColumns" :props="val.treeProps" default-expand-all :filter-node-method="val.filterNode" node-key="code" :show-checkbox="type !== 'detail' ? true : false" @check-change="val.handleCheckChange(val, index)" />
                </div>
              </van-popup>
              <van-popup v-show="showItem[index]" v-if="val.render.includes('picker-time')" v-model="showPicker[index]" round position="bottom">
                <div style="height:60vh" class="pl-20px pr-20px">
                  <van-datetime-picker :ref="`time${index}`" v-model="formData[val.prop]" type="datetime" title="选择完整时间" :min-date="minDate" :max-date="maxDate" :formatter="util().formatter" @confirm="val.onConfirm(val, index)" @cancel="pickerCancel(index)" />
                </div>
              </van-popup>
            </div>
          </van-form>
        </van-cell-group>
      </div>
      <div v-if="type !== 'detail'" class="flex-row flex-center mt-20px w-full">
        <van-button v-if="type == 'add' && access.builder" round type="primary" class="w-200px" @click="submit">
          提交
        </van-button>
        <van-button v-if="type == 'edit' && access.builder" round type="primary" class="w-200px" @click="submit">
          重新发起派工
        </van-button>
      </div>
    </div>
    <div />
  </div>
</template>

<script>
import _ from 'lodash'
// import { Dialog } from 'vant';
export default {
  name: 'EapUseWorkH5Widget',
  props: {
  },
  data() {
    return {
      activeNames: ['1'],
      showItem: [],
      disabled: [],
      showPicker: [false, false],
      formData: {},
      renderList: [
        {
          label: '工程名称',
          prop: 'dispName',
          render: 'field',
          rule: [{
            required: true,
            mes: '请输入工程名称'
          }]
        }, {
          label: '派工类型',
          prop: 'dispType',
          render: 'picker',
          pickerTitle: '派工类型选择',
          pickerColumns: [],
          rule: [{
            required: true,
            mes: '请选择派工类型'
          }],
          renderItemConfig: {
            apiType: 'sql'
          },
          init(_, index, handleType) {
            _.setList('sql', '1858350162258313216', {}, index, false, handleType)
          },
          onConfirm: (value, index, type) => {
            this.$set(this.showPicker, index, false)
            if (type.code === this.formData.dispType.code) return
            const data = this.$refs[`item${index}`][0].getValues()[0]
            this.$set(this.formData, value.prop, data)
            this.util().resetData(this.formData, ['useId', 'dispName', 'dispPlace', 'dispBudget'])
            value.link(data)
          },
          link: (data) => {
            console.log(data, data.name === '零星派工', 123123, data)
            if (data.name === '零星派工') {
              this.$set(this.showItem, 13, false)
              this.$set(this.showItem, 14, true)
              this.$set(this.showItem, 3, false)
              console.log(this.showItem, 111)
              this.$set(this.formData, 'dispWorkload', '')
              this.$set(this.formData, 'dispPlace', '')
            } else {
              this.$set(this.showItem, 13, true)
              this.$set(this.showItem, 14, false)
              this.$set(this.showItem, 3, true)
              this.$set(this.formData, 'dispWorks', '')
            }
          }
        }, {
          label: '用工单号',
          prop: 'useId',
          fieldProp: 'useId.pickerCode',
          searchProp: 'useIdSearch',
          render: 'picker-split-search',
          pickerTitle: '用工单号选择',
          pickerColumns: [],
          rule: [{
            required: true,
            mes: '请选择用工单号'
          }],
          renderItemConfig: {
            apiType: 'api',
            requestConfig: {
              pagination: {
                pageSize: 10,
                pageNum: 1
              }
            },
            isPagination: true
          },
          init(_, index, handleType) {
            console.log(_, index)
            const type = _.formData.dispType.code === '1844266716514926592' ? '1836201039182839808' : '1836201070912782336'
            _.setList('api', '1863476955621539840', { ..._.renderItemConfig[index].requestConfig, key: _.formData.useIdSearch, type }, index, true, handleType)
          },
          onConfirm: (value, index) => {
            const data = this.$refs[`picker${index}`][0].getValues()[0]
            this.$set(this.formData, value.prop, data)
            this.$set(this.formData, 'dispPlace', data.place)
            this.$set(this.formData, 'dispBudget', data.estimatedCost)
            this.$set(this.formData, 'dispName', data.name)
            this.$set(this.formData, value.prop, data)
            this.$set(this.showPicker, index, false)
          },
          changePicker: (value, index) => {
            this.pickerScrollBottom(value, index, 'api')
          }
        }, {
          label: '施工区域',
          prop: 'dispPlace',
          render: 'field'
        }, {
          label: '预估费用（元）',
          prop: 'dispBudget',
          render: 'field'
        }, {
          label: '合同号',
          prop: 'contractId',
          fieldProp: 'contractId.pickerCode',
          searchProp: 'contractIdSearch',
          render: 'picker-split-search',
          pickerTitle: '合同号选择',
          pickerColumns: [],
          rule: [{
            required: true,
            mes: '请选择合同号'
          }],
          renderItemConfig: {
            apiType: 'api',
            requestConfig: {
              pagination: {
                pageSize: 10,
                pageNum: 1
              }
            },
            isPagination: true
          },
          async init(_, index, handleType) {
            console.log('init', _, index, _.renderList[index].pickerColumns)
            _.setList('api', '1861952433864982528', { ..._.renderItemConfig[index].requestConfig, key: _.formData.contractIdSearch }, index, true, handleType)
          },
          onConfirm: (value, index) => {
            const data = this.$refs[`picker${index}`][0].getValues()[0]
            this.$set(this.formData, value.prop, data)
            this.$set(this.formData, 'supperName', data.name)
            this.$set(this.showPicker, index, false)
          },
          changePicker: (value, index) => {
            this.pickerScrollBottom(value, index, 'api')
          }
        }, {
          label: '现场负责人',
          prop: 'dispPerson',
          render: 'field'
        }, {
          label: '现场负责人电话',
          prop: 'dispPersonPhone',
          render: 'field'
        }, {
          label: '施工单位',
          prop: 'supperName',
          render: 'field'
        }, {
          label: '施工负责人及电话',
          prop: 'dispSupplierPerson',
          render: 'field'
        }, {
          label: '开单时间',
          prop: 'dispCreationTime1',
          fieldProp: 'dispCreationTime',
          render: 'picker-time-all',
          pickerTitle: '开单时间选择',
          placeholder: '自动填充',
          disabled: true,
          // rule: [{
          // required:true,
          // mes:'请选择开单时间'
          // }],
          init(_, index, handleType) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          onConfirm: (value, index) => {
            const formatDate = this.util().formatDate
            this.$set(this.formData, value.fieldProp, formatDate(this.formData[value.prop]))
            this.$set(this.showPicker, index, false)
          }
        }, {
          label: '计划开工时间',
          prop: 'dispStartTime1',
          fieldProp: 'dispStartTime',
          render: 'picker-time-all',
          pickerTitle: '计划开工时间选择',
          rule: [{
            required: true,
            mes: '请选择计划开工时间'
          }],
          init(_, index, handleType) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          onConfirm: (value, index) => {
            // const data = this.$refs[`time${index}`][0].getValues()[0]
            // console.log(data)
            // this.$set(this.formData,value.prop,data)
            const formatDate = this.util().formatDate
            console.log(value, index, this.formData[value.prop], formatDate)
            this.$set(this.formData, value.fieldProp, formatDate(this.formData[value.prop]))
            this.$set(this.showPicker, index, false)
          }
        }, {
          label: '计划竣工时间',
          prop: 'dispEndTime1',
          fieldProp: 'dispEndTime',
          render: 'picker-time-all',
          pickerTitle: '计划竣工时间选择',
          rule: [{
            required: true,
            mes: '请选择计划竣工时间'
          }, {
            validator: val => {
              return this.util().compareTime(this.formData.dispStartTime1, this.formData.dispEndTime1)
            },
            message: '竣工时间需大于开工时间'
          }],
          init(_, index, handleType) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          onConfirm: (value, index) => {
            // const data = this.$refs[`time${index}`][0].getValues()[0]
            // console.log(data)
            // this.$set(this.formData,value.prop,data)
            const formatDate = this.util().formatDate
            console.log(value, index, this.formData[value.prop], formatDate)
            this.$set(this.formData, value.fieldProp, formatDate(this.formData[value.prop]))
            this.$set(this.showPicker, index, false)
          }
        }, {
          label: '预估工程量',
          prop: 'dispWorkload',
          render: 'field'
        }, {
          label: '具体做法',
          prop: 'dispWorks',
          render: 'field'
        }
      ],
      // validatorList: [],
      type: 'page',
      list: [],
      statusList: {},
      detailId: '', // 详情id
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      renderItemConfig: {},
      access: {
        builder: true// 施工单位人员权限控制，隐藏新增、删除、编辑、打印按钮
      }
    }
  },
  created() {
    // Vue.component('treeselect', VueTreeselect.Treeselect)
    // 初始化注册事件
    this.initEventHandler()
    // 注册到 widgetRefList 中
    this.registerToRefList()
    // 执行组件绑定的 onCreated 事件
    this.handleOnCreated()
  },
  async mounted() {
    this.initData()
    // 执行组件绑定的 onMounted 事件
    this.handleOnMounted()
    this.watchBack()
    this.watchBottom()
    if (this.type === 'page') {
      this.getUserWork()
      this.getStatus()
    }
    this.accessHandle()
  },
  beforeDestroy() {
    // 移除当前表单在 widgetRefList 的注册
    this.unregisterFromRefList()
  },
  methods: {
    util() {
      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份是从0开始的
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
      function resetData(data, field) {
        Object.keys(data).forEach(val => {
          if (!field.includes(val)) return
          if (Object.prototype.toString.call(data.val) === '[object object]') {
            data[val] = {}
          } else {
            data[val] = ''
          }
        })
      }
      function formatter(type, val) {
        if (type === 'year') {
          return `${val}年`
        } else if (type === 'month') {
          return `${val}月`
        } else if (type === 'day') {
          return `${val}日`
        }
        return val
      }
      function compareTime(before, after) {
        const time1 = new Date(before)
        const time2 = new Date(after)
        return time1.getTime() < time2.getTime()
      }
      return { formatDate, resetData, formatter, compareTime }
    },
    initData() {
      console.log('enter customComponent:', '欢迎使用自定义组件～')
    },
    handleClick(e) {
      // 执行组件绑定的 onClick 事件
      this.handleOnWidgetClickEvent(e)
    },
    handleShowNotify() {
      this.$notify.success('可以使用内置提示函数和其他内置方法')
    },
    watchBack() {
      window.addEventListener('popstate', (e) => {
        console.log('popstate', this.type, e)
        if (this.type == 'page') {
          this.type = 'page'
        }
      }, false)// false阻止默认事件
    },
    watchBottom() {
      function isScrollAtBottom(container) {
        return container.scrollHeight - container.scrollTop - container.clientHeight < 10
      }
      // 假设你有一个具有id="container"的容器
      const container = document.querySelector('#list')
      console.log(container, 'container')
      container.addEventListener('scroll', _.debounce(() => {
        console.log(isScrollAtBottom(container))
        if (isScrollAtBottom(container)) {
          console.log('scroll：滚动到底部了！')
          // 在这里执行你需要的操作
          // this.pagination.pageSize = this.pagination.pageSize + 10 ;
          this.getUserWork()
        }
      }, 200))
      container.addEventListener('touchmove', _.debounce(
        () => {
          console.log(isScrollAtBottom(container))
          if (isScrollAtBottom(container)) {
            console.log('touchmove：滚动到底部了！')
            // 在这里执行你需要的操作
            // this.pagination.pageSize = this.pagination.pageSize + 10 ;
            this.getUserWork()
          }
        }
        , 200))
    },
    // 解决单一页面路由切换
    jumpRoute(type, item) {
      const route = this.$route
      console.log('jumpRoute', type, item, this.type)
      if (type === 'page') {
        this.$router.back()
      } else if (type === 'add') {
        this.$router.push({
          path: route.path,
          query: { type },
          params: { params: item, type }
        })
      } else if (type === '未提交' || type === '拒绝') {
        this.$router.push({
          query: { type },
          path: route.path,
          params: { params: item, type }
        })
      } else if (type === '审批中' || type === '同意') {
        this.$router.push({
          query: { type },
          path: route.path,
          params: { params: item, type }
        })
      } else if (type === 'subList') {
        this.$router.push({
          query: { type },
          path: route.path,
          params: { type }
        })
        this.getSubList()
      }
      if (!type && (this.type === 'detail' || this.type === 'add' || this.type === 'edit')) {
        // 跳转到列表页
        this.jump('page', item)
      } if (!type && (this.type === 'page')) {
        // 跳转到列表页
        this.$router.back()
      } else if (this.type === 'subList') {
        this.jump('detail', item)
      } else {
        this.jump(type, item)
      }
    },
    async jump(type, item) {
      item && console.log(item.status, item)
      if (item && item.permissionFlag === 2) { // 2仅仅查看
        this.detailId = item.id
        this.type = 'detail'
        await this.getDetail()
        await this.initRender()
        return
      }
      if (type === 'page') {
        this.type = 'page'
        this.$nextTick(() => { this.watchBottom() })
      } else if (type === 'add') {
        this.type = 'add'
        await this.initRender()
      } else if (type === '未提交' || type === '拒绝') {
        this.detailId = item.id
        this.type = 'edit'
        await this.getDetail()
        await this.initRender()
      } else if (type === '审批中' || type === '同意') {
        console.log(item)
        this.detailId = item.id
        this.type = 'detail'
        console.log(item)
        await this.getDetail()
        console.log(item)
        await this.initRender()
      }
      console.log(this.type, type)
    },
    initRender() {
      const type = this.type
      this.renderList.forEach(async (val, index) => {
        this.showItem[index] = true
        this.disabled[index] = !!(type === 'detail' || val.disabled)
        // this.validatorList.push(val.validator)
      })
      if (type === 'add') {
        this.formData = {}
        this.formData.dispType = {
          code: '1844266716514926592',
          text: '检修派工',
          name: '检修派工',
          pickerName: '检修派工'
        }
        this.formData.useId = ''
        this.formData.contractId = ''
        this.formData.dispCreationTime = ''
        this.formData.dispCreationTime1 = ''
        console.log(this.$eapCookieInfo('EapUserInfo'), 'this.$eapCookieInfo')
        const EapUserInfo = JSON.parse(this.$eapCookieInfo('EapUserInfo'))
      } else if (type === 'edit') {
        this.disabled[2] = true // 编辑时派工类型不可切换
      }
      this.disabled[8] = true // 施工单位不可修改
      this.renderList.forEach(async (val, index) => {
        val.link && await val.link(this.formData[val.prop])
        this.renderItemConfig[index] = val.renderItemConfig
          ? {
            requestConfig: val.renderItemConfig.requestConfig
          }
          : {}
      })
      console.log('initRender', type, this.formData, this.disabled)
    },
    accessHandle() {
      const EapUserInfo = JSON.parse(this.$eapCookieInfo('EapUserInfo'))
      console.log(EapUserInfo, 1)
      this.runApi('1865933941604794368', { userId: EapUserInfo.id }).then(res => {
        if (res.data.data) {
          console.log(res, 223)
          this.access.builder = false
        } else {
          this.access.builder = true
        }
      })
    },
    // 获取检修列表
    async getUserWork(type) {
      // if (type === 'init') {
      //   this.pagination.pageNum = 1
      //   const res = await this.runSql('1850752128867520512', { pageSize: this.pagination.pageSize, pageNum: 0 })
      //   this.list = res.data.records
      //   this.pagination.pageNum++
      // } else {
      //   const res = await this.runSql('1850752128867520512', { pageSize: this.pagination.pageSize, pageNum: (this.pagination.pageNum - 1) * this.pagination.pageSize })
      //   this.list.push(...res.data.records)
      //   this.pagination.pageNum++
      // }
    },
    // 获取审批状态
    async getStatus() {

    },
    // 获取派工详情
    async getDetail() {
      // console.log(123123)
      // this.formData = {}
      // const res = await this.runSql('1851175619005661184', { id: this.detailId })
      // this.formData = res.data.records[0]

      // const configList = [
      //   { prop: 'dispType', code: 'dispType', name: 'type' },
      //   { prop: 'useId', code: 'code', name: 'code', id: 'useId' },
      //   { prop: 'contractId', code: 'contractNo', name: 'contractNo', id: 'contractId' }
      // ]
      // configList.forEach(val => {
      //   this.formData[val.prop] = {
      //     text: res.data.records[0][val.name],
      //     id: res.data.records[0][val.id],
      //     code: res.data.records[0][val.code],
      //     name: res.data.records[0][val.name],
      //     pickerCode: res.data.records[0][val.code] || res.data.records[0][val.id],
      //     pickerName: res.data.records[0][val.name]
      //   }
      // })
      // this.formData.dispCreationTime1 = this.formData.dispCreationTime
      // this.formData.dispStartTime1 = this.formData.dispStartTime
      // this.formData.dispEndTime1 = this.formData.dispEndTime
      // console.log(this.formData)
    },
    async setList(type, api, params, index, isSplit, handleType) {
      let res = null
      let typeList = []
      if (type === 'sql') {
        // res = await this.runSql(api, params)
        res = []
      } else {
        // res = await this.runApi(api, params)
        res = []
      }
      let defaultIndex = 0// 默认定位
      const prop = this.renderList[index].prop
      const render = this.renderList[index].render
      const data = res.data.records || res.data.data
      const requestConfig = this.renderItemConfig[index].requestConfig || null
      const renderIndex = index
      const renderItemConfig = this.renderItemConfig[renderIndex]

      data.forEach((val, index) => {
        typeList[index] = {
          ...val,
          code: val.id || val.code,
          text: val.name || '',
          name: val.name,
          pickerCode: val.code || 'code',
          pickerName: val.name || 'name'
        }
      })
      console.log(11, data, this.renderItemConfig[index].defaultPickerIndex)
      if (!this.renderItemConfig[renderIndex].defaultPickerIndex) { // 进入picker
        console.log(this.renderList[index].pickerColumns.length, 1212)
        if (!this.renderList[index].pickerColumns.length) { // pickerColumns没有值
          if (this.renderList[index].apiType === 'api') {
            typeList.forEach((val, index) => {
              if (this.formData[prop].code === (val.id || val.code)) {
                defaultIndex = index
              }
            })
          }
          if (render.includes('picker-')) {
            this.$set(this.renderList[index], 'pickerColumns', [{ values: typeList, defaultIndex }])
            this.$set(this.renderList[index], 'initPickerColumns', [{ values: typeList }])
          } else {
            this.$set(this.renderList[index], 'pickerColumns', typeList)
          }
        } else { // pickerColumns有值
          console.log(this.renderList[index].apiType, this.renderList[index].pickerColumns, 22224)
          if (this.renderList[index].renderItemConfig.apiType === 'api') {
            this.renderList[index].pickerColumns[0].values.forEach((val, index) => {
              console.log(this.formData[prop].id, val.code, val.id)
              if (this.formData[prop].id === val.id) {
                defaultIndex = index
              }
            })
          }
          this.renderList[index].pickerColumns[0].defaultIndex = defaultIndex
        }
      } else { // 滚动picker
        defaultIndex = this.renderItemConfig[renderIndex].defaultPickerIndex
        typeList = [...this.renderList[index].pickerColumns[0].values, ...typeList]
        if (this.renderList[index].apiType === 'api') {
          typeList.forEach((val, index) => {
            if (this.formData[prop].code === (val.id || val.code)) {
              defaultIndex = index
            }
          })
        }
        if (render.includes('picker-')) {
          console.log(22, typeList, defaultIndex)
          // this.$set(this.renderList[index],'pickerColumns',[{values:typeList}])
          this.renderList[index].pickerColumns = [{ values: typeList, defaultIndex }]
          // this.$set(this.renderList[index],'initPickerColumns',[{values:typeList}])
        } else {
          this.$set(this.renderList[index], 'pickerColumns', typeList)
        }
      }
    },
    // picker搜索
    search(value, index) {
      this.renderItemConfig[index].requestConfig.pagination.pageNum = 1
      value.init(this, index)
    },
    searchClear(value, index) {
    },
    pickerCancel(index) {
      console.log('pickerCancel', index)
      const renderItem = this.renderList[index]
      const apiType = renderItem.renderItemConfig.apiType
      this.$set(this.showPicker, index, false)
      if (apiType === 'api') {
        const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
        const pagination = this.renderItemConfig[index].requestConfig.pagination
        const total = pagination.pageSize * pagination.pageNum
        console.log(pagination, curIndex, total)
        if (curIndex === total - 1) {
          pagination.pageNum = pagination.pageNum + 1
          this.renderItemConfig[index].defaultPickerIndex = curIndex
        }
      } else {
        const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
        const pagination = this.renderItemConfig[index].requestConfig.pagination
        const total = pagination.pageSize * pagination.pageNum
        if (curIndex === total - 1) {
          this.renderItemConfig[index].requestConfig.pagination.pageSize = total + pagination.pageSize
          this.renderItemConfig[index].defaultPickerIndex = curIndex
        }
      }
    },
    async pickerClick(value, index) {
      console.log(value, index, 11, this.formData)
      if (this.renderItemConfig[index].defaultPickerIndex) {
        this.renderItemConfig[index].defaultPickerIndex = 0
      }
      if (value.render.includes('picker-time-') && this.formData[value.prop]) {
        this.$set(this.formData, value.prop, new Date(this.formData[value.fieldProp]))
      }
      value.init && await value.init(this, index, 'isEnter')
      this.$set(this.showPicker, index, true)
    },
    pickerScrollBottom(value, index, type) {
      // value.init();
      if (type === 'api') {
        const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
        const pagination = this.renderItemConfig[index].requestConfig.pagination
        const total = pagination.pageSize * pagination.pageNum
        console.log(pagination, curIndex, total)
        if (curIndex === total - 1) {
          pagination.pageNum = pagination.pageNum + 1
          this.renderItemConfig[index].defaultPickerIndex = curIndex
          value.init(this, index)
        }
        console.log(this.$refs[`picker${index}`][0].getIndexes())
      } else {
        const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
        const pagination = this.renderItemConfig[index].requestConfig.pagination
        const total = pagination.pageSize * pagination.pageNum
        console.log(curIndex, total)
        if (curIndex === total - 1) {
          this.renderItemConfig[index].requestConfig.pagination.pageSize = total + pagination.pageSize
          this.renderItemConfig[index].defaultPickerIndex = curIndex
          value.init(this, index)
        }
        console.log(this.$refs[`picker${index}`][0].getIndexes())
      }
    },
    setSubList(subList) {
      console.log('subList', subList, this.formData.oldSubList)
      const callback = (data, list) => {
        data.forEach(val => {
          list.push(val)
          if (val.subList) {
            callback(val.subList, list)
          }
        })
      }
      const oldList = []
      const newList = []
      let newAddList = []
      callback(_.cloneDeep(subList), newList)
      if (this.type === 'add') {
        newAddList = subList.map(val => { delete val.subList; return val })
      } else {
        callback(_.cloneDeep(this.formData.oldSubList), oldList)
        console.log(oldList, newList, newAddList)
        newList.forEach(val1 => {
          if (!oldList.some(val => { return val.code === val1.code })) {
            val1.id = ''
            newAddList.push(val1)
          } else {
            newAddList.push(val1)
          }
        })
        // subList.forEach(val=>{
        // delete val.subList
        // if(!val.isOld){val.id=''}
        // })
        newAddList = newAddList.filter((item, index) => {
          delete item.subList
          return newAddList.findIndex(item1 => item1.code == item.code) == index
        })
      }
      return newAddList
    },
    // 提交
    async submit() {
      console.log(this.formData, this.$route, this.$refs.form)
      try {
        const status = await this.$refs.form.validate()
        console.log('submit', status)
      } catch (e) {
        throw (e)
      }
      const data = _.cloneDeep(this.formData)
      Object.keys(data).forEach(val => {
        console.log(val)
        if (data[val] && typeof data[val] === 'object' && !Array.isArray(data[val])) {
          console.log(data[val], val)
          data[val] = data[val].id || data[val].code
        }
      })
      if (data.dispType === '1844266869661548544') {
        // 零星
        data.dispAssign = ''
        data.dispPlace = ''
      }
      // const res = !data.id ? await this.runApi('1846352029743759360', data) : await this.runApi('1846351757223051264', data)
      // console.log(res)
      // if (res.data.code === 200) {
      //   this.detailId = ''
      //   console.log(123, res, res.data.data, data)
      //   console.log(this.directStartProcess)
      //   const id = !data.id ? res.data.data.id : data.id
      //   if (!data.id) { data.id = res.data.data.id }
      //   console.log('id', id)
      //   console.log({
      //     processDefinitionId: 'Process_1729651131196:2:1848924869286359040',
      //     processDefinitionKey: 'Process_1729651131196',
      //     procVars: { id },
      //     pageId: this.$route.params.pageId,
      //     // 参数会直接传递至该流程实例中，后续可用于表单数据回显
      //     condition: { id }
      //   })
      //   const closeForm = () => {
      //     this.jumpRoute('page')
      //     this.$eapNote.success({
      //       title: '提示',
      //       message: '提交成功'
      //     })
      //     this.$nextTick(() => {
      //       this.getUserWork('init')
      //     })
      //   }
      //   const submitProcess = async () => {
      //     let res1
      //     if (data.dispType === '1844266716514926592') { // 检修
      //       res1 = await this.directStartProcess({
      //         processDefinitionId: 'Process_1729577380236:4:1848636549893386240',
      //         processDefinitionKey: 'Process_1729577380236',
      //         condition: { id: data.id, dispBudget: data.dispBudget }
      //       })
      //     } else {
      //       res1 = await this.directStartProcess({
      //         processDefinitionId: 'Process_1729578886289:4:1848636877632106496',
      //         processDefinitionKey: 'Process_1729578886289',
      //         condition: { id: data.id }
      //       })
      //     }
      //     if (res1) {
      //       closeForm()
      //     }
      //   }
      //   if (!res.data.data.flag) {
      //     const beforeClose = (action, done) => {
      //       if (action === 'confirm') {
      //         done()
      //         submitProcess()
      //       } else {
      //         done()
      //         closeForm()
      //       }
      //     }
      //     this.$eapH5Dialog.confirm({
      //       title: '',
      //       message: '所选合同的施工单位名称与系统组织机构的供应商名称不一致，是否继续启动审批流程，如果继续启动审批流程，施工单位将不会收到派工通知，或者联系系统管理员，修改系统组织机构的供应商名称，再重新启动审批流程。',
      //       beforeClose
      //     })
      //   } else {
      //     submitProcess()
      //   }
      //   return
      //   const processData = {
      //     processDefinitionId: 'Process_1729577380236:4:1848636549893386240',
      //     processDefinitionKey: 'Process_1729577380236',
      //     procVars: { id },
      //     pageId: this.$route.params.pageId,
      //     // 参数会直接传递至该流程实例中，后续可用于表单数据回显
      //     condition: { ...data, id },
      //     needVars: false
      //   }
      //   console.log(processData)
      //   const res1 = await this.directStartProcess(processData)
      //   if (res1) {
      //     this.jumpRoute('page')
      //     this.$eapNote.success({
      //       title: '提示',
      //       message: '提交成功'
      //     })
      //     this.$nextTick(() => {
      //       this.getUserWork('init')
      //     })
      //   }
      // }
    }
  }
}
</script>

<style lang="scss" scoped></style>
