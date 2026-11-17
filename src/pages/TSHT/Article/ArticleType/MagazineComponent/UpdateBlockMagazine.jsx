import React, { useState, useRef, useEffect } from "react";
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

export default function UpdateBlockMagazine(props) {
  const dispatch = useDispatch();
  const { onUpdateContent, itemkey, type, detailData, nameBlock } = props;
  const [defaultSetting, setDefaultSetting] = useState(false);
  const [text, setText] = useState("");
  const [number, setNumber] = useState(-1);
  const [image, setImage] = useState("");
  const [clasCss, setClassCss] = useState("Căn đều");
  const [switchItem, setSwitchItem] = useState(true);
  const [justifyContent, setJustifyContent] = useState("Căn trái");
  const [cssText, setCssText] = useState("");
  const [cssImage, setCssImage] = useState("Toàn màn hình");
  const [captionMultiImage, setCaptionMultiImage] = useState("");
  const [typeBlock, setTypeBlock] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [csswidthMultiImage, setCsswidthMultiImage] = useState("100%");
  const editorRef = useRef("");
  const jodit = editorRef.current;
  const [content, setContent] = useState("");
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
  useEffect(() => {
    if (eMagazineListKey.length > 0) {
      const index = eMagazineListKey.findIndex((e) => e === itemkey);
      setNumber(index);
    }
  }, [eMagazineListKey]);
  const handleEditorChange = () => {
    setText(editorRef?.current?.getContent());
  };

  const handleNumberChange = (event) => {
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
      return;
    }
    if (parseInt(inputNumber) >= 0 && parseInt(inputNumber) <= 100) {
      setCssText(inputNumber + "%");
      return;
    }
  };
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
      return;
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
      return;
    }
    if (parseInt(inputNumber) >= 0 && parseInt(inputNumber) <= 100) {
      setCsswidthMultiImage(inputNumber + "%");
      return;
    }
  };
  useEffect(() => {
    if (typeBlock === "Media") {
      setText("");
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
      setText("");
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
  const [caption, setCaption] = useState("");
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
  const renderItem = (
    type,
    content,
    dataClass,
    dataJusttify,
    dataCaption,
    cssText,
    cssImage,
    image1,
    image2
  ) => {
    content = content ? content : "<p><p/>";
    return (
      <div>
        {type === "image" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
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
              ></Input>
            </div>

            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                setImage(e);
              }}
              typeArticle="e-magazine"
              defaultImgSrc={image}
              setDefaultImgSrc={() => {
                setImage("");
              }}
            ></SelectMedia>
            <Input
              style={{
                marginTop: 10,
              }}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chú thích media"
              defaultValue={dataCaption}
            ></Input>
          </div>
        )}
        {type === "image1" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                setImage1(e);
              }}
              typeArticle="e-magazine"
              defaultImgSrc={image1}
              setDefaultImgSrc={() => {
                setImage1("");
              }}
            ></SelectMedia>
          </div>
        )}
        {type === "image2" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                setImage2(e);
              }}
              typeArticle="e-magazine"
              defaultImgSrc={image2}
              setDefaultImgSrc={() => {
                setImage2("");
              }}
            ></SelectMedia>
          </div>
        )}
        {type === "Chữ" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                Độ rộng khối text (%)
              </label>
              <Input
                type="number"
                className="form-control"
                pattern="[0-9]{0,5}"
                onChange={handleNumberChange}
                placeholder="Nhập từ 1-100"
                defaultValue={cssText?.replace("%", "")}
              ></Input>
            </div>
            <JoditEditorGlobal
              placeholder="Nhập nội dung bài viết"
              editorRef={editorRef}
              content={content}
              setContent={setContent}
            />
          </div>
        )}
        {type === "block" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {typeBlock === "Media + Chữ" && (
              <>
                <Select
                  placeholder="Class css"
                  options={justifyContentBlockImgText}
                  onChange={(e) => setJustifyContent((pre) => e)}
                  defaultValue={"space-between"}
                ></Select>
                <Button
                  style={{
                    marginTop: 10,
                  }}
                  onClick={() => {
                    setListItem((pre) => [pre[1], pre[0], pre[2]]);
                    setSwitchItem((pre) => !pre);
                  }}
                >
                  Đổi vị trí
                </Button>
              </>
            )}{" "}
            {typeBlock === "Media" && (
              <Select
                placeholder="Class css"
                options={justifyContentBlock}
                onChange={(e) => setJustifyContent((pre) => e)}
                defaultValue={"center"}
              ></Select>
            )}
            {typeBlock === "Chữ" && (
              <Select
                placeholder="Class css"
                options={justifyContentBlock}
                onChange={(e) => setJustifyContent((pre) => e)}
                defaultValue={"center"}
              ></Select>
            )}
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (eMagazineBlock && !defaultSetting && number !== -1) {
      setClassCss(eMagazineBlock[number]?.block_text?.class_css || "");
      setText(eMagazineBlock[number]?.block_text?.content || "<p></p>");
      setCaption(eMagazineBlock[number]?.block_image?.text_image || "");
      setImage(eMagazineBlock[number]?.block_image?.content || "");
      setJustifyContent(eMagazineBlock[number]?.class_css || "");
      setCssImage(eMagazineBlock[number]?.block_image?.cssImage || "100%");
      setCssText(eMagazineBlock[number]?.block_text?.cssText || "50%");
      setImage1(eMagazineBlock[number]?.block_multi_image?.image1 || "");
      setImage2(eMagazineBlock[number]?.block_multi_image?.image2 || "");
      setCaptionMultiImage(
        eMagazineBlock[number]?.block_multi_image?.caption || ""
      );
      setTypeBlock(eMagazineBlock[number]?.type_block);
      setSwitchItem(
        eMagazineBlock[number]?.block_text?.locate === 0 ? true : false
      );
      setDefaultSetting(true);
    }
  }, [eMagazineBlock, number]);

  useEffect(() => {
    handleUpdateContent();
    const temp = eMagazineBlock.map((e, i) => {
      if (i === number) {
        return {
          block_text: {
            clas_css: e?.block_text?.class_css,
            content: content,
            locate: e?.block_text?.locate,
            cssText: cssText,
          },
          block_multi_image: {
            image1: image1,
            image2: image2,
            caption: captionMultiImage,
          },
          block_image: {
            content: image,
            text_image: caption,
            // text_image: e?.block_image?.text_image,
            locate: e?.block_image?.locate,
            cssImage: cssImage,
          },
          class_css: e?.class_css,
          color: eMagazineTextColor,
          background_color: eMagazineBackgroundColor,
          type_block: typeBlock,
        };
      } else {
        return e;
      }
    });
    dispatch(updateArticleBlock(temp));
  }, [
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
    typeBlock,
  ]);

  // useEffect(() => {
  //   const temp = eMagazineBlock.map((e, i) => {
  //     return {
  //       ...e,
  //       color: eMagazineTextColor,
  //       background_color: eMagazineBackgroundColor,
  //     };
  //   });
  //   dispatch(updateArticleBlock(temp));
  // }, [eMagazineBackgroundColor, eMagazineTextColor]);
  const [listItem, setListItem] = useState([]);
  useEffect(() => {
    if (number !== -1 && typeBlock !== "") {
      if (typeBlock === "Media + Media") {
        setListItem([
          {
            key: uuidv4(),
            label: "Media 1",
            forceRender: true,
            children: renderItem(
              "image1",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.block_multi_image?.image1,
              eMagazineBlock[number]?.block_multi_image?.image2,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Media 2",
            forceRender: true,
            children: renderItem(
              "image2",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.block_multi_image?.image1,
              eMagazineBlock[number]?.block_multi_image?.image2,
              eMagazineBlock[number]?.type_block
            ),
          },
        ]);
      }
      if (typeBlock === "Media") {
        setListItem([
          {
            key: uuidv4(),
            label: "Media",
            forceRender: true,
            children: renderItem(
              "image",
              eMagazineBlock[number]?.block_image?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Khối",
            forceRender: true,
            children: renderItem(
              "block",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
        ]);
      }
      if (typeBlock === "Media + Chữ") {
        setListItem([
          {
            key: uuidv4(),
            label: "Chữ",
            forceRender: true,
            children: renderItem(
              "Chữ",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Media",
            forceRender: true,
            children: renderItem(
              "image",
              eMagazineBlock[number]?.block_image?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Khối",
            forceRender: true,
            children: renderItem(
              "block",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
        ]);
      }
      if (typeBlock === "Chữ") {
        setListItem([
          {
            key: uuidv4(),
            label: "Chữ",
            forceRender: true,
            children: renderItem(
              "Chữ",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Khối",
            forceRender: true,
            children: renderItem(
              "block",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
        ]);
      }
      if (!typeBlock) {
        setListItem([
          {
            key: uuidv4(),
            label: "Chữ",
            forceRender: true,
            children: renderItem(
              "Chữ",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Media",
            forceRender: true,
            children: renderItem(
              "image",
              eMagazineBlock[number]?.block_image?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Media 1",
            forceRender: true,
            children: renderItem(
              "image1",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.block_multi_image?.image1,
              eMagazineBlock[number]?.block_multi_image?.image2,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Media 2",
            forceRender: true,
            children: renderItem(
              "image2",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.block_multi_image?.image1,
              eMagazineBlock[number]?.block_multi_image?.image2,
              eMagazineBlock[number]?.type_block
            ),
          },
          {
            key: uuidv4(),
            label: "Khối",
            forceRender: true,
            children: renderItem(
              "block",
              eMagazineBlock[number]?.block_text?.content,
              eMagazineBlock[number]?.block_text?.class_css,
              eMagazineBlock[number]?.class_css,
              eMagazineBlock[number]?.block_image?.text_image,
              eMagazineBlock[number]?.block_text?.cssText,
              eMagazineBlock[number]?.block_image?.cssImage,
              eMagazineBlock[number]?.type_block
            ),
          },
        ]);
      }
    }
  }, [number, typeBlock]);
  const handleUpdateContent = () => {
    onUpdateContent(
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0px 30px",
          justifyContent: `${justifyContent}`,
          backgroundColor: eMagazineBackgroundColor,
        }}
      >
        {switchItem ? (
          <>
            {content && (
              <div
                className="content-block-emagazine"
                style={{ width: "100%" }}
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
            {image1 && image2 && (
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
          <>
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
                  <img width="100%" src={image} alt="" />
                  <figcaption style={{ textAlign: "center" }}>
                    {caption}
                  </figcaption>
                </figure>
              </div>
            )}
            {content && (
              <div
                className="content-block-emagazine"
                style={{ width: cssText }}
              >
                <p className="name-block-emagazine">{nameBlock}</p>
                <div
                  className="editor-content"
                  style={{
                    alignSelf: clasCss,
                    color: eMagazineTextColor,
                    marginBottom: "20px",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            )}
            {image1 && (
              <div
                className="content-block-emagazine"
                style={{ width: cssImage }}
              >
                <p className="name-block-emagazine">{nameBlock}</p>
                <figure
                  className="image"
                  id="add_image_link"
                  style={{ width: "50%", marginBottom: "20px" }}
                >
                  {renderMedia(image1)}
                </figure>
              </div>
            )}
            {image2 && (
              <div
                className="content-block-emagazine"
                style={{ width: cssImage }}
              >
                <figure
                  className="image"
                  id="add_image_link"
                  style={{ width: "50%", marginBottom: "20px" }}
                >
                  {renderMedia(image2)}
                </figure>
              </div>
            )}
          </>
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
        csswidthMultiImage,
        typeBlock
      )
    );
  };
  return (
    <>
      {typeBlock !== "" && (
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
      )}

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
          defaultValue={captionMultiImage}
          placeholder="Chú thích media"
        ></Input>
      )}
    </>
  );
}
