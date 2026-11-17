import axios from "axios";
import { refreshTokenApi } from "./fakebackend_helper";


// default
axios.defaults.baseURL = window._env_.REACT_APP_API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(localStorage.getItem("authUser"))
  ? JSON.parse(localStorage.getItem("authUser"))["data"]["accessToken"]
  : null;
const refreshToken = JSON.parse(localStorage.getItem("authUser"))
  ? JSON.parse(localStorage.getItem("authUser"))["data"]["refreshToken"]
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {

    if (response.data) {
      if (response.data.status === -405) {
        localStorage.clear();
        window.location.href = "/login";
        return response.data;
      } else {
        return response.data;
      }
    }
  },
  async function (error) {
    const originalRequest = error.config;
    // gọi RT
    const AT = JSON.parse(localStorage.getItem("authUser"))["data"]["accessToken"] || "";
    const RT = JSON.parse(localStorage.getItem("authUser"))["data"]["refreshToken"] || "";
    return refreshTokenApi({
      accessToken: AT,
      refreshToken: RT
    }).then((res) => {
      console.log("cmm", {
        res: res
      });
      if (res.status > 0) {
        localStorage.setItem("authUser", JSON.stringify(res));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;


        return Promise.resolve(axios(originalRequest));
      } else {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    })
  }
);
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};
const setToken = () => {
  const token = JSON.parse(localStorage.getItem("authUser"))
    ? JSON.parse(localStorage.getItem("authUser"))["data"]["accessToken"]
    : null;
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params, responseType, headers) => {
    setToken();
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(
        `${url}?${queryString}`,
        responseType
          ? { responseType: responseType, headers: headers ? headers : {} }
          : {},
        params
      );
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    setToken();
    return axios.post(url, data);
  };
  /**
   * post given file to url
   */
  createFile = (url, data, option) => {
    setToken();
    return axios.post(url, data, option);
  };

  /**
   * Updates data
   */
  update = (url, data) => {
    setToken();
    return axios.patch(url, data);
  };

  put = (url, data) => {
    setToken();
    return axios.post(url, data);
  };
  /**
   * Delete
   */
  delete = (url, params) => {
    setToken();
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  // del = (url,id) =>{
  //   return axios.delete(url + "?" +id)
  // }
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
