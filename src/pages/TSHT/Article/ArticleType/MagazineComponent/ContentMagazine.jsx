import React, { useState, useRef, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  CardHeader,
} from "reactstrap";
import { Collapse, theme, Row, Col, Button, Card } from "antd";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import BlockMagazine from "./BlockMagazine";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArticleBlock,
  updateArticleContent,
  updateKeyIndex,
} from "../../../../../store/fileManager/action";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
export const DragHandle = SortableHandle(() => (
  <span
    style={{
      cursor: "move",
    }}
  >
    ::
  </span>
));
export default function ContentMagazine(props) {
  const { save } = props;
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const [isActiveMoveBlock, setIsActiveMoveBlock] = useState(false);
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const { eMagazineListKey } = useSelector((state) => ({
    eMagazineListKey: state.FileManager.eMagazineListKey,
  }));
  const { eMagazineBackgroundColor } = useSelector((state) => ({
    eMagazineBackgroundColor: state.FileManager.eMagazineBackgroundColor,
  }));
  const { eMagazineTextColor } = useSelector((state) => ({
    eMagazineTextColor: state.FileManager.eMagazineTextColor,
  }));
  const [refresh, setRefresh] = useState(true);
  const listItem = useRef([]);
  const articleContent = useRef([]);
  const magazineContent = useRef([]);
  const finalContent = useRef("");
  const [preview, setPreview] = useState(false);
  // const [articleContent, setArticleContent] = useState([]);
  const onUpdateContent = (e, numb, magazine) => {
    const content = articleContent.current.map((element, index) => {
      if (index === numb) {
        return e;
      } else {
        return element;
      }
    });
    const tempMagazine = magazineContent.current.map((element, index) => {
      if (index === numb) {
        return magazine;
      } else {
        return element;
      }
    });
    articleContent.current = content;
    magazineContent.current = tempMagazine;
    finalContent.current = magazineContent.current.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    dispatch(updateArticleContent(finalContent.current));
    setRefresh((pre) => !pre);
  };
  const handleDeleteItem = (key) => {
    const keyIndex = listItem.current.findIndex((e, i) => e.key === key);

    const contentTemp = articleContent.current.filter((e, i) => i !== keyIndex);
    articleContent.current = contentTemp;
    const magazineTemp = magazineContent.current.filter(
      (e, i) => i !== keyIndex
    );
    magazineContent.current = magazineTemp;
    const listTemp = [...listItem.current].filter((e, i) => i !== keyIndex);
    listTemp.forEach((element, index) => {
      element.label = `Khối ${index + 1}`;
    });
    const blockTemp = eMagazineBlock.filter((e, i) => i !== keyIndex);
    dispatch(updateArticleBlock([...blockTemp]));
    dispatch(updateKeyIndex(listTemp.map((e) => e.key)));
    listItem.current = listTemp;
    setRefresh((pre) => !pre);
  };
  const handlePreview = () => {
    setPreview(!preview);
  };
  let height = 100 + listItem?.current?.length * 70 + "px";
  eMagazineBlock.forEach((element) => {
    if (
      element?.block_image?.content ||
      element?.block_text?.content ||
      element?.block_multi_image?.image1 ||
      element?.block_multi_image?.image2
    ) {
      height = "auto";
      return;
    }
  });
  const deleteAllBlock = () => {
    dispatch(updateArticleBlock([]));
    dispatch(updateKeyIndex([]));
    articleContent.current = [];
    magazineContent.current = [];
    listItem.current = [];
    setRefresh((pre) => !pre);
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = [...listItem.current];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);

    const newArticles = [...articleContent.current];
    const [moveAritcle] = newArticles.splice(oldIndex, 1);
    newArticles.splice(newIndex, 0, moveAritcle);

    articleContent.current = newArticles;
    listItem.current = newItems;

    const newBlockTemps = [...eMagazineBlock];
    const [moveTemps] = newBlockTemps.splice(oldIndex, 1);
    newBlockTemps.splice(newIndex, 0, moveTemps);
    dispatch(updateArticleBlock([...newBlockTemps]));

    const newMagazineContents = [...magazineContent.current];
    const [moveMagazineContent] = newMagazineContents.splice(oldIndex, 1);
    newMagazineContents.splice(newIndex, 0, moveMagazineContent);
    magazineContent.current = newMagazineContents;
    let htmlEmagazineContent = newMagazineContents.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    dispatch(updateArticleContent(htmlEmagazineContent));

    const newListKeys = [...eMagazineListKey];
    const [moveKey] = newListKeys.splice(oldIndex, 1);
    newListKeys.splice(newIndex, 0, moveKey);
    dispatch(updateKeyIndex(newListKeys));

    setRefresh(!refresh);
  };
  const SortableItem = SortableElement(({ value }) => {
    let arr = [value];
    return (
      <div
        style={{
          padding: "8px",
          height: "57px",
        }}
      >
        <Collapse
          bordered={false}
          accordion
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{
            background: token.colorBgContainer,
            width: "96%",
          }}
          items={arr}
        />
      </div>
    );
  });

  const SortableList = SortableContainer(({ items }) => (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  ));

  return (
    <div style={{ marginTop: "-10px" }}>
      <Row>
        <Col lg={8}></Col>
        <Col
          lg={16}
          style={{
            display: "flex",
            justifyContent: "right",
            marginBottom: "5px",
          }}
        >
          <Button
            style={{ position: "absolute", top: "-50px", right: "14px" }}
            onClick={() => handlePreview()}
            className="preview-mobile-web"
          >
            {preview ? "Preview Web" : "Preview Mobile"}
          </Button>
        </Col>
      </Row>
      <Row lang="12" style={{ overflow: "auto", height: "66vh" }}>
        <Col style={{ height: "60vh", overflowy: "scroll" }} lg={8}>
          <div style={{ height: "60vh", overflowY: "scroll" }}>
            <div className={isActiveMoveBlock ? "display_block" : "hide-block"}>
              <SortableList items={listItem.current} onSortEnd={onSortEnd} />
            </div>

            <div className={isActiveMoveBlock ? "hide-block" : "display_block"}>
              <Collapse
                bordered={false}
                accordion
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: token.colorBgContainer,
                  width: "96%",
                }}
                items={listItem.current}
              />
            </div>

            <div className="double-button">
              <Button
                style={{ marginTop: "10px" }}
                className={isActiveMoveBlock ? "move-block-2" : "move-block"}
                onClick={() => {
                  setIsActiveMoveBlock(!isActiveMoveBlock);
                }}
              >
                {!isActiveMoveBlock
                  ? "Click để kéo thả sửa thứ tự khối"
                  : "Tắt sửa thứ tự khối"}
              </Button>
              <Button
                className="btn-add-emagazine"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#0AB39C",
                  color: "white",
                }}
                onClick={() => {
                  const key = uuidv4();
                  listItem.current = [
                    ...listItem.current,
                    {
                      key: key,
                      label: `Khối ${listItem?.current?.length + 1}`,
                      children: (
                        <BlockMagazine
                          nameBlock={`Khối ${listItem?.current?.length + 1}`}
                          itemkey={key}
                          onUpdateContent={onUpdateContent}
                        />
                      ),
                      extra: (
                        <Button
                          color="red"
                          onClick={() => {
                            handleDeleteItem(key);
                          }}
                          danger
                          type="primary"
                        >
                          -
                        </Button>
                      ),
                    },
                  ];
                  articleContent.current = [...articleContent.current, <></>];
                  magazineContent.current = [...magazineContent.current, ""];
                  dispatch(updateArticleBlock([...eMagazineBlock, {}]));
                  dispatch(updateKeyIndex([...eMagazineListKey, key]));
                }}
              >
                Thêm
              </Button>
              <Button
                onClick={() => deleteAllBlock()}
                className="delete-all-block"
              >
                Xoá tất cả khối
              </Button>
              {/* <Button
              onClick={() => handlePreview()}
              className="preview-mobile-web"
            >
              {preview ? "preview web" : "Preview Mobile"}
            </Button> */}
              <Button
                className="button-save-emagazine"
                style={{
                  backgroundColor: "#405189",
                  color: "white",
                }}
                onClick={() => save()}
              >
                Lưu bài viết
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={16}>
          {preview ? (
            <div style={{ width: "385px", margin: "0 auto" }}>
              <Card
                style={{
                  height: height,
                  maxHeight: "60vh",
                  overflowY: "scroll",
                }}
              >
                {height === "100px" && (
                  <div
                    style={{
                      fontSize: "18px",
                      margin: "0 auto",
                      width: "300px",
                      color: "#645858",
                      padding: "20px 0",
                      textAlign: "center",
                    }}
                  >
                    Nội dung bài e-magazine
                  </div>
                )}

                {articleContent.current.map((e) => {
                  return e;
                })}
              </Card>
            </div>
          ) : (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <Card
                style={{
                  height: height,
                  maxHeight: "60vh",
                  overflowY: "scroll",
                }}
              >
                {height === "100px" && (
                  <div
                    style={{
                      fontSize: "18px",
                      margin: "0 auto",
                      width: "300px",
                      color: "#645858",
                      padding: "20px 0",
                      textAlign: "center",
                    }}
                  >
                    Nội dung bài e-magazine
                  </div>
                )}

                {articleContent.current.map((e) => e)}
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
