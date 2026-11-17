import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Button } from "antd";
import {
  downloadDocumentArticle,
  getAPIDeleteArticle,
  getAPIListArticle,
  getAPIListAuthor,
  getAPIListCategory,
  getAPITreeListCategory,
  getAPITreeListCategoryByUser,
} from "../../../../helpers/fakebackend_helper";
import ToastCustom from "../../../../Components/Common/Toast";
import { toast } from "react-toastify";
import * as Antd from "antd";
import { DatePicker, Table, TreeSelect, Select, Tooltip, List } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import { Spin } from "antd/lib";
// import { Style } from "google-maps-react";
import Style from "../../../../assets/scss/components/_tooltip.module.scss";
import RecordAudio from "../../RecordAudio/RecordAudio";
// import RecordAudio from "../RecordAudio/RecordAudio";
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

const ModalListNormalArticle = ({
  isModalOpen,
  setIsModalOpen,
  getArticleFast,
}) => {
  const handleOk = () => {};

  const handleCancel = () => {
    if (isLoading) {
      return;
    }
    setIsModalOpen(false);
  };
  // ---------------------------------
  document.title = "Danh sách bài viết | Toà Soạn Hội Tụ";

  const [articleList, setArticleList] = useState();
  const [articleId, setArticleId] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const navigate = useNavigate();

  const [total, setTotal] = useState(666);
  const [pageSizes, setPageSize] = useState();

  let keyWord = "";
  const [paginationFilter, setPaginationFilter] = useState({
    current: 1,
    pageSize: 10,
    _article_title: "",
    _category_id: "",
    _author: "",
    _todate: "",
    _fromdate: "",
    lst_status: "[4]",
    _article_type_id: "1",
    pageSizeOptions: ["10", "20", "50"],
    showTotal: (total, range) =>
      `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
  });
  const onClickDelete = (article_id) => {
    setArticleId(article_id);
    setDeleteModal(true);
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
  }, []);

  useEffect(() => {
    let offset =
      paginationFilter.current * paginationFilter.pageSize -
      paginationFilter.pageSize;
    setIsLoading(true);
    getAPIListArticle(
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
  const columns = useMemo(
    () => [
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
                : `| ${moment(new Date(record.created_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}`}
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
                : moment(new Date(record.modified_date)).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
            </SpanArticle>
          </div>
        ),
      },

      {
        title: "Thao tác",
        width: "3%",
        render: (record) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li
                className="list-inline-item edit"
                onClick={() => {
                  getArticleFast(record.article_id);
                  setIsModalOpen();
                }}
              >
                <Button>Lấy nội dung</Button>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );
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
  return (
    <Modal
      className="list-article-modal"
      okText={"Tạo bài viết"}
      centered={true}
      width={1200}
      getContainer={() => document.getElementById("article-wrap")}
      title=""
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <Row>
        <Col lg={12}>
          <Card id="orderList">
            <CardHeader className="card-header border-0"></CardHeader>
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
    </Modal>
  );
};
export default ModalListNormalArticle;
