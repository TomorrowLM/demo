import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link ,history} from 'umi';
import * as Icon from '@ant-design/icons';
import defaultSettings from '../../../config/defaultSettings';
interface MenuProps {
  menu: Array<any>,
  mode:string
}
const Index: React.FC<MenuProps> = (props) => {
  const { menu,mode} = props;
  console.log(props)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const handleClick = (e: { key: string, keyPath: string[] }) => {
    setSelectedKey(e.key)
    history.push({ pathname: e.key });
  }
  useEffect(() => {
    setSelectedKey(history.location.pathname)

  }, [])
  return (
    <Menu theme="light" mode={mode} onClick={(e: any) => handleClick(e)} selectedKeys={[selectedKey]}>
        {
          menu ? menu.map(({ name, path, icon }, index) => {
            if (Icon[icon]) {
              return <Menu.Item key={path} style={selectedKey==path?{color:defaultSettings.primaryColor,background:"#fff",}:''} icon={React.createElement(Icon[icon], { className: styles.icon })}>{name}</Menu.Item>
            } else {
              if(icon){
                return <Menu.Item key={path} icon={icon}>{name}</Menu.Item>
              }else{
                return <Menu.Item key={path}>{name}</Menu.Item>
              }
            }
          }) : ""
        }
      </Menu>
  )
}

export default Index;
