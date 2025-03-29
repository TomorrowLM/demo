<template>
  <div :class="[props.type === 'img' ? '' : '', 'w-100']">
    <div v-if="props.type === 'img'" class="img-upload">
      <el-upload
        v-model:file-list="fileList"
        action="#"
        accept="image/jpeg, image/png, image/jpg"
        multiple
        list-type="picture-card"
        :http-request="upload"
        :on-progress="processHandle"
        :before-upload="beforeUploadHandle"
        :show-file-list="false"
      >
        <template #trigger>
          <el-icon v-if="props.type === 'img'" class="file-item plus"
            ><Plus
          /></el-icon>
        </template>
      </el-upload>
      <div class="img-content">
        <div
          v-for="(fileItem, index) in fileList"
          class="file-item el-upload-list el-upload-list--picture-card"
        >
          <img
            class="el-upload-list__item-thumbnail"
            :src="fileItem.url"
            alt=""
          />
          <el-progress
            color="#fff"
            type="circle"
            :width="60"
            :stroke-width="4"
            :percentage="percentageArr[index]"
            v-if="percentageArr[index] !== 100"
          />
          <div class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(fileItem)"
            >
              <el-icon><View /></el-icon>
            </span>
            <!-- <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(fileItem)"
          >
            <el-icon><Download /></el-icon>
          </span> -->
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(fileItem, index)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="props.type === 'file'" class="file-upload">
      <el-upload
        v-model:file-list="fileList"
        action="#"
        multiple
        :http-request="upload"
        :on-progress="processHandle"
        :before-upload="beforeUploadHandle"
        :show-file-list="false"
      >
        <template #trigger>
          <el-button :icon="Upload">上传文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            支持：.rar .zip .doc .docx .pdf .jpg...
          </div>
        </template>
      </el-upload>
      <div class="file-content">
        <template
          v-for="(fileItem, index) in fileList"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="handleMouseLeave(index)"
        >
          <div
            :class="[
              'file-item el-upload-list',
              hoverIndex === index ? 'hover' : ''
            ]"
          >
            <svg-icon
              width="2rem"
              height="2rem"
              v-if="!isImage(fileItem.name || fileItem.fileName)"
              :icon-class="fileIconHandle(fileItem)"
            ></svg-icon>
            <img
              style="width: 2rem; height: 2rem"
              v-else
              :src="fileItem.url"
              alt=""
            />
            <div class="mx-16 file-tip">
              <div class="file-name text-ellispis">
                {{ fileItem.name || fileItem.fileName }}
              </div>
              <div class="file-size text-ellispis">
                {{ ((fileItem.size || fileItem.fileSize) / 1024).toFixed(0) }}KB
              </div>
            </div>
            <el-progress
              :width="500"
              :stroke-width="4"
              :percentage="percentageArr[index]"
              v-show="status[index] === 0"
            />
            <div
              class="float-right d-flex justify-content-end"
              :style="{ flex: status[index] === 0 ? 1 : 1 }"
            >
              <el-icon>
                <SuccessFilled
                  class="success-icon"
                  v-if="status[index] === 1"
                />
              </el-icon>
              <el-icon class="mx-8" @click="viewFile(fileItem)"
                ><View
              /></el-icon>
              <el-icon
                @click="handleRemove(fileItem, index)"
                class="icon-delete"
                ><CircleClose
              /></el-icon>
            </div>
          </div>
          <slot name="itemCom" :index="index"></slot>
        </template>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" @close="closeDialog">
      <img w-full :src="viewImgSrc" v-if="viewImgSrc" alt="Preview Image" />
      <div class="office-content">
        <!-- <vue-office-excel
          :src="viewFileSrc"
          v-if="viewFileSrc && fileItem.type === 'excel'"
        />
        <vue-office-docx
          :src="viewFileSrc"
          v-if="viewFileSrc && fileItem.type === 'docx'"
        />
        <vue-office-pdf
          :src="viewFileSrc"
          v-if="viewFileSrc && fileItem.type === 'pdf'"
        /> -->
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  Delete,
  Download,
  Plus,
  View,
  Upload,
  SuccessFilled,
  CircleClose
} from '@element-plus/icons-vue';
import type {
  UploadFile,
  UploadFiles,
  UploadProgressEvent,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus';
// import { uploadApi, downloadById, deleteById } from '@/api/index';
import dayjs from 'dayjs';
// import VueOfficeDocx from '@vue-office/docx';
// import VueOfficeExcel from '@vue-office/excel';
// import VueOfficePdf from '@vue-office/pdf';
import type { UploadComProps } from './index.d';

const props = defineProps({
  bindData: {
    type: Array,
    default: ''
  },
  type: {
    type: String,
    default: 'img'
  },
  config: {
    type: Object as PropType<UploadComProps>
  }
});
const emits = defineEmits(['update:bindData']);
const bindData = ref(props.bindData);
console.log(props);
const fileList: any = ref([]);
const viewImgSrc = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);
const status: any = ref([]); // 0:上传中 1:上传成功 -1:上传失败
const percentageArr = ref<number[]>([]);
const hoverIndex = ref(-1);
const viewFileSrc = ref();
const fileItem = ref();
onMounted(() => {
  init();
});
const handleMouseEnter = (index: number) => {
  hoverIndex.value = index;
};
const handleMouseLeave = (index: number) => {
  hoverIndex.value = -1;
};
function isImage(filename) {
  var imgExtensions = /\.(jpeg|jpg|gif|png|bmp)$/i;
  return imgExtensions.test(filename);
}
//文件类型图标处理函数
const fileIconHandle = file => {
  let name = file.name ? file.name : file.fileName;
  name = name.toLowerCase();
  return isImage(name) || (file?.fileType && file?.fileType.includes('image'))
    ? 'img'
    : name.includes('xlsx')
      ? 'excel'
      : name.includes('doc') || name.includes('docx')
        ? 'docx'
        : name.includes('pdf')
          ? 'pdf'
          : 'file';
};
const init = async () => {
  console.log(bindData.value, 'downloadByIdHandle');
  bindData.value &&
    bindData.value.forEach(async (item: any, index: number) => {
      let res: any = null;
      if (
        item?.fileType &&
        (item?.fileType.includes('image') ||
          item?.fileType.includes('png') ||
          item?.fileType.includes('jpg'))
      ) {
        res = await downloadByIdHandle(item.fileId);
      }
      status.value[index] = 1;
      percentageArr.value[index] = 100;
      fileList.value.push({
        ...item,
        url: res?.data ? window.URL.createObjectURL(res.data) : null
      });
      // elink.href = window.URL.createObjectURL(
      //   new Blob([res], { type: `application/zip` })
      // ); //获得一个zip的url对象
    });
};
const closeDialog = () => {
  viewImgSrc.value = '';
  viewFileSrc.value = null;
};
const downloadByIdHandle = async (fileId: string) => {
  return downloadById({ fileId });
};
//查看文件
const viewFile = async (file: any) => {
  console.log(file);
  let name = file.name ? file.name : file.fileName;
  name = name.toLowerCase();
  fileItem.value = file;
  fileItem.value.type = fileIconHandle(file);
  console.log(isImage(file.fileName));
  if (
    fileItem.value.type === 'excel' ||
    fileItem.value.type === 'docx' ||
    fileItem.value.type === 'pdf'
  ) {
    downloadByIdHandle(file.fileId).then(res => {
      //读取文件的arrayBuffer
      res.data.arrayBuffer().then(res => {
        viewFileSrc.value = res;
        dialogVisible.value = true;
      });
    });
  } else if (fileItem.value.type === 'img') {
    handlePictureCardPreview(file);
  }
};

//查看图像
const handlePictureCardPreview = (file: UploadFile) => {
  viewImgSrc.value = file.url!;
  dialogVisible.value = true;
};
//删除文件
const handleRemove = (file: any, index) => {
  console.log(file);
  fileList.value.splice(index, 1);
  bindData.value.splice(index, 1);
  if (props.config?.remove) {
    props.config?.remove(file);
  } else {
    deleteById({ fileId: file.fileId }).then(res => {
      useMessage({
        data: res,
        type: 'success',
        message: '删除成功'
      });
    });
  }
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};
// 上传前的钩子
const beforeUploadHandle = (rawFile: UploadRawFile) => {
  console.log(rawFile, fileList.value);
};
// 上传文件
const upload = async (options: UploadRequestOptions) => {
  console.log(options, bindData.value, fileList.value);
  percentageArr.value.push(0);
  const percentageIndex = percentageArr.value.length - 1;
  const formData = new FormData();
  formData.append('file', options.file);
  try {
    status.value.push(0);
    setTimeout(() => {
      percentageArr.value[percentageIndex] += 10;
    }, 100);
    const res =
      props.config && props.config.fetch
        ? await props.config.fetch(formData)
        : await uploadApi(formData);

    useMessage({
      data: res,
      type: 'success',
      message: '上传成功'
    });
    percentageArr.value[percentageIndex] = 100;
    status.value[status.value.length - 1] = 1;
    console.log(percentageArr.value, fileList.value);
    const data = {
      fileId: res.data,
      fileName: options.file.name,
      fileUploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      fileSize: (options.file.size / 1024).toFixed(0)
    };
    if (!bindData.value) {
      bindData.value = [];
    }
    bindData.value = [...bindData.value, data];
    emits('update:bindData', bindData.value);
  } catch (e) {
    console.log(e);
    status.value[status.value.length - 1] = -1;
  }
};
const processHandle = (
  evt: UploadProgressEvent,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  console.log(evt, uploadFile, uploadFiles);
};
</script>

<style lang="scss" scoped>
.img-upload {
  display: flex;
  .img-content {
    display: flex;
    .el-upload--picture-card {
      display: flex;

      background: #fff;
      border: 0;
    }
    .plus {
      --el-upload-picture-card-size: 148px;
      align-items: center;
      background-color: var(--el-fill-color-lighter);
      border: 1px dashed var(--el-border-color-darker);
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      height: var(--el-upload-picture-card-size);
      justify-content: center;
      vertical-align: top;
    }
    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 200px;
      position: relative;
      display: flex;
      margin: 0 12px;
      img {
        width: 100%;
        height: 150px;
      }
      .el-progress {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-progress__text {
          display: none;
        }
      }
      .el-upload-list__item-actions {
        position: absolute;
      }
    }
  }
  :deep() {
    .el-progress__text span {
      color: #fff;
    }
  }
}
.file-upload {
  .file-item {
    display: flex;
    align-items: center;
    height: 50px;
    > div {
      flex: 1;
    }
    .file-tip {
      flex: 4;
      width: 50%;
    }
    .el-progress {
      flex: 6;
    }
  }
  .el-progress {
    width: 40%;
  }
  .file-name {
    width: 40%;
    color: red;
  }
  .file-size {
    color: red;
  }
  .hover {
    background: red;
    padding: 4px;
  }
}
.office-content {
  > div {
    height: 50vh;
    overflow: scroll;
  }
}
.icon-delete {
  color: red;
}
.success-icon {
  color: red;
}
</style>
