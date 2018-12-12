<template>
    <div class="container">
        <el-row>
            <el-alert
              title="优惠券客户列表"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row> 
        <el-row class="mt4 ">
            <!-- <div style="flex-grow:1" >
                <el-button  icon="el-icon-plus" @click="handleAdd" type="primary">新增</el-button>
            </div>              -->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
             <el-form-item>
                  <el-button type="success" @click="reset">重置</el-button>
              </el-form-item>               
              <el-form-item >
                <el-date-picker
                style="width:400px"
                      v-model="formInline.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="通过时间开始"
                      end-placeholder="通过时间结束">
                </el-date-picker> 
              </el-form-item>  
              <el-form-item>
                <el-input
                      placeholder="请输入最小使用次数"
                      v-model="formInline.userNumber"
                       type="number" 
                      clearable>
                </el-input>   
              </el-form-item> 
              <el-form-item>
                <el-input
                      placeholder="请输入最大逾期次数"
                      v-model="formInline.overdueNumber"
                       type="number" 
                      clearable>
                </el-input>   
              </el-form-item>  
              <el-form-item >
                <el-date-picker
                style="width:400px"
                      v-model="formInline.times"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="最后提现开始"
                      end-placeholder="最后提现结束">
                </el-date-picker> 
              </el-form-item>  
                <el-select v-model="formInline.status" placeholder="优惠卷是否发放">
                  <el-option
                    label="发放"
                    value="true">
                  </el-option>
                  <el-option
                    label="没有"
                    value="false">
                  </el-option>
                </el-select>                                                     
              <el-form-item>
                <el-button @click="handleSearch" class="mr-4"  icon="el-icon-search"  type="success" circle></el-button>
              </el-form-item>
            </el-form>            
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
            highlight-current-row 
            style="width: 100%;font-weight:bold"
           
                 @selection-change="handleSelectionChange"
            class="mt-3"
            id="darkCell"
            v-loading="loading">
        <el-table-column
              type="selection"
              width="55">
            </el-table-column>    
            <el-table-column prop="custUserId" label="客户id" align="center" width="150"></el-table-column>
            <el-table-column prop="custUserName" label="姓名" align="center" width="150"></el-table-column>
          
            <el-table-column prop="passedTime" label="审核通过时间" align="center" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.passedTime!=null">
                    {{scope.row.passedTime|dateServer}}
                  </template>
                </template>
            </el-table-column>
            <el-table-column prop="userNumber" label="使用次数" align="center" min-width="160">
            </el-table-column>            
            <el-table-column prop="overdueNumber" label="逾期次数" align="center" min-width="160">
    
            </el-table-column>
            <el-table-column prop="lastUseTime" label="最后使用时间" align="center" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.lastUseTime!=null">
                    {{scope.row.lastUseTime|dateServer}}
                  </template>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="couponSize" label="优惠卷张数" align="center" min-width="140">
            </el-table-column> -->
            <el-table-column prop="lastGetCouponTime" label="优惠卷最后获得时间" align="center" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.lastGetCouponTime!=null">
                    {{scope.row.lastGetCouponTime|dateServer}}
                  </template>
                </template>
            </el-table-column>  
             <el-table-column label="操作" align="center" min-width="150" >                                                                                                        
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">分配</el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="handleShow(scope.$index, scope.row)">详情</el-button>                  
              </template>
              </el-table-column >                       
        </el-table>    
     <el-row class="m20" v-if="total>0">
      <el-button type="primary" style="float:left" @click="handelConfigAll" :disabled="multipleSelection.length==0">批量分配</el-button>       
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
            title="分配" 
            :visible.sync="dialogFormEditVisible" 
            center
            width="30%"
            >
         <el-form :model="editForm" ref="editForm" :rules="rules" >
            <el-form-item label="类型" label-width="100px">
                <el-select v-model="editForm.couponTypeId" placeholder="优惠卷的类型">
                     <el-option
                        v-for="item in paymentStatus"
                        :key="item.id"
                        :label="item.couponTitle"
                        :value="item.id">
                      </el-option>  
                </el-select> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
          </div>
        </el-dialog>  
        <el-dialog 
            title="批量分配" 
            :visible.sync="dialogVisible" 
            center
            width="30%"
            >
         <el-form :model="editForms" ref="editForms" :rules="rules" >
            <el-form-item label="类型" label-width="100px">
                <el-select v-model="editForms.couponTypeId" placeholder="优惠卷的类型">
                <el-option
                        v-for="item in paymentStatus"
                        :key="item.id"
                        :label="item.couponTitle"
                        :value="item.id">
                      </el-option>    
                </el-select> 
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('editForms')">确 定</el-button>
          </div>
        </el-dialog>   
        <el-dialog 
            title="详情" 
            :visible.sync="dialogFormShowVisible" 
            center
            width="70%"
            >
        <el-table
            :data="showData"  
            border  
        
            tooltip-effect="dark"
             style="width: 100%;font-weight:bold"
            class="m20"
      
          >
            <el-table-column prop="custId" label="编号" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponValue" label="优惠卷面值" align="center" width="180" >
            </el-table-column>   
            <!-- <el-table-column prop="couponIntervalMin" label="区间值最小" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="couponIntervalMax" label="区间值最大" align="center" width="180" >
            </el-table-column>    -->
            <el-table-column prop="couponTitle" label="优惠券标题" align="center" width="180" >
            </el-table-column>   
            <el-table-column prop="extinctTime" label="失效天数" align="center" width="180" >
                <template slot-scope="scope">
                  <template v-if="scope.row.extinctTime!=null">
                    {{scope.row.extinctTime|dateServer}}
                  </template>
                </template>
            </el-table-column> 
            <el-table-column prop="createTime" label="创建时间" align="center" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.createTime!=null">
                    {{scope.row.createTime|dateServer}}
                  </template>
                </template>
            </el-table-column>              
            <!-- <el-table-column prop="type" label="类型" align="center" width="180" >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.type==1?'':'danger'"
                      >{{scope.row.type==1?'减免利息优惠卷':''}}</el-tag>
                  </template>                  
            </el-table-column>  -->
            <el-table-column prop="status" label="是否删除" align="center" width="180" >
                  <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.status1?'':'danger'"
                      >{{scope.row.status?'是':'否'}}</el-tag>
                  </template>                  
            </el-table-column> 
            <!-- <el-table-column prop="imageUrl " label="样式" align="center" width="180" >
                  <template slot-scope="scope">
                      <img :src="scope.row.imageUrl" alt="" width="120" height="50">
                  </template>                  
            </el-table-column >   -->
        </el-table>   
        </el-dialog>                                              
    </div>
</template>

<script>
import {
  httpGetcustcouponlist,
  httpInsertCustCoupon,
  httpFindCouponType,
  httpGetcustcoupondetail
} from "../../../service/http";
export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0,
      dialogFormEditVisible: false,
      dialogFormShowVisible: false,
      editForm: {},
      rules: {},
      multipleSelection: [],
      dialogVisible: false,
      dynamicTags: [], //订单号
      editForms: {},
      paymentStatus: [],
      showData: []
    };
  },
  methods: {
    g1() {
      httpFindCouponType()
        .then(res => {
          let data = res.data;
          this.paymentStatus = data.data;
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
          this.paymentStatus = data.data;
        });
    },
    handleShow(index, row) {
      httpGetcustcoupondetail(row.custUserId).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.dialogFormShowVisible = true;
          this.showData = data.data;
        }
      });
    },
    _init(
      npage,
      pagesize,
      userNumber,
      overdueNumber,
      withDrawTimeStringBegain,
      withDrawTimeStringEnd,
      status,
      begainTimeString,
      endTimeString
    ) {
      this.loading = true;
      httpGetcustcouponlist(
        npage,
        pagesize,
        userNumber,
        overdueNumber,
        withDrawTimeStringBegain,
        withDrawTimeStringEnd,
        status,
        begainTimeString,
        endTimeString
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let tableData = data.data.list;
            this.tableData = tableData;
            this.total = data.data.allpage;
          }
          this.loading = false;
        })
        .catch(() => {
          let data = {
            code: 200,
            msg: "提交成功",
            data: {
              npage: 1,
              allpage: 87,
              pagesize: 5,
              list: [
                {
                  custUserId: 150,
                  custUserName: "晁娜",
                  passedTime: "2018-08-09T23:43:01.000+0000",
                  userNumber: 4,
                  overdueNumber: 0,
                  lastUseTime: "2018-08-24T11:11:00.000+0000",
                  couponSize: 0,
                  lastGetCouponTime: null
                },
                {
                  custUserId: 150,
                  custUserName: "晁娜",
                  passedTime: "2018-08-09T23:43:01.000+0000",
                  userNumber: 4,
                  overdueNumber: 0,
                  lastUseTime: "2018-08-24T11:11:00.000+0000",
                  couponSize: 0,
                  lastGetCouponTime: null
                },
                {
                  custUserId: 150,
                  custUserName: "晁娜",
                  passedTime: "2018-08-09T23:43:01.000+0000",
                  userNumber: 4,
                  overdueNumber: 0,
                  lastUseTime: "2018-08-24T11:11:00.000+0000",
                  couponSize: 0,
                  lastGetCouponTime: null
                },
                {
                  custUserId: 150,
                  custUserName: "晁娜",
                  passedTime: "2018-08-09T23:43:01.000+0000",
                  userNumber: 4,
                  overdueNumber: 0,
                  lastUseTime: "2018-08-24T11:11:00.000+0000",
                  couponSize: 0,
                  lastGetCouponTime: null
                },
                {
                  custUserId: 150,
                  custUserName: "晁娜",
                  passedTime: "2018-08-09T23:43:01.000+0000",
                  userNumber: 4,
                  overdueNumber: 0,
                  lastUseTime: "2018-08-24T11:11:00.000+0000",
                  couponSize: 0,
                  lastGetCouponTime: null
                }
              ],
              type: 0,
              countVo: null
            }
          };
          if (data.code == 200) {
            let tableData = data.data.list;
            this.tableData = tableData;
            this.total = data.data.allpage;
          }
          this.loading = false;
        });
    },
    /*     重置选择 */
    reset() {
      this.formInline = {};
      this.handleSearch();
    },
    /* 按条件搜索 */
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.formInline.time && this.formInline.time.length) {
        if (this.formInline.times && this.formInline.times.length) {
          this._init(
            this.npage,
            this.pagesize,
            this.formInline.userNumber,
            this.formInline.overdueNumber,
            this.formInline.times[0] + " 00:00:00",
            this.formInline.times[1] + " 00:00:00",
            this.formInline.status,
            this.formInline.time[0] + " 00:00:00",
            this.formInline.time[1] + " 00:00:00"
          );
        } else {
          this._init(
            this.npage,
            this.pagesize,
            this.formInline.userNumber,
            this.formInline.overdueNumber,
            null,
            null,
            this.formInline.status,
            this.formInline.time[0] + " 00:00:00",
            this.formInline.time[1] + " 00:00:00"
          );
        }
      } else {
        if (this.formInline.times && this.formInline.times.length) {
          this._init(
            this.npage,
            this.pagesize,
            this.formInline.userNumber,
            this.formInline.overdueNumber,
            this.formInline.times[0] + " 00:00:00",
            this.formInline.times[1] + " 00:00:00",
            this.formInline.status
          );
        } else {
          this._init(
            this.npage,
            this.pagesize,
            this.formInline.userNumber,
            this.formInline.overdueNumber,
            null,
            null,
            this.formInline.status
          );
        }
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
    handleEdit(index, row) {
      this.dialogFormEditVisible = true;
      this.editForm = {};
      this.editForm = JSON.parse(JSON.stringify(row));
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "editForms") {
            this._httpInsertCustCoupon(
              this.editForms.couponTypeId,
              this.dynamicTags.join(",")
            );
          }
          if (formName == "editForm") {
            this._httpInsertCustCoupon(
              this.editForm.couponTypeId,
              this.editForm.custUserId + ","
            );
          }
        } else {
          return false;
        }
      });
    },
    // 分配优惠券
    _httpInsertCustCoupon(couponTypeId, custUserIds) {
      httpInsertCustCoupon(couponTypeId, custUserIds)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$message({
              message: "分配成功",
              type: "success"
            });
            this.dialogFormEditVisible = false;
            this.dialogVisible = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handelConfigAll() {
      this.dynamicTags.length = 0;
      for (var temp of this.multipleSelection) {
        this.dynamicTags.push(temp.custUserId);
      }
      this.editForms = {};
      this.dialogVisible = true;
    }
  },
  mounted() {
    this._init(this.npage, this.pagesize);
    this.g1();
  }
};
</script>

<style>
.mt4 {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>

