import React, { useEffect, useState } from "react";
import { CardBody, CardHeader, Row } from "reactstrap";
import StatusLineChart from "./StatusLineChart";
import { DatePicker, Select, Space, Divider } from "antd";
import { CloseOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import * as moment from "moment/moment";

const LineCharts = (props) => {
  const { showFilter } = props;
  const [typeTime, setTypeTime] = useState("year");
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [isCustomdate, setIsCustomdate] = useState(true);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    setIsCustomdate(true);
  }, [typeTime]);
  useEffect(() => {
    setIsCustomdate(true);
  }, [dateEnd]);
  return (
    <>
      <CardHeader
        className="card-header border-0"
        style={{ backgroundColor: "#F4F3F9" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4
            className="card-title "
            style={{
              margin: "1rem 0",
              fontWeight: "600",
              lineHeight: "24px",
              font: "Inter",
              color: "#3577F1",
            }}
          >
            Thống kê tổng quan
          </h4>
          {showFilter == "showFilter" && (
            <div className="filter-statistical" style={{ marginTop: "7px" }}>
              {isCustomdate ? (
                <Select
                  style={{ width: "300px" }}
                  placeholder="1 Năm"
                  allowClear
                  value={
                    typeTime === "custom"
                      ? `${dateStart} - ${dateEnd}`
                      : typeTime
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
                        {/*<div className="date-to">
                          <DatePicker
                            placeholder="Hôm nay"
                            allowClear
                            // open={true}
                            onChange={(e) => {
                              e
                                ? setDateStart(new Date(e))
                                : setDateStart(new Date());
                            }}
                          ></DatePicker>
                        </div> */}
                      </Space>
                    </>
                  )}
                  onChange={(e) => {
                    e ? setTypeTime(e) : setTypeTime("year");
                    setDateStart(new Date());
                  }}
                ></Select>
              ) : (
                <Select
                  style={{ width: "300px" }}
                  open={true}
                  placeholder="1 Năm"
                  value={
                    typeTime === "custom"
                      ? `${dateStart} - ${dateEnd}`
                      : typeTime
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
                                  setDateStart(value[0].format("YYYY-MM-DD"));
                                  setDateEnd(value[1].format("YYYY-MM-DD"));
                                  setTypeTime("custom");
                                }
                              }}
                            />
                          </Space>
                          {/*<div className="date-to">
                          <DatePicker
                            placeholder="Hôm nay"
                            allowClear
                            // open={true}
                            onChange={(e) => {
                              e
                                ? setDateStart(new Date(e))
                                : setDateStart(new Date());
                            }}
                          ></DatePicker>
                        </div> */}
                        </div>
                      </Space>
                    </>
                  )}
                  onChange={(e) => {
                    e ? setTypeTime(e) : setTypeTime("year");
                    setDateStart(new Date());
                  }}
                ></Select>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="row">
          <StatusLineChart
            status="2"
            title="Chờ Duyệt"
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
          <StatusLineChart
            status="3"
            title="Chờ Xuất Bản"
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
          <StatusLineChart
            status="4"
            title="Đã xuất bản"
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
          <StatusLineChart
            status="5"
            title="Hạ xuất bản"
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
        </div>
      </CardBody>
    </>
  );
};

export default LineCharts;
