import UiContent from "../../../Components/Common/UiContent";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import React, { useState, useEffect } from "react";
import DashBoardBottom from "./DashboardBottom";
import DashBoardTop from "./DashboardTop";

import { Select, Divider, Space, DatePicker } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
const Home = () => {
  document.title = "Trang chủ | Toà Soạn Hội Tụ";
  const { RangePicker } = DatePicker;
  const [typeTime, setTypeTime] = useState("year");
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [isCustomdate, setIsCustomdate] = useState(true);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb title="Tổng quan" pageTitle="Trang chủ" />
          <Row>
            <Col lg={10} style={{ padding: "10px" }}>
              <h3 style={{ color: "#405189" }}>Dashboard</h3>
            </Col>
            <Col
              lg={2}
              style={{
                padding: "10px",
              }}
            >
              {isCustomdate ? (
                <Select
                  style={{
                    width: "100%",
                  }}
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
                  style={{ width: "100%" }}
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
                    e ? setTypeTime(e) : setTypeTime("year");
                    setDateStart(new Date());
                  }}
                ></Select>
              )}
            </Col>
          </Row>
          <DashBoardTop
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
          <DashBoardBottom
            typeTime={typeTime}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
        </Container>
      </div>
    </>
  );
};

export default Home;
