import {
  TreeSelect,
  Modal,
  Table,
  Image,
  Button,
  Spin,
  Input,
  Select,
  Popconfirm,
} from "antd";
import "./compare-version.scss";
import IconClose from "../../../../assets/images/IconClosePopup.png";
import { useEffect, useState } from "react";
import {
  articleGetContentFromUrl,
  handleGoogleSearch,
} from "../../../../helpers/fakebackend_helper";
import { Pagination } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  searchGooleKeyWord,
  updateGooleCrawLink,
} from "../../../../store/actions";
import { LoadingOutlined } from "@ant-design/icons";
const ModalGoogleSearch = (props) => {
  const { isOpen, handleModalClose } = props;
  const dispatch = useDispatch();
  const googleKeyWord = useSelector((state) => state.chat.googleKeyWord);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const handleSearh = () => {
    setLoading(true);
    handleGoogleSearch({
      keyword: googleKeyWord,
      page: page,
      page_size: 5,
    })
      .then((res) => {
        if (res && res.status > 0 && res.data.list) {
          setList(res.data.list || []);
          setTotal(res.data.total);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // useEffect(() => {
  //   dispatch(searchGooleKeyWord(filter));
  // }, [filter]);
  useEffect(() => {
    handleGoogleSearch({
      keyword: googleKeyWord,
      page: page,
      page_size: 5,
    }).then((res) => {
      if (res && res.status > 0 && res.data.list) {
        setList(res.data.list || []);
        setTotal(res.data.total);
      }
    });
  }, [page]);
  const handleCrawLink = (e) => {
    articleGetContentFromUrl(e).then((res) => {
      if (res.data && res.status > 0) {
        dispatch(updateGooleCrawLink(res.data));
      }
    });
  };
  return (
    <>
      <div className="Msearch">
        <button className="Msearch1">
          <img
            src={IconClose}
            alt="close"
            className="Msearch1-1"
            onClick={() => handleModalClose && handleModalClose()}
          />
        </button>
        <div className="Msearch2">Hỗ trợ tìm kiếm nội dung</div>
        <hr />
        <div className="Msearch3">Nhập từ khoá tìm kiếm</div>
        <div className="Msearch4">
          <input
            type="text"
            className="Msearch5"
            value={googleKeyWord}
            onChange={(e) => dispatch(searchGooleKeyWord(e.target.value))}
          />
          <button className="Msearch6" onClick={handleSearh}>
            Tìm kiếm
          </button>
        </div>
        <div className="Msearch7">
          <div className="Msearch3 Msearch3-1">
            Kết quả tìm kiếm <div className="Msearch3-2">{total}</div>
          </div>
          {loading ? (
            <div
              style={{
                height: 200,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin />
            </div>
          ) : (
            list.map((e) => {
              return (
                <>
                  <div className="Msearch8">
                    <div className="Msearch9">
                      <div className="Msearch3">{e.title}</div>
                      <div className="Msearch10">
                        <div className="Msearch11 Msearch12">{e.domain}</div>
                        <div className="Msearch11 Msearch16">
                          {moment(e.time).format("DD/MM/YYYY - hh:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="Msearch13">
                      <a href={e.link} target="_blank">
                        <button className="Msearch14">Preview</button>
                      </a>
                      <button
                        className="Msearch14"
                        onClick={() => handleCrawLink(e.link)}
                      >
                        Lấy nội dung
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
        <Pagination
          defaultCurrent={1}
          className="categories-pagination"
          style={{
            // width:"100%",
            // marginLeft: 200,
            // position:"absolute",
            //right:"0%",
            marginTop: 20,
            marginLeft: 10,
          }}
          showTotal={(total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trên ${total}`
          }
          total={total}
          pageSize={5}
          onChange={(e) => {
            setPage(e);
          }}
        />
      </div>
    </>
  );
};

export default ModalGoogleSearch;
