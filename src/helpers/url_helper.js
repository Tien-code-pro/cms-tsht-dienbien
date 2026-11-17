//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/api/oauth/user-get-token";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET =
  "http://api-tsht.httt.vtcplay.vn/api/oauth/user-get-new-password";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";

// Calendar
export const GET_EVENTS = "/events";
export const GET_CATEGORIES = "/categories";
export const GET_UPCOMMINGEVENT = "/upcommingevents";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";

// Chat
export const GET_DIRECT_CONTACT = "/chat";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "add/message";
export const GET_CHANNELS = "/channels";
export const DELETE_MESSAGE = "delete/message";

//Mailbox
export const GET_MAIL_DETAILS = "/mail";
export const DELETE_MAIL = "/delete/mail";

// Ecommerce
// Product
export const GET_PRODUCTS = "/apps/product";
export const DELETE_PRODUCT = "/apps/product";
export const ADD_NEW_PRODUCT = "/apps/product";
export const UPDATE_PRODUCT = "/apps/product";

// Orders
export const GET_ORDERS = "/apps/order";
export const ADD_NEW_ORDER = "/apps/order";
export const UPDATE_ORDER = "/apps/order";
export const DELETE_ORDER = "/apps/order";

// Customers
export const GET_CUSTOMERS = "/apps/customer";
export const ADD_NEW_CUSTOMER = "/apps/customer";
export const UPDATE_CUSTOMER = "/apps/customer";
export const DELETE_CUSTOMER = "/apps/customer";

// Sellers
export const GET_SELLERS = "/sellers";

// Project list
export const GET_PROJECT_LIST = "/project/list";

// Task
export const GET_TASK_LIST = "/apps/task";
export const ADD_NEW_TASK = "/apps/task";
export const UPDATE_TASK = "/apps/task";
export const DELETE_TASK = "/apps/task";

// CRM
// Conatct
export const GET_CONTACTS = "/apps/contact";
export const ADD_NEW_CONTACT = "/apps/contact";
export const UPDATE_CONTACT = "/apps/contact";
export const DELETE_CONTACT = "/apps/contact";

// Companies
export const GET_COMPANIES = "/apps/company";
export const ADD_NEW_COMPANIES = "/apps/company";
export const UPDATE_COMPANIES = "/apps/company";
export const DELETE_COMPANIES = "/apps/company";

// Lead
export const GET_LEADS = "/apps/lead";
export const ADD_NEW_LEAD = "/apps/lead";
export const UPDATE_LEAD = "/apps/lead";
export const DELETE_LEAD = "/apps/lead";

// Deals
export const GET_DEALS = "/deals";

// Crypto
export const GET_TRANSACTION_LIST = "/transaction-list";
export const GET_ORDRER_LIST = "/order-list";

// Invoice
export const GET_INVOICES = "/apps/invoice";
export const ADD_NEW_INVOICE = "/apps/invoice";
export const UPDATE_INVOICE = "/apps/invoice";
export const DELETE_INVOICE = "/apps/invoice";

// TicketsList
export const GET_TICKETS_LIST = "/apps/ticket";
export const ADD_NEW_TICKET = "/apps/ticket";
export const UPDATE_TICKET = "/apps/ticket";
export const DELETE_TICKET = "/apps/ticket";

// Dashboard Analytics

// Sessions by Countries
export const GET_ALL_DATA = "/all-data";
export const GET_HALFYEARLY_DATA = "/halfyearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

// Audiences Metrics
export const GET_ALLAUDIENCESMETRICS_DATA = "/allAudiencesMetrics-data";
export const GET_MONTHLYAUDIENCESMETRICS_DATA = "/monthlyAudiencesMetrics-data";
export const GET_HALFYEARLYAUDIENCESMETRICS_DATA =
  "/halfyearlyAudiencesMetrics-data";
export const GET_YEARLYAUDIENCESMETRICS_DATA = "/yearlyAudiencesMetrics-data";

// Users by Device
export const GET_TODAYDEVICE_DATA = "/todayDevice-data";
export const GET_LASTWEEKDEVICE_DATA = "/lastWeekDevice-data";
export const GET_LASTMONTHDEVICE_DATA = "/lastMonthDevice-data";
export const GET_CURRENTYEARDEVICE_DATA = "/currentYearDevice-data";

// Audiences Sessions by Country
export const GET_TODAYSESSION_DATA = "/todaySession-data";
export const GET_LASTWEEKSESSION_DATA = "/lastWeekSession-data";
export const GET_LASTMONTHSESSION_DATA = "/lastMonthSession-data";
export const GET_CURRENTYEARSESSION_DATA = "/currentYearSession-data";

// Dashboard CRM

// Balance Overview
export const GET_TODAYBALANCE_DATA = "/todayBalance-data";
export const GET_LASTWEEKBALANCE_DATA = "/lastWeekBalance-data";
export const GET_LASTMONTHBALANCE_DATA = "/lastMonthBalance-data";
export const GET_CURRENTYEARBALANCE_DATA = "/currentYearBalance-data";

// Deal type
export const GET_TODAYDEAL_DATA = "/todayDeal-data";
export const GET_WEEKLYDEAL_DATA = "/weeklyDeal-data";
export const GET_MONTHLYDEAL_DATA = "/monthlyDeal-data";
export const GET_YEARLYDEAL_DATA = "/yearlyDeal-data";

// Sales Forecast

export const GET_OCTSALES_DATA = "/octSales-data";
export const GET_NOVSALES_DATA = "/novSales-data";
export const GET_DECSALES_DATA = "/decSales-data";
export const GET_JANSALES_DATA = "/janSales-data";

// Dashboard Ecommerce
// Revenue
export const GET_ALLREVENUE_DATA = "/allRevenue-data";
export const GET_MONTHREVENUE_DATA = "/monthRevenue-data";
export const GET_HALFYEARREVENUE_DATA = "/halfYearRevenue-data";
export const GET_YEARREVENUE_DATA = "/yearRevenue-data";

// Dashboard Crypto
// Portfolio
export const GET_BTCPORTFOLIO_DATA = "/btcPortfolio-data";
export const GET_USDPORTFOLIO_DATA = "/usdPortfolio-data";
export const GET_EUROPORTFOLIO_DATA = "/euroPortfolio-data";

// Market Graph
export const GET_ALLMARKETDATA_DATA = "/allMarket-data";
export const GET_YEARMARKET_DATA = "/yearMarket-data";
export const GET_MONTHMARKET_DATA = "/monthMarket-data";
export const GET_WEEKMARKET_DATA = "/weekMarket-data";
export const GET_HOURMARKET_DATA = "/hourMarket-data";

// Dashboard Crypto
// Project Overview
export const GET_ALLPROJECT_DATA = "/allProject-data";
export const GET_MONTHPROJECT_DATA = "/monthProject-data";
export const GET_HALFYEARPROJECT_DATA = "/halfYearProject-data";
export const GET_YEARPROJECT_DATA = "/yearProject-data";

// Project Status
export const GET_ALLPROJECTSTATUS_DATA = "/allProjectStatus-data";
export const GET_WEEKPROJECTSTATUS_DATA = "/weekProjectStatus-data";
export const GET_MONTHPROJECTSTATUS_DATA = "/monthProjectStatus-data";
export const GET_QUARTERPROJECTSTATUS_DATA = "/quarterProjectStatus-data";

// Dashboard NFT
// Marketplace
export const GET_ALLMARKETPLACE_DATA = "/allMarketplace-data";
export const GET_MONTHMARKETPLACE_DATA = "/monthMarketplace-data";
export const GET_HALFYEARMARKETPLACE_DATA = "/halfYearMarketplace-data";
export const GET_YEARMARKETPLACE_DATA = "/yearMarketplace-data";

// Project
export const ADD_NEW_PROJECT = "/add/project";
export const UPDATE_PROJECT = "/update/project";
export const DELETE_PROJECT = "/delete/project";

// Pages > Team
export const GET_TEAMDATA = "/teamData";
export const DELETE_TEAMDATA = "/delete/teamData";
export const ADD_NEW_TEAMDATA = "/add/teamData";
export const UPDATE_TEAMDATA = "/update/teamData";

// File Manager
// Folder
export const GET_FOLDERS = "/folder";
export const DELETE_FOLDER = "/delete/folder";
export const ADD_NEW_FOLDER = "/add/folder";
export const UPDATE_FOLDER = "/update/folder";

// File
export const GET_FILES = "/file";
export const DELETE_FILE = "/delete/file";
export const ADD_NEW_FILE = "/add/file";
export const UPDATE_FILE = "/update/file";

// To do
export const GET_TODOS = "/todo";
export const DELETE_TODO = "/delete/todo";
export const ADD_NEW_TODO = "/add/todo";
export const UPDATE_TODO = "/update/todo";

// To do Project
export const GET_PROJECTS = "/projects";
export const ADD_NEW_TODO_PROJECT = "/add/project";

//JOB APPLICATION
export const GET_APPLICATION_LIST = "/application-list";

//JOB APPLICATION
export const GET_API_KEY = "/api-key";

//TSHT
var urlAPI = window._env_.REACT_APP_API_URL;
export const GET_LIST_TAG = `/cms/tag-get-list-by-info`;
export const GET_TAG_BY_ID = `/cms/tag-get-by-id`;
export const POST_TAG = `/cms/tag-insert`;
export const PUT_TAG = `/cms/tag-update`;
export const DEL_TAG = `/cms/tag-delete`;

export const GET_LIST_DEPARTMENT = `/cms/department-get-list`;
export const GET_DEPARTMENT_BY_ID = `/cms/department-get-by-id`;
export const POST_DEPARTMENT = `/cms/department-insert`;
export const PUT_DEPARTMENT = `/cms/department-update`;
export const DEL_DEPARTMENT = `/cms/department-delete`;

export const GET_LIST_CATEGORY = `/cms/category-get-list`;
export const GET_TREE_LIST_CATEGORY = `/cms/category-get-list-full-level`;
export const GET_TREE_LIST_CATEGORY_BY_NAME = `/cms/category-get-list-by-category-name`;
export const GET_TREE_LIST_CATEGORY_BY_USER = `/cms/category-get-list-full-level-by-user`;
export const GET_CATEGORY_BY_ID = `/cms/category-get-by-id`;
export const POST_CATEGORY = `/cms/category-insert`;
export const PUT_CATEGORY = `/cms/category-update`;
export const DEL_CATEGORY = `/cms/category-delete`;
export const UPDATE_CATEGORY_DISPLAY = `/cms/category-update-status`;

export const UPDATE_AVATAR_BASE64 = `/cms/upload-image-base64string`;

export const GET_LIST_ACCOUNT_INFO = `/cms/get-user-full-info`;
export const GET_LIST_ACCOUNT = `/cms/user-get-by-info`;
export const GET_LIST_ACCOUNT_PERMISSION = `/cms/user-get-list-by-permission`;
export const GET_LIST_USER = `/cms/user-get-by-info`;
export const GET_ACCOUNT_BY_ID = `/cms/user-get-id`;
export const POST_ACCOUNT = `/cms/user-insert`;
export const PUT_ACCOUNT = `/cms/user-update`;
export const DEL_ACCOUNT = `/cms/user-delete`;

// sitemap
export const GET_LIST_SITEMAP = `/cms/sitemap-get-list-filter`;
//COMMENT
export const GET_LIST_FEEDBACK = `/cms/get-list-account-feedback-with-filter`;
export const GET_LIST_COMMENT = `/cms/article-comment-get-list`;
export const GET_COMMENT_BY_ID = `/cms/article-comment-get-by-article-id`;
export const APPROVE_COMMENT = `/cms/article-comment-approve-comment`;
export const POST_COMMENT = `/cms/article-comment-insert`;
export const PUT_COMMENT = `/cms/article-comment-update`;
export const DEL_COMMENT = `/cms/article-comment-delete-comment`;

//ROLE
export const GET_LIST_ROLE = `/cms/role-get-list`;
export const GET_ROLE_BY_ID = `/cms/role-get-by-role-id`;
export const GET_ROLE_BY_ARTICLE_ID = `/cms/article-get-role-step-info`;
export const GET_ROLE_BY_ARTICLE_PRINT_ID = `/cms/article-print-get-role-step-info`;
export const GET_ROLE_ARLIVE_BY_ARTICLE_ID = `/cms/article-live-get-role-step-info`;
export const POST_ROLE_TRANSITION_STEP = `/cms/article-transition-step`;
export const POST_ROLE_TRANSITION_STEP_PRINT = `/cms/article-print-send-approval`;
export const POST_ROLE_TRANSITION_ARTICLE_LIVE_CONTENT = `/cms/article-live-content-send-approval`;
export const POST_ROLE_TRANSITION_PUBLISH_STEP = `/cms/article-publish-direct`;
export const POST_APPROVAL_ARTICLE_PRINT = `/cms/approval-article-print`;
export const POST_ROLE_RETURN_STEP = `/cms/article-return-step`;
export const POST_ROLE_RETURN_STEP_PRINT = `/cms/article-print-return-step`;
export const POST_ROLE_TRANSITION_REMOVE_PUBLISH_STEP = `/cms/article-unpublish`;
export const GET_ARTICLE_PRINT_REVOKE_APPROVAL = `/cms/article-print-revoke-approval`;
export const POST_ROLE = `/cms/role-insert`;
export const PUT_ROLE = `/cms/role-update`;
export const DEL_ROLE = `/cms/role-delete`;
export const TOTAL_ARTICLE = `/cms/article-get-count-by-menu`;

//PROCESS
export const GET_LIST_PROCESS = `/cms/role-get-list`;
export const GET_PROCESS_BY_ID = `/cms/role-get-by-article-type-id`;
export const POST_PROCESS = `/cms/role-insert`;
export const PUT_PROCESS = `/cms/role-update`;
export const DEL_PROCESS = `/cms/role-delete`;

//CHANNEL
export const GET_LIST_CHANNEL = `/cms/live-channel-get-list-by-title`;
export const GET_CHANNEL_BY_ID = `/cms/live-channel-get-by-id`;
export const POST_CHANNEL = `/cms/live-channel-insert`;
export const PUT_CHANNEL = `/cms/live-channel-update`;
export const DEL_CHANNEL = `/cms/live-channel-delete`;
export const GET_LIST_LIVE_CHANNEL_SOURCE_TYPE = `/cms/live-channel-get-list-source-type`;
export const GET_UPDATE_STATUS = `/cms/live-channel-update-status`;
export const GET_UPDATE_DRM_STATUS = `/cms/live-channel-update-drm-status`;

//EPG
export const GET_EPG_LIST_BY_DATE_AND_CHANNEL = `/cms/epg-get-list-by-date-and-channel-id`;
export const GET_EPG_GET_BY_ID = `/cms/epg-get-by-id`;
export const GET_EPG_GET_LIST_BY_CHANNEL_ID = `/cms/epg-get-list-by-date-and-channel-id`;
export const GET_EPG_DOWBLOAD_FILE = `/cms/epg-download-file`;
export const DEL_EPG = `/cms/epg-delete`;
export const INSERT_LIST_EPG = "/cms/epg-replace-list";
export const IMPORT_LIST_EPG = "/cms/epg-import-file";

//ARTICLE
export const GET_LIST_ARTICLE_BY_FILTER = `/cms/article-get-list-filter`;
export const GET_LIST_ARTICLE_TRASH_BY_FILTER = `/cms/deleted-article-get-list-filter`;
export const GET_LIST_ARTICLE_DRAFT = `/cms/article-draft-get-list`;
export const GET_LIST_ARTICLE_PENDING = `/cms/article-pending-approval-get-list`;
export const GET_LIST_ARTICLE_PUBLISH = `/cms/article-publish-get-list`;
export const GET_LIST_MARKET_BY_FILTER = `/cms/market-get-list-filter`;
export const GET_LIST_ARTICLE_PRINT_BY_FILTER = `/cms/article-print-get-list-filter`;
export const GET_LIST_ARTICLE_PRINT_DRAFT = `/cms/article-print-draft-get-list`;
export const GET_LIST_ARTICLE_PRINT_PENDING = `/cms/article-print-pending-approval-get-list`;
export const GET_LIST_ARTICLE_PRINT_PUBLISH = `/cms/article-print-publish-get-list`;
export const GET_LIST_LIVE_ARTICLE_BY_FILTER = `/cms/article-live-get-list`;
export const GET_LIST_ARTICLE_TYPE = `/cms/article-type-get-list`;
export const GET_LIST_ARTICLE_TYPE_AVAILABILITY = `/cms/article-type-get-list-availability`;
export const UPDATE_COMMENT_PUBLISH = `/cms/change-comment-permission-status`;
export const UPDATE_FOCUS_ARTICLE_PUBLISH = `/cms/set-article-outstanding`;
export const UPDATE_ARTICLE_MEDIA = `/cms/set-article-media`;
export const CHECK_PUBLISH_ARTICLE_BY_USER = `/cms/check-publish-article-by-user`;

//REPORT
export const GET_REPORT_LIST_ARTICLE_BY_FILTER = `/cms/report-list-articles-by-info`;
export const GET_REPORT_LIST_ARTICLE_VIEW_COUNT_BY_CATEGORY = `/cms/report-articles-view-count-by-category`;
export const GET_SORT_REPORT_LIST_ARTICLE_BY_FILTER = `/cms/sort-report-list-articles-by-info`;
export const GET_FILE_EXCEL_ARTICLE_REPORT = `/cms/report-list-articles-by-info-export-excel`;
export const GET_LIST_AUTHOR_BY_FILE = `/cms/author-get-list-by-file`;
// export const GET_LIST_AUTHOR = `/cms/author-get-list-by-article`;
export const GET_LIST_AUTHOR = `/cms/article-get-other-author`;
export const GET_LIST_OTHER_AUTHOR = `/cms/article-get-other-author`;
export const EXPORT_DOC_ARTICLE = `/cms/get-document`;
export const EXPORT_DOC_PRINT_ARTICLE = `/cms/get-document-article-print`;
export const GET_LIST_ARTICLE_RELATED = `/cms/article-get-relate`;
export const ARTICLE_GET_FILE_LIST = `/cms/article-file-get-list`;
export const ARTICLE_LIVE_CONTENt_GET_FILE_LIST = `/cms/article-live-file-get-list`;

export const ARTICLE_GET_LIST_BY_OUTSTANDING =
  "/cms/article-get-list-by-outstanding";

export const ARTICLE_GET_LIST_BY_OUTSTANDING_SELECTED =
  "/cms/article-get-list-by-outstanding-selected";

export const ARTICLE_UPDATE_ORDER_POSITON =
  "/cms/article-update-order-position";

export const STATIS_ARTICLE_PRICE_GET_LIST =
  "/cms/statistical-article-price-get-list";
export const ARTICLE_PRICE_EXPORT_FILE_EXCEL =
  "/cms/article-price-export-file-excel";
export const STATIS_ARTICLE_PRICE_GET_LIST_PRINT =
  "/cms/statistical-price-article-print-get-list";
export const ARTICLE_PRICE_EXPORT_FILE_EXCEL_PRINT =
  "/cms/price-article-print-export-file-excel";
export const ARTICLE_GET_LIST_AUTHOR = "/cms/author-get-list-by-article";
export const ARTICLE_GET_TYPE_LIST = "/cms/article-type-get-list";
export const POST_ARTICLE = `/cms/article-insert`;
export const POST_ARTICLE_PRINT = `/cms/article-print-insert`;
export const POST_LIVE_ARTICLE = `/cms/article-live-insert`;
export const POST_LIVE_CONTENT_ARTICLE = `/cms/article-live-content-insert`;
export const PUT_LIVE_ARTICLE = `/cms/article-live-update`;
export const PUT_LIVE_CONTENT_ARTICLE = `/cms/article-live-content-update`;
export const ARTICLE_LIVE_GET_LIST_CONTENT = `/cms/article-live-content-get-list`;
export const PUT_ARTICLE = `/cms/article-update`;
export const PUT_ARTICLE_PRINT = `/cms/article-print-update`;
export const PUBLISH_ARTICLE_LIVE = `/cms/article-live-content-publish`;
export const RETURN_ARTICLE_LIVE = `/cms/article-live-content-return-step`;
export const UNPUBLISHED_ARTICLE_LIVE = `/cms/article-live-content-unpublish`;
export const DEL_ARTICLE = `/cms/article-delete`;
export const RESTORE_ARTICLE = `/cms/article-restore`;
export const DELETE_RESTORE_ARTICLE = `/cms/article-hard-delete`;
export const DEL_ARTICLE_PRINT = `/cms/article-print-delete`;
export const DEL_LIVE_ARTICLE = `/cms/article-live-delete`;
export const DEL_LIVE_CONTENT_ARTICLE = `/cms/article-live-content-delete`;
export const GET_ARTICLE_BY_ID = `/cms/article-get-by-id`;
export const GET_ARTICLE_PRINT_BY_ID = `/cms/article-print-get-by-id`;
export const GET_ARTICLE_LIVE_BY_ID = `/cms/article-live-get-by-id`;
export const GET_ARTICLE_LIVE_CONTENT_BY_ID = `/cms/article-live-content-get-by-id`;

export const GET_ARTICLE_HISTORY = `/cms/article-history-get-list`;
export const GET_ARTICLE_PRINT_HISTORY = `/cms/article-print-history-get-list`;
export const CREATE_ARTICLE_PRICE = `/cms/article-price-insert`;
export const GET_ARTICLE_PRICE_BY_ID = `/cms/article-price-get-by-article-id`;
export const GET_ARTICLE_PRINT_PRICE_BY_ID = `/cms/article-price-get-by-article-print-id`;
export const PUT_ARTICLE_PRICE = `/cms/article-price-update`;
export const GET_ARTICLE_WATERMARK = `/cms/get-image-watermark-in-article`;

//Group Function
export const GET_LIST_GROUP_FUNCTION = `/cms/get-list-group`;
export const GET_DETAIL_GROUP_FUNCTION = `/cms/get-list-group`;
export const CREATE_GROUP_FUNCTION = `/cms/insert-group`;
export const UPDATE_GROUP_FUNCTION = `/cms/update-group`;
export const DELETE_GROUP_FUNCTION = `/cms/delete-group`;
export const GET_GROUP_FUNCTION = `/cms/get-group-function`;
export const INSERT_FUNCTION_GROUP = `/cms/insert-group-function`;
export const DELETE_FUNCTION_GROUP = `/cms/delete-group-function`;

//Function
export const GET_LIST_FUNCTION_BY_USER = `/cms/user-get-function-permission`;
export const GET_LIST_FUNCTION = `/cms/get-list-function`;
export const CREATE_FUNCTION = `/cms/insert-function`;
export const UPDATE_FUNCTION = `/cms/update-functions`;
export const DELETE_FUNCTION = `/cms/delete-function`;

//media
export const GET_LIST_MEDIA_FILE = `/cms/file-info-get-list-manage`;
export const CREATE_LIST_MEDIA_FILE = `/cms/file-info-upload-new`;
// export const CREATE_LIST_MEDIA_FILE_NEW = `/cms/file-info-upload-new`;
export const DELETE_LIST_MEDIA_FILE = `/cms/file-info-delete`;
export const PUBLIC_FILE_MEDIA = `/cms/file-info-update-is-public`;
export const CREATE_MULTIPLE_MEDIA_FILE = `/cms/file-image-upload-multiple`;
export const CREATE_SHORT_VIDEO_FILE = `/cms/file-short-video-upload-new`;
//EVENTS
export const GET_LIST_EVENT = `/cms/events-get-list`;
export const DEL_EVENT = `/cms/events-delete`;
export const POST_EVENT = `/cms/events-insert`;
export const PUT_EVENT = `/cms/events-update`;
export const GET_EVENT_BY_ID = `/cms/events-get-by-id`;
export const GET_UPDATE_EVENT_STATUS = `/cms/event-update-status`;
export const GET_UPDATE_EVENT_DRM_STATUS = `/cms/event-update-drm-status`;

//ads
export const GET_LIST_ADS = `/cms/ads-get-by-multi-info`;
export const DEL_ADS = `/cms/ads-delete`;
export const POST_ADS = `/cms/ads-insert`;
export const GET_LIST_PAGE_TYPE = `/cms/ads-get-page-type`;
export const GET_LIST_DISPLAY_TYPE = `/cms/ads-get-display-position`;
export const GET_ADS_BY_ID = `/cms/ads-get-by-id`;
export const PUT_ADS = `/cms/ads-update`;
export const POST_DISPLAY_ADS = `/cms/ads-update-display`;
export const POST_DISPLAY_ARTICLE_LIVE = `/cms/article-live-update-active`;

// giao dien
export const PUT_HEADER = `/cms/header-update`;
export const PUT_FAVICON = `/cms/update-favicon`;
export const GET_HEADER_BY_ID = `/cms/header-get-info`;
export const GET_FAVICON_BY_ID = `/cms/favicon-get-info`;
export const PUT_FOOTER = `/cms/footer-update`;
export const GET_FOOTER_BY_ID = `/cms/footer-get-info`;
export const ADD_HOT_LINK = `/cms/hot-link-insert`;
export const UPDATE_HOT_LINK = `/cms/update-hot-link`;
export const DELETE_HOT_LINK = `/cms/hot-link-delete`;
export const GET_LIST_HOT_LINK = `/cms/hot-link-get-list-by-info`;
export const UPDATE_LIST_HOT_LINK = `/cms/hot-link-update-display-order-list`;

export const MENU_GET_LIST = "/cms/menu-get-list";
export const MENU_UPDATE = "/cms/menu-update-list";
export const MENU_GET_LIST_Home = "/cms/menu-navigate-get-list";
export const MENU_UPDATE_Home = "/cms/menu-navigate-update-list";

//dashboard
export const GET_LIST_STATUS_LINE_CHART =
  "/cms/report-articles-by-top-category-by-status-time-select";
export const GET_LIST_CHART_MOST_READ = "/cms/report-articles-view-by-time";
export const GET_LIST_REPORT_ARTICLES_BY_TYPE = "/cms/report-articles-by-type";
export const GET_LIST_CHART_PAGE_VIEW = "/cms/report-page-views";
export const GET_LIST_CHART_PAGE_INTERACT = "/cms/report-page-interact";
export const GET_LIST_CHART_READ_ARTICLE = "/cms/report-read-article";
export const GET_LIST_CHART_VIEW_LIKE_SHARE =
  "/cms/report-chart-articles-view-like-share";

export const GET_LIST_PAPER_NUMBER = `/cms/article-get-paper-number`;
export const GET_LIST_PAPER_TYPE = `/cms/article-get-paper-type`;

export const Live_Channel_Get_List_Type = `/cms/live-channel-get-list-type`;

// firebase notifi
export const USER_UPDATE_DEVICE_ID = `/cms/user-update-device-id`;
export const GET_LIST_NOTIFICATION = `/cms/notification-get-by-user-id`;
export const UPDATE_NOTIFICATION_STATUS = `/cms/notification-update-status`;
export const UPDATE_NOTIFICATION_STATUS_ALL = `/cms/notification-update-all-status`;
export const REMOVE_NOTIFICATION = `/cms/notification-remove`;
export const REMOVE_NOTIFICATION_ALL = `/cms/notification-remove-multi`;
export const PUT_NOTIFICATION_FOR_ANY = `/cms/notification-add-multi-user`;

export const POST_USER_CHECK_OTP = `/api/oauth/user-check-otp`;
export const POST_USER_GET_OTP = `/api/oauth/user-get-otp`;

//speech to text

export const ARTICLE_SPEECH_TO_TEXT = `/cms/article-speech-to-text-fpt`;
export const GET_LIST_CRAWK_LINK = `/cms/get-list-crawl-link`;
export const ARTICLE_GET_CONTENT_FROM_URL = `/cms/article-get-content-from-url`;
export const ARTICLE_CHECK_SPELL_VIETTEL = `/cms/article-check-spell-viettel`;

//READER
export const ARTICLE_GET_MOST_VIEW = `/cms/report-articles-view-by-time`;
export const GOOGLE_SEARCH_ARTICLE = `/cms/get-google-search`;
export const READER_ACCOUNT_GET_LIST = `/cms/account-get-list`;
export const READER_ACCOUNT_DETAIL = `/cms/account-get-detail-by-id`;
export const READER_ACCOUNT_INTERACT_GET_LIST = `/cms/account-interact-get-list`;
export const READER_ACCOUNT_LOCK = `/cms/lock-account`;

export const GET_COMMET_IMAGE_ARTICLE = `/cms/get-list-comment-by-article-id`;
export const UPDATE_COMMET_IMAGE_ARTICLE = `/cms/file-comment-insert`;
export const RESPONSE_READER_DELETE = `/cms/delete-account-feedback-by-id`;
export const RESPONSE_READER = `/cms/response-readers`;
export const LIST_RESPONSE_READER = `/cms/get-feedback-response-by-id`;

export const ADD_SITEMAP = `/cms/sitemap-insert`;
export const UPDATE_SITEMAP = `/cms/update-sitemap`;
// UPDATE_SITEMAP

//Oauth
export const REFRESH_TOKEN = `/api/oauth/refresh`;
export const LOGUT = `/api/oauth/logout`;
