<template>
    <div class="container">
        <el-row>
            <el-alert
              title="线下还款申请列表展示"
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
                        v-model.trim="search.username"
                        clearable>
                      </el-input> 
                  </div>   
                  <div class="l20">
                      <el-input
                      style="padding:0px 10px 0px 0px"
                        placeholder="请输入身份证"
                        v-model.number="search.idcard"
                        clearable>
                      </el-input> 
                  </div>                                       
                      <div class="l20">
                          <el-input
                          style="padding:0px 10px 0px 0px"
                            placeholder="请输入手机号码"
                            v-model.number="search.phone"
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
            style="width: 100%;font-weight:bold;"
            class="m20"
             v-loading="loading"
          >
            <el-table-column prop="id" label="ID" align="center" width="80"  sortable></el-table-column>
            <el-table-column prop="withdrawMoney" label="实际到款金额" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="overdue_day" label="逾期天数" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="late_fee" label="逾期费" align="center" min-width="120"  sortable></el-table-column>
           
            <el-table-column prop="createTime" label="提现时间" align="center" min-width="140"  sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>                
            </el-table-column>
            <el-table-column prop="raise_money" label="合同金额" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="id_no" label="身份证号" align="center" min-width="160"  sortable></el-table-column>
                      <el-table-column prop="cz"  align="center" label="操作"  width="100" v-if="activename=='first'">
                          <template slot-scope="scope">
                          <el-button
                              size="mini"
                              v-if="!scope.row.loanRepaymentApplyId"
                              type="success"
                              @click="handlehk(scope.$index, scope.row)"
                             >还款申请
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
            <el-tab-pane label="未处理" name="first">
            </el-tab-pane>
            <el-tab-pane label="已处理" name="second"></el-tab-pane>        
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
                <el-form-item label="是否上传图片：" >
                            <el-switch
                               v-model="editForm.img"
                               active-text="是"
                               inactive-text="否">
                         </el-switch>          
                  </el-form-item>                                                                                                
                <el-form-item label="图片凭证：" v-if="editForm.img" >
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
                  <el-button @click="changeDialog">取消</el-button>
      
                </el-form-item>                                                                  
            </el-form>              
            </el-row>
        </el-dialog>             
        </el-tabs>
 
                                   
    </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import {
  httpPaymentapplylist,
  httpOfflinePaymentapply
} from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
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
      search: {},
      npage: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      tableData: [],
      dialogVisible1: false,
      editForm: {},
      types: [{ label: "线下", value: 1 }, { label: "线上", value: 2 }],
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
      },
      activename: "first"
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
    _httpOfflinePaymentapply(
      loginId,
      reduceMoney,
      realMoney,
      realRepaymentTimeString,
      withdrawId,
      remark_collect,
      repayment_type
    ) {
      httpOfflinePaymentapply(
        loginId,
        reduceMoney,
        realMoney,
        realRepaymentTimeString,
        withdrawId,
        remark_collect,
        repayment_type
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "申请提交成功等待审核",
              type: "success"
            });
            this.getData(
              this.loginId,
              this.activename,
              this.npage,
              this.pagesize
            );
            this.dialogVisible1 = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
    },
    getData(
      loginId,
      paymentStatus,
      npage,
      pagesize,
      begainTimeString,
      endTimeString,
      IdCard,
      userName,
      phonenumber
    ) {
      this.loading = true;
      httpPaymentapplylist(
        loginId,
        paymentStatus == "first" ? 1 : 2,
        npage,
        pagesize,
        begainTimeString,
        endTimeString,
        IdCard,
        userName,
        phonenumber
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData = data.data.list;
            console.log(this.tableData);
            this.total = data.data.allsize;
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("网络错误，请联系管理员");
        });
    },
    reset() {
      this.search = {};
      this.handleSearch();
    },
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.search.time && this.search.time.length) {
        this.getData(
          this.loginId,
          this.activename,
          this.npage,
          this.pagesize,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00",
          this.search.idcard,
          this.search.username,
          this.search.phone
        );
      } else {
        this.getData(
          this.loginId,
          this.activename,
          this.npage,
          this.pagesize,
          "",
          "",
          this.search.idcard,
          this.search.username,
          this.search.phone
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
    onAddSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editForm.img) {
            this.$refs.upload.submit();
          } else {
            let reduceMoney =
              Number(this.editForm.yMoney) - Number(this.editForm.realMoney);
            this._httpOfflinePaymentapply(
              this.loginId,
              Number(reduceMoney),
              Number(this.editForm.realMoney),
              Number(this.editForm.withdrawId),
              this.editForm.time,
              this.editForm.remark,
              this.editForm.type
            );
          }
        } else {
          return false;
        }
      });
    },
    changeDialog() {
      this.dialogVisible1 = false;
      this.resetForm("editForm");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
      fd.append("realRepaymentTimeString", this.editForm.time); //其他参数
      fd.append("withdrawId", Number(this.editForm.withdrawId)); //其他参数
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

      this.dialogVisible1 = false;
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
            this.getData(
              this.loginId,
              this.activename,
              this.npage,
              this.pagesize
            );
          } else {
            this.$message.error(data.msg);
          }
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
    handlehk(index, row) {
      this.editForm.withdrawId = row.id;
      this.editForm.yMoney = row.late_fee
        ? Number(row.raise_money) + Number(row.late_fee)
        : Number(row.raise_money);

      this.dialogVisible1 = true;
    },
    handleClick() {
      this.reset();
    }
  },
  mounted() {
    this.getData(this.loginId, this.activename, this.npage, this.pagesize);
  }
};
</script>

<style scoped>
</style>


