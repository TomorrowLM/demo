import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
const About = function (props) {
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
  const numbers = [1, 2, 3, 4];
  return (
    <div className={classes.root}>
      <CssBaseline />
      <div>
      <ul onClick={props.handleClick}>
          {numbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
       <button>123</button>
      </div>
    </div>
  );
}
export default About;
