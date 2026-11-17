import React, { useState, useRef } from "react";
import { Modal } from "antd";
import ToastCustom from "../../../../Components/Common/Toast";
import { createShortVideoFile } from "../../../../helpers/fakebackend_helper";

const CropVideo = ({
  reload,
  setReload,
  setStatusUploadFile,
  setPercentUploadFile,
  setViewPercentUploadFile,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // const onPause = useCallback(async () => {
  //   setIsPlaying(false);
  //   videoRef.current?.pause();
  // }, []);
  // const onRewind = useCallback(async () => {
  //   setIsPlaying(false);
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = 0;
  //   }
  // }, []);
  // const onPlay = useCallback(async () => {
  //   setIsPlaying(true);
  //   videoRef.current?.play();
  // }, []);
  const handleUploadShortVideo = (e) => {
    const selectedFile = e?.target.files[0];
    const fileURL = URL.createObjectURL(selectedFile);
    if (fileURL) {
      setVideoFile(selectedFile);
      setVideoSrc(fileURL);
      setError("");
      const videoElement = document.createElement("video");
      videoElement.src = fileURL;
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        if (duration > 120) {
          // setError("Video phải có thời lượng giới 2 phút");
          ToastCustom("Video phải có thời lượng dưới 02 phút", "fail");
          setVideoSrc(null);
          setVideoFile(null);
        }
      };
      videoElement.onended = () => {
        URL.revokeObjectURL(fileURL);
      };
    }
  };
  const onSubmit = () => {
    const bodyParam = new FormData();
    bodyParam.append("files", videoFile);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setPercentUploadFile(percent);
      },
    };
    if (bodyParam) {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          setPercentUploadFile(percent);
        },
      };
      createShortVideoFile(bodyParam, options).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Tải lên thành công", "success");
          setReload(!reload);
          setTimeout(() => {
            setStatusUploadFile("success");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
        if (res && res.status <= 0) {
          ToastCustom(res.message, "fail");
          setTimeout(() => {
            setStatusUploadFile("exception");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
      });
    }
  };

  const clearInput = () => {
    setVideoSrc(null);
    setVideoFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Modal
        title="Upload Short Video"
        open={isOpenModal}
        zIndex={1002}
        onCancel={() => {
          setIsOpenModal(false);
          clearInput();
        }}
        onOk={false}
        // okText={"Xác nhận"}
        cancelText={"Hủy bỏ"}
        // onOk={() => {
        //   onSubmit();
        // }}
        className="crop-video-modal"
        style={{
          position: "relative",
        }}
        footer={[]}
      >
        <div className="d-flex flex-col">
          <b>Chú ý:</b>
          <i>Short video phù hợp với tỉ lệ khung hình (450 x 567)</i>
          <i>Short video có giới hạn thời gian dài nhất là 02 phút</i>
          <label
            style={{ height: "40px", marginTop: 20 }}
            // onChange={onFileChange}
            htmlFor="uploadShortVideo"
            className="btn btn-success text-nowrap create-folder-modal flex-shrink-0  d-inline-block w-fit"
          >
            <input
              name=""
              ref={fileInputRef}
              type="file"
              accept="video/*"
              id="uploadShortVideo"
              onChange={handleUploadShortVideo}
              hidden
            />
            <i className="ri-add-line align-bottom me-1"></i> Chọn file{" "}
            {videoSrc ? "khác" : ""}
          </label>
          {/* {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )} */}
          {videoSrc && (
            <div className=" mt-2">
              <h3>Video Preview:</h3>

              <div
                style={{
                  width: "fit-content",
                  margin: "0 auto",
                  position: "relative",
                }}
              >
                <span
                  onClick={clearInput}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    color: "white",
                    cursor: "pointer",
                    zIndex: 99,
                  }}
                >
                  x
                </span>

                <video width="300" controls style={{ margin: "8px auto" }}>
                  <source src={videoSrc} type={videoFile?.type} />
                  Your browser does not support the video tag.
                </video>
              </div>
              <button
                onClick={onSubmit}
                className="btn btn-success text-nowrap create-folder-modal flex-shrink-0  d-block w-fit"
                style={{ margin: "0px auto" }}
              >
                Upload
              </button>
            </div>
          )}
        </div>
      </Modal>
      <label
        style={{ height: "40px" }}
        onClick={() => setIsOpenModal(true)}
        className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
      >
        <i className="ri-add-line align-bottom me-1"></i> Short Video
      </label>
    </>
  );
};

export default CropVideo;
