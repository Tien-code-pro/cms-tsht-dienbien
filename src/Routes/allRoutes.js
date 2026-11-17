import React from "react";
import { Navigate } from "react-router-dom";

//login
import Login from "../pages/TSHT/Authentication/Login";
import ForgetPasswordPage from "../pages/TSHT/Authentication/ForgetPassword";
import Logout from "../pages/TSHT/Authentication/Logout";
import Register from "../pages/TSHT/Authentication/Register";

import FileManager from "../pages/TSHT/FileManager/FileManager";
import Account from "../pages/TSHT/Account/Account";
import Article from "../pages/TSHT/Article/Article";
import ArticlePrice from "../pages/TSHT/ArticlePrice/ArticlePrice";

import Category from "../pages/TSHT/Category/Category";
import Comment from "../pages/TSHT/Comment/Comment";
import Department from "../pages/TSHT/Department/Department";
import Home from "../pages/TSHT/Home/Home";
import HotArticle from "../pages/TSHT/HotArticle/HotArticle";
import Interaction from "../pages/TSHT/Interaction/Interaction";
import Report from "../pages/TSHT/Report/Report";
import Role from "../pages/TSHT/Role/Role";
import Setting from "../pages/TSHT/Setting/Setting";
import Tag from "../pages/TSHT/Tag/Tag";
import AddArticle from "../pages/TSHT/Article/AddArticle";
import AddTag from "../pages/TSHT/Tag/AddTag";
import UpdateTag from "../pages/TSHT/Tag/UpdateTag";
import AddDepartment from "../pages/TSHT/Department/AddDepartment";
import UpdateDepartment from "../pages/TSHT/Department/UpdateDepartment";
import AddCategory from "../pages/TSHT/Category/AddCategory";
import UpdateCategory from "../pages/TSHT/Category/UpdateCategory";
import UpdateAccount from "../pages/TSHT/Account/UpdateAccount";
import CreateAccount from "../pages/TSHT/Account/AddAccount";
import AddRole from "../pages/TSHT/Role/AddRole";
import LiveChannel from "../pages/TSHT/LiveChannel/LiveChannel";
import AddLiveChannel from "../pages/TSHT/LiveChannel/AddLiveChannel";
import UpdateLiveChannel from "../pages/TSHT/LiveChannel/UpdateLiveChannel";
import Epg from "../pages/TSHT/Epg/Epg";
import HotNews from "../pages/TSHT/HotArticle/HotNews";
import FocusNews from "../pages/TSHT/HotArticle/FocusNews";
// import AddEpg from "../pages/TSHT/Epg/AddEpg";
import GroupFunction from "../pages/TSHT/GroupFunction/GroupFunction";
import AddGroupFunction from "../pages/TSHT/GroupFunction/AddGroupFunction";
import UpdateRole from "../pages/TSHT/Role/UpdateRole";
import Function from "../pages/TSHT/Function/Function";
import AddFunction from "../pages/TSHT/Function/AddFunction";
import UpdateGroupFunction from "../pages/TSHT/GroupFunction/UpdateGroupFunction";
import ListEvents from "../pages/TSHT/Events/ListEvents";
import AddEvents from "../pages/TSHT/Events/AddEvents";
import SettingFunction from "../pages/TSHT/GroupFunction/SettingFunction";
import EditFunction from "../pages/TSHT/Function/EditFunction";
import UpdateArticle from "../pages/TSHT/Article/UpdateArticle";
import UpdatedEvents from "../pages/TSHT/Events/UpdatedEvents";
import ListAdvertisement from "../pages/TSHT/Advertisement/ListAdvertisement";
import AddAdvertisement from "../pages/TSHT/Advertisement/AddAdvertisement";
import EditAdvertisement from "../pages/TSHT/Advertisement/EditAdvertisement";
import DraftArticle from "../pages/TSHT/Article/DraftArticle";
import PendingArticle from "../pages/TSHT/Article/PendingArticle";
import Header from "../pages/TSHT/Menu/Header";
import Footer from "../pages/TSHT/Menu/Footer";
import Menu from "../pages/TSHT/Menu/Menu";
import UpdateProfile from "../pages/TSHT/Account/UpdateProfile";
import NewsMarket from "../pages/TSHT/NewPaper/Market/NewsMarket";
import NormalPaper from "../pages/TSHT/NewPaper/NewsPaperNormal/NewsPaperNomal";
import ListPaperNormal from "../pages/TSHT/NewPaper/ListPaperNormal";
import ListMarket from "../pages/TSHT/NewPaper/ListMarket";
import ArticleLive from "../pages/TSHT/ArticleLive/ArticleLive";
import AddArticleLive from "../pages/TSHT/ArticleLive/AddArticleLive";
import UpdateArticleLive from "../pages/TSHT/ArticleLive/UpdateArticleLive";
import ListContent from "../pages/TSHT/ArticleLive/ArticleLiveContent/ListContent";
import AddContent from "../pages/TSHT/ArticleLive/ArticleLiveContent/AddContent";
import UpdateContent from "../pages/TSHT/ArticleLive/ArticleLiveContent/UpdateContent";
import HotLink from "../pages/TSHT/Menu/HotLink";
import AddHotLink from "../pages/TSHT/Menu/AddHotLink";
import UpdateHotLink from "../pages/TSHT/Menu/UpdateHotLink";
import UpdatePaper from "../pages/TSHT/Article/UpdatePaper";
import UpdateArticlePrint from "../pages/TSHT/NewPaper/UpdatePaper";
import ArticlePricePrint from "../pages/TSHT/ArticlePrice/ArticlePricePrint";
import AccountReader from "../pages/TSHT/Reader/AccountReader";
import AccountReaderDetail from "../pages/TSHT/Reader/AccountReaderDetail";
import CommentReader from "../pages/TSHT/Reader/CommentReader";
import MailReader from "../pages/TSHT/Reader/MailReader";
import InteractReader from "../pages/TSHT/Reader/InteractReader";
import ResponseReader from "../pages/TSHT/ResponseReader/ResponseReader";
import SiteMap from "../pages/TSHT/SiteMapView/SiteMap";
import AddSiteMap from "../pages/TSHT/SiteMapView/AddSiteMap";
import Favicon from "../pages/TSHT/Menu/Favicon";
import HomeMenu from "../pages/TSHT/Menu/HomeMenu";
import PublishArticle from "../pages/TSHT/Article/PublishArticle";
import ArticleTrash from "../pages/TSHT/Article/AticleTrash";
const authProtectedRoutes = [
  { path: "/apps-file-manager", component: <FileManager /> },
  { path: "/add-sitemap", component: <AddSiteMap /> },
  { path: "/all-sitemap", component: <SiteMap /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/home" />,
  },
  { path: "*", component: <Navigate to="/home" /> },
  { path: "/home", component: <Home /> },
  //TSHT

  { path: "/list-account", name: "list-account", component: <Account /> },
  { path: "/update-account/:id", component: <UpdateAccount /> },
  { path: "/update-profile/:id", component: <UpdateProfile /> },
  { path: "/add-account", component: <CreateAccount /> },

  { path: "/list-category", name: "list-category", component: <Category /> },
  { path: "/add-category", component: <AddCategory /> },
  { path: "/update-category/:id", component: <UpdateCategory /> },

  { path: "/comment", component: <Comment /> },

  {
    path: "/list-department",
    name: "list-department",
    component: <Department />,
  },
  { path: "/add-department", component: <AddDepartment /> },
  { path: "/update-department/:id", component: <UpdateDepartment /> },

  { path: "/file-manager", component: <FileManager /> },
  { path: "/add-newspaper", component: <NormalPaper /> },
  { path: "/add-maket", component: <NewsMarket /> },
  {
    path: "/list-newspaper",
    name: "list-newspaper",
    component: <ListPaperNormal typePage="all" />,
  },
  { path: "/list-maket", name: "list-maket", component: <ListMarket /> },

  { path: "/is-selected", component: <FocusNews /> },
  { path: "/interaction", component: <Interaction /> },
  { path: "/report", component: <Report /> },

  { path: "/setting", component: <Setting /> },

  { path: "/list-tag", name: "list-tag", component: <Tag /> },
  { path: "/add-tag", component: <AddTag /> },
  { path: "/update-tag/:id", component: <UpdateTag /> },

  {
    path: "/list-live-channel",
    name: "list-live-channel",
    component: <LiveChannel />,
  },
  { path: "/add-live-channel", component: <AddLiveChannel /> },
  { path: "/update-live-channel/:id", component: <UpdateLiveChannel /> },

  //events
  { path: "/list-events", name: "list-events", component: <ListEvents /> },
  { path: "/add-events", component: <AddEvents /> },
  { path: "/update-event/:id", component: <UpdatedEvents /> },

  //ads
  {
    path: "/list-advertisement",
    name: "list-advertisement",
    component: <ListAdvertisement />,
  },
  { path: "/add-advertisement", component: <AddAdvertisement /> },
  { path: "/update-advertisement/:id", component: <EditAdvertisement /> },

  //epg
  { path: "/epg/:id", component: <Epg /> },
  // { path: "/add-epg", component: <AddEpg /> },
  // article
  { path: "/add-article", component: <AddArticle /> },
  { path: "/list-article", name: "list-article", component: <Article /> },
  {
    path: "/draft-article",
    name: "list-draft-article",
    component: <DraftArticle />,
  },
  {
    path: "/pending-article",
    name: "list-pending-article",
    component: <PendingArticle />,
  },
  {
    path: "/publish-article",
    name: "list-publish-article",
    component: <PublishArticle />,
  },
  {
    path: "/article-trash",
    name: "article-trash",
    component: <ArticleTrash/>, //TODO: thêm component của ds thùng rác
  },
  { path: "/update-article/:id", component: <UpdateArticle /> },
  { path: "/update-newspaper/:id", component: <UpdateArticlePrint /> },
  {
    path: "/draft-newspaper",
    name: "list-draft-newspaper",
    component: <ListPaperNormal typePage="draft" />,
  },
  {
    path: "/pending-newspaper",
    name: "list-pending-newspaper",
    component: <ListPaperNormal typePage="pending" />,
  },
  {
    path: "/publish-newspaper",
    name: "list-publish-newspaper",
    component: <ListPaperNormal typePage="publish" />,
  },
  { path: "/article-price/common", component: <ArticlePrice /> },
  { path: "/article-price/newspaper", component: <ArticlePricePrint /> },
  { path: "/hot-article", component: <HotArticle /> },
  { path: "/oustanding", component: <HotNews /> },
  {
    path: "/list-article-live",
    name: "list-article-live",
    component: <ArticleLive />,
  },
  { path: "/add-article-live", component: <AddArticleLive /> },
  { path: "/update-article-live/:id", component: <UpdateArticleLive /> },
  { path: "/list-article-live-content/:id", component: <ListContent /> },
  { path: "/article-live-content-insert/:id", component: <AddContent /> },
  {
    path: "/article-live-content-update/:id/:arrLiveId",
    component: <UpdateContent />,
  },

  //role - quy trình
  { path: "/list-role", name: "list-role", component: <Role /> },
  { path: "/add-role", component: <AddRole /> },
  { path: "/update-role/:id", component: <UpdateRole /> },
  // phản hồi độc giả
  { path: "/feedback", component: <ResponseReader /> },
  // reader - bạn đọc
  { path: "/reader", component: <AccountReader /> },
  { path: "/reader/:id", component: <AccountReaderDetail /> },
  { path: "/comment-account-manage", component: <CommentReader /> },
  { path: "/mail-account-manage", component: <MailReader /> },
  { path: "/interact-account-manage", component: <InteractReader /> },
  //group-function - nhóm quyền
  {
    path: "/list-group-function",
    name: "list-group-function",
    component: <GroupFunction />,
  },
  { path: "/add-group-function", component: <AddGroupFunction /> },
  { path: "/update-group-function/:id", component: <UpdateGroupFunction /> },
  { path: "/setting-group-function/:id", component: <SettingFunction /> },
  //function - chức năng hệ thống - các quyền
  { path: "/list-function", name: "list-function", component: <Function /> },
  { path: "/add-function", component: <AddFunction /> },
  { path: "/edit-function/:id", component: <EditFunction /> },

  //menu
  { path: "/update-hot-link/:id", component: <UpdateHotLink /> },
  { path: "/add-hot-link", component: <AddHotLink /> },
  { path: "/hot-link", component: <HotLink /> },
  { path: "/header", component: <Header /> },
  { path: "/footer", component: <Footer /> },
  { path: "/menu", component: <Menu /> },
  { path: "/web-favicon", component: <Favicon /> },
  { path: "/home-menu", component: <HomeMenu /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
