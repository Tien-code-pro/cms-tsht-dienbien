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
  getAPIFaviconById,
  getAPIPostFavicon,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import ToastCustom from "../../../Components/Common/Toast";
import SelectMedia from "../FileManager/FileManagerMedia/SelectMedia";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";

const Favicon = () => {
  document.title = "Quản lý favicon | Toà Soạn Hội Tụ";

  const [favicon, setFavicon] = useState({});
  const [avatar, setAvatar] = useState([]);
  let navigate = useNavigate();

  const getFavicon = async () => {
    await getAPIFaviconById().then((res) => {
      setFavicon(res.data);
      setAvatar(res.data.image_url);
    });
  };
  useEffect(() => {
    getFavicon().then((r) => {});
  }, []);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      favicon_id: (favicon && favicon.favicon_id) || "",
      favicon_name: (favicon && favicon.favicon_name) || "",
      image_url: (favicon && favicon.image_url) || "",
      description: (favicon && favicon.description) || "",
    },
    validationSchema: Yup.object({
      //banner_url: Yup.string().required("Mời bạn chọn ảnh"),
      // email: Yup.string().required("Mời bạn nhập email"),
      // phone_number: Yup.string().required("Mời bạn nhập số điện thoại"),
    }),

    onSubmit: (values) => {
      const newFavicon = {
        favicon_id: 0,
        image_url: avatar,
        favicon_name: values.favicon_name,
        description: values.description,
      };

      // save new header
      getAPIPostFavicon(newFavicon).then((r) => {
        if (r.status >= 0) {
          ToastCustom("Update favicon thành công", "success");
          // validation.resetForm();
          navigate("/web-favicon");
        } else if (r.status < 0) {
          ToastCustom(r.message ? r.message : "Update favicon thất bại", "fail");
        }
      });
    },
  });
  return (
    <div>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Favicon" />
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
                          Icon Favicon
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
                      <Label className="form-label">Tên Icon</Label>
                      <Input
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Nhập Tên Icon"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.favicon_name || ""}
                        invalid={
                          validation.touched.favicon_name &&
                          validation.errors.favicon_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.favicon_name &&
                      validation.errors.favicon_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.favicon_name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description" className="form-label">
                        Mô Tả <RequiredIcon />
                      </Label>
                      <Input
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="Nhập mô tả"
                        type="text"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ""}
                        invalid={
                          validation.touched.description &&
                          validation.errors.description
                            ? true
                            : false
                        }
                      />
                      {validation.touched.description &&
                      validation.errors.description ? (
                        <FormFeedback type="invalid">
                          {validation.errors.description}
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
export default Favicon;
