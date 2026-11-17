import React, { useState } from "react";
import "./style_comment_box.css";
import {
  MessageBox,
  ChatItem,
  MeetingMessage,
  ChatList,
  Navbar,
} from "react-chat-elements";
import FeatherIcon from "feather-icons-react";
import { Button, Select } from "antd";
import { updateCommentImage } from "../../../../helpers/fakebackend_helper";
import { Input } from "antd";

export default function CommentBox({
  comment,
  article_id,
  image_id,
  reload,
  defaultState,
}) {
  const [show, setShow] = useState(defaultState);
  const [value, setValue] = useState("");
  const handleComment = () => {
    updateCommentImage({
      file_info_id: parseInt(image_id.id),
      article_id: parseInt(article_id),
      content: value,
    }).then((res) => {
      if (res && res.status > 0) {
        reload && reload(image_id.id);
      }
    });
  };
  return (
    <div className="flex w-full">
      {show ? (
        <></>
      ) : (
        <Button
          onClick={() => {
            setShow(true);
          }}
          type="default"
          className="mt-[24px] w-[32px] h-[28px]"
        >
          <FeatherIcon
            icon="align-center"
            className="me-2 ml-[-12px] mt-[-2px]"
          ></FeatherIcon>
        </Button>
      )}
      <div
        className={` [border:1px_solid_#ccc] min-h-[278px] w-full ${
          show === true
            ? "transition-[5s_opacity] opacity-100"
            : "hidden opacity-0"
        }`}
      >
        <div className="flex items-center justify-between [border-bottom:1px_solid_#ccc] py-1 px-1">
          {/* <Select className="" style={{ width: "45%" }} defaultValue={1}>
            <Select.Option value={1}>Sắp xếp theo mới nhất </Select.Option>
            <Select.Option value={2}>Sắp xếp theo cũ nhất </Select.Option>
          </Select> */}
          <div></div>
          <FeatherIcon
            onClick={() => {
              setShow(false);
            }}
            icon="x"
            className="text-red-600 me-2 cursor-pointer"
          ></FeatherIcon>
          {/* <div
            onClick={() => {
              setShow(false);
            }}
            className=""
          >
            x
          </div> */}
        </div>
        <div className="flex flex-col p-4 !overflow-y-auto h-[205px]  space-y-4">
          {comment &&
            comment.map((e, i) => {
              return (
                <div className="flex items-center space-x-2" key={i}>
                  <img
                    src="https://media-dienbien.vtcplay.vn/CT12024-09-12-02_16_13.jpg"
                    alt="avata"
                    className="w-7 h-7 object-cover rounded-[50%]"
                  />
                  <div className="text-black text-base ">
                    <strong className="text-blue-700 mr-2">
                      {e.user_name}
                    </strong>
                    {e.content}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex items-center justify-between py-1 px-4 min-h-[41px] relative">
          <Input.TextArea
            placeholder="Aa"
            onChange={(e) => setValue(e.target.value)}
            className="w-[calc(100%_-_56px)] outline-none [border:1px_solid_#ccc] rounded-xl pl-5 min-h-8 pt-1 ctscroll absolute bottom-1 left-4"
            autoSize={{ minRows: 1, maxRows: 8 }}
          />
          <span
            onClick={() => handleComment()}
            className="w-5 h-5 flex-shrink-0 ml-auto"
          >
            <FeatherIcon
              icon="send"
              className="text-[#3532ba] me-2 mx-2 cursor-pointer"
            ></FeatherIcon>
          </span>
        </div>
      </div>
    </div>
  );
}
