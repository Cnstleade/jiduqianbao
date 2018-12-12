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
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="关键字"
                          v-model="search.input"
                          clearable>
                        </el-input> 
                    </div>  
                    <el-select class="l20" v-model="search.type" placeholder="请选择用户类型">
                      <el-option
                        v-for="item in types"
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
            id="text"
          >
                     <el-table-column
             type="selection"
             width="55">   
          </el-table-column> 
            <el-table-column prop="userId" fixed label="用户ID" align="center" width="80" sortable>
            </el-table-column>
            <el-table-column prop="phoneNumber" label="用户号码" align="center" width="140" sortable>
            </el-table-column>

            <el-table-column prop="userName" label="用户姓名" align="center" width="100" >
            </el-table-column>
            <el-table-column prop="idCard" label="身份证" align="center" width="160" sortable>
            </el-table-column>  
            <el-table-column prop="score" label="芝麻分" align="center" width="80" sortable>
            </el-table-column>  
            <el-table-column prop="registerIp" label="注册IP" align="center" width="140" sortable>
            </el-table-column>   
           <el-table-column prop="sourceTypeStr" label="来源" align="center" width="100" >
            </el-table-column>              
            <el-table-column prop="typeStr" label="用户类型" align="center" width="140" >
            </el-table-column>                                                                                    
            <el-table-column prop="lastLoginTimeStr" label="最后登陆时间" align="center" width="140" sortable>
            </el-table-column>  
           <el-table-column prop="userCreateTimeStr" label="注册时间" align="center" width="140" sortable>
            </el-table-column>  
            <el-table-column prop="detailAddress" label="详细地址" align="center" min-width="180" >
                         <template slot-scope="scope">
                          <el-tooltip class="item" effect="dark" :content="scope.row.detailAddress" placement="top">
                              <span>{{scope.row.detailAddress}}</span>
                          </el-tooltip>
                    </template>               
            </el-table-column> 
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
                <el-table-column prop="cz"  align="center" label="操作"  width="300" >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click="handleAdd(scope.$index, scope.row)"
                           >查看通讯录</el-button>                     
                      <el-button
                            size="mini"
                            type="success"
                            @click="handleAdd2(scope.$index, scope.row)"
                           >添加回访</el-button>
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
                      width="50"></el-table-column>
                      <el-table-column prop="name" fixed label="姓名" align="center"  width="100"></el-table-column>
                      <el-table-column prop="mobile" label="号码" align="center"  min-width="100"></el-table-column>
                  
                  </el-table>
        </el-dialog>  
        <el-dialog
          title="添加回访记录"
          :visible.sync="dialogVisible3"
          center
          width="40%"
          > 
             
                             <!-- <el-table-column
                      type="index"
                      align="center"
                      sortable
                      width="50"></el-table-column>
                      <el-table-column prop="name" label="姓名" align="center"  width="100"></el-table-column>
                      <el-table-column prop="mobilePhone" label="号码" align="center"  min-width="100"></el-table-column> -->
                  
                 
            <el-row>
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
                <el-input  disabled v-model="ruleForm1.typeStr"></el-input>
              </el-form-item>  
              <!-- <el-form-item label="所剩额度:" prop="money" >
                <el-input  disabled></el-input>
              </el-form-item>   -->
              <!-- <el-form-item label="电销人员:"  >
                <el-input  disabled>{{ruleForm1.salesman}}</el-input>
       </el-form-item>   -->
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
            </el-row>
           
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
              <el-form-item label="内容:" prop="content">
                <el-input type="textarea" v-model="smsForm.content"></el-input>
              </el-form-item>    
              <el-form-item>
                <el-button type="primary" @click="submitForm('smsForm')">提交</el-button>
                <el-button type="primary" style="margin-left:30px" @click="dialogVisible2=false">取消</el-button>
              </el-form-item>                                    
            </el-form>            
        </el-dialog>                                                    
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { timeFormat } from "../../../config/time";
import {
  getRoleList,
  changeRoleList,
  findRoleMenu,
  changeRoleMenu,
  httpAfterSales,
  httpMobileList,
  getEleSalesmanRecall,
  getReplies,
  httpEleSignatures,
  httpEleMsgPlatform,
  httpSendMsg
} from "../../../service/http";
export default {
  data() {
    return {
      dynamicTags: [],
      title: "售后营销",
      dialogVisible: false,
      dialogVisible3: false,
      tableData2: [],
      dialogVisible2: false,
      search: {
        input: "",
        time: ""
      },
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
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      multipleSelection: [], //全部选中嘛
      types: [
        // { label: "陌生客户", value: 1 },
        // { label: "有意向", value: 2 },
        // { label: "未提现", value: 3 },
        // { label: "已提现", value: 4 },
        // { label: "有余额", value: 5 },
        // { label: "提现失败", value: 6 }
        { value: 6, label: "未提现" },
        { value: 7, label: "审核拒绝" },
        { value: 8, label: "已经提现" },
        { value: 9, label: "有额度" },

      ],
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
      recallType: [
        { value: 1, label: "有意向" },
        { value: 2, label: "无意向" },
        { value: 3, label: "弃用" }
      ],
      eleMsgPlatform: [],
      smsForm: {},
      eleSignatures: [],
      platformId: null
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
    changePlatformName(v) {
      this._httpEleSignatures(v);
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
          let data = {
            code: 200,
            msg: "提交成功",
            data: [
              { id: 1, platformName: "华信" },
              { id: 2, platformName: "创蓝" }
            ]
          };
          if (data.code == 200) {
            this.eleMsgPlatform = data.data;
          } else {
            this.$message.error(data.msg);
          }
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
            _this.dialogVisible3 = false;
          }
        })
        .catch();
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
    _httpPreSalest(
      salesmanId,
      pageNumber,
      pageSize,
      keywords,
      startDate,
      endDate,
      type
    ) {
      this.loading = true;
      httpAfterSales(
        salesmanId,
        pageNumber,
        pageSize,
        keywords,
        startDate,
        endDate,
        type
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let tableData = data.data.list;
            if (tableData.length !== 0) {
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

                    this.loading = false;
                  })
                  .catch();
              }
              this.total = data.data.allsize;
              this.tableData = tableData;
              this.loading = false;
            } else {
              this.total = data.data.allsize;
              this.tableData = tableData;
              this.loading = false;
            }
          } else {
            this.$message.error(data.msg);
            this.loading = false;
          }
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },

    getData() {
      let _this = this;
      url()
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
        this._httpPreSalest(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.input,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + "00:00:00",
          this.search.type
        );
      } else {
        this._httpPreSalest(
          this.loginId,
          this.npage,
          this.pagesize,
          this.search.input,
          "",
          "",
          this.search.type
        );
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
      this.npage = 1;
      this.pagesize = 10;
      this._httpPreSalest(this.loginId, this.npage, this.pagesize);
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
    handleAdd(index, row) {
      let companyId = row.userId;
      this._httpMobileList(companyId);
    },
    handleAdd2(index, row) {
      this.dialogVisible3 = true;
      let companyId = row.companyId;
      this.ruleForm1 = {
        userName: row.userName,
        userMobile: row.phoneNumber,
        // salesmanId: row.salesmanId,
        // salesman: row.salesmanName,
        loanApplyId: row.loanApplyId,
        loanOrderId: row.loanOrderId,
        recallType: "",
        remark: "",
        recallResult: "",
        type: row.type,
        typeStr: row.typeStr,
        money: row.money,
        custUserId: row.userId
      };
      //    this._getEleCompanyId(row.companyId);
      //   this._httpMobileList(row.companyId);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "ruleForm1") {
            this._getEleSalesmanRecall(
              this.ruleForm1.userName,
              this.ruleForm1.userMobile,
              this.loginId,
              this.ruleForm1.loanApplyId,
              this.ruleForm1.loanOrderId,
              this.ruleForm1.recallType,
              this.ruleForm1.remark,
              this.ruleForm1.recallResult,
              this.ruleForm1.type,
              this.ruleForm1.money,
              this.ruleForm1.custUserId
            );
            this.dialogVisible3 = false;
            this._httpPreSalest(this.loginId, this.npage, this.pagesize);
            this.resetForm(formName);
          } else if (formName == "smsForm") {
            let mobile = [];
            this.dynamicTags.forEach(v => {
              mobile.push(v.phoneNumber);
            });
            this._httpSendMsg(
              mobile,
              this.smsForm.content,
              this.smsForm.eleSignatures,
              this.smsForm.platformName
            );
          }
        } else {
          return false;
        }
      });
    },
    quxiao1() {
      this.dialogVisible = false;
      this.resetForm("ruleForm1");
    }
  },
  mounted() {
    this._httpPreSalest(this.loginId, this.npage, this.pagesize);
    this._httpEleMsgPlatform();
    this._httpEleSignatures(1);
  }
};
</script>

<style>
#text .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
