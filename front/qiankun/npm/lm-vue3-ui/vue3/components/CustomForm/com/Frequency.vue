<template>
  <div>
    <el-radio-group
      v-model="bindData.checkFrequencyType"
      class="radio-checkFrequency d-flex flex-column"
      @change="checkFrequencyChange"
    >
      <el-radio value="1" @click="checkFrequencyRadioClick('1')">
        <span class="w-36px">每日</span>
        <el-time-picker
          v-model="checkFrequencyformData.inspectionTime1"
          placeholder="选择时间范围"
          :teleported="false"
          class="time-picker-suffix w-100px"
          value-format="HH:mm:ss"
          @change="checkFrequencyChange('1')"
        ></el-time-picker>
      </el-radio>
      <el-radio
        value="2"
        @click="checkFrequencyRadioClick('2')"
        class="my-16 mt-24"
      >
        <span class="w-36px">每周</span>
        <el-input-number
          v-model="checkFrequencyformData.checkFrequencyValue2"
          :min="1"
          :max="7"
          controls-position="right"
          size="large"
          @change="checkFrequencyChange('2')"
        />
        <span class="w-36px ml-16"></span>
        <el-time-picker
          v-model="checkFrequencyformData.inspectionTime2"
          placeholder="选择时间范围"
          :teleported="false"
          class="time-picker-suffix w-100px"
          value-format="HH:mm:ss"
          @change="checkFrequencyChange('2')"
        ></el-time-picker>
      </el-radio>
      <el-radio value="3" @click="checkFrequencyRadioClick('3')" class="my-16">
        <span class="w-36px">每月</span>
        <el-select
          v-model="checkFrequencyformData.checkFrequencyValue3"
          multiple
          class="w-100px"
          @change="checkFrequencyChange('3')"
        >
          <el-option
            v-for="item in dayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="w-36px ml-16">号</span>
        <el-time-picker
          v-model="checkFrequencyformData.inspectionTime3"
          placeholder="选择时间范围"
          :teleported="false"
          class="time-picker-suffix"
          value-format="HH:mm:ss"
          @change="checkFrequencyChange('3')"
        ></el-time-picker>
      </el-radio>
      <el-radio value="4" @click="checkFrequencyRadioClick('4')" class="my-16">
        <span class="w-36px">第</span>
        <el-select
          v-model="checkFrequencyformData.checkFrequencyValue4"
          multiple
          class="w-100px"
          @change="checkFrequencyChange('4')"
        >
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <span class="w-36px ml-16">月</span>
        <el-input-number
          v-model="checkFrequencyformData.checkFrequencyDay4"
          :min="1"
          :max="31"
          controls-position="right"
          size="large"
          @change="checkFrequencyChange('4')"
        ></el-input-number>
        <span class="w-36px ml-16">号</span>
        <el-time-picker
          v-model="checkFrequencyformData.inspectionTime4"
          placeholder="选择时间范围"
          :teleported="false"
          class="time-picker-suffix"
          value-format="HH:mm:ss"
          @change="checkFrequencyChange('4')"
        ></el-time-picker>
      </el-radio>
      <el-radio value="5" @click="checkFrequencyRadioClick('5')" class="my-16">
        <span class="">单次定向发布 当日：</span>

        <el-time-picker
          v-model="checkFrequencyformData.inspectionTime5"
          placeholder="选择时间范围"
          :teleported="false"
          class="time-picker-suffix"
          value-format="HH:mm:ss"
          @change="checkFrequencyChange('5')"
        ></el-time-picker>
      </el-radio>
    </el-radio-group>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  bindData: any;
}>();
const { bindData }: any = toRefs(props);
const dayOptions = computed(() => {
  const options: { label: number; value: number }[] = [];
  for (let i = 1; i <= 31; i++) {
    options.push({
      label: i,
      value: i
    });
  }
  return options;
});
const monthOptions = computed(() => {
  const options: { label: number; value: number }[] = [];
  for (let i = 1; i <= 12; i++) {
    options.push({
      label: i,
      value: i
    });
  }
  return options;
});
const checkFrequencyformData = ref<any>({
  inspectionTime1: '', //检查时间
  inspectionTime2: '',
  inspectionTime3: '',
  inspectionTime4: '',
  inspectionTime5: '',
  checkFrequencyValue2: null, //检查频率数值
  checkFrequencyValue3: [], //检查频率数值
  checkFrequencyValue4: [], //检查频率数值
  checkFrequencyDay4: '' //检查几号
});
const checkFrequencyChange = val => {
  const property = Object.keys(checkFrequencyformData.value);
  //置空
  property.forEach(key => {
    if (!key.includes(val)) {
      checkFrequencyformData.value[key] = null;
    }
  });
  bindData.value.checkFrequencyType = val + '';
};
const checkFrequencyRadioClick = val => {
  console.log(val, checkFrequencyformData.value);
  const property = Object.keys(checkFrequencyformData.value);
  //置空
  property.forEach(key => {
    if (!key.includes(val)) {
      checkFrequencyformData.value[key] = null;
    }
  });
  bindData.value.checkFrequencyType = val + '';
};
// 频率参数转换
const setCheckFrequencyData = () => {
  console.log('setCheckFrequencyData');
  const checkFrequencyType = bindData.value.checkFrequencyType;
  if (checkFrequencyType === '1') {
    bindData.value.inspectionTime =
      checkFrequencyformData.value.inspectionTime1;
  } else if (checkFrequencyType === '2') {
    bindData.value.inspectionTime =
      checkFrequencyformData.value.inspectionTime2;
    bindData.value.checkFrequencyValue =
      checkFrequencyformData.value.checkFrequencyValue2;
  } else if (checkFrequencyType === '3') {
    bindData.value.inspectionTime =
      checkFrequencyformData.value.inspectionTime3;
    bindData.value.checkFrequencyValue =
      checkFrequencyformData.value.checkFrequencyValue3.join(',');
  } else if (checkFrequencyType === '4') {
    bindData.value.inspectionTime =
      checkFrequencyformData.value.inspectionTime4;
    const arr = checkFrequencyformData.value.checkFrequencyValue4.map(
      val => val + '-' + checkFrequencyformData.value.checkFrequencyDay4
    );
    console.log(checkFrequencyformData.value.checkFrequencyValue4, arr, 123);
    bindData.value.checkFrequencyValue = arr.join(',');
  } else if (checkFrequencyType === '5') {
    bindData.value.inspectionTime =
      checkFrequencyformData.value.inspectionTime5;
  }
};
watch(
  () => bindData.value.id,
  val => {
    console.log(bindData.value, 1111);
    checkFrequencyformData.value.checkFrequencyDay4 = null;
    if (!bindData.value.id) return;
    if (bindData.value.checkFrequencyType === '1') {
      checkFrequencyformData.value.inspectionTime1 =
        bindData.value.inspectionTime;
      // formData.value.riskSourceVO.checkFrequencyType;
    } else if (bindData.value.checkFrequencyType === '2') {
      checkFrequencyformData.value.inspectionTime2 =
        bindData.value.inspectionTime;
      checkFrequencyformData.value.checkFrequencyValue2 =
        bindData.value.checkFrequencyValue;
    } else if (bindData.value.checkFrequencyType === '3') {
      checkFrequencyformData.value.checkFrequencyValue3 =
        bindData.value.checkFrequencyValue.split(',');
      checkFrequencyformData.value.inspectionTime3 =
        bindData.value.inspectionTime;
    } else if (bindData.value.checkFrequencyType === '4') {
      checkFrequencyformData.value.checkFrequencyValue4 =
        bindData.value.checkFrequencyValue.split(',').map(val => {
          checkFrequencyformData.value.checkFrequencyDay4 = val.split('-')[1];
          return Number(val.split('-')[0]);
        });
      checkFrequencyformData.value.inspectionTime4 =
        bindData.value.inspectionTime;
    } else if (bindData.value.checkFrequencyType === '5') {
      checkFrequencyformData.value.inspectionTime5 =
        bindData.value.inspectionTime;
    }
    console.log(bindData.value.checkFrequencyType === '1', 1111);
    checkFrequencyRadioClick(bindData.value.checkFrequencyType);
  },
  { immediate: true }
);
// watch(
//   () => checkFrequencyformData.value,
//   val => {

//   },
//   { immediate: false, deep: true }
// );
defineExpose({ setCheckFrequencyData });
</script>

<style lang="scss" scoped>
:deep(.el-only-child__content) {
  background-color: #fff !important;
}
.radio-checkFrequency {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.w-100px {
  width: 200px;
  // margin-right: 12px;
}
.w-36px {
  display: inline-block;
  width: 36px;
  justify-content: center;
}
</style>
