import { parse } from 'querystring';
import md5 from "md5"
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');

  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }

    return parse(href.slice(qsIndex + 1, sharpIndex));
  }

  return {};
};

/**
 * 将对象转换为URL参数（例如：a=1&b=2）
 * @param data 需要转换的对象
 */
export const objToQueryParams = (data: any) => {
  const result: string[] = [];
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((_value) => {
        result.push(`${key}=${_value}`);
      });
    } else {
      result.push(`${key}=${value}`);
    }
  });
  return result.join('&');
}

// 存入树形结构children的id, 回显防止父节点被选中
export const uniqueTree = (data: Array<any>, ids: Array<number>): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const idList: Array<number> = [];
      const requestList = (trData: Array<any>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        trData && trData.forEach(item => {
          if (item.children && item.children.length > 0) {
            requestList(item.children);
          } else {
            idList.push(item.key);
          }
        });
      };
      requestList(data);
      const unTree = (uniqueArr: Array<number>, Arr: Array<number>) => {
        const uniqueChild: number[] = [];
        Arr.forEach(i => {
          uniqueArr.forEach(k => {
            if (k * 1 === i * 1) {
              uniqueChild.push(k);
            }
          })
        })
        return uniqueChild;
      }
      setTimeout(() => {
        resolve(unTree(ids, idList));
      });
    } catch (error) {
      reject(error);
    }
  });
};

// 格式化普通数据为Enum
export const formatDataToEnum = (data: Array<any>, textKey: string, valueKey: string) => {
  const enumObj: object = {};
  data.forEach((item: any) => {
    enumObj[item[valueKey]] = {
      text: item[textKey]
    }
  })
  return enumObj;
};


// 格式化数据字典数据字典为Enum
export const formatDictData = (data: Array<any>) => {
  const dicts: object = {};
  data.forEach((item: any) => {
    const { dictLabel, dictValue, fieldType = '' } = item;
    dicts[dictValue] = {
      text: dictLabel,
      status: fieldType
    }
  })
  return dicts;
};

// 格式化数据
export const formatData = (data: Array<any>, props: any = { id: 'key', label: 'title' }) => {
  const item: Array<any> = [];
  data.forEach((list: any) => {
    const newData: any = {};
    newData[props[Object.keys(props)[0]]] = list[Object.keys(props)[0]];
    newData[props[Object.keys(props)[1]]] = list[Object.keys(props)[1]];;
    item.push(newData);
  });
  return item;
};

/**
 * 格式化树型结构数据
 * @param data
 * @param props
 */
export const assTree = (data: Array<any>, props: any = { id: 'key', label: 'title' }) => {
  const item: Array<any> = [];
  data.forEach((list: any) => {
    const newData: any = {};
    newData[props[Object.keys(props)[0]]] = list[Object.keys(props)[0]];
    newData[props[Object.keys(props)[1]]] = list[Object.keys(props)[1]];;
    newData.children = list.children ? assTree(list.children, props) : [];
    item.push(newData);
  });
  return item;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export const handleTree = (data: Array<object>, id: string, parentId?: any, children?: any, rootId?: string | number): any => {
  const cid = id || 'id'
  const cparentId = parentId || 'parentId'
  const cchildren = children || 'children'
  // eslint-disable-next-line prefer-spread
  const crootId = rootId || Math.min.apply(Math, data.map(item => { return item[cparentId] })) || 0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter((father: { [x: string]: string | number; }) => {
    const branchArr = cloneData.filter((child: { [x: string]: any; }) => {
      // 返回每一项的子级数组
      return father[cid] === child[cparentId]
    });
    if (branchArr.length > 0) {
      // eslint-disable-next-line no-param-reassign
      father[cchildren] = branchArr
    } else {
      // eslint-disable-next-line no-param-reassign
      delete father[cchildren];
    }
    // 返回第一层
    return father[cparentId] === crootId;
  });
  return treeData !== '' ? treeData : data;
}

/**
 * 判断屏幕大小是否为小屏幕模式（width < 576px）
 */
export const isXsScreen = window.document.documentElement.clientWidth < 576;

/**
 * 已知父级的id 获取其children数据
 */
// export const getChildren = (parentArr: any, parentId: any, idName: string, childrenName: string) => {
//   let children
//   parentArr.forEach((element: any) => {
//     if (element[idName] === parentId) {
//       children = element[childrenName]
//     }

//   });
//   return children
// }

/**
 * 格式化枚举{label:string,value:string}
 */
export const formatEnumToOptions = (enumObj: object) => {
  let options = []
  for (var key in enumObj) {
    options.push({
      label: enumObj[key],
      value: key
    })
  }
  return options
}

/**
 * 格式化列表{label:string,value:string}
 * 第一个字段不是唯一 后两个字段确定唯一数据,
 * optionTitle:select组件中option的title
 */
 export const formatListToOptions = (list: Array<any>,lableName:string,valueName:string,valueSecond?:string,optionTitle?:string) => {
  let options:Array<any> = []
  // debugger;
  list.forEach((item:any,index:number)=>{
    if(valueSecond){
      if(optionTitle){
        options.push({...item,label:item[lableName],value:item[valueName]+'-'+item[valueSecond],subtitle:item.title,title:item[optionTitle]})
      }else{
        options.push({...item,label:item[lableName],value:item[valueName]+'-'+item[valueSecond],disabled:false})
      }

    }else{
      options.push({...item,label:item[lableName],value:item[valueName]})
    }

  })
  // console.log(options)
  return options
}

var INPUT_KEY_VALUE = new Date().getTime();
export const  uniKey = ()=> {
  return "key-" + INPUT_KEY_VALUE+Math.floor(Math.random()*10000);
}

export const sign_md5 = ()=>{
  // var D:string = new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")//当前年月日时分秒
  var randomStr:string = new Date().getTime()+''
  // console.log(randomStr,new Date().getTime())
  var sign:string = md5(md5(randomStr)+'DeliverPlatform')
  return `sign=${sign.toLocaleUpperCase()}&random_str=${randomStr}`
}
