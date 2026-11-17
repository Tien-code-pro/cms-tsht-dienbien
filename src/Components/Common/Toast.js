import { toast, ToastContainer } from "react-toastify";
import React from "react";

const ToastCustom = (context, type) => {
  if (type === "success" || type === undefined) {
    setTimeout(() => {
      toast.success(context, {
        position: "bottom-right",
        autoClose: 1800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }, 1);
  } else if (type === "fail") {
    toast.error(context, {
      position: "bottom-right",
      autoClose: 1800,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};
export default ToastCustom;
