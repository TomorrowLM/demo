# 对象

> 数据一一复制到响应式对象中

```
function checkedType(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
const replaceFormfield = (data, replaceData) => {
  // // let result;
  // if (checkedType(replaceData) === 'Object') {
  //   // data = {};
  // } else if (checkedType(replaceData) === 'Array') {
  //   // data = [];
  // } else {
  //   return data ?? replaceData;
  // }
  // console.log(data, replaceData);
  for (let i in replaceData) {
    console.log(i, replaceData[i], checkedType(replaceData[i]) === 'Object' || checkedType(replaceData[i]) === 'Array');
    if (checkedType(replaceData[i]) === 'Object' || checkedType(replaceData[i]) === 'Array') {
      console.log(data[i]);
      replaceFormfield(data[i], replaceData[i]);
    } else {
      console.log(data?.[i], replaceData?.[i]);
      replaceData[i] = data?.[i] ?? replaceData?.[i];
    }
  }
  // return data;
};
```

# URL

> url param转对象

```
function get_parse_link(link){
// new URL().searchParams 得到的是一个 URLSearchParams 对象
const urlObj = new URL(link);
const urlSearchParams = urlObj.searchParams;
// 配合 Object.fromEntries 将查询参数转换为对象
const paramObj = Object.fromEntries(urlSearchParams);
return paramObj
}
```

# cookie

> cookie

```
if (!navigator.cookieEnabled && window.location.href.includes('login')) {
console.log(window.location,window.parent.frames[0])
alert("您的浏览器限制了第三方Cookie，这将影响您正常登录，您可以更改浏览器的隐私设置，解除限制后重试。");
}
```

