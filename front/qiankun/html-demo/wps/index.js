// 请求参数  
const id = this.getParams('contract_document_id')
const url = window.location.origin + `/qt-wps/files/operate?fileId=${id}&operateType=write`;
console.log(url, 111, this.getParams('id'));
if (!id) {
  document.querySelector('.cus-analysis-example').setAttribute('src', window.serverAPI.EAP_APP_API_URL + '/base-service/file/preview?id=1813023420190990336&appId=1806238373194694656')
  return;
}
const config = {
  url,
  method: 'get', //默认get  
  headers: {}, // 请求头  
  params: {}, // GET请求时参数  
  data: {}, // POST请求时参数  
  responseType: 'json' //默认返回json  
};
// 公用请求  
let link;
new Promise(resolved => {
  resolved(this.$eapHttp(config))
}).then(async res => {
  link = res.data.link;
  const instance = await WebOfficeSDK.config({
    url: link, // 该地址需要对接方服务端提供，形如 https://wwo.wps.cn/office/p/xxx 
    mount: document.querySelector('.cus-wps-box'),
    mode: 'simple',
    wordOptions: {
      isShowDocMap: false, // 是否开启目录功能，默认开启 
      isBestScale: true, // 打开文档时，默认以最佳比例显示 
      isShowBottomStatusBar: false, // 是否展示底部状态栏 
      mobile: {
        // isOpenIntoEdit: false, // （Mobile）要有编辑权限，移动端打开时是否进入编辑 
        // isShowHoverToolbars: false, // （Mobile）是否显示文字底部工具栏 
        // isVoiceCommentEnabled: false, // （Mobile）是否允许插入语音评论 
        // showFontDownloadNotice: false // （Mobile）是否显示字体下载提示 
      }
    }
  })
  //初始化 
  await instance.ready()
  const app = instance.Application;
  // 对文档窗口大小进行调整后，是否缩放视图以适应文档窗口的尺寸 
  app.ActiveDocument.ActiveWindow.View.Zoom.PageFit = 2;
  // 评论对象  
  const comments = await app.ActiveDocument.Comments;
  // 获取修订对象  
  const revisions = await app.ActiveDocument.Revisions;
  console.log('修订', revisions);
  const commentsInfo = [
    {
      // Range: { 
      //   Start: 0, 
      //   End: 9 
      // }, 
      searchText: '三',//文本内容 
      index: 1,//索引 
      commentText: 'WebOffice 评论',//评论 
      revision: '四'
    }
  ]
  // 是否有评论  
  const hasComments = await app.ActiveDocument.HasComments();
  let rightDom = '';// 

  for (let i = 0; i < commentsInfo.length; i++) {
    //搜索文本  
    await app.ActiveDocument.Find.Execute(commentsInfo[i].searchText, false).then(async res => {
      console.log(res);
      // const range = app.ActiveDocument.Range.SetRange(res.pos, res.pos + res.len); 
      commentsInfo[i].Range = {
        Start: res[commentsInfo[i].index].pos,
        End: res[commentsInfo[i].index].pos + res[commentsInfo[i].index].len
      }
      // 获取选中区域  
      const range = await app.ActiveDocument.Range(commentsInfo[i].Range.Start, commentsInfo[i].Range.End);
      // 字体对象  
      const font = await app.ActiveDocument.Range(commentsInfo[i].Range.Start, commentsInfo[i].Range.End).Font;
      font.Color = '#000';
      // 设置选定文字的背景颜色  
      font.HighLight = '#F78C6C';
      rightDom += `<li>${i}<a type=1 index=${i}>跳转</a ><a type=2 index=${i}>修订</a ></li>`;
    });
  }
  // setTimeout(async () => { 
  //   console.log(55); 
  //   for (let i = 0; i < commentsInfo.length; i++) { 
  //     // 字体对象  
  //     const font = await app.ActiveDocument.Range(commentsInfo[i].Range.Start, commentsInfo[i].Range.End).Font; 
  //     console.log(font, 123, commentsInfo[i].Range); 
  //     font.Color = '#F78C6C'; 
  //     // 设置选定文字的背景颜色  
  //     font.HighLight = '#F78C6C'; 
  //   } 
  // }, 10); 
  console.log(commentsInfo); //TODO: 异步 
  if (!hasComments) {
    // 添加评论  
    commentsInfo.forEach(async val => {
      await comments.Add({
        Range: val.Range,
        Text: val.commentText
      });
    })
  } else {
    console.log('有评论');
    // 删除文档内的所有评论  
    // await app.ActiveDocument.DeleteAllComments()  
  }

  // 获取全文评论  
  // const operatorsInfo = await app.ActiveDocument.GetComments({ Offset: 0, Limit: null }); 


  // operatorsInfo.forEach(val => { 
  //   console.log(val); 
  //   rightDom += `<li>${val.rcId}<a  id=${val.rcId}>跳转</a ></li>` 
  // }) 
  document.querySelector('.cus-wps-right').innerHTML = rightDom;
  document.querySelector('.cus-wps-right').addEventListener('click', async (event) => {
    var target = event.target || event.srcElement;
    console.log(target, target.getAttribute('index'));
    const index = target.getAttribute('index')
    const type = target.getAttribute('type')
    if (type === '1') {
      //跳转 
      const range = await app.ActiveDocument.Range.SetRange(commentsInfo[index].Range.Start, commentsInfo[index].Range.End);
      await app.ActiveDocument.ActiveWindow.ScrollIntoView(range);
      // 字体对象  
      // const font = await app.ActiveDocument.Range.SetRange(commentsInfo[index].Range.Start, commentsInfo[index].Range.End).Font; 
      // console.log(font); 
      // font.Color = '#000'; 
      // // 设置选定文字的背景颜色  
      // font.HighLight = '#F78C6C'; 
    } else {
      //修订 
      // 获取选中区域  
      const range = await app.ActiveDocument.Range(commentsInfo[index].Range.Start, commentsInfo[index].Range.End);
      console.log('range', range);
      // 设置文本  
      range.Text = '四';
      // 字体对象  
      const font = await app.ActiveDocument.Range.SetRange(commentsInfo[index].Range.Start, commentsInfo[index].Range.End).Font;
      font.Color = '#000';
      // 设置选定文字的背景颜色  
      font.HighLight = '#05aae1';
    }
    // 获取range  
    // const range = await app.ActiveDocument.Range.SetRange(122, 123); 
    // console.log(range) 

    // 滚动文档窗口, 显示指定的区域  
    // await app.ActiveDocument.ActiveWindow.ScrollIntoView(range)  
    // 搜索并高亮文本  
    // await app.ActiveDocument.Find.Execute('三', true).then(async res => { 
    //   console.log(res); 
    // }); 

  }, false);
});
