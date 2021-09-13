import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Father from "../child/communicate/Father.jsx";
import FatherText from "../child/communicate/Father-context";
import React from "react";
const Communicate = function (props) {
  const useStyles = makeStyles(() => ({
    root: {
      color: "black",
      height: 1000,
      padding: "50px 50px",
      margin: "20px 0",
      background: "#3bd0725e",
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <div>
        <div>
          <h1>子组件传父组件</h1>
          <Father></Father>
        </div>
        <div>
          <h1>
            Context:适用于跨层级组件之间通信
          </h1>
          <FatherText></FatherText>
        </div>
      </div>
    </div>
  );
}
export default Communicate;
