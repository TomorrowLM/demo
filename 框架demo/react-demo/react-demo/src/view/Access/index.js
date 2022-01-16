import React from "react";
import usePermissionModel from "../../hox/access";
import WithAccess from '../../components/WithAccess'
import { Row, Col, Button, Tooltip, Modal, Space, message } from 'antd';
import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";

const WithAccessBtnYes = WithAccess(Button)
const WithAccessBtnNo = WithAccess(Button)
export default function AHooks(props) {
  const { menus, set } = usePermissionModel();
  console.log(menus, set)
  return <div>
    <WithAccessBtnYes permission='account:authorization:yes' name='按钮' icon={<LaptopOutlined />} onClick={() => { message.success('按钮有权限') }}></WithAccessBtnYes>
    <WithAccessBtnNo permission='account:authorization:no' name='按钮' icon={<LaptopOutlined />} onClick={() => { message.success('按钮有权限') }}></WithAccessBtnNo>

  </div>;
}
