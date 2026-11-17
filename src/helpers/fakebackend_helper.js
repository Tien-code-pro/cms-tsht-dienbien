import * as url from "./url_helper";
import { APIClient } from "./api_helper";
import {
    DELETE_RESTORE_ARTICLE,
    GET_ARTICLE_WATERMARK,
    GET_LIST_ARTICLE_TRASH_BY_FILTER,
    PUT_ARTICLE_WATERMARK,
    RESTORE_ARTICLE,
} from "./url_helper";

const api = new APIClient();

function cleanObject(obj) {
  const cleanedObj = {};

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      cleanedObj[key] = obj[key];
    }
  }

  return cleanedObj;
}
// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("authUser");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data) =>
  api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = (data) => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data) =>
  api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data) =>
  api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data).catch((err) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = "Sorry! the page you are looking for could not be found";
          break;
        case 500:
          message =
            "Sorry! something went wrong, please contact our support team";
          break;
        case 401:
          message = "Invalid credentials";
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postJwtLogin = (data) => api.get(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET + "?email=" + data.email);
export const postUserGetOtp = (data) =>
  api.create(url.POST_USER_GET_OTP + "?email=" + data.email);
export const postUserCheckOtp = (data) =>
  api.create(
    url.POST_USER_CHECK_OTP + "?email=" + data.email + "&otp=" + data.otp
  );

// postSocialLogin
export const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

// Calendar
// get Events
export const getEvents = () => api.get(url.GET_EVENTS);

// get Events
export const getCategories = () => api.get(url.GET_CATEGORIES);

// get Upcomming Events
export const getUpCommingEvent = () => api.get(url.GET_UPCOMMINGEVENT);

// add Events
export const addNewEvent = (event) => api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = (event) => api.put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = (event) =>
  api._delete(url.DELETE_EVENT, { headers: { event } });

// Chat
// get Contact
export const getDirectContact = () => api.get(url.GET_DIRECT_CONTACT);

// get Messages
export const getMessages = (roomId) =>
  api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// add Message
export const addMessage = (message) => api.create(url.ADD_MESSAGE, message);

// add Message
export const deleteMessage = (message) =>
  api._delete(url.DELETE_MESSAGE, { headers: { message } });

// get Channels
export const getChannels = () => api.get(url.GET_CHANNELS);

// MailBox
//get Mail
export const getMailDetails = () => api.get(url.GET_MAIL_DETAILS);

// delete Mail
export const deleteMail = (forId) =>
  api._delete(url.DELETE_MAIL, { headers: { forId } });

// Ecommerce
// get Products
export const getProducts = () => api.get(url.GET_PRODUCTS);

// delete Product
export const deleteProducts = (product) =>
  api._delete(url.DELETE_PRODUCT + "/" + product);

// add Products
export const addNewProduct = (product) =>
  api.create(url.ADD_NEW_PRODUCT, product);

// update Products
export const updateProduct = (product) =>
  api.update(url.UPDATE_PRODUCT + "/" + product._id, product);

// get Orders
export const getOrders = () => api.get(url.GET_ORDERS);

// add Order
export const addNewOrder = (order) => api.create(url.ADD_NEW_ORDER, order);

// update Order
export const updateOrder = (order) =>
  api.update(url.UPDATE_ORDER + "/" + order._id, order);

// delete Order
export const deleteOrder = (order) =>
  api._delete(url.DELETE_ORDER + "/" + order);

// get Customers
export const getCustomers = () => api.get(url.GET_CUSTOMERS);

// add Customers
export const addNewCustomer = (customer) =>
  api.create(url.ADD_NEW_CUSTOMER, customer);

// update Customers
export const updateCustomer = (customer) =>
  api.update(url.UPDATE_CUSTOMER + "/" + customer._id, customer);

// delete Customers
export const deleteCustomer = (customer) =>
  api._delete(url.DELETE_CUSTOMER + "/" + customer);

// get Sellers
export const getSellers = () => api.get(url.GET_SELLERS);

// Project
// get Project list
export const getProjectList = () => api.get(url.GET_PROJECT_LIST);

// Tasks
// get Task
export const getTaskList = () => api.get(url.GET_TASK_LIST);

// add Task
export const addNewTask = (task) => api.create(url.ADD_NEW_TASK, task);

// update Task
export const updateTask = (task) =>
  api.update(url.UPDATE_TASK + "/" + task._id, task);

// delete Task
export const deleteTask = (task) => api._delete(url.DELETE_TASK + "/" + task);

// CRM
// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);

// add Contact
export const addNewContact = (contact) =>
  api.create(url.ADD_NEW_CONTACT, contact);

// update Contact
export const updateContact = (contact) =>
  api.update(url.UPDATE_CONTACT + "/" + contact._id, contact);

// delete Contact
export const deleteContact = (contact) =>
  api._delete(url.DELETE_CONTACT + "/" + contact);

// get Companies
export const getCompanies = () => api.get(url.GET_COMPANIES);

// add Companies
export const addNewCompanies = (company) =>
  api.create(url.ADD_NEW_COMPANIES, company);

// update Companies
export const updateCompanies = (company) =>
  api.update(url.UPDATE_COMPANIES + "/" + company._id, company);

// delete Companies
export const deleteCompanies = (company) =>
  api._delete(url.DELETE_COMPANIES + "/" + company);

// get Deals
export const getDeals = () => api.get(url.GET_DEALS);

// get Leads
export const getLeads = () => api.get(url.GET_LEADS);

// add Lead
export const addNewLead = (lead) => api.create(url.ADD_NEW_LEAD, lead);

// update Lead
export const updateLead = (lead) =>
  api.update(url.UPDATE_LEAD + "/" + lead._id, lead);

// delete Lead
export const deleteLead = (lead) => api._delete(url.DELETE_LEAD + "/" + lead);

// Crypto
// Transation
export const getTransationList = () => api.get(url.GET_TRANSACTION_LIST);

// Order List
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);

// Invoice
//get Invoice
export const getInvoices = () => api.get(url.GET_INVOICES);

// add Invoice
export const addNewInvoice = (invoice) =>
  api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = (invoice) =>
  api.update(url.UPDATE_INVOICE + "/" + invoice._id, invoice);

// delete Invoice
export const deleteInvoice = (invoice) =>
  api._delete(url.DELETE_INVOICE + "/" + invoice);

// Support Tickets
// Tickets
export const getTicketsList = () => api.get(url.GET_TICKETS_LIST);

// add Tickets
export const addNewTicket = (ticket) => api.create(url.ADD_NEW_TICKET, ticket);

// update Tickets
export const updateTicket = (ticket) =>
  api.update(url.UPDATE_TICKET + "/" + ticket._id, ticket);

// delete Tickets
export const deleteTicket = (ticket) =>
  api._delete(url.DELETE_TICKET + "/" + ticket);

// Dashboard Analytics

// Sessions by Countries
export const getAllData = () => api.get(url.GET_ALL_DATA);
export const getHalfYearlyData = () => api.get(url.GET_HALFYEARLY_DATA);
export const getMonthlyData = () => api.get(url.GET_MONTHLY_DATA);

// Audiences Metrics
export const getAllAudiencesMetricsData = () =>
  api.get(url.GET_ALLAUDIENCESMETRICS_DATA);
export const getMonthlyAudiencesMetricsData = () =>
  api.get(url.GET_MONTHLYAUDIENCESMETRICS_DATA);
export const getHalfYearlyAudiencesMetricsData = () =>
  api.get(url.GET_HALFYEARLYAUDIENCESMETRICS_DATA);
export const getYearlyAudiencesMetricsData = () =>
  api.get(url.GET_YEARLYAUDIENCESMETRICS_DATA);

// Users by Device
export const getTodayDeviceData = () => api.get(url.GET_TODAYDEVICE_DATA);
export const getLastWeekDeviceData = () => api.get(url.GET_LASTWEEKDEVICE_DATA);
export const getLastMonthDeviceData = () =>
  api.get(url.GET_LASTMONTHDEVICE_DATA);
export const getCurrentYearDeviceData = () =>
  api.get(url.GET_CURRENTYEARDEVICE_DATA);

// Audiences Sessions by Country
export const getTodaySessionData = () => api.get(url.GET_TODAYSESSION_DATA);
export const getLastWeekSessionData = () =>
  api.get(url.GET_LASTWEEKSESSION_DATA);
export const getLastMonthSessionData = () =>
  api.get(url.GET_LASTMONTHSESSION_DATA);
export const getCurrentYearSessionData = () =>
  api.get(url.GET_CURRENTYEARSESSION_DATA);

// Dashboard CRM

// Balance Overview
export const getTodayBalanceData = () => api.get(url.GET_TODAYBALANCE_DATA);
export const getLastWeekBalanceData = () =>
  api.get(url.GET_LASTWEEKBALANCE_DATA);
export const getLastMonthBalanceData = () =>
  api.get(url.GET_LASTMONTHBALANCE_DATA);
export const getCurrentYearBalanceData = () =>
  api.get(url.GET_CURRENTYEARBALANCE_DATA);

// Dial Type
export const getTodayDealData = () => api.get(url.GET_TODAYDEAL_DATA);
export const getWeeklyDealData = () => api.get(url.GET_WEEKLYDEAL_DATA);
export const getMonthlyDealData = () => api.get(url.GET_MONTHLYDEAL_DATA);
export const getYearlyDealData = () => api.get(url.GET_YEARLYDEAL_DATA);

// Sales Forecast
export const getOctSalesData = () => api.get(url.GET_OCTSALES_DATA);
export const getNovSalesData = () => api.get(url.GET_NOVSALES_DATA);
export const getDecSalesData = () => api.get(url.GET_DECSALES_DATA);
export const getJanSalesData = () => api.get(url.GET_JANSALES_DATA);

// Dashboard Ecommerce
// Revenue
export const getAllRevenueData = () => api.get(url.GET_ALLREVENUE_DATA);
export const getMonthRevenueData = () => api.get(url.GET_MONTHREVENUE_DATA);
export const getHalfYearRevenueData = () =>
  api.get(url.GET_HALFYEARREVENUE_DATA);
export const getYearRevenueData = () => api.get(url.GET_YEARREVENUE_DATA);

// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);

// Market Graph
export const getAllMarketData = () => api.get(url.GET_ALLMARKETDATA_DATA);
export const getYearMarketData = () => api.get(url.GET_YEARMARKET_DATA);
export const getMonthMarketData = () => api.get(url.GET_MONTHMARKET_DATA);
export const getWeekMarketData = () => api.get(url.GET_WEEKMARKET_DATA);
export const getHourMarketData = () => api.get(url.GET_HOURMARKET_DATA);

// Dashboard Project
// Project Overview
export const getAllProjectData = () => api.get(url.GET_ALLPROJECT_DATA);
export const getMonthProjectData = () => api.get(url.GET_MONTHPROJECT_DATA);
export const gethalfYearProjectData = () =>
  api.get(url.GET_HALFYEARPROJECT_DATA);
export const getYearProjectData = () => api.get(url.GET_YEARPROJECT_DATA);

// Project Status
export const getAllProjectStatusData = () =>
  api.get(url.GET_ALLPROJECTSTATUS_DATA);
export const getWeekProjectStatusData = () =>
  api.get(url.GET_WEEKPROJECTSTATUS_DATA);
export const getMonthProjectStatusData = () =>
  api.get(url.GET_MONTHPROJECTSTATUS_DATA);
export const getQuarterProjectStatusData = () =>
  api.get(url.GET_QUARTERPROJECTSTATUS_DATA);

// Dashboard NFT
// Marketplace
export const getAllMarketplaceData = () => api.get(url.GET_ALLMARKETPLACE_DATA);
export const getMonthMarketplaceData = () =>
  api.get(url.GET_MONTHMARKETPLACE_DATA);
export const gethalfYearMarketplaceData = () =>
  api.get(url.GET_HALFYEARMARKETPLACE_DATA);
export const getYearMarketplaceData = () =>
  api.get(url.GET_YEARMARKETPLACE_DATA);

// Project
export const addProjectList = (project) =>
  api.create(url.ADD_NEW_PROJECT, project);
export const updateProjectList = (project) =>
  api.put(url.UPDATE_PROJECT, project);
export const deleteProjectList = (project) =>
  api._delete(url.DELETE_PROJECT, { headers: { project } });

// Pages > Team
export const getTeamData = (team) => api.get(url.GET_TEAMDATA, team);
export const deleteTeamData = (team) =>
  api._delete(url.DELETE_TEAMDATA, { headers: { team } });
export const addTeamData = (team) => api.create(url.ADD_NEW_TEAMDATA, team);
export const updateTeamData = (team) => api.put(url.UPDATE_TEAMDATA, team);

// File Manager

// Folder
export const getFolders = (folder) => api.get(url.GET_FOLDERS, folder);
export const deleteFolder = (folder) =>
  api._delete(url.DELETE_FOLDER, { headers: { folder } });
export const addNewFolder = (folder) => api.create(url.ADD_NEW_FOLDER, folder);
export const updateFolder = (folder) => api.put(url.UPDATE_FOLDER, folder);

// File
export const getFiles = (file) => api.get(url.GET_FILES, file);
export const deleteFile = (file) =>
  api._delete(url.DELETE_FILE, { headers: { file } });
export const addNewFile = (file) => api.create(url.ADD_NEW_FILE, file);
export const updateFile = (file) => api.put(url.UPDATE_FILE, file);

// To Do
export const getTodos = (todo) => api.get(url.GET_TODOS, todo);
export const deleteTodo = (todo) =>
  api._delete(url.DELETE_TODO, { headers: { todo } });
export const addNewTodo = (todo) => api.create(url.ADD_NEW_TODO, todo);
export const updateTodo = (todo) => api.put(url.UPDATE_TODO, todo);

// To do Project
export const getProjects = (project) => api.get(url.GET_PROJECTS, project);
export const addNewProject = (project) =>
  api.create(url.ADD_NEW_TODO_PROJECT, project);

//Job Application
export const getJobApplicationList = () => api.get(url.GET_APPLICATION_LIST);

//API Key
export const getAPIKey = () => api.get(url.GET_API_KEY);

//TSHT

//TAG
export const getAPIListTag = (offset, limit, _search) =>
  api.get(url.GET_LIST_TAG, { offset, limit, _search });
export const getAPITagById = (_tag_id) =>
  api.get(url.GET_TAG_BY_ID, { _tag_id });
export const getAPIPostTag = (tag) => api.create(url.POST_TAG, tag);
export const getAPIPutTag = (tag) => api.put(url.PUT_TAG, tag);
export const getAPIDeleteTag = (tag_id) => api.get(url.DEL_TAG, { tag_id });

//DEPARTMENT
export const getAPIListDepartment = (offset, limit, _department_name) =>
  api.get(url.GET_LIST_DEPARTMENT, {
    offset,
    limit,
    _department_name: _department_name ? _department_name : "",
  });
export const getAPIDepartmentById = (_department_id) =>
  api.get(url.GET_DEPARTMENT_BY_ID, { _department_id });
export const getAPIPostDepartment = (department) =>
  api.create(url.POST_DEPARTMENT, department);
export const getAPIPutDepartment = (department) =>
  api.put(url.PUT_DEPARTMENT, department);
export const getAPIDeleteDepartment = (department_id) =>
  api.get(url.DEL_DEPARTMENT, { department_id });

// getAPIListSiteMap
export const getAPIListSiteMap = (offset, limit, title) =>
  api.get(url.GET_LIST_SITEMAP, {
    offset,
    limit,
    title: title ? title : "",
  });
//CATEGORY
export const updateCategoryDisplay = (category_id, status) => {
  return api.get(url.UPDATE_CATEGORY_DISPLAY, { category_id, status });
};
export const getAPIListCategory = (offset, limit) =>
  api.get(url.GET_LIST_CATEGORY, { offset, limit });
export const getAPITreeListCategory = (offset, limit, keywordTemp) => {
  let keyword = keywordTemp == undefined ? "" : keywordTemp;
  return api.get(url.GET_TREE_LIST_CATEGORY, { offset, limit, keyword });
};

export const getAPITreeListCategoryByName = (offset, limit, category_name) =>
  api.get(url.GET_TREE_LIST_CATEGORY_BY_NAME, { offset, limit, category_name });
export const getAPITreeListCategoryByUser = (offset, limit) =>
  api.get(url.GET_TREE_LIST_CATEGORY_BY_USER, { offset, limit });
export const getAPICategoryById = (_category_id) =>
  api.get(url.GET_CATEGORY_BY_ID, { _category_id });
export const getAPIPostCategory = (category) =>
  api.create(url.POST_CATEGORY, category);
export const getAPIPutCategory = (category) =>
  api.put(url.PUT_CATEGORY, category);
export const getAPIDeleteCategory = (category_id) =>
  api.get(url.DEL_CATEGORY, { category_id });
export const getAPIUpdateAvatar = (fileName, base64String) =>
  api.put(url.UPDATE_AVATAR_BASE64, {
    fileName: fileName,
    base64String: base64String,
  });
//Account
export const getAPIListAccount = (
  offset,
  limit,
  _search,
  _category_id,
  lst_status,
  selectedGroupFunction
) => {
  // if (_search === undefined) {
  //   return api.get(url.GET_LIST_ACCOUNT, { offset, limit });
  // } else {
  //   return api.get(url.GET_LIST_ACCOUNT, { offset, limit, _search });
  // }
  let search = _search == undefined ? "" : _search;
  let category_id = _category_id == undefined ? 0 : _category_id;
  let status = lst_status == undefined ? -1 : lst_status;
  let department_id =
    selectedGroupFunction == undefined ? 0 : selectedGroupFunction;

  return api.get(url.GET_LIST_ACCOUNT, {
    offset,
    limit,
    search,
    category_id,
    status,
    department_id,
  });
};
export const getAPIListAccountPermissiton = (offset, limit, _search) => {
  if (_search === undefined) {
    return api.get(url.GET_LIST_ACCOUNT_PERMISSION, { offset, limit });
  } else {
    return api.get(url.GET_LIST_ACCOUNT_PERMISSION, {
      offset,
      limit,
      _search,
    });
  }
};

export const getListUser = (data) => api.get(url.GET_LIST_USER, data);

export const getAPIAccountById = (user_id) =>
  api.get(url.GET_ACCOUNT_BY_ID, { user_id });
export const getAPIAccountInfo = () => api.get(url.GET_LIST_ACCOUNT_INFO);

export const getAPIPostAccount = (account) =>
  api.create(url.POST_ACCOUNT, account);
export const getAPIPutAccount = (account) => api.put(url.PUT_ACCOUNT, account);
export const getAPIDeleteAccount = (user_id) =>
  api.get(url.DEL_ACCOUNT, { user_id });

//comment
export const getAPIListComment = (
  offset,
  limit,
  content_comment,
  article_title,
  status,
  category_id
) =>
  api.get(url.GET_LIST_COMMENT, {
    offset,
    limit,
    content_comment,
    article_title,
    status,
    category_id,
  });
// response reader
export const getAPIListAccountFeedback = (
  offset,
  limit,
  key,
  status,
  department_id,
  fromdate,
  todate
) =>
  api.get(
    url.GET_LIST_FEEDBACK,
    cleanObject({
      offset,
      limit,
      key,
      status,
      department_id,
      fromdate,
      todate,
    })
  );

// delete response reader
export const getAPIDeletetResponseReader = (id) =>
  api.get(url.RESPONSE_READER_DELETE, { id });
// get list response reader
export const getAPIFeedbackById = (id) =>
  api.get(url.LIST_RESPONSE_READER, { id });
// post response reader
export const getAPIPostResponseReader = (account_feedback_id, title, content) =>
  api.create(url.RESPONSE_READER, {
    account_feedback_id,
    title,
    content,
  });

//
export const handleAPIAddSitemap = (data) => api.create(url.ADD_SITEMAP, data);
export const handleAPIUpdateSitemap = (data) =>
  api.create(url.UPDATE_SITEMAP, data);
export const getAPICommentById = (_comment_id) =>
  api.get(url.GET_COMMENT_BY_ID, { _comment_id });
export const getAPIPostComment = (comment) =>
  api.create(url.POST_COMMENT, comment);
export const getAPIApproveComment = (article_id, parent_id, comment_id) =>
  api.get(url.APPROVE_COMMENT, { article_id, parent_id, comment_id });

export const getAPIPutComment = (comment) => api.put(url.PUT_COMMENT, comment);

export const getAPIDeleteComment = (article_id, parent_id, comment_id) =>
  api.get(url.DEL_COMMENT, { article_id, parent_id, comment_id });

//Role - Quy trình
export const getAPIListRole = (offset, limit) =>
  api.get(url.GET_LIST_ROLE, { offset, limit });
export const getAPIRoleById = (role_id) =>
  api.get(url.GET_ROLE_BY_ID, { role_id });
export const getAPIRoleByArticleId = (article_id) =>
  api.get(url.GET_ROLE_BY_ARTICLE_ID, { article_id });
export const getAPIRoleByArticlePrintId = (article_print_id) =>
  api.get(url.GET_ROLE_BY_ARTICLE_PRINT_ID, { article_print_id });
export const getAPIRoleByArticleLiveId = () =>
  api.get(url.GET_ROLE_ARLIVE_BY_ARTICLE_ID, {});
export const getAPIPostRole = (role) => api.create(url.POST_ROLE, role);
export const getAPIPostTransitionRole = (role) =>
  api.create(url.POST_ROLE_TRANSITION_STEP, role);
export const getAPIPostTransitionRolePrint = (role) =>
  api.create(url.POST_ROLE_TRANSITION_STEP_PRINT, role);

export const postRoleArticleLiveContent = (article) =>
  api.create(url.POST_ROLE_TRANSITION_ARTICLE_LIVE_CONTENT, article);
export const getAPIPostTransitionPublishRole = (article_id) =>
  api.get(url.POST_ROLE_TRANSITION_PUBLISH_STEP, { article_id });
export const getAPIApprovalArticlePrint = (article_print_id) =>
  api.get(url.POST_APPROVAL_ARTICLE_PRINT, { article_print_id });

export const getAPIGetReturnRole = (article_id) =>
  api.get(url.POST_ROLE_RETURN_STEP, { article_id });
export const getAPIGetReturnRolePrint = (article_print_id) =>
  api.get(url.POST_ROLE_RETURN_STEP_PRINT, { article_print_id });
export const getAPIPostTransitionUnPublishRole = (article_id) =>
  api.get(url.POST_ROLE_TRANSITION_REMOVE_PUBLISH_STEP, { article_id });
export const getAPIArticlePrintRevokeApproval = (article_print_id) =>
  api.get(url.GET_ARTICLE_PRINT_REVOKE_APPROVAL, { article_print_id });
export const getAPIPutRole = (role) => api.put(url.PUT_ROLE, role);
export const getAPIDeleteRole = (role_id) => api.get(url.DEL_ROLE, { role_id });
export const getAPITotalArticle = () => api.get(url.TOTAL_ARTICLE);

//ARTICLE
export const getAPIListArticleType = () => api.get(url.GET_LIST_ARTICLE_TYPE);
export const getAPIListArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_BY_FILTER, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListArticleTrash = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_TRASH_BY_FILTER, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListDraftArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_DRAFT, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListPendingArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_PENDING, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListPublishArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_LIST_ARTICLE_PUBLISH, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPIListMarKet = (
  offset,
  limit,
  article_title,
  author,
  todate,
  fromdate,
  lst_status,
  paper_number,
  paper_type
) =>
  api.get(url.GET_LIST_MARKET_BY_FILTER, {
    offset,
    limit,
    article_title,
    author,
    todate,
    fromdate,
    lst_status,
    paper_number,
    paper_type,
  });
export const getAPIListArticlePrintByTypePage = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,

  lst_status,
  _article_type_id,
  _article_paper_number_id,
  typePage
) =>
  api.get(
    (typePage === "all" && url.GET_LIST_ARTICLE_PRINT_BY_FILTER) ||
      (typePage === "draft" && url.GET_LIST_ARTICLE_PRINT_DRAFT) ||
      (typePage === "pending" && url.GET_LIST_ARTICLE_PRINT_PENDING) ||
      (typePage === "publish" && url.GET_LIST_ARTICLE_PRINT_PUBLISH),
    {
      offset,
      limit,
      _article_title,
      _category_id,
      _author,
      _todate,
      _fromdate,
      lst_status,
      _article_type_id,
      _article_paper_number_id,
    }
  );

export const updateDisplayArticleLive = (article_id, active_status) =>
  api.create(url.POST_DISPLAY_ARTICLE_LIVE, { article_id, active_status });
export const getAPIListLiveArticle = (
  offset,
  limit,
  _article_title,
  _todate,
  _fromdate,
  _article_status_id
) =>
  api.get(url.GET_LIST_LIVE_ARTICLE_BY_FILTER, {
    offset,
    limit,
    _article_title,
    _todate,
    _fromdate,
    _article_status_id,
  });
export const getAPIListLiveContentArticle = (
  offset,
  limit,
  article_id,
  article_status_id
) =>
  api.get(url.ARTICLE_LIVE_GET_LIST_CONTENT, {
    offset,
    limit,
    article_id,
    article_status_id,
  });
export const getAPIReportListArticle = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(url.GET_REPORT_LIST_ARTICLE_BY_FILTER, {
    offset,
    limit,
    _article_title,
    _category_id,
    _author,
    _todate,
    _fromdate,
    lst_status,
    _article_type_id,
  });
export const getAPISortReportListArticle = (
  offset,
  limit,
  article_title,
  category_id,
  author,
  todate,
  fromdate,
  lst_status,
  article_type_id,
  sort_column,
  sort_order
) =>
  api.get(url.GET_SORT_REPORT_LIST_ARTICLE_BY_FILTER, {
    offset,
    limit,
    article_title,
    category_id,
    author,
    todate,
    fromdate,
    lst_status,
    article_type_id,
    sort_column,
    sort_order,
  });

export const getFileExcelArticleReport = (
  offset,
  limit,
  _article_title,
  _category_id,
  _author,
  _todate,
  _fromdate,
  lst_status,
  _article_type_id
) =>
  api.get(
    url.GET_FILE_EXCEL_ARTICLE_REPORT,
    {
      offset,
      limit,
      _article_title,
      _category_id,
      _author,
      _todate,
      _fromdate,
      lst_status,
      _article_type_id,
    },
    "blob"
  );

export const getListAuthorFile = () => api.get(url.GET_LIST_AUTHOR_BY_FILE);
export const getCheckPublishArticleByUser = (articleId) =>
  api.get(url.CHECK_PUBLISH_ARTICLE_BY_USER, articleId);
export const getAPIListArticleTypeAvailability = () =>
  api.get(url.GET_LIST_ARTICLE_TYPE_AVAILABILITY);
export const getAPIListArticleRelated = (tag_list, limit) =>
  api.get(url.GET_LIST_ARTICLE_RELATED, { tag_list, limit });
export const getArticleFileMediaList = (data) =>
  api.get(url.ARTICLE_GET_FILE_LIST, data);

export const getArticleLiveContentFileMediaList = (data) =>
  api.get(url.ARTICLE_LIVE_CONTENt_GET_FILE_LIST, data);

export const getAPIListAuthor = () => api.get(url.GET_LIST_AUTHOR);
export const getAPIPostArticle = (article) =>
  api.create(url.POST_ARTICLE, article);
export const getAPIPostArticlePrint = (article) =>
  api.create(url.POST_ARTICLE_PRINT, article);
export const getAPIPostLiveArticle = (article) =>
  api.create(url.POST_LIVE_ARTICLE, article);

export const getAPIPostLiveContentArticle = (article) =>
  api.create(url.POST_LIVE_CONTENT_ARTICLE, article);

export const getAPIUpdateLiveContentArticle = (article) =>
  api.create(url.PUT_LIVE_CONTENT_ARTICLE, article);
export const getAPIPutLiveArticle = (article) =>
  api.create(url.PUT_LIVE_ARTICLE, article);
export const getAPIPutArticle = (article) =>
  api.create(url.PUT_ARTICLE, article);
export const getAPIPutArticlePrint = (article) =>
  api.create(url.PUT_ARTICLE_PRINT, article);
export const getAPIPutArticleWatermark = (article_id) =>
  api.get(url.GET_ARTICLE_WATERMARK, { article_id });
export const getAPIDeleteArticle = (article_id) =>
  api.get(url.DEL_ARTICLE, { article_id });
export const getAPIRestoreArticle = (lst_article_ids) =>
  api.put(url.RESTORE_ARTICLE, { lst_article_ids });
export const getAPIDeleteRestoreArticle = (lst_article_ids) =>
    api.put(url.DELETE_RESTORE_ARTICLE, { lst_article_ids });
export const getAPIDeleteArticlePrint = (article_id) =>
  api.get(url.DEL_ARTICLE_PRINT, { article_id });
export const getAPIDeleteLiveArticle = (article_id) =>
  api.get(url.DEL_LIVE_ARTICLE, { article_id });

export const getAPIDeleteLiveContentArticle = (article_live_id) =>
  api.get(url.DEL_LIVE_CONTENT_ARTICLE, { article_live_id });
export const getAPIGetArticleById = (article_id) =>
  api.get(url.GET_ARTICLE_BY_ID, { article_id });
export const getAPIGetArticlePrintById = (article_print_id) =>
  api.get(url.GET_ARTICLE_PRINT_BY_ID, { article_print_id });

export const getAPIGetArticleLiveById = (article_id) =>
  api.get(url.GET_ARTICLE_LIVE_BY_ID, { article_id });
export const getAPIGetArticleLiveContentById = (article_id, article_live_id) =>
  api.get(url.GET_ARTICLE_LIVE_CONTENT_BY_ID, { article_id, article_live_id });

export const getAPIPublishArticleLive = (article_live_id) =>
  api.get(url.PUBLISH_ARTICLE_LIVE, { article_live_id });

export const getAPIReturnStepArticleLive = (article_live_id) =>
  api.get(url.RETURN_ARTICLE_LIVE, { article_live_id });
export const getAPIUnPublishArticleLive = (article_live_id) =>
  api.get(url.UNPUBLISHED_ARTICLE_LIVE, { article_live_id });
export const getAPIArticleHistory = (article_id) =>
  api.get(url.GET_ARTICLE_HISTORY, { article_id });
export const getAPIArticlePrintHistory = (article_print_id) =>
  api.get(url.GET_ARTICLE_PRINT_HISTORY, { article_print_id });
//process
export const downloadDocumentArticle = (data) =>
  api.get(url.EXPORT_DOC_ARTICLE, data, "blob");
export const downloadDocumentPrintArticle = (data) =>
  api.get(url.EXPORT_DOC_PRINT_ARTICLE, data, "arraybuffer", {
    "Content-Type": "blob",
  });

//process -- cũng là quy trình
export const getAPIListProcess = (offset, limit) =>
  api.get(url.GET_LIST_PROCESS, { offset, limit });
export const getAPIProcessById = (_role_id) =>
  api.get(url.GET_PROCESS_BY_ID, { _role_id });
export const getAPIPostProcess = (process) =>
  api.create(url.POST_PROCESS, process);
export const getAPIPutProcess = (process) => api.put(url.PUT_PROCESS, process);
export const getAPIDeleteProcess = (_role_id) =>
  api.get(url.DEL_PROCESS, { _role_id });

//EPG - LiveChannel
export const getAPIListLiveChannel = (offset, limit, _channel_title) =>
  api.get(url.GET_LIST_CHANNEL, { offset, limit, _channel_title });
export const getAPIChannelById = (_live_channel_id) =>
  api.get(url.GET_CHANNEL_BY_ID, { _live_channel_id });
export const getAPIPostChannel = (channel) =>
  api.create(url.POST_CHANNEL, channel);
export const getAPIPutChannel = (live_channel_id) =>
  api.put(url.PUT_CHANNEL, live_channel_id);
export const getAPIDeleteChannel = (live_channel_id) =>
  api.get(url.DEL_CHANNEL, { live_channel_id });
export const getAPILiveChannelUpdateStatus = (live_channel_id, status) =>
  api.get(url.GET_UPDATE_STATUS, { live_channel_id, status });
export const getAPILiveChannelUpdateDRMStatus = (live_channel_id, status) =>
  api.get(url.GET_UPDATE_DRM_STATUS, { live_channel_id, status });

export const getAPIEpgListByDateAndChannel = (_channel_id) =>
  api.get(url.GET_EPG_LIST_BY_DATE_AND_CHANNEL, { _channel_id });
export const getAPIEpgById = (_epg_id) =>
  api.get(url.GET_EPG_GET_BY_ID, { _epg_id });
export const getAPIEpgGetListByChannelId = (
  offset,
  limit,
  _channel_id,
  _date
) =>
  api.get(url.GET_EPG_GET_LIST_BY_CHANNEL_ID, {
    offset,
    limit,
    _channel_id,
    _date,
  });
export const getAPIEpgDownloadFile = () =>
  api.get(url.GET_EPG_DOWBLOAD_FILE, {}, "arraybuffer", {
    "Content-Type": "blob",
  });
export const updateEPGList = (data) => api.put(url.INSERT_LIST_EPG, data);

export const importEPGList = (data) => api.put(url.IMPORT_LIST_EPG, data);

export const getAPIDeleteEpg = (epg_id) => api.get(url.DEL_EPG, { epg_id });

export const getAPIListLiveChannelSourceType = () =>
  api.get(url.GET_LIST_LIVE_CHANNEL_SOURCE_TYPE);

export const getListByOutstanding = (data) =>
  api.get(url.ARTICLE_GET_LIST_BY_OUTSTANDING, data);

export const getListByOutstandingSelected = (data) =>
  api.get(url.ARTICLE_GET_LIST_BY_OUTSTANDING_SELECTED, data);

export const updateListByOutstandingSelected = (data) =>
  api.put(url.ARTICLE_UPDATE_ORDER_POSITON, data);

// Nhóm quyền
export const getAPIListGroupFunction = () =>
  api.get(url.GET_LIST_GROUP_FUNCTION);
export const getAPIDetailGroupFunction = (_groups_id) =>
  api.get(url.GET_DETAIL_GROUP_FUNCTION, { _groups_id });
export const getAPIPostGroupFunction = (groupFunction) =>
  api.create(url.CREATE_GROUP_FUNCTION, groupFunction);
export const getAPIPutGroupFunction = (groupFunction) =>
  api.create(url.UPDATE_GROUP_FUNCTION, groupFunction);
export const getAPIDeleteGroupFunction = (_groups_id) =>
  api.get(url.DELETE_GROUP_FUNCTION, { _groups_id });

export const getAPIGroupFunction = (group_id) =>
  api.get(url.GET_GROUP_FUNCTION, { group_id });

export const updateAPIFunctionGroup = (type, data) =>
  type === "insert"
    ? api.put(url.INSERT_FUNCTION_GROUP, data)
    : api.get(url.DELETE_FUNCTION_GROUP, data);

// Các chức năng - quyền
export const getAPIListFunctionByUser = () =>
  api.get(url.GET_LIST_FUNCTION_BY_USER);
export const getAPIListFunction = () => api.get(url.GET_LIST_FUNCTION);
export const createFunction = (data) => api.create(url.CREATE_FUNCTION, data);
export const updateFunction = (data) => api.create(url.UPDATE_FUNCTION, data);
export const deleteFunction = (function_id) =>
  api.get(url.DELETE_FUNCTION, { function_id });

//Nhuận bút
export const getArticlePriceList = (data) =>
  api.get(url.STATIS_ARTICLE_PRICE_GET_LIST, data);
export const articlePriceExportExcel = (data) =>
  api.get(url.ARTICLE_PRICE_EXPORT_FILE_EXCEL, data, "blob");
export const getArticlePriceListPrint = (data) =>
  api.get(url.STATIS_ARTICLE_PRICE_GET_LIST_PRINT, data);
export const articlePriceExportExcelPrint = (data) =>
  api.get(url.ARTICLE_PRICE_EXPORT_FILE_EXCEL_PRINT, data, "blob");
export const getArticleAuthorList = () => api.get(url.ARTICLE_GET_LIST_AUTHOR);
export const getArticleTypeList = () => api.get(url.ARTICLE_GET_TYPE_LIST);
export const createArticlePrice = (data) =>
  api.create(url.CREATE_ARTICLE_PRICE, data);
export const getAPIArticlePriceById = (_article_id) =>
  api.get(url.GET_ARTICLE_PRICE_BY_ID, { _article_id });
export const getAPIArticlePrintPriceById = (article_print_id) =>
  api.get(url.GET_ARTICLE_PRINT_PRICE_BY_ID, { article_print_id });
export const getAPIPutArticlePrice = (article_price_id) =>
  api.put(url.PUT_ARTICLE_PRICE, article_price_id);

//events
export const getAPIListEvents = (
  offset,
  limit,
  event_name,
  _todate,
  _fromdate
) =>
  api.get(url.GET_LIST_EVENT, {
    offset,
    limit,
    event_name,
    _todate,
    _fromdate,
  });
export const getAPIDeleteEvent = (event_id) => api.get(url.DEL_EVENT, event_id);

export const getAPIPostEvent = (event_id) =>
  api.create(url.POST_EVENT, event_id);

export const getAPIPutEvent = (event_id) => api.put(url.PUT_EVENT, event_id);
export const getAPIEventById = (_event_id) =>
  api.get(url.GET_EVENT_BY_ID, { _event_id });

export const getAPIEventUpdateStatus = (event_id, status) =>
  api.get(url.GET_UPDATE_EVENT_STATUS, { event_id, status });
export const getAPIEventUpdateDRMStatus = (event_id, status) =>
  api.get(url.GET_UPDATE_EVENT_DRM_STATUS, { event_id, status });

//Media
export const getListMediaFile = (data) =>
  api.get(url.GET_LIST_MEDIA_FILE, data);

export const createListMediaFile = (data, option) =>
  api.createFile(url.CREATE_LIST_MEDIA_FILE, data, option, "1234.png");
export const createMultipleMediaFile = (data, option) =>
  api.createFile(url.CREATE_MULTIPLE_MEDIA_FILE, data, option, "1234.png");
export const createShortVideoFile = (data, option) =>
  api.createFile(url.CREATE_SHORT_VIDEO_FILE, data, option);
export const deleteListMediaFile = (data) =>
  api.get(url.DELETE_LIST_MEDIA_FILE, data);

export const publicFileMedia = (data) => api.get(url.PUBLIC_FILE_MEDIA, data);

//ads
export const getAPIListAds = (
  offset,
  limit,
  ad_type,
  customer_info,
  status,
  date_to,
  date_from,
  ad_name
) =>
  api.get(url.GET_LIST_ADS, {
    offset,
    limit,
    ad_type,
    customer_info,
    status,
    date_to,
    date_from,
    ad_name,
  });
export const getAPIDeleteAds = (ad_id) => api.get(url.DEL_ADS, ad_id);
export const updateDisplayAds = (ad_id, display) =>
  api.get(url.POST_DISPLAY_ADS, { ad_id, display });
export const getAPIPostAds = (ad_id) => api.create(url.POST_ADS, ad_id);
export const getAPIListPageType = () => api.get(url.GET_LIST_PAGE_TYPE);
export const getAPIListDisplayType = (page_type_num) =>
  api.get(url.GET_LIST_DISPLAY_TYPE, { page_type_num });
export const getAPIAdsById = (_ad_id) => api.get(url.GET_ADS_BY_ID, { _ad_id });
export const getAPIPutAds = (ad_id) => api.put(url.PUT_ADS, ad_id);

//giao dien
export const getAPIHeaderById = (header_id) =>
  api.get(url.GET_HEADER_BY_ID, { header_id });
export const getAPIFaviconById = () => api.get(url.GET_FAVICON_BY_ID);
export const getAPIPostHeader = (data) => api.put(url.PUT_HEADER, data);
export const getAPIPostFavicon = (data) => api.put(url.PUT_FAVICON, data);
export const getAPIFooterById = (footer_id) =>
  api.get(url.GET_FOOTER_BY_ID, { footer_id });
export const getAPIPostFooter = (data) => api.put(url.PUT_FOOTER, data);
export const getListMenu = (data) => api.get(url.MENU_GET_LIST, data);
export const updateMenu = (data) => api.put(url.MENU_UPDATE, data);
export const getListMenuHome = (data) => api.get(url.MENU_GET_LIST_Home, data);
export const updateMenuHome = (data) => api.put(url.MENU_UPDATE_Home, data);

export const createHotLink = (data) => api.put(url.ADD_HOT_LINK, data);
export const updateHotLink = (data) => api.put(url.UPDATE_HOT_LINK, data);
export const deleteHotLink = (data) => api.get(url.DELETE_HOT_LINK, data);
export const getListHotLink = (data) => api.get(url.GET_LIST_HOT_LINK, data);
export const updateListHotLink = (data) =>
  api.put(url.UPDATE_LIST_HOT_LINK, data);

//dashboard

export const getAPIListChartPageView = (day) =>
  api.get(url.GET_LIST_CHART_PAGE_VIEW, { day });
export const getAPIListChartPageInteract = (day) =>
  api.get(url.GET_LIST_CHART_PAGE_INTERACT, { day });
export const getAPIListChartReadArticle = (day) =>
  api.get(url.GET_LIST_CHART_READ_ARTICLE, { day });
export const getAPIListArticleViewCountByCategory = (
  time_type,
  time_from,
  time_to
) =>
  api.get(url.GET_REPORT_LIST_ARTICLE_VIEW_COUNT_BY_CATEGORY, {
    time_type,
    time_from,
    time_to,
  });
export const getAPIListVideoMostWatch = (
  time_type,
  article_type_slug,
  time_from,
  time_to
) =>
  api.get(url.GET_LIST_REPORT_ARTICLES_BY_TYPE, {
    time_type,
    article_type_slug,
    time_from,
    time_to,
  });
export const getAPIListArticleMostWatch = (
  time_type,
  // article_type_slug,
  top,
  time_from,
  time_to
) =>
  api.get(url.ARTICLE_GET_MOST_VIEW, {
    time_type,
    // article_type_slug,
    top,
    time_from,
    time_to,
  });
export const getAPIListStatusLineChart = (
  top,
  article_status_id,
  time_type,
  time_from,
  time_to
) =>
  api.get(url.GET_LIST_STATUS_LINE_CHART, {
    top,
    article_status_id,
    time_type,
    time_from,
    time_to,
  });

export const getAPIListChartMostRead = (top, time_type, time_from, time_to) =>
  api.get(url.GET_LIST_CHART_MOST_READ, {
    top,
    time_type,
    time_from,
    time_to,
  });

export const getAPIListChartViewLikeShare = (_top, _time_type) =>
  api.get(url.GET_LIST_CHART_VIEW_LIKE_SHARE, {
    _top,
    _time_type,
  });

export const getAPIListPaperType = () => api.get(url.GET_LIST_PAPER_TYPE);

// /cms/article-get-paper-number
export const getAPIListPaperNumber = (key_search) => {
  if (key_search && key_search.length > 0) {
    return api.get(`/cms/article-get-paper-number?key_seach=${key_search}`);
  } else {
    return api.get(`/cms/article-get-paper-number`);
  }
};
// api.get(url.GET_LIST_PAPER_NUMBER, data);

export const liveChannelGetListType = () =>
  api.get(url.Live_Channel_Get_List_Type);

//firebase thong bao
export const getUserDeviceIDFirebase = (data) =>
  api.get(url.USER_UPDATE_DEVICE_ID, data);
export const getNotificationList = (data) =>
  api.get(url.GET_LIST_NOTIFICATION, data);
export const updateNotificationStatusAll = (data) =>
  api.get(url.UPDATE_NOTIFICATION_STATUS_ALL);
export const updateNotificationStatus = (data) =>
  api.get(url.UPDATE_NOTIFICATION_STATUS, data);
export const deleteListNotification = (data) =>
  api.get(url.REMOVE_NOTIFICATION, data);
export const deleteListNotificationAll = (data) =>
  api.get(url.REMOVE_NOTIFICATION_ALL, data);

export const updateArticleCommentPublish = (data) =>
  api.put(url.UPDATE_COMMENT_PUBLISH, data);
export const updateArticleFucusPublish = (data) =>
  api.put(url.UPDATE_FOCUS_ARTICLE_PUBLISH, data);
export const updateArticleMedia = (data) =>
  api.put(url.UPDATE_ARTICLE_MEDIA, data);

export const putNotificationForAny = (data) =>
  api.put(url.PUT_NOTIFICATION_FOR_ANY, data);

export const convertSpeechToText = (data) =>
  api.put(url.ARTICLE_SPEECH_TO_TEXT, data);
export const getListCrawlLink = () => api.get(url.GET_LIST_CRAWK_LINK);
export const articleGetContentFromUrl = (urlArticle) =>
  api.get(url.ARTICLE_GET_CONTENT_FROM_URL + "?url=" + urlArticle);
export const articleCheckSpellViettel = (text) =>
  api.put(url.ARTICLE_CHECK_SPELL_VIETTEL, text);
export const handleGoogleSearch = (data) =>
  api.get(url.GOOGLE_SEARCH_ARTICLE, data);

export const getReaderAccountList = (data) =>
  api.get(url.READER_ACCOUNT_GET_LIST, data);
export const getReaderAccountDetail = (data) =>
  api.get(url.READER_ACCOUNT_DETAIL, data);
export const getReaderAccountInteractList = (data) =>
  api.get(url.READER_ACCOUNT_INTERACT_GET_LIST, data);
export const postLockAccount = (data) => api.put(url.READER_ACCOUNT_LOCK, data);

export const getCommentImage = (data) =>
  api.get(url.GET_COMMET_IMAGE_ARTICLE, data);

export const updateCommentImage = (data) =>
  api.put(url.UPDATE_COMMET_IMAGE_ARTICLE, data);
export const refreshTokenApi = (data) => api.create(url.REFRESH_TOKEN, data);
export const logoutApi = (data) => api.create(url.LOGUT, data);
