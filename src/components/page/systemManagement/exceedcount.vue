<template>
    <div class="container">
        <el-row>
            <el-alert
              title="提现逾期统计"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>      
        <el-row class="m20 col-flex-end" >
            <!-- <el-col :span="6">
                <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button>
            </el-col>              -->
         
                 <el-button  @click="reset" type="primary">重置</el-button>
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
 
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
             style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
            id="ss"
          >
            <el-table-column prop="dateTimeString" label="日期" align="center" width="180" >
            </el-table-column>          
            <el-table-column  prop="allSalesMoney" label="销售量" align="center" width="166">
                <el-table-column label="销售额" align="center"  width="166">
                    <template slot-scope="scope">
                        {{scope.row.allSalesCount}}<br>{{scope.row.allSalesMoney}}
                    </template> 
                </el-table-column>

            </el-table-column>
            <el-table-column  prop="exceedMonry" label="逾期量" align="center"  width="166">
                <el-table-column  label=" 逾期额" align="center"  width="166" >
                    <template slot-scope="scope">
                        {{scope.row.exceedCount}}<br>{{scope.row.exceedMonry}}
                    </template>  
                </el-table-column>
            </el-table-column>
            <el-table-column  prop="" label="逾期率" align="center"  width="120">
                <template slot-scope="scope">
                    {{((scope.row.exceedCount/scope.row.allSalesCount).toFixed(4)*100).toFixed(2)}}%<br>{{((scope.row.exceedMonry/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%
                </template>  
            </el-table-column>
             <el-table-column label="操作" align="center" width="150" >                                                                                                        
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">详情</el-button>
              </template>
              </el-table-column >             
            <!-- <el-table-column  prop="exceedCount" label="逾期量" align="center"  min-width="120"></el-table-column>
            <el-table-column  prop="id" label="销售量逾期率" align="center"  min-width="120"></el-table-column> -->
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
          title="详情"
          :visible.sync="dialogVisible" 
          center
          width="60%"
          >
        <el-table
            :data="showData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
            :row-class-name="tableRowClassName"
             style="width: 100%;font-weight:bold"
          >
            <el-table-column prop="channelName" label="渠道名" align="center" width="180" >
            </el-table-column>             
            <el-table-column prop="dateTimeString" label="日期" align="center" width="180" >
            </el-table-column>          
            <el-table-column  prop="allSalesMoney" label="销售量" align="center" width="166">
                <el-table-column label="销售额" align="center"  width="166">
                    <template slot-scope="scope">
                        {{scope.row.allSalesCount}}<br>{{scope.row.allSalesMoney}}
                    </template> 
                </el-table-column>

            </el-table-column>
            <el-table-column  prop="exceedMonry" label="逾期量" align="center"  width="166">
                <el-table-column  label=" 逾期额" align="center"  width="166" >
                    <template slot-scope="scope">
                        {{scope.row.exceedCount}}<br>{{scope.row.exceedMonry}}
                    </template>  
                </el-table-column>
            </el-table-column>
            <el-table-column  prop="" label="逾期率" align="center"  width="120">
                <template slot-scope="scope">
                    {{((scope.row.exceedCount/scope.row.allSalesCount).toFixed(4)*100).toFixed(2)}}%<br>{{((scope.row.exceedMonry/scope.row.allSalesMoney).toFixed(4)*100).toFixed(2)}}%
                </template>  
            </el-table-column>
>             
        </el-table>  
        </el-dialog>                        
    </div>
</template>

<script>
import { httpExceedcount, httpExceedcountdetail } from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      search: {
        time: null
      },
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      index: 0,
      showData: [],
      dialogVisible: false
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let i = (row.exceedMonry / row.allSalesMoney).toFixed(2) * 100;
      if (i >= 0 && i < 5) {
        return "green";
      } else if (i >= 5 && i < 10) {
        return "blue";
      } else if (i >= 10 && i < 15) {
        return "yellow";
      } else if (i >= 15) {
        return "red";
      }
      return "";
    },
    reset() {
      this.search = {};
      this.npage = 1;
      this.pagesize = 10;
      this.getData(this.npage, this.pagesize);
    },
    getData(npage, pagesize, begainTimeString, endTimeString) {
      this.loading = true;
      httpExceedcount(npage, pagesize, begainTimeString, endTimeString)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.allsize;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          let data = {
            code: 200,
            msg: "提交成功",
            data: {
              npage: 1,
              pagesize: 20,
              allsize: 6,
              list: [
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 1,
                  allSalesCount: 6,
                  exceedCount: 0
                },
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 2,
                  allSalesCount: 6,
                  exceedCount: 1
                },
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 3,
                  allSalesCount: 6,
                  exceedCount: 2
                },
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 4,
                  allSalesCount: 6,
                  exceedCount: 3
                },
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 0,
                  allSalesCount: 6,
                  exceedCount: 4
                },
                {
                  dateTimeString: "2018-10-17",
                  allSalesMoney: 7500,
                  exceedMonry: 0,
                  allSalesCount: 6,
                  exceedCount: 5
                }
              ]
            }
          };
          if (data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.allsize;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
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
          timeFormat(this.search.time[1], 1) + " 00:00:00"
        );
      } else {
        this.getData(this.npage, this.pagesize);
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
    // export2Excel() {
    //   require.ensure([], () => {
    //     const {
    //       export_json_to_excel
    //     } = require("../../../vendor/Export2Excel");
    //     const tHeader = [
    //       "订单号",
    //       "姓名",
    //       "手机号",
    //       "身份证号",
    //       "申请时间",
    //       "申请金额",
    //       "审核金额",
    //       "订单状态",
    //       "本金还款状态"
    //     ];
    //     const filterVal = [
    //       "id",
    //       "userName",
    //       "mobile",
    //       "idNo",
    //       "applyTime",
    //       "applyAmt",
    //       "approveAmt",
    //       "status",
    //       "cash_outType"
    //     ];
    //     let list = JSON.parse(JSON.stringify(this.tableData));

    //     for (var i = 0; i < list.length; i++) {
    //       list[i].status =
    //         list[i].status === 4
    //           ? "借款中"
    //           : list[i].status === 8 ? "完结" : "";
    //       list[i].cash_outType =
    //         list[i].cash_outType === 0
    //           ? "无提现记录"
    //           : list[i].cash_outType === 1 ? "有余额" : "无余额";
    //       list[i].applyTime = timeFormat(list[i].applyTime);
    //     }
    //     const data = this.formatJson(filterVal, list);
    //     export_json_to_excel(tHeader, data, "贷后列表");
    //   });
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => v[j]));
    // }
    handleEdit(index, row) {
      httpExceedcountdetail(row.dateTimeString)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.showData = data.data;
            this.dialogVisible = true;
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
  }
};
</script>

<style >
.el-table .red {
  background: #fe0000;
  color: #fff;
}
.el-table .yellow {
  background: #fda500;
  color: #fff;
}
.el-table .green {
  background: #0000fe;
  color: #fff;
}
.el-table .blue {
  background: #008104;
  color: #fff;
}
#ss .el-table__body tr:hover > td {
  color: #000;
}
</style>
