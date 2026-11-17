import UiContent from "../../../Components/Common/UiContent";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import {
  getAPIDeleteTag,
  getAPIListTag,
  getAPIListAccount,
  searchGetAPIListAccount,
  getAPIDeleteAccount,
  getAPITreeListCategory,
  getAPIListGroupFunction,
} from "../../../helpers/fakebackend_helper";
import PreviewCardHeader from "../../../Components/Common/PreviewCardHeader";

import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Center } from "antd";
import { toast, ToastContainer } from "react-toastify";
import ToastCustom from "../../../Components/Common/Toast";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { Input, Tooltip } from "antd";
import { Spin, TreeSelect, Select } from "antd";
const { Search } = Input;
const Account = () => {
  document.title = "Danh sách tài khoản | Toà Soạn Hội Tụ";
  const [accountList, setAccountList] = useState();
  const [accountId, setAcccountId] = useState({});
  const [optionsCategory, setOptionsCategory] = useState([]);

  const [searchKey, setSearchKey] = useState(null);
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [selectedGroupFunction, setSelectedGroupFunction] = useState();
  const [optionsGroupFunction, setOptionsGroupFunction] = useState([]);
  const [valueCategory, setValueCategory] = useState();
  const [pageSizes, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSizes,
    _category_id: 0,
    lst_status: -1,
  });
  const [statusListType, setStatusListType] = useState([
    {
      value: 1,
      label: "Hoạt động",
    },
    {
      value: 2,
      label: "Không hoạt động",
    },
  ]);
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

  function handleSelectGroupFunction(target) {
    setSelectedGroupFunction(target);
    setReload(!reload);
  }
  // useEffect(() => {
  //   getAPITreeListCategory(0, -1).then((res) => {
  //     var options = [];
  //     if (res.data && res.data.list && res.status > 0) {
  //       res.data.list.forEach((e) => {
  //         options.push({
  //           value: e.category_id,
  //           title: e.category_name,
  //           children: e.list_categories_lv2.map((x) => ({
  //             value: x.category_id,
  //             title: x.category_name,
  //             children: x.list_categories_lv3.map((y) => ({
  //               value: y.category_id,
  //               title: y.category_name,
  //             })),
  //           })),
  //         });
  //       });
  //     }
  //     setOptionsCategory(options);
  //   });
  // }, []);
  const onChangeCategory = (newValue) => {
    setPagination({
      ...pagination,
      _category_id: newValue === undefined ? 0 : newValue,
      current: 1,
    });
    // setValueCategory(newValue);
    setReload(!reload);
  };
  const onClickDelete = (account_id) => {
    setAcccountId(account_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (accountId) {
      const user_id = accountId;
      getAPIDeleteAccount(user_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá tài khoản thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá tài khoản thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handleTableChange = (pagination, filters) => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAccount(
      offset,
      pagination.pageSize,
      searchKey,
      pagination._category_id,
      pagination.lst_status,
      selectedGroupFunction
    ).then((res) => {
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

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPagination({
      ...pagination,
      pageSize: size,
      current: 1,
    });
    //setReload(!reload);
  };

  const columns = useMemo(
    () => [
      {
        title: "Tên tài khoản",
        dataIndex: "user_name",
        width: "10%",
        render: (user_name) => (
          <Link to="#" className="fw-medium link-primary">
            {user_name}
          </Link>
        ),
      },
      {
        title: "Nhóm quyền",
        dataIndex: "group_list",
        width: "20%",
        render: (group_list) => (
          <span>{JSON.parse(group_list.replace("''", ""))[0].group_name}</span>
        ),
      },
      {
        title: "Chuyên mục",
        dataIndex: "category_list",
        width: "30%",
        render: (category_list) => {
          category_list = JSON.parse(category_list);
          return (
            <div style={{ display: "flex", gap: "5px", flexFlow: "wrap" }}>
              {category_list.map((e, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#DCFBEA",
                    border: "1px solid #DCFBEA",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                >
                  {e.category_name}
                </span>
              ))}
            </div>
          );
        },
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
                }}
              >
                Hoạt Động
              </span>
            );
          } else {
            return (
              <span
                style={{
                  backgroundColor: "#E0E2E7",
                  border: "1px solid #E0E2E7",
                  borderRadius: "20px",
                  padding: "8px 16px",
                }}
              >
                Không Hoạt Động
              </span>
            );
          }
        },
      },
      {
        title: "Thao tác",
        dataIndex: "user_id",
        width: "10%",
        render: (user_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Tooltip placement="bottom" title="Sửa" arrow={false}>
                  <Link
                    to={`/update-account/${user_id}`}
                    className="text-primary d-inline-block edit-item-btn"
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
                      onClickDelete(user_id);
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
    ],
    []
  );
  useEffect(() => {
    // console.log("check categoty", pagination._category_id);
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListAccount(
      offset,
      pagination.pageSize,
      searchKey,
      pagination._category_id,
      pagination.lst_status,
      selectedGroupFunction
    ).then((res) => {
      if (res.data && res.data.list && res.status > 0) {
        setAccountList(res.data.list);
        setPagination({
          ...pagination,
          total: res.data.total,
          current: 1,
          pageSize: pageSizes,
        });
      } else {
        setPagination({
          ...pagination,
          total: 0,
          current: 1,
          pageSize: pageSizes,
        });
        ToastCustom("Không tìm thấy dữ liệu!", "fail");
        setAccountList([]);
      }
    });
  }, [reload]);
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setReload(searchKey);
      setPagination({
        current: 1,
        pageSize: 10,
      });
    }, 500);

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchKey]);
  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadCrumb
            title="Danh sách tài khoản"
            pageTitle="Danh sách tài khoản"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách tài khoản</h5>
                    </div>

                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-account`}>
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
                  <Row className="mt-3">
                    <Col className="col-3">
                      <Input
                        placeholder="Tìm kiếm"
                        onChange={(e) => {
                          if (e.target.value != undefined) {
                            setSearchKey(e.target.value);
                          } else {
                            setSearchKey("");
                          }
                        }}
                      ></Input>
                    </Col>
                    <Col className="col-3">
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
                        showSearch
                        treeData={optionsCategory}
                        treeDefaultExpandAll
                        placeholder="Chuyên mục"
                        onChange={onChangeCategory}
                        filterTreeNode={(input, treeNode) =>
                          treeNode.title
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Col>
                    <Col className="col-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn nhóm quyền"
                        value={selectedGroupFunction}
                        onChange={handleSelectGroupFunction}
                        options={optionsGroupFunction}
                        //isMulti={false}
                        allowClear
                      />
                    </Col>

                    <Col className="col-3">
                      <Select
                        options={statusListType}
                        // mode="multiple"
                        allowClear
                        style={{
                          width: "100%",
                        }}
                        placeholder="Trạng thái"
                        onChange={(e) => {
                          setPagination({
                            ...pagination,
                            offset: 0,
                            lst_status: e,
                          });
                          setReload(!reload);
                        }}
                      ></Select>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Account;
