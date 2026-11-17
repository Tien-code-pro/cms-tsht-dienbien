import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { Player } from "react-tuby";
import ReactHlsPlayer from "react-hls-player";
import ReactPlayer from "react-player";

export default function ModalPreview(props) {
  const { isOpen, handleModalClose, dataPreview } = props;
  console.log("dataPreview", dataPreview);
  return (
    <>
      <Modal
        style={{ height: "400px" }}
        open={isOpen}
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
          {/* <h3>{dataPreview.}</h3> */}
          {dataPreview.type === "audio" && (
            <figure>
              <audio
                controls
                src={`${dataPreview.url}`}
                style={{
                  width: "100%",
                }}
              >
                <a href={`${dataPreview.url}`}>Download audio</a>
              </audio>
            </figure>
          )}
          {dataPreview.type === "video" && (
            // <Player
            //   src={`${dataPreview.url}`}
            //   eyboardShortcut={false}
            //   keyboardShortcut={false}
            // >
            //   {(ref, props) => <ReactHlsPlayer playerRef={ref} {...props} />}
            // </Player>
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url={dataPreview.url}
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          )}
          {dataPreview.type === "stream" && (
            <Player
              src={`${dataPreview.url}`}
              eyboardShortcut={false}
              keyboardShortcut={false}
            >
              {(ref, props) => <ReactHlsPlayer playerRef={ref} {...props} />}
            </Player>
          )}
        </div>
      </Modal>
    </>
  );
}
