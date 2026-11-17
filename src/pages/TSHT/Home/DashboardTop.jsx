import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "reactstrap";
import ChartLineDot from "../chart/ChartDotLine.jsx";
import { SimpleDonut } from "./PieCharts/PieCharts.js";
import { BasicColumn } from "./ColumnCharts/ColumnCharts.js";
import { getAPIListStatusLineChart } from "../../../../src/helpers/fakebackend_helper.js";
import * as moment from "moment/moment";
const DashBoardTop = (props) => {
  const { typeTime, dateStart, dateEnd } = props;
  const labelsPie = ["Đã xuất bản", "Chờ xuất bản", "Chờ duyệt", "Hạ xuất bản"];
  const listStatus = ["4", "3", "2", "5"];
  const [seriesPie, setSeriesPie] = useState([]);
  let TempPromise = useRef([]);
  let listDataPie = [0, 0, 0, 0];
  const seriesBar = [
    {
      name: "Đã xuất bản",
      data: [46, 57, 59, 54, 62, 58, 64, 60, 66],
    },
    {
      name: "Chờ xuất bản",
      data: [74, 83, 102, 97, 86, 106, 93, 114, 94],
    },
    {
      name: "Chờ duyệt",
      data: [37, 42, 38, 26, 47, 50, 54, 55, 43],
    },
    {
      name: "Hạ xuất bản",
      data: [37, 42, 38, 26, 47, 50, 54, 55, 43],
    },
  ];
  const categories = [
    "Chính trị",
    "Kinh tế",
    "Xã hội",
    "Giáo dục",
    "Thế giới",
    "Pháp luật",
    "Văn hoá",
    "Du lịch",
    "Quảng cáo",
  ];
  const getAPIListStatusLineChartByStatus = (status) => {
    TempPromise.current.push(
      getAPIListStatusLineChart(
        10,
        status,
        typeTime,
        moment(dateStart).format("YYYY-MM-DD"),
        moment(dateEnd).format("YYYY-MM-DD")
      ).then((res) => {
        if (res.data && res.data.list && res.status >= 0) {
          if (status === "4") listDataPie[0] = res.data.total;
          else if (status === "3") listDataPie[1] = res.data.total;
          else if (status === "2") listDataPie[2] = res.data.total;
          else if (status === "5") listDataPie[3] = res.data.total;
          //setSeriesPie(seriesPie.push(res.data.total));
          // setListData(res.data.list);
          // setStatusListTotal(res.data);
        } else {
          // ToastCustom("Không tìm thấy dữ liệu!", "fail");
        }
      })
    );
  };
  useEffect(() => {
    TempPromise.current = [];
    listDataPie = [];
    listStatus.forEach((status) => {
      getAPIListStatusLineChartByStatus(status);
    });
  }, [typeTime, dateStart]);

  useEffect(() => {
    if (TempPromise.current.length === 4) {
      Promise.all(TempPromise.current)
        .then((res) => {
          //res.forEach((x) => list.push(x.total));
        })
        .finally(() => {
          setSeriesPie(listDataPie);
          TempPromise.current = [];
        });
    }
  }, [TempPromise.current]);

  useEffect(() => {
    TempPromise.current = [];
    // console.log("check", seriesPie);
  }, [seriesPie]);

  // console.log("check", seriesPie);

  return (
    <Row>
      <Col lg={3}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            marginBottom: "20px",
            height: "96%",
            height: "96%",
          }}
        >
          <div id={"custom-donut"} style={{ width: "100%", margin: "0 auto" }}>
            <h5
              style={{
                padding: "10px 12px 20px 12px",
                fontWeight: 600,
                color: "#405189",
              }}
            >
              Thống kê bài viết tổng hợp
            </h5>
            <SimpleDonut
              dataColors='["#07B39D", "#279DDB", "#F7B94A", "#EF6447"]'
              series={seriesPie && seriesPie.length > 0 ? seriesPie : [0]}
              labels={labelsPie}
              height={567.7}
            />
            <div style={{ height: "20px" }}></div>
          </div>
        </div>
      </Col>
      <Col lg={9}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            marginBottom: "20px",
            paddingBottom: "20px",
            height: "96%",
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
              Thống kê bài viết theo chuyên mục
            </h5>
            <BasicColumn
              dataColors='["#07B39D", "#279DDB", "#F7B94A", "#EF6447"]'
              series={seriesBar}
              height={470.7}
              categories={categories}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DashBoardTop;
