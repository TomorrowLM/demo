import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { increment, decrement } from "../../../store/actions/counter";
import store from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import request from "@/utils/request";
import { userInfo } from "../../../store/actions/userInfo";
import useCounterModel from "../../../hox/CreateModal";
import { Typography, Divider } from "antd";

const { Title, Text } = Typography;
const Store = function (props) {
  const { count, onincrement, ondecrement, info, getuserInfo } = props;
  const dispatch = useDispatch();
  const countSelector = useSelector((state) => state.counter.count);
  //获取hox
  const { countHox, increment, decrement } = useCounterModel();
  useEffect(() => {
    // console.log(store, store.getState(), countSelector);
    // onincrement();
    // dispatch(increment())
    // store.dispatch(increment())
    request.get("/users").then((res) => {
      const action = userInfo(res.data.data);
      console.log(res.data.data);
      // getuserInfo(action);
      // store.dispatch(action);
    });
  }, []);
  return (
    <div>
      <Title level={4}>couter例子</Title>
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
      <Divider />
      <Title level={4}>获取user信息，并存储到store</Title>
      <div>
        <Text type="success">{info ? info.name : "undefine"}</Text>
      </div>
      <Divider />
      <Title level={4}>测试hox修改后显示的值</Title>
      <div>
        <Text type="success">{countHox}</Text>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    count: state.counter.count,
    info: state.userInfo,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onincrement: () => dispatch(increment()),
    ondecrement: () => dispatch(decrement()),
    getuserInfo: (action) => dispatch(action),
  };
}
// 使用connect高阶组件将Counter组件连接到Redux store
// connect函数接受两个参数：mapStateToProps和mapDispatchToProps
// 它返回一个新的组件，这个组件能够访问Redux store中的状态和分派actions

export default connect(mapStateToProps, mapDispatchToProps)(Store); // 挂载到props
