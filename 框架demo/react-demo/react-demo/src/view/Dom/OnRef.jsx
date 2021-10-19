import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Father from "../../components/child/onref/Father";
const OnRef = function (props) {
  const useStyles = makeStyles(() => ({
    root: {
      color: "white",
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
        <Father></Father>
      </div>
    </div>
  );
}
export default OnRef;
