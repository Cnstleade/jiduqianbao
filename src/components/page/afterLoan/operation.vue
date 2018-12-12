<template>
    <div class="container">
        <el-row>
            <el-alert
              title="还款操作管理"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>     
  <el-tabs v-model="activeName" type="border-card" class="m20" @tab-click="handleClick" v-loading="lodings">
    <el-tab-pane label="进行中催收订单" name="first">
        <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>               
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.phoneNumber"
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
                    <el-button @click="handleSearch" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>             
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20 "
            @selection-change="handleSelectionChange"
            id="text"
       
          >
            <el-table-column prop="id" fixed label="订单号" align="center"  width="100" sortable>
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.id" placement="top">
                                                  <span>{{scope.row.id}}</span>
                                              </el-tooltip>
                                        </template>               
            </el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
            <el-table-column prop="idNo" label="身份证号" align="center" width="180"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="approveAmt" label="审核金额" align="center" sortable widt="100" ></el-table-column>
            <el-table-column prop="updateTime" label="最后催收时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                  <template v-if="scope.row.updateTime">
                    {{scope.row.updateTime|dateServer}}
                  </template>
                </template>
            </el-table-column>
                      <el-table-column prop="result" label="最后催收结果" align="center" width="180">
                        <template slot-scope="scope">
                          <template v-if="scope.row.applyCollectResultStatus">
                                                       <el-tag
                                :type="scope.row.applyCollectResultStatus===1?'success':scope.row.applyCollectResultStatus===2?'danger':scope.row.applyCollectResultStatus===3?'danger':scope.row.applyCollectResultStatus===4?'danger':scope.row.applyCollectResultStatus===5?'danger':scope.row.applyCollectResultStatus===6?'danger':'info'"
                            >{{scope.row.applyCollectResultStatus===1?'承诺还款':scope.row.applyCollectResultStatus===2?'无人接听':scope.row.applyCollectResultStatus===3?'通话中':scope.row.applyCollectResultStatus===4?'空号':scope.row.applyCollectResultStatus===5?'停机':scope.row.applyCollectResultStatus===6?'来电提醒':scope.row.applyCollectResultStatus===8?'正常接听':scope.row.applyCollectResultStatus===9?'拒绝还款':scope.row.applyCollectResultStatus===10?'短信呼':'其他'}}</el-tag> 
                          </template>

                        </template>                         
                      </el-table-column>            
            <el-table-column type="expand" label="更多详情" width="120" >
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
                      <el-table-column   prop="id" label="等级" align="center" width="100">
                        <template slot-scope="scope">
                            <el-tag
                                :type="(scope.row.overdue===null||scope.row.overdue.overdueDay===0||scope.row.overdue.overdueDay===null)?'success':scope.row.overdue.overdueDay <  11 ?'primary':scope.row.status < 21?'info':scope.row.status < 31?'warning':'danger'"
                            >
                            {{(scope.row.overdue===null||scope.row.overdue.overdueDay===0||scope.row.overdue.overdueDay===null)?'无':scope.row.overdue.overdueDay <  11 ?'M1':scope.row.status < 21?'M2':scope.row.status < 31?'M3':'M3+'}}
                            </el-tag>
                        </template> 
                      </el-table-column>
                      <el-table-column prop="id" label="id" align="center" sortable></el-table-column>
                      <el-table-column prop="withdrawMoney" label="实际到账金额" align="center" sortable></el-table-column>
                      <el-table-column prop="raiseMoney" label="提现金额" align="center" sortable></el-table-column>
                      <el-table-column prop="borrowTime" label="提现时间" align="center" sortable width="140">
                        <template slot-scope="scope">
                            {{scope.row.creatime|dateServer}}
                        </template>                          
                      </el-table-column>
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
                      <el-table-column  prop="overdue.lateFee" label="线下还款申请情况" align="center" width="140" >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.loanRepaymentApplyId==1?'success':scope.row.loanRepaymentApplyId==2?'':'danger'"
                            >{{scope.row.loanRepaymentApplyId==1?'处理中':scope.row.loanRepaymentApplyId==2?'申请同意(完结)':scope.row.loanRepaymentApplyId==3?'申请拒绝(完结)':scope.row.loanRepaymentApplyId==4?'催收经理审核中':scope.row.loanRepaymentApplyId==5?'催收经理同意':scope.row.loanRepaymentApplyId==6?'催收经理拒绝':''}}</el-tag>
                        </template>   
                      </el-table-column>
                      <el-table-column prop="cz"  align="center" label="操作"  width="400" >
                          <template slot-scope="scope">
                          <el-button
                              size="mini"
                              v-if="!scope.row.loanRepaymentApplyId"
                              type="success"
                              :disabled="scope.row.status===0?true:scope.row.status===1?false:scope.row.status===2?false:scope.row.status===3?true:scope.row.status===4?true:scope.row.status===5?false:true"
                              @click="handlehk(scope.$index, scope.row)"
                             >还款申请
                             </el-button>
                          <el-button
                              v-if="scope.row.loanRepaymentApplyId==1"
                              size="mini"
                              type="success"
                              :disabled="scope.row.status===0?true:scope.row.status===1?false:scope.row.status===2?false:scope.row.status===3?true:scope.row.status===4?true:scope.row.status===5?false:true"
                              @click="handleXK(scope.$index, scope.row)"
                             >申请修改
                             </el-button>   
                          <el-button
                              size="mini"
                              v-if="scope.row.loanRepaymentApplyId==3||scope.row.loanRepaymentApplyId==6"
                              type="success"
                              :disabled="scope.row.status===0?true:scope.row.status===1?false:scope.row.status===2?false:scope.row.status===3?true:scope.row.status===4?true:scope.row.status===5?false:true"
                              @click="handlehk(scope.$index, scope.row)"
                             >再次申请
                             </el-button>                                                       
                          </template> 
                      </el-table-column> 
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
                      <el-table-column fixed prop="id" label="id" align="center" ></el-table-column>
                      <el-table-column prop="operatorName" label="催收员姓名" align="center" ></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="center" >
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>                              
                            </el-table-column>                      
                      <el-table-column prop="remark" label="描述（备注）" align="center" >
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                                                  <span>{{scope.row.remark}}</span>
                                              </el-tooltip>
                                        </template>                           
                      </el-table-column>
                      <el-table-column prop="result" label="结果" align="center" >
                        <template slot-scope="scope">
                            <template v-if="scope.row.applyCollectResultStatus">
                            <el-tag
                                :type="scope.row.result===1?'success':scope.row.result===2?'danger':scope.row.result===3?'danger':scope.row.result===4?'danger':scope.row.result===5?'danger':scope.row.result===6?'danger':'info'"
                            >{{scope.row.result===1?'承诺还款':scope.row.result===2?'无人接听':scope.row.result===3?'通话中':scope.row.result===4?'空号':scope.row.result===5?'停机':scope.row.result===6?'来电提醒':scope.row.applyCollectResultStatus===8?'正常接听':scope.row.applyCollectResultStatus===9?'拒绝还款':scope.row.applyCollectResultStatus===10?'短信呼':'其他'}}</el-tag>
                        </template>   
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
                <el-table-column prop="cz"  align="center" label="操作"  width="300" >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >添加记录</el-button>
                <el-button type="primary" icon="el-icon-info" @click="examine(scope.row)">查看</el-button>   
                       <el-button type="danger"  :disabled="scope.row.userStatus==1?false:true" @click="handleDongjie(scope.row)">
                         {{scope.row.userStatus==1?'冻结':'已冻结'}}
                         </el-button>                       
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
    </el-tab-pane>
    <el-tab-pane label="已完成催收订单" name="second">
              <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <el-button-group>
                      <el-button :type="execeedtimeType==0?'info':''" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button :type="execeedtimeType==1?'primary':''" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button :type="execeedtimeType==2?'success':''" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button :type="execeedtimeType==3?'warning':''" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button :type="execeedtimeType==4?'danger':''" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>               
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.phoneNumber"
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
          >
    
       
            <el-table-column fixed prop="id" label="订单号" align="center"  width="100" sortable>
                                      <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.id" placement="top">
                                                  <span>{{scope.row.id}}</span>
                                              </el-tooltip>
                                        </template> 
            </el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="100" ></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
            <el-table-column prop="idNo" label="身份证号" align="center" width="180"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="approveAmt" label="审核金额" align="center" width="100" sortable ></el-table-column>
            <el-table-column prop="updateTime" label="最后催收时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                  <template v-if="scope.row.updateTime">
                    {{scope.row.updateTime|dateServer}}
                  </template>
                </template>
            </el-table-column>  
                      <el-table-column prop="result" label="最后催收结果" align="center" >
                        <template slot-scope="scope">
                           <template v-if="scope.row.applyCollectResultStatus">
                            <el-tag
                                :type="scope.row.applyCollectResultStatus===1?'success':scope.row.applyCollectResultStatus===2?'danger':scope.row.applyCollectResultStatus===3?'danger':scope.row.applyCollectResultStatus===4?'danger':scope.row.applyCollectResultStatus===5?'danger':scope.row.applyCollectResultStatus===6?'danger':'info'"
                            >{{scope.row.applyCollectResultStatus===1?'承诺还款':scope.row.applyCollectResultStatus===2?'无人接听':scope.row.applyCollectResultStatus===3?'通话中':scope.row.applyCollectResultStatus===4?'空号':scope.row.applyCollectResultStatus===5?'停机':scope.row.applyCollectResultStatus===6?'来电提醒':scope.row.applyCollectResultStatus===8?'正常接听':scope.row.applyCollectResultStatus===9?'拒绝还款':scope.row.applyCollectResultStatus===10?'短信呼':'其他'}}</el-tag>
                        </template>    
                          </template>                         
                      </el-table-column>                       
            <el-table-column type="expand" label="更多详情" width="120" >
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
                      <el-table-column    prop="id" label="等级" align="center" width="100">
                        <template slot-scope="scope">
                            <el-tag
                                :type="(scope.row.overdue===null||scope.row.overdue.overdueDay===0||scope.row.overdue.overdueDay===null)?'success':scope.row.overdue.overdueDay <  11 ?'primary':scope.row.status < 21?'info':scope.row.status < 31?'warning':'danger'"
                            >
                            {{(scope.row.overdue===null||scope.row.overdue.overdueDay===0||scope.row.overdue.overdueDay===null)?'无':scope.row.overdue.overdueDay <  11 ?'M1':scope.row.status < 21?'M2':scope.row.status < 31?'M3':'M3+'}}
                            </el-tag>
                        </template> 
                      </el-table-column>
                      <el-table-column prop="id" label="id" align="center" sortable></el-table-column>
                      <el-table-column prop="withdrawMoney" label="实际到账金额" align="center" sortable></el-table-column>
                      <el-table-column prop="raiseMoney" label="提现金额" align="center" sortable></el-table-column>
                      <el-table-column prop="borrowTime" label="提现时间" align="center" width="140" sortable>
                        <template slot-scope="scope">
                            {{scope.row.creatime|dateServer}}
                        </template>                          
                      </el-table-column>
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
                      <el-table-column prop="id" fixed label="id" align="center" ></el-table-column>
                      <el-table-column prop="operatorName" label="催收员姓名" align="center" ></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" align="center" >
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>                              
                            </el-table-column>
                      <el-table-column prop="remark" label="描述（备注）" align="center" ></el-table-column>
                      <el-table-column prop="result" label="结果" align="center" >
                        <template slot-scope="scope">
                           <template v-if="scope.row.result">
                            <el-tag
                                :type="scope.row.result===1?'success':scope.row.result===2?'danger':scope.row.result===3?'danger':scope.row.result===4?'danger':scope.row.result===5?'danger':scope.row.result===62?'danger':'info'"
                            >{{scope.row.result===1?'承诺还款':scope.row.result===2?'无人接听':scope.row.result===3?'通话中':scope.row.result===4?'空号':scope.row.result===5?'停机':scope.row.result===6?'来电提醒':scope.row.applyCollectResultStatus===8?'正常接听':scope.row.applyCollectResultStatus===9?'拒绝还款':scope.row.applyCollectResultStatus===10?'短信呼':'其他'}}</el-tag>
                        </template>   
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

                <el-table-column prop="cz"  align="center" label="操作"  width="300" >
                    <template slot-scope="scope">
                       <el-button type="danger"  :disabled="scope.row.userStatus==1?false:true" @click="handleDongjie(scope.row)">
                         {{scope.row.userStatus==1?'冻结':'已冻结'}}
                         </el-button>                       
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
    </el-tab-pane>
  </el-tabs>        
        <!-- <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.phoneNumber"
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
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>        
       
            <el-table-column prop="id" label="订单号" align="center"  sortable></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" ></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" ></el-table-column>
            <el-table-column prop="idNo" label="身份证号" align="center" width="200"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="approveAmt" label="审核金额" align="center" sortable ></el-table-column>
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
                      <el-table-column prop="id" label="id" align="center" sortable></el-table-column>
                      <el-table-column prop="withdrawMoney" label="提现金额" align="center" sortable></el-table-column>
                      <el-table-column prop="borrowTime" label="提现时间" align="center" sortable>
                        <template slot-scope="scope">
                            {{scope.row.borrowTime|dateServer}}
                        </template>                          
                      </el-table-column>
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
                      <el-table-column prop="overdue.overdueDay" label="逾期天数" align="center" sortable></el-table-column>
                      <el-table-column prop="overdue.lateFee" label="违约金" align="center" sortable></el-table-column>
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
            </el-table-column> 
                <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >添加记录</el-button>
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
        </el-row> -->
        <el-dialog
          title="提交还款申请"
          :visible.sync="dialogVisible1"
          center
          width="40%"
          >
            <el-row>  
            <el-form  :model="editForm"  ref="editForm"   label-width="150px" :rules="rules">
                <el-form-item label="提现id：" >
                  <el-input v-model="editForm.withdrawId"    disabled></el-input>
                </el-form-item>
                <el-form-item label="需要还款金额：" >
                  <el-input v-model="editForm.yMoney"   disabled></el-input>
                </el-form-item>                   
                <el-form-item label="申请实际还款金额：" prop="realMoney">
                  <el-input v-model="editForm.realMoney"   placeholder="请输入申请实际还款金额"></el-input>
                </el-form-item>  
                <el-form-item label="请输入还款日期:" prop="time" >
                      <el-date-picker
                        v-model="editForm.time"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                </el-form-item>                    
                <el-form-item>
                  <el-select  v-model="editForm.type" placeholder="请选择还款方式">
                      <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>  
                </el-form-item>
               
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入还款申请备注"
                    v-model="editForm.remark">
                  </el-input>
                </el-form-item>   
              <el-form-item label="是否上传图片">
                <el-switch
                  v-model="editForm.img"
                  active-text="是"
                  inactive-text="否">
                </el-switch>                
              </el-form-item>                                                                                              
                <el-form-item  v-if="editForm.img" label="图片凭证：" >
                 <el-col >
                    <el-upload
                        action="123"
                      class="upload-demo"
                      ref="upload"
                      :limit="1"
                      :on-exceed="handleExceed"
                      :on-change="handleChange"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                      :before-upload="beforeAvatarUpload"
                      list-type="picture"
                      :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                      <div slot="tip" class="el-upload__tip">（必须上传图片，且大小为4M以内），且不超过4M</div>
                    </el-upload>                    
                 </el-col>
                </el-form-item>
                <!-- <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>   -->
                <el-form-item>
                  <el-button type="primary" @click="onAddSubmit('editForm')">提交</el-button>
                  <el-button @click="changeDialog()">取消</el-button>
      
                </el-form-item>                                                                  
            </el-form>              
            </el-row>
        </el-dialog>         
        <el-dialog
          title="添加催收记录"
          :visible.sync="dialogVisible"
          center
          width="40%"
          >
            <div id="elTag">
              <el-alert
                title="订单号"
                type="info"
                :closable="false">
              </el-alert>               
              <el-tag
                >
                {{dynamicTags[0]}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 正确订单号</el-button>   -->
             
            </div>
            <el-row class="m20">
              <el-alert
                title="催收描述"
                type="info"
                :closable="false">
              </el-alert>   
            </el-row>
            <el-input
              class="m20"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入催收描述"
              v-model="textarea">
            </el-input>            
            <el-row class="m20">
              <el-alert
                title="催收结果"
                type="info"
                :closable="false">
              </el-alert>   
            </el-row>
            <el-row class="m20 col-flex" >
              <el-select v-model="trevewer" placeholder="催收结果">
                <el-option
                  v-for="item in trevewerlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>  
              <el-button type="primary" style="margin-left:30px" @click="handleConfig">确认</el-button>
              <el-button type="primary" style="margin-left:30px" @click="dialogVisible=false">取消</el-button>
              <span style="margin-left:20px;font-size:12px;line-height:30px;color:#999">Tips: 必须上传支付凭证</span>
            </el-row>
        </el-dialog>  
            <!-- <el-form  :model="editForm"  ref="editForm"   label-width="150px" :rules="rules">
                <el-form-item label="提现id：" >
                  <el-input v-model="editForm.withdrawId"    disabled></el-input>
                </el-form-item>
                <el-form-item label="需要还款金额：" >
                  <el-input v-model="editForm.yMoney"   disabled></el-input>
                </el-form-item>                   
                <el-form-item label="申请实际还款金额：" prop="realMoney">
                  <el-input v-model="editForm.realMoney"   placeholder="请输入申请实际还款金额"></el-input>
                </el-form-item>   
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入还款申请备注"
                    v-model="editForm.remark">
                  </el-input>
                </el-form-item>                                                                                
                <el-form-item label="图片凭证：" >
                 <el-col >
                    <el-upload
                        action="123"
                      class="upload-demo"
                      ref="upload"
                      :on-change="handleChange"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList2"
                      :before-upload="beforeAvatarUpload"
                      list-type="picture"
                      :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <div slot="tip" class="el-upload__tip">（必须上传图片，且大小为4M以内），且不超过4M</div>
                    </el-upload>                    
                 </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onAddSubmit('editForm')">提交</el-button>
                  <el-button @click="changeDialog()">取消</el-button>
                </el-form-item>                                                                  
            </el-form>                           -->

        <el-dialog
          title="提交还款申请"
          :visible.sync="dialogVisible2"
          center
          width="40%"
          >

            <el-row>  
            <el-form   :model="editForm"  ref="editForm"   label-width="150px" :rules="rules">
                <el-form-item label="提现id：" >
                  <el-input v-model="editForm.withdrawId"    disabled></el-input>
                </el-form-item>
                <el-form-item label="上传申请时间：" >
                  <el-input v-model="editForm.time"    disabled>
                    {{editForm.time | dateServer}}
                  </el-input>
                </el-form-item>                
                <el-form-item label="需要还款金额：" >
                  <el-input v-model="editForm.yMoney"   disabled></el-input>
                </el-form-item>                   
                <el-form-item label="申请实际还款金额：" prop="realMoney">
                  <el-input v-model="editForm.realMoney"   placeholder="请输入申请实际还款金额"></el-input>
                </el-form-item>   
                <el-form-item>
                  <el-select  v-model="editForm.type" placeholder="请选择还款方式">
                      <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>  
                </el-form-item>                
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入还款申请备注"
                    v-model="editForm.remark">
                  </el-input>
                </el-form-item>                                                                                
                <el-form-item label="图片凭证：" >
                 <el-col >
                    <el-upload
                        action="123"
                      class="upload-demo"
                        :limit="1"
                      ref="upload1"
                      :on-exceed="handleExceed"
                      :on-change="handleChange"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                  
                        :before-remove="beforeRemove"
                        :file-list="fileList2"
                      :before-upload="beforeAvatarUpload1"
                      list-type="picture"
                      :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary">重新上传</el-button>
                      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                      <div slot="tip" class="el-upload__tip">（必须上传图片，且大小为4M以内），且不超过4M</div>
                    </el-upload>                    
                 </el-col>
                </el-form-item>
                <!-- <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>   -->
                <el-form-item>
                  <el-button type="primary" @click="onAddSubmit1('editForm')">提交</el-button>
                  <el-button @click="changeDialog()">取消</el-button>
                              <span style="margin-left:20px;font-size:12px;line-height:30px;color:#999">Tips: 必须上传支付凭证</span>
                </el-form-item>                                                                  
            </el-form>              
            </el-row>
        </el-dialog>   
        <el-dialog
                :visible.sync="outerVisible"
              width="90%"
              title="客户信息详情"
              center
            id="text"
         >

            <el-row style="overflow: hidden;">
                <table class="table textContent" >
                    <tr>
                        <th valign="middle" colspan="6" class="bgcolor" style="text-align: center;">
                            客户基本信息
                        </th>
                    </tr>
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">基本信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="customerInformation"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                 <el-table-column fixed prop="chbrealName" align="center" label="姓名"  width="80">
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.chbrealName" placement="top">
                                                  <span>{{scope.row.chbrealName}}</span>
                                              </el-tooltip>
                                        </template>                                       
                                 </el-table-column>
                               <el-table-column prop="chbphoneNumber" align="center" label="手机号"  width="140"></el-table-column>
                                <el-table-column prop="chbidcard" align="center" label="身份证"  width="150"></el-table-column>
                                <el-table-column prop="chbstatus" align="center" label="状态"  width="80">
                          <template slot-scope="scope">
                                                                        <el-tag
                                       :type="scope.row.chbstatus===1?'success':scope.row.chbstatus===2?'danger':''">
                                       {{scope.row.chbstatus===1?'正常':scope.row.chbstatus===2?'冻结':''}}
                                       </el-tag>
                                               </template>  
                                </el-table-column>
                                <el-table-column prop="chbisDel" align="center" label="是否黑名单"  width="100">
                                <template slot-scope="scope">
                                                                        <el-tag
                                       :type="scope.row.chbisDel?'danger':'success'"
                                   >{{scope.row.chbisDel?'是':'否'}}</el-tag>
                                               </template>  
                                </el-table-column>
                                <el-table-column prop="chbdetailAddress" align="center" label="详细地址"  style="  white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;" min-width="100">
            <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.chbdetailAddress" placement="top">
                                                  <span>{{scope.row.chbdetailAddress}}</span>
                                              </el-tooltip>
                                        </template>                                    
                                </el-table-column>
                                <el-table-column prop="chbzmScore" align="center" label="芝麻分"  width="100"></el-table-column>
                                <el-table-column prop="chbwxNumber" align="center" label="微信号"  width="100"></el-table-column>
                                <el-table-column prop="ip" align="center" label="创建时间"  width="140">
                 <template slot-scope="scope">
                                 {{scope.row.chbcreateTime | dateServer}}
                                               </template>  

                                </el-table-column>
                                <el-table-column prop="ip" align="center" label="注册IP"  width="130"></el-table-column>
                                <el-table-column prop="source" align="center"  label="来源" width="80">
                                        <template slot-scope="scope">
                                                                        <el-tag
                                       :type="scope.row.status===1?'':scope.row.status===2?'success':'danger'"
                                   >{{scope.row.status===1?'ios':scope.row.status===2?'android':'h5'}}</el-tag>
                                               </template>                                    
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>   
             <tr>
                        <th  class="bgcolor">钱包信息</th>
                        <td colspan="5" >
                            <el-table
                           
                                    :data="customerInformation"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column  fixed prop="applyAmt"  label="授信额度" align="center"  min-width="140"></el-table-column>
                                <el-table-column prop="approveAmt"  label="审核金额" align="center" min-width="140" ></el-table-column>
                                <el-table-column prop="counts"  label="签到次数" align="center" min-width="140" ></el-table-column>                                
                                <el-table-column prop="lastLoginTime"  label="上次登录时间" align="center" min-width="140">
                                  <template slot-scope="scope" align="center">
                                      {{scope.row.lastLoginTime|dateServer}}
                                  </template>                                    
                                </el-table-column> 
                                <el-table-column prop="joinDate"  label="注册时间" align="center" min-width="140">
                                          <template slot-scope="scope" align="center">
                                              {{scope.row.joinDate|dateServer}}
                                          </template>                                    
                                        </el-table-column>                                                                
                                    </el-table>
                                </td>
                    </tr>                                    
                    <tr>
                        <th  class="bgcolor">认证资料</th>
                        <td colspan="5" >
                          <template v-if="customerInformation[0]" >
                            <el-row  v-for="(imgInfo,index) in customerInformation[0].custIdcardImageList" :key="index">
                                <el-col :span="3" :offset="1">
                                    <template>
                                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                            <img @click="clickImg($event,imgInfo.fullfaceUrl)" :src="imgInfo.fullfaceUrl" class="image">
                                        </el-card>
                                    </template>
                                </el-col>
                               <el-col :span="3"   :offset="1">
                                    <template>
                                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                            <img @click="clickImg($event,imgInfo.reverseStorageUrl)" :src="imgInfo.reverseStorageUrl" class="image">
                                        </el-card>
                                    </template>
                                </el-col>    
                               <el-col :span="3"   :offset="1">
                                    <template>
                                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                            <img @click="clickImg($event,imgInfo.handStorageUrl)" :src="imgInfo.handStorageUrl" class="image">
                                        </el-card>
                                    </template>
                                </el-col>                                                             
                            </el-row>
                          </template>
                        </td>
                    </tr>
                   <tr>
                        <th  class="bgcolor">银行卡信息</th>
                        <td colspan="5" >
                            <el-table
                             v-if="customerInformation[0]"
                                    :data="customerInformation[0].bankCardDTOVoList"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column fixed prop="cardNum"   label="卡号"   align="center" min-width="240" ></el-table-column>
                                <el-table-column prop="name"   label="姓名"   align="center" min-width="100"></el-table-column>
                                <el-table-column prop="name"   label="类型"   align="center" min-width="100">
                                         <template slot-scope="scope">
                                            {{scope.row.cardType==101?'借记卡':'信用卡'}}
                                         </template>
                                </el-table-column>                                
                                <el-table-column prop="bankName"   label="银行"   align="center" min-width="240"></el-table-column>
                                <el-table-column prop="idNum"   label="身份证"   align="center" min-width="240"></el-table-column>
                            </el-table>
                        </td>
                    </tr>              
                 <tr>
                        <th  class="bgcolor "  >滴滴出行信息</th>
                        <td colspan="5" >
                            <template v-if='ddShow&& customerInformation[0]'>
                                <el-table

                                        :data="customerInformation[0].didiOrderVoList.slice(0,5)"
                                        class="textcontent"
                                        border
                                            highlight-current-row style="width: 100%;font-weight:bold">
                                    <el-table-column fixed prop="cityName" align="center" label="城市"  width="100"></el-table-column>
                                    <el-table-column prop="productName" align="center" label="类别"  width="100"></el-table-column>
                                    <el-table-column prop="actualPayFee" align="center"  label="消费记录" width="120"></el-table-column>
                                  <el-table-column prop="fromAddress"  align="center" label="起始地" min-width="200" >
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.fromAddress" placement="top">
                                                  <span>{{scope.row.fromAddress}}</span>
                                              </el-tooltip>
                                        </template>                                     
                                  </el-table-column>
                                    <el-table-column prop="toAddress"  align="center" label="目的地" min-width="200">
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.toAddress" placement="top">
                                                  <span>{{scope.row.toAddress}}</span>
                                              </el-tooltip>
                                        </template>                                       
                                    </el-table-column>
                                    <el-table-column prop="beginTime"  align="center" label="时间" width="160"></el-table-column>
                                </el-table>                          
                            </template>
                            <template v-if='!ddShow&& customerInformation[0]'>
                                <el-table
                                        :data="customerInformation[0].didiOrderVoList"
                                        border
                                            highlight-current-row style="width: 100%;font-weight:bold">
                                    <el-table-column fixed prop="cityName" align="center" label="城市"  width="100"></el-table-column>
                                    <el-table-column prop="productName" align="center" label="类别"  width="100"></el-table-column>
                                    <el-table-column prop="actualPayFee" align="center"  label="消费记录" width="120"></el-table-column>
                                  <el-table-column prop="fromAddress"  align="center" label="起始地" min-width="200" >
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.fromAddress" placement="top">
                                                  <span>{{scope.row.fromAddress}}</span>
                                              </el-tooltip>
                                        </template>                                     
                                  </el-table-column>
                                    <el-table-column prop="toAddress"  align="center" label="目的地" min-width="200">
                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.toAddress" placement="top">
                                                  <span>{{scope.row.toAddress}}</span>
                                              </el-tooltip>
                                        </template>                                       
                                    </el-table-column>
                                    <el-table-column prop="beginTime"  align="center" label="时间" width="160"></el-table-column>
                                </el-table>                          
                            </template>
                            <el-button class="m20" @click="ddShow = !ddShow">{{ddShow?'展开滴滴信息':'收起滴滴信息'}}</el-button>
                        </td>
                    </tr>     
                <tr>
                        <th  class="bgcolor">风控信息</th>
                        <td colspan="5" >
                            <el-table
                             v-if='customerInformation[0]'
                                    :data="customerInformation[0].chbcredit"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column fixed prop="contactsCount"   label="通讯录联系人"   align="center" width="160" >
                                  <template slot-scope="scope" align="center">
                                      <el-button type="primary" @click="checkContacts">数量:{{scope.row.contactsCount}}</el-button>
                                  </template>
                                </el-table-column>
                                <!-- <el-table-column prop="createTime"  label="声音路径" align="center" min-width="160">
                                  <template
                                  slot-scope="scope" align="center"
                                      >
                                      <template v-if="scope.row.voiceUrl != '' && scope.row.voiceUrl!= null">
                                         <audio controls>
                                           <source :src="scope.row.voiceUrl"
                                                   type="audio/mpeg">
                                         </audio>                                        
                                      </template>
                                    </template>                           
                                </el-table-column> -->
                                <el-table-column prop="applyAmt"  label="风控报告" align="center" min-width="160">
                                  <template    slot-scope="scope" align="center">
                                    <el-button :type="'primary'"  @click="viewRiskManagementreport">查看风控报告</el-button>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="applyAmt"  label="审核结果" align="center" min-width="160">
                                  <template    slot-scope="scope" align="center">
                                   <!-- <el-button :type="activename=='three'?'danger':'primary'"  :disabled="activename=='three'"  @click="addResult">添加审核结果</el-button> -->
                                  </template>
                                </el-table-column>                                
                            </el-table>
                        </td>
                    </tr>                                                                
                    <tr>
                        <th  class="bgcolor">备注信息</th>
                        <td colspan="5" >
                            <el-table
                                    v-if="customerInformation[0]"
                                    :data="customerInformation[0].remarkList"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                      <el-table-column
                        prop="createTime"
                         align="center"
                        label="备注时间"
                        fixed
                        width="180">
                          <template slot-scope="scope">
                            {{scope.row.createTime|dateServer}}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="userPosition"
                         align="center"
                        label="职位"
                        width="180">
                          <template slot-scope="scope">
                            {{scope.row.userPosition==1?"审核员":'审核经理'}}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="type"
                         align="center"
                         width="180"
                        label="类型">
                         <template slot-scope="scope">
                            {{scope.row.type==1?"审核员驳回":scope.row.type==2?"审核人员拒绝":scope.row.type==3?"审核经理驳回":scope.row.type==4?"审核经理拒绝":'通过'}}
                        </template>                      
                      </el-table-column>
                      <el-table-column
                        prop="userName"
                         align="center"
                         width="180"
                        label="姓名">
                      </el-table-column>
                      <el-table-column
                        prop="remake"
                         align="center"
                         min-width="180"
                        label="备注">
                                     <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.remake" placement="top">
                                                  <span>{{scope.row.remake}}</span>
                                              </el-tooltip>
                                        </template>                            
                      </el-table-column>                             
                            </el-table>
                        </td>
                    </tr>
                </table>
            </el-row> 
            <el-dialog
              id="dialog"
              width="80%"
              top="100px"
              title="照片信息"
              :visible.sync="innerImgVisible"
              append-to-body>
       
                    <template>
                      <el-card  :body-style="{ padding: '0px' }"  shadow="never">
                          <img  :src="imgSrc" class="imgCenter">
                      </el-card>
                    </template>
            </el-dialog>   
            <el-dialog
              width="30%"
              title="通讯录"
              :visible.sync="contactList"
              append-to-body>

              <el-table :data="contacs" border height="400">
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="mobile" label="号码" align="center"></el-table-column>
              </el-table>

            </el-dialog> 
        <el-dialog
          id="report"
          width="70%"
          title="风控报告"
          :visible.sync="CreditReport"
          append-to-body
         >
          <el-tabs v-model="activeName1" @tab-click="handleClick1">
            <el-tab-pane label="芝麻信用报告" name="first" v-if="false">芝麻信用报告</el-tab-pane>
            <el-tab-pane label="同盾信用报告" name="second">
              <el-row v-if="JSON.stringify(baseInfo) !== '{}'">
                <el-row class="flx">
                  <div class="fl">
                    贷前审核报告报告编号: <span>{{baseInfo.baseInfo.reportNum}}</span>
                  </div>
                  <div class="fr">
                    报告时间:<span>{{new Date() |dateServer}}</span>
                  </div>
                </el-row>
                <el-row>
                  <el-card>
                    <el-col :span="6" :offset="2">
                      <div>
                        <div class="progress-text">
                          <strong>{{baseInfo.baseInfo.score}}</strong>
                          <p>{{baseInfo.baseInfo.suggestion == 1?'建议拒绝':(baseInfo.baseInfo.suggestion ==
                            2?'建议人工审核':'建议通过')}}</p>
                        </div>
                        <el-progress type="circle"
                                     :percentage="baseInfo.baseInfo.score>100 ?99 : baseInfo.baseInfo.score" color="red"
                                     :show-text="showText">aaaaa
                        </el-progress>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <el-row style="text-align:center;padding-top:30px">
                        <strong style="font-size:20px">
                          {{baseInfo.baseInfo.suggestion == 1?'申请用户测出高危风险建议拒绝':(baseInfo.baseInfo.suggestion ==
                          2?'申请用户测出风险建议人工审核':'申请用户建议通过')}}
                        </strong>
                        <br/><span>
                            <!-- 共发现15条异常信息 -->
                           </span>
                      </el-row>
                    </el-col>
                  </el-card>
                </el-row>
                <el-row style="margin-top:20px" v-if="baseInfo.contactInfo.length>0">
                  <el-card>
                    <el-row>
                      <h3>个人基本信息</h3>
                    </el-row>
                    <el-row style="margin-top:20px">
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="5">
                            姓名：
                          </el-col>
                          <el-col :span="6">
                            {{baseInfo.baseInfo.realName}}
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="5">
                            身份证号：
                          </el-col>
                          <el-col :span="6">
                            {{baseInfo.baseInfo.idNum}}
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-row>
                          <el-col :span="5">
                            手机号码：
                          </el-col>
                          <el-col :span="6">
                            {{baseInfo.baseInfo.phoneNum}}
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top:20px" v-if="baseInfo.contactInfo.length==2">
                      <el-col :span="8">
                        <el-row>
                          <h3>第一个联系人</h3>
                        </el-row>
                        <el-row style="margin-top:20px">
                          <el-col :span="8">
                            姓名：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[0].contactName}}
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                            手机号码：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[0].contactPhone}}
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                            社会关系：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[0].relationShip==1?'直系':(baseInfo.contactInfo[0].relationShip==2?'非直系':'社会')}}
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="8">
                        <el-row>
                          <h3>第二个联系人</h3>
                        </el-row>
                        <el-row style="margin-top:20px">
                          <el-col :span="8">
                            姓名：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[1].contactName}}
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                            手机号码：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[1].contactPhone}}
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                            社会关系：
                          </el-col>
                          <el-col :span="12">
                            {{baseInfo.contactInfo[1].relationShip==1?'直系':(baseInfo.contactInfo[1].relationShip==2?'非直系':'社会')}}
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-row>
                <el-row style="margin-top:20px">
                  <el-card>
                    <el-row>
                      <h3>归属地解析</h3>
                    </el-row>
                    <el-row style="margin-top:20px">
                      <el-col :span="5">
                        身份证所属地地址:
                      </el-col>
                      <el-col :span="12">
                        {{baseInfo.baseInfo.idCardAddress}}
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="5">
                        手机所属地地址:
                      </el-col>
                      <el-col :span="12">
                        {{baseInfo.baseInfo.phoneAddress}}
                      </el-col>
                    </el-row>
                  </el-card>
                </el-row>
                <el-row style="margin-top:20px">
                  <el-card>
                    <table class="check-table" style="border-collapse: collapse">
                      <thead style="text-align:center">
                      <tr>
                        <th style="width: 15%;">&nbsp;</th>
                        <th class="row1" style="width: 37%;">检查项目</th>
                        <th class="row2 " style="width: 9%;">风险等级</th>
                        <th class="row3" style="width: 37%;">备注</th>
                      </tr>
                      </thead>
                      <tbody style="text-align:center">
                      <template v-for="(temp,index) in baseInfo.actionInfo">
                        <tr :key="temp.riskName"
                            v-bind:class="{ borderBottom1: index != baseInfo.actionInfo.length-1,borderBottom2: index == baseInfo.actionInfo.length-1 }">

                          <td :rowspan="baseInfo.actionInfo.length" v-if="index==0">客户行为检测</td>
                          <td class="risk-item-name">{{temp.riskName}}</td>
                          <td class="risk-item-level">
                            {{temp.riskLevel==1?'低':(temp.riskLevel==2?'中':'高')}}
                          </td>
                          <td v-if="temp.reportDetail.length>0">
                            <span><a href="javascript:void(0)" style="color: #2ea5ff;text-decoration: blink;">频度规则详情</a></span>
                            <ul class="risk-detail-list">
                              <span
                                v-if="temp.reportDetail[0].detail != undefined">{{temp.reportDetail[0].detail}}</span>
                              <li>
                                <span>{{temp.reportDetail[0].data}}</span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </template>
                      <template v-for="(temp,index1) in baseInfo.platFormInfo">
                        <tr :key="temp.riskName"
                            v-bind:class="{ borderBottom1: index1 != baseInfo.platFormInfo.length-1,borderBottom2: index1 == baseInfo.platFormInfo.length-1 }">
                          <td :rowspan="baseInfo.platFormInfo.length" v-if="index1==0">多平台借贷申请检测</td>
                          <td class="risk-item-name">{{temp.riskName}}</td>
                          <td class="risk-item-level">
                            {{temp.riskLevel==1?'低':(temp.riskLevel==2?'中':'高')}}
                          </td>
                          <td>
                            <span>总数{{temp.dimenonReports.length}}</span><br/>
                            <span><a href="javascript:void(0)" style="color: #2ea5ff;text-decoration: blink;">频度规则详情</a></span>
                            <ul class="risk-detail-list">
                              <li v-for="(tem ) in temp.dimenonReports" :key="tem.id">
                                <span>{{tem.dimension}}</span>
                                <ul>
                                  <li v-for="(te) in tem.displayReportDOS" :key="te.displayName"
                                      style="margin-left:20px">
                                    {{te.dimension}}
                                    {{te.displayName}}&nbsp;&nbsp;{{te.count}}
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </template>
                      <template v-for="(temp,index1) in baseInfo.badInfo">
                        <tr :key="temp.riskName"
                            v-bind:class="{ borderBottom1: index1 != baseInfo.platFormInfo.length-1,borderBottom2: index1 == baseInfo.platFormInfo.length-1 }">
                          <td :rowspan="baseInfo.platFormInfo.length" v-if="index1==0">不良信息扫描</td>
                          <td class="risk-item-name">{{temp.riskName}}</td>
                          <td class="risk-item-level">
                            {{temp.riskLevel==1?'低':(temp.riskLevel==2?'中':'高')}}
                          </td>
                          <td>
                            <span style="color:red">风险类型：{{temp.riskContent}}</span>
                          </td>
                        </tr>
                      </template>

                      </tbody>
                    </table>
                  </el-card>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="运营商信用报告" name="third">
              <el-row v-if="userBasicInformation">
                <el-main id="subOutputRank-print">
                  <el-row v-show="false">
                    <canvas id="myCanvas" width="200" height="230">
                    </canvas>
                  </el-row>
                  <el-row style="padding-top:0;position:relative;">
                    <el-row id="bg" style="width:100%;height:100%;position:absolute;top:0;left:0;zIndex:9999;display:none"
                          >
                      <div>

                      </div>
                    </el-row>
                    <el-row class="report_t">
                      <div class="el-main-info l">
                        <span>报告编号：201805241119371288237</span>
                      </div>
                      <div class="el-main-info r">
                        <span>报告生成时间：{{new Date() |dateServer}} 11:19:37</span>
                      </div>

                    </el-row>
                    <el-row>
                      <h1 style="text-align:center">
                        互联网资信报告
                      </h1>
                    </el-row>
                    <el-card class="el-card">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>用户基本信息</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <table cellpadding="0" cellspacing="0" class="table">
                        <tbody>
                        <tr>
                          <td>
                            <span class="item">姓名</span>
                            <span>{{userBasicInformation.name}}</span>
                            <span>{{userBasicInformation.gender?'男':'女'}}</span>
                            <span>{{userBasicInformation.age}}</span>
                            <span>{{userBasicInformation.province}}</span>
                            <span>{{userBasicInformation.city}}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span class="item">身份证</span>
                            <span>{{userBasicInformation.idcard}}</span>
                            <el-tag :type="userBasicInformation.financialBlacklist?'danger':'success'">
                              {{userBasicInformation.financialBlacklist?'在金融机构黑名单':'不在金融机构黑名单'}}
                            </el-tag>
                            <el-tag :type="userBasicInformation.courtBlacklist?'danger':'success'">
                              {{userBasicInformation.courtBlacklist?'在法院黑名单':'不在法院黑名单'}}
                            </el-tag>
                            <!-- <span class="tip_y"></span> -->

                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span class="item">手机号</span>
                            <span>{{userBasicInformation.cellPhone}}</span>
                            <span>{{userBasicInformation.cellLoc}}</span>
                            <span>注册时间：</span>
                            <span>{{userBasicInformation.regTime |  dateServer}}</span>
                            <!-- <span class="tip_y"></span> -->
                            <!-- <span class="remarks">用户姓名与运营商提供的姓名[张国军]匹配成功</span> -->
                            <!-- <span class="remarks"></span> -->
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </el-card>
                    <!-- 亲属联系人信息 -->
                    <el-card class="el-card" v-if="kinsfolkTableData.length>0">
                      <!--  -->
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>亲属联系人信息</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="kinsfolkTableData">
                        <el-table-column prop="relationshipType" label="关系" width="140">
                          <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.relationshipType ==1?'直系':'非直系' }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="phonenume" label="手机号">
                        </el-table-column>
                        <el-table-column prop="callMessage" label="说明">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 用户信息检测 -->
                    <el-card class="el-card" v-if="userInfo.id">
                      <!-- v-if="userInfo.id" -->
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>用户信息检测</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <table cellpadding="0" cellspacing="0" class="table">
                        <tbody>
                        <tr>
                          <th width="100" rowspan="9"> 用户信息查询</th>
                          <td width="220"> 查询过该用户的相关企业数量</td>
                          <td><span>{{userInfo.searchedOrgCnt}}</span></td>
                        </tr>
                        <tr>
                          <td> 查询过该用户的相关企业类型</td>
                          <td>
                            {{userInfo.searchedOrgType}}
                          </td>
                        </tr>
                        <tr>
                          <td> 身份证组合过的其他姓名</td>
                          <td>
                            {{userInfo.phoneWithOtherNames}}

                          </td>
                        </tr>
                        <tr>
                          <td> 身份证组合过其他电话</td>
                          <td>
                            {{userInfo.idcardWithOtherPhones}}
                          </td>
                        </tr>
                        <tr>
                          <td> 电话号码组合过其他姓名</td>
                          <td>
                            {{userInfo.idcardWithOtherNames}}
                          </td>
                        </tr>
                        <tr>
                          <td> 电话号码组合过其他身份证</td>
                          <td>
                            {{userInfo.phoneWithOtherIdcards}}
                          </td>
                        </tr>
                        <tr>
                          <td> 电话号码注册过的相关企业数量</td>
                          <td>
                            {{userInfo.registerOrgCnt}}
                          </td>
                        </tr>
                        <tr>
                          <td> 电话号码注册过的相关企业类型</td>
                          <td>
                            {{userInfo.registerOrgType}}
                          </td>
                        </tr>
                        <tr>
                          <td> 电话号码出现过的公开网站</td>
                          <td>
                            {{userInfo.arisedOpenWeb}}
                          </td>
                        </tr>
                        </tbody>
                        <tbody>
                        <tr>
                          <th width="100" rowspan="6">黑名单信息</th>
                          <td>黑中介分数</td>
                          <td>
                            <span>{{userInfo.phoneGrayScore}}</span>
                            （分数范围0-100，参考分为10，分数越低关系越紧密）
                          </td>
                        </tr>
                        <tr>
                          <td> 直接联系人中黑名单数</td>
                          <td>
                            <span>{{userInfo.contactsClass1BlacklistCnt}}</span>
                            (直接联系人：和被查询号码有通话记录)
                          </td>
                        </tr>
                        <tr>
                          <td> 间接联系人中黑名单人数</td>
                          <td>
                            <span>{{userInfo.contactsClass2BlacklistCnt}}</span>
                            (间接联系人：和被查询号码的直接联系人有通话记录)
                          </td>
                        </tr>
                        <tr>
                          <td> 直接联系人人数</td>
                          <td>
                            <span>{{userInfo.contactsClass1Cnt}}</span>
                            (直接联系人：和被查询号码有通话记录)
                          </td>
                        </tr>
                        <tr>
                          <td> 引起黑名单的直接联系人数量</td>
                          <td>
                            <span>{{userInfo.contactsRouterCnt}}</span>
                            (直接联系人有和黑名单用户的通讯记录的号码数量)
                          </td>
                        </tr>
                        <tr>
                          <td> 直接联系人中引起间接黑名单占比</td>
                          <td>
                            <span>{{userInfo.contactsRouterRatio}}</span>
                            (直接联系人有和黑名单用户的通讯记录的号码数量在直接联系人数量中的百分比)
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </el-card>
                    <!-- 用户行为检测 -->
                    <el-card class="el-card" v-if="testTableData.length>0">
                      <!-- v-if="testTableData.length>0" -->
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>用户行为检测</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="testTableData">
                        <el-table-column prop="checkPointCn" label="检测项目">
                        </el-table-column>
                        <el-table-column prop="result" label="结果">
                        </el-table-column>
                        <el-table-column prop="evidence" label="依据">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 运营商消费数据               -->
                    <el-card class="el-card" v-if="operatorTableData.length>0">
                      <!--  -->
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>运营商消费数据</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="operatorTableData">
                        <el-table-column prop="cellOperatorZh" align="center" min-width="80" label="运行商">
                        </el-table-column>
                      
                        <el-table-column prop="cellPhoneNum"  align="center" min-width="120" label="号码">
                        </el-table-column>
                        <el-table-column prop="cellLoc" align="center" width="80" label="归属地">
                        </el-table-column>
                        <el-table-column prop="cellMth" align="center" min-width="80" label="月份">
                        </el-table-column>
                        <el-table-column prop="callOutCnt" align="center" min-width="80" label="主叫次数">
                        </el-table-column>
                        <el-table-column prop="callOutTime" align="center" min-width="80" label="主叫时间">
                        </el-table-column>
                        <el-table-column prop="callInCnt" align="center" min-width="80" label="被叫次数">
                        </el-table-column>
                        <el-table-column prop="callInTime" align="center" min-width="80" label="被叫时间">
                        </el-table-column>
                        <el-table-column prop="netFlow" align="center" min-width="80" label="流量消费">
                        </el-table-column>
                        <el-table-column prop="totalAmount" align="center"  min-width="80" label="话费消费">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 联系人区域汇总                  -->
                    <el-card class="el-card" v-if="linkmanTableData.length>0">
                      <!--  -->
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>联系人区域汇总 </h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <template v-if="lxrShow">
                        <el-table :data="linkmanTableData.slice(0,5)">
                          <el-table-column prop="regionLoc" align="center" width="80" label="地区">
                          </el-table-column>
                          <el-table-column prop="regionUniqNumCnt" align="center" width="80"  label="号码次数">
                          </el-table-column>
                          <el-table-column prop="regionCallInCnt" align="center" width="80"  label="呼入次数">
                          </el-table-column>
                          <el-table-column prop="regionCallOutCnt" align="center" width="80"  label="呼出次数">
                          </el-table-column>
                          <el-table-column prop="regionAvgCallInTime" align="center" min-width="80"  label="呼入时间">
                          </el-table-column>
                          <el-table-column prop="regionAvgCallOutTime" align="center" min-width="80"  label="呼出时间">
                          </el-table-column>
                          <el-table-column prop="regionCallInCntPct" align="center" min-width="80"  label="呼入次数比">
                          </el-table-column>
                          <el-table-column prop="regionCallOutCntPct" align="center" min-width="80"  label="呼出次数比">
                          </el-table-column>
                          <el-table-column prop="regionCallInTimePct" align="center" min-width="80"  label="呼入时间比">
                          </el-table-column>
                          <el-table-column prop="regionCallOutTimePct" align="center" min-width="80"  label="呼出时间比">
                          </el-table-column>
                        </el-table>                      
                      </template>
                      <template v-if="!lxrShow">
                        <el-table :data="linkmanTableData">
                          <el-table-column prop="regionLoc" align="center" width="80" label="地区">
                          </el-table-column>
                          <el-table-column prop="regionUniqNumCnt" align="center" width="80"  label="号码次数">
                          </el-table-column>
                          <el-table-column prop="regionCallInCnt" align="center" width="80"  label="呼入次数">
                          </el-table-column>
                          <el-table-column prop="regionCallOutCnt" align="center" width="80"  label="呼出次数">
                          </el-table-column>
                          <el-table-column prop="regionAvgCallInTime" align="center" min-width="80"  label="呼入时间">
                          </el-table-column>
                          <el-table-column prop="regionAvgCallOutTime" align="center" min-width="80"  label="呼出时间">
                          </el-table-column>
                          <el-table-column prop="regionCallInCntPct" align="center" min-width="80"  label="呼入次数比">
                          </el-table-column>
                          <el-table-column prop="regionCallOutCntPct" align="center" min-width="80"  label="呼出次数比">
                          </el-table-column>
                          <el-table-column prop="regionCallInTimePct" align="center" min-width="80"  label="呼入时间比">
                          </el-table-column>
                          <el-table-column prop="regionCallOutTimePct" align="center" min-width="80"  label="呼出时间比">
                          </el-table-column>
                        </el-table>                      
                      </template>                      
                        <el-button class="m20" @click="lxrShow = !lxrShow">{{lxrShow?'展开联系人区域汇总':'收起联系人区域汇总'}}</el-button>
                    </el-card>
                    <!-- 运营商数据分析                   -->
                    <el-card class="el-card" v-if="operatorDataTableData.length>0">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>运营商数据分析 </h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <template v-if="yysShow">
                          <el-table :data="operatorDataTableData.slice(0,5)" >
                            <el-table-column prop="phoneNum" align="center" width="120" label="号码" >
                            </el-table-column>
                            <el-table-column prop="user" width="120" align="center" label="姓名">
                                <template slot-scope="scope">
                                      <el-tooltip class="item" effect="dark" :content="scope.row.user" placement="top">
                                          <span>{{scope.row.user}}</span>
                                      </el-tooltip>
                                </template>                            
                            </el-table-column>                          
                            <el-table-column prop="phoneNumLoc" align="center" width="80" label="归属地">
                            </el-table-column>
                            <!-- <el-table-column prop="gist" label="通话次数">
                            </el-table-column>
                            <el-table-column prop="gist" label="通话时间(分)">
                            </el-table-column> -->
                            <el-table-column prop="callOutCnt" align="center" min-width="100" label="主叫次数" sortable>
                            </el-table-column>
                            <el-table-column prop="callInCnt" align="center" min-width="100" label="被叫次数" sortable>
                            </el-table-column>
                            <el-table-column prop="contactHoliday" align="center" min-width="110" label="节假日通话次数">
                            </el-table-column>
                            <el-table-column prop="contactWeekend" align="center" min-width="100" label="周末通话次数">
                            </el-table-column>
                            <el-table-column prop="contactWeekday" align="center"  min-width="110" label="工作日通话次数">
                            </el-table-column>
                            <el-table-column prop="contact1w" align="center" min-width="110"  label="一周内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact1m" align="center" min-width="110" label="一月内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact3m" align="center" min-width="110" label="三月内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact3mPlus" align="center" min-width="110" label="三月外通话次数">
                            </el-table-column>
                          </el-table>                        
                      </template>
                      <template v-if="!yysShow">
                          <el-table :data="operatorDataTableData" >
                            <el-table-column prop="phoneNum" align="center" width="120" label="号码" >
                            </el-table-column>
                            <el-table-column prop="user" width="120" align="center" label="姓名">
                                <template slot-scope="scope">
                                      <el-tooltip class="item" effect="dark" :content="scope.row.user" placement="top">
                                          <span>{{scope.row.user}}</span>
                                      </el-tooltip>
                                </template>                            
                            </el-table-column>                          
                            <el-table-column prop="phoneNumLoc" align="center" width="80" label="归属地">
                            </el-table-column>
                            <!-- <el-table-column prop="gist" label="通话次数">
                            </el-table-column>
                            <el-table-column prop="gist" label="通话时间(分)">
                            </el-table-column> -->
                            <el-table-column prop="callOutCnt" align="center" min-width="100" label="主叫次数" sortable>
                            </el-table-column>
                            <el-table-column prop="callInCnt" align="center" min-width="100" label="被叫次数" sortable>
                            </el-table-column>
                            <el-table-column prop="contactHoliday" align="center" min-width="110" label="节假日通话次数">
                            </el-table-column>
                            <el-table-column prop="contactWeekend" align="center" min-width="100" label="周末通话次数">
                            </el-table-column>
                            <el-table-column prop="contactWeekday" align="center"  min-width="110" label="工作日通话次数">
                            </el-table-column>
                            <el-table-column prop="contact1w" align="center" min-width="110"  label="一周内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact1m" align="center" min-width="110" label="一月内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact3m" align="center" min-width="110" label="三月内通话次数">
                            </el-table-column>
                            <el-table-column prop="contact3mPlus" align="center" min-width="110" label="三月外通话次数">
                            </el-table-column>
                          </el-table>                        
                      </template>                      
                          <el-button class="m20" @click="yysShow = !yysShow">{{yysShow?'展开运营商数据分析':'收起运营商数据分析'}}</el-button>
                    </el-card>
                    <!-- 联系人信息                  -->
                    <el-card class="el-card" v-if="contactTableData.length>0">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>联系人信息 </h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="contactTableData">
                        <el-table-column prop="testItem" label="联系人">
                        </el-table-column>
                        <el-table-column prop="result" label="最早联系时间">
                        </el-table-column>
                        <el-table-column prop="gist" label="最晚联系时间">
                        </el-table-column>
                        <el-table-column prop="gist" label="联系电话">
                        </el-table-column>
                        <el-table-column prop="gist" label="号码归属地">
                        </el-table-column>
                        <el-table-column prop="gist" label="通话时长">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 电商地址信息                  -->
                    <el-card class="el-card" v-if="esAddTableData.length>0">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>电商地址信息 </h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="esAddTableData">
                        <el-table-column prop="testItem" label="地址">
                        </el-table-column>
                        <el-table-column prop="result" label="	总消费金额">
                        </el-table-column>
                        <el-table-column prop="gist" label="收货人姓名">
                        </el-table-column>
                        <el-table-column prop="gist" label="收货人手机">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 电商数据分析                  -->
                    <el-card class="el-card" v-if="esDataTableData.length>0">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>电商数据分析</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="esDataTableData">
                        <el-table-column prop="testItem" label="月份">
                        </el-table-column>
                        <el-table-column prop="result" label="消费次数">
                        </el-table-column>
                        <el-table-column prop="gist" label="消费金额">
                        </el-table-column>
                        <el-table-column prop="gist" label="品类分析">
                        </el-table-column>
                      </el-table>
                    </el-card>
                    <!-- 出行数据分析                 -->
                    <el-card class="el-card" v-if="tripTableData.length>0">
                      <div class="clearfix">
                        <div class="panel_title">
                          <h2>出行数据分析</h2>
                          <div class="line"></div>
                        </div>
                      </div>
                      <el-table :data="tripTableData">
                        <el-table-column prop="testItem" label="时间段">
                        </el-table-column>
                        <el-table-column prop="result" label="出发时间">
                        </el-table-column>
                        <el-table-column prop="gist" label="回程时间">
                        </el-table-column>
                        <el-table-column prop="gist" label="出发地">
                        </el-table-column>
                        <el-table-column prop="gist" label="目的地">
                        </el-table-column>
                      </el-table>
                    </el-card>
                  </el-row>
                </el-main>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>   
        </el-dialog>                 
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import {
  getExec,
  httpExeceedtimeapplydetail,
  httpGetrevewerlist,
  execeedtimeDistribute,
  getAddcollectdetail,
  getOfflinePaymentapplydetail,
  getOfflinePaymentapplyUpdata,
  httpGetCreditReport,
  httpGetCustomterMesage,
  httpUpdateCuster,
  httpOfflinePaymentapply
} from "../../../service/http";
import Timer from "../../../config/timer";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value <= 0 || isNaN(value)) {
        callback(new Error("请输入大于0的数且不为汉字或字符"));
      } else {
        // this.$refs.editForm.validateField("realMoney");
      }
      callback();
    };
    return {
      imgAdd: true,
      dialogVisible2: false,
      fileList2: [],
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        time: [{ required: true, message: "请填写还款时间", trigger: "blur" }],
        title: [
          { required: true, message: "请选择电销人员", trigger: "change" }
        ],
        realMoney: [
          { required: true, validator: validatePass, trigger: "change" }
        ],
        type: [{ required: true, message: "请选择还款方式", trigger: "change" }]
        // recallType: [
        //   { required: true, message: "请选择类型", trigger: "change" }
        // ]
      },
      editForm: {
        upload: null,
        realMoney: "",
        withdrawId: "",
        remark: "",
        num: ""
      },
      dialogVisible1: false,
      lodings: false,
      distributionStatus: 2,
      activeName: "first",
      textarea: "",
      search: {
        textarea: "",
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
      tableData: [],
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
      trevewerlist: [
        { label: "承诺还款", value: 1 },
        { label: "无人接听", value: 2 },
        { label: "通话中", value: 3 },
        { label: "空号", value: 4 },
        { label: "停机", value: 5 },
        { label: "来电提醒", value: 6 },
        { label: "其他", value: 7 },
        { label: "正常接听", value: 8 },
        { label: "拒绝还款", value: 9 },
        { label: "短信呼", value: 10 },        
      ],
      types: [{ label: "线下", value: 1 }, { label: "线上", value: 2 }],
      trevewer: null,
      multipleSelection: [],
      index: 0,
      //客户信息详情表
      customerInformation: [],
      ddShow: false,
      outerVisible: false,
      innerImgVisible: false,
      imgSrc: "",
      approveResult: false,
      contactList: false,
      contacs: [], // 通讯录列表
      //查看风控报告
      yysShow: false,
      lxrShow: false,
      CreditReport: false,
      baseInfo: {},
      userBasicInformation: {}, //用户基本信息检测用户基本信息检测
      userInfo: {},
      kinsfolkTableData: [], //亲属联系人
      testTableData: [],
      operatorTableData: [], //运营商消费数据
      linkmanTableData: [], //联系人区域汇总
      operatorDataTableData: [], //运行商数据分析
      contactTableData: [], //联系人信息
      esAddTableData: [], //电商信息
      esDataTableData: [], //电商数据统计
      tripTableData: [],
      listId: null,
      showText: false,
      applyStatus: null,
      activeName1: "three"
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
    getData(
      loginId,
      npage,
      pagesize,
      begainTimeString,
      endTimeString,
      phoneNumber,
      execeedtimeType,
      distributionStatus
    ) {
      let _this = this;
      getExec(
        loginId,
        npage,
        pagesize,
        begainTimeString,
        endTimeString,
        phoneNumber,
        execeedtimeType,
        distributionStatus
      )
        .then(res => {
          let data = res.data;
          let tableData = data.list;

          for (let a = 0; a < data.list.length; a++) {
            httpExeceedtimeapplydetail(data.list[a].id)
              .then(re => {
                tableData[a].detail = re.data;
              })
              .catch();
          }
          _this.tableData = tableData;
          _this.total = data.allsize;
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
        if (this.execeedtimeType == 0) {
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + " 00:00:00",
            this.search.phoneNumber,
            "",
            this.distributionStatus
          );
        } else {
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            this.search.time[0] + " 00:00:00",
            timeFormat(this.search.time[1], 1) + " 00:00:00",
            this.search.phoneNumber,
            this.execeedtimeType,
            this.distributionStatus
          );
        }
      } else {
        if (this.execeedtimeType == 0) {
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            "",
            "",
            this.search.phoneNumber,
            "",
            this.distributionStatus
          );
        } else {
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            "",
            "",
            this.search.phoneNumber,
            this.execeedtimeType,
            this.distributionStatus
          );
        }
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
      this.npage = 1;
      this.pagesize = 10;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAllocation(index, row) {
      this.dialogVisible = true;
      this.trevewer = null;
      this.dynamicTags.length = 0;
      this.dynamicTags.push(row.id);
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // getrevewerlist() {
    //   httpGetrevewerlist()
    //     .then(res => {
    //       let data = res.data;
    //       this.trevewerlist = data;
    //     })
    //     .catch(err => {
    //       this.$message.error("催收员列表获取失败请刷新页面或联系客服");
    //     });
    // },
    handleConfig() {
      let _this = this;
      if (this.textarea !== "" && this.trevewer) {
        getAddcollectdetail(this.dynamicTags[0], this.textarea, this.trevewer)
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "催收记录添加成",
                type: "success"
              });
              this.getData(
                this.loginId,
                this.npage,
                this.pagesize,
                "",
                "",
                "",
                "",
                this.distributionStatus
              );
            } else {
              this.$message.error("催收描述和催收结果不能为空");
            }
          })
          .catch(err => {
            this.$message.error("催收描述和催收结果不能为空");
          });
      } else {
        this.$message.error("催收描述和催收结果不能为空");
      }
      this.dialogVisible = false;
      this.textarea = "";
      this.trevewer = null;

      // if (this.trevewer) {
      //   execeedtimeDistribute(
      //     this.dynamicTags.length == 1
      //       ? this.dynamicTags[0] + ","
      //       : this.dynamicTags.join(","),
      //     this.trevewer
      //   )
      //     .then(res => {
      //       if (res.data.code == 200) {
      //         this.$message({
      //           message: "分配成功",
      //           type: "success"
      //         });
      //         _this.dialogVisible = false;
      //         _this.getData(
      //           this.npage,
      //           this.pagesize,
      //           "",
      //           "",
      //           "",
      //           "",
      //           this.distributionStatus
      //         );
      //       }
      //     })
      //     .catch(err => {
      //       this.$message.error("催收员必须存在");
      //     });
      // } else {
      //   this.$message.error("催收员必须存在");
      // }
    },
    handelConfigAll() {
      this.dynamicTags.length = 0;
      for (var temp of this.multipleSelection) {
        this.dynamicTags.push(temp.id);
      }
      this.dialogVisible = true;
    },
    filterStauts(value, row) {
      return row.status === value;
    },
    handleClick1() {},
    handleClick(tab, event) {
      tab.name === "second"
        ? (this.distributionStatus = 1)
        : (this.distributionStatus = 2);
      this.lodings = true;
      this.getData(
        this.loginId,
        this.npage,
        this.pagesize,
        "",
        "",
        "",
        "",
        this.distributionStatus
      );
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    },
    handlehk(index, row) {
      console.log(JSON.stringify(row));
      this.editForm.withdrawId = row.id;
      this.editForm.yMoney = row.overdue
        ? Number(row.raiseMoney) + Number(row.overdue.lateFee)
        : Number(row.raiseMoney);

      this.dialogVisible1 = true;
    },
    handleXK(index, row) {
      let id = row.id;
      let _this = this;
      this.editForm.withdrawId = row.id;
      this.editForm.yMoney = row.overdue
        ? Number(row.raiseMoney) + Number(row.overdue.lateFee)
        : Number(row.raiseMoney);
      getOfflinePaymentapplydetail(id)
        .then(res => {
          let data = res.data.data;
          _this.editForm.realMoney = data.realMoney;
          _this.editForm.remark = data.remark;
          _this.editForm.time = data.createtime;
          _this.editForm.urlRemark = data.urlRemark;
          _this.fileList2 = [
            {
              name: "凭证照片",
              url: data.urlRemark
            }
          ];

          _this.dialogVisible2 = true;
        })
        .catch();
    },
    beforeAvatarUpload(file) {
      //将文件 的所有的内容都添加在这一起上传
      let fd = new FormData();
      fd.append("upload", file);
      fd.append("loginId", this.loginId);
      let reduceMoney =
        Number(this.editForm.yMoney) - Number(this.editForm.realMoney);
      fd.append("reduceMoney", Number(reduceMoney));
      fd.append("realMoney", Number(this.editForm.realMoney)); //其他参数
      fd.append("withdrawId", Number(this.editForm.withdrawId)); //其他参数
      fd.append("realRepaymentTimeString", this.editForm.time); //其他参数
      // fd.append("discountAmt", Number(this.editForm.discountAmt)); //其他参数
      // fd.append("mustPayBackAmt", Number(this.editForm.mustPayBackAmt)); //其他参数
      // fd.append("actualPayBackAmt", Number(this.editForm.actualPayBackAmt)); //其他参数
      fd.append("remark_collect", this.editForm.remark); //其他参数
      fd.append("repayment_type", this.editForm.type);
      // console.log(fd);
      // const isJPG = /image\/\w+/.test(file.type);
      // const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isJPG) {
      //   this.$message.error("必须上传图片!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 4MB!");
      // }
      // return isJPG && isLt2M;
      const isJPG = /image\/\w+/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (!file) {
        this.$message.error("请上传图片");
      }
      // this.$message({
      //   message: "申请提交成功等待审核",
      //   type: "success"
      // });

      this.resetForm("editForm");
      axios
        .post("/sys/offlinePaymentapply", fd, {})
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "申请提交成功等待审核",
              type: "success"
            });
          } else {
            this.$message.error(data.msg);
          }
          this.dialogVisible1 = false;
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            "",
            "",
            "",
            "",
            this.distributionStatus
          );
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
      return isJPG && isLt2M;
    },
    onAddSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editForm.img) {
            this.$refs.upload.submit();
          } else {
            let reduceMoney =
              Number(this.editForm.yMoney) - Number(this.editForm.realMoney);
            httpOfflinePaymentapply(
              this.loginId,
              reduceMoney,
              this.editForm.realMoney,
              this.editForm.withdrawId,
              this.editForm.time,
              this.editForm.remark,
              this.editForm.type
            )
              .then(res => {
                let data = res.data;
                if (data.code == 200) {
                  this.$message({
                    message: "申请提交成功等待审核",
                    type: "success"
                  });
                } else {
                  this.$message.error(data.msg);
                }
                this.dialogVisible1 = false;
                this.getData(
                  this.loginId,
                  this.npage,
                  this.pagesize,
                  "",
                  "",
                  "",
                  "",
                  this.distributionStatus
                );
              })
              .catch(err => {
                this.$message.error("网络错误，请联系管理员");
              });
          }
        } else {
          return false;
        }
      });
    },

    onAddSubmit1(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (_this.imgAdd) {
            getOfflinePaymentapplyUpdata(
              _this.editForm.realMoney,
              _this.editForm.urlRemark,
              _this.editForm.withdrawId,
              _this.editForm.remark
            )
              .then(res => {
                _this.dialogVisible2 = false;
                _this.resetForm("editForm");
                _this.imgAdd = true;
                this.getData(
                  this.loginId,
                  this.npage,
                  this.pagesize,
                  "",
                  "",
                  "",
                  "",
                  this.distributionStatus
                );
              })
              .catch();
          } else {
            this.$refs.upload1.submit();
          }
        } else {
          return false;
        }
      });
    },
    beforeAvatarUpload1(file) {
      //将文件 的所有的内容都添加在这一起上传
      let fd = new FormData();
      fd.append("upload", file);
      fd.append("loginId", this.loginId);
      let reduceMoney =
        Number(this.editForm.yMoney) - Number(this.editForm.realMoney);
      fd.append("reduceMoney", Number(reduceMoney));
      fd.append("realMoney", Number(this.editForm.realMoney)); //其他参数
      fd.append("withdrawId", Number(this.editForm.withdrawId)); //其他参数
      // fd.append("discountAmt", Number(this.editForm.discountAmt)); //其他参数
      // fd.append("mustPayBackAmt", Number(this.editForm.mustPayBackAmt)); //其他参数
      // fd.append("actualPayBackAmt", Number(this.editForm.actualPayBackAmt)); //其他参数
      fd.append("remark_collect", this.editForm.remark); //其他参数
      fd.append("repayment_type", this.editForm.type); //其他参数
      // console.log(fd);
      // const isJPG = /image\/\w+/.test(file.type);
      // const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isJPG) {
      //   this.$message.error("必须上传图片!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 4MB!");
      // }
      // return isJPG && isLt2M;
      const isJPG = /image\/\w+/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (!file) {
        this.$message.error("请上传图片");
      }
      // this.$message({
      //   message: "申请提交成功等待审核",
      //   type: "success"
      // });

      axios
        .post("/sys/offlinePaymentapplyupdate", fd, {})
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "申请提交成功等待审核",
              type: "success"
            });
          } else {
            this.$message.error(data.msg);
          }
          this.dialogVisible2 = false;
          this.resetForm("editForm");
          this.imgAdd = true;
          this.getData(
            this.loginId,
            this.npage,
            this.pagesize,
            "",
            "",
            "",
            "",
            this.distributionStatus
          );
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
      return isJPG && isLt2M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      this.imgAdd = false;
      this.$message.error("必须上传图片凭证");
    },
    handlePreview(file) {},
    handleChange(file, fileList) {},
    changeDialog() {
      this.dialogVisible = false;
      this.resetForm("editForm");
    },
    examine(row) {
      this._httpGetCustomterMesage(row.id);
      this.listId = Number(row.id);
      this.approveResult = row.approveResult ? true : false;
    },
    _httpGetCustomterMesage(id) {
      this.customerInformation = [];
      httpGetCustomterMesage(id)
        .then(res => {
          let data = res.data;
          this.ddShow = true;
          this.customerInformation.push(data);
          this.customerInformation[0].chbrealName =
            data.custUserDOList.realName;
          this.customerInformation[0].chbphoneNumber =
            data.custUserDOList.phoneNumber;
          this.customerInformation[0].chbidcard = data.custUserDOList.idcard;
          this.customerInformation[0].chbstatus = data.custUserDOList.status;
          this.customerInformation[0].chbisDel = data.custUserDOList.isDel;
          this.customerInformation[0].chbdetailAddress =
            data.custUserDOList.detailAddress;
          this.customerInformation[0].chbzmScore = data.custUserDOList.zmScore;
          this.customerInformation[0].chbwxNumber =
            data.custUserDOList.wxNumber;
          this.customerInformation[0].chbcreateTime =
            data.custUserDOList.createTime;
          this.customerInformation[0].joinDate = data.custUserDOList.createTime;

          this.customerInformation[0].joinDate = data.credit.custMobileList;
          this.customerInformation[0].joinDate = data.custUserDOList.createTime;
          this.customerInformation[0].chbcredit = [];
          this.customerInformation[0].chbcredit.push(data.credit);
          this.contacs = data.credit.custMobileList; // 通讯录信息
          this.outerVisible = true;
        })
        .catch();
    },
    clickImg(e, src) {
      this.innerImgVisible = true;
      // 获取当前图片地址
      this.imgSrc = src;
    },
    checkContacts() {
      this.contactList = true;
    },
    // 查看风控报告
    viewRiskManagementreport() {
      this.yysShow = true;
      this.lxrShow = true;

      httpGetCreditReport(this.listId)
        .then(res => {
          let data = res.data;
          if (data.tdReport) {
            this.baseInfo = data.tdReport;
          }
          if (data.mifengreport) {
            let date = data.mifengreport;
            this.userBasicInformation = date.mifengreportApplicationCheck;
            this.testTableData = date.list1;
            this.operatorTableData = date.list2;
            this.kinsfolkTableData = date.list6;

            this.linkmanTableData = date.list4;
            this.operatorDataTableData = date.list3;
            this.userInfo = date.mifengreportUserInfoCheck;
            this.operatorDataTableData.forEach(v => {
              if (this.contacs) {
                this.contacs.forEach(s => {
                  if (s.mobile == v.phoneNum) v.user = s.name;
                });
              }
            });
            this.operatorDataTableData.sort((a, b) => {
              return b.callOutCnt - a.callOutCnt;
            });
          }
          this.CreditReport = true;
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    handleDongjie(row) {
      let CustUserId = row.userId;
      let _this = this;
      this.$confirm("此操作将永久冻结该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          httpUpdateCuster(this.loginId, CustUserId)
            .then(res => {
              let data = res.data;
              if (data.success) {
                this.$message({
                  type: "success",
                  message: data.messager
                });
              } else {
                this.$message.error(data.messager);
              }
              _this.handleSearch();
            })
            .catch(err => {
              let data = err.data;
              this.$message.error(data.messager);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.getData(
      this.loginId,
      this.npage,
      this.pagesize,
      "",
      "",
      "",
      "",
      this.distributionStatus
    );
  }
};
</script>
<style>
.bgcolor {
  color: #436eee;
  background-color: #f3f3f3;
}
#elTag .el-tag {
  margin-top: 20px;
}
#elTag .el-tag + .el-tag {
  margin-left: 10px;
}
#elTag .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
#elTag .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
#text .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
#dialog .el-dialog__header {
  display: none;
}
#dialog .el-dialog {
  padding: 0;
  background: rgba(0, 0, 0, 0);
}
#dialog .el-dialog__body {
  padding: 0;
  background: rgba(0, 0, 0, 0.1);
}
#dialog .el-card__body {
  background: rgba(0, 0, 0, 0.1);
}
#dialog .el-card {
  background: rgba(0, 0, 0, 0.1);
  border: none;
}
.imgCenter {
  clear: both;
  display: block;
  margin: auto;
}
</style>
<style>
#text .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
#dialog .el-dialog__header {
  display: none;
}
#dialog .el-dialog {
  padding: 0;
  background: rgba(0, 0, 0, 0);
}
#dialog .el-dialog__body {
  padding: 0;
  background: rgba(0, 0, 0, 0.1);
}
#dialog .el-card__body {
  background: rgba(0, 0, 0, 0.1);
}
#dialog .el-card {
  background: rgba(0, 0, 0, 0.1);
  border: none;
}
.imgCenter {
  clear: both;
  display: block;
  margin: auto;
}
</style>

<style scoped>
.table {
  border: double 3px #555;
  margin: 5px auto;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
}
.table tr th,
.table tr td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}

#text .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 180px;
  display: block;
  cursor: pointer;
}
#report .title {
  padding: 10px;
  font-weight: bold;
  font-size: 18px;
  width: 100%;
}

#report .input-width {
  width: 215px;
}

#report .flx {
  width: 85%;
  top: 0px;
  padding-top: 10px;
  overflow: hidden;
  line-height: 30px;
}

#report .fl {
  float: left;

  font-size: 24px;
  font-weight: bold;
}

#report .fl span {
  font-size: 12px;
  font-weight: normal;
}

#report .fr {
  float: right;
  font-size: 12px;
}

#report .bar {
  position: relative;
  width: 50%;
  display: inline-block;
}

#report .progress-text {
  position: absolute;
  text-align: center;
  font-size: 32px;
  line-height: 126px;
  width: 126px;
  height: 126px;
}

#report .progress-text p {
  width: 100%;
  position: absolute;
  top: 80px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

#report .table {
  border-spacing: 2px;
  border-color: grey;
  font-size: 13px;
  padding-left: 20px;
  width: 100%;
  display: table;
  border-collapse: collapse;
  border: none;
}

#report thead tr {
  border-bottom: 2px solid #eaeaea;
}

#report th {
  padding-left: 10px;
  height: 36px;
  text-align: left;
}

.row1,
.row2,
.row3 {
  width: 30%;
}

#report .borderBottom1 {
  border-bottom: 1px solid #eaeaea;
}

#report .borderBottom2 {
  border-bottom: 1px solid #eaeaea;
}

#report .risk-detail-list {
  margin-left: 40px;
}

ul,
li {
  list-style: none;
}

#report .check-table {
  width: 100%;
}
.panel_title {
  margin-bottom: 10px;
  border-radius: 10px;
  position: relative;
  height: 40px;
  text-align: center;
}
#report .table span {
  margin-right: 20px;
  display: inline-block;
}
.panel_title h2 {
  height: 30px;
  line-height: 30px;
  display: inline-block;
  background: #e88f08;
  color: #fff;
  border-radius: 100px;
  padding: 0;
  margin: 0;
  font-size: 16px;
  position: absolute;
  z-index: 99;
  width: 200px;
  left: 50%;
  margin-left: -100px;
}

.line {
  background: #e88f08;
  height: 4px;
  top: 13px;
  position: absolute;
  width: 100%;
  border-radius: 10px;
}
</style>
