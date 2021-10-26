import React, {useEffect, useState} from "react";
import {Modal, Table} from "antd";
import {get} from "@/utils/request";
import {LogItemData} from "@/components/button/LogItemData";
import urlConfig from "../../../config/urlConfig";

/**
 * @author sdx
 * @date 2021/7/27
 * 操作日志
 */
export enum LogType {
  // 9-问卷列表 10-数据清洗交付 11-数据报告交付 12-文字报告交付）
  surveyList = (9),
  dataClear = (10),
  dataReport = (11),
  fileReport = (12),
}

interface LogProps {
  logType: LogType,
  // 唯一表示，问卷列表是sid，文字报告是reportId
  uId: string,
  showModule: boolean,
  onCancel: () => void
}

// table 的列头
const LogTableColumns = [
  {
    title: '变成时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
  }, {
    title: '变更人',
    dataIndex: 'nickName',
    key: 'nickName',
  }, {
    title: '变更类型',
    dataIndex: 'operation',
    key: 'operation',
  }, {
    title: '变更字段',
    dataIndex: 'unityMatter',
    key: 'unityMatter',
    render: (text: string) => {
      const list: string[] = JSON.parse(text)
      return <li>
        {
          list.map((item: string) => {
            return <li>{item}</li>
          })
        }
      </li>
    }
  }, {
    title: '变更前',
    dataIndex: 'unityBefore',
    key: 'unityBefore',
    render: (text: string) => {
      const list: string[] = JSON.parse(text)
      return <li>
        {
          list.map((item: string) => {
            return <li>{item}</li>
          })
        }
      </li>
    }
  }, {
    title: '变更后',
    dataIndex: 'unityAfter',
    key: 'unityAfter',
    render: (text: string) => {
      const list: string[] = JSON.parse(text)
      return <li>
        {
          list.map((item: string) => {
            return <li>{item}</li>
          })
        }
      </li>
    }
  }
];


const OperationLog: React.FC<LogProps> = (props) => {
  const [logList, setLogList] = useState<LogItemData[]>()
  useEffect(() => {
    if (props.showModule) {
      loadDetail()
    }
  }, [props.showModule])

  // 加载日志列表
  function loadDetail() {
    get<LogItemData[]>(urlConfig.global.logList, {
      operationTargetCode: props.logType.valueOf().toString(),
      projectId: props.uId
    }, (list) => {
      setLogList(list)
    })
  }

  return (
    <Modal
      title="操作日志"
      visible={props.showModule}
      onOk={() => {
        props.onCancel()
      }}
      onCancel={() => {
        props.onCancel()
      }}
      width={1000}>
      <Table style={{maxHeight: '700px', overflow: 'auto'}} columns={LogTableColumns} dataSource={logList || []} />
    </Modal>
  )
}
export default OperationLog
