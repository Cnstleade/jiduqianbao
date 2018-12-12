<template>
    <div class="container" id="repamentcount">

<el-tabs type="border-card"   v-model="activeName" @tab-click="handleClick" v-loading="lodings">
    <el-tab-pane label="线上还款列表" name="three">
        <el-row>
            <el-alert
              title="线上还款列表"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20" >
            <el-col   class="col-flex-end">
              <div  style="flex-grow:1">
              <el-button  icon="el-icon-plus" @click="export2Excel">导出excel</el-button>
              </div>              
                    <!-- <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>     -->
                    <el-button  type="primary" @click="reset2">重置</el-button>
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
                    <el-select class="l20" v-model="search.withdrawStatus" placeholder="请选择状态">
                      <el-option
                        v-for="item in withdrawStatus"
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
                    <el-button @click="handleSearch2" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
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
            id="eleTable"
          >
            <el-table-column prop="id" fixed label="ID" align="center" width="80" sortable>
            </el-table-column>  
         <el-table-column prop="userName" label="姓名" align="center" width="120" >
            </el-table-column> 
           <el-table-column prop="mobile" label="手机号" align="center" width="120" >
            </el-table-column>  
           <el-table-column prop="id_no" label="身份证" align="center" width="180" >
            </el-table-column>              
            <el-table-column prop="card_id_card" label="银行卡号" align="center" width="180" >
            </el-table-column>  
            <el-table-column prop="bank_card_name" label="银行名" align="center" width="120" >
            </el-table-column> 
            <el-table-column prop="raise_money" label="客户提现金额" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="withdrawMoney" label="实际到款金额" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="realMoney" label="实际还款金额" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="late_fee" label="滞纳金" align="center" width="120" >
            </el-table-column>                          
            <el-table-column prop="coupon_value" label="优惠券面值" align="center" width="120" >
                <template slot-scope="scope">
                          <span v-if="scope.row.coupon_value">
                            {{scope.row.coupon_value}}
                          </span>
                </template> 
            </el-table-column>               
            <!-- <el-table-column prop="raise_money" label="实际还款滞纳金" align="center" width="120" >
            </el-table-column>   -->
            <el-table-column prop="baofuapplyId" label="商户订单号" align="center" width="140" >
                                      <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.baofuapplyId" placement="top">
                                                  <span>{{scope.row.baofuapplyId}}</span>
                                              </el-tooltip>
                                        </template>               
            </el-table-column>    
            <el-table-column prop="createTime" label="还款时间" align="center" width="180" >
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>              
            </el-table-column>    
            <el-table-column prop="collectName" label="催收员" align="center" width="120" >
            </el-table-column>                                                                                                      
            <el-table-column prop="status" label="还款类型" align="center" width="120"
               :filters="[{ value: 1, text: '成功' }, { value: 3, text: '失败' },, { value: 2, text: '还款中' }]"
               :filter-method="filterStauts"                      
            >
              <template slot-scope="scope">
                  <el-tag
                      :type="scope.row.status===1?'success':scope.row.status===2?'primary':scope.row.status===3?'danger':''"
                  >{{scope.row.status===1?'成功':scope.row.status===2?'还款中':scope.row.status===3?'失败':''}}</el-tag>
              </template>                         
            </el-table-column>   
            <!-- <el-table-column prop="raise_money" label="当前状态" align="center" width="120" >
            </el-table-column>    -->
            <el-table-column prop="trans_remark" label="备注" align="center" min-width="120" >
                <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.trans_remark" placement="top">
                              <span>{{scope.row.trans_remark}}</span>
                          </el-tooltip>
                    </template>                 
            </el-table-column>                                       
            <!-- <el-table-column prop="createTime" label="时间" align="center" width="180" sortable>

            </el-table-column>  

            <el-table-column prop="withdrawMoney" label="还款金额" align="center" width="120" >
            </el-table-column>                                      
            <el-table-column prop="status" label="状态" align="center" width="120"
               :filters="[{ value: 1, text: '成功' },{value: 2, text: '还款中'}, { value: 3, text: '失败' }]"
               :filter-method="filterStauts"                      
            >
              <template slot-scope="scope">
                  <el-tag
                      :type="scope.row.status===1?'success':scope.row.status===2?'primary':scope.row.status===3?'danger':''"
                  >{{scope.row.status===1?'成功':scope.row.status===2?'还款中':scope.row.status===3?'失败':''}}</el-tag>
              </template>                         
            </el-table-column>

            <el-table-column prop="trans_remark" label="备注" align="center" min-width="120" >
                <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.trans_remark" placement="top">
                              <span>{{scope.row.trans_remark}}</span>
                          </el-tooltip>
                    </template>                 
            </el-table-column>                                          -->
            <!-- <el-table-column prop="createTime" label="时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="raise_money" label="合同金额" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="withdrawMoney" label="实际到款金额" align="center" width="120" >
            </el-table-column>   
            <el-table-column prop="status" label="状态" align="center" width="120"
               :filters="[{ value: 1, text: '放款成功' }, { value: 2, text: '逾期' }]"
               :filter-method="filterStauts"                      
            >
              <template slot-scope="scope">
                  <el-tag
                      :type="scope.row.status===1?'success':scope.row.status===2?'danger':''"
                  >{{scope.row.status===1?'成功':scope.row.status===2?'失败':''}}</el-tag>
              </template>                         
            </el-table-column>   
            <el-table-column prop="mobile" label="手机号" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="card_id_card" label="银行卡号" align="center" width="180" >
            </el-table-column>  
            <el-table-column prop="bank_card_name" label="银行名" align="center" width="120" >
            </el-table-column>  
            <el-table-column prop="trans_remark" label="备注" align="center" min-width="120" >
                <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.trans_remark" placement="top">
                              <span>{{scope.row.trans_remark}}</span>
                          </el-tooltip>
                    </template>                 
            </el-table-column>                                                                                  -->
                        
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
                <!-- <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >分配</el-button>
                    </template> 
                </el-table-column>             -->
        </el-table>     
        <el-row class="m20" v-if="total>0">
          <div style="float:left" >
            <el-button type="primary" >放款本金总计{{allCostMony}}</el-button>   
            <el-button  type="primary" class="l20" >滞纳金总计{{allLateMoney}}</el-button>      
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
    </el-tab-pane> 
    <el-tab-pane label="线下还款列表" name="four">
        <el-row>
            <el-alert
              title="线下还款列表"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20" >
          
            <el-col   class="col-flex-end">
              <div  style="flex-grow:1">
              <el-button  icon="el-icon-plus" @click="export2Excel2">导出excel</el-button>
              </div>              
                    <el-button  type="primary" @click="reset3">重置</el-button>
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
                    <el-select class="l20" v-model="search.withdrawStatus" placeholder="请选择状态">
                      <el-option
                        v-for="item in withdrawStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                       
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
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
            id="eleTable"
          >
            <el-table-column prop="id" fixed label="ID" align="center" width="80" sortable>
            </el-table-column>
         <el-table-column prop="userName" label="姓名" align="center" width="120" >
            </el-table-column> 
           <el-table-column prop="phoneNumber" label="手机号" align="center" width="120" >
            </el-table-column>   
           <el-table-column prop="id_no" label="身份证" align="center" width="160" >
            </el-table-column>
            <el-table-column prop="withdrawMoney" label="实际到款金额" align="center" width="120" >
            </el-table-column>             
            <el-table-column prop="ned_return_money" label="需要还款金额" align="center" width="120" >
              <template slot-scope="scope">
                {{ scope.row.late_fee + scope.row.raise_money }}
              </template>
            </el-table-column> 
        <el-table-column prop="late_fee" label="滞纳金" align="center" width="120" >
            </el-table-column>             
            <el-table-column prop="returnMoney" label="实际还款金额" align="center" width="120" >
            </el-table-column>   
            <el-table-column prop="raise_money" label="合同金额" align="center" width="120" >
            </el-table-column> 
            <el-table-column prop="realRepmnentDate" label="实际还款日期" align="center" width="140" >
                <template slot-scope="scope">
                    {{scope.row.realRepmnentDate|dateServer}}
                </template>               
            </el-table-column> 
            <el-table-column prop="returnTime" label="需要还款日" align="center" width="140" >
                <template slot-scope="scope" >
                  <template v-if="scope.row.returnTime">
                    {{scope.row.returnTime|dateServer}}
                  </template>
                </template>               
            </el-table-column> 
            <el-table-column prop="remarks" label="描述" align="center" width="120" >
                                      <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.remarks" placement="top">
                                                  <span>{{scope.row.remarks}}</span>
                                              </el-tooltip>
                                        </template>                  
            </el-table-column>                         

            <el-table-column prop="collectName" label="催收员姓名" align="center" min-width="120" >
            </el-table-column>                         

 
        </el-table>     
        <el-row class="m20" v-if="total>0">
          <div style="float:left" >
            <el-button type="primary" >放款本金总计{{allCostMony}}</el-button>   
            <el-button  type="primary" class="l20" >滞纳金总计{{allLateMoney}}</el-button>      
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
    </el-tab-pane>      
  <el-tab-pane label="按日统计" name="first">
        <el-row class="m20 col-flex-end">
            <el-col :span="13">
                    <el-button class="l20" type="primary" @click="reset" style="margin-left: 10px;">重置</el-button>
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
        <el-row style="margin-top:40px">
            <el-col :span="18">
	           <div id="myChart" :style="{ height: '500px'}"></div>
            </el-col>
            <el-col :span="6">
                <div id="dataChart" :style="{ height: '500px'}"></div>
            </el-col>
        </el-row>   
  </el-tab-pane>
  <el-tab-pane label="按月统计" name="second">
        <el-row class="m20 col-flex-end">
            <el-col :span="13">
                    <el-button class="l20" type="primary" @click="reset1" style="margin-left: 10px;">重置</el-button>
                    <el-date-picker
                     class="l20"
                      v-model="month"
                      type="month"
                      placeholder="选择月">
                    </el-date-picker> 
                        <el-tag>至</el-tag>
                    <el-date-picker
                     class="l20"
                      v-model="month1"
                      type="month"
                      placeholder="选择月">
                    </el-date-picker>                     
                    <el-button @click="handleSearch1" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>            
        </el-row>      
        <el-row style="margin-top:40px">
            <el-col :span="18">
	           <div id="myChart1" :style="{ height: '500px'}"></div>
            </el-col>
            <el-col :span="6">
                <div id="dataChart2" :style="{ height: '500px'}"></div>
            </el-col>
        </el-row>   
  </el-tab-pane>
 



</el-tabs>        
 
    </div>
</template>

<script>
import { timeFormat } from "../../../config/time";
import {
  httpRepaymentcount,
  httpBaofurepaymentlist,
  httpXianxiarepaymentsuccesslist
} from "@/service/http";
export default {
  data() {
    return {
      allLateMoney: 0,
      allCostMony: 0,
      activeName: "first",
      search: {},
      month: "",
      month1: "",
      lodings: false,
      npage: 1,
      pagesize: 10,
      total: 0,
      tableData: [],
      loading: true,
      withdrawStatus: [{ label: "成功", value: 1 }, { label: "失败", value: 2 }]
    };
  },
  methods: {
    _httpXianxiarepaymentsuccesslist(
      pagesize,
      npage,
      begainTimeString,
      endTimeString,
      withdrawStatus,
      userName,
      IdCard
    ) {
      httpXianxiarepaymentsuccesslist(
        pagesize,
        npage,
        begainTimeString,
        endTimeString,
        withdrawStatus,
        userName,
        IdCard
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.total = data.data.allsize;
            if (data.data.countVo) {
              this.allLateMoney = data.data.countVo
                ? data.data.countVo.allLateMoney
                : 0;
              this.allCostMony = data.data.countVo
                ? data.data.countVo.allCostMony
                : 0;
            }
            this.tableData = data.data.list;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    getData(
      pagesize,
      npage,
      begainTimeString,
      endTimeString,
      withdrawStatus,
      userName,
      IdCard
    ) {
      this.loading = true;
      httpBaofurepaymentlist(
        pagesize,
        npage,
        begainTimeString,
        endTimeString,
        withdrawStatus,
        userName,
        IdCard
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.total = data.data.allsize;
            this.allLateMoney = data.data.countVo.allLateMoney;
            this.allCostMony = data.data.countVo.allCostMony;
            this.tableData = data.data.list;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    handleSearch2(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.search.time && this.search.time.length) {
        if (this.activeName == "three") {
          this.getData(
            this.npage,
            this.pagesize,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + " 00:00:00",
            this.search.withdrawStatus,
            this.search.userName,
            this.search.IdCard
          );
        } else {
          this._httpXianxiarepaymentsuccesslist(
            this.npage,
            this.pagesize,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + " 00:00:00",
            this.search.withdrawStatus,
            this.search.userName,
            this.search.IdCard
          );
        }
      } else {
        if (this.activeName == "three") {
          this.getData(
            this.npage,
            this.pagesize,
            "",
            "",
            this.search.withdrawStatus,
            this.search.userName,
            this.search.IdCard
          );
        } else {
          this._httpXianxiarepaymentsuccesslist(
            this.npage,
            this.pagesize,
            "",
            "",
            this.search.withdrawStatus,
            this.search.userName,
            this.search.IdCard
          );
        }
      }
    },
    handleAllocation(index, row) {},
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch2(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch2(false);
    },
    reset2() {
      this.pagesize = 10;
      this.npage = 1;
      this.search = {};
      this.handleSearch2();
    },
    reset3() {
      this.pagesize = 10;
      this.npage = 1;
      this.search = {};
      this._httpXianxiarepaymentsuccesslist(this.pagesize, this.npage);
    },

    getLastDay(year, month) {
      var new_year = year; //取当前的年份
      var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        //如果当前大于12月，则年份转到下一年
        new_month -= 12; //月份减
        new_year++; //年份增
      }
      var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
      return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
    },

    //得到销售统计
    _httpGetsales(salesCountType, begainTimeString, endTimeString, type) {
      httpRepaymentcount(salesCountType, begainTimeString, endTimeString, type)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let xData = [];
            let sData = {
              money: []
            };
            data.data.forEach(v => {
              salesCountType == 1
                ? xData.push(timeFormat(v.time))
                : xData.push(v.timeString);
              sData.money.push(v.money);
            });
            this.drawLine(xData, sData, type);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
        });
    },
    _httpDataGetsales(type) {
      httpRepaymentcount(
        1,
        timeFormat(new Date()) + " 00:00:00",
        timeFormat(new Date(), 1) + " 00:00:00"
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let xData = [];
            let sData = {
              money: data.data.length > 0 ? data.data[0].money : ""
            };

            // data.data.forEach(v => {
            //   xData.push(timeFormat(v.time));
            //   sData.allMoney.push(v.allMoney);
            //   sData.allMoney_actual.push(v.allMoney_actual);
            //   sData.newAllMoney.push(v.newAllMoney);
            //   sData.newAllMoney_actual.push(v.newAllMoney_actual);
            //   sData.oldAllMoney.push(v.oldAllMoney);
            //   sData.oldAllMoney_actual.push(v.oldAllMoney_actual);
            // });
            this.drawDataLine(sData, type);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
        });
    },
    //画图
    drawLine(xData, sData, type = true) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = type
        ? this.$echarts.init(document.getElementById("myChart"))
        : this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption({
        // backgroundColor: "rgba(3, 10, 21, 0.42)", //rgba设置透明度0.1
        title: {
          text: "还款统计",
          subtext: "数据来源：极度钱包"
        },
        tooltip: {
          trigger: "axis"
        },
        //图例名
        legend: {
          data: ["金额"]
        },
        grid: {
          left: "3%", //图表距边框的距离
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        //工具框，可以选择
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        //x轴信息样式
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: xData,
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: "black"
            }
          },
          //x轴文字旋转
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },

        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} "
            }
          }
        ],
        series: [
          //虚线
          {
            name: "金额",
            type: "line",
            symbolSize: 4, //拐点圆的大小
            color: ["red"], //折线条的颜色
            data: sData.money,
            smooth: false, //关键点，为true是不支持虚线的，实线就用true
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "solid" //'dotted'虚线 'solid'实线
                }
              }
            }
          },
          //实线
          {
            name: "不通过次数",
            type: "line",
            symbol: "circle",
            symbolSize: 4,
            itemStyle: {
              normal: {
                color: "rgb(67, 67, 72)",
                borderColor: "rgb(67, 67, 72)" //拐点边框颜色
              }
            },
            data: sData.exeamineError
          },
          {
            name: "通过次数",
            type: "line",
            //                stack: '总量',
            symbolSize: 4,
            color: ["orange"],
            smooth: false, //关键点，为true是不支持虚线的，实线就用true
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "solid" //'dotted'虚线 'solid'实线
                }
              }
            },
            data: sData.exeamineSuccess
          }
        ]
      });
    },
    //画当天的图
    drawDataLine(sData, type) {
      var dataAxis = ["金额"];
      var data = [sData.money];
      var yMax = 10;
      var dataShadow = [];

      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }
      let myChart = type
        ? this.$echarts.init(document.getElementById("dataChart"))
        : this.$echarts.init(document.getElementById("dataChart2"));

      // 绘制图表

      // 绘制图表
      myChart.setOption({
        // backgroundColor: "rgba(3, 10, 21, 0.42)", //rgba设置透明度0.1
        title: {
          text: timeFormat(new Date()) + "（当天还款统计）",
          subtext: "数据来源：极度钱包"
        },
        grid: {
          left: "3%", //图表距边框的距离
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          data: dataAxis,
          //   axisLabel: {
          //     inside: true,
          //     textStyle: {
          //       color: "#fff"
          //     }
          //   },
          //   axisTick: {
          //     show: false
          //   },
          //   axisLine: {
          //     show: false
          //   },
          //   z: 10
          type: "category",
          boundaryGap: true,
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: "black"
            }
          },
          //x轴文字旋转
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            itemStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "blue" },
                  { offset: 0.5, color: "blue" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: data
          }
        ]
      });
    },
    //重置
    reset() {
      this.search = {};
      this.handleSearch();
    },
    reset1() {
      this.month = "";
      this.month1 = "";
      this.handleSearch1();
    },
    //查找
    handleSearch() {
      if (this.search.time && this.search.time.length) {
        this._httpGetsales(
          1,
          this.search.time[0] + " 00:00:00",
          timeFormat(new Date(this.search.time[1]), 1) + " 00:00:00",
          true
        );
      } else {
        this._httpGetsales(
          1,
          timeFormat(new Date(), -30) + " 00:00:00",
          timeFormat(new Date(), 1) + " 00:00:00",
          true
        );
      }
    },
    handleSearch1() {
      let data = timeFormat(this.month);

      let date = this.getLastDay(
        timeFormat(this.month).split("-")[0],
        timeFormat(this.month).split("-")[1]
      );

      let date1 =
        timeFormat(this.month).split("-")[0] +
        "-" +
        timeFormat(this.month).split("-")[1] +
        "-" +
        date;

      let date2 = timeFormat(new Date(date1), 1);
      if (this.month && this.month1) {
        this._httpGetsales(
          2,
          timeFormat(this.month) + " 00:00:00",
          timeFormat(
            timeFormat(timeFormat(new Date(this.month1))).split("-")[0] +
              "-" +
              timeFormat(timeFormat(new Date(this.month1))).split("-")[1] +
              "-" +
              this.getLastDay(
                timeFormat(timeFormat(new Date(this.month1))).split("-")[0],
                timeFormat(timeFormat(new Date(this.month1))).split("-")[1]
              ),
            1
          ) + " 00:00:00",
          false
        );
      } else {
        this._httpGetsales(
          2,
          timeFormat(new Date(), -30) + " 00:00:00",
          timeFormat(new Date(), 1) + " 00:00:00",
          false
        );
      }
    },
    handleClick(tab, event) {
      this.lodings = true;
      tab.name === "second"
        ? this.handleSearch1()
        : tab.name === "first"
          ? this.handleSearch()
          : tab.name === "three"
            ? this.getData(this.npage, this.pagesize)
            : this._httpXianxiarepaymentsuccesslist(this.npage, this.pagesize);
      tab.name === "second"
        ? this._httpDataGetsales(false)
        : tab.name === "first" ? this._httpDataGetsales(true) : "";
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    },
    filterStauts(value, row) {
      return row.status === value;
    },
    export2Excel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "ID",
          "姓名",
          "手机号",
          "身份证",
          "银行卡号",
          "银行名",
          "客户提现金额",
          "实际到款金额",
          "实际还款金额",
          "滞纳金",
          "商户订单号",
          "还款时间",
          "催收员",
          "还款类型",
          "备注"
        ];
        const filterVal = [
          "id",
          "userName",
          "mobile",
          "id_no",
          "card_id_card",
          "bank_card_name",
          "raise_money",
          "withdrawMoney",
          "realMoney",
          "late_fee",
          "baofuapplyId",
          "createTime",
          "collectName",
          "status",
          "trans_remark"
        ];
        let list = JSON.parse(JSON.stringify(this.tableData));

        for (var i = 0; i < list.length; i++) {
          list[i].status =
            list[i].status === 1
              ? "成功"
              : list[i].status === 2 ? "还款中" : "失败";
          // list[i].result =
          //   list[i].result === 1
          //     ? "通过"
          //     : list[i].result === 2 ? "人工" : "拒绝";
          list[i].createTime = timeFormat(list[i].createTime);
        }

        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "线上还款列表");
      });
    },
    export2Excel2() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = [
          "ID",
          "姓名",
          "手机号",
          "身份证",
          "实际到款金额",
          "需要还款金额",
          "滞纳金",
          "实际还款金额",
          "合同金额",
          "催收员姓名"
        ];
        const filterVal = [
          "id",
          "userName",
          "mobile",
          "id_no",
          "withdrawMoney",
          "ned_return_money",
          "late_fee",
          "returnMoney",
          "raise_money",
          "collectName"
        ];
        let list = JSON.parse(JSON.stringify(this.tableData));

        // for (var i = 0; i < list.length; i++) {
        //   list[i].status =
        //     list[i].status === 1
        //       ? "成功"
        //       : list[i].status === 2 ? "还款中" : "失败";
        //   // list[i].result =
        //   //   list[i].result === 1
        //   //     ? "通过"
        //   //     : list[i].result === 2 ? "人工" : "拒绝";
        //   list[i].createTime = timeFormat(list[i].createTime);
        // }
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "线下还款列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },

  mounted() {
    //   let data = timeFormat(new Date());

    //   let date1 =
    //     timeFormat(timeFormat(new Date())).split("-")[0] +
    //     "-" +
    //     timeFormat(timeFormat(new Date())).split("-")[1] +
    //     "-" +
    //     date;

    let date2 = timeFormat(
      timeFormat(timeFormat(new Date())).split("-")[0] +
        "-" +
        timeFormat(timeFormat(new Date())).split("-")[1] +
        "-" +
        this.getLastDay(
          timeFormat(timeFormat(new Date())).split("-")[0],
          timeFormat(timeFormat(new Date())).split("-")[1]
        ),
      1
    );

    this._httpGetsales(
      1,
      timeFormat(new Date(), -31) + " 00:00:00",
      timeFormat(new Date(), 1) + " 00:00:00",
      true
    );
    this._httpDataGetsales(true);
  }
};
</script>

<style>
#repamentcount .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

