console.log(); 
// 请求参数 
const url = window.location.origin + `/qt-wps/files/operate?fileId=1811061490312192000&operateType=write`; 
console.log(url); 
const config={  
  url,  
  method:'get', //默认get 
  headers:{}, // 请求头 
  params: {}, // GET请求时参数 
  data:{}, // POST请求时参数 
  responseType:'json' //默认返回json 
}; 
// 公用请求 
let link; 
new Promise(resolved=>{ 
  resolved(this.$eapHttp(config)) 
}).then(async res=>{ 
  console.log(res); 
  link = res.data.link; 
  console.log(link); 
  const instance =await WebOfficeSDK.config({ 
    url: link, // 该地址需要对接方服务端提供，形如 https://wwo.wps.cn/office/p/xxx 
    mount: document.querySelector('.cus-wps-box'), 
    mode: 'nomal', 
  }) 
  await instance.ready() 
  const app = instance.Application; 
  console.log(app,111,app.ActivePresentation); 
  // 评论对象 
  const comments = await app.ActiveDocument.Comments; 
  console.log(comments); 
// 获取修订对象 
  const revisions = await app.ActiveDocument.Revisions; 
console.log('修订',revisions); 
  const commentsInfo = [ 
    { 
      Range: { 
        Start: 0, 
        End: 9 
      }, 
      Text: 'WebOffice 评论' 
    } 
  ] 
  // 是否有评论 
  const hasComments = await app.ActiveDocument.HasComments(); 
 
  if(!hasComments){ 
    // 添加评论 
    commentsInfo.forEach(async val=>{ 
      await comments.Add(val); 
    }) 
  }else{ 
    console.log('有评论'); 
    // 删除文档内的所有评论 
  // await app.ActiveDocument.DeleteAllComments() 
  } 
    commentsInfo.forEach(async val=>{ 
      console.log('range',); 
     // 获取选中区域 
      const range =  app.ActiveDocument.Range(val.Range.Start, val.Range.End); 
      // 设置文本 
      range.Text = 'WebOffice11'; 
        // 字体对象 
    const font = await app.ActiveDocument.Range(val.Range.Start, val.Range.End).Font; 
   
  // 设置选定文字的字体颜色 
    font.Color = '#05aae1'; 
    font.HighLight = '#05aae1'; 
    }) 
  let rightDom = '' 
  // 获取全文评论 
  const operatorsInfo = await app.ActiveDocument.GetComments({ Offset: 0, Limit: null }); 
  console.log(operatorsInfo); 
   
  operatorsInfo.forEach(val=>{ 
    console.log(val); 
    rightDom+=`<li>${val.rcId}<a  id=${val.rcId}>跳转</a ></li>` 
  }) 
  document.querySelector('.cus-wps-right').innerHTML = rightDom; 
  document.querySelector('.cus-wps-right').addEventListener('click', async (event)=>{ 
            var target = event.target || event.srcElement; 
          console.log(target,target.getAttribute('id'),comments); 
      // 获取range 
  const range = await app.ActiveDocument.Range.SetRange(122,123); 
  console.log(range) 
 
  // 滚动文档窗口, 显示指定的区域 
  // await app.ActiveDocument.ActiveWindow.ScrollIntoView(range) 
    // 搜索并高亮文本 
  await app.ActiveDocument.Find.Execute('三', true).then(async res=>{ 
    console.log(res); 
    const range = await app.ActiveDocument.Range.SetRange(res[1].pos,res[1].pos+res[1].len); 
    await app.ActiveDocument.ActiveWindow.ScrollIntoView(range) 
  }); 
  
  // 查找对象 
  const Find = await app.ActiveDocument.Find; 
  console.log(Find.Execute('三', false)); 
  },false); 
 
}); 
 
 