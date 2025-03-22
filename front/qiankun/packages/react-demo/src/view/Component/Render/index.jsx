import React from "react";
import SonCom from "./components/Son";
import SonFn from "./components/SonFn";
import { Button, Typography } from "antd";
const { Title, Text } = Typography;
class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructor: father!");
    this.state = {
      name: "father1",
    };
  }
  componentDidMount() {
    console.log("father Component did mount!");
  }
  handleClick1() {
    this.setState({
      data: "1",
    });
  }
  handleClick2() {
    this.setState({
      name: "father2",
    });
  }
  render() {
    console.log("Render: father!");
    return (
      <div>
        <Title level={2}>render机制</Title>
        <Button
          onClick={() => {
            this.handleClick2();
          }}
        >
          prop更新子组件
        </Button>
        <SonCom name={this.state.name}></SonCom>
        <SonFn name={this.state.name}></SonFn>
        <Title level={2}>PureComponent和memo</Title>
        PureComponent：类子组件不会更新 memo：函数子组件不会更新
        <Button
          onClick={() => {
            this.handleClick1();
          }}
        >
          father
        </Button>
      </div>
    );
  }
}

export default ExampleComponent;
