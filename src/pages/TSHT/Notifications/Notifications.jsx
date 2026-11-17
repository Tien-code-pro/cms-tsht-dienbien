import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, Col, Container, Row } from "reactstrap";
import React from "react";

const Notifications = () => {
  return (
    <div className="page-content">
      <Container fluid={true}>
        <BreadCrumb title="Thông Báo" pageTitle="Thông Báo" />
        <Row>
          <Col lg={12}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Notifications;
