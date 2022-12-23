<template>
  <div>
    <div class="task-search">
      <a-form layout="inline">
        <a-form-item label="合同编号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" labelAlign="left">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="进厂车次" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="车号/集装箱号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" labelAlign="left">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="流向号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" labelAlign="left">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="执行状态 ：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" labelAlign="left">
          <a-select default-value="123" style="width: 120px">
            <a-select-option value="123"> 全部 </a-select-option>
            <a-select-option value="2"> 待接车 </a-select-option>
            <a-select-option value="Yimi2nghe"> 执行中 </a-select-option>
            <a-select-option value="lucy"> 已完成 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="接车任务号" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="物料名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="进厂时间" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-date-picker show-time placeholder="请输入" @change="onChange" @ok="onOk" />
        </a-form-item>
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
          <a-button type="primary"> Submit </a-button>
        </a-form-item>
      </a-form>
      <div class="line"></div>
      <div class="table">
        <div class="order">
          <p>每日接车任务：计划接车 70，已接车 3</p>
          <p>
            <span>排序：</span>
            <a-select style="width: 120px">
              <a-select-option value="123">
                预计进场时间早->晚
              </a-select-option>
              <a-select-option value="2"> 预计进场时间晚->早 </a-select-option>
              <a-select-option value="Yimi2nghe">
                进场时间早->晚
              </a-select-option>
              <a-select-option value="lucy"> 进场时间晚->早 </a-select-option>
            </a-select>
          </p>
        </div>
        <a-table :scroll="{ x: 1300 }" :columns="columns" :data-source="data" :expandIconColumnIndex="-1" :expandIconAsCell="false"
          :rowKey="(record) => record.key" :expandedRowKeys="curExpandedRowKeys">
          <a slot="action" slot-scope="record" @click="handleExpand(record.key)">
            展开详情
          </a>
          <a-table size="small" slot="expandedRowRender" :slot-scope="record" :columns="innerColumns" :data-source="innerData" :pagination="false">
            <!-- <span slot="status" slot-scope="record">
              <a-badge status="success" />Finished
            </span> -->
            <!-- <span slot="operation" slot-scope="record" class="table-operation">
              <a>Pause</a>
              <a>Stop</a>
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item> Action 1 </a-menu-item>
                  <a-menu-item> Action 2 </a-menu-item>
                </a-menu>
                <a> More <a-icon type="down" /> </a>
              </a-dropdown>
            </span> -->
          </a-table>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const innerColumns = [
  { title: "序号", dataIndex: "address", key: "address" },
  {
    title: "接车任务号",
    dataIndex: "address0",
    key: "address0",
  },
  {
    title: "进厂车次",
    dataIndex: "address1",
    key: "address1",
  },
  {
    title: "发车时间",
    dataIndex: "address2",
    key: "address2",
  },
  {
    title: "预计进厂时间",
    dataIndex: "address3",
    key: "address3",
  },
  {
    title: "实际进厂时间",
    dataIndex: "address4",
    key: "address4",
  },
  {
    title: "到达股道",
    dataIndex: "address5",
    key: "address5",
  },
  {
    title: "总重量（吨）",
    dataIndex: "address6",
    key: "address6",
  },
  {
    title: "班别/班次",
    dataIndex: "address7",
    key: "address7",
  },
  {
    title: "重车数",
    dataIndex: "address8",
    key: "address8",
  },
  {
    title: "空车数",
    dataIndex: "address9",
    key: "address9",
  },
  {
    title: "接车开始时间",
    dataIndex: "address10",
    key: "address10",
  },
  {
    title: "接车结束时间",
    dataIndex: "address11",
    key: "address11",
  },
  {
    title: "执行状态",
    dataIndex: "address12",
    key: "address12",
    // fixed: "right",
  },
  {
    title: "接车作业进度(1/40)",
    dataIndex: "status",
    key: "status",
    // fixed: "right",
    scopedSlots: { customRender: "action" },
  },
];

let innerData: {
  key: number;
  address: string;
  address0: string;
  address1: string;
  address2: string;
  address3: string;
  address12: string;
  status: string;
}[] = [];
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    address: "1",
    address0: "JC74587",
    address1: "46017",
    address2: "2020/11/05 14:00",
    address3: "2020/11/05 14:00",
    address12: "",
    status: "已接车",
  });
}
@Component
export default class PickupTask extends Vue {
  formLayout = "inline";
  innerColumns = innerColumns;
  innerData = innerData;
  curExpandedRowKeys = []; //点击哪行展开数组(数组里只会存在一个值,具体逻辑在methods的点击事件里.)!!!
  selectedRowKeys = []; //列表项是否可选择数组
  columns = [
    {
      title: "序号",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "接车任务号",
      dataIndex: "address0",
      key: "address0",
    },
    {
      title: "进厂车次",
      dataIndex: "address1",
      key: "address1",
    },
    {
      title: "发车时间",
      dataIndex: "address2",
      key: "address2",
    },
    {
      title: "预计进厂时间",
      dataIndex: "address3",
      key: "address3",
    },
    {
      title: "实际进厂时间",
      dataIndex: "address4",
      key: "address4",
    },
    {
      title: "到达股道",
      dataIndex: "address5",
      key: "address5",
    },
    {
      title: "总重量（吨）",
      dataIndex: "address6",
      key: "address6",
    },
    {
      title: "班别/班次",
      dataIndex: "address7",
      key: "address7",
    },
    {
      title: "重车数",
      dataIndex: "address8",
      key: "address8",
    },
    {
      title: "空车数",
      dataIndex: "address9",
      key: "address9",
    },
    {
      title: "接车开始时间",
      dataIndex: "address10",
      key: "address10",
    },
    {
      title: "接车结束时间",
      dataIndex: "address11",
      key: "address11",
    },
    {
      title: "执行状态",
      dataIndex: "address12",
      key: "address12",
      // fixed: "right",
    },
    {
      title: "作业信息",
      dataIndex: "",
      key: "address13",
      // fixed: "right",
      scopedSlots: { customRender: "action" },
    },
  ];

  data = [
    {
      key: "1",
      address: "1",
      address0: "JC74587",
      address1: "46017",
      address2: "2020/11/05 14:00",
      address3: "2020/11/05 14:00",
      address12: "接车中",
      address13: "详情展开",
    },
    {
      key: "2",
      address: "1",
      address0: "JC74587",
      address1: "46017",
      address2: "2020/11/05 14:00",
      address3: "2020/11/05 14:00",
      address12: "接车中",
      address13: "详情展开",
    },
  ];

  formItemLayout() {
    const { formLayout } = this;

    return formLayout === "inline"
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : {};
  }

  buttonItemLayout() {
    const { formLayout } = this;

    return formLayout === "horizontal"
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : {};
  }

  handleFormLayoutChange(e: any) {
    this.formLayout = e.target.value;
  }

  onOk(value: any) {
    console.log("onOk: ", value);
  }

  onChange(value: any, dateString: string) {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  }

  handleExpand(rowkey: never) {
    console.log(123, rowkey);
    if (this.curExpandedRowKeys.length > 0) {
      let index = this.curExpandedRowKeys.indexOf(rowkey);
      if (index > -1) {
        this.curExpandedRowKeys.splice(index, 1);
      } else {
        this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length);
        this.curExpandedRowKeys.push(rowkey);
      }
    } else {
      this.curExpandedRowKeys.push(rowkey);
    }
  }

  onSelectChange(selectedRowKeys: any) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }
}
</script>

<style lang="scss">
.order {
  display: flex;
  justify-content: space-between;
}
.task-search {
  text-align: left;
}
.ant-form {
  display: flex;
  flex-wrap: wrap;
}
.line {
  margin: 16px 0;
  border-bottom: 2px solid #ccc;
}
</style>
