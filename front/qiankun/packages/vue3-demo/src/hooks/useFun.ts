import type { ElMessage, MessageParams } from 'element-plus';
import _ from 'lodash-es';
// 定义 config 的类型
type MessageConfig = MessageParams;
export default function useFun() {
  return {
    setResetField: (data, resetFields) => {
      for (const key in resetFields) {
        if (_.isArray(data[resetFields[key]])) {
          data[resetFields[key]] = [];
        } else {
          data[resetFields[key]] = null;
        }
      }
    },
    isArray: data => _.isArray(data),
    cloneDeep: data => _.cloneDeep(data),
  };
}
