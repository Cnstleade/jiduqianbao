<template>
    <div class="container">
        <el-row>
            <el-alert
              :title="title"
              :closable="false"
              type="info">
            </el-alert>           
        </el-row> 
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allSalesVolume}}</div>
                        <div class="grid-cont-right">
                            <div>总销售额</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allSalesCost}}</div>
                        <div class="grid-cont-right">
                            <div>总销售成本</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allSalesVolume-dataList.allSalesCost}}</div>
                        <div class="grid-cont-right">
                            <div>总销售利润</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>        
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allCustNumber}}</div>
                        <div class="grid-cont-right">
                            <div>总客户数</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>                
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allApplyNumber}}</div>
                        <div class="grid-cont-right">
                            <div>总订单数</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allRepaymentMoney}}</div>
                        <div class="grid-cont-right">
                            <div>总还款金额</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>  
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allLateMoney}}</div>
                        <div class="grid-cont-right">
                            <div>总已还款滞纳金</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>  
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allAlreadyRepaymentCommissionMoney}}</div>
                        <div class="grid-cont-right">
                            <div>总已还款手续费</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>  
        <el-row :gutter="20" class="m20">
            <el-col :span="10" :offset="5">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div :class="'grid-content grid-con-2'">
                        <div class="grid-con-default grid-con-icon">{{dataList.allAlreadyRepaymentSalesCost}}</div>
                        <div class="grid-cont-right">
                            <div>总已还款成本</div>
                        </div>                        
                    </div>
                </el-card>
            </el-col>
        </el-row>                                        
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { httpConditionofbusiness } from "../../../service/http";
export default {
  data() {
    return {
      title: "平台经营管理统计",
      dataList: {}
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
    getData() {
      httpConditionofbusiness(this.loginId)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.dataList = JSON.parse(JSON.stringify(data.data));
          } else {
            this.$message.error(data.msg);

          }
        })
        .catch(err => {
          this.$message.error("网络错误请联系管理员");

        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 50px;
  font-weight: bold;
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.grid-con-default {
  flex: 1;
  text-align: center;
  font-size: 26px;
  line-height: 100px;
  color: #fff;
}
.grid-con-2 .grid-con-icon {
  background: #ff6c5c;
}

.grid-con-2 .grid-num {
  color: #ff6c5c;
}
</style>

