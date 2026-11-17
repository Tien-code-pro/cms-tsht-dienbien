import React, { useEffect, useMemo, useState } from "react";

import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { Table, Tooltip, TreeSelect } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spin } from "antd/lib";
import moment from "moment/moment";
import "moment-timezone";

import { useSelector } from "react-redux";
import {
  getAPIDeleteLiveArticle,
  getAPIDeleteLiveContentArticle,
  getAPIGetArticleLiveById,
  getAPIListLiveContentArticle,
} from "../../../../helpers/fakebackend_helper";
import ToastCustom from "../../../../Components/Common/Toast";
import {
  btnDelete,
  btnIsWaitApproved,
  btnNew,
  btnPending,
  btnPublished,
  pArticle,
  StatusBtn,
} from "../../Article/Article";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const btnStatusActive = {
  background: "#DCFCE7",
  color: "#0AB39C",
  width: "138px",
};
const btnStatusNotActive = {
  background: "#F5F5F4",
  color: "#57534E",
  width: "138px",
};
const btnStatusDown = {
  background: "#FFE4E6",
  color: "#F06548",
  width: "138px",
};
const ListContent = () => {
  document.title = "Danh sách diễn biến tường thuật | Toà Soạn Hội Tụ";
  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [pageSizes, setPageSize] = useState();
  const [total, setTotal] = useState(9999);
  const [valueStatus, setValueStatus] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleStatus, setArticleStatus] = useState("");
  const [articleStatusIsComplete, setArticleStatusIsComplete] = useState(false);
  const [articleCreatedBy, setArticleCreatedBy] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();
  let keyWord = "";
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
    articleId: id,
    article_status_id: "",
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) =>
      `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
  });
  const handleDelete = () => {
    if (articleId) {
      getAPIDeleteLiveContentArticle(articleId).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá diễn biến thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá diễn biến thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const onChangeStatus = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      article_status_id: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueStatus(newValue);
    setReload(!reload);
  };
  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPaginationFilter((pre) => {
      return {
        ...pre,
        pageSize: size,
        current: 1,
      };
    });
    setReload(!reload);
  };

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListLiveContentArticle(
      offset,
      paginationFilter.pageSize,
      paginationFilter.articleId,
      paginationFilter.article_status_id
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setArticleList(res.data.list);
        setTotal(res.data.total);
        setPaginationFilter({ ...paginationFilter, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setArticleList([]);
      }
      setIsLoading(false);
    });
  }, [reload]);

  useEffect(() => {
    getAPIGetArticleLiveById(id).then((res) => {
      if (res.data && res.status > 0) {
        const ar = res.data;
        setArticleTitle(ar.article_title);
        setArticleStatus(ar.status);
        setArticleCreatedBy(ar.user_create_article);
        if (ar.article_status_id === 11) {
          setArticleStatusIsComplete(true);
        }
      }
    });
  }, []);
  const handleTableChange = (pagination, filters) => {
    setIsLoading(true);
    setPaginationFilter((pre) => {
      return {
        ...pre,
        current:
          pagination.pageSize == paginationFilter.pageSize
            ? pagination.current
            : 1,
      };
    });
    setReload(!reload);
    setIsLoading(false);
  };
  const colums2 = useMemo(() => [
    {
      title: "STT",
      width: "5%",
      render: (text, object, index) => <> {index + 1}</>,
    },
    {
      title: "Tên diễn biến",
      width: "30%",
      render: (record) => (
        <div className="d-flex flex-column">
          <p style={{ marginBottom: 10, fontWeight: "bold" }}>
            {record.article_live_title}
          </p>
        </div>
      ),
    },
    {
      title: "Giờ diễn biến",
      width: "12%",
      render: (record) => (
        <div className="d-flex flex-column" style={{ position: "relative" }}>
          <p style={pArticle}>
            {moment
              .tz(record.start_time, "Asia/Ho_Chi_Minh")
              .format("DD/MM/yyyy HH:mm")}
          </p>
        </div>
      ),
    },
    {
      title: "Thời gian cập nhập",
      width: "12%",
      render: (record) => (
        <div className="d-flex flex-column" style={{ position: "relative" }}>
          <p style={pArticle}>
            {moment
              .tz(record.modified_date, "Asia/Ho_Chi_Minh")
              .format("DD/MM/yyyy HH:mm")}
          </p>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      width: "11%",
      render: (record) => (
        <div
          className="d-flex flex-column"
          // style={{ position: "absolute", top: 15 }}
          style={{ position: "relative" }}
        >
          <StatusBtn
            style={
              (record.article_live_status_id === 1 && btnNew) ||
              (record.article_live_status_id == 2 && btnPending) ||
              (record.article_live_status_id == 3 && btnIsWaitApproved) ||
              (record.article_live_status_id == 4 && btnPublished) ||
              (record.article_live_status_id == 5 && btnDelete)
            }
          >
            {record.article_live_status}
          </StatusBtn>
        </div>
      ),
    },
    {
      title: "Thao tác",
      width: "8%",
      render: (record) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit">
              <Tooltip placement="bottom" title="Sửa" arrow={false}>
                <Link
                  className="text-primary d-inline-block edit-item-btn"
                  to={`/article-live-content-update/${id}/${record.article_live_id}`}
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </Tooltip>
            </li>
            <li className="list-inline-item">
              <Tooltip placement="bottom" title="Xóa" arrow={false}>
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    onClickDelete(record.article_live_id);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </Tooltip>
            </li>
          </ul>
        );
      },
    },
  ]);
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDelete}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Danh sách diễn biến" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card style={{ padding: 15 }}>
                <Row>
                  <Col className="col-6">
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {articleTitle}
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: !articleStatusIsComplete ? "#0AB39C" : "red",
                        fontStyle: "italic",
                      }}
                    >
                      {articleStatus}
                    </p>
                  </Col>
                  <Col className="col-6">
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#5E5E5E",
                        marginBottom: 10,
                      }}
                    >
                      Người tạo bài:
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 200,
                        color: "#5E5E5E",
                        marginBottom: 0,
                      }}
                    >
                      {articleCreatedBy || "anonymous"}
                    </p>
                  </Col>
                </Row>
              </Card>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="gy-3">
                    <div className="col-lg">
                      <Row style={{ marginBottom: "5px" }}>
                        <Col className="col-3">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={valueStatus}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={[
                              {
                                value: 1,
                                label: "Bài nháp",
                              },
                              {
                                value: 2,
                                label: "Chờ duyệt",
                              },
                              {
                                value: 3,
                                label: "Chờ xuất bản",
                              },
                              {
                                value: 4,
                                label: "Đã xuất bản",
                              },
                              {
                                value: 5,
                                label: "Hạ xuất bản",
                              },
                              {
                                value: 6,
                                label: "Hủy",
                              },
                            ]}
                            treeDefaultExpandAll
                            placeholder="Trạng thái"
                            onChange={onChangeStatus}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      {!articleStatusIsComplete && (
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-primary add-btn"
                            id="create-btn"
                            onClick={() => {
                              setReload(!reload);
                            }}
                          >
                            <i className="ri-restart-line align-bottom me-1"></i>
                            Làm mới
                          </button>
                          <Link to={`/article-live-content-insert/${id}`}>
                            <button
                              type="button"
                              className="btn btn-success add-btn"
                              id="create-btn"
                            >
                              <i className="ri-add-line align-bottom me-1"></i>
                              Tạo diễn biến
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {!isLoading ? (
                      articleList && articleList.length ? (
                        <Table
                          className="overflow-auto"
                          columns={colums2}
                          dataSource={articleList || []}
                          pagination={{
                            ...paginationFilter,
                            onShowSizeChange: handlePageSizeChange,
                            pageSize: pageSizes,
                          }}
                          onChange={handleTableChange}
                          rowKey={"article_live_id"}
                          table-layout="fixed"
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
                          <h2>Không có dữ liệu</h2>
                        </div>
                      )
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
                        <Spin />
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
export default ListContent;
