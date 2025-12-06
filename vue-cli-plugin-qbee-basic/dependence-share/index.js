const shareObj = {};
const keyInLocalStorage = `share-key-${location.origin}-${location.pathname}`;

/**
 * 追加js注入脚本
 * @param {*} url
 */
shareObj.prependScript = function (url) {
  document.write(`\<script src="/layout/share/${url}"\>\<\/script\>`);
};

/**
 * 追加css注入脚本
 * @param {*} url
 */
shareObj.prependLink = function (url) {
  document.write(`\<link rel="stylesheet" href="/layout/share/${url}"/\>`);
};

/**
 * 展示加载失败页面
 */
shareObj.showFailedTip = function () {
  document.close();
  document.write(
    `<div style="position:fixed;left:0;top:0;bottom:0;right:0;z-index:99;display:flex;justify-content: center;align-items: center;">
            <div>
              <img src="/layout/img/data_error.svg" style="width: 150px;display: block;margin: 0 auto;"/>
              <span style="line-height: 20px!important;color: rgba(34,34,34,.55);font-size: 14px;margin-top: 20px;display: inline-block;">基础依赖加载失败，
                <span onClick="shareObj.reload()" style="color: #697dff;cursor: pointer;">点击重试</span></span>
            </div>
          </div>`
  );
};

/**
 * 重新加载页面
 */
shareObj.reload = function () {
  location.reload();
};

/**
 * 获取layout清单文件
 * @returns
 */
shareObj.getShareManifest = function () {
  const fetchPromise = fetch(
    `/layout/share/share-manifest.json?t=${new Date().getTime()}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject("response ok is false");
      }
    })
    .then((data) => {
      try {
        return Promise.resolve(data.entrypoints.share.assets);
      } catch (error) {
        return Promise.reject(error);
      }
    })
    .catch((e) => {
      return Promise.reject(e);
    });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("time out");
    }, 2000);
  });
  Promise.race([fetchPromise, timeoutPromise])
    .then((data) => {
      // 清单文件加载成功后，缓存到本地，触发页面重新加载
      localStorage.setItem(keyInLocalStorage, JSON.stringify(data));
      location.reload();
    })
    .catch((error) => {
      console.error("fetch layout manifest error: ", error);
      shareObj.showFailedTip();
    });
};

// 入口，仅在非微前端模式运行下
if (!window.singleSpaNavigate) {
  const manifestCache = localStorage.getItem(keyInLocalStorage);
  if (manifestCache) {
    localStorage.removeItem(keyInLocalStorage);
    // 有缓存的情况下直接使用
    JSON.parse(manifestCache).forEach((url) => {
      if (url.endsWith(".css")) {
        shareObj.prependLink(url);
      } else if (url.endsWith(".js")) {
        shareObj.prependScript(url);
      }
    });
  } else {
    // 没有缓存的情况下去加载清单文件
    shareObj.getShareManifest();
  }
}
