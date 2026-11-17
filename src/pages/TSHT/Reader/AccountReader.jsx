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
import { parseDate } from "../../../helpers/text_helper";
import { EyeOutlined, LockOutlined } from "@ant-design/icons";
import Loading from "../../../Components/Common/Loading";
import { Link } from "react-router-dom";
import { DatePicker, Select, Table, Input, Tooltip, Spin } from "antd";
import {
  postLockAccount,
  getReaderAccountList,
  getAPITreeListCategory,
  getAPIListGroupFunction,
} from "../../../helpers/fakebackend_helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import RecordAudio from "../RecordAudio/RecordAudio";
import ToastCustom from "../../../Components/Common/Toast";

const AccountReader = () => {
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
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState(null);
  const [selectedGroupFunction, setSelectedGroupFunction] = useState();
  const [optionsGroupFunction, setOptionsGroupFunction] = useState([]);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [accountId, setAcccountId] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pageSizes, setPageSize] = useState(10);
  const [status, setStatus] = useState(null);
  const [methodLogin, setMethodLogin] = useState(null);
  const [registerTime, setRegisterTime] = useState({
    fromDate: null,
    toDate: null,
  });
  const [accessTime, setAccessTime] = useState({
    fromDate: null,
    toDate: null,
  });
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    const obj = {
      offset,
      limit: pageSizes,
      status: status !== null && status !== undefined ? status : null,
      type:
        methodLogin !== null && methodLogin !== undefined ? methodLogin : null,
      fromdate: registerTime.fromDate ? `${registerTime.fromDate}` : null,
      todate: registerTime.fromDate ? `${registerTime.fromDate}` : null,
      fromLoginDate: accessTime.fromDate ? `${accessTime.fromDate}` : null,
      toLoginDate: accessTime.toDate ? `${accessTime.toDate}` : null,
      searchKey: searchKey ? searchKey : null,
      // pagination._category_id,
      // pagination.lst_status,
      // selectedGroupFunction,
    };
    Object.keys(obj).forEach((key) => obj[key] === null && delete obj[key]);
    getReaderAccountList(obj).then((res) => {
      console.log("Check res apge change =>", res.data);
      if (res.data && res.data.list && res.status > 0) {
        setAccountList(res.data.list);
        setPagination({
          ...pagination,
          total: res.data.total,
          pageSize: pageSizes,
        });
        // console.log("checkcheck",JSON.parse(res.data.list[0].group_list.replace("'\'",""))[0].group_name)
      } else {
        setPagination({ ...pagination, total: 0, pageSize: pageSizes });
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setAccountList([]);
      }
    });
  };
  useEffect(() => {
    getAPIListGroupFunction().then((res) => {
      var options = [];
      if (res.data && res.status > 0) {
        res.data.forEach((e) => {
          options.push({
            value: e.group_id,
            label: e.group_name,
          });
        });
      }
      setOptionsGroupFunction(options);
    });
    getAPITreeListCategory(0, -1, "").then((res) => {
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
    getAPIListGroupFunction().then((res) => {
      var options = [];
      res.data.forEach((e) => {
        options.push({
          value: e.group_id,
          label: e.group_name,
        });
      });
      setOptionsGroupFunction(options);
    });
  }, []);
  const fetchData = () => {
    const obj = {
      limit: -1,
      offset: 0,
      searchKey: searchKey ? searchKey : null,
      status: status !== null && status !== undefined ? status : null,
      type:
        methodLogin !== null && methodLogin !== undefined ? methodLogin : null,
      fromdate: registerTime.fromDate ? `${registerTime.fromDate}` : null,
      todate: registerTime.fromDate ? `${registerTime.fromDate}` : null,
      fromLoginDate: accessTime.fromDate ? `${accessTime.fromDate}` : null,
      toLoginDate: accessTime.toDate ? `${accessTime.toDate}` : null,
    };

    Object.keys(obj).forEach((key) => obj[key] === null && delete obj[key]);

    getReaderAccountList(obj).then((res) => {
      if (res.status > 0) {
        setAccountList(res.data.list);
      } else {
        setAccountList([]);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [accessTime, registerTime, methodLogin, status, searchKey]);

  const handleLockAccount = (id) => {
    setLoading(true);
    postLockAccount({ account_id: id, status: 3 })
      .then((res) => {
        if (res) {
          setLoading(false);
          fetchData();
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
  const setSpeechToNameADS = (e) => {
    setPagination({
      ...pagination,
      ad_name: e,
      current: 1,
    });
    setReload(!reload);
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
  const openDropdown = (account_id) => {
    setAcccountId(account_id);
  };
  const closeDropdown = () => {
    setAcccountId(0);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "user_name",
      width: "5%",
      render: (user_name, data, idx) => <p className=" ">{idx + 1}</p>,
    },
    {
      title: "Email",
      dataIndex: "user_name",
      width: "10%",
      render: (user_name) => <p className="fw-medium">{user_name}</p>,
    },
    {
      title: "Tên hiển thị",
      dataIndex: "full_name",
      width: "10%",
      render: (full_name) => <p className="fw-medium">{full_name}</p>,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "created_date",
      width: "10%",
      render: (created_date) => (
        <p className="fw-medium ">{parseDate(created_date)}</p>
      ),
    },
    {
      title: "Truy cập gần nhất",
      dataIndex: "last_login",
      width: "10%",
      render: (last_login) => (
        <p className="fw-medium">{parseDate(last_login)}</p>
      ),
    },
    {
      title: "Đăng nhập",
      dataIndex: "type_name",
      width: "10%",
      render: (type_name) => <p className="fw-medium ">{type_name}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (status) => {
        if (status === 1) {
          return (
            <span
              style={{
                backgroundColor: "#DCFBEA",
                border: "1px solid #DCFBEA",
                borderRadius: "20px",
                padding: "8px 16px",
                color: "#0AB39C",
              }}
            >
              Đang hoạt động
            </span>
          );
        } else if (status === 0) {
          return (
            <span
              style={{
                backgroundColor: "#E0E2E7",
                border: "1px solid #E0E2E7",
                borderRadius: "20px",
                padding: "8px 16px",
              }}
            >
              Chưa kích hoạt
            </span>
          );
        } else if (status === 2) {
          return (
            <span
              style={{
                backgroundColor: "#FFE4E6",
                border: "1px solid #E0E2E7",
                borderRadius: "20px",
                padding: "8px 16px",
                color: "#F06548",
              }}
            >
              Bị khóa
            </span>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "account_id",
      width: "10%",
      render: (account_id) => {
        return (
          <button
            className="reader-action-button"
            onClick={(e) => {
              openDropdown(account_id);
            }}
            style={{
              width: "36px",
              height: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              outline: "none",
              border: "none",
              backgroundColor: "#DFF0FA",
            }}
          >
            <DotsIcon />
            {
              <div className="reader-action-button__dropdown">
                <ul>
                  <li>
                    <Link
                      to={`/reader/account/${account_id}`}
                      className="action-link"
                    >
                      <EyeOutlined style={{ fontSize: 20 }} />
                      Xem profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="action-link"
                      onClick={() => handleLockAccount(account_id)}
                    >
                      <LockOutlined style={{ fontSize: 20 }} />
                      Khóa tài khoản
                    </button>
                  </li>
                </ul>
              </div>
            }
          </button>
        );
      },
    },
  ];
  return (
    <div className="page-content">
      {loading && (
        <div className="custom-loading">
          <Loading />
        </div>
      )}

      <Container fluid>
        <BreadCrumb title="Tài khoản bạn đọc" pageTitle="Quản lý bạn đọc" />
        <div className="main-page">
          <div className="toolbar">
            <div className="mb-3">
              <Row>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Trạng thái</Label>
                    <Col className="col-12">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn trạng thái"
                        options={[
                          { label: "Chưa kích hoạt", value: 0 },
                          { label: "Đang hoạt động", value: 1 },
                          { label: "Bị khóa", value: 2 },
                        ]}
                        onChange={(value) => {
                          setStatus(value);
                        }}
                        allowClear
                      />
                    </Col>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Hình thức đăng nhập</Label>
                    <Col className="col-12">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn hình thức đăng nhập"
                        // value={selectedGroupFunction}
                        // onChange={handleSelectGroupFunction}
                        // options={optionsGroupFunction}
                        //isMulti={false}
                        options={[
                          { label: "Email", value: 1 },
                          { label: "Facebook", value: 2 },
                          { label: "Google", value: 3 },
                        ]}
                        onChange={(value) => {
                          setMethodLogin(value);
                        }}
                        allowClear
                      />
                    </Col>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Thời gian đăng ký</Label>
                    <Col className="col-12">
                      <RangePicker
                        placeholder={["Từ ngày", "Tới ngày"]}
                        onChange={(value) => {
                          if (value) {
                            setRegisterTime((prev) => {
                              return {
                                ...prev,
                                fromDate: value[0],
                              };
                            });
                            setRegisterTime((prev) => {
                              return {
                                ...prev,
                                toDate: value[1],
                              };
                            });
                          }
                        }}
                      />
                    </Col>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <Label className="form-label">Thời gian truy cập</Label>
                    <Col className="col-12">
                      <RangePicker
                        placeholder={["Từ ngày", "Tới ngày"]}
                        onChange={(value) => {
                          if (value) {
                            setAccessTime((prev) => {
                              return {
                                ...prev,
                                fromDate: value[0],
                              };
                            });
                            setAccessTime((prev) => {
                              return {
                                ...prev,
                                toDate: value[1],
                              };
                            });
                          }
                        }}
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
                      // value={selectedGroupFunction}
                      // onChange={handleSelectGroupFunction}
                      // options={optionsGroupFunction}
                      //isMulti={false}
                      allowClear
                    />
                    dòng
                  </div>
                </Col>
                <Col className="col-2">
                  <div className="position-relative">
                    <Input
                      placeholder="Tìm kiếm"
                      onChange={(e) => {
                        const keyWord = e.target.value.toString();
                        // setPagination({
                        //   ...pagination,
                        //   ad_name: keyWord,
                        //   current: 1,
                        // });
                        setSearchKey(keyWord);
                      }}
                      // value={pagination.ad_name}
                      onKeyDown={(e) => {
                        // if (e.key === "Enter") {
                        //   setReload(!reload);
                        // }
                      }}
                    ></Input>
                    <RecordAudio setSpeechToText={setSpeechToNameADS} />
                  </div>
                </Col>
              </Row>
            </div>
            <div>
              {accountList ? (
                <Table
                  className="overflow-auto"
                  columns={columns}
                  dataSource={accountList || []}
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
        </div>
      </Container>
    </div>
  );
};

export default AccountReader;
{
  /* <DatePicker
  allowClear
  id="datetime_to"
  onChange={onChangeToDate}
  placeholder="Đến ngày"
  showTime
  style={{ width: "100%" }}
/> */
}
const DotsIcon = ({}) => {
  return (
    <svg
      enable-background="new 0 0 48 48"
      height="14px"
      id="Layer_3"
      version="1.1"
      viewBox="0 0 48 48"
      width="14px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <circle cx="5.5" cy="24" r="5.5" fill="#3577F1" />
        <circle cx="42.499" cy="24" r="5.5" fill="#3577F1" />
        <circle cx="24" cy="24" r="5.5" fill="#3577F1" />
      </g>
    </svg>
  );
};
