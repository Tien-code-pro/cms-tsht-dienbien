import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Image,
  Input,
  Select,
  Space,
  Checkbox,
  Progress,
  Modal,
  Tooltip,
} from "antd";
import "filepond/dist/filepond.min.css";
import {
  createListMediaFile,
  createMultipleMediaFile,
  createShortVideoFile,
  deleteListMediaFile,
  getListMediaFile,
  publicFileMedia,
  getListAuthorFile,
} from "../../../../helpers/fakebackend_helper";
import ToastCustom from "../../../../Components/Common/Toast";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../../../../store/fileManager/action";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import TableMedia from "./TableMedia";
import video_icon from "../../../../assets/images/video_icon.jpg";
import audio_icon from "../../../../assets/images/audio_icon.jpg";
import mp4_icon from "../../../../assets/images/mp4.png";
import dayjs from "dayjs";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import ReactHlsPlayer from "react-hls-player";
import styled from "styled-components";
import { options } from "@fullcalendar/core/preact";
import ModalCropImage from "./CropImageModal";
import CropVideo from "./CropVideo";

const StatusBtn = styled.p`
  border: 1px solid #ffffff;
  border-radius: 20px;
  width: 83px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 5px;
`;
const SpanArticle = styled.p`
  font-size: 12px;
`;
const btnIsTranCode = {
  background: "#256AD0",
  color: "#FFFFFF",
};
const btnNonTranCode = {
  background: "#FC957F",
  color: "#FFFFFF",
};

const FileMedia = (props) => {
  const [preview, setPreview] = useState(null);
  const [sidebarData, setSidebarData] = useState();
  const [listAuthor, setListAuthor] = useState([]);
  const [reload, setReload] = useState(true);
  const [textFilter, setTextFilter] = useState("");
  const [percentUploadFile, setPercentUploadFile] = useState(0);
  const [viewPercentUploadFile, setViewPercentUploadFile] = useState(false);
  const [statusUploadFile, setStatusUploadFile] = useState("active");
  const [imageEdit, setImageEdit] = useState("");
  const [nameImageEdit, setNameImageEdit] = useState("");
  const [filterParams, setFilterParams] = useState({
    file_name: "",
    file_size: "",
    file_type: ["audio", "image", "video", "stream"],
    author: -1,
    fromdate: "",
    todate: "",
  });
  const [fileType, setFileType] = useState({
    file_type: ["all"],
  });
  const [timeoutId, setTimeoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newFIle, setNewFile] = useState("");
  const [isOpenModalPreviewShortVideo, setIsOpenModalPreviewShortVideo] =
    useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const closeModal = () => {
    setIsOpen(false);
  };
  const { refresh } = useSelector((state) => ({
    refresh: state.FileManager.refresh,
  }));
  const {
    type,
    setOpen,
    onUploadMedia,
    setMediaSrc,
    setTypeMediaSrc,
    typeOnly,
    typeArticle,
    filterNew,
  } = props;
  const handleUpload = (e, type) => {
    setViewPercentUploadFile(true);
    const selectedFiles = e?.target.files[0];
    const bodyParam = new FormData();
    type === "video" && bodyParam.append("filetype", "video");
    type === "stream" && bodyParam.append("filetype", "stream");
    type !== "stream" && type !== "video" && bodyParam.append("filetype", "");
    bodyParam.append("files", selectedFiles);
    if (selectedFiles) {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          setPercentUploadFile(percent);
        },
      };
      createListMediaFile(bodyParam, options).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Tải lên thành công", "success");
          setReload(!reload);
          setTimeout(() => {
            setStatusUploadFile("success");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
        if (res && res.status <= 0) {
          ToastCustom(res.message, "fail");
          setTimeout(() => {
            setStatusUploadFile("exception");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
      });
    }
  };

  // handleMultipleUpload
  const handleMultipleUpload = (e) => {
    setViewPercentUploadFile(true);
    const files = Object.values(e.target.files);
    const bodyParam = new FormData();
    files.map((f, i) => {
      bodyParam.append(`files`, f);
    });
    if (files) {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          setPercentUploadFile(percent);
        },
      };
      createMultipleMediaFile(bodyParam, options).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Tải lên thành công", "success");
          setReload(!reload);
          setTimeout(() => {
            setStatusUploadFile("success");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
        if (res && res.status <= 0) {
          ToastCustom(res.message, "fail");
          setTimeout(() => {
            setStatusUploadFile("exception");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
      });
    }
  };

  const setNewFileModal = (e) => {
    setNewFile(e);
  };

  useEffect(() => {
    setViewPercentUploadFile(true);
    const selectedFiles = newFIle;

    const bodyParam = new FormData();
    bodyParam.append("files", selectedFiles);
    bodyParam.append(
      "fileName",
      `${
        moment(new Date()).format("DDMMYYYYHHmmss") +
        nameImageEdit.substring(0, nameImageEdit.lastIndexOf(".")) +
        "-crop." +
        nameImageEdit.split(".").pop()
      }`
    );
    if (selectedFiles) {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          setPercentUploadFile(percent);
        },
      };
      createListMediaFile(bodyParam, options).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Tải lên thành công", "success");
          setReload(!reload);
          setTimeout(() => {
            setStatusUploadFile("success");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
        if (res && res.status <= 0) {
          ToastCustom(res.message, "fail");
          setTimeout(() => {
            setStatusUploadFile("exception");
          }, 500);
          setTimeout(() => {
            setStatusUploadFile("active");
            setPercentUploadFile(0);
          }, 3000);
          setTimeout(() => {
            setViewPercentUploadFile(false);
          }, 5000);
        }
      });
    }
  }, [newFIle]);

  useEffect(() => {
    setSidebarData(null);
  }, [refresh]);
  useEffect(() => {
    getListAuthorFile().then((res) => {
      if (res.data && res.status > 0) {
        let options = [];
        options = res.data.map((e) => ({
          value: e.user_id,
          label: e.author_name,
        }));
        options.unshift(
          { value: "", label: "Tất cả" },
          { value: -1, label: "Cá nhân" }
        );
        setListAuthor(options);
      } else {
        options.unshift(
          { value: "", label: "Tất cả" },
          { value: -1, label: "Cá nhân" }
        );
        setListAuthor(options);
      }
    });
  }, []);
  const onClickFolderDelete = (e) => {
    const data = {
      file_info_id: e.file_info_id,
    };
    deleteListMediaFile(data).then((res) => {
      if (res && res.status > 0) {
        ToastCustom("Xóa file thành công", "success");
        setDeleteItem();
        setIsModalOpen(false);
        setSidebarData(null);
      }
      if (res && res.status <= 0) {
        ToastCustom("Có lỗi đã xảy ra", "fail");
      }
      setReload(!reload);
    });
  };
  const onPreviewMedia = (e) => {
    setSidebarData(e);
  };
  const onPublicMedia = async (e, value) => {
    const res = await publicFileMedia({
      file_info_id: e.file_info_id,
      is_public: value,
    });
    if (res && res.data && res.status > 0) {
      ToastCustom(
        value === 1
          ? "Công khai Media thành công"
          : "Hủy công khai Media thành công",
        "success"
      );
      setSidebarData(res.data);
      setReload(!reload);
    } else {
      ToastCustom("Có lỗi đã xảy ra", "fail");
    }
  };
  const searchInput = useRef(null);
  const handleSearch = (dataIndex, key, type) => {
    if (type === "text") {
      setFilterParams({
        ...filterParams,
        [dataIndex]: key ? key : "",
      });
    }
    if (type === "date") {
      if (key) {
        const date = dayjs(key);
        const startOfDay = date.startOf("day");
        const endOfDay = date.endOf("day");
        setFilterParams({
          ...filterParams,
          fromdate: startOfDay.toString(),
          todate: endOfDay.toString(),
        });
      } else {
        setFilterParams({
          ...filterParams,
          fromdate: "",
          todate: "",
        });
      }
    }
    if (type === "startDate") {
      if (key) {
        const date = dayjs(key);
        const startOfDay = date.startOf("day");
        setFilterParams({
          ...filterParams,
          fromdate: startOfDay.toString(),
        });
      } else {
        setFilterParams({
          ...filterParams,
          fromdate: "",
        });
      }
    }
    if (type === "endDate") {
      if (key) {
        const date = dayjs(key);
        const endOfDay = date.endOf("day");
        setFilterParams({
          ...filterParams,
          todate: endOfDay.toString(),
        });
      } else {
        setFilterParams({
          ...filterParams,
          todate: "",
        });
      }
    }
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      handleSearch("file_name", textFilter, "text");
    }, 500);

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [textFilter]);
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <>
        {filterNew === "filterNew" ? (
          <div></div>
        ) : (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {type === "text" && (
              <Input
                ref={searchInput}
                placeholder={`Tìm kiếm`}
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  setTextFilter(e.target.value);
                }}
                style={{
                  marginBottom: 8,
                  display: "block",
                }}
              />
            )}
            {type === "date" && (
              <DatePicker
                placeholder={`Tìm kiếm`}
                onChange={(e) => {
                  if (e) {
                    const date = dayjs(e);
                    const formattedDate = date.format("DD/MM/YYYY");
                    setSelectedKeys([formattedDate]);
                    handleSearch(dataIndex, e, type);
                  } else {
                    setSelectedKeys([]);
                    setFilterParams({
                      ...filterParams,
                      fromdate: "",
                      todate: "",
                    });
                  }
                }}
                style={{
                  marginBottom: 8,
                  display: "block",
                }}
              ></DatePicker>
            )}
            {type === "dropDow" && (
              <Select
                defaultValue={-1}
                style={{ width: 200 }}
                onChange={(e) => {
                  setFilterParams({
                    ...filterParams,
                    author: e,
                  });
                }}
                options={listAuthor}
              />
            )}
            {type === "select" && (
              <Checkbox.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                options={[
                  {
                    label: "Ảnh",
                    value: "image",
                  },
                  {
                    label: "Audio",
                    value: "audio",
                  },
                  {
                    label: "Video",
                    value: "video",
                  },
                  {
                    label: "Stream",
                    value: "stream",
                  },
                ]}
                onChange={(e) => {
                  if (e) {
                    setFilterParams({
                      ...filterParams,
                      file_type: e,
                    });
                  } else {
                    setFilterParams({
                      ...filterParams,
                      file_type: "",
                    });
                  }
                }}
              ></Checkbox.Group>
            )}
          </div>
        )}
      </>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={
          filterNew !== "filterNew"
            ? {
                color: filtered ? "#1677ff" : undefined,
              }
            : {
                display: "none",
              }
        }
      />
    ),
    onFilter: (value, record) => {
      return true;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onSelectMedia = () => {
    let check = true;
    if (sidebarData?.is_transcode) {
      if (sidebarData.is_transcode === 1) {
        check = true;
      } else {
        check = false;
      }
    }
    if (check) {
      setOpen(false);
      dispatch(setRefresh(!refresh));
      if (onUploadMedia) {
        console.log("sidebarData", sidebarData.file_type);
        switch (sidebarData.file_type) {
          case "image":
          case "audio":
            if (typeOnly === "none") {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly === sidebarData.file_type) {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly !== sidebarData.file_type) {
              onUploadMedia(``, "", sidebarData.file_type, "");
            }
            break;
          case "video":
            if (typeOnly === "none") {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly === sidebarData.file_type) {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly !== sidebarData.file_type) {
              onUploadMedia(
                ``,
                "",
                sidebarData.file_type,
                "",
                sidebarData.file_name
              );
            }
            break;
          case "stream":
            if (typeOnly === "none") {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly === sidebarData.file_type) {
              onUploadMedia(
                `${sidebarData.file_url}`,
                sidebarData.file_info_id,
                sidebarData.file_type,
                sidebarData.file_url,
                sidebarData.file_name
              );
            } else if (typeOnly !== sidebarData.file_type) {
              onUploadMedia(
                ``,
                "",
                sidebarData.file_type,
                "",
                sidebarData.file_name
              );
            }
            break;
          default:
            onUploadMedia(`${sidebarData.file_url}`);
            break;
        }
      }
      if (setMediaSrc && setTypeMediaSrc) {
        if (typeOnly === "none") {
          setMediaSrc(`${sidebarData.file_url}`);
          setTypeMediaSrc(sidebarData.file_type); //đây là hiện image
        } else if (typeOnly === sidebarData.file_type) {
          setMediaSrc(`${sidebarData.file_url}`);
          setTypeMediaSrc(sidebarData.file_type); //đây là hiện image
        }
      }
    } else {
      ToastCustom("Video này chưa được transcode", "fail");
    }
  };
  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "thumbnail",
      render: (_, record) => {
        switch (record.file_type) {
          case "stream":
            return (
              <img
                src={video_icon}
                style={{
                  width: 35,
                  height: 35,
                }}
                alt=""
              ></img>
            );
          case "video":
            return (
              <img
                src={mp4_icon}
                style={{
                  width: 35,
                  height: 35,
                }}
                alt=""
              ></img>
            );
          case "image":
            return (
              <img
                src={`${record.file_url}`}
                style={{
                  width: 35,
                  height: 35,
                }}
                alt=""
              ></img>
            );
          case "audio":
            return (
              <img
                src={audio_icon}
                style={{
                  width: 35,
                  height: 35,
                }}
                alt=""
              ></img>
            );
          default:
            return <></>;
        }
      },
    },
    {
      title: "Tên file",
      dataIndex: "file_name",
      key: "file_name",
      ...getColumnSearchProps("file_name", "text"),
      render: (record) => (
        <div
          onClick={() => {
            setShowPreview(true);
          }}
          style={{ width: 270 }}
        >
          {record}
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "file_type",
      key: "file_type",
      ...getColumnSearchProps("file_type", "select"),
      // filters: [
      //   {
      //     text: "ảnh",
      //     value: "image",
      //   },
      //   {
      //     text: "audio",
      //     value: "audio",
      //   },
      //   {
      //     text: "video",
      //     value: "video",
      //   },
      // ],
      // onFilter: (value, record) => {
      //   return true;
      // },
    },
    {
      title: "Kích cỡ",
      dataIndex: "file_size",
      key: "file_size",
    },
    {
      title: "Người tạo",
      dataIndex: "user_name",
      key: "user_name",
      ...getColumnSearchProps("file_name", "dropDow"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      key: "created_date",
      render: (value, record) => {
        const status =
          (record.is_transcode === 1 && btnIsTranCode) ||
          (record.is_transcode === 0 && btnNonTranCode) ||
          {};
        return record.file_type === "stream" ? (
          <div className="d-flex flex-column justify-start">
            {/* <StatusBtn style={status}>
              {record.is_transcode ? "Hoàn thành" : "Đang xử lý"}
            </StatusBtn> */}
            <p
              style={{
                color: "#007bff",
                borderRadius: "20px",
              }}
            >
              {record.transcode_type}
            </p>
            <SpanArticle className="text-left">
              {moment(value).format("DD/MM/YYYY")}
            </SpanArticle>
          </div>
        ) : (
          <>{moment(value).format("DD/MM/YYYY")}</>
        );
      },
      ...getColumnSearchProps("created_date", "date"),
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "address",
      render: (_, record) => {
        let check = true;
        if (sidebarData?.is_transcode) {
          if (sidebarData.is_transcode === 1) {
            check = true;
          } else {
            check = false;
          }
        }
        return (
          <>
            <UncontrolledDropdown>
              <Tooltip
                placement="bottom"
                title="Tùy chọn"
                trigger={["hover", "click"]}
                arrow={false}
              >
                <DropdownToggle
                  tag="button"
                  className="btn btn-ghost-primary btn-icon btn-sm dropdown"
                >
                  <i className="ri-more-2-fill fs-16 align-bottom" />
                </DropdownToggle>
              </Tooltip>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() =>
                    onPublicMedia(record, record.is_public === 0 ? 1 : 0)
                  }
                >
                  {record.is_public === 0 ? "Công khai" : "Hủy công khai"}
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setIsModalOpen(true);
                    setDeleteItem(record);
                  }}
                >
                  Xóa
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setIsOpen(true);
                    setIsModalOpen(false);
                    setImageEdit(record.file_url);
                    setNameImageEdit(record.file_name);
                  }}
                >
                  Chỉnh sửa ảnh
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (sidebarData && showPreview) {
      setPreview(
        <div
          id="file-overview"
          className="h-100"
          style={{
            display: "block",
            marginTop: type === "modal" ? 40 : 0,
            marginLeft: type === "modal" ? 10 : 0,
          }}
        >
          <div className="d-flex h-100 flex-column">
            <div className="d-flex align-items-center pb-3 border-bottom border-bottom-dashed mb-3 gap-2">
              <h5 className="flex-grow-1 fw-semibold mb-0">Xem trước tệp</h5>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="btn btn-ghost-primary btn-icon btn-sm fs-16 favourite-btn"
                >
                  <i
                    className="ri-star-fill align-bottom"
                    style={
                      sidebarData.is_public === 1 ? { color: "orange" } : {}
                    }
                  ></i>
                </button>
                <button
                  type="button"
                  style={{ position: "absolute", zIndex: "10" }}
                  className="btn btn-soft-danger btn-icon btn-sm fs-16 close-btn-overview"
                  onClick={() => {
                    setSidebarData(null);
                    setShowPreview(false);
                  }}
                >
                  <i className="ri-close-fill align-bottom"></i>
                </button>
              </div>
            </div>

            <div className="pb-3 border-bottom border-bottom-dashed mb-3">
              {sidebarData.file_type === "image" && (
                <div
                  className="file-details-box bg-light p-3 text-center rounded-3 border border-light mb-3"
                  style={{ overflow: "hidden" }}
                >
                  <div className="display-4 file-icon">
                    {/* <i
                    className={
                      sidebarData.icon + " text-" + sidebarData.iconClass
                    }
                  ></i> */}
                    {sidebarData.file_type === "image" && (
                      <Image
                        style={{ width: "100% !important" }}
                        src={`${sidebarData.file_url}`}
                        placeholder={"Xem trước"}
                        preview={{
                          mask: (
                            <div className="ant-image-mask-info">
                              <span
                                role="img"
                                aria-label="eye"
                                className="anticon anticon-eye"
                              >
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  data-icon="eye"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                </svg>
                              </span>
                              Xem trước
                            </div>
                          ),
                        }}
                      ></Image>
                    )}
                  </div>
                </div>
              )}
              {sidebarData.file_type === "audio" && (
                <figure>
                  <audio
                    controls
                    src={`${sidebarData.file_url}`}
                    style={{
                      width: type === "modal" ? 300 : 280,
                    }}
                  >
                    <a href={`${sidebarData.file_url}`}>Download audio</a>
                  </audio>
                </figure>
              )}
              {sidebarData.file_type === "video" && (
                <figure>
                  <video
                    controls
                    src={`${sidebarData.file_url}`}
                    style={{
                      width: "100%",
                    }}
                  >
                    <a href={`${sidebarData.file_url}`}>Download video</a>
                  </video>
                </figure>
              )}
              {sidebarData.file_type === "stream" && (
                <Player
                  src={`${sidebarData.file_url}`}
                  eyboardShortcut={false}
                  keyboardShortcut={false}
                >
                  {(ref, props) => (
                    <ReactHlsPlayer playerRef={ref} {...props} />
                  )}
                </Player>
              )}
              <button
                type="button"
                className="btn btn-icon btn-sm btn-ghost-success float-end fs-16"
              >
                {/* <i className="ri-share-forward-line"></i> */}
              </button>
              <h5 className="fs-16 mb-1 file-name">{sidebarData.file_name}</h5>
              <p className="text-muted mb-0 fs-12">
                <span className="file-size">{sidebarData.file_size}</span>,
                <span className="create-date">
                  {moment(sidebarData.created_date).format("DD/MM/YYYY")}
                </span>
              </p>
            </div>
            <div>
              <h5 className="fs-12 text-uppercase text-muted mb-3">
                Thông tin file :
              </h5>

              <div className="table-responsive">
                <table className="table table-borderless table-nowrap table-sm">
                  <tbody>
                    <tr>
                      <th scope="row" style={{ width: "35%" }}>
                        Tên file :
                      </th>
                      <td className="file-name">{sidebarData.file_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Loại file :</th>
                      <td className="file-type">{sidebarData.file_type}</td>
                    </tr>
                    <tr>
                      <th scope="row">Kích cỡ :</th>
                      <td className="file-size">{sidebarData.file_size}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ngày tạo :</th>
                      <td className="create-date">
                        {moment(sidebarData.created_date).format("DD/MM/YYYY")}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Đường dẫn :</th>
                      <td className="file-path">
                        <div className="user-select-all text-truncate">
                          {sidebarData.file_type !== "video"
                            ? `${sidebarData.file_url}`
                            : `${sidebarData.file_url}`}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*
              <div>
                <h5 className="fs-12 text-uppercase text-muted mb-3">
                  Share Information:
                </h5>
                <div className="table-responsive">
                  <table className="table table-borderless table-nowrap table-sm">
                    <tbody>
                      <tr>
                        <th scope="row" style={{ width: "35%" }}>
                          Share Name :
                        </th>
                        <td className="share-name"></td>
                      </tr>
                      <tr>
                        <th scope="row">Share Path :</th>
                        <td className="share-path"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>

            {/* {type === "modal" && (
              <div className="mt-auto border-top border-top-dashed py-3">
                <div className="hstack gap-2">
                  <button
                    type="button"
                    className="btn btn-soft-primary w-100"
                    onClick={() => {
                      // dispatch(selectMedia(sidebarData));
                      setOpen(false);
                      dispatch(setRefresh(!refresh));
                      if (onUploadMedia) {
                        switch (sidebarData.file_type) {
                          case "image":
                          case "audio":
                            onUploadMedia(
                              `${sidebarData.file_url}`
                            );
                            break;
                          case "video":
                            onUploadMedia(`${sidebarData.file_url}`);
                            break;
                          default:
                            onUploadMedia(
                              `${sidebarData.file_url}`
                            );
                            break;
                        }
                      }
                      if (setMediaSrc) {
                        setMediaSrc(
                          `${sidebarData.file_url}`
                        );
                      }
                    }}
                  >
                    <i className="ri-download-2-line align-bottom me-1"></i>
                    Thêm
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft-danger w-100 remove-file-overview"
                    // onClick={() => onClickFileDelete()}
                  >
                    <i className="ri-close-fill align-bottom me-1"></i> Công
                    khai
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      );
    } else {
      setPreview(null);
    }
  }, [sidebarData]);
  return (
    <>
      <Modal
        title="Bạn có chắc muốn xóa media này không"
        open={isModalOpen}
        zIndex={1002}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText={"Xác nhận"}
        cancelText={"Hủy bỏ"}
        onOk={() => {
          onClickFolderDelete(deleteItem);
        }}
      >
        <p>
          Bạn vui lòng lưu ý rằng việc xóa media có thể khiến bài viết bị mất
          media
        </p>
      </Modal>

      <ModalCropImage
        handleUpload={(e, isCrop) => {
          handleUpload(e, isCrop);
        }}
        setNewFileModal={setNewFileModal}
        isOpen={isOpen}
        imageEdit={imageEdit}
        nameImageEdit={nameImageEdit}
        handleModalClose={() => {
          setIsOpen(false);
        }}
      />

      {type === "modal" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Col lg={preview === null ? 12 : 9}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "50px",
              }}
            >
              <div>
                <label
                  style={{ height: "40px", marginRight: "10px" }}
                  // onChange={onFileChange}
                  htmlFor="multipleUpload"
                  className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
                >
                  <input
                    name=""
                    type="file"
                    accept="image/*"
                    multiple
                    id="multipleUpload"
                    onChange={handleMultipleUpload}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm video
                  ngắn
                </label>
                <label
                  style={{ height: "40px" }}
                  // onChange={onFileChange}
                  htmlFor="multipleUpload"
                  className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
                >
                  <input
                    name=""
                    type="file"
                    accept="image/*"
                    multiple
                    id="multipleUpload"
                    onChange={handleMultipleUpload}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm
                  Ảnh/Audio
                </label>
                <label
                  // onChange={onFileChange}
                  style={{ height: "40px", marginLeft: "10px" }}
                  htmlFor="formId1"
                  className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
                >
                  <input
                    name=""
                    type="file"
                    id="formId1"
                    onChange={(e) => {
                      handleUpload(e, "stream");
                    }}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i>
                  Thêm mới Stream
                </label>
                <label
                  // onChange={onFileChange}
                  style={{ height: "40px", marginLeft: "10px" }}
                  htmlFor="formId2"
                  className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
                >
                  <input
                    name=""
                    type="file"
                    id="formId2"
                    onChange={(e) => {
                      handleUpload(e, "video");
                    }}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm mới
                  Video
                </label>
              </div>
              <label
                onClick={() => {
                  setReload(!reload);
                }}
                style={{ height: "40px", marginLeft: "10px" }}
                className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
              >
                <i className="ri-refresh-line align-bottom me-1"></i>
                Tải lại
              </label>
            </div>
            <div>
              {viewPercentUploadFile && percentUploadFile > 0 ? (
                <Progress
                  percent={percentUploadFile}
                  status={statusUploadFile}
                />
              ) : null}
            </div>
            <TableMedia
              sidebarData={sidebarData}
              setSidebarData={setSidebarData}
              columns={columns}
              apiGetList={getListMediaFile}
              reload={reload}
              filterParams={filterParams}
              onSelectMedia={onSelectMedia}
              typeArticle={typeArticle}
            ></TableMedia>
          </Col>
          <Col lg={preview === null ? 0 : 3}>{preview}</Col>
        </div>
      )}
      {type === "component" && (
        <>
          <Col lg={preview === null ? 12 : 8}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div className="people-create-file" style={{ display: "grid" }}>
                  <label style={{ fontWeight: 510 }} htmlFor="">
                    Người tạo{" "}
                  </label>
                  <Select
                    defaultValue={-1}
                    style={{ width: 200 }}
                    onChange={(e) => {
                      setFilterParams({
                        ...filterParams,
                        author: e,
                      });
                    }}
                    options={listAuthor}
                  />
                </div>
              </div>
              <div
                className="type-file"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{ display: "grid" }}
                    className="people-create-file"
                  >
                    <label style={{ fontWeight: 510 }} htmlFor="">
                      Loại file
                    </label>
                    <Select
                      mode="multiple"
                      style={{ width: 200 }}
                      value={fileType.file_type}
                      onChange={(e) => {
                        console.log("e", e);
                        setFileType({
                          file_type:
                            e.findIndex((x) => x == "all") == e.length - 1 ||
                            e.length == 0
                              ? ["all"]
                              : e.filter((e) => e != "all"),
                        });
                        setFilterParams({
                          ...filterParams,
                          file_type:
                            e.findIndex((x) => x == "all") == e.length - 1 ||
                            e.length == 0
                              ? ["image", "video", "audio", "stream"]
                              : e.filter((e) => e != "all"),
                        });
                      }}
                      options={[
                        {
                          label: "Tất cả",
                          value: "all",
                        },
                        {
                          label: "Ảnh",
                          value: "image",
                        },
                        {
                          label: "Audio",
                          value: "audio",
                        },
                        {
                          label: "Video",
                          value: "video",
                        },
                        {
                          label: "Stream",
                          value: "stream",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* <Checkbox.Group
                value={filterParams.file_type}
>>>>>>> origin/namnt
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  options={[
                    {
                      label: "Ảnh",
                      value: "image",
                    },
                    {
                      label: "Audio",
                      value: "audio",
                    },
                    {
                      label: "Video",
                      value: "video",
                    },
                  ]}
                  onChange={(e) => {
                    if (e) {
                      setFilterParams({
                        ...filterParams,
                        file_type:
                          e.length == 0 ? ["image", "video", "audio"] : e,
                      });
                    } else {
                      setFilterParams({
                        ...filterParams,
                        file_type: "",
                      });
                    }
                  }}
                ></Checkbox.Group>
                {" "} */}
              </div>

              <div className="startDay">
                <label style={{ fontWeight: 510 }} htmlFor="">
                  Từ ngày
                </label>
                <DatePicker
                  placeholder={`Tìm kiếm`}
                  onChange={(e) => {
                    if (e) {
                      const date = dayjs(e);
                      const formattedDate = date.format("DD/MM/YYYY");
                      handleSearch("created_date", e, "startDate");
                    } else {
                      setFilterParams({
                        ...filterParams,
                        fromdate: "",
                        todate: "",
                      });
                    }
                  }}
                  style={{
                    width: 200,
                    marginBottom: 8,
                    display: "block",
                  }}
                ></DatePicker>
              </div>
              <div className="endDate">
                <label style={{ fontWeight: 510 }} htmlFor="">
                  Đến ngày
                </label>
                <DatePicker
                  placeholder={`Tìm kiếm`}
                  onChange={(e) => {
                    if (e) {
                      const date = dayjs(e);
                      const formattedDate = date.format("DD/MM/YYYY");
                      handleSearch("created_date", e, "endDate");
                    } else {
                      setFilterParams({
                        ...filterParams,
                        fromdate: "",
                        todate: "",
                      });
                    }
                  }}
                  style={{
                    width: 200,
                    marginBottom: 8,
                    display: "block",
                  }}
                ></DatePicker>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: "4px",
                  marginTop: "20px",
                }}
                className={preview !== null ? "flex-column" : ""}
              >
                <CropVideo
                  reload={reload}
                  setReload={setReload}
                  setStatusUploadFile={setStatusUploadFile}
                  setPercentUploadFile={setPercentUploadFile}
                  setViewPercentUploadFile={setViewPercentUploadFile}
                />
                <label
                  style={{ height: "40px" }}
                  // onChange={onFileChange}
                  htmlFor="multipleUpload"
                  className="btn btn-success text-nowrap create-folder-modal flex-shrink-0"
                >
                  <input
                    name=""
                    type="file"
                    accept="image/*"
                    multiple
                    id="multipleUpload"
                    onChange={handleMultipleUpload}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm
                  Ảnh/Audio
                </label>
                <label
                  style={{ height: "40px" }}
                  // onChange={onFileChange}
                  htmlFor="formIdStream"
                  className={`btn btn-success text-nowrap create-folder-modal flex-shrink-0 ${
                    preview !== null ? "w-100" : ""
                  }`}
                >
                  <input
                    name=""
                    type="file"
                    id="formIdStream"
                    onChange={(e) => {
                      handleUpload(e, "stream");
                    }}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm Stream{" "}
                </label>
                <label
                  style={{ height: "40px" }}
                  // onChange={onFileChange}
                  htmlFor="formIdVideo"
                  className={`btn btn-success text-nowrap create-folder-modal flex-shrink-0 ${
                    preview !== null ? "w-100" : ""
                  }`}
                >
                  <input
                    name=""
                    type="file"
                    id="formIdVideo"
                    onChange={(e) => {
                      handleUpload(e, "video");
                    }}
                    hidden
                  />
                  <i className="ri-add-line align-bottom me-1"></i> Thêm Video{" "}
                </label>
              </div>
            </div>
            <div>
              {viewPercentUploadFile && percentUploadFile > 0 ? (
                <Progress
                  percent={percentUploadFile}
                  status={statusUploadFile}
                />
              ) : null}
            </div>
            <TableMedia
              apiGetList={getListMediaFile}
              sidebarData={sidebarData}
              setSidebarData={setSidebarData}
              columns={columns}
              reload={reload}
              filterParams={filterParams}
              typeArticle={typeArticle}
            ></TableMedia>
          </Col>
          <Col lg={preview === null ? 0 : 4}>{preview}</Col>
        </>
      )}
    </>
  );
};

export default FileMedia;
