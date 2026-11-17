import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  //Spin,
  Popover,
  List,
  Space,
  notification,
  Typography,
  Button,
  Modal,
  Tabs,
  Tooltip,
  Input,
  Spin,
} from "antd";

import "react-toastify/dist/ReactToastify.css";
import { convertSpeechToText } from "../../helpers/fakebackend_helper";
import ToastCustom from "./Toast";
import Timer from "./timer";

const ModalRecordAudio = ({
  editorRef,
  isModalOpen,
  setIsModalOpen,
  setTextAudio,
}) => {
  const audioRef = useRef(null);
  const audioRefFile = useRef(null);
  const mediaRecorder = useRef(null);
  const [isNameAudio, setNameAudio] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileData, setAudioFileData] = useState(null);
  const [audioBlobRecordData, setAudioBlobRecordData] = useState(null);
  const [isChoseContent, setChoseContent] = useState(0);
  const [isOpenModalConfirm, setOpenModalConfirm] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleStartRecording = () => {
    const stream = navigator.mediaDevices.getUserMedia({ audio: true });
    stream.then((stream) => {
      setStart(true);
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      const audioChunks = [];
      mediaRecorder.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlobRecordData(audioBlob);
      });
    });
  };

  const handleStopRecording = () => {
    setStart(false);
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFileData(file);
      setNameAudio(file.name);
      setAudioFile(URL.createObjectURL(file));
    }
  };
  const onChange = (key) => {};

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  };

  const handleRewind = () => {
    audioRef.current.currentTime -= 15;
  };
  const handleFastForwardFile = () => {
    if (audioRefFile.current) {
      audioRefFile.current.currentTime += 15;
    }
  };

  const handleRewindFile = () => {
    if (audioRefFile.current) {
      audioRefFile.current.currentTime -= 15;
    }
  };
  const handleOk = () => {
    if (isLoading) return;
    try {
      const bodyParam = new FormData();
      if (!audioFileData && !audioBlobRecordData) {
        return;
      } else if (audioFileData && !audioBlobRecordData) {
        setLoading(true);
        bodyParam.append("audio_file", audioFileData);
      } else if (!audioFileData && audioBlobRecordData) {
        setLoading(true);
        bodyParam.append("audio_file", audioBlobRecordData);
      } else {
        setOpenModalConfirm(true);
        return;
      }

      convertSpeechToText(bodyParam)
        .then((res) => {
          if (res) {
            if (res.status > 0) {
              setIsModalOpen(false);
              setLoading(false);
              setTextAudio(res.data[0].utterance.replace(/[\s.]+$/, ""));
            }
          } else {
            setLoading(false);
            ToastCustom("Thu âm bị lỗi!", "fail");
          }
        })
        .catch((error) => {
          // Xử lý lỗi
          if (error.response) {
            // Nếu nhận được response từ server, nhưng có lỗi status code
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi!", "fail");
            console.error("Response status:", error.response.status);
          } else if (error.request) {
            // Nếu request không nhận được response từ server
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi!", "fail");
            console.error("No response received:", error.request);
          } else {
            // Xảy ra lỗi trong quá trình thiết lập request
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi", "fail");
            console.error("Error setting up the request:", error.message);
          }
        });
    } catch (error) {
      setLoading(false);
      console.error("Api Error: ", error);
    }
  };

  const handleOkModalConfirm = () => {
    if (isLoading) return;
    try {
      setLoading(true);
      const bodyParam = new FormData();
      if (isChoseContent === 0) {
        return;
      } else if (isChoseContent === 1) {
        bodyParam.append("audio_file", audioBlobRecordData);
      } else if (isChoseContent === 2) {
        bodyParam.append("audio_file", audioFileData);
      }
      convertSpeechToText(bodyParam)
        .then((res) => {
          if (res.status > 0) {
            setOpenModalConfirm(false);
            setIsModalOpen(false);
            setTextAudio(res.data[0].utterance.replace(/[\s.]+$/, ""));
            setLoading(false);
          } else {
            setOpenModalConfirm(false);
            ToastCustom("Thu âm bị lỗi!", "fail");
            setLoading(false);
          }
        })
        .catch((error) => {
          // Xử lý lỗi
          if (error.response) {
            // Nếu nhận được response từ server, nhưng có lỗi status code
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi!", "fail");
            console.error("Response status:", error.response.status);
          } else if (error.request) {
            // Nếu request không nhận được response từ server
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi!", "fail");
            console.error("No response received:", error.request);
          } else {
            // Xảy ra lỗi trong quá trình thiết lập request
            setLoading(false);
            ToastCustom("Lấy nội dung bị lỗi", "fail");
            console.error("Error setting up the request:", error.message);
          }
        });
    } catch (error) {
      console.error("api err ", error);
      setLoading(false);
    }
  };
  const handleCancelModalConfirm = () => {
    if (isLoading) {
      return;
    }
    setOpenModalConfirm(false);
  };

  const handleCancel = () => {
    if (isLoading) {
      return;
    }
    setIsModalOpen(false);
  };
  const [isStart, setStart] = useState(false);
  const items = [
    {
      key: "1",
      label: <div style={{ fontSize: "17px" }}>Ghi âm</div>,
      children: (
        <>
          {!isLoading ? (
            <div>
              <Timer isStart={isStart} />
              <div
                style={{
                  width: "350px",
                  margin: "20px auto 25px auto",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  disabled={isStart}
                  onClick={handleStartRecording}
                  type="primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 25px",
                  }}
                >
                  <i
                    style={{ color: "#181515" }}
                    className="ri-mic-line fs-16"
                  ></i>
                  <span style={{ marginLeft: "5px", fontWeight: 600 }}>
                    Ghi âm
                  </span>
                </Button>
                <Button
                  // disabled={!isStart}
                  onClick={handleStopRecording}
                  type="primary"
                  danger
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0px 25px",
                  }}
                >
                  <i
                    style={{ color: "#181515" }}
                    className="ri-mic-off-line fs-16"
                  ></i>
                  <span style={{ marginLeft: "5px", fontWeight: 600 }}>
                    Dừng ghi âm
                  </span>
                </Button>
              </div>
              <div
                style={{
                  width: "80%",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <audio
                  style={{ width: "100%" }}
                  ref={audioRef}
                  controls
                  loop={false}
                  src={
                    audioBlobRecordData
                      ? URL.createObjectURL(audioBlobRecordData)
                      : ""
                  }
                  autoPlay={false}
                />
              </div>
              <div
                style={{
                  width: "80%",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tooltip placement="bottom" title="Tua lại 15s" arrow={false}>
                  <button
                    onClick={handleRewind}
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      width: "200px",
                      height: "20x",
                      marginTop: "16px",
                    }}
                  >
                    <i className="ri-arrow-go-back-fill fs-16"></i>
                  </button>
                </Tooltip>
                <Tooltip placement="bottom" title="Đến 15s" arrow={false}>
                  <button
                    onClick={handleFastForward}
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      width: "200px",
                      height: "20x",
                      marginTop: "16px",
                    }}
                  >
                    <i className="ri-arrow-go-forward-fill fs-16"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <h5>Đang lấy nội dung. Vui lòng chờ!</h5>
                <Spin />
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: <div style={{ fontSize: "17px" }}>Lấy tập tin</div>,
      children: (
        <>
          {!isLoading ? (
            <div>
              <div style={{ width: "80%", margin: "0 auto" }}>
                <label>Tệp tin audio</label>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    margin: "0px 0 20px 0",
                  }}
                >
                  <Input
                    style={{ width: "20%" }}
                    value={isNameAudio ? isNameAudio : "Chọn tập tin audio..."}
                  ></Input>
                  <div style={{ position: "relative", marginLeft: "10px" }}>
                    <Button
                      style={{
                        position: "absolute",
                      }}
                      type="primary"
                      ghost
                    >
                      Chọn file
                    </Button>
                    <input
                      style={{
                        position: "absolute",
                        width: "90px",
                        height: "33px",
                        cursor: "pointer",
                        zIndex: 1,
                        opacity: 0,
                      }}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "80%",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <audio
                  style={{ width: "100%" }}
                  ref={audioRefFile}
                  controls
                  src={audioFile}
                  loop={false}
                  autoPlay
                />
              </div>
              <div
                style={{
                  width: "80%",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tooltip placement="bottom" title="Tua lại 15s" arrow={false}>
                  <button
                    onClick={handleRewindFile}
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      width: "200px",
                      height: "20x",
                      marginTop: "16px",
                    }}
                  >
                    <i className="ri-arrow-go-back-fill fs-16"></i>
                  </button>
                </Tooltip>
                <Tooltip placement="bottom" title="Đến 15s" arrow={false}>
                  <button
                    onClick={handleFastForwardFile}
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      width: "200px",
                      height: "20x",
                      marginTop: "16px",
                    }}
                  >
                    <i className="ri-arrow-go-forward-fill fs-16"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <h5>Đang lấy nội dung. Vui lòng chờ!</h5>
                <Spin />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <Modal
        className="audio-to-text-modal"
        okText={"Tạo bài viết"}
        centered={true}
        width={1200}
        getContainer={() => document.getElementById("article-wrap")}
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
      <Modal
        okText={"Xác nhận"}
        open={isOpenModalConfirm}
        onOk={handleOkModalConfirm}
        onCancel={handleCancelModalConfirm}
        zIndex={1001}
      >
        <div style={{ width: "80%", margin: "0 auto" }}>
          <h4 style={{ textAlign: "center" }}>Bạn muốn lấy nội dung của?</h4>
          {!isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "25px 0",
              }}
            >
              <Button
                type="primary"
                style={
                  isChoseContent === 1
                    ? { backgroundColor: "#17a2b8" }
                    : { backgroundColor: "#6c757d" }
                }
                onClick={() => {
                  setChoseContent(1);
                }}
              >
                Ghi âm
              </Button>
              <Button
                type="primary"
                style={
                  isChoseContent === 2
                    ? { backgroundColor: "#17a2b8" }
                    : { backgroundColor: "#6c757d" }
                }
                onClick={() => {
                  setChoseContent(2);
                }}
              >
                Tập tin
              </Button>
            </div>
          ) : (
            <div
              style={{
                height: 100,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default ModalRecordAudio;
