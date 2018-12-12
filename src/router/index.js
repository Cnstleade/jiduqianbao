import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/admin',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/',
          component: resolve => require(['../components/page/myWorkbench.vue'], resolve),
          meta: {
            title: '我的工作台'
          }
        },

      ]
      // children: [{
      //     path: '/',
      //     redirect: '/myWorkbench'
      //   },
      //   {
      //     path: '/myWorkbench',
      //     component: resolve => require(['../components/page/myWorkbench.vue'], resolve),
      //     meta: {
      //       title: '我的工作台'
      //     }
      //   },
      //   {
      //     path: '/receiverlist',
      //     component: resolve => require(['../components/page/customerManagement/receiverlist.vue'], resolve),
      //     meta: {
      //       title: '借贷人列表'
      //     }
      //   },
      //   {
      //     path: '/orderList',
      //     component: resolve => require(['../components/page/orderManagement/orderList.vue'], resolve),
      //     meta: {
      //       title: '订单列表'
      //     }
      //   },
      //   {
      //     path: '/bindApproval',
      //     component: resolve => require(['../components/page/beforeCrbedit/bindApproval.vue'], resolve),
      //     meta: {
      //       title: '人工审批绑定'
      //     }
      //   },
      //   {
      //     path: '/peopleApproval',
      //     component: resolve => require(['../components/page/beforeCrbedit/peopleApproval.vue'], resolve),
      //     meta: {
      //       title: '人工审批'
      //     }
      //   },
      //   {
      //     path: '/passApproval',
      //     component: resolve => require(['../components/page/beforeCrbedit/passApproval.vue'], resolve),
      //     meta: {
      //       title: '已过审批列表'
      //     }
      //   },
      //   {
      //     path: '/vetoList',
      //     component: resolve => require(['../components/page/beforeCrbedit/vetoList.vue'], resolve),
      //     meta: {
      //       title: '已否决列表'
      //     }
      //   },
      //   {
      //     path: '/transactList',
      //     component: resolve => require(['../components/page/creditManagement/transactList.vue'], resolve),
      //     meta: {
      //       title: '办理中的列表'
      //     }
      //   },
      //   {
      //     path: '/credit',
      //     component: resolve => require(['../components/page/afterLoan/credit.vue'], resolve),
      //     meta: {
      //       title: '放款管理'
      //     }
      //   },
      //   {
      //     path: '/repayment',
      //     component: resolve => require(['../components/page/afterLoan/repayment.vue'], resolve),
      //     meta: {
      //       title: '还款管理'
      //     }
      //   },
      //   {
      //     path: '/operation',
      //     component: resolve => require(['../components/page/afterLoan/operation.vue'], resolve),
      //     meta: {
      //       title: '催收操作管理'
      //     }
      //   },
      //   {
      //     path: '/collection',
      //     component: resolve => require(['../components/page/afterLoan/collection.vue'], resolve),
      //     meta: {
      //       title: '催收管理'
      //     }
      //   },
      //   {
      //     path: '/conversionRate',
      //     component: resolve => require(['../components/page/dataStatistics/conversionRate.vue'], resolve),
      //     meta: {
      //       title: '用户转化率'
      //     }
      //   },
      //   {
      //     path: '/auditConversionrate',
      //     component: resolve => require(['../components/page/dataStatistics/auditConversionrate.vue'], resolve),
      //     meta: {
      //       title: '审核转化率'
      //     }
      //   },
      //   {
      //     // 用户列表
      //     path: '/userList',
      //     component: resolve => require(['../components/page/userManagement/userList.vue'], resolve),
      //     meta: {
      //       title: '用户列表',
      //     }
      //   },
      //   {
      //     // 修改密码
      //     path: '/editPassword',
      //     component: resolve => require(['../components/page/userManagement/editPassword.vue'], resolve),
      //     meta: {
      //       title: '修改密码',
      //     }
      //   },
      //   {
      //     // 菜单字典管理
      //     path: '/dictionaryManagement',
      //     component: resolve => require(['../components/page/systemManagement/dictionaryManagement.vue'], resolve),
      //     meta: {
      //       title: '菜单字典管理',
      //     }
      //   },
      //   {
      //     // 菜单字典管理
      //     path: '/systemManagement',
      //     component: resolve => require(['../components/page/systemManagement/systemManagement.vue'], resolve),
      //     meta: {
      //       title: '系统参数',
      //     }
      //   },
      //   {
      //     // 日志管理
      //     path: '/logManagement',
      //     component: resolve => require(['../components/page/systemManagement/logManagement.vue'], resolve),
      //     meta: {
      //       title: '日志管理',
      //     }
      //   },

      //   {
      //     // 系统公告
      //     path: '/systemAnnouncement',
      //     component: resolve => require(['../components/page/systemManagement/systemAnnouncement.vue'], resolve),
      //     meta: {
      //       title: '系统公告',
      //     }
      //   },
      //   {
      //     // 消息管理
      //     path: '/messageManagement',
      //     component: resolve => require(['../components/page/systemManagement/messageManagement.vue'], resolve),
      //     meta: {
      //       title: '消息管理',
      //     }
      //   },
      //   {
      //     // 系统开户
      //     path: '/systemAccount',
      //     component: resolve => require(['../components/page/systemManagement/systemAccount.vue'], resolve),
      //     meta: {
      //       title: '系统开户',
      //     }
      //   },
      //   {
      //     // 快速贷客户催收
      //     path: '/rapidCustomerCollection',
      //     component: resolve => require(['../components/page/debtManagement/rapidCustomerCollection.vue'], resolve),
      //     meta: {
      //       title: '快速贷客户催收',
      //     }
      //   },
      //   {
      //     // 滞纳金管理
      //     path: '/lateFeeManagement',
      //     component: resolve => require(['../components/page/debtManagement/lateFeeManagement.vue'], resolve),
      //     meta: {
      //       title: '滞纳金管理',
      //     }
      //   },
      //   {
      //     //停用客户借款列表
      //     path: '/deactivateCustomerLoanList',
      //     component: resolve => require(['../components/page/debtManagement/deactivateCustomerLoanList.vue'], resolve),
      //     meta: {
      //       title: '停用客户借款列表',
      //     }
      //   },
      //   {
      //     // 审核逾期统计
      //     path: '/overdueStatistics',
      //     component: resolve => require(['../components/page/debtManagement/overdueStatistics.vue'], resolve),
      //     meta: {
      //       title: '审核逾期统计',
      //     }
      //   },
      //   {
      //     // 快速操作面板
      //     path: '/quickActionPanel',
      //     component: resolve => require(['../components/page/debtManagement/quickActionPanel.vue'], resolve),
      //     meta: {
      //       title: '快速操作面板',
      //     }
      //   },

      //   {
      //     // 全部客户管理
      //     path: '/totalCustomerManagement',
      //     component: resolve => require(['../components/page/recordsCenter/totalCustomerManagement.vue'], resolve),
      //     meta: {
      //       title: '全部客户管理',
      //     }
      //   },

      //   {
      //     // 还款记录管理
      //     path: '/repaymentRecordManagement',
      //     component: resolve => require(['../components/page/recordsCenter/repaymentRecordManagement.vue'], resolve),
      //     meta: {
      //       title: '还款记录管理',
      //     }
      //   },

      //   {
      //     // APP消息中心
      //     path: '/appMessageCenter',
      //     component: resolve => require(['../components/page/recordsCenter/appMessageCenter.vue'], resolve),
      //     meta: {
      //       title: 'APP消息中心',
      //     }
      //   },

      //   {
      //     // 短信管理
      //     path: '/smsManagement',
      //     component: resolve => require(['../components/page/recordsCenter/smsManagement.vue'], resolve),
      //     meta: {
      //       title: '短信管理',
      //     }
      //   },

      //   {
      //     // 快速操作面板
      //     path: '/lateFees',
      //     component: resolve => require(['../components/page/recordsCenter/lateFees.vue'], resolve),
      //     meta: {
      //       title: '滞纳金账单',
      //     }
      //   },

      //   {
      //     // 财务状况
      //     path: '/financialSituation',
      //     component: resolve => require(['../components/page/recordsCenter/financialSituation.vue'], resolve),
      //     meta: {
      //       title: '财务状况',
      //     }
      //   },
      //   {
      //     // 推广客户列表
      //     path: '/promotionCustomerList',
      //     component: resolve => require(['../components/page/operatingCenter/promotionCustomerList.vue'], resolve),
      //     meta: {
      //       title: '推广客户列表',
      //     }
      //   },
      //   {
      //     // 推广情况列表
      //     path: '/promotionList',
      //     component: resolve => require(['../components/page/operatingCenter/promotionList.vue'], resolve),
      //     meta: {
      //       title: '推广情况列表',
      //     }
      //   },
      //   {
      //     // 代扣订单维护
      //     path: '/withholdOrder',
      //     component: resolve => require(['../components/page/paymentManagement/withholdOrder.vue'], resolve),
      //     meta: {
      //       title: '代扣订单维护',
      //     }
      //   },
      //   {
      //     // 代扣消息管理
      //     path: '/withholdMessage',
      //     component: resolve => require(['../components/page/paymentManagement/withholdMessage.vue'], resolve),
      //     meta: {
      //       title: '代扣消息管理',
      //     }
      //   },
      //   {
      //     // 代付日志管理
      //     path: '/payforLog',
      //     component: resolve => require(['../components/page/paymentManagement/payforLog.vue'], resolve),
      //     meta: {
      //       title: '代付日志管理',
      //     }
      //   },
      //   {
      //     // 代付消息管理
      //     path: '/payforMessage',
      //     component: resolve => require(['../components/page/paymentManagement/payforMessage.vue'], resolve),
      //     meta: {
      //       title: '代付消息管理',
      //     }
      //   },
      //   {
      //     // 线上还款记录
      //     path: '/onlinePayment',
      //     component: resolve => require(['../components/page/paymentManagement/onlinePayment.vue'], resolve),
      //     meta: {
      //       title: '线上还款记录',
      //     }
      //   },
      //   {
      //     // 审核客户及钱包
      //     path: '/reviewCustomersAndWallets',
      //     component: resolve => require(['../components/page/riskControlCenter/reviewCustomersAndWallets'], resolve),
      //     meta: {
      //       title: '审核订单池',
      //     }
      //   },
      //   {
      //     // 审核中订单
      //     path: '/orderUnderReview',
      //     component: resolve => require(['../components/page/riskControlCenter/orderUnderReview'], resolve),
      //     meta: {
      //       title: '审核员审核岗',
      //     }
      //   },
      //   {
      //     // 已审核订单
      //     path: '/auditedOrder',
      //     component: resolve => require(['../components/page/riskControlCenter/auditedOrder'], resolve),
      //     meta: {
      //       title: '审核经理审核岗',
      //     }
      //   },
      //   {
      //     // 分期计算器
      //     path: '/stageCalculator',
      //     component: resolve => require(['../components/page/riskControlCenter/stageCalculator'], resolve),
      //     meta: {
      //       title: '分期计算器',
      //     },
      //   },
      //   {
      //     //催收统计
      //     path: '/collectionRecords',
      //     component: resolve => require(['../components/page/recordsCenter/collectionRecords'], resolve),
      //     meta: {
      //       title: '催收记录统计',
      //     },
      //   },
      //   {
      //     //提现金额
      //     path: '/withdrawlist',
      //     component: resolve => require(['../components/page/recordsCenter/withdrawlist'], resolve),
      //     meta: {
      //       title: '提现金额',
      //     },
      //   },
      //   // {
      //   //   // 申请重审客户
      //   //   path: '/applyForCustomerReview',
      //   //   component: resolve => require(['../components/page/riskControlCenter/applyForCustomerReview'], resolve),
      //   //   meta: {
      //   //     title: '申请重审客户',
      //   //   }
      //   // },
      //   {
      //     // 高额预约客户
      //     path: '/highCostBookingCustomers',
      //     component: resolve => require(['../components/page/riskControlCenter/highCostBookingCustomers'], resolve),
      //     meta: {
      //       title: '高额预约客户',
      //     }
      //   },
      //   {
      //     // 电销列表
      //     path: '/electricityUserList',
      //     component: resolve => require(['../components/page/electricityCenter/electricityList'], resolve),
      //     meta: {
      //       title: '电销列表',
      //     }
      //   },
      //   {
      //     // 申请重审客户
      //     path: '/applyForCustomerReview',
      //     component: resolve => require(['../components/page/riskControlCenter/applyForCustomerReview'], resolve),
      //     meta: {
      //       title: '申请重审客户',
      //     }
      //   },
      //   {
      //     // 申请重审客户
      //     path: '/w',
      //     component: resolve => require(['../components/page/w/w'], resolve),
      //     meta: {
      //       title: '申请重审客户',
      //     }
      //   },
      //   {
      //     // 申请重审客户
      //     path: '/table',
      //     component: resolve => require(['../components/page/table/table'], resolve),
      //     meta: {
      //       title: 'table',
      //     }
      //   },
      //   {
      //     // 申请重审客户
      //     path: '/report',
      //     component: resolve => require(['../components/page/table/report'], resolve),
      //     meta: {
      //       title: 'report',
      //     }
      //   }
      // ]
    },
    {
      path: '/operation1',
      component: resolve => require(['../components/page/afterLoan/operation.vue'], resolve),
      meta: {
        title: '催收操作管理'
      }
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
      path: '/appRegister/:mobile/:code',
      component: resolve => require(['../components/app/register.vue'], resolve)
    },
    {
      path: '/appRegister',
      component: resolve => require(['../components/app/register.vue'], resolve)
    },
    {
      path: '/download',
      component: resolve => require(['../components/app/download.vue'], resolve)
    },
  ]
})

export const powerRouter = [{
  path: '/admin',
  component: resolve => require(['../components/common/Home.vue'], resolve),
  meta: {
    title: '自述文件'
  },
  children: [{
      path: '/myWorkbench',
      component: resolve => require(['../components/page/myWorkbench.vue'], resolve),
      meta: {
        title: '我的工作台',
        role: 'myWorkbench'
      }
    },
    {
      path: '/receiverlist',
      component: resolve => require(['../components/page/customerManagement/receiverlist.vue'], resolve),
      meta: {
        title: '借贷人列表',
        role: 'receiverlist'
      }
    },
    {
      path: '/orderList',
      component: resolve => require(['../components/page/orderManagement/orderList.vue'], resolve),
      meta: {
        title: '订单列表',
        role: 'orderList'
      }
    },
    {
      path: '/bindApproval',
      component: resolve => require(['../components/page/beforeCrbedit/bindApproval.vue'], resolve),
      meta: {
        title: '人工审批绑定',
        role: 'bindApproval'
      }
    },
    {
      path: '/peopleApproval',
      component: resolve => require(['../components/page/beforeCrbedit/peopleApproval.vue'], resolve),
      meta: {
        title: '人工审批',
        role: 'peopleApproval'
      }
    },
    {
      path: '/passApproval',
      component: resolve => require(['../components/page/beforeCrbedit/passApproval.vue'], resolve),
      meta: {
        title: '已过审批列表',
        role: 'passApproval'
      }
    },
    {
      path: '/vetoList',
      component: resolve => require(['../components/page/beforeCrbedit/vetoList.vue'], resolve),
      meta: {
        title: '已否决列表',
        role: 'vetoList'
      }
    },
    {
      path: '/transactList',
      component: resolve => require(['../components/page/creditManagement/transactList.vue'], resolve),
      meta: {
        title: '办理中的列表',
        role: 'transactList'
      }
    },
    {
      path: '/credit',
      component: resolve => require(['../components/page/afterLoan/credit.vue'], resolve),
      meta: {
        title: '放款管理',
        role: 'credit'
      }
    },
    {
      path: '/repayment',
      component: resolve => require(['../components/page/afterLoan/repayment.vue'], resolve),
      meta: {
        title: '还款管理',
        role: 'repayment'
      }
    },
    {
      path: '/operation',
      component: resolve => require(['../components/page/afterLoan/operation.vue'], resolve),
      meta: {
        title: '催收操作管理',
        role: 'operation'
      }
    },
    {
      path: '/collection',
      component: resolve => require(['../components/page/afterLoan/collection.vue'], resolve),
      meta: {
        title: '催收管理',
        role: 'collection'
      }
    },
    {
      path: '/conversionRate',
      component: resolve => require(['../components/page/dataStatistics/conversionRate.vue'], resolve),
      meta: {
        title: '用户转化率',
        role: 'conversionRate'
      }
    },
    {
      path: '/auditConversionrate',
      component: resolve => require(['../components/page/dataStatistics/auditConversionrate.vue'], resolve),
      meta: {
        title: '审核转化率',
        role: 'auditConversionrate'
      }
    },
    {
      // 用户列表
      path: '/userList',
      component: resolve => require(['../components/page/userManagement/userList.vue'], resolve),
      meta: {
        title: '用户列表',
        role: 'userList'
      }
    },
    {
      // 修改密码
      path: '/editPassword',
      component: resolve => require(['../components/page/userManagement/editPassword.vue'], resolve),
      meta: {
        title: '修改密码',
        role: 'editPassword'
      }
    },
    {
      // 菜单字典管理
      path: '/dictionaryManagement',
      component: resolve => require(['../components/page/systemManagement/dictionaryManagement.vue'], resolve),
      meta: {
        title: '菜单字典管理',
        role: 'dictionaryManagement'
      }
    },
    {
      // 菜单字典管理
      path: '/systemManagement',
      component: resolve => require(['../components/page/systemManagement/systemManagement.vue'], resolve),
      meta: {
        title: '系统参数',
        role: 'systemManagement'
      }
    },
    {
      // 日志管理
      path: '/logManagement',
      component: resolve => require(['../components/page/systemManagement/logManagement.vue'], resolve),
      meta: {
        title: '日志管理',
        role: 'logManagement'
      }
    },

    {
      // 系统公告
      path: '/systemAnnouncement',
      component: resolve => require(['../components/page/systemManagement/systemAnnouncement.vue'], resolve),
      meta: {
        title: '系统公告',
        role: 'systemAnnouncement'
      }
    },
    {
      // 消息管理
      path: '/messageManagement',
      component: resolve => require(['../components/page/systemManagement/messageManagement.vue'], resolve),
      meta: {
        title: '消息管理',
        role: 'messageManagement'
      }
    },
    {
      // 系统开户
      path: '/systemAccount',
      component: resolve => require(['../components/page/systemManagement/systemAccount.vue'], resolve),
      meta: {
        title: '系统开户',
        role: 'systemAccount'
      }
    },
    {
      // 快速贷客户催收
      path: '/rapidCustomerCollection',
      component: resolve => require(['../components/page/debtManagement/rapidCustomerCollection.vue'], resolve),
      meta: {
        title: '快速贷客户催收',
        role: 'rapidCustomerCollection'
      }
    },
    {
      // 滞纳金管理
      path: '/lateFeeManagement',
      component: resolve => require(['../components/page/debtManagement/lateFeeManagement.vue'], resolve),
      meta: {
        title: '滞纳金管理',
        role: 'lateFeeManagement'
      }
    },
    {
      //停用客户借款列表
      path: '/deactivateCustomerLoanList',
      component: resolve => require(['../components/page/debtManagement/deactivateCustomerLoanList.vue'], resolve),
      meta: {
        title: '停用客户借款列表',
        role: 'deactivateCustomerLoanList'
      }
    },
    {
      // 审核逾期统计
      path: '/overdueStatistics',
      component: resolve => require(['../components/page/debtManagement/overdueStatistics.vue'], resolve),
      meta: {
        title: '审核逾期统计',
        role: 'overdueStatistics'
      }
    },
    {
      // 快速操作面板
      path: '/quickActionPanel',
      component: resolve => require(['../components/page/debtManagement/quickActionPanel.vue'], resolve),
      meta: {
        title: '快速操作面板',
        role: 'quickActionPanel'
      }
    },

    {
      // 全部客户管理
      path: '/totalCustomerManagement',
      component: resolve => require(['../components/page/recordsCenter/totalCustomerManagement.vue'], resolve),
      meta: {
        title: '全部客户管理',
        role: 'totalCustomerManagement'
      }
    },

    {
      // 还款记录管理
      path: '/repaymentRecordManagement',
      component: resolve => require(['../components/page/recordsCenter/repaymentRecordManagement.vue'], resolve),
      meta: {
        title: '还款记录管理',
        role: 'repaymentRecordManagement'
      }
    },

    {
      // APP消息中心
      path: '/appMessageCenter',
      component: resolve => require(['../components/page/recordsCenter/appMessageCenter.vue'], resolve),
      meta: {
        title: 'APP消息中心',
        role: 'appMessageCenter'
      }
    },

    {
      // 短信管理
      path: '/smsManagement',
      component: resolve => require(['../components/page/recordsCenter/smsManagement.vue'], resolve),
      meta: {
        title: '短信管理',
        role: 'smsManagement'
      }
    },

    {
      // 快速操作面板
      path: '/lateFees',
      component: resolve => require(['../components/page/recordsCenter/lateFees.vue'], resolve),
      meta: {
        title: '滞纳金账单',
        role: 'lateFees'
      }
    },

    {
      // 财务状况
      path: '/financialSituation',
      component: resolve => require(['../components/page/recordsCenter/financialSituation.vue'], resolve),
      meta: {
        title: '财务状况',
        role: 'financialSituation'
      }
    },
    {
      // 推广客户列表
      path: '/promotionCustomerList',
      component: resolve => require(['../components/page/operatingCenter/promotionCustomerList.vue'], resolve),
      meta: {
        title: '推广客户列表',
        role: 'promotionCustomerList'
      }
    },
    {
      // 推广情况列表
      path: '/promotionList',
      component: resolve => require(['../components/page/operatingCenter/promotionList.vue'], resolve),
      meta: {
        title: '推广情况列表',
        role: 'promotionList'
      }
    },
    {
      // 代扣订单维护
      path: '/withholdOrder',
      component: resolve => require(['../components/page/paymentManagement/withholdOrder.vue'], resolve),
      meta: {
        title: '代扣订单维护',
        role: 'withholdOrder'
      }
    },
    {
      // 代扣消息管理
      path: '/withholdMessage',
      component: resolve => require(['../components/page/paymentManagement/withholdMessage.vue'], resolve),
      meta: {
        title: '代扣消息管理',
        role: 'withholdMessage'
      }
    },
    {
      // 代付日志管理
      path: '/payforLog',
      component: resolve => require(['../components/page/paymentManagement/payforLog.vue'], resolve),
      meta: {
        title: '代付日志管理',
        role: 'payforLog'
      }
    },
    {
      // 代付消息管理
      path: '/payforMessage',
      component: resolve => require(['../components/page/paymentManagement/payforMessage.vue'], resolve),
      meta: {
        title: '代付消息管理',
        role: 'payforMessage'
      }
    },
    {
      // 线上还款记录
      path: '/onlinePayment',
      component: resolve => require(['../components/page/paymentManagement/onlinePayment.vue'], resolve),
      meta: {
        title: '线上还款记录',
        role: 'onlinePayment'
      }
    },
    {
      // 审核客户及钱包
      path: '/reviewCustomersAndWallets',
      component: resolve => require(['../components/page/riskControlCenter/reviewCustomersAndWallets'], resolve),
      meta: {
        title: '审核订单池',
        role: 'reviewCustomersAndWallets'
      }
    },
    {
      // 审核中订单
      path: '/orderUnderReview',
      component: resolve => require(['../components/page/riskControlCenter/orderUnderReview'], resolve),
      meta: {
        title: '审核员审核岗',
        role: 'orderUnderReview'
      }
    },
    {
      // 审核中all
      path: '/allElectricityList',
      component: resolve => require(['../components/page/electricityCenter/allElectricityList'], resolve),
      meta: {
        title: '客户电销列表',
        role: 'allElectricityList'
      }
    },    
    {
      // 已审核订单
      path: '/auditedOrder',
      component: resolve => require(['../components/page/riskControlCenter/auditedOrder'], resolve),
      meta: {
        title: '审核经理审核岗',
        role: 'auditedOrder'
      }
    },
    {
      // 分期计算器
      path: '/stageCalculator',
      component: resolve => require(['../components/page/riskControlCenter/stageCalculator'], resolve),
      meta: {
        title: '分期计算器',
        role: 'stageCalculator'
      },
    },
    {
      //催收统计
      path: '/collectionRecords',
      component: resolve => require(['../components/page/recordsCenter/collectionRecords'], resolve),
      meta: {
        title: '催收记录统计',
        role: 'collectionRecords'
      },
    },
    {
      //提现金额
      path: '/withdrawlist',
      component: resolve => require(['../components/page/recordsCenter/withdrawlist'], resolve),
      meta: {
        title: '提现金额',
        role: 'withdrawlist'
      },
    },
    // {
    //   // 申请重审客户
    //   path: '/applyForCustomerReview',
    //   component: resolve => require(['../components/page/riskControlCenter/applyForCustomerReview'], resolve),
    //   meta: {
    //     title: '申请重审客户',
    //   }
    // },
    {
      // 高额预约客户
      path: '/highCostBookingCustomers',
      component: resolve => require(['../components/page/riskControlCenter/highCostBookingCustomers'], resolve),
      meta: {
        title: '高额预约客户',
        role: 'highCostBookingCustomers'
      }
    },
    {
      // 电销列表
      path: '/electricalMyClient',
      component: resolve => require(['../components/page/electricityCenter/electricalMyClient'], resolve),
      meta: {
        title: '我的客户',
        role: 'electricalMyClient'
      }
    },
    {
      // 售前营销
      path: '/presales',
      component: resolve => require(['../components/page/electricityCenter/presales'], resolve),
      meta: {
        title: '售前营销',
        role: 'presales'
      }
    },
    {
      // 售前营销
      path: '/aftersales',
      component: resolve => require(['../components/page/electricityCenter/afterSales'], resolve),
      meta: {
        title: '售后营销',
        role: 'aftersales'
      }
    },    
    {
      // 电销列表
      path: '/electricityUserList',
      component: resolve => require(['../components/page/electricityCenter/electricityList'], resolve),
      meta: {
        title: '电销列表',
        role: 'electricityUserList'
      }
    },    
    {
      // 申请重审客户
      path: '/applyForCustomerReview',
      component: resolve => require(['../components/page/riskControlCenter/applyForCustomerReview'], resolve),
      meta: {
        title: '申请重审客户',
        role: 'applyForCustomerReview'
      }
    },
    {
      // 申请重审客户
      path: '/w',
      component: resolve => require(['../components/page/w/w'], resolve),
      meta: {
        title: '申请重审客户',
        role: 'w'
      }
    },
    {
      // 申请重审客户
      path: '/table',
      component: resolve => require(['../components/page/table/table'], resolve),
      meta: {
        title: 'table',
        role: 'table'
      }
    },
    {
      // 申请重审客户
      path: '/report',
      component: resolve => require(['../components/page/table/report'], resolve),
      meta: {
        title: 'report',
        role: 'report'
      }
    },
    {
      // 申请重审客户
      path: '/getsales',
      component: resolve => require(['../components/page/dataStatistics/getsales'], resolve),
      meta: {
        title: '销售统计',
        role: 'getsales'
      }
    },
    {
      // 申请重审客户
      path: '/examinecount',
      component: resolve => require(['../components/page/dataStatistics/examinecount'], resolve),
      meta: {
        title: '审核统计',
        role: 'examinecount'
      }
    },
    {
      // 申请重审客户
      path: '/repaymentcount',
      component: resolve => require(['../components/page/dataStatistics/repaymentcount'], resolve),
      meta: {
        title: '还款统计',
        role: 'repaymentcount'
      }
    },
    {
      // 申请重审客户
      path: '/registercount',
      component: resolve => require(['../components/page/dataStatistics/registercount'], resolve),
      meta: {
        title: '用户注册统计',
        role: 'registercount'
      }
    },
    {
      // 提现列表展示
      path: '/baofuwithdrawList',
      component: resolve => require(['../components/page/dataStatistics/baofuwithdrawList'], resolve),
      meta: {
        title: '提现列表展示',
        role: 'baofuwithdrawList'
      }
    } ,
    {
      // 还款列表展示
      path: '/baofurepaymentlist',
      component: resolve => require(['../components/page/dataStatistics/baofurepaymentlist'], resolve),
      meta: {
        title: '还款列表展示',
        role: 'baofurepaymentlist'
      }
    }   ,
    {
      // 客户回访统计
      path: '/recallsStatistics',
      component: resolve => require(['../components/page/electricityCenter/recordStatistics'], resolve),
      meta: {
        title: '客户回访统计',
        role: 'recallsStatistics'
      }
    }  ,
    {
      // 电销放款明细
      path: '/electricalStatistics',
      component: resolve => require(['../components/page/electricityCenter/electricalStatistics'], resolve),
      meta: {
        title: '电销放款明细',
        role: 'electricalStatistics'
      }
    }  , 
    {
      // 电销放款明细
      path: '/paymentlistbycollectmanager',
      component: resolve => require(['../components/page/dataStatistics/paymentlistbycollectmanager'], resolve),
      meta: {
        title: '催收减免管理',
        role: 'paymentlistbycollectmanager'
      }
    }  , 
    {
      // 平台经营管理统计
      path: '/conditionofbusiness',
      component: resolve => require(['../components/page/dataStatistics/conditionofbusiness'], resolve),
      meta: {
        title: '平台经营管理统计',
        role: 'conditionofbusiness'
      }
    }  , 
    {
      // 平台短信管理统计
      path: '/electricalMsg',
      component: resolve => require(['../components/page/electricityCenter/signature'], resolve),
      meta: {
        title: '短信管理',
        role: 'electricalMsg'
      }
    }  ,  
    {

      path: '/paymentapplylist',
      component: resolve => require(['../components/page/afterLoan/paymentapplylist'], resolve),
      meta: {
        title: '线下还款申请列表展示',
        role: 'paymentapplylist'
      }
    },
    {

      path: '/appRepayment',
      component: resolve => require(['../components/page/afterLoan/appRepayment'], resolve),
      meta: {
        title: 'app减免管理',
        role: 'appRepayment'
      }
    },
    {

      path: '/appVersion',
      component: resolve => require(['../components/page/systemManagement/appVersion'], resolve),
      meta: {
        title: 'app版本信息',
        role: 'appVersion'
      }
    },
    {

      path: '/exceedcount',
      component: resolve => require(['../components/page/systemManagement/exceedcount'], resolve),
      meta: {
        title: '提现逾期统计',
        role: 'exceedcount'
      }
    },
    {

      path: '/platformexceedcount',
      component: resolve => require(['../components/page/systemManagement/platformexceedcount'], resolve),
      meta: {
        title: '平台逾期整体展示',
        role: 'platformexceedcount'
      }
    },
    {

      path: '/authstatistics',
      component: resolve => require(['../components/page/systemManagement/authstatistics'], resolve),
      meta: {
        title: '认证统计',
        role: 'authstatistics'
      }
    },
    {

      path: '/discountCouponUser',
      component: resolve => require(['../components/page/systemManagement/discountCoupon'], resolve),
      meta: {
        title: '优惠券客户',
        role: 'discountCouponUser'
      }
    },
    {

      path: '/discountCoupon',
      component: resolve => require(['../components/page/systemManagement/discountCouponU'], resolve),
      meta: {
        title: '优惠券',
        role: 'discountCoupon'
      }
    },    
    // {
    //   // 申请重审客户
    //   path: '/getsales',
    //   component: resolve => require(['../components/page/dataStatistics/getsales'], resolve),
    //   meta: {
    //     title: '销售统计',
    //     role: 'getsales'
    //   }
    // }    
  ]
}]
