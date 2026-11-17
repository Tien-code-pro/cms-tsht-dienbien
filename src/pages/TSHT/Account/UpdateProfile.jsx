import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Button,
  Input,
  FormFeedback,
} from "reactstrap";
import { Select, TreeSelect } from "antd";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
//formik
import { useFormik } from "formik";
import * as Yup from "yup";

import ToastCustom from "../../../Components/Common/Toast";
import { RequiredIcon } from "../../../Components/Common/RequiredIcon";
//api
import {
  getAPIListDepartment,
  getAPIListCategory,
  getAPIAccountById,
  getAPIPutAccount,
  getAPIListGroupFunction,
  getAPITreeListCategory,
  getAPIUpdateAvatar,
} from "../../../helpers/fakebackend_helper";

import { Link, useNavigate, useParams } from "react-router-dom";
import md5 from "md5";

import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import moment from "moment";

const UpdateProfile = () => {
  document.title = "Thông tin tài khoản | Toà Soạn Hội Tụ";
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [department, setDepartment] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGroupFunction, setSelectedGroupFunction] = useState();
  const [optionsDepartment, setOptionsDepartment] = useState([]);
  const [optionsGroupFunction, setOptionsGroupFunction] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const [accountStatus, setAccountStatus] = useState(0);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [avatar, setAvatar] = useState("");
  let navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  function handleSelectDepartment(target) {
    setDepartment(target);
  }
  function handleSelectCategories(target) {
    setSelectedCategories(target);
  }
  function handleSelectGroupFunction(target) {
    setSelectedGroupFunction(target);
  }
  function changeStatus(event) {
    var result = event.target.checked ? 1 : 0;
    setAccountStatus(result);
  }
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: "",
      fullname: "",
      password: "",
      confrim_password: "",
      email: "",
      phone: "",
      penname: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Tên tài khoản là bắt buộc"),
      fullname: Yup.string().required("Họ và tên là bắt buộc"),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(RegExp("(.*[a-z].*)"), "Ít nhất một ký tự in thường")
        .matches(RegExp("(.*[A-Z].*)"), "Ít nhất một ký tự in hoa")
        .matches(RegExp("(.*[0-9].*)"), "Ít nhất một ký tự số"),
      confrim_password: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Mật khẩu không khớp"
      ),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string().required("Số điện thoại là bắt buộc"),
    }),
    onSubmit: (values) => {
      if (department == null) {
        ToastCustom("Hãy chọn phòng ban", "fail");
      } else if (selectedCategories == null || selectedCategories.length == 0) {
        ToastCustom("Hãy chọn ít nhất một chuyên muc", "fail");
      } else if (selectedGroupFunction == null) {
        ToastCustom("Hãy chọn phân quyền", "fail");
      } else {
        let result = {
          user_id: id,
          user_name: values.username,
          full_name: values.fullname,
          pen_name: values.penname,
          phone: values.phone,
          email: values.email,
          password: values.password ? md5(values.password) : null,
          avatar: avatar,
          department_id: department,
          category_list: selectedCategories.map((e) => e).join("|"),
          group_list: `${selectedGroupFunction}`,
          status: accountStatus,
        };
        getAPIPutAccount(result).then((res) => {
          if (res.status > 0) {
            ToastCustom("Cập nhật tài khoản thành công", "success");
            validation.resetForm();
            navigate("/list-account");
          } else {
            ToastCustom(res.message, "fail");
          }
        });
      }
    },
  });

  useEffect(() => {
    getAPIAccountById(id).then((res) => {
      if (res.status > 0) {
        validation.setFieldValue("username", res.data.user_name);
        validation.setFieldValue("fullname", res.data.full_name);
        validation.setFieldValue("phone", res.data.phone);
        validation.setFieldValue("email", res.data.email);
        validation.setFieldValue("penname", res.data.pen_name);
        setAccountStatus(res.data.status);
        setDepartment(res.data.department_id);
        // setSelectedCategories(
        //   JSON.parse(res.data.category_list).map((e) => {
        //     return { value: e.category_id, label: e.category_name };
        //   })
        // );
        let array = [];
        JSON.parse(res.data.category_list).forEach((x) =>
          array.push(x.category_id)
        );
        //console.log("pax",array )
        setSelectedCategories(array);
        setSelectedGroupFunction(JSON.parse(res.data.group_list)[0]?.group_id);
        setAvatar(res.data.avatar);
        res.data.avatar !== "https://media-tsht.vtcplay.vn" &&
          setImageUrl(res.data.avatar);
      } else {
        ToastCustom(res.message, "fail");
      }
    });
    getAPIListDepartment(0, -1).then((res) => {
      if (res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.department_id,
            label: e.department_name,
          });
        });
        setOptionsDepartment(options);
      } else {
        ToastCustom(res.message, "fail");
      }
    });
    getAPITreeListCategory(0, -1, "").then((res) => {
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
    getAPIListGroupFunction().then((res) => {
      var options = [];
      res.data.forEach((e) => {
        options.push({
          value: e.group_id,
          label: e.group_name,
        });
      });
      setOptionsGroupFunction(options);
    });
  }, []);
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Ảnh phải có dạng jpeg hoặc png");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info) => {
    setLoading(true);
    if (info.file.error) {
      const nameAvatar = String(
        moment(new Date()).format("DDMMYYYYHHmmss") + ".png"
      );
      getBase64(info.file.originFileObj, (url) => {
        setImageUrl(url);
        const base64Data = url.split(",")[1];
        getAPIUpdateAvatar(nameAvatar, base64Data).then((res) => {
          if (res.status > 0) {
            setLoading(false);
            setAvatar(`/${nameAvatar}`);
          } else {
            setLoading(false);
            ToastCustom(res.message, "fail");
          }
        });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb
            title="Thông tin tài khoản"
            pageTitle="Danh sách tài khoản"
            previousLink="/list-account"
          />
          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="usernameInput" className="form-label">
                        Ảnh đại diện
                      </Label>
                      {imageUrl && (
                        <Button
                          className="button-delete-img-avatar"
                          onClick={() => {
                            setImageUrl("");
                            setAvatar("");
                          }}
                        >
                          <CloseOutlined />
                        </Button>
                      )}
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                              width: "100%",
                            }}
                          />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="usernameInput" className="form-label">
                        Tên tài khoản
                      </Label>
                      <Input
                        disabled={true}
                        type="text"
                        className="form-control"
                        placeholder="vtc.intecom"
                        id="username"
                        value={validation.values.username}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.username &&
                          validation.touched.username
                            ? true
                            : false
                        }
                      />
                      {validation.errors.username &&
                      validation.touched.username ? (
                        <FormFeedback type="invalid">
                          {validation.errors.username}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="penNameInput" className="form-label">
                        Bút danh
                      </Label>
                      <Input
                        // disabled={true}
                        type="text"
                        className="form-control"
                        placeholder="Bút danh"
                        id="penname"
                        value={validation.values.penname}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.penname &&
                          validation.touched.penname
                            ? true
                            : false
                        }
                      />
                      {validation.errors.penname &&
                      validation.touched.penname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.penname}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="fullnameInput" className="form-label">
                        Họ và tên
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Toà Soạn Hội Tụ"
                        id="fullname"
                        value={validation.values.fullname}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.fullname &&
                          validation.touched.fullname
                            ? true
                            : false
                        }
                      />
                      {validation.errors.fullname &&
                      validation.touched.fullname ? (
                        <FormFeedback type="invalid">
                          {validation.errors.fullname}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">Phòng Ban/Chức vụ</Label>
                      <Select
                        disabled={true}
                        placeholder="Chọn phòng ban/chức vụ"
                        onChange={handleSelectDepartment}
                        options={optionsDepartment}
                        value={department}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">Chuyên mục phụ trách</Label>
                      <TreeSelect
                        disabled={true}
                        placeholder="Chọn chuyên mục"
                        value={selectedCategories}
                        onChange={handleSelectCategories}
                        treeData={optionsCategory}
                        treeDefaultExpandAll
                        allowClear
                        multiple={true}
                        isMulti={true}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="mb-3"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <Label className="form-label">
                        Nhóm quyền <RequiredIcon />
                      </Label>
                      <Select
                        disabled={true}
                        placeholder="Chọn nhóm quyền"
                        value={selectedGroupFunction}
                        onChange={handleSelectGroupFunction}
                        options={optionsGroupFunction}
                        isMulti={false}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="emailInput" className="form-label">
                        Email
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="intecom@vtc.vn"
                        value={validation.values.email}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.email && validation.touched.email
                            ? true
                            : false
                        }
                      />
                      {validation.errors.email && validation.touched.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label for="phonenumberInput" className="form-label">
                        Số điện thoại
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="0912345678"
                        value={validation.values.phone}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        invalid={
                          validation.errors.phone && validation.touched.phone
                            ? true
                            : false
                        }
                      />
                      {validation.errors.phone && validation.touched.phone ? (
                        <FormFeedback type="invalid">
                          {validation.errors.phone}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label htmlFor="password-input" className="form-label">
                        Mật Khẩu
                      </Label>
                      <div className="position-relative auth-pass-inputgroup">
                        <Input
                          type={passwordShow ? "text" : "password"}
                          className="form-control pe-5 password-input"
                          id="password"
                          name="password"
                          placeholder="Nhập mật khẩu mới"
                          value={validation.values.password}
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          invalid={
                            validation.errors.password &&
                            validation.touched.password
                              ? true
                              : false
                          }
                        />
                        {validation.errors.password &&
                        validation.touched.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                        <Button
                          color="link"
                          onClick={() => setPasswordShow(!passwordShow)}
                          className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button"
                          id="password-addon"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </Button>
                      </div>
                      <div id="passwordInput" className="form-text">
                        Phải có ít nhất 8 ký tự.
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label
                        htmlFor="confirm-password-input"
                        className="form-label"
                      >
                        Xác Nhận Mật Khẩu
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          type={confirmPasswordShow ? "text" : "password"}
                          className="form-control pe-5 password-input"
                          id="confirm-password-input"
                          name="confrim_password"
                          placeholder="Nhập lại mật khẩu"
                          value={validation.values.confrim_password}
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          invalid={
                            validation.errors.confrim_password &&
                            validation.touched.confrim_password
                              ? true
                              : false
                          }
                        />
                        {validation.errors.confrim_password &&
                        validation.touched.confrim_password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.confrim_password}
                          </FormFeedback>
                        ) : null}
                        <Button
                          color="link"
                          onClick={() =>
                            setConfirmPasswordShow(!confirmPasswordShow)
                          }
                          className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                          type="button"
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      id="password-contain"
                      className="p-3 bg-light mb-2 rounded"
                    >
                      <h5 className="fs-13">Mật khẩu phải bao gồm:</h5>
                      <p id="pass-length" className="invalid fs-12 mb-2">
                        Ít nhất <b>8 ký tự</b>
                      </p>
                      <p id="pass-lower" className="invalid fs-12 mb-2">
                        Ít nhất <b>1 ký tự viết thường</b>(a-z)
                      </p>
                      <p id="pass-upper" className="invalid fs-12 mb-2">
                        Ít nhất <b>1 ký tự viết hoa</b>(A-Z)
                      </p>
                      <p id="pass-number" className="invalid fs-12 mb-0">
                        Ít nhất <b>1 số</b> (0-9)
                      </p>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div
                      className="form-check form-switch form-switch-md mb-3"
                      dir="ltr"
                    >
                      <Label
                        className="form-check-label"
                        htmlFor="customSwitchsizemd"
                      >
                        Trạng thái
                      </Label>
                      <Input
                        disabled={true}
                        type="checkbox"
                        className="form-check-input"
                        id="customSwitchsizemd"
                        onChange={changeStatus}
                        checked={accountStatus === 1 ? true : false}
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-start">
                      <button type="submit" className="btn btn-secondary">
                        Cập nhật
                      </button>
                      <Link to="/list-account">
                        <button type="button" className="btn btn-soft-danger">
                          Huỷ
                        </button>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default UpdateProfile;
