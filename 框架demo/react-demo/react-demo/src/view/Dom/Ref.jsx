import React from "react";
import Child from "../../components/Dom/Ref/Child";
import FunctionChild from "../../components/Dom/Ref/FunctionChild";
import { Typography } from "antd";
import CallbackRefs from "../../components/Dom/Ref/CallbackRefs";
import FatherWatchChild from "../../components/Dom/Ref/FatherWatchChild";
import UseRef from "../../components/Dom/Ref/UseRef";
import Different from "../../components/Dom/Ref/Different";
import UseRefAlert from "../../components/Dom/Ref/UseRefAlert";
const { Title } = Typography;
class Ref extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    console.log("createRef,HTML 元素", this.myRef);
    console.log("createRef,自定义 class 组件", this.inputRef.current);
    console.log("函数回调,父组件访问子组件的 DOM 节点", this.iptElm);
  }
  render() {
    return (
      <div>
        <Title level={2}>createRef</Title>
        {/* // 当 ref 属性用于 HTML 元素时 */}
        <Title level={5}>当 ref 属性用于 HTML 元素时</Title>
        <input ref={this.myRef}></input>
        {/* //当 ref 属性用于自定义 class 组件时 */}
        <Title level={5}>当 ref 属性用于自定义 class 组件时</Title>
        <Child ref={this.inputRef}></Child>
        {/* 你不能将ref属性用于函数式组件上，因为他们并没有实例（instance） */}
        {/* 但是，你可以在函数式组件中使用ref属性，就像你引用DOM元素和类组件一样。 */}
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

        <Title level={2}>回调</Title>
        <Title level={5}>函数回调</Title>
        <FatherWatchChild iptRef={(el) => (this.iptElm = el)} />
        {/* 回调引用（callback refs） */}
        <Title level={5}>类回调</Title>
        <CallbackRefs></CallbackRefs>
        <hr />
      </div>
    );
  }
}
export default Ref;
