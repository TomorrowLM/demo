const oriPushState = history.pushState;

// 重写pushState
history.pushState = function (state, title, url) {
  // 触发原事件
  oriPushState.apply(history, [state, title, url]);
  // 自定义事件
  var event = new CustomEvent("c-popstate", {
    detail: {
      state,
      title,
      url,
    },
  });
  window.dispatchEvent(event);
};

// <c-link to="/" class="c-link">首页</c-link>
class CustomLink extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", (ev) => {
      ev.preventDefault();
      const to = this.getAttribute("to", 45);
      console.log(to, 1);
      // 更新浏览历史记录
      history.pushState("", "", to);
    });
  }
}
window.customElements.define("c-link", CustomLink);

// 优先于c-router注册
// <c-toute path="/" component="home" default></c-toute>
class CustomRoute extends HTMLElement {
  #data = null;
  getData() {
    return {
      default: this.hasAttribute("default"),
      path: this.getAttribute("path"),
      component: this.getAttribute("component"),
    };
  }
}
window.customElements.define("c-route", CustomRoute);

// 容器组件
class CustomComponent extends HTMLElement {
  async connectedCallback() {
    console.log("c-component connected");
    // 获取组件的path，即html的路径
    const strPath = this.getAttribute("path");
    console.log(strPath);
    // 加载html
    const cInfos = await loadComponent(strPath);
    console.log(cInfos);
    const shadow = this.attachShadow({ mode: "closed" });
    // 添加html对应的内容
    this.#addElement(shadow, cInfos);
  }
  #addElement(shadow, info) {
    // 添加模板内容
    if (info.template) {
      shadow.appendChild(info.template.content.cloneNode(true));
    }
    console.log(info.script,'info.script');
    // 添加脚本
    if (info.script) {
      // 防止全局污染，并获得根节点
      var fun = new Function(`${info.script.textContent}`);
      // 绑定脚本的this为当前的影子根节点
      fun.bind(shadow)();
    }
    // 添加样式
    if (info.style) {
      shadow.appendChild(info.style);
    }
  }
}
window.customElements.define("c-component", CustomComponent);

// <c-router></c-router>
class CustomRouter extends HTMLElement {
  #routes;
  connectedCallback() {
    //setTimeout才能拿到dom元素
    setTimeout(() => {
      const routeNodes = this.querySelectorAll("c-route");
      console.log("routes:", routeNodes, document.querySelector("c-route"));
      // 获取子节点的路由信息
      this.#routes = Array.from(routeNodes).map((node) => node.getData());
      console.log(this, this.#routes, 55);
      // 查找默认的路由
      const defaultRoute =
        this.#routes.find((r) => r.default) || this.#routes[0];
      // 渲染对应的路由
      this.#onRenderRoute(defaultRoute);
      // 监听路由变化
      this.#listenerHistory();
    });
  }

  // 渲染路由对应的内容
  #onRenderRoute(route) {
    console.log(route);
    var el = document.createElement("c-component");
    console.log(`./page/${route.component}.html`);
    el.setAttribute("path", `/page/${route.component}.html`);
    el.id = "_route_";
    this.append(el);
  }

  // 卸载路由清理工作
  #onUploadRoute(route) {
    this.removeChild(this.querySelector("#_route_"));
  }

  // 监听路由变化
  #listenerHistory() {
    // 导航的路由切换
    window.addEventListener("popstate", (ev) => {
      console.log("onpopstate:", ev);
      const url = location.pathname.endsWith(".html") ? "/" : location.pathname;
      const route = this.#getRoute(this.#routes, url);
      this.#onUploadRoute();
      this.#onRenderRoute(route);
    });
    // pushStat或replaceSate
    window.addEventListener("c-popstate", (ev) => {
      console.log("c-popstate:", ev);
      const detail = ev.detail;
      console.log(this.#routes, detail.url);
      const route = this.#getRoute(this.#routes, detail.url);
      console.log(route);
      this.#onUploadRoute();
      this.#onRenderRoute(route);
    });
  }

  // 路由查找
  #getRoute(routes, url) {
    console.log(routes, url);
    const data = routes.find(function (r) {
      const path = r.path;
      const strPaths = path.split("/");
      const strUrlPaths = url.split("/");

      let match = true;
      for (let i = 0; i < strPaths.length; i++) {
        if (strPaths[i].startsWith(":")) {
          continue;
        }
        match = strPaths[i] === strUrlPaths[i];
        if (!match) {
          break;
        }
      }
      return match;
    });
    console.log(data);
    return data;
  }
}
window.customElements.define("c-router", CustomRouter);

// 动态加载组件并解析
async function loadComponent(path, name) {
  this.caches = this.caches || {};
  // 缓存存在，直接返回
  // if (!!this.caches[path]) {
  //   return this.caches[path];
  // }
  console.log("CustomElement" + path, 55);
  const res = await fetch("/CustomElement" + path).then((res) => {
    console.log(res);
    return res.text();
  });
  // console.log(res);

  // 利用DOMParser校验
  const parser = new DOMParser();
  const doc = parser.parseFromString(res, "text/html");
  // 解析模板，脚本，样式
  const template = doc.querySelector("template");
  const script = doc.querySelector("script");
  const style = doc.querySelector("style");
  // 缓存内容
  this.caches[path] = {
    template,
    script,
    style,
  };
  return this.caches[path];
}
