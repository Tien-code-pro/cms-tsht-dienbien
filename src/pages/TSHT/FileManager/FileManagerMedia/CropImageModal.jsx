import React, { useState, useRef, useEffect } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview.jsx";
import { useDebounceEffect } from "./useDebounceEffect.jsx";

import "react-image-crop/dist/ReactCrop.css";
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
import ToastCustom from "../../../../Components/Common/Toast.js";
import Loader from "../../../../Components/Common/Loader.js";
import "./style.css";
import Loading from "../../../../Components/Common/Loading.jsx";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ModalCropImage(props) {
  const { isOpen, handleModalClose, imageEdit, handleUpload, setNewFileModal } =
    props;
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState();
  const [base64ImageEdit, setBase64ImageEdit] = useState("");
  const [valueSelectScale, setValueSelectScale] = useState(0);
  // | (undefined > 16 / 9);

  const typeImageOptions = [
    {
      value: 1,
      label: "16:9",
    },
    {
      value: 2,
      label: "4:3",
    },
    {
      value: 3,
      label: "3:2",
    },
    {
      value: 4,
      label: "1:1",
    },
    {
      value: 5,
      label: "Tỉ lệ gốc",
    },
    {
      value: 0,
      label: "Tùy ý",
    },
  ];

  useEffect(() => {
    fetchImage(imageEdit);
  }, [imageEdit]);

  const fetchImage = async (imageEdit) => {
    try {
      const response = await fetch(imageEdit);
      const blob = await response.blob();

      // Chuyển đổi Blob thành dạng Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        setBase64ImageEdit(base64Data);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    const canvas = document.createElement("canvas");
    canvas.width = offscreen.width;
    canvas.height = offscreen.height;

    // Draw the offscreen canvas onto the regular canvas
    const context = canvas.getContext("2d");
    context.drawImage(offscreen, 0, 0);

    // const base64Data = canvas.toDataURL("image/png");

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });
    setNewFileModal(blob);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick(e) {
    const image = imgRef.current;
    setValueSelectScale(e);
    if (e === 0) {
      setAspect(undefined);
    }
    if (e === 1) {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
    if (e === 2) {
      setAspect(4 / 3);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 4 / 3);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
    if (e === 3) {
      setAspect(3 / 2);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 3 / 2);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }

    if (e === 4) {
      setAspect(1 / 1);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 1 / 1);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
    if (e === 5) {
      setAspect(image.width / image.height);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(
          width,
          height,
          image.width / image.height
        );
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }
  return (
    <>
      <Modal
        open={isOpen}
        okText={"Lưu ảnh"}
        onOk={() => {
          onDownloadCropClick();
          handleUpload();
          handleModalClose();
        }}
        zIndex={1002}
        onCancel={() => {
          setCrop();
          setCompletedCrop();
          handleModalClose();
        }}
        onRequestClose={() => {
          setCrop();
          setCompletedCrop("");
          handleModalClose();
        }}
        contentLabel="Example Modal"
      >
        <div className="Crop-Controls">
          {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
          <div style={{ display: "flex" }}>
            <label htmlFor="scale-input" style={{ marginTop: "5px" }}>
              Tỉ lệ ảnh
            </label>
            <Input
              style={{ width: "30%", marginLeft: "18px" }}
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", margin: "7px 0" }}>
            <label htmlFor="rotate-input" style={{ marginTop: "5px" }}>
              Xoay
            </label>
            <Input
              style={{ width: "30%", marginLeft: "39px" }}
              id="rotate-input"
              type="number"
              value={rotate}
              onChange={(e) =>
                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
              }
            />
          </div>
          <div>
            <label
              style={{
                marginBottom: "7px",
                position: "absolute",
                zIndex: "1001",
                right: "23px",
                top: "40px",
                width: "150px",
              }}
            >
              Tỉ lệ crop
            </label>
            <Select
              style={{
                marginBottom: "7px",
                position: "absolute",
                zIndex: "1001",
                right: "23px",
                top: "65px",
                width: "150px",
              }}
              value={valueSelectScale}
              options={typeImageOptions}
              placeholder="Cắt theo tỉ lệ"
              onChange={(e) => {
                handleToggleAspectClick(e);
              }}
            ></Select>
          </div>
        </div>
        {/* {!!imgSrc &&( */}
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          // minWidth={400}
          minHeight={50}
        >
          {imageEdit && (
            <img
              ref={imgRef}
              alt="Crop me"
              src={base64ImageEdit}
              // src={imageEdit}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          )}
        </ReactCrop>
        {/* )} */}
        {!!completedCrop ? (
          <>
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          </>
        ) : (
          <div
            style={{
              width: "200px",
              height: "150px",
              border: "1px solid #d7c7c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "gray",
            }}
          >
            <p> Ảnh Kết quả</p>
          </div>
        )}
      </Modal>
    </>
  );
}
