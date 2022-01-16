import React, { useState } from "react";
import useCounterModel from "../../hox/CreateModal";
import { Button } from "antd";
import { Typography, Divider } from "antd";

const { Title, Text } = Typography;
export default function AddTodo(props) {
  const { countHox, increment, decrement } = useCounterModel();
  console.log(countHox);
  return (
    <div>
      <div>
        <Text type="success">{countHox}</Text>
        <div>
          <Button onClick={decrement}>-1</Button>
          <Button onClick={increment}>+1</Button>
        </div>
      </div>
      <Divider />
    </div>
  );
}
