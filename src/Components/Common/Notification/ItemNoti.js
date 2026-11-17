import React, { useEffect, useState } from "react";
import {
  deleteListNotification,
  getNotificationList,
  updateNotificationStatus,
  updateNotificationStatusAll,
} from "../../../helpers/fakebackend_helper";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import moment from "moment";
import {
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import icon_xoa_bai from "../../../assets/images/iconnotifi/icon_xoa_bai.png";
import icon_ha_xuat_ban from "../../../assets/images/iconnotifi/icon_ha_xuat_ban.png";
import icon_cho_duyet from "../../../assets/images/iconnotifi/icon_cho_duyet.png";
import icon_duyet_bai_viet from "../../../assets/images/iconnotifi/icon_duyet_bai_viet.png";
import icon_thong_bao_admin from "../../../assets/images/iconnotifi/icon_thong_bao_admin.png";
import icon_tra_lai_bai_viet from "../../../assets/images/iconnotifi/icon_tra_bai_viet.png";
import icon_comment from "../../../assets/images/iconnotifi/icon_comment.png";
import icon_cho_xuat_ban from "../../../assets/images/iconnotifi/icon_cho_xuat_ban.png";
import avatar_danh_dau from "../../../assets/images/markasread.png";
import avatar_xoa from "../../../assets/images/iconnotifi/delete_notifi.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { REFRESH_UNREAD_NOTIFICATION } from "../../../store/layouts/actionType";
import { Button, Modal } from "antd";
const ItemNoti = (props) => {
  const { item, cb } = props;
  const [hover, setHover] = useState(false);
  let navigate = useNavigate();
  const refreshNoti = useSelector((state) => state.Layout.refreshNoti);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const renderAvatar = (e) => {
    switch (e) {
      case 6:
        return icon_xoa_bai;
      case 5:
        return icon_ha_xuat_ban;
      case 2:
        return icon_cho_duyet;
      case 4:
        return icon_duyet_bai_viet;
      case 7:
        return icon_tra_lai_bai_viet;

      case 3:
        return icon_cho_xuat_ban;
      case 0:
        return icon_thong_bao_admin;
      case 8:
        return icon_comment;

      default:
        return "";
    }
  };
  const renderRouter = (e, type) => {
    switch (type) {
      case 6:
        navigate("/list-article");
        break;
      case 5:
        navigate(`/update-article/${e.article_id}`, {
          state: { type: e.article_type_id },
        });
        break;
      case 2:
        navigate(`/update-article/${e.article_id}`, {
          state: { type: e.article_type_id },
        });
        break;
      case 4:
        navigate(`/update-article/${e.article_id}`, {
          state: { type: e.article_type_id },
        });
        break;
      case 7:
        navigate(`/update-article/${e.article_id}`, {
          state: { type: e.article_type_id },
        });
        break;

      case 3:
        navigate(`/update-article/${e.article_id}`, {
          state: { type: e.article_type_id },
        });
        break;
      case 8:
        navigate("/comment");
        break;
      case 0:
        setIsModalOpen(true);
        break;

      default:
        break;
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal
        title={item.title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"xác nhận"}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {item.content}{" "}
      </Modal>
      <div
        className="text-reset notification-item d-block dropdown-item position-relative"
        onMouseMove={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div
          className="d-flex"
          onClick={async () => {
            const res = await updateNotificationStatus({
              list_user_notification_id: JSON.stringify([
                item.user_notification_id,
              ]),
              status: 1,
            });
            if (res && res.data) {
              cb();
              renderRouter(item, item.notification_type);
            }
          }}
        >
          <img
            src={renderAvatar(item.notification_type)}
            className="me-3 rounded-circle avatar-xs"
            style={{ width: 40, height: 40, marginTop: 15 }}
            alt="user-pic"
          />
          <div className="flex-1">
            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
              <span>
                {moment(item.created_date).format("DD/MM/YYYY hh:mm:ss")}
              </span>
            </p>
            <Link to="#" className="stretched-link">
              <h6 className="mt-0 mb-1 fs-13 fw-semibold">{item.title}</h6>
            </Link>
            <Link to="#" className="stretched-link">
              <h6
                className="mt-0 mb-1 fs-13 fw-semibold"
                style={{ color: "#3577F1", width: "85%" }}
              >
                {item.content}
              </h6>
            </Link>
          </div>
        </div>
        <div
          className="px-2 fs-15"
          style={{
            display: "flex",
            position: "absolute",
            top: 30,
            right: 30,
          }}
        >
          {hover ? (
            <UncontrolledDropdown>
              <DropdownToggle
                tag="button"
                className="btn btn-ghost-primary btn-icon btn-sm dropdown"
                style={{ zIndex: 100 }}
              >
                <i className="ri-more-2-fill fs-16 align-bottom" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={async () => {
                    const res = await updateNotificationStatus({
                      list_user_notification_id: JSON.stringify([
                        item.user_notification_id,
                      ]),
                      status: 1,
                    });
                    if (res && res.data) {
                      dispatch({
                        type: REFRESH_UNREAD_NOTIFICATION,
                        payload: !refreshNoti,
                      });
                      cb();
                    }
                  }}
                >
                  <img
                    src={avatar_danh_dau}
                    alt="user-pic"
                    width={20}
                    height={20}
                    style={{ marginRight: 5, marginLeft: -10 }}
                  ></img>
                  Đánh dấu đã đọc
                </DropdownItem>
                <DropdownItem
                  onClick={async () => {
                    const res = await deleteListNotification({
                      user_notification_id: item.user_notification_id,
                    });
                    if (res && res.data) {
                      cb();
                    }
                  }}
                >
                  <img
                    src={avatar_xoa}
                    alt="user-pic"
                    width={20}
                    height={20}
                    style={{ marginRight: 5, marginLeft: -10 }}
                  ></img>
                  Bỏ thông báo này
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
            <></>
          )}
          {item.status === 0 ? (
            <div
              style={{
                backgroundColor: "#3577F1",
                width: 10,
                height: 10,
                borderRadius: 5,
                marginTop: 8,
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        style={{
          height: 1,
          width: "95%",
          backgroundColor: "#D9D9D9",
          marginLeft: "2.5%",
        }}
      ></div>
    </div>
  );
};
export default ItemNoti;
