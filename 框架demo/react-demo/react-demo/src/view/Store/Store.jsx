import { Button } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { increment, decrement } from "../../store/actions/counter";
const Store = function (props) {
  const { count, onincrement, ondecrement } = props;
  return (
    <div>
      <div>
        <Button variant="contained" color="primary" onClick={onincrement}>
          increment
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={ondecrement}
          style={{ marginLeft: "30px" }}
        >
          decrement
        </Button>
        <p style={{ fontSize: "30px" }}>{count}</p>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  console.log(state);
  return {
    count: state.counter.count,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onincrement: () => dispatch(increment()),
    ondecrement: () => dispatch(decrement()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Store);
