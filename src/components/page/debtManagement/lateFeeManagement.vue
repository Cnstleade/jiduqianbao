<template>
    <div class="container">
        <el-row>
            <el-alert
              title="滞纳金管理"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>        
        <el-row class="m20 col-flex-end" >
    
             
              <div style="flex-grow:1" >
                <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button>
              </div>
               <el-button  type="primary" @click="cz">重置</el-button>
                <div class="l20">
                    <el-input
                    style="padding:0px 10px 0px 0px"
                      placeholder="请输入手机号"
                      v-model="search.phonenumber"
                      clearable>
                    </el-input> 
                </div>
                <div class="l20">
                  <el-input
                    style="padding:0px 10px 0px 0px"
                      placeholder="请输入姓名"
                      v-model="search.IdCard"
                      clearable>
                    </el-input> 
                </div>
                    <el-select class="l20" v-model="search.cust_id" placeholder="请选择催收员">
                      <el-option
                        v-for="item in trevewerlist"
                        :key="item.uid"
                        :label="item.username"
                        :value="item.uid">
                      </el-option>
                    </el-select>                 
                <div class="l20">
                  <el-input
                       style="padding:0px 10px 0px 0px"
                         placeholder="请输入身份证"
                         v-model="search.userName"
                         clearable>
                       </el-input>  
                </div>
</el-row>      
 <el-row class="m20 col-flex-end" >                  
                      <el-select class="l20" v-model="search.paymentStatus" placeholder="还款状态">
                      <el-option
                        v-for="item in paymentStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                 
                                     <el-select class="l20" v-model="search.execeedtimeType" placeholder="M值">
                      <el-option
                        v-for="item in execeedtimeTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>   
                    <el-date-picker
                    class="l20"
                    style="width:340px"
                      v-model="search.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>  
                    <el-button @click="handleSearch" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
       
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
          >
                                       <el-table-column
                      type="index"
                      align="center"
                       label="序号"
                      sortable
                      width="80"></el-table-column>
            <el-table-column prop="id" fixed label="ID号" align="center" sortable width="120"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center"  width="120"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
            <el-table-column prop="idNo" label="身份证号" align="center"  width="160"></el-table-column>
            <el-table-column prop="return_day" label="应还款时间" align="center" width="150" sortable>
                <template slot-scope="scope">
                    {{scope.row.return_day|dateServer2}}
                </template>
            </el-table-column>
            <el-table-column prop="realRepaymentTime" label="实际还款时间" align="center" width="150" sortable>
                <template slot-scope="scope">
                  <template v-if="scope.row.realRepaymentTime!=null">
                    {{scope.row.realRepaymentTime|dateServer}}
                  </template>
                </template>
            </el-table-column>     
            <el-table-column prop="raise_money" label="客户提现金额" align="center" width="120" sortable></el-table-column>             
            <el-table-column prop="withdraw_money" label="实际下款金额" align="center" width="120" sortable></el-table-column>
     
            <el-table-column prop="late_fee" label="滞纳金额" align="center" width="120" sortable></el-table-column>  
       <el-table-column prop="overdue_day" label="逾期天数" align="center" width="120" sortable></el-table-column> 
    <el-table-column prop="overdue_day" label="M值" align="center" width="80">
                      <template slot-scope="scope">
                    {{scope.row.overdue_day==0?'':scope.row.overdue_day < 11?'M1':scope.row.overdue_day < 21?'M2':scope.row.overdue_day < 31?'M3':'M3+'}}
                </template>
      </el-table-column>      
            <el-table-column prop="return_money" label="应还款总额" align="center" width="120" sortable>
            </el-table-column>                                                
            <!-- <el-table-column prop="borrow_time" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.borrow_time|dateServer}}
                </template>
            </el-table-column> -->
            <el-table-column prop="coupon_value" label="优惠券面值" align="center" width="120" >
                <template slot-scope="scope">
                          <span v-if="scope.row.coupon_value">
                            {{scope.row.coupon_value}}
                          </span>
                </template> 
            </el-table-column>               
            <el-table-column prop="collectorName" label="当前状态" align="center"
                           :filters="[{ value: 0, text: '未完' }, { value: 1, text: '已还' }, ]"
                         :filter-method="filterStauts"   
                         width="120"                   
                      >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.repay_status===0?'danger':scope.row.repay_status===1?'success':'warning'"
                            >{{scope.row.repay_status===0?'未还':scope.row.repay_status===1?'已还':''}}</el-tag>
                        </template>   


            </el-table-column>
            <el-table-column prop="collectorName" label="催收员" align="center" width="120"></el-table-column>


         
        </el-table>  
        <el-row class="m20" v-if="total>0">
          <div style="float:left" >
            <el-button type="primary" >本金合计{{allCostMony}}</el-button>   
            <el-button  type="primary" class="l20" >滞纳金合计{{allLateMoney}}</el-button>      
          </div>
                
             <div style="float:right">
                 <el-pagination
                   @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                   :current-page="npage"
                    :page-sizes="[10, 20, 50, 100, 1000,990000]"
                     :page-size="pagesize"
                   background
                   layout="total,sizes,prev, pager, next,jumper"
                   :total="total">
                 </el-pagination>   
             </div>
        </el-row>               
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getOverduemanager, httpGetrevewerlist } from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      trevewerlist: [],
      allLateMoney: 0,
      allCostMony: 0,
      search: {
        paymentStatus: 1
      },
      execeedtimeTypes: [
        { label: "M1", value: 1 },
        { label: "M2", value: 2 },
        { label: "M3", value: 3 },
        { label: "M3+", value: 4 }
      ],
      paymentStatus: [{ label: "未还", value: 0 }, { label: "已还", value: 1 }],
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      index: 0
    };
  },
  methods: {
    cz() {
      this.npage = 1;
      this.pagesize = 10;
      this.search = {};
      this.getData(this.npage, this.pagesize);
    },
    _httpGetrevewerlist() {
      let _this = this;
      httpGetrevewerlist()
        .then(res => {
          let data = res.data;
          this.trevewerlist = data;
          // _this.search.orders = [{username:'重置',uid:null}].concat(...data);
        })
        .catch();
    },
    getData(
      npage,
      pagesize,
      begainTimeString,
      endTimeString,
      phonenumber,
      IdCard,
      userName,
      execeedtimeType,
      paymentStatus = 1,
      cust_id
    ) {
      this.loading = true;
      let self = this;
      let _this = this;
      getOverduemanager(
        npage,
        pagesize,
        begainTimeString,
        endTimeString,
        phonenumber,
        IdCard,
        userName,
        execeedtimeType,
        paymentStatus,
        cust_id
      )
        .then(res => {
          let data = res.data;

          let tableData = data.list;
          this.tableData = tableData;
          this.total = data.allsize;
          this.allLateMoney = data.countVo.allLateMoney;
          this.allCostMony = data.countVo.allCostMony;
          this.loading = false;
        })
        .catch(err => {
          // let data = {
          //   npage: 1,
          //   pagesize: 100,
          //   allsize: 1,
          //   list: [
          //     {
          //       id: 1,
          //       userName: "于磊",
          //       mobile: "18861011449",
          //       idNo: "341122199504131615",
          //       withdraw_money: 960,
          //       borrow_time: "2018-08-06T16:00:00.000+0000",
          //       overdue_day: 1,
          //       late_fee: 24,
          //       repay_status: 0,
          //       return_money: 1224,
          //       return_day: "2018-08-13T16:00:00.000+0000",
          //       realRepaymentTime: ""
          //     }
          //   ],
          //   countVo: {
          //     allCostMony: 960,
          //     allLateMoney: 24
          //   }
          // };
          // let tableData = data.list;
          // this.tableData = tableData;
          // this.total = data.allsize;
          // this.allLateMoney = data.countVo.allLateMoney;
          // this.allCostMony = data.countVo.allCostMony;
          // this.loading = false;
          _this.loading = false;
        });
    },
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.search.time && this.search.time.length) {
        this.getData(
          this.npage,
          this.pagesize,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00",
          this.search.phonenumber,
          this.search.IdCard,
          this.search.userName,
          this.search.execeedtimeType,
          this.search.paymentStatus,
          this.search.cust_id
          // this.search.order ? this.search.order : 0,
        );
      } else {
        this.getData(
          this.npage,
          this.pagesize,
          "",
          "",
          this.search.phonenumber,
          this.search.IdCard,
          this.search.userName,
          this.search.execeedtimeType,
          this.search.paymentStatus,
          this.search.cust_id
          // this.search.order ? this.search.order : 0,
        );
      }
    },
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch(false);
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterCashOutType(value, row) {
      return row.cash_outType === value;
    },
    filterStauts(value, row) {
      return row.status === value;
    },
    //excel导出数据
    export2Excel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "ID号",
          "姓名",
          "手机号",
          "身份证号",
          "应还款时间",
          "实际还款时间",
          "客户提现金额",
          "实际下款金额",
          "滞纳金额",
          "逾期天数",
          "M值",
          "应还款总额",
          "当前状态",
          "催收员"
        ];
        const filterVal = [
          "id",
          "userName",
          "mobile",
          "idNo",
          "return_day",
          "realRepaymentTime",
          "raise_money",
          "withdraw_money",
          "late_fee",
          "overdue_day",
          "M",
          "return_money",
          "repay_status",
          "collectorName"
        ];
        let list = JSON.parse(JSON.stringify(this.tableData));

        for (var i = 0; i < list.length; i++) {
          list[i].repay_status =
            list[i].repay_status === 0
              ? "未还"
              : list[i].repay_status === 1 ? "已还" : "";
          list[i].M =
            list[i].M == 11
              ? ""
              : list[i].M < 11
                ? "M1"
                : list[i].M < 21 ? "M2" : list[i].M < 31 ? "M3" : "M3+";

          // list[i].cash_outType =
          // list[i].cash_outType===0?'无提现记录':list[i].cash_outType===1?'有余额':'无余额'
          list[i].realRepaymentTime = list[i].realRepaymentTime
            ? timeFormat(list[i].realRepaymentTime)
            : "";
          list[i].return_day = list[i].return_day
            ? timeFormat(list[i].return_day)
            : "";
          list[i].realRepaymentTime = list[i].realRepaymentTime
            ? timeFormat(list[i].realRepaymentTime)
            : "";
        }
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "滞纳金管理");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    filterStauts(value, row) {
      return row.repay_status === value;
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
    this._httpGetrevewerlist();
  }
};
</script>

<style scoped>
</style>
