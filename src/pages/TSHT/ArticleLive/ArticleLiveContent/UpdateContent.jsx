import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAPIGetArticleLiveById,
  getAPIGetArticleLiveContentById,
  getAPIListAuthor,
  getAPIPostLiveContentArticle,
  getAPIPublishArticle,
  getAPIPublishArticleLive,
  getAPIReturnStepArticleLive,
  getAPIRoleByArticleLiveId,
  getAPIUnPublishArticle,
  getAPIUnPublishArticleLive,
  getAPIUpdateLiveContentArticle,
  getArticleFileMediaList,
  getArticleLiveContentFileMediaList,
} from "../../../../helpers/fakebackend_helper";
import { useFormik } from "formik";
import dayjs from "dayjs";
import ToastCustom from "../../../../Components/Common/Toast";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { Button, DatePicker, Image, Select } from "antd";
import ModalStep from "./ModalStep";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { v4 as uuidv4 } from "uuid";
import ModalAddMedial from "../../Article/UpdateArticleType/ModalAddMedia";
import JoditEditorGlobal from "../../Article/UpdateArticleType/JoditEditor";

const UpdateContent = () => {
  const editorRef = useRef("");
  const jodit = editorRef.current;
  const [content, setContent] = useState("");
  const [fromDate, setFromDate] = useState();
  const [optionsAuthor, setOptionsAuthor] = useState([]);

  const [valueAuthor, setValueAuthor] = useState([]);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleStatus, setArticleStatus] = useState("");
  const [articleStatusIsComplete, setArticleStatusIsComplete] = useState(false);
  const [articleCreatedBy, setArticleCreatedBy] = useState("");
  const [articleLiveStatus, setArticleLiveStatus] = useState();

  const { id, arrLiveId } = useParams();

  const [modal_scroll, setmodal_scroll] = useState(false);
  const [listUser, setListUser] = useState();
  const [isFirst, setFirst] = useState(true);
  const [article, setArticle] = useState();

  const [contentTitle, setContentTitle] = useState("");
  const [contentDisplayTime, setContentDisplayTime] = useState("");

  const [dataMedia, setDataMedia] = useState([]);
  const [isOpenModalAddImage, setOpenModalAddImage] = useState(false);
  const [listImage, setListImage] = useState([]);

  function onChangeAuthor(value) {
    if (value === undefined) {
      value = null;
    }
    setValueAuthor(value);
  }

  function addImageLink(e, id, type, originUrl, width) {
    if (type === "image") {
      const imageLink = `${e}`;
      jodit.s.insertHTML(`
          <figure class="image" style="width: ${width};" id="add_image_link">
            <img width="100%" src=${imageLink} />
            <figcaption></figcaption>
          </figure>
    `);
    }
    if (type === "audio") {
      const imageLink = `/` + encodeURIComponent(originUrl);
      jodit.s.insertHTML(`
          <figure>
          <audio
            controls
            src=${imageLink}
          >
          </audio>
        </figure>
      `);
    }
    if (type === "video") {
      const imageLink = `/` + encodeURIComponent(originUrl);
      jodit.s.insertHTML(`
          <video id="my-video"
          class="video-js"
          controls
          preload="auto"
          width="640"
          height="264"
          poster="MY_VIDEO_POSTER.jpg"
          data-setup="{}">
            <source src=${imageLink} type='video/mp4'>
          </video>
    `);
    }
  }

  const handlePublish = () => {
    getAPIPublishArticleLive(arrLiveId).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Xuất bản thành công", "success");
        navigate(`/list-article-live-content/${id}`);
      } else {
        ToastCustom(res.data.message, "fail");
      }
    });
  };
  const handleReturnStep = () => {
    getAPIReturnStepArticleLive(arrLiveId).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Trả bài thành công", "success");
        navigate(`/list-article-live-content/${id}`);
      } else {
        ToastCustom(res.data.message, "fail");
      }
    });
  };
  const handleUnPublish = () => {
    getAPIUnPublishArticleLive(arrLiveId).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Hạ Xuất bản thành công", "success");
        navigate(`/list-article-live-content/${id}`);
      } else {
        ToastCustom(res.data.message, "fail");
      }
    });
  };

  let navigate = useNavigate();

  useEffect(() => {
    getAPIGetArticleLiveContentById(id, arrLiveId).then((res) => {
      if (res.data && res.status > 0) {
        setArticle(res.data);
        const ar = res.data;
        setContentTitle(ar.article_live_title);
        setContent(ar.article_content);
        setFromDate(ar.start_time);
        setContentDisplayTime(ar.display_time);
        setValueAuthor(JSON.parse(res.data.other_author || "[]"));
        setArticleLiveStatus(ar.article_live_status_id);
        // setValueAuthor(JSON.parse(res.data.other_author || "[]"));

        setArticleTitle(ar.article_title);
        setArticleStatus(ar.article_status);
        setArticleCreatedBy(
          ar.user_creat_article === null
            ? ar.user_create_article
            : ar.user_creat_article
        );
        if (ar.article_status_id === 11) {
          setArticleStatusIsComplete(true);
        }
      }
    });
    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            // value: e.author_name,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });

    getAPIRoleByArticleLiveId().then((res) => {
      if (res.data && res.status > 0) {
        const role = res.data;
        const listUser = role._role_steps_info[1];
        setListUser(listUser.list_user_accept);
      }
    });
    getArticleLiveContentFileMediaList({
      article_id: id,
      article_live_id: arrLiveId,
    }).then((res) => {
      if (res && res.status > 0) {
        setListImage(
          res.data.map((e) => {
            return {
              url: `${e.file_url}`,
              id: e.file_info_id,
              type: e.file_type,
              originUrl: e.file_url,
            };
          })
        );
      }
    });
  }, []);

  const handleSubmit = () => {
    const newarticle = {
      article_live_id: arrLiveId,
      article_id: id,
      article_title: contentTitle,
      article_content: content,
      start_time: dayjs(fromDate).toISOString(),
      display_time: contentDisplayTime,
      other_author: "[" + valueAuthor.toString() + "]",
      article_files:
        listImage.length > 0 ? JSON.stringify(listImage.map((e) => e.id)) : "",
      // next_user_accept_id: "string"
    };

    let result = { ...newarticle };

    // save new articles
    if (!result.article_content) {
      ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
    }
    if (!result.start_time) {
      ToastCustom("Mời bạn chọn thời gian diễn biến", "fail");
    }
    if (!result.article_title) {
      ToastCustom("Mời bạn chọn tiêu đề diễn biến", "fail");
    }
    if (!result.display_time) {
      ToastCustom("Mời bạn chọn thời gian hiển thị", "fail");
    } else {
      getAPIUpdateLiveContentArticle(result).then((r) => {
        if (r.status > 0) {
          ToastCustom("Cập nhập diễn biến thành công", "success");
          navigate(`/list-article-live-content/${id}`);
        } else if (r.status < 0) {
          ToastCustom(r.message ? r.message : "Cập nhập biến thất bại", "fail");
        }
      });
    }
  };

  const onChangeFromDate = (e) => {
    setFromDate(e);
  };

  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Cập nhập diễn biến"
            pageTitle="Danh sách bài diễn biến"
          />

          <Row>
            <Card style={{ padding: 15 }}>
              <Row>
                <Col className="col-6">
                  <p
                    style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}
                  >
                    {articleTitle}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: !articleStatusIsComplete ? "#0AB39C" : "red",
                      fontStyle: "italic",
                    }}
                  >
                    {articleStatus}
                  </p>
                </Col>
                <Col className="col-6">
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#5E5E5E",
                      marginBottom: 10,
                    }}
                  >
                    Người tạo bài:
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 200,
                      color: "#5E5E5E",
                      marginBottom: 0,
                    }}
                  >
                    {articleCreatedBy || "anonymous"}
                  </p>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">
                          Tiêu đề
                          <RequiredIcon />
                        </Label>
                        <Input
                          className="form-control"
                          placeholder="Nhập tiêu đề diễn biến"
                          type="text"
                          value={contentTitle}
                          onChange={(e) => {
                            setContentTitle(e.target.value);
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <Label htmlFor="article_content" className="form-label">
                          Nội dung diễn biến
                          <RequiredIcon />
                        </Label>
                        <JoditEditorGlobal
                          placeholder="Nhập nội dung diễn biến"
                          editorRef={editorRef}
                          content={content}
                          setContent={setContent}
                        />
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">
                          Thời gian bắt đầu diễn biến
                          <RequiredIcon />
                        </Label>
                        <Col className="col-12">
                          <DatePicker
                            id="start_date"
                            allowClear
                            style={{ width: "100%" }}
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            showTime
                            defaultValue={dayjs(fromDate)}
                          />
                        </Col>
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">
                          Thời gian hiển thị trên website/app
                          <RequiredIcon />
                        </Label>
                        <Input
                          name="article_display_time"
                          className="form-control"
                          placeholder="Nhập thời gian hiển thị"
                          type="text"
                          value={contentDisplayTime}
                          onChange={(e) => {
                            setContentDisplayTime(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="article_author" className="form-label">
                          Tác giả
                        </Label>
                        <Select
                          style={{
                            width: "100%",
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          options={optionsAuthor}
                          // treeDefaultExpandAll
                          placeholder="Có thể chọn nhiều tác giả"
                          optionFilterProp="label"
                          mode="multiple"
                          showSearch
                          treeNodeFilterProp="title"
                          value={valueAuthor}
                          onChange={onChangeAuthor}
                        />
                      </div>

                      <div
                        className="hstack gap-2 justify-content-end"
                        style={{ marginLeft: "0px!important" }}
                      >
                        <button type="button" className="btn btn-light">
                          <Link to={`/list-article-live-content/${id}`}>
                            Quay lại
                          </Link>
                        </button>

                        <button type="submit" className="btn btn-success">
                          Lưu diễn biến
                        </button>
                        {articleLiveStatus &&
                          (articleLiveStatus === 1 ||
                            articleLiveStatus === 5 ||
                            articleLiveStatus === 7) && (
                            <button
                              type="button"
                              onClick={() => setmodal_scroll(true)}
                              className="btn btn-primary"
                            >
                              Gửi duyệt
                            </button>
                          )}
                        {articleLiveStatus && articleLiveStatus === 2 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handlePublish()}
                              className="btn btn-primary"
                            >
                              Xuất bản
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReturnStep()}
                              className="btn btn-success"
                            >
                              Trả lại
                            </button>
                          </>
                        )}

                        {articleLiveStatus && articleLiveStatus === 4 && (
                          <button
                            type="button"
                            onClick={() => handleUnPublish()}
                            className="btn btn-primary"
                          >
                            Hạ xuất bản
                          </button>
                        )}
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardHeader
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    <Label>Media trong bài viết</Label>
                    <SelectMedia
                      title="Thư viện media"
                      onUploadMedia={(url, id, type, originUrl) => {
                        setListImage([
                          ...listImage,
                          { url, id, type, originUrl },
                        ]);
                      }}
                      className={"btn btn-success"}
                    ></SelectMedia>
                  </CardHeader>
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "wrap",
                        gap: "5px",
                      }}
                    >
                      {listImage.map((e) => {
                        return (
                          <div key={uuidv4()}>
                            <Image src={e.url} width={167} height={167}></Image>
                            <div style={{ padding: 10 }}>
                              <Button
                                onClick={() => {
                                  setListImage(
                                    listImage.filter(
                                      (element) => element.id !== e.id
                                    )
                                  );
                                }}
                              >
                                Hủy
                              </Button>
                              <Button
                                type="primary"
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                  setOpenModalAddImage(true);
                                  setDataMedia([
                                    e.url,
                                    e.id,
                                    e.type,
                                    e.originUrl,
                                  ]);
                                }}
                              >
                                Thêm
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
          <ModalAddMedial
            dataMedia={dataMedia}
            isOpen={isOpenModalAddImage}
            addImageLink={addImageLink}
            handleModalClose={() => {
              setOpenModalAddImage(false);
            }}
          />
          <ModalStep
            togScroll={() => setmodal_scroll(!modal_scroll)}
            modalScroll={modal_scroll}
            listUser={listUser}
            article={{
              article_live_id: arrLiveId,
              article_id: id,
              article_title: contentTitle,
              article_content: content,
              start_time: fromDate && dayjs(fromDate).toISOString(),
              display_time: contentDisplayTime,
              other_author: "[" + valueAuthor.toString() + "]",
              article_files:
                listImage.length > 0
                  ? JSON.stringify(listImage.map((e) => e.id))
                  : "",
            }}
          />
        </Container>
      </div>
    </div>
  );
};
export default UpdateContent;
