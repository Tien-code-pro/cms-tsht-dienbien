import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAPIListFunctionByUser,
  getAPITotalArticle,
  isUserAuthenticated,
} from "../helpers/fakebackend_helper";
import { getFCMToken } from "../firebase-messaging-sw";
import { getUserDeviceIDFirebase } from "../helpers/fakebackend_helper";
import { useDispatch } from "react-redux";
import { handleSaveAccountPermisson } from "../store/auth/profile/actions";
import ToastCustom from "../Components/Common/Toast";
const Navdata = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  //TSHT
  const [isHome, setIsHome] = useState(false);
  const [isArticle, setIsArticle] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const [isLiveChannel, setIsLiveChannel] = useState(false);
  const [isEvents, setIsEvents] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isGroupFunction, setIsGroupFunction] = useState(false);
  const [isArticlePrice, setIsArticlePrice] = useState(false);
  const [isArticlePriceCommon, setIsArticlePriceCommon] = useState(false);
  const [isArticlePriceNewspaper, setIsArticlePriceNewspaper] = useState(false);
  const [isHotArticle, setIsHotArticle] = useState(false);
  const [isReaderManage, setIsReaderManage] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [isSitemapManage, setIsSitemapManage] = useState(false);
  const [isDepartment, setIsDepartment] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isArticleLive, setIsArticleLive] = useState(false);
  const [isNewspaper, setIsNewspaper] = useState(false);
  const [isInteraction, setIsInteraction] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [isAdvertisement, setIsAdvertisement] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isNotifications, setIsNotifications] = useState(false);

  function openCollapse(e) {
    var target = e.target.id;
    var items = document.getElementById(`sidebarApps_${target}`);
    items.classList.toggle("show");
  }
  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Article") {
      setIsArticle(false);
    }
    if (iscurrentState !== "Category") {
      setIsCategory(false);
    }
    if (iscurrentState !== "Tag") {
      setIsTag(false);
    }
    if (iscurrentState !== "LiveChannel") {
      setIsLiveChannel(false);
    }
    if (iscurrentState !== "GroupFunction") {
      setIsGroupFunction(false);
    }
    if (iscurrentState !== "HotArticle") {
      setIsHotArticle(false);
    }
    if (iscurrentState !== "Role") {
      setIsRole(false);
    }
    if (iscurrentState !== "SitemapManage") {
      setIsSitemapManage(false);
    }
    if (iscurrentState !== "ReaderManage") {
      setIsReaderManage(false);
    }
    if (iscurrentState !== "Department") {
      setIsDepartment(false);
    }
    if (iscurrentState !== "Account") {
      setIsAccount(false);
    }
    if (iscurrentState !== "Report") {
      setIsReport(false);
    }
    if (iscurrentState !== "Notification") {
      setIsNotifications(false);
    }
  }, [
    history,
    iscurrentState,
    isArticle,
    isCategory,
    isTag,
    isGroupFunction,
    isReaderManage,
    isHotArticle,
    isRole,
    isDepartment,
    isAccount,
    isReport,
    isNotifications,
  ]);

  var menuItems = [
    {
      id: "dashboard-home",
      label: "Tổng quan",
      icon: "ri-dashboard-2-line",
      link: "/home",
    },
    {
      id: "article",
      label: "Quản lý bài viết",
      icon: "mdi mdi-file-document-edit-outline",
      link: "/article",
      stateVariables: isArticle,
      click: function (e) {
        e.preventDefault();
        setIsArticle(!isArticle);
        setIscurrentState("Article");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-article",
          label: "Thêm bài viết",
          link: "/add-article",
          parentId: "article",
        },
        {
          id: "list-article",
          label: `Danh sách bài viết`,
          link: "/list-article",
          parentId: "article",
        },
        {
          id: "draft-article",
          label: `Danh sách bài nháp`,
          link: "/draft-article",
          parentId: "article",
        },
        {
          id: "pending-article",
          label: `Danh sách chờ duyệt`,
          link: "/pending-article",
          parentId: "article",
        },
        {
          id: "publish-article",
          label: `Danh sách xuất bản`,
          link: "/publish-article",
          parentId: "article",
        },
        {
          id: "article-trash",
          label: `Thùng rác`,
          link: "/article-trash",
          parentId: "article",
        },
      ],
    },
    {
      id: "category",
      label: "Quản lý chuyên mục",
      icon: "ri-dashboard-line",
      link: "/category",
      stateVariables: isCategory,
      click: function (e) {
        e.preventDefault();
        setIsCategory(!isCategory);
        setIscurrentState("Category");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-category",
          label: "Thêm chuyên mục",
          link: "/add-category",
          parentId: "category",
        },
        {
          id: "list-category",
          label: "Danh sách chuyên mục",
          link: "/list-category",
          parentId: "category",
        },
      ],
    },
    {
      id: "tag",
      label: "Quản lý tag",
      icon: "bx bx-purchase-tag",
      link: "/tag",
      stateVariables: isTag,
      click: function (e) {
        e.preventDefault();
        setIsTag(!isTag);
        setIscurrentState("Tag");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-tag",
          label: "Thêm tag",
          link: "/add-tag",
          parentId: "tag",
        },
        {
          id: "list-tag",
          label: "Danh sách tag",
          link: "/list-tag",
          parentId: "tag",
        },
      ],
    },
    {
      id: "live-channel",
      label: "Quản lý Kênh",
      icon: "mdi mdi-television-box",
      link: "/live-channel",
      stateVariables: isLiveChannel,
      click: function (e) {
        e.preventDefault();
        setIsLiveChannel(!isLiveChannel);
        setIscurrentState("LiveChannel");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-live-channel",
          label: "Thêm kênh",
          link: "/add-live-channel",
          parentId: "live-channel",
        },
        {
          id: "list-live-channel",
          label: "Danh sách kênh",
          link: "/list-live-channel",
          parentId: "live-channel",
        },
      ],
    },
    {
      id: "events",
      label: "Quản lý Sự kiện",
      icon: "mdi mdi-calendar-star",
      link: "/events",
      stateVariables: isEvents,
      click: function (e) {
        e.preventDefault();
        setIsEvents(!isEvents);
        setIscurrentState("Events");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-events",
          label: "Thêm Sự kiện",
          link: "/add-events",
          parentId: "events",
        },
        {
          id: "list-events",
          label: "Danh sách Sự kiện",
          link: "/list-events",
          parentId: "live-events",
        },
      ],
    },
    {
      id: "comment",
      label: "Quản lý bình luận",
      icon: "mdi mdi-message-reply-outline",
      link: "/comment",
    },
    {
      id: "advertisement",
      label: "Quảng cáo",
      icon: "mdi mdi-google-ads",
      link: "/advertisement",
      stateVariables: isAdvertisement,
      click: function (e) {
        e.preventDefault();
        setIsAdvertisement(!isAdvertisement);
        setIscurrentState("advertisement");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-advertisement",
          label: "Thêm Quảng Cáo",
          link: "/add-advertisement",
          parentId: "advertisement",
        },
        {
          id: "list-advertisement",
          label: "Danh sách Quảng Cáo",
          link: "/list-advertisement",
          parentId: "advertisement",
        },
      ],
    },
    {
      id: "role",
      label: "Quản lý quy trình",
      icon: "mdi mdi-nfc-tap",
      link: "/role",
      stateVariables: isRole,
      click: function (e) {
        e.preventDefault();
        setIsRole(!isRole);
        setIscurrentState("Role");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-role",
          label: "Thêm quy trình",
          link: "/add-role",
          parentId: "role",
        },
        {
          id: "list-role",
          label: "Danh sách quy trình",
          link: "/list-role",
          parentId: "role",
        },
      ],
    },
    {
      id: "article-price",
      label: "Nhuận bút",
      icon: "mdi mdi-piggy-bank-outline",
      link: "/article-price",
      stateVariables: isArticlePrice,
      click: function (e) {
        e.preventDefault();
        setIsArticlePrice(!isArticlePrice);
        setIscurrentState("ArticlePrice");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "article-price-common",
          label: "Nhuận bút báo điện tử",
          link: "/article-price/common",
          parentId: "article-price",
        },
        {
          id: "article-price-newspaper",
          label: "Nhuận bút báo in",
          link: "/article-price/newspaper",
          parentId: "article-price",
        },
      ],
    },
    {
      id: "hot-article",
      label: "Thiết lập tin nổi bật",
      icon: "mdi mdi-newspaper-variant-outline",
      link: "/hot-article",
      stateVariables: isHotArticle,
      click: function (e) {
        e.preventDefault();
        setIsHotArticle(!isHotArticle);
        setIscurrentState("HotArticle");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "oustanding",
          label: "Tin nổi bật",
          link: "/oustanding",
          parentId: "hot-article",
        },
        {
          id: "is-selected",
          label: "Tin tiêu điểm",
          link: "/is-selected",
          parentId: "hot-article",
        },
      ],
    },
    {
      id: "reader-manage",
      label: "Quản lý bạn đọc",
      icon: "mdi mdi-forum-outline",
      link: "/reader",
      stateVariables: isReaderManage,
      click: function (e) {
        e.preventDefault();
        setIsGroupFunction(!isReaderManage);
        setIscurrentState("ReaderManage");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "account-reader-manage",
          label: "Tài khoản bạn đọc",
          link: "/reader/account",
          parentId: "reader-manage",
        },
        {
          id: "comment-reader-manage",
          label: "Quản lý bình luận",
          link: "/reader/comment",
          parentId: "reader-manage",
        },
        {
          id: "mail-reader-manage",
          label: "Quản lý thư bạn đọc",
          link: "/reader/mail",
          parentId: "reader-manage",
        },
        {
          id: "interact-reader-manage",
          label: "Quản lý tương tác",
          link: "/reader/interact",
          parentId: "reader-manage",
        },
      ],
    },

    {
      id: "list-sitemap",
      label: "Quản lý sitemap",
      icon: "bx bx-purchase-tag",
      link: "/list-sitemap",
      stateVariables: isSitemapManage,
      click: function (e) {
        e.preventDefault();
        setIsGroupFunction(!isSitemapManage);
        setIscurrentState("SitemapManage");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-sitemap",
          label: "Thêm sitemap",
          link: "/add-sitemap",
          parentId: "list-sitemap",
        },
        {
          id: "all-sitemap",
          label: "Danh sách sitemap",
          link: "/all-sitemap",
          parentId: "list-sitemap",
        },
      ],
    },
    {
      id: "group-function",
      label: "Quản lý nhóm quyền",
      icon: "mdi mdi-account-group-outline",
      link: "/group-function",
      stateVariables: isGroupFunction,
      click: function (e) {
        e.preventDefault();
        setIsGroupFunction(!isGroupFunction);
        setIscurrentState("GroupFunction");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-group-function",
          label: "Thêm nhóm quyền",
          link: "/add-group-function",
          parentId: "group-function",
        },
        {
          id: "list-group-function",
          label: "Danh sách nhóm quyền",
          link: "/list-group-function",
          parentId: "group-function",
        },
      ],
    },
    {
      id: "function",
      label: "Quản lý chức năng",
      icon: "mdi mdi-cog-outline fs-22",
      link: "/function",
      stateVariables: isSetting,
      click: function (e) {
        e.preventDefault();
        setIsSetting(!isSetting);
        setIscurrentState("Setting");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-function",
          label: "Thêm chức năng",
          link: "/add-function",
          parentId: "function",
        },
        {
          id: "list-function",
          label: "Danh sách chức năng",
          link: "/list-function",
          parentId: "function",
        },
      ],
    },
    {
      id: "department",
      label: "Quản lý phòng ban",
      icon: "ri-bubble-chart-fill",
      link: "/department",
      stateVariables: isDepartment,
      click: function (e) {
        e.preventDefault();
        setIsDepartment(!isDepartment);
        setIscurrentState("Department");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-department",
          label: "Thêm phòng ban",
          link: "/add-department",
          parentId: "department",
        },
        {
          id: "list-department",
          label: "Danh sách phòng ban",
          link: "/list-department",
          parentId: "department",
        },
      ],
    },
    {
      id: "account",
      label: "Quản lý tài khoản",
      icon: "mdi mdi-account-circle-outline",
      link: "/account",
      stateVariables: isAccount,
      click: function (e) {
        e.preventDefault();
        setIsAccount(!isAccount);
        setIscurrentState("Account");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-account",
          label: "Thêm tài khoản",
          link: "/add-account",
          parentId: "account",
        },
        {
          id: "list-account",
          label: "Danh sách tài khoản",
          link: "/list-account",
          parentId: "account",
        },
      ],
    },
    // {
    //   id: "interaction",
    //   label: "Quản lý tương tác",
    //   icon: "mdi mdi-account-switch-outline",
    //   link: "/interaction",
    // },
    // {
    //   id: "report",
    //   label: "Thống kê báo cáo",
    //   icon: "mdi mdi-chart-areaspline",
    //   link: "/report",
    // },
    {
      id: "file-manager",
      label: "Thư viện",
      icon: "ri-gallery-line",
      link: "/file-manager",
    },
    {
      id: "report",
      label: "Thống kê",
      icon: "mdi mdi-google-analytics",
      link: "/report",
    },
    {
      id: "feedback",
      label: "Phản hồi độc giả",
      icon: "mdi mdi-smart-card-reader",
      link: "/feedback",
    },
    // {
    //   id: "list-sitemap",
    //   label: "Quản lý sitemap",
    //   icon: "bx bx-purchase-tag",
    //   link: "/list-sitemap",
    // },
    {
      id: "notification",
      label: "Thông báo",
      icon: "mdi mdi-bell-outline",
      link: "/notifications",
    },

    {
      id: "menu",
      label: "Quản lý giao diện",
      icon: "bx bx-list-ol",
      link: "/menu",
      stateVariables: isMenu,
      click: function (e) {
        e.preventDefault();
        setIsMenu(!isMenu);
        setIscurrentState("Menu");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "menu",
          label: "Menu",
          link: "/menu",
          parentId: "menu",
        },
        {
          id: "homemenu",
          label: "Trang chủ",
          link: "/home-menu",
          parentId: "menu",
        },
        {
          id: "hotlink",
          label: "Hot Link",
          link: "/hot-link",
          parentId: "menu",
        },
        {
          id: "header",
          label: "Header",
          link: "/header",
          parentId: "menu",
        },
        {
          id: "footer",
          label: "Footer",
          link: "/footer",
          parentId: "menu",
        },
        {
          id: "favicon",
          label: "Favicon",
          link: "/web-favicon",
          parentId: "menu",
        },
      ],
    },
    {
      id: "article-live",
      label: "Quản lý tường thuật",
      icon: "ri-live-line",
      link: "/article-live",
      stateVariables: isArticleLive,
      click: function (e) {
        e.preventDefault();
        setIsArticleLive(!isArticleLive);
        setIscurrentState("ArticleLive");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-article-live",
          label: "Thêm bài tường thuật",
          link: "/add-article-live",
          parentId: "article-live",
        },
        {
          id: "list-article-live",
          label: "Danh sách bài tường thuật",
          link: "/list-article-live",
          parentId: "article-live",
        },
      ],
    },
    {
      id: "newspaper",
      label: "Quản lý báo in",
      icon: "ri-newspaper-line",
      link: "/newspaper",
      stateVariables: isNewspaper,
      click: function (e) {
        e.preventDefault();
        setIsNewspaper(!isNewspaper);
        setIscurrentState("Newspaper");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-article-live",
          label: "Tạo bài báo in",
          link: "/add-newspaper",
          parentId: "newspaper",
        },
        {
          id: "list-article-live",
          label: "Danh sách bài báo in",
          link: "/list-newspaper",
          parentId: "newspaper",
        },
        {
          id: "draft-article-live",
          label: "Danh sách báo in bài nháp",
          link: "/draft-newspaper",
          parentId: "newspaper",
        },
        {
          id: "pending-article-live",
          label: "Danh sách báo in chờ duyệt",
          link: "/pending-newspaper",
          parentId: "newspaper",
        },
        {
          id: "publish-article-live",
          label: "Danh sách báo in đã duyệt",
          link: "/publish-newspaper",
          parentId: "newspaper",
        },
        {
          id: "add-article-live",
          label: "Tạo maket số báo",
          link: "/add-maket",
          parentId: "newspaper",
        },
        {
          id: "list-article-live",
          label: "Danh sách maket số báo",
          link: "/list-maket",
          parentId: "newspaper",
        },
      ],
    },
  ];
  const [listRoleFunction, setListRoleFunction] = useState([]);
  function getDifference(array1, array2) {
    if (!array1 || !array2) {
      ToastCustom("Lỗi ở menu con mới sửa đổi!", "fail");
      return;
    }
    return array1.filter((object1) => {
      return array2.some((object2) => {
        return object1.link === object2.url;
      });
    });
  }
  const [isTokenFound, setTokenFound] = useState(false);
  async function tokenFunc() {
    let data;
    data = await getFCMToken(setTokenFound);
    if (data) {
      const res = await getUserDeviceIDFirebase({
        device_id: data,
        user_id: 1,
      });
    }
    return data;
  }
  useEffect(() => {
    if (isUserAuthenticated()) {
      // setListRoleFunction(menuItems);
      getAPIListFunctionByUser().then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          getAPITotalArticle().then((resTotal) => {
            dispatch(handleSaveAccountPermisson(res.data.list));
            tokenFunc(); //token FCM
            // set tạm thời
            var filterRoute = [];
            var target = {};
            res.data.list.filter((g) => {
              if (g.child_functions.length > 0) {
                menuItems.filter((e) => {
                  if (g.url === e.link) {
                    target = e;
                    filterRoute.push(target);
                  }
                });
                const find = filterRoute.filter((l) => l.link === g.url);
                if (find.length == 0) {
                  ToastCustom(`Lỗi ở menu cha: ${g.function_name}!`, "fail");
                  return;
                }
                const li = getDifference(find[0].subItems, g.child_functions);
                if (resTotal.status > 0) {
                  li.filter((sub) => {
                    if (sub.id === "list-article") {
                      sub.label += ` (${resTotal.data.totalTong})`;
                    }
                    if (sub.id === "draft-article") {
                      sub.label += ` (${resTotal.data.totalBaiNhap})`;
                    }
                    if (sub.id === "pending-article") {
                      sub.label += ` (${resTotal.data.totalBaiChoDuyet})`;
                    }
                    if (sub.id === "publish-article") {
                      sub.label += ` (${resTotal.data.totalBaiXuatBan})`;
                    }
                  });
                }
                filterRoute.forEach((l) => {
                  if (l.link === g.url) {
                    l.subItems = li;
                  }
                });
              } else {
                menuItems.filter((e) => {
                  if (g.url === e.link) {
                    target = e;
                    filterRoute.push(target);
                  }
                });
              }
            });
            setListRoleFunction(filterRoute);
          });
        }
      });
    }
  }, []);
  return <React.Fragment>{listRoleFunction}</React.Fragment>;
};
export default Navdata;
