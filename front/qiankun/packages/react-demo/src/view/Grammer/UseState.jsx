import React from "react";
import { Button } from "antd";
import { unstable_batchedUpdates, flushSync } from "react-dom";
export default class UseState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    document
      .getElementsByClassName("btn")[0]
      .addEventListener("click", this.changeVal, false);
  }
  changeVal = () => {
    this.setState({
      count: this.state.count + 1,
    });
    console.log("dom", this.state.count);
  };
  onButtonClick(type) {
    if (type === 1) {
      for (let i = 0; i < 100; i++) {
        this.setState({ count: this.state.count + 1 }, () => {
          console.log("同步回调", this.state.count);
        });
      }
    } else if (type === 2) {
      setTimeout(() => {
        this.setState({
          count: this.state.count + 1,
        });
        console.log("setTimeout", this.state.count);
      });
    } else if (type === 3) {
      setTimeout(
        unstable_batchedUpdates(() => {
          this.setState({
            count: this.state.count + 1,
          });
          this.setState({
            count: this.state.count + 1,
          });
          console.log("unstable_batchedUpdates", this.state.count);
        }),
        1
      );
    } else if (type === 4) {
      //flushSync 允许你强制 React 在提供的回调函数内同步刷新任何更新，这将确保 DOM 立即更新。
      flushSync(() => {
        this.setState({
          count: this.state.count + 1,
        });
      });
      flushSync(() => {
        this.setState({
          count: this.state.count + 1,
        });
      });
    }
    console.log("同步打印", this.state.count);
  }

  render() {
    console.log("render", this.state.count);
    return (
      <div>
        <h1>useState同步异步</h1>
        <h2>异步</h2>
        <Button onClick={this.onButtonClick.bind(this, 1)}>点击</Button>
        <h2>同步</h2>
        <Button onClick={this.onButtonClick.bind(this, 2)}>
          执行setTimeout
        </Button>
        <Button className="btn">dom原生执行</Button>
        <Button onClick={this.onButtonClick.bind(this, 3)}>
          执行setTimeout+unstable_batchedUpdates
        </Button>
        <Button onClick={this.onButtonClick.bind(this, 4)}>flushSync</Button>
        <div>count：{this.state.count}</div>
      </div>
    );
  }
}
