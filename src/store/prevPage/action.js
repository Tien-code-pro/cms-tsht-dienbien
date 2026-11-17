import { SET_DATA_PREV_PAGE } from "./actionType";

// common success
// export const ApplicationApiResponseSuccess = (actionType, data) => ({
//   type: API_RESPONSE_SUCCESS,
//   payload: { actionType, data },
// });
// // common error
// export const ApplicationApiResponseError = (actionType, error) => ({
//   type: API_RESPONSE_ERROR,
//   payload: { actionType, error },
// });

// export const getApplicationList = () => ({
//   type: GET_APPLICATION_LIST,
// });

export const setStatePrevPage = (data) => ({
  type: SET_DATA_PREV_PAGE,
  payload: data,
});
