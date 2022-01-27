import React from "react";
import { Button, Typography, Divider } from "antd";
import ReactDOM, { unstable_batchedUpdates } from "react-dom";

const { Title } = Typography;
class ClassHooks extends React.Component {
  constructor(props) {
    super(props);
    // 记录 render 的执行次数
    this.renderCount = 0;
    this.handleClick1 = this.handleClick1.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
  }
  state = {
    number: 1,
    counter: 1,
    flag: false,
  };
  componentDidMount() {
    this.setState({ number: 3 });
    console.log(this.state.number);
    this.setState({ number: 4 }, () => {
      console.log(this.state.number);
    });
  }
  handleClick1() {
    console.log(11111);
    //同一个点击事件中有两个状态更新，React 总是将它们分批处理到一个重新渲染中
    this.setState((prevState, props) => ({
      counter: prevState.counter + 1,
    })); // 不重新渲染
    this.setState((prevState, props) => ({
      counter: prevState.counter + 1,
    })); // 不重新渲染
    // React 只会在最后重新渲染一次（这是批处理！）
  }
  handleClick2() {
    // 模拟一个异步操作，真实业务里面可能是网络请求等
    setTimeout(() => {
      //同一个点击事件中有两个状态更新，React 总是将它们分批处理到一个重新渲染中
      this.setState((prevState, props) => ({
        counter: prevState.counter + 1,
      })); // 不重新渲染
      this.setState((prevState, props) => ({
        counter: prevState.counter + 1,
      })); // 不重新渲染
      // React 只会在最后重新渲染一次（这是批处理！）
    }, 0);
  }
  handleClick3() {
    // 模拟一个异步操作，真实业务里面可能是网络请求等
    setTimeout(
      unstable_batchedUpdates(() => {
        this.setState((prevState, props) => ({
          counter: prevState.counter + 1,
        })); // 不重新渲染
        this.setState((prevState, props) => ({
          counter: prevState.counter + 1,
        })); // 不重新渲染
      }),
      0
    );
  }
  render() {
    return (
      <div>
        <div>
          <Title level={2}>setstate</Title>
        </div>
        <Divider />
        <Title level={4}>批量处理batchUpdate</Title>
        <div>
          <h1> {this.state.counter} </h1>
          <Button onClick={this.handleClick1}> 同步的 setState 两次 </Button>
          <Button onClick={this.handleClick2}>
            在一个异步的事件循环里 setState 两次
          </Button>
          <Button onClick={this.handleClick3}>
            在一个异步的事件循环里 setState 两次, 但是使用
            ReactDOM.unstable_batchedUpdates 强制 batch
          </Button>
        </div>
      </div>
    );
  }
}

export default ClassHooks;
