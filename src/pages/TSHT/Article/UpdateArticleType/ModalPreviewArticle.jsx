import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { Player } from "react-tuby";
import ReactHlsPlayer from "react-hls-player";
import {
  getAPIAccountById,
  getAPIAccountInfo,
} from "../../../../helpers/fakebackend_helper";

export default function ModalPreviewArticle(props) {
  const [userName, setUserName] = useState();
  const [penName, setPenName] = useState();
  const {
    isOpen,
    handleModalClose,
    dataPreview,
    title,
    sapo,
    author,
    subTitle,
  } = props;
  useEffect(() => {
    getAPIAccountInfo().then((res) => {
      if (res.status > 0) {
        if (res.data) {
          getAPIAccountById(res.data.user_id).then((res) => {
            if (res && res.status > 0) {
              setUserName(res.data.user_name);
              setPenName(res.data.pen_name);
            }
          });
        }
      }
    });
  });
  return (
    <>
      <Modal
        style={{ height: "auto" }}
        width={1200}
        open={isOpen}
        title="Preview Article"
        okText={"Đóng"}
        onOk={() => {
          handleModalClose();
        }}
        zIndex={1000}
        onCancel={() => {
          handleModalClose();
        }}
        onRequestClose={() => {
          handleModalClose();
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div style={{ width: "100%", marginTop: "30px" }}>
          <p
            style={{
              color: "rgb(131 131 131)",
              fontWeight: "500",
              fontSize: "18px",
            }}
          >
            {subTitle || "Tiêu đều phụ..."}
          </p>
          <h3 style={{ fontSize: "30px", color: "#343a40" }}>
            {title || "Tiêu đề..."}
          </h3>
          <hr />
          {sapo && (
            <p
              style={{
                color: "rgb(52, 58, 64)",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              {sapo}
            </p>
          )}

          <div
            className="editor-content"
            dangerouslySetInnerHTML={{ __html: dataPreview }}
          ></div>
          <p
            style={{
              textAlign: "right",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            {author
              ? author
              : penName
              ? penName
              : userName
              ? userName
              : "Tên tác giả..."}
          </p>
        </div>
      </Modal>
    </>
  );
}
