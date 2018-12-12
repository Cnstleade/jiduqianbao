<template>
    <div class="container">
        <el-row>
            <el-alert
              title="催收记录统计"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>       
    <el-tabs type="border-card" class="m20"  v-model="activeName" @tab-click="handleClick" v-loading="lodings">
      <el-tab-pane label="催收统计" name="first">         
        <el-row class="m20" >
         <el-col :span="6">
                <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button>
            </el-col>                  
            <el-col  :span="18"  class="col-flex-end">
                    <el-select class="l20" v-model="search.collectorId" placeholder="请选择催收员">
                      <el-option
                        v-for="item in trevewerlist"
                        :key="item.uid"
                        :label="item.username"
                        :value="item.uid">
                      </el-option>
                    </el-select>                
                  <el-date-picker

                  class="l20"
                    v-model="month"
                    type="month"
                    placeholder="开始月份"
                     value-format="yyyy-MM"
                    >

                  </el-date-picker> 
                  <span style="font-size:14px;line-height:32px;margin:0 10px">至</span>
                  <el-date-picker
                    v-model="preMonth"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="结束月份">
                </el-date-picker>                                                                       
                    <el-button @click="handleSearch" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>             
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
                  fixed
                 width="50">
            </el-table-column>
            <el-table-column prop="name" label="催收员" align="center"  sortable></el-table-column>
            <el-table-column prop="allOverdueMoney" label="催收本金" align="center"  sortable></el-table-column>
            <el-table-column prop="all_late_fee" label="应催收违约金" align="center" sortable></el-table-column>
            <!-- <el-table-column prop="borrowTime" label="借款时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.borrowTime|dateServer}}
                </template>
            </el-table-column> -->
            <el-table-column prop="borrowDay" label="催回总金额" align="center" sortable >
                <template slot-scope="scope">
                    {{scope.row.collect_money_m1+scope.row.collect_money_m2+scope.row.collect_money_m3+scope.row.collect_money_m4}}
                </template>
            </el-table-column>
            <el-table-column prop="collect_money_m1" label="已收M1" align="center" sortable ></el-table-column>
            <el-table-column prop="collect_money_m2" label="已收M2" align="center"  sortable ></el-table-column>
            <el-table-column prop="collect_money_m3" label="已收M3" align="center"  sortable ></el-table-column>
            <el-table-column prop="collect_money_m4" label="已收M3+" align="center"  sortable ></el-table-column>
            <!-- <el-table-column prop="overdue_day" label="逾期天数" align="center" sortable ></el-table-column>
            <el-table-column prop="late_fee" label="逾期金" align="center" sortable ></el-table-column>
            <el-table-column prop="ned_return_money" label="需要还钱数" align="center" sortable ></el-table-column>
                <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >还款</el-button>
                    </template> 
                </el-table-column>             -->
        </el-table>  
        <el-row class="m20" v-if="total>0">
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
        <el-dialog
          title="线下还款"
          :visible.sync="dialogVisible"
          center
          width="40%"
          >
        </el-dialog>       
      </el-tab-pane>   
      <el-tab-pane label="催收列表成功展示" name="second"> 
        <el-row class="m20" >
            <el-col   class="col-flex-end">
              <div  style="flex-grow:1">
              <el-button  icon="el-icon-plus" @click="export2Excel2">导出excel</el-button>
              </div>                
                    <el-button  type="primary" @click="reset2">重置</el-button>
                    <el-select class="l20" v-model="search.collectorId" placeholder="请选择催收员">
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
                      placeholder="请输入姓名"
                      v-model="search.userName"
                      clearable>
                    </el-input> 
                </div>
                <div class="l20">
                    <el-input
                    style="padding:0px 10px 0px 0px"
                      placeholder="请输入身份证"
                      v-model="search.IdCard"
                      clearable>
                    </el-input> 
                </div>                                                     
                    <el-date-picker
                    style="width:340px"
                    class="l20"
                      v-model="search.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>                
                    <el-button @click="handleSearch2" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>             
        </el-row>  
            <el-table
            :data="tableDatas"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20"
            @selection-change="handleSelectionChange"
            v-loading="loading1"
            id="eleTable"
          >
             <el-table-column prop="id" fixed label="ID号" align="center" width="80" >
            </el-table-column> 
             <el-table-column prop="userName" label="姓名" align="center" width="120" >
            </el-table-column> 
             <el-table-column prop="id_no" label="身份证号" align="center" width="160" >
            </el-table-column> 
             <el-table-column prop="returnTime" label="应还款日" align="center"  width="140" >
                <template slot-scope="scope">
                    {{scope.row.returnTime|dateServer2}}
                </template>               
            </el-table-column> 
             <el-table-column prop="createTime" label="实际还款时间" align="center" width="140">
               <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>   
            </el-table-column> 
             <el-table-column prop="raise_money" label="商品金额" align="center" width="100" sortable>
            </el-table-column> 
             <el-table-column prop="late_fee" label="应还滞纳金" align="center" width="120" sortable>
            </el-table-column> 
             <el-table-column prop="overdue_day" label="逾期天数" align="center" width="100" sortable>
            </el-table-column>  
             <el-table-column prop="m" label="M值" align="center" width="80" >
                  <template slot-scope="scope">
                    {{scope.row.overdue_day==0?'':scope.row.overdue_day < 11?'M1':scope.row.overdue_day < 21?'M2':scope.row.overdue_day < 31?'M3':'M3+'}}
                </template>               
            </el-table-column>  
             <el-table-column prop="realMoney" label="实际还款金额" align="center" width="140" sortable>
               <!-- <template slot-scope="scope">                         
                              {{((scope.row.realMoney/100).toFixed(2))}} 
                </template>     -->
            </el-table-column>  
             <!-- <el-table-column prop="id" label="实际还款违约金" align="center" width="80" sortable>
            </el-table-column>    -->
             <el-table-column prop="reduceMoney" label="减免金额" align="center" min-width="140" sortable>
            </el-table-column>                                                                                                                                     
          </el-table>  
            <el-row class="m20" v-if="total>0">
                 <div style="float:right">
                     <el-pagination
                       @current-change="handleCurrentChange1"
                        @size-change="handleSizeChange1"
                       :current-page="npage"
                        :page-sizes="[10, 20, 50, 100, 1000,990000]"
                         :page-size="pagesize"
                       background
                       layout="total,sizes,prev, pager, next,jumper"
                       :total="total">
                     </el-pagination>   
                 </div>
            </el-row>                
      </el-tab-pane>           
    </el-tabs>
       
    </div>

</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import {
  getCollectionCount,
  httpOverduecollectsucesslist,
  httpGetrevewerlist
} from "../../../service/http";
import Timer from "../../../config/timer";
import { timeFormat, getMonth } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      trevewerlist: [],
      loading1: false,
      lodings: false,
      activeName: "first",
      month: "",
      preMonth: "",
      search: {
        time: [],
        order: null,
        orders: [
          { label: "还款中", value: 5 },
          { label: "逾期", value: 6 },
          { label: "完结", value: 7 }
        ],
        tixian: "",
        tixians: [
          { label: "没有体现", value: 0 },
          { label: "没有完全提现", value: 1 },
          { label: "完全提现", value: 2 }
        ],
        phoneNumber: null
      },
      editForm: {
        loanApplyId: 1,
        interestOverdue: 2,
        discountAmt: 3,
        mustPayBackAmt: 4,
        actualPayBackAmt: 5
      },
      fileList2: [],
      tableData: [],
      tableDatas: [],
      loading: false,
      npage: 1,
      pagesize: 10,
      total: 0,
      execeedtimeType: 0,
      dialogVisible: false,
      ordersList: [],
      dynamicTags: [], //订单号
      inputVisible: false,
      inputValue: "",
      trevewerlist: [],
      trevewer: null,
      multipleSelection: [],
      index: 0
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "loginId"
      // ...
    ])
  },
  methods: {
    getrevewerlist() {
      httpGetrevewerlist()
        .then(res => {
          let data = res.data;
          this.trevewerlist = data;
          console.log(trevewerlist);
        })
        .catch(err => {});
    },
    handleSearch2(type = true) {
      if (this.search.time && this.search.time.length) {
        this._httpOverduecollectsucesslist(
          this.npage,
          this.pagesize,
          this.search.userName,
          this.search.IdCard,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00",
          this.search.collectorId
        );
      } else {
        this._httpOverduecollectsucesslist(
          this.npage,
          this.pagesize,
          this.search.userName,
          this.search.IdCard,
          "",
          "",
          this.search.collectorId
        );
      }
    },
    handleCurrentChange1(val) {
      this.npage = val;
      this.handleSearch2(false);
    },
    handleSizeChange1(val) {
      this.pagesize = val;
      this.handleSearch2(false);
    },
    reset2() {
      this.npage = 1;
      this.pagesize = 10;
      this.search = {};
      this.handleSearch2();
    },
    _httpOverduecollectsucesslist(
      npage,
      pagesize,
      userName,
      IdCard,
      begainTimeString,
      endTimeString,
      collectorId
    ) {
      this.loading1 = true;
      httpOverduecollectsucesslist(
        npage,
        pagesize,
        userName,
        IdCard,
        begainTimeString,
        endTimeString,
        collectorId
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableDatas = data.data.list;
            this.total = data.data.allsize;
            this.loading1 = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
    },
    handleClick(tab, event) {
      this.npage = 1;
      // var a = this._getMonth("s", 0) + " 00:00:00";
      // var b = this._timeFormat(new Date(), 1) + "00:00:00";

      this.lodings = true;
      tab.name === "second"
        ? this._httpOverduecollectsucesslist(this.npage, this.pagesize)
        : this.getData(this.loginId);
      // tab.name === "second"
      //   ? this._httpDataGetsales(false)
      //   : tab.name === "first" ? this._httpDataGetsales(true) : "";
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    },
    getData(loginId, begainTimeString, endTimeString, collectorId) {
      let _this = this;
      this.loading = true;
      getCollectionCount(loginId, begainTimeString, endTimeString, collectorId)
        .then(res => {
          let data = res.data;
          let tableData = data;
          _this.tableData = tableData;
          _this.total = data.allsize;
          _this.loading = false;
        })
        .catch(err => {
          _this.tableData = [];
          _this.loading = false;
        });
    },
    _getMonth(a, b) {
      return getMonth(a, b);
    },
    _timeFormat(a, b) {
      return timeFormat(a, b);
    },
    handleSearch() {
      if (this.preMonth && this.preMonth) {
        this.getData(
          this.loginId,
          this.month + "-01 00:00:00",
          this.preMonth + "-01 00:00:00",
          this.search.collectorId
        );
      } else {
        this.getData(this.loginId, "", "", this.search.collectorId);
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
    changeExeceedtimeType(i) {
      this.execeedtimeType = i;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAllocation(index, row) {},

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
          "序号",
          "催收员",
          "催收本金",
          "应催收违约金",
          "催回总金额",
          "已收M1",
          "已收M2",
          "已收M3",
          "已收M3+"
        ];
        const filterVal = [
          "i",
          "name",
          "mallOverdueMoney",
          "all_late_fee",
          "borrowDay",
          "collect_money_m1",
          "collect_money_m2",
          "collect_money_m3",
          "collect_money_m4"
        ];
        let list = JSON.parse(JSON.stringify(this.tableData));

        for (var i = 0; i < list.length; i++) {
          list[i].i = i + 1;

          list[i].borrowDay =
            list[i].collect_money_m1 +
            list[i].collect_money_m2 +
            list[i].collect_money_m3 +
            list[i].collect_money_m4;
        }
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "催收记录统计");
      });
    },
    //excel导出数据
    export2Excel2() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "ID号",
          "姓名",
          "身份证号",
          "应还款日",
          "实际还款日",
          "商品金额",
          "应还滞纳金",
          "逾期天数",
          "M值",
          "实际还款金额",
          "减免金额"
        ];
        const filterVal = [
          "id",
          "userName",
          "id_no",
          "returnTime",
          "createTime",
          "raise_money",
          "late_fee",
          "overdue_day",
          "m",
          "realMoney",
          "reduceMoney"
        ];
        let list = JSON.parse(JSON.stringify(this.tableDatas));

        for (var i = 0; i < list.length; i++) {
          list[i].m =
            list[i].overdue_day == 11
              ? ""
              : list[i].overdue_day < 11
                ? "M1"
                : list[i].overdue_day < 21
                  ? "M2"
                  : list[i].overdue_day < 31 ? "M3" : "M3+";
          list[i].returnTime = timeFormat(list[i].returnTime);
          list[i].createTime = timeFormat(list[i].createTime);
        }
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "催收列表成功");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  mounted() {
    // var a = this._getMonth("s", 0) + " 00:00:00";
    // var b = this._timeFormat(new Date(), 1) + "00:00:00";
    this.getData(this.loginId);
    this.getrevewerlist();
  }
};
</script>


<style scoped>
</style>
