<template>
    <div class="container">
        <el-row>
            <el-alert
              :title="title"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <div style="flex-grow:1">
                        <template v-if="type">
                              <el-button icon="el-icon-star-off" type="success" >放款{{allCount}}个</el-button>
                                <el-button icon="el-icon-star-off" type="success">金额{{allMoney}}</el-button>
                                
                        </template>
                        <template v-if="!type">
                              <el-button icon="el-icon-star-off" type="success" >总放款{{allCount}}个</el-button>
                              <el-button icon="el-icon-star-off" type="success" >总金额{{allMoney}}</el-button>
                              <el-button  type="primary" @click="handleDetail">详情</el-button>
                        </template>   
                               <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button> 
                      <!-- <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button> -->
                    </div>
                    <!-- <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>     -->
                    <el-button  type="primary" @click="reset">重置</el-button>
                    <el-select class="l20" v-model="search.ele" placeholder="电销员">
                      <el-option
                        v-for="item in eleLists"
                        :key="item.uid"
                        :label="item.username"
                        :value="item.uid">
                      </el-option>
                    </el-select>                      
                    <!-- <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>                                   -->
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
            @selection-change="handleSelectionChange"
            v-loading="loading"
            id="eleTable"
          >
            <el-table-column prop="custUserId" fixed label="用户id" align="center" width="100" sortable>
            </el-table-column> 
            <el-table-column prop="custUserName" label="客户姓名" align="center" width="120" >
            </el-table-column> 
            <el-table-column prop="totalMoney" label="贷款金额" align="center" width="100" sortable>
            </el-table-column> 
            <el-table-column prop="interest" label="平台服务费" align="center" width="110" sortable>
            </el-table-column> 
            <el-table-column prop="loanDateStr" label="提款时间" align="center" min-width="140" sortable>
            </el-table-column>             
            <el-table-column prop="bankCardId" label="到账卡号" align="center" min-width="150" >
            </el-table-column> 
            <el-table-column prop="bankCardName" label="所属银行" align="center" min-width="100" >
            </el-table-column> 
            <el-table-column prop="bankCardMobile" label="银行预留手机号" align="center" min-width="120" >
            </el-table-column> 
            <!-- <el-table-column prop="salesmanId" label="电销员ID" align="center" width="180" sortable>
            </el-table-column>  -->
            <el-table-column prop="salesmanName" label="电销员姓名" align="center" min-width="120" >
            </el-table-column> 
            <!-- <el-table-column prop="salesmanId" label="电销员ID" align="center" width="180" sortable>
            </el-table-column>                                                                                                                    -->
            <!-- <el-table-column prop="applyTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>
            </el-table-column> -->
            <!-- <el-table-column type="expand" label="更多详情" width="80" >
              <template slot-scope="props" >
                <el-alert
                  title="提现情况"
                  type="success"
                  :closable="false"
                  center
                  >
                </el-alert>
                <el-table
                  :data="props.row.detail.withdraws?props.row.detail.withdraws:[]"
                  border 
                      highlight-current-row style="width: 100%;font-weight:bold"
                  >
                      <el-table-column prop="status" label="是否逾期" align="center" 
                         :filters="[{ value: 0, text: '放款中 ' }, { value: 1, text: '放款成功' }, { value: 2, text: '逾期' }, { value: 3, text: '还款成功' }, { value: 4, text: '放款失败' }, { value: 5, text: '还款中' }, { value: 6, text: '还款失败' }]"
                         :filter-method="filterStauts"                      
                      >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.status===0?'':scope.row.status===1?'success':scope.row.status===2?'danger':scope.row.status===4?'success':scope.row.status===4?'info':scope.row.status===5?'':'warning'"
                            >{{scope.row.status===0?'放款中':scope.row.status===1?'放款成功':scope.row.status===2?'逾期':scope.row.status===3?'还款成功':scope.row.status===4?'放款失败':scope.row.status===5?'还款中':'还款失败'}}</el-tag>
                        </template>                         
                      </el-table-column>
                      <el-table-column  prop="overdue.overdueDay" label="逾期天数" align="center" sortable></el-table-column>
                      <el-table-column  prop="overdue.lateFee" label="违约金" align="center" sortable></el-table-column>
                </el-table>
                <el-alert
                  title="催收情况"
                  type="success"
                  :closable="false"
                  center
                  class="m20"
                  >
                </el-alert>                
                <el-table
                  :data="props.row.detail.loanCollectionRecords?props.row.detail.loanCollectionRecords:[]"
                  border 
                      highlight-current-row style="width: 100%;font-weight:bold"
                  >
                      <el-table-column prop="id" label="id" align="center" ></el-table-column>
                      <el-table-column prop="operatorName" label="催收员姓名" align="center" ></el-table-column>
                      <el-table-column prop="remark" label="描述（备注）" align="center" ></el-table-column>
                      <el-table-column prop="result" label="结果" align="center" >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.status===1?'':scope.row.status===2?'danger':'success'"
                            >{{scope.row.status===1?'成功':scope.row.status===2?'失败':'进行中 '}}</el-tag>
                        </template>                         
                      </el-table-column>
                      <el-table-column prop="type" label="催收方式" align="center" >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.status===1?'':scope.row.status===2?'danger':'success'"
                            >{{scope.row.status===1?'电话':scope.row.status===2?'短信':'其他 '}}</el-tag>
                        </template>                         
                      </el-table-column>                      
                </el-table>                
              </template>
            </el-table-column>  -->
                <!-- <el-table-column prop="cz"  align="center" label="电销人员相关"  width="300" >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >放款次数</el-button>
                   <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >放款总额</el-button>                       
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
                width="60%"
              title="电销情况统计"
              center
              :visible.sync="detailVisible"   
            >
        <el-table
            :data="allList"  
            border  
            style="width:100%"
            class="m20"
            v-loading="loadings"
          >
            <el-table-column prop="salesmanId" label="ID" align="center" width="80" sortable>
            </el-table-column> 
            <el-table-column prop="salesmanName" label="姓名" align="center" width="120" >
            </el-table-column> 
            <el-table-column prop="loanfirstTimes" label="首次借款单数" align="center" width="120" >
            </el-table-column>             
            <el-table-column prop="loanRepurch" label="复购借款单数" align="center" width="120" >
            </el-table-column>             
            <el-table-column prop="loanfirstMoney" label="首次借款金额 " align="center" min-width="100" sortable>
            </el-table-column> 
            <el-table-column prop="loanRepurchaseMoney" label="复购借款金额" align="center" min-width="110" sortable>
            </el-table-column> 
        </el-table>              
        </el-dialog>                                       
    </div>
</template>

<script>
import {
  httpElectricalStatistics,
  getEleCompanyId,
  httpSalesmanLoanTimes,
  httpSalesmanLoanSum
} from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  data() {
    return {
      title: "电销放款明细",
      search: {
        ele: "",
        time: ""
      },
      detailVisible: false,
      type: false,
      tableData: [],
      loading: true,
      loadings: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      multipleSelection: [], //全部选中嘛
      eleLists: [],
      allCount: 0,
      allMoney: 0,
      allCountList: [],
      allMoneyList: [],
      allList: []
    };
  },
  methods: {
    //httpSalesmanLoanTimes 电销员放款次数统计
    // _httpSalesmanLoanTimes(salesmanId, startDate, endDate, type) {
    //   httpSalesmanLoanTimes(salesmanId, startDate, endDate)
    //     .then(res => {
    //       let data = res.data;
    //       if (data.code == 200) {
    //         this.allCount = 0;
    //         if (data.data.length > 1) {
    //           this.allCount = data.data.reduce((prev, cur, index, arr) => {
    //             return prev.loanTimes + cur.loanTimes;
    //           });
    //         } else {
    //           this.allCount = data.data[0].loanTimes;
    //         }

    //         this.allCountList = data.data;
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);

    //       this.$message.error("网络错误请联系管理员");
    //     });
    // },
    //httpSalesmanLoanTimes 电销员放款总额统计
    _httpSalesmanLoanSum(salesmanId, startDate, endDate, type) {
      httpSalesmanLoanSum(salesmanId, startDate, endDate)
        .then(res => {
          let data = res.data;
          this.allCount = 0;
          this.allMoney = 0;
          if (data.code == 200) {
            this.allList = data.data;
            if (data.data.length > 1) {
              this.allMoney = data.data.reduce((prev, cur, index, arr) => {
                return (
                  prev.loanfirstMoney +
                  prev.loanRepurchaseMoney +
                  cur.loanfirstMoney +
                  cur.loanRepurchaseMoney
                );
              });
              this.allCount = data.data.reduce((prev, cur, index, arr) => {
                return (
                  prev.loanfirstTimes +
                  cur.loanfirstTimes +
                  prev.loanRepurch +
                  cur.loanRepurch
                );
              });
            } else if (data.data.length == 1) {
              this.allMoney =
                data.data[0].loanRepurchaseMoney + data.data[0].loanfirstMoney;
              this.allCount =
                data.data[0].loanfirstTimes + data.data[0].loanRepurch;
            } else {
              this.allCount = 0;
              this.allMoney = 0;
            }
          }
          // if (data.code == 200) {
          //   this.allMoney = 0;
          //   if (data.data.length > 1) {
          //     this.allMoney = data.data.reduce((prev, cur, index, arr) => {
          //       return prev.+ cur.loanTotalMoney;
          //     });
          //   } else if (data.data.length == 1) {
          //     this.allMoney = data.data[0].loanTotalMoney;
          //   } else {
          //     this.allMoney = 0;
          //   }

          //   this.allMoneyList = data.data;
          // } else {
          //   this.$message.error(data.msg);
          // }
        })
        .catch(err => {
          console.log(err);

          this.$message.error("网络错误请联系管理员");
        });
    },
    //查询电销人员
    _getEleCompanyId() {
      getEleCompanyId(1)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.eleLists = data.data;
          } else {
          }
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    getData(pageNumber, pageSize, salesmanId, startDate, endDate) {
      let _this = this;
      this.loading = true;
      httpElectricalStatistics(
        pageNumber,
        pageSize,
        salesmanId,
        startDate,
        endDate
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let list = data.data;
            this.tableData = list.list;
            this.total = list.allsize;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
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
          this.search.ele,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + "00:00:00"
        );
        if (this.search.ele) {
          // this._httpSalesmanLoanTimes(
          //   this.search.ele,
          //   this.search.time[0] + " 00:00:00",
          //   timeFormat(this.search.time[1], 1) + "00:00:00",
          //   true
          // );
          this._httpSalesmanLoanSum(
            this.search.ele,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + "00:00:00",
            true
          );
          this.type = true;
        } else {
          // this._httpSalesmanLoanTimes(
          //   this.search.ele,
          //   this.search.time[0] + " 00:00:00",
          //   timeFormat(this.search.time[1], 1) + "00:00:00",
          //   false
          // );
          this._httpSalesmanLoanSum(
            this.search.ele,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + "00:00:00",
            false
          );
          this.type = false;
        }
      } else {
        this.getData(this.npage, this.pagesize, this.search.ele, "", "");
        if (this.search.ele) {
          // this._httpSalesmanLoanTimes(this.search.ele, "", "", true);
          this._httpSalesmanLoanSum(this.search.ele, "", "", true);
          this.type = true;
        } else {
          // this._httpSalesmanLoanTimes(this.search.ele, "", "", false);
          this._httpSalesmanLoanSum(this.search.ele, "", "", false);
          this.type = false;
        }
      }
    },
    handleAllocation(index, row) {},
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch(false);
    },
    reset() {
      this.npage = 1;
      this.pagesize = 10;
      this.search = {};
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDetail() {
      this.loadings = true;
      // this.allList = [];
      // this.allCountList.forEach((v, i) => {
      //   this.allList.push(
      //     Object.assign({}, v, {
      //       loanTotalMoney: this.allMoneyList[i].loanTotalMoney
      //     })
      //   );
      // });
      this.detailVisible = true;
      this.loadings = false;
    },
    export2Excel() {
      console.log(1);
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "用户ID",
          "客户姓名",
          "贷款金额",
          "平台服务费",
          "提款时间",
          "到账卡号",
          "所属银行",
          "银行预留手机号",
          "电销员姓名"
        ];
        const filterVal = [
          "custUserId",
          "custUserName",
          "totalMoney",
          "interest",
          "loanDateStr",
          "bankCardId",
          "bankCardName",
          "bankCardMobile",
          "salesmanName"
        ];
        let list = JSON.parse(JSON.stringify(this.tableData));

        // for (var i = 0; i < list.length; i++) {
        //   list[i].late_fee = list[i].type === 2 ? 0 : list[i].late_fee;
        //   list[i].charge_fee = list[i].type === 1 ? 0 : list[i].charge_fee;
        //   list[i].penalty_money =
        //     list[i].type === 1 ? 0 : list[i].penalty_money;
        //   list[i].status =
        //     list[i].status === 1
        //       ? "成功"
        //       : list[i].status === 2 ? "还款中" : "失败";
        //   list[i].type =
        //     list[i].type === 1 ? "本金" : list[i].type === 2 ? "服务费" : "";
        //   list[i].charge_fee2 =
        //     list[i].raise_money + list[i].charge_fee + list[i].late_fee;
        //   // list[i].result =
        //   //   list[i].result === 1
        //   //     ? "通过"
        //   //     : list[i].result === 2 ? "人工" : "拒绝";
        //   list[i].createTime = timeFormat(list[i].createTime);
        // }

        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "电销放款明细");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
    this._getEleCompanyId();
    // this._httpSalesmanLoanTimes("", "", "", true);
    this._httpSalesmanLoanSum("", "", "", true);
  }
};
</script>

<style>
</style>
