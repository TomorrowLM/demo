import React from "react";
class Child extends React.Component {
  constructor(props){
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <input ref={this.textInput} />
      </div>
    );
  }
}
export default Child;
