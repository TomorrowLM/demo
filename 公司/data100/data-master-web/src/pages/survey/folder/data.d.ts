import {ChangeEvent} from "react";


export const menuList =(handleOk?:object,search:string,show:boolean)=>[
  // export const menuList =[
  {
    access:'folder:exportData' ,//权限标识
    path: '/survey/list/exportData',//页面地址
    menuName:'导出数据列表',//按钮名称
    search:search,
    // handleOk:null,//点击事件
    menuType:"url",
  },
  {
    access:'folder:projectInfo' ,//权限标识
    path: '/list/detail/data',//页面地址
    menuName:'项目资料',//按钮名称
    search:search,
    // handleOk:null,//点击事件
    menuType:"url",
  },
  {
    access:'folder:dataCleean' ,//权限标识
    path: '/list/detail/clean',//页面地址
    menuName:'数据清洗',//按钮名称
    search:search,
    // handleOk:null,//点击事件
    menuType:"url",
  },
  {
    access:'folder:dataReport' ,//权限标识
    path: '/list/detail/dataReport',//页面地址
    menuName:'数据报告',//按钮名称
    search:search,
    // handleOk:null,//点击事件
    menuType:"url",
  },
  {
    access:'folder:wordReport' ,//权限标识
    path: '/list/detail/report',//页面地址
    menuName:'文字报告',//按钮名称
    search:search,
    // handleOk:null,//点击事件
    menuType:"url",
  },
  {
    access:'folder:cardManagers' ,//权限标识
    path: '',//页面地址
    menuName:'管理成员',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
  {
    access:'folder:cardRename' ,//权限标识
    path: '',//页面地址
    menuName:'重命名',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
  {
    access:show ,//权限标识
    path: '',//页面地址
    menuName:'移动卡片',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
  {
    access:'folder:removeCard' ,//权限标识
    path: '',//页面地址
    menuName:'删除卡片',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
]
export const folderMenuList =(handleOk?:object,search:string,)=>[
  // export const menuList =[
  {
    access:'folder:openFolder' ,//权限标识
    path: '/folder/detail',//页面地址
    menuName:'打开',//按钮名称
    search:search,
    // handleOk:handleOk,//点击事件
    menuType:"url",
  },
  {
    access:'folder:folderRename' ,//权限标识
    path: '',//页面地址
    menuName:'重命名',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
  {
    access:'folder:manager' ,//权限标识
    path: '',//页面地址
    menuName:'管理成员',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
  {
    access:'folder:folderDelete' ,//权限标识
    path: '',//页面地址
    menuName:'删除',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },
]
export interface CardItemProps {
  folderName?: string;

  iconUrl?: string;

  creatTime?: string;

  creatName?: string;

  isEdit?: boolean;

  itemIndex?: number;

  folderId?:string;

  folderType?:number; // 1文件夹，2项目

  progressPercet?:number;
  surveyGroup?:string;
  surveyName?:string;
  sid?:string;
  isContainCards?:string;
  showMove:boolean;
}

export interface CardProps {
  item?:CardItemProps;
  deleteItem?: () => any;
  checkoutDataList?: () => any;
  manageMember?:() => any;
  projectData?:() => any;
  cleanData?:() => any;
  dataReport?:() => any;
  wordReport?:() => any;
  removeProject?:() => any;
  deleteFolderItem?:(item:CardItemProps) => any;
  manageMembers?:(item:CardItemProps) => any;
  moveProjectItem?:(item:CardItemProps) => any;
  moveTofolder?:(folderId:string) => any;
  dragProjectItem?:(item:CardItemProps) => any;
}
// 防抖函数
export const debounce = (fn:(value:string) => any,delay:number) => {
  let timer;
  let valueStr;
  return (e:ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    valueStr=e.target.value;
      clearTimeout(timer);

      timer = setTimeout(()=>{

        fn(valueStr);
      },delay);
  }
}
