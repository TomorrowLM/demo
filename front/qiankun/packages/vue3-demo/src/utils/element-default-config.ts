
import {
  ElTable,
  ElTableColumn,
  ElTooltip,
  ElDatePicker,
  ElDialog,
  ElTimePicker
} from 'element-plus';
import { CaretBottom, Calendar } from '@element-plus/icons-vue';
// 获取组件的props
const TableProps = ElTable.props;
const TableColumnProps = ElTableColumn.props;
const TooltipProps = ElTooltip.props;
const DatePickerProps = ElDatePicker.props;
const DialogProps = ElDialog.props;
const TimePickerProps = ElTimePicker.props;
// 修改默认props
// 全局el-table设置
TableProps.border = { type: Boolean, default: true }; // 边框线
TableProps.tooltipEffect = { type: String, default: 'light' }; // 边框线
TooltipProps.effect = { type: String, default: 'light' }; // 边框线
// 全局el-table-column设置
// TableColumnProps.align = { type: String, default: 'center' }; // 居中
TableColumnProps.showOverflowTooltip = { type: Boolean, default: true }; // 文本溢出
DatePickerProps.prefixIcon = { default: Calendar }; // 文本溢出
DatePickerProps.rangeSeparator = { default: '-' }; // 文本溢出
// DatePickerProps.defaultTime = { type: Boolean, default: [new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)] };
DialogProps.alignCenter = { type: Boolean, default: true };
// 全局 el-time-picker 设置
// TimePickerProps.prefixIcon = { default: CaretBottom }; // 后缀图标
console.log(ElTimePicker.props,'ElTimePicker.props');
// import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// // app.component('CaretBottom', CaretBottom);
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }