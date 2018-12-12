<template>
    <div class="container">
        <el-row>
            <el-alert
              title="优惠券"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row> 
        <el-row  class="m20 ">
                  <el-button type="primary" @click="addForms">新增</el-button>
        </el-row>        
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
             style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
            id="ss"
          >
            <el-table-column prop="id" label="编号" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponValue" label="优惠卷面值" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponIntervalMin" label="区间值最小" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponIntervalMax" label="区间值最大" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponTitle" label="优惠券标题" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="extinctTime" label="失效天数" align="center" width="180" >
            </el-table-column> 
            <el-table-column prop="creteTime" label="创建时间" align="center" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.creteTime!=null">
                    {{scope.row.creteTime|dateServer}}
                  </template>
                </template>
            </el-table-column>              
            <el-table-column prop="type" label="类型" align="center" width="180" >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.type==1?'':'danger'"
                      >{{scope.row.type==1?'减免利息优惠卷':''}}</el-tag>
                  </template>                  
            </el-table-column> 
            <el-table-column prop="status" label="是否删除" align="center" width="180" >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.status1?'':'danger'"
                      >{{scope.row.status?'是':'否'}}</el-tag>
                  </template>                  
            </el-table-column> 
            <el-table-column prop="imageUrl " label="样式" align="center" width="180" >
                  <template slot-scope="scope">
                      <img :src="scope.row.imageUrl" alt="" width="120" height="50">
                  </template>                  
            </el-table-column >  
             <el-table-column label="操作" align="center" min-width="150" >                                                                                                        
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
              </el-table-column > 
            <!-- <el-table-column  prop="exceedCount" label="逾期量" align="center"  min-width="120"></el-table-column>
            <el-table-column  prop="id" label="销售量逾期率" align="center"  min-width="120"></el-table-column> -->
        </el-table>   
        <el-dialog 
            title="编辑优惠券" 
            :visible.sync="dialogFormEditVisible" 
            center
            width="30%"
            >
         <el-form :model="editForm" ref="editForm" :rules="rules" >
            <el-form-item label="优惠卷面值" label-width="100px" prop="couponValue">
              <el-input v-model="editForm.couponValue" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="区间值最小" label-width="100px"  prop="couponIntervalMin">
              <el-input v-model="editForm.couponIntervalMin" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="区间值最大" label-width="100px" >
              <el-input v-model="editForm.couponIntervalMax" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="优惠券标题" label-width="100px"  prop="couponTitle">
              <el-input v-model="editForm.couponTitle" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="失效天数" label-width="100px" prop="extinctTime">
              <el-input v-model="editForm.extinctTime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" label-width="100px"  prop="type">
                <el-select v-model="editForm.type" placeholder="优惠卷的类型">
                  <!-- <el-option
                    label="减免利息优惠卷"
                    value="1">
                  </el-option> -->
                  <el-option
                        v-for="item in paymentStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>               
                </el-select> 
            </el-form-item>
            <img :src="editForm.imageUrl" alt="" width="300" height="200">
                          <el-form-item label="是否上传图片">
                <el-switch
                  v-model="editForm.img"
                  active-text="是"
                  inactive-text="否">
                </el-switch>                
              </el-form-item>
            <el-form-item  v-if="editForm.img"   label="更换图片" label-width="100px">
              <el-upload
                class="upload-demo"
                ref="uploads"
                action="1"
                :limit="3"
                :before-upload="beforeAvatarUploadEdit"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
              </el-upload>                 
            </el-form-item>                                                                                                                      
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
          </div>
        </el-dialog> 
        <el-dialog 
            title="新增优惠券" 
            :visible.sync="dialogFormAddVisible" 
            center
            width="30%"
              ref="multipleTable" 
            >
         <el-form :model="addForm" ref="addForm" :rules="rules" >
            <el-form-item label="优惠卷面值" label-width="100px" prop="couponValue">
              <el-input v-model="addForm.couponValue" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="区间值最小" label-width="100px" prop="couponIntervalMin">
              <el-input v-model="addForm.couponIntervalMin" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="区间值最大" label-width="100px">
              <el-input v-model="addForm.couponIntervalMax" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="优惠券标题" label-width="100px" prop="couponTitle">
              <el-input v-model="addForm.couponTitle" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="失效天数" label-width="100px" prop="extinctTime">
              <el-input v-model="addForm.extinctTime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" label-width="100px" prop="type">
                <el-select v-model="addForm.type" placeholder="优惠卷的类型">
                  <el-option
                    label="减免利息优惠卷"
                    value="1">
                  </el-option>
                </el-select> 
            </el-form-item>
           
            <el-form-item   label="选取图片" label-width="100px">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="1"
                :limit="3"
                :before-upload="beforeAvatarUploadAdd"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
              </el-upload>                 
            </el-form-item>  
             <div style="color:red;font-size:12px;padding-left:100px;">*必须上传图片 </div>                                                                                                                   
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormAddVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
          </div>
        </el-dialog>                        
    </div>
</template>

<script>
import {
  httpFindCouponType,
  httpDeleteCouponType,
  httpInsertCouponType,
  httpGetcustcoupondetail
} from "../../../service/http";
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      editForm: {},
      addForm: {},
      dialogFormEditVisible: false,
      dialogFormAddVisible: false,
      rules: {
        couponValue: [{ required: true, message: "请填写优惠卷面值", trigger: "blur" }],
        time: [{ required: true, message: "请填写区间值最小", trigger: "blur" }],
        couponIntervalMax: [{ required: true, message: "请填写区间值最大", trigger: "blur" }],
        couponTitle: [{ required: true, message: "请填写优惠券标题", trigger: "blur" }],
        extinctTime: [{ required: true, message: "请填写失效天数", trigger: "blur" }],
        couponIntervalMin: [{ required: true, message: "请填写区间值最小", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }]
        // recallType: [
        //   { required: true, message: "请选择类型", trigger: "change" }
        // ]
      },
      paymentStatus: [{ label: "减免利息优惠卷", value: 1 }]
    };
  },
  methods: {
    _inits() {
      this.loading = true;
      httpFindCouponType()
        .then(res => {
          this.loading = false;
          let data = res.data;
          this.tableData = data.data;
        })
        .catch(err => {
          let data = {
            code: 200,
            msg: "提交成功",
            data: [
              {
                id: 2,
                couponValue: 50,
                couponIntervalMin: 100,
                couponIntervalMax: 105,
                couponTitle: "是代表覅哦阿瑟东",
                creteTime: "2018-12-10T16:00:00.000+0000",
                extinctTime: 12,
                type: 1,
                status: true,
                imageUrl:
                  "http://cdn.jd.tiqianfu.com/images/20181211094659989.png.png"
              },
              {
                id: 1,
                couponValue: 20,
                couponIntervalMin: 100,
                couponIntervalMax: 101,
                couponTitle: null,
                creteTime: "2018-12-04T16:00:00.000+0000",
                extinctTime: 12,
                type: 1,
                status: true,
                imageUrl: "rsdv"
              }
            ]
          };
          this.loading = false;
          this.tableData = data.data;
        });
    },
    handleEdit(i, row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      this.dialogFormEditVisible = true;
    },
    handleDelete(i, row) {
      httpDeleteCouponType(row.id).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this._inits();
        } else {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        }
      });
    },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "addForm") {
            this.$refs.upload.submit();
          }
          if (formName == "editForm") {
            if (this.editForm.img) {
              this.$refs.uploads.submit();
            } else {
              httpInsertCouponType(
                this.editForm.couponValue,
                this.editForm.couponIntervalMin,
                this.editForm.couponIntervalMax,
                this.editForm.couponTitle,
                this.editForm.extinctTime,
                this.editForm.type,
                null,
                this.editForm.id
              ).then(res => {
                let data = res.data;
                if (data.code == 200) {
                  this.$message({
                    message: data.msg,
                    type: "success"
                  });
                  this.dialogFormEditVisible = false
                  this._inits();
                } else {
                  this.$message({
                    message: data.msg,
                    type: "error"
                  });
                }
              });
            }
          }
        } else {
          return false;
        }
      });
    },
    /*  重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    /* 新增矿机型号 后台管理模块 / 矿机型号新增 添加图片 */
    beforeAvatarUploadAdd(file) {
      httpInsertCouponType(
        this.addForm.couponValue,
        this.addForm.couponIntervalMin,
        this.addForm.couponIntervalMax,
        this.addForm.couponTitle,
        this.addForm.extinctTime,
        this.addForm.type,
        file
      ).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.dialogFormAddVisible = false;
          this._inits();
        } else {
          this.$message({
            message: data.msg,
            type: "error"
          });
        }
      });
    },
    beforeAvatarUploadEdit(file) {
      console.log(1111);
      httpInsertCouponType(
        this.editForm.couponValue,
        this.editForm.couponIntervalMin,
        this.editForm.couponIntervalMax,
        this.editForm.couponTitle,
        this.editForm.extinctTime,
        this.editForm.type,
        file,
        this.editForm.id
      ).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.dialogFormEditVisible = false
          this._inits();
        } else {
          this.$message({
            message: data.msg,
            type: "error"
          });
        }
      });
    },
    addForms() {
      this.addForm = {};
      this.dialogFormAddVisible = true;
    }
  },
  mounted() {
    this._inits();
  }
};
</script>

<style>
</style>

