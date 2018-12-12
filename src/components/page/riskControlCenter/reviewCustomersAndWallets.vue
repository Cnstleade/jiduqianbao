<template>
    <div class="container">
        <el-row>
            <el-alert
              title="审核订单池"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>
        <el-tabs type="border-card" v-model="activename" class="m20" @tab-click="handleClick">
        <el-row class="m20" >
            <el-col   class="col-flex-end">
                    <el-button  type="primary" @click="reset">重置</el-button>
                <div class="l20">
                    <el-input
                    style="padding:0px 10px 0px 0px"
                      placeholder="请输入姓名"
                      v-model="search.username"
                      clearable>
                    </el-input> 
                </div>   
                <div class="l20">
                    <el-input
                    style="padding:0px 10px 0px 0px"
                      placeholder="请输入身份证"
                      v-model="search.idcard"
                      clearable>
                    </el-input> 
                </div>   
                <div class="l20" v-if="activename=='first'"> 
                  <el-select v-model="search.assessor" placeholder="请选择审核员">
                    <template v-for="item in assessorList">
                      <el-option  :key="item.uid" :label="item.username" :value="item.username"></el-option>
                    </template>
                  </el-select>
                </div>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.phone"
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
            <el-tab-pane label="全部" name="first">
            </el-tab-pane>
            <el-tab-pane label="已通过" name="second"></el-tab-pane>
            <el-tab-pane label="未通过" name="three"></el-tab-pane>
                <el-table
                    :data="tableData"  
                    border  
                    class="m20"
                    v-loading="loading"
                         highlight-current-row style="width: 100%;font-weight:bold"
                  >
                <el-table-column prop="id" fixed label="ID" align="center" width="80"></el-table-column>
                    <el-table-column prop="userName" label="姓名" align="center" width="80"></el-table-column>
                    <el-table-column label="审核人" align="center" width="80">
                      <template slot-scope="scope">
                        <div v-if="scope.row.operatorName === ''|| scope.row.operatorName === null">
                          未分配
                          <!-- <el-button type="info" size="mini" @click="allotOperator(scope.row)">分配</el-button> -->
                        </div>
                        <span v-else>
                          {{scope.row.operatorName}}
                        </span>
                      </template>
                    </el-table-column>                    
                    <el-table-column label="来源" align="center" width="60">
                      <template slot-scope="scope">
                        <span>
                          {{scope.row.source==='1'?'IOS':scope.row.source==='2'?'Android':'线上'}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="idNo" label="身份证号" align="center" width="150"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
                    <!--<el-table-column prop="mobileDetails" label="手机详情" align="center"></el-table-column>-->
                    <el-table-column label="贷款状态" align="center" width="120">
                      <template slot-scope="scope">
                        <span>
              {{scope.row.status===0?'重申中'
              :scope.row.status===1?'审核中'
              :scope.row.status===2?'拒绝'
              :scope.row.status===3?'通过审核'
              :scope.row.status===4?'借款中'
               :scope.row.status===5?'审核员驳回'
                :scope.row.status===6?'用户重新提交'
              :scope.row.status===7?'还款':'完结'}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="applyAmt" label="申请金额" align="center" width="80"></el-table-column>
                    <el-table-column prop="approveAmt" label="通过金额" align="center" width="80"></el-table-column>
                    <el-table-column label="审核结果" align="center" width="140">
                      <template slot-scope="scope">
                        <el-tag
                          :type="scope.row.approveResult ===1?''
                                :scope.row.approveResult===2?'danger'
                                :scope.row.approveResult===3?'success'
                                :scope.row.approveResult===4?'warning':'info'">
                          {{scope.row.approveResult ===1?'自动审核通过'
                          :scope.row.approveResult===2?'自动审核不通过'
                          :scope.row.approveResult===3?'人工审核通过'
                          :scope.row.approveResult===4?'人工审核不通过':'大数据风控中'}}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="approverName" label="审核经理" align="center" width="80"></el-table-column>

                    <el-table-column label="订单状态" align="center" width="140">
                      <template slot-scope="scope">
                        <span>
                          {{scope.row.applyStatus ===0?'初始'
                          :scope.row.applyStatus===1?'审核员审核中'
                          :scope.row.applyStatus===2?'审核经理审核中'
                          :scope.row.applyStatus===3?'审核订单重申中'
                          :scope.row.applyStatus===4?'高风险用户':'审核完成'}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="applyTime" label="申请时间" align="center" 
                                     width="150">
                         <template slot-scope="scope">
                    {{scope.row.applyTime|dateServer}}
                </template>                                        
                                     </el-table-column>
                    <el-table-column prop="channel" label="渠道" align="center" width="100"></el-table-column>
                    <el-table-column label="操作" align="center" min-width="100" >
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-info" @click="examine(scope.row)">查看</el-button>
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
                                 <el-table-column prop="chbrealName"  fixed align="center" label="姓名"  width="80">
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
                                <el-table-column prop="applyAmt" fixed  label="授信额度" align="center"  min-width="140"></el-table-column>
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
                                <el-table-column prop="cardNum" fixed   label="卡号"   align="center" min-width="240" ></el-table-column>
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
                                    <el-table-column prop="cityName" fixed align="center" label="城市"  width="100"></el-table-column>
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
                                    <el-table-column prop="cityName" fixed align="center" label="城市"  width="100"></el-table-column>
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
                                <el-table-column prop="contactsCount" fixed   label="通讯录联系人"   align="center" width="160" >
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
                                    <el-button :type="approveResult?'primary':'danger'" :disabled="!approveResult" @click="viewRiskManagementreport">查看风控报告</el-button>
                                  </template>
                                </el-table-column>
                                <el-table-column prop="applyAmt"  label="黑名单" align="center" min-width="160">
                                  <template    slot-scope="scope" align="center">
                                    <el-button type="primary"  @click="viewBlackList()">查看黑名单</el-button>
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
          <el-tabs v-model="activeName" @tab-click="handleClick">
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
        <el-dialog
          width="90%"
          title="黑名单"
          :visible.sync=" blackListVisible"
          append-to-body
          center
        >
          <table class="table textContent">
                    <!-- <tr>
                        <th valign="middle" colspan="6" class="bgcolor" style="text-align: center;">
                            客户基本信息
                        </th>
                    </tr> -->
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">百融</th>
                        <td colspan="5" v-if="brReport">
                            <el-table
                                v-if="brReport"
                                    :data="brReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                               </template>                                   
                               </el-table-column>
                                <el-table-column align="center" label="摘要"  min-width="150">
                                      <template slot-scope="scope">
<el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_court_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_court_bad_time==0?'primary':''">通过身份证号查询法院失信人距今时间
    {{scope.row.blackListBaiRongVo.sl_id_court_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_time==0?'本人直接命中':''}}
</el-tag>     
                                        
                                                     <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_court_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_court_bad_time==0?'primary':''">通过身份证号查询法院失信人距今时间
    {{scope.row.blackListBaiRongVo.sl_id_court_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_executed_time"
    :type="scope.row.blackListBaiRongVo.sl_id_court_executed_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_executed_time==1?'info':scope.row.blackListBaiRongVo.sl_id_court_executed_time==0?'primary':''">通过身份证号查询法院被执行人距今时间
    {{scope.row.blackListBaiRongVo.sl_id_court_executed_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bad_info_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bad_info_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bad_info_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bad_info_time==0?'primary':''">通过身份证查询公安信息异常距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bad_info_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_bad_time==0?'primary':''">通过身份证号查询银行(含信用卡)中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==0?'primary':''">通过身份证号查询银行(含信用卡)一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==0?'primary':''">通过身份证号查询银行(含信用卡)资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_lost_time==0?'primary':''">通过身份证号查询银行(含信用卡)高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==0?'primary':''">通过身份证号查询银行(含信用卡)拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==0?'primary':''">通过身份证号查询非银(含全部非银类型)中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==0?'primary':''">通过身份证号查询非银(含全部非银类型)一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==0?'primary':''">通过身份证号查询非银(含全部非银类型)资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==0?'primary':''">通过身份证号查询非银(含全部非银类型)高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==0?'primary':''">通过身份证号查询非银(含全部非银类型)拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==0?'primary':''">通过身份证号查询非银-持牌网络小贷中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==0?'primary':''">通过身份证号查询非银-持牌网络小贷一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==0?'primary':''">通过身份证号查询非银-持牌网络小贷资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==0?'primary':''">通过身份证号查询非银-持牌网络小贷高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==0?'primary':''">通过身份证号查询非银-持牌网络小贷拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==0?'primary':''">通过身份证号查询非银-持牌小贷中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==0?'primary':''">通过身份证号查询非银-持牌小贷一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==0?'primary':''">通过身份证号查询非银-持牌小贷资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==0?'primary':''">通过身份证号查询非银-持牌小贷高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==0?'primary':''">通过身份证号查询非银-持牌小贷拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==0?'primary':''">通过身份证号查询非银-持牌消费金融中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==0?'primary':''">通过身份证号查询非银-持牌消费金融一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==0?'primary':''">通过身份证号查询非银-持牌消费金融资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==0?'primary':''">通过身份证号查询非银-持牌消费金融高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==0?'primary':''">通过身份证号查询非银-持牌消费金融拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==0?'primary':''">通过身份证号查询非银-持牌融资租赁中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==0?'primary':''">通过身份证号查询非银-持牌融资租赁一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==0?'primary':''">通过身份证号查询非银-持牌融资租赁资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==0?'primary':''">通过身份证号查询非银-持牌融资租赁高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==0?'primary':''">通过身份证号查询非银-持牌融资租赁拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==0?'primary':''">通过身份证号查询非银-持牌汽车金融中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==0?'primary':''">通过身份证号查询非银-持牌汽车金融一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==0?'primary':''">通过身份证号查询非银-持牌汽车金融资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==0?'primary':''">通过身份证号查询非银-持牌汽车金融高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==0?'primary':''">通过身份证号查询非银-持牌汽车金融拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==0?'primary':''">通过身份证号查询非银-其他中风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==0?'primary':''">通过身份证号查询非银-其他一般风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==0?'primary':''">通过身份证号查询非银-其他资信不佳距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==0?'primary':''">通过身份证号查询非银-其他高风险距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==0?'primary':''">通过身份证号查询非银-其他拒绝距今时间
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_time==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==0?'primary':''">通过身份证号查询法院失信人命中次数
    {{scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_executed_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==0?'primary':''">通过身份证号查询法院被执行人命中次数
    {{scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bad_info_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==0?'primary':''">通过身份证查询公安信息异常命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==0?'primary':''">通过身份证号查询银行(含信用卡)中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==0?'primary':''">通过身份证号查询银行(含信用卡)一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==0?'primary':''">通过身份证号查询银行(含信用卡)资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==0?'primary':''">通过身份证号查询银行(含信用卡)高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==0?'primary':''">通过身份证号查询银行(含信用卡)拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==0?'primary':''">通过身份证号查询非银(含全部非银类型)中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==0?'primary':''">通过身份证号查询非银(含全部非银类型)一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==0?'primary':''">通过身份证号查询非银(含全部非银类型)资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==0?'primary':''">通过身份证号查询非银(含全部非银类型)高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==0?'primary':''">通过身份证号查询非银(含全部非银类型)拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==0?'primary':''">通过身份证号查询非银-持牌网络小贷中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==0?'primary':''">通过身份证号查询非银-持牌网络小贷一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==0?'primary':''">通过身份证号查询非银-持牌网络小贷资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==0?'primary':''">通过身份证号查询非银-持牌网络小贷高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==0?'primary':''">通过身份证号查询非银-持牌网络小贷拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==0?'primary':''">通过身份证号查询非银-持牌小贷中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==0?'primary':''">通过身份证号查询非银-持牌小贷一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==0?'primary':''">通过身份证号查询非银-持牌小贷资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==0?'primary':''">通过身份证号查询非银-持牌小贷高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==0?'primary':''">通过身份证号查询非银-持牌小贷拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==0?'primary':''">通过身份证号查询非银-持牌消费金融中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==0?'primary':''">通过身份证号查询非银-持牌消费金融一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==0?'primary':''">通过身份证号查询非银-持牌消费金融资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==0?'primary':''">通过身份证号查询非银-持牌消费金融高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==0?'primary':''">通过身份证号查询非银-持牌消费金融拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==0?'primary':''">通过身份证号查询非银-持牌融资租赁中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==0?'primary':''">通过身份证号查询非银-持牌融资租赁一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==0?'primary':''">通过身份证号查询非银-持牌融资租赁资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==0?'primary':''">通过身份证号查询非银-持牌融资租赁高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==0?'primary':''">通过身份证号查询非银-持牌融资租赁拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==0?'primary':''">通过身份证号查询非银-持牌汽车金融中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==0?'primary':''">通过身份证号查询非银-持牌汽车金融一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==0?'primary':''">通过身份证号查询非银-持牌汽车金融资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==0?'primary':''">通过身份证号查询非银-持牌汽车金融高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==0?'primary':''">通过身份证号查询非银-持牌汽车金融拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==0?'primary':''">通过身份证号查询非银-其他中风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==0?'primary':''">通过身份证号查询非银-其他一般风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==0?'primary':''">通过身份证号查询非银-其他资信不佳命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==0?'primary':''">通过身份证号查询非银-其他高风险命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==0?'primary':''">通过身份证号查询非银-其他拒绝命中次数
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse_allnum==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_court_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_court_bad==0?'primary':''">通过身份证号查询法院失信人
    {{scope.row.blackListBaiRongVo.sl_id_court_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_court_executed"
    :type="scope.row.blackListBaiRongVo.sl_id_court_executed==2?'danger':scope.row.blackListBaiRongVo.sl_id_court_executed==1?'info':scope.row.blackListBaiRongVo.sl_id_court_executed==0?'primary':''">通过身份证号查询法院被执行人
    {{scope.row.blackListBaiRongVo.sl_id_court_executed==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_court_executed==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bad_info"
    :type="scope.row.blackListBaiRongVo.sl_id_bad_info==2?'danger':scope.row.blackListBaiRongVo.sl_id_bad_info==1?'info':scope.row.blackListBaiRongVo.sl_id_bad_info==0?'primary':''">通过身份证查询公安信息异常
    {{scope.row.blackListBaiRongVo.sl_id_bad_info==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bad_info==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_bad==0?'primary':''">通过身份证号查询银行(含信用卡)中风险
    {{scope.row.blackListBaiRongVo.sl_id_bank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_overdue==0?'primary':''">通过身份证号查询银行(含信用卡)一般风险
    {{scope.row.blackListBaiRongVo.sl_id_bank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_fraud==0?'primary':''">通过身份证号查询银行(含信用卡)资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_bank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_lost==0?'primary':''">通过身份证号查询银行(含信用卡)高风险
    {{scope.row.blackListBaiRongVo.sl_id_bank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_bank_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_bank_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_bank_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_bank_refuse==0?'primary':''">通过身份证号查询银行(含信用卡)拒绝
    {{scope.row.blackListBaiRongVo.sl_id_bank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_bank_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_bad==0?'primary':''">通过身份证号查询非银(含全部非银类型)中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_overdue==0?'primary':''">通过身份证号查询非银(含全部非银类型)一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_fraud==0?'primary':''">通过身份证号查询非银(含全部非银类型)资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_lost==0?'primary':''">通过身份证号查询非银(含全部非银类型)高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_refuse==0?'primary':''">通过身份证号查询非银(含全部非银类型)拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==0?'primary':''">通过身份证号查询非银-持牌网络小贷中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==0?'primary':''">通过身份证号查询非银-持牌网络小贷一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==0?'primary':''">通过身份证号查询非银-持牌网络小贷资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==0?'primary':''">通过身份证号查询非银-持牌网络小贷高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==0?'primary':''">通过身份证号查询非银-持牌网络小贷拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_nsloan_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==0?'primary':''">通过身份证号查询非银-持牌小贷中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==0?'primary':''">通过身份证号查询非银-持牌小贷一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==0?'primary':''">通过身份证号查询非银-持牌小贷资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==0?'primary':''">通过身份证号查询非银-持牌小贷高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==0?'primary':''">通过身份证号查询非银-持牌小贷拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_sloan_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==0?'primary':''">通过身份证号查询非银-持牌消费金融中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==0?'primary':''">通过身份证号查询非银-持牌消费金融一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==0?'primary':''">通过身份证号查询非银-持牌消费金融资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==0?'primary':''">通过身份证号查询非银-持牌消费金融高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==0?'primary':''">通过身份证号查询非银-持牌消费金融拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_cons_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==0?'primary':''">通过身份证号查询非银-持牌融资租赁中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==0?'primary':''">通过身份证号查询非银-持牌融资租赁一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==0?'primary':''">通过身份证号查询非银-持牌融资租赁资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==0?'primary':''">通过身份证号查询非银-持牌融资租赁高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==0?'primary':''">通过身份证号查询非银-持牌融资租赁拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_finlea_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==0?'primary':''">通过身份证号查询非银-持牌汽车金融中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==0?'primary':''">通过身份证号查询非银-持牌汽车金融一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==0?'primary':''">通过身份证号查询非银-持牌汽车金融资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==0?'primary':''">通过身份证号查询非银-持牌汽车金融高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_lost==0?'本人直接命中':''}}
</el-tag>                
                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==0?'primary':''">通过身份证号查询非银-持牌汽车金融拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_autofin_refuse==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==0?'primary':''">通过身份证号查询非银-其他中风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_bad==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==0?'primary':''">通过身份证号查询非银-其他一般风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_overdue==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==0?'primary':''">通过身份证号查询非银-其他资信不佳
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_fraud==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==0?'primary':''">通过身份证号查询非银-其他高风险
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_lost==0?'本人直接命中':''}}
</el-tag>                                            <el-tag
    v-if="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse"
    :type="scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==2?'danger':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==1?'info':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==0?'primary':''">通过身份证号查询非银-其他拒绝
    {{scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.sl_id_nbank_other_refuse==0?'本人直接命中':''}}
</el-tag>     
   <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==0?'primary':''">通过联系人手机查询银行(含信用卡)中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_time==0?'本人直接命中':''}}
  </el-tag>  
      <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==0?'primary':''">通过联系人手机查询银行(含信用卡)一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==0?'primary':''">通过联系人手机查询银行(含信用卡)资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==0?'primary':''">通过联系人手机查询银行(含信用卡)高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==0?'primary':''">通过联系人手机查询银行(含信用卡)拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==0?'primary':''">通过联系人手机号查询非银-持牌小贷中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==0?'primary':''">通过联系人手机号查询非银-持牌小贷一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==0?'primary':''">通过联系人手机号查询非银-持牌小贷资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==0?'primary':''">通过联系人手机号查询非银-持牌小贷高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==0?'primary':''">通过联系人手机号查询非银-持牌小贷拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==0?'primary':''">通过联系人手机号查询非银-持牌消费金融中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==0?'primary':''">通过联系人手机号查询非银-持牌消费金融一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==0?'primary':''">通过联系人手机号查询非银-持牌消费金融资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==0?'primary':''">通过联系人手机号查询非银-持牌消费金融高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==0?'primary':''">通过联系人手机号查询非银-持牌消费金融拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==0?'primary':''">通过联系人手机查询非银-其他中风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==0?'primary':''">通过联系人手机查询非银-其他一般风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==0?'primary':''">通过联系人手机查询非银-其他资信不佳距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==0?'primary':''">通过联系人手机查询非银-其他高风险距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==0?'primary':''">通过联系人手机查询非银-其他拒绝距今时间
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==0?'primary':''">通过联系人手机查询银行(含信用卡)中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==0?'primary':''">通过联系人手机查询银行(含信用卡)一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==0?'primary':''">通过联系人手机查询银行(含信用卡)资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==0?'primary':''">通过联系人手机查询银行(含信用卡)高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==0?'primary':''">通过联系人手机查询银行(含信用卡)拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==0?'primary':''">通过联系人手机号查询非银-持牌小贷中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==0?'primary':''">通过联系人手机号查询非银-持牌小贷一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==0?'primary':''">通过联系人手机号查询非银-持牌小贷资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==0?'primary':''">通过联系人手机号查询非银-持牌小贷高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==0?'primary':''">通过联系人手机号查询非银-持牌小贷拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==0?'primary':''">通过联系人手机号查询非银-持牌消费金融中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==0?'primary':''">通过联系人手机号查询非银-持牌消费金融一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==0?'primary':''">通过联系人手机号查询非银-持牌消费金融资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==0?'primary':''">通过联系人手机号查询非银-持牌消费金融高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==0?'primary':''">通过联系人手机号查询非银-持牌消费金融拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==0?'primary':''">通过联系人手机查询非银-其他中风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==0?'primary':''">通过联系人手机查询非银-其他一般风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==0?'primary':''">通过联系人手机查询非银-其他资信不佳命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==0?'primary':''">通过联系人手机查询非银-其他高风险命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==0?'primary':''">通过联系人手机查询非银-其他拒绝命中次数
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==0?'primary':''">通过联系人手机查询银行(含信用卡)中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==0?'primary':''">通过联系人手机查询银行(含信用卡)一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==0?'primary':''">通过联系人手机查询银行(含信用卡)资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==0?'primary':''">通过联系人手机查询银行(含信用卡)高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==0?'primary':''">通过联系人手机查询银行(含信用卡)拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_bank_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==0?'primary':''">通过联系人手机号查询非银(含全部非银类型)拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==0?'primary':''">通过联系人手机号查询非银-持牌网络小贷拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_nsloan_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==0?'primary':''">通过联系人手机号查询非银-持牌小贷中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==0?'primary':''">通过联系人手机号查询非银-持牌小贷一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==0?'primary':''">通过联系人手机号查询非银-持牌小贷资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==0?'primary':''">通过联系人手机号查询非银-持牌小贷高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==0?'primary':''">通过联系人手机号查询非银-持牌小贷拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_sloan_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==0?'primary':''">通过联系人手机号查询非银-持牌消费金融中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==0?'primary':''">通过联系人手机号查询非银-持牌消费金融一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==0?'primary':''">通过联系人手机号查询非银-持牌消费金融资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==0?'primary':''">通过联系人手机号查询非银-持牌消费金融高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==0?'primary':''">通过联系人手机号查询非银-持牌消费金融拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_cons_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==0?'primary':''">通过联系人手机号查询非银-持牌融资租赁拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_finlea_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==0?'primary':''">通过联系人手机号查询非银-持牌汽车金融拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_autofin_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==0?'primary':''">通过联系人手机查询非银-其他中风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==0?'primary':''">通过联系人手机查询非银-其他一般风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==0?'primary':''">通过联系人手机查询非银-其他资信不佳
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==0?'primary':''">通过联系人手机查询非银-其他高风险
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==0?'primary':''">通过联系人手机查询非银-其他拒绝
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_lm.sl_lm_cell_nbank_other_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_time==0?'本人直接命中':''}}
  </el-tag>    
    <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_nsloan_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_sloan_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_cons_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_finlea_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_autofin_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_nbank_other_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_allnum==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_bad_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_overdue_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_fraud_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_lost_time==0?'本人直接命中':''}}
  </el-tag>         <el-tag
      v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time"
      :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==0?'primary':''">null
      {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell.sl_cell_bank_refuse_time==0?'本人直接命中':''}}
  </el-tag>                                    
          <!-- <el-tag
    v-if="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell"
    :type="scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==2?'danger':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==1?'info':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==0?'primary':''">[object Object]
    {{scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==2?'二度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==1?'一度关系命中':scope.row.blackListBaiRongVo.blackListBaiRongVo_cell==0?'本人直接命中':''}}
</el-tag>  -->
                                 </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>  
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">腾讯反欺诈</th>
                        <td colspan="5" >
                            <el-table
                            v-if="txReport"
                                    :data="txReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                               </template>                                   
                               </el-table-column>
            
                                <el-table-column prop="found" align="center" label="记录是否查到"  width="100">
                                      <template slot-scope="scope" v-if="scope.row.msginfo">
                                                <el-tag
                                                  :type="scope.row.msginfo.found ==1?'success':''">
                                                  {{scope.row.msginfo.found==1?'是':'否'}}
                                                  </el-tag>
                                               </template>                                    
                                </el-table-column>
                                <el-table-column prop="idFound" align="center" label="身份证是否查到"  width="150">
                                      <template slot-scope="scope" v-if="scope.row.msginfo">
                                                <el-tag
                                                  :type="scope.row.msginfo.idFound ==1?'success':''">
                                                  {{scope.row.msginfo.idFound==1?'是':'否'}}
                                                  </el-tag>
                                               </template>                                    
                                </el-table-column>   
                                <el-table-column prop="idFound" align="center" label="摘要"  min-width="150">
                                      <template slot-scope="scope" v-if="scope.row.msginfo">
                                                <el-tag
                                                  >
                                                  分数{{scope.row.msginfo.riskScore}}
                                                  </el-tag>
                                                  <template v-for="(item,i) in scope.row.msginfo.riskInfo">
                                                    <el-tag  :key="i"
                                                    :type="item.riskCodeValue==1?'primary':item.riskCodeValue==2?'info':item.riskCodeValue==3?'danger':''"
                                                   >
                                                {{item.riskCode==1?'信贷中介':item.riskCode==2?'不法分子':item.riskCode==3?'虚假资料':item.riskCode==4?'羊毛党':item.riskCode==5?'身份认证失败':item.riskCode==6?'疑似恶意欺诈':item.riskCode==7?'失信名单':item.riskCode==8?'异常支付行':''}}
                                                {{item.riskCodeValue==1?'低风险':item.riskCodeValue==2?'中风险':item.riskCodeValue==3?'高风险':''}}
                                                  </el-tag>
                                                  </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>   
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">魔蝎</th>
                        <td colspan="5" >
                            <el-table
                            v-if="mxReport"
                                    :data="mxReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                            <template v-if="scope.row.moxieBlackVO.data.black_info_detail">
                                                  <el-tag
                                                  v-if="scope.row.moxieBlackVO.data.black_info_detail.black_types!=''"
                                                    >
                                                  黑名单类型列表{{scope.row.moxieBlackVO.data.black_info_detail.black_types}}
                                                  </el-tag>  
                                                  <el-tag
                                                  :type="scope.row.moxieBlackVO.data.black_info_detail.mobile_name_in_blacklist?'danger':''"
                                                    >
                                                  手机和姓名{{scope.row.moxieBlackVO.data.black_info_detail.mobile_name_in_blacklist?'在':'不在'}}黑名单
                                                  </el-tag>  
                                                  <el-tag
                                                  :type="scope.row.moxieBlackVO.data.black_info_detail.idcard_name_in_blacklist?'danger':''"
                                                    >
                                                  身份证和姓名{{scope.row.moxieBlackVO.data.black_info_detail.idcard_name_in_blacklist?'在':'不在'}}黑名单
                                                  </el-tag>  
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_amount!=''"
                                                        >
                                                      最大逾期金额{{scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_amount}}
                                                      </el-tag>  
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_count>0"
                                                        >
                                                      逾期次数{{scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_count}}
                                                      </el-tag>  
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status!=''"
                                                      type="danger"
                                                        >
                                                      最大预期天数{{scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M0'?
                                                      '0-15天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M1'?
                                                      '16-30天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M2'?
                                                      '31-60天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M3'?
                                                      '61-90天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M4'?
                                                      '91-120天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M5'?
                                                      '121-150天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M6'?
                                                      '151-180天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M6+'?'大于180天':''}}
                                                      </el-tag>                                                      
                                            </template>
                                            <template v-if="scope.row.moxieBlackVO.data.gray_info_detail">
                                                  <el-tag
                                                  v-if="scope.row.moxieBlackVO.data.gray_info_detail.gray_types!=''"
                                                    >
                                                 灰名单类型列表{{scope.row.moxieBlackVO.data.gray_info_detail.gray_types}}
                                                  </el-tag>  
                                                  <el-tag
                                                    >
                                                  手机和姓名{{scope.row.moxieBlackVO.data.gray_info_detail.mobile_name_in_gray?'在':'不在'}}灰名单
                                                  </el-tag>  
                                                  <el-tag
                                                    >
                                                  身份证和姓名{{scope.row.moxieBlackVO.data.gray_info_detail.idcard_name_in_gray?'在':'不在'}}灰名单
                                                  </el-tag>  
                                                  <template v-if="scope.row.moxieBlackVO.data.gray_info_detail.graylist_record!=''">
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_amount!=''"
                                                        >
                                                      最大逾期金额{{scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_amount}}
                                                      </el-tag>  
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_count>0"
                                                        >
                                                      逾期次数{{scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_count}}
                                                      </el-tag>  
                                                      <el-tag
                                                      v-if="scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_status!=''"
                                                        >
                                                      最大预期天数{{scope.row.moxieBlackVO.data.gray_info_detail.graylist_record.overdue_status=='M0'?
                                                      '0-15天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M1'?
                                                      '16-30天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M2'?
                                                      '31-60天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M3'?
                                                      '61-90天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M4'?
                                                      '91-120天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M5'?
                                                      '121-150天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M6'?
                                                      '151-180天':scope.row.moxieBlackVO.data.black_info_detail.blacklist_record.overdue_status=='M6+'?
                                                      '大于180天':''}}
                                                      </el-tag>                                                      
                                                  </template>
                                                                                                                                                                                                                                                                                                                                                                                                                       

                                            </template>                                            
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr> 
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">数创</th>
                        <td colspan="5" >
                            <el-table
                            v-if="scReport"
                                    :data="scReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                            <template >
                                                  <el-tag
                                                  v-if="scope.row.netLoan!=''"
                                                  :type="scope.row.netLoan==1?'danger':''"
                                                    >
                                                  网贷中介{{scope.row.netLoan==1?'命中':"未命中"}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="scope.row.altNumber!=''"
                                                  :type="scope.row.altNumber==1?'danger':''"
                                                    >
                                                  小号类{{scope.row.altNumber==1?'命中':"未命中"}}
                                                  </el-tag>                                                    
                                                  <el-tag
                                                  v-if="scope.row.history_overdue!=''"
                                                  :type="scope.row.history_overdue=='S'?'':scope.row.history_overdue=='A'?'success':scope.row.history_overdue=='B'?'warning':scope.row.history_overdue=='C'?'danger':''"
                                                    >
                                                  逾期历史{{scope.row.history_overdue=='S'?'未命中':scope.row.history_overdue=='A'?'短期逾期1-3天':scope.row.history_overdue=='B'?'中期逾期4-30天':scope.row.history_overdue=='C'?'长期逾期30+':""}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="scope.row.current_overdue!=''"
                                                  :type="scope.row.current_overdue=='S'?'':scope.row.current_overdue=='A'?'success':scope.row.current_overdue=='B'?'warning':scope.row.current_overdue=='C'?'danger':''"
                                                    >
                                                  近期逾期{{scope.row.current_overdue=='S'?'未命中':scope.row.current_overdue=='A'?'短期逾期1-3天':scope.row.current_overdue=='B'?'中期逾期4-30天':scope.row.current_overdue=='C'?'长期逾期30+':""}}
                                                  </el-tag>                                                                                                      
                                            </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr> 
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">公信宝</th>
                        <td colspan="5" >
                            <el-table
                            v-if="gxbReport"
                                    :data="gxbReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status=='success'?'danger':''">
                                                  {{scope.row.status=='success'?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                            <template  v-if="scope.row.phone">
                                                  <el-tag
                                                  v-if="scope.row.phone.overdue_time"
                                                    >
                                                  手机逾期时间{{scope.row.phone.overdue_time|dateServer3}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="scope.row.phone.lend_time"
                                                    >
                                                  手机借款时间{{scope.row.phone.lend_time|dateServer3}}
                                                  </el-tag>  
                                                <el-tag
                                                  :type="scope.row.phone.takeback==2?'danger':''">
                                                  {{scope.row.phone.takeback==2?'未催回':'已催回'}}
                                                  </el-tag>
                                                 <el-tag
                                                  v-if="scope.row.phone.outDays"
                                                  type="danger"
                                                    >
                                                  逾期{{scope.row.phone.outDays}}天数
                                                  </el-tag> 
                                                 <el-tag
                                                  v-if="scope.row.idcard.lend_money"
                                                  type="danger"
                                                    >
                                                  借款区间{{scope.row.idcard.lend_money}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="scope.row.idcard.overdue_time"
                                                    >
                                                  身份证逾期时间{{scope.row.idcard.overdue_time|dateServer3}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="scope.row.idcard.lend_time"
                                                    >
                                                  身份证借款时间{{scope.row.idcard.lend_time|dateServer3}}
                                                  </el-tag>  
                                                <el-tag
                                                  :type="scope.row.idcard.takeback==2?'danger':''">
                                                  {{scope.row.idcard.takeback==2?'未催回':'已催回'}}
                                                  </el-tag>
                                                 <el-tag
                                                  v-if="scope.row.idcard.outDays"
                                                  type="danger"
                                                    >
                                                  逾期{{scope.row.idcard.outDays}}天数
                                                  </el-tag> 
                                                 <el-tag
                                                  v-if="scope.row.idcard.lend_money"
                                                  type="danger"
                                                    >
                                                  借款区间{{scope.row.idcard.lend_money}}
                                                  </el-tag>                                                                                                                                                       
                                            </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>  
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">新颜</th>
                        <td colspan="5" >
                            <el-table
                            v-if="scReport"
                                    :data="xyReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                            <template >
                                              <el-tag
                                                   type="danger"
                                                  v-if="scope.row.desc"
                                                    >
                                                  {{scope.row.desc}}
                                                  </el-tag>                                                
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.max_overdue_amt"
                                                    >
                                                  最大逾期金额{{scope.row.max_overdue_amt}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.max_overdue_days"
                                                    >
                                                  最长逾期天数{{scope.row.max_overdue_days}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.latest_overdue_time"
                                                    >
                                                  最近逾期时间{{scope.row.latest_overdue_time}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.currently_overdue"
                                                    >
                                                  当前逾期机构数{{scope.row.currently_overdue}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.currently_performance"
                                                    >
                                                  当前履约机构数{{scope.row.currently_performance}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.acc_exc"
                                                    >
                                                  异常还款机构数{{scope.row.acc_exc}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.acc_sleep"
                                                    >
                                                  睡眠机构数{{scope.row.acc_sleep}}
                                                  </el-tag>                                                                                                                                                                                                                                                                                                                                                                
                                            </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>   
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">白骑士</th>
                        <td colspan="5" >
                            <el-table
                            v-if="bqsReport"
                                    :data="bqsReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                   :type="scope.row.finalDecision=='Accept'?'':scope.row.finalDecision=='Reject'?'danger':scope.row.finalDecision=='Review'?'info':''"
                                                  v-if="scope.row.finalDecision"
                                                    >
                                                  {{scope.row.finalDecision=='Accept'?'无风险':scope.row.finalDecision=='Reject'?'高风险建议拒绝':scope.row.finalDecision=='Review'?'低风险建议人工审核':''}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.finalScore"
                                                    >
                                                  风险系数{{scope.row.finalScore}}
                                                  </el-tag>  
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.riskType"
                                                    >
                                                  风险类型{{scope.row.riskType=='botAction'?'机器行为':scope.row.riskType=='fakeRegister'?'伪冒申请':scope.row.riskType=='dynamicCode'?'动码攻击':scope.row.riskType=='suspiciousAction'?'异常行为':
                                                  scope.row.riskType=='bruteForce'?'暴力破解':scope.row.riskType=='userFraud'?'本人欺诈':scope.row.riskType=='accountTakeover'?'账户盗用':scope.row.riskType=='garbageRegister'?'垃圾注册':scope.row.riskType=='creditRisk'?'失信风险':scope.row.riskType=='agencyCash'?'中介套现':''}}
                                                  </el-tag>   
                                                  <!-- <el-tag
                                                   :type="scope.row.strategyDecision=='Accept'?'':scope.row.strategyDecision=='Reject'?'danger':scope.row.strategyDecision=='Review'?'info':''"
                                                  v-if="scope.row.strategyDecision"
                                                    >
                                                  决策结果{{scope.row.strategyDecision=='Accept'?'无风险':scope.row.strategyDecision=='Reject'?'高风险建议拒绝':scope.row.strategyDecision=='Review'?'低风险建议人工审核':''}}
                                                  </el-tag> 
                                                  <el-tag
                                                   type="danger"
                                                  v-if="scope.row.strategyScor"
                                                    >
                                                  策略风险系数{{scope.row.strategyScor}}
                                                  </el-tag>                                                                                                                                                                                                                                                 -->
                                                  <template v-for="(tem,i) in  scope.row.strategySet" v-if="scope.row.strategySet">
                                                 <el-tag :key="i"
                                                   :type="tem.strategyDecision=='Accept'?'':tem.strategyDecision=='Reject'?'danger':tem.strategyDecision=='Review'?'info':''"
                                                  v-if="tem.strategyDecision"
                                                    >
                                                  决策结果{{tem.strategyDecision=='Accept'?'无风险':tem.strategyDecision=='Reject'?'高风险建议拒绝':tem.strategyDecision=='Review'?'低风险建议人工审核':''}}
                                                  </el-tag> 
                                                  <el-tag :key="i"
                                                   type="danger"
                                                  v-if="tem.strategyScore"
                                                    >
                                                  策略风险系数{{tem.strategyScore}}
                                                  </el-tag>  
                                                  <el-tag :key="i"
                                                   type="danger"
                                                  v-if="tem.strategyMode"
                                                    >
                                                  {{tem.strategyName}}-{{tem.strategyMode=="FirstMode"?'首次匹配':tem.strategyMode=="WorstMode"?'最坏匹配':tem.strategyMode=="WeightMode"?'权重匹配':''}}
                                                  </el-tag>                                                     
                                                  <template v-for="(t,ii) in tem.hitRules ">
                                                  <el-tag :key="ii"
                                                   type="danger"
                                                  v-if="t.memo"
                                                    >
                                                  {{t.memo}}
                                                  </el-tag>
                                                  <el-tag :key="ii"
                                                   type="danger"
                                                  v-if="t.ruleName"
                                                    >
                                                  {{t.ruleName}}
                                                  </el-tag>    
                                                  <el-tag :key="ii"
                                                   :type="t.decision=='Accept'?'':t.decision=='Reject'?'danger':t.decision=='Review'?'info':''"
                                                  v-if="t.decision"
                                                    >
                                                  {{t.decision=='Accept'?'无风险':t.decision=='Reject'?'高风险建议拒绝':t.decision=='Review'?'低风险建议人工审核':''}}
                                                  </el-tag>                                                                                                                                                      
                                                  </template>
                                                  </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>  
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">天创</th>
                        <td colspan="5" >
                            <el-table
                            v-if="tcReport"
                                    :data="tcReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                   :type="scope.row.blackLevel=='A'?'danger':scope.row.blackLevel=='B'?'info':scope.row.blackLevel=='C'?'warning':scope.row.blackLevel=='D'?'':''"
                                                  v-if="scope.row.blackLevel"
                                                    >
                                                  黑名单等级{{scope.row.blackLevel=='A'?'严重':scope.row.blackLevel=='B'?'中高等':scope.row.blackLevel=='C'?'中等':scope.row.blackLevel=='D'?'低等':'未命中'}}
                                                  </el-tag>  
                                                  <el-tag
                                                  v-if="!scope.row.isWhite"
                                                  :type="scope.row.isWhite?'':'danger'">
                                                  {{scope.row.isWhite?'白名单':'黑名单'}}
                                                  </el-tag>    
                                                                                                
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>   
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">拍拍信</th>
                        <td colspan="5" >
                            <el-table
                            v-if="ppxReport"
                                    :data="ppxReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                  v-if="scope.row.isBlack==1"
                                                  type="danger">
                                                  {{scope.row.isBlack==1?'不良用户':''}}
                                                  </el-tag> 
                                                  <el-tag
                                                  v-if="scope.row.isAlert ==1"
                                                  type="danger">
                                                  {{scope.row.isAlert ==1?'是关注用户':''}}
                                                  </el-tag>  
                                                <template v-if="scope.row.hkxw">
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK001 "
                                                 >
                                                  逾期最早出现时间{{scope.row.hkxw.HK001}}
                                                  </el-tag> 
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK002 "
                                                 >
                                                  逾期最近出现时间{{scope.row.hkxw.HK002}}
                                                  </el-tag> 
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK003"
                                                  type="danger"
                                                 >
                                                  逾期累计出现次数{{scope.row.hkxw.HK003}}
                                                  </el-tag> 
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK004"
                                                  type="danger"
                                                 >
                                                  当前总逾期金额{{scope.row.hkxw.HK004==1?'1~1000':
                                                                scope.row.hkxw.HK004==2?'1000~2000':
                                                                scope.row.hkxw.HK004==3?'2000~3000':
                                                                scope.row.hkxw.HK004==4?'3000~4000':
                                                                scope.row.hkxw.HK004==5?'4000~6000':
                                                                scope.row.hkxw.HK004==6?'6000~8000':
                                                                scope.row.hkxw.HK004==7?'8000~10000':
                                                                scope.row.hkxw.HK004==8?'10000~30000':
                                                                scope.row.hkxw.HK004==9?'30000~50000 ':
                                                                scope.row.hkxw.HK004==10?'50000~100000 ':                                                                
                                                                scope.row.hkxw.HK004==11?'≥100000':''
                                                  }}
                                                  </el-tag>   
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK005"
                                                  type="danger"
                                                 >
                                                  当前逾期时长{{scope.row.hkxw.HK005==1?'1~30':
                                                                scope.row.hkxw.HK005==2?'31~60':
                                                                scope.row.hkxw.HK005==3?'61~90':
                                                                scope.row.hkxw.HK005==4?'91~120':
                                                                scope.row.hkxw.HK005==5?'121~150':
                                                                scope.row.hkxw.HK005==6?'151~180':
                                                                scope.row.hkxw.HK005==7?'>180':
                                                     ''
                                                  }}
                                                  </el-tag>  
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK006"
                                                  type="danger"
                                                 >
                                                  历史总逾期金额{{scope.row.hkxw.HK006==1?'1~1000':
                                                                scope.row.hkxw.HK006==2?'1000~2000':
                                                                scope.row.hkxw.HK006==3?'2000~3000':
                                                                scope.row.hkxw.HK006==4?'3000~4000':
                                                                scope.row.hkxw.HK006==5?'4000~6000':
                                                                scope.row.hkxw.HK006==6?'6000~8000':
                                                                scope.row.hkxw.HK006==7?'8000~10000':
                                                                scope.row.hkxw.HK006==8?'10000~30000':
                                                                scope.row.hkxw.HK006==9?'30000~50000 ':
                                                                scope.row.hkxw.HK006==10?'50000~100000 ':                                                                
                                                                scope.row.hkxw.HK006==11?'≥100000':''
                                                  }}
                                                  </el-tag>   
                                              <el-tag
                                                  v-if="scope.row.hkxw.HK007"
                                                  type="danger"
                                                 >
                                                  历史逾期时长{{scope.row.hkxw.HK007==1?'1~30':
                                                                scope.row.hkxw.HK007==2?'31~60':
                                                                scope.row.hkxw.HK007==3?'61~90':
                                                                scope.row.hkxw.HK007==4?'91~120':
                                                                scope.row.hkxw.HK007==5?'121~150':
                                                                scope.row.hkxw.HK007==6?'151~180':
                                                                scope.row.hkxw.HK007==7?'>180':
                                                     ''
                                                  }}
                                                  </el-tag> 
                                                </template>
                                                    <template v-if="scope.row.lsqz">
                                            <el-tag
                                                  v-if="scope.row.lsqz.QZ001"
                                                  type="danger"
                                                 >
                                                  欺诈最早出现时间{{scope.row.lsqz.QZ001}}
                                                  </el-tag>
                                            <el-tag
                                                  v-if="scope.row.lsqz.QZ002"
                                                  type="danger"
                                                 >
                                                  欺诈最近出现时间{{scope.row.lsqz.QZ002}}
                                                  </el-tag>
                                            <el-tag
                                                  v-if="scope.row.lsqz.QZ003"
                                                  type="danger"
                                                 >
                                                  欺诈累计出现次数{{scope.row.lsqz.QZ003}}
                                                  </el-tag>                                                       
                                                    
                                                    </template>                                                                                                                                                                                                                                                                                                          
                                          <template v-if="scope.row.zffm">
                                         <el-tag
                                                  v-if="scope.row.zffm.FM001"
                                                  type="danger"
                                                 >
                                                  欺诈最早出现时间{{scope.row.zffm.FM001}}
                                                  </el-tag>
                                            <el-tag
                                                  v-if="scope.row.zffm.FM002"
                                                  type="danger"
                                                 >
                                                  欺诈最近出现时间{{scope.row.zffm.FM002}}
                                                  </el-tag>
                                            <el-tag
                                                  v-if="scope.row.zffm.FM003"
                                                  type="danger"
                                                 >
                                                  欺诈累计出现次数{{scope.row.zffm.FM003}}
                                                  </el-tag>  
                                          </template>
                                                                                                                                                                                                                                             
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr> 
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">鹏数科技</th>
                        <td colspan="5" >
                            <el-table
                            v-if="pskjReport"
                                    :data="pskjReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                    v-if="scope.row.sn_order2_blacklist_contacts_cnt&&scope.row.sn_order2_blacklist_contacts_cnt!=0"
                                                    type="danger">
                                                    间接黑名单数量{{scope.row.sn_order2_blacklist_contacts_cnt}}
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.sn_order1_blacklist_contacts_cnt&&scope.row.sn_order1_blacklist_contacts_cnt!=0"
                                                    type="danger">
                                                    直接黑名单数量{{scope.row.sn_order1_blacklist_contacts_cnt}}
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.sn_order2_blacklist_routers_cnt&&scope.row.sn_order2_blacklist_routers_cnt!=0"
                                                    type="danger">
                                                    间接黑人的直接联系人个数{{scope.row.sn_order2_blacklist_routers_cnt}}
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.sn_order2_blacklist_routers_pct"
                                                    type="danger">
                                                    间接黑人的直接联系人比例{{scope.row.sn_order2_blacklist_routers_pct}}
                                                  </el-tag> 

                                                  <el-tag
                                                    v-if="scope.row.in_court_blacklist"
                                                    type="danger">
                                                    法院黑名单
                                                  </el-tag>   
                                                  <el-tag
                                                    v-if="scope.row.in_p2p_blacklist"
                                                    type="danger">
                                                    网贷黑名单
                                                  </el-tag>   
                                                  <el-tag
                                                    v-if="scope.row.idcard_in_blacklist"
                                                    type="danger">
                                                    身份证黑名单
                                                  </el-tag>   
                                                  <el-tag
                                                    v-if="scope.row.phone_in_blacklist"
                                                    type="danger">
                                                    手机黑名单
                                                  </el-tag>   
                                                  <el-tag
                                                    v-if="scope.row.in_bank_blacklist"
                                                    type="danger">
                                                    银行黑名单
                                                  </el-tag>   

                                                  <el-tag
                                                    v-if="scope.row.offline_cash_loan_cnt"
                                                    type="danger">
                                                    线下现金贷{{scope.row.offline_cash_loan_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.online_cash_loan_cnt"
                                                    type="danger">
                                                    线上现金贷{{scope.row.online_cash_loan_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.payday_loan_cnt"
                                                    type="danger">
                                                    线上消费分期{{scope.row.payday_loan_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.payday_loan_cnt"
                                                    type="danger">
                                                    小额快速贷{{scope.row.payday_loan_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.credit_card_repayment_cnt"
                                                    type="danger">
                                                    信用卡代还{{scope.row.credit_card_repayment_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.offline_installment_cnt"
                                                    type="danger">
                                                    线下分期{{scope.row.offline_installment_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.search_cnt_recent_180_days"
                                                    type="danger">
                                                    最近180天查询{{scope.row.search_cnt_recent_180_days}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.org_cnt"
                                                    type="danger">
                                                   历史查询总机构数{{scope.row.org_cnt}}次
                                                  </el-tag> 
                                                  <el-tag
                                                    v-if="scope.row.search_cnt "
                                                    type="danger">
                                                    历史查询总次数{{scope.row.search_cnt }}次
                                                  </el-tag>                                                                                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr> 
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">小视科技</th>
                        <td colspan="5" >
                            <el-table
                            v-if="hmdReport"
                                    :data="hmdReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                    v-if="scope.row.message"
                                                    :type="scope.row.status?'danger':''">
                                                    {{scope.row.message}}
                                                  </el-tag> 
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>   
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">算话征信</th>
                        <td colspan="5" >
                            <el-table
                            v-if="shReport"
                                    :data="shReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                    v-if="scope.row.risk"
                                                    :type="scope.row.risk=='high'?'danger':scope.row.risk=='medium-high'?'danger':scope.row.risk=='medium'?'warning':scope.row.risk=='low'?'':''">
                                                    风险等级{{scope.row.risk=='high'?'非常高':scope.row.risk=='medium-high'?'高':scope.row.risk=='medium'?'中等':scope.row.risk=='low'?'低':''}}
                                                  </el-tag> 
                                                <template v-for="(tem,i) in scope.row.detail" v-if="scope.row.detail">
                                                  <el-tag :key="i"
                                                    v-if="tem.riskType">
                                                    {{tem.riskType == 'loan'?'小贷':
                                                    tem.riskType =='bank'?'银行':tem.riskType =='p2p'?'p2p':tem.riskType =='consumer_finance'?'消费金融':tem.riskType =='insurance'?'保险':'其他金融类'
                                                    }}{{tem.riskDescription}}
                                                  </el-tag> 
                                                </template>
                                      </template>                                    
                                </el-table-column>                                     
                            </el-table>
                          </td>
                    </tr>    
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">孚临金科</th>
                        <td colspan="5" >
                            <el-table
                            v-if="fljkReport"
                                    :data="fljkReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status==1?'danger':''">
                                                  {{scope.row.status==1?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                            </el-table>
                          </td>
                    </tr>   
                    <tr>
                        <th  class="bgcolor "  style="text-align: center;">创蓝</th>
                        <td colspan="5" >
                            <el-table
                            v-if="clReport"
                                    :data="clReport"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">

                               <el-table-column prop="status" align="center" label="匹配结果"  width="100">
                                      <template slot-scope="scope">
                                                <el-tag
                                                  :type="scope.row.status?'danger':''">
                                                  {{scope.row.status?'是':'否'}}
                                                  </el-tag>
                                      </template>                                   
                               </el-table-column>
                                <el-table-column  align="center" label="摘要"  min-width="150" >
                                      <template slot-scope="scope" >
                                                  <el-tag
                                                    v-if="scope.row.blackLevel=='B1'||scope.row.blackLevel=='B2'"
                                                    :type="scope.row.blackLevel='B1'?'danger':scope.row.blackLevel=='B2'?'danger':scope.row.blackLevel=='W1'?'warning':scope.row.blackLevel=='N'?'':''">
                                                    {{scope.row.blackLevel=='B1'?'黑名单':scope.row.blackLevel=='B2'?'可信度低':scope.row.blackLevel=='W1'?'白名单':scope.row.blackLevel=='N'?'未找到':''}}
                                                  </el-tag> 
                                      </template>                                    
                                </el-table-column>                                    
                            </el-table>
                          </td>
                    </tr>                                                                                                                                                                                                                                                                       
          </table>
        </el-dialog>
        </el-dialog>  
        </el-tabs>         
    </div>    
</template>
<script>
import { mapGetters } from "vuex";
import { timeFormat } from "../../../config/time";
import {
  httpLoanapply,
  httpGetOverList,
  httpGetNotApplyOrder,
  httpGetCustomterMesage,
  httpGetCreditReport,
  httpGetRoleNames,
  httpGettiqianfublacklistvarious,
  httpGettiqianfublacklistvariouss
} from "@/service/http";
export default {
  data() {
    return {
      assessorList: [],
      activename: "first",
      search: {},
      npage: 1,
      pagesize: 10,
      total: 0,
      tableData: [],
      loading: false,
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
      activeName: "third",
      listId: null,
      showText: false,
      applyStatus: null,
      blackListVisible: false,
      txReport: [],
      brReport: [],
      mxReport: [],
      scReport: [],
      gxbReport: [],
      xyReport: [],
      bqsReport: [],
      tcReport: [],
      ppxReport: [],
      pskjReport: [],
      hmdReport: [],
      shReport: [],
      fljkReport: [],
      clReport: []
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
    //查看黑名单
    viewBlackList(realName, mobNum, idNum, type) {
      var i = 0;
      this.txReport.length = 0;
      this.brReport.length = 0;
      this.mxReport.length = 0;
      this.scReport.length = 0;
      this.gxbReport.length = 0;
      this.xyReport.length = 0;
      this.bqsReport.length = 0;
      this.tcReport.length = 0;
      this.ppxReport.length = 0;
      this.pskjReport.length = 0;
      this.hmdReport.length = 0;
      this.shReport.length = 0;
      this.fljkReport.length = 0;
      this.clReport.length = 0;
      httpGettiqianfublacklistvarious(
        this.customerInformation[0].chbrealName,
        this.customerInformation[0].chbphoneNumber,
        this.customerInformation[0].chbidcard,
        2
      ).then(res => {
        let data = res.data;

        if (data.code == 200) {
          if (data.data) {
            this.txReport.push(data.data);
          } else {
            this.txReport.push([{ status: false }]);
          }
        }
        httpGettiqianfublacklistvarious(
          this.customerInformation[0].chbrealName,
          this.customerInformation[0].chbphoneNumber,
          this.customerInformation[0].chbidcard,
          1
        ).then(res => {
          let data = res.data;

          if (data.code == 200) {
            this.brReport.push(data.data);
          }
          httpGettiqianfublacklistvarious(
            this.customerInformation[0].chbrealName,
            this.customerInformation[0].chbphoneNumber,
            this.customerInformation[0].chbidcard,
            3
          ).then(res => {
            let data = res.data;

            if (data.code == 200) {
              if (data.data) {
                this.mxReport.push(data.data);
              } else {
                this.mxReport.push([{ status: 0 }]);
              }
            }
            httpGettiqianfublacklistvarious(
              this.customerInformation[0].chbrealName,
              this.customerInformation[0].chbphoneNumber,
              this.customerInformation[0].chbidcard,
              4
            ).then(res => {
              let data = res.data;
              if (data.code == 200) {
                if (data.data) {
                  this.scReport.push({
                    status: data.data.status,
                    netLoan: data.data.scInnerBlackVO
                      ? data.data.scInnerBlackVO.handlerData.netLoan
                      : "",
                    altNumber: data.data.scInnerBlackVO
                      ? data.data.scInnerBlackVO.handlerData.altNumber
                      : "",
                    history_overdue: data.data.scInnerBlackVO
                      ? data.data.scInnerBlackVO.handlerData.history_overdue
                      : "",
                    current_overdue: data.data.scInnerBlackVO
                      ? data.data.scInnerBlackVO.handlerData.current_overdue
                      : ""
                  });
                } else {
                  this.scReport.push({
                    status: "",
                    netLoan: "",
                    altNumber: "",
                    history_overdue: "",
                    current_overdue: ""
                  });
                }
              }

              httpGettiqianfublacklistvarious(
                // "王志存",
                // "15176550456",
                // "130230199207142313",
                this.customerInformation[0].chbrealName,
                this.customerInformation[0].chbphoneNumber,
                this.customerInformation[0].chbidcard,
                7
              ).then(res => {
                let data = res.data;
                if (data.code == 200) {
                  if (data.data) {
                    let obj = JSON.parse(data.data.datasources[0].data);
                    this.gxbReport.push({
                      status: obj ? obj.status : "",
                      phone: obj ? obj.data.phone[0] : "",
                      idcard: obj ? obj.data.idcard[0] : "",
                      overdue_time: "",
                      lend_time: "",
                      takeback: "",
                      outDays: "",
                      lend_money: ""
                    });
                  } else {
                    this.gxbReport.push({
                      status: "",
                      phone: {
                        overdue_time: "",
                        lend_time: "",
                        takeback: "",
                        outDays: "",
                        lend_money: ""
                      },
                      idcard: {
                        overdue_time: "",
                        lend_time: "",
                        takeback: "",
                        outDays: "",
                        lend_money: ""
                      },
                      overdue_time: "",
                      lend_time: "",
                      takeback: "",
                      outDays: "",
                      lend_money: ""
                    });
                  }
                }
              });
              httpGettiqianfublacklistvarious(
                this.customerInformation[0].chbrealName,
                this.customerInformation[0].chbphoneNumber,
                this.customerInformation[0].chbidcard,
                10
              ).then(res => {
                let data = res.data;
                if (data.code == 200) {
                  if (data.data) {
                    let obj = JSON.parse(data.data);
                    this.xyReport.push({
                      status: data.data.success,
                      desc: obj.data ? obj.data.desc : "",
                      max_overdue_amt: obj.data
                        ? obj.data.result_detail.max_overdue_amt
                        : "",
                      max_overdue_days: obj.data
                        ? obj.data.result_detail.max_overdue_days
                        : "",
                      latest_overdue_time: obj.data
                        ? obj.data.result_detail.latest_overdue_time
                        : "",
                      currently_overdue: obj.data
                        ? obj.data.result_detail.currently_overdue
                        : "",
                      currently_performance: obj.data
                        ? obj.data.result_detail.currently_performance
                        : "",
                      acc_exc: obj.data ? obj.data.result_detail.acc_exc : "",
                      acc_sleep: obj.data
                        ? obj.data.result_detail.acc_sleep
                        : ""
                    });
                  } else {
                    this.xyReport.push({
                      status: null,
                      desc: null,
                      max_overdue_amt: null,
                      max_overdue_days: null,
                      latest_overdue_time: null,
                      currently_overdue: null,
                      currently_performance: null,
                      acc_exc: null,
                      acc_sleep: null
                    });
                  }
                }
                httpGettiqianfublacklistvarious(
                  this.customerInformation[0].chbrealName,
                  this.customerInformation[0].chbphoneNumber,
                  this.customerInformation[0].chbidcard,
                  8
                ).then(res => {
                  let data = res.data;
                  if (data.code == 200) {
                    let obj = data.data;

                    if (data.data) {
                      this.bqsReport.push({
                        status: obj.status,
                        finalDecision: obj.bqsDataVO
                          ? obj.bqsDataVO.finalDecision
                          : "", //决策结果码，
                        finalScore: obj.bqsDataVO
                          ? obj.bqsDataVO.finalScore
                          : "", //最终风险参数
                        // riskType: obj.bqsDataVO?obj.bqsDataVO.strategySet[0].riskType:'', //风险类型
                        // strategyDecision:obj.bqsDataVO?
                        //   obj.bqsDataVO.strategySet[0].strategyDecision:'', //策略决策结果，参见 decision 附录
                        // strategyMode: obj.bqsDataVO?obj.bqsDataVO.strategySet[0].strategyMode:'', //   策略匹配模式，参见 strategyMode 附录
                        // strategyScore:
                        //   obj.bqsDataVO?obj.bqsDataVO.strategySet[0].strategyScore:'',
                        // rejectValue: obj.bqsDataVO.strategySet[0].rejectValue,
                        // reviewValue: obj.bqsDataVO.strategySet[0].reviewValue,
                        // tips: obj.bqsDataVO.strategySet[0].tips,
                        // hitRules: obj.bqsDataVO.strategySet[0].hitRules,
                        strategySet: obj.bqsDataVO
                          ? obj.bqsDataVO.strategySet
                          : [],

                        blackListFulinJinkeVo: null,
                        psBalckListVO: null
                      });
                    } else {
                      this.bqsReport.push({
                        status: 0,
                        blackListBaiRongVo: null,
                        moxieBlackVO: null,
                        blackListPaipaiXinVo: null,
                        scInnerBlackVO: null,
                        bqsDataVO: {
                          finalDecision: null,
                          finalScore: null,
                          flowNo: null,
                          resultCode: null,
                          resultDesc: null,
                          strategySet: [
                            {
                              riskType: null,
                              strategyDecision: null,
                              strategyId: null,
                              strategyMode: null,
                              strategyName: null,
                              strategyScore: 0,
                              rejectValue: 0,
                              reviewValue: 0,
                              tips: null,
                              hitRules: [
                                {
                                  decision: null,
                                  memo: null,
                                  ruleId: null,
                                  ruleName: null,
                                  score: 0,
                                  template: null,
                                  detail: null
                                }
                              ]
                            }
                          ]
                        },
                        blackListFulinJinkeVo: null,
                        psBalckListVO: null
                      });
                    }
                  }
                  httpGettiqianfublacklistvarious(
                    this.customerInformation[0].chbrealName,
                    this.customerInformation[0].chbphoneNumber,
                    this.customerInformation[0].chbidcard,
                    6
                  ).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                      let obj = data.data;
                      if (data.data) {
                        this.tcReport.push({
                          status: obj.blackLevel == null ? false : true,
                          isWhite: obj.isWhite ? obj.isWhite : true,
                          msginfo: obj.msginfo
                            ? JSON.parse(obj.msginfo).data.result
                            : "",
                          blackLevel: obj.blackLevel
                        });
                      } else {
                        this.tcReport.push({
                          status: false,
                          isWhite: null,
                          msginfo: {},
                          blackLevel: null
                        });
                      }
                    }
                    httpGettiqianfublacklistvarious(
                      this.customerInformation[0].chbrealName,
                      this.customerInformation[0].chbphoneNumber,
                      this.customerInformation[0].chbidcard,
                      5
                    ).then(res => {
                      let data = res.data;
                      if (data.code == 200) {
                        let obj = data.data;
                        if (data.data) {
                          if (data.data.blackListPaipaiXinVo) {
                            this.ppxReport.push({
                              status: obj.status,
                              isAlert:
                                obj.blackListPaipaiXinVo.resp_body.msg.data
                                  .isAlert,
                              isBlack:
                                obj.blackListPaipaiXinVo.resp_body.msg.data
                                  .isBlack,
                              hkxw:
                                obj.blackListPaipaiXinVo.resp_body.msg.data
                                  .blackSummary.hkxw,
                              lsqz:
                                obj.blackListPaipaiXinVo.resp_body.msg.data
                                  .blackSummary.lsqz,
                              zffm:
                                obj.blackListPaipaiXinVo.resp_body.msg.data
                                  .blackSummary.zffm
                            });
                          } else {
                            this.ppxReport.push({
                              status: null,
                              isAlert: null,
                              isBlack: null,
                              hkxw: {},
                              lsqz: {},
                              zffm: {}
                            });
                          }
                        } else {
                          this.ppxReport.push({
                            status: null,
                            isAlert: null,
                            isBlack: null,
                            hkxw: {},
                            lsqz: {},
                            zffm: {}
                          });
                        }
                      } else {
                        this.ppxReport.push({
                          status: null,
                          isAlert: null,
                          isBlack: null,
                          hkxw: {},
                          lsqz: {},
                          zffm: {}
                        });
                      }
                    });
                    httpGettiqianfublacklistvarious(
                      this.customerInformation[0].chbrealName,
                      this.customerInformation[0].chbphoneNumber,
                      this.customerInformation[0].chbidcard,
                      11
                    ).then(res => {
                      let data = res.data;
                      if (data.code == 200) {
                        let obj = data.data;
                        if (data.data) {
                          if (data.data.psBalckListVO) {
                            this.pskjReport.push({
                              status: obj.status,
                              sn_order2_blacklist_contacts_cnt:
                                obj.psBalckListVO.data.risk_social_network
                                  .sn_order2_blacklist_contacts_cnt, //间接联系人在黑名单中数量(间接黑人)
                              sn_order1_blacklist_contacts_cnt:
                                obj.psBalckListVO.data.risk_social_network
                                  .sn_order1_blacklist_contacts_cnt, //直接联系人在黑名单中数量(直接黑人)
                              sn_order2_blacklist_routers_cnt:
                                obj.psBalckListVO.data.risk_social_network
                                  .sn_order2_blacklist_routers_cnt, //认识间接黑人的直接联系人个数
                              sn_order2_blacklist_routers_pct:
                                obj.psBalckListVO.data.risk_social_network
                                  .sn_order2_blacklist_routers_pct, //认识间接黑人的直接联系人比例
                              in_court_blacklist:
                                obj.psBalckListVO.data.risk_blacklist
                                  .in_court_blacklist, //是否命中法院黑名单
                              in_p2p_blacklist:
                                obj.psBalckListVO.data.risk_blacklist
                                  .in_p2p_blacklist, //是否命中网贷黑名单
                              idcard_in_blacklist:
                                obj.psBalckListVO.data.risk_blacklist
                                  .idcard_in_blacklist, //身份证是否命中黑名单
                              phone_in_blacklist:
                                obj.psBalckListVO.data.risk_blacklist
                                  .phone_in_blacklist, //手机号是否命中黑名单
                              in_bank_blacklist:
                                obj.psBalckListVO.data.risk_blacklist
                                  .in_bank_blacklist, //是否命中银行黑名单
                              offline_cash_loan_cnt:
                                obj.psBalckListVO.data.history_org
                                  .offline_cash_loan_cnt, //线下现金贷出现次数
                              online_cash_loan_cnt:
                                obj.psBalckListVO.data.history_org
                                  .online_cash_loan_cnt, //线上现金贷出现次数
                              online_installment_cnt:
                                obj.psBalckListVO.data.history_org
                                  .online_installment_cnt, //线上消费分期出现次数
                              payday_loan_cnt:
                                obj.psBalckListVO.data.history_org
                                  .payday_loan_cnt, //小额快速贷出现次数
                              credit_card_repayment_cnt:
                                obj.psBalckListVO.data.history_org
                                  .credit_card_repayment_cnt, //信用卡代还出现次数
                              offline_installment_cnt:
                                obj.psBalckListVO.data.history_org
                                  .offline_installment_cnt, //线下消费分期出现次数
                              search_cnt_recent_180_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_180_days, //最近180天查询次数
                              search_cnt_recent_7_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_7_days, //最近7天查询次数
                              org_cnt_recent_180_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_180_days, //最近180天查询机构数
                              search_cnt_recent_90_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_90_dayss, //最近90天查询次数
                              org_cnt_recent_60_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_60_days, //最近60天查询次数
                              search_cnt_recent_30_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_30_days, //最近30天查询次数
                              search_cnt_recent_14_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_14_days, //最近14天查询次数
                              org_cnt_recent_14_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_14_days, //最近14天查询次数
                              org_cnt_recent_30_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_30_days, //最近30天查询次数
                              org_cnt_recent_7_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_7_days, //最近7天查询次数
                              org_cnt_recent_90_days:
                                obj.psBalckListVO.data.history_search
                                  .org_cnt_recent_90_days, //最近90天查询次数
                              org_cnt:
                                obj.psBalckListVO.data.history_search.org_cnt, //历史查询总机构数
                              search_cnt_recent_60_days:
                                obj.psBalckListVO.data.history_search
                                  .search_cnt_recent_60_days,
                              search_cnt:
                                obj.psBalckListVO.data.history_search.search_cnt //历史查询总次数
                            });
                          } else {
                            this.pskjReport.push({
                              status: 0,
                              sn_order2_blacklist_contacts_cnt: null, //间接联系人在黑名单中数量(间接黑人)
                              sn_order1_blacklist_contacts_cnt: null, //直接联系人在黑名单中数量(直接黑人)
                              sn_order2_blacklist_routers_cnt: null, //认识间接黑人的直接联系人个数
                              sn_order2_blacklist_routers_pct: null, //认识间接黑人的直接联系人比例
                              in_court_blacklist: null, //是否命中法院黑名单
                              in_p2p_blacklist: null, //是否命中网贷黑名单
                              idcard_in_blacklist: null, //身份证是否命中黑名单
                              phone_in_blacklist: null, //手机号是否命中黑名单
                              in_bank_blacklist: null, //是否命中银行黑名单
                              offline_cash_loan_cnt: null, //线下现金贷出现次数
                              online_cash_loan_cnt: null, //线上现金贷出现次数
                              online_installment_cnt: null, //线上消费分期出现次数
                              payday_loan_cnt: null, //小额快速贷出现次数
                              credit_card_repayment_cnt: null, //信用卡代还出现次数
                              offline_installment_cnt: null, //线下消费分期出现次数
                              search_cnt_recent_180_days: null, //最近180天查询次数
                              search_cnt_recent_7_days: null, //最近7天查询次数
                              org_cnt_recent_180_days: null, //最近180天查询机构数
                              search_cnt_recent_90_days: null, //最近90天查询次数
                              org_cnt_recent_60_days: null, //最近60天查询次数
                              search_cnt_recent_30_days: null, //最近30天查询次数
                              search_cnt_recent_14_days: null, //最近14天查询次数
                              org_cnt_recent_14_days: null, //最近14天查询次数
                              org_cnt_recent_30_days: null, //最近30天查询次数
                              org_cnt_recent_7_days: null, //最近7天查询次数
                              org_cnt_recent_90_days: null, //最近90天查询次数
                              org_cnt: null, //历史查询总机构数
                              search_cnt_recent_60_days: null,
                              search_cnt: null //历史查询总次数
                            });
                          }
                        }
                      } else {
                        this.pskjReport.push({
                          status: 0,
                          sn_order2_blacklist_contacts_cnt: null, //间接联系人在黑名单中数量(间接黑人)
                          sn_order1_blacklist_contacts_cnt: null, //直接联系人在黑名单中数量(直接黑人)
                          sn_order2_blacklist_routers_cnt: null, //认识间接黑人的直接联系人个数
                          sn_order2_blacklist_routers_pct: null, //认识间接黑人的直接联系人比例
                          in_court_blacklist: null, //是否命中法院黑名单
                          in_p2p_blacklist: null, //是否命中网贷黑名单
                          idcard_in_blacklist: null, //身份证是否命中黑名单
                          phone_in_blacklist: null, //手机号是否命中黑名单
                          in_bank_blacklist: null, //是否命中银行黑名单
                          offline_cash_loan_cnt: null, //线下现金贷出现次数
                          online_cash_loan_cnt: null, //线上现金贷出现次数
                          online_installment_cnt: null, //线上消费分期出现次数
                          payday_loan_cnt: null, //小额快速贷出现次数
                          credit_card_repayment_cnt: null, //信用卡代还出现次数
                          offline_installment_cnt: null, //线下消费分期出现次数
                          search_cnt_recent_180_days: null, //最近180天查询次数
                          search_cnt_recent_7_days: null, //最近7天查询次数
                          org_cnt_recent_180_days: null, //最近180天查询机构数
                          search_cnt_recent_90_days: null, //最近90天查询次数
                          org_cnt_recent_60_days: null, //最近60天查询次数
                          search_cnt_recent_30_days: null, //最近30天查询次数
                          search_cnt_recent_14_days: null, //最近14天查询次数
                          org_cnt_recent_14_days: null, //最近14天查询次数
                          org_cnt_recent_30_days: null, //最近30天查询次数
                          org_cnt_recent_7_days: null, //最近7天查询次数
                          org_cnt_recent_90_days: null, //最近90天查询次数
                          org_cnt: null, //历史查询总机构数
                          search_cnt_recent_60_days: null,
                          search_cnt: null //历史查询总次数
                        });
                      }
                      httpGettiqianfublacklistvarious(
                        this.customerInformation[0].chbrealName,
                        this.customerInformation[0].chbphoneNumber,
                        this.customerInformation[0].chbidcard,
                        12
                      ).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                          this.hmdReport.push({
                            status: data.data.status,
                            message: data.data.message
                          });
                        } else {
                          this.hmdReport.push({
                            status: null,
                            message: null
                          });
                        }
                        httpGettiqianfublacklistvarious(
                          this.customerInformation[0].chbrealName,
                          this.customerInformation[0].chbphoneNumber,
                          this.customerInformation[0].chbidcard,
                          13
                        ).then(res => {
                          let data = res.data;
                          if (data.code == 200) {
                            if (data.data) {
                              if (data.data.responseInfo) {
                                this.shReport.push({
                                  status: data.data.status,
                                  risk: data.data.responseInfo
                                    ? JSON.parse(data.data.responseInfo).data
                                      ? JSON.parse(data.data.responseInfo).data
                                          .risk
                                      : ""
                                    : "",
                                  //金融命中黑名单时间区段（枚举值）A,近半年;B,近半年到一年;C,近一年到二年;D,两年以上;"":空
                                  detail: JSON.parse(data.data.responseInfo)
                                    .data
                                    ? JSON.parse(data.data.responseInfo).data
                                        .finance.detail
                                    : []
                                });
                              } else {
                                this.shReport.push({
                                  status: null,
                                  risk: null,
                                  date: null, //金融命中黑名单时间区段（枚举值）A,近半年;B,近半年到一年;C,近一年到二年;D,两年以上;"":空
                                  detail: []
                                });
                              }
                            } else {
                              this.shReport.push({
                                status: null,
                                risk: null,
                                date: null, //金融命中黑名单时间区段（枚举值）A,近半年;B,近半年到一年;C,近一年到二年;D,两年以上;"":空
                                detail: []
                              });
                            }
                          } else {
                            this.shReport.push({
                              status: null,
                              risk: null,
                              date: null, //金融命中黑名单时间区段（枚举值）A,近半年;B,近半年到一年;C,近一年到二年;D,两年以上;"":空
                              detail: []
                            });
                          }
                          httpGettiqianfublacklistvarious(
                            this.customerInformation[0].chbrealName,
                            this.customerInformation[0].chbphoneNumber,
                            this.customerInformation[0].chbidcard,
                            9
                          ).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                              if (data.data) {
                                this.fljkReport.push({
                                  status: data.data.status
                                });
                              } else {
                                this.fljkReport.push({
                                  status: null
                                });
                              }
                            }
                            httpGettiqianfublacklistvarious(
                              this.customerInformation[0].chbrealName,
                              this.customerInformation[0].chbphoneNumber,
                              this.customerInformation[0].chbidcard,
                              14
                            ).then(res => {
                              let data = res.data;
                              if (data.code == 200) {
                                let obj = data.data;
                                if (data.data) {
                                  this.clReport.push({
                                    status: obj.status
                                      ? obj.status == "N" ? false : true
                                      : false,
                                    // isWhite: obj.isWhite ? obj.isWhite : true,
                                    // msginfo: obj.msginfo
                                    //   ? JSON.parse(obj.msginfo).data.result
                                    //   : "",
                                    blackLevel: obj.status
                                  });
                                } else {
                                  this.clReport.push({
                                    status: false,
                                    blackLevel: null
                                  });
                                }
                              }
                              this.blackListVisible = true;
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
      // console.log(this.customerInformation);
    },
    // 查询审核员列表
    queryAssessorList() {
      httpGetRoleNames()
        .then(res => {
          let data = res.data;
          this.assessorList = data;
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    getData(
      loginId,
      npage,
      pagesize,
      userName,
      mobile,
      idNo,
      startDateString,
      finshDateString,
      channel,
      operatorName
    ) {
      this.loading = true;
      let url =
        this.activename == "first"
          ? httpLoanapply
          : this.activename == "second"
            ? httpGetOverList
            : httpGetNotApplyOrder;
      url(
        loginId,
        npage,
        pagesize,
        userName,
        mobile,
        idNo,
        startDateString,
        finshDateString,
        channel,
        operatorName
      )
        .then(res => {
          let data = res.data;
          this.tableData = data.rows;
          this.total = data.total;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
    },
    //点击切换
    handleClick() {
      this.reset();
    },
    //重置
    reset() {
      this.search = {};
      this.npage = 1;
      this.pagesize = 10;
      this.getData(this.loginId, this.npage, this.pagesize);
    },
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.search.time && this.search.time.length) {
        this.getData(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.username,
          this.search.phone,
          this.search.idcard,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00",
          null,
          this.search.assessor
        );
      } else {
        this.getData(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.username,
          this.search.phone,
          this.search.idcard,
          null,
          null,
          null,
          this.search.assessor
        );
      }
    },
    examine(row) {
      this._httpGetCustomterMesage(row.id);
      this.listId = Number(row.id);
      this.approveResult = row.approveResult ? true : false;
    },
    handleCurrentChange(val) {
      this.npage = val;
      // this.getData(this.loginId, this.npage, this.pagesize);
      this.handleSearch(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // this.getData(this.loginId, this.npage, this.pagesize);
      this.handleSearch(false);
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
    }
  },
  mounted() {
    this.getData(this.loginId, this.npage, this.pagesize);
    this.queryAssessorList();
  }
};
</script>

<style>
.bgcolor {
  color: #436eee;
  background-color: #f3f3f3;
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

