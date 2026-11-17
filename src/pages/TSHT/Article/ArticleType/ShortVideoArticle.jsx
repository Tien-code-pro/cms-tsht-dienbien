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
  Row,
} from "reactstrap";
import { TreeSelect, DatePicker, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastCustom from "../../../../Components/Common/Toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getAPIListArticleRelated,
  getAPIListTag,
  getAPIPostArticle,
  getAPIPostTag,
  getAPITreeListCategory,
} from "../../../../helpers/fakebackend_helper";
import { registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import UploadComponent from "./UploadComponent";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../../helpers/text_helper";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import ReactHlsPlayer from "react-hls-player";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import SelectTag from "../../../../Components/Common/SelectTag";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const ShortVideoArticle = ({ article_type }) => {
  const [valueCategory, setValueCategory] = useState();
  const [videoMedia, setVideoMedia] = useState();
  const [publishTime, setPublishTime] = useState(null);
  const [videoID, setVideoID] = useState();
  let navigate = useNavigate();
  document.title = "Thêm bài viết | Toà Soạn Hội Tụ";
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
      article_title: Yup.string()
        .trim()
        .required("Mời bạn nhập tên bài viết")
        .min(2, "Tên bài viết lớn hơn 2 ký tự")
        .max(175, "Tên bài viết không được quá 175 ký tự"),
      article_sapo: Yup.string()
        .trim()
        .min(2, "Sapo bài viết lớn hơn 2 ký tự")
        .max(500, "Sapo bài viết không được quá 500 ký tự"),
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
        article_type_id: article_type,
        article_content: JSON.stringify([videoID]),
        avatar_image: avatar,
        slug: values.slug,
        // note: "",
      };
      let result = { ...data };
      if (publishTime !== null) {
        result = { ...data, publish_date: publishTime };
      }
      if (!result.article_content) {
        ToastCustom("Mời bạn nhập nội dung bài viết", "fail");
      } else if (!result.article_type_id) {
        ToastCustom("Loại bài viết không xác định", "fail");
      } else if (!result.avatar_image) {
        ToastCustom("Mời bạn nhập ảnh bài viết", "fail");
      } else {
        // save new article
        getAPIPostArticle(result).then((r) => {
          if (r && r.status > 0) {
            ToastCustom("Thêm bài viết thành công", "success");
            validation.resetForm();
            // navigate("/list-article");
            navigate(`/update-article/${r.data}`, {
              state: {
                type: result.article_type_id,
              },
            });
          } else if (r.status === -1) {
            ToastCustom("Thêm bài viết thất bại", "fail");
          } else if (r.status === -2) {
            ToastCustom("Slug của bài viết bị trùng", "fail");
          }
        });
      }
    },
  });
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
        <div className="row">
          <div className="col-8" style={{ overflow: "auto", height: "69vh" }}>
            <Col lg={12}>
              <Card style={{ marginBottom: 50 }}>
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
                        {/* {videoMedia && <div>{videoMedia}</div>} */}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-12 hstack gap-2 justify-content-end m-lg-3">
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
                        {/* <button
                          type="button"
                          className="btn btn-primary m-lg-2"
                        >
                          Chuyển tiếp
                        </button> */}
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
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </div>
          <div className="col-4" style={{ overflow: "auto", height: "69vh" }}>
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
                      <Label htmlFor="article_avatar" className="form-label">
                        Ảnh đại diện <RequiredIcon />
                      </Label>
                      <SelectMedia
                        style={{ marginBottom: "20px", paddingBottom: "20px" }}
                        type={"dropzone"}
                        onUploadMedia={(e) => setAvatar(e)}
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

                    {/* <div className="mb-3">
                      <Label htmlFor="leak_url" className="form-label">
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
                        <button className="btn btn-primary" type="button">
                          Lấy bài
                        </button>
                      </div>
                    </div> */}
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
          </div>
        </div>
      </Row>
    </div>
  );
};
export default ShortVideoArticle;
