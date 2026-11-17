import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import ImgUser from "../../../../assets/images/img_user.png";
import { Checkbox } from "antd";
import { postRoleArticleLiveContent } from "../../../../helpers/fakebackend_helper";
import ToastCustom from "../../../../Components/Common/Toast";
import { useNavigate } from "react-router-dom";

const ModalStep = ({ modalScroll, togScroll, listUser, article }) => {
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const handleCheckboxChange = (itemId) => {
    const updatedCheckedList = checkedList.includes(itemId)
      ? checkedList.filter((id) => id !== itemId)
      : [...checkedList, itemId];

    setCheckedList(updatedCheckedList);
    setIndeterminate(
      !!updatedCheckedList.length && updatedCheckedList.length < listUser.length
    );
    setCheckAll(updatedCheckedList.length === listUser.length);
  };
  useEffect(() => {
    setIndeterminate(false);
    setCheckedList([]);
    setCheckAll(false);
  }, [togScroll]);
  let navigate = useNavigate();

  const submissionStep = () => {
    const result = {
      article_live_id: article.article_live_id,
      article_id: article.article_id,
      article_title: article.article_title,
      article_content: article.article_content,
      start_time: article.start_time,
      display_time: article.display_time,
      other_author: article.other_author,
      next_user_accept_id: "[" + checkedList.toString() + "]",
      article_files: article.article_files,
    };
    if (result.article_title.trim() === "") {
      ToastCustom("Chuyển tiếp thất bại! Không được để trống tiêu đề", "fail");
      return;
    } else if (result.article_content.trim() === "") {
      ToastCustom(
        "Chuyển tiếp thất bại! Không được để trống nội dung chuyển tiếp",
        "fail"
      );
      return;
    } else if (result.display_time.trim() === "") {
      ToastCustom(
        "Chuyển tiếp thất bại! Không được để thời gian hiển thị",
        "fail"
      );
      return;
    }
    if (checkedList.length > 0) {
      postRoleArticleLiveContent(result).then((r) => {
        if (r.status > 0) {
          ToastCustom("Chuyển tiếp quy trình thành công", "success");
          navigate(`/list-article-live-content/${result.article_id}`);
        } else if (r.status === -1) {
          ToastCustom(r.message && r.message, "fail");
        }
      });
    } else {
      ToastCustom("Chưa chọn người duyệt", "fail");
    }
  };
  const handleCheckAllChange = (e) => {
    const checkedValues = e.target.checked
      ? listUser.map((item) => item.user_id)
      : [];
    setCheckedList(checkedValues);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  return (
    <>
      <Modal
        isOpen={modalScroll}
        toggle={() => {
          togScroll();
        }}
        size="xl"
        style={{ height: 600 }}
        scrollable={true}
        id="exampleModalScrollable"
      >
        <ModalHeader
          className="modal-title"
          id="exampleModalScrollableTitle"
          toggle={() => {
            togScroll();
          }}
        >
          Bước: Chuyển tiếp diễn biến
        </ModalHeader>
        <ModalBody>
          <div id="teamlist">
            <Row className="team-list grid-view-filter">
              <div style={{ marginBottom: 10 }}>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={handleCheckAllChange}
                  checked={checkAll}
                >
                  Chọn tất cả
                </Checkbox>
              </div>
              {(listUser || []).map((item, key) => (
                <Col key={key}>
                  <Card className="team-box">
                    <div className="team-cover">
                      <img src={ImgUser} alt="" className="img-fluid" />
                    </div>
                    <CardBody className="p-4">
                      <Row className="align-items-center team-row">
                        <Col className="team-settings">
                          <Row>
                            <Col>
                              <div className="flex-shrink-0 me-2">
                                <Checkbox
                                  onChange={() =>
                                    handleCheckboxChange(item.user_id)
                                  }
                                  checked={checkedList.includes(item.user_id)}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4} className="col">
                          <div className="team-profile-img">
                            <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0">
                              <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary">
                                {item.avatar_link ? (
                                  <img
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      borderRadius: "50%",
                                    }}
                                    src={item?.avatar_link}
                                    alt=""
                                  />
                                ) : (
                                  <div>
                                    {item.full_name.charAt(0) +
                                      item.full_name
                                        .split(" ")
                                        .slice(-1)
                                        .toString()
                                        .charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="team-content">
                              <h5 className="fs-16 mb-1">{item.full_name}</h5>
                              <p className="text-muted mb-0">
                                {item.group_name === "" ||
                                item.group_name === null
                                  ? "Chưa có chức vụ"
                                  : item.group_name}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </ModalBody>

        <div className="modal-footer">
          <Button onClick={submissionStep} color="primary">
            Chuyển tiếp
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default ModalStep;
