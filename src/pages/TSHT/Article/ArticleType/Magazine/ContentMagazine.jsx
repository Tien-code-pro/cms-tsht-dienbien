import React, { useState, useRef, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme, Row, Col, Button, Card } from "antd";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import BlockMagazine from "./BlockMagazine";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArticleBlock,
  updateArticleContent,
} from "../../../../../store/fileManager/action";

export default function ContentMagazine() {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const { eMagazineBlock } = useSelector((state) => ({
    eMagazineBlock: state.FileManager.eMagazineBlock,
  }));
  const [listItem, setListItem] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const articleContent = useRef([]);
  const magazineContent = useRef([]);
  const finalContent = useRef("");
  // const [articleContent, setArticleContent] = useState([]);
  const onUpdateContent = (e, numb, magazine) => {
    const content = articleContent.current.map((element, index) => {
      if (index === numb) {
        return e;
      } else {
        return element;
      }
    });
    console.log("tempMagazine123", tempMagazine.current);
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
  return (
    <div>
      <Row lang="12" style={{ overflow: "auto", height: "69vh" }}>
        <Col lg={8}>
          <Collapse
            bordered={false}
            accordion
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{
              background: token.colorBgContainer,
            }}
            items={listItem}
          />
          <Button
            onClick={() => {
              setListItem([
                ...listItem,
                {
                  key: uuidv4(),
                  label: `Block ${listItem.length + 1}`,
                  children: (
                    <BlockMagazine
                      number={listItem.length}
                      onUpdateContent={onUpdateContent}
                    />
                  ),
                },
              ]);
              articleContent.current = [...articleContent.current, <></>];
              magazineContent.current = [...magazineContent.current, ""];
              dispatch(updateArticleBlock([...eMagazineBlock, {}]));
            }}
          >
            Thêm
          </Button>
        </Col>
        <Col lg={16}>
          <Card>{articleContent.current.map((e) => e)}</Card>
        </Col>
      </Row>
    </div>
  );
}
