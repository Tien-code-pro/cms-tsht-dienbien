import BreadCrumb from "../../../Components/Common/BreadCrumb";
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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { Spin } from "antd/lib";
// import "./compare-version.scss";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../Components/Common/Toast";
import {
  getAPIListAuthor,
  getAPIPostTransitionPublishRole,
  getAPIPostTransitionUnPublishRole,
  getAPIPutArticle,
  getAPIRoleByArticleId,
  getAPIArticleHistory,
  getArticleFileMediaList,
  getAPIGetReturnRole,
  updateArticleCommentPublish,
  updateArticleFucusPublish,
  getCheckPublishArticleByUser,
  getAPIGetArticlePrintById,
  getAPIListPaperNumber,
  getAPIPutArticlePrint,
  getAPIArticlePrintRevokeApproval,
  getAPIApprovalArticlePrint,
  getAPIRoleByArticlePrintId,
  getAPIGetReturnRolePrint,
  getAPIArticlePrintHistory,
} from "../../../helpers/fakebackend_helper";
import {
  DatePicker,
  Popconfirm,
  Select,
  Steps,
  Modal,
  Image,
  Button,
  AutoComplete,
} from "antd";
import classnames from "classnames";

import { convertVietnamese } from "../../../helpers/text_helper";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import CustomModal from "../Article/UpdateArticleType/ModelStepsInfo.component";
import moment from "moment";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import diff from "node-htmldiff";
import { v4 as uuidv4 } from "uuid";
import ComponentArticlePricePrint from "../Article/UpdateArticleType/ComponentArticlePricePrint";
import ModalPreviewArticle from "../Article/UpdateArticleType/ModalPreviewArticle";
import momentTZ from "moment-timezone";
import JoditEditorGlobal from "../Article/UpdateArticleType/JoditEditor";
import mp4_icon from "../../../assets/images/mp4.png";
import stream_icon from "../../../assets/images/icon_stream_default.png";
import audio_icon from "../../../assets/images/audio_default.png";
const UpdateArticlePrint = () => {
  const editorRef = useRef("");
  const jodit = editorRef.current;
  const [content, setContent] = useState("");
  document.title = "Thông tin bài viết | Toà Soạn Hội Tụ";
  const [valueCategory, setValueCategory] = useState();
  const [activeTab, setActiveTab] = useState("article");
  const [role, setRole] = useState();
  const [reload, setReload] = useState(false);
  const [currentRole, setCurrentRole] = useState();
  const [publishTime, setPublishTime] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const [articleTypeId, setArticleTypeId] = useState();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState();
  const [enableComment, setEnableComment] = useState();
  const [is_speech, setis_speech] = useState();
  const [listImage, setListImage] = useState([]);
  const { id } = useParams();
  let navigate = useNavigate();
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [currentClick, setCurrentClick] = useState();
  const [listUser, setListUser] = useState();
  const [stepName, setStepName] = useState();
  const [version, setVersion] = useState();
  const [version2, setVersion2] = useState();
  const [versionTitle, setVersionTitle] = useState();
  const [versionSubTitle, setVersionSubTitle] = useState();
  const [versionSapo, setVersionSapo] = useState();
  const [versionContent, setVersionContent] = useState();
  const [versionContent1, setVersion1Content] = useState();
  const [versionContent2, setVersion2Content] = useState();
  const [versionSubTitle1, setVersion1SubTitle] = useState();
  const [versionSubTitle2, setVersion2SubTitle] = useState();
  const [versionTitle1, setVersion1Title] = useState();
  const [versionTitle2, setVersion2Title] = useState();
  const [versionSapo1, setVersion1Sapo] = useState();
  const [versionSapo2, setVersion2Sapo] = useState();
  const [articleHistory, setArticleHistory] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [statusId, setStatusId] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionsPaperNumber, setOptionsPaperNumber] = useState([]);
  const [valuePaperNumber, setValuePaperNumber] = useState();
  const [keywordSelect, setKeywordSelect] = useState("");
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isOpenModalpreviewArticle, setOpenModalPreviewArticle] =
    useState(false);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [isExportArticle, setExportArticle] = useState(-1);
  const showModal = () => {
    setOpen(true);
  };
  const showModalCheckSpell = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  // console.log("curr role:", currentRole);
  const onChangeVersion1 = (version) => {
    setVersion(version);
  };
  const onChangeVersion2 = (version) => {
    setVersion2(version);
  };
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
  function compareVersion() {
    if (version == null) {
      ToastCustom("Mời bạn chọn phiên bản trước của bài viết", "fail");
    } else if (version2 == null) {
      ToastCustom("Mời bạn chọn phiên bản sau của bài viết", "fail");
    } else {
      const version_title = articleHistory.filter(
        (e) => e.modified_date === version
      )[0]?.article_title;
      const version2_title = articleHistory.filter(
        (e) => e.modified_date === version2
      )[0]?.article_title;
      const version_content = articleHistory.filter(
        (e) => e.modified_date === version
      )[0]?.article_content;
      const version2_content = articleHistory.filter(
        (e) => e.modified_date === version2
      )[0]?.article_content;
      const versionTotal1 = articleHistory.filter(
        (e) => e.modified_date === version
      )[0];
      const versionTotal2 = articleHistory.filter(
        (e) => e.modified_date === version2
      )[0];
      setVersionContent(diff(version_content, version2_content));
      setVersion1Content(version_content);
      setVersion2Content(version2_content);
      setVersion1Title(version_title);
      setVersion2Title(version2_title);
      setVersion1SubTitle(versionTotal1.sub_title);
      setVersion2SubTitle(versionTotal2.sub_title);
      // setVersion1SubTitle
      const version_sapo = articleHistory.filter(
        (e) => e.modified_date === version
      )[0]?.article_sapo;
      const version2_sapo = articleHistory.filter(
        (e) => e.modified_date === version2
      )[0]?.article_sapo;
      setVersion1Sapo(version_sapo);
      setVersion2Sapo(version2_sapo);
      setVersionSubTitle(
        diff(
          `<p>${versionTotal1.sub_title || ""}</p>`,
          `<p>${versionTotal2.sub_title || ""}</p>`
        ) || ""
      );
      setVersionTitle(
        diff(
          `<p>${version_title || ""}</p>`,
          `<p>${version2_title || ""}</p>`
        ) || ""
      );
      setVersionSapo(
        diff(`<p>${version_sapo || ""}</p>`, `<p>${version2_sapo || ""}</p>`) ||
          ""
      );
    }
  }
  function openCompare() {
    showModal();
  }

  function onChangeAuthor(value) {
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
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      article_title: "",
      article_sapo: "",
      slug: "",
    },
    validationSchema: Yup.object({
      article_title: Yup.string().required("Mời bạn nhập tên bài viết"),
      article_sapo: Yup.string()
        // .required("Mời bạn nhập sapo cho bài viết")
        .max(500, "Sapo bài viết không được quá 500 kí tự"),
    }),
    onSubmit: (values) => {
      const data = {
        article_print_id: id,
        article_title: values.article_title,
        sub_title: values.sub_title,
        pen_name: values.pen_name,
        article_sapo: values.article_sapo,
        other_author: "[" + valueAuthor.toString() + "]",
        article_content: content,
        article_paper_number_id: valuePaperNumber,
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!valuePaperNumber) {
        ToastCustom("Mời bạn chọn số báo", "fail");
      } else {
        // save new article
        if (statusId === 4) {
          //
          updateArticleCommentPublish({
            article_print_id: parseInt(id),
            enable_comment: enableComment ? 1 : 0,
          }).then((res) => {
            if (res.status && res.status > 0) {
              //
            } else {
              // ToastCustom(res.message && res.message, "fail");
            }
          });
          updateArticleFucusPublish({
            article_print_id: parseInt(id),
            outstanding: outstanding1 ? 1 : 2,
          }).then((res) => {
            if (res.status && res.status > 0) {
              ToastCustom("Sửa bài viết thành công", "success");
              // validation.resetForm();
              navigate("/list-article");
            } else {
              ToastCustom(res.message && res.message, "fail");
            }
          });
        } else {
          getAPIPutArticlePrint(result).then((r) => {
            if (r.status && r.status > 0) {
              ToastCustom("Sửa bài viết thành công", "success");
              // validation.resetForm();
              // navigate("/list-newspaper");
            } else {
              ToastCustom(r.message && r.message, "fail");
            }
          });
        }
      }
    },
  });
  useEffect(() => {
    getAPIGetArticlePrintById(id).then((res) => {
      if (res.status > 0) {
        const dataRes = res.data;
        validation.setFieldValue("article_title", res.data.article_title);
        validation.setFieldValue("sub_title", res.data.sub_title);
        validation.setFieldValue("pen_name", res.data.pen_name);
        validation.setFieldValue("article_sapo", res.data.article_sapo);
        validation.setFieldValue("slug", res.data.slug);
        validation.setFieldValue("leak_url", res.data.leak_url);

        setSelectedTags(
          res.data.list_tag_info
            ? res.data.list_tag_info.map((e) => e.tag_id)
            : []
        );
        console.log({
          article_paper_number: dataRes.article_paper_number_id,
          optionsPaperNumber,
        });

        dataRes &&
          dataRes.article_paper_number_id &&
          setValuePaperNumber(dataRes && dataRes.article_paper_number_id);
        setOutstanding1(res.data.outstanding === 1 ? true : false);
        setEnableComment(res.data.enable_comment === 1 ? true : false);
        setis_speech(res.data.is_speech === 1 ? true : false);
        setCurrentRole(res.data.next_public_role_step - 1);
        setContent(res.data.article_content);
        setArticleTypeId(res.data.article_status_id);
        setValueCategory({
          value: res.data.category_id,
          label: res.data.category_name,
        });
        setValueAuthor(JSON.parse(res.data.other_author || "[]"));
        setStatusId(res.data.article_status_id);
      }
    });

    getAPIRoleByArticlePrintId(id).then((res) => {
      if (res.data && res.status > 0) {
        setRole(res.data);
      }
    });
  }, [reload]);
  useEffect(() => {
    getCheckPublishArticleByUser({ article_print_id: id }).then((res) => {
      if (res && res.status > 0) {
        setExportArticle(res.status);
      }
    });

    getArticleFileMediaList({ article_print_id: id }).then((res) => {
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
    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.author_name,
          });
        });
        setOptionsAuthor(options);
      }
    });

    getAPIArticlePrintHistory(id).then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        res.data.forEach((e) => {
          options.push({
            value: e.modified_date,
            label: `Phiên bản ${momentTZ
              .utc(e.modified_date)
              .tz("Asia/Ho_Chi_Minh")
              .format("DD/MM/YYYY HH:mm")} tạo bởi ${e.user_name}`,
          });
        });
        setListHistory(options);
        setArticleHistory(res.data);
      }
    });
    getAPIListPaperNumber().then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.article_paper_number_id,
            label: e.paper_number,
          });
        });
      }
      setOptionsPaperNumber(options);
    });
  }, []);
  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
  }
  const handleStepChange = (current) => {
    if (current >= currentRole) {
      setCurrentClick(current);
      setmodal_scroll(!modal_scroll);
      const currentStep = role._role_steps_info[current];
      setStepName(currentStep.step_name);
      setListUser(currentStep.list_user_accept);
    }
  };
  const showModalStep = () => {
    setCurrentClick(currentRole + 1);
    setmodal_scroll(!modal_scroll);
    const currentStep = role._role_steps_info[currentRole + 1];
    setStepName(currentStep.step_name);
    setListUser(currentStep.list_user_accept);
    validation.handleSubmit();
  };

  // const onChangePaperNumber = (value) => {
  //   if (value === undefined) {
  //     value = null;
  //   }
  //   optionsPaperNumber.forEach((item) => {
  //     item.value === value &&
  //       validation.setFieldValue(`article_title`, item.label);
  //   });
  //   setValuePaperNumber(value);
  // };
  const onChangePaperNumber = (_, option) => {
    console.log("option", option);
    if (option === undefined) {
      option = null;
    }
    if (optionsPaperNumber && optionsPaperNumber.length > 0) {
      optionsPaperNumber.forEach((item) => {
        item.valueToSend === option.valueToSend &&
          validation.setFieldValue(`article_title`, item.value);
      });
    }
    setValuePaperNumber(option.valueToSend);
  };
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
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            previousLink={"/list-newspaper"}
            title="Sửa bài viết"
            pageTitle="Danh sách bài viết"
          />
          <Modal
            title="So sánh"
            open={open}
            onOk={compareVersion}
            onCancel={hideModal}
            okText="So sánh"
            cancelText="Huỷ"
            width={1200}
            centered
            zIndex={1003}
          >
            <Row style={{ maxHeight: 500, overflowY: "auto" }}>
              <Col lg={4}>
                <Card>
                  <CardHeader>
                    <Select
                      style={{
                        width: "100%",
                      }}
                      dropdownStyle={{
                        maxHeight: 400,
                        overflow: "auto",
                      }}
                      allowClear
                      options={listHistory}
                      treeDefaultExpandAll
                      placeholder="Phiên bản trước"
                      multiple
                      onChange={onChangeVersion1}
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2
                        style={{
                          textDecoration: "underline",
                          fontSize: "16px",
                        }}
                      >
                        {versionSubTitle1 ? `Tiêu đề phụ:` : ""}
                      </h2>
                      <p>{versionSubTitle1}</p>
                      <hr />
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle1 ? `Tiêu đề:` : ""}
                      </h2>
                      <h2>{versionTitle1}</h2>
                      <p>{versionSapo1}</p>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent1 }}
                    ></div>
                  </CardBody>
                  {/* <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle1 ? `Tiêu đề:` : ""}
                      </h2>
                      <h2>{versionTitle1}</h2>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent1 }}
                    ></div>
                  </CardBody> */}
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2
                        style={{
                          textDecoration: "underline",
                          fontSize: "16px",
                        }}
                      >
                        {versionSubTitle ? `Tiêu đề phụ:` : ""}
                      </h2>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: versionSubTitle,
                        }}
                      ></p>
                      <hr />
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle ? `Tiêu đề:` : ""}
                      </h2>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: versionTitle,
                        }}
                      ></div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: versionSapo,
                        }}
                      ></p>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent }}
                    ></div>
                  </CardBody>
                  {/* <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle ? `Tiêu đề:` : ""}
                      </h2>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: versionTitle,
                        }}
                      ></div>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent }}
                    ></div>
                  </CardBody> */}
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardHeader>
                    <Select
                      style={{
                        width: "100%",
                      }}
                      dropdownStyle={{
                        maxHeight: 400,
                        overflow: "auto",
                      }}
                      allowClear
                      options={listHistory}
                      treeDefaultExpandAll
                      placeholder="Phiên bản sau"
                      multiple
                      onChange={onChangeVersion2}
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2
                        style={{
                          textDecoration: "underline",
                          fontSize: "16px",
                        }}
                      >
                        {versionSubTitle2 ? `Tiêu đề phụ:` : ""}
                      </h2>
                      <p>{versionSubTitle2}</p>
                      <hr />
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle2 ? `Tiêu đề:` : ""}
                      </h2>

                      <h2>{versionTitle2}</h2>
                      <p>{versionSapo2}</p>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent2 }}
                    ></div>
                  </CardBody>
                  {/* <CardBody>
                    <div style={{ marginBottom: "12px" }}>
                      <h2 style={{ textDecoration: "underline" }}>
                        {versionTitle2 ? `Tiêu đề:` : ""}
                      </h2>
                      <h2>{versionTitle2}</h2>
                    </div>
                    <hr />
                    <div
                      dangerouslySetInnerHTML={{ __html: versionContent2 }}
                    ></div>
                  </CardBody> */}
                </Card>
              </Col>
            </Row>
          </Modal>
          <Row>
            <Col lg={12} style={{ overflow: "auto", marginBottom: "20px" }}>
              {/* <Link to="/list-article"> */}
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="btn btn-success"
              >
                Quay lại
              </button>
              {/* </Link> */}
            </Col>
            <Col lg={12}>
              <div id="article-wrap">
                <Row>
                  <Col lg={8} style={{ overflow: "auto", height: "80vh" }}>
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
                            <Label
                              htmlFor="article_title"
                              className="form-label"
                            >
                              Tiêu đề <RequiredIcon />
                            </Label>
                            <Input
                              name="article_title"
                              type="text"
                              className="form-control"
                              id="article_title"
                              placeholder="Toà Soạn Hội Tụ"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={(e) => {
                                validation.handleBlur(e);
                                validation.values.slug = convertVietnamese(
                                  validation.values.article_title
                                );
                              }}
                              invalid={
                                !!(
                                  validation.touched.article_title &&
                                  validation.errors.article_title
                                )
                              }
                              value={validation.values.article_title}
                            />
                            {validation.touched.article_title &&
                            validation.errors.article_title ? (
                              <FormFeedback type="invalid">
                                {validation.errors.article_title}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label
                              htmlFor="article_sapo"
                              className="form-label"
                            >
                              Sapo
                            </Label>
                            <Input
                              name="article_sapo"
                              type="textarea"
                              className="form-control"
                              id="article_sapo"
                              placeholder="Toà Soạn Hội Tụ"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                !!(
                                  validation.touched.article_sapo &&
                                  validation.errors.article_sapo
                                )
                              }
                              value={validation.values.article_sapo}
                            />
                            {validation.touched.article_sapo &&
                            validation.errors.article_sapo ? (
                              <FormFeedback type="invalid">
                                {validation.errors.article_sapo}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <JoditEditorGlobal
                            placeholder="Nhập nội dung bài viết"
                            editorRef={editorRef}
                            content={content}
                            setContent={setContent}
                          />
                          <div className="hstack gap-2 justify-content-end mt-3">
                            {/* <div>
                              <button
                                className="btn btn-success"
                                type="button"
                                onClick={showModalCheckSpell}
                              >
                                Kiểm tra chính tả
                              </button>
                              <ModalCheckSpell
                                editorRef={editorRef}
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                              />
                            </div> */}

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
                            <button
                              type="button"
                              onClick={openCompare}
                              className="btn btn-success"
                            >
                              So sánh
                            </button>
                            <button type="submit" className="btn btn-success">
                              Lưu bài viết
                            </button>
                            {currentRole >= 1 && articleTypeId !== 4 && (
                              <Popconfirm
                                title={"Xác nhận trả bài"}
                                icon={<></>}
                                okText={"Đồng ý"}
                                cancelText={"Hủy bỏ"}
                                onConfirm={() => {
                                  getAPIGetReturnRolePrint(id).then((res) => {
                                    if (res && res.status > 0) {
                                      ToastCustom(
                                        "Trả bài viết thành công",
                                        "success"
                                      );
                                      setReload(!reload);
                                    } else {
                                      ToastCustom(
                                        res.message && res.message,
                                        "fail"
                                      );
                                    }
                                  });
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Trả bài
                                </button>
                              </Popconfirm>
                            )}
                            {role &&
                              (statusId && statusId === 12 ? (
                                <Popconfirm
                                  title={"Xác nhận hạ xuất bản"}
                                  icon={<></>}
                                  okText={"Đồng ý"}
                                  cancelText={"Hủy bỏ"}
                                  onConfirm={() => {
                                    getAPIArticlePrintRevokeApproval(id).then(
                                      (res) => {
                                        if (res && res.status > 0) {
                                          ToastCustom(
                                            "Hạ Xuất bản bài viết thành công",
                                            "success"
                                          );
                                          setReload(!reload);
                                        } else {
                                          ToastCustom(
                                            res.message && res.message,
                                            "fail"
                                          );
                                        }
                                      }
                                    );
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                  >
                                    Hạ duyệt
                                  </button>
                                </Popconfirm>
                              ) : currentRole >=
                                role._role_steps_info.length - 1 ? (
                                <Popconfirm
                                  title={"Xác nhận xuất bản"}
                                  icon={<></>}
                                  okText={"Đồng ý"}
                                  cancelText={"Hủy bỏ"}
                                  onConfirm={() => {
                                    getAPIApprovalArticlePrint(id).then(
                                      (res) => {
                                        if (res && res.status > 0) {
                                          ToastCustom(
                                            "Xuất bản bài viết thành công",
                                            "success"
                                          );
                                          setReload(!reload);
                                        } else {
                                          ToastCustom(
                                            res.message && res.message,
                                            "fail"
                                          );
                                        }
                                      }
                                    );
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                  >
                                    Duyệt
                                  </button>
                                </Popconfirm>
                              ) : (
                                <button
                                  type="button"
                                  onClick={showModalStep}
                                  className="btn btn-primary"
                                >
                                  Chuyển tiếp
                                </button>
                              ))}
                          </div>

                          {/* <div className="mb-3">
                            <Label
                              htmlFor="article_author"
                              className="form-label"
                            >
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
                              placeholder="Có thể chọn nhiều tác giả"
                              mode="multiple"
                              showSearch
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
                              <Label
                                htmlFor="article_author"
                                className="form-label"
                              >
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
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4} style={{ overflow: "auto", height: "80vh" }}>
                    <Card>
                      <CardHeader>
                        <Nav
                          className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                          role="tablist"
                        >
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: activeTab === "article",
                              })}
                              onClick={() => {
                                tabChange("article");
                              }}
                              type="button"
                            >
                              <i className="fas fa-home"></i>
                              Thông tin bài viết
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              to="#"
                              className={classnames({
                                active: activeTab === "process",
                              })}
                              onClick={() => {
                                tabChange("process");
                              }}
                              type="button"
                            >
                              <i className="far fa-user"></i>
                              Quy trình
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>

                      <CardBody>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="article">
                            <Form
                              className="tablelist-form"
                              onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                            >
                              {/* <div className="mb-3">
                                <Label
                                  htmlFor="article_avatar"
                                  className="form-label"
                                >
                                  Ảnh đại diện
                                </Label>
                                <SelectMedia
                                  type={"dropzone"}
                                  defaultImgSrc={avatar}
                                  setDefaultImgSrc={() => setAvatar()}
                                  onUploadMedia={(e) => setAvatar(e)}
                                ></SelectMedia>
                              </div> */}
                              {/* <div className="mb-3">
                                <div className="mb-3">
                                  <Label
                                    htmlFor="leak_url"
                                    className="form-label"
                                  >
                                    Nhập link từ báo khác
                                  </Label>
                                  <div className="input-group">
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="leak_url"
                                      placeholder=""
                                      aria-label="Example text with two button addons"
                                      value={validation.values.leak_url}
                                      onChange={validation.handleChange}
                                    />
                                    <button
                                      className="btn btn-primary"
                                      type="button"
                                    >
                                      Lấy bài
                                    </button>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  {articleTypeId &&
                                    isExportArticle === 1 &&
                                    currentRole >=
                                      role._role_steps_info.length - 1 &&
                                    articleTypeId === 3 && (
                                      <div
                                        className="form-check form-switch form-switch-lg"
                                        dir="ltr"
                                      >
                                        <Label
                                          className="form-check-label"
                                          htmlFor="enable_comment"
                                        >
                                          Bật Text to Speech
                                        </Label>
                                        <Input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="is_speech"
                                          checked={is_speech}
                                          value={is_speech}
                                          onChange={(e) => {
                                            e.preventDefault();
                                            setis_speech(e.target.checked);
                                          }}

                                        />
                                      </div>
                                    )}
                                </div>
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
                                      id="enableComment"
                                      checked={enableComment}
                                      value={enableComment}
                                      onChange={(e) => {
                                        e.preventDefault();
                                        setEnableComment(e.target.checked);
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
                                      checked={outstanding1}
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
                                      checked={outstanding2}
                                      onChange={(e) => {
                                        setOutstanding2(e.target.checked);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div> */}
                            </Form>
                            <ComponentArticlePricePrint id={id} />
                          </TabPane>
                          <TabPane tabId="process">
                            <div>
                              {role &&
                              role._role_steps_info &&
                              role._role_steps_info.length > 0 ? (
                                <>
                                  <Steps
                                    current={currentRole}
                                    direction="vertical"
                                    onChange={handleStepChange}
                                    items={role._role_steps_info.map(
                                      (role, key) => {
                                        return {
                                          title: role.step_name,
                                          description:
                                            (role.user_accept &&
                                              ((role.status === 1 &&
                                                role.user_accept.full_name +
                                                  " " +
                                                  moment(
                                                    role.accept_date
                                                  ).format(
                                                    "DD/MM/YYYY HH:mm:ss"
                                                  )) ||
                                                (role.status == 0 &&
                                                  key !== currentRole &&
                                                  "Chưa thực hiện"))) ||
                                            (role.status === -1 && "Bỏ qua") ||
                                            (role.status === -3 &&
                                              "Đang chờ hẹn giờ xuất bản"),
                                        };
                                      }
                                    )}
                                  />
                                  <CustomModal
                                    submit={() => {
                                      validation.handleSubmit();
                                    }}
                                    typeAticle="print"
                                    togScroll={() => tog_scroll()}
                                    modalScroll={modal_scroll}
                                    setModelScroll={setmodal_scroll}
                                    listUser={listUser}
                                    stepName={stepName}
                                    articleId={id}
                                    setReload={() => setReload(!reload)}
                                    currentClick={currentClick}
                                  />
                                </>
                              ) : (
                                <div>Không có dữ liệu</div>
                              )}
                            </div>
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <div className="mb-3">
                          <Label htmlFor="article_title" className="form-label">
                            Chọn số báo
                            <RequiredIcon />
                          </Label>
                          {/* <Select
                            style={{
                              width: "100%",
                            }}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            options={optionsPaperNumber}
                            // treeDefaultExpandAll
                            placeholder="Chọn ngày phát hành"
                            treeNodeFilterProp="title"
                            value={valuePaperNumber}
                            onChange={onChangePaperNumber}
                          /> */}
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
                            value={
                              optionsPaperNumber.filter(
                                (option) =>
                                  option.valueToSend === valuePaperNumber
                              )[0]?.value
                            }
                            onChange={onChangePaperNumber}
                            onSelect={onChangePaperNumber}
                            onSearch={(text) => setKeywordSelect(text)}
                            placeholder="Chọn ngày phát hành"
                            allowClear={false}
                            notFoundContent={
                              <div className="text-center">
                                Không có dữ liệu trùng khớp
                              </div>
                            }
                            loading={isLoadingSelect}
                          />
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
                          title="Thêm ảnh"
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
                          {listImage.length > 0 &&
                            listImage.map((e) => {
                              return (
                                <div key={uuidv4()}>
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
                                            (element) =>
                                              element.id !== e.file_info_id
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
                                        addImageLink(
                                          e.url,
                                          e.id,
                                          e.type,
                                          e.originUrl
                                        );
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

                    {/* <Card>
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
                                <Label
                                  htmlFor="article_title"
                                  className="form-label"
                                >
                                  Hẹn giờ xuất bản
                                </Label>
                                {publishTime !== undefined && (
                                  <DatePicker
                                    id="date"
                                    format=" DD-MM-YYYY HH:mm"
                                    className="col-lg-12 mt-2"
                                    showTime
                                    defaultValue={
                                      publishTime !== null
                                        ? dayjs(publishTime)
                                        : null
                                    }
                                    disabledDate={disabledDate}
                                    onChange={onChangeFromDate}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </Form>
                      </CardBody>
                    </Card> */}
                    {isOpenModalpreviewArticle &&
                      editorRef &&
                      editorRef.current && (
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
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default UpdateArticlePrint;
