import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAPIEventById,
  getAPIGetArticleLiveById,
  getAPIListLiveChannelSourceType,
  getAPIPostarticle,
  getAPIPostLiveArticle,
  getAPIPutLiveArticle,
  getAPITreeListCategory,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import { DatePicker, TreeSelect } from "antd";
import ButtonLiveChannel from "../LiveChannel/ButtonLiveChannel";
import { FilePond } from "react-filepond";
import dayjs from "dayjs";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../helpers/text_helper";
import SelectTag from "../../../Components/Common/SelectTag";
import moment from "moment";

import "moment-timezone";
import { object } from "yup";
import { fr } from "date-fns/locale";

const UpdateArticleLive = () => {
  document.title = "Cập nhập bài tường thuật | Toà Soạn Hội Tụ";

  const [reload, setReload] = useState(false);

  const [avatar, setAvatar] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  function onChangeCategory(value) {
    if (value === undefined) {
      value = null;
    }
    setValueCategory(value);
  }
  const [selectedTags, setSelectedTags] = useState([]);
  const [optionsTag, setOptionTag] = useState([]);
  const [articleRelate, setArticleRelate] = useState([]);
  const [valueArticleRelate, setValueArticleRelate] = useState([]);
  const [reloadTag, setReloadTag] = useState();
  const [timeRefresh, setTimeRefresh] = useState({ value: 5, label: "5 phút" });
  const [article, setArticle] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getAPIGetArticleLiveById(id).then((res) => {
      setValueCategory({
        value: res.data.category_id,
        label: res.data.category_name,
      });
      setArticle(res.data);
      setAvatar(res.data.avatar_image);
      if (res.data.refresh_time) {
        setTimeRefresh({
          value: parseInt(res.data.refresh_time),
          label: res.data.refresh_time.toString() + " phút",
        });
      }
      setToDate(res.data.end_time);
      setFromDate(res.data.start_time);
      setValueArticleRelate(
        res.data.list_article_relate
          ? res.data.list_article_relate.map((e) => {
              return {
                label: e.article_title,
                value: e.article_id,
              };
            })
          : []
      );
      setSelectedTags(
        res.data.list_tag_info
          ? res.data.list_tag_info.map((e) => e.tag_id)
          : []
      );
    });
    getAPITreeListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
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
      }
      setOptionsCategory(options);
    });
  }, []);

  let navigate = useNavigate();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      article_title: article && article.article_title,
      article_description: article && article.article_content,
      article_slug: article.slug,
      refresh_time: timeRefresh,
      start_time: (article && article.start_time) || "",
      end_time: (article && article.end_time) || "",
    },
    validationSchema: Yup.object({
      article_title: Yup.string()
        .trim()
        .required("Mời bạn nhập tên bài tường thuật")
        .max(175, "Tên bài tường thuật không nhập quá 175 ký tự")
        .min(2, "Tên bài tường thuật không nhập nhỏ hơn 2 ký tự "),
      article_description: Yup.string()
        .trim()
        .required("Mời bạn nhập mô tả bài tường thuật")
        .max(300, "Mô tả tường thuật không nhập quá 300 ký tự")
        .min(2, "Mô tả tường thuật không nhập nhỏ hơn 2 ký tự "),
      // tag_list: Yup.string().required("Mời bạn nhập tag"),
      article_slug: Yup.string().required("Mời bạn nhập slug"),
    }),

    onSubmit: (values) => {
      const newarticle = {
        article_id: id,
        article_title: values.article_title,
        article_content: values.article_description,
        tag_list: "[" + selectedTags.toString() + "]",
        slug: values.article_slug,
        refresh_time:
          typeof timeRefresh === "object"
            ? "5"
            : timeRefresh && timeRefresh.toString(),
        category_id: valueCategory.value ? valueCategory.value : valueCategory,

        start_time: dayjs(fromDate).toISOString(),
        end_time: dayjs(toDate).toISOString(),
        avatar_image: avatar,
        list_article_relate:
          valueArticleRelate[0] && !valueArticleRelate[0].value
            ? "[" + valueArticleRelate.toString() + "]"
            : "[" + valueArticleRelate.map((r) => r.value).toString() + "]",
      };

      let result = { ...newarticle };
      // save new articles
      if (!result.avatar_image) {
        ToastCustom("Vui lòng chọn ảnh đại diện", "fail");
        return;
      } else if (!result.refresh_time) {
        ToastCustom("Vui lòng chọn thời gian refresh", "fail");
        return;
      } else if (!result.category_id) {
        ToastCustom("Vui lòng chọn chuyên mục", "fail");
        return;
      } else {
        getAPIPutLiveArticle(newarticle).then((r) => {
          if (r.status > 0) {
            ToastCustom("Sửa bài tường thuật thành công", "success");
            validation.resetForm();
            navigate("/list-article-live");
          } else if (r.status < 0) {
            ToastCustom(
              r.message ? r.message : "Sửa bài tường thuật thất bại",
              "fail"
            );
          }
        });
      }
    },
  });

  const onChangeFromDate = (e) => {
    setFromDate(e);
  };
  const onChangeToDate = (e) => {
    setToDate(e);
  };

  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Sửa Mới bài tường thuật"
            pageTitle="Danh sách bài tường thuật"
          />
          <Row>
            <Card>
              <CardBody>
                <Col lg={12}>
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <Label className="form-label">
                        Tên bài tường thuật
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="article_title"
                        className="form-control"
                        placeholder="Nhập tên bài tường thuật"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={(e) => {
                          validation.handleBlur(e);
                          validation.values.article_slug = convertVietnamese(
                            validation.values.article_title || ""
                          );
                        }}
                        value={validation.values.article_title || ""}
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
                      <Label className="form-label">Mô tả</Label>
                      <RequiredIcon />

                      <textarea
                        rows={4}
                        name="article_description"
                        className="form-control"
                        placeholder="Nhập nội dung mô tả bài tường thuật"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.article_description || ""}
                      />
                      {validation.touched.article_description &&
                      validation.errors.article_description ? (
                        <FormFeedback type="invalid">
                          {validation.errors.article_description}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Col lg={4}>
                        <Label htmlFor="article_avatar" className="form-label">
                          Ảnh đại diện <RequiredIcon />
                        </Label>
                        <SelectMedia
                          type={"dropzone"}
                          defaultImgSrc={avatar}
                          showImage={true}
                          setDefaultImgSrc={() => setAvatar()}
                          onUploadMedia={(e) => setAvatar(e)}
                        ></SelectMedia>
                      </Col>
                    </div>

                    <div className="mb-3">
                      <Row>
                        <div className="col-2">
                          <div className="mb-3">
                            <Label className="form-label">
                              Thời gian bắt đầu
                            </Label>
                            <Col className="col-12">
                              {fromDate !== undefined && (
                                <DatePicker
                                  id="start_time"
                                  name="start_time"
                                  allowClear
                                  onChange={onChangeFromDate}
                                  placeholder="Từ ngày"
                                  showTime
                                  defaultValue={
                                    fromDate !== null ? dayjs(fromDate) : null
                                  }
                                />
                              )}
                            </Col>
                          </div>
                        </div>

                        <div className="col-2">
                          <div className="mb-3">
                            <Label className="form-label">
                              Thời gian kết thúc
                            </Label>
                            <Col className="col-12">
                              {toDate !== undefined && (
                                <DatePicker
                                  allowClear
                                  id="end_time"
                                  name="end_time"
                                  onChange={onChangeToDate}
                                  placeholder="Đến ngày"
                                  showTime
                                  defaultValue={dayjs(toDate)}
                                />
                              )}
                            </Col>
                          </div>
                        </div>
                      </Row>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <Label className="form-label">
                          Thời gian tự động refresh trên website/app{" "}
                        </Label>
                        <RequiredIcon />

                        <TreeSelect
                          style={{
                            width: "100%",
                          }}
                          value={timeRefresh}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          treeData={[
                            {
                              value: 1,
                              label: "1 phút",
                            },
                            {
                              value: 2,
                              label: "2 phút",
                            },
                            {
                              value: 3,
                              label: "3 phút",
                            },
                            {
                              value: 4,
                              label: "4 phút",
                            },
                            {
                              value: 5,
                              label: "5 phút",
                            },
                          ]}
                          treeDefaultExpandAll
                          placeholder="Trạng thái"
                          onChange={(e) => setTimeRefresh(e)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Chuyện mục</Label>
                      <RequiredIcon />

                      <TreeSelect
                        style={{
                          width: "100%",
                        }}
                        value={valueCategory}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                        allowClear
                        treeData={optionsCategory}
                        treeDefaultExpandAll
                        placeholder="Chuyên mục"
                        onChange={onChangeCategory}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">
                        Slug
                        <RequiredIcon />
                      </Label>
                      <Input
                        name="article_slug"
                        className="form-control"
                        placeholder="Nhập slug"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.article_slug || ""}
                        invalid={
                          validation.touched.article_slug &&
                          validation.errors.article_slug
                            ? true
                            : false
                        }
                      />
                      {validation.touched.article_slug &&
                      validation.errors.article_slug ? (
                        <FormFeedback type="invalid">
                          {validation.errors.article_slug}
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

                    <div className="hstack gap-2 justify-content-end m-lg-3">
                      <button type="submit" className="btn btn-success">
                        Cập nhập
                      </button>
                      <button type="button" className="btn btn-light">
                        <Link to={`/list-article-live`}>Quay lại</Link>
                      </button>
                    </div>
                  </Form>
                </Col>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default UpdateArticleLive;
