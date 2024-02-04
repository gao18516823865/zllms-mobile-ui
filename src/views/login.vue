<template>
  <div class="login">
    <div class="div-flex div-flex-end">
      <div class="el-login-header">
        <el-image class="logo-img" :src="require('@/assets/logo/logo.png')" fit="contain" />
      </div>
    </div>
    <div class="div-flex div-flex-start">
      <el-card>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h2 class="title-h2">欢迎使用，</h2>
          <h3 class="title">智友聚合大模型平台</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="手机号">
              <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- @keyup.enter.native="handleLogin" -->
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode">
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button :loading="loading" size="medium" type="primary" style="width:100%;background-color: rgb(9, 70, 237);" @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 北京方云科技有限公司 farcloud.com 版权所有 京ICP备2021009355号-3</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  // background-image: url('../assets/image/login-background.jpg');
  // background-size: cover;
  // background: linear-gradient(to top right, #475b89, #1f3979, #031f5f);
}
.title-h2 {
  color: #707070;
}
.title {
  margin: 0px auto 30px auto;
  text-align: left;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
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
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
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
  padding: 15px;
  margin-right: 20%;
}

.logo-img {
  width: 300px;
  height: 85px;
}
.el-login-footer {
  // height: 40px;
  line-height: 22px;
  position: fixed;
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
.div-flex {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div-flex-end {
  justify-content: flex-end;
}
.div-flex-start {
  justify-content: flex-start;
}
</style>
