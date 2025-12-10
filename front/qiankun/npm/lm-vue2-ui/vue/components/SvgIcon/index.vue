<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconNameProp" />
  </svg>
</template>

<script>
// import { isExternal } from '@/utils/validate';
/**
 * 修改svg的颜色：svgfill删除或者改为fill="currentColor", fill-opacity 等可以不用管
 */
export default {
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    //校验传入的iconClass是否为外部链接
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
    iconNameProp() {
      return `#icon-${this.iconName}`;
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon-' + this.className;
      } else {
        return 'svg-icon';
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      };
    }
  }
};
</script>

<style lang="scss">
@import './index.module.scss';
</style>
