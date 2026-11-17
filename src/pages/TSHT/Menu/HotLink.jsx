import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  CardHeader,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Meta from "antd/es/card/Meta";
import {
  updateMenu,
  getListHotLink,
  updateListHotLink,
  deleteHotLink,
} from "../../../helpers/fakebackend_helper";
import {
  List,
  Pagination,
  Button,
  Space,
  Form,
  TreeSelect,
  Tooltip,
  Popconfirm,
} from "antd";
import Loading from "../../../Components/Common/Loading";
import { arrayMoveImmutable } from "array-move";
import { useForm } from "antd/es/form/Form";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import ToastCustom from "../../../Components/Common/Toast";
import { Link, useNavigate, useParams } from "react-router-dom";

export const DragHandle = SortableHandle(() => (
  <Tooltip
    placement="bottom"
    title="Giữ để di chuyển"
    trigger={["hover", "click"]}
    arrow={false}
  >
    <span
      style={{
        cursor: "move",
      }}
    >
      ::
    </span>
  </Tooltip>
));
const HotLink = () => {
  const [menuList, setMenuList] = useState([]);
  const [sortedMenuList, setSortedMenuList] = useState([]);
  const [loadingLeft, setLoadingLeft] = useState(true);
  const [loadingRight, setLoadingRight] = useState(true);
  const [reload, setReload] = useState(true);
  const [filter, setFilter] = useState(
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
  );
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [record, setRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [form] = useForm();
  const addFunction = useRef(() => {});
  const [listNumber, setListNumber] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        getListHotLink({
          offset,
          limit,
        }).then((res) => {
          if (res.data && res.status > 0) {
            setRecord(res.data.total);
            setFilter("");
            setPage(1);
            setMenuList(res.data.list);
          }
          setLoadingLeft(false);
        });
        getListHotLink({
          _status: 1,
          offset: offset,
          limit: limit,
        }).then((res) => {
          if (res.data && res.status > 0) {
            setSortedMenuList(res.data.list);
            form.setFieldValue({
              sortMenu: res.data,
            });
          }
          setLoadingRight(false);
        });
      } catch (e) {
        // this should catch all exceptions
      }
    })();
  }, []);

  const handleUpdateListSelected = (element) => {
    const list = [...sortedMenuList];
    const check = list.some((e) => {
      return e.hot_link_id === element.hot_link_id;
    });
    if (check) {
      ToastCustom("Hot link đã được thêm trước đó", "fail");
    } else {
      ToastCustom("Thêm hot link thành công", "success");
      list.push(element);
      addFunction.current(element);
      setSortedMenuList(list);
    }
  };
  const handleRemoveListSelected = (element) => {
    const list = [...sortedMenuList];
    const check = list.filter((e) => {
      return e.hot_link_id !== element.hot_link_id;
    });
    ToastCustom("Bỏ hot link thành công", "success");
    setSortedMenuList(check);
  };

  const onUpdateSelected = () => {
    const body = form.getFieldValue(["sortMenu"]).map((e) => {
      return e.hot_link_id;
    });
    updateListHotLink({
      list_hot_link_id: body,
    }).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Lưu hot link thành công", "success");
      } else if (res && res.status === -1) {
        ToastCustom("Vui lòng chỉ chọn tối đa 5 hot link", "fail");
      } else {
        ToastCustom("Có lỗi đã xảy ra", "fail");
      }
    });
  };
  useEffect(() => {
    if (
      filter !==
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      setPage(1);
    }
    const delayDebounceFn = setTimeout(() => {
      if (
        filter !==
        "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
      ) {
        getListHotLink({
          _title: filter,
          offset: 0,
          limit: limit,
        }).then((res) => {
          if (res.data && res.status > 0) {
            setMenuList(res.data.list);
            setRecord(res.data.total);
          }
        });
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [filter]);

  useEffect(() => {
    if (
      filter !==
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      getListHotLink({
        _title: filter,
        offset,
        limit,
      }).then((res) => {
        if (res.data && res.status > 0) {
          setMenuList(res.data.list);
          setRecord(res.data.total);
        }
      });
    }
  }, [offset]);

  const onFilterText = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    setOffset((page - 1) * limit);
    if (
      filter !==
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      getListHotLink({
        _title: filter,
        offset,
        limit,
      }).then((res) => {
        if (res.data && res.status > 0) {
          setMenuList(res.data.list);
          setRecord(res.data.total);
        }
      });
    }
  }, [limit]);
  useEffect(() => {
    if (
      filter !==
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
    ) {
      if (record % limit === 1) {
        setPage(page - 1);
      } else {
        getListHotLink({
          offset,
          limit,
        }).then((res) => {
          if (res.data && res.status > 0) {
            setMenuList(res.data.list);
            setRecord(res.data.total);
          }
        });
      }
    }
  }, [reload]);

  useEffect(() => {
    setOffset((page - 1) * limit);
  }, [page]);
  const SortableItem = SortableElement(({ field, index, remove }) => {
    const item = form.getFieldValue("sortMenu")[field.name] || null;
    return (
      <div
        style={{
          display: "flex",
          marginBottom: 8,
          width: "100%",
        }}
        align="baseline"
        key={`space + ${field.key}`}
      >
        <Space
          style={{
            border: "1px solid var(--vz-input-border)",
            padding: 10,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DragHandle />
          <Form.Item
            {...field}
            style={{
              margin: 0,
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
            // name={[field.name, "list"]}
            key={`list + ${field.key}`}
            initialValue={null}
          >
            <Meta title={item?.title} />
          </Form.Item>
        </Space>
        <div style={{ margin: "24px 0 0 10px" }}>
          <Tooltip
            placement="left"
            title={
              <span style={{ fontStyle: "initial" }}>
                Gỡ khỏi chuyên mục hot link
              </span>
            }
          >
            <Button
              type="dashed"
              style={{
                border: "1px solid red",
                background: "white",
                padding: "0px 8px",
                height: "28px",
              }}
              className="btn-light"
              onClick={() => {
                remove(field.name);
                const updatedNumbers = listNumber.slice(0, -1);
                const updatedNumbersWithSequentialOrder = updatedNumbers.map(
                  (n, index) => index + 1
                );
                setListNumber(updatedNumbersWithSequentialOrder);
                handleRemoveListSelected(item);
              }}
            >
              <i
                className="ri-subtract-line align-bottom"
                style={{ color: "red" }}
              ></i>
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    form.setFieldsValue({
      sortMenu: arrayMoveImmutable(
        form.getFieldValue(["sortMenu"]),
        oldIndex,
        newIndex
      ),
    });
  };

  const SortableContainerComponent = SortableContainer(({ children }) => (
    <CardBody>{children}</CardBody>
  ));
  const addField = (add) => {
    add();
    const newNumber = listNumber.length + 1;
    setListNumber([...listNumber, newNumber]);
  };
  useEffect(() => {
    setListNumber(sortedMenuList.map((e, i) => i + 1));
  }, [sortedMenuList]);
  const handleUpdateItem = (item) => {
    // navigate(`/update-hot-link/${item.hot_link_id}`);
    navigate(`/update-hot-link/${item.hot_link_id}`);
  };
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Menu" />
        <Col lg={12}>
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Label
                      className="search-box ms-0"
                      style={{
                        fontFamily: "Semibold",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      Chọn bài viết hot link
                    </Label>
                    <Link
                      to={`/add-hot-link`}
                      style={{
                        marginLeft: "auto",
                      }}
                    >
                      <Button type="primary">Thêm mới</Button>
                    </Link>
                  </div>
                  <div className="search-box ms-0 col-sm-12 mb-3">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm"
                      onChange={onFilterText}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                  {loadingLeft ? (
                    <Loading />
                  ) : (
                    <List
                      // pagination={{ position: "bottom", align: "end" }}
                      dataSource={menuList}
                      locale={{
                        emptyText: "Không có dữ liệu",
                      }}
                      renderItem={(item, index) => (
                        <List.Item key={item.hot_link_id}>
                          <List.Item.Meta
                            title={<a href="#">{item.title}</a>}
                          />
                          <Tooltip
                            placement="left"
                            title={
                              <span style={{ fontStyle: "initial" }}>
                                Sửa hot link
                              </span>
                            }
                          >
                            <button
                              type="button"
                              className="btn btn-primary add-btn"
                              id="update-btn"
                              onClick={() => handleUpdateItem(item)}
                            >
                              <i className="ri-edit-fill align-bottom"></i>
                            </button>
                          </Tooltip>
                          <Tooltip
                            placement="left"
                            title={
                              <span style={{ fontStyle: "initial" }}>
                                Xóa hot link
                              </span>
                            }
                          >
                            <Popconfirm
                              title={"Xác nhận xóa hot link này"}
                              icon={<></>}
                              okText={"Đồng ý"}
                              cancelText={"Hủy bỏ"}
                              onConfirm={() => {
                                deleteHotLink({
                                  _hot_link_id: item.hot_link_id,
                                }).then((res) => {
                                  if (res && res.status > 0) {
                                    ToastCustom(
                                      "Xóa hot link thành công",
                                      "success"
                                    );
                                    setReload(!reload);
                                  } else {
                                    ToastCustom(
                                      res.message && res.message,
                                      "fail"
                                    );
                                  }
                                });
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-danger add-btn"
                                id="delete-btn"
                                style={{
                                  marginLeft: 5,
                                  marginRight: 5,
                                }}
                              >
                                <i className="ri-delete-bin-fill align-bottom"></i>
                              </button>
                            </Popconfirm>
                          </Tooltip>
                          <Tooltip
                            placement="left"
                            title={
                              <span style={{ fontStyle: "initial" }}>
                                Thêm vào hot link
                              </span>
                            }
                          >
                            <button
                              type="button"
                              className="btn btn-success add-btn"
                              id="create-btn"
                              onClick={() => handleUpdateListSelected(item)}
                            >
                              <i className="ri-add-line align-bottom"></i>
                            </button>
                          </Tooltip>
                        </List.Item>
                      )}
                    ></List>
                  )}
                  <Pagination
                    showSizeChanger
                    // onShowSizeChange={(f)=>{
                    //   setLimit(f);
                    // }}
                    defaultCurrent={1}
                    className="categories-pagination"
                    style={
                      {
                        // width:"100%",
                        // marginLeft: 200,
                        // position:"absolute",
                        //right:"0%",
                      }
                    }
                    showTotal={(total, range) =>
                      `Hiển thị ${range[0]}-${range[1]} trên ${total}`
                    }
                    total={record}
                    current={page}
                    onChange={(e, f) => {
                      setPage(e);
                      setLimit(f);
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <Label
                    className="search-box ms-0 col-sm-12"
                    style={{
                      fontFamily: "Semibold",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Sắp xếp thứ tự
                  </Label>
                  <Label
                    className="search-box ms-0 col-sm-12"
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    Kéo thả để sắp xếp thứ tự
                  </Label>
                </CardHeader>
                <CardBody
                  style={{ position: "relative", paddingBottom: "30px" }}
                >
                  <div className="mb-3">
                    {loadingRight ? (
                      <Loading />
                    ) : (
                      <>
                        <Form
                          form={form}
                          autoComplete="off"
                          name="dynamic_form_nest_item"
                          initialValues={{
                            sortMenu: sortedMenuList,
                          }}
                        >
                          <div
                            style={{ display: "flex", justifyItems: "center" }}
                          >
                            <div style={{ padding: 16, paddingRight: 0 }}>
                              {listNumber.map((num) => (
                                <Space
                                  style={{
                                    display: "flex",
                                    width: "80%",
                                    padding: 10,
                                    height: "92px",
                                    marginBottom: "8px",
                                    justifyItems: "center",
                                    alignItems: "center",
                                  }}
                                  align="baseline"
                                  key={num}
                                >
                                  <p
                                    style={{
                                      background: " #3668C9",
                                      color: "white",
                                      padding: "2px 10px",
                                      borderRadius: 4,
                                      fontWeight: "bold",
                                      marginTop: 14,
                                    }}
                                  >
                                    {num}
                                  </p>
                                </Space>
                              ))}
                            </div>
                            <Form.List
                              name={["sortMenu"]}
                              initialValue={sortedMenuList}
                            >
                              {(fields, { add, remove }) => {
                                addFunction.current = add;
                                return (
                                  <SortableContainerComponent
                                    onSortEnd={onSortEnd}
                                    useDragHandle
                                  >
                                    {fields.map((field, index) => (
                                      <SortableItem
                                        key={`item-${index}`}
                                        index={index}
                                        field={field}
                                        remove={remove}
                                      />
                                    ))}
                                  </SortableContainerComponent>
                                );
                              }}
                            </Form.List>
                          </div>
                        </Form>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-success add-btn"
                    id="create-btn"
                    onClick={onUpdateSelected}
                    style={{
                      position: "absolute",
                      right: "27px",
                      bottom: "20px",
                    }}
                  >
                    Lưu
                  </button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default HotLink;
