<template>
    <div class="container">
        <el-row>
            <el-alert
              title="短信签名"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row> 
        <el-row class="m20">
            <el-button  type="primary" @click="addSMS">添加签名</el-button>            
        </el-row>
        <el-row class="m20" v-if="plathom.length">
            <el-col :span="6" :offset="1"  v-for="(temp,i) in plathom" :key="i" style="text-align:center">
                <el-card class="box-card" :span="6"  >
                    <div slot="header" class="clearfix">
                      <span>短信平台 {{temp.platformName}}</span>
                    </div>
                    <div v-for="(tt,inx) in temp.list" :key="inx" class="text item"  v-if="temp.list.length">
                      {{'签名 ' + tt.signature }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
          title="添加签名"
          :visible.sync="dialogVisible"
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
                 <el-select v-model="smsForm.platformName" placeholder="短信平台">
                  <template v-for="(temp,index) in eleMsgPlatform">
                    <el-option  :key="index" :label="temp.platformName" :value="temp.id">
                    </el-option>
                  </template>  
                </el-select>                
              </el-form-item> 
              <el-form-item label="签名:" prop="content">
                <el-input type="textarea" v-model="smsForm.content"></el-input>
              </el-form-item>    
              <el-form-item>
                <el-button type="primary" @click="submitForm('smsForm')">提交</el-button>
                <el-button type="primary" style="margin-left:30px" @click="dialogVisible=false">取消</el-button>
              </el-form-item>                                    
            </el-form>            
        </el-dialog>           
    </div>
</template>

<script>
import {
  httpPreSalest,
  httpMobileList,
  getEleSalesmanRecall,
  getReplies,
  httpEleSignatures,
  httpEleMsgPlatform,
  httpSendMsg,
  httpEleSignature
} from "../../../service/http";
export default {
  data() {
    return {
      dialogVisible: false,
      plathom: [],
      eleMsgPlatform: [],
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
        eleSignatures: [
          { required: true, message: "请选择签名", trigger: "change" }
        ]
      },
      smsForm: {}
    };
  },
  methods: {
    _httpEleSignature(signature, platformId) {
      httpEleSignature(signature, platformId)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogVisible = false;
            this._httpEleMsgPlatform();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    //查询短信签名
    _httpEleSignatures(platformId, element) {
      httpEleSignatures(platformId, element)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let d = JSON.parse(JSON.stringify(element));
            d.list = JSON.parse(JSON.stringify(data.data));
            this.plathom.push(d);
            // this.smsForm.eleSignatures = null;
            console.log(JSON.stringify(this.plathom));
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          // let data = {
          //   code: 200,
          //   msg: "提交成功",
          //   data: [
          //     {
          //       id: 1,
          //       signature: "【XXX钱包】",
          //       createTime: null,
          //       type: null,
          //       platformId: 1
          //     },
          //     {
          //       id: 2,
          //       signature: "【XXX钱包】",
          //       createTime: null,
          //       type: null,
          //       platformId: 2
          //     }
          //   ]
          // };
          // if (data.code == 200) {
          //   let d = JSON.parse(JSON.stringify(element));
          //   d.list = JSON.parse(JSON.stringify(data.data));
          //   this.plathom.push(d);
          //   // this.smsForm.eleSignatures = null;
          //   console.log(JSON.stringify(this.plathom));
          // } else {
          //   this.$message.error(data.msg);
          // }
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
            data.data.forEach(element => {
              element.platform = this._httpEleSignatures(element.id, element);
            });
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
            this.eleMsgPlatform.forEach(element => {
              element.platform = this._httpEleSignatures(element.id, element);
            });
          } else {
            this.$message.error(data.msg);
          }
          this.$message.error("请检查网络连接或联系管理员");
        });
    },
    addSMS() {
      this.dialogVisible = true;
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
            this._httpEleSignature(
              this.smsForm.content,
              this.smsForm.platformName
            );
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this._httpEleMsgPlatform();
  }
};
</script>

<style scoped>
</style>

