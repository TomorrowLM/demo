import React from "react";
import { Typography } from "antd";
const { Title } = Typography;
class ClassHooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1,
    };
  }
  componentDidMount() {
    this.setState({ number: 3 });
    console.log(this.state.number);
    this.setState({ number: 4 }, () => {
      console.log(this.state.number);
    });
  }
  render() {
    return (
      <div>
        <div>
          <Title level={2}>setstate</Title>
        </div>
      </div>
    );
  }
}

export default ClassHooks;
