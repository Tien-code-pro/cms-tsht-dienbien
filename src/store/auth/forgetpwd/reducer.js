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

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  sendSuccessMsg: null,
  sendError: null,
  checkSuccessMsg: null,
  checkError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_OTP:
      state = {
        ...state,
        forgetSuccessMsg: null,
        forgetError: null,
      };
      break;
    case CHECK_OTP_SUCCESS:
      state = {
        ...state,
        checkSuccessMsg: action.payload,
      };
      break;
    case CHECK_OTP_ERROR:
      state = { ...state, checkError: action.payload };
      break;

    case SEND_OTP:
      state = {
        ...state,
        forgetSuccessMsg: null,
        forgetError: null,
      };
      break;
    case SEND_OTP_SUCCESS:
      state = {
        ...state,
        sendSuccessMsg: action.payload,
      };
      break;
    case SEND_OTP_ERROR:
      state = { ...state, sendError: "Gửi OTP thất bại" };
      break;

    case FORGET_PASSWORD:
      state = {
        ...state,
        forgetSuccessMsg: null,
        forgetError: null,
      };
      break;
    case FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        forgetSuccessMsg: action.payload,
      };
      break;

    case FORGET_PASSWORD_ERROR:
      state = { ...state, forgetError: "error in reduce" };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default forgetPassword;
