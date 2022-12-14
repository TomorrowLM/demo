import React, { FC, useState, useEffect } from 'react';
import { useRequest, useUpdateEffect, useDebounceFn, useSetState } from 'ahooks';
import { message, Button, Modal, Select } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import PDF from 'react-pdf';
// import { Document, Outline, Page, pdfjs } from 'react-pdf';
// import styles from './index.less';
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Option } = Select;

const SignSms: FC = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [info, setInfo] = useState<object>(Object);
  const [visibleMailTpl, setVisibleMailTpl] = useState<boolean>(false);
  const [visibleShow, setVisibleShow] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState()
  const [Pdf, setPdf] = useState(false)

  const [page, setTotal] = useState(1)
  return (
    <div>
      1
      {/* <div>
        <a onClick={() => { setVisibleShow(true); setFileUrl(record.authFile); record.authFile.includes('.pdf') ? setPdf(true) : setPdf(false) }}>预览</a>
      </div>
      <Modal title='预览' footer={null} width={720} visible={visibleShow} onCancel={() => { setVisibleShow(false) }}>
        <div>
          {
            Pdf ?
              <Document file={fileUrl} onLoadSuccess={({ numPages }) => setTotal(numPages)}>
                <Page width={600} height={500} pageNumber={page} />
              </Document>
              : <img src={fileUrl}></img>
          }
        </div>
      </Modal> */}
    </div >
  )
};

export default SignSms;