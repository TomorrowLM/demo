
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