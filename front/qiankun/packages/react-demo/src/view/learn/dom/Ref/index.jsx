import React from "react";
import { Button, Input } from "antd";
import Child from "./components/CreateRefCom1";
import { Typography } from "antd";
import CallbackClass from "./components/CallbackClass.jsx";
import CallbackFn from "./components/CallbackFn.jsx";
import CreateRefCom1 from "./components/CreateRefCom1.jsx";
import CreateRefCom2 from "./components/CreateRefCom2.jsx";
import UseRef from "./components/UseRef";
import Different from "./components/Different";
import DifferentAlert from "./components/DifferentAlert";
const { Title, Text } = Typography;
class Ref extends React.Component {
  constructor(props) {
    super(props);
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
    this.ref5 = React.createRef();
    this.ref6 = React.createRef();
    this.change1 = this.change1.bind(this);
  }
  click1 = () => {
    this.ref1.current.click();
  };
  change1 = () => {
    console.log(this.ref2);
  };
  componentDidMount() {
    console.log("========== 回调 ==========");
    console.log("函数回调", this.ref2);
    // this.ref2.focus();
    console.log("类回调", this.ref3);
    // this.ref3.focus();
    console.log("========== createRef ==========");
    console.log("获取元素实例：当 ref 属性用于 HTML 元素时", this.ref5);
    console.log("获取元素实例：当 ref 属性用于自定义 class 组件时", this.ref6);
  }
  render() {
    return (
      <div>
        <Title level={2}>回调：获取元素实例</Title>
        <Title level={5}>函数回调</Title>
        <CallbackFn
          iptRef={(el) => {
            this.ref2 = el;
          }}
        />
        <Title level={5}>类回调</Title>
        <CallbackClass iptRef={(el) => (this.ref3 = el)}></CallbackClass>
        <hr />

        <Title level={2}>createRef</Title>
        {/* // 当 ref 属性用于 HTML 元素时 */}
        <Title level={5}>获取元素实例：当 ref 属性用于 HTML 元素时</Title>
        <input ref={this.ref5}></input>
        {/* //当 ref 属性用于自定义 class 组件时 */}
        <Title level={5}>
          获取元素实例：当 ref 属性用于自定义 class 组件时
        </Title>
        <CreateRefCom1 ref={this.ref6}></CreateRefCom1>

        <Title level={5}>父组件访问子组件方法</Title>
        <Button onClick={this.click1}>点击</Button>
        <CreateRefCom2 ref={this.ref1}></CreateRefCom2>
        <hr />

        <Title level={2}>useRef</Title>
        <UseRef></UseRef>
        <hr />

        <Title level={2}>useRef 和 createRef区别</Title>
        <code>
          createRef 每次渲染都会返回一个新的引用，而 useRef
          在整个组件生命周期保持同一引用
        </code>
        <Different></Different>
        <DifferentAlert></DifferentAlert>
        <hr />
      </div>
    );
  }
}
export default Ref;
