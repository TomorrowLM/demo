// 父组件
import React from "react";
import Son from "./Son";
import { Button, Divider } from "antd";
class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  sonRef = (ref) => {
    this.child = ref; // 在这里拿到子组件的实例
  };
  clearSonInput = () => {
    this.child.clearInput();
    // 获取子组件的属性
    console.log(this.child);
  };

  render() {
    return (
      <div>
        <Son onRef={this.sonRef} />
        <br />
        <Button type="primary" onClick={this.clearSonInput}>
          清空子组件
        </Button>
        <Divider />
      </div>
    );
  }
}
export default Father;
