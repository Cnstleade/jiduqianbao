<template>
    <div id="register">
      <scroll ref="scroll" class="recommend-content" :data="discList" :click="false"> 
        <div>
          <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
              <slider>
                  <div v-for="item in recommends" :key = "item.uid">
                      <a href="#">
                          <img  class="needsclick" :src="item.picUrl" @load="loadImage">
                      </a>
                  </div>
              </slider>
          </div>          
          <div  class="recommend-list">
            <div class="form-list">
              <div>
                  <input 
                   style="opacity:0.95"
                  class="form-mobile"
                  v-model="mobile"
                  type="tel" name="mobile"
                   id="" placeholder="手机号码"> 
                  <input 
                  class="form-sms"
                  v-model="sms"
                   
                   id="" placeholder="短信验证码">  
                  <button class="btn-1" @click="getSms()" v-if="!getSmsTrue"  >获取</button> 
                  <button class="btn-1 btn-2"  v-if="getSmsTrue" style="color:#fffsss;" > 
                    <i class="el-icon-loading" style="color:#fff"></i>
                    {{time}}秒</button> 
                  <div class="text">
                      <label >
                          <input v-model="check" type="checkbox" checked="" id="agree" value="0">
                          我已阅读并同意
                          <a href="javascript:void(0)">《极度钱包服务协议》</a>
                          <!-- 和
                          <a href="/api/pop/agreement">《赠送保险协议》</a> -->
                      </label>              
                  </div>  
                  <button 
                  class="form-go"
            
                  @click="submit()"
                  >    立即拿钱  </button>  
              </div>
            </div>
          </div>
          <!-- <div class="recommend-list2" style="position:relative" >
           
                <img src="../../assets/img/footer.jpg" alt="" height="200" width="100%" >
                 <button  @click.prevent="download" style="position:absolute;display:block;width:50%;height:50%;bottom:0;left:0;background:rgba(0,0,0,0)">
                </button>
          </div> -->
        </div>
      </scroll>
    </div>
</template>

<script>
import Slider from "@/components/app/slider";
import { getH5Register, getH5Sms } from "../../service/http";
import Scroll from "@/components/app/scroll";
export default {
  data() {
    return {
      code: "",
      mobile: "",
      sms: "",
      android: "",
      ios: "",
      time: 60,
      recommends: [
        {
          uid: 1,
          picUrl: require("../../assets/img/bannner1.jpg"),
          linkUrl: ""
        },
        {
          uid: 2,
          picUrl: require("../../assets/img/bannner2.jpg"),
          linkUrl: ""
        },
        {
          uid: 3,
          picUrl: require("../../assets/img/bannner3.jpg"),
          linkUrl: ""
        }
      ],
      loop: true,
      discList: [
        {
          img: require("../../assets/top.jpg"),
          name: "1鹅鹅鹅",
          dissname: "鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅浮绿水，红掌拨清波。"
        }
      ],
      getSmsTrue: false,
      check: true
    };
  },
  components: {
    Scroll,
    Slider
  },
  methods: {
    // _getH5Register(url, moblie, PromotionCode, PromotionMoblie) {
    //   getH5Register(url, moblie, PromotionCode, PromotionMoblie)
    //     .then(res => {
    //       _this.code = null;
    //       _this.code = res.data;
    //     })
    //     .catch();
    // },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    },
    _rem(div) {
      var docEl = document.documentElement,
        di = document.getElementById(div),
        clientWidth = docEl.clientWidth;
      di.style.fontSize = 20 * (clientWidth / 320) + "px";
    },
    rem(doc, win, div) {
      var docEl = doc.documentElement,
        di = document.getElementById(div),
        resizeEvt =
          "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          di.style.fontSize = 20 * (clientWidth / 320) + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    },
    getSms() {
      let _this = this;
      var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
      if (this.mobile && isMobile.test(this.mobile)) {
        this.getSmsTrue = true;
        this.timer = setInterval(() => {
          this.getSmsTrue = false;
        }, 60000);
        this.timerr = setInterval(() => {
          this.time--;
        }, 1000);
        getH5Sms(this.mobile)
          .then(res => {
            _this.code = null;
            _this.code = parseInt(res.data) - parseInt(this.mobile) + 521;
          })
          .catch();
      } else {
        this.$message.error("请输入正确手机号");
      }
    },
    submit() {
      var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
      var url = window.location.href;
      if (this.mobile && isMobile.test(this.mobile)) {
        if (this.check) {
          if (this.sms == this.code) {
            let url =
              window.location.href.split("?")[0].split("appRegister")[0] +
              "appRegister";
            let code = this.$route.params.code ? this.$route.params.code : "";
            let mobile = this.$route.params.mobile
              ? this.$route.params.mobile
              : "";
            let source = 3;

            if (
              navigator.userAgent.indexOf("Android") > -1 ||
              navigator.userAgent.indexOf("Linux") > -1
            ) {
              //安卓手机
              source = 1;
              // window.location.href = "mobile/index.html";
            } else if (navigator.userAgent.indexOf("iPhone") > -1) {
              //苹果手机
              // window.location.href = "mobile/index.html";
              source = 2;
            } else if (navigator.userAgent.indexOf("Windows Phone") > -1) {
              //winphone手机
              source = 3;
              // window.location.href = "mobile/index.html";
            }
            // let  code = window.location.search ? window.location.search.slice(1).split('&')[0].split('=')[1] :'';
            // let  mobile = window.location.search?window.location.search.slice(1).split('&')[1]?window.location.search.slice(1).split('&')[1].split('=')[1]:'':'';
            getH5Register(this.sms, url, this.mobile, code, mobile, source)
              .then(res => {
                let data = res.data;
                if (data.message == "注册成功") {
                  this.$message({
                    message: "注册成功",
                    type: "success"
                  });
                  this.mobile = "";
                  this.sms = "";
                  clearTimeout(this.timer);
                  clearTimeout(this.timerr);
                  this.getSmsTrue = false;
                  this.time = 60;
                  this.$router.push("/download");
                  // var u = navigator.userAgent;

                  // if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
                  //   //安卓手机
                  //   window.location.href = this.android;
                  //   // window.location.href = "mobile/index.html";
                  // } else if (u.indexOf("iPhone") > -1) {
                  //   //苹果手机
                  //   // window.location.href = "mobile/index.html";
                  //   window.location.href = this.ios;
                  // } else if (u.indexOf("Windows Phone") > -1) {
                  //   //winphone手机
                  //   window.location.href = this.android;
                  //   // window.location.href = "mobile/index.html";
                  // }
                } else {
                  if (data.message == "该号码已注册，请直接登录") {
                    this.mobile = "";
                    this.sms = "";
                    clearTimeout(this.timer);
                    clearTimeout(this.timerr);
                    this.getSmsTrue = false;
                    this.time = 60;
                    this.$message({
                      message: data.message,
                      type: "success"
                    });
                    this.$router.push("/download");
                    // var u = navigator.userAgent;
                    // if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
                    //   //安卓手机
                    //   window.location.href = this.android;
                    //   // window.location.href = "mobile/index.html";
                    // } else if (u.indexOf("iPhone") > -1) {
                    //   //苹果手机
                    //   // window.location.href = "mobile/index.html";
                    //   window.location.href = this.ios;
                    // } else if (u.indexOf("Windows Phone") > -1) {
                    //   //winphone手机
                    //   window.location.href = this.android;
                    //   // window.location.href = "mobile/index.html";
                    // }
                  } else {
                    this.$message({
                      message: data.message,
                      type: "error"
                    });
                    this.sms = "";
                    clearTimeout(this.timer);
                    clearTimeout(this.timerr);
                    this.getSmsTrue = false;
                    this.time = 60;
                  }
                }
              })
              .catch(err => {
                console.log(this.android, this.ios);
              });
          } else {
            this.$message.error("请输入正确验证码");
          }
        } else {
          this.$message.error("请同意服务协议");
        }
      } else {
        this.$message.error("请输入正确手机号");
      }
    },
    download() {
      var u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
        //安卓手机
        window.location.href = this.android;
        // window.location.href = "mobile/index.html";
      } else if (u.indexOf("iPhone") > -1) {
        //苹果手机
        // window.location.href = "mobile/index.html";
        window.location.href = this.ios;
      } else if (u.indexOf("Windows Phone") > -1) {
        //winphone手机
        window.location.href = this.android;
        // window.location.href = "mobile/index.html";
      }
    }
  },
  beforeMount() {
    $.ajax({
      type: "POST",
      url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
      data: { version: 1, pname: "极度钱包" },
      success: data => {
        this.ios = JSON.parse(data).url;
      },
      error: function() {
        alert("错误");
      }
    });
    $.ajax({
      type: "POST",
      url: "http://h5.tiqianfu.com/admin/api/getDownUrl",
      data: { version: 2, pname: "极度钱包" },
      success: data => {
        this.android = JSON.parse(data).url;
      },
      error: function() {
        alert("错误");
      }
    });
  },
  mounted() {
    setTimeout(() => {
      this._rem("register");
      this.rem(document, window, "register");
      clearTimeout(this.timer);
      clearTimeout(this.timerr);
      this.getSmsTrue = false;
      this.time = 60;
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.timerr);
    this.getSmsTrue = false;
    this.time = 60;
  },
  deactivated() {
    clearTimeout(this.timer);
    clearTimeout(this.timerr);
    this.getSmsTrue = false;
    this.time = 60;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common.scss";
@import "@/assets/css/mixin.scss";
#register {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  background: rgba(251, 212, 50, 0.6);
  background-size: 100% auto;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      padding: 2rem 1.2rem;
      font-size: 0;
      .form-mobile {
        padding: 0 0.5rem;
        @include wh(100%, 4rem);
        @include borderRadius(0.8rem);
        @include font(1.2rem, 4rem);
      }
      .form-sms {
        margin-top: 0.8rem;
        padding: 0 0.5rem;
        @include wh(60%, 4rem);
        @include font(1.2rem, 4rem);
        @include borderRadius(0.8rem);
      }
      .btn-1 {
        @include wh(35%, 4rem);
        @include borderRadius(0.8rem);
        margin-left: 5%;
        @include font(1.2rem, 4rem);
        background: #66b1ff;
        color: #fff;
      }
      .btn-2 {
        background: #85ce61;
      }
      .text {
        margin-top: 0.5rem;
        padding: 0;
        color: red;
        @include font(0.4rem, 1rem);
        input {
          vertical-align: -2px;
        }
      }
      .form-go {
        margin-top: 0.5rem;
        @include wh(100%, 4rem);
        @include borderRadius(0.8rem);
        @include font(1.2rem, 4rem);
        background: #00aa84;
        color: #fff;
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .needsclick {
    height: 12rem;
  }
  .recommend-list2 {
    width: 100%;
    height: 200px;
  }
}
</style>

