import React from "react";
import { Typography, Input } from "antd";

const { Title, Text } = Typography;
class Son extends React.Component {
  constructor(props) {
    super(props);
    if (props.onRef) {
      // 如果接收到onRef方法，则调用该方法并传入子组件this指针
      // 子组件this指针被挂载到父组件this.child上
      props.onRef(this); //也可以在componentDidMount使用
    }
  }
  // componentDidMount() {
  //   this.props.onRef(this) // 在这将子组件的实例传递给父组件this.props.onRef()方法，函数组件不可用，它没有实例
  // }
  state = {
    info: "父组件获取子组件的方法和属性",
  };
  handleChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
  clearInput = () => {
    this.setState({
      info: "",
    });
  };
  render() {
    return (
      <div>
        <Title level={4}>{this.state.info}</Title>
        <Title level={4}>{this.state.info}</Title>
        <Input
          style={{ width: "80px" }}
          type="text"
          onChange={this.handleChange}
          value={this.state.info}
        />
      </div>
    );
  }
}
export default Son;
