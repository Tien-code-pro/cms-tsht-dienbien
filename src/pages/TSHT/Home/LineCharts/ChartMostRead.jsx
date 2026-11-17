import React, { useEffect, useState } from "react";
import { IcOutlineRemoveRedEye } from "../../../../Components/Common/IcOutlineRemoveRedEye";
import { TreeSelect } from "antd";
import {
  getAPIListChartMostRead,
  getAPIListStatusLineChart,
} from "../../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { subDays, format } from "date-fns";
import * as moment from "moment/moment";

const ChartMostRead = (props) => {
  const { title } = props;
  const [currentDate, setCurrentDate] = useState(new Date());
  const threeDaysAgo = subDays(currentDate, 3);
  // const formatDate = format(threeDaysAgo, "dd/MM/yyy");
  const formatDate = format(threeDaysAgo, "yyy-MM-dd");
  // const nowDate = dayjs(currentDate.toLocaleDateString()).format("YYYY-MM-DD");
  const nowDate = moment(new Date(currentDate)).format("YYYY-MM-DD");
  const [statusList, setStatusList] = useState({
    top: 10,
    time_type: "year",
    time_from: formatDate ? formatDate : "2023-01-01",
    time_to: nowDate ? nowDate : "2023-12-12",
  });

  useEffect(() => {
    getAPIListChartMostRead(
      statusList.top,
      statusList.time_type,
      statusList.time_from,
      statusList.time_to
    ).then((res) => {
      if (res && res.status >= 0 && res.data) {
        res.data[0]?.danhsach
          ? setStatusList(res.data[0].danhsach)
          : setStatusList({});
      }
    });
  }, []);

  return (
    <div className="container ">
      <div className="bai-viet-doc-nhieu">
        <div className="frame">
          <div className=" my-3 d-flex justify-content-between align-items-center">
            <h4 style={{ color: "#3577F1", fontWeight: 600 }}>{title}</h4>
            <div className="d-flex flex-column align-items-center">
              <p>Ngày: {moment(new Date(currentDate)).format("DD-MM-YYYY")}</p>
              {/*<TreeSelect*/}
              {/*    className="d-flex justify-content-end "*/}
              {/*    style={{*/}
              {/*        width: "100%",*/}
              {/*    }}*/}
              {/*    dropdownStyle={{*/}
              {/*        maxHeight: 400,*/}
              {/*        overflow: "auto",*/}
              {/*    }}*/}
              {/*    allowClear*/}
              {/*    treeDefaultExpandAll*/}
              {/*    placeholder="Chuyên mục"*/}
              {/*/>*/}
            </div>
          </div>
        </div>

        {statusList.length > 0 &&
          statusList.map((e, i) => {
            return (
              <div className="frame-2 my-4" key={i}>
                <div className="div-wrapper">
                  <p className="text-wrapper-2 fw-bold">{e.article_title}</p>
                </div>
                <div className="frame-3 d-flex justify-content-between align-items-center">
                  <p className="text-wrapper-3 m-0"> {e.category_name}</p>
                  <div className="frame-4 d-flex align-items-center">
                    <div className="text-wrapper-4 mx-2">
                      {e.total_view_count}
                    </div>
                    <IcOutlineRemoveRedEye className="ic-outline-remove" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChartMostRead;
