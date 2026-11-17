import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, Col, Container, Row } from "reactstrap";

import React from "react";
import ChartMostRead from "../Home/LineCharts/ChartMostRead";
import VerticalBarChart from "../Home/LineCharts/VerticalBarChart";
import ReportArticle from "./ReportArticle";
import LineCharts from "../Home/LineCharts";
const Report = () => {
  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb title="Thống kê" pageTitle="Trang chủ" />
        <Row>
          <Col lg={12}>
            <div style={{ backgroundColor: "#F4F3F9" }}>
              <LineCharts key={"1"} showFilter="showFilter"></LineCharts>
            </div>
          </Col>
        </Row>
      </Container>
      <ReportArticle />
    </div>
  );
};

export default Report;
