<template>
    <div class="container">
        <el-row>
            <el-alert
              title="系统参数设置"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20">
               <el-button  type="primary" @click="add">添加利率</el-button>
               <!-- <el-button  type="primary" class="l20" @click="change">修改参数</el-button> -->
        </el-row>
      <el-row>
        <el-col :span="10" :offset="2" class="m20" v-if="sysParams">
                <el-card shadow="hover">
                    <el-row class="m20" style="margin-top:10px">
                        <strong style="margin-left:30px">单笔最小提现额:</strong>
                        <i style="color:red">{{sysParams.type1}}</i>
                         <el-button @click="handleChange(1)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">单笔最大提现额:</strong>
                         <i style="color:red">{{sysParams.type2}}</i>
                         <el-button @click="handleChange(2)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">公司额度上限 :</strong>
                         <i style="color:red">{{sysParams.type3}}</i>
                         <el-button @click="handleChange(3)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">签到每次增加额:</strong>
                         <i style="color:red">{{sysParams.type4}}</i>
                         <el-button @click="handleChange(4)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>                                        
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">提现增加额度数:</strong>
                         <i style="color:red">{{sysParams.type5}}</i>
                         <el-button @click="handleChange(5)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">提现增加额度最小天数:</strong>
                         <i style="color:red">{{sysParams.type6}}</i>
                         <el-button @click="handleChange(6)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">提现增加额度最大天数:</strong>
                         <i style="color:red">{{sysParams.type7}}</i>
                         <el-button @click="handleChange(7)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>
                    <el-row class="m20" style="margin-top:20px;padding-bottom:10px">
                         <strong style="margin-left:30px">滴滴 渠道:</strong>
                         <i style="color:red">{{sysParams.type8==1?'芝麻信用（滴滴）':sysParams.type8==2?'芝麻信用（多渠道）':''}}</i>
                         <el-button @click="handleChange(8)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-row>                    
                </el-card>          
        </el-col>
        <!-- {{list}} -->
        <el-col :span="9" class="m20" v-if="list">
         
                   <el-col :span="22" :key="i" :offset="4" :class="{m20:i>1}">
                      <el-card shadow="always">
                          <el-row>
                              <strong style="margin-left:30px">借款期限:</strong>
                              <i style="color:red">{{list.borrowDay?list.borrowDay:''}}</i>
                          </el-row>
                          <el-row class="m20">
                               <strong style="margin-left:30px">借款千分利率:</strong>
                               <i style="color:red">{{list.rateAll?list.rateAll:""}}</i>
                          </el-row>
                          <el-row class="m20">
                               <strong style="margin-left:30px">逾期率:</strong>
                               <i style="color:red">{{list.overdue_rate?list.overdue_rate:''}}</i>
                          </el-row>  
                          <el-row class="m20">
                               <strong style="margin-left:30px">逾期服务费利率:</strong>
                               <i style="color:red">{{list.management_rate?list.management_rate:''}}</i>
                          </el-row>  
                          <el-row class="m20">
                               <strong style="margin-left:30px">逾期利率:</strong>
                               <i style="color:red">{{list.liquidated_rate?list.liquidated_rate:''}}</i>
                                <el-button @click="change(i)" style="float:right" type="primary" icon="el-icon-edit" circle></el-button>
                          </el-row>    
                      </el-card>
                 </el-col>                
            
        </el-col>
      </el-row>
      <el-dialog
          title="参数修改"
          :visible.sync="dialogVisible1"
          center
          width="30%"
          >
            <el-form :model="sysForm" status-icon  ref="sysForm"  label-width="120px"   v-if="sysForm">
              <!-- <el-form-item label="可提现额最小值:" prop="minMoney" >
                <el-input type="number"   v-model="sysForm.chooseMoneyVo.minMoney" ></el-input>
              </el-form-item>
              <el-form-item label="可提现额最大值:" prop="maxMoney" >
                <el-input type="number"  v-model="sysForm.chooseMoneyVo.maxMoney" ></el-input>
              </el-form-item>  -->
              <!-- <template v-for="(temp, index) in sysForm.list"> -->
          
                        <el-form-item
                      :label="'借款期限' "
                    >
                      <el-input    disabled type="number" v-model="sysForm.borrowDay"></el-input>
                      <!-- <el-button @click.prevent="removeDomain(domain)">删除</el-button>     -->
                           </el-form-item>      
                       <el-form-item
                      :label="'千分率'"
                    
                    >
                    <el-input v-model="sysForm.rateAll"></el-input>
                  </el-form-item>  
                       <el-form-item
                      :label="'逾期率'"
            
                    >
                    <el-input v-model="sysForm.overdue_rate"></el-input>
                  </el-form-item>   
                 <el-form-item
                      :label="'逾期服务费利率'"
            
                    >
                    <el-input v-model="sysForm.management_rate"></el-input>
                  </el-form-item>   
                 <el-form-item
                      :label="'逾期利率'"
            
                    >
                    <el-input v-model="sysForm.liquidated_rate"></el-input>
                  </el-form-item>                                       
                               

       
                                                
              <!-- </template> -->

           <el-form-item>  
                <el-button type="primary" @click="onSubmit">提交</el-button>
                 <!-- <el-button @click="addDomain">新增借款期限</el-button> -->
                <el-button type="primary" style="margin-left:30px" @click="qx1('roleForm')">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>  
      <el-dialog
          title="添加参数"
          :visible.sync="dialogVisible2"
          center
          :rules="rules"
          width="30%"
          >
            <el-form :model="addForm" status-icon  ref="addForm" label-width="120px" :rules="rules" >
              <el-form-item label="借款天数:" prop="borrowDay" >
                <el-input type="number"  v-model="addForm.borrowDay" ></el-input>
              </el-form-item> 
              <el-form-item label="千分利率:" prop="rateAll" >
                <el-input type="number"   v-model="addForm.rateAll" ></el-input>
              </el-form-item>              
              <el-form-item label="逾期利率:" prop="overdue_rate" >
                <el-input type="number"  v-model="addForm.overdue_rate" ></el-input>
              </el-form-item>               
           <el-form-item>  
                <el-button type="primary" @click="onSubmit1('addForm')">提交</el-button>
                 <!-- <el-button @click="addDomain">新增借款期限</el-button> -->
                <el-button type="primary" style="margin-left:30px" @click="dialogVisible2=false">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog> 
      <el-dialog
          title="滴滴渠道"
          :visible.sync="dialogddVisible"
          center
          width="30%"
          >
            <el-form :model="ddForm" status-icon  ref="ddForm" label-width="120px" :rules="rules" >
              <el-form-item label="滴滴渠道:"  >
                    <el-select class="l20" v-model="ddForm.dd" placeholder="滴滴渠道">
                      <el-option
                        v-for="item in ddcs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>  
              </el-form-item> 
           <el-form-item>  
                <el-button type="primary" @click="onSubmit2('ddForm')">提交</el-button>
                 <!-- <el-button @click="addDomain">新增借款期限</el-button> -->
                <el-button type="primary" style="margin-left:30px" @click="dialogddVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>                         
    </div>
</template>

<script>
import {
  httpParametershow,
  httpUpdateparameter,
  httpParameteradd,
  httpRateupdate
} from "../../../service/http";
export default {
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      dialogddVisible: false,
      chooseMoneyVo: {},
      sysParams: {},
      list: [],
      roleForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      addForm: {},
      sysForm: {},
      ddForm: {},
      rules: {
        borrowDay: [{ required: true, message: "借款天数", trigger: "blur" }],
        rateAll: [{ required: true, message: "千分利率", trigger: "blur" }],
        overdue_rate: [
          { required: true, message: "逾期利率", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请选择电销人员", trigger: "change" }
        ],
        minMoney: [{ required: true, message: "逾期利率", trigger: "blur" }]
        // recallType: [
        //   { required: true, message: "请选择类型", trigger: "change" }
        // ]
      },
      ddcs: [
        { label: "芝麻信用（滴滴）", value: 1 },
        { label: " 芝麻信用（多渠道", value: 2 }
      ]
    };
  },
  methods: {
    //利率修改
    _httpRateupdate(
      borrowDay,
      rateAll,
      overdue_rate,
      management_rate,
      liquidated_rate
    ) {
      httpRateupdate(
        borrowDay,
        rateAll,
        overdue_rate,
        management_rate,
        liquidated_rate
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: data.msg,
              type: "success"
            });
            this.dialogVisible1 = false;
            this._httpParametershow();
          } else {
            this.$message({
              message: data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
        });
    },
    //系统利率增加
    _httpParameteradd(rateAll, borrowDay, overdue_rate) {
      httpParameteradd(rateAll, borrowDay, overdue_rate)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogVisible2 = false;
            this._httpParametershow();
          }
        })
        .catch();
    },
    //后台参数修改
    _httpUpdateparameter(param, type, status) {
      httpUpdateparameter(param, type, status)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogVisible1 = false;
            this.dialogddVisible = false;
            this._httpParametershow();
          }
        })
        .catch();
    },
    //得到系统参数
    _httpParametershow() {
      httpParametershow()
        .then(res => {
          let data = res.data;
          let sysParams = {};
          // this.sysParams = data.sysParams;
          data.sysParams.forEach(v => {
            if (v.type == 1) sysParams.type1 = v.param;
            if (v.type == 2) sysParams.type2 = v.param;
            if (v.type == 3) sysParams.type3 = v.param;
            if (v.type == 4) sysParams.type4 = v.param;
            if (v.type == 5) sysParams.type5 = v.param;
            if (v.type == 6) sysParams.type6 = v.param;
            if (v.type == 7) sysParams.type7 = v.param;
            if (v.type == 8) sysParams.type8 = v.param;
          });
          this.sysParams = JSON.parse(JSON.stringify(sysParams));
          this.list = data.list[0];
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");
        });
    },
    change(i) {
      this.dialogVisible1 = true;
      this.sysForm = JSON.parse(JSON.stringify(this.list));
    },
    add() {
      this.addForm = {};
      this.dialogVisible2 = true;
    },
    removeDomain(item) {
      var index = this.roleForm.domains.indexOf(item);
      if (index !== -1) {
        this.roleForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.roleForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    onSubmit() {
      if (
        this.sysForm.rateAll == null ||
        this.sysForm.overdue_rate == null ||
        this.sysForm.management_rate == null ||
        this.sysForm.liquidated_rate == null ||
        this.sysForm.rateAll == undefined ||
        this.sysForm.overdue_rate == undefined ||
        this.sysForm.management_rate == undefined ||
        this.sysForm.liquidated_rate == undefined ||
        this.sysForm.rateAll == "" ||
        this.sysForm.overdue_rate == "" ||
        this.sysForm.management_rate == "" ||
        this.sysForm.liquidated_rate == ""
      ) {
        this.$message({
          message: "参数不能为空",
          type: "error"
        });
      } else {
        this._httpRateupdate(
          this.sysForm.borrowDay,
          this.sysForm.rateAll,
          this.sysForm.overdue_rate,
          this.sysForm.management_rate,
          this.sysForm.liquidated_rate
        );
      }
    },
    onSubmit1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._httpParameteradd(
            this.addForm.rateAll,
            this.addForm.borrowDay,
            this.addForm.overdue_rate
          );
        } else {
          return false;
        }
      });
    },
    handleChange(i) {
      let type = "type" + i;
      let num = this.sysParams;
      let info = [
        "单笔最小提现额",
        "单笔最大提现额",
        "公司额度上限",
        "签到每次增加额",
        "提现增加额度数",
        "提现增加额度最小天数",
        "提现增加额度最大天数",
        "滴滴渠道"
      ];
      if (i == 8) {
        this.dialogddVisible = true;
      } else {
        this.$prompt(info[i - 1], "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: this.sysParams[type],
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: "请输入数字"
        })
          .then(({ value }) => {
            this._httpUpdateparameter(parseInt(value), i);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      }
    },
    onSubmit2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._httpUpdateparameter(this.ddForm.dd, 8);
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this._httpParametershow();
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
</style>

