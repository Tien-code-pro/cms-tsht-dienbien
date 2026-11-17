import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import ChartLineDot from "../chart/ChartDotLine.jsx";
import ChartLine from "../chart/ChartLine.jsx";
import Loading from "../../../Components/Common/Loading";
import {
  getAPIListArticleViewCountByCategory,
  getAPIListChartMostRead,
  getAPIListChartPageInteract,
  getAPIListChartPageView,
  getAPIListChartReadArticle,
  getAPIListVideoMostWatch,
  getAPIListArticleMostWatch,
} from "../../../helpers/fakebackend_helper";
// import { CloseOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
// import { DatePicker, Select, Divider, Space } from "antd";
import { IcOutlineRemoveRedEye } from "../../../Components/Common/IcOutlineRemoveRedEye";
import { subDays, format } from "date-fns";
import * as moment from "moment/moment";
import ChartColum from "../chart/ChartColum1.jsx";
import ChartColumn2 from "../chart/ChartColum2.jsx";
import { DatePicker, Divider, Select, Space } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
const DashBoardBottom = (props) => {
  const [dataPageView, setDataPageView] = useState([]);
  const [dataPageInteract, setDataPageInteract] = useState([]);
  const [dataPageReadAritcle, setDataPageReadAritcle] = useState([]);
  const [articleViewCout, setArticleViewCount] = useState([]);
  const [dataMostRead, setDataMostRead] = useState([]);
  const [dataArticlesMostView, setDataArticlesMostView] = useState(null);
  // const [currentFilter, setCurrentFilter] = useState("year");
  const [fetching, setFetching] = useState(false);
  // const [typeTime, setTypeTime] = useState("year");
  const [typeTimeArticle, setTypeTimeArticle] = useState("year");

  const [isCustomdate, setIsCustomdate] = useState(true);
  const { RangePicker } = DatePicker;
  // const { dateStart, dateEnd, typeTime } = props;

  // const { dateStart, dateEnd, typeTime } = props;
  // const { RangePicker } = DatePicker;
  const [typeTimeFilter, setTypeTimeFilter] = useState("year");
  const [dateStartFilter, setDateStart] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [dateEndFilter, setDateEnd] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  // const [isCustomdate, setIsCustomdate] = useState(true);

  useEffect(() => {
    setFetching(true);
    switch (typeTimeArticle) {
      case "day":
        getAPIListArticleMostWatch(
          "day",
          10,
          moment().format("YYYY-MM-DD"),
          moment().subtract(1, "days").format("YYYY-MM-DD")
        ).then((res) => {
          if (res && res.status === 1) {
            setDataArticlesMostView(res.data[0].danhsach || null);
          } else {
            setDataArticlesMostView(null);
          }
          setFetching(false);
        });
        break;
      // case "week":
      //   getAPIListArticleMostWatch(
      //     "week",
      //     10,
      //     moment().format("YYYY-MM-DD"),
      //     moment().subtract(7, "days").format("YYYY-MM-DD")
      //   ).then((res) => {
      //     if (res && res.status === 1) {
      //       setDataArticlesMostView(res.data[0].danhsach || null);
      //     } else {
      //       setDataArticlesMostView(null);
      //     }
      //     setFetching(false);
      //   });
      //   break;
      case "month":
        getAPIListArticleMostWatch(
          "month",
          10,
          moment().format("YYYY-MM-DD"),
          moment().subtract(30, "days").format("YYYY-MM-DD")
        ).then((res) => {
          if (res && res.status === 1) {
            setDataArticlesMostView(res.data[0].danhsach || null);
          } else {
            setDataArticlesMostView(null);
          }
          setFetching(false);
        });
        break;
      // case "quater":
      //   getAPIListArticleMostWatch(
      //     "quater",
      //     10,
      //     moment().subtract(91, "days").format("YYYY-MM-DD"),
      //     moment().format("YYYY-MM-DD")
      //     // moment().format("YYYY-MM-DD"),
      //     // moment().subtract(7, "days").format("YYYY-MM-DD")
      //   ).then((res) => {
      //     if (res && res.status === 1) {
      //       setDataArticlesMostView(res.data[0].danhsach || null);
      //     } else {
      //       setDataArticlesMostView(null);
      //     }
      //     setFetching(false);
      //   });
      //   break;
      // case "half-year":
      //   getAPIListArticleMostWatch(
      //     "half-year",
      //     10,
      //     moment().subtract(182, "days").format("YYYY-MM-DD"),
      //     moment().format("YYYY-MM-DD")
      //     // moment().format("YYYY-MM-DD"),
      //     // moment().subtract(7, "days").format("YYYY-MM-DD")
      //   ).then((res) => {
      //     if (res && res.status === 1) {
      //       setDataArticlesMostView(res.data[0].danhsach || null);
      //     } else {
      //       setDataArticlesMostView(null);
      //     }
      //     setFetching(false);
      //   });
      //   break;
      case "year":
        getAPIListArticleMostWatch(
          "year",
          10,

          moment().subtract(365, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ).then((res) => {
          if (res && res.status === 1) {
            setDataArticlesMostView(res.data[0].danhsach || null);
          } else {
            setDataArticlesMostView(null);
          }
          setFetching(false);
        });
        break;

      default:
        getAPIListArticleMostWatch(
          "day",
          10,
          moment().format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ).then((res) => {
          if (res && res.status === 1) {
            setDataArticlesMostView(res.data[0].danhsach || null);
          } else {
            setDataArticlesMostView(null);
          }
          setFetching(false);
        });
    }
  }, [typeTimeArticle]);
  // useEffect(() => {
  //   getAPIListVideoMostWatch(
  //     "day",
  //     "video",
  // moment().format("YYYY-MM-DD"),
  // moment().subtract(7, "days").format("YYYY-MM-DD")
  //   ).then((res) => {
  //     if (res && res.status >= 0 && res.data) {
  //       res.data[0]?.danhsach
  //         ? setDataMostRead(res.data[0].danhsach)
  //         : setDataMostRead([]);
  //     }
  //   });
  // }, [dateStart, dateEnd, typeTime]);
  useEffect(() => {
    getAPIListChartPageInteract(7).then((res) => {
      if (res && res.status >= 0 && res.data) {
        setDataPageInteract(res.data);
      }
    });
    getAPIListChartPageView(7).then((res) => {
      if (res && res.status >= 0 && res.data) {
        setDataPageView(res.data);
      }
    });
    getAPIListChartReadArticle(7).then((res) => {
      if (res && res.status >= 0 && res.data) {
        setDataPageReadAritcle(res.data);
      }
    });
  }, []);
  useEffect(() => {
    getAPIListArticleViewCountByCategory(
      typeTimeFilter,
      dateStartFilter,
      dateEndFilter
    ).then((res) => {
      if (res && res.status >= 0 && res.data) {
        setArticleViewCount(res.data);
      }
    });
  }, [typeTimeFilter, dateStartFilter, dateEndFilter]);
  return (
    <>
      <Row>
        <Col lg={7}>
          <Col lg={12}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ width: "90%", margin: "0 auto" }}>
                <h5
                  style={{
                    padding: "10px 0 20px 0",
                    fontWeight: 600,
                    color: "#405189",
                  }}
                >
                  Thống kê lượt view (Page Views)
                </h5>
                <ChartLine dataPageView={dataPageView} />
                <div style={{ height: "31px" }}></div>
                <div style={{ height: "20px" }}></div>
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ padding: "16px" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4
                    style={{
                      fontWeight: 600,
                      color: "#405189",
                      margin: 0,
                    }}
                  >
                    Thống kê bài viết được xem nhiều nhất
                  </h4>
                  {/* <select
                    className="form-select"
                    style={{ width: "180px", fontSize: "16px" }}
                    aria-label="Default select example"
                    onChange={(e) => setCurrentFilter(e.target.value)}
                  >
                    <option value="day" selected>
                      Hôm nay
                    </option>
                    <option value="week">1 tuần</option>
                    <option value="month">1 tháng</option>
                    <option value="quater">3 tháng</option>
                    <option value="half-year">6 tháng</option>
                    <option value="year">1 năm</option>
                    <option>
                      <RangePicker
                        onChange={(value) => {
                          // if (value) {
                          //   setDateStart(value[0].format("YYYY-MM-DD"));
                          //   setDateEnd(value[1].format("YYYY-MM-DD"));
                          //   setTypeTime("custom");
                          // }
                        }}
                      />
                    </option>
                  </select> */}
                  <Select
                    style={{ width: "200px" }}
                    placeholder="1 Năm"
                    allowClear
                    value={typeTimeArticle}
                    // defaultValue={{ value: "year", label: "1 Năm" }}
                    options={[
                      { value: "day", label: "Hôm nay" },
                      // { value: "week", label: "1 Tuần" },
                      { value: "month", label: "1 Tháng" },
                      // { value: "quarter", label: "3 tháng" },
                      // { value: "half-year", label: "6 tháng" },
                      { value: "year", label: "1 Năm" },
                    ]}
                    // onChange={(item) => console.log("item", item)}
                    dropdownRender={(menu) => <>{menu}</>}
                    onChange={(e) => {
                      e ? setTypeTimeArticle(e) : setTypeTimeArticle("year");
                      // e ? setTypeTime(e) : setTypeTime("year");
                      // setDateStart(new Date());
                    }}
                  ></Select>
                </div>
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th className="fs-5">STT</th>
                      <th className="fs-5">Tiêu đề bài viết</th>
                      <th className="fs-5">Tổng số lượt xem</th>
                      <th className="fs-5">Lượt xem trong kỳ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetching ? (
                      <tr>
                        <td colSpan={4}>
                          <div style={{ textAlign: "center" }}>
                            <Loading />
                          </div>
                        </td>
                      </tr>
                    ) : dataArticlesMostView &&
                      dataArticlesMostView.length > 0 ? (
                      dataArticlesMostView.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="fs-6"> {idx + 1}</td>
                          <td className="fs-6">{item.article_title}</td>
                          <td className="fs-6"> {item.total_view_count}</td>
                          <td className="fs-6">
                            ...
                            {/* {item.total_view_count} */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>
                          <div style={{ textAlign: "center" }}>
                            Không có dữ liệu
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* {dataArticlesMostView && dataArticlesMostView.length > 0 ? (
                  dataArticlesMostView.map((e, i) => {
                    return (
                      <div className="frame-2 my-4" key={i}>
                        <div className="div-wrapper">
                          <p className="text-wrapper-2 fw-bold">
                            {e.article_title}
                          </p>
                        </div>
                        <div className="frame-3 d-flex justify-content-between align-items-center">
                          <p className="text-wrapper-3 m-0">
                            {" "}
                            {e.category_name}
                          </p>
                          <div className="frame-4 d-flex align-items-center">
                            <div className="text-wrapper-4 mx-2">
                              {e.total_view_count}
                            </div>
                            <IcOutlineRemoveRedEye className="ic-outline-remove" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div style={{ textAlign: "center" }}>
                      <h4>Chưa có dữ liệu</h4>
                    </div>
                  </>
                )} */}
              </div>
            </div>
          </Col>
        </Col>
        <Col lg={5}>
          <Col lg={12}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ width: "90%", margin: "0 auto" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h5
                    style={{
                      padding: "10px 0 20px 0",
                      fontWeight: 600,
                      color: "#405189",
                    }}
                  >
                    Lượt xem theo chuyên mục
                  </h5>
                  {isCustomdate ? (
                    <Select
                      style={{
                        width: "200px",
                        marginTop: "10px",
                      }}
                      placeholder="1 Năm"
                      allowClear
                      value={
                        typeTimeFilter === "custom"
                          ? `${dateStartFilter} - ${dateEndFilter}`
                          : typeTimeFilter
                      }
                      options={[
                        { value: "day", label: "Hôm nay" },
                        { value: "week", label: "1 Tuần" },
                        { value: "month", label: "1 Tháng" },
                        { value: "quarter", label: "3 tháng" },
                        { value: "half-year", label: "6 tháng" },
                        { value: "year", label: "1 Năm" },
                      ]}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider style={{ margin: "8px 0" }} />
                          <Space
                            style={{
                              padding: "0 8px 4px",
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setIsCustomdate(false);
                              }}
                            >
                              <p>Chọn khoảng thời gian</p>
                              <RightOutlined
                                style={{
                                  position: "absolute",
                                  top: "5px",
                                  right: "5px",
                                }}
                              />
                            </div>
                          </Space>
                        </>
                      )}
                      onChange={(e) => {
                        e ? setTypeTimeFilter(e) : setTypeTimeFilter("year");
                        setDateStart(moment(new Date()).format("YYYY-MM-DD"));
                      }}
                    ></Select>
                  ) : (
                    <Select
                      style={{ width: "200px", marginTop: "10px" }}
                      open={true}
                      placeholder="1 Năm"
                      value={
                        typeTimeFilter === "custom"
                          ? `${dateStartFilter} - ${dateEndFilter}`
                          : typeTimeFilter
                      }
                      allowClear
                      options={[
                        { value: "day", label: "Hôm nay" },
                        { value: "week", label: "1 Tuần" },
                        { value: "month", label: "1 Tháng" },
                        { value: "quarter", label: "3 tháng" },
                        { value: "half-year", label: "6 tháng" },
                        { value: "year", label: "1 Năm" },
                      ]}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider style={{ margin: "8px 0" }} />
                          <Space
                            style={{
                              padding: "0 8px 4px",
                              position: "relative",
                              width: "100%",
                            }}
                          >
                            <div>
                              <div>
                                <p>Chọn khoảng thời gian</p>
                                <CloseOutlined
                                  onClick={() => {
                                    setIsCustomdate(true);
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "6px",
                                    right: "5px",
                                    cursor: "pointer",
                                  }}
                                />
                              </div>
                              <Space direction="vertical" size={12}>
                                <RangePicker
                                  onChange={(value) => {
                                    if (value) {
                                      setDateStart(
                                        value[0].format("YYYY-MM-DD")
                                      );
                                      setDateEnd(value[1].format("YYYY-MM-DD"));
                                      setTypeTimeFilter("custom");
                                      setIsCustomdate(true);
                                    }
                                  }}
                                />
                              </Space>
                            </div>
                          </Space>
                        </>
                      )}
                      onChange={(e) => {
                        e ? setTypeTimeFilter(e) : setTypeTimeFilter("year");
                        setDateStart(moment(new Date()).format("YYYY-MM-DD"));
                      }}
                    ></Select>
                  )}
                </div>

                <ChartColumn2 dataPageInteract={articleViewCout}></ChartColumn2>
                <div style={{ height: "50px" }}></div>
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ width: "90%", margin: "0 auto" }}>
                <h5
                  style={{
                    padding: "10px 0 20px 0",
                    fontWeight: 600,
                    color: "#405189",
                  }}
                >
                  Thống kê tương tác
                </h5>
                {/* <ChartLineDot /> */}
                <ChartColum dataPageInteract={dataPageInteract}></ChartColum>
                <div style={{ display: "flex", padding: "20px 0" }}>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        height: "19px",
                        width: "19px",
                        backgroundColor: "#299CDB",
                      }}
                    ></div>
                    <p
                      style={{
                        fontWeight: 510,
                        color: "#57534E",
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      Lượt like
                    </p>
                  </div>
                  <div style={{ display: "flex", marginLeft: "20px" }}>
                    <div
                      style={{
                        height: "19px",
                        width: "19px",
                        backgroundColor: "#67B7E2",
                      }}
                    ></div>
                    <p
                      style={{
                        fontWeight: 510,
                        color: "#57534E",
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      Lượt comment
                    </p>
                  </div>
                  <div style={{ display: "flex", marginLeft: "20px" }}>
                    <div
                      style={{
                        height: "19px",
                        width: "19px",
                        backgroundColor: "#A2D1EB",
                      }}
                    ></div>
                    <p
                      style={{
                        fontWeight: 510,
                        color: "#57534E",
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      Lượt chia sẻ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={12}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            >
              <div style={{ width: "90%", margin: "0 auto" }}>
                <h5
                  style={{
                    padding: "15px 0 30px 0",
                    fontWeight: 600,
                    color: "#405189",
                  }}
                >
                  Thống kê lượt truy cập (Page Visits)
                </h5>
                <ChartLineDot dataPageReadAritcle={dataPageReadAritcle} />
                <h4
                  style={{
                    color: "#57534E",
                    paddingTop: "20px",
                    fontWeight: 600,
                  }}
                >
                  TỔNG LƯỢT TRUY CẬP TRANG:
                </h4>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#EF6A4E",
                    paddingBottom: "30px",
                  }}
                >
                  {dataPageReadAritcle && dataPageReadAritcle.length > 0
                    ? dataPageReadAritcle.reduce((accumulator, object) => {
                        return accumulator + object.value;
                      }, 0)
                    : 0}
                </h3>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
      <Row>
        <Col lg={7}>
          {/* <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              paddingBottom: "20px",
            }}
          >
            <div style={{ width: "90%", margin: "0 auto" }}></div>
          </div> */}
        </Col>
      </Row>
    </>
  );
};

export default DashBoardBottom;
