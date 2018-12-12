<template>
    <div class="container">
      <el-row>
            <el-alert
              title="催收减免管理"
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
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
            id="eleTable"
          >
            <el-table-column prop="userName" fixed label="姓名" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" min-width="120"  sortable></el-table-column>
            <el-table-column prop="id_no" label="身份证号" align="center" min-width="160"  sortable></el-table-column>          
            <el-table-column prop="createTime" label="申请时间" align="center" width="180" sortable>
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>  
            </el-table-column>                      
            <el-table-column prop="id" label="ID" align="center" width="180" sortable>
            </el-table-column>
            <el-table-column prop="realMoney" label="实际还款金额" align="center" width="180" sortable>
            </el-table-column>
            <el-table-column prop="reduceMoney" label="减免金额" align="center" width="180" sortable>
            </el-table-column>
            <el-table-column prop="withdrawMoney" label="实际到款金额" align="center" width="180" sortable>
            </el-table-column>
            <el-table-column prop="returnMoney" label="借款金额" align="center" width="180" sortable>
            </el-table-column>
            <el-table-column prop="late_fee" label="违约金" align="center" width="180" sortable>
            </el-table-column>
                <el-table-column prop="cz"  align="center" label="操作"   >
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleAllocation(scope.$index, scope.row)"
                       >
                       {{activename=='first'?'审核':'修改'}}
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
            <el-tab-pane label="待处理" name="first">
            </el-tab-pane>
            <el-tab-pane label="处理中" name="second"></el-tab-pane> 
        </el-tabs> 
        <el-dialog
          title="审核操作"
          :visible.sync="dialogVisible"
          center
          width="40%"
          >
            <el-row>  
            <el-form  :model="editForm"  ref="editForm"   label-width="150px" :rules="rules">
                <el-form-item label="编号" >
                  <el-input v-model="editForm.id"    disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select  v-model="editForm.statuss" placeholder="请选择审核结果">
                      <el-option
                        v-for="item in statusList"
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
                <!-- <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update"/>   -->
                <el-form-item>
                  <el-button type="primary" @click="onAddSubmit('editForm')">提交</el-button>
                  <el-button @click="changeDialog()">取消</el-button>
      
                </el-form-item>                                                                  
            </el-form>              
            </el-row>
        </el-dialog>                                        
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  httpPaymentlistbycollectmanager,
  httpPaymentlistbycollectmanageroper
} from "../../../service/http";
export default {
  data() {
    return {
      dialogVisible: false,
      activename: "first",
      tableData: [],
      loading: false,
      search: {},
      npage: 1,
      pagesize: 10,
      total: 0,
      editForm: {},
      statusList: [{ label: "同意", value: 5 }, { label: "拒绝", value: 6 }],
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
        statuss: [
          { required: true, message: "请选择审核结果", trigger: "change" }
        ]
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
    getData(
      loginId,
      npage,
      pagesize,
      repaymentStatus,
      IdCard,
      userName,
      phonenumber,
      begainTimeString,
      endTimeString
    ) {
      this.loading = true;
      httpPaymentlistbycollectmanager(
        loginId,
        npage,
        pagesize,
        repaymentStatus == "first" ? 1 : 2,
        IdCard,
        userName,
        phonenumber,
        begainTimeString,
        endTimeString
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
    _httpPaymentlistbycollectmanageroper(id, status, remark_manager) {
      httpPaymentlistbycollectmanageroper(id, status, remark_manager)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.dialogVisible = false;
            this.$message({
              message: "申请提交成功等待审核",
              type: "success"
            });
            this.editForm = {};
            this.reset();
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
          this.npage,
          this.pagesize,
          this.activename,
          this.search.idcard,
          this.search.username,
          this.search.phone,
          this.search.time[0] + " 00:00:00",
          timeFormat(this.search.time[1], 1) + " 00:00:00"
        );
      } else {
        this.getData(
          this.loginId,
          this.npage,
          this.pagesize,
          this.activename,
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
    handleAllocation(index, row) {
      this.dialogVisible = true;
      this.editForm = JSON.parse(JSON.stringify(row));
    },
    onAddSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "editForm") {
            this._httpPaymentlistbycollectmanageroper(
              this.editForm.id,
              this.editForm.statuss,
              this.editForm.remark
            );
          }
        } else {
          return false;
        }
      });
    },
    changeDialog() {
      this.dialogVisible = false;
      this.editForm = {};
    },
    handleClick() {
      this.reset();
    }
  },
  mounted() {
    this.getData(this.loginId, this.npage, this.pagesize, this.activename);
  }
};
</script>

<style scoped>
</style>

