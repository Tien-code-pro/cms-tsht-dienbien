import { Card, CardBody, Container } from "reactstrap";
import moment from "moment";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Table, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import {
  getArticlePriceListPrint,
  articlePriceExportExcelPrint,
  getArticleAuthorList,
  getArticleTypeList,
  getAPIListCategory,
} from "../../../helpers/fakebackend_helper";
import FilterQuery from "./FilterQuery";
import Loading from "../../../Components/Common/Loading";

const ArticlePricePrint = () => {
  const [articlePriceList, setArticlePriceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryAuthor, setQueryAuthor] = useState();
  const [queryType, setQueryType] = useState();
  const [queryCategory, setQueryCategory] = useState();
  const [queryFromDate, setQueryFromDate] =
    useState();
    // moment().startOf("year").format("YYYY-MM-DD HH:mm:ss")
  const [queryToDate, setQueryToDate] =
    useState();
    // moment().endOf("year").format("YYYY-MM-DD HH:mm:ss")

  const [query, setQuery] = useState();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [valueCategory, setValueCategory] = useState();
  const getData = () => {
    getArticlePriceListPrint(query).then((res) => {
      if (res.data && res.status > 0) {
        setArticlePriceList(res.data.list);
      } else {
        setArticlePriceList([]);
      }
      setLoading(false);
    });
  };
  const [searchValue, setSearchValue] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  // useEffect(() => {
  //   getArticlePriceListPrint({
  //     offset: 0,
  //     limit: -1,
  //   }).then((res) => {
  //     if (res.data && res.status > 0) {
  //       setArticlePriceList(res.data.list);
  //     }
  //     setLoading(false);
  //   });
  // }, []);
  const onChangeCategory = (newValue) => {
    if (newValue === undefined) {
      newValue = null;
    }

    setQuery({
      ...query,
      category_id: newValue === null ? "" : newValue,
    });
    setValueCategory(newValue);
    setSearchValue(newValue);

    // Tìm kiếm và mở rộng các nút cây liên quan
    const expandedKeys = optionsCategory

      .map((node) => {
        if (node.title.toLowerCase().includes(newValue.toLowerCase())) {
          return getParentKeys(node);
        }
        return null;
      })
      .flat()
      .filter((key) => key !== null);

    setExpandedKeys([...new Set(expandedKeys)]);
  };
  useEffect(() => {
    if (query) getData();
  }, [query]);
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "article_title",
      key: "article_title",
      render: (text, record) => (
        <>
          <p>{text}</p>
          <p>Tác giả: {record.author}</p>
        </>
      ),
    },
    {
      title: "Nhuận bút",
      dataIndex: "",
      key: "price",
      render: (_, record) => (
        <>
          <p>Nội dung: {record.content_quality}</p>
          <p>Ảnh: {record.image_quality} </p>
          {/* <p>Video: {record.video_quality} </p> */}
          <p>Khác: {record.other_quality}</p>
        </>
      ),
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publish_date",
      render: (text, record) => {
        return record && moment(record.publish_date).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      width: 150,
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];
  useEffect(() => {
    setLoading(true);
    const data = {
      author_id: queryAuthor ? queryAuthor : "",
      category_id: queryCategory ? queryCategory : "",
      article_type_id: queryType ? queryType : "",
      fromdate: queryFromDate ? moment(queryFromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
      todate: queryToDate ? moment(queryToDate).format("YYYY-MM-DDTHH:mm:ss") : "",
      offset: 0,
      limit: -1,
    };
    setQuery(data);
  }, [queryAuthor, queryCategory, queryFromDate, queryType, queryToDate]);
  const handleExportExcel = () => {
    articlePriceExportExcelPrint(query).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Thống Kê Nhuận Bút Market.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const getParentKeys = (node) => {
    const keys = [];
    if (node.children) {
      keys.push(node.value);
      node.children.forEach((child) => {
        keys.push(...getParentKeys(child));
      });
    } else {
      keys.push(node.value);
    }
    return keys;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Thống kê nhuận bút báo in" pageTitle="Nhuận bút" />
        <Card>
          <div
            style={{
              width: "98%",
              margin: "30px auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <FilterQuery
              type="text"
              apiFunction={getArticleAuthorList}
              value={"author"}
              setQuery={setQueryAuthor}
              textTypingSearch
            />

            <FilterQuery
              type="date"
              value={"fromDate"}
              setQuery={setQueryFromDate}
            />
            <FilterQuery
              style={{ height: 75 }}
              type="date"
              value={"toDate"}
              setQuery={setQueryToDate}
            />
            <div></div>
            <div></div>
            <button
              type="button"
              className="btn btn-success"
              id="create-btn"
              onClick={handleExportExcel}
            >
              Xuất excel
            </button>
          </div>
          <CardBody>
            {loading ? (
              <Loading />
            ) : // <Table dataSource={articlePriceList} columns={columns} />
            articlePriceList && articlePriceList.length > 0 ? (
              <Table
                className="overflow-auto"
                columns={columns}
                dataSource={articlePriceList}
                rowKey={"article_id"}
                pagination={{
                  showTotal: (total, range) =>
                    `Hiển thị ${range[0]}-${range[1]} trên ${total} bài viết`,
                }}
              />
            ) : (
              <div
                style={{
                  height: 500,
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>Không có dữ liệu</h2>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ArticlePricePrint;
