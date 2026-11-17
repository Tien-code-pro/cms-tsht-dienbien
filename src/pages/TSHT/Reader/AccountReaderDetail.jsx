import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  // Input,
  Row,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { DatePicker, Select, Table, Input, Tooltip, Spin } from "antd";
import {
  postLockAccount,
  getReaderAccountInteractList,
  getReaderAccountDetail,
  getReaderAccountList,
  getAPITreeListCategory,
  getAPIListGroupFunction,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import RecordAudio from "../RecordAudio/RecordAudio";
import ToastCustom from "../../../Components/Common/Toast";
import { useParams } from "react-router-dom";
import { parseDate } from "../../../helpers/text_helper";
const typeAction = [
  {
    label: "Bình luận",
    value: 1,
  },
  {
    label: "Thích",
    value: 2,
  },
  {
    label: "Chia sẻ",
    value: 3,
  },
];
const AccountReaderDetail = () => {
  let { id } = useParams();
  const { RangePicker } = DatePicker;
  const [accountList, setAccountList] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [reload, setReload] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    ad_type: "",
    customer_info: "",
    status: "",
    date_to: "",
    date_from: "",
    ad_name: "",
  });
  const [searchKey, setSearchKey] = useState(null);
  const [selectedGroupFunction, setSelectedGroupFunction] = useState();
  const [optionsGroupFunction, setOptionsGroupFunction] = useState([]);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [accountId, setAcccountId] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [pageSizes, setPageSize] = useState(10);
  const [infoUser, setInfoUser] = useState();
  const [listInteract, setListInteract] = useState();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    const obj = {
      offset,
      limit: pageSizes,
      fromLoginDate: fromDate ? `${fromDate}` : null,
      toLoginDate: toDate ? `${toDate}` : null,
    };
    Object.keys(obj).forEach((key) => obj[key] === null && delete obj[key]);
    getReaderAccountList(obj).then((res) => {
      // pagination.pageSize,
      // searchKey,
      // pagination._category_id,
      // pagination.lst_status,
      // selectedGroupFunction
      if (res.data && res.data.list && res.status > 0) {
        setAccountList(res.data.list);
        setPagination({
          ...pagination,
          total: res.data.total,
          pageSize: pageSizes,
        });
      } else {
        setPagination({ ...pagination, total: 0, pageSize: pageSizes });
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setAccountList([]);
      }
    });
  };
  useEffect(() => {
    getReaderAccountDetail({ account_id: id }).then((res) => {
      if (res) {
        setInfoUser(res.data);
      }
    });
  }, []);

  useEffect(() => {
    getReaderAccountInteractList(
      fromDate && toDate
        ? type
          ? {
              account_id: id,
              type,
              offset: 0,
              limit: -1,
              fromdate: `${fromDate}`,
              todate: `${toDate}`,
            }
          : {
              account_id: id,
              offset: 0,
              limit: -1,
              fromdate: `${fromDate}`,
              todate: `${toDate}`,
            }
        : toDate
        ? type
          ? {
              account_id: id,
              type,
              offset: 0,
              limit: -1,
              todate: `${toDate}`,
            }
          : {
              account_id: id,

              offset: 0,
              limit: -1,
              todate: `${toDate}`,
            }
        : fromDate
        ? type
          ? {
              account_id: id,
              type,
              offset: 0,
              limit: -1,
              fromdate: `${fromDate}`,
            }
          : {
              account_id: id,

              offset: 0,
              limit: -1,
              fromdate: `${fromDate}`,
            }
        : type
        ? {
            account_id: id,
            type,
            offset: 0,
            limit: -1,
          }
        : {
            account_id: id,
            offset: 0,
            limit: -1,
          }
    ).then((res) => {
      if (res && res.data?.list) {
        setListInteract(res.data?.list);
      } else {
        setListInteract([]);
      }
    });
  }, [fromDate, toDate, type]);
  // const fetchData = () => {
  //   getReaderAccountList({
  //     offset: 0,
  //     limit: 100,
  //   }).then((res) => {
  //     if (res.status > 0) {
  //       setAccountList(res.data.list);
  //     }
  //   });
  // };
  const handleLockAccount = (id) => {
    setLoading(true);
    postLockAccount({ account_id: id, status: 3 })
      .then((res) => {
        if (res) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const onChangeFromDate = (e) => {
    setFromDate(e);
  };
  const onChangeToDate = (e) => {
    setToDate(e);
  };

  const onClickDelete = (account_id) => {
    setAcccountId(account_id);
    setDeleteModal(true);
  };
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPagination({
      ...pagination,
      pageSize: size,
      current: 1,
    });
    //setReload(!reload);
  };
  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "article_id",
      width: "50%",
      render: (article_id, item) => (
        <div className="interact-item">
          <div className="icon-type">
            {item.type === 1 ? (
              <IconComment />
            ) : item.type === 2 ? (
              <IconLike />
            ) : (
              <IconShare />
            )}
          </div>
          <div className="main-info">
            <div className="head">
              <p className="type">{item.type_name}</p>
              <p className="date">{parseDate(item.cr_date)}</p>
            </div>
            <p className="content">{item.content_content}</p>
            <div className="group-action">
              <button className="btn">Xem chi tiết</button>
              <button className="btn">Gỡ bình luận</button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Nhóm quyền",
      dataIndex: "group_list",
      width: "50%",
      render: (article_title, item) => (
        <div className="interact-item">
          <div className="main-image">
            <img src={item.avatar_image} />
          </div>
          <div className="main-title">
            <p>{item.article_title}</p>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Tài khoản bạn đọc" pageTitle="Quản lý bạn đọc" />
        <div className="main-page">
          {infoUser && (
            <div className="profile-container">
              <div className="profile-container__left">
                <img className="avatar-user" alt="" />
                <div
                  className={`status-user ${
                    infoUser.status === 1
                      ? "green"
                      : infoUser.status === 2
                      ? "grey"
                      : "red"
                  }`}
                >
                  {infoUser.status === 1
                    ? "Đang hoạt động"
                    : infoUser.status === 2
                    ? "Không hoạt động"
                    : "Đã khóa"}
                </div>
              </div>
              <div className="profile-container__right">
                <button
                  className="lock-btn"
                  onClick={() => handleLockAccount(infoUser.account_id)}
                >
                  Khóa tài khoản
                </button>
                <div className="name-user">{infoUser.full_name}</div>
                <div className="wrap">
                  <span className="label">Email:</span>
                  <span className="">{infoUser.user_name}</span>
                </div>
                <div className="wrap">
                  <span className="label">Ngày đăng ký:</span>
                  <span className="">{infoUser.created_date}</span>
                </div>
                <div className="wrap">
                  <span className="label">Truy cập gần nhất:</span>
                  <span className="">{infoUser.last_login}</span>
                </div>
              </div>
            </div>
          )}
          <div className="title">Hoạt động gần đây</div>
          <div className="toolbar">
            <div className="mb-3">
              <Row>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Loại hoạt động</Label>
                    <Col className="col-12">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        options={typeAction}
                        placeholder="Chọn trạng thái"
                        onChange={(value) => {
                          setType(value);
                        }}
                        allowClear
                      />
                    </Col>
                  </div>
                </Col>

                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Từ ngày</Label>
                    <Col className="col-12">
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder={["Từ ngày"]}
                        onChange={onChangeFromDate}
                      />
                    </Col>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Đến ngày</Label>
                    <Col className="col-12">
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder={["Đến ngày"]}
                        onChange={onChangeToDate}
                      />
                    </Col>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mb-3">
              <Row>
                <Col>
                  <div>
                    Hiển thị
                    <Select
                      style={{
                        margin: "0 6px",
                      }}
                      placeholder="10"
                      allowClear
                    />
                    dòng
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div>
            {listInteract ? (
              <Table
                className="overflow-auto"
                columns={columns}
                dataSource={listInteract || []}
                pagination={{
                  ...pagination,
                  onShowSizeChange: handlePageSizeChange,
                  pageSize: pageSizes,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total, range) =>
                    `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
                  showSizeChanger: true,
                }}
                onChange={handleTableChange}
                rowKey={"user_id"}
                locale={{
                  emptyText: () => <a>Không có dữ liệu</a>,
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
                <Spin />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountReaderDetail;

const IconComment = () => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.7999 2.71048C15.3899 2.30048 14.6799 2.58048 14.6799 3.15048V6.64048C14.6799 8.10048 15.9199 9.31048 17.4299 9.31048C18.3799 9.32048 19.6999 9.32048 20.8299 9.32048C21.3999 9.32048 21.6999 8.65048 21.2999 8.25048C19.8599 6.80048 17.2799 4.19048 15.7999 2.71048Z"
        fill="white"
      />
      <path
        d="M20.5 10.69H17.61C15.24 10.69 13.31 8.76 13.31 6.39V3.5C13.31 2.95 12.86 2.5 12.31 2.5H8.07C4.99 2.5 2.5 4.5 2.5 8.07V16.93C2.5 20.5 4.99 22.5 8.07 22.5H15.93C19.01 22.5 21.5 20.5 21.5 16.93V11.69C21.5 11.14 21.05 10.69 20.5 10.69ZM11.5 18.25H7.5C7.09 18.25 6.75 17.91 6.75 17.5C6.75 17.09 7.09 16.75 7.5 16.75H11.5C11.91 16.75 12.25 17.09 12.25 17.5C12.25 17.91 11.91 18.25 11.5 18.25ZM13.5 14.25H7.5C7.09 14.25 6.75 13.91 6.75 13.5C6.75 13.09 7.09 12.75 7.5 12.75H13.5C13.91 12.75 14.25 13.09 14.25 13.5C14.25 13.91 13.91 14.25 13.5 14.25Z"
        fill="white"
      />
    </svg>
  );
};
const IconShare = () => {
  return (
    <>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.3601 13.2315C19.9901 13.2315 19.6801 12.9515 19.6401 12.5815C19.4001 10.3815 18.2201 8.40154 16.4001 7.14154C16.0701 6.91154 15.9901 6.46154 16.2201 6.13154C16.4501 5.80154 16.9001 5.72154 17.2301 5.95154C19.4001 7.46154 20.8001 9.82154 21.0901 12.4315C21.1301 12.8315 20.8401 13.1915 20.4401 13.2315C20.4101 13.2315 20.3901 13.2315 20.3601 13.2315Z"
          fill="white"
        />
        <path
          d="M3.74004 13.2812C3.72004 13.2812 3.69004 13.2812 3.67004 13.2812C3.27004 13.2412 2.98004 12.8812 3.02004 12.4812C3.29004 9.87118 4.67004 7.51118 6.82004 5.99118C7.14004 5.76118 7.60004 5.84118 7.83004 6.16118C8.06004 6.49118 7.98004 6.94118 7.66004 7.17118C5.86004 8.45118 4.69004 10.4312 4.47004 12.6212C4.43004 13.0012 4.11004 13.2812 3.74004 13.2812Z"
          fill="white"
        />
        <path
          d="M15.9901 21.6003C14.7601 22.1903 13.4401 22.4903 12.0601 22.4903C10.6201 22.4903 9.2501 22.1703 7.9701 21.5203C7.6101 21.3503 7.4701 20.9103 7.6501 20.5503C7.8201 20.1903 8.2601 20.0503 8.6201 20.2203C9.2501 20.5403 9.9201 20.7603 10.6001 20.8903C11.5201 21.0703 12.4601 21.0803 13.3801 20.9203C14.0601 20.8003 14.7301 20.5903 15.3501 20.2903C15.7201 20.1203 16.1601 20.2603 16.3201 20.6303C16.5001 20.9903 16.3601 21.4303 15.9901 21.6003Z"
          fill="white"
        />
        <path
          d="M12.05 2.51172C10.5 2.51172 9.22998 3.77172 9.22998 5.33172C9.22998 6.89172 10.49 8.15172 12.05 8.15172C13.61 8.15172 14.87 6.89172 14.87 5.33172C14.87 3.77172 13.61 2.51172 12.05 2.51172Z"
          fill="white"
        />
        <path
          d="M5.04998 14.3711C3.49998 14.3711 2.22998 15.6311 2.22998 17.1911C2.22998 18.7511 3.48998 20.0111 5.04998 20.0111C6.60998 20.0111 7.86998 18.7511 7.86998 17.1911C7.86998 15.6311 6.59998 14.3711 5.04998 14.3711Z"
          fill="white"
        />
        <path
          d="M18.9499 14.3711C17.3999 14.3711 16.1299 15.6311 16.1299 17.1911C16.1299 18.7511 17.3899 20.0111 18.9499 20.0111C20.5099 20.0111 21.7699 18.7511 21.7699 17.1911C21.7699 15.6311 20.5099 14.3711 18.9499 14.3711Z"
          fill="white"
        />
      </svg>
    </>
  );
};
const IconLike = () => {
  return (
    <>
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.38989 18.9907V8.83071C8.38989 8.43071 8.50989 8.04071 8.72989 7.71071L11.4599 3.65071C11.8899 3.00071 12.9599 2.54071 13.8699 2.88071C14.8499 3.21071 15.4999 4.31071 15.2899 5.29071L14.7699 8.56071C14.7299 8.86071 14.8099 9.13071 14.9799 9.34071C15.1499 9.53071 15.3999 9.65071 15.6699 9.65071H19.7799C20.5699 9.65071 21.2499 9.97071 21.6499 10.5307C22.0299 11.0707 22.0999 11.7707 21.8499 12.4807L19.3899 19.9707C19.0799 21.2107 17.7299 22.2207 16.3899 22.2207H12.4899C11.8199 22.2207 10.8799 21.9907 10.4499 21.5607L9.16989 20.5707C8.67989 20.2007 8.38989 19.6107 8.38989 18.9907Z"
          fill="white"
        />
        <path
          d="M5.21 6.87891H4.18C2.63 6.87891 2 7.47891 2 8.95891V19.0189C2 20.4989 2.63 21.0989 4.18 21.0989H5.21C6.76 21.0989 7.39 20.4989 7.39 19.0189V8.95891C7.39 7.47891 6.76 6.87891 5.21 6.87891Z"
          fill="white"
        />
      </svg>
    </>
  );
};
