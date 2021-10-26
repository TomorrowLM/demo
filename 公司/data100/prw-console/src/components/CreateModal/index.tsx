import React from 'react';
import { Modal, Button } from 'antd';

interface CreateModalProps {
  modalVisible: boolean;
  width?: string | number;
  title?: string;
  cancelText?: string;
  submitText?: string;
  centered?: boolean;
  onCancel: () => void;
  onHandleOk?: () => void;
}

const CreateModal: React.FC<CreateModalProps> = (props) => {
  const { modalVisible, width, title, centered = false, cancelText = '取消', submitText = '提交', onCancel, onHandleOk } = props;
  const footer = [
    <Button key="cancel" onClick={() => onCancel()}>
      { cancelText }
    </Button>,
    <Button key="submit" type="primary" onClick={() => onHandleOk && onHandleOk()}>
      { submitText }
    </Button>
  ];

  return (
    <Modal
      width={width}
      destroyOnClose
      title={title}
      visible={modalVisible}
      centered={centered}
      onCancel={() => onCancel()}
      footer={onHandleOk ? footer: null}
      maskClosable={false}
    >
      {props.children}
    </Modal>
  );
};

export default CreateModal;
