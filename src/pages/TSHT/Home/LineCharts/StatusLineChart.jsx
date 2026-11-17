import React, { useEffect, useState } from "react";
import { getAPIListStatusLineChart } from "../../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import Loading from "../../../../Components/Common/Loading";
import CountUp from "react-countup";
import { Statistic, DatePicker, Select } from "antd";
import "../../../TSHT/Comment/comment.scss";
import * as moment from "moment/moment";
import ToastCustom from "../../../../Components/Common/Toast";

const StatusLineChart = (props) => {
  const { status, title, typeTime, dateStart, dateEnd } = props;
  const [statusListTotal, setStatusListTotal] = useState();
  const [listData, setListData] = useState([]);
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    getAPIListStatusLineChart(
      10,
      status,
      typeTime,
      moment(dateStart).format("YYYY-MM-DD"),
      moment(dateEnd).format("YYYY-MM-DD")
    ).then((res) => {
      if (res.data && res.data.list && res.status >= 0) {
        setListData(res.data.list);
        setStatusListTotal(res.data);
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  }, [typeTime, dateStart]);

  return (
    <div className="col-md-6 col-xl-3">
      {listData && listData.length ? (
        <div
          class="card-animate card"
          style={{ minHeight: 550, backgroundColor: "#FFFF" }}
        >
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-medium text-muted text-truncate mb-0 text-center title-report-custom">
                  {title}
                </p>
              </div>
              {/*<div class="flex-shrink-0">*/}
              {/*  <h5 class="fs-14 mb-0 text-success">*/}
              {/*    <i class="fs-13 align-middle ri-arrow-right-up-line"></i>*/}
              {/*    /!*06/2023*!/*/}
              {/*  </h5>*/}
              {/*</div>*/}
            </div>
            <div class="d-flex align-items-end justify-content-between mt-4 mt-4-custom">
              <div class={"w-100"}>
                <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                  <span class="counter-value text-center" data-target="559.25">
                    {title === "Chờ Duyệt" && (
                      <div className="cho-duyet">
                        <Statistic
                          value={statusListTotal.total}
                          //  title="Bài viết"
                          precision={1}
                          formatter={formatter}
                        />
                        <span className="baiviet-custom">bài viết</span>
                      </div>
                    )}
                    {title === "Chờ Xuất Bản" && (
                      <div className="cho-xuat-ban">
                        <Statistic
                          // title="Bài viết"
                          value={statusListTotal.total}
                          precision={1}
                          formatter={formatter}
                        />
                        <span className="baiviet-custom">bài viết</span>
                      </div>
                    )}
                    {title === "Đã xuất bản" && (
                      <div className="da-xuat-ban">
                        <Statistic
                          // title="Bài viết"
                          value={statusListTotal.total}
                          precision={1}
                          formatter={formatter}
                        />
                        <span className="baiviet-custom">bài viết</span>
                      </div>
                    )}
                    {title === "Hạ xuất bản" && (
                      <div className="ha-xuat-ban">
                        <Statistic
                          // title="Bài viết"
                          value={statusListTotal.total}
                          precision={1}
                          formatter={formatter}
                        />
                        <span className="baiviet-custom">bài viết</span>
                      </div>
                    )}
                  </span>
                </h4>
                <div class="flex-shrink-0 mt-3">
                  {(listData || []).map((e, i) => {
                    return (
                      <div
                        className={
                          "d-flex align-items-center justify-content-between my-2"
                        }
                        key={i}
                        style={{ borderBottom: "1px #D9D9D9 solid" }}
                      >
                        <span
                          style={{
                            maxWidth: "81%",
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: "22px",
                          }}
                          className={"d-block"}
                        >
                          {e.category_name}
                        </span>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: 500,
                            lineHeight: "28px",
                          }}
                        >
                          {" "}
                          {e.tong < 10 && e.tong != 0 ? "0" + e.tong : e.tong}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          class="card-animate card"
          style={{ minHeight: 300, backgroundColor: "#FFFFF" }}
        >
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                  {title}
                </p>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                  <span class="counter-value" data-target="559.25">
                    <Statistic
                      title="Bài viết"
                      value={0}
                      precision={1}
                      formatter={formatter}
                    />
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLineChart;
