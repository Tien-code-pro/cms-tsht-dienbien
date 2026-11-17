import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
// action
import { userForgetPassword, sendOTP, checkOTP } from "../../../store/actions";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

import withRouter from "../../../Components/Common/withRouter";
import vtcWhite from "../../../assets/images/vtc-white.png";

import { Statistic, Button, ConfigProvider } from "antd";
const { Countdown } = Statistic;
let deadline = Date.now() + 3 * 1000; //* 1000*60*3;

let isTimeOut = false;
const sendBackOtp = () => {
  deadline = Date.now() + 3 * 1000; //* 1000*60*3;
  isTimeOut = false;
};

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();
  const [isCheckOTP, setIsCheckOTP] = useState(true);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Vui lòng điền Email của bạn!"),
      //otp: Yup.string().required("Vui lòng điền OTP của bạn!"),
    }),
    onSubmit: (values) => {
      if (isCheckOTP) {
        setIsCheckOTP(false);
        dispatch(sendOTP(values, props.history));
      }
      if (!isCheckOTP) {
        ///dispatch(userForgetPassword(values, props.history));
        dispatch(checkOTP(values, props.history));
      }
    },
  });

  const {
    forgetError,
    forgetSuccessMsg,
    sendError,
    sendSuccess,
    checkError,
    checkSuccessMsg,
  } = useSelector((state) => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
    sendError: state.ForgetPassword.sendError,
    sendSuccess: state.ForgetPassword.sendSuccessMsg,
    checkError: state.ForgetPassword.checkError,
    checkSuccessMsg: state.ForgetPassword.checkSuccessMsg,
  }));

  document.title = "Đặt lại mật khẩu | Tòa Soạn Hội Tụ";
  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={vtcWhite} alt="" height="50" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">Toà Soạn Hội Tụ</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Quên mật khẩu?</h5>
                    <p className="text-muted">Đặt lại mật khẩu</p>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <Alert
                    className="alert-borderless alert-warning text-center mb-2 mx-2"
                    role="alert"
                  >
                    Nhập email của bạn và OTP sẽ được gửi đến bạn!
                  </Alert>

                  <div className="p-2">
                    {sendError && isCheckOTP ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {sendError || "" || null}
                      </Alert>
                    ) : (
                      <></>
                    )}
                    {sendSuccess &&
                    !isCheckOTP &&
                    !checkSuccessMsg &&
                    !checkError ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {sendSuccess || "" || null}
                      </Alert>
                    ) : (
                      <></>
                    )}
                    {checkSuccessMsg && !isCheckOTP ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {checkSuccessMsg || "" || null}
                      </Alert>
                    ) : (
                      <></>
                    )}
                    {checkError && !isCheckOTP && !checkSuccessMsg ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {checkError || "" || null}
                      </Alert>
                    ) : (
                      <></>
                    )}
                    {isCheckOTP ? (
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-4">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Nhập email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.email}</div>
                            </FormFeedback>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className="text-center mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Gửi Email
                          </button>
                        </div>
                      </Form>
                    ) : (
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-4">
                          <Label className="form-label">OTP</Label>
                          <Input
                            name="otp"
                            className="form-control"
                            placeholder="Nhập OTP"
                            type="number"
                            value={validation.values.otp || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          />
                        </div>
                        <div className="text-center mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Gửi OTP
                          </button>
                          {/* {isTimeOut?(
                        <p onClick={sendBackOtp}>
                          Gửi lại OTP
                        </p>
                        ):(<></>)}
                        {!isTimeOut?(
                        <Countdown className="countdown-send-otp" value={deadline} onChange={onChange} format="mm:ss" onFinish={isTimeOut=true} />
                          ):(<></>)} */}
                        </div>
                      </Form>
                    )}
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Đợi đã, tôi nhớ mật khẩu của mình ...{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Nhấp vào đây{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
