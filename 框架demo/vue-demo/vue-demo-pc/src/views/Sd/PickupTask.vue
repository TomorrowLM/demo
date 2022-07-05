<template>
  <div>
    <div class="task-search">
      <a-form layout="inline">
        <a-form-item
          label="合同编号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          labelAlign="left"
        >
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item
          label="进厂车次"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item
          label="车号/集装箱号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          labelAlign="left"
        >
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item
          label="物料名称"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item
          label="进厂时间"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-date-picker
            show-time
            placeholder="请输入"
            @change="onChange"
            @ok="onOk"
          />
        </a-form-item>
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
          <a-button type="primary"> Submit </a-button>
        </a-form-item>
      </a-form>
      <div class="line"></div>
      <div class="table">
        <p>每日接车任务：计划接车 70，已接车 3</p>
        <a-table :columns="columns" :data-source="data">
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class PickupTask extends Vue {
  formLayout = "inline";
  columns = [
    {
      title: "序号",
      dataIndex: "name",
      key: "name",
      scopedSlots: { customRender: "name" },
    },
    {
      title: "接车任务号",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "进厂车次",
      dataIndex: "address",
      key: "address 1",
      ellipsis: true,
    },
    {
      title: "发车时间",
      dataIndex: "address1",
      key: "address 2",
      ellipsis: true,
    },
    {
      title: "预计进厂时间",
      dataIndex: "address2",
      key: "address 3",
      ellipsis: true,
    },
    {
      title: "实际进厂时间",
      dataIndex: "address3",
      key: "address 4",
      ellipsis: true,
    },
  ];

  data = [
    {
      key: "1",
      name: "JC74587",
      age: "JC74587",
      address: "46017",
      address2: "2020/11/05 14:00",
      address3: "2020/11/05 14:00",
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
}
</script>

<style lang="scss">
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
