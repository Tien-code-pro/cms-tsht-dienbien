import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  getAPIListChartMostRead,
  getAPIListChartViewLikeShare,
} from "../../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import { IcOutlineRemoveRedEye } from "../../../../Components/Common/IcOutlineRemoveRedEye";
import * as moment from "moment";
import ToastCustom from "../../../../Components/Common/Toast";

const VerticalBarChart = ({ title }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartView, setChartView] = useState([]);
  const [totalView, setTotalView] = useState([]);
  const nowDate = moment(new Date(currentDate)).format("DD-MM-YYYY");

  useEffect(() => {
    getAPIListChartViewLikeShare(3, "day").then((res) => {
      if (res && res.status >= 0 && res.data) {
        setChartView(res.data);
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  }, []);

  useEffect(() => {
    getAPIListChartViewLikeShare(1, "day").then((res) => {
      if (res && res.status >= 0 && res.data) {
        setTotalView(res.data);
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  }, []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        // text: title,
      },
    },
  };

  const labels = chartView
    ? [
        chartView[0]?.thoi_gian ? chartView[0]?.thoi_gian : "",
        chartView[1]?.thoi_gian ? chartView[1]?.thoi_gian : "",
        chartView[2]?.thoi_gian ? chartView[2]?.thoi_gian : "",
      ]
    : [];

  const data = {
    labels,
    datasets: chartView
      ? [
          {
            label: "Lượt Xem ",
            data: [
              chartView[0]?.tong_view ? chartView[0]?.tong_view : 0,
              chartView[1]?.tong_view ? chartView[1]?.tong_view : 0,
              chartView[2]?.tong_view ? chartView[2]?.tong_view : 0,
            ],
            backgroundColor: "#0AB39C",
          },
          {
            label: "Lượt Bình Luận",
            data: [
              chartView[0]?.tong_comment ? chartView[0]?.tong_comment : 0,
              chartView[1]?.tong_comment ? chartView[1]?.tong_comment : 0,
              chartView[2]?.tong_comment ? chartView[2]?.tong_comment : 0,
            ],
            backgroundColor: "#EC4899",
          },
          {
            label: "Lượt Chia Sẻ",
            data: [
              chartView[0]?.tong_share ? chartView[0]?.tong_share : 0,
              chartView[1]?.tong_share ? chartView[1]?.tong_share : 0,
              chartView[2]?.tong_share ? chartView[2]?.tong_share : 0,
            ],
            backgroundColor: "#F7B84B",
          },
        ]
      : [],
  };

  return (
    <div className="container">
      {totalView?.length > 0 &&
        totalView?.map((e, i) => {
          return (
            <div className={"m-3"} key={i}>
              <div className=" my-3 d-flex justify-content-between align-items-center">
                <h4 style={{ color: "#3577F1", fontWeight: 600 }}>{title}</h4>
                <div className="d-flex flex-column align-items-center">
                  <p>Ngày: {nowDate}</p>
                </div>
              </div>
              <div className="d-flex">
                <h4
                  className="d-flex align-items-center"
                  style={{ minWidth: 220, textWrap: "nowrap" }}
                >
                  Lượt View trong ngày :
                </h4>
                <strong style={{ fontSize: 32, color: "#F88125" }}>
                  {e.tong_view}
                </strong>
              </div>
              <div className="d-flex">
                <h4
                  className="d-flex align-items-center"
                  style={{ minWidth: 220, textWrap: "nowrap" }}
                >
                  Số lượt comment :
                </h4>
                <strong style={{ fontSize: 32, color: "#F88125" }}>
                  {e.tong_comment}
                </strong>
              </div>
              <div className="d-flex">
                <h4
                  className="d-flex align-items-center"
                  style={{ minWidth: 220, textWrap: "nowrap" }}
                >
                  Số lượt chia sẻ :
                </h4>
                <strong style={{ fontSize: 32, color: "#F88125" }}>
                  {e.tong_share}
                </strong>
              </div>
            </div>
          );
        })}
      <Bar options={options} data={data ? data : []} />
    </div>
  );
};
export default VerticalBarChart;
