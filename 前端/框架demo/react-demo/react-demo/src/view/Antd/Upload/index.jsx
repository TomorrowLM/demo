import React, { FC, useRef, useState } from "react";
import { useRequest, useBoolean } from "ahooks";
import { Modal, Form, Input, message, Upload, Button } from "antd";

const UploadModal = (props) => {
  const formRef = useRef();
  const [uploadList, setUploadList] = useState();
  const [uploadTypeList, setUploadTypeList] = useState([]);
  const [visible, { toggle, setTrue, setFalse }] = useBoolean(false);

  const ok = (value) => {
    let params = formRef.current.validateFields();
    console.log(params);
    toggle;
  };

  const uploadProps = {
    accept: ".doc, .docx",
    maxCount: 1,
    multiple: false, //是否支持多选文件
    fileList: uploadTypeList,
    beforeUpload(info) { // beforeUpload上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。使用自定义方法上传文件
      console.log(info, 666);
      let ext = info.file.name ? info.file.name.split(".")[1] : "";
      let reg = /[*&<>%?:;\\/|"]/im;
      if (ext) {
        //
        if (!(ext === "doc" || ext === "docx")) {
          message.error("您只能上传doc，docx 文件!");
          return false;
        } else if (reg.test(info.file.name)) {
          message.error(
            '文件名不能包含下列任何字符串：* & < > % ? : ; \\ / | "'
          );
          return false;
        } else {
          let formData = new FormData();
          formData.append("file", info.file);
          setUploadList(formData);
          return false;
        }
      }
    },
    onChange(info) {
      console.log(123, info);
      setUploadTypeList(info.fileList);
    },
    onRemove() {
      setUploadTypeList([]);
    },
  };
  return (
    <div>
      <Modal
        wrapClassName=""
        title="添加模板"
        okText="确认"
        visible={visible}
        onOk={ok}
        onCancel={setFalse}
      >
        <Form labelWrap ref={formRef}>
          <Form.Item
            name="upload"
            label="上传文件"
            extra={
              <span>
                备注: 上传文件，点击这里 <a>下载</a>文件
              </span>
            }
            rules={[{ required: true, message: "请上传文件" }]}
          >
            <Upload {...uploadProps}>
              <Button>浏览</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Button onClick={setTrue}>form+modal+upload</Button>
    </div>
  );
};

export default UploadModal;
