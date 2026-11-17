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
} from "../../../helpers/fakebackend_helper";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import DataTable from "react-data-table-component";
import { Popconfirm, Spin, TreeSelect, Table, Select } from "antd";
import moment from "moment";
import ToastCustom from "../../../Components/Common/Toast";
import el from "date-fns/locale/el";
import RecordAudio from "../RecordAudio/RecordAudio";

const Comment = () => {
  const [commentList, setCommentList] = useState();
  const [commentId, setCommentId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [valueCategory, setValueCategory] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [searchTitleArticle, setSearchTitleArticle] = useState("");
  const [pageSizes, setPageSize] = useState();
  const [category, setCategoty] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [audio, setAudio] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    getAPIListCategory(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_child_categories.map((x) => ({
              value: x.category_id,
              title: x.category_name,
            })),
          });
        });
        setOptionsCategory(options);
      }
    }, []);
  }, []);
  const onClickDelete = (tag_id) => {
    setCommentId(tag_id);
    setDeleteModal(true);
  };
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
  const handleDelete = (articleId, parentId, commentId) => {
    getAPIDeleteComment(articleId, parentId, commentId).then((res) => {
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
    getAPIListComment(
      offset,
      pagination.pageSize,
      search,
      searchTitleArticle,
      statusComment,
      category
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        let new_data_list = res.data.list;
        new_data_list.forEach((e) => {
          e.comment_items.child_comment.forEach((c) => {
            c.article_id = e.article_id;
          });
        });
        setCommentList(new_data_list);
        setPagination({ ...pagination, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  };
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListComment(
      offset,
      pagination.pageSize,
      search,
      searchTitleArticle,
      statusComment,
      category
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        let new_data_list = res.data.list;
        new_data_list.forEach((e) => {
          e.comment_items.child_comment.forEach((c) => {
            c.article_id = e.article_id;
          });
        });
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
      label: "Đã duyệt",
    },
    {
      value: "1",
      label: "Chưa duyệt",
    },
  ];

  const columns = useMemo(
    () => [
      {
        title: "Bình luận",
        width: "30%",
        render: (record) => (
          <>
            <div className="mb-3">
              <Input
                style={{ fontWeight: 700 }}
                name="tag_name"
                id="tagname-field"
                className="form-control"
                placeholder="Họ và tên người bình luận"
                type="text"
                value={record.comment_items.parrent_comment.full_name}
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
                defaultValue={record.comment_items.parrent_comment.content}
              />
            </div>
          </>
        ),
      },
      {
        title: "Bài viết",
        width: "30%",
        align: "left",
        render: (record) => (
          <div>
            <Link to="#" className="fw-medium link-primary">
              {record.article_title}
            </Link>
            <p>Chuyên mục: {record.category_name}</p>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: "20%",
        align: "center",
        render: (record) => (
          <div>
            <h6>
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
            </div>
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
              {record.comment_items.parrent_comment.status == 1 ? (
                <Popconfirm
                  title={"Xác nhận gỡ"}
                  icon={<></>}
                  okText={"Đồng ý"}
                  cancelText={"Hủy bỏ"}
                  onConfirm={() =>
                    handleDelete(
                      record.article_id,
                      "",
                      record.comment_items.parrent_comment.comment_id
                    )
                  }
                >
                  <button type="button" className="btn btn-danger">
                    Gỡ xuống
                  </button>
                </Popconfirm>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Popconfirm
                    title={"Xác nhận duyệt"}
                    icon={<></>}
                    okText={"Đồng ý"}
                    cancelText={"Hủy bỏ"}
                    onConfirm={() =>
                      handleApprove(
                        record.article_id,
                        "",
                        record.comment_items.parrent_comment.comment_id
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
                        "",
                        record.comment_items.parrent_comment.comment_id
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
            {record.status == 1 ? (
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
      record &&
      record.comment_items.child_comment.length > 0 && (
        <Table
          rowKey={(e) => e.comment_id}
          showHeader={false}
          rowClassName="custom-row"
          dataSource={record.comment_items.child_comment}
          // expandable={{ expandedRowRender: secondExpandedRow }}
          pagination={false}
          key={index}
          columns={sencondColumns}
        />
      )
    );
  };

  const setSpeechToText = (e) => {
    setSearch(e);
    setReload(!reload);
  };
  const ChangValue = (e) => {
    setSearch(e.target.value);

    setTimeout(() => {
      setReload(!reload);
    }, 1000);
  };

  const setSpeechToNameArticle = (e) => {
    setSearchTitleArticle(e);
    setReload(!reload);
  };

  const changeValueNameArticle = (e) => {
    setSearchTitleArticle(e.target.value);
    setTimeout(() => {
      setReload(!reload);
    }, 1000);
  };
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Bình luận" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <Row>
                        <Col lg={3}>
                          <div className="position-relative">
                            <Input
                              style={{ height: 38 }}
                              type="text"
                              className="form-control"
                              placeholder="Tìm kiếm bình luận"
                              id="search-options"
                              width={30}
                              value={search}
                              onChange={ChangValue}
                            />
                            <RecordAudio setSpeechToText={setSpeechToText} />
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="position-relative">
                            <Input
                              style={{ height: 38 }}
                              type="text"
                              className="form-control"
                              placeholder="Tìm kiếm bài viết"
                              id="search-options"
                              width={30}
                              value={searchTitleArticle}
                              onChange={changeValueNameArticle}
                            />
                            <RecordAudio
                              setSpeechToText2={setSpeechToNameArticle}
                            />
                          </div>
                        </Col>
                        <Col lg={2}>
                          <Select
                            // defaultValue={customerStatus[1]}
                            onChange={(e) => {
                              e ? setStatusComment(e) : setStatusComment("");
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

                        <Col lg={2}>
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
                            treeData={optionsCategory}
                            treeDefaultExpandAll
                            placeholder="Chuyên mục"
                            onChange={(e) => {
                              if (e) {
                                setCategoty(e);
                              } else {
                                setCategoty("");
                              }
                              setReload(!reload);
                            }}
                            filterTreeNode={(input, treeNode) =>
                              treeNode.title
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          />
                          {/* </Col> */}
                          {/*<Col lg={2}>*/}
                          {/*  <Select*/}
                          {/*    // defaultValue={customerStatus[1]}*/}
                          {/*{/    // onChange={(e) => {/}*/}
                          {/*    //     handlecustomerStatus(e.value);*/}
                          {/*{/    // }}/}*/}
                          {/*    placeholder="Bài viết"*/}
                          {/*    options={statusComment}*/}
                          {/*    name="choices-single-default"*/}
                          {/*    id="idStatus"*/}
                          {/*  ></Select>*/}
                        </Col>
                        {/* </Select> */}
                        {/* </Col> */}
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
                        rowKey={(e) =>
                          e.comment_items.parrent_comment.comment_id
                        }
                        expandable={{
                          expandedRowRender: firstExpandedRow,
                          rowExpandable: (record) =>
                            record.comment_items.child_comment.length > 0,
                          defaultExpandAllRows: true,
                        }}
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
