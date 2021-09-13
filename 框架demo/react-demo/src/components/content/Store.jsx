import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { increment, decrement } from "../../store/actions/counter";
const Store = function (props) {
  const useStyles1 = makeStyles(() => ({
    root: {
      color: "white",
      height: 1000,
      padding: "50px 50px",
      margin: "20px 0",
      background: "#3bd0725e",
    },
  }));
  const classes1 = useStyles1();

  const useStyles2 = makeStyles({
    // style rule
    foo: (props) => ({
      width: 100,
      height: 100,
      backgroundColor: props.backgroundColor,
    }),
    bar: {
      // CSS property
      color: (props) => props.color,
      marginBottom: 10,
    },
  });
  const style2 = { backgroundColor: "black", color: "white" };
  const classes2 = useStyles2(style2);

  const { count, onincrement, ondecrement} = props;
  
  return (
    <div className={classes1.root}>
      <CssBaseline />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={onincrement}
        >
          increment
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={ondecrement}
          style={{marginLeft:'30px'}}
        >
          decrement
        </Button>
        <p style={{fontSize:'30px'}}>{count}</p>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  console.log(state)
  return {
    count: state.counter.count,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onincrement: () => dispatch(increment()),
    ondecrement: () => dispatch(decrement())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Store);
