import React from "react";
import OnLineEdit from "@/components/OnLineEdit/OnLineEdit";


/**
 *  数据清洗在线查看和编辑
 * @author sdx
 * @date 2021/8/13
 */

const ClearDataEdit: React.FC = () => {

  return(
    <div>
      <OnLineEdit fileUrl="https://cdndatacenter.data100.com/report/1609399296399_1625646659205.docx"/>
    </div>
  )

}
export default ClearDataEdit
