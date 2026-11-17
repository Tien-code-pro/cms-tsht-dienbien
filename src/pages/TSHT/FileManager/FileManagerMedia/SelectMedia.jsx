import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "antd";
import FileMedia from "./FileMedia";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_MEDIA_REFRESH } from "../../../../store/fileManager/actionType";
import { setRefresh } from "../../../../store/fileManager/action";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import ReactHlsPlayer from "react-hls-player";
const SelectMedia = ({
  type,
  onUploadMedia,
  title = "Media",
  className,
  defaultImgSrc,
  setDefaultImgSrc,
  defaultType = "image",
  close,
  setAvatar,
  typeOnly = "none",
  typeArticle = "",
}) => {
  const [open, setOpen] = useState(false);
  const [mediaSrc, setMediaSrc] = useState();
  const [typeMediaSrc, setTypeMediaSrc] = useState();
  const dispatch = useDispatch();
  const { refresh } = useSelector((state) => ({
    refresh: state.FileManager.refresh,
  }));
  useEffect(() => {
    if (defaultImgSrc) {
      setMediaSrc(defaultImgSrc);
      setTypeMediaSrc(defaultType);
    }
  }, [defaultImgSrc]);
  const handleClick = () => {
    setOpen(true);
    dispatch(setRefresh(!refresh));
  };
    const renderMediaPreview = (media) => {
      if (media.includes(".mp3")) {
        return (
          <audio
            controls
            style={{
              width: "100%",
              cursor: "pointer",
            }}
            src={media}
            onClick={handleClick}
          >
            <a href={`${media}`}>Download audio</a>
          </audio>
        );
      } else if (media.includes(".mp4")) {
        return (
          <video
            controls
            style={{
              width: "100%",
              cursor: "pointer",
            }}
            src={media}
            onClick={handleClick}
          >
            <a href={`${media}`}>Download video</a>
          </video>
        );
      } else if (media) {
        return (
          <img
            style={{
              width: "100%",
              cursor: "pointer",
            }}
            src={media}
            onClick={handleClick}
            alt=""
          ></img>
        );
      } else {
        return <></>;
      }
    };
    const renderMedia = () => {
      switch (typeMediaSrc) {
        case "image":
          return renderMediaPreview(mediaSrc);
        case "stream":
          return (
            <Player src={`${mediaSrc}`} keyboardShortcut={false}>
              {(ref, props) => <ReactHlsPlayer playerRef={ref} {...props} />}
            </Player>
          );
        case "video":
          return (
            <figure>
              <video
                controls
                src={`${mediaSrc}`}
                style={{
                  width: "100%",
                }}
              >
                <a href={`${mediaSrc}`}>Download audio</a>
              </video>
            </figure>
          );
        case "audio":
          return (
            <figure>
              <audio
                controls
                src={`${mediaSrc}`}
                style={{
                  width: 300,
                }}
              >
                <a href={`${mediaSrc}`}>Download audio</a>
              </audio>
            </figure>
          );
        default:
          break;
      }
    };
  return (
    <>
      {type === "button" ||
        (type === undefined && (
          <button
            className={className ? className : ""}
            onClick={handleClick}
            type="button"
          >
            {title}
          </button>
        ))}
      {type === "dropzone" ? (
        mediaSrc ? (
          <div style={{ position: "relative" }}>
            {!close && (
              <button
                type="button"
                style={{
                  position: "absolute",
                  zIndex: "10",
                  right: 0,
                  top: 0,
                  backgroundColor: "#ff0404",
                  borderRadius: "50%",
                  height: "30px",
                  width: "30px",
                }}
                className="btn btn-soft-danger btn-icon btn-sm fs-16 close-btn-overview"
                onClick={() => {
                  setMediaSrc(null);
                  setDefaultImgSrc && setDefaultImgSrc(null);
                  setAvatar && setAvatar("");
                }}
              >
                <i className="ri-close-fill align-bottom"></i>
              </button>
            )}
            {renderMedia()}
          </div>
        ) : (
          <div className="dropzone dz-clickable" onClick={handleClick}>
            <div className="dz-message needsclick">
              <div className="mb-3">
                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
              </div>
              <h4>Thư viện Media</h4>
            </div>
          </div>
        )
      ) : (
        <></>
      )}

      <Modal
        footer={[]}
        open={open}
        width={1300}
        zIndex={1001}
        onCancel={() => {
          setOpen(false);
          dispatch(setRefresh(!refresh));
        }}
      >
        <FileMedia
          type={"modal"}
          setOpen={setOpen}
          open={open}
          setTypeMediaSrc={setTypeMediaSrc}
          setMediaSrc={setMediaSrc}
          onUploadMedia={onUploadMedia}
          typeOnly={typeOnly}
          typeArticle={typeArticle}
        ></FileMedia>
      </Modal>
    </>
  );
};
export default SelectMedia;
