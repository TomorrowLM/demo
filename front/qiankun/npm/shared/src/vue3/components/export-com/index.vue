<template>
  <div>
    <el-button style=" margin-left: 10px" type="success" @click="uploadVisible = true">导入Excel</el-button>
    <el-dialog :title="`导入${exportConfig.fileType}`" :model-value="uploadVisible" width="540px" size="540px" @close="cancel" :close-on-click-modal="false">
      <div class="upload">
        <div style="flex-direction: column">
          <span class="m-b-20"><span style="color: red">*</span>上传文件</span>
          <el-upload
            v-if="a == 1"
            ref="upload"
            :show-file-list="false"
            action=""
            :file-list="fileList"
            :on-change="handleChange"
            :auto-upload="false"
            accept=".xlsx"
            drag
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :disabled="props.status === 'loading'"
          >
            <template #trigger>
              <div>
                <svg class="icon" aria-hidden="true">
                  <use href="#icon-tamesicon-file" />
                </svg>
                <!-- <div class="el-upload__tip text-red">limit 1 file, new file will cover the old file</div> -->
                <div class="el-upload__text m-t-20">点击或将文件拖拽到这里上传</div>
                <div class="el-upload__tip" slot="tip">只允许上传单个Excel文件</div>
                <el-button type="primary" link @click.stop="download">下载模板</el-button>
              </div>
            </template>
            <template #tip> </template>
          </el-upload>
          <div v-if="a === 2" class="flex-column flex-align-center content">
            <!-- {{fileArr}} -->
            <img class="prefix-icon m-b-20" style="width: 48px" src="@/assets/icons/excel3.svg" alt="" />
            <span> {{ fileArr[0].name }}</span>
            <div class="flex-justify-end m-t-20">
              <el-button @click.stop="restart">重新上传</el-button>
              <el-button type="primary" @click.stop="handleBtn(2)">点击上传</el-button>
            </div>
          </div>
          <div v-if="props.status === 'loading'" class="flex-column flex-align-center content">
            <el-button style="border: 0" link :loading="loading"></el-button>
          </div>
          <div v-if="a === 3" class="flex-column flex-align-center content">
            <el-icon class="icon" style="margin-right: 5px; color: #52c41a; font-size: 84px">
              <i-custom-success />
            </el-icon>
            <div class="m-t-20">导入成功</div>
          </div>
          <div v-if="a === 4" class="flex-column flex-align-center content">
            <el-icon class="icon" style="margin-right: 5px; color: #f33; font-size: 84px">
              <i-custom-delete />
            </el-icon>
            <div class="m-t-20">导入失败</div>
            <el-button type="primary" class="m-b-12" @click.stop="restart">重新上传</el-button>
            <slot></slot>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
const props = defineProps<{
  type: string;
  exportConfig: any;
  status: any;
}>();
const emit = defineEmits(['exportHandle']);
const { status } = toRefs(props);
const a = ref(1);
const { exportConfig } = toRefs(props);
let fileList = ref([]);
const uploadVisible = ref();
const upload = ref<UploadInstance>();
const cancel = () => {
  uploadVisible.value = false;
  a.value = 1;
  fileArr.value = [];
};
const download = () => {
  emit('exportHandle', { type: 'download' });
};
const loading = computed(() => {
  return props.status === 'loading' ? true : false;
});

watch(
  () => props.status,
  () => {
    console.log(123, props.status);
    if (props.status === 'success') {
      a.value = 3;
    } else if (props.status === 'error') {
      a.value = 4;
    } else if (props.status === 'loading') {
      a.value = 5;
    }
  }
);
const restart = () => {
  fileArr.value = [];
  a.value = 1;
  // upload.value!.clearFiles();
};

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  // console.log();
  // const file = files[0] as UploadRawFile;
  // file.uid = genFileId();
  // upload.value!.handleStart(file);
};

let fileArr: any = ref([]);
const handleBtn = (e) => {
  let data = new FormData();
  console.log(fileArr.value);
  console.log(data, fileArr.value[0], fileList.value);
  data.append('file', fileArr.value[0].raw);
  // console.log(fileList.value, fileArr);
  // console.log(data);
  // if (fileList.length > 0) {
  //   this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的csv文件
  // }
  emit('exportHandle', { data, type: 'export' });
};
const handleChange = (file, fileList) => {
  console.log(132, file);
  fileList.value = fileList;
  fileArr.value = [file];
  // status.value = 'file';
  a.value = 2;
  console.log(fileArr.value, fileList, fileList.value);
};
// const fileHandle = () => {
//   emit('upload', data);
// };
defineExpose({ cancel });
</script>
<style lang="scss" scoped>
// :deep(.el-upload, ) {
//   height: 100%;
//   width: 100%;
//   background: #fafafa;
//   border-radius: 4px;
//   border: 1px solid #a1a1a1;

//   .el-upload-dragger {
//     background: #fafafa;
//   }
// }
// .upload {
//   width: 424px;
//   height: 256px;
// }
.el-upload__tip {
  color: rgba(34, 34, 34, 0.55);
}

.icon {
  width: 100px !important;
  height: 80px !important;
}

.content {
  height: 260px;
  justify-content: center;
  border: 1px #ccc;
  border-style: dashed;
}
</style>
