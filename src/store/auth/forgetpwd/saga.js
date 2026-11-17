import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD, SEND_OTP, CHECK_OTP } from "./actionTypes";
import {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  sendOTPError,
  sendOTPSuccess,
  checkOTPError,
  checkOTPSuccess,
} from "./actions";

//Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postUserGetOtp,
  postUserCheckOtp,
} from "../../../helpers/fakebackend_helper";
import { redirect } from "react-router";

// const fireBaseBackend = getFirebaseBackend();

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // console.log("1");
      // const response = yield call(fireBaseBackend.forgetPassword, user.email);
      // if (response) {
      //   console.log("11");
      //   yield put(
      //     userForgetPasswordSuccess(
      //       "Reset link are sended to your mailbox, check there first"
      //     )
      //   );
      // }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      console.log("test");
      //const response = yield call(postJwtForgetPwd, user);
      const response = yield call(postUserGetOtp, user);
      console.log("cehck1", response);
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Reset link are sended to your mailbox, check there first"
          )
        );
      }
    } else if (window._env_.REACT_APP_API_URL) {
      // const response = yield call(postFakeForgetPwd, user);
      const response = yield call(postUserGetOtp, user);
      console.log("cehck2", response);
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Reset link are sended to your mailbox, check there first"
          )
        );
      }
    }
  } catch (error) {
    console.log("error:", error);
    yield put(userForgetPasswordError(error));
  }
}

function* sendOTP({ payload: { user, history } }) {
  try {
    console.log("history-send-otp", history);
    console.log("user-send-otp", user);
    console.log("ENV-send-otp", process.env);
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // console.log("1");
      // const response = yield call(fireBaseBackend.forgetPassword, user.email);
      // if (response) {
      //   console.log("11");
      //   yield put(
      //     userForgetPasswordSuccess(
      //       "Reset link are sended to your mailbox, check there first"
      //     )
      //   );
      // }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      console.log("test");
      //const response = yield call(postJwtForgetPwd, user);
      const response = yield call(postUserGetOtp, user);
      console.log("cehck1", response);
      if (response) {
        yield put(
          sendOTPSuccess(
            //"The OTP code has been sent to your email. Please check your email"
            "Mã OTP đã được gửi đến email của bạn. Xin hãy kiểm tra email."
          )
        );
      }
    } else if (window._env_.REACT_APP_API_URL) {
      // const response = yield call(postFakeForgetPwd, user);
      const response = yield call(postUserGetOtp, user);
      console.log("cehck2", response);
      if (response) {
        yield put(
          sendOTPSuccess(
            //"The OTP code has been sent to your email. Please check your email"
            "Mã OTP đã được gửi đến email của bạn. Xin hãy kiểm tra email."
          )
        );
      }
    }
  } catch (error) {
    console.log("error:", error);
    yield put(sendOTPError(error));
  }
}

function* checkOTP({ payload: { user, history } }) {
  try {
    console.log("history-send-otp", history);
    console.log("user-send-otp", user);
    console.log("ENV-send-otp", process.env);
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // console.log("1");
      // const response = yield call(fireBaseBackend.forgetPassword, user.email);
      // if (response) {
      //   console.log("11");
      //   yield put(
      //     userForgetPasswordSuccess(
      //       "Reset link are sended to your mailbox, check there first"
      //     )
      //   );
      // }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      console.log("test");
      //const response = yield call(postJwtForgetPwd, user);
      const response = yield call(postUserCheckOtp, user);
      console.log("cehck1", response);
      if (response.status != -1) {
        yield put(
          checkOTPSuccess(
            "Mật khẩu mới đã được gửi đến email của bạn. Bạn sẽ được đưa đến trang trang nhập sau 5 giây"
          )
        );
        setTimeout(() => {
          //redirect("Login")
          document.location.href = "/login";
        }, 5000);
      } else if (response.status == -1) {
        yield put(checkOTPError(response.message));
      }
    } else if (window._env_.REACT_APP_API_URL) {
      // const response = yield call(postFakeForgetPwd, user);
      const response = yield call(postUserCheckOtp, user);
      console.log("cehck2", response);
      if (response.status != -1) {
        yield put(
          checkOTPSuccess(
            "Mật khẩu mới đã được gửi đến email của bạn. Bạn sẽ được đưa đến trang trang nhập sau 5 giây"
          )
        );
        setTimeout(() => {
          //redirect("Login")
          document.location.href = "/login";
        }, 5000);
      } else if (response.status == -1) {
        yield put(checkOTPError(response.message));
      }
    }
  } catch (error) {
    console.log("error:", error);
    yield put(checkOTPError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}
export function* watchSendOTP() {
  yield takeEvery(SEND_OTP, sendOTP);
}
export function* watchCheckOTP() {
  yield takeEvery(CHECK_OTP, checkOTP);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
  yield all([fork(watchSendOTP)]);
  yield all([fork(watchCheckOTP)]);
}
// function* sendOTPSaga() {
//   yield all([fork(watchSendOTP)]);
// }

export default forgetPasswordSaga;
