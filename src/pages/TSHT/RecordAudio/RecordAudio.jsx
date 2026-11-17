import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import "./RecordAudio.scss";
import ToastCustom from "../../../Components/Common/Toast";
import { convertSpeechToText } from "../../../helpers/fakebackend_helper";

function RecordAudio(props) {
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);

  let { setSpeechToText, setSpeechToText2 } = props;

  useEffect(() => {
    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);

        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks([event.data]);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
        };

        recorder.onerror = (event) => {
          console.error("MediaRecorder Error: ", event.error);
        };
      } catch (error) {
        console.error("getUserMedia Error: ", error);
      }
    }

    if (!mediaStream && !mediaRecorder) {
      startRecording();
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioChunks, mediaStream, mediaRecorder]);

  const toggleRecording = async () => {
    if (mediaRecorder && !recording) {
      mediaRecorder.start();
      setRecording(true);
    } else if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaStream(null);
      setMediaRecorder(null);
      setAudioChunks([]);
    }
  };

  useEffect(() => {
    if (audioChunks && audioChunks.length > 0) {
      const bodyParam = new FormData();
      bodyParam.append("audio_file", audioChunks[0]);
      convertSpeechToText(bodyParam).then((res) => {
        if (res.status > 0) {
          if (setSpeechToText) {
            setSpeechToText(res.data[0].utterance.replace(/[\s.]+$/, ""));
            return;
          }
          if (setSpeechToText2) {
            setSpeechToText2(res.data[0].utterance.replace(/[\s.]+$/, ""));
          }
        } else {
          ToastCustom("Thu âm bị lỗi!", "fail");
        }
      });
    }
  }, [audioChunks]);

  return (
    <AudioOutlined
      className="audio-select"
      style={
        recording
          ? {
              color: "#1c79f1",
            }
          : {
              color: "#919191",
            }
      }
      onClick={toggleRecording}
    />
  );
}

export default RecordAudio;
