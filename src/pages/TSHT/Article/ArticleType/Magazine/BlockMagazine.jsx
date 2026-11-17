import React, { useState, useRef, useEffect } from "react";
import { Collapse, theme, Row, Col, Button, Select } from "antd";
import { toast } from "react-toastify";
import { Input } from "reactstrap";
import SelectMedia from "../../../FileManager/FileManagerMedia/SelectMedia";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import ArticleCustomEditor from "./CustomEditor";
import { updateArticleBlock } from "../../../../../store/fileManager/action";

const ClassCssArr = [
  {
    label: "stretch",
    value: "stretch",
  },
  {
    label: "center",
    value: "center",
  },
  {
    label: "flex-start",
    value: "flex-start",
  },
  {
    label: "flex-end",
    value: "flex-end",
  },
  {
    label: "auto",
    value: "auto",
  },
];

const justifyContentBlock = [
  {
    label: "flex-start",
    value: "flex-start",
  },
  {
    label: "flex-end",
    value: "flex-end",
  },
  {
    label: "center",
    value: "center",
  },
  {
    label: "space-between",
    value: "space-between",
  },
  {
    label: "space-around",
    value: "space-around",
  },
  {
    label: "space-evenly",
    value: "space-evenly",
  },
];
export default function BlockMagazine(props) {
  const dispatch = useDispatch();
  const { number, onUpdateContent } = props;
  const [text, setText] = useState("");
  const [image, setImage] = useState();
  const [clasCss, setClassCss] = useState("justify");
  const [switchItem, setSwitchItem] = useState(true);
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const [caption, setCaption] = useState("");
  const renderItem = (type) => {
    return (
      <div>
        {type === "image" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SelectMedia
              type={"dropzone"}
              onUploadMedia={(e) => {
                setImage(e);
              }}
            ></SelectMedia>
            <Input
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            ></Input>
          </div>
        )}
        {type === "text" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Select
              placeholder="Class css"
              options={ClassCssArr}
              onChange={(e) => setClassCss((pre) => e)}
            ></Select>
            <Input
              placeholder="Nội dung"
              onChange={(e) => {
                setText(e.target.value);
              }}
            ></Input>
          </div>
        )}
        {type === "block" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Select
              placeholder="Class css"
              options={justifyContentBlock}
              onChange={(e) => setJustifyContent((pre) => e)}
            ></Select>
            <Button
              onClick={() => {
                setListItem((pre) => [pre[1], pre[0], pre[2]]);
                setSwitchItem((pre) => !pre);
              }}
            >
              Đổi vị trí
            </Button>
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    handleUpdateContent();
    const temp = eMagazineBlock.map((e, i) => {
      if (i === number) {
        return {
          block_text: {
            clas_css: clasCss,
            content: text,
            locate: switchItem ? 0 : 1,
          },
          block_image: {
            content: image,
            text_image: caption,
            locate: switchItem ? 1 : 0,
          },
          class_css: justifyContent,
        };
      } else {
        return e;
      }
    });
    dispatch(updateArticleBlock(temp));
  }, [
    text,
    image,
    clasCss,
    switchItem,
    justifyContent,
    eMagazineTextColor,
    caption,
  ]);
  const [listItem, setListItem] = useState([
    {
      key: uuidv4(),
      label: "Text",
      children: renderItem("text"),
    },
    {
      key: uuidv4(),
      label: "Image",
      children: renderItem("image"),
    },
    {
      key: uuidv4(),
      label: "block",
      children: renderItem("block"),
    },
  ]);
  const handleUpdateContent = () => {
    onUpdateContent(
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: `${justifyContent}`,
        }}
      >
        {switchItem ? (
          <>
            <p style={{ alignSelf: clasCss, color: eMagazineTextColor }}>
              {text}
            </p>
            <figure class="image" id="add_image_link">
              <img width="500" src={image} alt="" />
              <figcaption>{caption}</figcaption>
            </figure>
          </>
        ) : (
          <>
            <figure class="image" id="add_image_link">
              <img width="500" src={image} alt="" />
              <figcaption>{caption}</figcaption>
            </figure>
            <p style={{ alignSelf: clasCss, color: eMagazineTextColor }}>
              {text}
            </p>
          </>
        )}
      </div>,
      number,
      ArticleCustomEditor(
        eMagazineTextColor,
        text,
        clasCss,
        image,
        caption,
        justifyContent,
        switchItem
      )
    );
  };
  return <Collapse accordion items={listItem} />;
}
