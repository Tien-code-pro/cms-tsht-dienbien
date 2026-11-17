import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  downloadDocumentArticle,
  downloadDocumentPrintArticle,
  getAPIDeleteArticle,
  getAPIDeleteArticlePrint,
  getAPIListArticlePrintByTypePage,
  getAPIListArticlePrintDraft,
  getAPIListArticlePrintPending,
  getAPIListArticlePrintPublish,
  getAPIListAuthor,
  getAPIListCategory,
  getAPIListPaperNumber,
  getAPITreeListCategory,
  getAPITreeListCategoryByUser,
} from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import { setStatePrevPage } from "../../../store/actions";
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
import { useSelector, useDispatch } from "react-redux";
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
    value: 7,
    label: "Trả lại",
  },
  {
    value: 2,
    label: "Chờ duyệt",
  },
  {
    value: 13,
    label: "Hạ duyệt",
  },
  {
    value: 12,
    label: "Đã duyệt",
  },
];

const articleListType = [
  {
    value: 1,
    label: "Bài thường",
  },
];
const pArticle = {
  marginBottom: 10,
};
const pArticleNumber = {
  marginBottom: 10,
  color: "rgba(51, 51, 51, 0.9)",
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

const ListPaperNormal = (props) => {
  const { typePage } = props;
  const dispatch = useDispatch();
  document.title = "Danh sách bài viết | Toà Soạn Hội Tụ";
  const prevPage = useSelector((state) => state.PrevPage);
  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const navigate = useNavigate();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [total, setTotal] = useState(666);
  const [pageSizes, setPageSize] = useState();
  let keyWord = "";

  const [paginationFilter, setPaginationFilter] = useState(() => {
    return prevPage.namePrevPage ===
      (typePage === "all"
        ? "list-newspaper"
        : typePage === "draft"
        ? "list-draft-newspaper"
        : typePage === "pending"
        ? "list-pending-newspaper"
        : typePage === "publish"
        ? "list-publish-newspaper"
        : "")
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
          // _todate: "",
          // _fromdate: "",
          lst_status: "",
          _article_type_id: 1,
          _article_paper_number_id: "",
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
        };
  });
  // const [paginationFilter, setPaginationFilter] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   _article_title: "",
  //   _category_id: "",
  //   _author: "",
  //   _todate: "",
  //   _fromdate: "",
  //   lst_status: "",
  //   _article_type_id: 1,
  //   _article_paper_number_id: "",
  //   pageSizeOptions: ["10", "20", "50"],
  //   showTotal: (total, range) =>
  //     `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
  // });
  const statusListType = (typePage === "all" && [
    {
      value: 1,
      label: "Bài nháp",
    },
    {
      value: 7,
      label: "Trả lại",
    },
    {
      value: 2,
      label: "Chờ duyệt",
    },
    {
      value: 13,
      label: "Hạ duyệt",
    },
    {
      value: 12,
      label: "Đã duyệt",
    },
  ]) ||
    (typePage === "draft" && [
      {
        value: 1,
        label: "Bài nháp",
      },
      {
        value: 7,
        label: "Trả lại",
      },
    ]) ||
    (typePage === "pending" && [
      {
        value: 2,
        label: "Chờ duyệt",
      },
    ]) ||
    (typePage === "publish" && [
      {
        value: 13,
        label: "Hạ duyệt",
      },
      {
        value: 12,
        label: "Đã duyệt",
      },
    ]) || [{}];
  const [optionsPaperNumber, setOptionsPaperNumber] = useState([]);
  const onClickDelete = (article_print_id) => {
    setArticleId(article_print_id);
    setDeleteModal(true);
  };
  const [valueCategory, setValueCategory] = useState();
  const [valueAuthor, setValueAuthor] = useState([]);
  const onChangePaperNumber = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setPaginationFilter({
      ...paginationFilter,
      _article_paper_number_id: newValue === null ? "" : newValue,
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
      getAPIDeleteArticlePrint(articleId).then((r) => {
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
      console.log(prevPage);
      setValueCategory(prevPage.dataPrevPage?._article_paper_number_id || null);
      setValueAuthor(prevPage.dataPrevPage?._author || null);
    }
  }, [prevPage]);
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
  }, []);

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListArticlePrintByTypePage(
      offset,
      paginationFilter.pageSize,
      paginationFilter._article_title,
      paginationFilter._category_id,
      paginationFilter._author,
      paginationFilter._todate,
      paginationFilter._fromdate,

      paginationFilter.lst_status,
      paginationFilter._article_type_id,
      paginationFilter._article_paper_number_id,
      typePage
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setArticleList(res.data.list);
        setTotal(res.data.total);
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
  }, [reload, props]);
  function findCategoryByValue(data, targetValue) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === targetValue) {
        return data[i]; // Return the category object if value matches
      }
      // Recursively search in the children if they exist
      if (data[i].children.length > 0) {
        const result = findCategoryByValue(data[i].children, targetValue);
        if (result) {
          return result; // Return the found category from the children
        }
      }
    }
    return null; // Return null if no category is found with the target value
  }
  const columns = [
    {
      title: "Tên bài viết",
      width: "35%",
      render: (record) => (
        <div
          className="d-flex flex-column"
          onClick={() => {
            navigate(`/update-newspaper/${record.article_print_id}`, {
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
      title: "Số báo",
      width: "15%",
      render: (record) => {
        const data = record && record.article_paper_number;
        const text = data && data?.paper_number;
        const commaIndex = text && text.indexOf(",");
        const beforeComma = text && text.substring(0, commaIndex).trim();
        const afterComma = text && text.substring(commaIndex + 1).trim();
        const matches = afterComma && afterComma.match(/\d+/g);

        // Lấy hai số đầu tiên từ mảng kết quả
        const day = matches && matches.length > 0 && matches[0];
        const month = matches && matches.length > 1 && matches[1];

        return (
          record &&
          record.article_paper_number && (
            <div className="d-flex flex-column" style={{ marginTop: "10px" }}>
              <p style={pArticleNumber}>{beforeComma}</p>
              <p style={pArticleNumber}>
                {day}
                {data && "/"}
                {month}
                {data && "/"}
                {data?.year}
              </p>
            </div>
          )
        );
      },
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
              (record.article_status_id == 7 && btnDelete) ||
              (record.article_status_id == 12 && btnPublished) ||
              (record.article_status_id == 13 && btnDelete) ||
              (record.article_status_id !== 13 &&
                record.article_status_id !== 12 &&
                record.article_status_id !== 1 &&
                record.article_status_id !== 2 &&
                record.article_status_id !== 3 &&
                record.article_status_id !== 4 &&
                record.article_status_id !== 5 &&
                {})
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
      render: (record) =>
        record.edit_history && (
          <div className="d-flex flex-column" style={{ position: "relative" }}>
            <p style={pArticle}>
              {record.edit_history.length != 0
                ? "Người thực hiện: " +
                  (record.edit_history.user_full_name
                    ? record.edit_history.user_full_name
                    : "")
                : ""}
            </p>
            <p style={pArticle}>
              {record.edit_history.length != 0
                ? "Chức vụ: " +
                  (record.edit_history.user_group
                    ? record.edit_history.user_group
                    : "")
                : ""}
            </p>
            <p style={pArticle}>
              {record.edit_history.length != 0
                ? "Thời gian: " +
                  momentTZ
                    .utc(record.edit_history.created_date)
                    .tz("Asia/Ho_Chi_Minh")
                    .format("DD/MM/YYYY HH:mm:ss")
                : ""}
            </p>
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
                    name:
                      typePage === "all"
                        ? "list-newspaper"
                        : typePage === "draft"
                        ? "list-draft-newspaper"
                        : typePage === "pending"
                        ? "list-pending-newspaper"
                        : typePage === "publish"
                        ? "list-publish-newspaper"
                        : "",
                    // list-publish-newspaper
                    data: paginationFilter,
                  })
                );
                navigate(`/update-newspaper/${record.article_print_id}`, {
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
                    onClickDelete(record.article_print_id);
                  }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </Tooltip>
            </li>
            <Tooltip placement="bottom" title="Tải xuống" arrow={false}>
              {record.article_status_id === 12 && (
                <li className="list-inline-item">
                  <i
                    className="ri-download-line"
                    onClick={() => {
                      downloadDocumentPrintArticle({
                        article_print_id: record.article_print_id,
                      }).then((res) => {
                        const url = window.URL.createObjectURL(
                          new Blob([res], { type: "application/zip" })
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          `${record.article_title}.zip`
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

  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Danh sách bài báo in" pageTitle="Home" />
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
                        {typePage === "all" && (
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
                        )}

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
                            // defaultValue={
                            //   findCategoryByValue(
                            //     optionsPaperNumber,
                            //     paginationFilter._article_paper_number_id
                            //   )?.value
                            // }
                            value={valueCategory}
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
                        {typePage !== "all" && (
                          <Col className="col-3">
                            <DatePicker
                              allowClear
                              onChange={onChangeFromDate}
                              placeholder="Đến ngày"
                              style={{ width: "100%" }}
                              defaultValue={dayjs(paginationFilter._todate)}
                            />
                          </Col>
                        )}
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        {typePage === "all" && (
                          <Col className="col-3">
                            <DatePicker
                              allowClear
                              onChange={onChangeFromDate}
                              defaultValue={dayjs(paginationFilter._fromdate)}
                              placeholder="Từ ngày"
                              style={{ width: "100%" }}
                            />
                          </Col>
                        )}

                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            defaultValue={dayjs(paginationFilter._todate)}
                            placeholder="Đến ngày"
                            style={{ width: "100%" }}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-newspaper`}>
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
                          rowKey={"article_print_id"}
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

export default ListPaperNormal;
