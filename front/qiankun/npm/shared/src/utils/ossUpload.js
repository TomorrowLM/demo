import { getScrip } from "../api";

export default class OssUpload {
  constructor(objectKey) {
    this.objectKey = objectKey;
    // oss 凭证
    this.credentials = null;
    // oss 上传实例
    this.client = null;
  }

  // 清除objectKey,更新时不需清除,新增文件时请调用一次
  clear() {
    this.objectKey = null;
  }

  // 创建上传实例
  createClient() {
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve();
      }

      getScrip().then(res => {
        if (res.code != 0) {
          reject(res.error || res.errorTrace);
          return;
        }
        // 获取凭证对象
        this.credentials = res.datas;
        // 文件标识 -- 已存在时不修改
        this.objectKey = this.objectKey || this.credentials.objectKey;
        // 构建上传实例
        // `https://${this.credentials.bucketName}.oss-cn-hangzhou.aliyuncs.com`
        // eslint-disable-next-line no-undef
        this.client = new OSS({
          accessKeyId: this.credentials.accessKeyId,
          accessKeySecret: this.credentials.accessKeySecret,
          stsToken: this.credentials.securityToken,
          bucket: this.credentials.bucketName || "network-disk-dir",
          endpoint:
            this.credentials.readDomain || "https://yjrh-test.dingtax.cn",
          cname: true
        });
        resolve(res.datas);
      });
    });
  }
  // 上传文件
  upload(file, sCallback, fCallback, fileName) {
    if (!(file instanceof File || file instanceof Blob)) {
      return fCallback("params is not File or Blob type");
    }
    this.createClient().then(r => {
      this.client
        .put(`/${this.objectKey}${fileName}`, file)
        .then(res => {
          sCallback(res);
        })
        .catch(e => {
          fCallback(e);
        });
    });
  }
  download(filePath, fileName) {
    // 下载文件。
    this.createClient().then(r => {
      this.client
        .get(filePath, {
          headers: {
            // 在请求头If-Modified-Since中指定时间，如果指定的时间早于文件实际修改时间，则下载文件。如果指定的时间等于或者晚于文件实际修改时间，则返回304 Not Modified。
            "If-Modified-Since": new Date("1970-01-01").toGMTString()
            // 在请求头If-Unmodified-Since中指定时间，如果指定的时间等于或者晚于文件实际修改时间，则下载文件。如果指定的时间早于文件实际修改时间，则返回412 Precondition Failed。
            // "If-Unmodified-Since": new Date(1970-01-01).toGMTString()
            // 在请求头If-Match中传入ETag，如果传入的ETag和文件的ETag匹配，则下载文件。如果传入的ETag和文件的ETag不匹配，则返回412 Precondition Failed。
            // "If-Match": '5B3C1A2E0563E1B002CC607C****'
            // 在请求头If-None-Match中传入ETag，如果传入的ETag和文件的ETag不匹配，则下载文件。如果传入的ETag和文件的ETag匹配，则返回304 Not Modified。
            // "If-None-Match": '5B3C1A2E0563E1B002CC607C****'
          }
        })
        .then(r => {
          if (r.content.length > 0) {
            const newBlob = new Blob([r.content], {
              type: r.res.headers["content-type"]
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(newBlob);
            link.download =
              fileName ||
              (filePath.lastIndexOf("/") > -1
                ? filePath.substring(filePath.lastIndexOf("/") + 1)
                : filePath);
            link.click();
            window.URL.revokeObjectURL(link.href);
          } else {
            console.log("错误码", r.res.status);
            console.log("没有符合条件的下载项");
          }
        });
    });
  }
}

// 文件队列类（基于伪队列实现）
export class UploadQueue {
  constructor() {
    this.queue = []; // 待上传文件数组
    this.active = false; // 当前是否正在上传
    this.maxConcurrent = 50; // 最大并发数
  }

  // 添加文件到队列
  enqueue(file) {
    this.queue.push({
      file,
      status: "WAITING",
      progress: 0
    });
    this.processQueue();
  }

  // 处理队列中的文件
  async processQueue() {
    if (this.active || this.queue.length === 0) return;

    this.active = true;
    const { file, status } = this.queue.shift();

    try {
      await this.uploadFile(file);
      this.queue = this.queue.filter(item => item.file !== file);
    } catch (error) {
      console.error(`文件 ${file.name} 上传失败:`, error);
    } finally {
      this.active = false;
      this.processQueue();
    }
  }

  // 上传单个文件（需自行实现具体逻辑）
  async uploadFile(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          this.updateProgress(file, progress);
        }
      };

      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new Error("网络错误"));

      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  }

  // 更新文件上传进度
  updateProgress(file, progress) {
    const item = this.queue.find(i => i.file === file);
    if (item) item.progress = progress;
  }
}
