<template>
    <div class="container">
        <el-row>
            <el-alert
              title="客户电销列表"
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
                      <el-button type="info" @click="changeExeceedtimeType(0)">重置</el-button>
                      <el-button type="primary" @click="changeExeceedtimeType(1)">M1</el-button>
                      <el-button type="success" @click="changeExeceedtimeType(2)">M2</el-button>
                      <el-button type="warning" @click="changeExeceedtimeType(3)">M3</el-button>
                      <el-button type="danger" @click="changeExeceedtimeType(4)">M3+</el-button>
                    </el-button-group>     -->
                     <el-button class="l20" type="primary" @click="reset" style="margin-left: 10px;">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入手机号"
                          v-model.trim="phone"
                          clearable>
                        </el-input> 
                    </div> 

                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入姓名"
                          v-model.trim="name"
                          clearable>
                        </el-input> 
                    </div>                         
                    <el-select class="l20" v-model="typeStr" placeholder="状态">
                      <el-option
                        v-for="item in typeStrs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>                                                    
                    <el-date-picker
                    style="width:340px"
                    class="l20"
                      v-model="time"
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
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20 tabletext"
            v-loading="loading"
            id="eleTable"
                 ref="multipleTable" 
       @selection-change="handleSelectionChange"
          >

                               <el-table-column
             type="selection"
             fixed
             width="55">   
          </el-table-column> 
                      <el-table-column prop="custUserId" label="ID" align="center" min-width="80" sortable></el-table-column>
                      <el-table-column prop="phoneNumber" label="电话" align="center"  min-width="120"></el-table-column>
                      <!-- <el-table-column prop="custUserMobile" label="客户电话" align="center" width="140"></el-table-column> -->
                      <!-- <el-table-column prop="type" label="电销类型" align="center" 
                        width="140"
                         :filters="[ { value: 1, text: '注册' }, { value: 2, text: '流程未走完 ' }, { value: 3, text: '重申中' }, { value: 4, text: '额度未完' }]"
                         :filter-method="filterType"                      
                      >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.type==1?'success':scope.row.type==2?'info':scope.row.type==3?'warning':scope.row.type==4?'danger':''"
                            >{{scope.row.type==1?'注册':scope.row.type==2?'流程未走完':scope.row.type==3?'重申中':scope.row.type==4?'额度未完':''}}</el-tag>
                        </template>                         
                      </el-table-column>                       -->
                      <!-- <el-table-column prop="companyName" label="机构名" align="center" ></el-table-column> -->
                      <el-table-column prop="custUserName" label="客户姓名" align="center"  width="80"></el-table-column>
                      <el-table-column prop="userCreateTimeStr" label="注册时间" align="center" min-width="140" ></el-table-column>                         
                      <el-table-column prop="typeStr" label="客户状态" align="center"  min-width="120">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.type==1?'success':scope.row.type==2?'info':scope.row.type==3?'warning':scope.row.type==4?'danger':''"
                            >{{scope.row.type==1?'陌生':scope.row.type==2?'未提交':scope.row.type==3?'机审中':scope.row.type==4?'审核分配中':scope.row.type==5?'审核中':scope.row.type==6?'未提现':scope.row.type==7?'审核拒绝':scope.row.type==8?'已经提现':scope.row.type==9?'有额度':'审核驳回中'}}</el-tag>
                        </template>  
                      </el-table-column>

                      <el-table-column prop="money" label="所剩金额" align="center"  min-width="100"></el-table-column>                                         
                     <el-table-column prop="salesmanName" label="电销人员" align="center"  min-width="100"></el-table-column>                      
                      <!-- <el-table-column prop="detailAddress" label="客户住址" align="center"  min-width="150">
                          <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.detailAddress" placement="top">
                                    <span>{{scope.row.detailAddress}}</span>
                                </el-tooltip>
                          </template> 
                      </el-table-column>
                      <el-table-column prop="idCard" label="身份证号" align="center"  width="160"></el-table-column>
                       
                      <el-table-column prop="weiXinNumber" label="微信号" align="center"  width="100"></el-table-column>
                      <el-table-column prop="lastLoginTimeStr" label="最后登陆时间" align="center" width="140" sortable>
                       </el-table-column> -->

                      <el-table-column prop="promoter" label="渠道" align="center"  min-width="100"></el-table-column>
<!--  
                      <el-table-column prop="registerIp" label="注册Ip" align="center"  width="160"></el-table-column>
                      <el-table-column prop="sourceTypeStr" label="来源" align="center" width="120" ></el-table-column> -->

                      <!-- 
                      <el-table-column prop="chbSale" label="电销人员" align="center"  width="140" >
                        <template slot-scope="scope" >
                            <el-tag
                                :type="scope.row.salesmanName?'success':'danger'"
                                style="width:100px"
                            >{{scope.row.salesmanName?scope.row.salesmanName:'暂无电销人员'}}</el-tag>
                        </template> 
                      </el-table-column>   -->
            <el-table-column type="expand" label="回访详情" width="80" >
              <template slot-scope="props" >
                <el-alert
                  title="回访记录"
                  type="success"
                  :closable="false"
                  center
                  >
                </el-alert>
                <el-table
                  :data="props.row.chbdetail"
                  border 
                      highlight-current-row style="width: 100%;font-weight:bold"
                  >
                      <el-table-column prop="customName" fixed label="客户姓名" align="center" sortable width="100"></el-table-column>
                      <el-table-column prop="salesmanName" label="电销员姓名" align="center" sortable width="100"></el-table-column>
                      <el-table-column prop="recallType" label="回访类型" align="center" sortable width="100"></el-table-column>
                      <el-table-column prop="recallResult" label="回访内容" align="center" sortable ></el-table-column>
                      <el-table-column prop="updateTime" label="最近回访时间" align="center" sortable width="180">
                        <template slot-scope="scope">
                            {{scope.row.updateTime|dateServer}}
                        </template>                          
                      </el-table-column>
                      <el-table-column prop="createTime" label="创建时间" align="center" sortable width="180">
                        <template slot-scope="scope">
                            {{scope.row.createTime|dateServer}}
                        </template>                          
                      </el-table-column>                      
                      <el-table-column prop="type" label="客户状态" align="center" width="180" ></el-table-column>                      
                </el-table>
              </template>
            </el-table-column>  
                    <el-table-column prop="cz"  align="center" label="操作" width="300"  >
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click="handleEmit(scope.$index, scope.row)"
                            :disabled="scope.row.salesmanName!=null"
                           >分配</el-button>
                        <!-- <el-button
                            size="mini"
                            type="success"
                            @click="handleAdd(scope.$index, scope.row)"
                           >查看通讯录</el-button>                            -->
                        <el-button   type="success"  @click="handleShow(scope.row)" size="mini">详情</el-button>                                      
            <el-button
                            size="mini"
                            type="primary"
                            @click="handleSMS(scope.$index, scope.row)"
                           >添加短信</el-button>                             
                        </template> 
                    </el-table-column>   
        </el-table>  
        <el-row class="m20" v-if="total>0">
            <el-button type="primary" style="float:left" @click="handelConfigAll" :disabled="multipleSelection.length==0">批量发送</el-button>          
          
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
          title="通讯录"
          :visible.sync="dialogVisible"
          center
          width="30%"
          > 
                        <el-table
                  :data="tableData2"
                  border 
                      highlight-current-row style="width: 100%;font-weight:bold"
                  >
                             <el-table-column
                      type="index"
                      align="center"
                      sortable
                      fixed
                      width="50"></el-table-column>
                      <el-table-column prop="name" label="姓名" align="center"  width="100"></el-table-column>
                      <el-table-column prop="mobile" label="号码" align="center"  min-width="100"></el-table-column>
                  
                  </el-table>
            <!-- <el-row>
              <el-col :span="20" >
            <el-form :model="ruleForm1" status-icon  ref="ruleForm1" label-width="100px" :rules="rules" >
              <el-form-item label="客户姓名:" prop="userName" >
                <el-input type="input" v-model="ruleForm1.userName" auto-complete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="客户电话:" prop="userMobile" >
                <el-input type="input" v-model="ruleForm1.userMobile" auto-complete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="客户ID:" prop="custUserId" >
                <el-input v-model.number="ruleForm1.custUserId" disabled></el-input>
              </el-form-item>  
              <el-form-item label="客户状态:" prop="type" >
                <el-input v-model.number="ruleForm1.type" disabled></el-input>
              </el-form-item>  
              <el-form-item label="所剩额度:" prop="money" >
                <el-input v-model.number="ruleForm1.money" disabled></el-input>
              </el-form-item>  
              <el-form-item label="电销人员:"  >
                <el-input  disabled>{{ruleForm1.salesman}}</el-input>
     
              <el-form-item label="回访类型:" prop="recallType">
                 <el-select v-model="ruleForm1.recallType" placeholder="回访类型">
                  <template v-for="(temp,index) in recallType">
                    <el-option  :key="index" :label="temp.label" :value="temp.value">
                    </el-option>
                  </template>  
                </el-select>                
              </el-form-item>              
              <el-form-item label="备注:" prop="remark">
                 <el-input type="textarea" v-model="ruleForm1.remark" ></el-input>
              </el-form-item>
              <el-form-item label="回访结果:" prop="recallResult">
                <el-input type="textarea" v-model="ruleForm1.recallResult"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm1')">提交</el-button>
                <el-button type="primary" style="margin-left:30px" @click="quxiao1">取消</el-button>
              </el-form-item>
            </el-form>
              </el-col>
            </el-row> -->
        </el-dialog>   
        <el-dialog
          title="分配电销人员"
          :visible.sync="dialogVisible3"
          center
          width="30%"
          >

            <el-row class="m20">
              <el-alert
                title="电销人员"
                type="info"
                :closable="false">
              </el-alert>   
            </el-row>
            <el-row class="m20 col-flex" style="text-align:center" >
                <el-select v-model="salesmanId" placeholder="电销人员">
                  <template v-for="(temp,index) in salesman">
                    <el-option  :key="index" :label="temp.username" :value="temp.uid">
                    </el-option>
                  </template>
                </el-select>                
              <el-button type="primary" style="margin-left:30px" @click="handleConfig">确认</el-button>
              <el-button type="primary" style="margin-left:30px" @click="quxiao2">取消</el-button>              
            </el-row>
        </el-dialog>    
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
                                    id="textt"
                                >
                      <el-table-column prop="custUserId" fixed label="ID" align="center" width="80" sortable></el-table-column>
                      <el-table-column prop="phoneNumber" label="电话" align="center"  width="120"></el-table-column>
                      <!-- <el-table-column prop="custUserMobile" label="客户电话" align="center" width="140"></el-table-column> -->
                      <!-- <el-table-column prop="type" label="电销类型" align="center" 
                        width="140"
                         :filters="[ { value: 1, text: '注册' }, { value: 2, text: '流程未走完 ' }, { value: 3, text: '重申中' }, { value: 4, text: '额度未完' }]"
                         :filter-method="filterType"                      
                      >
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.type==1?'success':scope.row.type==2?'info':scope.row.type==3?'warning':scope.row.type==4?'danger':''"
                            >{{scope.row.type==1?'注册':scope.row.type==2?'流程未走完':scope.row.type==3?'重申中':scope.row.type==4?'额度未完':''}}</el-tag>
                        </template>                         
                      </el-table-column>                       -->
                      <!-- <el-table-column prop="companyName" label="机构名" align="center" ></el-table-column> -->
                      <el-table-column prop="custUserName" label="客户姓名" align="center"  width="80"></el-table-column>
                      <el-table-column prop="userCreateTimeStr" label="注册时间" align="center" width="140" ></el-table-column>                         
                      <el-table-column prop="typeStr" label="客户状态" align="center"  width="120"></el-table-column>

                      <el-table-column prop="money" label="所剩金额" align="center"  width="100"></el-table-column>                                         
                     <el-table-column prop="salesmanName" label="电销人员" align="center"  width="100"></el-table-column>                      
                      <el-table-column prop="detailAddress" label="客户住址" align="center"  min-width="150">
                          <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.detailAddress" placement="top">
                                    <span>{{scope.row.detailAddress}}</span>
                                </el-tooltip>
                          </template> 
                      </el-table-column>
                      <el-table-column prop="idCard" label="身份证号" align="center"  width="160"></el-table-column>
                       
                      <el-table-column prop="weiXinNumber" label="微信号" align="center"  width="100"></el-table-column>
                      <el-table-column prop="lastLoginTimeStr" label="最后登陆时间" align="center" width="140" sortable>
                       </el-table-column>

                      <el-table-column prop="promoter" label="推广人" align="center"  width="100"></el-table-column>
 
                      <el-table-column prop="registerIp" label="注册Ip" align="center"  width="160"></el-table-column>
                      <el-table-column prop="sourceTypeStr" label="来源" align="center" width="120" ></el-table-column>                                                                                       
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
                   <!-- <tr>
                        <th  class="bgcolor "  >滴滴出行信息</th>
                        <td colspan="5" >
                            <template v-if='ddShow'>
                                <el-table
                                        :data="ddData.slice(0,5)"
                                        border
                                            highlight-current-row style="width: 100%;font-weight:bold">
                                    <el-table-column prop="cityName" align="center" label="城市"  width="100"></el-table-column>
                                    <el-table-column prop="productName" align="center" label="类别"  width="100"></el-table-column>
                                    <el-table-column prop="actualPayFee" align="center"  label="消费记录" width="120"></el-table-column>
                                    <el-table-column prop="fromAddress"  align="center" label="起始地" ></el-table-column>
                                    <el-table-column prop="toAddress"  align="center" label="目的地" ></el-table-column>
                                    <el-table-column prop="beginTime"  align="center" label="时间" ></el-table-column>
                                </el-table>                          
                            </template>
                            <template v-if='!ddShow'>
                                <el-table
                                        :data="ddData"
                                        border
                                            highlight-current-row style="width: 100%;font-weight:bold">
                                    <el-table-column prop="cityName" align="center" label="城市"  width="100"></el-table-column>
                                    <el-table-column prop="productName" align="center" label="类别"  width="100"></el-table-column>
                                    <el-table-column prop="actualPayFee" align="center"  label="消费记录" width="120"></el-table-column>
                                    <el-table-column prop="fromAddress"  align="center" label="起始地" ></el-table-column>
                                    <el-table-column prop="toAddress"  align="center" label="目的地" ></el-table-column>
                                    <el-table-column prop="beginTime"  align="center" label="时间" ></el-table-column>
                                </el-table>                          
                            </template>
                            <el-button class="m20" @click="ddShow = !ddShow">{{ddShow?'展开滴滴信息':'收起滴滴信息'}}</el-button>
                        </td>
                    </tr>     -->
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
                    <tr>
                        <th  class="bgcolor">银行卡信息</th>
                        <td colspan="5" >
                            <el-table
                                    :data="yhkData"
                                    border
                                        highlight-current-row style="width: 100%;font-weight:bold">
                                <el-table-column prop="cardNum" fixed   label="卡号"   align="center" width="240" ></el-table-column>
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
                        <th  class="bgcolor">通讯录信息</th>
                        <td colspan="5" >
                            <el-button class="m20" type="primary" @click="handleAdd()">查看通讯录信息</el-button>
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
                                                                                                                                   </template>  -->
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
                            {{scope.row.updateTime| dateServer}}
                        </template>                                      
                                </el-table-column>
                                <el-table-column prop="recallResult" align="center" label="回访结果"  ></el-table-column>
                                <el-table-column prop="remark" align="center" label="备注" ></el-table-column>
                            </el-table>
                        </td>
                    </tr>
                    <tr>
                        <th  class="bgcolor">备注信息</th>
                        <td colspan="5" >
                            <el-table
                             
                                    :data="remarkList"
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
                    <template>
                      <el-card  :body-style="{ padding: '0px' }"  shadow="never">
                          <img  :src="imgStr" class="imgCenter">
                          <!-- <div style="padding: 14px;text-align:center">
                            <span>{{o.label}}</span>
                          </div>                                     -->
                      </el-card>
                    </template>

                    <!-- <button type="button" @click="changImgIndex(-1)" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left"></i></button>    -->
                    <!-- <button type="button"   @click="changImgIndex(1)" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"></i></button>                        -->
            </el-dialog>             
        </el-dialog>  
       <el-dialog
          title="发送短信"
          :visible.sync="dialogVisible2"
          center
          width="30%"
          >
              <el-row>
                <el-tag
                class="l20 m20"
                  v-for="tag in dynamicTags"
                  :key="tag.userId"
                  type="danger">
                  {{tag.phoneNumber}}
                </el-tag>
              </el-row>          
            <el-form class="m20" :model="smsForm" status-icon  ref="smsForm" label-width="100px" :rules="rules" >
              <el-form-item label="短信平台:" prop="platformName">
                 <el-select v-model="smsForm.platformName" placeholder="短信平台"  @change="changePlatformName">
                  <template v-for="(temp,index) in eleMsgPlatform">
                    <el-option  :key="index" :label="temp.platformName" :value="temp.id">
                    </el-option>
                  </template>  
                </el-select>                
              </el-form-item> 
              <el-form-item label="发送签名:" prop="eleSignatures">
                 <el-select v-model="smsForm.eleSignatures" placeholder="短信签名">
                  <template v-for="(temp,index) in  eleSignatures">
                    <el-option  :key="index" :label="temp.signature" :value="temp.signature">
                    </el-option>
                  </template>  
                </el-select>                
              </el-form-item>   
              <el-form-item label="内容:" prop="content" :autosize="{ minRows: 6}">
                <el-input type="textarea" v-model="smsForm.content"></el-input>
              </el-form-item>  
               
              <el-form-item class="m20">
                <el-button type="primary" @click="submitForm('smsForm')">提交</el-button>
                <el-button type="primary" style="margin-left:30px" @click="dialogVisible2=false">取消</el-button>
              </el-form-item>  
            <el-row>
              <span style="display:none">{{ss}}</span>
                          <div  class=" alert m20" @click="changeContent(1)"  >
                            <span  
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                              您的资料尚未填写完整，请登录APP点击授信认证进行资料完善。
                            </span>
                          </div>
                          <div   class="alert m20" >
                            <span  @click.prevent="changeContent(2)" 
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                              您的审核已经通过，授信额度1000元，您可随时登录APP进行提现。
                            </span>
                          </div>
                          <div   class=" alert m20" >
                            <span  @click.prevent="changeContent(3)" 
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                              您有一笔借款今天到期！请尽快登录APP在我的账单里点击自助线上还款
                            </span>
                          </div>  
                          <div   class=" alert m20" >
                            <span  @click.prevent="changeContent(4)" 
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                              您有未提现额度，请登录app查看。如循环使用快速贷产品，您的额度将会提升
                            </span>
                          </div>  
                          <div   class=" alert m20" >
                            <span  @click.prevent="changeContent(5)" 
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                              您的审核已经通过，授信额度（）元，分期额度（）元。您可随时登录APP进行提现。
                            </span>
                          </div>  
                          <div   class=" alert m20" >
                            <span  @click.prevent="changeContent(6)" 
                            style="font-size: 13px;cursor:pointer;
                              line-height: 18px;">
                             您的借款已经逾期！为了避免影响您的正常使用请立即登录APP在我的账单里点击自助线上还款。
                            </span>
                                                                                                                                                      
                    </div>
            </el-row>                                                   
            </el-form>   
       
        </el-dialog>                        
    </div>
</template>

<script>
import {
  findCustUserForSalesman,
  getEleCompanyId,
  getEleSalesmanRecall,
  getSalesmanId,
  getReplies,
  getSaleman,
  httpMobileList,
  getCustomerPage,
  httpEleSignatures,
  httpEleMsgPlatform,
  httpSendMsg,
  httpGetCustomterMesage
} from "../../../service/http";
import Timer from "../../../config/timer";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      ss: "",
      show3: false,
      dynamicTags: [],
      multipleSelection: [],
      dialogVisible2: false,
      imgStr: "",
      tableData2: [],
      companyId: null,
      keywords: "",
      phone: "",
      name: "",
      time: [],
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisible3: false,
      salesmanId: null,
      editSales: {},
      ruleForm1: {
        userName: "",
        userMobile: "",
        salesmanId: "",
        loanApplyId: "",
        loanOrderId: "",
        recallType: "",
        remark: "",
        recallResult: "",
        type: "",
        money: "",
        custUserId: ""
      },
      recallType: [
        { value: 1, label: "打电话" },
        { value: 2, label: "发短信" },
        { value: 3, label: "微信" },
        { value: 4, label: "qq" }
      ],
      typeStr: "",
      typeStrs: [
        { value: 1, label: "陌生 " },
        { value: 2, label: "未提交" },
        { value: 3, label: "机审中" },
        { value: 4, label: "审核分配中" },
        { value: 5, label: "审核中" },
        { value: 6, label: "未提现" },
        { value: 7, label: "审核拒绝" },
        { value: 8, label: "已经提现" },
        { value: 9, label: "有额度" },
        { value: 10, label: "审核驳回中" }
        // { value: 10, label: "机审未通过" }
      ],
      salesman: [],
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        recallResult: [
          { required: true, message: "请填写回访结果", trigger: "blur" }
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
        eleSignatures: [
          { required: true, message: "请选择签名", trigger: "change" }
        ],
        content: [
          { required: true, message: "请填写短信内容", trigger: "blur" }
        ]
      },
      checkVisible: false,
      userData: [],
      idCardImgs: [],
      qbData: [],
      ddData: [],
      yhkData: [],
      fqzdData: [],
      hkjlData: [],
      zljData: [],
      hfjlData: [],

      innerImgVisible: false,
      imgIndex: 0,
      ddShow: true,
      eleMsgPlatform: [],
      smsForm: {},
      eleSignatures: [],
      platformId: null,
      //客户信息详情表
      customerInformation: [],
      remarkList: []
    };
  },
  // watch: {
  //   smsForm: {
  //     handler: function(newVal, oldVal) {
  //       this.changePlatform();
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    changeContent(type) {
      this.ss = this.smsForm["content"];
      switch (type) {
        case 1:
          this.ss
            ? (this.ss +=
                "您的资料尚未填写完整，请登录APP点击授信认证进行资料完善。")
            : (this.ss =
                "您的资料尚未填写完整，请登录APP点击授信认证进行资料完善。");
          break;
        case 2:
          this.ss
            ? (this.ss +=
                "您的审核已经通过，授信额度1000元，您可随时登录APP进行提现。")
            : (this.ss =
                "您的审核已经通过，授信额度1000元，您可随时登录APP进行提现。");
          break;
        case 3:
          this.ss
            ? (this.ss +=
                "您有一笔借款今天到期！请尽快登录APP在我的账单里点击自助线上还款")
            : (this.ss =
                "您有一笔借款今天到期！请尽快登录APP在我的账单里点击自助线上还款");
          break;
        case 4:
          this.ss
            ? (this.ss +=
                "您有未提现额度，请登录app查看。如循环使用快速贷产品，您的额度将会提升。")
            : (this.ss =
                "您有未提现额度，请登录app查看。如循环使用快速贷产品，您的额度将会提升。");
          break;
        case 5:
          this.ss
            ? (this.ss +=
                "您的审核已经通过，授信额度（）元，分期额度（）元。您可随时登录APP进行提现。")
            : (this.ss =
                "您的审核已经通过，授信额度（）元，分期额度（）元。您可随时登录APP进行提现。");
          break;
        case 6:
          this.ss
            ? (this.ss +=
                "您的借款已经逾期！为了避免影响您的正常使用请立即登录APP在我的账单里点击自助线上还款。")
            : (this.ss =
                "您的借款已经逾期！为了避免影响您的正常使用请立即登录APP在我的账单里点击自助线上还款。");
          break;
        default:
          console.log(1);
          break;
      }
      this.smsForm["content"] = this.ss;
    },
    changePlatformName(v) {
      this._httpEleSignatures(v);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击全选
    handelConfigAll() {
      this.dynamicTags.length = 0;
      for (var temp of this.multipleSelection) {
        this.dynamicTags.push({
          phoneNumber: temp.phoneNumber,
          useId: temp.userId
        });
      }
      this.dialogVisible2 = true;
      this.smsForm = {};
    },
    handleSMS(index, row) {
      this.dynamicTags.length = 0;
      this.dialogVisible2 = true;
      this.smsForm = {};
      this.dynamicTags.push({
        phoneNumber: row.phoneNumber,
        useId: row.userId
      });
    },
    _httpSendMsg(mobiles, content, signature, msgPlatformId) {
      httpSendMsg(mobiles, content, signature, msgPlatformId)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "发送成功",
              type: "success"
            });
            this.dialogVisible2 = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    //查询短信签名
    _httpEleSignatures(platformId) {
      httpEleSignatures(platformId)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.eleSignatures = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    //查询短信平台
    _httpEleMsgPlatform() {
      httpEleMsgPlatform()
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.eleMsgPlatform = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    _httpMobileList(id) {
      httpMobileList(id)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData2 = data.data;
            this.dialogVisible = true;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    _getEleSalesmanRecall(
      userName,
      userMobile,
      salesmanId,
      loanApplyId,
      loanOrderId,
      recallType,
      remark,
      recallResult,
      type,
      money,
      userId
    ) {
      let _this = this;
      getEleSalesmanRecall(
        userName,
        userMobile,
        salesmanId,
        loanApplyId,
        loanOrderId,
        recallType,
        remark,
        recallResult,
        type,
        money,
        userId
      )
        .then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            _this.dialogVisible = false;
          }
        })
        .catch();
    },

    _getEleCompanyId(companyId, salesmanName) {
      let _this = this;
      getEleCompanyId(companyId, salesmanName)
        .then(res => {
          let data = res.data;
          if (data.code === 200) {
            _this.salesman = data.data;
          }
        })
        .catch();
    },
    getData(pageNumber, pageSize, startDate, endDate, phone, name, typeStr) {
      let _this = this;
      this.loading = true;
      findCustUserForSalesman(
        pageNumber,
        pageSize,
        startDate,
        endDate,
        phone,
        name,
        typeStr
      )
        .then(res => {
          let data = res.data;
          if (data.code === 200) {
            let tableData = data.data.list;
            if (tableData.length == 0) {
              _this.loading = false;
              _this.tableData = tableData;
              _this.total = data.data.allsize;
            } else {
              for (let a = 0; a < tableData.length; a++) {
                getReplies(tableData[a].custUserId)
                  .then(re => {
                    tableData[a].chbdetail = re.data.data;
                    // getSaleman(tableData[a].custUserId)
                    //   .then(re => {
                    //     tableData[a].chbSale = re.data.data;
                    //     _this.tableData = tableData;
                    //     _this.total = data.data.allpage;
                    //     _this.loading = false;
                    //   })
                    //   .catch();
                    tableData[a].chbSale = re.data.data;
                    _this.tableData = tableData;
                    _this.total = data.data.allsize;
                    _this.loading = false;
                  })
                  .catch();
              }
            }
          } else {
            this.$message.error(data.msg);
            this.loading = false;
          }
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
          _this.loading = false;
        });
    },
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.time && this.time.length) {
        this.getData(
          this.npage,
          this.pagesize,
          this.time[0] + " 00:00:00",
          timeFormat(this.time[1], 1) + "00:00:00",
          this.phone,
          this.name,
          this.typeStr
        );
      } else {
        this.getData(
          this.npage,
          this.pagesize,
          // "2018-08-01 00:00:00",
          // "2018-08-02 00:00:00",
          "",
          "",
          this.phone,
          this.name,
          this.typeStr
        );
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
    handleConfig() {
      let _this = this;
      let salesmanName = "";

      for (let a = 0; a < this.salesman.length; a++) {
        if (this.salesman[a].uid === this.salesmanId) {
          salesmanName = this.salesman[a].username;
        }
      }
      getSalesmanId(
        this.salesmanId,
        this.editSales.custUserId,
        this.editSales.loanOrderId,
        this.editSales.loanApplyId,
        this.editSales.custUserName,
        salesmanName
      )
        .then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              message: "分配成功",
              type: "success"
            });
            _this.editSales = null;
            _this.handleSearch(false);
            _this.dialogVisible3 = false;
          }
        })
        .catch();
    },
    handleAdd() {
      let companyId = this.userData[0].custUserId;
      // this.ruleForm1 = {
      //   userName: row.custUserName,
      //   userMobile: row.phoneNumber,
      //   salesmanId: row.salesmanId,
      //   salesman: row.salesmanName,
      //   loanApplyId: row.loanApplyId,
      //   loanOrderId: row.loanOrderId,
      //   recallType: "",
      //   remark: "",
      //   recallResult: "",
      //   type: row.typeStr,
      //   money: row.money,
      //   custUserId: row.custUserId
      // };
      //  this._getEleCompanyId(row.companyId);
      this._httpMobileList(companyId);
    },

    handleEmit(index, row) {
      this.dialogVisible3 = true;
      this.salesmanId = null;
      this.salesmanId = row.salesmanId;
      this.username = null;
      let companyId = row.companyId;
      this._getEleCompanyId(row.companyId);
      this.editSales = row;
    },
    filterType(value, row) {
      return row.type == value;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let mobile = [];
          this.dynamicTags.forEach(v => {
            mobile.push(v.phoneNumber);
          });
          // console.log(mobile);
          this._httpSendMsg(
            mobile,
            this.smsForm.content,
            this.smsForm.eleSignatures,
            this.smsForm.platformName
          );
          // this._getEleSalesmanRecall(
          //   this.ruleForm1.userName,
          //   this.ruleForm1.userMobile,
          //   this.ruleForm1.salesmanId,
          //   this.ruleForm1.loanApplyId,
          //   this.ruleForm1.loanOrderId,
          //   this.ruleForm1.recallType,
          //   this.ruleForm1.remark,
          //   this.ruleForm1.recallResult,
          //   this.ruleForm1.type,
          //   this.ruleForm1.money,
          //   this.ruleForm1.custUserId
          // );
          this.resetForm(formName);
        } else {
          return false;
        }
      });
    },
    quxiao1() {
      this.dialogVisible = false;
      this.resetForm("ruleForm1");
    },
    quxiao2() {
      this.dialogVisible3 = false;

      this.editSales = null;
    },
    reset() {
      this.npage = 1;
      this.pagesize = 10;
      this.keywords = "";
      this.phone = "";
      this.name = "";
      this.typeStr = "";
      this.time = [];
      this.getData(this.npage, this.pagesize);
    },
    handleShow(row) {
      console.log(JSON.stringify(row));
      // this._httpGetCustomterMesage(46);
      let _this = this;
      let CustUserId = row.custUserId;
      // this._httpMobileList(CustUserId);
      _this.userData ? (_this.userData.length = 0) : (_this.userData = []);
      _this.rzData ? (_this.rzData.length = 0) : (_this.rzData = []);
      _this.qbData ? (_this.qbData.length = 0) : (_this.qbData = []);
      _this.ddData ? (_this.ddData.length = 0) : (_this.ddData = []);
      _this.fqzdData ? (_this.fqzdData.length = 0) : (_this.fqzdData = []);
      _this.yhkData ? (_this.yhkData.length = 0) : (_this.yhkData = []);
      _this.hkjlData ? (_this.hkjlData.length = 0) : (_this.hkjlData = []);
      _this.zljData ? (_this.zljData.length = 0) : (_this.zljData = []);
      _this.hfjlData ? (_this.hfjlData.length = 0) : (_this.hfjlData = []);

      _this.remarkList
        ? (_this.remarkList.length = 0)
        : (_this.remarkList = []);
      _this.idCardImgs
        ? (_this.idCardImgs.length = 0)
        : (_this.idCardImgs = []);
      _this.userData.push(JSON.parse(JSON.stringify(row)));
      getCustomerPage(CustUserId)
        .then(res => {
          let data = res.data;

          console.log();
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
          ];
          _this.qbData.push(data.walletMessage);
          _this.fqzdData = data.withDrawDOList;
          _this.ddData = data.didiOrderVoList;
          _this.hkjlData = data.loanRepaymentList;
          _this.yhkData = data.bankCardDTOVoList;
          _this.zljData = data.overdueList;
          _this.hfjlData = data.salesmanRecallList;
          _this.remarkList = data.remarkList;
          _this.checkVisible = true;
        })
        .catch();
    },
    changImgIndex(i) {
      this.imgIndex = (this.imgIndex + i) % this.idCardImgs.length;
      //   this.imgIndex = (this.imgIndex + i) % this.idCardImgs.length;
    },
    handleImgShow(src) {
      //   this.imgIndex = i;
      this.imgStr = src;
      this.innerImgVisible = true;
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
    export2Excel() {
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        const tHeader = ["电话号码"];
        const filterVal = ["phoneNumber"];
        let list = JSON.parse(JSON.stringify(this.tableData));
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "客户信息表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
    this._httpEleMsgPlatform();
    this._httpEleSignatures(1);
  }
};
</script>
<style>
#eleTable .el-tag {
  width: 80px;
}
#eleTable .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
#textt .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
</style>

<style scoped>
</style>
<style>
#tb1 .el-table thead {
  display: none;
}
</style>
<style>
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
.alert {
  width: 100%;
  padding: 8px 16px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: opacity 0.2s;
  background-color: #f0f9eb;
  color: #67c23a;
  text-align: center;
  transition: opacity 0.2s;
}
</style>

