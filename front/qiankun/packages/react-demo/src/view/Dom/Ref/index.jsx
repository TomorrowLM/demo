import React from "react";
import Child from "./components/Child";
import FunctionChild from "./components/FunctionChild";
import { Typography } from "antd";
import CallbackRefs from "./components/CallbackRefs";
import FatherWatchChild from "./components/FatherWatchChild";
import UseRef from "./components/UseRef";
import Different from "./components/Different";
import UseRefAlert from "./components/UseRefAlert";
const { Title,Text } = Typography;
class Ref extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    // 回调
    console.log("函数回调,原生 DOM 节点", this.iptElmDom);
    // this.iptElmDom.focus();
    console.log("函数回调,父组件访问函数子组件的 DOM 节点", this.iptElm);
    // this.iptElm.focus();
    console.log("函数回调,父组件访问类子组件的 DOM 节点", this.iptElmClass);
    // this.iptElmClass.focus();
    // createRef
    console.log("createRef,HTML 元素", this.myRef);
    console.log("createRef,class 组件", this.inputRef.current);
    this.inputRef.current.textInput.current.focus();
  }
  render() {
    return (
      <div>
         <Title level={2}>回调</Title>

        <Title level={2}>回调</Title>
        <Title level={5}>原生DOM回调</Title>
        <input ref={(el) => (this.iptElmDom = el)} />
        <Title level={5}>函数回调</Title>
        <FatherWatchChild iptRef={(el) => (this.iptElm = el)} />
        {/* 回调引用（callback refs） */}
        <Title level={5}>类回调</Title>
        <CallbackRefs iptRef={(el) => (this.iptElmClass = el)} ></CallbackRefs>
        <hr />

        <Title level={2}>createRef</Title>
        {/* // 当 ref 属性用于 HTML 元素时 */}
        <Title level={5}>当 ref 属性用于 HTML 元素时</Title>
        <input ref={this.myRef}></input>
        {/* //当 ref 属性用于自定义 class 组件时 */}
        <Title level={5}>当 ref 属性用于自定义 class 组件时</Title>
        <Child ref={this.inputRef}></Child>
        {/* 你不能将ref属性用于函数式组件上，因为他们并没有实例（instance） */}
        {/* 但是，你可以在函数式组件内部使用ref属性，就像你引用DOM元素和类组件一样。 */}
        <Title level={5}>
          函数式组件内部中使用createRef属性,并使用forwardRef转发ref
        </Title>
        <FunctionChild></FunctionChild>
        <hr />

        <Title level={2}>useRef</Title>
        <UseRef></UseRef>
        <hr />

        <Title level={2}>useRef 和 createRef区别</Title>
        <Different></Different>
        <UseRefAlert></UseRefAlert>
        <hr />
      </div>
    );
  }
}
export default Ref;
