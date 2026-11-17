import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  // Form,
  FormFeedback,
  Label,
  Row,
  InputGroup,
} from "reactstrap";
import {
  Button,
  Input,
  Select,
  Space,
  Popover,
  List,
  Divider,
  Form,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./ArticleType/compare-version.scss";

import {
  getAPIListArticleType,
  getListCrawlLink,
  articleGetContentFromUrl,
} from "../../../helpers/fakebackend_helper";
import NormalArticle from "./ArticleType/NormalArticle";
import VideoArticle from "./ArticleType/VideoArticle";
import AudioArticle from "./ArticleType/AudioArticle";
import Newspaper from "./ArticleType/Newspaper";
import Magazine from "./ArticleType/Magazine";
import { useScrollLock } from "../../../Components/Hooks/UseScrollLock";
import { useSelector } from "react-redux";
import ShortVideoArticle from "./ArticleType/ShortVideoArticle";

// import { CloseOutlined, ExpandOutlined } from "@ant-design/icons";
const { Search } = Input;
const AddArticle = () => {
  // const [isMax, setIsMax] = useState(false);
  const { lockScroll, unlockScroll } = useScrollLock();
  lockScroll();
  document.title = "Tạo bài viết | Toà Soạn Hội Tụ";
  const googleLink = useSelector((state) => state.chat.googleLink);
  const [clicked, setClicked] = useState(false);
  const [articleType, setArticleType] = useState([]);
  const [articleContent, setArticleContent] = useState();
  const [url, setUrl] = useState();
  const [listCrawlLink, setListCrawlLink] = useState([]);
  const [selectedArticleType, setSelectedArticleType] = useState(0);
  //const pattern = regexFrom(listCrawlLink, "gi");
  let regexUrl = "";
  let regex = useRef(new RegExp());
  function handleChange(value) {
    setSelectedArticleType(value);
  }
  function onsubmit() {
    getArticleWithURL();
  }
  function getArticleWithURL() {
    if (regex.current.test(url)) {
      articleGetContentFromUrl(url).then((res) => {
        if (res.data && res.status > 0) {
          setArticleContent(res.data);
        }
      });
    }
  }
  useEffect(() => {
    if (googleLink) {
      setArticleContent(googleLink);
    }
  }, [googleLink]);
  useEffect(() => { }, [articleContent]);
  useEffect(() => {
    getListCrawlLink().then((res) => {
      if (res.data && res.status > 0) {
        let result = [];
        res.data.list.map((e) => {
          regexUrl = regexUrl + e.domain_name + "|";
          result.push(e.domain_name);
        });
        regexUrl = "(https://" + regexUrl.slice(0, -1) + ")((/(.*))|$)";
        regex.current = new RegExp(regexUrl);
        setListCrawlLink(result);
      }
    });
    getAPIListArticleType().then((res) => {
      if (res.data && res.status > 0) {
        let result = [];
        res.data.map((e) => {
          if (e.article_type_slug !== 'bao-in') {
            result.push({
              value: e.article_type_id,
              label: e.article_type_name,
            });
          }
        });
        setArticleType(result);
      }
    });
  }, []);

  // const styleMax = {
  //   position: "absolute",
  //   top: 90,
  //   backgroundColor: "#f3f3f9",
  //   right: "10px",
  //   width: "98.8%",
  //   zIndex: "0",
  // };

  return (
    <>
      <div className="page-content" style={{ position: "relative" }}>
        <Container fluid={true}>
          {/* {!isMax && ( */}
          <BreadCrumb
            title="Thêm bài viết"
            pageTitle="Danh sách bài viết"
            previousLink="/list-article"
          />
          {/* )} */}

          <Card>
            <CardBody>
              <Row>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // position: "relative",
                    }}
                  >
                    <Label htmlFor="article_sapo" className="form-label">
                      Loại bài viết
                    </Label>
                    <Select
                      placeholder="Chọn loại bài viết"
                      style={{ width: 220 }}
                      onChange={handleChange}
                      options={articleType}
                    />

                    {/* {selectedArticleType === 2 && !isMax && (
                  <div
                    style={{
                      width: "20px",
                      height: 20,
                      right: 0,
                      display: "flex",
                      justifyContent: "right",
                      marginLeft: "-30px",
                      position: "absolute",
                      right: "0px",
                      top: "162px",
                      zIndex: "1001",
                      cursor: "pointer",
                    }}
                  >
                    <ExpandOutlined
                      onClick={() => {
                        setIsMax(!isMax);
                      }}
                    />
                  </div>
                )} */}
                  </div>
                </Col>
                {selectedArticleType === 1 && (
                  <Col className="col-3">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        // position: "relative",
                      }}
                    >
                      <Label htmlFor="article_sapo" className="form-label">
                        <span style={{ marginRight: "5px" }}>
                          Nhập link từ báo khác{" "}
                        </span>
                        <Popover
                          placement="bottom"
                          title={<div>Các trang đã hỗ trợ</div>}
                          content={
                            <div>
                              <List
                                className=""
                                size="small"
                                // dataSource={record.other_author_info
                                //   .slice(1)
                                //   .slice(0, -1)
                                //   .split(",")}
                                dataSource={listCrawlLink}
                                renderItem={(item, index) => (
                                  // target="_blank"
                                  <List.Item className="">
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={"https://" + item + "/"}
                                      onClick={() => {
                                        setClicked(false);
                                      }}
                                    >
                                      {item}
                                    </a>
                                  </List.Item>
                                )}
                              />
                            </div>
                          }
                          open={clicked}
                          onOpenChange={(e) => setClicked(e)}
                          trigger="click"
                        >
                          <QuestionCircleOutlined
                            style={{ fontSize: "16px", cursor: "pointer" }}
                          />
                        </Popover>
                      </Label>
                      <Form layout="inline">
                        <Form.Item
                          style={{ width: "100%" }}
                          name="url"
                          rules={[
                            // {
                            //   pattern: regex,
                            //   message: 'Please input your username!',
                            // },
                            {
                              message:
                                "Đường dẫn không hợp lệ.Bấm vào biểu tượng (?) để biết các đường đẫn hợp lệ.",
                              validator: (_, value) => {
                                if (regex.current.test(value) || value == "") {
                                  return Promise.resolve();
                                } else {
                                  return Promise.reject();
                                }
                              },
                            },
                          ]}
                        >
                          <Space.Compact style={{ width: "100%" }}>
                            <Input
                              value={url}
                              onChange={(e) => {
                                setUrl(e.target.value);
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-success button-getcontent-custom"
                              htmlType="submit"
                              onClick={getArticleWithURL}
                            >
                              Lấy bài
                            </button>
                          </Space.Compact>
                        </Form.Item>
                      </Form>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>

          {/* {selectedArticleType === 2 && isMax && (
            <div
              style={{
                width: "20px",
                height: 20,
                right: 0,
                display: "flex",
                justifyContent: "right",
                marginLeft: "-30px",
                position: "absolute",
                right: "5px",
                top: "75px",
                zIndex: "1001",
                cursor: "pointer",
                fontWeight: "520",
                backgroundColor: "red",
                borderRadius: "50%",
              }}
            >
              <CloseOutlined
                style={{ padding: "2.3px" }}
                onClick={() => {
                  setIsMax(!isMax);
                }}
              />
            </div>
          )}
          <div style={isMax ? styleMax : { height: "auto" }}> */}
          {selectedArticleType === 1 && (
            <NormalArticle
              article_type={selectedArticleType}
              article_content={articleContent}
            />
          )}
          {selectedArticleType === 2 && (
            <Magazine article_type={selectedArticleType} />
          )}
          {selectedArticleType === 3 && (
            <VideoArticle article_type={selectedArticleType} />
          )}
          {selectedArticleType === 4 && (
            <AudioArticle article_type={selectedArticleType} />
          )}
          {selectedArticleType === 5 && (
            <Newspaper article_type={selectedArticleType} />
          )}
          {selectedArticleType === 11 && (
            <ShortVideoArticle article_type={selectedArticleType} />
          )}
          {/* </div> */}
        </Container>
      </div>
    </>
  );
};

export default AddArticle;
