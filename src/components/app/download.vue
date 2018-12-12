<template>
    <div>
       手机APP下载页面：根据终端辨别下载地址
    </div>
</template>
<script>
export default {
  data() {
    return {
      ios: "",
      android: "",
      b: "ni"
    };
  },
  methods: {
    _initT() {
      let a, b;
      let that = this;
      $.ajax({
        type: "POST",
        url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
        data: { version: 1, pname: "秒达钱包" },
        success: data => {
          that.a = JSON.parse(data).url;
        },
        error: function() {
          alert("错误");
        }
      });
      $.ajax({
        type: "POST",
        url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
        data: { version: 2, pname: "秒达钱包" },
        success: data => {
          that.b = JSON.parse(data).url;
        },
        error: function() {
          alert("错误");
        }
      });

      var u = navigator.userAgent;

      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        window.location.href = b;
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        window.location.href = a;
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        window.location.href = b;
        // window.location.href = "mobile/index.html";
      }
    },
    nextRegister() {
      var args = arguments;
      var count = 0;
      var comm = {};
      function nextTime() {
        count++;
        if (count < args.length) {
          if (
            args[count] &&
            Object.prototype.toString.call(args[count]) == "[object Function]"
          ) {
            args[count](comm, nextTime);
          }
        }
      }
      if (
        args[count] &&
        Object.prototype.toString.call(args[count]) == "[object Function]"
      ) {
        args[count](comm, nextTime);
      }
    },
    fn1(comm, next) {
      let _this = this;
      $.ajax({
        type: "POST",
        url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
        data: { version: 1, pname: "秒达钱包" },
        success: data => {
          _this.ios = JSON.parse(data).url;
        },
        error: function() {
          alert("错误");
        }
      });
      $.ajax({
        type: "POST",
        url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
        data: { version: 2, pname: "秒达钱包" },
        success: data => {
          _this.android = JSON.parse(data).url;
        },
        error: function() {
          alert("错误");
        }
      });
      console.log(_this.ios);
      comm.ios = _this.ios;
      comm.android = _this.android;
      next();
    },
    fn2(comm, next) {
      let _this = this;
      console.log(_this.a);
      console.log(comm.android, comm.ios);
      next();
    },
    fn3(comm, next) {
      console.log("333333");
    },
    ajax1() {}
  },
  beforeMount() {},
  mounted() {
    let _this = this;
    //  this._initT();
    //this.nextRegister(this.fn1, this.fn2, this.fn3);

    // 封装地形 GeoJSON 数据接口
    // 将每个数据接口封装为一个返回 Promise 的函数
    function getArea() {
      let _this = this;
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "POST",
          url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
          data: { version: 1, pname: "极度钱包" },
          success: data => {
            resolve(JSON.parse(data).url);
          },
          error: function() {
            alert("错误");
          }
        });

        // fetch("./resources/china.json").then(resp =>
        //   resp.json().then(china => resolve(china))
        // );
      });
    }

    // 封装分色地图数据接口
    function getPopulation() {
      let _this = this;
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "POST",
          url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
          data: { version: 2, pname: "极度钱包" },
          success: data => {
            resolve(JSON.parse(data).url);
          },
          error: function() {
            alert("错误");
          }
        });
      });
    }

    // 封装城市数据接口
    // function getCity() {
    //   return new Promise((resolve, reject) => {
    //     fetch("./resources/city.json").then(resp =>
    //       resp.json().then(data => resolve(data))
    //     );
    //   });
    // }
    function display_alert(ios, android) {
      // _this.$alert("这是一段内容", "标题名称", {
      //   confirmButtonText: "确定",
      //   callback: action => {
      //     _this.$message({
      //       type: "info",
      //       message: `action: ${action}`
      //     });
      //   }
      // });
      _this
        .$confirm(
          "手机设置-通用-设备管理-点击信任“Odpady -Chlumčák s.r.o",
          "提示",
          {
            confirmButtonText: "确定",
            type: "warning",
            center: true
          }
        )
        .then(() => {
          var u = navigator.userAgent;
          if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
            //安卓手机
            window.location.href = android;
            // window.location.href = "mobile/index.html";
          } else if (u.indexOf("iPhone") > -1) {
            //苹果手机
            // window.location.href = "mobile/index.html";
            window.location.href = ios;
          } else if (u.indexOf("Windows Phone") > -1) {
            //winphone手机
            window.location.href = android;
            // window.location.href = "mobile/index.html";
          } else {
            window.location.href = android;
          }
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "请阅读点击确认再继续"
          });
        });
    }
    // 使用 Promise.all 以在三个数据接口均异步成功后，执行回调逻辑
    Promise.all([getArea(), getPopulation()]).then(values => {
      // 依次从返回的数据接口数组中获取不同接口数据
      let ios = values[0];
      let android = values[1];
      // let city = values[2];
      // 使用数据
      console.log(this);
      display_alert(ios, android);
    });
  }
};
</script>
<style scoped>
</style>

