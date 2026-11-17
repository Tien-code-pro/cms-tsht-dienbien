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
  getAPIHeaderById,
  getAPIPostHeader,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import ToastCustom from "../../../Components/Common/Toast";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
import { convertVietnamese } from "../../../helpers/text_helper";

const Header = () => {
  document.title = "Quản lý giao diện | Toà Soạn Hội Tụ";

  const [header, setHeader] = useState({});
  const [avatar, setAvatar] = useState([]);
  let navigate = useNavigate();
  const { id } = useParams();

  const getHeader = async () => {
    await getAPIHeaderById(0).then((res) => {
      setHeader(res.data);
      setAvatar(res.data.banner_url);
    });
  };
  useEffect(() => {
    getHeader().then((r) => {});
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      header_id: (header && header.header_id) || "",
      phone_number: (header && header.phone_number) || "",
      banner_url: (header && header.banner_url) || "",
      email: (header && header.email) || "",
      youtubeLink: (header && header.youtube_link) || "",
      tiktokLink: (header && header.tiktok_link) || "",
      facebookLink: (header && header.facebook_link) || "",
      zaloLink: (header && header.zalo_link) || "",
    },
    validationSchema: Yup.object({
      //banner_url: Yup.string().required("Mời bạn chọn ảnh"),
      // email: Yup.string().required("Mời bạn nhập email"),
      phone_number: Yup.string().required("Mời bạn nhập số điện thoại"),
    }),

    onSubmit: (values) => {
      const newHeader = {
        header_id: 0,
        banner_url: avatar,
        phone_number: values.phone_number,
        email: values.email,
        facebook_link: values.facebookLink,
        youtube_link: values.youtubeLink,
        tiktok_link: values.tiktokLink,
        zalo_link: values.zaloLink,
      };

      // save new header
      getAPIPostHeader(newHeader).then((r) => {
        if (r.status >= 0) {
          ToastCustom("Thêm header thành công", "success");
          // validation.resetForm();
          navigate("/header");
        } else if (r.status < 0) {
          ToastCustom(r.message ? r.message : "Thêm header thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Header" />
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
                      <Col lg={4}>
                        <Label htmlFor="article_avatar" className="form-label">
                          Ảnh header
                          <RequiredIcon />
                        </Label>
                        <SelectMedia
                          showImage={true}
                          defaultImgSrc={avatar}
                          type={"dropzone"}
                          onUploadMedia={(e) => setAvatar(e)}
                        ></SelectMedia>
                      </Col>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Nhập Email"
                        type="email"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Facebook</Label>
                      <Input
                        name="facebookLink"
                        className="form-control"
                        placeholder="Link nhanh Facebook"
                        type="facebookLink"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.facebookLink || ""}
                        invalid={
                          validation.touched.facebookLink &&
                          validation.errors.facebookLink
                            ? true
                            : false
                        }
                      />
                      {validation.touched.facebookLink &&
                      validation.errors.facebookLink ? (
                        <FormFeedback type="invalid">
                          {validation.errors.facebookLink}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Youtube</Label>
                      <Input
                        name="youtubeLink"
                        className="form-control"
                        placeholder="Link nhanh Youtube"
                        type="youtubeLink"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.youtubeLink || ""}
                        invalid={
                          validation.touched.youtubeLink &&
                          validation.errors.youtubeLink
                            ? true
                            : false
                        }
                      />
                      {validation.touched.youtubeLink &&
                      validation.errors.youtubeLink ? (
                        <FormFeedback type="invalid">
                          {validation.errors.youtubeLink}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Tiktok</Label>
                      <Input
                        name="tiktokLink"
                        className="form-control"
                        placeholder="Link nhanh Tiktok"
                        type="tiktokLink"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.tiktokLink || ""}
                        invalid={
                          validation.touched.tiktokLink &&
                          validation.errors.tiktokLink
                            ? true
                            : false
                        }
                      />
                      {validation.touched.tiktokLink &&
                      validation.errors.tiktokLink ? (
                        <FormFeedback type="invalid">
                          {validation.errors.tiktokLink}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Zalo</Label>
                      <Input
                        name="zaloLink"
                        className="form-control"
                        placeholder="Link nhanh Zalo"
                        type="zanloLink"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.zaloLink || ""}
                        invalid={
                          validation.touched.zaloLink &&
                          validation.errors.zaloLink
                            ? true
                            : false
                        }
                      />
                      {validation.touched.zaloLink &&
                      validation.errors.zaloLink ? (
                        <FormFeedback type="invalid">
                          {validation.errors.zaloLink}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="phone_number" className="form-label">
                        Số điện thoại <RequiredIcon />
                      </Label>
                      <Input
                        name="phone_number"
                        id="phone_number"
                        className="form-control"
                        placeholder="Nhập Số điện thoại"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.phone_number || ""}
                        invalid={
                          validation.touched.phone_number &&
                          validation.errors.phone_number
                            ? true
                            : false
                        }
                      />
                      {validation.touched.phone_number &&
                      validation.errors.phone_number ? (
                        <FormFeedback type="invalid">
                          {validation.errors.phone_number}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-success">
                        Lưu
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
export default Header;
