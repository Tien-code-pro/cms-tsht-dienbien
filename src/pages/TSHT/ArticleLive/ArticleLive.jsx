import React, { useEffect, useMemo, useState } from "react";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import * as Antd from "antd";
import RecordAudio from "../RecordAudio/RecordAudio";
import { DatePicker, List, Select, Table, Tooltip, TreeSelect } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Spin } from "antd/lib";
import moment from "moment/moment";
import "moment-timezone";
import Style from "../../../assets/scss/components/_tooltip.module.scss";
import {
  downloadDocumentArticle,
  getAPIDeleteArticle,
  getAPIDeleteLiveArticle,
  getAPIListArticle,
  getAPIListLiveArticle,
  updateDisplayAds,
  updateDisplayArticleLive,
} from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import {
  pArticle,
  SpanArticle,
  StatusBtn,
  TooltipStyle,
} from "../Article/Article";
import { useSelector } from "react-redux";
import Profile from "../../../store/auth/profile/reducer";

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
const ArticleLive = () => {
  document.title = "Danh sách tường thuật | Toà Soạn Hội Tụ";
  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [pageSizes, setPageSize] = useState();
  const [total, setTotal] = useState(9999);
  const [valueStatus, setValueStatus] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const accountPermission = useSelector(
    (state) => state.Profile.accountPermission
  );
  const [accountPermissionBool, setAccountPermissionBool] = useState(false);

  useEffect(() => {
    if (accountPermission.length > 0) {
      for (let i = 0; i < accountPermission.length; i++) {
        if (
          accountPermission[i].function_name === "Quản lý tường thuật" ||
          accountPermission[i].function_id === 98
        ) {
          for (
            let j = 0;
            j < accountPermission[i].child_functions.length;
            j++
          ) {
            const res = accountPermission[i].child_functions[j];
            if (
              res.function_name === "Sửa bài tường thuật" ||
              res.function_id === 109
            ) {
              setAccountPermissionBool(true);
            }
          }
        }
      }
    }
  }, [accountPermission]);

  const navigate = useNavigate();
  let keyWord = "";
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
    _article_title: "",
    _todate: "",
    _fromdate: "",
    _article_status_id: "",
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) =>
      `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
  });
  const handleDelete = () => {
    if (articleId) {
      getAPIDeleteLiveArticle(articleId).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá bài viết thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá bài viết thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
  };
  const onChangeStatus = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      _article_status_id: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueStatus(newValue);
    setReload(!reload);
  };
  const onChangeFromDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _fromdate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
    setReload(!reload);
  };
  const onChangeToDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _todate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
    setReload(!reload);
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
  const changeDisplay = (id, e) => {
    e
      ? updateDisplayArticleLive(id, 1).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Nhận diễn biến thành công", "success");
            setReload((pre) => !pre);
          } else {
            ToastCustom("Nhận diễn biến cáo thất bại", "fail");
          }
        })
      : updateDisplayArticleLive(id, 2).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Đã tắt nhận diễn biến", "success");
            setReload((pre) => !pre);
          } else {
            ToastCustom("Tắt nhận diễn biến thất bại", "fail");
          }
        });
  };
  const changeDisplay2 = (id, e) => {
    e
      ? updateDisplayArticleLive(id, 3).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Hoàn tất tường thuật thành công", "success");
            setReload((pre) => !pre);
          } else {
            ToastCustom("Nhận Hoàn tất tường thuật cáo thất bại", "fail");
          }
        })
      : updateDisplayArticleLive(id, 1).then((res) => {
          if (res && res.status > 0) {
            ToastCustom("Đã tắt hoàn tất tường thuật", "success");
            setReload((pre) => !pre);
          } else {
            ToastCustom("Tắt hoàn tất tường thuật thất bại", "fail");
          }
        });
  };
  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListLiveArticle(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._todate,
      paginationFilter._fromdate,
      paginationFilter._article_status_id
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
      title: "Tên bài viết",
      width: "35%",
      render: (record) => (
        <div className="d-flex flex-column">
          <p style={{ marginBottom: 10, fontWeight: "bold" }}>
            {record.article_title}
          </p>
          <SpanArticle style={{ marginBottom: 0 }}>
            <span
              style={{
                color: "rgb(111, 114, 122)",
                fontSize: "12px",
                marginBottom: 0,
              }}
            >
              {record.category_name}
            </span>
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Bắt đầu",
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
      title: "Kết thúc",
      width: "12%",
      render: (record) => (
        <div className="d-flex flex-column" style={{ position: "relative" }}>
          <p style={pArticle}>
            {moment
              .tz(record.end_time, "Asia/Ho_Chi_Minh")
              .format("DD/MM/YYYY HH:mm")}
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
              // id 9: đang nhận diễn biến
              (record.article_status_id == 10 && btnStatusActive) ||
              // id 9: chưa nhận diễn biến
              (record.article_status_id == 9 && btnStatusNotActive) ||
              // id 11: đã kết thúc
              (record.article_status_id == 11 && btnStatusDown)
              // (record.article_status_id == 4 && btnPublished) ||
              // (record.article_status_id == 5 && btnDelete)
            }
          >
            {record.status}
          </StatusBtn>
          <SpanArticle style={{ position: "relative", marginBottom: 0 }}>
            {record.modified_date === null
              ? ""
              : moment(new Date(record.modified_date)).format(
                  "DD/MM/YYYY HH:mm:ss"
                )}
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Diễn biến",
      dataIndex: "is_display",
      width: "8%",
      render: (_, record) => (
        <div className="d-flex flex-column">
          <Link
            to={`/list-article-live-content/${record.article_id}`}
            style={{
              color: `${
                record.article_status_id === 9 ? "#333333" : "#3668C9"
              }`,
              marginBottom: 0,
            }}
          >
            Chi tiết
          </Link>
        </div>
      ),
    },
  ]);
  const columns = useMemo(
    () => [
      {
        title: "Tên bài viết",
        width: "35%",
        render: (record) => (
          <div className="d-flex flex-column">
            <p style={{ marginBottom: 10, fontWeight: "bold" }}>
              {record.article_title}
            </p>
            <SpanArticle style={{ marginBottom: 0 }}>
              <span
                style={{
                  color: "rgb(111, 114, 122)",
                  fontSize: "12px",
                  marginBottom: 0,
                }}
              >
                {record.category_name}
              </span>
            </SpanArticle>
          </div>
        ),
      },
      {
        title: "Bắt đầu",
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
        title: "Kết thúc",
        width: "12%",
        render: (record) => (
          <div className="d-flex flex-column" style={{ position: "relative" }}>
            <p style={pArticle}>
              {moment
                .tz(record.end_time, "Asia/Ho_Chi_Minh")
                .format("DD/MM/YYYY HH:mm")}
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
                // id 9: đang nhận diễn biến
                (record.article_status_id == 10 && btnStatusActive) ||
                // id 9: chưa nhận diễn biến
                (record.article_status_id == 9 && btnStatusNotActive) ||
                // id 11: đã kết thúc
                (record.article_status_id == 11 && btnStatusDown)
                // (record.article_status_id == 4 && btnPublished) ||
                // (record.article_status_id == 5 && btnDelete)
              }
            >
              {record.status}
            </StatusBtn>
            <SpanArticle style={{ position: "relative", marginBottom: 0 }}>
              {record.modified_date === null
                ? ""
                : moment(new Date(record.modified_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: "Nhận diễn biến",
        dataIndex: "is_display",
        width: "12%",
        render: (_, record) => (
          <Antd.Switch
            defaultChecked={record.article_status_id === 10}
            onChange={(e) => {
              changeDisplay(record.article_id, e);
            }}
          />
        ),
      },
      {
        title: "Diễn biến",
        dataIndex: "is_display",
        width: "8%",
        render: (_, record) => (
          <div className="d-flex flex-column">
            <Link
              to={`/list-article-live-content/${record.article_id}`}
              style={{
                color: `${
                  record.article_status_id === 9 ? "#333333" : "#3668C9"
                }`,
                marginBottom: 0,
              }}
            >
              Chi tiết
            </Link>
          </div>
        ),
      },
      {
        title: "Hoàn tất tường thuật",
        dataIndex: "is_done",
        width: "20%",
        render: (_, record) => (
          <Antd.Switch
            defaultChecked={record.article_status_id === 11}
            onChange={(e) => {
              changeDisplay2(record.article_id, e);
            }}
          />
        ),
      },
      {
        title: "Thao tác",
        width: "8%",
        render: (record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li
                className="list-inline-item edit"
                onClick={() => {
                  navigate(`/update-article-live/${record.article_id}`, {
                    state: {
                      type: record.article_id,
                    },
                  });
                }}
              >
                <Tooltip placement="bottom" title="Sửa" arrow={false}>
                  <Link
                    className="text-primary d-inline-block edit-item-btn"
                    to={`/update-article-live/${record.article_id}`}
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
                      onClickDelete(record.article_id);
                    }}
                  >
                    <i className="ri-delete-bin-5-fill fs-16"></i>
                  </Link>
                </Tooltip>
              </li>
              <Tooltip placement="bottom" title="Tải xuống" arrow={false}>
                {record.article_type_id === 1 && (
                  <li className="list-inline-item">
                    <i
                      className="ri-download-line"
                      onClick={() => {
                        downloadDocumentArticle({
                          article_id: record.article_id,
                        }).then((res) => {
                          const url = window.URL.createObjectURL(
                            new Blob([res])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            `${record.article_title}.doc`
                          );
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }}
                    ></i>
                  </li>
                )}
              </Tooltip>
            </ul>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDelete}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Bài viết" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="gy-3">
                    <div className="col-lg">
                      <Row style={{ marginBottom: "5px" }}>
                        <Col className="col-3">
                          <div className="position-relative">
                            <Antd.Input
                              placeholder="Tìm kiếm"
                              onChange={(e) => {
                                keyWord = e.target.value.toString();
                                setPaginationFilter({
                                  ...paginationFilter,
                                  _article_title: keyWord,
                                  current: 1,
                                });
                              }}
                              value={paginationFilter._article_title}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setReload(!reload);
                                }
                              }}
                            ></Antd.Input>
                          </div>
                        </Col>
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
                                value: 9,
                                label: "Chưa nhận diễn biến",
                              },
                              {
                                value: 10,
                                label: "Đang nhận diễn biến",
                              },
                              {
                                value: 11,
                                label: "Đã kết thúc",
                              },
                            ]}
                            treeDefaultExpandAll
                            placeholder="Trạng thái"
                            onChange={onChangeStatus}
                          />
                        </Col>
                        <Col className="col-2">
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            style={{ width: "100%" }}
                          />
                        </Col>
                        <Col className="col-2">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            placeholder="Đến ngày"
                            style={{ width: "100%" }}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-article-live`}>
                          <button
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Thêm mới
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {!isLoading ? (
                      articleList && articleList.length ? (
                        <Table
                          className="overflow-auto"
                          columns={accountPermissionBool ? columns : colums2}
                          dataSource={articleList || []}
                          pagination={{
                            ...paginationFilter,
                            onShowSizeChange: handlePageSizeChange,
                            pageSize: pageSizes,
                          }}
                          scroll={{ x: 1400 }}
                          onChange={handleTableChange}
                          rowKey={"article_id"}
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
export default ArticleLive;
