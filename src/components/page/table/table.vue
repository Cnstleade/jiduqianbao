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
                    <!-- <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>     -->
                    <el-button  type="primary" @click="reset">重置</el-button>
                    <el-select class="l20" v-model="search.type" placeholder="请选择处理结果">
                      <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
            <el-table-column
              type="selection"
              align="center"
               fixed
              width="55">
            </el-table-column>        
            <el-table-column prop="applyTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column type="expand" label="更多详情" width="80" >
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
                      <el-table-column prop="status"   label="是否逾期" align="center" 
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
                      <el-table-column prop="id"  fixed label="id" align="center" ></el-table-column>
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
            </el-table-column> 
                <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >分配</el-button>
                    </template> 
                </el-table-column>            
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
    </div>
</template>

<script>
import { httpPaymentlistbycollectmanager } from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  data() {
    return {
      title: "表格",
      search: {
        input: "",
        time: ""
      },
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      types: [{ label: "未处理", value: 1 }, { label: "已处理", value: 2 }],
      multipleSelection: [] //全部选中嘛
    };
  },
  methods: {
    getData(npage, pagesize, begainTimeString, endTimeString, repaymentStatus) {
      let _this = this;
      this.loading = true;
      httpPaymentlistbycollectmanager(
        npage,
        pagesize,
        begainTimeString,
        endTimeString,
        repaymentStatus
      )
        .then(res => {
          let data = res.data;
        })
        .catch(err => {
          _this.tableData = [];
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
          this.search.type
        );
      } else {
        this.getData(this.npage, this.pagesize, "", "", this.search.type);
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
      this.search = {};
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
  }
};
</script>

<style>
</style>
