<template>
  <div class="login">
    <div class="el-login-header">
      <el-image class="logo-img" :src="require('@/assets/logo/logo.png')" fit="cover" />
    </div>
    <div class="box-card">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <!-- <h3 class="title">智友聚合大模型平台</h3> -->
        <!-- <div class="login-tip ">您已获得智友聚合大模型 100 元体验金，现在注册即刻领取，体验GPT4等大模型。</div> -->
        <div v-if="redeemCode" class="redeemCode">兑换码：{{redeemCode}}</div>
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="注册手机号">
            <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 66%" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <span v-if="codeShow" style="color:#409EFF; font-size: 16px; float: right;" @click="getPhoneCode">获取验证码</span>
          <span v-else class="count" style="color:#666; font-size: 14px;  float: right;">{{ count }}秒后重试</span>
        </div>
      </el-form-item> -->
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            兑换
          </el-button>
        </el-form-item>
      </el-form>
      <h3 class="button-tip">您已是平台用户，直接输入手机号即可完成兑换。</h3>
      <div class="box-card-line" />
      <div class="box-card box-card-block">
        <h3 class="model-title">智友聚合大模型服务平台</h3>
        <h5 class="model-title">一次接入，解锁无限创新</h5>
        <div class="model-list-view">
          <div v-for="model in modelList" :key="model.modelName" class="model-item-box">
            <el-image class="model-img" :src="model.modelLogo" fit="cover" />
            <span class="model-name">{{model.modelName}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 北京方云科技有限公司 farcloud.com 版权所有 京ICP备2021009355号-3</span>
    </div>
    <div class="watermark">
      <svg xmlns="http://www.w3.org/2000/svg" class="styles__StyledSVGIconPathComponent-sc-4n1c4t-0 hXuHCJ svg-icon-path-icon fill" viewBox="0 0 48 48" width="295" height="295" fill="none"><defs data-reactroot="" /><g><path d="M42 35H34" stroke="#333" stroke-width="4" stroke-linecap="round" /><path d="M31 42H27" stroke="#333" stroke-width="4" stroke-linecap="round" /><path d="M14 22L8 17H4C4 17 9.486 27 11.9999 27H44L38 22H14Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 22L18.6606 14L16 14L19 22" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M30 27L17.2 39L14 39L18.2667 27" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M32 11C32 12 29 13 29 13L39 13C39 13 41.8855 13 42.7446 10.7143C43.6299 8.35854 42.0442 5 39.0221 5C36 5 36 8 36 8C36 8 34.1454 7.42857 33 8C31.8546 8.57143 32 10 32 11Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></g></svg>
    </div>
  </div>
</template>

<script>
import { smsCodeUrl, redeemRedeemCodeUrlH5 } from '@/api/login';
import { modelInfoListUrl } from '@/api/model/model';
export default {
  name: 'Login',
  data() {
    return {
      codeShow: true,
      count: '',
      timer: null,
      loginForm: {
        phone: '',
        code: '',
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', message: '手机号码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      loading: false,
      redeemCode: '',
      modelList: [],
    };
  },
  created() {
    this.redeemCode = this.$route.query.code || '';
    this.getModelList();
  },
  methods: {
    getPhoneCode() {
      // 获取短信验证码
      const Reg = /^[1][34578][0-9]{9}$/;
      // 正则验证
      if (Reg.test(this.loginForm.phone)) {
        this.$message({
          message: '验证码发送成功',
          type: 'success',
        });
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
        smsCodeUrl(this.loginForm).then(res => {
          console.log(res);
        });
      } else {
        this.$message({
          message: '手机号码格式不正确',
          type: 'warning',
        });
      }
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          redeemRedeemCodeUrlH5({ ...this.loginForm, redeemCode: this.$route.query.code })
            .then(response => {
              const { code = 0, msg = '' } = response;
              this.loading = false;
              if (code === 200) {
                this.$notify({
                  message: '兑换成功',
                  type: 'success',
                  duration: 0,
                });
              } else {
                this.$message.error(msg || '系统出现错误');
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
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  height: 100%;
  background: #ffffff;
  // background: linear-gradient(to top right, #475b89, #1f3979, #031f5f);
}
.title {
  margin: 0px auto 0 auto;
  text-align: center;
  color: #707070;
  padding-bottom: 20px;
}
.button-tip{
  text-align: center;
  color: #6666;
  font-size: 10px;
  margin: 10px 0 30px 0;
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
  font-size: 14px;
  text-align: center;
  color: #333;
  padding: 25px 0;
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

  width: 100%;
  padding: 15px;
}

.logo-img {
  width: 140px;
}

.el-login-footer {
  // height: 40px;
  line-height: 22px;
  // position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-family: Arial;
  font-size: 12px;
  // letter-spacing: 1px;
  white-space: pre-wrap;
  padding-bottom: 10px;
}
.redeemCode{
  text-align: center;
  color: #333;
  font-size: 14px;
  margin: 0 0 10px 0;
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
.box-card-line{
  height: 1px;
  background: #f3f3f3;
  width: 100%;
}
.box-card {
  width: 100%;
  margin-bottom: 10px;
  padding: 15px 20px 0 20px;
}
.box-card-block{
  padding-top: 30px;
  padding-left: 0;
  padding-right: 0;
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
.model-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90px;
  justify-content: center;
}
.model-title{
  text-align: center;
  color: #707070;
  margin: 0;
  margin-bottom: 10px;
}
</style>
