import React from "react";
import SonText from "./Son-context";
import { Provider } from "./context";
import { Button } from "antd";
class FatherText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "init data",
    };
  }
  change() {
    this.setState({
      info: "change data",
    });
  }
  render() {
    return (
      <Provider value={this.state.info}>
        <div>
          <p>{this.state.info}</p>
          <Button onClick={() => this.change()}>更新</Button>
          <SonText />
        </div>
      </Provider>
    );
  }
}
export default FatherText;
