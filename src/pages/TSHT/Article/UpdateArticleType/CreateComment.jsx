import React from "react";
import DefaultIocn from "../../../../assets/images/users/user-dummy-img.jpg";
import "./bubble.scss";
export default function CreateCommentDemo() {
  return (
    <div
      className="hover-bubble"
      style={{ position: "absolute", top: "10px", left: "20px", zIndex: 9999 }}
    >
      <img className="hover-bubble2" src={DefaultIocn} />
      <div className="hover-bubble3">
        <div className="hover-bubble4">tunggggg</div>
        <div className="hover-bubble5">
          {" "}
          la mot con dla mot con dla mot con dla mot con dla mot con dla mot con
          dla mot con dla mot con dla mot con dla mot con dla mot con dla mot
          con dla mot con dla mot con dla mot con dla mot con dla mot con dla
          mot con dla mot con dla mot con dla mot con dla mot con dla mot con
          dla mot con dla mot con dla mot con dla mot con dla mot con dla mot
          con d
        </div>
      </div>
    </div>
  );
}
