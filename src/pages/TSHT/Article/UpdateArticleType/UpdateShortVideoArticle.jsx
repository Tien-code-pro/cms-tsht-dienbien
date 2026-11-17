import React, { useState, useRef, useEffect } from "react";
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
import { TreeSelect, DatePicker, Select, Popconfirm, Steps } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAPIGetReturnRole,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPIPostTransitionPublishRole,
  getAPIPostTransitionUnPublishRole,
  getAPIPutArticle,
  getAPIRoleByArticleId,
  getAPITreeListCategory,
  updateArticleCommentPublish,
  updateArticleFucusPublish,
} from "../../../../helpers/fakebackend_helper";
import { registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
//api
import {
  getAPIDeleteTag,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
} from "../../../../helpers/fakebackend_helper";
import DateTime from "../ArticleType/DateTime";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import ReactHlsPlayer from "react-hls-player";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import classnames from "classnames";
import moment from "moment/moment";
import CustomModal from "./ModelStepsInfo.component";
import SelectTag from "../../../../Components/Common/SelectTag";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const UpdateShortVideoArticle = ({
  article_type,
  detailData,
  setReload,
  typeVideo,
}) => {
  const [valueCategory, setValueCategory] = useState();
  const [outstanding1, setOutstanding1] = useState();
  const [outstanding2, setOutstanding2] = useState();
  const [enableComment, setEnableComment] = useState();
  const [videoMedia, setVideoMedia] = useState();
  const [videoID, setVideoID] = useState();

  let navigate = useNavigate();

  const [modal_scroll, setmodal_scroll] = useState(false);
  const [currentClick, setCurrentClick] = useState();
  const [listUser, setListUser] = useState();
  const [stepName, setStepName] = useState();
  const [publishTime, setPublishTime] = useState();
  const [articleTypeId, setArticleTypeId] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [role, setRole] = useState();
  const [activeTab, setActiveTab] = useState("article");
  const { id } = useParams();
  const [statusId, setStatusId] = useState(-1);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [localNews, setLocalNews] = useState([]);
  const [valueOtherCategory, setValueOtherCategory] = useState([]);
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
  }, []);
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  document.title = `Sửa ${
    typeVideo === "short-video" ? "Short Video" : "Video"
  }  | Toà Soạn Hội Tụ`;
  const [avatar, setAvatar] = useState([]);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {},
    validationSchema: Yup.object({
      article_title: Yup.string().required("Mời bạn nhập tên bài viết"),
      article_sapo: Yup.string(),
      slug: Yup.string()
        .required("Mời bạn nhập slug cho bài viết")
        .matches(/^[a-zA-Z0-9\-]+$/, "Slug không được chứa ký tự đặc biệt"),
    }),
    onSubmit: (values) => {
      const data = {
        article_id: detailData.article_id,
        sub_title: values.sub_title,
        article_title: values.article_title,
        article_sapo: values.article_sapo,
        list_categoryid:
          valueOtherCategory.length > 0
            ? JSON.stringify(valueOtherCategory)
            : null,
        pen_name: typeVideo === "short-video" ? "" : values.pen_name,
        article_type_id: typeVideo === "short-video" ? 11 : 3,
        article_content: JSON.stringify([videoID]),
        avatar_image: avatar,
        slug: values.slug,
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }

      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!result.article_type_id) {
        ToastCustom("Loại bài viết không xác định", "fail");
      } else {
        // save new article
        if (statusId === 4) {
          updateArticleFucusPublish({
            article_id: parseInt(id),
            outstanding: outstanding1 ? 1 : 2,
          }).then((res) => {
            if (res.status && res.status > 0) {
              ToastCustom("Sửa bài viết thành công", "success");
              // validation.resetForm();
              // navigate("/list-article");
            } else {
              ToastCustom(res.message && res.message, "fail");
            }
          });
        } else {
          getAPIPutArticle(result).then((r) => {
            if (r.status > 0) {
              ToastCustom("Update bài viết thành công", "success");
              // validation.resetForm();
              // navigate("/list-article");
            } else if (r.status === -1) {
              ToastCustom("Update bài viết thất bại", "fail");
            } else if (r.status === -2) {
              ToastCustom("Có lỗi xảy ra", "fail");
            }
          });
        }
      }
    },
  });
  useEffect(() => {
    if (detailData) {
      validation.setFieldValue("article_title", detailData.article_title);
      validation.setFieldValue("sub_title", detailData.sub_title);
      validation.setFieldValue("article_sapo", detailData.article_sapo);
      validation.setFieldValue("slug", detailData.slug);
      validation.setFieldValue("pen_name", detailData.pen_name);
      validation.setFieldValue("leak_url", detailData.leak_url);
      validation.setFieldValue(
        "list_categoryid",
        detailData.list_categoryid || []
      );
      setValueOtherCategory(JSON.parse(detailData.list_categoryid) || []);
      setOutstanding1(detailData.outstanding === 1 ? true : false);
      setOutstanding2(detailData.outstanding === 2 ? true : false);
      setEnableComment(detailData.enable_comment === 1 ? true : false);
      setValueCategory({
        value: detailData.category_id,
        label: detailData.category_name,
      });
      setCurrentRole(detailData.next_public_role_step - 1);
      setPublishTime(
        detailData.publish_date !== null
          ? new Date(detailData.publish_date).toISOString()
          : null
      );
      setArticleTypeId(detailData.article_status_id);
      setVideoMedia(
        detailData.list_file_info
          ? `${detailData.list_file_info[0].file_url}`
          : null
      );
      setVideoID(
        detailData.list_file_info
          ? detailData.list_file_info[0].file_info_id
          : null
      );
      setAvatar(detailData.avatar_image);
      getAPIRoleByArticleId(id).then((res) => {
        if (res.data && res.status > 0) {
          setRole(res.data);
        }
      });
      setStatusId(detailData.article_status_id);
    }
  }, [detailData]);
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
    // setmodal_scroll(!modal_scroll);
    setmodal_scroll(true);
    const currentStep = role._role_steps_info[currentRole + 1];
    setStepName(currentStep.step_name);
    setListUser(currentStep.list_user_accept);
    // validation.handleSubmit();
  };
  const onChangeFromDate = (e) => {
    setPublishTime(dayjs(e).format("YYYY-MM-DDTHH:mm:ss"));
  };
  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
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
  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb
          previousLink={"/list-article"}
          title={`Sửa ${typeVideo === "short-video" ? "Short Video" : "Video"}`}
          pageTitle="Danh sách bài viết"
        />
      </Container>

      {/* <Link
        to="/list-article"
        style={{ display: "block", marginBottom: "20px" }}
      > */}
      <button
        onClick={() => navigate(-1)}
        type="button"
        style={{ display: "block", marginBottom: "20px" }}
        className="btn btn-success"
      >
        Quay lại
      </button>
      {/* </Link> */}
      <Row>
        <div className="row">
          <div className="col-8" style={{ overflow: "auto", height: "80vh" }}>
            <Col lg={12}>
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
                        onChange={(e) => {
                          validation.handleChange(e);
                        }}
                        onBlur={(e) => {
                          validation.handleBlur(e);
                          // validation.values.slug = convertVietnamese(
                          //   validation.values.sub_title
                          // );
                        }}
                        invalid={
                          validation.touched.sub_title &&
                          validation.errors.sub_title
                            ? true
                            : false
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
                        placeholder="Toà Soạn Hội Tụ"
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
                      <Label htmlFor="article_sapo" className="form-label">
                        Sapo
                      </Label>
                      <Input
                        name="article_sapo"
                        type="text"
                        className="form-control"
                        id="article_sapo"
                        placeholder="Toà Soạn Hội Tụ"
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
                        value={validation.values.article_sapo}
                      />
                      {validation.touched.article_sapo &&
                      validation.errors.article_sapo ? (
                        <FormFeedback type="invalid">
                          {validation.errors.article_sapo}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="article_sapo" className="form-label">
                        Nội dung
                      </Label>
                      <div>
                        {videoMedia && (
                          <Player
                            src={`${videoMedia}`}
                            keyboardShortcut={false}
                          >
                            {(ref, props) => (
                              <ReactHlsPlayer playerRef={ref} {...props} />
                            )}
                          </Player>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="hstack gap-2 justify-content-end">
                        <SelectMedia
                          title="Thêm Video"
                          onUploadMedia={(e, id, type) => {
                            if (type !== "stream") {
                              ToastCustom(
                                "Bạn hãy chọn Video để thêm vào bài viết",
                                "fail"
                              );
                            } else {
                              setVideoMedia(e);
                              setVideoID(id);
                            }
                          }}
                          className={"btn btn-success"}
                        ></SelectMedia>
                        <button
                          type="submit"
                          className="btn btn-success m-lg-2"
                        >
                          Lưu bài viết
                        </button>
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
                                  setReload();
                                } else {
                                  ToastCustom(
                                    res.message && res.message,
                                    "fail"
                                  );
                                }
                              });
                            }}
                          >
                            <button type="button" className="btn btn-primary">
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
                                    setReload();
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
                            <button type="button" className="btn btn-primary">
                              Hạ Xuất bản
                            </button>
                          </Popconfirm>
                        ) : (
                          role &&
                          role._role_steps_info &&
                          (currentRole >= role._role_steps_info.length - 1 ? (
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
                                      setReload();
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
                              <button type="button" className="btn btn-primary">
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
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={12}>
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
                    <div className="mb-3">
                      <Label htmlFor="article_category" className="form-label">
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
                    </div>
                    {typeVideo === "short-video" ? (
                      ""
                    ) : (
                      <div className="mb-3 ">
                        <div>
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
                      </div>
                    )}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
          <div className="col-4" style={{ overflow: "auto", height: "80vh" }}>
            <Col lg={12}>
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
                      </Form>
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
                              items={role._role_steps_info.map((role, key) => {
                                return {
                                  title: role.step_name,
                                  description:
                                    (role.user_accept &&
                                      ((role.status === 1 &&
                                        role.user_accept.full_name +
                                          " " +
                                          moment(role.accept_date).format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          )) ||
                                        (role.status == 0 &&
                                          key !== currentRole &&
                                          "Chưa thực hiện"))) ||
                                    (role.status === -1 && "Bỏ qua") ||
                                    (role.status === -3 &&
                                      "Đang chờ hẹn giờ xuất bản"),
                                };
                              })}
                            />
                            <CustomModal
                              togScroll={() => tog_scroll()}
                              modalScroll={modal_scroll}
                              setModelScroll={setmodal_scroll}
                              onSubmited={() => validation.handleSubmit()}
                              listUser={listUser}
                              stepName={stepName}
                              articleId={id}
                              setReload={() => setReload()}
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
            </Col>
            <Col lg={12}>
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
                          {publishTime !== undefined && (
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
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
        </div>
      </Row>
    </div>
  );
};
export default UpdateShortVideoArticle;
