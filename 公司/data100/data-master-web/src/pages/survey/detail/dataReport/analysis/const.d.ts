export const data = [
  {
    
  }
]

export const defaultColumn  = (lie1Node:any,TitleNode:any,emptyNode)=>[
  {
    title:"",
    dataIndex:"lie1",
    render:()=>{
      return lie1Node()
    }
  },
  {
    title:lie2Node,
    dataIndex:"titleNode",
    render:()=>{
      return emptyNode()
    }
  }
]

export const menuList = (handleOk?:object,delReport?:object,type:string,isRefresh:boolean,refreshRandleOk:object)=>{
  let refreshItem = []
  if(isRefresh){
    refreshItem=[{
      access:'list:detail:dataReport:analysis:read' ,//权限标识
      path: '',//页面地址
      menuName:'刷新',//按钮名称
      handleOk:refreshRandleOk,//点击事件
      menuType:"button",
    }]
  }
  if(type =="1"){
    return  [{
        access:'list:detail:dataReport:analysis:read' ,//权限标识
        path: '',//页面地址
        menuName:'查看',//按钮名称
        handleOk:handleOk,//点击事件
        menuType:"button",
      },
      {
        access:'list:detail:dataReport:analysis:del' ,//权限标识
        path: '',//页面地址
        menuName:'删除',//按钮名称
        handleOk:delReport,//点击事件
        menuType:"button",
      },
      ...refreshItem
    ]
  }else{//自定义分析
    return [
      {
        access:'list:detail:dataReport:analysisCustomer:read' ,//权限标识	
        path: '',//页面地址
        menuName:'查看',//按钮名称
        handleOk:handleOk,//点击事件
        menuType:"button",
      },
      {
        access:'list:detail:dataReport:analysisCustomer:del' ,//权限标识
        path: '',//页面地址
        menuName:'删除',//按钮名称
        handleOk:delReport,//点击事件
        menuType:"button",
      },
      ...refreshItem
    ]
  }
 }

 export const analysisMethodsEnum = {
  'npsRule':'NPS',//11个选项的单选题
  'meanRule':'MEAN',//所有题型
  'top3Rule':'TOP3',
  'top2Rule':'TOP2',
  'bottom3Rule':'BOTTOM3',
  'bottom2Rule':'BOTTOM2',
 }

 export const analysisMethodsQtypeEnum = {//方法对应的题型
  'npsRule':{
    type:['5', 'L', '!', 'F'],
    length:11
  },//11个选项的单选题
  'meanRule':{
    type:['all'],//所有题型
  },
  'top3Rule':{
    type:['5', 'L', '!', 'F','A','B'],//单选题
    length:3
  },
  'top2Rule':{
    type:['5', 'L', '!', 'F','A','B'],//单选题
    length:2
  },
  'bottom3Rule':{
    type:['5', 'L', '!', 'F','A','B'],//单选题
    length:3
  },
  'bottom2Rule':{
    type:['5', 'L', '!', 'F','A','B'],//单选题
    length:2
  },
 }
export const weightColumnsData:any =(weightRender:()=>any,titleNode:object)=>[
  {
    dataIndex:"name",
    title:"选项",
    key: 'name',
    width:"200"
  },
  {
    key: 'weight',
    dataIndex:"weight",
    editable:true,
    title:titleNode,
    render:weightRender,
    width:"50"
  },
]

// export const reportStateEnum = {
//   1:'未生成',
//   2:'生成中',
//   3:'生成完毕'
// }
