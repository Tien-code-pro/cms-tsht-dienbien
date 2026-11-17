import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIApproveComment,
  getAPIDeleteComment,
  getAPIDeleteTag,
  getAPIListComment,
  getAPIListCategory,
  convertSpeechToText,
  getAPIPostResponseReader,
  getAPIDeletetResponseReader,
  getAPIListAccountFeedback,
  getAPIListDepartment,
  getAPIFeedbackById,
} from "../../../helpers/fakebackend_helper";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import DataTable from "react-data-table-component";
import {
  Popconfirm,
  Spin,
  TreeSelect,
  Table,
  Select,
  DatePicker,
  Tooltip,
  Modal,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import ToastCustom from "../../../Components/Common/Toast";
import el from "date-fns/locale/el";
import RecordAudio from "../RecordAudio/RecordAudio";

const Comment = () => {
  const [commentList, setCommentList] = useState();
  const [commentId, setCommentId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [key, setKey] = useState("");
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [searchTitleArticle, setKeyTitleArticle] = useState("");
  const [pageSizes, setPageSize] = useState();
  const [category, setCategoty] = useState("");
  const [status, setStatus] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [optionsDepartment, setOptionsDepartment] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // const onClickDelete = (tag_id) => {
  //   setCommentId(tag_id);
  //   setDeleteModal(true);
  // };
  const handleApprove = (articleId, parentId, commentId) => {
    getAPIApproveComment(articleId, parentId, commentId).then((res) => {
      if (res.status > 0) {
        ToastCustom("Duyệt thành công", "success");
        setReload(!reload);
      } else {
        ToastCustom("Duyệt thất bại, đã xảy ra lỗi!", "fail");
      }
    });
  };
  const handleDelete = (response_reader_id) => {
    getAPIDeletetResponseReader(response_reader_id).then((res) => {
      if (res.status > 0) {
        ToastCustom("Thành công", "success");
        setReload(!reload);
      } else {
        ToastCustom("Thất bại, đã xảy ra lỗi!", "fail");
      }
    });
  };
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPagination({
      ...pagination,
      pageSize: size,
      current: 1,
    });
    setReload(!reload);
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAccountFeedback(
      offset,
      pagination.pageSize,
      key,
      status,
      departmentId,
      fromDate,
      toDate
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        let new_data_list = res.data.list;
        // new_data_list.forEach((e) => {
        //   e.comment_items.child_comment.forEach((c) => {
        //     c.article_id = e.article_id;
        //   });
        // });
        setCommentList(new_data_list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  };
  const onChangeFromDate = (dates, dateStrings) => {
    setFromDate(dateStrings !== "" ? dateStrings + " 00:00:00" : "");
    setReload(!reload);
  };
  const onChangeToDate = (dates, dateStrings) => {
    setToDate(dateStrings !== "" ? dateStrings + " 00:00:00" : "");
    setReload(!reload);
  };
  useEffect(() => {
    getAPIListDepartment(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.department_id,
            label: e.department_name,
          });
        });
      }
      setOptionsDepartment(options);
    });
  }, []);
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;

    getAPIListAccountFeedback(
      offset,
      pagination.pageSize,
      key,
      status,
      departmentId,
      fromDate,
      toDate
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        let new_data_list = res.data.list;
        // new_data_list.forEach((e) => {
        //   e.comment_items.child_comment.forEach((c) => {
        //     c.article_id = e.article_id;
        //   });
        // });
        setCommentList(new_data_list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setCommentList(null);
      }
    });
  }, [reload]);

  const statusCommentArr = [
    {
      value: "0",
      label: "Chưa phản hồi",
    },
    {
      value: "1",
      label: "Đã phản hồi",
    },
    {
      value: "2",
      label: "Đã xóa",
    },
  ];

  const columns = useMemo(
    () => [
      {
        title: "STT",
        width: "5%",
        render: (record, _, idx) => (
          <>
            <div className="mb-3">
              {idx + 1}
              {/* <p>{record}</p> */}
            </div>
          </>
        ),
      },
      {
        title: "Tiêu đề",
        width: "20%",
        render: (record) => (
          <>
            <div className="mb-3">
              <p>{record.title}</p>
            </div>
          </>
        ),
      },
      {
        title: "Nội dung",
        width: "25%",
        render: (record) => (
          <>
            <div className="mb-3">
              <p>{record.content}</p>
            </div>
          </>
        ),
      },
      {
        title: "Người gửi",
        width: "20%",
        align: "left",
        render: (record) => (
          <div>
            <Link to="#" className="fw-medium link-primary">
              {record.user_name}
            </Link>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: "20%",
        align: "center",
        render: (record) => (
          <div>
            <div>
              {record.status === 0 && <span>Chưa phản hồi</span>}
              {record.status === 1 && <span>Đã phản hồi</span>}
              {record.status === 2 && <span>Đã xóa</span>}
            </div>
            {/* <h6>
              {record.comment_items.parrent_comment.status == 0
                ? "Chưa duyệt"
                : "Đã duyệt"}
            </h6>
            <div>
              {record.comment_items.parrent_comment.status == 1
                ? moment(
                    record.comment_items.parrent_comment.approve_date
                  ).format("DD/MM/YYYY HH:mm")
                : moment(
                    record.comment_items.parrent_comment.created_date
                  ).format("DD/MM/YYYY HH:mm")}
            </div> */}
          </div>
        ),
      },
      {
        title: "Thao tác",
        width: "15%",
        align: "right",
        render: (record) => {
          return (
            <>
              <GroupAction
                record={record}
                reload={reload}
                setReload={setReload}
              />
              {/* {record.status === 1 && (
                <Popconfirm
                  title={"Xác nhận gỡ"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
                  onConfirm={() => handleDelete(record.account_feedback_id)}
                >
                  <button type="button" className="btn btn-danger">
                    Gỡ xuống
                  </button>
                </Popconfirm>
              )} */}
              {/* {record.status === 0 && (
                <Popconfirm
                  title={"Xác nhận duyệt"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
                >
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: "#1693DA",
                      marginRight: 8,
                      color: "white",
                    }}
                  >
                    Duyệt
                  </button>
                </Popconfirm>
              )} */}
              {/* {record.status === 2 && (
                <Popconfirm
                  title={"Xác nhận từ chối"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
             
                >
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#7D7D7D", color: "white" }}
                  >
                    Từ chối
                  </button>
                </Popconfirm>
              )} */}
            </>
          );
        },
      },
    ],
    []
  );
  const sencondColumns = [
    {
      width: "30%",
      onCell: (record) => {
        return { style: { paddingRight: 8 } };
      },
      render: (record) => {
        return (
          <>
            <div className="mb-3" style={{ marginLeft: "12%" }}>
              <Input
                name="tag_name"
                id="tagname-field"
                className="form-control"
                placeholder="Họ và tên người bình luận"
                type="text"
                value={record.full_name}
                validate={{
                  required: { value: true },
                }}
                disabled={true}
              />
              <textarea
                name="tag_name"
                id="tagname-textarean"
                className="form-control mt-3"
                placeholder="Họ và tên người bình luận"
                disabled={true}
                defaultValue={record.content}
              />
            </div>
          </>
        );
      },
    },
    {
      width: "30%",
      align: "center",
      render: (record) => <div></div>,
    },
    {
      width: "20%",
      align: "center",
      render: (record) => (
        <div>
          <h6>{record.status == 0 ? "Chưa duyệt" : "Đã duyệt"}</h6>
          <div>
            {record.status == 1
              ? moment(record.approve_date).format("DD/MM/YYYY HH:mm")
              : moment(record.created_date).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      ),
    },
    {
      width: "15%",
      align: "right",
      render: (record) => {
        return (
          <>
            {record.status === 1 ? (
              <Popconfirm
                title={"Xác nhận duyệt"}
                icon={<></>}
                okText={"Đồng ý"}
                cancelText={"Hủy bỏ"}
                onConfirm={() =>
                  handleApprove(
                    record.article_id,
                    record.parent_id,
                    record.comment_id
                  )
                }
              >
                <button type="button" className="btn btn-danger">
                  Gỡ xuống
                </button>
              </Popconfirm>
            ) : (
              <div style={{ display: "flex" }}>
                <Popconfirm
                  title={"Xác nhận duyệt"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
                  onConfirm={() =>
                    handleApprove(
                      record.article_id,
                      record.parent_id,
                      record.comment_id
                    )
                  }
                >
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: "#1693DA",
                      marginRight: 8,
                      color: "white",
                    }}
                  >
                    Duyệt
                  </button>
                </Popconfirm>
                <Popconfirm
                  title={"Xác nhận từ chối"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
                  onConfirm={() =>
                    handleDelete(
                      record.article_id,
                      record.parent_id,
                      record.comment_id
                    )
                  }
                >
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#7D7D7D", color: "white" }}
                  >
                    Từ chối
                  </button>
                </Popconfirm>
              </div>
            )}
          </>
        );
      },
    },
  ];
  const firstExpandedRow = (record, index, indent, expanded) => {
    return (
      <></>
      // record &&
      // record.comment_items.child_comment.length > 0 && (
      //   <Table
      //     rowKey={(e) => e.comment_id}
      //     showHeader={false}
      //     rowClassName="custom-row"
      //     dataSource={record.comment_items.child_comment}
      //     // expandable={{ expandedRowRender: secondExpandedRow }}
      //     pagination={false}
      //     key={index}
      //     columns={sencondColumns}
      //   />
      // )
    );
  };

  const setSpeechToText = (e) => {
    setKey(e);
    setReload(!reload);
  };
  const ChangValue = (e) => {
    setKey(e.target.value);

    setTimeout(() => {
      setReload(!reload);
    }, 1000);
  };

  const setSpeechToNameArticle = (e) => {
    setKeyTitleArticle(e);
    setReload(!reload);
  };

  const changeValueNameArticle = (e) => {
    setKeyTitleArticle(e.target.value);
    setTimeout(() => {
      setReload(!reload);
    }, 1000);
  };
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Phản hồi độc giả" pageTitle="Phản hồi độc giả" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <Row>
                        <Col lg={4}>
                          <div className="position-relative">
                            <Input
                              style={{ height: 38 }}
                              type="text"
                              className="form-control"
                              placeholder="Tìm kiếm phản hồi"
                              id="search-options"
                              width={30}
                              value={key}
                              onChange={ChangValue}
                            />
                            <RecordAudio setSpeechToText={setSpeechToText} />
                          </div>
                        </Col>

                        <Col lg={4}>
                          <Select
                            // defaultValue={customerStatus[1]}
                            onChange={(e) => {
                              e ? setStatus(e) : setStatus("");
                              setReload(!reload);
                            }}
                            allowClear
                            style={{ width: "100%", height: 37 }}
                            placeholder="Trạng thái"
                            options={statusCommentArr}
                            name="choices-single-default"
                            id="idStatus"
                          ></Select>
                        </Col>

                        <Col lg={4}>
                          {/* <Select
                              defaultValue={customerStatus[1]}
                              onChange={(e) => {
                                  handlecustomerStatus(e.value);
                              }}
                              placeholder="Chuyên mục"
                              options={statusComment}
                              name="choices-single-default"
                              id="idStatus"
  <<<<<<< Updated upstream
                            ></Select> */}
                          <TreeSelect
                            style={{ width: "100%", height: 37 }}
                            value={valueCategory}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            showSearch
                            treeData={optionsDepartment}
                            treeDefaultExpandAll
                            placeholder="Phòng ban"
                            onChange={(e) => {
                              if (e) {
                                setDepartmentId(e);
                              } else {
                                setDepartmentId("");
                              }
                              setReload(!reload);
                            }}
                            filterTreeNode={(input, treeNode) =>
                              treeNode.title
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          />
                        </Col>
                        {/* <Col>
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Col>
                        <Col>
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            placeholder="Đến ngày"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Col> */}
                      </Row>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {commentList && commentList.length ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={commentList || []}
                        pagination={{
                          ...pagination,
                          onShowSizeChange: handlePageSizeChange,
                          pageSizeOptions: [10, 20, 50],
                          pageSize: pageSizes,
                          showTotal: (total, range) =>
                            `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
                          showSizeChanger: true,
                        }}
                        onChange={handleTableChange}
                        rowKey={(e) => e.id}
                        // expandable={{
                        //   expandedRowRender: firstExpandedRow,
                        // }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 500,
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <h3>Không có dữ lệu</h3>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Comment;

const GroupAction = ({ record, reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [dataFeedback, setDataFeedback] = useState({ title: "", content: "" });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  useEffect(() => {
    getAPIFeedbackById(record.account_feedback_id).then((res) => {
      if (res && res.status > 0 && res.data) {
        setDataFeedback((prev) => ({
          ...prev,
          title: res.data?.title,
          content: res.data?.content,
        }));
      } else if (res && res.status === -1) {
        setDataFeedback((prev) => ({
          ...prev,
          title: "",
          content: "",
        }));
      }
    });
  }, []);
  const handleOk = () => {
    setIsModalOpen(false);
    setIsReplyOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsReplyOpen(false);
  };
  const handleDelete = (response_reader_id) => {
    getAPIDeletetResponseReader(response_reader_id).then((res) => {
      if (res.status > 0) {
        ToastCustom("Thành công", "success");
        setReload(!reload);
      } else {
        ToastCustom("Thất bại, đã xảy ra lỗi!", "fail");
      }
    });
  };
  const handleSubmit = () => {
    isReplyOpen
      ? getAPIPostResponseReader(
          record.account_feedback_id,
          formData.title,
          formData.content
        ).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Phản hồi thành công", "success");
            handleOk();
            setReload(!reload);
          } else {
            ToastCustom("Phản hồi thất bại", "fail");
          }
        })
      : setIsReplyOpen(true);
  };
  return (
    <>
      <Modal
        okText={isReplyOpen ? "Gửi" : "Trả lời"}
        cancelText={"Quay lại"}
        centered={true}
        width={800}
        getContainer={() => document.getElementById("article-wrap")}
        title=""
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {!isReplyOpen && record.status !== 2 ? <OkBtn /> : <></>}
            {isReplyOpen && !dataFeedback.title && !dataFeedback.content && (
              <OkBtn />
            )}
            <CancelBtn />
          </>
        )}
      >
        {isReplyOpen ? (
          <div style={{ padding: "0", overFlow: "scroll" }}>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Người gửi
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    value={"Báo Điện Biên"}
                    disabled={true}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Người nhận
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={true}
                    value={record.user_name}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Email
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={true}
                    value={"toasoan@.vn"}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Tiêu đề
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={
                      dataFeedback.content && dataFeedback.content.length > 0
                    }
                    value={dataFeedback.title || formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Nội dung
                  </Label>
                  <TextArea
                    id="descInput"
                    placeholder="Nhập mô tả quy trình 3"
                    type="textarea"
                    rows="4"
                    disabled={
                      dataFeedback.content && dataFeedback.content.length > 0
                    }
                    // defaultValue={dataFeedback.content}
                    value={dataFeedback.content || formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     content: e.target.value,
                    //   }))
                    // }
                  />
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <div style={{ padding: "0", overFlow: "scroll" }}>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Tên tài khoản
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    value={record.full_name}
                    disabled={true}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Phòng ban
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={true}
                    value={record.department_name}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Email
                    {/* <RequiredIcon /> */}
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={true}
                    value={record.user_name}
                    // onBlur={validation.handleBlur}
                    // onChange={validation.handleChange}
                    // invalid={
                    //   validation.errors.username && validation.touched.username
                    //     ? true
                    //     : false
                    // }
                  />
                  {/* {validation.errors.username && validation.touched.username ? (
              <FormFeedback type="invalid">
                {validation.errors.username}
              </FormFeedback>
            ) : null} */}
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Tiêu đề
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="vtc.intecom"
                    id="username"
                    disabled={true}
                    value={record.title}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className="mb-3">
                  <Label for="usernameInput" className="form-label">
                    Nội dung
                  </Label>
                  <TextArea
                    id="descInput"
                    placeholder="Nhập mô tả quy trình 2"
                    type="textarea"
                    rows="4"
                    disabled={true}
                    value={record.content}
                    // onChange={(e) =>
                    //   setFormData((prev) => ({
                    //     ...prev,
                    //     content: e.target.value,
                    //   }))
                    // }
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      <ul className="list-inline hstack gap-2 mb-0">
        <li className="list-inline-item edit">
          <Tooltip placement="bottom" title="Sửa" arrow={false}>
            <div
              onClick={() => setIsModalOpen(true)}
              className="text-primary d-inline-block edit-item-btn"
            >
              <i className="ri-pencil-fill fs-16"></i>
            </div>
          </Tooltip>
        </li>
        {record.status !== 2 && (
          <li className="list-inline-item">
            <Tooltip placement="bottom" title="Xóa" arrow={false}>
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
                onClick={() => {
                  handleDelete(record.account_feedback_id);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </Tooltip>
          </li>
        )}
      </ul>
    </>
  );
};
