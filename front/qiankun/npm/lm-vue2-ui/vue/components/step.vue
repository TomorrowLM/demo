<template>
  <div class="step-container">
    <div class="step-list">
      <div v-for="(item, index) in steps" :key="index" class="step-item" :style="{ width: `${100 / steps.length}%` }">
        <div class="step-line" v-if="index == 0"></div>
        <div class="step-content">
          <div class="step-number" :class="{ active: currentStep === index, completed: currentStep > index - 1 }">
            <div>{{ index + 1 }}</div>
          </div>
          <div class="step-text" :class="{ active: currentStep === index, completed: currentStep > index }">
            {{ item }}
          </div>
        </div>
        <div class="step-line" v-if="index < steps.length - 1" :class="{ completed: currentStep > index }"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @author : 志明
 * @date : 2025/08/05 16:05:00
 * @module : Step
 * @description : 公司采集流程步骤导航组件
 * @version : 1.0.0
 */
export default {
  name: 'Step',
  props: {
    /**
     * 当前步骤
     * @type {Number}
     * @required true
     */
    currentStep: {
      type: Number,
      required: true,
      default: 0
    },
    /**
     * 步骤列表
     * @type {Array}
     * @default ['注册单位账号', '完善基础信息', '完善设施设备', '安全管控体系']
     */
    steps: {
      type: Array,
      default: () => ['注册单位账号', '完善基础信息', '完善设施设备', '安全管控体系']
    }
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 跳转到指定步骤
     * @method goToStep
     * @param {Number} step - 目标步骤
     */
    goToStep(step) {
      if (step < 1 || step > this.steps.length) {
        return;
      }
      this.$emit('step-change', step);
    }
  }
};
</script>

<style lang="scss" scoped>
$circle-size: 1.25rem;
$circle-mt: 0.5rem;
.step-container {
  // padding: 1.25rem 0;
  width: 100%;
}

.step-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  width: 25%;
}
.step-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .step-wrap {
    width: 1.5rem;
    height: 2rem;
    display: flex;
    align-items: center;
  }
}
.step-number {
  width: $circle-size;
  height: $circle-size;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  transition: background-color 1s;
  background: #fff;
  text-align: center;
  color: #86909c;
  font-family: 'PingFang SC';
  font-weight: 500;
  font-size: 0.833rem;
  margin-top: $circle-mt;
  &.active {
    background: #007aff;
    color: #fff;
    border: 0.35rem solid #e4effe;
    margin-top: $circle-mt/2;
  }
  &.completed {
    // background-color: #fff;
    // color: #86909c;
  }
}
.step-line {
  position: absolute;
  top: 0.625rem;
  right: -3rem;
  width: 3rem;
  height: 0.125rem;
  background-color: #e5e5e5;
  z-index: 1;
  transform: translateX(-50%);
  margin-top: $circle-mt;
  &.completed {
    // background-color: #67c23a;
  }
}
.step-text {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  transition: color 1s;
  color: #86909c;
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 0.813rem;
  margin-top: 0.5rem;

  &.active {
    color: var(--bule, #007aff);
    font-family: 'PingFang SC';
    font-weight: 500;
    font-size: 0.813rem;
    margin-top: $circle-mt/2 - 0.1rem;
  }

  &.completed {
    // color: #86909c;
  }
}
</style>