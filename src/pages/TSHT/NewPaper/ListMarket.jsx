import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import React, { useEffect, useMemo, useState } from "react";
import {
  downloadDocumentArticle,
  getAPIDeleteArticle,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  getAPIListMarKet,
  getAPIListPaperNumber,
  getAPIListPaperType,
  getAPITreeListCategory,
  getAPITreeListCategoryByUser,
} from "../../../helpers/fakebackend_helper";
import { setStatePrevPage } from "../../../store/actions";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import ToastCustom from "../../../Components/Common/Toast";
import { toast } from "react-toastify";
import * as Antd from "antd";
import { DatePicker, Table, TreeSelect, Select, Tooltip, List } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import momentTZ from "moment-timezone";
import styled from "styled-components";
import { Spin } from "antd/lib";
import DeleteModal from "../../../Components/Common/DeleteModal";
import Style from "../../../assets/scss/components/_tooltip.module.scss";
import RecordAudio from "../RecordAudio/RecordAudio";
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
const TooltipStyle = styled.div`
  // .ant-tooltip {
  //   position: absolute;
  //   left:0;
  //   .ant-tooltip-arrow {
  //     //margin-left: 15px;
  //     // position: "absolute"
  //   }
  //   .ant-tooltip-content {
  //    // margin-left: 15px;
  //     // position: "absolute"
  //   }
  // }
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

const ListMarket = () => {
  document.title = "Danh sách bài viết | Toà Soạn Hội Tụ";
  const dispatch = useDispatch();
  const prevPage = useSelector((state) => state.PrevPage);
  const [optionsPaperNumber, setOptionsPaperNumber] = useState([]);
  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [total, setTotal] = useState(666);
  const [pageSizes, setPageSize] = useState();
  const [optionsPaperType, setOptionsPaperType] = useState([]);

  let keyWord = "";
  // const [paginationFilter, setPaginationFilter] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   _article_title: "",
  //   _author: "",
  //   _todate: "",
  //   _fromdate: "",
  //   lst_status: "",
  //   paper_number: "",
  //   paper_type: "",
  //   pageSizeOptions: ["10", "20", "50"],
  //   showTotal: (total, range) =>
  //     `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
  // });
  const [paginationFilter, setPaginationFilter] = useState(() => {
    return prevPage.namePrevPage === "list-maket"
      ? prevPage.dataPrevPage
      : {
          current: 1,
          pageSize: 10,
          _article_title: "",
          _category_id: "",
          _author: "",
          _todate: moment().format("YYYY-MM-DDTHH:mm:ss"),
          _fromdate: moment()
            .subtract(1, "year")
            .startOf("year")
            .format("YYYY-MM-DDTHH:mm:ss"),
          lst_status: "",
          _article_type_id: "",
          paper_number: "",
          paper_type: "",
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
        };
  });
  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
  };
  const [valueCategory, setValueCategory] = useState();
  const [valuePaperNumber, setValuePaperNumber] = useState();
  const [valueAuthor, setValueAuthor] = useState();
  const onChangePaperNumber = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setPaginationFilter({
      ...paginationFilter,
      paper_number: newValue === null ? "" : newValue,
      current: 1,
    });
    setValuePaperNumber(newValue);
    // setValueCategory(newValue);
    setReload(!reload);
  };
  const onChangePublications = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setPaginationFilter({
      ...paginationFilter,
      paper_type: newValue === null ? "" : newValue,
      current: 1,
    });
    setValueCategory(newValue);
    setReload(!reload);
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
  const handleDeleteOrder = () => {
    if (articleId) {
      getAPIDeleteArticle(articleId).then((r) => {
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
    //let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // getAPIListArticle(
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
    //     setTotal(res.data.total);

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
  useEffect(() => {
    if (prevPage && prevPage.dataPrevPage) {
      setValueAuthor(prevPage.dataPrevPage?._author || null);
      setValueCategory(prevPage.dataPrevPage?.paper_type || null);
      setValuePaperNumber(prevPage.dataPrevPage?.paper_number || null);
    }
  }, [prevPage]);
  useEffect(() => {
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
    getAPIListPaperNumber().then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.article_paper_number_id,
            label: e.paper_number,
          });
        });
      }
      setOptionsPaperNumber(options);
    });
    getAPIListPaperType().then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        var options = [];
        res.data.list.forEach((e) => {
          options.push({
            value: e.article_paper_type_id,
            label: e.paper_type_name,
          });
        });
      }
      setOptionsPaperType(options);
    });
  }, []);

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListMarKet(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._author,
      paginationFilter._todate,
      paginationFilter._fromdate,
      paginationFilter.lst_status,
      paginationFilter.paper_number,
      paginationFilter.paper_type
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
  const pArticle = {
    marginBottom: 10,
  };

  const btnNew = {
    background: "#FFD88C",
    color: "#F47113",
  };
  const btnPending = {
    background: "#8F49E7",
    color: "#FFFFFF",
  };
  const btnIsWaitApproved = {
    background: "#FFD88C",
    color: "#FFFFFF",
  };
  const btnPublished = {
    background: "#256AD0",
    color: "#FFFFFF",
  };
  const btnDelete = {
    background: "#FC957F",
    color: "#FFFFFF",
  };
  const columns = [
    {
      title: "Tên bài viết",
      width: "35%",
      render: (record) => (
        <div
          className="d-flex flex-column"
          onClick={() => {
            navigate(`/update-article/${record.article_id}`, {
              state: {
                type: record.article_type_id,
              },
            });
          }}
        >
          <p style={pArticle}>{record.article_title}</p>
          <SpanArticle style={{ marginBottom: 0 }}>
            {record.article_type_name}{" "}
            {record.created_date === null
              ? ""
              : `| ${momentTZ
                  .utc(record.created_date)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")}`}
            {(record.is_selected === 2 && (
              <span
                style={{
                  color: "rgba(26, 114, 246, 0.8)",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: 0,
                }}
              >
                {" | Tin tiêu điểm"}
              </span>
            )) ||
              (record.outstanding === 1 && (
                <span
                  style={{
                    color: "rgba(26, 114, 246, 0.8)",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: 0,
                  }}
                >
                  {" | Tin nổi bật"}
                </span>
              )) ||
              ""}
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Chuyên mục",
      width: "15%",
      render: (record) => (
        <div
          className="d-flex flex-column"
          //style={{ position: "absolute", top: 15 }}
          style={{ position: "relative" }}
        >
          <p style={pArticle}>{record.category_name}</p>
          <SpanArticle
            style={{
              color: "rgba(26, 114, 246, 0.8)",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            {/* {(record.is_selected === 2 && "Tin tiêu điểm") ||
                (record.outstanding === 1 && "Tin nổi bật") ||
                ""} */}
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Tác giả",
      width: "11%",
      render: (record) => (
        <div className="d-flex flex-column">
          <p style={pArticle}>{record.author_name}</p>
          {record.other_author_info.length > 0 ? (
            <SpanArticle style={{ minHeight: 18, marginBottom: 0 }}>
              <TooltipStyle>
                <Tooltip
                  //  style={{paddingLeft:"100px"}}
                  getPopupContainer={(triggerNode) => triggerNode}
                  placement="leftTop"
                  color={"white"}
                  title={
                    <List
                      className="list-author"
                      size="small"
                      // dataSource={record.other_author_info
                      //   .slice(1)
                      //   .slice(0, -1)
                      //   .split(",")}
                      dataSource={record.other_author_info}
                      renderItem={(item, index) => (
                        <List.Item className="">{item.author_name}</List.Item>
                      )}
                    />
                  }
                >
                  <div>
                    <span className={Style.author}>{"Đồng tác giả"}</span>
                  </div>
                </Tooltip>
                {document.getElementById("container")}
              </TooltipStyle>
            </SpanArticle>
          ) : (
            <></>
          )}
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
              (record.article_status_id == 1 && btnNew) ||
              (record.article_status_id == 2 && btnPending) ||
              (record.article_status_id == 3 && btnIsWaitApproved) ||
              (record.article_status_id == 4 && btnPublished) ||
              (record.article_status_id == 5 && btnDelete) ||
              (record.article_status_id == 6 && btnDelete) ||
              (record.article_status_id == 7 && btnDelete) ||
              (record.article_status_id > 7 && btnDelete)
            }
          >
            {record.status}
          </StatusBtn>
          <SpanArticle style={{ position: "relative", marginBottom: 0 }}>
            {record.modified_date === null
              ? ""
              : momentTZ
                  .utc(record.modified_date)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")}
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Sửa đổi gần nhất",
      width: "15%",
      render: (record) => (
        <div className="d-flex flex-column" style={{ position: "relative" }}>
          <p style={pArticle}>
            {record.edit_history.length != 0
              ? "Người thực hiện: " + record.edit_history[0].user_full_name
              : ""}
          </p>
          <p style={pArticle}>
            {record.edit_history.length != 0
              ? "Chức vụ: " + record.edit_history[0].user_group
              : ""}
          </p>
          <p style={pArticle}>
            {record.edit_history.length != 0
              ? "Thời gian: " +
                momentTZ
                  .utc(record.edit_history[0].created_date)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")
              : ""}
          </p>
          {/* <SpanArticle style={{ minHeight: 18, marginBottom: 0 }}>
              <TooltipStyle>
                <Tooltip
                  getPopupContainer={(triggerNode) => triggerNode}
                  placement="rightTop"
                  color={"white"}
                  title={
                    <List
                      className="list-author"
                      size="small"
                      dataSource={record.other_author
                        .slice(1)
                        .slice(0, -1)
                        .split(",")}
                      renderItem={(item, index) => (
                        <List.Item className="">{item}</List.Item>
                      )}
                    />
                  }
                >
                  <div>
                    <span className={Style.author}>
                      {record.other_author !== "[]" ? "Đồng tác giả" : ""}
                    </span>
                  </div>
                </Tooltip>
                {document.getElementById("container")}
              </TooltipStyle>
            </SpanArticle> */}
        </div>
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
                dispatch(
                  setStatePrevPage({
                    name: "list-maket",
                    data: paginationFilter,
                  })
                );
                navigate(`/update-article/${record.article_id}`, {
                  state: {
                    type: record.article_type_id,
                  },
                });
              }}
            >
              <Tooltip placement="bottom" title="Sửa" arrow={false}>
                <Link className="text-primary d-inline-block edit-item-btn">
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
                        const url = window.URL.createObjectURL(new Blob([res]));
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
  ];
  const SpeechToTitleArticle = (e) => {
    setPaginationFilter({
      ...paginationFilter,
      _article_title: e,
      current: 1,
    });
    setReload(!reload);
  };
  function findCategoryByValue(data, targetValue) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === targetValue) {
        return data[i]; // Return the category object if value matches
      }
      // Recursively search in the children if they exist
      if (data[i].children && data[i].children.length > 0) {
        const result = findCategoryByValue(data[i].children, targetValue);
        if (result) {
          return result; // Return the found category from the children
        }
      }
    }
    return null; // Return null if no category is found with the target value
  }
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Danh sách market số báo" pageTitle="Home" />
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
                              defaultValue={
                                paginationFilter._article_title || ""
                              }
                              value={paginationFilter._article_title}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setReload(!reload);
                                }
                              }}
                            ></Antd.Input>
                            <RecordAudio
                              setSpeechToText={SpeechToTitleArticle}
                            />
                          </div>
                        </Col>

                        <Col className="col-3">
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

                        <Col className="col-3">
                          <Select
                            options={statusListType}
                            mode="multiple"
                            allowClear
                            style={{
                              width: "100%",
                            }}
                            defaultValue={statusListType.filter((item) =>
                              paginationFilter.lst_status.includes(item.value)
                            )}
                            placeholder="Trạng thái"
                            onChange={(e) => {
                              setPaginationFilter({
                                ...paginationFilter,
                                offset: 0,
                                lst_status:
                                  e.length > 0 ? JSON.stringify(e) : "",
                              });
                              setReload(!reload);
                            }}
                          ></Select>
                        </Col>
                        <Col className="col-3">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={valuePaperNumber}
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsPaperNumber}
                            treeDefaultExpandAll
                            placeholder="Số báo"
                            onChange={onChangePaperNumber}
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        {/* <Col className="col-3">
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
                              setReload(!reload);
                            }}
                          ></Select>
                        </Col> */}
                        <Col className="col-3">
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            value={valueCategory}
                            // defaultValue={
                            //   findCategoryByValue(
                            //     optionsPaperType,
                            //     paginationFilter.paper_type
                            //   )?.value
                            // }
                            dropdownStyle={{
                              maxHeight: 400,
                              overflow: "auto",
                            }}
                            allowClear
                            treeData={optionsPaperType}
                            treeDefaultExpandAll
                            placeholder="Ấn phẩm"
                            onChange={onChangePublications}
                          />
                        </Col>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            defaultValue={dayjs(paginationFilter._fromdate)}
                            style={{ width: "100%" }}
                          />
                        </Col>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            placeholder="Đến ngày"
                            defaultValue={dayjs(paginationFilter._todate)}
                            style={{ width: "100%" }}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-maket`}>
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
                          columns={columns}
                          dataSource={articleList || []}
                          pagination={{
                            ...paginationFilter,
                            onShowSizeChange: handlePageSizeChange,
                            pageSize: pageSizes,
                          }}
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

export default ListMarket;
