<template>
    <div class="container">
        <el-row>
            <el-alert
              title="app版本号"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>  
        <el-row class="m20">
                   <div class="l20 " >
                     <el-col :span="5">
                    <el-upload
                      class="upload-demo flex"
                      ref="upload"
                      action="123"
                      :before-upload="beforeAvatarUpload"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      :limit="1"
                      :auto-upload="false">

                      <el-button class="l20" slot="trigger" size="small" type="primary">选取apk</el-button>

                      <el-button class="l20" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传apk</el-button>
                    </el-upload> 
                     </el-col>

                  </div>
        </el-row>
        <el-table
            :data="tableData"  
            border  
            tooltip-effect="dark"
            highlight-current-row 
            style="width: 100%;font-weight:bold"
            class="m20"
          >
            <el-table-column
              prop="name"
              label="app"
              fixed
              width="70"
              sortable
              align="center">
            </el-table-column>  
            <el-table-column
              prop="type"
              label="类型"
              align="center">
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.type==1?'':'danger'"
                      >{{scope.row.type==1?'ios':'android'}}</el-tag>
                  </template>  
            </el-table-column>  
            <el-table-column
              prop="version"
              label="版本号"
              align="center">
            </el-table-column>  
            <el-table-column
              prop="pkgUrl"
              label="地址"
              align="center">
            </el-table-column>  
            <el-table-column prop="cz"  align="center" label="操作"   >
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="success"
                    @click="handleAllocation(scope.$index, scope.row)"
                   >修改</el-button>
                </template> 
            </el-table-column>            
        </el-table>   
        <el-dialog
          title="修改"
          :visible.sync="dialogVisible"
          center
          width="30%"
          >

            <el-form :model="roleForm" status-icon  ref="roleForm" label-width="100px"  :rules="rules" >
              <el-form-item label="app:" >
                <el-input type="input"  v-model="roleForm.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="版本号:"  prop="version"
              >
                <el-input type="input"  v-model="roleForm.version" ></el-input>
              </el-form-item>    
              <el-form-item label="地址:"
                    prop="pkgUrl"
               >
                <el-input  type="input" v-model="roleForm.pkgUrl" ></el-input>
              </el-form-item> 
              <el-form-item label="是否强制升级:"
               >
                <el-switch
                  v-model="roleForm.change"
                  active-text="强制"
                  inactive-text="非强制">
                </el-switch>
              </el-form-item>                                          
              <el-form-item>
                <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
                <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
                <el-button type="primary" style="margin-left:30px" @click="qx1('roleForm')">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>                  
    </div>
</template>

<script>
import { httpGetAppVersion, httpUpdateVersion } from "../../../service/http";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      roleForm: {},
      fileList: [],
      rules: {
        version: [
          { required: true, message: "版本号不能为空", trigger: "change" }
        ],
        pkgUrl: [{ required: true, message: "地址不能为空", trigger: "change" }]
      }
    };
  },
  methods: {
    _httpGetAppVersion() {
      httpGetAppVersion().then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.tableData = data.data;
        }
      });
    },
    _httpUpdateVersion(type, version, pkgUrl,forced) {
      httpUpdateVersion(type, version, pkgUrl,forced).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message.error(data.msg);
        }
        this.dialogVisible = false;
      });
    },
    handleAllocation(index, row) {
      this.roleForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._httpUpdateVersion(
            this.roleForm.type,
            this.roleForm.version,
            this.roleForm.pkgUrl,
            this.roleForm.change ? 1 : 0
          );
        } else {
          return false;
        }
      });
    },
    qx1() {
      this.dialogVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    beforeAvatarUpload(file) {
      let fd = new FormData();
      fd.append("upload", file);
      axios.post("/sendApk", fd, {}).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.$alert(data.data, "apk下载地址", {
            confirmButtonText: "确定",
            callback: action => {
              // this.$message({
              //   type: "info",
              //   message: `action: ${action}`
              // });
            }
          });
          this._httpGetAppVersion();
        } else {
          this.$message.error(data.msg);
        }
      });
      return;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  },
  mounted() {
    this._httpGetAppVersion();
  }
};
</script>

<style scoped>
</style>
