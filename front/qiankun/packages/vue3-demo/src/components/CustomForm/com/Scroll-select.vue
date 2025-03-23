<template>
  <div class="w-100">
    <el-select
      v-model="selected"
      popper-class="custom-dropdown"
      @visible-change="handleVisibleChange"
      @change="handleChange"
      :disabled="props.config?.disabled || false"
    >
      <el-option
        v-for="item in props.config?.options || []"
        :key="item[labelProp]"
        :label="item[labelProp]"
        :value="item[valueProp]"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { isArray } from 'lodash';
import {
  PropType,
  reactive,
  toRefs,
  ref,
  watch,
  nextTick,
  onMounted
} from 'vue';
const props = defineProps<{
  config: any;
  // query: any;
  // queryParams: any;
  bindData: any;
  // optionProp: any;
}>();
const emit = defineEmits(['update:bindData']);
const state = reactive<any>({
  selected: null,
  allOptions: [], // 存储所有选项的数据源
  isLoading: false // 加载状态标志
});

const { selected, allOptions, isLoading } = toRefs(state);
const { bindData } = toRefs(props);
bindData.value = 1;
const pagination = ref({
  current: 1,
  size: 10
});
const formData = ref({});
watch(
  selected,
  () => {
    if (bindData.value) {
      bindData.value = selected.value;
    }
  },
  {
    immediate: true,
    deep: true
  }
);
const labelProp = ref(props.config?.optionProp?.label || 'label');
const valueProp = ref(props.config?.optionProp?.value || 'value');
onMounted(() => {
  selected.value = bindData.value;
  // 有init不需要加载数据
  !props.config?.init && loadOptions();
});
const loadMoreOptions = async (queryParams: any) => {
  if (queryParams) {
    formData.value = queryParams;
  }
  isLoading.value = true;
  // 模拟异步加载数据，实际应用中应该是从服务器获取数据
  const { data } = await props.config.fetch({
    ...pagination.value,
    ...formData.value
  });
  props.config.isRender = true;
  console.log(data, 1123, props.config.isRender, props.config.optionProp.label);
  if (pagination.value.current === 1) {
    props.config.options = isArray(data) ? data : data.records; // 添加到数据源数组中
  } else {
    props.config.options.push(...(isArray(data) ? data : data.records)); // 添加到数据源数组中
  }
  isLoading.value = false;
};

const loadOptions = (queryParams?: any) => {
  pagination.value.current = 1;
  pagination.value.size = 10;
  formData.value = queryParams;
  loadMoreOptions(queryParams);
};

const handleScroll = event => {
  const target = event.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
    // 判断是否滚动到底部
    loadMoreOptions(); // 加载更多选项
  }
};
const handleVisibleChange = visible => {
  if (visible) {
    // 下拉菜单显示时，添加滚动监听事件
    nextTick(() => {
      // 确保DOM已更新后再添加监听器
      const dropdown = document.querySelector(
        '.custom-dropdown'
      ) as HTMLElement; // 获取自定义下拉菜单元素
      dropdown.addEventListener('scroll', handleScroll); // 添加滚动事件监听器
    });
  } else {
    // 下拉菜单隐藏时，移除滚动监听事件
    const dropdown = document.querySelector('.custom-dropdown') as HTMLElement; // 获取自定义下拉菜单元素
    dropdown.removeEventListener('scroll', handleScroll); // 移除滚动事件监听器
  }
};
const handleChange = value => {
  console.log(value, 11);
  const data = props.config.options.find(item => {
    return item[valueProp.value] === value;
  });
  if (props.config?.link?.change) {
    props.config?.link?.change({ changeItem: data });
  }

  emit('update:bindData', data);
};
defineExpose({
  loadOptions
});
</script>

<style lang="scss" scoped>
.custom-dropdown {
  max-height: 200px; /* 根据需要调整 */
  overflow-y: auto;
}
</style>
