import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import React, { useEffect, useMemo, useState } from "react";
import {
  downloadDocumentArticle,
  getAPIDeleteArticle,
  getAPIReportListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  getAPITreeListCategory,
  getAPITreeListCategoryByUser,
  getFileExcelArticleReport,
  getAPISortReportListArticle,
} from "../../../helpers/fakebackend_helper";
import "./Report.scss";
import ToastCustom from "../../../Components/Common/Toast";
import { toast } from "react-toastify";
import * as Antd from "antd";
import { DatePicker, Table, TreeSelect, Select, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import { Spin } from "antd/lib";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { DownOutlined, FileTextTwoTone, UpOutlined } from "@ant-design/icons";

const SpanArticle = styled.p`
  font-size: 12px;
  color: #6f727a;
`;
const StatusBtn = styled.p`
  border: 1px solid #ffffff;
  border-radius: 20px;
  width: 83px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 5px;
`;

const statusListType = [
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
];

const articleListType = [
  {
    value: 1,
    label: "Bài thường",
  },
  {
    value: 2,
    label: "E-magazine",
  },
  {
    value: 3,
    label: "Bài video",
  },
  {
    value: 4,
    label: "Bài audio",
  },
  {
    value: 5,
    label: "Báo in",
  },
];
const sizePageArr = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "50",
    label: "50",
  },
];

const ReportArticle = () => {
  document.title = "Danh sách bài viết | Toà Soạn Hội Tụ";

  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const navigate = useNavigate();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [pageSizes, setPageSize] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [reloadSort, setReloadSort] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  let keyWord = "";
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
    _article_title: "",
    _category_id: "",
    _author: "",
    _todate: "",
    _fromdate: "",
    lst_status: "",
    _article_type_id: "",
    // pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => (
      <span
        style={{ fontSize: "14px", fontFamily: "var(--vz-body-font-family)" }}
      >
        Hiển thị{" "}
        <span
          style={{ fontFamily: "var(--vz-body-font-family)", fontWeight: 500 }}
        >
          {range[0]}{" "}
        </span>{" "}
        -{" "}
        <span
          style={{ fontFamily: "var(--vz-body-font-family)", fontWeight: 500 }}
        >
          {range[1]}{" "}
        </span>{" "}
        trên{" "}
        <span
          style={{ fontFamily: "var(--vz-body-font-family)", fontWeight: 500 }}
        >
          {total}{" "}
        </span>
        bài viết
      </span>
    ),
  });

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPaginationFilter({
      ...paginationFilter,
      pageSize: size,
    });
    setReload(!reload);
  };
  const [valueCategory, setValueCategory] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const onChangeCategory = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      _category_id: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueCategory(newValue);
  };
  const onChangeAuthor = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }
    setPaginationFilter({
      ...paginationFilter,
      _author: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueAuthor(newValue);
  };
  const onChangeFromDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _fromdate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
  };
  const onChangeToDate = (dates, dateStrings) => {
    setPaginationFilter({
      ...paginationFilter,
      _todate: dateStrings !== "" ? dateStrings + " 00:00:00" : "",
      current: 1,
    });
  };

  const handleTableChange = (_pagination, filters) => {
    setIsLoading(true);
    setPaginationFilter((pre) => {
      return {
        ...pre,
        current:
          _pagination.pageSize == paginationFilter.pageSize
            ? _pagination.current
            : 1,
      };
    });
    setReload(!reload);
    // let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // getAPIReportListArticle(
    //   offset,
    //   paginationFilter.pageSize,
    //   paginationFilter._article_title,
    //   paginationFilter._category_id,
    //   paginationFilter._author,
    //   paginationFilter._todate,
    //   paginationFilter._fromdate,
    //   paginationFilter.lst_status,
    //   paginationFilter._article_type_id
    // ).then((res) => {
    //   if (res.data && res.data.list && res.status > 0) {
    //     setArticleList(res.data.list);
    //     setPaginationFilter({
    //       ...paginationFilter,
    //       current: pagination.current,
    //       total: res.data.total,
    //     });
    //   } else {
    //     toast.error("Không tìm thấy dữ liệu!", {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   }
    //   setIsLoading(false);
    // });
    setIsLoading(false);
  };
  const ExportExelFn = () => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    getFileExcelArticleReport(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._category_id,
      paginationFilter._author,
      paginationFilter._todate,
      paginationFilter._fromdate,
      paginationFilter.lst_status,
      paginationFilter._article_type_id
    ).then((res) => {
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Thống Kê Nhuận Bút.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
      }
    });
  };
  useEffect(() => {
    getAPITreeListCategoryByUser(0, -1).then((res) => {
      var options = [];
      if (res.data && res.data.list && res.status > 0) {
        res.data.list.forEach((e) => {
          options.push({
            value: e.category_id,
            title: e.category_name,
            children: e.list_categories_lv2.map((x) => ({
              value: x.category_id,
              title: x.category_name,
              children: x.list_categories_lv3.map((y) => ({
                value: y.category_id,
                title: y.category_name,
              })),
            })),
          });
        });
      }
      setOptionsCategory(options);
    });

    getAPIListAuthor().then((res) => {
      if (res.data && res.status > 0) {
        var options = [];
        options.push({
          value: "",
          title: "Tất cả",
        });
        res.data.forEach((e) => {
          options.push({
            value: e.user_id,
            label: e.author_name,
          });
        });
      }
      setOptionsAuthor(options);
    });
  }, []);

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    if (!sortColumn || !sortOrder) {
      getAPIReportListArticle(
        offset,
        paginationFilter.pageSize,
        paginationFilter._article_title,
        paginationFilter._category_id,
        paginationFilter._author,
        paginationFilter._todate,
        paginationFilter._fromdate,
        paginationFilter.lst_status,
        paginationFilter._article_type_id
      ).then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          setArticleList(res.data.list);
          setPaginationFilter({
            ...paginationFilter,
            total: res.data.total,
          });
        } else {
          ToastCustom("Không tìm thấy dữ liệu!", "fail");
          setArticleList([]);
        }
        setIsLoading(false);
      });
    } else {
      getAPISortReportListArticle(
        offset,
        paginationFilter.pageSize,
        paginationFilter._article_title,
        paginationFilter._category_id,
        paginationFilter._author,
        paginationFilter._todate,
        paginationFilter._fromdate,
        paginationFilter.lst_status,
        paginationFilter._article_type_id,
        sortColumn,
        sortOrder
      ).then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          setArticleList(res.data.list);
          setPaginationFilter({
            ...paginationFilter,
            total: res.data.total,
          });
        } else {
          ToastCustom("Không tìm thấy dữ liệu!", "fail");
          setArticleList([]);
        }
        setIsLoading(false);
      });
    }
  }, [reload, sortColumn, sortOrder]);
  const pArticle = {
    marginBottom: 5,
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
  };

  const btnNew = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#FFD88C",
    color: "#F47113",
  };
  const btnPending = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#FFF9E1",
    color: "#F7B84B",
  };
  const btnDraft = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#F5F5F4",
    color: "#57534E",
  };
  const btnWaitingPublication = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#FCE7F3",
    color: "#EC4899",
  };
  const btnPublished = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#DCFCE7",
    color: "#0AB39C",
  };
  const btnQuitPublishing = {
    fontFamily: "var(--vz-body-font-family)",
    fontWeight: 500,
    background: "#F3E8FF",
    color: "#9333EA",
  };
  const columns = useMemo(
    () => [
      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>STT</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip title={"Lấy từ dưới lên"}>
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("modified_date");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Mặc định"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("modified_date");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        dataIndex: "id",
        key: "id",
        width: "5%",
        render: (item, record, index) => (
          <span
            style={{
              fontWeight: 500,
              fontFamily: "var(--vz-body-font-family",
            }}
          >
            {index + 1}
          </span>
        ),
      },
      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tên bài viết</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip
                placement="top"
                className="sort-hover"
                title={"Tên bài viết từ a - z"}
              >
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("article_title");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Tên bài viết từ z - a"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("article_title");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        width: "43%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            style={{
              fontFamily: "var(--vz-body-font-family)",
              fontWeight: 500,
            }}
          >
            <p style={{ marginBottom: 5, color: "#3577F1" }}>
              {record.article_title}
            </p>
            <SpanArticle style={{ marginBottom: 0 }}>
              {record.article_type}
              {" | "}
              <span style={{ color: "black" }}>{record.category_name}</span>
            </SpanArticle>
          </div>
        ),
      },

      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tác giả</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip
                placement="top"
                className="sort-hover"
                title={"Tên tác giả từ a - z"}
              >
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("author_name");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Tên tác giả từ z - a"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("author_name");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        width: "16%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            style={{
              fontFamily: "var(--vz-body-font-family)",
              fontWeight: 500,
              position: "absolute",
              top: 15,
            }}
          >
            <p style={pArticle}>{record.author_name}</p>
            <SpanArticle style={{ minHeight: 18, marginBottom: 0 }}>
              {record.other_author?.trim().length >= 1 ? "Nhóm tác giả" : ""}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Trạng thái</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip
                placement="top"
                className="sort-hover"
                title={"Sắp xếp theo trạng thái"}
              >
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("status");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Sắp xếp theo trạng thái"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("status");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        width: "15%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            style={{
              position: "absolute",
              top: 15,
            }}
          >
            <StatusBtn
              style={
                (record.article_status == "Đã xuất bản" && btnPublished) ||
                (record.article_status == "Chờ duyệt" && btnPending) ||
                (record.article_status == "Bài nháp" && btnDraft) ||
                (record.article_status == "Chờ xuất bản" &&
                  btnWaitingPublication) ||
                (record.article_status == "Hạ xuất bản" &&
                  btnQuitPublishing) || { cursor: "pointer" }
              }
            >
              {record.article_status}
            </StatusBtn>
            <SpanArticle style={{ marginBottom: 0, fontStyle: "italic" }}>
              {record.publish_date === null
                ? ""
                : moment(new Date(record.publish_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
            </SpanArticle>
          </div>
        ),
      },
      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Lượt xem</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip
                placement="top"
                className="sort-hover"
                title={"Lượt xem từ thấp đến cao"}
              >
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("view_count");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Lượt xem từ cao đến thấp"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("view_count");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        width: "10%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            style={{ position: "absolute", top: 15 }}
          >
            <p style={pArticle}>{record.view_count}</p>
          </div>
        ),
      },
      {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Lượt bình luận</span>{" "}
            <div style={{ width: "10px", display: "flex", flexWrap: "wrap" }}>
              <Tooltip
                placement="top"
                className="sort-hover"
                title={"Số bình luận từ thấp đến cao"}
              >
                <UpOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("comment_count");
                    setSortOrder("asc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
              <Tooltip
                placement="bottom"
                className="sort-hover"
                title={"Số bình luận từ cao đến thấp"}
              >
                <DownOutlined
                  style={{ fontSize: "9px" }}
                  onClick={() => {
                    setSortColumn("comment_count");
                    setSortOrder("desc");
                    setReload(!reload);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
        width: "10%",
        render: (record) => (
          <div
            className="d-flex flex-column"
            style={{ position: "absolute", top: 15 }}
          >
            <p style={pArticle}>{record.comment_count}</p>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="report-article">
      <div className="page-content">
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <div className="title-report-article">
                  <p className="title title-custom">
                    Thống kê chi tiết bài viết
                  </p>{" "}
                  <div className="dash dash-custom"></div>
                </div>
                <Row className="gy-3">
                  <div className="col-lg">
                    <Row style={{ marginBottom: "5px" }}>
                      <Col className="col-4">
                        <Label>Chuyên mục</Label>
                        <TreeSelect
                          style={{
                            width: "100%",
                          }}
                          value={valueCategory}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          treeData={optionsCategory}
                          treeDefaultExpandAll
                          placeholder="Chuyên mục"
                          onChange={onChangeCategory}
                        />
                      </Col>
                      <Col className="col-4">
                        <Label>Tác giả</Label>
                        <Select
                          style={{
                            width: "100%",
                          }}
                          showSearch
                          value={valueAuthor}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                          }}
                          allowClear
                          options={optionsAuthor}
                          optionFilterProp="label"
                          placeholder="Tác giả"
                          onChange={onChangeAuthor}
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
                          }
                        />
                      </Col>

                      <Col className="col-4">
                        <Label>Trạng thái</Label>
                        <Select
                          options={statusListType}
                          mode="multiple"
                          allowClear
                          style={{
                            width: "100%",
                          }}
                          placeholder="Trạng thái"
                          onChange={(e) => {
                            setPaginationFilter({
                              ...paginationFilter,
                              offset: 0,
                              lst_status: e.length > 0 ? JSON.stringify(e) : "",
                            });
                            // setReload(!reload);
                          }}
                        ></Select>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                      <Col className="col-4">
                        <Label>Loại bài</Label>
                        <Select
                          options={articleListType}
                          allowClear
                          style={{
                            width: "100%",
                          }}
                          placeholder="Loại bài"
                          onChange={(e) => {
                            setPaginationFilter({
                              ...paginationFilter,
                              offset: 0,
                              _article_type_id: e ? e : "",
                            });
                            // setReload(!reload);
                          }}
                        ></Select>
                      </Col>
                      <Col className="col-4">
                        <Label>Từ ngày</Label>
                        <DatePicker
                          allowClear
                          onChange={onChangeFromDate}
                          placeholder="Từ ngày"
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col className="col-4">
                        <Label>Đến ngày</Label>
                        <DatePicker
                          allowClear
                          onChange={onChangeToDate}
                          placeholder="Đến ngày"
                          style={{ width: "100%" }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Row>
                <div style={{ width: "200px", margin: "20px auto" }}>
                  <button
                    type="button"
                    className="btn btn-success add-btn"
                    id="create-btn"
                    style={{ padding: "7px 25px", fontSize: "14px" }}
                    onClick={() => {
                      setReload(!reload);
                    }}
                  >
                    Áp dụng bộ lọc
                  </button>
                </div>
                <div
                  className="display-line"
                  style={{ margin: "20px 0 7px 0" }}
                >
                  <span>Hiển thị</span>
                  <TreeSelect
                    mode="multiple"
                    defaultValue={10}
                    treeData={sizePageArr}
                    style={{ width: "80px", margin: "0 15px" }}
                    onChange={(size) => {
                      if (!size) {
                        setPageSize(10);
                        setPaginationFilter({
                          ...paginationFilter,
                          pageSize: 10,
                        });
                        setReload(!reload);
                      } else {
                        setPageSize(size);
                        setPaginationFilter({
                          ...paginationFilter,
                          pageSize: size,
                        });
                        setReload(!reload);
                      }
                    }}
                  />
                  <span>dòng</span>
                </div>
                <div className="export-exel">
                  <div
                    className="button-export-exel"
                    onClick={() => {
                      ExportExelFn();
                    }}
                  >
                    <FileTextTwoTone style={{ marginRight: "7px" }} />
                    Xuất File Excel
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div>
                  {!isLoading ? (
                    articleList && articleList.length ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={articleList || []}
                        pagination={{
                          ...paginationFilter,
                          showSizeChanger: false,
                          onShowSizeChange: handlePageSizeChange,
                          pageSize: pageSizes,
                        }}
                        onChange={handleTableChange}
                        rowKey={"article_id"}
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
      </div>
    </div>
  );
};

export default ReportArticle;
