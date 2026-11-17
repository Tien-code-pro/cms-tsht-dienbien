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
  createHotLink,
  getAPIHeaderById,
  getAPIPostHeader,
  getListHotLink,
  updateHotLink,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToastCustom from "../../../Components/Common/Toast";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../helpers/text_helper";

const UpdateHotLink = () => {
  document.title = "Quản lý giao diện | Toà Soạn Hội Tụ";
  let navigate = useNavigate();
  const [hotlink, setHotlink] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    getListHotLink({
      _hotLinkId: id,
      offset: 0,
      limit: 10,
    }).then((res) => {
      if (res && res.status > 0 && res.data.list) {
        setHotlink(res.data.list[0] || null);
      }
    });
  }, []);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      title: hotlink ? hotlink.title : "",
      link: hotlink ? hotlink.link : "",
    },
    validationSchema: Yup.object({
      //banner_url: Yup.string().required("Mời bạn chọn ảnh"),
      // email: Yup.string().required("Mời bạn nhập email"),
      title: Yup.string().required("Mời bạn nhập tiêu đề"),
      link: Yup.string().required("Mời bạn nhập đường dẫn"),
    }),

    onSubmit: (values) => {
      const newHotLink = {
        title: values.title,
        link: values.link,
        hot_link_id: hotlink.hot_link_id || 0,
      };

      // save new header
      updateHotLink(newHotLink).then((r) => {
        if (r && r.status >= 0) {
          ToastCustom("Thêm hot link thành công", "success");
          // validation.resetForm();
          navigate("/hot-link");
        } else if (r.status < 0) {
          ToastCustom(r.message ? r.message : "Thêm hot link thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="hot-link" />
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
                        Tiêu đề hot link <RequiredIcon />
                      </Label>
                      <Input
                        name="title"
                        className="form-control"
                        placeholder="Nhập tiêu đề"
                        type="title"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.title || ""}
                        invalid={
                          validation.touched.title && validation.errors.title
                            ? true
                            : false
                        }
                      />
                      {validation.touched.title && validation.errors.title ? (
                        <FormFeedback type="invalid">
                          {validation.errors.title}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="link" className="form-label">
                        Link <RequiredIcon />
                      </Label>
                      <Input
                        name="link"
                        id="link"
                        className="form-control"
                        placeholder="Nhập đường dẫn"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.link || ""}
                        invalid={
                          validation.touched.link && validation.errors.link
                            ? true
                            : false
                        }
                      />
                      {validation.touched.link && validation.errors.link ? (
                        <FormFeedback type="invalid">
                          {validation.errors.link}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-success">
                        Lưu
                      </button>
                      {/* <Link to={`/hot-link`}> */}
                      <button
                        onClick={() => navigate(-1)}
                        type="button"
                        className="btn btn-light"
                      >
                        Quay lại
                      </button>
                      {/* </Link> */}
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
export default UpdateHotLink;
