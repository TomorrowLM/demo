import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
const Users1 = function (match) {
  const useStyles = makeStyles(() => ({
    root: {
      color: "white",
      height: 1000,
      padding: "0 50px",
      margin: "20px 0",
      background: "#3bd0725e",
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <div>
        <button>{window.location.hash}</button>
      </div>
    </div>
  );
}
export default Users1;
