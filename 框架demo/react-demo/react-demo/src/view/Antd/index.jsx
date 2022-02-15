import React, { FC, useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  message,
  Checkbox,
  Form,
  Input,
  Space,
  Divider,
} from "antd";
import TroubleModal from "./Form/index";
import SelectModal from "./Select";

const AntdComponent = (props) => {
  return (
    <div>
      <TroubleModal></TroubleModal>
      <Divider />
      <SelectModal />
    </div>
  );
};

export default AntdComponent;
