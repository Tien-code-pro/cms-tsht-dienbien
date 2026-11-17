import React from "react";
import { Col, Input, Label } from "reactstrap";
import { importEPGList } from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import { toast } from "react-toastify";

export const ExcelEpg = ({ id, reload, setReLoad }) => {
  const onHandleImport = (e) => {
    const file = e.target.files[0] || null;
    var bodyFormData = new FormData();
    bodyFormData.append("live_channel_id", id);
    bodyFormData.append("file", file);

    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      importEPGList(bodyFormData).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Cập nhật kênh thành công", "success");
          setReLoad(!reload);
        } else {
          ToastCustom("Không tìm thấy dữ liệu!", "fail");
        }
      });
    }
  };
  return (
    <Col lg={5}>
      <div>
        <Label className="form-label">Nhập Excel</Label>
        <Input className="form-control" type="file" onChange={onHandleImport} />
      </div>
    </Col>
  );
};
export default ExcelEpg;
