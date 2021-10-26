// import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Button, Layout, Menu, } from 'antd';
import { getFileInfoBySurveyGroupId } from "./service"
import * as Icon from '@ant-design/icons';
import { ReportIcon } from '@/components/Icon'
import RightContent from '@/components/RightContent';
import defaultSettings from '../../../../config/defaultSettings';
import GeneralBreadcrumb from '@/components/GeneralBreadcrumb';
import dataReportImg from "@/assets/iconImages/dataReport@2x.png"
import dataReportSelImg from "@/assets/iconImages/dataReport_sel@2x.png"
import dataImg from "@/assets/iconImages/data@2x.png"
import dataSelImg from "@/assets/iconImages/data_sel@2x.png"
import cleanImg from "@/assets/iconImages/clean@2x.png"
import cleanSelImg from "@/assets/iconImages/clean_sel@2x.png"
import reportImg from "@/assets/iconImages/report@2x.png"
import reportSelImg from "@/assets/iconImages/report_sel@2x.png"
import homeImg from "@/assets/iconImages/home@2x.png"
import homeSelImg from "@/assets/iconImages/home_sel@2x.png"

import styles from './index.less';
const { Content, Footer, Sider, Header } = Layout;
const menu = [
  {
    name: '首页',
    path: '/folder',
    icon: homeImg,
    iconSel: homeSelImg,
    permissions: "list:folder"
  },
  {
    name: '数据清洗',
    path: '/list/detail/clean',
    icon: cleanImg,
    iconSel: cleanSelImg,
    permissions: "list:detail:clean"
  },
  {
    name: '数据报告',
    path: '/list/detail/dataReport',
    icon: dataReportImg,
    iconSel: dataReportSelImg,
    permissions: "list:detail:dataReport"
  },
  {
    name: '文字报告',
    path: '/list/detail/report',
    icon: reportImg,
    iconSel: reportSelImg,
    permissions: "list:detail:report"
  },
  {
    name: '项目资料',
    path: '/list/detail/data',
    icon: dataImg,
    iconSel: dataSelImg,
    permissions: "list:detail:data"
    // icon: <ReportIcon className={styles.icon}/>,
  }
]
const Index: React.FC = (props: any) => {
  const { route } = props
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [titleData, setTitleData] = useState<Array<any>>([])
  const access = useAccess();

  // console.log(history, route, props)
  const handleClick = (e: { key: string, keyPath: string[] }) => {
    // debugger;
    setSelectedKey(e.key)
    if (e.key !== menu[0].path) {
      history.replace({ pathname: e.key, search: history.location.search });
    } else {
      history.replace({ pathname: e.key });
    }
    if (fileName === '') {
      setTitleData([
        { name: decodeURIComponent(history.location.query.surveyName) },//, path: menu[0].path 
        { name: getTitleName(e.key) }
      ])
    } else {
      setTitleData([
        { name: fileName },
        { name: decodeURIComponent(history.location.query.surveyName) },//, path: menu[0].path 
        { name: getTitleName(e.key) }
      ])
    }

  }
  const getTitleName = (path: string) => {
    var key = '/' + path.split('/')[3]
    var name = ''
    menu.forEach((item: any, index: number) => {
      if (item.path.indexOf(key) > -1) {
        name = item.name
      }
    })
    return name
  }

  useEffect(() => {
    // console.log(history, props)
    setSelectedKey(history.location.pathname)

    getFileInfoBySurveyGroupId({ surveyGroupId: history.location.query.surveyGroup }).then((res) => {
      if (res.code === 200) {
        if (res.data.fileName) {
          setFileName(res.data.fileName)
          setTitleData([
            { name: res.data.fileName },
            { name: history.location.query.surveyName },//, path: menu[0].path 
            { name: getTitleName(history.location.pathname) }
          ])
        } else {
          setTitleData([
            { name: history.location.query.surveyName },//, path: menu[0].path 
            { name: getTitleName(history.location.pathname) }
          ])
        }
      }
    })
  }, [])

  return (
    <div className={styles.container}>
      <Layout>
        <Sider className={styles.sider} theme="light" style={{ width: '70px', position: "fixed", top: "50px", left: "0", bottom: 0, }}>
          {/* <div className={styles.logo}>
            <img src={require("../../../assets/logo.png")} alt="" />
          </div> */}
          <Menu theme="light" mode="inline" onClick={(e: any) => handleClick(e)} selectedKeys={[selectedKey]}>
            {
              menu ? menu.map(({ name, path, icon, iconSel, permissions }) => {
                if (access.canPermissions(permissions)) {
                  if (Icon[icon]) {
                    return <Menu.Item key={path} style={selectedKey.split('/')[3] == path.split('/')[3] ? { color: defaultSettings.primaryColor, background: "#fff", } : ''} icon={React.createElement(Icon[icon], { className: styles.icon })}>{name}</Menu.Item>
                  } else {
                    return <Menu.Item key={path} style={selectedKey.split('/')[3] == path.split('/')[3] ? { color: defaultSettings.primaryColor, background: "#fff", } : ''} icon={<img style={{ width: "24px" }} src={selectedKey === path ? iconSel : icon} />}>{name}</Menu.Item>
                  }
                }
              }) : ""
            }
          </Menu>
        </Sider>
        <Content style={{ margin: '0 -8px 0 62px', boxSizing: "border-box", height: "100%" }}>
          <GeneralBreadcrumb data={titleData} />
          {props.children}
        </Content>
        {/* <Layout className="site-layout"> 
           <Header style={{ background: "#fff", height: '48px' }}><RightContent /> </Header> 
          <Content style={{ margin: '0 16px', padding: "15px 0 20px" }}>
            <GeneralBreadcrumb data={titleData} />
            {props.children}
          </Content>
        </Layout>*/}
      </Layout>
    </div>

  )
}
export default Index