import { Dropdown, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, useAccess } from 'umi';
import { uniKey } from "../../utils/utils"
import styles from "./index.less"
interface MenuItem {
  access: string,//权限标识
  path: string,//页面地址
  search?:string,//路由参数
  menuName: string,//按钮名称
  handleOk?: object,//点击事件
  menuType:string,
}
interface MenuProps {
  menuList: Array<MenuItem>,
  position: string,//位置
  trigger: Array<string>,//出发下拉 行为
}
const Index: React.FC<MenuProps> = (props) => {
  const { menuList, position, trigger } = props;
  // console.log(props)
  const access = useAccess();
  const menus = (
    <Menu className={styles.menu}>
      {menuList.map((item: any, index: number) => {
        let isShow = typeof item.access==='string'? access.canPermissions(item.access):item.access
        if (isShow) {
          if (item.menuType === "url") {
            return <Menu.Item key={index+''}>
              <Link to={{
                pathname: item.path,
                search:item.search
              }}>{item.menuName}</Link>
            </Menu.Item>
          } else if (item.menuType === "button") {
            return <Menu.Item key={index+''} onClick={()=>{
              item.handleOk(item)
            }}>
              {item.menuName}
            </Menu.Item>
          }
        }
      })}
    </Menu>
  )
  return (
    <Dropdown overlay={menus} placement={position} arrow trigger={trigger}>
      {props.children}
    </Dropdown>
  )
}

export default Index;
