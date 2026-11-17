import React, { useState, useRef, useEffect, useMemo } from "react";
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

import { Spin } from "antd/lib";
import "../../Article/ArticleType/compare-version.scss";
import {
  TreeSelect,
  Select,
  DatePicker,
  Image,
  Button,
  AutoComplete,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getAPIGetArticleById,
  getAPIGetArticlePrintById,
  getAPIListArticleRelated,
  getAPIListPaperNumber,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostArticlePrint,
  getAPIPostTag,
  getAPITreeListCategory,
} from "../../../../helpers/fakebackend_helper";
import { FilePond, registerPlugin } from "react-filepond";
import Dropzone from "react-dropzone";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import diff from "node-htmldiff";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
//api
import {
  getAPIDeleteTag,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  articleCheckSpellViettel,
} from "../../../../helpers/fakebackend_helper";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { v4 as uuidv4 } from "uuid";
import ModalCheckSpell from "../../../../Components/Common/ModalCheckSpell";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SelectTag from "../../../../Components/Common/SelectTag";
import ModalAddMedial from "../../Article/UpdateArticleType/ModalAddMedia";
import ModalRecordAudio from "../../../../Components/Common/ModalRecordAudio";
import ModalListNormalArticle from "../Modal/ModalListNormalArticle";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import ModalPreviewArticle from "../../Article/UpdateArticleType/ModalPreviewArticle";
import JoditEditorGlobal from "../../Article/UpdateArticleType/JoditEditor";
import mp4_icon from "../../../../assets/images/mp4.png";
import stream_icon from "../../../../assets/images/icon_stream_default.png";
import audio_icon from "../../../../assets/images/audio_default.png";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const { Option } = Select;

const NormalPaper = () => {
  const editorRef = useRef("");
  const jodit = editorRef.current;
  const [content, setContent] = useState("");
  const location = useLocation();
  console.log("location state =>", location.state);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  let navigate = useNavigate();
  const [publishTime, setPublishTime] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [isOpenModalAddImage, setOpenModalAddImage] = useState(false);
  const [dataMedia, setDataMedia] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAudio, setIsModalOpenAudio] = useState(false);
  const [textAudio, setTextAudio] = useState("");
  const [optionsPaperNumber, setOptionsPaperNumber] = useState([]);
  const [valuePaperNumber, setValuePaperNumber] = useState();
  const [openModalArticle, setOpenModalArticle] = useState(false);
  const [keywordSelect, setKeywordSelect] = useState("");
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isOpenModalpreviewArticle, setOpenModalPreviewArticle] =
    useState(false);
  const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  useEffect(() => {
    if (textAudio)
      jodit.s.insertHTML(`
            <p>${textAudio} </p>
    `);
  }, [textAudio]);
  function addImageLink(e, id, type, originUrl, width) {
    if (type === "image") {
      const imageLink = `${e}`;
      jodit.s.insertHTML(`
          <figure class="image" style="width: ${width};margin: 0 auto;text-align: center;" id="add_image_link">
            <img width="100%" src=${imageLink} />
             <figcaption>Nhập chú thích</figcaption>
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

  function onChangeAuthor(value) {
    if (value === undefined) {
      value = null;
    }
    setValueAuthor(value);
  }

  const showModalCheckSpell = () => {
    setIsModalOpen(true);
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      article_title: "", //article_content!=undefined?"":article_content.article_title,
      article_sapo: "",
      slug: "",
    },
    validationSchema: Yup.object({
      article_title: Yup.string()
        .required("Mời bạn nhập tên bài viết ")
        .max(175, "Tên bài viết không nhập quá 175 ký tự"),
      article_sapo: Yup.string().max(
        500,
        "Sapo bài viết không được quá 500 ký tự"
      ),
    }),
    onSubmit: (values) => {
      const data = {
        article_title: values.article_title,
        sub_title: values.sub_title,
        article_sapo: values.article_sapo,
        pen_name: values.pen_name,
        other_author: "[" + valueAuthor.toString() + "]",
        article_content: content,
        article_paper_number_id: valuePaperNumber,
        // user_create_id: 90,
        // user_modify_id: "",
        // list_article_relate: "[" + valueArticleRelate.toString() + "]",
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
        // } else if (!valuePaperNumber) {
        //   ToastCustom("Mời bạn chọn số báo", "fail");
      } else {
        // save new article
        getAPIPostArticlePrint(result).then((r) => {
          if (r.status && r.status > 0) {
            ToastCustom("Thêm bài viết thành công", "success");
            // validation.resetForm();
            // navigate(`/list-newspaper/${r.data.data}`);
            navigate(`/update-newspaper/${r.data}`);
          } else {
            ToastCustom(r.message && r.message, "fail");
          }
        });
      }
    },
  });
  // useEffect(() => {
  //   setAvatar();
  //   if (article_content != undefined) {
  //     setAvatar(article_content.avatar_image);
  //     editorRef.current.setContent(article_content.article_content);
  //     validation.setFieldValue("article_title", article_content.article_title);
  //     validation.setFieldValue("article_sapo", article_content.article_sapo);
  //     validation.setFieldValue(
  //       "slug",
  //       convertVietnamese(article_content.article_title)
  //     );
  //   }
  // }, [article_content]);

  useEffect(() => {
    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            // value: e.user_id,
            value: e.user_id,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
    getAPIListPaperNumber().then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            valueToSend: e.article_paper_number_id,
            value: e.paper_number,
          });
        });
      }
      setOptionsPaperNumber(options);
    });
  }, []);
  const onChangePaperNumber = (_, option) => {
    if (option === undefined) {
      option = null;
    }
    if (optionsPaperNumber && optionsPaperNumber.length > 0) {
      optionsPaperNumber.forEach((item) => {
        item.valueToSend === option.valueToSend &&
          validation.setFieldValue(`article_title`, item.value);
      });
    }
    console.log(option);
    setValuePaperNumber(option.valueToSend);
  };

  const getArticleFast = (id) => {
    getAPIGetArticleById(id).then((res) => {
      if (res.status > 0) {
        validation.setFieldValue("article_title", res.data.article_title);
        validation.setFieldValue("sub_title", res.data.sub_title);
        validation.setFieldValue("pen_name", res.data.pen_name);
        validation.setFieldValue("article_sapo", res.data.article_sapo);
        // setValuePaperNumber(
        //   dataRes && dataRes.article_paper_number.article_paper_number_id
        // );
        setContent(res.data.article_content);
        setValueAuthor(JSON.parse(res.data.other_author || "[]"));
        setOpenModalArticle(false);
      }
    });
  };
  useEffect(() => {
    const { articleId } = location.state || {};
    if (articleId) getArticleFast(articleId);
  }, [location.state]);
  useEffect(() => {
    setIsLoadingSelect(true);
    const delayDebounceFn = setTimeout(() => {
      if (keywordSelect && keywordSelect.length > 0) {
        getAPIListPaperNumber(keywordSelect).then((res) => {
          if (res.data && res.data.list && res.status > 0) {
            var options = [];
            res.data.list.forEach((e) => {
              options.push({
                valueToSend: e.article_paper_number_id,
                value: e.paper_number,
              });
            });
          }
          setOptionsPaperNumber(options);
          setIsLoadingSelect(false);
        });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [keywordSelect]);
  useEffect(() => {
    setIsLoadingSelect(true);
    if (keywordSelect === "") {
      getAPIListPaperNumber().then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          var options = [];
          res.data.list.forEach((e) => {
            options.push({
              valueToSend: e.article_paper_number_id,
              value: e.paper_number,
            });
          });
        }
        setOptionsPaperNumber(options);
        setIsLoadingSelect(false);
      });
    }
  }, [keywordSelect]);
  return (
    <div id="article-wrap" style={{ width: "97%", margin: "94px auto 0 auto" }}>
      <BreadCrumb title="Tạo bài báo in" pageTitle="Danh sách báo in" />

      <Row>
        <Col lg={8} style={{ overflow: "auto", height: "90vh" }}>
          <Card style={{ marginBottom: 50 }}>
            <CardBody>
              <Form
                style={{ position: "relative" }}
                className="tablelist-form "
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="mb-3">
                  <Label htmlFor="sub_title" className="form-label">
                    Tiêu đề phụ
                  </Label>
                  <Input
                    name="sub_title"
                    type="text"
                    className="form-control"
                    id="sub_title"
                    placeholder="Toà Soạn Hội Tụ"
                    validate={{
                      required: { value: true },
                    }}
                    onChange={validation.handleChange}
                    onBlur={(e) => {
                      validation.handleBlur(e);
                      // validation.values.slug = convertVietnamese(
                      //   validation.values.sub_title
                      // );
                    }}
                    invalid={
                      !!(
                        validation.touched.sub_title &&
                        validation.errors.sub_title
                      )
                    }
                    value={validation.values.sub_title}
                  />
                  {validation.touched.sub_title &&
                  validation.errors.sub_title ? (
                    <FormFeedback type="invalid">
                      {validation.errors.sub_title}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="article_title" className="form-label">
                    Tiêu đề <RequiredIcon />
                  </Label>
                  <Input
                    name="article_title"
                    type="text"
                    className="form-control"
                    id="article_title"
                    placeholder="Nhập tiêu đề bài viết"
                    value={validation.values.article_title}
                    validate={{
                      required: { value: true },
                    }}
                    onChange={(e) => {
                      validation.handleChange(e);
                    }}
                    onBlur={(e) => {
                      validation.handleBlur(e);
                      validation.values.slug = convertVietnamese(
                        validation.values.article_title
                      );
                    }}
                    invalid={
                      validation.touched.article_title &&
                      validation.errors.article_title
                        ? true
                        : false
                    }
                  />
                  {validation.touched.article_title &&
                  validation.errors.article_title ? (
                    <FormFeedback type="invalid">
                      {validation.errors.article_title}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="article_sapo" className="form-label">
                    Sapo
                  </Label>
                  <Input
                    value={validation.values.article_sapo}
                    name="article_sapo"
                    type="textarea"
                    className="form-control"
                    id="article_sapo"
                    placeholder="Tóm tắt bài viết không quá 500 ký tự"
                    // validate={{
                    //   required: { value: true },
                    // }}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.article_sapo &&
                      validation.errors.article_sapo
                        ? true
                        : false
                    }
                  />
                  {validation.touched.article_sapo &&
                  validation.errors.article_sapo ? (
                    <FormFeedback type="invalid">
                      {validation.errors.article_sapo}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="article_content" className="form-label">
                    Nội dung
                  </Label>
                  <JoditEditorGlobal
                    placeholder="Nhập nội dung bài viết"
                    editorRef={editorRef}
                    content={content}
                    setContent={setContent}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* <div style={{ marginBottom: "10px" }}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={showModalCheckSpell}
                    >
                      Kiểm tra chính tả
                    </button>
                  </div> */}
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        setIsModalOpenAudio(true);
                      }}
                    >
                      Lấy bản tin
                    </button>
                    <button
                      type="button"
                      style={{ marginLeft: "10px" }}
                      className="btn btn-success "
                      onClick={() => {
                        setOpenModalPreviewArticle(true);
                      }}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <ModalCheckSpell
                  editorRef={editorRef}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
                <ModalRecordAudio
                  isModalOpen={isModalOpenAudio}
                  setIsModalOpen={setIsModalOpenAudio}
                  setTextAudio={(e) => {
                    setTextAudio(e);
                  }}
                />

                {/* <div className="mb-3">
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
                    mode="multiple"
                    showSearch
                    treeNodeFilterProp="title"
                    value={valueAuthor}
                    onChange={onChangeAuthor}
                  />
                </div> */}
                <div className="mb-3 d-flex gap-3">
                  <div className="w-50">
                    <Label htmlFor="pen_name" className="form-label">
                      Bút danh
                      {/* <RequiredIcon /> */}
                    </Label>
                    <Input
                      name="pen_name"
                      style={{ height: "32px" }}
                      type="text"
                      className="form-control"
                      id="pen_name"
                      placeholder="Nhập tên bút danh"
                      validate={{
                        required: { value: false },
                      }}
                      value={validation.values.pen_name}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.pen_name &&
                        validation.errors.pen_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.pen_name &&
                    validation.errors.pen_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.pen_name}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="w-50">
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
                      optionFilterProp="label"
                      // treeDefaultExpandAll
                      placeholder="Có thể chọn nhiều tác giả"
                      mode="multiple"
                      showSearch
                      treeNodeFilterProp="title"
                      value={valueAuthor}
                      onChange={onChangeAuthor}
                    />
                  </div>
                </div>
                <div className="hstack gap-2 justify-content-end">
                  <button type="submit" className="btn btn-success">
                    Lưu bài viết
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4} style={{ overflow: "auto", height: "89vh" }}>
          <CardBody>
            <div className="mb-3">
              <Label htmlFor="article_title" className="form-label">
                Chọn số báo
                {/*<RequiredIcon />*/}
              </Label>
              {/* <Select
                style={{
                  width: "100%",
                }}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                showSearch
                allowClear
                loading={isLoadingSelect}
                // options={optionsPaperNumber}
                // treeDefaultExpandAll
                placeholder="Chọn ngày phát hành"
                treeNodeFilterProp="title"
                value={keywordSelect}
                notFoundContent={optionsPaperNumber?.length === 0}
                onChange={(e) => console.log("change", e)}
                onSearch={(e) => setKeywordSelect(e)}
                // onChangePaperNumber
              >
                {optionsPaperNumber?.map((option, idx) => (
                  <Option key={idx} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select> */}
              <AutoComplete
                style={{
                  width: "100%",
                }}
                options={
                  isLoadingSelect
                    ? [
                        {
                          value: "NULL",
                          disabled: true,
                          label: (
                            <div
                              className="d-flex justify-content-center align-items-center w-100"
                              style={{ height: "60px" }}
                            >
                              <Spin size="medium" />
                            </div>
                          ),
                        },
                      ]
                    : optionsPaperNumber
                }
                // onSelect={onChangePaperNumber}
                defaultValue={
                  optionsPaperNumber.filter(
                    (option) => option.valueToSend === valuePaperNumber
                  )[0]?.value || null
                }
                onSelect={onChangePaperNumber}
                onSearch={(text) => setKeywordSelect(text)}
                placeholder="Chọn ngày phát hành"
                allowClear={false}
                notFoundContent={
                  <div className="text-center">Không có dữ liệu trùng khớp</div>
                }
                loading={isLoadingSelect}
              />
            </div>
          </CardBody>
          <Card>
            <CardHeader
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Label>Lấy bài báo điện tử</Label>
              <button
                onClick={() => {
                  setOpenModalArticle(true);
                }}
                type="button"
                class="btn btn-success"
              >
                Danh sách bài viết
              </button>
            </CardHeader>
          </Card>
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
                  setListImage([...listImage, { url, id, type, originUrl }]);
                }}
                className={"btn btn-success"}
              ></SelectMedia>
            </CardHeader>
            {listImage && listImage.length > 0 && (
              <CardBody>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "wrap",
                    gap: "5px",
                  }}
                >
                  {listImage.map((e, index) => {
                    return (
                      <div key={index}>
                        {e.type === "image" ? (
                          <Image
                            style={{ width: 167, height: 167 }}
                            src={e.url}
                            width={167}
                            height={167}
                          ></Image>
                        ) : (
                          <img
                            style={{
                              width: 167,
                              height: 167,
                              cursor: "pointer",
                            }}
                            // onClick={() => {
                            //   setOpenModalPreview(true);
                            //   setDataPreview(e);
                            // }}
                            src={
                              (e.type === "image" && e.url) ||
                              (e.type === "audio" && audio_icon) ||
                              (e.type === "stream" && stream_icon) ||
                              (e.type === "video" && mp4_icon)
                            }
                            width={167}
                            height={167}
                          ></img>
                        )}
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
                              setDataMedia([e.url, e.id, e.type, e.originUrl]);
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
            )}
          </Card>
        </Col>
      </Row>
      {isOpenModalpreviewArticle && (
        <ModalPreviewArticle
          title={validation.values.article_title}
          sapo={validation.values.article_sapo}
          author={validation.values.pen_name}
          subTitle={validation.values.sub_title}
          dataPreview={content}
          isOpen={isOpenModalpreviewArticle}
          handleModalClose={() => {
            setOpenModalPreviewArticle(false);
          }}
        />
      )}
      <ModalAddMedial
        dataMedia={dataMedia}
        isOpen={isOpenModalAddImage}
        addImageLink={addImageLink}
        handleModalClose={() => {
          setOpenModalAddImage(false);
        }}
      />
      <ModalListNormalArticle
        getArticleFast={getArticleFast}
        isModalOpen={openModalArticle}
        setIsModalOpen={() => {
          setOpenModalArticle(false);
        }}
      ></ModalListNormalArticle>
    </div>
  );
};
export default NormalPaper;
