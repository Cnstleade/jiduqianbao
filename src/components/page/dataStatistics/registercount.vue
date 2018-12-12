<template>
    <div class="container">

<el-tabs type="border-card"  v-model="activeName" @tab-click="handleClick" v-loading="lodings">
  <el-tab-pane label="按日统计" name="first">
        <el-row class="m20 col-flex-end">
            <el-col :span="13">
                    <el-button class="l20" type="primary" @click="reset" style="margin-left: 10px;">重置</el-button>
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
        <el-row style="margin-top:40px">
            <el-col :span="18">
	           <div id="myChart" :style="{ height: '500px'}"></div>
            </el-col>
            <el-col :span="6">
                <div id="dataChart" :style="{ height: '500px'}"></div>
            </el-col>
        </el-row>   
  </el-tab-pane>
  <el-tab-pane label="按月统计" name="second">
        <el-row class="m20 col-flex-end">
            <el-col :span="13">
                    <el-button class="l20" type="primary" @click="reset1" style="margin-left: 10px;">重置</el-button>
                    <el-date-picker
                     class="l20"
                      v-model="month"
                      type="month"
                      placeholder="选择月">
                    </el-date-picker> 
                        <el-tag>至</el-tag>
                    <el-date-picker
                     class="l20"
                      v-model="month1"
                      type="month"
                      placeholder="选择月">
                    </el-date-picker>                     
                    <el-button @click="handleSearch1" class="l20" style="margin-left:20px" icon="el-icon-search"  type="success" circle></el-button>                                                                  
            </el-col>            
        </el-row>      
        <el-row style="margin-top:40px">
            <el-col :span="18">
	           <div id="myChart1" :style="{ height: '500px'}"></div>
            </el-col>
            <el-col :span="6">
                <div id="dataChart2" :style="{ height: '500px'}"></div>
            </el-col>
        </el-row>   
  </el-tab-pane>
</el-tabs>        
 
    </div>
</template>

<script>
import { timeFormat } from "../../../config/time";
import { httpRegistercount} from "@/service/http";
export default {
  data() {
    return {
      activeName: "first",
      search: {},
      month: "",
      month1: "",
      lodings: false
    };
  },
  methods: {
    getLastDay(year, month) {
      var new_year = year; //取当前的年份
      var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        //如果当前大于12月，则年份转到下一年
        new_month -= 12; //月份减
        new_year++; //年份增
      }
      var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
      return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期
    },

    //得到销售统计
    _httpGetsales(salesCountType, begainTimeString, endTimeString, type) {

      httpRegistercount(salesCountType, begainTimeString, endTimeString, type)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let xData = [];
            let sData = {
              size: [],
   
       
            };
            data.data.forEach(v => {
              salesCountType == 1
                ? xData.push(timeFormat(v.time))
                : xData.push(v.timeString);
              sData.size.push(v.size);

            });
            this.drawLine(xData, sData, type);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
        });
    },
    _httpDataGetsales(type) {
      httpRegistercount(
        1,
        timeFormat(new Date()) + " 00:00:00",
        timeFormat(new Date(), 1) + " 00:00:00"
      )
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let xData = [];
            let sData = {
              size: data.data.length>0?data.data[0].size:'',

            };

            // data.data.forEach(v => {
            //   xData.push(timeFormat(v.time));
            //   sData.allMoney.push(v.allMoney);
            //   sData.allMoney_actual.push(v.allMoney_actual);
            //   sData.newAllMoney.push(v.newAllMoney);
            //   sData.newAllMoney_actual.push(v.newAllMoney_actual);
            //   sData.oldAllMoney.push(v.oldAllMoney);
            //   sData.oldAllMoney_actual.push(v.oldAllMoney_actual);
            // });
            this.drawDataLine(sData, type);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({
            message: "网络错误请联系管理员",
            type: "error"
          });
        });
    },
    //画图
    drawLine(xData, sData, type = true) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = type
        ? this.$echarts.init(document.getElementById("myChart"))
        : this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption({
        // backgroundColor: "rgba(3, 10, 21, 0.42)", //rgba设置透明度0.1
        title: {
          text: "用户注册统计",
          subtext: "数据来源：极度钱包"
        },
        tooltip: {
          trigger: "axis"
        },
        //图例名
        legend: {
          data: [
            "个数",
          ]
        },
        grid: {
          left: "3%", //图表距边框的距离
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        //工具框，可以选择
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        //x轴信息样式
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: xData,
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: "black"
            }
          },
          //x轴文字旋转
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },

        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} "
            }
          }
        ],
        series: [
          //虚线
          {
            name: "个数",
            type: "line",
            symbolSize: 4, //拐点圆的大小
            color: ["red"], //折线条的颜色
            data: sData.size,
            smooth: false, //关键点，为true是不支持虚线的，实线就用true
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "solid" //'dotted'虚线 'solid'实线
                }
              }
            }
          },
          //实线
          {
            name: "不通过次数",
            type: "line",
            symbol: "circle",
            symbolSize: 4,
            itemStyle: {
              normal: {
                color: "rgb(67, 67, 72)",
                borderColor: "rgb(67, 67, 72)" //拐点边框颜色
              }
            },
            data: sData.exeamineError
          },
          {
            name: "通过次数",
            type: "line",
            //                stack: '总量',
            symbolSize: 4,
            color: ["orange"],
            smooth: false, //关键点，为true是不支持虚线的，实线就用true
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  type: "solid" //'dotted'虚线 'solid'实线
                }
              }
            },
            data: sData.exeamineSuccess
          },
        ]
      });
    },
    //画当天的图
    drawDataLine(sData, type) {
      var dataAxis = [
        "个数",

      ];
      var data = [
        sData.size,
      ];
      var yMax = 10;
      var dataShadow = [];

      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
      }
      let myChart = type
        ? this.$echarts.init(document.getElementById("dataChart"))
        : this.$echarts.init(document.getElementById("dataChart2"));

      // 绘制图表

      // 绘制图表
      myChart.setOption({
        // backgroundColor: "rgba(3, 10, 21, 0.42)", //rgba设置透明度0.1
        title: {
          text: timeFormat(new Date()) + "（当天用户注册情况）",
          subtext: "数据来源：极度钱包"
        },
        grid: {
          left: "3%", //图表距边框的距离
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          data: dataAxis,
          //   axisLabel: {
          //     inside: true,
          //     textStyle: {
          //       color: "#fff"
          //     }
          //   },
          //   axisTick: {
          //     show: false
          //   },
          //   axisLine: {
          //     show: false
          //   },
          //   z: 10
          type: "category",
          boundaryGap: true,
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: "black"
            }
          },
          //x轴文字旋转
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: dataShadow,
            animation: false
          },
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            },
            itemStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: data
          }
        ]
      });
    },
    //重置
    reset() {
      this.search = {};
      this.handleSearch();
    },
    reset1() {
      this.month = "";
      this.month1 = "";
      this.handleSearch1();
    },
    //查找
    handleSearch() {
      if (this.search.time && this.search.time.length) {
        this._httpGetsales(
          1,
          this.search.time[0] + " 00:00:00",
          timeFormat(new Date(this.search.time[1]), 1) + " 00:00:00",
          true
        );
      } else {
        this._httpGetsales(
          1,
          timeFormat(new Date(), -30) + " 00:00:00",
          timeFormat(new Date(), 1) + " 00:00:00",
          true
        );
      }
    },
    handleSearch1() {
      let data = timeFormat(this.month);

      let date = this.getLastDay(
        timeFormat(this.month).split("-")[0],
        timeFormat(this.month).split("-")[1]
      );

      let date1 =
        timeFormat(this.month).split("-")[0] +
        "-" +
        timeFormat(this.month).split("-")[1] +
        "-" +
        date;

      let date2 = timeFormat(new Date(date1), 1);
      if (this.month && this.month1) {
        this._httpGetsales(
          2,
          timeFormat(this.month) + " 00:00:00",
          timeFormat(
            timeFormat(timeFormat(new Date(this.month1))).split("-")[0] +
              "-" +
              timeFormat(timeFormat(new Date(this.month1))).split("-")[1] +
              "-" +
              this.getLastDay(
                timeFormat(timeFormat(new Date(this.month1))).split("-")[0],
                timeFormat(timeFormat(new Date(this.month1))).split("-")[1]
              ),
            1
          ) + " 00:00:00",
          false
        );
      } else {
        this._httpGetsales(
          2,
          timeFormat(new Date(), -30) + " 00:00:00",
          timeFormat(new Date(), 1) + " 00:00:00",
          false
        );
      }
    },
    handleClick(tab, event) {
      this.lodings = true;
      tab.name === "second" ? this.handleSearch1() : this.handleSearch();
      tab.name === "second"
        ? this._httpDataGetsales(false)
        : this._httpDataGetsales(true);
      setTimeout(() => {
        this.lodings = false;
      }, 500);
    }
  },
  mounted() {
    //   let data = timeFormat(new Date());

    //   let date1 =
    //     timeFormat(timeFormat(new Date())).split("-")[0] +
    //     "-" +
    //     timeFormat(timeFormat(new Date())).split("-")[1] +
    //     "-" +
    //     date;

    let date2 = timeFormat(
      timeFormat(timeFormat(new Date())).split("-")[0] +
        "-" +
        timeFormat(timeFormat(new Date())).split("-")[1] +
        "-" +
        this.getLastDay(
          timeFormat(timeFormat(new Date())).split("-")[0],
          timeFormat(timeFormat(new Date())).split("-")[1]
        ),
      1
    );

    this._httpGetsales(
      1,
      timeFormat(new Date(), -31) + " 00:00:00",
      timeFormat(new Date(), 1) + " 00:00:00",
      true
    );
    this._httpDataGetsales(true);
  }
};
</script>

<style>
</style>

