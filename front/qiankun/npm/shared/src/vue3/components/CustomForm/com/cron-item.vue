<template>
  <el-form-item :prop="prop" class="custom-form-item">
    <template #label>
      Cron表达式<el-popover placement="top-start" :width="500" trigger="hover">
        <div>
          <span>Cron参考地址：https://cron.qqe2.com/ <br /></span>
          <span style="font-size: 12px"
            >常用Cron表达式例子：<br />
            (1) 0/2 * * * * ? 表示每2秒 执行任务<br />
            (2) 0 0/2 * * * ? 表示每2分钟 执行任务<br />
            (3) 0 0 2 1 * ? 表示在每月的1日的凌晨2点调整任务<br />
            (4) 0 15 10 ? * MON-FRI 表示周一到周五每天上午10:15执行作业<br />
            (5) 0 15 10 ? 6L 2002-2006 表示2002-2006年的每个月的最后一个星期五上午10:15执行作业<br />
            (6) 0 0 10,14,16 * * ? 每天上午10点，下午2点，4点触发 <br />
            (7) 0 0/30 9-17 * * ? 朝九晚五工作时间内每半小时触发 <br />
            (8) 0 0 12 ? * WED 表示每个星期三中午12点触发 <br />
            (9) 0 0 12 * * ? 每天中午12点触发 <br />
            (10) 0 15 10 ? * * 每天上午10:15触发 <br />
            (11) 0 15 10 * * ? 每天上午10:15触发 <br />
            (12) 0 15 10 * * ? 每天上午10:15触发 <br />
            (13) 0 15 10 * * ? 2005 2005年的每天上午10:15触发<br />
            (14) 0 * 14 * * ? 在每天下午2点到下午2:59期间的每1分钟触发<br />
            (15) 0 * 14 * * ? 在每天下午2点到下午2:59期间的每1分钟触发<br />
            (16) 0 0/5 14 * * ? 在每天下午2点到下午2:55期间的每5分钟触发 <br />
          </span>
        </div>
        <template #reference>
          <svg class="icon" aria-hidden="true">
            <use href="#icon-tamesicon_help" />
          </svg>
        </template>
      </el-popover>
      :
    </template>
    <template #default>
      <el-input v-model="itemState[prop]"></el-input>
    </template>
  </el-form-item>
</template>
<script lang="ts" setup>
const props = defineProps<{
  itemState: any;
  prop: string;
}>();
const { itemState, prop } = toRefs(props);
</script>

<style lang="scss" scoped>
:deep(.el-only-child__content) {
  background-color: #fff !important;
}
</style>
