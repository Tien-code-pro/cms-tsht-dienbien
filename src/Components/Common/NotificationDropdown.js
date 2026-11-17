import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import {
  Button,
  Input,
  Modal,
  Tooltip,
  Form,
  DatePicker,
  TreeSelect,
} from "antd";
import { Link } from "react-router-dom";
import classnames from "classnames";
//import images

import tickall from "../../assets/images/markasread.png";
import logo from "../../assets/images/logo192.png";

import { toast } from "react-toastify";
import { onMessageListener } from "../../firebase-messaging-sw";
import {
  deleteListNotification,
  getListUser,
  getNotificationList,
  putNotificationForAny,
  updateNotificationStatus,
  updateNotificationStatusAll,
} from "../../helpers/fakebackend_helper";
import NotifiAll from "./Notification/NotifiAll";
import NotifiUnread from "./Notification/NotifiUnread";
import { useDispatch, useSelector } from "react-redux";
import { REFRESH_UNREAD_NOTIFICATION } from "../../store/layouts/actionType";
import useCheckPermission from "../Hooks/useCheckPermison";
import ToastCustom from "./Toast";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const NotificationDropdown = () => {
  //Dropdown Toggle
  const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
  const toggleNotificationDropdown = () => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  //noti
  const [notification, setNotification] = useState({ title: "", body: "" });
  const dispatch = useDispatch();
  const refreshNoti = useSelector((state) => state.Layout.refreshNoti);
  const [quantity, setQuantity] = useState(0);
  const sendNoti = useCheckPermission(97);
  const [listUser, setListUser] = useState([]);
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  function showNotification(title, body) {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        new Notification(title, {
          body: body,
          icon: logo,
        });
        // navigator.serviceWorker.ready.then((registration) => {
        //   registration.showNotification("", {
        //     body: "",
        //     icon: "../images/touch/chrome-touch-icon-192x192.png",
        //     vibrate: [200, 100, 200, 100, 200, 100, 200],
        //     tag: "vibration-sample",
        //   });
        // });
      }
    });
  }

  onMessageListener().then((payload) => {
    setNotification({
      title: payload?.notification?.title,
      body: payload?.notification?.body,
    });
    toast.info(`${payload?.notification?.title}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    showNotification(payload?.notification?.title, payload?.notification?.body);
    // eslint-disable-next-line
    // self.registration.showNotification(
    //   payload?.notification?.title,
    //   payload?.notification?.body
    // );
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await getNotificationList({
          offset: 0,
          limit: 1,
          status: 0,
          days: 7,
        });
        if (res && res.data) {
          setQuantity(res.data.total);
        }
      } catch (e) {
        // this should catch all exceptions
      }
    })();
  }, [refreshNoti]);
  useEffect(() => {
    getListUser({ offset: 0, limit: -1 }).then((res) => {
      if (res && res.status >= 0) {
        const temp = res.data.list.sort(
          (a, b) => a.department_id - b.department_id
        );
        let id = -9999;
        const arr = [];
        temp.forEach((e, i) => {
          if (e.department_id !== id) {
            arr.push({
              value: e.department_name,
              title: e.department_name,
              selectable: false,
              children: temp
                .filter((element) => element.department_id === e.department_id)
                .map((element) => {
                  return { value: element.user_id, title: element.user_name };
                }),
            });
            id = e.department_id;
          }
        });
        setListUser(arr);
      }
    });
  }, []);
  const onChange = (newValue) => {
    setValue(newValue);
  };
  const formRef = useRef(null);
  const onFinish = (values) => {
    const data = {
      list_user_id: values.user,
      title: values.title,
      content: values.content,
      created_date: new Date(values.time).toISOString(),
    };
    // const data = new FormData();
    // data.append("list_user_id", JSON.stringify(values.user));
    // data.append("title", values.title);
    // data.append("content", values.content);
    // data.append("created_date", new Date(values.time).toISOString());
    putNotificationForAny(data).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Gửi thông báo thành công", "success");
        setShow(false);
      } else {
        ToastCustom("Gửi thông báo thất bại", "fail");
        setShow(false);
      }
    });
  };
  return (
    <React.Fragment>
      <Modal
        open={show}
        title="Thông báo"
        onCancel={() => setShow(false)}
        footer={[
          <Button form="myForm" key="submit" htmlType="submit" type="primary">
            Gửi
          </Button>,
          <Button key="cancel" danger onClick={() => setShow(false)}>
            Hủy
          </Button>,
        ]}
      >
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          layout="vertical"
          onFinish={onFinish}
          id="myForm"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="title"
            label="Tên thông báo"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên thông báo" style={{ width: 450 }} />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
            style={{ width: 675 }}
          >
            <Input.TextArea placeholder="Nhập nội dung thông báo" />
          </Form.Item>
          <Form.Item
            name="user"
            label="Người nhận"
            rules={[{ required: true }]}
          >
            <TreeSelect
              showSearch
              style={{ width: 450 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="Chọn người nhận"
              allowClear
              treeCheckable
              treeDefaultExpandAll
              multiple
              treeData={listUser}
              value={value}
              onChange={onChange}
              treeNodeFilterProp="title"
            />
          </Form.Item>
          <Form.Item name="time" label="Thời gian" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: 450 }} />
          </Form.Item>
        </Form>
      </Modal>
      <Dropdown
        isOpen={isNotificationDropdown}
        toggle={toggleNotificationDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <Tooltip
          placement="bottom"
          title="Thông báo"
          trigger={["hover", "click"]}
          arrow={false}
        >
          <DropdownToggle
            type="button"
            tag="button"
            className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
          >
            <i className="bx bx-bell fs-22"></i>
            {quantity ? (
              <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                {quantity}
              </span>
            ) : (
              <></>
            )}
          </DropdownToggle>
        </Tooltip>
        <DropdownMenu
          className="dropdown-menu-lg dropdown-menu-end p-0"
          style={{
            width: 570,
            maxHeight: 761,
          }}
        >
          <div className="dropdown-head bg-pattern rounded-top notification">
            <div className="p-3 notification-header">
              <Row className="align-items-center">
                <Col>
                  <h6
                    className="m-0 fs-16 fw-semibold"
                    style={{
                      color: "#333333",
                      fontWeight: "500",
                      fontSize: 22,
                    }}
                  >
                    Thông báo
                  </h6>
                </Col>
                <div
                  className="col-auto dropdown-tabs"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    (async () => {
                      try {
                        const res = await updateNotificationStatusAll();
                        if (res && res.data) {
                          dispatch({
                            type: REFRESH_UNREAD_NOTIFICATION,
                            payload: !refreshNoti,
                          });
                        }
                      } catch (e) {
                        // this should catch all exceptions
                      }
                    })()
                  }
                >
                  <span
                    className="badge badge-soft-light fs-13"
                    style={{
                      color: "#7E8CAC",
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    <Button onClick={() => setShow(true)}>Gửi thông báo</Button>{" "}
                    <img
                      src={tickall}
                      alt="user-pic"
                      width={20}
                      height={20}
                      style={{ marginRight: 5 }}
                    ></img>
                    Đánh dấu tất cả là đã đọc
                  </span>
                </div>
              </Row>
            </div>

            <div className="px-2 pt-2">
              <Nav className="nav-tabs dropdown-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                    style={{
                      color: "#3577F1",
                      fontWeight: 600,
                      fontSize: 15,
                    }}
                  >
                    Tất cả
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                    style={{
                      color: "#3577F1",
                      fontWeight: 600,
                      fontSize: 15,
                    }}
                  >
                    Chưa đọc
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="py-2 ps-2">
              <NotifiAll />
            </TabPane>

            <TabPane tabId="2" className="py-2 ps-2">
              <NotifiUnread />
            </TabPane>
          </TabContent>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
