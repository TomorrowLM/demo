import React, { useState } from "react";
import { Button, Modal, DatePicker } from "antd";
import { Link } from "react-router-dom";
function Page1() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="qq">
      我是page11
      <Link
        to={{
          pathname: "/qiankun/vue2-pc/page2",
          search: "?sort=name",
          hash: "#the-hash",
          state: { fromDashboard: true },
        }}
      >
        Link
      </Link>
      <DatePicker />
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default Page1;
