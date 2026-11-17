import React, { useState, useRef, useEffect, useMemo } from "react";
import "./ArticleType.css";
import moment from "moment";
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
import "./compare-version.scss";
import { TreeSelect, Select, DatePicker, Image, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { useNavigate } from "react-router-dom";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPITreeListCategory,
} from "../../../../helpers/fakebackend_helper";
import { FilePond, registerPlugin } from "react-filepond";
import Dropzone from "react-dropzone";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import diff from "node-htmldiff";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
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
import {
  PlusCircleOutlined,
  PlusOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";
import SelectTag from "../../../../Components/Common/SelectTag";
import ModalAddMedial from "../UpdateArticleType/ModalAddMedia";
import ModalRecordAudio from "../../../../Components/Common/ModalRecordAudio";
import IconMenu from "../../../../assets/images/iconMenuSearch.png";
import IconGoogle from "../../../../assets/images/icon_google_search.png";
import IconChatgpt from "../../../../assets/images/icon_chatgpt.png";
import ModalGoogleSearch from "./ModalGoogleSearch";
import ModalChatGPT from "./ModalChatGPT";
import ModalPreview from "../UpdateArticleType/ModalPreview";
import { Value } from "sass";
import ModalPreviewArticle from "../UpdateArticleType/ModalPreviewArticle";
import mp4_icon from "../../../../assets/images/mp4.png";
import stream_icon from "../../../../assets/images/icon_stream_default.png";
import audio_icon from "../../../../assets/images/audio_default.png";
import JoditEditor from "jodit-react";
import JoditEditorGlobal from "../UpdateArticleType/JoditEditor";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const NormalArticle = ({ article_type, article_content }) => {
  const [selectedFiles, setselectedFiles] = useState([]);
  const [valueCategory, setValueCategory] = useState();
  const [valueOtherCategory, setValueOtherCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [localNews, setLocalNews] = useState([]);
  const [valueAuthor, setValueAuthor] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState(false);
  const [outstanding2, setOutstanding2] = useState(false);
  const [imageNew, setImageNew] = useState();
  const [inforgraphic, setInforgraphic] = useState();
  let navigate = useNavigate();
  const editorRef = useRef("");
  const jodit = editorRef.current;
  const [publishTime, setPublishTime] = useState(null);
  const [listImage, setListImage] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);
  const [isOpenModalAddImage, setOpenModalAddImage] = useState(false);
  const [isOpenModalpreview, setOpenModalPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [isOpenModalpreviewArticle, setOpenModalPreviewArticle] =
    useState(false);
  const [dataPreView, setDataPreview] = useState();
  const [isOpenGoogleSearch, setIsOpenGoogleSearch] = useState(false);
  const [isOpenChatGPT, setIsOpenChatGPT] = useState(false);
  const [dataMedia, setDataMedia] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAudio, setIsModalOpenAudio] = useState(false);
  const [textAudio, setTextAudio] = useState("");

  const { media } = useSelector((state) => ({
    media: state.FileManager.media,
  }));
  const [reloadTag, setReloadTag] = useState();

  useEffect(() => {
    if (textAudio && editorRef.current)
      jodit.s.insertHTML(`
            <p>${textAudio} </p>
    `);
  }, [textAudio]);
  function addImageLink(e, id, type, originUrl, width) {
    if (type === "image" && editorRef.current) {
      const imageLink = `${e}`;
      jodit.s.insertHTML(`
          <figure class="image" style="width: ${width};margin: 0 auto; text-align: center;" id="add_image_link">
            <img width="100%" src=${imageLink} />
           <figcaption style="text-align: center;">Nhập chú thích</figcaption>
          </figure>
    `);
    }
    if (type === "audio" && editorRef.current) {
      jodit.s.insertHTML(`
          <div style="
          display: flex;
          justify-content: center;
          margin: 0 auto;
          width:${width};
        ">
         <audio src=${originUrl} 
         controls="controls" data-mce-src=${originUrl}></audio>
        </div>
      `);
    }
    if (type === "video" && editorRef.current) {
      jodit.s.insertHTML(`
        <div style="
          display: flex;
          justify-content: center;
          margin: 0 auto;
          width:${width};
        ">
          <video controls="controls" width="100%" height="fit">
          <source src=${originUrl} type="video/mp4"
           data-mce-src=${originUrl}></video>
        </div>`);
    }
  }

  function removeImageLink() {
    editorRef.current.dom.remove(
      editorRef.current.dom.select("#add_image_link")
    );
  }

  function onChangeAuthor(value) {
    console.log(value);
    if (value === undefined) {
      value = null;
    }
    setValueAuthor(value);
  }

  function onChangeCategory(value) {
    if (value === undefined) {
      value = null;
    }
    setValueCategory(value);
  }
  function onChangeOtherCategory(value) {
    if (value === undefined) {
      value = null;
    }
    setValueOtherCategory(value);
  }

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  const showModalCheckSpell = () => {
    setIsModalOpen(true);
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  document.title = "Thêm bài viết | Toà Soạn Hội Tụ";
  const [avatar, setAvatar] = useState("");

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
      slug: Yup.string()
        .required("Mời bạn nhập slug cho bài viết")
        .matches(/^[a-zA-Z0-9\-]+$/, "Slug không được chứa ký tự đặc biệt"),
    }),
    onSubmit: (values) => {
      const data = {
        article_title: values.article_title,
        sub_title: values.sub_title,
        article_sapo: values.article_sapo,
        category_id: valueCategory,
        list_categoryid:
          valueOtherCategory?.length > 0
            ? JSON.stringify(valueOtherCategory)
            : null,
        pen_name: values.pen_name,
        // author: valueAuthor,
        other_author: "[" + valueAuthor.toString() + "]",
        article_type_id: article_type,
        article_content: content,
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        outstanding: outstanding1 ? 1 : 2,
        is_multi_media: imageNew ? 1 : 2,
        enable_comment: values.enable_comment ? 1 : 0,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.slug,
        article_files:
          listImage.length > 0
            ? JSON.stringify(listImage.map((e) => e.id))
            : "",
        note: "",
        user_create_id: 90,
        user_modify_id: "",
        list_article_relate: "[" + valueArticleRelate.toString() + "]",
      };

      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!result.article_type_id) {
        ToastCustom("Loại bài viết không xác định", "fail");
      } else if (!result.category_id) {
        ToastCustom("Mời bạn chọn chuyên mục bài viết", "fail");
      } else if (!result.avatar_image) {
        ToastCustom("Mời bạn chọn ảnh bài viết", "fail");
      } else if (outstanding1 && outstanding2) {
        ToastCustom("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm", "fail");
      } else if (imageNew && inforgraphic) {
        ToastCustom("Chỉ được chọn tin ảnh hoặc Inforgraphic", "fail");
      } else {
        // save new article
        getAPIPostArticle(result).then((r) => {
          if (r.status && r.status > 0) {
            ToastCustom("Thêm bài viết thành công", "success");
            validation.resetForm();
            console.log("r.data", r);
            if (r.data) {
              navigate(`/update-article/${r.data}`, {
                state: {
                  type: result.article_type_id,
                },
              });
            } else {
              navigate(`/list-article`);
            }
          } else {
            ToastCustom(r.message && r.message, "fail");
          }
        });
      }
    },
  });
  useEffect(() => {
    setAvatar();
    if (article_content != undefined) {
      setAvatar(article_content.avatar_image);
      jodit.s.insertHTML(article_content.article_content);
      validation.setFieldValue("article_title", article_content.article_title);
      validation.setFieldValue("sub_title", article_content.sub_title);
      validation.setFieldValue("article_sapo", article_content.article_sapo);
      validation.setFieldValue(
        "slug",
        convertVietnamese(article_content.article_title)
      );
    }
  }, [article_content]);
  useEffect(() => {
    getAPITreeListCategory(0, -1).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv2.map((x) => ({
              value: x.category_id,
              title: x.category_name,
              children: x.list_categories_lv3.map((y) => ({
                value: y.category_id,
                title: y.category_name,
              })),
            })),
          });
        });
        var optionsTDP = [];
        const tinDiaPhuong = res.data.list.find(
          (item) => item.category_id === 98
        );
        tinDiaPhuong.list_categories_lv2.forEach((e) => {
          optionsTDP.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv3.map((x) => ({
              value: x.category_id,
              title: x.category_name,
            })),
          });
        });
      }
      setLocalNews(optionsTDP);
      setOptionsCategory(options);
    });
    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
  }, []);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };

  return (
    <div id="article-wrap">
      <Row>
        {/* <Col lg={8}>
          <div style={{ marginBottom: "0px", display: "flex" }}>
            <div
              onClick={() => setExpanded((prev) => !prev)}
              className="expand-button"
              style={{
                width: "36px",
                height: "36px",
                top: "0px",
                right: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <ExpandAltOutlined style={{ fontSize: "18px" }} />
            </div>
          </div>
        </Col> */}

        <Col
          lg={expanded ? 12 : 8}
          style={{ overflow: "auto", height: "69vh" }}
        >
          <Card style={{ marginBottom: 50, position: "relative" }}>
            <CardBody>
              <div
                onClick={() => setExpanded((prev) => !prev)}
                className=""
                style={{
                  position: "absolute",
                  width: "36px",
                  height: "36px",
                  top: "0px",
                  right: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                {expanded ? (
                  <ShrinkOutlined style={{ fontSize: "18px" }} />
                ) : (
                  <ExpandAltOutlined style={{ fontSize: "18px" }} />
                )}
              </div>
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
                    validate={{
                      required: { value: true },
                    }}
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
                      marginTop: "20px",
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

                <div className="mb-3">
                  <Label htmlFor="article_category" className="form-label">
                    Chuyên mục <RequiredIcon />
                  </Label>
                  <TreeSelect
                    style={{
                      width: "100%",
                    }}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                    allowClear
                    treeData={optionsCategory}
                    treeDefaultExpandAll
                    placeholder="Chuyên mục"
                    value={valueCategory}
                    showSearch
                    treeNodeFilterProp="title"
                    onChange={onChangeCategory}
                  />
                </div>
                <div className="mb-3">
                  <Label htmlFor="list_categoryid" className="form-label">
                    Tin địa phương
                  </Label>
                  <TreeSelect
                    style={{
                      width: "100%",
                    }}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                    allowClear
                    treeData={localNews}
                    treeDefaultExpandAll
                    placeholder="Tin địa phương"
                    value={valueOtherCategory}
                    multiple
                    showSearch
                    treeNodeFilterProp="title"
                    onChange={onChangeOtherCategory}
                  />
                  {/* <Select
                    style={{
                      width: "100%",
                    }}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                    allowClear
                    options={optionsCategory}
                    // treeDefaultExpandAll
                    placeholder="Có thể chọn nhiều tác giả"
                    mode="multiple"
                    showSearch
                    treeNodeFilterProp="title"
                    value={valueOtherCategory}
                    onChange={onChangeOtherCategory} 
                  />*/}
                </div>
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
                <div className="mb-3">
                  <Label htmlFor="slug" className="form-label">
                    Slug <RequiredIcon />
                  </Label>
                  <Input
                    name="slug"
                    type="text"
                    className="form-control"
                    id="slug"
                    placeholder="slug"
                    validate={{
                      required: { value: true },
                    }}
                    value={validation.values.slug}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.slug && validation.errors.slug
                        ? true
                        : false
                    }
                  />
                  {validation.touched.slug && validation.errors.slug ? (
                    <FormFeedback type="invalid">
                      {validation.errors.slug}
                    </FormFeedback>
                  ) : null}
                </div>
                <SelectTag
                  setOptionTag={setOptionTag}
                  setSelectedTags={setSelectedTags}
                  setValueArticleRelate={setValueArticleRelate}
                  optionsTag={optionsTag}
                  articleRelate={articleRelate}
                  selectedTags={selectedTags}
                  valueArticleRelate={valueArticleRelate}
                  setReloadTag={() => setReloadTag(!reloadTag)}
                  setArticleRelate={setArticleRelate}
                  reloadTag={reloadTag}
                />
                <div className="hstack gap-2 justify-content-end">
                  <button type="submit" className="btn btn-success">
                    Lưu bài viết
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col lg={expanded ? 0 : 4} style={{ overflow: "auto", height: "69vh" }}>
          <Card>
            <CardHeader>
              <Label htmlFor="article_avatar" className="form-label">
                Ảnh đại diện
              </Label>
              <RequiredIcon />
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <SelectMedia
                  type={"dropzone"}
                  onUploadMedia={(e) => {
                    setAvatar(e);
                  }}
                  defaultImgSrc={avatar}
                ></SelectMedia>
                <div>
                  <p
                    style={{
                      marginTop: "8px",
                      fontStyle: "italic",
                      color: "rgb(104 99 99)",
                    }}
                  >
                    Ảnh đại diện bài viết không được vượt quá 10MB
                  </p>
                </div>
              </div>
            </CardBody>
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
                onUploadMedia={(url, id, type, originUrl, nameFile) => {
                  setListImage([
                    ...listImage,
                    { url, id, type, originUrl, nameFile },
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
                          style={{ width: 167, height: 167, cursor: "pointer" }}
                          onClick={() => {
                            setOpenModalPreview(true);
                            setDataPreview(e);
                          }}
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
                      <p
                        style={{
                          width: "150px",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {e.nameFile}
                      </p>
                      <div style={{ padding: 10 }}>
                        <Button
                          onClick={() => {
                            setListImage(
                              listImage.filter((element) => element.id !== e.id)
                            );
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          disabled={e.type === "stream" ? true : false}
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
          </Card>
          <Card>
            <CardBody>
              <Form
                className="tablelist-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="mb-3">
                  <div className="mb-3">
                    <div
                      className="form-check form-switch form-switch-lg"
                      dir="ltr"
                    >
                      <Label
                        className="form-check-label"
                        htmlFor="enable_comment"
                      >
                        Cho phép bình luận
                      </Label>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="enable_comment"
                        value={validation.values.enable_comment}
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        // onChange={(values) => {
                        //   const temp = { ...ads };
                        //   temp.status = values.target.checked ? 1 : 0;
                        //   setAds(temp);
                        // }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="form-check form-switch form-switch-lg"
                      dir="ltr"
                    >
                      <Label
                        className="form-check-label"
                        htmlFor="outstanding1"
                      >
                        Lưu kho tin nổi bật
                      </Label>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="outstanding1"
                        value={outstanding1}
                        onChange={(e) => {
                          setOutstanding1(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="form-check form-switch form-switch-lg"
                      dir="ltr"
                    >
                      <Label
                        className="form-check-label"
                        htmlFor="outstanding2"
                      >
                        Lưu kho tin tiêu điểm
                      </Label>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="outstanding2"
                        value={outstanding2}
                        onChange={(e) => {
                          setOutstanding2(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="form-check form-switch form-switch-lg"
                      dir="ltr"
                    >
                      <Label className="form-check-label" htmlFor="imageNew">
                        Tin ảnh
                      </Label>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="imageNew"
                        checked={imageNew}
                        value={imageNew}
                        onChange={(e) => {
                          setImageNew(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="form-check form-switch form-switch-lg"
                      dir="ltr"
                    >
                      <Label
                        className="form-check-label"
                        htmlFor="inforgraphic"
                      >
                        Inforgraphic
                      </Label>
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="inforgraphic"
                        checked={inforgraphic}
                        value={inforgraphic}
                        onChange={(e) => {
                          setInforgraphic(e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Form
                className="tablelist-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="mb-3">
                  <div className="card-body">
                    <div className="col-lg-12">
                      <Label htmlFor="article_title" className="form-label">
                        Hẹn giờ xuất bản
                      </Label>
                      <DatePicker
                        id="date"
                        format=" DD-MM-YYYY HH:mm"
                        className="col-lg-12 mt-2"
                        showTime
                        defaultValue={
                          publishTime !== null ? dayjs(publishTime) : null
                        }
                        disabledDate={disabledDate}
                        onChange={onChangeFromDate}
                        placeholder="Chọn ngày"
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ModalAddMedial
        dataMedia={dataMedia}
        isOpen={isOpenModalAddImage}
        addImageLink={addImageLink}
        handleModalClose={() => {
          setOpenModalAddImage(false);
        }}
      />
      {isOpenModalpreview && (
        <ModalPreview
          dataPreview={dataPreView}
          isOpen={isOpenModalpreview}
          handleModalClose={() => {
            setOpenModalPreview(false);
          }}
        />
      )}
      {isOpenModalpreviewArticle && editorRef && editorRef.current && (
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

      <div className="MenuSearchBox" style={{ zIndex: 9999999999999 }}>
        {isOpenGoogleSearch && (
          <ModalGoogleSearch
            isOpen={isOpenGoogleSearch}
            handleModalClose={() => {
              setIsOpenGoogleSearch(false);
            }}
          />
        )}
        {/*{isOpenChatGPT && (*/}
        {/*  <ModalChatGPT*/}
        {/*    isOpen={isOpenChatGPT}*/}
        {/*    handleModalClose={() => {*/}
        {/*      setIsOpenChatGPT(false);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
        <img src={IconMenu} alt="menu" className="iconMenuBox" />
        <img
          src={IconGoogle}
          alt="google search"
          className="iconGoogleBoxSearch"
          onClick={() => {
            setIsOpenGoogleSearch(!isOpenGoogleSearch);
            setIsOpenChatGPT(false);
          }}
        />
        {/*<img*/}
        {/*  src={IconChatgpt}*/}
        {/*  alt="chatgpt search"*/}
        {/*  className="iconChatgptBoxSearch"*/}
        {/*  onClick={() => {*/}
        {/*    setIsOpenChatGPT(!isOpenChatGPT);*/}
        {/*    setIsOpenGoogleSearch(false);*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
    </div>
  );
};
export default NormalArticle;
