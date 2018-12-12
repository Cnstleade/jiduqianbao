<template>
    <div class="container">
        <el-row>
            <el-alert
              title="线下还款列表展示"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>        
        <el-tabs v-model="activeName" type="border-card" class="m20" @tab-click="handleClick" v-loading="lodings">
          <el-tab-pane label="待处理申请订单" name="first">
          <el-row class="m20" >
            <el-col   class="col-flex-end">
                       <el-button  @click="reset" type="primary">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入身份证"
                          v-model="search.IdCard"
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
            v-loading="loading"
            @selection-change="handleSelectionChange"
            :rules="rules"
          >
            <!-- <el-table-column prop="id" fixed label="提现ID" align="center" width="120" sortable></el-table-column>
            <el-table-column prop="applyId" label="订单ID" align="center" width="120" sortable>
                          <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.applyId" placement="top">
                                                  <span>{{scope.row.applyId}}</span>
                                              </el-tooltip>
                                        </template>  
            </el-table-column> -->
            <el-table-column prop="userId" fixed label="用户ID" align="center" width="120"  sortable>

            </el-table-column>             
            <el-table-column prop="userName" label="姓名" align="center" width="180" sortable ></el-table-column>
                        <el-table-column prop="id_no" label="身份证" align="center" width="180" sortable ></el-table-column>            
                                    <el-table-column prop="phoneNumber" label="电话号码" align="center" width="180" sortable ></el-table-column>
            <el-table-column prop="borrowDay" label="借款期限" align="center" width="120" sortable></el-table-column>
            <el-table-column prop="borrowTime" label="借款时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.borrowTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="raise_money" label="提现金额" align="center" width="120" sortable ></el-table-column>

            <el-table-column prop="overdue_day" label="逾期天数" width="120" align="center" sortable ></el-table-column>
            <el-table-column prop="late_fee" label="滞纳金" width="110" align="center" sortable ></el-table-column>
            <el-table-column prop="ned_return_money" label="应还款金额" width="180" align="center" sortable ></el-table-column>
                <el-table-column prop="cz"  align="center" label="操作"  width="100" >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >还款操作</el-button>
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
          <el-tab-pane label="完成申请订单" name="two">
          <el-row class="m20" >
            <el-col   class="col-flex-end">
                       <el-button  @click="reset" type="primary">重置</el-button>
                    <div class="l20">
                        <el-input
                        style="padding:0px 10px 0px 0px"
                          placeholder="请输入身份证"
                          v-model="search.IdCard"
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
            v-loading="loading"
            @selection-change="handleSelectionChange"
            :rules="rules"
          >
            <!-- <el-table-column prop="id" fixed label="提现ID" align="center" width="120"  sortable>

            </el-table-column>
            <el-table-column prop="applyId" label="订单ID" align="center" width="120" sortable>

                                        <template slot-scope="scope">
                                              <el-tooltip class="item" effect="dark" :content="scope.row.applyId" placement="top">
                                                  <span>{{scope.row.applyId}}</span>
                                              </el-tooltip>
                                        </template>                 
            </el-table-column> -->
            <el-table-column prop="userId" fixed label="用户ID" align="center" width="120"  sortable>

            </el-table-column>            
            <el-table-column prop="userName" label="姓名" align="center" width="180" sortable ></el-table-column>
                        <el-table-column prop="id_no" label="身份证" align="center" width="180" sortable ></el-table-column>            
                                    <el-table-column prop="phoneNumber" label="电话号码" align="center" width="180" sortable ></el-table-column>            
            <el-table-column prop="borrowDay" label="借款期限" align="center" width="120" sortable></el-table-column>
            <el-table-column prop="borrowTime" label="借款时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.borrowTime|dateServer}}
                </template>
            </el-table-column>
            <el-table-column prop="raise_money" label="提现金额" align="center" width="120" sortable ></el-table-column>
            <el-table-column prop="overdue_day" label="逾期天数" width="120" align="center" sortable ></el-table-column>
            <el-table-column prop="late_fee" label="滞纳金" align="center" width="110" sortable ></el-table-column>
            <el-table-column prop="ned_return_money" label="应还款金额"  width="120" align="center" sortable ></el-table-column>
                <el-table-column prop="cz"  align="center" label="操作"  v-if="activeName=='first'"  >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >还款操作</el-button>
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

          <el-dialog
          title="线下还款管理"
          :visible.sync="dialogVisible"
          center
          width="40%"
          v-if="Paymentapplydetail"
          >
                    <!-- <el-dialog
          title="线下还款管理"
          center
          width="40%"
      :visible.sync="dialogVisible"
          > -->
           <el-card class="box-card">
              <div  class="text item">
                  <span>提交时间</span><span style="margin-left:50px">{{Paymentapplydetail.createtime|dateServer}}</span>
              </div>
              <div  class="text item">
                  <span>申请还款金额</span><span style="margin-left:50px">{{Paymentapplydetail.realMoney}}</span>
              </div> 
              <div  class="text item">
                  <span>减免金额</span><span style="margin-left:50px">{{editForm.reduceMoney}}</span>
              </div>                 
              <div  class="text item" >
                  <span >图片凭证</span>   <img @click="innerImgVisible=true" style="margin-left:50px;vertical-align:middle;cursor:pointer" :src="Paymentapplydetail.urlRemark" width="100">
              </div>                            
           
              <div  class="text item">
                  <span>催收员描述</span><span style="margin-left:50px">{{Paymentapplydetail.remark_collect}}</span>
              </div> 
              <div  class="text item">
                  <span>催收经理描述</span><span style="margin-left:50px">{{Paymentapplydetail.remark_manager}}</span>
              </div> 
              <div  class="text item">
                  <span>还款方式</span><span style="margin-left:50px">{{Paymentapplydetail.repayment_type==1?'线下':'线上'}}</span>
              </div>                                                        
          </el-card>

            <el-form  class="m20" :model="editForm"  ref="editForm"   label-width="150px" :rules="rules">
                <el-form-item label="逾期的利息：" prop="title">
                  <el-input v-model="editForm.interestOverdue"    disabled></el-input>
                </el-form-item>
                <el-form-item label="需要还款的金额 ：" prop="title">
                  <el-input v-model="editForm.mustPayBackAmt"    disabled></el-input>
                   <!-- <el-input v-model="editForm."   placeholder="请输入实际还款的金额"></el-input> -->
                </el-form-item>
                <el-form-item label="实际还款的金额：" prop="title" v-if="Paymentapplydetail.repayment_type==1">
                  <el-input v-model="editForm.actualPayBackAmt"   placeholder="请输入实际还款的金额"></el-input>
                </el-form-item>  
                <el-form-item label="请输入还款日期:" prop="time" >
                      <el-date-picker
                        v-model="editForm.time"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                </el-form-item>                  
                <el-form-item label="备注：" prop="remarks">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入还款申请备注"
                    v-model="editForm.remarks">
                  </el-input>
                </el-form-item>                                                                                

                <el-form-item label="图片凭证：" v-if="Paymentapplydetail.repayment_type==1">
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
                <el-form-item label="结果" prop="status">
                  <el-select v-model="editForm.status" placeholder="这笔提现完结状况">
                    <el-option label="完结" value="1"></el-option>
                    <el-option label="不完结" value="0"></el-option>
                  </el-select>
                </el-form-item>                
                <el-form-item>
                  <el-button type="primary" @click="onAddSubmit('editForm',2)">同意</el-button>
                  <el-button type="primary" @click="onAddSubmit('editForm',3)">不同意</el-button>
                  <el-button @click="changeDialog()">取消</el-button>
                  <span style="margin-left:20px;font-size:12px;line-height:30px;color:#999">Tips: 必须上传支付凭证</span>
                </el-form-item>                                                                  
            </el-form>              
            <el-dialog
              id="dialog"
              width="80%"
              top="100px"
              title="照片信息"
              :visible.sync="innerImgVisible"
              append-to-body>
                    
                          <img  :src="Paymentapplydetail.urlRemark" class="imgCenter">
                          <!-- <div style="padding: 14px;text-align:center">
                            <span>{{o.label}}</span>
                          </div>                                     -->
                    
                  
            </el-dialog>             
          </el-dialog>                  
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import {
  getExeceedtimeapplyList,
  getExeceedtimeapplyListbycollector,
  httpExeceedtimeapplydetail,
  httpGetrevewerlist,
  execeedtimeDistribute,
  getPaymentlist,
  postOfflinePayment,
  getOfflinePaymentapplydetail,
  httpOfflinepayment
} from "../../../service/http";
import Timer from "../../../config/timer";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      applyresult: 0,
      activeName: "first",
      lodings: false,
      innerImgVisible: false,
      Paymentapplydetail: {},
      file: false,
      rules: {
        remarks: [{ required: true, message: "请填写备注", trigger: "blur" }],
        logo: [{ required: true, message: "请填写回访结果", trigger: "blur" }],
        status: [
          {
            required: true,
            message: "请选择这笔订单完结状态",
            trigger: "change"
          }
        ]
        // salesmanId: [
        //   { required: true, message: "请选择电销人员", trigger: "change" }
        // ],
        // recallType: [
        //   { required: true, message: "请选择类型", trigger: "change" }
        // ]
      },
      search: {
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
      editForm: {},
      fileList2: [],
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
      trevewerlist: [],
      trevewer: null,
      multipleSelection: [],
      index: 0
    };
  },
  watch: {
    fileList2(newY) {}
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "loginId"
      // ...
    ])
  },
  methods: {
    _httpOfflinepayment(
      loginId,
      repayment_type,
      loanApplyId,
      interestOverdue,
      mustPayBackAmt,
      remarks,
      status,
      loanpaymentId,
      applyresult,
      withDrarId,
      id,
      realRepaymentTimeString
    ) {
      httpOfflinepayment(
        loginId,
        repayment_type,
        loanApplyId,
        interestOverdue,
        mustPayBackAmt,
        remarks,
        status,
        loanpaymentId,
        applyresult,
        withDrarId,
        id,
        realRepaymentTimeString
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message.error(data.msg);
          }
          this.dialogVisible = false;
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
    },
    getData(
      npage,
      pagesize,
      begainTimeString,
      endTimeString,
      phonenumber,
      IdCard,
      repaymentStatus
    ) {
      let _this = this;
      this.loading = true;
      getPaymentlist(
        npage,
        pagesize,
        begainTimeString,
        endTimeString,
        phonenumber,
        IdCard,

        repaymentStatus
      )
        .then(res => {
          let data = res.data;
          let tableData = data.list;
          _this.tableData = tableData;
          _this.total = data.allsize;
          _this.loading = false;
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
          this.search.phoneNumber,
          this.search.IdCard,

          this.activeName == "first" ? 1 : 2
        );
      } else {
        this.getData(
          this.npage,
          this.pagesize,
          "",
          "",
          this.search.phoneNumber,
          this.search.IdCard,

          this.activeName == "first" ? 1 : 2
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
    changeExeceedtimeType(i) {
      this.execeedtimeType = i;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAllocation(index, row) {
      let id = row.id;
      let _this = this;
      this.editForm = {};
      this.Paymentapplydetail = null;
      getOfflinePaymentapplydetail(id)
        .then(res => {
          let data = res.data;
          _this.Paymentapplydetail = data.data;
          this.editForm.reduceMoney = data.data.reduceMoney;
        })
        .catch(err => {});
      // this.editForm.repayment_type =
      this.editForm.id = row.id;
      this.editForm.loanpaymentId = row.loanpaymentId || "";
      this.editForm.loanApplyId = row.applyId;
      this.editForm.interestOverdue = row.late_fee;
      // this.editForm.mustPayBackAmt =
      //   Number(row.withdrawMoney) + Number(row.late_fee);
      this.editForm.mustPayBackAmt = row.ned_return_money;
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
    getrevewerlist() {
      httpGetrevewerlist()
        .then(res => {
          let data = res.data;
          this.trevewerlist = data;
        })
        .catch(err => {});
    },
    handleConfig() {
      let _this = this;
      if (this.trevewer) {
        execeedtimeDistribute(
          this.dynamicTags.length == 1
            ? this.dynamicTags[0] + ","
            : this.dynamicTags.join(","),
          this.trevewer
        )
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "分配成功",
                type: "success"
              });
              _this.dialogVisible = false;
              _this.getData(
                this.npage,
                this.pagesize,
                "",
                "",

                "",
                this.distributionStatus
              );
            }
          })
          .catch(err => {
            this.$message.error("催收员必须存在");
          });
      } else {
        this.$message.error("催收员必须存在");
      }
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
    beforeAvatarUpload(file) {
      //将文件 的所有的内容都添加在这一起上传
      let fd = new FormData();
      fd.append("upload", file);
      fd.append("loginId", this.loginId);
      fd.append("repayment_type", this.Paymentapplydetail.repayment_type); //其他参数
      fd.append("withDrarId", this.editForm.id); //其他参数
      fd.append("id", this.Paymentapplydetail.id); //其他参数

      fd.append("loanApplyId", this.editForm.loanApplyId); //其他参数
      fd.append("interestOverdue", this.editForm.interestOverdue); //其他参数
      // fd.append("discountAmt", Number(this.editForm.discountAmt)); //其他参数
      fd.append("mustPayBackAmt", this.editForm.mustPayBackAmt); //其他参数
      fd.append("actualPayBackAmt", this.editForm.actualPayBackAmt); //其他参数
      fd.append("remarks", this.editForm.remarks); //其他参数
      fd.append("status", this.editForm.status); //其他参数
      fd.append("loanpaymentId", this.editForm.loanpaymentId); //其他参数
      fd.append("applyresult", this.applyresult); //其他参数
      fd.append("realRepaymentTimeString", this.editForm.time);
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
      this.$message({
        message: "申请提交成功等待审核",
        type: "success"
      });
      this.dialogVisible = false;
      this.resetForm("editForm");
      axios.post("/sys/offlinepayment", fd, {}).then(res => {
        this.getData(
          this.npage,
          this.pagesize,
          "",
          "",
          "",

          "",
          this.activeName == "first" ? 1 : 2
        );
      });
      return isJPG && isLt2M;
    },
    onAddSubmit(formName, type) {
      this.applyresult = type;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.Paymentapplydetail.repayment_type == 1) {
            this.$refs.upload.submit();
          } else {
            this._httpOfflinepayment(
              this.loginId,
              this.editForm.repayment_type,
              this.editForm.loanApplyId,
              this.editForm.interestOverdue,
              this.editForm.mustPayBackAmt,
              this.editForm.remarks,
              this.editForm.status,
              this.editForm.loanpaymentId,
              this.applyresult,
              this.editForm.id,
              this.Paymentapplydetail.id,
              this.editForm.time
            );
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {},
    handleChange(file, fileList) {},
    updated() {
      let file = e.target.files[0];
      let param = new FormData(); //创建form对象
      param.append("file", file, file.name); //通过append向form对象添加数据
      param.append("chunk", "0"); //添加form表单中其他数据

      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      }; //添加请求头
      this.axios
        .post("http://upload.qiniu.com/", param, config)
        .then(response => {
          //  console.log(response.data);
        });
    },
    changeDialog() {
      this.dialogVisible = false;
      this.resetForm("editForm");
    },
    handleClick(tab, event) {
      this.lodings = true;
      this.handleSearch();
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    },
    reset() {
      this.search = {};
      this.npage = 1;
      this.pagesize = 10;
      this.lodings = true;
      this.handleSearch();
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    }
  },
  mounted() {
    this.getData(
      this.npage,
      this.pagesize,
      "",
      "",
      "",

      "",
      this.activeName == "first" ? 1 : 2
    );
    this.getrevewerlist();
  }
};
</script>
<style>
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
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.image {
  width: 100%;
  display: block;
}
.imgCenter {
  clear: both;
  display: block;
  margin: auto;
}
</style>
