import axios from 'axios';
import store from '../store'
var qs = require('qs');

//axios 配置
axios.defaults.timeout = 60000;
// axios.defaults.withCredentials = true;
//axios.defaults.baseURL = 'http://localhost:7994'; //本地服务器
//axios.defaults.baseURL = 'http://47.88.171.117:8084';
//axios.defaults.baseURL = 'http://101.132.171.38:8084';
axios.defaults.baseURL = 'http://101.132.171.38:7994',
  // axios.defaults.baseURL = '/api/';
  //axios.defaults.baseURL = 'http://192.168.1.124:8084';
  //axios.defaults.baseURL = 'http://192.168.25.138:8084';



  //http request 拦截器
  axios.interceptors.request.use(
    config => {
      console.log(store);
      store
        .dispatch("SETLogin")
      // const token = ('session');
      // config.data = JSON.stringify(config.data);
      // config.headers = {
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //     'Content-Type': 'application/json'
      // };
      // if (token) {
      //     config.params = (token)
      // };

      return config;
    },
    err => {
      return Promise.reject(err);
    }
  );
// http response 拦截器
/*axios.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error.response.data)
    }
);*/


//qxios 封装（GET ,POST, PUT, PATCH）
/*
 * get 请求
 * */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/*
 * post 请求
 * */
export function post(url, data = {}) {
  return new Promise(((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }), err => {
        reject(err);
      }
  }))
}

/*
 * put 请求
 * */
export function put(url, data = {}) {
  return new Promise(((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }), err => {
        reject(err);
      }
  }))
}

/*
 * patch 请求
 * */
export function patch(url, data = {}) {
  return new Promise(((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }), err => {
        reject(err);
      }
  }))
}

/*
 * 调用时
 * */
// this.$post('XXX',data).then((res)=>{
//     if (res.errorCode == 200) {
//
//     }else {
//
//     }
// });


//credit 风控配置管理 执行器参数修改
export function httpUpdateCreditPara(
  id,
  executePara
) {
  const data = {
    id,
    executePara
  };
  return axios({
    url: "/sys/changpara",
    method: "post",
    data
  });
}

//credit 风控配置管理 执行器激活/停用
export function httpUpdateCreditStatus(
  id,
  status
) {
  const data = {
    id,
    status
  };

  return axios({
    url: "/sys/changstatus",
    method: "post",
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: data
  });
}

//credit 获取风控菜单
export function httpGetCreditMenuList(loginId) {
  const data = {
    loginId
  };
  return axios({
    url: "/sys/menu",
    method: "post",
    data: qs.stringify(data)
  })
}

//credit 风控配置管理 执行器展示（新增 和复贷）
export function httpGetExecutor(npage, pagesize, type) {
  let datas = {
    npage,
    pagesize,
    type
  };
  //console.log(data);
  return axios({
    url: "/sys/getexecutor",
    method: "post",
    data: qs.stringify(datas)
  })
}

//用户列表
export function userList(userName, status) {
  let params = {
    userName,
    status
  };
  return axios({
    url: '/sys/getuserlistbyusername',
    method: 'post',
    data: qs.stringify(params)
  })
}

//后台管理模块 / Admin 手机订单展示
export function getLoanorder(npage, pagesize, userName, mobile, idNo, start, finsh, channel) {
  let data = {
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    start,
    finsh,
    channel
  };
  return axios({
    url: '/sys/loanorder',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 已否决订单与已过审订单
export function getOverList(npage, pagesize, Overhaul, userName, mobile, idNo, start, finsh, channel) {
  let data = {
    npage,
    pagesize,
    Overhaul,
    userName,
    mobile,
    idNo,
    start,
    finsh,
    channel,
  };
  return axios({
    url: '/sys/getOverList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 数据统计下的用户转化率
export function getUserConversionByDate(startDate, endDate, type = 1) {
  let data = {
    startDate,
    endDate,
    type
  };
  return axios({
    url: '/stat/userConversion',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 数据统计下的用户转化率
export function getUserConversionByMonth(startDate, endDate, type = 0) {
  let data = {
    startDate,
    endDate,
    type
  };
  return axios({
    url: '/stat/userConversion',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 数据统计下的用户转化率
export function getApplyConversion(startDate, endDate, type = 1) {
  let data = {
    startDate,
    endDate,
    type
  };
  return axios({
    url: '/stat/applyConversion',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / admin 贷后管理 贷后订单列表展示
export function getLendlist(npage, pagesize, begainTimeString, endTimeString, orderType, cash_outType) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    orderType,
    cash_outType
  };
  return axios({
    url: '/sys/lendlist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 数据中心下的全部客户列表
export function getCustUserList(npage, pagesize, source, realName, phoneNumber, idcard) {
  let data = {
    npage,
    pagesize,
    source,
    realName,
    phoneNumber,
    idcard
  };
  return axios({
    url: '/custUser/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 全部列表
export function getExeceedtimeapplyList(loginId, npage, pagesize, begainTimeString, endTimeString, phonenumber, execeedtimeType, distributionStatus, collectorId) {
  let data = {
    loginId,
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,
    execeedtimeType,
    distributionStatus,
    collectorId
  };
  return axios({
    url: '/sys/execeedtimeapplylistalready',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 未分配
export function getExeceedtimeapplyListNo(loginId, npage, pagesize, begainTimeString, endTimeString, phonenumber, execeedtimeType, distributionStatus, collectorId) {
  let data = {
    loginId,
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,
    execeedtimeType,
    distributionStatus,
    collectorId
  };
  return axios({
    url: '/sys/execeedtimeapplyList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 逾期催收操作列表展示
export function getExeceedtimeapplyListbycollector(npage, pagesize, begainTimeString, endTimeString, phoneNumber, execeedtimeType) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phoneNumber,
    execeedtimeType
  };
  return axios({
    url: '/sys/execeedtimeapplyListbycollector',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 逾期列表展示 下拉点击查看详细信息
export function httpExeceedtimeapplydetail(id) {
  return axios({
    url: "/sys/execeedtimeapplydetail",
    method: "get",
    params: {
      'id': id
    }
  })
}


//后台管理模块 / admin 贷后管理 逾期列表分配 展示催收员
export function httpGetrevewerlist() {
  return axios({
    url: "/sys/getreviewerlist",
    method: "get",
  })
}

//后台管理模块 / admin 数据中心 还款记录管理
export function getLoanRepaymentFindAll(npage, pagesize, custUserId, loanCollectionId, startDate, endDate, custname) {
  let data = {
    npage,
    pagesize,
    custUserId,
    loanCollectionId,
    startDate,
    endDate,
    custname
  };
  return axios({
    url: '/loanRepayment/findAll',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 逾期列表分配
export function execeedtimeDistribute(ids, id) {
  let data = {
    ids,
    id
  };
  return axios({
    url: '/sys/execeedtime_distribute',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 线下还款列表展示
export function getPaymentlist(npage, pagesize, begainTimeString, endTimeString, phonenumber, IdCard, repaymentStatus) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,
    IdCard,

    repaymentStatus
  };
  return axios({
    url: '/sys/paymentlist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 操作管理
export function getExec(loginId, npage, pagesize, begainTimeString, endTimeString, phonenumber, execeedtimeType, collectionStatus) {
  let data = {
    loginId,
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,
    execeedtimeType,
    collectionStatus
  };
  return axios({
    url: '/sys/execeedtimeapplyListbycollector',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 线下还款 还款操作模态框展示
export function postOfflinePayment(loanApplyId, interestOverdue, discountAmt, mustPayBackAmt, actualPayBackAmt) {
  let data = {
    loanApplyId,
    interestOverdue,
    discountAmt,
    mustPayBackAmt,
    actualPayBackAmt
  };
  return axios({
    url: '/sys/offlinepayment',
    method: 'post',
    data: qs.stringify(data)
  })
}




//后台管理模块 / admin 运营中心 客户推广列表
export function httpGetPromoters(pageNumber, pageSize, keywords) {
  let data = {
    pageNumber,
    pageSize,
    keywords
  };
  return axios({
    url: '/promoter/promoters',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / admin 运营中心 客户详细信息
export function httpGetUserDetail(custUserId) {
  let data = {
    custUserId
  };
  return axios({
    url: '/promoter/userDetail',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / admin 运营中心 客户详细信息
export function htt() {
  let data = {
    username: '21313',
    password: '12312'
  };
  return axios({
    url: '/sys/login',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 /admin 订单管理 订单列表
export function getLoanorders(npage, pagesize, begainTimeString, endTimeString, phonenumber) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber
  };
  return axios({
    url: '/sys/loanorderList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 贷后管理 重新分配催收员
export function getExeceedtimeapplyListbycollectorR(userId, id) {
  let data = {
    userId,
    id
  };
  return axios({
    url: '/sys/execeedtime_distributeafresh',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 贷后管理 逾期催收操作列表 添加催收记录
export function getAddcollectdetail(id, detail, result) {
  let data = {
    id,
    detail,
    result
  };
  return axios({
    url: '/sys/addcollectdetail',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 电销中心 电销列表
export function getEleUserList(pageNumber, pageSize, startDate, endDate, keywords, type, userId, salesmanId) {
  let data = {
    pageNumber,
    pageSize,
    startDate,
    endDate,
    keywords,
    type,
    userId,
    salesmanId
  };
  return axios({
    url: '/electrical/userInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
//后台管理模块 /admin 电销中心 电销列表
export function findCustUserForSalesman(pageNumber, pageSize, startDate, endDate, phone, name, type, userId, salesmanId) {
  let data = {
    pageNumber,
    pageSize,
    startDate,
    endDate,
    phone,
    name,
    type,
    userId,
    salesmanId
  };
  return axios({
    url: '/electrical/findCustUserForSalesman',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 /adMin 电销回访
export function getEleSalesmanRecall(userName, userMobile, salesmanId, loanApplyId, loanOrderId, recallType, remark, recallResult, type, money, custUserId) {
  let data = {
    userName,
    userMobile,
    salesmanId,
    loanApplyId,
    loanOrderId,
    recallType,
    remark,
    recallResult,
    type,
    money,
    custUserId
  };
  return axios({
    url: '/electrical/salesmanRecall',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 分配电销人员 查询电销员
export function getEleCompanyId(companyId) {
  let data = {
    companyId
  };
  return axios({
    url: '/sys/userByCompanyId',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 / admin 数据中心 app消息
export function getAppOption(npage, pagesize, custUserName, startDate, endDate) {
  let data = {

    npage,
    pagesize,
    custUserName,
    startDate,
    endDate
  };
  return axios({
    url: '/app/findCustUserOpinion',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 我的工作台 系统数据大盘
export function getPlatform(begainTimeString, endTimeString) {
  let data = {
    begainTimeString,
    endTimeString
  };
  return axios({
    url: '/sys/platform',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / admin 数据统计 滞纳金管理
export function getOverduemanager(npage, pagesize, begainTimeString, endTimeString, phonenumber, userName, IdCard, execeedtimeType, paymentStatus, collectorId) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,

    userName,
    IdCard,
    execeedtimeType,
    paymentStatus,
    collectorId
  };
  return axios({
    url: '/sys/Overduemanager',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 电销中心 新增电销员
export function getSalesmanId(salesmanId, custUserId, loanOrderId, loanApplyId, custUserName, salesmanName) {
  let data = {
    salesmanId,
    custUserId,
    loanOrderId,
    loanApplyId,
    custUserName,
    salesmanName
  };
  return axios({
    url: '/electrical/salesmanCustUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块  admin 数据中心 app消息回复
export function getSavrUserReply(loginId, custUserId, custUserOpinionId, replyContent) {
  let data = {
    loginId,
    custUserId,
    custUserOpinionId,
    replyContent
  };
  return axios({
    url: '/app/saveUserReply',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 admin 运营中心 推广情况统计
export function getPromoterList(npage, pagesize, loginId, startTime, endTime, PromotionCode) {
  let data = {
    npage,
    pagesize,
    loginId,
    startTime,
    endTime,
    PromotionCode
  };
  return axios({
    url: '/promoter/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

// / admin 电销中心 查询电销回访详情
export function getReplies(custUserId) {
  let data = {
    custUserId,
  };
  return axios({
    url: '/electrical/recalls',
    method: 'post',
    data: qs.stringify(data)
  })
}

//admin 电销中心 查询已分配的电销员
export function getSaleman(custUserId) {
  let data = {
    custUserId
  };
  return axios({
    url: '/electrical/salesman',
    method: 'post',
    data: qs.stringify(data)
  })
}

//admin 电销中心 查询已分配的电销员
export function getCollectionCount(loginId, begainTimeString, endTimeString, collectorId) {
  let data = {
    loginId,
    begainTimeString,
    endTimeString,
    collectorId
  };
  return axios({
    url: '/sys/collectioncount',
    method: 'post',
    data: qs.stringify(data)
  })
}

//admin 电销中心 查询已分配的电销员
export function getSmsrecordlist(loginId, begainTimeString, endTimeString, npage, pagesize, phonenumber) {
  let data = {
    loginId,
    begainTimeString,
    endTimeString,
    npage,
    pagesize,
    phonenumber
  };
  return axios({
    url: '/sys/smsrecordlist',
    method: 'post',
    data: qs.stringify(data)
  })
}



//admin 数据中心 全部客户管理 客户信息列表
export function getCustomerPage(CustUserId) {
  let data = {
    CustUserId
  };
  return axios({
    url: '/custUser/getCustomerPage',
    method: 'post',
    data: qs.stringify(data)
  })
}

//admin 数据中心 全部客户管理 客户信息列表
export function deleteMessage(id) {
  let data = {
    id
  };
  return axios({
    url: '/app/deleteMessage',
    method: 'post',
    data: qs.stringify(data)
  })
}


//h5  注册
export function getH5Register(msgVerCode, url, moblie, PromotionCode, PromotionMoblie, source) {
  let data = {
    msgVerCode,
    url,
    moblie,
    PromotionCode,
    PromotionMoblie,
    source
  };
  return axios({
    url: '/promoter/registered',
    method: 'post',
    data: qs.stringify(data)
  })
}

//返回值是验证码  比较一下
export function getH5Sms(moblie) {
  let data = {
    moblie
  };
  return axios({
    url: '/promoter/getVerificationCode',
    method: 'post',
    data: qs.stringify(data)
  })
}


//返回值是验证码  比较一下
export function getOfflinePaymentapplydetail(withdrawId) {
  let data = {
    withdrawId
  };
  return axios({
    url: '/sys/offlinePaymentapplydetail',
    method: 'post',
    data: qs.stringify(data)
  })
}

//返回值是验证码  比较一下
export function getOfflinePaymentapplyUpdata(realMoney, urlRemark, withdrawId, remark) {
  let data = {
    realMoney,
    urlRemark,
    withdrawId,
    remark
  };
  return axios({
    url: '/sys/offlinePaymentapplyupdate',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 角色展示
export function getRoleList(startDate, EndDate) {
  let data = {
    startDate,
    EndDate
  };
  return axios({
    url: '/admin/rolelist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 角色展示 添加或修改角色·
export function changeRoleList(rid, rname, jobTitle) {
  let data = {
    rid,
    rname,
    jobTitle
  };
  return axios({
    url: '/admin/addRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 角色菜单的查找
export function findRoleMenu(RoleId) {
  let data = {
    RoleId
  };
  return axios({
    url: '/admin/findRoleMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 修改角色菜单
export function changeRoleMenu(rid, mids) {
  let data = {
    rid,
    mids
  };
  return axios({
    url: '/admin/saveRoleMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 用户管理下面的用户列表
export function httpGetuserlistbyusername(username, status, rName, npage, pageSize) {
  let data = {
    username,
    status,
    rName,
    npage,
    pageSize
  };
  return axios({
    url: '/sys/getuserlistbyusername',
    method: 'post',
    data: qs.stringify(data)
  })
}

//credit 获取风控菜单
export function httpGetRole() {
  return axios({
    url: "sys/getRole",
    method: "get"
  })
}

//后台管理模块 / Admin 用户列表下的修改用户
export function httpUpdateuser(loginId, uid, username, phoneNumber, status, rid) {
  let data = {
    loginId,
    uid,
    username,
    phoneNumber,
    status,
    rid
  };
  return axios({
    url: '/sys/updateuser',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 密码修改
export function httpUpdatePassWord(loginId, newpassword, oldpasswoed) {
  let data = {
    loginId,
    newpassword,
    oldpasswoed
  };
  return axios({
    url: '/sys/updatePassWord',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 保存菜单栏
export function httpSaveRoleMenu(rid, mids) {
  let data = {
    rid,
    mids
  };
  return axios({
    url: '/admin/saveRoleMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 /  Admin 系统管理 菜单字典管理
export function httpMenulist(pageSize, pageNum, parentId, mname) {
  let data = {
    pageSize,
    pageNum,
    parentId,
    mname
  };
  return axios({
    url: '/sys/menulist',
    method: 'post',
    data: qs.stringify(data)
  })
}

// Admin 获取所有父菜单
export function httpFindFatherMenu() {
  return axios({
    url: "/sys/findFatherMenu",
    method: "get"
  })
}

//后台管理模块 / Admin 风控中心下的审核客户及钱包下的待分配订单
export function httpAllocatedList(npage, pagesize, username, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    npage,
    pagesize,
    username,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/allocatedList',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 / Admin 风控中心下的审核客户及钱包下的待分配订单
export function httpSaveMenu(parentId, mname, sort, mid) {
  let data = {
    parentId,
    mname,
    sort,
    mid
  };
  return axios({
    url: '/sys/saveMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 数据统计 提现金额列表
export function httpWithdrawlist(npage, pagesize, begainTimeString, endTimeString, phonenumber, withdrawStatus) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    phonenumber,
    withdrawStatus
  };
  return axios({
    url: '/sys/withdrawlist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 数据统计 提现金额列表
export function httpCustUserList(npage, pagesize, source, realName, phoneNumber, idcard) {
  let data = {
    npage,
    pagesize,
    source,
    realName,
    phoneNumber,
    idcard
  };
  return axios({
    url: '/custUser/list',
    method: 'post',
    data: qs.stringify(data)
  })
}







//后台管理模块 / 得到用户信息
export function httpGetCustomterMesage(id) {
  let data = {
    id
  };
  return axios({
    url: '/sys/getCustomterMesage',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 得到用户信息
export function httpUpdateCuster(loginId, id, status = 0) {
  let data = {
    loginId,
    id,
    status
  };
  return axios({
    url: '/custUser/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 系统管理 系统参数设置（展示）
export function httpParametershow() {
  return axios({
    url: "/sys/parametershow",
    method: "get",
  })
}

//后台管理模块 /admin 系统管理 利率修改
export function httpRateupdate(borrowDay, rateAll, overdue_rate, management_rate, liquidated_rate) {
  let data = {
    borrowDay,
    rateAll,
    overdue_rate,
    management_rate,
    liquidated_rate
  };
  return axios({
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    url: '/sys/rateupdate',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpUpdateparameter(param, type, status) {
  let data = {
    param,
    type,
    status
  };
  return axios({
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    url: '/sys/updateparameter',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 系统管理 公告列表展示
export function httpGetannouncealist(npage, pagesize) {
  let data = {
    npage,
    pagesize
  };
  return axios({
    url: '/sys/getannouncealist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 系统管理 公告修改
export function httpGetannounceaupdate(id, title, content) {
  let data = {
    id,
    title,
    content
  };
  return axios({
    url: '/sys/getannounceaupdate',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / admin 系统管理 公告失效
export function httpAnnounceadelate(id) {
  return axios({
    url: "/sys/announceadelate",
    method: "get",
    params: {
      'id': id
    }
  })
}

//后台管理模块 /  系统管理 公告添加
export function httpAnnounceadd(title, content) {
  let data = {

    title,
    content
  };
  return axios({
    url: '/sys/announceadd',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 系统管理 系统利率添加
export function httpParameteradd(rateAll, borrowDay, overdue_rate) {
  let data = {

    rateAll,
    borrowDay,
    overdue_rate

  };
  return axios({
    url: '/sys/parameteradd',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 数据统计 销售统计
export function httpGetsales(salesCountType,
  begainTimeString,
  endTimeString) {
  let data = {

    salesCountType,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/getsales',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 数据统计 审核统计
export function httpExaminecount(examineType,
  begainTimeString,
  endTimeString) {
  let data = {

    examineType,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/examinecount',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 数据统计 还款统计
export function httpRepaymentcount(repaymentCountType,
  begainTimeString,
  endTimeString) {
  let data = {

    repaymentCountType,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/repaymentcount',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  数据统计 用户注册统计
export function httpRegistercount(registercountCountType,
  begainTimeString,
  endTimeString) {
  let data = {

    registercountCountType,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/registercount',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /  admin 审核员审核统计
export function httpExaminecountbyassessor(exeamtorId, begainTimeString,
  endTimeString,
  examineType) {
  let data = {
    exeamtorId,
    begainTimeString,
    endTimeString,
    examineType

  };
  return axios({
    url: '/sys/examinecountbyassessor',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / admin 运营中心 客户通讯录
export function httpMobileList(userId) {
  let data = {

    userId

  };
  return axios({
    url: '/electrical/mobileList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 运营中心 售前营销
export function httpPreSalest(salesmanId, pageNumber, pageSize, keywords, startDate, endDate, type, ) {
  let data = {

    salesmanId,
    type,
    pageNumber,
    pageSize,
    keywords,
    startDate,
    endDate,
    type

  };
  return axios({
    url: '/electrical/preSales',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 运营中心 售前营销
export function httpAfterSales(salesmanId, pageNumber, pageSize, keywords, startDate, endDate, type, ) {
  let data = {

    salesmanId,
    type,
    pageNumber,
    pageSize,
    keywords,
    startDate,
    endDate,
    type

  };
  return axios({
    url: '/electrical/afterSales',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 数据统计 提现列表
export function httpBaofuwithdrawLists(npage, pagesize, begainTimeString, endTimeString, withdrawStatus, userName, IdCard) {
  let data = {



    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    withdrawStatus,
    userName,
    IdCard

  };
  return axios({
    url: '/sys/baofuwithdrawList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 数据统计 还款列表
export function httpBaofurepaymentlist(npage, pagesize, begainTimeString, endTimeString, withdrawStatus, userName, IdCard) {
  let data = {

    npage,
    pagesize,

    begainTimeString,
    endTimeString,
    withdrawStatus,
    userName,
    IdCard

  };
  return axios({
    url: '/sys/baofurepaymentlist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 数据统计 还款列表
export function httpXianxiarepaymentsuccesslist(npage, pagesize, begainTimeString, endTimeString, withdrawStatus, userName, IdCard) {
  let data = {

    npage,
    pagesize,

    begainTimeString,
    endTimeString,
    withdrawStatus,
    userName,
    IdCard

  };
  return axios({
    url: '/sys/xianxiarepaymentsuccesslist',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 催收分配管理 已经分配列表
export function httpExeceedtimeapplylistalready(pagesize, npage, begainTimeString, endTimeString, withdrawStatus) {
  let data = {


    pagesize,
    npage,
    begainTimeString,
    endTimeString,
    withdrawStatus

  };
  return axios({
    url: '/sys/execeedtimeapplylistalready',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 催收分配管理 已经分配列表
export function httpRecordStatistics(salesmanId, pageNumber, pageSize, startDate, endDate) {
  let data = {
    salesmanId,
    pageNumber,
    pageSize,
    startDate,
    endDate

  };
  return axios({
    url: '/electrical/recordStatistics',
    method: 'post',
    data: qs.stringify(data)
  })
}

//credit 获取所有审核员
export function httpGetRoleName() {
  return axios({
    url: "/sys/getAllRoleName",
    method: "get"
  })
}

//credit 获取所有推广码
export function httpFindAllPrometion() {
  return axios({
    url: "/promoter/findAllPrometion",
    method: "get"
  })
}

//后台管理模块 /admin 催收分配管理 已经分配列表
export function httpElectricalStatistics(pageNumber, pageSize, salesmanId, startDate, endDate) {
  let data = {
    pageNumber,
    pageSize,
    salesmanId,
    startDate,
    endDate

  };
  return axios({
    url: '/electrical/electricalStatistics',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin 电销员放款次数统计
export function httpSalesmanLoanTimes(salesmanId, startDate, endDate) {
  let data = {
    salesmanId,
    startDate,
    endDate

  };
  return axios({
    url: '/electrical/salesmanLoanTimes',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /admin  电销员放款总额统计
export function httpSalesmanLoanSum(salesmanId, startDate, endDate) {
  let data = {
    salesmanId,
    startDate,
    endDate

  };
  return axios({
    url: '/electrical/salesmanLoanSum',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /贷后管理 催收经理审核界面
export function httpPaymentlistbycollectmanager(loginId, npage, pagesize, repaymentStatus, IdCard, userName, phonenumber, begainTimeString, endTimeString) {
  let data = {
    loginId,
    npage,
    pagesize,
    repaymentStatus,
    IdCard,
    userName,
    phonenumber,
    begainTimeString,
    endTimeString
  };
  return axios({
    url: '/sys/paymentlistbycollectmanager',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 /贷后管理 催收经理操作相关
export function httpPaymentlistbycollectmanageroper(id, status, remark_manager) {
  let data = {
    id,
    status,
    remark_manager

  };
  return axios({
    url: '/sys/paymentlistbycollectmanageroper',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /运营中心 查询短信平台
export function httpEleMsgPlatform() {

  return axios({
    url: '/electrical/msgPlatform',
    method: 'post',
  })
}

//后台管理模块 /新增短信签名
export function httpEleSignature(signature, platformId) {
  let data = {
    signature,
    platformId

  };
  return axios({
    url: '/electrical/signature',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 /发送短信接口
export function httpEleSendMsg(mobiles, content, signature, msgPlatformId) {
  let data = {
    mobiles,
    content,
    signature,
    msgPlatformId

  };
  return axios({
    url: '/electrical/sendMsg',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /风控中心提交客户信息
export function httpUpdataLoanApply(type, id, approveAmt, remark, loginId, overruleId) {
  let data = {

    type,
    id,
    approveAmt,
    remark,
    loginId,
    overruleId
  };
  return axios({
    url: '/sys/updataLoanApply',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 /风控中心待通过
export function httpSysManagerReview(loginId, npage, pagesize, userName, startDateString, finshDateString, mobile, idNo, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    startDateString,
    finshDateString,
    mobile,
    idNo,
    channel

  };
  return axios({
    url: '/sys/ManagerReview',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 /修改
export function httpSysUpdateUser(loginId, id, phoneNumber, wxNumber, idcard, detailAddress, realName) {
  let data = {
    loginId,
    id,
    phoneNumber,
    wxNumber,
    idcard,
    detailAddress,
    realName

  };
  return axios({
    url: '/custUser/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /修改
export function httpConditionofbusiness(loginId) {
  let data = {
    loginId,
  };
  return axios({
    url: '/sys/conditionofbusiness',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /根据平台获取所有的签名
export function httpEleSignatures(platformId) {
  let data = {
    platformId,
  };
  return axios({
    url: '/electrical/signatures',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /发送短信接口
export function httpSendMsg(mobiles, content, signature, msgPlatformId) {
  let data = {
    mobiles,
    content,
    signature,
    msgPlatformId
  };
  return axios({
    url: '/electrical/sendMsg',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /发送短信接口
export function httpOverduecollectsucesslist(npage, pagesize, userName, IdCard, begainTimeString, endTimeString, collectorId) {
  let data = {
    npage,
    pagesize,
    userName,
    IdCard,
    begainTimeString,
    endTimeString,
    collectorId
  };
  return axios({
    url: '/sys/overduecollectsucesslist',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 / Admin 风控中心下的审核客户及钱包下的高风险
export function httpRefuseList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/RefuseList',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 /风控中心待分配
export function httpSysAllocatedList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {

    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel

  };
  return axios({
    url: '/sys/allocatedList',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / Admin 风控中心下的审核客户及钱包下的待通过订单
export function httpManagerReview(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/ManagerReview',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / Admin 风控中心下的审核客户及钱包下的已分配订单
export function httpUnderReviewList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/UnderReviewList',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / Admin 风控中心下的审核客户及钱包下的已分配订单
export function httpAssignedList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/AssignedList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 查询审核员
export function httpGetRoleNames() {
  return axios({
    url: "/sys/getRoleName",
    method: "get",
  })
}

//后台管理模块 / Admin 风控中心下的审核客户及钱包下的已分配订单
export function httpSetReviewe(loginId, ids, Userid) {
  let data = {
    loginId,
    ids,
    Userid
  };
  return axios({
    url: '/sys/setReviewer',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / Admin 查看风控报告
export function httpGetCreditReport(id, ) {
  let data = {

    id,

  };
  return axios({
    url: 'sys/getCreditReport',
    method: 'post',
    data: qs.stringify(data)
  })
}



//后台管理模块 /审核中
export function httpSysUnderReviewList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {

    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel

  };
  return axios({
    url: '/sys/UnderReviewList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 /已审核
export function httpGetApplyed(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel

  };
  return axios({
    url: '/sys/getApplyed',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 全部
export function httpLoanapply(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel, operatorName) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel,
    operatorName
  };
  return axios({
    url: '/sys/loanapply',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 已通过
export function httpGetOverList(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/getOverList',
    method: 'post',
    data: qs.stringify(data)
  })
}

//后台管理模块 / 未通过
export function httpGetNotApplyOrder(loginId, npage, pagesize, userName, mobile, idNo, startDateString, finshDateString, channel) {
  let data = {
    loginId,
    npage,
    pagesize,
    userName,
    mobile,
    idNo,
    startDateString,
    finshDateString,
    channel
  };
  return axios({
    url: '/sys/getNotApplyOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / 未通过
// export function httpGxeceedtime_distributeafreshbatch(arr, userId) {
//   let data = {
//     arr,
//     userId
//   };
//   return axios({

//     url: '/execeedtime_distributeafreshbatch',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data: JSON.stringify(data)
//   })
// }

export function httpGxeceedtime_distributeafreshbatch(arr, userId) {
  let data = {
    arr,
    userId
  };
  return axios({
    url: '/execeedtime_distributeafreshbatch',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpPaymentapplylist(loginId, paymentStatus, npage, pagesize, begainTimeString, endTimeString, IdCard, userName, phonenumber) {
  let data = {
    loginId,
    paymentStatus,
    npage,
    pagesize,
    begainTimeString,
    endTimeString,
    IdCard,
    userName,
    phonenumber
  };
  return axios({
    url: '/sys/paymentapplylist',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpOfflinepayment(loginId, repayment_type, loanApplyId, interestOverdue, mustPayBackAmt, remarks, status, loanpaymentId, applyresult, withDrarId, id, realRepaymentTimeString) {
  let data = {
    loginId,
    repayment_type,
    loanApplyId,
    interestOverdue,
    mustPayBackAmt,
    remarks,
    status,
    loanpaymentId,
    applyresult,
    withDrarId,
    id,
    realRepaymentTimeString
  };
  return axios({
    url: '/sys/offlinepayment',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpOfflinePaymentapply(loginId, reduceMoney, realMoney, withdrawId, realRepaymentTimeString, remark_collect, repayment_type) {
  let data = {
    loginId,
    reduceMoney,
    realMoney,
    withdrawId,
    realRepaymentTimeString,
    remark_collect,
    repayment_type
  };
  return axios({
    url: '/sys/offlinePaymentapply',
    method: 'post',
    data: qs.stringify(data)
  })
}


// export function httpOfflinePaymentapply(
//   loginId, reduceMoney,realMoney,realRepaymentTimeString,withdrawId,remark_collect,repayment_type
// ) {
//   let data = {
//     loginId, reduceMoney,realMoney,realRepaymentTimeString,withdrawId,remark_collect,repayment_type
//   };
//   return axios({
//     url: '/sys/offlinePaymentapply',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }
export function httpAppreducemoney(loginId, id, penalty_money) {
  let data = {
    loginId,
    id,
    penalty_money,
  };
  return axios({
    url: '/sys/appreducemoney',
    method: 'post',
    data: qs.stringify(data)
  })
}

//得到
export function httpGetAppVersion(id) {
  return axios({
    url: "/admin/getAppVersion",
    method: "get",
  })
}

export function httpUpdateVersion(
  type, version, pkgUrl, forced
) {
  let data = {
    type,
    version,
    pkgUrl,
    forced
  };
  return axios({
    url: '/admin/updateVersion',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpExceedcount(
  npage, pagesize, begainTimeString, endTimeString
) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString
  };
  return axios({
    url: '/sys/exceedcount',
    method: 'post',
    data: qs.stringify(data)
  })
}

//平台逾期整体展示
export function httpPlatformexceedcount(
  begainTimeString, endTimeString
) {
  let data = {
    begainTimeString,
    endTimeString
  };
  return axios({
    url: '/sys/platformexceedcount',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* 平台订单整体概况 */
export function httpPlatformwithdrawabout(

) {
  let data = {

  };
  return axios({
    url: '/sys/platformwithdrawabout',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* 认证统计 */
export function httpAuthstatistics(
  npage, pagesize, begainTimeString, endTimeString
) {
  let data = {
    npage,
    pagesize,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/authstatistics',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* 平台 */
export function httpGettiqianfublacklistvarious(
  realName, mobNum, idNum, type
) {
  let data = {
    realName,
    mobNum,
    idNum,
    type
  };
  return axios({
    url: 'http://101.132.171.38:8082/sys/gettiqianfublacklistvarious',
    // url: 'http://129.28.69.40:8082/sys/gettiqianfublacklistvarious',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpGettiqianfublacklistvariouss(
  realName, mobNum, idNum, type
) {
  let data = {
    realName,
    mobNum,
    idNum,
    type
  };
  return axios({
    // url: 'http://101.132.171.38:8082/sys/gettiqianfublacklistvarious',
    url: 'http://129.28.69.40:8082/sys/gettiqianfublacklistvarious',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* admin 优惠卷客户列表展示 */
export function httpGetcustcouponlist(
  npage, pagesize, useNumber, overdueNumber, withDrawTimeStringBegain, withDrawTimeStringEnd, status, begainTimeString, endTimeString
) {
  let data = {
    npage,
    pagesize,
    useNumber,
    overdueNumber,
    withDrawTimeStringBegain,
    withDrawTimeStringEnd,
    status,
    begainTimeString,
    endTimeString

  };
  return axios({
    url: '/sys/getcustcouponlist',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* admin 优惠卷客户列表展示 */
export function httpFindCouponType() {
  let data = {};
  return axios({
    url: '/findCouponType',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* admin 优惠卷客户列表删除 */
export function httpDeleteCouponType(id) {
  let data = {
    id
  };
  return axios({
    url: '/deleteCouponType',
    method: 'post',
    data: qs.stringify(data)
  })
}


//后台管理模块 / 矿机型号修改 传递 图片格式
export function httpInsertCouponType(couponValue, couponIntervalMin, couponIntervalMax, couponTitle, extinctTime, type, imgaeUrl, id) {
  if (imgaeUrl) {
    let param = new FormData(); //创建form对象
    param.append('save', imgaeUrl); //通过append向form对象添加数据
    param.append('couponValue', couponValue); //通过append向form对象添加数据
    param.append('couponIntervalMin', couponIntervalMin); //通过append向form对象添加数据
    if (couponIntervalMax) {
      param.append('couponIntervalMax', couponIntervalMax); //通过append向form对象添加数据
    }
    param.append('couponTitle', couponTitle); //通过append向form对象添加数据
    param.append('extinctTime', extinctTime); //通过append向form对象添加数据
    param.append('type', type); //通过append向form对象添加数据
    if (id) {
      param.append('id', id); //通过append向form对象添加数据
    }
    return axios({
      url: '/insertCouponType',
      method: 'post',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: param
    })
  } else {
    let data = {
      couponValue,
      couponIntervalMin,
      couponIntervalMax,
      couponTitle,
      extinctTime,
      type,
      id
    };
    return axios({
      url: '/insertCouponType',
      method: 'post',
      data: qs.stringify(data)
    })
  }

}

/* admin 优惠卷客户列表删除 */
export function httpExceedcountdetail(dateString) {
  let data = {
    dateString
  };
  return axios({
    url: '/sys/exceedcountdetail',
    method: 'post',
    data: qs.stringify(data)
  })
}

/* admin 优惠卷客户列表删除 */
export function httpInsertCustCoupon(couponTypeId, custUserIds) {
  let data = {
    couponTypeId,
    custUserIds
  };
  return axios({
    url: '/insertCustCoupon',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function httpGetcustcoupondetail(custId) {
  let data = {
    custId
  };
  return axios({
    url: '/sys/getcustcoupondetail',
    method: 'post',
    data: qs.stringify(data)
  })
}
