<template>
  <div class="w100">
    <div class="flex w100">
      <el-tree-select
        v-model="formData.eventId"
        ref="treeRef"
        :data="eventSelectOptions"
        :props="{
          label: 'eventName',
          children: 'childrenList'
        }"
        node-key="id"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :teleported="false"
        :placeholder="$t('common.selectPlaceholder')"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>
              <span class="tree-img" v-if="data.directory !== 1">
                <img src="@/assets/scene.png" alt="" srcset="" />
              </span>
              <svg class="icon" aria-hidden="true" v-else>
                <use href="#icon-tamesxinzengmulu" />
              </svg>
              <!-- <span v-if="data.id != 'root'" class="tree-img"> <img src="@/assets/scene.png" alt="" srcset="" /></span> -->
              {{ data.eventName }}
            </span>
          </span>
        </template>
      </el-tree-select>
      <el-button style="margin-left: 16px" @click="jumpUrl">新增事件</el-button>
    </div>
    <!-- {{ formData }} -->
    <el-checkbox-group v-model="selectEvent" @change="changeBox">
      <el-checkbox :label="0" name="事件开始时">事件开始时</el-checkbox>
      <el-checkbox :label="1" name="事件开始时">事件结束时</el-checkbox>
    </el-checkbox-group>
    <el-drawer :model-value="DataOrgTreeNewAddSceneVisble" size="540px" @close="cancel" align-center :close-on-click-modal="false">
      <template #header>
        <span> 新增事件 </span>
      </template>
      <template #default>
        <DataOrgTreeNewAddElement
          v-if="DataOrgTreeNewAddSceneVisble"
          v-model:DataOrgTreeNewAddSceneVisble="DataOrgTreeNewAddSceneVisble"
          :treeData="directoryList"
          treeOperate="add"
          :treeConfig="treeConfig"
          activeName="basicInfo"
          :isFolder="false"
          type="dialog"
          ref="sceneRef2"
          @updataTree="updataTree"
        />
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="cancel" @click="cancel">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="save(2)">{{ $t('common.save') }}</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { modalEventApi } from '@/api';
import DataOrgTreeNewAddElement from '@/views/data-modal/event/components/data-org-tree-new-add-element.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps<{
  formData: any;
}>();
const treeConfig = reactive({
  label: 'eventName',
  children: 'childrenList'
  // addName: t('dataModalEvent.addEvent')
});
const { formData } = toRefs(props);
const sceneRef2 = ref();
const selectEvent = ref([]);

const unwatch = watch(
  formData,
  (newValue) => {
    console.log(formData, newValue);
    if (newValue.eventType === 2) {
      selectEvent.value = [0, 1];
    } else if (newValue.eventType || newValue.eventType === 0) {
      selectEvent.value = [newValue.eventType];
    } else {
      selectEvent.value = [];
    }
  },
  { deep: true, immediate: true }
);

const jumpUrl = () => {
  router.push({ name: 'dataModalEvent', state: { type: 'add' } });
};

//事件选择
const eventSelectOptions = ref([]);
const DataOrgTreeNewAddSceneVisble = ref(false);
const treeRef = ref();
const { requestFn: getAllEventDirectory } = useRequest(modalEventApi.getAllEventDirectory);
const { requestFn: getAllEventInfoTree } = useRequest(modalEventApi.getAllEventInfoTree);
const changeBox = (e) => {
  console.log(selectEvent);
  if (selectEvent.value.length === 2) {
    formData.value.eventType = 2;
  } else {
    formData.value.eventType = selectEvent.value[0];
  }
  console.log(formData.value.eventType);
};
const getAllEventInfoTreeHandle = async () => {
  return await getAllEventInfoTree().then((res) => {
    eventSelectOptions.value = res.data;
  });
};
const directoryList = ref([]);
const getAllEventDirectoryHandle = async () => {
  return await getAllEventDirectory().then((res) => {
    directoryList.value = res.data;
  });
};
getAllEventDirectoryHandle();
const updataTree = async (data) => {
  await getAllEventInfoTreeHandle();
  console.log(data);
  formData.value.eventId = data.id.id;
  treeRef.value.setCurrentKey(data.id.id);
};

// 关闭弹框
const cancel = () => {
  sceneRef2.value?.reset();
  DataOrgTreeNewAddSceneVisble.value = false;
};
const save = (e: number) => {
  if (e === 1) {
  } else if (e === 2) {
    sceneRef2.value.save();
  }
};
onMounted(() => {
  getAllEventInfoTreeHandle();
  unwatch();
});
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .tree-img {
    img {
      width: 15px;
      height: 15px;
      margin-right: 8px;
    }
  }
}

:deep(.el-select) {
  width: 100%;
}
</style>
