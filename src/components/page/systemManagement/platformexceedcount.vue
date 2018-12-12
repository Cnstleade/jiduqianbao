<template>
    <div class="container">
        <el-row>
            <el-alert
              title="平台逾期整体展示"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>
        <el-row class="m20  col-flex-end">
           
                   
              <div style="flex-grow:1" >
                <el-button-group>
                    <el-button  type="success" >正常</el-button>
                    <el-button  >{{platformwithdrawabout.readyPayAndNotExceed}}</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="primary" >M1</el-button>
                    <el-button  >{{platformwithdrawabout.overdueApplyNumber_m1}}</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="warning" >M2</el-button>
                    <el-button  >{{platformwithdrawabout.overdueApplyNumber_m2}}</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="danger">M3</el-button>
                    <el-button  >{{platformwithdrawabout.overdueApplyNumber_m3}}</el-button>
                </el-button-group>   
                <el-button-group>
                    <el-button type="primary" >M3+</el-button>
                    <el-button  >{{platformwithdrawabout.overdueApplyNumber_m4}}</el-button>
                </el-button-group>   
                <el-button-group>
                    <el-button type="info" >结束</el-button>
                    <el-button  >{{platformwithdrawabout.endApplyNumber}}</el-button>
                </el-button-group>                                                                                
              </div>
                <el-button  type="primary" @click="reset">重置</el-button>
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
                    <el-button class="l20" style="margin-left:10px" @click="handleSearch" icon="el-icon-search"  type="success" circle></el-button>                     
            
        </el-row>   
   <el-row class="m20">
      <!--:span-method="objectSpanMethod"-->
      <el-table
        :data="tableData"
        border
            highlight-current-row style="width: 100%;font-weight:bold">
        <!--<el-table-column prop="jl" align='center' label="审核经理"  ></el-table-column>-->
        <!--<el-table-column prop="tj" align='center' label="统计" width="240" ></el-table-column>-->
        <el-table-column prop="applyNumber"  align='center' label="订单量"></el-table-column>
        <el-table-column prop="allSalesMoney" align='center' label="销售额"></el-table-column>
        <el-table-column prop="readyCollectionMoney" align='center' label="待收款"></el-table-column>

        <el-table-column prop="allLate_free" align='center' label="M1">
            <el-table-column prop="overdueApplyNumber_m1"  align='center' label="数量"></el-table-column>
            <el-table-column prop="allOverdueMoney_m1" align='center' label="金额"></el-table-column>
            <el-table-column prop="allOverdueMoney" align='center' label="比例">
                <template slot-scope="scope">
                  <span>{{((scope.row.allOverdueMoney_m1/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%</span>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="allLate_free" align='center' label="M2">
            <el-table-column prop="overdueApplyNumber_m2"  align='center' label="数量"></el-table-column>
            <el-table-column prop="allOverdueMoney_m2" align='center' label="金额"></el-table-column>
            <el-table-column prop="allOverdueMoney" align='center' label="比例">
                <template slot-scope="scope">
                  <span>{{((scope.row.allOverdueMoney_m2/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%</span>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="allLate_free" align='center' label="M3">
            <el-table-column prop="overdueApplyNumber_m3"  align='center' label="数量"></el-table-column>
            <el-table-column prop="allOverdueMoney_m3" align='center' label="金额"></el-table-column>
            <el-table-column prop="allOverdueMoney" align='center' label="比例">
                <template slot-scope="scope">
                  <span>{{((scope.row.allOverdueMoney_m3/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%</span>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="allLate_free" align='center' label="M3+">
            <el-table-column prop="overdueApplyNumber_m4"  align='center' label="数量"></el-table-column>
            <el-table-column prop="allOverdueMoney_m4" align='center' label="金额"></el-table-column>
            <el-table-column prop="allOverdueMoney" align='center' label="比例">
                <template slot-scope="scope">
                  <span>{{((scope.row.allOverdueMoney_m4/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%</span>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column prop="allLate_free" align='center' label="小计">
            <el-table-column prop="overdueApplyNumber_m1"  align='center' label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row.overdueApplyNumber_m1+scope.row.overdueApplyNumber_m2+scope.row.overdueApplyNumber_m3+scope.row.overdueApplyNumber_m4}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="allOverdueMoney_m1" align='center' label="金额">
                <template slot-scope="scope">
                  <span>{{scope.row.allOverdueMoney_m1+scope.row.allOverdueMoney_m2+scope.row.allOverdueMoney_m3+scope.row.allOverdueMoney_m4}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="allOverdueMoney" align='center' label="比例">
                <template slot-scope="scope">
                  <span>{{(((scope.row.allOverdueMoney_m1+scope.row.allOverdueMoney_m2+scope.row.allOverdueMoney_m3+scope.row.allOverdueMoney_m4)/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%</span>
                </template>
            </el-table-column>
        </el-table-column>        
      </el-table>
    </el-row>   

    </div>
</template>
<script>
import { timeFormat } from "../../../config/time";
import {
  httpPlatformexceedcount,
  httpPlatformwithdrawabout
} from "../../../service/http";
export default {
  data() {
    return {
      search: {},
      platformwithdrawabout: {},
      tableData: []
    };
  },
  methods: {
    getData(begainTimeString, endTimeString) {
      httpPlatformexceedcount(begainTimeString, endTimeString)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData.length = 0;
            this.tableData.push(data.data);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
        //   let data = {
        //     code: 200,
        //     msg: "提交成功",
        //     data: {
        //       applyNumber: 31,
        //       allSalesMoney: 38364.9,
        //       readyCollectionMoney: 38364.9,
        //       overdueApplyNumber_m1: 1,
        //       allOverdueMoney_m1: 2,
        //       overdueApplyNumber_m2: 3,
        //       allOverdueMoney_m2: 4,
        //       overdueApplyNumber_m3: 5,
        //       allOverdueMoney_m3: 6,
        //       overdueApplyNumber_m4: 7,
        //       allOverdueMoney_m4: 8
        //     }
        //   };
        //   if (data.code == 200) {
        //     this.tableData.length = 0;
        //     this.tableData.push(data.data);
        //     console.log(this.tableData);
        //   } else {
        //     this.$message.error(data.msg);
        //   }
        });
    },
    reset() {
      this.search = {};
      this.handleSearch();
    },
    handleSearch() {
      if (this.search.time && this.search.time.length) {
        this.getData(
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + "00:00:00"
        );
      } else {
        this.getData();
      }
    },
    _httpPlatformwithdrawabout() {
      httpPlatformwithdrawabout()
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.platformwithdrawabout = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
        //   let data = {
        //     code: 200,
        //     msg: "提交成功",
        //     data: {
        //       readyPayAndNotExceed: 7,
        //       overdueApplyNumber_m1: 6,
        //       overdueApplyNumber_m2: 0,
        //       overdueApplyNumber_m3: 0,
        //       overdueApplyNumber_m4: 0,
        //       endApplyNumber: 13
        //     }
        //   };
        //   if (data.code == 200) {
        //     this.platformwithdrawabout = data.data;
        //   } else {
        //     this.$message.error(data.msg);
        //   }
        });
    }
  },
  mounted() {
    this._httpPlatformwithdrawabout();
    this.getData();
  }
};
</script>
<style scoped>
</style>

