import React, { useState, useRef, useEffect, useMemo } from "react";
import { Collapse, theme, Row, Col, Button, Select } from "antd";
import { toast } from "react-toastify";
import { Input } from "reactstrap";
import SelectMedia from "../../../FileManager/FileManagerMedia/SelectMedia";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import ArticleCustomEditor from "./CustomEditor";
import { updateArticleBlock } from "../../../../../store/fileManager/action";
import TextArea from "antd/es/input/TextArea";
import ToastCustom from "../../../../../Components/Common/Toast";
import JoditEditorGlobal from "../../UpdateArticleType/JoditEditor";

export default function BlockMagazine(props) {
  const dispatch = useDispatch();
  const editorRef = useRef("");
  const [content, setContent] = useState("");
  const { onUpdateContent, itemkey, type, nameBlock } = props;
  const [number, setNumber] = useState(-1);
  const [image, setImage] = useState("");
  const [clasCss, setClassCss] = useState("Căn đều");
  const [cssImage, setCssImage] = useState("50%");
  const [csswidthMultiImage, setCsswidthMultiImage] = useState("100%");
  const [switchItem, setSwitchItem] = useState(true);
  const [justifyContent, setJustifyContent] = useState("Căn trái");
  const [cssText, setCssText] = useState("50%");
  const [typeBlock, setTypeBlock] = useState("Media");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [caption, setCaption] = useState("");
  const [captionMultiImage, setCaptionMultiImage] = useState("");
  const justifyContentBlock = [
    {
      label: "Căn trái",
      value: "flex-start",
    },
    {
      label: "Căn phải",
      value: "flex-end",
    },
    {
      label: "Căn giữa",
      value: "center",
    },
  ];
  const justifyContentBlockImgText = [
    {
      label: "Sát lề hai bên",
      value: "space-between",
    },
    {
      label: "Căn hai bên phần tử",
      value: "space-around",
    },
    {
      label: "Khoảng cách đều nhau",
      value: "space-evenly",
    },
  ];
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const { eMagazineListKey } = useSelector((state) => ({
    eMagazineListKey: state.FileManager.eMagazineListKey,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  const handleWidthBlockText = (event) => {
    const inputNumber = event.target.value;
    if (inputNumber === "") {
      ToastCustom("Không được để trống hoặc nhập chữ", "fail");
      setCssText("90%");
      return;
    }
    if (inputNumber.includes("%")) {
      ToastCustom("Không được nhập ký tự %", "fail");
      return;
    }
    if (parseInt(inputNumber) < 0 || parseInt(inputNumber) > 100) {
      ToastCustom("Chỉ được nhập số từ 0 đến 100", "fail");
    }
    if (parseInt(inputNumber) >= 0 && parseInt(inputNumber) <= 100) {
      setCssText(inputNumber + "%");
      return;
    }
  };
  const handleWidthBlockImage = (event) => {
    const inputNumber = event.target.value;
    if (inputNumber === "") {
      ToastCustom("Không được để trống hoặc nhập chữ", "fail");
      setCssImage("90%");
      return;
    }
    if (inputNumber.includes("%")) {
      ToastCustom("Không được nhập ký tự %", "fail");
      return;
    }
    if (parseInt(inputNumber) < 0 || parseInt(inputNumber) > 100) {
      ToastCustom("Chỉ được nhập số từ 0 đến 100", "fail");
    }
    if (parseInt(inputNumber) >= 0 && parseInt(inputNumber) <= 100) {
      setCssImage(inputNumber + "%");
      return;
    }
  };
  const handleWidthBlockMultiImage = (event) => {
    const inputNumber = event.target.value;
    if (inputNumber === "") {
      ToastCustom("Không được để trống hoặc nhập chữ", "fail");
      setCsswidthMultiImage("90%");
      return;
    }
    if (inputNumber.includes("%")) {
      ToastCustom("Không được nhập ký tự %", "fail");
      return;
    }
    if (parseInt(inputNumber) < 0 || parseInt(inputNumber) > 100) {
      ToastCustom("Chỉ được nhập số từ 0 đến 100", "fail");
    }
    if (parseInt(inputNumber) >= 0 && parseInt(inputNumber) <= 100) {
      setCsswidthMultiImage(inputNumber + "%");
      return;
    }
  };
  const [textEditor, setTextEditor] = useState("");
  const TypeBlockArr = [
    {
      label: "Media",
      value: "Media",
    },
    {
      label: "Chữ",
      value: "Chữ",
    },
    {
      label: "Media + Chữ",
      value: "Media + Chữ",
    },
    {
      label: "Media + Media",
      value: "Media + Media",
    },
  ];

  useEffect(() => {
    console.log("change when typeblock change");
    if (typeBlock === "Media") {
      setContent("");
      setImage1("");
      setImage2("");
      setJustifyContent("center");
      setCssImage("100%");
      setListItem([
        {
          key: uuidv4(),
          label: "Media",
          children: renderItem("image"),
        },
        {
          key: uuidv4(),
          label: "Vị trí Media",
          children: renderItem("block"),
        },
      ]);
    }
    if (typeBlock === "Chữ") {
      setImage("");
      setImage1("");
      setImage2("");
      setCssText("100%");
      setJustifyContent("center");
      setListItem([
        {
          key: uuidv4(),
          label: "Chữ",
          children: renderItem("Chữ"),
        },
        {
          key: uuidv4(),
          label: "Vị trí chữ",
          children: renderItem("block"),
        },
      ]);
    }
    if (typeBlock === "Media + Chữ") {
      setImage1("");
      setImage2("");
      setJustifyContent("space-between");
      setListItem([
        {
          key: uuidv4(),
          label: "Chữ",
          children: renderItem("Chữ"),
        },
        {
          key: uuidv4(),
          label: "Media",
          children: renderItem("image"),
        },
        {
          key: uuidv4(),
          label: "Vị trí Media + chữ",
          children: renderItem("block"),
        },
      ]);
    }
    if (typeBlock === "Media + Media") {
      setContent("");
      setImage("");
      setJustifyContent("space-between");
      setListItem([
        {
          key: uuidv4(),
          label: "Media 1",
          children: renderItem("image1"),
        },
        {
          key: uuidv4(),
          label: "Media 2",
          children: renderItem("image2"),
        },
      ]);
    }
  }, [typeBlock]);

  useEffect(() => {
    if (eMagazineListKey.length > 0) {
      const index = eMagazineListKey.findIndex((e) => e === itemkey);
      setNumber(index);
    }
  }, [eMagazineListKey]);

  let htmlString = content;
  const [swap, setSwap] = useState(false);
  useEffect(() => {
    const swapElements = (index1, index2) => {
      // setListItem((prev) => [
      //   {
      //     key: uuidv4(),
      //     label: "Chữ",
      //     children: renderItem("Chữ"),
      //   },
      //   {
      //     key: uuidv4(),
      //     label: "Media",
      //     children: renderItem("image"),
      //   },
      //   {
      //     key: uuidv4(),
      //     label: "Vị trí Media + chữ",
      //     children: renderItem("block"),
      //   },
      // ]);
      // Create a new array from the current state
      // const newItems = [...listItem];

      // // Swap the elements in the new array
      // [newItems[index1], newItems[index2]] = [
      //   newItems[index2],
      //   newItems[index1],
      // ];

      // Update the state with the new array
      setListItem(
        swap
          ? [
              {
                key: uuidv4(),
                label: "Media",
                children: renderItem("image"),
              },
              {
                key: uuidv4(),
                label: "Chữ",
                children: renderItem("Chữ"),
              },
              {
                key: uuidv4(),
                label: "Vị trí Media + chữ",
                children: renderItem("block"),
              },
            ]
          : [
              {
                key: uuidv4(),
                label: "Chữ",
                children: renderItem("Chữ"),
              },
              {
                key: uuidv4(),
                label: "Media",
                children: renderItem("image"),
              },
              {
                key: uuidv4(),
                label: "Vị trí Media + chữ",
                children: renderItem("block"),
              },
            ]
      );
    };
    if (typeBlock === "Media + Chữ") {
      swapElements(0, 1);
    }
  }, [swap]);

  const renderItem = (type) => {
    switch (type) {
      case "image":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <label
                style={{ width: "50%", fontWeight: "700", marginTop: "8px" }}
              >
                Độ rộng khối (%)
              </label>
              <Input
                type="number"
                className="form-control"
                pattern="[0-9]{0,5}"
                onChange={handleWidthBlockImage}
                placeholder="Nhập từ 1-100"
                defaultValue={typeBlock === "Media + Chữ" ? "50" : "100"}
              />
            </div>
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                console.log(e);
                setImage(e);
              }}
              typeArticle="e-magazine"
              defaultImgSrc={image}
              setDefaultImgSrc={() => {
                setImage("");
              }}
            />
            <Input
              style={{ marginTop: 10 }}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chú thích media"
            />
          </div>
        );

      case "image1":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => setImage1(e)}
              typeArticle="e-magazine"
              defaultImgSrc={image1}
              setDefaultImgSrc={() => {
                setImage1("");
              }}
            />
          </div>
        );

      case "image2":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => setImage2(e)}
              typeArticle="e-magazine"
              defaultImgSrc={image2}
              setDefaultImgSrc={() => {
                setImage2("");
              }}
            />
          </div>
        );

      case "Chữ":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <label
                style={{ width: "50%", fontWeight: "700", marginTop: "8px" }}
              >
                Độ rộng khối (%)
              </label>
              <Input
                type="number"
                className="form-control"
                pattern="[0-9]{0,5}"
                onChange={handleWidthBlockText}
                placeholder="Nhập từ 1-100"
                defaultValue={typeBlock === "Media + Chữ" ? "50" : "100"}
              />
            </div>

            <JoditEditorGlobal
              placeholder="Nhập nội dung khối"
              editorRef={editorRef}
              content={content}
              setContent={setContent}
            />
          </div>
        );

      case "block":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {typeBlock === "Media + Chữ" && (
              <>
                <Select
                  placeholder="Class css"
                  options={justifyContentBlockImgText}
                  onChange={(e) => setJustifyContent((pre) => e)}
                  defaultValue={"space-between"}
                />
                <Button
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setTextEditor(content);
                    setSwap((prev) => !prev);
                    // setListItem((pre) => [pre[1], pre[0], pre[2]]);
                    setSwitchItem((pre) => !pre);
                  }}
                >
                  Đổi vị trí
                </Button>
              </>
            )}
            {typeBlock === "Media" && (
              <Select
                placeholder="Class css"
                options={justifyContentBlock}
                onChange={(e) => setJustifyContent((pre) => e)}
                defaultValue={"center"}
              />
            )}
            {typeBlock === "Chữ" && (
              <Select
                placeholder="Class css"
                options={justifyContentBlock}
                onChange={(e) => setJustifyContent((pre) => e)}
                defaultValue={"center"}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    handleUpdateContent();
    const temp = eMagazineBlock.map((e, i) => {
      // let cssFigure =
      //   cssImage != "Toàn màn hình" && cssImage != "100%" ? "50%" : "100%";
      if (i === number) {
        return {
          type_block: typeBlock,
          block_text: {
            clas_css: clasCss,
            content: content,
            locate: switchItem ? 0 : 1,
            cssText: cssText,
          },
          block_image: {
            content: image,
            text_image: caption,
            locate: switchItem ? 1 : 0,
            cssImage: cssImage,
          },
          block_multi_image: {
            image1: image1,
            image2: image2,
            caption: captionMultiImage,
          },
          class_css: justifyContent,
          color: eMagazineTextColor,
          background_color: eMagazineBackgroundColor,
        };
      } else {
        return e;
      }
    });
    dispatch(updateArticleBlock(temp));
  }, [
    textEditor,
    content,
    image,
    clasCss,
    cssImage,
    cssText,
    switchItem,
    justifyContent,
    caption,
    eMagazineBackgroundColor,
    eMagazineTextColor,
    image1,
    image2,
    captionMultiImage,
    csswidthMultiImage,
  ]);

  // useEffect(() => {
  //   handleUpdateContent();
  //   const temp = eMagazineBlock.map((e, i) => {
  //     return {
  //       ...e,
  //       color: eMagazineTextColor,
  //       background_color: eMagazineBackgroundColor,
  //     };
  //   });
  //   dispatch(updateArticleBlock(temp));
  // }, [eMagazineBackgroundColor, eMagazineTextColor]);
  const [listItem, setListItem] = useState([
    // {
    //   key: uuidv4(),
    //   label: "Nội dung 1",
    //   children: renderItem("content"),
    // },
    {
      key: uuidv4(),
      label: "Media",
      children: renderItem("image"),
    },
    {
      key: uuidv4(),
      label: "Vị Trí",
      children: renderItem("block"),
    },
  ]);
  const renderMedia = (media) => {
    if (media.includes(".mp3")) {
      return (
        <audio
          controls
          src={`${media}`}
          style={{
            width: "100%",
          }}
        >
          <a href={`${media}`}>Download audio</a>
        </audio>
      );
    } else if (media.includes(".mp4")) {
      return (
        <video
          controls
          src={`${media}`}
          style={{
            width: "100%",
          }}
        >
          <a href={`${media}`}>Download video</a>
        </video>
      );
    } else if (media) {
      return <img width="100%" src={media} alt="" />;
    } else {
      return <></>;
    }
  };
  const handleUpdateContent = () => {
    onUpdateContent(
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: `${justifyContent}`,
          backgroundColor: eMagazineBackgroundColor,
        }}
      >
        {switchItem ? (
          <>
            {content && (
              <div
                className="content-block-emagazine"
                style={{ position: "relative", width: cssText }}
              >
                <p className="name-block-emagazine">{nameBlock}</p>
                <div
                  className="editor-content"
                  style={{
                    alignSelf: clasCss,
                    color: eMagazineTextColor,
                    marginBottom: "20px",
                    width: cssText,
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            )}
            {image && (
              <div
                className="content-block-emagazine"
                style={{ width: cssImage }}
              >
                <p className="name-block-emagazine">{nameBlock}</p>
                <figure
                  className="image"
                  id="add_image_link"
                  style={{ width: cssImage, marginBottom: "20px" }}
                >
                  {renderMedia(image)}
                  <figcaption style={{ textAlign: "center" }}>
                    {caption}
                  </figcaption>
                </figure>
              </div>
            )}
            {(image1 || image2) && (
              <div
                className="content-block-emagazine"
                style={{ width: cssImage }}
              >
                <p className="name-block-emagazine">{nameBlock}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: csswidthMultiImage,
                    margin: "0 auto",
                  }}
                >
                  {image1 && (
                    <figure
                      className="image"
                      id="add_image_link"
                      style={{ width: "49.9%", marginBottom: "20px" }}
                    >
                      {renderMedia(image1)}
                    </figure>
                  )}
                  {image2 && (
                    <figure
                      className="image"
                      id="add_image_link"
                      style={{ width: "49.9%", marginBottom: "20px" }}
                    >
                      {renderMedia(image2)}
                    </figure>
                  )}
                </div>
                {captionMultiImage && (
                  <figcaption
                    style={{
                      textAlign: "center",
                      fontStyle: "italic",
                      marginTop: "-14px",
                      marginBottom: "20px",
                    }}
                  >
                    {captionMultiImage}
                  </figcaption>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="content-block-emagazine" style={{ width: cssImage }}>
            <p className="name-block-emagazine">{nameBlock}</p>
            {image && (
              <figure
                className="image"
                id="add_image_link"
                style={{ width: cssImage, marginBottom: "20px" }}
              >
                {renderMedia(image)}
                <figcaption style={{ textAlign: "center" }}>
                  {caption}
                </figcaption>
              </figure>
            )}
            {content && (
              <div style={{ position: "relative", width: cssText }}>
                <p
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0px",
                    opacity: "100%",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  {nameBlock}
                </p>
                <div
                  className="editor-content"
                  style={{
                    alignSelf: clasCss,
                    color: eMagazineTextColor,
                    marginBottom: "20px",
                    width: cssText,
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            )}
            {image1 && (
              <figure
                className="image"
                id="add_image_link"
                style={{ width: "50%", marginBottom: "20px" }}
              >
                {renderMedia(image1)}
              </figure>
            )}
            {image2 && (
              <figure
                className="image"
                id="add_image_link"
                style={{ width: "50%", marginBottom: "20px" }}
              >
                {renderMedia(image2)}
              </figure>
            )}
          </div>
        )}
      </div>,
      number,
      ArticleCustomEditor(
        eMagazineTextColor,
        eMagazineBackgroundColor,
        content,
        clasCss,
        cssImage,
        cssText,
        image,
        caption,
        justifyContent,
        switchItem,
        image1,
        image2,
        captionMultiImage,
        csswidthMultiImage
      )
    );
  };
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <label style={{ width: "20%", fontWeight: "700", marginTop: "8px" }}>
          Loại Khối :
        </label>
        <Select
          style={{ width: "80%", marginBottom: "15px", marginLeft: "10px" }}
          placeholder="Class css"
          options={TypeBlockArr}
          onChange={(e) => setTypeBlock((pre) => e)}
          defaultValue={typeBlock}
        ></Select>
      </div>
      {typeBlock === "Media + Media" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <label style={{ width: "50%", fontWeight: "700", marginTop: "8px" }}>
            Độ rộng khối (%)
          </label>
          <Input
            type="number"
            className="form-control"
            pattern="[0-9]{0,5}"
            onChange={handleWidthBlockMultiImage}
            placeholder="Nhập từ 1-100"
            defaultValue="100"
          ></Input>
        </div>
      )}

      <Collapse accordion items={listItem} />

      {typeBlock === "Media + Media" && (
        <Input
          style={{
            marginTop: 10,
          }}
          onChange={(e) => setCaptionMultiImage(e.target.value)}
          placeholder="Chú thích media"
        ></Input>
      )}
    </>
  );
}
