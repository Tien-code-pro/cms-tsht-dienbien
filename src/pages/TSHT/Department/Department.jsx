import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAPIDeleteDepartment,
  getAPIDeleteTag,
  getAPIListCategory,
  getAPIListDepartment,
  getAPIListTag,
} from "../../../helpers/fakebackend_helper";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import DataTable from "react-data-table-component";
import { Table, Tooltip, Input } from "antd";
import ToastCustom from "../../../Components/Common/Toast";
import Loading from "../../../Components/Common/Loading";
import RecordAudio from "../RecordAudio/RecordAudio";
const Department = () => {
  document.title = "Phòng ban | Toà Soạn Hội Tụ";

  const [departmentList, setDepartmentList] = useState();
  const [departmentId, setDepartmentId] = useState({});
  const [loading, setLoading] = useState(true);
  const [queryString, setQueryString] = useState("");
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pageSizes, setPageSize] = useState(10);
  const [timeoutId, setTimeoutId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: pageSizes,
  });

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setReload(queryString);
      setPagination({
        current: 1,
        pageSize: pageSizes,
      });
    }, 500);

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [queryString]);

  const onClickDelete = (department_id) => {
    setDepartmentId(department_id);
    setDeleteModal(true);
  };
  const handleDeleteOrder = () => {
    if (departmentId) {
      const deparment_id = departmentId;
      getAPIDeleteDepartment(deparment_id).then((r) => {
        if (r.status > 0) {
          ToastCustom("Xoá phòng ban thành công", "success");
          setReload(!reload);
        } else {
          ToastCustom("Xoá phòng ban thất bại", "fail");
        }
      });
      setDeleteModal(false);
    }
  };
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setPagination({
      ...pagination,
      pageSize: size,
      current: 1,
    });
    setReload(!reload);
  };
  const handleTableChange = (_pagination, filters) => {
    setPagination((pre) => {
      return {
        ...pre,
        current:
          pagination.pageSize == _pagination.pageSize ? _pagination.current : 1,
      };
    });
    setReload(!reload);
    // let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    // getAPIListDepartment(offset, pagination.pageSize).then((res) => {
    //   if (res.data && res.data.list && res.status > 0) {
    //     setDepartmentList(res.data.list);
    //     setPagination({ ...pagination, total: res.data.total });
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
    // });
  };
  useEffect(() => {
    let offset = pagination.current * pagination.pageSize - pagination.pageSize;
    getAPIListDepartment(offset, pagination.pageSize, queryString).then(
      (res) => {
        if (res.data && res.data && res.status > 0) {
          setDepartmentList(res.data.list);
          setPagination({ ...pagination, total: res.data.total });
        } else {
          ToastCustom("Không tìm thấy dữ liệu!", "fail");
        }
        setLoading(false);
      }
    );
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        title: "Tên phòng ban",
        dataIndex: "department_name",
        width: "80%",
        render: (tag_name) => (
          <Link to="#" className="fw-medium link-primary">
            {tag_name}
          </Link>
        ),
      },
      {
        title: "Thao tác",
        dataIndex: "department_id",
        width: "15%",
        render: (department_id) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit">
                <Tooltip placement="bottom" title="Sửa" arrow={false}>
                  <Link
                    to={`/update-department/${department_id}`}
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
                      onClickDelete(department_id);
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

  const SpeechToNameDepartment = (e) => {
    setQueryString(e);
  };

  return (
    <>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteOrder}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Phòng ban" pageTitle="Home" />
          <Row>
            <Col lg={12}>
              <Card id="orderList">
                <CardHeader className="card-header border-0">
                  <Row className="align-items-center gy-3">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Danh sách phòng ban</h5>
                    </div>
                    <Col className="col-3">
                      <div className="position-relative">
                        <Input
                          placeholder="Tìm kiếm"
                          value={queryString}
                          onChange={(e) => {
                            if (e.target.value != undefined) {
                              setQueryString(e.target.value);
                            } else {
                              setQueryString("");
                            }
                          }}
                        ></Input>
                        <RecordAudio setSpeechToText={SpeechToNameDepartment} />
                      </div>
                    </Col>
                    <div className="col-sm-auto">
                      <div className="d-flex gap-1 flex-wrap">
                        <Link to={`/add-department`}>
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
                    {departmentList && departmentList.length && !loading ? (
                      <Table
                        className="overflow-auto"
                        columns={columns}
                        dataSource={departmentList || []}
                        pagination={{
                          ...pagination,
                          onShowSizeChange: handlePageSizeChange,
                          pageSizeOptions: [10, 20, 50],
                          pageSize: pageSizes,
                          showTotal: (total, range) =>
                            `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
                          showSizeChanger: true,
                        }}
                        onChange={handleTableChange}
                      />
                    ) : (
                      <Loading />
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

export default Department;
