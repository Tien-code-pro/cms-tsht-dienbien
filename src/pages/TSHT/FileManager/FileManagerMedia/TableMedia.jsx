import React, { useState, useRef, useEffect } from "react";
import {
  TreeSelect,
  Modal,
  Table,
  Image,
  Popconfirm,
  Button,
  Spin,
} from "antd";
import ToastCustom from "../../../../Components/Common/Toast";
import Loader from "../../../../Components/Common/Loader";
import "./style.css";
import Loading from "../../../../Components/Common/Loading";

export default function TableMedia(props) {
  const {
    sidebarData,
    setSidebarData,
    columns,
    apiGetList,
    reload,
    filterParams,
    onSelectMedia,
    typeArticle,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalData, setTotalData] = useState(0);
  const [loadData, setLoadData] = useState(true);
  useEffect(() => {
    if (typeArticle == "e-magazine") {
      const interval = setInterval(() => {
        setLoadData(!loadData);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loadData]);
  useEffect(() => {
    apiGetList({
      ...filterParams,
      offset: (page - 1) * 10,
      limit: pageSize,
      file_type:
        filterParams.file_type.length > 0
          ? JSON.stringify(filterParams.file_type)
          : JSON.stringify([]),
    }).then((res) => {
      if (res && res.data && res.status > 0) {
        setDataSource(res.data.list);
        setTotalData(res.data.total);
        setLoading(false);
      }
      if (res && res.status === -1) {
        setLoading(false);
        setDataSource([]);
        setTotalData(0);
      }
    });
  }, [reload, page, filterParams, loadData, pageSize]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Table
          dataSource={dataSource}
          locale={{
            emptyText: () => <a>Không có dữ liệu</a>,
          }}
          rowClassName={(record) =>
            sidebarData && record.file_info_id === sidebarData.file_info_id
              ? "ant-table-row-custom"
              : "ant-table-row"
          }
          columns={columns}
          style={{
            marginTop: 20,
          }}
          pagination={{
            current: page,
            // pageSize: 10,
            total: totalData,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setSidebarData(record);
              },
              onDoubleClick: () => {
                onSelectMedia(record);
              },
            };
          }}
        />
      )}
    </>
  );
}
