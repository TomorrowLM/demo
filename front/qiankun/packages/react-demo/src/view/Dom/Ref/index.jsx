import React from "react";
import { Button, Input } from "antd";
import Child from "./components/Child";
import FunctionChild from "./components/FunctionChild";
import { Typography } from "antd";
import CallbackRefs from "./components/CallbackRefs";
import FatherWatchChild from "./components/FatherWatchChild";
import UseRef from "./components/UseRef";
import Different from "./components/Different";
import UseRefAlert from "./components/UseRefAlert";
import CreateRefCom from "./components/01-CreateRef";
const { Title, Text } = Typography;
class Ref extends React.Component {
  constructor(props) {
    super(props);
    this.ref1 = React.createRef();
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
    /**回调 */
    console.log("回调,原生 DOM 节点", this.ref2);
    // this.ref2.focus();
    console.log("回调,父组件访问函数子组件的 DOM 节点", this.ref3);
    // this.ref3.focus();
    console.log("回调,父组件访问类子组件的 DOM 节点", this.ref4);
    // this.ref4.focus();
    /**createRef */
    console.log("createRef,HTML 元素", this.ref5);
    console.log("createRef,class 组件", this.ref6.current);
    this.ref6.current.textInput.current.focus();
  }
  render() {
    return (
      <div>
        <Title level={2}>1-回调：将ref注入到子组件中的某个元素上</Title>
        <Title level={5}>原生DOM回调</Title>
        <Input onChange={this.change1} ref={(el) => (this.ref2 = el)} />
        <Title level={5}>函数回调</Title>
        <FatherWatchChild iptRef={(el) => (this.ref3 = el)} />
        <Title level={5}>类回调</Title>
        <CallbackRefs iptRef={(el) => (this.ref4 = el)}></CallbackRefs>
        <hr />

        <Title level={2}>2-createRef</Title>
        <Title level={5}>父组件访问子组件方法</Title>
        <Button onClick={this.click1}>Btn1</Button>
        <CreateRefCom ref={this.ref1}></CreateRefCom>
        {/* // 当 ref 属性用于 HTML 元素时 */}
        <Title level={5}>当 ref 属性用于 HTML 元素时</Title>
        <Input ref={this.ref5}></Input>
        {/* //当 ref 属性用于自定义 class 组件时 */}
        <Title level={5}>当 ref 属性用于自定义 class 组件时</Title>
        <Child ref={this.ref6}></Child>
        {/* 你不能将ref属性用于函数式组件上，因为他们并没有实例（instance） */}
        {/* 但是，你可以在函数式组件内部使用ref属性，就像你引用DOM元素和类组件一样。 */}
        <Title level={5}>
          函数式组件内部中使用createRef属性,并使用forwardRef转发ref
        </Title>
        <FunctionChild></FunctionChild>
        <hr />

        <Title level={2}>3-useRef</Title>
        <UseRef></UseRef>
        <hr />

        <Title level={2}>4-useRef 和 createRef区别</Title>
        <Different></Different>
        <UseRefAlert></UseRefAlert>
        <hr />
      </div>
    );
  }
}
export default Ref;
