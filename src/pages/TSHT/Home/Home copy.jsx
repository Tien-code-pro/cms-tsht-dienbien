import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";
import React, { useState } from "react";
import LineCharts from "./LineCharts";
import VerticalBarChart from "./LineCharts/VerticalBarChart";
import ChartMostRead from "./LineCharts/ChartMostRead";

const Home = () => {
  document.title = "Trang chủ | Toà Soạn Hội Tụ";

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <BreadCrumb title="Trang chủ" pageTitle="Trang chủ" />
          <Row>
            <Col lg={12}>
              <div style={{ backgroundColor: "#F4F3F9" }}>
                <LineCharts key={"1"} showFilter="showFilter"></LineCharts>
              </div>
            </Col>
            <Col lg={12}>
              <Row className="">
                <Col style={{ minHeight: 600 }} lg={6}>
                  <Card style={{ minHeight: "100%" }}>
                    <ChartMostRead title={"Đọc nhiều nhất"} />
                  </Card>
                </Col>
                <Col style={{ minHeight: 600 }} lg={6}>
                  <Card style={{ minHeight: "100%" }}>
                    <VerticalBarChart title={"Lượt truy cập"} />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
