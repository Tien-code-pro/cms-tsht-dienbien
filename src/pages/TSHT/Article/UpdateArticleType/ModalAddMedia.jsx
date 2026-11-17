import React, { useState, useRef, useEffect } from "react";
import {
  TreeSelect,
  Modal,
  Table,
  Image,
  Popconfirm,
  Button,
  Spin,
  Input,
  Select,
} from "antd";

export default function ModalAddMedial(props) {
  const { isOpen, handleModalClose, dataMedia, addImageLink } = props;
  const [isWidth, setWidth] = useState("auto");
  const WidthOptions = [
    {
      label: "100%",
      value: "100%",
    },
    {
      label: "70%",
      value: "70%",
    },
    {
      label: "50%",
      value: "50%",
    },
    {
      label: "Tỉ lệ gốc",
      value: "auto",
    },
  ];

  return (
    <>
      <Modal
        style={{ height: "400px" }}
        open={isOpen}
        okText={"Xác nhận"}
        onOk={() => {
          addImageLink(...dataMedia, isWidth);
          handleModalClose();
        }}
        zIndex={1000}
        onCancel={() => {
          handleModalClose();
        }}
        onRequestClose={() => {
          handleModalClose();
        }}
        contentLabel="Example Modal"
      >
        <p style={{ fontWeight: "510", fontSize: "15px", textAlign: "center" }}>
          Độ rộng media
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "20px 0 40px 0",
          }}
        >
          <Button
            type="primary"
            style={
              isWidth === "100%"
                ? { backgroundColor: "#17a2b8" }
                : { backgroundColor: "#6c757d" }
            }
            onClick={() => {
              setWidth("100%");
            }}
          >
            100%
          </Button>
          <Button
            type="primary"
            style={
              isWidth === "70%"
                ? { backgroundColor: "#17a2b8" }
                : { backgroundColor: "#6c757d" }
            }
            onClick={() => {
              setWidth("70%");
            }}
          >
            70%
          </Button>
          <Button
            type="primary"
            style={
              isWidth === "50%"
                ? { backgroundColor: "#17a2b8" }
                : { backgroundColor: "#6c757d" }
            }
            onClick={() => {
              setWidth("50%");
            }}
          >
            50%
          </Button>
          <Button
            type="primary"
            style={
              isWidth === "auto"
                ? { backgroundColor: "#17a2b8" }
                : { backgroundColor: "#6c757d" }
            }
            onClick={() => {
              setWidth("auto");
            }}
          >
            Tỉ lệ gốc
          </Button>
        </div>

        {/* <Select
          style={{ width: "200px" }}
          options={WidthOptions}
          onChange={(e) => {
            setWidth(e);
          }}
          value={isWidth}
        ></Select> */}
      </Modal>
    </>
  );
}
