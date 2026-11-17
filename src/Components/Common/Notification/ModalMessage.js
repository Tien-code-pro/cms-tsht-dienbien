import React, { useState } from "react";
import { Button, Modal } from "antd";
const ModalMessage = (props) => {
  return (
    <>
      <Modal title={props.title}>{props.content}</Modal>
    </>
  );
};

export default ModalMessage;
