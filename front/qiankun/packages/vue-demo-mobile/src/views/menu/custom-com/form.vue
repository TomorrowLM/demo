<template>
  <div
    class="common-component-container px-10px flex flex-col"
  >
    <div
      class="form"
    >
      <div class="wrap">
        <van-cell-group>
          <van-form
            ref="form"
            style="padding:0"
          >
            <div
              v-for="(val, index) in renderList"
              :key="val.prop"
            >
              <van-field
                v-show="showItem[index]"
                v-if="val.render === 'field'"
                v-model="formData[val.prop]"
                :rules="val.rule"
                :readonly="disabled[index]"
                :label="val.label"
                :placeholder="val.placeholder ? val.placeholder : `请输入${val.label}`"
                @blur="$forceUpdate()"
              />
              <van-field
                v-show="showItem[index]"
                v-if="val.render.includes('picker')"
                :rules="val.rule"
                :readonly="true"
                clickable
                :label="val.label"
                :value="formData[`${val.prop}Model`]"
                :placeholder="val.placeholder ? val.placeholder : `请输入${val.label}`"
                @click="!disabled[index] && pickerClick(val, index)"
              />
              <van-popup
                v-show="showItem[index]"
                v-if="val.render.includes('picker')"
                v-model="showPicker[index]"
                round
                position="bottom"
              >
                <!-- 每个元素的两侧间隔相等 -->
                <van-row
                  class="popup-header"
                  type="flex"
                  justify="space-between"
                >
                  <van-col
                    span="4"
                    class="flex-row flex-center van-picker__cancel"
                    @click="pickerCancel(index)"
                  >
                    取消
                  </van-col>
                  <van-col
                    span="12"
                    class="flex-row flex-center van-picker__title"
                  >
                    {{ val.pickerTitle }}
                  </van-col>
                  <van-col
                    span="4"
                    class="flex-row flex-center van-picker__confirm"
                    @click="val.onConfirm(val, index)"
                  >
                    确定
                  </van-col>
                </van-row>
                <van-search
                  v-model="formData[val.searchProp]"
                  placeholder="请输入搜索关键词"
                  @search="search(val, index)"
                  @blur="search(val, index)"
                  @clear="searchClear(val, index)"
                />
                <div v-if="val.render === 'picker-tree'">
                  <el-tree
                    :ref="`tree${index}`"
                    class="filter-tree"
                    :data="val.pickerColumns"
                    :props="val.treeProps?val.treeProps:treeProps"
                    default-expand-all
                    :filter-node-method="val.filterNode"
                    node-key="id"
                    :show-checkbox="type !== 'detail' ? true : false"
                  />
                  <!-- @check-change="val.handleCheckChange(val, index)" -->
                </div>
                <van-picker
                  v-else
                  :ref="`picker${index}`"
                  :title="val.pickerTitle"
                  :show-toolbar="false"
                  :columns="val.pickerColumns"
                  @change="pickerChange(val, index)"
                >
                  <template #option="option">
                    <div
                      v-if="val.render.includes('split')"
                      class="flex-row w-full picker-split-item"
                    >
                      <div style="word-wrap: break-word;">
                        {{ option.pickerCode }}
                      </div>
                      <div :class="[option.name.length < 13 ? 'flex-col-center' : '']">
                        {{ option.name }}
                      </div>
                    </div>

                    <div
                      v-else
                      class="flex-row w-full"
                    >
                      <div class="pl-20px pr-20px">
                        {{ option.name }}
                      </div>
                    </div>
                  </template>
                </van-picker>
              </van-popup>

              <van-popup
                v-show="showItem[index]"
                v-if="val.render.includes('picker-time')"
                v-model="showPicker[index]"
                round
                position="bottom"
              >
                <div
                  style="height:60vh"
                  class="pl-20px pr-20px"
                >
                  <van-datetime-picker
                    :ref="`time${index}`"
                    v-model="formData[val.prop]"
                    type="datetime"
                    title="选择完整时间"
                    :formatter="util().formatter"
                    @confirm="val.onConfirm(val, index)"
                    @cancel="pickerCancel(index)"
                  />
                </div>
              </van-popup>
            </div>
          </van-form>
        </van-cell-group>
      </div>
      <div
        class="flex-row flex-center mt-20px w-full"
      >
        <van-button
          round
          type="primary"
          class="w-200px"
          @click="submit"
        >
          提交
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// // import { Dialog } from 'vant';
import { getList } from '@/api'
export default {
  name: 'CusForm',
  props: {
  },
  data () {
    return {
      activeNames: ['1'],
      showItem: [],
      disabled: [],
      showPicker: [false, false],
      formData: {},
      treeProps: {
        children: 'children', 
        label: 'name'
      },
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
          init (_, index) {
            _.setList({ api: '/common/typeList', data: {} }, index);
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
            // this.util().resetData(this.formData, ['useId', 'dispName', 'dispPlace', 'dispBudget'])
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
          searchProp: 'useIdSearch',
          render: 'picker-split-search',
          pickerTitle: '用工单号选择',
          pickerColumns: [],
          rule: [{
            required: true,
            mes: '请选择用工单号'
          }],
          renderItemConfig: {
            requestConfig: {
              pagination: {
                pageSize: 10,
                pageNum: 1
              }
            }
          },
          init (_, index) {
            console.log(_, index)
            _.setList({ api: '/common/list', data: { ..._.renderItemConfig[index].requestConfig, key: _.formData.useIdSearch } }, index)
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
          }
        }, {
          label: '组织',
          prop: 'orgId',
          render: 'picker-tree',
          searchProp: 'orgIdSearch',
          fieldPropFormat: (value, index, data) => {
            let str = ''
            data.forEach(val => {
              str = `${str + val.name},`
            })
            return str
          },
          init (_, index) {
            _.setTreeList({ api: '/common/treeList', data: { key: _.formData[`${this.prop}Search`] } }, index)
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
          }
        },
        {
          label: '施工区域',
          prop: 'dispPlace',
          render: 'field'
        }, {
          label: '预估费用（元）',
          prop: 'dispBudget',
          render: 'field'
        },
        {
          label: '合同号',
          prop: 'contractId',
          searchProp: 'contractIdSearch',
          render: 'picker-split-search',
          pickerTitle: '合同号选择',
          pickerColumns: [],
          rule: [{
            required: true,
            mes: '请选择合同号'
          }],
          renderItemConfig: {
            requestConfig: {
              pagination: {
                pageSize: 10,
                pageNum: 1
              }
            }
          },
          async init (_, index) {
            _.setList({ api: '/common/list', data: { ..._.renderItemConfig[index].requestConfig, key: _.formData.contractIdSearch } }, index)
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
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
          prop: 'dispCreationTime',
          render: 'picker-time-all',
          pickerTitle: '开单时间选择',
          placeholder: '自动填充',
          disabled: true,
          rule: [{
            required: true,
            mes: '请选择开单时间'
          }],
          init (_, index) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          fieldPropFormat: (value, index, data) => {
            const formatDate = this.util().formatDate
            return formatDate(this.formData[value.prop])
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
          }
        }, {
          label: '计划开工时间',
          prop: 'dispStartTime',
          render: 'picker-time-all',
          pickerTitle: '计划开工时间选择',
          rule: [{
            required: true,
            mes: '请选择计划开工时间'
          }],
          init (_, index) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          fieldPropFormat: (value, index, data) => {
            const formatDate = this.util().formatDate
            return formatDate(this.formData[value.prop])
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
          }
        }, {
          label: '计划竣工时间',
          prop: 'dispEndTime1',
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
          init (_, index) {
            if (!_.formData[this.prop]) {
              _.formData[this.prop] = new Date()
            }
          },
          fieldPropFormat: (value, index, data) => {
            const formatDate = this.util().formatDate
            return formatDate(this.formData[value.prop])
          },
          onConfirm: (value, index) => {
            this.pickerComfirm(value, index)
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
  watch: {
    formData () {
      console.log(this.formData,123)
    }
  },
  created () {
  },
  async mounted () {
    this.initRender()
  },
  beforeDestroy () {
  },
  methods: {
    util () {
      function formatDate (date) {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份是从0开始的
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
      function resetData (data, field) {
        Object.keys(data).forEach(val => {
          if (!field.includes(val)) return
          if (Object.prototype.toString.call(data.val) === '[object object]') {
            data[val] = {}
          } else {
            data[val] = ''
          }
        })
      }
      function formatter (type, val) {
        if (type === 'year') {
          return `${val}年`
        } else if (type === 'month') {
          return `${val}月`
        } else if (type === 'day') {
          return `${val}日`
        }
        return val
      }
      function compareTime (before, after) {
        const time1 = new Date(before)
        const time2 = new Date(after)
        return time1.getTime() < time2.getTime()
      }
      return { formatDate, resetData, formatter, compareTime }
    },
    initData () {
      this.renderList.forEach(async (val, index) => {
        this.showItem[index] = true
        if (val.render === 'field') {
          this.formData[val.prop] = ''
        } else if (val.render.includes('picker')) {
          this.formData[val.prop] = {
            pickerCode: '',
            name: '',
            id: ''
          }
          this.formData[`${val.prop}Model`] = ''
          this.formData[`${val.prop}Search`] = ''
        } else if (val.render.includes('time')) {
          this.formData[val.prop] = ''
          this.formData[`${val.prop}Model`] = ''
        }
      })
    },
    initRender () {
      this.initData()
      this.renderList.forEach(async (val, index) => {
        val.link && await val.link(this.formData[val.prop])
        this.renderItemConfig[index] = val.renderItemConfig
          ? {
              requestConfig: val.renderItemConfig.requestConfig
            }
          : {}
      })
      console.log('initRender', this.formData, this.disabled)
    },
    fieldPropFormat (val) {
      return val.name
    },
    async setTreeList (httpData, renderIndex) {
      const { data } = await getList(httpData)
      console.log(data)
      // this.renderList[renderIndex].pickerColumns = data;
      this.$set(this.renderList[renderIndex], 'pickerColumns', data)
    },
    async setList (httpData, renderIndex) {
      console.log(httpData, renderIndex)
      const renderItem = this.renderList[renderIndex]
      let typeList = []
      let defaultIndex = 0// 默认定位
      const prop = renderItem.prop
      const render = renderItem.render
      const { data } = await getList(httpData)
      console.log(data, 111, this.renderItemConfig[renderIndex].defaultPickerIndex)

      data.forEach((val, index) => {
        typeList[index] = {
          id: val.id,
          pickerCode: val.code,
          name: val.name
        }
      })
      // console.log(data, typeList)
      // this.$set(this.renderList[renderIndex], 'pickerColumns', [{ values: typeList, defaultIndex }])

      if (!this.renderItemConfig[renderIndex].defaultPickerIndex) { // 进入picker
        if (!this.renderList[renderIndex].pickerColumns.length) { // pickerColumns没有值
          typeList.forEach((val, index) => {
            if (this.formData[prop].id === val.id) {
              defaultIndex = index
            }
          })
          this.$set(this.renderList[renderIndex], 'pickerColumns', [{ values: typeList, defaultIndex }])
        } else { // pickerColumns有值
          console.log(this.renderList[renderIndex].pickerColumns, 22224)
          this.renderList[renderIndex].pickerColumns[0].values.forEach((val, index) => {
            console.log(this.formData[prop].id, val.code, val.id)
            if (this.formData[prop].id === val.id) {
              defaultIndex = index
            }
          })
          this.renderList[renderIndex].pickerColumns[0].defaultIndex = defaultIndex
        }
      } else { // 滚动picker
        defaultIndex = this.renderItemConfig[renderIndex].defaultPickerIndex
        typeList = [...this.renderList[renderIndex].pickerColumns[0].values, ...typeList]
        typeList.forEach((val, index) => {
          if (this.formData[prop].id === (val.id || val.code)) {
            defaultIndex = index
          }
        })
        this.$set(this.renderList[renderIndex], 'pickerColumns', [{ values: typeList, defaultIndex }])
      }
    },
    // picker搜索
    search (value, index) {
      this.renderItemConfig[index].requestConfig.pagination.pageNum = 1
      value.init(this, index)
    },
    searchClear (value, index) {
    },
    pickerChange (val, index) {
      if (val.changePicker)val.changePicker(val, index)
      this.pickerScrollBottom(val, index)
    },
    pickerComfirm (value, index) {
      let data
      if (value.render.includes('time')) {
        data = this.formData[value.prop]
      } else if (value.render.includes('picker-tree')) {
        data = this.$refs[`tree${index}`][0].getCheckedNodes()
        console.log(data, 3333)
        this.$set(this.formData, value.prop, data)
      } else if (value.render.includes('picker')) {
        data = this.$refs[`picker${index}`][0].getValues()[0]
      }
      // const ref = value.render.includes('time') ? `time${index}` :value.render.includes('picker-time')?`tree${index}`: `picker${index}`
      // console.log(value, index, ref)
      // const data = value.render.includes('time') ? this.formData[value.prop] : this.$refs[ref][0].getValues()[0]
      // this.$set(this.formData, value.prop, data)
      this.$set(this.formData, `${value.prop}Model`, value.fieldPropFormat ? value.fieldPropFormat(value, index, data) : this.fieldPropFormat(data))
      console.log(this.formData)
      value.link && value.link(data)
      this.$set(this.showPicker, index, false)
    },

    pickerCancel (index) {
      console.log('pickerCancel', index)
      const renderItem = this.renderList[index]
      this.$set(this.showPicker, index, false)
      const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
      const pagination = this.renderItemConfig[index].requestConfig.pagination
      const total = pagination.pageSize * pagination.pageNum
      if (curIndex === total - 1) {
        this.renderItemConfig[index].requestConfig.pagination.pageSize = total + pagination.pageSize
        this.renderItemConfig[index].defaultPickerIndex = curIndex
      }
      // if (apiType === 'api') {
      //   const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
      //   const pagination = this.renderItemConfig[index].requestConfig.pagination
      //   const total = pagination.pageSize * pagination.pageNum
      //   console.log(pagination, curIndex, total)
      //   if (curIndex === total - 1) {
      //     pagination.pageNum = pagination.pageNum + 1
      //     this.renderItemConfig[index].defaultPickerIndex = curIndex
      //   }
      // } else {
      //   const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
      //   const pagination = this.renderItemConfig[index].requestConfig.pagination
      //   const total = pagination.pageSize * pagination.pageNum
      //   if (curIndex === total - 1) {
      //     this.renderItemConfig[index].requestConfig.pagination.pageSize = total + pagination.pageSize
      //     this.renderItemConfig[index].defaultPickerIndex = curIndex
      //   }
      // }
    },
    async pickerClick (value, index) {
      console.log(value, index, 11, this.formData)
      if (this.renderItemConfig[index].defaultPickerIndex) {
        this.renderItemConfig[index].defaultPickerIndex = 0
      }
      if (value.render.includes('picker-time-') && this.formData[value.prop]) {
        this.$set(this.formData, value.prop, new Date(this.formData[value.fieldProp]))
      }
      value.init && await value.init(this, index)
      this.$set(this.showPicker, index, true)
    },
    pickerScrollBottom (value, index) {
      // value.init();
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
      // if (type === 'api') {
      //   const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
      //   const pagination = this.renderItemConfig[index].requestConfig.pagination
      //   const total = pagination.pageSize * pagination.pageNum
      //   console.log(pagination, curIndex, total)
      //   if (curIndex === total - 1) {
      //     pagination.pageNum = pagination.pageNum + 1
      //     this.renderItemConfig[index].defaultPickerIndex = curIndex
      //     value.init(this, index)
      //   }
      //   console.log(this.$refs[`picker${index}`][0].getIndexes())
      // } else {
      //   const curIndex = this.$refs[`picker${index}`][0].getIndexes()[0]
      //   const pagination = this.renderItemConfig[index].requestConfig.pagination
      //   const total = pagination.pageSize * pagination.pageNum
      //   console.log(curIndex, total)
      //   if (curIndex === total - 1) {
      //     this.renderItemConfig[index].requestConfig.pagination.pageSize = total + pagination.pageSize
      //     this.renderItemConfig[index].defaultPickerIndex = curIndex
      //     value.init(this, index)
      //   }
      //   console.log(this.$refs[`picker${index}`][0].getIndexes())
      // }
    },
    // 提交
    async submit () {
      console.log(this.formData, this.$route, this.$refs.form)
      try {
        const status = await this.$refs.form.validate()
        console.log('submit', status)
      } catch (e) {
        throw (e)
      }
      // const data = $.lodash.cloneDeep(this.formData)
      Object.keys(data).forEach(val => {
        console.log(val)
        if (data[val] && typeof data[val] === 'object' && !Array.isArray(data[val])) {
          console.log(data[val], val)
          data[val] = data[val].id
        }
      })
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

<style lang="scss" scoped>
.popup-header{
  padding: 0.2rem 0;
}
</style>
