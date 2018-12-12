<template>
    <div class="container">
        <el-row>
            <el-alert
              title="认证统计"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row>        
        <el-row class="m20 col-flex-end" >
               <el-button  type="primary" @click="cz">重置</el-button>
                    <el-date-picker
                    class="l20"
                    style="width:340px"
                      v-model="search.time"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>  
                    <el-button @click="handleSearch" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
        </el-row> 
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
                highlight-current-row style="width: 100%;font-weight:bold"
            class="m20"
            v-loading="loading"
          >
            <el-table-column prop="dateString" fixed label="日期" align="center" sortable width="160"></el-table-column>
            <el-table-column prop="stepOne" label="ocr识别" align="center"  min-width="120"></el-table-column>
            <el-table-column prop="stepTwo" label="银行卡绑定" align="center" min-width="120"></el-table-column>
            <el-table-column prop="stepThree" label="录音" align="center" min-width="120"></el-table-column>
            <el-table-column prop="stepFour" label="人脸识别" align="center" min-width="120"></el-table-column>
            <el-table-column prop="stepFive" label="运营商认证" align="center" min-width="120"></el-table-column>
            <el-table-column prop="stepSix" label="芝麻信用" align="center" min-width="120"></el-table-column>
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
    </div>
    
</template>

<script>
import { mapGetters } from "vuex";
import { httpAuthstatistics } from "../../../service/http";
import { timeFormat } from "../../../config/time";
export default {
  name: "credit",
  data() {
    return {
      search: {},
      tableData: [],
      loading: true,
      npage: 1,
      pagesize: 10,
      total: 0
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
    cz() {
      this.npage = 1;
      this.pagesize = 10;
      this.search = {};
      this.getData(this.npage, this.pagesize);
    },
    getData(npage, pagesize, begainTimeString, endTimeString) {
      this.loading = true;
      httpAuthstatistics(npage, pagesize, begainTimeString, endTimeString)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.allsize;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          let data = {
            code: 200,
            msg: "提交成功",
            data: {
              npage: 1,
              pagesize: 20,
              allsize: 9,
              list: [
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                },
                {
                  dateString: "2018-10-18",
                  stepOne: 7,
                  stepTwo: 6,
                  stepThree: 7,
                  stepFour: 7,
                  stepFive: 7,
                  stepSix: 7
                }
              ]
            }
          };
          if (data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.allsize;
          } else {
            this.$message.error(data.msg);
          }
          this.loading = false;
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
          timeFormat(this.search.time[1], 1) + " 00:00:00"
        );
      } else {
        this.getData(this.npage, this.pagesize);
      }
    },
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch(false);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch(false);
    }
  },
  mounted() {
    this.getData(this.npage, this.pagesize);
  }
};
</script>

<style scoped>
</style>
