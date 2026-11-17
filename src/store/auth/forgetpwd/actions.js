import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  SEND_OTP,
  SEND_OTP_SUCCESS,
  SEND_OTP_ERROR,
  CHECK_OTP,
  CHECK_OTP_SUCCESS,
  CHECK_OTP_ERROR,
} from "./actionTypes";

export const userForgetPassword = (user, history) => {
  return {
    type: FORGET_PASSWORD,
    payload: { user, history },
  };
};

export const userForgetPasswordSuccess = (message) => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userForgetPasswordError = (message) => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  };
};

export const sendOTP = (user, history) => {
  return {
    type: SEND_OTP,
    payload: { user, history },
  };
};
export const sendOTPSuccess = (message) => {
  return {
    type: SEND_OTP_SUCCESS,
    payload: message,
  };
};
export const sendOTPError = (message) => {
  return {
    type: SEND_OTP_ERROR,
    payload: message,
  };
};

export const checkOTP = (user, history) => {
  return {
    type: CHECK_OTP,
    payload: { user, history },
  };
};
export const checkOTPSuccess = (message) => {
  return {
    type: CHECK_OTP_SUCCESS,
    payload: message,
  };
};
export const checkOTPError = (message) => {
  return {
    type: CHECK_OTP_ERROR,
    payload: message,
  };
};
