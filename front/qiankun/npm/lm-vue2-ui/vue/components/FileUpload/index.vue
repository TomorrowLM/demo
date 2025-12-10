<template>
  <el-dialog title="上传版本" :visible="uploadVisibleSync" width="500px" destroy-on-close @close="cancelDialog">
    <el-form ref="userRef" :rules="rules" :model="formState" label-position="top">
      <el-form-item label="版本号：" prop="version"> <el-input v-model="formState.version"></el-input> </el-form-item>
      <el-form-item label="版本文件：" prop="fileName">
        <el-upload
          ref="upload"
          action=""
          class="upload-demo"
          :auto-upload="false"
          :limit="1"
          accept=".exe"
          v-model="formState.fileName"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <el-button plain size="small">
            <i class="el-icon-upload2"></i>
            点击上传
          </el-button>
          <div slot="tip" class="el-upload__tip">支持：.exe ...</div>
        </el-upload>
        <div class="mt-md file" v-show="!$lodash.isEmpty(fileData)">
          <div class="left">
            <img :src="fileImg" alt="" />
            <div :style="{ color: statusUp === 'fail' ? 'red' : '' }">
              <div>{{ fileData.name }}</div>
              <div>{{ fileData.fileSize }}KB</div>
            </div>
          </div>
          <el-progress v-if="statusUp === 'init'" class="progress" :percentage="progress.uploadPercent"></el-progress>
          <div class="right">
            <div v-if="isHover">
              <svg-icon
                v-if="statusUp === 'fail'"
                className="upload_resend"
                iconName="upload_resend"
                class="mr-md"
                @click="uploadResend"
              ></svg-icon>
              <svg-icon className="upload_delete" iconName="upload_delete" @click="handleDel"></svg-icon>
            </div>
            <div class="d-center" v-else>
              <svg-icon
                v-if="statusUp === 'fail'"
                className="upload_error"
                iconName="upload_error"
                @click="handleDel"
              ></svg-icon>
              <i style="color: #52c41a; font-size: 16px" class="el-icon-success" v-if="statusUp === 'success'"></i>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="描述：" prop="versionDes">
        <el-input type="textarea" :rows="4" v-model="formState.versionDes"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn-cancel" @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="confirmDialog(0)">确定</el-button>
      <el-button type="primary" @click="confirmDialog(1)">确定并发布</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Prop } from 'vue-property-decorator';
import {
  upload,
  uploadSmall,
  uploadUuid,
  productVersionAdd,
  getVersionDetail,
  productVersionEdit
} from '@/api/product';
import ws from '@/utils/websocket';

@Component({})
export default class VueCom extends Vue {
  @PropSync('uploadVisible') uploadVisibleSync: any;
  @Prop() rowData: any;
  fileImg = require('@/assets/pngIcon/file.png');
  isHover = false; //
  statusUp = 'init';
  detailVersion = {};
  formState: any = {};
  fileData: any = {};
  rules = {
    version: [{ required: true, message: '请输入版本号', trigger: ['change', 'blur'] }]
  };
  userUuid = '';
  //获取进度
  get progress() {
    console.log(this.$store.state.version);
    return this.$store.state.version.progress || 0;
  }
  async mounted() {
    this.statusUp = this.rowData ? 'success' : 'init';
    this.formState.productId = this.$route.params.id;
    await this.uploadUuid();
    this.rowData && (await this.getVersionDetail());
    ws.initWebsocket();
    this.$nextTick(() => {
      document.getElementsByClassName('file')[0].addEventListener('mouseenter', () => {
        this.isHover = true;
      });
      document.getElementsByClassName('file')[0].addEventListener('mouseleave', () => {
        this.isHover = false;
      });
    });
  }
  cancelDialog() {
    this.uploadVisibleSync = false;
  }
  //获取uuid
  uploadUuid() {
    uploadUuid().then((res: any) => {
      this.userUuid = res.data;
    });
  }
  async getVersionDetail() {
    const { data } = await getVersionDetail(this.rowData.id);
    this.$set(this.fileData, 'name', data.fileName);
    this.$set(this.fileData, 'fileSize', data.fileSize);
    this.$set(this.formState, 'version', data.version);
    this.$set(this.formState, 'versionDes', data.versionDes);
    this.$set(this.formState, 'fileName', data.fileName);
    this.$set(this.formState, 'id', data.id);
    this.$store.commit('setVersion', { name: 'progress', data: { uploadPercent: 100 } });

    this.$nextTick(() => {
      document.getElementsByClassName('file')[0].addEventListener('mouseenter', () => {
        this.isHover = true;
      });
      document.getElementsByClassName('file')[0].addEventListener('mouseleave', () => {
        this.isHover = false;
      });
    });
  }
  formData: any = null;
  async handleChange(file: any) {
    this.handleDel();
    if (!file.name.endsWith('.exe')) {
      this.$message.error('仅支持上传exe格式的文件');
      this.statusUp = 'fail';
      return;
    }
    this.fileData = file;
    this.fileData.fileSize = parseInt((file.size / 1024) as any);
    if (file.size > 5 * 1024 * 1024) {
      let splitIndex = 1;
      const totalSize = Math.ceil(file.size / (5 * 1024 * 1024));
      let successCount = 0;
      while (splitIndex <= totalSize) {
        const promiseArr = [...Array(7).keys()].slice(1).map((val, index) => {
          return new Promise((resolved) => {
            if (splitIndex > totalSize) {
              return;
            }
            const start = 5 * 1024 * 1024 * (splitIndex - 1);
            let end = 5 * 1024 * 1024 * splitIndex;
            if (end > file.size) {
              end = file.size;
            }
            this.formData = new FormData(); // 新建一个FormData()对象，这就相当于你新建了一个表单
            this.formData.append('file', file.raw.slice(start, end)); // 将文件保存到formData对象中
            // console.log(23, start, end, index, splitIndex);
            upload({
              userUuid: this.userUuid,
              file: this.formData,
              splitIndex,
              totalSize,
              fileName: file.name
            }).then((res: any) => {
              if (res.code !== 0) {
                console.log(res);
                this.$message.error(res.message);
                this.statusUp = 'fail';
              } else {
                console.log(777, res);
                resolved(true);
                successCount++;
                if (res.data.md5FileName) {
                  if (successCount == totalSize) {
                    this.formState.fileName = res.data.md5FileName;
                    this.$message.success(res.message);
                    this.statusUp = 'success';
                  } else {
                    this.$message.error('上传失败');
                    this.statusUp = 'fail';
                  }
                }
              }
            });
            splitIndex++;
          });
        });
        await Promise.all(promiseArr).then((res) => {
          console.log(res);
        });
        // await upload({ userUuid: this.userUuid, file: this.formData, splitIndex, totalSize, fileName: file.name }).then(
        //   (res: any) => {
        //     if (res.code !== 0) {
        //       this.$message.error(res.message);
        //       this.statusUp = 'fail';
        //     } else {
        //       successCount++;
        //       if (res.data.md5FileName) {
        //         if (successCount == totalSize) {
        //           this.formState.fileName = res.data.md5FileName;
        //           this.$message.success(res.message);
        //           this.statusUp = 'success';
        //         } else {
        //           this.$message.error('上传失败');
        //           this.statusUp = 'fail';
        //         }
        //       }
        //     }
        //   }
        // );
        // splitIndex++;
      }
    } else {
      this.formData = new FormData(); // 新建一个FormData()对象，这就相当于你新建了一个表单
      this.formData.append('file', file.raw); // 将文件保存到formData对象中
      await uploadSmall({ userUuid: this.userUuid, file: this.formData }).then((res: any) => {
        if (res.code === 0) {
          this.formState.fileName = res.data.md5FileName;
          this.$message.success(res.message);
          this.statusUp = 'success';
        } else {
          this.$message.error(res.message);
          this.statusUp = 'fail';
        }
      });
    }
  }
  async uploadResend() {
    console.log(this.formData);
    this.statusUp = 'init';
    await upload({ userUuid: this.userUuid, file: this.formData }).then((res: any) => {
      if (res.code === 0) {
        this.formState.fileName = res.data.md5FileName;
        this.$message.success(res.message);
        this.statusUp = 'success';
      } else {
        this.$message.error(res.message);
        this.statusUp = 'fail';
      }
    });
  }
  handleDel() {
    this.statusUp = 'init';
    this.fileData = {};
    (this.$refs.upload as any).uploadFiles = []; //重置文件列表，才能触发handleChange
    this.$store.commit('setVersion', { name: 'progress', data: { uploadPercent: 0 } });
  }
  async confirmDialog(type: number) {
    if (this.rowData && this.statusUp === 'init') {
      this.$message.error('文件未上传完成');
      return;
    }
    if (this.rowData) {
      //编辑
      delete this.formState.productId;
      const { code, message } =
        type === 0
          ? await productVersionEdit({
              id: this.rowData.id,
              data: { ...this.formState, fileSize: this.fileData.fileSize }
            })
          : await productVersionEdit({
              id: this.rowData.id,
              data: { ...this.formState, fileSize: this.fileData.fileSize, publish: true }
            });
      if (code === 0) {
        this.$message.success(message);
        this.uploadVisibleSync = false;
      } else {
        this.$message.error(message);
      }
    } else {
      //新增
      const { code, message } =
        type === 0
          ? await productVersionAdd({ ...this.formState, fileSize: this.fileData.fileSize })
          : await productVersionAdd({ ...this.formState, fileSize: this.fileData.fileSize, publish: true });
      if (code === 0) {
        this.$message.success(message);
        this.uploadVisibleSync = false;
      } else {
        this.$message.error(message);
      }
    }
  }
  // async confirmPublish() {

  // }
}
</script>

<style lang="scss" scoped>
/deep/ .el-upload {
  width: 0;
}
.el-upload__tip {
  height: 12px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(34, 34, 34, 0.55);
  line-height: 12px;
}
.file {
  height: 32px;
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  &:hover {
    padding: 12px 8px;
    background: #e5efff;
  }
  .progress {
    width: 250px;
  }
  .left {
    display: flex;
    display: flex;
    align-items: center;
    margin-right: 8px;
    > div {
      margin-left: 8px;
      // height: 20px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      line-height: 20px;
      &:nth-of-type(2) {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(34, 34, 34, 0.55);
        line-height: 20px;
      }
    }
  }
  .right {
    display: flex;
    justify-content: end;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      > svg:nth-of-type(1) {
        // margin-right: 14px;
      }
    }
  }
}
</style>
