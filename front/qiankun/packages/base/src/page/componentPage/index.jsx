import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import r2wc from "@r2wc/react-to-web-component";
import { BrowserRouter as Router } from "react-router-dom";

import Page1 from "./page1.jsx";
import Page2 from "./page2.jsx";

function MainPage() {
  return (
    <div>
      <Router>
        <Com1 />
        {/* <Com2 /> */}
      </Router>
    </div>
  );
}
function Com1() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const location = useLocation();
  const [pageCom, setPageCom] = useState(<Page1 />);
  React.useEffect(() => {
    console.log("路由变化了", location); // 你可以在这里访问新的location对象
    if (location.pathname.includes("page1")) {
      setPageCom(<Page1 />);
    } else if (location.pathname.includes("page2")) {
      setPageCom(<Page2 />);
    }
    console.log(pageCom, "pageCom");
  }, [location]); // 依赖项是location，这样每当location改变时，effect就会重新运行
  const handleClick = () => {
    setCount(count + 1);
    navigate("/qiankun/vue2-pc/page2", {
      replace: false,
      state: { a: 1, b: 2 },
    });
  };
  return (
    <>
      <h1>这是主应用的Header</h1>
      <img src="../assets/123.png" alt="" />
      <img src="../assets/4.gif" alt="" />
      <button onClick={handleClick}>count is: {count}</button>
      <div className="pageCom">{pageCom}</div>
    </>
  );
}
let MainPageCom = r2wc(MainPage);
customElements.define("main-page-com", MainPageCom);
// 创建React组件
function ComponentPage() {
  return <div className="App">5581</div>;
}

// 创建Web Component类
class ReactComponentPage extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    ReactDOM.render(<ComponentPage />, mountPoint);
  }

  disconnectedCallback() {
    const mountPoint = this.shadowRoot.firstChild;
    ReactDOM.unmountComponentAtNode(mountPoint);
  }
}

// 注册Web Component
if (!customElements.get("react-component-page")) {
  customElements.define("react-component-page", ReactComponentPage);
}

export default ComponentPage;
