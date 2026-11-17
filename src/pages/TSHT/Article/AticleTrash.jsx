import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import {
  getAPIDeleteArticle, getAPIDeleteRestoreArticle,
  getAPIListArticleTrash,
  getAPIListAuthor, getAPIRestoreArticle,
  getAPITreeListCategoryByUser,
} from "../../../helpers/fakebackend_helper";
import { setStatePrevPage } from "../../../store/actions";
import ToastCustom from "../../../Components/Common/Toast";
import * as Antd from "antd";
import { DatePicker, Table, TreeSelect, Select, Tooltip, List } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import momentTZ from "moment-timezone";
import styled from "styled-components";
import { Spin } from "antd/lib";
import Style from "../../../assets/scss/components/_tooltip.module.scss";
import RecordAudio from "../RecordAudio/RecordAudio";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import RestoreModal from "../../../Components/Common/RestoreModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
export const SpanArticle = styled.p`
  font-size: 12px;
  color: #6f727a;
`;

export const StatusBtn = styled.p`
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
export const TooltipStyle = styled.div`
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
  // {
  //   value: 6,
  //   label: "Hủy",
  // },
  {
    value: 7,
    label: "Trả lại",
  },
];
const dateFormat = "YYYY/MM/DD";
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
  // {
  //   value: 5,
  //   label: "Báo in",
  // },
  {
    value: 11,
    label: "Short video",
  },
];
export const pArticle = {
  marginBottom: 10,
};
export const listOtherCateArticle = {
  color: "rgba(0, 0, 0, 0.6)",
};
export const btnNew = {
  background: "#FFD88C",
  color: "#F47113",
};
export const btnPending = {
  background: "#8F49E7",
  color: "#FFFFFF",
};
export const btnIsWaitApproved = {
  background: "#FFD88C",
  color: "#FFFFFF",
};
export const btnPublished = {
  background: "#256AD0",
  color: "#FFFFFF",
};
export const btnDelete = {
  background: "#FC957F",
  color: "#FFFFFF",
};
const ArticleTrash = () => {
  const dispatch = useDispatch();
  document.title = "Thùng rác | Toà Soạn Hội Tụ";
  const prevPage = useSelector((state) => state.PrevPage);
  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const navigate = useNavigate();
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [pageSizes, setPageSize] = useState();

  let keyWord = "";

  const [paginationFilter, setPaginationFilter] = useState(() => {
    return prevPage.namePrevPage === "list-article"
      ? prevPage.dataPrevPage
      : {
          current: 1,
          pageSize: 10,
          _article_title: "",
          _category_id: "",
          _author: "",
          _todate: moment().format("YYYY-MM-DDTHH:mm:ss"),
          _fromdate: moment().startOf("year").format("YYYY-MM-DDTHH:mm:ss"),
          lst_status: "",
          _article_type_id: "",
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
        };
  });

  const onClickRestore = (article_id) => {
    setArticleId(article_id);
    setRestoreModal(true);
  };

  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
  };
  const [valueCategory, setValueCategory] = useState();
  const [valueAuthor, setValueAuthor] = useState();
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
  const handleRestoreOrder = () => {
    if (articleId) {
      getAPIRestoreArticle(JSON.stringify([articleId])).then((r) => {
        if (r.status > 0) {
          ToastCustom("Khôi phục bài viết thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Khôi phục bài viết thất bại", "fail");
        }
      });
      setRestoreModal(false);
    }
  };
  const handleDeleteOrder = () => {
    if (articleId) {
      getAPIDeleteRestoreArticle(JSON.stringify([articleId])).then((r) => {
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
    setIsLoading(false);
  };

  function findCategoryByValue(data, targetValue) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === targetValue) {
        return data[i]; // Return the category object if value matches
      }
      // Recursively search in the children if they exist
      if (
        data &&
        data.length > 0 &&
        data[i].children &&
        data[i].children.length > 0
      ) {
        const result = findCategoryByValue(data[i].children, targetValue);
        if (result) {
          return result; // Return the found category from the children
        }
      }
    }
    return null; // Return null if no category is found with the target value
  }
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
    getAPIListArticleTrash(
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
        setPaginationFilter({ ...paginationFilter, total: res.data.total });
      } else {
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setArticleList([]);
      }
      setIsLoading(false);
    });
  }, [reload]);
  useEffect(() => {
    if (prevPage && prevPage.dataPrevPage) {
      setValueAuthor(prevPage.dataPrevPage?._author || null);
    }
  }, [prevPage]);

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
                  .format("DD/MM/YYYY HH:mm:ss")}
                
                `}
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
          <p style={listOtherCateArticle}>{record.list_category_name}</p>
          <SpanArticle
            style={{
              color: "rgba(26, 114, 246, 0.8)",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
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
                  getPopupContainer={(triggerNode) => triggerNode}
                  placement="leftTop"
                  color={"white"}
                  title={
                    <List
                      className="list-author"
                      size="small"
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
            {record.publish_date === null
              ? ""
              : momentTZ
                  .utc(record.publish_date)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("DD/MM/YYYY HH:mm:ss")}
          </SpanArticle>
        </div>
      ),
    },
    {
      title: "Thời gian",
      width: "15%",
      render: (record) => (
        <div className="d-flex flex-column" style={{ position: "relative" }}>
          <p style={pArticle}>
            {record.days_left_until_delete} ngày
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
            <li className="list-inline-item">
              <Tooltip placement="bottom" title="Khôi phục" arrow={false}>
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => {
                    onClickRestore(record.article_id);
                  }}
                >
                  <i className="mdi mdi-recycle-variant fs-16"></i>
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
          </ul>
        );
      },
    },
  ];
  //   [paginationFilter]
  // );

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
        <RestoreModal
          show={restoreModal}
          onDeleteClick={handleRestoreOrder}
          onCloseClick={() => setRestoreModal(false)}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb title="Thùng rác" pageTitle="Home" />
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
                          <TreeSelect
                            style={{
                              width: "100%",
                            }}
                            defaultValue={
                              findCategoryByValue(
                                optionsCategory,
                                paginationFilter._category_id
                              )?.value
                            }
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
                              console.log(55, e);
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
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        <Col className="col-3">
                          <Select
                            options={articleListType}
                            allowClear
                            style={{
                              width: "100%",
                            }}
                            defaultValue={
                              paginationFilter._article_type_id || null
                            }
                            placeholder="Loại bài"
                            onChange={(e) => {
                              setPaginationFilter((prev) => ({
                                ...prev,
                                offset: 0,
                                _article_type_id: e ? e : "",
                              }));
                              setReload(!reload);
                            }}
                          ></Select>
                        </Col>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeFromDate}
                            placeholder="Từ ngày"
                            style={{ width: "100%" }}
                            defaultValue={dayjs(paginationFilter._fromdate)}
                          />
                        </Col>
                        <Col className="col-3">
                          <DatePicker
                            allowClear
                            onChange={onChangeToDate}
                            // defaultValue={paginationFilter._todate}
                            placeholder="Đến ngày"
                            style={{ width: "100%" }}
                            defaultValue={dayjs(paginationFilter._todate)}
                            // defaultValue={moment(paginationFilter._todate)}
                          />
                        </Col>
                      </Row>
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

export default ArticleTrash;
