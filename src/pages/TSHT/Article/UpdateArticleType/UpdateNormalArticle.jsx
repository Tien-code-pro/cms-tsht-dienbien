import BreadCrumb from "../../../../Components/Common/BreadCrumb";
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

import "./compare-version.scss";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import {
  getAPIGetArticleById,
  getAPIListAuthor,
  getAPIPostTransitionPublishRole,
  getAPIPostTransitionUnPublishRole,
  getAPIPutArticle,
  getAPIRoleByArticleId,
  getAPITreeListCategory,
  getAPIArticleHistory,
  getArticleFileMediaList,
  getAPIGetReturnRole,
  updateArticleCommentPublish,
  updateArticleFucusPublish,
  getCheckPublishArticleByUser,
  updateArticleMedia,
  getAPIPutArticleWatermark,
} from "../../../../helpers/fakebackend_helper";
import {
  DatePicker,
  Popconfirm,
  Select,
  Steps,
  TreeSelect,
  Modal,
  Image,
  Button,
} from "antd";
import classnames from "classnames";
import ModalPreviewArticle from "../UpdateArticleType/ModalPreviewArticle";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import CustomModal from "./../UpdateArticleType/ModelStepsInfo.component";
import moment from "moment";
import momentTZ from "moment-timezone";

import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import dayjs from "dayjs";
import diff from "node-htmldiff";
import ComponentArticlePrice from "../UpdateArticleType/ComponentArticlePrice";
import { v4 as uuidv4 } from "uuid";
import SelectTag from "../../../../Components/Common/SelectTag";
import ModalCheckSpell from "../../../../Components/Common/ModalCheckSpell";
import useCheckPermission from "../../../../Components/Hooks/useCheckPermison";
import ModalPreview from "./ModalPreview";
import mp4_icon from "../../../../assets/images/mp4.png";
import stream_icon from "../../../../assets/images/icon_stream_default.png";
import audio_icon from "../../../../assets/images/audio_default.png";
import JoditEditorGlobal from "./JoditEditor";

const UpdateNormalArticle = () => {
  document.title = "Thông tin bài viết | Toà Soạn Hội Tụ";
  const navigate = useNavigate();
  const [valueCategory, setValueCategory] = useState();
  const [valueOtherCategory, setValueOtherCategory] = useState([]);
  const [activeTab, setActiveTab] = useState("article");
  const [role, setRole] = useState();
  const [reload, setReload] = useState(false);
  const [currentRole, setCurrentRole] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [localNews, setLocalNews] = useState([]);
  const [publishTime, setPublishTime] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const [articleTypeId, setArticleTypeId] = useState();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [outstanding1, setOutstanding1] = useState();
  const [outstanding2, setOutstanding2] = useState();
  const [imageNew, setImageNew] = useState();
  const [inforgraphic, setInforgraphic] = useState();
  const [enableComment, setEnableComment] = useState();
  const [is_speech, setis_speech] = useState();
  const [listImage, setListImage] = useState([]);
  const { id } = useParams();
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [currentClick, setCurrentClick] = useState();
  const [listUser, setListUser] = useState();
  const [stepName, setStepName] = useState();
  const editorRef = useRef("");
  const jodit = editorRef.current;

  const [isOpenModalpreviewArticle, setOpenModalPreviewArticle] =
    useState(false);
  const [version, setVersion] = useState();
  const [version2, setVersion2] = useState();
  const [versionTitle, setVersionTitle] = useState();
  const [versionSubTitle, setVersionSubTitle] = useState();
  const [versionSapo, setVersionSapo] = useState();
  const [versionContent, setVersionContent] = useState();
  const [versionSubTitle1, setVersion1SubTitle] = useState();
  const [versionSubTitle2, setVersion2SubTitle] = useState();
  const [versionTitle1, setVersion1Title] = useState();
  const [versionTitle2, setVersion2Title] = useState();
  const [versionSapo1, setVersion1Sapo] = useState();
  const [versionSapo2, setVersion2Sapo] = useState();
  const [versionContent1, setVersion1Content] = useState();
  const [versionContent2, setVersion2Content] = useState();
  // article_title
  const [articleHistory, setArticleHistory] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [open, setOpen] = useState(false);

  const [reloadTag, setReloadTag] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);
  const [statusId, setStatusId] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataPreView, setDataPreview] = useState();
  const [dataMedia, setDataMedia] = useState([]);
  const [content, setContent] = useState("");
  const [isOpenModalpreview, setOpenModalPreview] = useState(false);

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
  const onChangeVersion1 = (version) => {
    setVersion(version);
  };
  const onChangeVersion2 = (version) => {
    setVersion2(version);
  };
  function addImageLink(url, _, type) {
    const mediaLink = `${url}`;
    console.log("type", type);

    // "https://img.freepik.com/free-vector/abstract-background-consisting-colorful-arcs-illustration_456031-149.jpg";
    jodit.s.insertHTML(
      (type === "video" &&
        `
    <div style="
    display: flex;
    justify-content: center;">
    <video controls="controls" width="500" height="fit">
    <source src=${mediaLink} type="video/mp4"
    data-mce-src=${mediaLink}></video></div>`) ||
        (type === "image" &&
          `
    <div style="
    display: flex;
    justify-content: center;">
      <figure class="image" style="text-align: center; margin: 0 auto;"  id="add_image_link">
      <img width="500" style="margin: 0 auto;" src=${mediaLink} />
      <figcaption>Nhập chú thích</figcaption>
    </figure> </div>`) ||
        (type === "audio" &&
          `<div style="
    display: flex;
    justify-content: center;">
   <audio src=${mediaLink} 
   controls="controls" data-mce-src=${mediaLink}></audio>
  </div>`) ||
        (type === "stream" &&
          `<div style="
    display: flex;
    justify-content: center;">
      <video controls="controls" width="100%" height="fit">
          <source src=${mediaLink} type="video/mp4"
           data-mce-src=${mediaLink}></video>
  </div>`)
    );
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
  const handlePreview = () => {
    setOpenModalPreviewArticle(true);
  };
  const handleCloneNewspaper = (articleId) => {
    navigate("/add-newspaper", { state: { articleId } });
  };

  const handleAddWatermark = (articleId) => {
    getAPIPutArticleWatermark(articleId)
      .then((r) => {
        if (r.status && r.status > 0) {
          ToastCustom(
            "Yêu cầu đang được xử lý. Vui lòng kiểm tra Website",
            "success"
          );
          setReload(!reload);
        } else {
          ToastCustom(r.message || "An error occurred", "fail");
        }
      })
      .catch((error) => {
        ToastCustom("Something went wrong. Please try again.", "fail");
      });
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };

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
  function onChangeOtherCategory(value) {
    if (value === undefined) {
      value = null;
    }
    setValueOtherCategory(value);
  }
  function handleToastNotification(message, type) {
    ToastCustom(message, type);
  }
  const [avatar, setAvatar] = useState();
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
      slug: Yup.string()
        .required("Mời bạn nhập slug cho bài viết")
        .matches(/^[a-zA-Z0-9\-]+$/, "Slug không được chứa ký tự đặc biệt"),
    }),
    onSubmit: (values) => {
      const data = {
        article_id: id,
        sub_title: values.sub_title,
        article_title: values.article_title,
        article_sapo: values.article_sapo,
        pen_name: values.pen_name,
        category_id: valueCategory.value ? valueCategory.value : valueCategory,
        list_categoryid:
          valueOtherCategory.length > 0
            ? JSON.stringify(valueOtherCategory)
            : null,
        // author: valueAuthor.value ? valueAuthor.value : valueAuthor,
        other_author: "[" + valueAuthor.toString() + "]",
        article_type_id: 1,
        article_content: content,
        avatar_image: avatar,
        leak_url: values.leak_url ? values.leak_url : "",
        article_files:
          listImage.length > 0
            ? JSON.stringify(listImage.map((e) => e.id))
            : "",
        outstanding: outstanding1 ? 1 : outstanding2 ? 2 : 0,
        is_multi_media: imageNew ? 1 : inforgraphic ? 2 : 0,
        enable_comment: enableComment ? 1 : 0,
        is_speech: is_speech ? 1 : 0,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.slug,
        note: "",
        user_create_id: 90,
        user_modify_id: 90,
        list_article_relate: "[" + valueArticleRelate.toString() + "]",
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!result.article_type_id) {
        ToastCustom("Loại bài viết không xác định", "fail");
      } else if (!result.category_id) {
        ToastCustom("Mời bạn chọn chuyên mục bài viết", "fail");
      } else if (outstanding1 && outstanding2) {
        ToastCustom("Chỉ được chọn tin nổi bật hoặc tin tiêu điểm", "fail");
      } else if (imageNew && inforgraphic) {
        ToastCustom("Chỉ được chọn tin ảnh hoặc Inforgraphic", "fail");
      } else {
        // save new article
        // if (statusId) {
        //
        const updateArticle = async () => {
          try {
            const [res1, res2] = await Promise.all([
              updateArticleFucusPublish({
                article_id: parseInt(id),
                outstanding: outstanding1 ? 1 : outstanding2 ? 2 : 0,
              }),

              updateArticleMedia({
                article_id: parseInt(id),
                is_multi_media: imageNew ? 1 : inforgraphic ? 2 : 0,
              }),
            ]);
            if (res1.status > 0 && res2.status > 0) {
              handleToastNotification(
                "Sửa trạng thái đa phương tiện thành công",
                "success"
              );
              // validation.resetForm();
              // navigate("/list-article");
            } else {
              handleToastNotification(res1.message || res2.message, "fail");
            }
          } catch (e) {
            handleToastNotification("An error occurred", "fail");
          }
        };
        updateArticle();
        updateArticleCommentPublish({
          article_id: parseInt(id),
          enable_comment: enableComment ? 1 : 0,
        }).then((res) => {
          if (res.status && res.status > 0) {
            //
          } else {
            // ToastCustom(res.message && res.message, "fail");
          }
        });

        // updateArticleFucusPublish({
        //   article_id: parseInt(id),
        //   outstanding: outstanding1 ? 1 : 2,
        // }).then((res) => {
        //   if (res.status && res.status > 0) {
        //     ToastCustom("Sửa bài viết thành công", "success");
        //     validation.resetForm();
        //     navigate("/list-article");
        //   } else {
        //     ToastCustom(res.message && res.message, "fail");
        //   }
        // });
        // } else {
        getAPIPutArticle(result).then((r) => {
          if (r.status && r.status > 0) {
            ToastCustom("Sửa bài viết thành công", "success");
            // validation.resetForm();
            // navigate("/list-article");
          } else {
            ToastCustom(r.message && r.message, "fail");
          }
        });
        // }
      }
    },
  });
  useEffect(() => {
    getAPIGetArticleById(id).then((res) => {
      if (res.status > 0) {
        console.log("content article:", res.data.article_content);
        validation.setFieldValue("article_title", res.data.article_title);
        validation.setFieldValue("sub_title", res.data.sub_title);
        validation.setFieldValue("pen_name", res.data.pen_name);
        validation.setFieldValue("article_sapo", res.data.article_sapo);
        validation.setFieldValue(
          "list_categoryid",
          res.data.list_categoryid || []
        );
        validation.setFieldValue("slug", res.data.slug);
        validation.setFieldValue("leak_url", res.data.leak_url);
        setValueOtherCategory(JSON.parse(res.data.list_categoryid) || []);
        setSelectedTags(
          res.data.list_tag_info
            ? res.data.list_tag_info.map((e) => e.tag_id)
            : []
        );
        setValueArticleRelate(
          res.data.list_article_relate
            ? res.data.list_article_relate.map((e) => {
                return {
                  title: e.article_title,
                  value: e.article_id,
                };
              })
            : []
        );
        setOutstanding1(res.data.outstanding === 1 ? true : false);
        setOutstanding2(res.data.outstanding === 2 ? true : false);
        setImageNew(res.data.is_multi_media === 1 ? true : false);
        setInforgraphic(res.data.is_multi_media === 2 ? true : false);
        setEnableComment(res.data.enable_comment === 1 ? true : false);
        setis_speech(res.data.is_speech === 1 ? true : false);

        setCurrentRole(res.data.next_public_role_step - 1);
        setPublishTime(
          res.data.publish_date !== null
            ? new Date(res.data.publish_date).toISOString()
            : null
        );
        setContent(res.data.article_content);
        setArticleTypeId(res.data.article_status_id);
        setValueCategory({
          value: res.data.category_id,
          label: res.data.category_name,
        });
        setAvatar(res.data.avatar_image);
        setValueAuthor(JSON.parse(res.data.other_author || "[]"));
        setStatusId(res.data.article_status_id);
      }
    });

    getAPIRoleByArticleId(id).then((res) => {
      if (res.data && res.status > 0) {
        setRole(res.data);
      }
    });
  }, [reload]);
  useEffect(() => {
    getCheckPublishArticleByUser({ article_id: id }).then((res) => {
      if (res && res.status > 0) {
        setExportArticle(res.status);
      }
    });

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
    getArticleFileMediaList({ article_id: id }).then((res) => {
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
      }
      setOptionsAuthor(options);
    });
    getAPIArticleHistory(id).then((res) => {
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
  }, []);
  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
  }
  const handleChangeMultiMedia = (type, value) => {};
  const handleStepChange = (current) => {
    if (current >= currentRole) {
      setCurrentClick(current);
      setmodal_scroll(!modal_scroll);
      const currentStep =
        role &&
        role._role_steps_info &&
        role._role_steps_info.length &&
        role._role_steps_info[current];
      setStepName(currentStep.step_name);
      setListUser(currentStep.list_user_accept);
    }
  };
  const showModalStep = () => {
    setCurrentClick(currentRole + 1);
    setmodal_scroll(true);
    const currentStep =
      role &&
      role._role_steps_info.length &&
      role._role_steps_info[currentRole + 1];
    setStepName(currentStep.step_name);
    setListUser(currentStep.list_user_accept);
    // validation.handleSubmit();
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            previousLink={"/list-article"}
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
                </Card>
              </Col>
            </Row>
          </Modal>
          <Row>
            <Col lg={12}>
              <div id="article-wrap">
                <Row>
                  <Col
                    lg={12}
                    style={{ overflow: "auto", marginBottom: "20px" }}
                  >
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
                              onClick={() => handleAddWatermark(id)}
                              className="btn btn-success"
                            >
                              Chèn Watermark
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCloneNewspaper(id)}
                              className="btn btn-success"
                            >
                              Chuyển đổi bài báo in
                            </button>
                            <button
                              type="button"
                              onClick={handlePreview}
                              className="btn btn-success"
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
                            <CustomModal
                              onSubmited={() => validation.handleSubmit()}
                              togScroll={() => tog_scroll()}
                              modalScroll={modal_scroll}
                              setModelScroll={setmodal_scroll}
                              listUser={listUser}
                              stepName={stepName}
                              articleId={id}
                              setReload={() => setReload(!reload)}
                              currentClick={currentClick}
                            />
                            {currentRole >= 1 && articleTypeId !== 4 && (
                              <Popconfirm
                                title={"Xác nhận trả bài"}
                                icon={<></>}
                                okText={"Đồng ý"}
                                cancelText={"Hủy bỏ"}
                                onConfirm={() => {
                                  getAPIGetReturnRole(id).then((res) => {
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
                            {articleTypeId && articleTypeId === 4 ? (
                              <Popconfirm
                                title={"Xác nhận hạ xuất bản"}
                                icon={<></>}
                                okText={"Đồng ý"}
                                cancelText={"Hủy bỏ"}
                                onConfirm={() => {
                                  getAPIPostTransitionUnPublishRole(id).then(
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
                                  Hạ Xuất bản
                                </button>
                              </Popconfirm>
                            ) : (
                              role &&
                              role &&
                              role._role_steps_info.length &&
                              role._role_steps_info &&
                              (currentRole >=
                              role._role_steps_info.length - 1 ? (
                                <Popconfirm
                                  title={"Xác nhận xuất bản"}
                                  icon={<></>}
                                  okText={"Đồng ý"}
                                  cancelText={"Hủy bỏ"}
                                  onConfirm={() => {
                                    getAPIPostTransitionPublishRole(id).then(
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
                                    Xuất bản
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
                              ))
                            )}
                          </div>
                          <div className="mb-3">
                            <Label
                              htmlFor="article_category"
                              className="form-label"
                            >
                              Chuyên mục
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
                              onChange={onChangeCategory}
                            />
                          </div>
                          <div className="mb-3">
                            <Label
                              htmlFor="list_categoryid"
                              className="form-label"
                            >
                              Tin địa phương{" "}
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
                          </div>
                          <div className="mb-3 d-flex gap-3">
                            <div className="w-50">
                              <Label htmlFor="pen_name" className="form-label">
                                Bút danh
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
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.slug}
                              invalid={
                                !!(
                                  validation.touched.slug &&
                                  validation.errors.slug
                                )
                              }
                            />
                            {validation.touched.slug &&
                            validation.errors.slug ? (
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
                              <div className="mb-3">
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
                              </div>
                              <div className="mb-3">
                                {/* <div className="mb-3">
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
                                </div> */}

                                <div className="mb-3">
                                  {articleTypeId &&
                                    role &&
                                    role._role_steps_info &&
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
                                <div className="mb-3">
                                  <div
                                    className="form-check form-switch form-switch-lg"
                                    dir="ltr"
                                  >
                                    <Label
                                      className="form-check-label"
                                      htmlFor="imageNew"
                                    >
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
                            <ComponentArticlePrice id={id} />
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
                          {listImage.map((e) => {
                            console.log("e:", e);
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
                                        listImage.filter(
                                          (element) => element.id !== e.id
                                        )
                                      );
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    disabled={
                                      e.type === "stream" ? true : false
                                    }
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
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
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
      {isOpenModalpreview && (
        <ModalPreview
          dataPreview={dataPreView}
          isOpen={isOpenModalpreview}
          handleModalClose={() => {
            setOpenModalPreview(false);
          }}
        />
      )}
    </>
  );
};
export default UpdateNormalArticle;
