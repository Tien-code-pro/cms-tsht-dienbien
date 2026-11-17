import React from "react";
import { Spin } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastCustom from "./Toast";

export default function Loading(props) {
  return (
    <div
      style={{
        height: 500,
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.error && ToastCustom(props.error, "fail")}
      <Spin />
    </div>
  );
}
