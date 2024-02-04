<template>
  <div class="login">
    <div style="flex: 1">
      <div class="el-login-header">
        <el-image class="logo-img" :src="require('@/assets/logo/logo.png')" fit="cover" />
      </div>
      <div class="container">
        <div :class="isMobile ? 'box-card' : 'box-card-mobile'">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h5 v-if="redeemCode" class="login-tip model-title">您已获得智友聚合大模型 100 元体验金，现在注册即刻领取，体验GPT4等大模型。</h5>
            <!-- <div v-if="redeemCode" class="redeemCode">兑换码：{{redeemCode}}</div> -->
            <template>
              <el-form-item prop="redeemCode">
                <el-input v-model="loginForm.redeemCode" type="text" auto-complete="off" placeholder="优惠券兑换码">
                  <span slot="prefix" class="el-input__icon input-icon el-icon-full-screen" />
                </el-input>
              </el-form-item>
            </template>
            <el-form-item prop="companyName">
              <el-input v-model="loginForm.companyName" type="text" auto-complete="off" placeholder="企业名称">
                <span slot="prefix" class="el-input__icon input-icon el-icon-office-building" />
              </el-input>
            </el-form-item>
            <el-form-item prop="contactPerson">
              <el-input v-model="loginForm.contactPerson" type="text" auto-complete="off" placeholder="联系人">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="联系电话">
                <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="phoneCatpcha">
              <el-input v-model="loginForm.phoneCatpcha" auto-complete="off" placeholder="验证码" style="width: 66%" @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <span v-if="codeShow" style="color:#409EFF; font-size: 14px; float: right;" @click="getPhoneCode">获取验证码</span>
                <span v-else class="count" style="color:#666; font-size: 14px;  float: right;">{{ count }}秒后重试</span>
              </div>
            </el-form-item>
            <el-form-item style="width:100%; text-align: center;margin-bottom: 0;">
              <el-button :loading="loading" size="medium" type="primary" style="width:90%;" @click.native.prevent="handleLogin">
                新注册
              </el-button>
              <el-button type="text" class="button-phone">咨询电话：4001-08-4001</el-button>
            </el-form-item>
            <div style="width:100%; text-align: right;">
              <el-button v-if="redeemCode" :disabled="loading" size="medium" type="text" style="margin-right: 5%;" @click.native.prevent="onGotoRechargeAction">
                已有账户
              </el-button>
            </div>
          </el-form>
        </div>
        <div class="box-card-line" />
        <div class="box-card box-card-block">
          <h3 class="model-title">智友聚合大模型服务平台</h3>
          <h5 class="model-title">一次接入，解锁无限创新</h5>
          <div :class="isMobile ? 'model-list-view' : 'model-list-view-mobile'">
            <div v-for="model in modelList" :key="model.modelName" :class="isMobile ? 'model-item-box' : 'model-item-box-mobile'">
              <el-image class="model-img" :src="model.modelLogo" fit="cover" />
              <span class="model-name">{{model.modelName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 北京方云科技有限公司 farcloud.com 版权所有 </span>
      <span>京ICP备2021009355号-3</span>
    </div>
    <div class="watermark">
      <svg xmlns="http://www.w3.org/2000/svg" class="styles__StyledSVGIconPathComponent-sc-4n1c4t-0 hXuHCJ svg-icon-path-icon fill" viewBox="0 0 48 48" width="295" height="295" fill="none"><defs data-reactroot="" /><g><path d="M42 35H34" stroke="#333" stroke-width="4" stroke-linecap="round" /><path d="M31 42H27" stroke="#333" stroke-width="4" stroke-linecap="round" /><path d="M14 22L8 17H4C4 17 9.486 27 11.9999 27H44L38 22H14Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 22L18.6606 14L16 14L19 22" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 27L17.2 39L14 39L18.2667 27" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M32 11C32 12 29 13 29 13L39 13C39 13 41.8855 13 42.7446 10.7143C43.6299 8.35854 42.0442 5 39.0221 5C36 5 36 8 36 8C36 8 34.1454 7.42857 33 8C31.8546 8.57143 32 10 32 11Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></g></svg>
    </div>
    <el-dialog :visible.sync="dialogVisible" title=" " width="90%">
      <div>兑换码已使用</div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </div>
        <div>
          <el-button size="mini" type="primary" @click="goRouter(1)">跳转助手</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCorpAppUrl, smsCodeUrl } from '@/api/login';
import { modelInfoListUrl, checkRedeemCode } from '@/api/model/model';

export default {
  name: 'Login',
  data() {
    const validatePhone = (_rule, value, callback) => {
      // 获取短信验证码
      const Reg = /^1\d{10}$/;
      if (!value) {
        callback(new Error('手机号码不能为空'));
      } else if (!Reg.test(value)) {
        callback(new Error('手机号码格式不正确'));
      } else {
        callback();
      }
    };
    return {
      redeemCode: '',
      codeShow: true,
      count: '',
      timer: null,
      loginForm: {
        companyName: '',
        contactPerson: '',
        phone: '',
        phoneCatpcha: '',
        redeemCode: ''
      },
      loginRules: {
        companyName: [{ required: true, trigger: 'blur', message: '企业名称不能为空' }],
        contactPerson: [{ required: true, trigger: 'blur', message: '联系人不能为空' }],
        // phone: [{ required: true, trigger: 'blur', message: '手机号码不能为空' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        phoneCatpcha: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      loading: false,
      modelList: [],
      dialogVisible: false,
      isMobile: false,
      screenWidth: document.body.clientWidth
    };
  },
  watch: {
    screenWidth(nValue) {
      if (nValue <= 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    }
  },
  created() {
    this.redeemCode = this.$route.query.code || '';
    this.loginForm.redeemCode = this.$route.query.code || '';
    this.getModelList();
    this.checkCode();
  },
  mounted() {
    const self = this;
    window.onresize = () => {
      window.screenWidth = document.body.clientWidth;
      self.screenWidth = window.screenWidth;
    };
  },
  methods: {
    getPhoneCode() {
      // 正则验证
      if (/^1\d{10}$/.test(this.loginForm.phone)) {
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.codeShow = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.codeShow = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
        smsCodeUrl({ phoneNumber: this.loginForm.phone }).then(res => {
          console.log(res);
          const { code = 0, msg = '' } = res || {};
          if (code === 200) {
            this.$message({
              message: '验证码发送成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: msg || '验证码发送失败',
              type: 'warning',
            });
          }
        });
      } else {
        this.$message({
          message: '手机号码格式不正确',
          type: 'warning',
        });
      }
    },

    onGotoRechargeAction() {
      this.$router.push({ path: '/recharge', query: this.$route.query });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const params = {
            ...this.loginForm
          };
          if (this.redeemCode) {
            params.redeemCode = this.$route.query.code;
          }
          createCorpAppUrl(params)
            .then(response => {
              const { code = 0, msg = '' } = response;
              this.loading = false;
              // 跳转到智友助手
              // const content = '我们已将平台登录地址和初始密码通过短信发送到您的手机，请及时查收。同时，您现在可体验智友办公助手了。祝您使用愉快！';
              // const title = '恭喜您，注册成功！';
              if (code === 200) {
                // this.open(title, content);
                this.goHandleUrl();
              } else {
                this.$notify.error({
                  title: '错误',
                  message: msg || '系统出现错误',
                });
              }
            })
            .catch(err => {
              this.loading = false;
              console.log('catch ===', err);
            });
        }
      });
    },
    // 模型信息列表
    getModelList() {
      modelInfoListUrl().then(response => {
        const { code = 0, msg = '', rows = [] } = response;
        this.loading = false;
        if (code === 200) {
          this.modelList = rows;
        } else {
          this.$message.error(msg || '系统出现错误');
        }
      });
    },
    goHandleUrl() {
      window.location.href = 'https://zhiyou.farcloud.com/staff';
    },
    open(title, content) {
        this.$confirm(content, title, {
          confirmButtonText: '立即前往',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.goHandleUrl();
        });
    },
    checkCode() {
      checkRedeemCode({
        redeemCode: this.redeemCode,
      }).then(res => {
        const { code = 0, data } = res;
        if (code === 200) {
          if (!data) {
            this.dialogVisible = true;
          }
        }
      });
    },
    goRouter(key) {
      if (key === 0) {
        window.open('https://zhiyou.farcloud.com/admin/login', '_blank');
      }
      if (key === 1) {
        this.goHandleUrl();
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  // background: linear-gradient(to top right, #475b89, #1f3979, #031f5f);
  padding: 15px;
}
.box-card-line{
  height: 1px;
  background: #f3f3f3;
  width: 100%;
}
.box-card {
  width: 100%;
  // margin-bottom: 10px;
  padding: 15px 20px 0 20px;
}
.box-card-mobile{
  width: 100%;
  max-width: 450px;
  margin: auto;
}
.box-card-block{
  padding-top: 30px;
  padding-left: 0;
  padding-right: 0;
}
.title {
  text-align: center;
  color: #707070;
  margin-bottom: 20px;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 100%;
  padding: 25px 5px 5px 5px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  line-height: 25px;
  text-align: center;
  color: #333;
  padding-bottom: 10px;
  // padding: 25px 0;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-header {
  // position: fixed;
  // top: 0;
  width: 100%;
  // padding: 15px;
  background-color: #fff;
}

.logo-img {
  width: 140px;
}

.el-login-footer {
  // height: 40px;
  line-height: 22px;
  // position: fixed;
  // bottom: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-family: Arial;
  font-size: 12px;
  // letter-spacing: 1px;
  white-space: pre-wrap;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.model-title{
  text-align: center;
  color: #707070;
  margin: 0;
  margin-bottom: 10px;
}
.model-list-view {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  // flex-direction: row;
  // justify-content: flex-start;
  // min-height: 120px;
  // flex-wrap: wrap;
}
.model-list-view-mobile{
  width: 80%;
  margin: auto;
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.model-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90px;
  justify-content: center;
  .model-img {
    width: 46px;
    height: 46px;
    border-radius: 6px;
  }
  .model-name{
    font-size: 12px;
    margin-top: 10px;
    color: #666;
  }
}
.model-item-box-mobile{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
  justify-content: center;
  .model-img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
  }
  .model-name{
    font-size: 14px;
    margin-top: 10px;
    color: #666;
  }
}
.redeemCode{
  text-align: center;
  color: #333;
  font-size: 14px;
  margin: 10px 0;
}
.container{
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-top: 80px;
  // height: calc(100vh - 90px);
  // overflow: auto;
}
.watermark{
  position: fixed;
  z-index: 999;
  opacity: 0.03;
  width: 100%;
  transform: translate(245px, 163px) rotate(0deg);
  pointer-events: none;
  bottom: 15%;
  // right: 0;
  left: -15%;
}
.button-phone{
  margin-top: 20px;
  margin-bottom: 0;
}
.dialog-footer{
  display: flex;
  justify-content: space-between;
  div{
    display: inline-block;
  }
}
</style>
