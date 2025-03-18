import React from "react";
import { Button } from "antd";

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
    console.log(this.state.count);
  };
  onButtonClick(type) {
    if (type === 1) {
      for (let i = 0; i < 100; i++) {
        this.setState({ count: this.state.count + 1 }, () => {
          console.log("count333333", this.state.count);
        });
      }
    } else if (type === 2) {
      setTimeout(() => {
        this.setState({
          count: this.state.count + 1,
        });
        this.setState({
          count: this.state.count + 1,
        });
        console.log("setTimeout1", this.state.count);
      });
      console.log("count", this.state.count);
      setTimeout(() => {
        console.log("setTimeout2", this.state.count);
      });
    }
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
        <div>count：{this.state.count}</div>
      </div>
    );
  }
}
