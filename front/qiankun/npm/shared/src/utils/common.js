// 动态加载JavaScript文件
function loadScript(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
}

// 动态加载CSS样式表
function loadCSS(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}

// 使用示例
loadScript('https://example.com/my-script.js');
loadCSS('https://example.com/my-style.css');


//是否是图片
function isImage(filename) {
  var imgExtensions = /\.(jpeg|jpg|gif|png|bmp)$/i;
  return imgExtensions.test(filename);
}

// 复制响应，请求参数
/**
 * 
 * @param param 数组
 */
export const copyCode = (param) => {
  // console.log(123, param)
  const arr = []
  const callBack = (data, objParam) => {
    console.log(objParam, 123)
    if (data.children && data.children.length) {
      objParam[data.key] = {}
      data.children.forEach((element) => {
        console.log(element, objParam[data.key])
        callBack(element, objParam[data.key])
      })
    } else {
      objParam[data.key] = data.value
    }
  }
  if (Object.prototype.toString.call(param) === '[object Array]') {
    param.forEach((val, index) => {
      arr[index] = {}
      val.forEach((val1) => {
        console.log(val1, 99);
        callBack(val1, arr[index])
      })
    })
  }
  //TODO  
  else if (Object.prototype.toString.call(param) === '[object object]') {
    arr[0] = {}
    callBack(param, arr[0])
  }

  console.log(arr)
  // navigator.clipboard.writeText(JSON.stringify(arr))
  // Vue.prototype.$notify({ 
  //   message: '复制成功', 
  //   type: 'success', 
  //   duration: 1500 
  // }) 
}

copyCode([[
  {
    "children": [
      {
        "remark": "",
        "type": 1,
        "localId": "53f6d450884911ef86912b8701eb1fe8",
        "value": null,
        "key": "aa",
        "required": false
      }
    ],
    "remark": "",
    "type": 1,
    "localId": "53f6d450884911ef86912b8701eb1fe8",
    "value": null,
    "key": "name",
    "required": false
  }
], [
  {
    "children": [],
    "remark": "",
    "type": 1,
    "localId": "27230a60884a11ef86912b8701eb1fe8",
    "value": null,
    "key": "id1", "children": [
      {
        "remark": "",
        "type": 1,
        "localId": "53f6d450884911ef86912b8701eb1fe8",
        "value": null,
        "key": "aa",
        "required": false
      }
    ],
    "required": true
  }
]])

/**
 * 保留对象格式并复制
 * @param 
 */
export const copy = (codeData) => {
  const textarea = document.createElement('textarea'); // 直接构建textarea  「注意：这里为了实现换行，需要创建textarea，如果用input的话，实现不了换行。」
  const str = JSON.stringify(codeData, null, 2);//第三个参数2表示使用两个空格进行缩进，以保留对象内部的结构
  console.log(str)
  textarea.value = str; // 设置内容    「注意： \r\n 是 换行 符号」
  document.body.appendChild(textarea); // 添加临时实例
  textarea.select(); // 选择实例内容
  document.execCommand('Copy'); // 执行复制
  document.body.removeChild(textarea); // 删除临时实例
  console.log('复制成功!');
}
const exampleObject = {
  key1: "value1",
  key2: "value2",
  key3: [
    "item1",
    "item2"
  ]
};
copy(exampleObject);

/**
 * 监听滚动到底部
 */
const watchBack = () => {
  window.addEventListener('popstate', (e) => {
    console.log('popstate', this.type, e)
    if (this.type == 'page') {
      this.type = 'page'
    }
  }, false)// false阻止默认事件
}

const watchBottom = () => {
  function isScrollAtBottom(container) {
    return container.scrollHeight - container.scrollTop - container.clientHeight < 10
  }
  // 假设你有一个具有id="container"的容器
  const container = document.querySelector('#list')
  console.log(container, 'container')
  container.addEventListener('scroll', $.lodash.debounce(() => {
    console.log(isScrollAtBottom(container))
    if (isScrollAtBottom(container)) {
      console.log('scroll：滚动到底部了！')
      // 在这里执行你需要的操作
      // this.pagination.pageSize = this.pagination.pageSize + 10 ;
      this.getUserWork()
    }
  }, 200))
  container.addEventListener('touchmove', $.lodash.debounce(
    () => {
      console.log(isScrollAtBottom(container))
      if (isScrollAtBottom(container)) {
        console.log('touchmove：滚动到底部了！')
        // 在这里执行你需要的操作
        // this.pagination.pageSize = this.pagination.pageSize + 10 ;
        this.getUserWork()
      }
    }
    , 200))
}

// 将浏览器的前进按钮禁止
// import $ from "jquery";
// $(function () {
//   if (window.history && window.history.pushState) {
//     $(window).on('popstate', function () {
//       // console.log(window.location.href)
//       if (window.location.href.indexOf(window.location.origin + "/wechatpub/surveyOne")>-1) {
//         // console.log(window.location.href,"==========================")
//         window.history.pushState('forward', null, '#');
//         window.history.forward(1);
//       }
//     });
//   }
//   // window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
//   // window.history.forward(1);
// })

import store from '@/store'
/**
 * 随机生成字符串
 * @param  len 字符串长度
 * @create by zqm on 2018-11-1
 */
//  export function nonce_str(len) {
//   len = len || 32;
//   const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /*易混淆的字符oOLl,9gq,Vv,Uu,I1*/
//   const maxPos = $chars.length;
//   let pwd = '';
//   for (var i = 0; i < len; i++) {
//     pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return pwd;
// }
/**
 * md5加密
 * @param  obj 需要md5的内容
 * @return  sign 签名
 * @create by zqm on 2018-11-1
 */
// import md5 from 'js-md5'
// export function exchangeMD5(obj) {
//   var newkey = Object.keys(obj).sort();
//   var newObj = {};
//   for (var i = 0; i < newkey.length; i++) {
//     newObj[newkey[i]] = obj[newkey[i]];
//   }
//   var str = '';
//   for (var key in newObj) {
//     str = str + key + '=' + newObj[key] + "&"
//   }
//   str = str.substr(0, str.length - 1)

//   var stringSignTemp = str + "&key=951d4c42326611e8a17f6c92bf3bb67f"
//   var sign = md5(stringSignTemp).toUpperCase()
//   return sign;
// }


/**
 * 获取url参数
 * @return obj
 */
export function getUrl(href = '') {
  var url = decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.lastIndexOf("?") != -1) {
    var str = url.substring(url.lastIndexOf("?") + 1, url.length);
    const strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
/**
 * 获取url参数
 * @return obj
 */
export function getUrlFirst(href = '') {
  var url = decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.lastIndexOf("?") != -1) {
    var str = url.substring(url.indexOf("?") + 1, url.length);
    const strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
/**
 * 禁止浏览器后退
 * @return null
 */
export function banBack() {
  pushHistory();
  window.addEventListener("popstate", function () {
    pushHistory();
  }, false);
  function pushHistory() {
    var state = {
      title: "title",
      url: "#"
    };
    window.history.pushState(state, "title", "#");
  }
}
// 判断手机是否有下面的小黑条
export function isIPhoneX() {
  var u = navigator.userAgent;
  var isIOS = Boolean(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)); //ios终端
  if (isIOS) {
    if ((window.screen.height == 812 && window.screen.width == 375) || (window.screen.width === 414 && window.screen.height === 896)) { //有底部小黑条
      //是iphoneX(375*812) iphoneXR(414*896) iphoneXS max(414*896)  iphone11(414*896) iphone pro max(414*896)
      return true
    } //没有底部小黑条
    return false

  }
  return false
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 * 除了使用指令，也可以使用函数
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  }
  // console.error(`need roles! Like v-permission="['admin','editor']"`)
  return false

}

