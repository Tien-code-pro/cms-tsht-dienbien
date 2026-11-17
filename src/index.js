import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd"; // Import ConfigProvider
import viVN from "antd/lib/locale/vi_VN";

import { configureStore } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={configureStore({})}>
    <ConfigProvider locale={viVN}>
      {" "}
      {/* Thiết lập locale tại đây */}
      <React.Fragment>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </ConfigProvider>
  </Provider>
);

reportWebVitals();
