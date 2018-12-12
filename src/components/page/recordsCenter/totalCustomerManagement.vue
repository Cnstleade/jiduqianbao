<template>
    <div class="container">
        <el-row>
            <el-alert
              title="客户列表"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row> 
        <el-row class="m20">
            <el-col  class="col-flex-end">
                 <el-button  type="primary" @click="reset">重置</el-button>
                    <el-select class="l20" v-model="search.source" placeholder="订单状态">
                      <el-option
                        v-for="item in search.sources"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入姓名"
                          v-model="search.realName"
                          clearable>
                        </el-input> 
                    </div> 
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号码"
                          v-model="search.phoneNumber"
                          clearable>
                        </el-input> 
                    </div> 
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入身份证 "
                          v-model="search.idcard"
                          clearable>
                        </el-input> 
                    </div>                                                                        
                    <el-button @click="handleSearch" class="l20" style="margin-left:10px" icon="el-icon-search"  type="success" circle></el-button>                     
            </el-col>            
        </el-row>    
           
        <el-row class="m20">
            <el-table
                    :data="tableData"
                    border
                        highlight-current-row style="width: 100%;font-weight:bold"
                      v-loading="loading"
                      id="text"
              >
                <el-table-column prop="id" fixed   align="center" label="ID"  width="60" sortable></el-table-column>
                <el-table-column prop="realName"  align="center" label="姓名"  width="100" ></el-table-column>
                <el-table-column prop="source"  align="center" label="来源"  width="80"
                         :filters="[{ value: 1, text: '苹果' }, { value: 2, text: '安卓' }, { value: 3, text: '网页' }]"
                         :filter-method="filterSource"                   
                   >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.source===1?'':scope.row.source===2?'success':'danger'"
                      >{{scope.row.source===1?'苹果':scope.row.source===2?'安卓':'网页'}}</el-tag>
                  </template> 
                </el-table-column>
                <!-- <el-table-column prop="xb"  align="center" label="性别"   ></el-table-column> -->
                <el-table-column prop="idcard"  align="center" label="身份证号" width="150" ></el-table-column>
                <!-- <el-table-column prop="em"  align="center" label="Email"   ></el-table-column> -->
                <el-table-column prop="phoneNumber"  align="center" label="手机号"  width="120" ></el-table-column>
                <el-table-column prop="wxNumber"  align="center" label="微信号" width="120"  >
                  <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.wxNumber" placement="top">
                              <span>{{scope.row.wxNumber}}</span>
                          </el-tooltip>
                    </template>                   
                  </el-table-column>                
                <el-table-column prop="zmScore"  align="center" label="芝麻分" width="80"  ></el-table-column>    
                <el-table-column prop="lastLoginTime"  align="center" label="上次登录时间"  width="150"  sortable>
                  <template slot-scope="scope">
                      {{scope.row.lastLoginTime|dateServer}}
                  </template>                  
                </el-table-column>                            
                <el-table-column prop="detailAddress"  align="center" label="详细地址" min-width="200"  >
                        <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.detailAddress" placement="top">
                              <span>{{scope.row.detailAddress}}</span>
                          </el-tooltip>
                    </template> 
                </el-table-column>
                <el-table-column prop="createTime"  align="center" label="注册时间"  width="150"  sortable>
                  <template slot-scope="scope">
                      {{scope.row.createTime|dateServer}}
                  </template>                  
                </el-table-column>
                <!-- <el-table-column prop="mariage"  align="center" label="婚姻状况"  width="100"
                         :filters="[{ value: 1, text: '未婚' }, { value: 2, text: '已婚' }, { value: 3, text: '离婚' }]"
                         :filter-method="filterMariage"                 
                 >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.mariage===1?'':scope.row.mariage===2?'success':'danger'"
                      >{{scope.row.mariage===1?'未婚':scope.row.mariage===2?'已婚':'离婚'}}</el-tag>
                  </template>                     
                </el-table-column> -->
                <!-- <el-table-column prop="eduBack"  align="center" label="教育背景"   width="100"
                         :filters="[{ value: 1, text: '高中' }, { value: 2, text: '大专' }, { value: 3, text: '本科' }, { value: 4, text: '硕士' }, { value: 5, text: '博士' }]"
                         :filter-method="filterEduBack"                   
                  >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.eduBack===1?'':scope.row.eduBack===2?'success':scope.row.eduBack===3?'info':scope.row.eduBack===4?'warning':scope.row.eduBack===5?'danger':''"
                      >{{scope.row.eduBack===1?'高中':scope.row.eduBack===2?'大专':scope.row.eduBack===3?'本科':scope.row.eduBack===4?'硕士':scope.row.eduBack===5?'博士':'其它'}}</el-tag>
                  </template>   
                </el-table-column> -->
                <el-table-column prop="isDel"  align="center" label="是否黑名单"  width="90" 
                  >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.eduBack===1?'success':'danger'"
                      >{{scope.row.isDel===1?'是':'否'}}</el-tag>
                  </template>                      
                </el-table-column>  
                <!-- <el-table-column prop="status"  align="center" label="状态"   width="150"
                         :filters="[{ value: 1, text: '业务员维护中' }, { value: 2, text: '审核分配中 ' }, { value: 3, text: '审核中' }, { value: 4, text: '弃用' }, { value: 0, text: '停用' }]"
                         :filter-method="filterStatus"                 
                  >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.status===1?'':scope.row.status===2?'success':scope.row.status===3?'info':scope.row.status===4?'warning':'danger'"
                      >{{scope.row.status===1?'业务员维护中':scope.row.status===2?'审核分配中':scope.row.status===3?'审核中':scope.row.status===4?'弃用':'停用'}}</el-tag>
                  </template>   
                </el-table-column>                           -->
                <el-table-column prop="status"  align="center" label="状态"   width="80"
                         :filters="[{ value: 1, text: '正常' },  { value: 0, text: '冻结' }]"
                         :filter-method="filterStatus"                 
                  >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.status===1?'':'danger'"
                      >{{scope.row.status===1?'正常':'冻结'}}</el-tag>
                  </template>   
                </el-table-column>                  
                <el-table-column prop="cz"  align="center" label="操作"  width="220" >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                
                    <el-button
                        size="mini"
                        type="danger"
                        :disabled="scope.row.status===1?false:true"
                        @click="handleDongjie(scope.$index, scope.row)">冻结</el-button>

                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>                        
                    </template>                     
                </el-table-column>
            </el-table>
        </el-row> 
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
            :visible.sync="checkVisible"
              width="95%"
              title="客户信息表"
              center
            
         >

            <el-row style="overflow: hidden;">
                <table class="table" >
                    <tr>
                        <th valign="middle" colspan="6" class="bgcolor">
                            客户基本信息
                        </th>
                    </tr>
                    <tr class="title_6" >
                        <td colspan="6">
                            <el-table
                                    :data="userData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold"
                            >
                                <el-table-column prop="realName" fixed label="姓名" align="center" width="120"></el-table-column>
                                <el-table-column prop="status"  align="center" label="状态"   width="150"
                                  >
                                  <template slot-scope="scope">
                                                           <el-tag
                          :type="scope.row.status===1?'':'danger'"
                      >{{scope.row.status===1?'正常':'冻结'}}</el-tag>
                                  </template>   
                                </el-table-column> 
                                <el-table-column prop="idcard" label="身份证号" align="center" width="180"></el-table-column>
                                <el-table-column prop="phoneNumber" label="手机号" align="center" width="140"></el-table-column>
                                <el-table-column prop="bankcard" label="银行卡号" align="center" width="180" ></el-table-column>
                                <el-table-column prop="wxNumber" label="微信号" align="center" width="180" ></el-table-column>
                                <!-- <el-table-column prop="qqNumber" label="QQ" align="center" ></el-table-column> -->
                                <el-table-column prop="detailAddress" label="地址" align="center" width="500"></el-table-column>
                                <!-- <el-table-column prop="mariage"  align="center" label="婚姻状况"  width="100"
                                 >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.mariage===1?'':scope.row.mariage===2?'success':'danger'"
                                      >{{scope.row.mariage===1?'未婚':scope.row.mariage===2?'已婚':'离婚'}}</el-tag>
                                  </template>                     
                                </el-table-column>     -->
                                <!-- <el-table-column prop="eduBack"  align="center" label="教育背景"   width="100"
                                  >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.eduBack===1?'':scope.row.eduBack===2?'success':scope.row.eduBack===3?'info':scope.row.eduBack===4?'warning':scope.row.eduBack===5?'danger':''"
                                      >{{scope.row.eduBack===1?'高中':scope.row.eduBack===2?'大专':scope.row.eduBack===3?'本科':scope.row.eduBack===4?'硕士':scope.row.eduBack===5?'博士':'其它'}}</el-tag>
                                  </template>   
                                </el-table-column>    -->
                                <el-table-column prop="source"  align="center" label="来源"  width="80"
                                   >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.source===1?'':scope.row.source===2?'success':'danger'"
                                      >{{scope.row.source===1?'苹果':scope.row.source===2?'安卓':'网页'}}</el-tag>
                                  </template> 
                                </el-table-column>                                                                                         
                            </el-table>
                        </td>
                    </tr>
                     
                    <!-- <tr>
                        <th  class="bgcolor "  >联系人信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="rzData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="relationship" align="center" label="关系"  width="100"></el-table-column>
                                <el-table-column prop="real_name" align="center" label="姓名"  width="100"></el-table-column>
                                <el-table-column prop="mob_number" align="center"  label="电话号码" width="120"></el-table-column>
                                <el-table-column prop="address"  align="center" label="地址" ></el-table-column>
                            </el-table>
                        </td>
                    </tr> -->
                    <!-- <tr>
                        <th  class="bgcolor">联系人信息</th>
                        <td colspan="5" >
                            <table class="table table_2">
                                &nbsp;
                            </table>
                        </td>
                    </tr> -->
                    <!-- <tr>
                        <th  class="bgcolor">授权验证</th>
                        <td colspan="5" >
                            <el-table
                                    :data="sqData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="xxw"   label="学信网密码"   ></el-table-column>
                                <el-table-column prop="sjfw"  label="手机服务密码"></el-table-column>
                                <el-table-column prop="tbzh"  label="淘宝帐号" ></el-table-column>
                                <el-table-column prop="tbmm"  label="淘宝密码" ></el-table-column>
                                <el-table-column prop="jdzh"  label="京东帐号" ></el-table-column>
                                <el-table-column prop="jdmm"  label="京东密码" ></el-table-column>
                            </el-table>
                        </td>
                    </tr> -->
                    <tr>
                        <th  class="bgcolor">认证资料</th>
                        <td colspan="5" >
                            <el-row >
                                <el-col :span="3"   v-for="(o, index) in idCardImgs" :key="o.label" :offset="index > 0 ? 1 : 0">
                                    <template>
                                        <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                            <img @click="handleImgShow(o.src)" :src="o.src" class="image">
                                            <div style="padding: 14px;text-align:center">
                                                <span>{{o.label}}</span>
                                            </div>
                                        </el-card>
                                    </template>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <th valign="middle" colspan="6" style="color: #436EEE;background-color: #f3f3f3;">
                            关联信息
                        </th>
                    </tr>
                    <tr>
                        <th  class="bgcolor">钱包信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="qbData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="status" fixed   label="钱包状态"   align="center" ></el-table-column>
                                <el-table-column prop="createTime"  label="注册时间" align="center">
                                  <template slot-scope="scope" align="center">
                                      {{scope.row.createTime|dateServer}}
                                  </template>                                    
                                </el-table-column>
                                <el-table-column prop="applyAmt"  label="审核金额" align="center" ></el-table-column>
                                <el-table-column prop="approveAmt"  label="签约金额" align="center" ></el-table-column>    
                                <el-table-column prop="applyTime"  label="申请时间" align="center">
                                  <template slot-scope="scope" align="center">
                                      {{scope.row.applyTime|dateServer}}
                                  </template>                                    
                                </el-table-column>                                
                            </el-table>
                        </td>
                    </tr>
                   <tr>
                        <th  class="bgcolor "  >滴滴出行信息</th>
                        <td colspan="5" >
                            <template v-if='ddShow'>
                                <el-table
                                        :data="ddData.slice(0,5)"
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
                            <template v-if='!ddShow'>
                                <el-table
                                        :data="ddData"
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
                        <th  class="bgcolor">银行卡信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="yhkData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="cardNum"  fixed  label="卡号"   align="center" width="240" ></el-table-column>
                                <el-table-column prop="name"   label="姓名"   align="center" width="100"></el-table-column>
                                <el-table-column prop="bankName"   label="银行"   align="center" width="240"></el-table-column>
                                <el-table-column prop="idNum"   label="身份证"   align="center" width="240"></el-table-column>
                                <el-table-column prop="createTime"  label="时间" align="center" width="240">
                                  <template slot-scope="scope" align="center">
                                      {{scope.row.createTime|dateServer}}
                                  </template>                                    
                                </el-table-column>
                                <!-- <el-table-column prop="protocolNo"  label="宝付返还接口" align="center" min-width="300" ></el-table-column> -->
                              
                            </el-table>
                        </td>
                    </tr>                    
                    <tr>
                        <th  class="bgcolor">提现账单信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="fqzdData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="id" fixed  align="center" label="ID"  width="50" ></el-table-column>
                                <el-table-column prop="borrowDay" align="center" label="借款期限" width="200"></el-table-column>
                                <el-table-column prop="borrowTime" align="center" width="180" label="借款时间">
                                  <template slot-scope="scope">
                                      {{scope.row.borrowTime|dateServer}}
                                  </template>                                    
                                </el-table-column>  
                                <el-table-column prop="returnTime" align="center" width="180" label="应还款日期">
                                  <template slot-scope="scope">
                                      {{scope.row.returnTime|dateServer2}}
                                  </template>                                    
                                </el-table-column>  
                                <el-table-column prop="returnMoney" align="center"  label="还款金额" ></el-table-column>
                                <el-table-column prop="raiseMoney" align="center"  label="提现金额" ></el-table-column>
                                <el-table-column prop="status" label="状态" align="center" 
                                >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.status===0?'':scope.row.status===1?'success':scope.row.status===2?'danger':scope.row.status===4?'success':scope.row.status===4?'info':scope.row.status===5?'':'warning'"
                                      >{{scope.row.status===0?'放款中':scope.row.status===1?'放款成功':scope.row.status===2?'逾期':scope.row.status===3?'还款成功':scope.row.status===4?'放款失败':scope.row.status===5?'还款中':'还款失败'}}</el-tag>
                                  </template>                         
                                </el-table-column>                            
                            </el-table>
                        </td>
                    </tr>
                    <tr>
                        <th  class="bgcolor">还款记录</th>
                        <td colspan="5" >
                            <el-table
                                    :data="hkjlData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="withdrawInfoId" fixed align="center"  label="id"  width="50" ></el-table-column>
                                <el-table-column prop="type"  align="center" label="还款类型"   width="150"
                                  >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.type===1?'':'success'"
                                      >{{scope.row.type===1?'app还款':'线下还款'}}</el-tag>
                                  </template>   
                                </el-table-column>                                 
                                <el-table-column prop="mustPayBackAmt" align="center" label="应还款" width="200"></el-table-column>
                                              <el-table-column prop="actualPayBackAmt" align="center"  label="实际还款" >         
                                                                          <!-- <template slot-scope="scope">                         
                                                                                          {{((scope.row.actualPayBackAmt/100).toFixed(2))}} 
                                                                                                                            </template>   -->
                                                                                                                             </el-table-column>
                                <el-table-column prop="backDate"  align="center" width="180" label="还款时间">
                                  <template slot-scope="scope">
                                      {{scope.row.backDate|dateServer}}
                                  </template>                                    
                                </el-table-column>  
                                <el-table-column prop="createTime" align="center"  width="180" label="更新时间">
                                  <template slot-scope="scope">
                                      {{scope.row.createTime|dateServer}}
                                  </template>                                    
                                </el-table-column>                                                                  
                                <el-table-column prop="bankCardNumber"  align="center" width="180" label="还款银行卡卡号" ></el-table-column>
                                <el-table-column prop="custname"  align="center" label="用户名" ></el-table-column>
                                <el-table-column prop="success"  align="center" width="140" label="是否还款成功" >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.success?'success':'danger'"
                                      >{{scope.row.success?'成功':'失败'}}</el-tag>
                                  </template>                                     
                                </el-table-column>
                                <!-- <el-table-column prop="nomal"  align="center"  width="140"  label="是否是正常还款" >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.nomal?'success':'danger'"
                                      >{{scope.row.nomal?'是':'否'}}</el-tag>
                                  </template>                                     
                                </el-table-column> -->
                            </el-table>
                        </td>
                    </tr>
                    <tr>
                        <th  class="bgcolor">滞纳金记录</th>
                        <td colspan="5" >
                            <el-table
                                    :data="zljData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="applyTime" fixed  align="center" label="申请时间"  width="180" >
                                  <template slot-scope="scope">
                                      {{scope.row.applyTime|dateServer}}
                                  </template>    
                                </el-table-column>
                                <el-table-column prop="revertTime" align="center" label="理应还款时间" width="180" >
                                  <template slot-scope="scope">
                                   {{scope.row.revertTime?(scope.row.revertTime|dateServer2):''}}
                                  </template> 
                                </el-table-column>
                                <el-table-column prop="repayStatus" align="center"  label="还款情况" >
                                  <template slot-scope="scope">
                                      <el-tag
                                          :type="scope.row.repayStatus==1?'success':'danger'"
                                      >{{scope.row.repayStatus==1?'已还':'未还'}}</el-tag>
                                  </template>   
                                </el-table-column>
                                <el-table-column prop="overdueDay"  align="center" label="逾期天数" ></el-table-column>
                                <el-table-column prop="lateFee"  label="滞纳金" ></el-table-column>
                                <el-table-column prop="updateTime" align="center"  label="最后更新时间" >
                                  <template slot-scope="scope">
                                      {{scope.row.updateTime|dateServer}}
                                  </template> 
                                </el-table-column>
                                <el-table-column prop="withdraw" align="center"  label="提现金额" ></el-table-column>
                            </el-table>
                        </td>
                    </tr>
                    <tr>
                        <th valign="middle" colspan="6" style="color: #436EEE;background-color: #f3f3f3;">
                            客户回访
                        </th>
                    </tr>
                    <tr>
                        <th  class="bgcolor" style="color: #436EEE">回访记录</th>
                        <td colspan="5" >
                            <el-table
                                    :data="hfjlData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="id" fixed  align="center" label="序号" width="100"></el-table-column>
                                <el-table-column prop="userName" align="center" label="用户名" width="100" ></el-table-column>
                                <el-table-column prop="userMobile" align="center" label="手机号" width="120" ></el-table-column>
                                <el-table-column prop="salesmanName"  align="center" label=催收员 width="100"></el-table-column>
                                <el-table-column prop="createTime"  align="center" label="创建时间" width="180" >
                        <template slot-scope="scope">
                            {{scope.row.createTime|dateServer}}
                        </template>                                      
                                </el-table-column>
                                <el-table-column prop="updateTime" align="center" label="更新时间" width="180" >
                        <template slot-scope="scope">
                            {{scope.row.updateTime|dateServer}}
                        </template>                                      
                                </el-table-column>
                                <el-table-column prop="recallResult" align="center" label="回访结果"  ></el-table-column>
                                <el-table-column prop="remark" align="center" label="备注" ></el-table-column>
                            </el-table>
                        </td>
                    </tr>
                    <!-- <tr>
                        <th  class="bgcolor">通话记录</th>
                        <td colspan="5" >
                            <table class="table table_2">
                                &nbsp;
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th  class="bgcolor">信用变更记录</th>
                        <td colspan="5" >
                            <table class="table table_2">
                                &nbsp;
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <th  class="bgcolor">客户信用调整</th>
                        <td colspan="5" >
                            <el-row >
                                <el-col :span="3">
                                  当前信用度：<strong style="color:red">{{score.score}}</strong>
                                </el-col>                                
                                <el-col :span="21">
                                   <el-form :inline="true" :model="score" class="demo-form-inline">

                                    <el-form-item >
                                      <el-select v-model="score.method" placeholder="加">
                                            <el-option
                                                    v-for="item in score.methods"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                      </el-select>
                                    </el-form-item>
                                    <el-form-item >
                                      <el-select v-model="score.scores" placeholder="1分">
                                            <el-option
                                                    v-for="item in score.scoress"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                      </el-select>
                                    </el-form-item> 
                                    <el-form-item label="调整原因">
                                      <el-input v-model="score.message" placeholder="请输入调整原因"></el-input>
                                    </el-form-item>                                                                       
                                    <el-form-item>
                                      <el-button type="primary" @click="onSubmit">确定</el-button>
                                    </el-form-item>
                                   </el-form>
                                </el-col>
                            </el-row>
                        </td>
                    </tr> -->
                </table>
            </el-row> 
            <el-dialog
              id="dialog"
              width="80%"
              top="100px"
              title="照片信息"
              :visible.sync="innerImgVisible"
              append-to-body>
                    <!-- <template v-for="(o,index) in idCardImgs">
                      <el-card v-if="index==  Math.abs(imgIndex)"  :key="o.label" :body-style="{ padding: '0px' }"  shadow="never">
                          <img @click="handleImgShow" :src="o.src" class="imgCenter">
               
                      </el-card>
                    </template> -->
                    <template>
                      <el-card  :body-style="{ padding: '0px' }"  shadow="never">
                          <img  :src="imgStr" class="imgCenter">
                          <!-- <div style="padding: 14px;text-align:center">
                            <span>{{o.label}}</span>
                          </div>                                     -->
                      </el-card>
                    </template>
                    <!-- <button type="button" @click="changImgIndex(-1)" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left"></i></button>   
                    <button type="button"   @click="changImgIndex(1)" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"></i></button>                        -->
            </el-dialog>   
        </el-dialog>     
       <el-dialog
          title="编辑用户"
          :visible.sync="dialogVisible2"
          center
          width="30%"
          id="xzjs"
          >
            <el-form  :rules="rules" :model="ruleForm3" status-icon  ref="ruleForm3" label-width="100px" >
              <!-- <el-form-item label="id" >
                <el-input v-model="ruleForm3.id" disabled ></el-input>
              </el-form-item> -->
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="ruleForm3.realName"></el-input>
              </el-form-item>  
              <!-- <el-form-item label="用户密码" prop="password">
                <el-input v-model="ruleForm3.password" ></el-input>
              </el-form-item>   -->
              <el-form-item label="手机号" prop="phoneNumber">
                <el-input v-model="ruleForm3.phoneNumber" ></el-input>
              </el-form-item>  
              <el-form-item label="微信号" >
                <el-input v-model="ruleForm3.wxNumber" ></el-input>
              </el-form-item>  
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="ruleForm3.idcard" ></el-input>
              </el-form-item>                 
              <el-form-item label="详细地址" prop="detailAddress">
                <el-input type="textarea" v-model="ruleForm3.detailAddress"></el-input>
              </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm3')">提交</el-button>
                  <el-button @click="dialogVisible2=false">取消</el-button>
                </el-form-item>
            </el-form>       
        </el-dialog> 
    </div>
</template>

<script>
import { timeFormat } from "../../../config/time";
import { mapGetters } from "vuex";
import {
  getCustUserList,
  getCustomerPage,
  httpUpdateCuster,
  httpSysUpdateUser
} from "../../../service/http";
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value != null && value != "") {
        var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|19[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (!reg.test(value)) {
          return callback(new Error("请输入正确手机号码！"));
        } else {
          callback();
        }
      } else {
        return callback(new Error("请输入正确手机号码！"));
      }
    };
    var validateIdNo = (rule, value, callback) => {
      if (value != null && value != "") {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(value)) {
          return callback(new Error("您输入的身份证不合法！"));
        } else {
          callback();
        }
      } else {
        return callback(new Error("请输入身份证号码！"));
      }
    };
    return {
      rules: {
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],

        phoneNumber: [
          { require: true, validator: validateMobile, trigger: "change" }
        ],
        idcard: [{ require: true, validator: validateIdNo, trigger: "change" }]
      },
      ruleForm3: {},
      dialogVisible2: false,
      imgStr: "",
      ddShow: true,
      tableData: [],
      loading: true,
      checkVisible: false,
      innerImgVisible: false,
      imgIndex: 0,
      total: 0,
      npage: 1,
      pagesize: 10,
      userData: [],
      rzData: [],
      sqData: [
        {
          xxw: "-",
          sjfw: "-",
          tbzh: "-",
          tbmm: "-",
          jdzh: "-",
          jdmm: "-"
        }
      ],
      ddData: [],
      idCardImgs: [],
      qbData: [],
      fqzdData: [],
      yhkData: [],
      hkjlData: [
        {
          xh: "253",
          id: "254",
          hkje: 500.0,
          qs: 14,
          hklx: "分月",
          zlj: "40.00",
          hksj: "2017-03-28 15:06:49",
          cz: "查看"
        }
      ],
      zljData: [],
      hfjlData: [
        {
          xh: "28663",
          hfsj: "2017-05-10",
          hfr: "潘月",
          jg: "1",
          bz:
            "致电客户父亲电话称客户喜欢赌博，年前已经帮客户还了很多欠款了，客户去年离婚的，小孩自己在带，要求我司正常程序催缴客户还款，自己无力偿还",
          fj: "查看附件"
        },
        {
          xh: "28663",
          hfsj: "2017-05-10",
          hfr: "潘月",
          jg: "1",
          bz:
            "致电客户父亲电话称客户喜欢赌博，年前已经帮客户还了很多欠款了，客户去年离婚的，小孩自己在带，要求我司正常程序催缴客户还款，自己无力偿还",
          fj: "查看附件"
        },
        {
          xh: "28663",
          hfsj: "2017-05-10",
          hfr: "潘月",
          jg: "1",
          bz:
            "致电客户父亲电话称客户喜欢赌博，年前已经帮客户还了很多欠款了，客户去年离婚的，小孩自己在带，要求我司正常程序催缴客户还款，自己无力偿还",
          fj: "查看附件"
        },
        {
          xh: "28663",
          hfsj: "2017-05-10",
          hfr: "潘月",
          jg: "1",
          bz:
            "致电客户父亲电话称客户喜欢赌博，年前已经帮客户还了很多欠款了，客户去年离婚的，小孩自己在带，要求我司正常程序催缴客户还款，自己无力偿还",
          fj: "查看附件"
        },
        {
          xh: "28663",
          hfsj: "2017-05-10",
          hfr: "潘月",
          jg: "1",
          bz:
            "致电客户父亲电话称客户喜欢赌博，年前已经帮客户还了很多欠款了，客户去年离婚的，小孩自己在带，要求我司正常程序催缴客户还款，自己无力偿还",
          fj: "查看附件"
        }
      ],
      score: {
        score: 100,
        method: "",
        scores: "",
        methods: [{ value: 1, label: "加" }, { value: 0, label: "减" }],
        scoress: [
          { value: 1, label: "1分" },
          { value: 2, label: "2分" },
          { value: 3, label: "3分" },
          { value: 4, label: "4分" },
          { value: 5, label: "5分" },
          { value: 6, label: "6分" },
          { value: 7, label: "7分" },
          { value: 8, label: "8分" },
          { value: 9, label: "9分" },
          { value: 10, label: "10分" }
        ],
        message: ""
      },
      search: {
        source: null,
        sources: [
          { label: "全部", value: null },
          { label: "android", value: 2 },
          { label: "ios", value: 1 },
          { label: "网页", value: 3 }
        ],
        realName: null,
        phoneNumber: null,
        idcard: null
      }
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
    _httpSysUpdateUser(
      loginId,
      id,
      phoneNumber,
      wxNumber,
      idcard,
      totalCustomerManagement,
      realName
    ) {
      httpSysUpdateUser(
        loginId,
        id,
        phoneNumber,
        wxNumber,
        idcard,
        totalCustomerManagement,
        realName
      )
        .then(res => {
          let data = res.data;
          if (data.success) {
            this.dialogVisible2 = false;
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.handleSearch();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    getData(npage, pagesize, source, realName, phoneNumber, idcard) {
      this.loading = true;
      getCustUserList(npage, pagesize, source, realName, phoneNumber, idcard)
        .then(res => {
          let data = res.data;
          this.tableData = data.rows;
          this.total = data.total;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    reset() {
      this.npage = 1;
      this.pagesize = 10;
      this.search = {
        sources: [
          { label: "全部", value: null },
          { label: "android", value: 2 },
          { label: "ios", value: 1 },
          { label: "网页", value: 3 }
        ]
      };
      this.handleSearch();
    },
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      this.getData(
        this.npage,
        this.pagesize,
        this.search.source,
        this.search.realName,
        this.search.phoneNumber,
        this.search.idcard
      );
    },
    handleDetail(index, row) {
      console.log(row);
      let _this = this;
      let CustUserId = row.id;
      _this.userData ? (_this.userData.length = 0) : (_this.userData = []);
      _this.rzData ? (_this.rzData.length = 0) : (_this.rzData = []);
      _this.qbData ? (_this.qbData.length = 0) : (_this.qbData = []);
      _this.fqzdData ? (_this.fqzdData.length = 0) : (_this.fqzdData = []);
      _this.ddData ? (_this.ddData.length = 0) : (_this.ddData = []);
      _this.yhkData ? (_this.yhkData.length = 0) : (_this.yhkData = []);
      _this.hkjlData ? (_this.hkjlData.length = 0) : (_this.hkjlData = []);
      _this.zljData ? (_this.zljData.length = 0) : (_this.zljData = []);
      _this.hfjlData ? (_this.hfjlData.length = 0) : (_this.hfjlData = []);
      _this.idCardImgs
        ? (_this.idCardImgs.length = 0)
        : (_this.idCardImgs = []);
      getCustomerPage(CustUserId)
        .then(res => {
          let data = res.data;
          _this.userData.push(row);
          _this.rzData = data.contactUserDOList;
          _this.idCardImgs = [
            {
              src:
                data.custIdcardImageList && data.custIdcardImageList[0]
                  ? data.custIdcardImageList[0].fullfaceUrl
                  : "",
              label: "身份证正面"
            },
            {
              src:
                data.custIdcardImageList && data.custIdcardImageList[0]
                  ? data.custIdcardImageList[0].reverseStorageUrl
                  : "",
              label: "身份证反面"
            },
            {
              src:
                data.custIdcardImageList && data.custIdcardImageList[0]
                  ? data.custIdcardImageList[0].handStorageUrl
                  : "",
              label: "活体认证照片"
            }
            // {
            //   src:
            //     data.custIdcardImageList && data.custIdcardImageList[0]
            //       ? data.custIdcardImageList[0].handStorageUrl
            //       : "",
            //   label: "手持照"
            // }
          ];
          _this.qbData.push(data.walletMessage);
          _this.fqzdData = data.withDrawDOList;
          _this.hkjlData = data.loanRepaymentList;
          _this.ddData = data.didiOrderVoList;
          _this.yhkData = data.bankCardDTOVoList;
          _this.zljData = data.overdueList;

          _this.hfjlData = data.salesmanRecallList;
          _this.checkVisible = true;
        })
        .catch();
    },
    handleDongjie(index, row) {
      let CustUserId = row.id;
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    log() {
      console.log(this.multipleSelection);
    },
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch(false);
    },

    handleImgShow(src) {
      this.imgStr = src;
      this.innerImgVisible = true;
    },
    changImgIndex(i) {
      console.log(this.imgIndex, this.idCardImgs.length);
      this.imgIndex = (this.imgIndex + i) % this.idCardImgs.length;
    },
    onSubmit() {},
    filterSource(value, row) {
      return row.source === value;
    },
    filterMariage(value, row) {
      return row.mariage === value;
    },
    filterEduBack(value, row) {
      return row.eduBack === value;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    handleEdit(index, row) {
      this.ruleForm3 = JSON.parse(JSON.stringify(row));
      this.dialogVisible2 = true;
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.onSubmit();
        } else {
          return false;
        }
      });
    },
    onSubmit() {
      let _this = this;
      this._httpSysUpdateUser(
        this.loginId,
        this.ruleForm3.id,
        this.ruleForm3.phoneNumber,
        this.ruleForm3.wxNumber,
        this.ruleForm3.idcard,
        this.ruleForm3.detailAddress,
        this.ruleForm3.realName
      );
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
  }
};
</script>

<style >
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
#text .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<style>
#tb1 .el-table thead {
  display: none;
}
</style>

<style scoped>
.col-flex {
  display: flex;
  justify-content: flex-start;
}
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

.title_6 {
  padding: 10px;
}
.table_2 {
  border: double 0px #d3d3d3;
  margin: 5px auto;
  line-height: 30px;
}
.table tbale {
  background-color: #fff;
}
.image {
  width: 100%;
  height: 180px;
  display: block;
  cursor: pointer;
}
.imgCenter {
  clear: both;
  display: block;
  margin: auto;
}
.bgcolor {
  color: #436eee;
  background-color: #f3f3f3;
}
.w100 {
  width: 20%;
}
</style>
