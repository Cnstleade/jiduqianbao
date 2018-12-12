<template>
    <div class="container">
        <el-row>
            <el-alert
              title="审核员审核岗"
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
            <el-tab-pane label="审核中" name="first">
            </el-tab-pane>
            <el-tab-pane label="已审核" name="second"></el-tab-pane>
      <el-table class="m20"
                v-loading="loading"
                :data="tableData"
                     highlight-current-row style="width: 100%;font-weight:bold"
                border >
        <!--@selection-change="chooseSelect"-->
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="id" fixed label="ID" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="80"></el-table-column>
        <el-table-column label="审核人" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.operatorName === ''|| scope.row.operatorName === null">
              <el-button type="info" size="mini" @click="allotOperator(scope.row)">分配</el-button>
            </div>
            <span v-else>
              {{scope.row.operatorName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">
            <span>
              {{scope.row.source==='1'?'IOS':scope.row.source==='2'?'Android':'线上'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="idNo" label="身份证号" align="center" width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" width="100"></el-table-column>
        <!--<el-table-column prop="mobileDetails" label="手机详情" align="center"></el-table-column>-->
        <el-table-column label="贷款状态" align="center">
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
        <el-table-column prop="applyAmt" label="授信额度" align="center"></el-table-column>
        <el-table-column prop="approveAmt" label="通过金额" align="center"></el-table-column>
        <el-table-column label="审核结果" align="center" width="160">
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
        <el-table-column prop="approverName" label="审核经理" align="center"></el-table-column>

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
        <el-table-column label="操作" align="center">
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
                                 <el-table-column prop="chbrealName" fixed align="center" label="姓名"  width="80">
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
                                <el-table-column prop="applyAmt"  label="审核结果" align="center" min-width="160">
                                  <template    slot-scope="scope" align="center">
                                   <el-button :type="activename=='three'?'danger':'primary'"  :disabled="activename=='three'"  @click="addResult">添加审核结果</el-button>
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
          <el-dialog title="审核结果" :visible.sync="dialogResult"  append-to-body width="30%"   center>
            <el-row class="col-flex">
             <el-button type="success">最低授信额度{{chooseMoneyVo.minMoney}}</el-button>  <el-button class="l20" type="success">最高授信额度{{chooseMoneyVo.maxMoney}}</el-button>

            </el-row>
            <el-form class="m20" ref="resultForm"  :model="resultForm" label-width="100px" :rules="rules">

              <el-form-item label="备注" >
                 <el-input type="textarea" v-model="resultForm.desc"></el-input>   
              </el-form-item>
              <el-form-item label="审核结果" prop="status">
                <el-radio-group v-model="resultForm.status">
                  <el-radio label="1">通过</el-radio>
                  <el-radio label="2">驳回</el-radio>
                  <el-radio label="3">拒绝</el-radio>
                </el-radio-group>   
              </el-form-item>   
              <el-form-item label="审核金额"  v-if="resultForm.status==1" prop="age">
                  <el-input  v-model.number="resultForm.age" auto-complete="off"></el-input>
                 <!-- <el-slider v-model="resultForm.money" :format-tooltip="formatTooltip"
                 :step="1"
                 show-input='true'
                   :min="chooseMoneyVo.minMoney/((chooseMoneyVo.maxMoney+500)/100)"
                 :max="chooseMoneyVo.maxMoney/((chooseMoneyVo.maxMoney+500)/100)"
                 ></el-slider> -->
              </el-form-item>                   
              <el-form-item label="驳回理由"  v-if="resultForm.status==2" prop="overruleId">
                <el-select v-model="resultForm.overruleId" placeholder="请选择驳回理由">
                  <el-option label="用户电话打不通" value="1"></el-option>
                  <!-- <el-option label="录音不完整" value="2"></el-option> -->
                  <el-option label="不需要借款" value="3"></el-option>
                </el-select>
              </el-form-item>              
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogResult = false">取 消</el-button>
              <el-button :disabled="resultFormBoolean" type="primary" @click="submitForm('resultForm')">确 定</el-button>
            </div>
          </el-dialog>                               
        </el-dialog>                         
      </el-tabs>
    </div>    
</template>

<script>
import { mapGetters } from "vuex";
import { timeFormat } from "../../../config/time";
import {
  httpSysUnderReviewList,
  httpGetApplyed,
  httpGetCustomterMesage,
  httpGetCreditReport,
  httpParametershow,
  httpUpdataLoanApply
} from "@/service/http";
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入金额"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          console.log(
            this.chooseMoneyVo.minMoney >= value ||
              value >= this.chooseMoneyVo.maxMoney
          );
          if (
            this.chooseMoneyVo.minMoney > value ||
            value > this.chooseMoneyVo.maxMoney
          ) {
            callback(new Error("必须大于等于最小额度或小于等于最小额度"));
          } else {
            callback();
          }
        }
      }, 500);
    };
    return {
      resultFormBoolean: false,
      activename: "first",
      search: {},
      npage: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      tableData: [],
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
      //审核结果
      dialogResult: false,
      chooseMoneyVo: {}, //金钱判断
      resultForm: {},
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        recallResult: [
          { required: true, message: "请填写回访结果", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请填写短信内容", trigger: "blur" }
        ],
        salesmanId: [
          { required: true, message: "请选择电销人员", trigger: "change" }
        ],
        recallType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        platformName: [
          { required: true, message: "请选择平台", trigger: "change" }
        ],
        assessor: [
          { required: true, message: "请选择审核员", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择审核结果", trigger: "change" }
        ],
        overruleId: [
          { required: true, message: "请选择驳回理由", trigger: "change" }
        ],
        age: [{ validator: checkNum, trigger: "blur" }]
      },
      chooseMoneyVo: {}
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
    //得到系统参数
    _httpParametershow() {
      httpParametershow()
        .then(res => {
          let data = res.data;
          data.sysParams.forEach(v => {
            if (v.type == 1) {
              this.chooseMoneyVo.minMoney = v.param;
            }
            if (v.type == 3) {
              this.chooseMoneyVo.maxMoney = v.param;
            }
          });
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
      channel
    ) {
      this.loading = true;
      let url =
        this.activename == "first"
          ? httpSysUnderReviewList
          : this.activename == "second" ? httpGetApplyed : "";
      url(
        loginId,
        npage,
        pagesize,
        userName,
        mobile,
        idNo,
        startDateString,
        finshDateString,
        channel
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
    handleCurrentChange(val) {
      this.npage = val;
      this.getData(this.loginId, this.npage, this.pagesize);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData(this.loginId, this.npage, this.pagesize);
    },
    handleSearch() {
      if (this.search.time && this.search.time.length) {
        this.getData(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.username,
          this.search.phone,
          this.search.idcard,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00"
        );
      } else {
        this.getData(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.username,
          this.search.phone,
          this.search.idcard
        );
      }
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
    checkContacts() {
      this.contactList = true;
    },
    clickImg(e, src) {
      this.innerImgVisible = true;
      // 获取当前图片地址
      this.imgSrc = src;
    },
    //添加审核结果
    addResult() {
      this.resultFormBoolean = false;
      this.resultForm = {};
      this.dialogResult = true;
    },
    //提交
    _httpUpdataLoanApply(type, id, approveAmt, remark, loginId, overruleId) {
      httpUpdataLoanApply(type, id, approveAmt, remark, loginId, overruleId)
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.outerVisible = false;
            this.$message({
              message: data.message,
              type: "success"
            });
            this.dialogResult = false;
            this.reset();
          } else {
            this.$message.error(data.message);
            this.resultFormBoolean = false;
          }
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
          this.resultFormBoolean = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "resultForm") {
            this.resultFormBoolean = true;
            // if (
            //   this.resultForm.status != 1 &&
            //   (this.resultForm.desc == null ||
            //     this.resultForm.desc == undefined ||
            //     this.resultForm.desc == "")
            // ) {
            //   this.$message.error("请填写备注信息");
            // } else {

            this._httpUpdataLoanApply(
              this.resultForm.status,
              this.listId,
              this.resultForm.age,
              this.resultForm.desc,
              this.loginId,
              this.resultForm.overruleId
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getData(this.loginId, this.npage, this.pagesize);
    this._httpParametershow();
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

