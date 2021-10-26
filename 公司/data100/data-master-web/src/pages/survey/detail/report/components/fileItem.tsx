// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, {HTMLProps} from 'react';
import fileTypeWord from '@/assets/fileTypeWord.png';
import fileTypeExcel from '@/assets/fileTypeExcel.png';
import fileTypeOther from '@/assets/fileTypeOther.png';
import fileTypePdf from '@/assets/fileTypePdf.png';
import fileTypePpt from '@/assets/fileTypePpt.png';
import fileReportStatus0 from '@/assets/fileReportStatus0.png';
import fileReportStatus1 from '@/assets/fileReportStatus1.png';
import fileReportStatus2 from '@/assets/fileReportStatus2.png';
import {Dropdown, Image} from "antd";
import {DashOutlined} from '@ant-design/icons';
import fileItem from './fileItem.less'

/* 文字报告单个文件展示UI */

// 文件的图片图标
enum FileIconImage {
  pdf = fileTypePdf,
  excel = fileTypeExcel,
  word = fileTypeWord,
  ppt = fileTypePpt,
  other = fileTypeOther,
}

interface ReportFileItemProps extends HTMLProps<any> {
  fileName: string,
  fileTime: string,
  fileType: string,
  status?: number,
  className?: string,
  // 菜单
  overlay?: React.ReactElement;
}

const ReportFileItem: React.FC<ReportFileItemProps> = (props) => {
  const getImageIcon = (extraName: string) => {
    if (extraName === ".pdf") {
      return FileIconImage.pdf.toString()
    }
    if (extraName === ".xls" || extraName === ".xlsx") {
      return FileIconImage.excel.toString()
    }
    if (extraName === ".doc" || extraName === ".docx") {
      return FileIconImage.word.toString()
    }
    if (extraName === ".ppt" || extraName === ".pptx") {
      return FileIconImage.ppt.toString()
    }
    return FileIconImage.other.toString()
  }

  const getItemStatus = (status: number) => {
    // （0未交付 1审批中 2已交付）
    if (status === 0) {
      return fileReportStatus0
    }
    if (status === 1) {
      return fileReportStatus1
    }
    return fileReportStatus2

  }
  return (
    <div className={[fileItem.container, props.className == null ? '' : props.className].join(' ')}>
      <Image src={getImageIcon(props.fileType)} width={58} height={58} preview={false}/>
      <div className={fileItem.fileName}>{props.fileName}</div>
      <div className={fileItem.time}>{props.fileTime}</div>
      {
        props.overlay==null?null:(
          <Dropdown overlay={props.overlay}>
            <DashOutlined className={[fileItem.moreMenu, fileItem.showMoreMenu].join(' ')}/>
          </Dropdown>
        )
      }
      {
        props.status == null ? null :
          <Image src={getItemStatus(props.status)} width={36} height={36} preview={false} className={fileItem.status}/>
      }
    </div>
  );
};

export default ReportFileItem;
