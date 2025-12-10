<template>
  <div class="main">
    <div style="padding-right: 20px">
      <el-input class="custom-input" v-model="filterText" :placeholder="$t('common.keyword')">
        <template #suffix>
          <el-icon>
            <el-icon-search />
          </el-icon>
        </template>
      </el-input>
      <div class="flex" v-if="route.name !== 'dataUse'">
        <!-- {{ checkedNodeInfo }} -->
        <el-button :disabled="!addClick||!(isEmpty(checkedNodeInfo) || checkedNodeInfo.directory === 1)" class="add-scene" size="small" @click="operate('addFolder')">
         <!-- <el-icon class="icon">
            <i-custom-add />
          </el-icon> -->
          <svg class="icon" aria-hidden="true">
            <use href="#icon-tamesxinzengmulu" />
          </svg>
          <span class="m-l-8">新增目录</span>
        </el-button>
        <el-button :disabled="!(isEmpty(checkedNodeInfo) || checkedNodeInfo.directory === 1)" class="add-scene" size="small" @click="operate('add')">
          <svg class="icon" aria-hidden="true">
            <use href="#icon-tamesxinzengyuansu" />
          </svg>
          <span class="m-l-8">{{ title }}</span>
        </el-button>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      :data="props.treeData"
      node-key="id"
      :props="treeProps"
      highlight-current
      :current-node-key="props.treeConfig.nodekey"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @updataTree="updataTree"
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <!-- {{ node }} -->
          <span>
            <span class="tree-img" v-if="data.directory !== 1">
              <img src="@/assets/scene.png" alt="" srcset="" />
            </span>
            <svg class="icon" aria-hidden="true" v-else>
              <use href="#icon-tamesxinzengmulu" />
            </svg>
            {{ node.label }}
          </span>
          <span class="tree-right" v-if="!isEmpty(props.treeOperateList)">
            <el-menu class="tree-menu" mode="horizontal" :ellipsis="false">
              <el-sub-menu index="1" popper-class="no-active">
                <template #title>
                  <el-icon class="icon">
                    <i-custom-pulldown />
                  </el-icon>
                </template>
                <!-- <el-menu-item index="1-1" @click="addScene('addSon', data)" v-if="node.level < 4">{{ $t('dataOrg.newAddScene') }}</el-menu-item>
                <el-menu-item index="1-2" @click="copyScene(data)" v-if="node.level != 1">{{ $t('dataOrg.copyScene') }}</el-menu-item>
                <el-menu-item index="1-3" @click="eidtScene(data)" v-if="node.level != 1">{{ $t('dataOrg.eidtScene') }}</el-menu-item>
                <el-menu-item index="1-3" @click="removeScene(node, data)" v-if="node.level != 1">{{ $t('dataOrg.removeScene') }}</el-menu-item> -->

                <div v-for="val in props.treeOperateList" :key="val.index">
                  <el-menu-item :index="val.index" @click="operate(val.type, data)" v-if="val.showFn(node, data)">{{ val.label }}</el-menu-item>
                </div>
              </el-sub-menu>
            </el-menu>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { resolve } from 'dns';
import { reject } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
const route = useRoute();
const props = defineProps<{
  treeData: any;
  treeConfig: any;
  // data: any;
  treeOperateList?: any;
}>();

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const { t } = useI18n();
const checkedNodeInfo = ref({});
const isNodeClick = ref(false);
watch(
  () => props.treeData,
  (newValue) => {
    // dataSource.value[0].children = newValue;
  },
  { deep: true, immediate: true }
);
const title = computed(() => {
  return window.location.hash.includes('data-modal-view-element') ? '新增视图' : window.location.hash.includes('data-modal-event') ? '新增事件' : '新增元素';
});
const treeProps = reactive({
  label: props.treeConfig?.label || 'label',
  children: props.treeConfig?.children || 'children'
});

const operate = (type: string, data?: any) => {
  if (!data) data = checkedNodeInfo.value;
  console.log(data, 123);
  if (!isEmpty(data)) {
    data = {
      ...data,
      nodeParentName: data?.namePaths.split('.').length === 2 ? '/' : data.namePaths.split('.').reverse()[1]
      // parentId: data?.level === 1 ? 'root' : parseInt(nodeParent.parent.data.id)
    };
  }
  emit('handleTreeOperate', { type, data });
  console.log('点击触发这个事件显示数据', data);
};

const filterText = ref('');
// 查找
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data[props.treeConfig.label].includes(value);
};
const treeRef = ref();
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

// 更新树
const emit = defineEmits<{
  (event: 'getTreeCheckedNode', visible: any): void;
  (event: 'loadSceneList'): void;
  (event: 'handleTreeOperate'): void;
}>();

// 树节点被选中
const copiedNode = ref();
const copiedNodeParent = ref();
//新增目录是否可点击
const addClick=ref(true);
const nodeParentNode = ref({ level: 1 });
const nodeClick = (node: any, nodeParent: any) => {
  addClick.value=node.idPaths.split(".").length<5? true:false;
  console.log('node====>', node);
  console.log('nodeParent====>', nodeParent, nodeParent.parent.data.id);
  nodeParentNode.value = nodeParent;
  const data = {
    ...node,
    nodeParentName: nodeParent?.data?.namePaths.split('.').length === 2 ? '/' : nodeParent.data.namePaths.split('.').reverse()[1],
    parentId: nodeParent.level === 1 ? 'root' : parseInt(nodeParent.parent.data.id)
  };
   
  checkedNodeInfo.value = data;
  emit('getTreeCheckedNode', data);
};

const loadNewScene = async (copiedSceneId: any) => {
  setTimeout(() => {
    console.log(':', treeRef.value, treeRef.value.getNode('151'), copiedSceneId);
    copiedNode.value = treeRef.value.getNode(copiedSceneId);
    copiedNodeParent.value = treeRef.value.getNode(copiedSceneId);
    console.log(':', copiedNode.value, copiedNodeParent.value);
    if (copiedNode.value != null) {
      if (treeRef.value) {
        // 设置新复制的节点为当前选中节点
        treeRef.value.setCurrentKey(copiedNode.value.key);
        // 触发changeTree事件
        const data = { ...copiedNode.value.data, nodeParentName: copiedNodeParent.value.parent.data.sceneName };
        nodeClick(data, copiedNodeParent.value);
      } else {
        console.log('无法找到新复制的节点');
      }
    } else if (copiedNodeParent.value != null) {
      const rootNode = treeRef.value.root;
      const rootNodedata = JSON.parse(JSON.stringify(rootNode.data))[0];
      // console.log('树的根节点', rootNodedata.children[0].id);
      copiedNode.value = treeRef.value.getNode(rootNodedata.children[0].id);
      copiedNodeParent.value = treeRef.value.getNode(rootNodedata.children[0].id);
      if (treeRef.value) {
        // 设置新复制的节点为当前选中节点
        treeRef.value.setCurrentKey(copiedNode.value.key);
        // 触发changeTree事件
        const data = { ...copiedNode.value.data, nodeParentName: copiedNodeParent.value.parent.data.sceneName };
        nodeClick(data, copiedNodeParent.value);
      } else {
        console.log('无法找到新的节点');
      }
    }
  }, 100);
};

const _void = async () => {
  await emit('loadSceneList');
};

const updataTree = async (data) => {
  // console.log(copiedSceneId, type, 3333);
  console.log(data);
  const { id, type, isNotFresh } = data;
  if (type === 'delete') checkedNodeInfo.value = {};
  if (!isNotFresh) {
    _void().then((res) => {
      setTimeout(() => {
        loadNewScene(id);
      }, 600);
    });
  } else {
    loadNewScene(id);
  }
};

defineExpose({ updataTree });
</script>

<style lang="scss" scoped>
.main {
  height: 100%;

  .custom-input {
    // padding: 0 20px 12px;
    padding-bottom: 12px;
    // padding-right: 16px;
  }

  .add-scene {
    // width: calc(100%);
    padding: 16px 16px;
    margin-bottom: 20px;
    margin-right: 16px;
    background: #f3f4f6;
    border-radius: 4px;
  }

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

    .tree-right {
      display: none;
      position: absolute;
      right: 10px;

      :deep(.el-menu) {
        border-bottom: 0;
      }

      :deep(.el-sub-menu__title) {
        padding: 0;
        border-bottom: 0;
        background: #e5efff !important;
      }

      :deep(.el-sub-menu__icon-arrow) {
        display: none;
      }

      :deep(.icon) {
        margin: 0;
      }
    }
  }

  :deep(.el-tree-node__content) {
    height: 40px;

    &:hover {
      background: #e5efff !important;

      .tree-right {
        display: block;
      }

      .custom-tree-node {
        background: #e5efff !important;
        height: 100%;
      }
    }
  }

  :deep(.el-tree) {
    height: calc(100% - 93px);
    width: 100%;
    overflow: auto;
  }

  :deep(.el-tree-node > .el-tree-node__children) {
    overflow: inherit;
  }

  :deep(.el-tree--highlight-current .el-tree-node .el-tree-node__content) {
    padding: 0;
    border: 0;
  }

  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    padding: 0;
    border: 0;
    background-color: #e5efff !important;

    /* stylelint-disable-next-line no-descending-specificity */
    .custom-tree-node {
      background: #e5efff !important;
      height: 100%;
    }
  }
}
</style>
