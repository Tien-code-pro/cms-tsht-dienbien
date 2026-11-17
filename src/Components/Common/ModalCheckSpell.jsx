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
} from "antd";
import VirtualList from "rc-virtual-list";
import { ArrowRightOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastCustom from "./Toast";
import { articleCheckSpellViettel } from "../../helpers/fakebackend_helper";
import { Spin } from "antd/lib";

const ModalCheckSpell = ({ editorRef, isModalOpen, setIsModalOpen }) => {
  const Context = React.createContext({
    name: "Default",
  });
  let wrongWordList = useRef([]);
  let preWord = null;
  let promit = [];
  const modalRef = useRef(null);
  const [wrongWordArray, setWrongWordArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  function setClickWrongWord(e) {
    if (preWord != null) preWord.style.backgroundColor = "White";
    let focusWord = document.getElementById(e);
    if (focusWord != null) {
      focusWord.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      focusWord.focus();
      focusWord.style.backgroundColor = "#ffe58f";
      preWord = focusWord;
    }
  }
  async function checkSpellChildren(node, childNodes, index) {
    let textData = new FormData();
    let startIndex = 0; //Index in contentText
    let endIndex = 0; //Index in contentText
    let arryOfChange = [];

    if (childNodes.length != 0) {
      childNodes.forEach((el) => {
        checkSpellChildren(el, el.childNodes, index);
      });
    } else {
      let text = node.textContent;
      if (text != "" && text != " " && text != null && text != undefined) {
        arryOfChange = text.split("");
        textData.append("text", text);

        promit.push(
          articleCheckSpellViettel(textData).then((res) => {
            if (res.status > 0) {
              // if (mytimeout != null) clearTimeout(mytimeout);
              res.data.forEach((word) => {
                startIndex = word.startIndex;
                endIndex = word.endIndex;

                arryOfChange[
                  startIndex
                ] = `<span id="wrong-word-${index}-${startIndex}-${endIndex}" class="wrong-word"><em>${arryOfChange[startIndex]}`;
                arryOfChange[endIndex - 1] = `${
                  arryOfChange[endIndex - 1]
                }</em></span>`;

                wrongWordList.current.push({
                  IdDom: `wrong-word-${index}-${startIndex}-${endIndex}`,
                  startIndex: word.startIndex,
                  endIndex: word.endIndex,
                  originalText: word.originalText,
                  suggestion: word.suggestion,
                });
              });

              //setWrongWordArray(wrongWordList.current);

              // setWrongWordArray(
              //   (wrongWordArray) => (wrongWordArray = wrongWordList.current)
              // );
              const wrapper = document.createElement("p");
              wrapper.innerHTML = arryOfChange.join("");
              node.replaceWith(...wrapper.childNodes);
            }
            //setIsLoadingList(false);
          })
        );
      }
    }
  }

  async function checkSpell() {
    setIsLoadingList(true);
    let node = modalRef.current; //editorRef.current.getBody()
    // console.log(node.childNodes);
    // return;
    const pElements = Array.from(node.getElementsByTagName("p"));
    pElements.forEach((el, index) => {
      if (el.childNodes.length > 0) {
        el.childNodes.forEach(async (child) => {
          await checkSpellChildren(child, child.childNodes, index);
        });
      }
    });
    Promise.all(promit).then((res) => {
      // console.log("checkRes", res);
      setWrongWordArray(wrongWordList.current);
      setIsLoadingList(false);
    });
    // mytimeout = setTimeout(() => {
    //   setWrongWordArray(wrongWordList.current);
    //   console.log(wrongWordList.current);
    //setIsLoadingList(false);
    // }, 10000);
  }
  const changeTheWord = (el) => {
    const getDom = document.getElementById(el.IdDom);
    getDom.replaceWith(el.suggestion);
    wrongWordList.current = wrongWordList.current.filter(
      (e) => e.IdDom !== el.IdDom
    );
    setWrongWordArray(wrongWordList.current);
  };
  const keepTheWord = (el) => {
    const getDom = document.getElementById(el.IdDom);
    getDom.replaceWith(el.originalText);
    wrongWordList.current = wrongWordList.current.filter(
      (e) => e.IdDom !== el.IdDom
    );
    setWrongWordArray(wrongWordList.current);
  };

  const showModalCheckSpell = () => {
    setIsModalOpen(true);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.error({
      message: <span className="noti-confirm-font">Lỗi</span>,
      description: (
        <Context.Consumer>{({ name }) => `${name}!`}</Context.Consumer>
      ),
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: "Chưa sửa hết lỗi chính tả",
    }),
    []
  );
  const handleOk = () => {
    if (wrongWordArray.length > 0) {
      openNotification("topRight");
    } else {
      editorRef.current.setContent(modalRef.current.innerHTML);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        className="check-spell-model-style"
        centered={true}
        width={1500}
        getContainer={() => document.getElementById("article-wrap")}
        title="Kiểm tra chính tả"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <Button onClick={checkSpell}> Kiểm tra</Button> */}
            <CancelBtn />
            <OkBtn />
          </>
        )}
        afterOpenChange={(open) => {
          if (open === true) {
            editorRef.current.getBody().childNodes.forEach((el) => {
              const clone = el.cloneNode(true);
              modalRef.current.appendChild(clone);
            });
            checkSpell();
          }
          if (open === false) {
            modalRef.current.innerHTML = "";
            setWrongWordArray([]);
            wrongWordList.current = [];
          }
        }}
      >
        {!isLoading ? (
          <div
            id="check-spell-model"
            style={{ display: "flex", height: "100%" }}
          >
            <div
              ref={modalRef}
              style={{
                width: "85%",
                // borderRight: "1px solid red",
                overflowY: "scroll",
                paddingRight: "5px",
              }}
            ></div>
            <div style={{ marginLeft: "20px" }}>
              <List
                header={
                  <div className="list-wrong-word-header">
                    Danh sách lỗi chính tả
                  </div>
                }
                className=""
                size="small"
                //  dataSource={wrongWordArray}
              >
                {!isLoadingList ? (
                  <VirtualList
                    data={wrongWordArray}
                    // onScroll={onScroll}
                    height={620}
                    itemHeight={47}
                  >
                    {(item) => (
                      <List.Item className="" key={item.IdDom}>
                        <Space direction="vertical">
                          <div
                            className="list-wrong-word-item"
                            onClick={() => setClickWrongWord(item.IdDom)}
                          >
                            {item.originalText} <ArrowRightOutlined />{" "}
                            {item.suggestion}
                          </div>
                          <div
                            className=""
                            style={{
                              display: "flex",
                              marginRight: "20px",
                            }}
                          >
                            <Space>
                              <Button
                                size="middle"
                                type="primary"
                                onClick={() => changeTheWord(item)}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="middle"
                                onClick={() => keepTheWord(item)}
                              >
                                Giữ
                              </Button>
                            </Space>
                          </div>
                        </Space>
                      </List.Item>
                    )}
                  </VirtualList>
                ) : (
                  <div
                    style={{
                      height: 500,
                      display: "flex",
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin />
                  </div>
                )}
              </List>
            </div>
          </div>
        ) : (
          <div
            style={{
              height: 500,
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin />
          </div>
        )}
      </Modal>
      <Context.Provider value={contextValue}>{contextHolder}</Context.Provider>
    </div>
  );
};
export default ModalCheckSpell;
