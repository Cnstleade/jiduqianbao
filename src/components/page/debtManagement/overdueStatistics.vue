<template>
  <div class="container">
    <el-row>
      <el-alert
        title="审核逾期统计"
        :closable="false"
        type="info">
      </el-alert>
    </el-row>
        <el-row class="m20 col-flex-end" >
              <div style="flex-grow:1" >
                <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button>
               

              </div>
               <el-button  type="primary" @click="cz">重置</el-button>

              <el-select class="l20" v-model="search.channelId" placeholder="推广码">
                      <el-option
                        v-for="(item,i) in channelIds"
                        :key="i"
                        :label="item"
                        :value="item">
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
    <el-row class="m20">
      <!--:span-method="objectSpanMethod"-->
      <el-table
        :data="overdueTable"
        border
            highlight-current-row style="width: 100%;font-weight:bold">
        <!--<el-table-column prop="jl" align='center' label="审核经理"  ></el-table-column>-->
        <!--<el-table-column prop="tj" align='center' label="统计" width="240" ></el-table-column>-->
        <el-table-column prop="username" fixed align='center' label="审核员"></el-table-column>
        <el-table-column prop="applyNumber" align='center' label="订单总数"></el-table-column>
        <el-table-column prop="allOverdueMoney" align='center' label="总逾期本金"></el-table-column>
        <el-table-column prop="allLate_free" align='center' label="总逾期违约金"></el-table-column>
        <el-table-column align='center' label="m1逾期订单">
          <template slot-scope="scope">
            <span>{{((scope.row.overdueApplyNumber_m1/scope.row.applyNumber).toFixed(4)*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="allOverdueMoney_m1" align='center' label="m1本金总额"></el-table-column>
        <el-table-column prop="allLate_free_m1" align='center' label="m1违约金"></el-table-column>
        <el-table-column align='center' label="m2逾期订单">
          <template slot-scope="scope">
            <span>{{((scope.row.overdueApplyNumber_m2/scope.row.applyNumber).toFixed(4)*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="allOverdueMoney_m2" align='center' label="m2本金总额"></el-table-column>
        <el-table-column prop="allLate_free_m2" align='center' label="m2违约金"></el-table-column>
        <el-table-column align='center' label="m3逾期订单">
          <template slot-scope="scope">
            <span>{{((scope.row.overdueApplyNumber_m3/scope.row.applyNumber).toFixed(4)*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="allOverdueMoney_m3" align='center' label="m3本金总额"></el-table-column>
        <el-table-column prop="allLate_free_m3" align='center' label="m3违约金"></el-table-column>
        <el-table-column align='center' label="m3+逾期订单">
          <template slot-scope="scope">
            <span>{{((scope.row.overdueApplyNumber_m4/scope.row.applyNumber).toFixed(4)*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="allOverdueMoney_m4" align='center' label="m3+本金总额"></el-table-column>
        <el-table-column prop="allLate_free_m4" align='center' label="m3+违约金"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { config } from "../../../util/config";
import { timeFormat } from "../../../config/time";
import { httpFindAllPrometion } from "../../../service/http";
export default {
  data() {
    return {
      overdueTable: [],
      search: {},
      channelIds: []
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
    //得到推广码
    _httpFindAllPrometion() {
      httpFindAllPrometion()
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.channelIds = data.data;
          }
        })
        .catch(err => {
          let data = {
            code: 200,
            msg: "提交成功",
            data: ["weixin", "xybx", "kfzy", "thn123", "JHHS9"]
          };
          if (data.code == 200) {
            this.channelIds = data.data;
          }
        });
    },
    cz() {
      // this.npage = 1;
      // this.pagesize = 10;
      this.search = {};
      this.handleSearch();
    },
    handleSearch(type = true) {
      // if (type) {
      //   this.npage = 1;
      //   this.pagesize = 10;
      // }
      if (this.search.time && this.search.time.length) {
        this.queryOverdueStatistical(
          // this.npage,
          // this.pagesize,
          this.search.channelId,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00"
          // this.search.IdCard,
          // this.search.userName,
          // this.search.execeedtimeType,
          // this.search.paymentStatus
          // this.search.order ? this.search.order : 0,
        );
      } else {
        this.queryOverdueStatistical(
          // this.npage,
          // this.pagesize,
          this.search.channelId

          // this.search.IdCard,
          // this.search.userName,
          // this.search.execeedtimeType,
          // this.search.paymentStatus
          // this.search.order ? this.search.order : 0,
        );
      }
    },
    /*objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % 4 === 0) {
            return {
              rowspan: 4,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },*/
    // 查询逾期统计列表
    queryOverdueStatistical(channelId, begainTimeString, endTimeString) {
      this.$store.dispatch("SETLogin");
      $.ajax({
        type: "POST",
        url: config.baseURL + "/sys/loanandexceed",
        data: {
          loginId: this.loginId,
          channelId,
          begainTimeString,
          endTimeString
        },
        success: data => {
 
          this.overdueTable = data;
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //excel导出数据
    export2Excel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "序号",
          "审核员",
          "订单总数",
          "总逾期本金",
          "总逾期违约金",
          "m1逾期订单",
          "m1本金总额",
          "m1违约金",
          "m2逾期订单",
          "m2本金总额",
          "m2违约金",
          "m3逾期订单",
          "m3本金总额",
          "m3违约金",
          "m3+逾期订单",
          "m3+本金总额",
          "m3+违约金"
        ];
        const filterVal = [
          "id",
          "username",
          "applyNumber",
          "allOverdueMoney",
          "allLate_free",
          "allOverdueMoney_m1",
          "allLate_free_m1",
          "m1",
          "allOverdueMoney_m2",
          "allLate_free_m2",
          "m2",
          "allOverdueMoney_m3",
          "allLate_free_m3",
          "m3",
          "allOverdueMoney_m4",
          "allLate_free_m4",
          "m4"
        ];
        let list = JSON.parse(JSON.stringify(this.overdueTable));

        for (var i = 0; i < list.length; i++) {
          // list[i].status =
          //   list[i].status === 4
          //     ? "借款中"
          //     : list[i].status === 8 ? "完结" : "";
          // list[i].cash_outType =
          //   list[i].cash_outType === 0
          //     ? "无提现记录"
          //     : list[i].cash_outType === 1 ? "有余额" : "无余额";
          list[i].m1 = (
            list[i].overdueApplyNumber_m1 / list[i].applyNumber
          ).toFixed(2);
          list[i].m2 = (
            list[i].overdueApplyNumber_m2 / list[i].applyNumber
          ).toFixed(2);
          list[i].m3 = (
            list[i].overdueApplyNumber_m3 / list[i].applyNumber
          ).toFixed(2);
          list[i].m4 = (
            list[i].overdueApplyNumber_m4 / list[i].applyNumber
          ).toFixed(2);
        }
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "滞纳金管理");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  mounted() {
    this.queryOverdueStatistical();
    this._httpFindAllPrometion();
  }
};
</script>
<style scoped>
</style>

