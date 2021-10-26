import React, { useImperativeHandle, useState } from 'react';
import { Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface ShortAddressTransProps {
  longRef?: any
}

const ShortAddressTrans: React.FC<ShortAddressTransProps> = (props) => {
  const { longRef } = props;
  const [params, setParams] = useState<{ name: string, fileList: Array<any> }>({ name: '', fileList: [] });

  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: '.xls,.xlsx',
    onRemove: () => {
      setParams({ ...params, fileList: [] })
    },
    beforeUpload: (file: any) => {
      setParams({ ...params, fileList: [file] })
      return false;
    },
    fileList: params.fileList,
  };

  /**
   * useImperativeHandle方法的的第一个参数是目标元素的ref引用
   * 回调函数里是暴漏给父组件的方法
   * 例如：{ 方法名称: () => {} }
   */
  useImperativeHandle(longRef, () => ({
    // 获取提交数据
    getValues: async () => {
      if (!params.name) {
        message.info('请输入批次名！');
        return false;
      }
      if (!params.fileList.length) {
        message.info('请上传文件后提交！');
        return false;
      }
      return params;
    }
  }))

  return (
    <div>
      <Input addonBefore="批次名：" style={{ marginBottom: 20 }} onChange={(e) => setParams({ ...params, name: e.target.value })} />
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p className="ant-upload-hint">
          一列数据，一行一条链接
        </p>
      </Dragger>
    </div>
  )
}

export default ShortAddressTrans;