import React, { useEffect, useState } from "react";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import ToastCustom from "../../../../Components/Common/Toast";
import { Player } from "react-tuby";
import ReactHlsPlayer from "react-hls-player";

const UploadComponent = ({ onUploadMedia, dataID }) => {
  const [videoMedia, setVideoMedia] = useState("");
  const [videoID, setVideoID] = useState(0);

  return (
    <React.Fragment>
      <div className="action">
        <SelectMedia
          title="Thêm Video"
          onUploadMedia={(e, id, type) => {
            if (type !== "stream") {
              ToastCustom(
                "Bạn hãy chọn Video để thêm vào bài quảng cáo",
                "fail"
              );
            } else {
              setVideoMedia(e);
              setVideoID(id);
              onUploadMedia(e);
              dataID(id);
            }
          }}
          className={"btn btn-success"}
        ></SelectMedia>

        {!videoMedia && (
          <video width="100%" controls className="mt-3">
            <source src="" type="" />
          </video>
        )}
        {videoMedia && (
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Player src={`${videoMedia}`} keyboardShortcut={false}>
              {(ref, props) => <ReactHlsPlayer playerRef={ref} {...props} />}
            </Player>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default UploadComponent;
