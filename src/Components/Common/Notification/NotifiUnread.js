import SimpleBar from "simplebar-react";
import React, { useEffect, useState } from "react";
import ItemNoti from "./ItemNoti";
import { v4 as uuidv4 } from "uuid";
import {
  deleteListNotification,
  getNotificationList,
  updateNotificationStatus,
  updateNotificationStatusAll,
} from "../../../helpers/fakebackend_helper";
import ListingWithThumbnail from "../skeleton/ListingWithThumbnail";
const NotifiUnread = () => {
  const [listNoti, setListNoti] = useState([]);
  const [limit, setLimit] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstRender, setFirstRender] = useState(false);
  const updateData = async (type) => {
    setIsLoading(true);
    try {
      const res = await getNotificationList({
        offset: 0,
        limit: limit,
        status: 0,
        days: 7,
      });
      if (res && res.data) {
        setTimeout(() => {
          setIsLoading(false);
          setListNoti(res.data.list);
          setFirstRender(true);
        }, 500);

        if (type) {
          if (limit < res.data.total) {
            setLimit(limit + 15);
          } else {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  useEffect(() => {
    updateData(true);
  }, []);
  return (
    <SimpleBar style={{ maxHeight: "650px" }} className="pe-2">
      {firstRender &&
        listNoti.map((e) => (
          <div key={uuidv4()}>
            <ItemNoti item={e} cb={updateData} />
          </div>
        ))}
      {isLoading ? <ListingWithThumbnail /> : <></>}

      {hasMore ? (
        <div className="my-3 text-center">
          <button
            type="button"
            className="btn btn-soft-success waves-effect waves-light"
            onClick={() => {
              updateData(true);
            }}
          >
            Xem Thêm <i className="ri-arrow-right-line align-middle"></i>
          </button>
        </div>
      ) : (
        <></>
      )}
    </SimpleBar>
  );
};
export default NotifiUnread;
